/*
The code below is out of date
and may do some unnecessary steps,
but I don't want to fix it anymore.
*/
module.exports = (inx, iny, lastx, lasty, ChessSpace, isFirst) => {
  var x = 5;
  var y = 5;
  var srcnt = 0;
  var insure = 0;
  var dh3 = 0;
  while (ChessSpace[x][y] != 0) {
    if (srcnt < 100) {
      x = lastx - 1 + Math.floor(Math.random() * 100 % 3);
      y = lasty - 1 + Math.floor(Math.random() * 100 % 3);
    }
    else if (srcnt < 200) {
      x = inx - 1 + Math.floor(Math.random() * 100 % 3);
      y = iny - 1 + Math.floor(Math.random() * 100 % 3);
    }
    else if (srcnt < 300) {
      x = lastx - 2 + Math.floor(Math.random() * 100 % 5);
      y = lasty - 2 + Math.floor(Math.random() * 100 % 5);
    }
    else if (srcnt < 450) {
      x = inx - 2 + Math.floor(Math.random() * 100 % 5);
      y = iny - 2 + Math.floor(Math.random() * 100 % 5);
    }
    else if (srcnt < 600) {
      x = lastx - 3 + Math.floor(Math.random() * 100 % 6);
      y = lasty - 3 + Math.floor(Math.random() * 100 % 6);
    }
    else if (srcnt < 800) {
      x = inx - 3 + Math.floor(Math.random() * 100 % 6);
      y = iny - 3 + Math.floor(Math.random() * 100 % 6);
    }
    else {
      x = Math.floor(Math.random() * 100 % 11);
      y = Math.floor(Math.random() * 100 % 11);
    }
    srcnt++;
    if ((x < 1 || y < 1 || x > 9 || y > 9) && srcnt < 1000) x = 5, y = 5;
  }

  //基本攻守(連3+)
  for (var i = 1; i < 11; i++) {
    for (var j = 1; j < 11; j++) {
      if (ChessSpace[i][j] == (isFirst ^ 1) + 1) {
        if (i < 9 && ChessSpace[i + 1][j] == (isFirst ^ 1) + 1 && ChessSpace[i + 2][j] == 0) x = i + 2, y = j;
        if (i > 1 && ChessSpace[i - 1][j] == (isFirst ^ 1) + 1 && ChessSpace[i - 2][j] == 0) x = i - 2, y = j;
        if (j < 9 && ChessSpace[i][j + 1] == (isFirst ^ 1) + 1 && ChessSpace[i][j + 2] == 0) x = i, y = j + 2;
        if (j > 1 && ChessSpace[i][j - 1] == (isFirst ^ 1) + 1 && ChessSpace[i][j - 2] == 0) x = i, y = j - 2;
        if (i < 9 && j < 9 && ChessSpace[i + 1][j + 1] == (isFirst ^ 1) + 1 && ChessSpace[i + 2][j + 2] == 0) x = i + 2, y = j + 2;
        if (i > 1 && j > 1 && ChessSpace[i - 1][j - 1] == (isFirst ^ 1) + 1 && ChessSpace[i - 2][j - 2] == 0) x = i - 2, y = j - 2;
        if (i < 9 && j > 1 && ChessSpace[i + 1][j - 1] == (isFirst ^ 1) + 1 && ChessSpace[i + 2][j - 2] == 0) x = i + 2, y = j - 2;
        if (i > 1 && j < 9 && ChessSpace[i - 1][j + 1] == (isFirst ^ 1) + 1 && ChessSpace[i - 2][j + 2] == 0) x = i - 2, y = j + 2;
      }
    }
  }
  for (var i = 1; i < 11; i++) {
    for (var j = 1; j < 11; j++) {
      if (ChessSpace[i][j] == isFirst + 1) {
        if (i < 9 && ChessSpace[i + 1][j] == isFirst + 1 && ChessSpace[i + 2][j] == 0) x = i + 2, y = j;
        if (i > 1 && ChessSpace[i - 1][j] == isFirst + 1 && ChessSpace[i - 2][j] == 0) x = i - 2, y = j;
        if (j < 9 && ChessSpace[i][j + 1] == isFirst + 1 && ChessSpace[i][j + 2] == 0) x = i, y = j + 2;
        if (j > 1 && ChessSpace[i][j - 1] == isFirst + 1 && ChessSpace[i][j - 2] == 0) x = i, y = j - 2;
        if (i < 9 && j < 9 && ChessSpace[i + 1][j + 1] == isFirst + 1 && ChessSpace[i + 2][j + 2] == 0) x = i + 2, y = j + 2;
        if (i > 1 && j > 1 && ChessSpace[i - 1][j - 1] == isFirst + 1 && ChessSpace[i - 2][j - 2] == 0) x = i - 2, y = j - 2;
        if (i < 9 && j > 1 && ChessSpace[i + 1][j - 1] == isFirst + 1 && ChessSpace[i + 2][j - 2] == 0) x = i + 2, y = j - 2;
        if (i > 1 && j < 9 && ChessSpace[i - 1][j + 1] == isFirst + 1 && ChessSpace[i - 2][j + 2] == 0) x = i - 2, y = j + 2;
      }
    }
  }

  //水平
  if (inx <= 7) if (ChessSpace[inx + 1][iny] == (isFirst ^ 1) + 1 && ChessSpace[inx + 2][iny] == (isFirst ^ 1) + 1 && ChessSpace[inx + 3][iny] == 0) x = inx + 3, y = iny;
  if (inx <= 8 && inx >= 1) if (ChessSpace[inx + 1][iny] == (isFirst ^ 1) + 1 && ChessSpace[inx + 2][iny] == (isFirst ^ 1) + 1 && ChessSpace[inx - 1][iny] == 0) x = inx - 1, y = iny;
  if (inx >= 3) if (ChessSpace[inx - 1][iny] == (isFirst ^ 1) + 1 && ChessSpace[inx - 2][iny] == (isFirst ^ 1) + 1 && ChessSpace[inx - 3][iny] == 0) x = inx - 3, y = iny;
  if (inx <= 9 && inx >= 2) if (ChessSpace[inx - 1][iny] == (isFirst ^ 1) + 1 && ChessSpace[inx - 2][iny] == (isFirst ^ 1) + 1 && ChessSpace[inx + 1][iny] == 0) x = inx + 1, y = iny;
  if (inx <= 8) if (ChessSpace[inx + 1][iny] == 0 && ChessSpace[inx + 2][iny] == (isFirst ^ 1) + 1) x = inx + 1, y = iny;
  if (inx >= 2) if (ChessSpace[inx - 1][iny] == 0 && ChessSpace[inx - 2][iny] == (isFirst ^ 1) + 1) x = inx - 1, y = iny;
  //垂直
  if (iny <= 7) if (ChessSpace[inx][iny + 1] == (isFirst ^ 1) + 1 && ChessSpace[inx][iny + 2] == (isFirst ^ 1) + 1 && ChessSpace[inx][iny + 3] == 0) x = inx, y = iny + 3;
  if (iny <= 8 && iny >= 1) if (ChessSpace[inx][iny + 1] == (isFirst ^ 1) + 1 && ChessSpace[inx][iny + 2] == (isFirst ^ 1) + 1 && ChessSpace[inx][iny - 1] == 0) x = inx, y = iny - 1;
  if (iny >= 3) if (ChessSpace[inx][iny - 1] == (isFirst ^ 1) + 1 && ChessSpace[inx][iny - 2] == (isFirst ^ 1) + 1 && ChessSpace[inx][iny - 3] == 0) x = inx, y = iny - 3;
  if (iny <= 9 && iny >= 2) if (ChessSpace[inx][iny - 1] == (isFirst ^ 1) + 1 && ChessSpace[inx][iny - 2] == (isFirst ^ 1) + 1 && ChessSpace[inx][iny + 1] == 0) x = inx, y = iny + 1;
  if (iny <= 8) if (ChessSpace[inx][iny + 1] == 0 && ChessSpace[inx][iny + 2] == (isFirst ^ 1) + 1) x = inx, y = iny + 1;
  if (iny >= 2) if (ChessSpace[inx][iny - 1] == 0 && ChessSpace[inx][iny - 2] == (isFirst ^ 1) + 1) x = inx, y = iny - 1;
  //右斜
  if (inx <= 7 && iny <= 7) if (ChessSpace[inx + 1][iny + 1] == (isFirst ^ 1) + 1 && ChessSpace[inx + 2][iny + 2] == (isFirst ^ 1) + 1 && ChessSpace[inx + 3][iny + 3] == 0) x = inx + 3, y = iny + 3;
  if (inx <= 8 && inx >= 1 && iny <= 8 && iny >= 1) if (ChessSpace[inx + 1][iny + 1] == (isFirst ^ 1) + 1 && ChessSpace[inx + 2][iny + 2] == (isFirst ^ 1) + 1 && ChessSpace[inx - 1][iny - 1] == 0) x = inx - 1, y = iny - 1;
  if (inx >= 3 && iny >= 3) if (ChessSpace[inx - 1][iny - 1] == (isFirst ^ 1) + 1 && ChessSpace[inx - 2][iny - 2] == (isFirst ^ 1) + 1 && ChessSpace[inx - 3][iny - 3] == 0) x = inx - 3, y = iny - 3;
  if (inx <= 9 && inx >= 2 && iny <= 9 && iny >= 2) if (ChessSpace[inx - 1][iny - 1] == (isFirst ^ 1) + 1 && ChessSpace[inx - 2][iny - 2] == (isFirst ^ 1) + 1 && ChessSpace[inx + 1][iny + 1] == 0) x = inx + 1, y = iny + 1;
  if (inx <= 8 && iny <= 8) if (ChessSpace[inx + 1][iny + 1] == 0 && ChessSpace[inx + 2][iny + 2] == (isFirst ^ 1) + 1) x = inx + 1, y = iny + 1;
  if (inx >= 2 && iny >= 2) if (ChessSpace[inx - 1][iny - 1] == 0 && ChessSpace[inx - 2][iny - 2] == (isFirst ^ 1) + 1) x = inx - 1, y = iny - 1;
  //左斜
  if (inx >= 3 && iny <= 7) if (ChessSpace[inx - 1][iny + 1] == (isFirst ^ 1) + 1 && ChessSpace[inx - 2][iny + 2] == (isFirst ^ 1) + 1 && ChessSpace[inx - 3][iny + 3] == 0) x = inx - 3, y = iny + 3;
  if (inx <= 9 && inx >= 2 && iny <= 8 && iny >= 1) if (ChessSpace[inx - 1][iny + 1] == (isFirst ^ 1) + 1 && ChessSpace[inx - 2][iny + 2] == (isFirst ^ 1) + 1 && ChessSpace[inx + 1][iny - 1] == 0) x = inx + 1, y = iny - 1;
  if (inx <= 7 && iny >= 3) if (ChessSpace[inx + 1][iny - 1] == (isFirst ^ 1) + 1 && ChessSpace[inx + 2][iny - 2] == (isFirst ^ 1) + 1 && ChessSpace[inx + 3][iny - 3] == 0) x = inx + 3, y = iny - 3;
  if (inx <= 8 && inx >= 1 && iny <= 9 && iny >= 2) if (ChessSpace[inx + 1][iny - 1] == (isFirst ^ 1) + 1 && ChessSpace[inx + 2][iny - 2] == (isFirst ^ 1) + 1 && ChessSpace[inx - 1][iny + 1] == 0) x = inx - 1, y = iny + 1;
  if (inx >= 2 && iny <= 8) if (ChessSpace[inx - 1][iny + 1] == 0 && ChessSpace[inx - 2][iny + 2] == (isFirst ^ 1) + 1) x = inx - 1, y = iny + 1;
  if (inx <= 8 && iny >= 2) if (ChessSpace[inx + 1][iny - 1] == 0 && ChessSpace[inx + 2][iny - 2] == (isFirst ^ 1) + 1) x = inx + 1, y = iny - 1;

  //雙活3
  for (var i = 3; i < 8; i++) {
    for (var j = 3; j < 8; j++) {
      if (ChessSpace[i][j] == 0) {
        if (ChessSpace[i - 1][j - 1] != 0 && ChessSpace[i - 1][j - 1] == ChessSpace[i - 2][j - 2]) dh3++;
        if (ChessSpace[i][j - 1] != 0 && ChessSpace[i][j - 1] == ChessSpace[i][j - 2]) dh3++;
        if (ChessSpace[i + 1][j - 1] != 0 && ChessSpace[i + 1][j - 1] == ChessSpace[i + 2][j - 2]) dh3++;
        if (ChessSpace[i + 1][j] != 0 && ChessSpace[i + 1][j] == ChessSpace[i + 2][j]) dh3++;
        if (ChessSpace[i + 1][j + 1] != 0 && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2]) dh3++;
        if (ChessSpace[i][j + 1] != 0 && ChessSpace[i][j + 1] == ChessSpace[i][j + 2]) dh3++;
        if (ChessSpace[i - 1][j + 1] != 0 && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2]) dh3++;
        if (ChessSpace[i - 1][j] != 0 && ChessSpace[i - 1][j] == ChessSpace[i - 2][j]) dh3++;
        if (dh3 >= 2) x = i, y = j;
      }
      dh3 = 0;
    }
  }

  //3子攻守
  for (var i = 1; i < 11; i++) {
    for (var j = 1; j < 11; j++) {
      if (ChessSpace[i][j] == (isFirst ^ 1) + 1) {
        if (insure == 0 && i < 8 && ChessSpace[i][j] == ChessSpace[i + 1][j] && ChessSpace[i + 1][j] == ChessSpace[i + 2][j] && ChessSpace[i + 3][j] == 0) {
          x = i + 3, y = j;
          if (i > 0 && ChessSpace[i - 1][j] == 0) insure = 1;
        }
        if (insure == 0 && j < 8 && ChessSpace[i][j] == ChessSpace[i][j + 1] && ChessSpace[i][j + 1] == ChessSpace[i][j + 2] && ChessSpace[i][j + 3] == 0) {
          x = i, y = j + 3;
          if (j > 0 && ChessSpace[i][j - 1] == 0) insure = 1;
        }
        if (insure == 0 && i < 8 && j < 8 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 3][j + 3] == 0) {
          x = i + 3, y = j + 3;
          if (i > 0 && j > 0 && ChessSpace[i - 1][j - 1] == 0) insure = 1;
        }
        if (insure == 0 && i > 2 && j < 8 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 3][j + 3] == 0) {
          x = i - 3, y = j + 3;
          if (i < 10 && j > 0 && ChessSpace[i + 1][j - 1]) insure = 1;
        }
        if (insure == 0 && i < 8 && ChessSpace[i][j] == ChessSpace[i + 1][j] && ChessSpace[i + 1][j] == ChessSpace[i + 3][j] && ChessSpace[i + 2][j] == 0) {
          x = i + 2, y = j;
          if (i > 0 && ChessSpace[i - 1][j] == 0) insure = 1;
        }
        if (insure == 0 && j < 8 && ChessSpace[i][j] == ChessSpace[i][j + 1] && ChessSpace[i][j + 1] == ChessSpace[i][j + 3] && ChessSpace[i][j + 2] == 0) {
          x = i, y = j + 2;
          if (j > 0 && ChessSpace[i][j - 1] == 0) insure = 1;
        }
        if (insure == 0 && i < 8 && j < 8 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 3][j + 3] && ChessSpace[i + 2][j + 2] == 0) {
          x = i + 2, y = j + 2;
          if (i > 0 && j > 0 && ChessSpace[i - 1][j - 1] == 0) insure = 1;
        }
        if (insure == 0 && i > 2 && j < 8 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 3][j + 3] && ChessSpace[i - 2][j + 2] == 0) {
          x = i - 2, y = j + 2;
          if (i < 10 && j > 0 && ChessSpace[i + 1][j - 1]) insure = 1;
        }
      }

      //雙活3
      if (ChessSpace[i][j] == 0 && insure == 0 && i > 1 && i < 9 && j > 1 && j < 9) {
        if (ChessSpace[i - 1][j] != 0 && ChessSpace[i - 1][j] == ChessSpace[i + 1][j] && ChessSpace[i][j - 1] != 0 && ChessSpace[i][j - 1] == ChessSpace[i][j + 1]) {
          x = i, y = j;
          if (ChessSpace[i - 2][j] == 0 && ChessSpace[i - 2][j] == ChessSpace[i + 2][j] && ChessSpace[i][j - 2] == 0 && ChessSpace[i][j - 2] == ChessSpace[i][j + 2]) insure = 1;
        }
        if (ChessSpace[i - 1][j - 1] != 0 && ChessSpace[i - 1][j - 1] == ChessSpace[i + 1][j + 1] && ChessSpace[i - 1][j + 1] != 0 && ChessSpace[i - 1][j + 1] == ChessSpace[i + 1][j - 1]) {
          x = i, y = j;
          if (ChessSpace[i - 2][j - 2] == 0 && ChessSpace[i - 2][j - 2] == ChessSpace[i + 2][j + 2] && ChessSpace[i - 2][j + 2] == 0 && ChessSpace[i - 2][j + 2] == ChessSpace[i + 2][j - 2]) insure = 1;
        }
      }

      if (ChessSpace[i][j] == isFirst + 1) {
        if (i < 8 && ChessSpace[i][j] == ChessSpace[i + 1][j] && ChessSpace[i + 1][j] == ChessSpace[i + 2][j] && ChessSpace[i + 3][j] == 0) {
          if (insure == 0) x = i + 3, y = j;
          if (i > 0 && ChessSpace[i - 1][j] == 0) x = i + 3, y = j, insure = 2;
        }
        if (j < 8 && ChessSpace[i][j] == ChessSpace[i][j + 1] && ChessSpace[i][j + 1] == ChessSpace[i][j + 2] && ChessSpace[i][j + 3] == 0) {
          if (insure == 0) x = i, y = j + 3;
          if (j > 0 && ChessSpace[i][j - 1] == 0) x = i, y = j + 3, insure = 2;
        }
        if (i < 8 && j < 8 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 3][j + 3] == 0) {
          if (insure == 0) x = i + 3, y = j + 3;
          if (i > 0 && j > 0 && ChessSpace[i - 1][j - 1] == 0) x = i + 3, y = j + 3, insure = 2;
        }
        if (i > 2 && j < 8 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 3][j + 3] == 0) {
          if (insure == 0) x = i - 3, y = j + 3;
          if (i < 10 && j > 0 && ChessSpace[i + 1][j - 1] == 0) x = i - 3, y = j + 3, insure = 2;
        }
        if (insure == 0 && i < 8 && ChessSpace[i][j] == ChessSpace[i + 1][j] && ChessSpace[i + 1][j] == ChessSpace[i + 3][j] && ChessSpace[i + 2][j] == 0) x = i + 2, y = j;
        if (insure == 0 && j < 8 && ChessSpace[i][j] == ChessSpace[i][j + 1] && ChessSpace[i][j + 1] == ChessSpace[i][j + 3] && ChessSpace[i][j + 2] == 0) x = i, y = j + 2;
        if (insure == 0 && i < 8 && j < 8 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 3][j + 3] && ChessSpace[i + 2][j + 2] == 0) x = i + 2, y = j + 2;
        if (insure == 0 && i > 2 && j < 8 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 3][j + 3] && ChessSpace[i - 2][j + 2] == 0) x = i - 2, y = j + 2;
      }
      if (insure > 0) break;
    }
    if (insure > 0) {
      insure = 0;
      break;
    }
  }

  //4子攻守
  for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
      if (ChessSpace[i][j] == isFirst + 1) {
        if (i < 7 && ChessSpace[i][j] == ChessSpace[i + 1][j] && ChessSpace[i + 1][j] == ChessSpace[i + 2][j] && ChessSpace[i + 2][j] == ChessSpace[i + 3][j] && ChessSpace[i + 4][j] == 0) x = i + 4, y = j, insure = 1;
        if (i > 3 && ChessSpace[i][j] == ChessSpace[i - 1][j] && ChessSpace[i - 1][j] == ChessSpace[i - 2][j] && ChessSpace[i - 2][j] == ChessSpace[i - 3][j] && ChessSpace[i - 4][j] == 0) x = i - 4, y = j, insure = 1;
        if (j < 7 && ChessSpace[i][j] == ChessSpace[i][j + 1] && ChessSpace[i][j + 1] == ChessSpace[i][j + 2] && ChessSpace[i][j + 2] == ChessSpace[i][j + 3] && ChessSpace[i][j + 4] == 0) x = i, y = j + 4, insure = 1;
        if (j > 3 && ChessSpace[i][j] == ChessSpace[i][j - 1] && ChessSpace[i][j - 1] == ChessSpace[i][j - 2] && ChessSpace[i][j - 2] == ChessSpace[i][j - 3] && ChessSpace[i][j - 4] == 0) x = i, y = j - 4, insure = 1;
        if (i < 7 && j < 7 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 2][j + 2] == ChessSpace[i + 3][j + 3] && ChessSpace[i + 4][j + 4] == 0) x = i + 4, y = j + 4, insure = 1;
        if (i < 8 && j < 8 && i > 0 && j > 0 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 2][j + 2] == ChessSpace[i + 3][j + 3] && ChessSpace[i - 1][j - 1] == 0) x = i - 1, y = j - 1, insure = 1;
        if (i > 3 && j < 7 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 2][j + 2] == ChessSpace[i - 3][j + 3] && ChessSpace[i - 4][j + 4] == 0) x = i - 4, y = j + 4, insure = 1;
        if (i > 2 && j < 8 && i < 10 && j > 0 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 2][j + 2] == ChessSpace[i - 3][j + 3] && ChessSpace[i + 1][j - 1] == 0) x = i + 1, y = j - 1, insure = 1;
        //跳4
        if (i < 7 && ChessSpace[i][j] == ChessSpace[i + 1][j] && ChessSpace[i + 1][j] == ChessSpace[i + 2][j] && ChessSpace[i + 2][j] == ChessSpace[i + 4][j] && ChessSpace[i + 3][j] == 0) x = i + 3, y = j, insure = 1;
        if (i > 3 && ChessSpace[i][j] == ChessSpace[i - 1][j] && ChessSpace[i - 1][j] == ChessSpace[i - 2][j] && ChessSpace[i - 2][j] == ChessSpace[i - 4][j] && ChessSpace[i - 3][j] == 0) x = i - 3, y = j, insure = 1;
        if (j < 7 && ChessSpace[i][j] == ChessSpace[i][j + 1] && ChessSpace[i][j + 1] == ChessSpace[i][j + 2] && ChessSpace[i][j + 2] == ChessSpace[i][j + 4] && ChessSpace[i][j + 3] == 0) x = i, y = j + 3, insure = 1;
        if (j > 3 && ChessSpace[i][j] == ChessSpace[i][j - 1] && ChessSpace[i][j - 1] == ChessSpace[i][j - 2] && ChessSpace[i][j - 2] == ChessSpace[i][j - 4] && ChessSpace[i][j - 3] == 0) x = i, y = j - 3, insure = 1;
        if (i < 7 && j < 7 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 2][j + 2] == ChessSpace[i + 4][j + 4] && ChessSpace[i + 3][j + 3] == 0) x = i + 3, y = j + 3, insure = 1;
        if (i < 9 && j < 9 && i > 1 && j > 1 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 2][j + 2] == ChessSpace[i - 2][j - 2] && ChessSpace[i - 1][j - 1] == 0) x = i - 1, y = j - 1, insure = 1;
        if (i > 3 && j < 7 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 2][j + 2] == ChessSpace[i - 4][j + 4] && ChessSpace[i - 3][j + 3] == 0) x = i - 3, y = j + 3, insure = 1;
        if (i > 1 && j < 9 && i < 9 && j > 1 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 2][j + 2] == ChessSpace[i + 2][j - 2] && ChessSpace[i + 1][j - 1] == 0) x = i + 1, y = j - 1, insure = 1;
      }
      else if (ChessSpace[i][j] == (isFirst ^ 1) + 1) {
        if (i < 7 && ChessSpace[i][j] == ChessSpace[i + 1][j] && ChessSpace[i + 1][j] == ChessSpace[i + 2][j] && ChessSpace[i + 2][j] == ChessSpace[i + 3][j] && ChessSpace[i + 4][j] == 0) x = i + 4, y = j;
        if (i > 3 && ChessSpace[i][j] == ChessSpace[i - 1][j] && ChessSpace[i - 1][j] == ChessSpace[i - 2][j] && ChessSpace[i - 2][j] == ChessSpace[i - 3][j] && ChessSpace[i - 4][j] == 0) x = i - 4, y = j;
        if (j < 7 && ChessSpace[i][j] == ChessSpace[i][j + 1] && ChessSpace[i][j + 1] == ChessSpace[i][j + 2] && ChessSpace[i][j + 2] == ChessSpace[i][j + 3] && ChessSpace[i][j + 4] == 0) x = i, y = j + 4;
        if (j > 3 && ChessSpace[i][j] == ChessSpace[i][j - 1] && ChessSpace[i][j - 1] == ChessSpace[i][j - 2] && ChessSpace[i][j - 2] == ChessSpace[i][j - 3] && ChessSpace[i][j - 4] == 0) x = i, y = j - 4;
        if (i < 7 && j < 7 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 2][j + 2] == ChessSpace[i + 3][j + 3] && ChessSpace[i + 4][j + 4] == 0) x = i + 4, y = j + 4;
        if (i < 8 && j < 8 && i > 0 && j > 0 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 2][j + 2] == ChessSpace[i + 3][j + 3] && ChessSpace[i - 1][j - 1] == 0) x = i - 1, y = j - 1;
        if (i > 3 && j < 7 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 2][j + 2] == ChessSpace[i - 3][j + 3] && ChessSpace[i - 4][j + 4] == 0) x = i - 4, y = j + 4;
        if (i > 2 && j < 8 && i < 10 && j > 0 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 2][j + 2] == ChessSpace[i - 3][j + 3] && ChessSpace[i + 1][j - 1] == 0) x = i + 1, y = j - 1;
        //跳4
        if (i < 7 && ChessSpace[i][j] == ChessSpace[i + 1][j] && ChessSpace[i + 1][j] == ChessSpace[i + 2][j] && ChessSpace[i + 2][j] == ChessSpace[i + 4][j] && ChessSpace[i + 3][j] == 0) x = i + 3, y = j;
        if (i > 3 && ChessSpace[i][j] == ChessSpace[i - 1][j] && ChessSpace[i - 1][j] == ChessSpace[i - 2][j] && ChessSpace[i - 2][j] == ChessSpace[i - 4][j] && ChessSpace[i - 3][j] == 0) x = i - 3, y = j;
        if (j < 7 && ChessSpace[i][j] == ChessSpace[i][j + 1] && ChessSpace[i][j + 1] == ChessSpace[i][j + 2] && ChessSpace[i][j + 2] == ChessSpace[i][j + 4] && ChessSpace[i][j + 3] == 0) x = i, y = j + 3;
        if (j > 3 && ChessSpace[i][j] == ChessSpace[i][j - 1] && ChessSpace[i][j - 1] == ChessSpace[i][j - 2] && ChessSpace[i][j - 2] == ChessSpace[i][j - 4] && ChessSpace[i][j - 3] == 0) x = i, y = j - 3;
        if (i < 7 && j < 7 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 2][j + 2] == ChessSpace[i + 4][j + 4] && ChessSpace[i + 3][j + 3] == 0) x = i + 3, y = j + 3;
        if (i < 9 && j < 9 && i > 1 && j > 1 && ChessSpace[i][j] == ChessSpace[i + 1][j + 1] && ChessSpace[i + 1][j + 1] == ChessSpace[i + 2][j + 2] && ChessSpace[i + 2][j + 2] == ChessSpace[i - 2][j - 2] && ChessSpace[i - 1][j - 1] == 0) x = i - 1, y = j - 1;
        if (i > 3 && j < 7 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 2][j + 2] == ChessSpace[i - 4][j + 4] && ChessSpace[i - 3][j + 3] == 0) x = i - 3, y = j + 3, insure = 1;
        if (i > 1 && j < 9 && i < 9 && j > 1 && ChessSpace[i][j] == ChessSpace[i - 1][j + 1] && ChessSpace[i - 1][j + 1] == ChessSpace[i - 2][j + 2] && ChessSpace[i - 2][j + 2] == ChessSpace[i + 2][j - 2] && ChessSpace[i + 1][j - 1] == 0) x = i + 1, y = j - 1;
      }
      if (insure == 1) break;
    }

    if (insure == 1) break;
  }

  return [x, y];
}