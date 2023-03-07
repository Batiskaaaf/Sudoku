const newGrid = (size) => {
    let arr = new Array(size);

    for (let i = 0; i < size; i++) {
        arr[i] = new Array(size);  
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        arr[Math.floor(i/size)][i%size] = CONSTANT.UNASSIGNED;
    }

    return arr;
}

// check duplicate number in col
const isColSafe = (grid, col, value) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        if (grid[row][col] === value) return false;
    }
    return true;
}

// check duplicate number in row
const isRowSafe = (grid, row, value) => {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
        if (grid[row][col] === value) return false;
    }
    return true;
}

// check duplicate number in 3x3 box
const isBoxSafe = (grid, box_row, box_col, value) => {
    for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
        for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
            if (grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
}

// check in row, col and 3x3 box
const isSafe = (grid, row, col, value) => {
    return isColSafe(grid, col, value) && isRowSafe(grid, row, value) && isBoxSafe(grid, row - row%3, col - col%3, value) && value !== CONSTANT.UNASSIGNED;
}

// find unassigned cell
const findUnassignedPos = (grid, pos) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pos.row = row;
                pos.col = col;
                return true;
            }
        }
    }
    return false;
}

// shuffle arr
const shuffleArray = (arr) => {
    let curr_index = arr.length;

    while (curr_index !== 0) {
        let rand_index = Math.floor(Math.random() * curr_index);
        curr_index -= 1;

        let temp = arr[curr_index];
        arr[curr_index] = arr[rand_index];
        arr[rand_index] = temp;
    }

    return arr;
}

// check puzzle is complete
const isFullGrid = (grid) => {
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANT.UNASSIGNED;
        });
    });
}

const sudokuCreate = (grid) => {
    let unassigned_pos = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pos)) return true;

    let number_list = shuffleArray([...CONSTANT.NUMBERS]);

    let row = unassigned_pos.row;
    let col = unassigned_pos.col;

    number_list.forEach((num, i) => {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;

            if (isFullGrid(grid)) {
                return true;
            } else {
                if (sudokuCreate(grid)) {
                    return true;
                }
            }

            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    });

    return isFullGrid(grid);
}

const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

const removeCells = (grid, level) => {
    let res = [...grid];
    let attemps = level;
    while (attemps > 0) {
        let row = rand();
        let col = rand();
        while (res[row][col] === 0) {
            row = rand();
            col = rand();
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        attemps--;
    }
    return res;
}

// generate sudoku base on level
const sudokuGen = (level) => {
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if (check) {
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        }
    }
    return undefined;
}

function isValidSudoku(grid) {
    // Check rows
    for (let row = 0; row < 9; row++) {
      const rowSet = new Set();
      for (let col = 0; col < 9; col++) {
        const val = grid[row][col];
        if (val === 0) {
          continue;
        }
        if (rowSet.has(val)) {
          return false;
        }
        rowSet.add(val);
      }
    }
  
    // Check columns
    for (let col = 0; col < 9; col++) {
      const colSet = new Set();
      for (let row = 0; row < 9; row++) {
        const val = grid[row][col];
        if (val === 0) {
          continue;
        }
        if (colSet.has(val)) {
          return false;
        }
        colSet.add(val);
      }
    }
  
    // Check sub-grids
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const subgridSet = new Set();
        for (let row = i; row < i + 3; row++) {
          for (let col = j; col < j + 3; col++) {
            const val = grid[row][col];
            if (val === 0) {
              continue;
            }
            if (subgridSet.has(val)) {
              return false;
            }
            subgridSet.add(val);
          }
        }
      }
    }
  
    return true;
}

function solveSudoku(grid) {
    function getPossibleValues(row, col) {
      const usedValues = new Set();
      for (let i = 0; i < 9; i++) {
        usedValues.add(grid[row][i]);
        usedValues.add(grid[i][col]);
      }
      const subgridRow = Math.floor(row / 3) * 3;
      const subgridCol = Math.floor(col / 3) * 3;
      for (let i = subgridRow; i < subgridRow + 3; i++) {
        for (let j = subgridCol; j < subgridCol + 3; j++) {
          usedValues.add(grid[i][j]);
        }
      }
      const possibleValues = [];
      for (let val = 1; val <= 9; val++) {
        if (!usedValues.has(val)) {
          possibleValues.push(val);
        }
      }
      return possibleValues;
    }
  
    function solveHelper(row, col) {
      if (row === 9) {
        return true;
      }
      const nextRow = col === 8 ? row + 1 : row;
      const nextCol = col === 8 ? 0 : col + 1;
      if (grid[row][col] !== 0) {
        return solveHelper(nextRow, nextCol);
      }
      const possibleValues = getPossibleValues(row, col);
      for (const val of possibleValues) {
        grid[row][col] = val;
        if (solveHelper(nextRow, nextCol)) {
          return true;
        }
      }
      grid[row][col] = 0;
      return false;
    }
  
    solveHelper(0, 0);
    return grid;
  }