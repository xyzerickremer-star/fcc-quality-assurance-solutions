class SudokuSolver {

  validate(puzzleString) {
    if (typeof puzzleString !== 'string') {
      return { valid: false, error: 'Required field(s) missing' };
    }
    if (/[^1-9.]/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    return { valid: true };
  }

  getIndex(row, column) {
    const rowIndex = String(row).toUpperCase().charCodeAt(0) - 65;
    const colIndex = Number(column) - 1;
    return rowIndex * 9 + colIndex;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = String(row).toUpperCase().charCodeAt(0) - 65;
    const currentIndex = this.getIndex(row, column);

    for (let col = 0; col < 9; col++) {
      const index = rowIndex * 9 + col;
      if (index !== currentIndex && puzzleString[index] === String(value)) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIndex = Number(column) - 1;
    const currentIndex = this.getIndex(row, column);

    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const index = rowIndex * 9 + colIndex;
      if (index !== currentIndex && puzzleString[index] === String(value)) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = String(row).toUpperCase().charCodeAt(0) - 65;
    const colIndex = Number(column) - 1;
    const currentIndex = this.getIndex(row, column);
    const rowStart = Math.floor(rowIndex / 3) * 3;
    const colStart = Math.floor(colIndex / 3) * 3;

    for (let r = rowStart; r < rowStart + 3; r++) {
      for (let c = colStart; c < colStart + 3; c++) {
        const index = r * 9 + c;
        if (index !== currentIndex && puzzleString[index] === String(value)) {
          return false;
        }
      }
    }
    return true;
  }

  isSafe(board, index, value) {
    const row = String.fromCharCode(65 + Math.floor(index / 9));
    const column = String((index % 9) + 1);
    return this.checkRowPlacement(board, row, column, value) &&
      this.checkColPlacement(board, row, column, value) &&
      this.checkRegionPlacement(board, row, column, value);
  }

  hasInitialConflicts(puzzleString) {
    for (let index = 0; index < puzzleString.length; index++) {
      const value = puzzleString[index];
      if (value === '.') continue;
      const row = String.fromCharCode(65 + Math.floor(index / 9));
      const column = String((index % 9) + 1);
      if (!this.isSafe(puzzleString, index, value)) {
        return true;
      }
    }
    return false;
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid || this.hasInitialConflicts(puzzleString)) {
      return false;
    }

    const board = puzzleString.split('');

    const solveBoard = () => {
      let emptyIndex = -1;
      let candidates = [];

      for (let i = 0; i < board.length; i++) {
        if (board[i] !== '.') continue;
        const currentCandidates = [];
        const boardString = board.join('');
        for (let n = 1; n <= 9; n++) {
          const value = String(n);
          if (this.isSafe(boardString, i, value)) {
            currentCandidates.push(value);
          }
        }
        if (currentCandidates.length === 0) return false;
        if (emptyIndex === -1 || currentCandidates.length < candidates.length) {
          emptyIndex = i;
          candidates = currentCandidates;
          if (candidates.length === 1) break;
        }
      }

      if (emptyIndex === -1) return true;

      for (const value of candidates) {
        board[emptyIndex] = value;
        if (solveBoard()) return true;
        board[emptyIndex] = '.';
      }
      return false;
    };

    return solveBoard() ? board.join('') : false;
  }
}

module.exports = SudokuSolver;
