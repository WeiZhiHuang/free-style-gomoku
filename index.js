const serve = require('koa-static');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server, {});

const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const { random, compact, flatten } = require('lodash');


router.get('/q-table/:key', async ctx => {
  ctx.body = await client.get(ctx.params.key);
});

router.post('/q-table/:key', async ctx => {
  ctx.body = await client.set(ctx.params.key, JSON.stringify(ctx.request.body.value));
});

app
  .use(serve('dist/'))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());


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

const pvp = io.of('/player');
const serv = io.of(/^\/server\/*/);
// const ql = io.of('/q-learning');


const tables = {};
const orders = {};
const queue = new Proxy({}, {
  get: (target, property) => target[property] || [],
});

pvp.on('connection', socket => {
  const { grids } = socket.handshake.query;
  const [X, Y] = grids.split(',').map(val => ~~val);
  const { id } = socket;
  const pair = [id];
  let playerId = null;

  if (queue[grids].length) {
    playerId = queue[grids].shift();
    pair[random() ? 'push' : 'unshift'](playerId);
    socket.emit('found', id !== pair[0]);
    socket.to(playerId).emit('found', id === pair[0], id);
    socket.join(playerId);
    tables[playerId] = [...Array(X)].map((_, i) => new Proxy([], {
      get: (target, property) => target[property] || 0,
      set: (target, property, value) => {
        target[property] = value;
        pvp.in(playerId).emit('place', [i, ~~property], (value - 1) ^ 1);
        return true;
      }
    }));
    orders[playerId] = 1;
  } else queue[grids] = [id];

  socket.on('found pong', (id, order) => order ? pair.unshift(id) : pair.push(id));

  socket.on('place', ([i, j]) => {
    const room = playerId || id;
    const last = orders[room];
    let result;

    if (id !== pair[last] && tables[room] && !tables[room][i][j]) {
      tables[room][i][j] = (last ^ 1) + 1;

      if (result = judge([X, Y], tables[room])) {
        pvp.in(room).emit('over', result);
        socket.disconnect();
        delete tables[room];
      } else {
        orders[room] = last ^ 1;
        socket.to(room).emit('ur turn');
      }
    }
  });
});

serv.on('connection', socket => {
  const { grids } = socket.handshake.query;
  const [X, Y] = grids.split(',').map(val => ~~val);
  const table = [...Array(X)].map((_, i) => new Proxy([], {
    get: (target, property) => target[property] || 0,
    set: (target, property, value) => {
      target[property] = value;
      socket.emit('place', [i, ~~property], (value - 1) ^ 1);
      return true;
    }
  }));
  const isFirst = !random();

  socket.emit('found', ~~isFirst);

  if (isFirst) table[~~(X / 2)][~~(Y / 2)] = 1;
  socket.emit('ur turn');

  socket.on('place', ([i, j]) => {
    let win;

    if (!table[i][j]) {
      table[i][j] = !(isFirst ^ 1) + 1;

      if (win = judge([X, Y], table)) {
        socket.emit('over', win);
        socket.disconnect();
        return;
      }

      let x = ~~(X / 2), y = ~~(Y / 2);
      switch (socket.nsp.name.split('/')[2]) {
        case 'random':
          do {
            x = random(X - 1);
            y = random(Y - 1);
          }
          while (table[x][y]);
          break;
        case 'decision-tree':
          [x, y] = require('./decision-tree')(i, j, x, y, table, isFirst);
          break;
      }
      table[x][y] = (isFirst ^ 1) + 1;

      if (win = judge([X, Y], table)) {
        socket.emit('over', win);
        socket.disconnect();
        return;
      }

      socket.emit('ur turn');
    }
  });
});


server.listen(3000);
