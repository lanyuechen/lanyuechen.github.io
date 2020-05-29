const IS_NOT_VISITED = 0;
const IS_VISITED = 1;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
const VISITED = 4;

class Puzzle {
  constructor({ row, col, width , container}) {
    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);
    this.setOption({row, col, width});
    this.gen();
  }

  setOption({row, col, width}) {
    this.row = Math.max(row, 1);
    this.col = Math.max(col, 1);
    this.grid = (width - 20) / col;
    this.canvas.width = width;
    this.canvas.height = this.grid * row + 20;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(10, 10);
  }

  gen(type) {
    // M [UP, RIGHT, DOWN, LEFT, VISITED]
    this.M = JSON.parse(JSON.stringify(
      new Array(this.row).fill(
        new Array(this.col).fill(
          new Array(5).fill(0)
        )
      )
    ));

    if (type === 'recursiveBacktracking') {
      this.recursiveBacktracking();
    } else if (type === 'recursiveDivision') {
      this.recursiveDivision();
    } else {
      this.prim();
    }

    this.draw();
  }

  // Prim方式生成迷宫
  prim() {
    let r = 0;
    let c = 0;
    const stack = [[r, c]];
    
    while(stack.length) {
      [ r, c ] = this.popRandom(stack); // 随机选择一个单元格
      this.M[r][c][VISITED] = IS_VISITED;  // 标记该单元格为已读
      // 获取未访问的单元格
      this.getCandidatas(r, c, IS_NOT_VISITED).forEach(([ , [ dr, dc ]]) => {
        stack.push([r + dr, c + dc]);
        this.M[r + dr][c + dc][VISITED] = 2;
      });

      const candidatas = this.getCandidatas(r, c, IS_VISITED);  // 获取已访问过的单元格
      if (candidatas.length) {
        [ r, c ] = this.getThrough(r, c, this.popRandom(candidatas));
      }
    }
    this.M[0][0][LEFT] = 1;
    this.M[this.row - 1][this.col - 1][RIGHT] = 1;
  }

  // 递归回溯方式生成迷宫
  recursiveBacktracking() {
    let r = 0;
    let c = 0;
    const stack = [[r, c]];

    while(stack.length) {
      this.M[r][c][VISITED] = IS_VISITED;  // 标记该单元格为已读
      const candidatas = this.getCandidatas(r, c, IS_NOT_VISITED);
      if (candidatas.length) {
        [ r, c ] = this.getThrough(r, c, this.popRandom(candidatas));
        stack.push([r, c]);
      } else {
        [ r, c ] = stack.pop();
      }
    }
    this.M[0][0][LEFT] = 1;
    this.M[this.row - 1][this.col - 1][RIGHT] = 1;
  }

  recursiveDivision() {
    this._recursiveDivision([0, 0], [this.row - 1, this.col - 1])
    this.M[0][0][LEFT] = 1;
    this.M[this.row - 1][this.col - 1][RIGHT] = 1;
  }

  // 递归分割法生成迷宫
  _recursiveDivision([r1, c1], [r2, c2]) {
    if (r1 < r2 && c1 < c2) {
      const rm = this.rand(r1, r2);
      const cm = this.rand(c1, c2);
      const candidatas = [
        ['H', rm, this.rand(c1, cm)], 
        ['H', rm, this.rand(cm + 1, c2)], 
        ['V', this.rand(r1, rm), cm], 
        ['V', this.rand(rm + 1, r2), cm],
      ];
      this.popRandom(candidatas);
      candidatas.forEach(([ direction, r, c ]) => {
        if (direction === 'H') {
          this.M[r][c][DOWN] = 1;
          this.M[r + 1][c][UP] = 1;
        } else if (direction === 'V') {
          this.M[r][c][RIGHT] = 1;
          this.M[r][c + 1][LEFT] = 1;
        }
      });
      this._recursiveDivision([r1, c1], [rm, cm]);
      this._recursiveDivision([r1, cm + 1], [rm, c2]);
      this._recursiveDivision([rm + 1, c1], [r2, cm]);
      this._recursiveDivision([rm + 1, cm + 1], [r2, c2]);
    } else if (r1 < r2) {   // 此时只剩一竖排单元格，直接将其间的单元格打通即可
      for (let i = r1; i < r2; i++) {
        this.M[i][c1][DOWN] = 1;
        this.M[i + 1][c1][UP] = 1;
      }
    } else if (c1 < c2) {   // 此时只剩一横排单元格，直接将其间的单元格打通即可
      for (let i = c1; i < c2; i++) {
        this.M[r1][i][RIGHT] = 1;
        this.M[r1][i + 1][LEFT] = 1;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = '#000';

    this.M.forEach((row, r) => {
      row.forEach((col, c) => {
        if (col[LEFT] === 0) {
          this.ctx.moveTo(this.grid * c, this.grid * r);
          this.ctx.lineTo(this.grid * c, this.grid * (r + 1));
          this.ctx.stroke();
        }
        if (col[RIGHT] === 0) {
          this.ctx.moveTo(this.grid * (c + 1), this.grid * r);
          this.ctx.lineTo(this.grid * (c + 1), this.grid * (r + 1));
          this.ctx.stroke();
        }
        if (col[UP] === 0) {
          this.ctx.moveTo(this.grid * c, this.grid * r);
          this.ctx.lineTo(this.grid * (c + 1), this.grid * r);
          this.ctx.stroke();
        }
        if (col[DOWN] === 0) {
          this.ctx.moveTo(this.grid * c, this.grid * (r + 1));
          this.ctx.lineTo(this.grid * (c + 1), this.grid * (r + 1));
          this.ctx.stroke();
        }
      });
    });
  }

   /**
   * 获取备选单元格
   */
  getCandidatas(r, c, visitedState = IS_NOT_VISITED) {
    return [
      [LEFT, [0, -1],  c > 0, RIGHT],
      [UP, [-1, 0],  r > 0, DOWN],
      [RIGHT, [0, 1],   c < this.col - 1, LEFT],
      [DOWN, [1, 0],   r < this.row - 1, UP],
    ].filter(([ , [ dr, dc ], condition ]) => {
      return condition && (this.M[r + dr][c + dc][VISITED] === visitedState)
    });
  }

  /**
   * 打通[r, c]位置单元格和备选单元格，并返回新位置的单元格
   */
  getThrough(r, c, candidata) {
    const [ direction, [ dr, dc ], , reverseDirection ] = candidata;
    this.M[r][c][direction] = 1;                  // 把墙推倒
    this.M[r + dr][c + dc][reverseDirection] = 1; // 把墙推倒
    return [ r + dr, c + dc ]; // 返回新的单元格位置
  }

  rand(a, b) {
    return a + Math.floor(Math.random() * (b - a));
  }

  popRandom(arr) {
    return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
  }
}