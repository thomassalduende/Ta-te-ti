import { useState, useEffect } from "react"
import confetti from 'canvas-confetti'
import { Square } from "./componets/Square"
import { turnos} from "./constant/constan"
import { checkWinners } from "./logic/board"
import { WinnerModal } from "./componets/WinnerModal"
import { checkEndGame } from "./logic/board"
import { Tablero } from "./componets/Tablero"
import { saveGameToStorage, resetGameStorage } from "./logic/storage"


function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage =  window.localStorage.getItem('board')

    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStaorage =  window.localStorage.getItem('turn')

    return turnFromStaorage ?? turnos.X
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(turnos.X)
    setWinner(null)

    resetGameStorage()
  }

  const updateBoard = (index) => {

    if(board[index] || winner) return 

    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurno = turn === turnos.X ? turnos.O : turnos.X
    setTurn(newTurno)
    // guardar partida en local storage
   
    saveGameToStorage({
      board: newBoard,
      turn: newTurno
    })

    const newWinner = checkWinners(newBoard)
    if(newWinner){
      confetti()
      setWinner(newWinner)
    }else if(checkEndGame(newBoard)){
      setWinner(false)
    }
  }

  return (
    <main className="board">
        <h1>Tic tac toe</h1>
        <button onClick={resetGame}>Reset del juego</button>
        <Tablero board={board} updateBoard={updateBoard}/>
        <section className="turn">
          <Square isSelected={turn === turnos.X}>{turnos.X}</Square>
          <Square isSelected={turn === turnos.O}>{turnos.O}</Square>
        </section>
        <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
