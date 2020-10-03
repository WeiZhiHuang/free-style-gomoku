const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const { random, compact, reduce, max, flatten, map, toNumber } = require('lodash');


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
    this.actions = actions
    this.learningRate = 0.01;
    this.discountFactor = 0.9;
    this.epsilon = 0.1;
    this.qTable = new Proxy({}, {
      get: async (_, property) => reduce(await client.hgetall(property), (acc, cur, i) => {
        acc[i] = toNumber(cur);
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
    return random(true) < this.epsilon ? random(this.actions - 1) : this.argMax(await this.qTable[state]);
  }

  argMax(stateAction) {
    const maxQ = max(stateAction);
    const maxIndexes = reduce(stateAction, (acc, cur, i) => cur === maxQ ? [...acc, i] : acc);
    return maxIndexes[random(maxIndexes.length - 1)];
  }
}


const judge = ([x, y], table) => {
  let result = 0;
  for (let i = 0; i < x && !result; ++i)
    for (let j = 0; j < y && !result; ++j)
      if (table[i][j])
        if (i < x - 4 && table[i][j] === table[i + 1][j] && table[i][j] === table[i + 2][j] && table[i][j] === table[i + 3][j] && table[i][j] === table[i + 4][j]) result = table[i][j];
        else if (j < y - 4 && table[i][j] === table[i][j + 1] && table[i][j] === table[i][j + 2] && table[i][j] === table[i][j + 3] && table[i][j] === table[i][j + 4]) result = table[i][j];
        else if (i < x - 4 && j < y - 4 && table[i][j] === table[i + 1][j + 1] && table[i][j] === table[i + 2][j + 2] && table[i][j] === table[i + 3][j + 3] && table[i][j] === table[i + 4][j + 4]) result = table[i][j];
        else if (i < x - 4 && j > 4 && table[i][j] === table[i + 1][j - 1] && table[i][j] === table[i + 2][j - 2] && table[i][j] === table[i + 3][j - 3] && table[i][j] === table[i + 4][j - 4]) result = table[i][j];

  return result || (compact(flatten(table)).length === x * y ? -1 : 0);
}


const scoreboard = { 'WIN(S)': 0, 'LOSS(ES)': 0, 'TIE(S)': 0, SUM: 0, 'WIN/(SUM-TIE(S))': NaN };
const grids = process.argv[2].split('x').map(val => ~~val);
const agent = new QLearningAgent(grids[0] * grids[1]);

(async () => {
  while (1) {
    const board = new Board(grids);
    const order = random();
    if (order) board.place(grids.map(val => random(val - 1)), 1);

    let state, action, nextState, end;
    while (!end) {
      if (state) agent.learn(state, action, 0, nextState);

      state = `${board.getTable()}:${order}`;
      do {
        action = await agent.getAction(state);
        realAction = [~~(action / grids[0]), action % grids[0]];
        nextState = `${board.getNextTable(realAction, order)}:${order}`;
      } while (nextState.length === 2);

      board.place(realAction, !order);

      let result;
      if (result = judge(grids, board.getTable())) {
        end = true;

        ++scoreboard.SUM;
        if (result === -1) ++scoreboard['TIE(S)'];
        else {
          agent.learn(state, action, result - 1 === order ? 1000 : -1000, nextState);
          ++scoreboard[order + 1 === result ? 'WIN(S)' : 'LOSS(ES)'];
        }

        scoreboard['WIN/(SUM-TIE(S))'] = `${scoreboard['WIN(S)'] / (scoreboard['SUM'] - scoreboard['TIE(S)'])}`.slice(0, 6);
        continue;
      }

      let x, y;
      do {
        x = random(grids[0] - 1);
        y = random(grids[1] - 1);
      }
      while (board.getTable()[x][y]);
      board.place([x, y], order);

      if (result = judge(grids, board.getTable())) {
        end = true;

        ++scoreboard.SUM;
        if (result === -1) ++scoreboard['TIE(S)'];
        else {
          agent.learn(state, action, result - 1 === order ? 1000 : -1000, nextState);
          ++scoreboard[order + 1 === result ? 'WIN(S)' : 'LOSS(ES)'];
        }

        scoreboard['WIN/(SUM-TIE(S))'] = `${scoreboard['WIN(S)'] / (scoreboard['SUM'] - scoreboard['TIE(S)'])}`.slice(0, 6);
      }
    }
    console.clear();
    console.log(map(scoreboard, (value, key) => `${key}: ${value}`).join(', '));
  }
})();
