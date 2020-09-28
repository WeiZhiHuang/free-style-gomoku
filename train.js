const io = require('socket.io-client');

const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const { max, reduce, random, flatten, map } = require('lodash');


class Board {
  constructor([boardX, boardY]) {
    this.table = [...Array(boardX)].map(() => Array(boardY).fill(0));
  }

  place([i, j], isFirst) {
    this.table[i][j] = (isFirst ^ 1) + 1;
  }

  getTable() {
    return this.table;
  }

  getNextTable([i, j], order) {
    if (this.table[i][j]) return [];
    const nextTable = JSON.parse(JSON.stringify(this.table));
    nextTable[i][j] = order + 1;
    return nextTable;
  }
}

class QLearningAgent {
  constructor(actions) {
    this.learningRate = 0.1;
    this.discountFactor = 0.7;
    this.qTable = new Proxy({}, {
      get: (_, property) => reduce(client.hgetall(property), (acc, cur, i) => {
        acc[i] = ~~cur;
        return acc;
      }, Array(actions).fill(0))
    });
  }

  async learn(state, action, reward, nextState) {
    const currentQ = (await this.qTable[state])[action];
    const newQ = reward + this.discountFactor * max(await this.qTable[nextState]);
    client.hset([state.toString(), action, currentQ + this.learningRate * (newQ - currentQ)]);
  }

  async getAction(state) {
    return this.argMax(await this.qTable[state]);
  }

  argMax(stateAction) {
    const maxQ = max(stateAction);
    const maxIndexes = reduce(stateAction, (acc, cur, i) => {
      if (cur === maxQ) acc.push(i);
      return acc;
    }, []);
    return maxIndexes[random(maxIndexes.length - 1)];
  }

  getQTable(state) {
    return this.qTable[state];
  }
}


const scoreboard = { 'WIN(S)': 0, 'LOSS(ES)': 0, 'TIE(S)': 0, SUM: 0 };
const grids = process.argv[2].split('x').map(val => ~~val);
const agent = new QLearningAgent(grids[0] * grids[1]);
setInterval(() => {
  const socket = io(`http://localhost:3000/server/${process.argv[3]}`, { query: { grids } });

  socket.on('connect', () => {
    socket.on('found', (order, id) => {
      const board = new Board(grids, order);

      if (id) socket.emit('found pong', id, order);
      if (!order) socket.emit('place', grids.map(val => ~~(val / 2)));

      socket.on('place', (pos, isFirst) => board.place(pos, isFirst));

      let lastState, lastAction;
      socket.on('ur turn', async () => {
        const state = [order, ...flatten(board.getTable())];

        if (lastState)
          await agent.learn(lastState, lastAction, 0, state);

        let action, realAction, nextState;
        do {
          action = await agent.getAction(state);
          realAction = [(action - action % grids[0]) / grids[0], action % grids[0]];
          nextState = flatten(board.getNextTable(realAction, order));
        } while (!nextState.length);

        lastState = state;
        lastAction = action;

        socket.emit('place', realAction);
      });

      socket.on('over', result => {
        socket.close();

        ++scoreboard.SUM;
        switch (result) {
          case -1:
            ++scoreboard['TIE(S)'];
            break;
          case 1:
          case 2:
            ++scoreboard[order + 1 === result ? 'WIN(S)' : 'LOSS(ES)'];
            break;
        }

        console.clear();
        console.log(map(scoreboard, (value, key) => `${key}: ${value}`).join(', '));

        if (result > 0)
          agent.learn(lastState, lastAction, result - 1 === lastState[0] ? 1000 : -1000, [lastState[0], ...board.getTable()]);
      });
    });
  });
}, process.argv[4] || 50);
