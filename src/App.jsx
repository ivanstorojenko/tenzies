import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

// To do
// 1. Put real dots on the dice
// 4. Save your best time to localStorage

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [rollCounter, setRollCounter] = React.useState(0)
    const [gameTime, setGameTime] = React.useState([new Date(), 0])
    const [tenzies, setTenzies] = React.useState(false)
    
    // Figuring out when game is finished
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    // Updating gameTime until game finished
    React.useEffect(() => {
        if(!tenzies) {
            const timer = setTimeout(() => {
                setGameTime(prev => {
                    const updateGameTime = [...prev]
                    updateGameTime[1] = Math.floor((new Date() - prev[0]) / 1000)
                    return updateGameTime
                })
            }, "1000")
            return () => clearTimeout(timer)
        }
    })

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCounter(prev => prev+1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCounter(0)
            setGameTime([new Date(), 0])
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="score">
                <span className="score_item">
                    Rolls: {rollCounter}
                </span>
                <span className="score_item">
                    Game time: {gameTime[1]} s
                </span>
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}