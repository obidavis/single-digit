// import React, { useState } from 'react';
import './App.css';
import { Sudoku } from './components/Sudoku/SudokuPlayer';
// import { Sudoku } from './Game/Sudoku';

function App() {
  const boardString = "000650007517000000800090010004100000103000705000006900090000006000000354600025000";
  return (
    <div className='App'>
      <Sudoku initialState={boardString} />
    </div>
  )
}

export default App;