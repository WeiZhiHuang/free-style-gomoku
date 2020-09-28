const io = require('socket.io-client');

const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const { reduce, max, random, map } = require('lodash');


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
    this.learningRate = 0.01;
    this.discountFactor = 0.9;
    this.qTable = new Proxy({}, {
      get: async (_, property) => reduce(await client.hgetall(property), (acc, cur, i) => {
        acc[i] = ~~cur;
        return acc;
      }, Array(actions).fill(0))
    });
  }

  async learn(state, action, reward, nextState) {
    const currQ = (await this.qTable[state])[action];
    const nextQ = reward + this.discountFactor * max(await this.qTable[nextState]);
    const newQ = currQ + this.learningRate * (nextQ - currQ);
    if (newQ) client.hset(state, action, newQ);
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

      let state, action, nextState;
      socket.on('ur turn', async () => {
        if (state) agent.learn(state, action, 0, nextState);

        state = `${board.getTable()}:${order}`;
        do {
          action = await agent.getAction(state);
          realAction = [~~(action / grids[0]), action % grids[0]];
          nextState = `${board.getNextTable(realAction, order)}:${order}`;
        } while (nextState.length === 2);

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
          agent.learn(state, action, result - 1 === order ? 1000 : -1000, nextState);
      });
    });
  });
}, process.argv[4] || 50);
