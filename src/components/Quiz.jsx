import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AnswerSection from './AnswerSection'
import "./QuizStyle.css"
import logo1 from '../assets/Logo.png'
import logo2 from '../assets/logo2.png'

const Quiz = () => {
    const [questions, setQuestions] = useState([])
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [showScore, setShowScore] = useState(false)
    const [score, setScore] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [loading, setLoading] = useState(true)

    // ⏱️ TIMER
    const [timeLeft, setTimeLeft] = useState(10)

    // ✅ START BUTTON STATE
    const [startQuiz, setStartQuiz] = useState(false)

    // ✅ Fetch questions
    const fetchQuestions = async () => {
    try {
        const response = await axios.get(
        `https://quizapi.io/api/v1/questions?api_key=${import.meta.env.VITE_API_KEY}&limit=10&timestamp=${Date.now()}`
        )

        const shuffled = response.data.data.sort(() => Math.random() - 0.5)

        setQuestions(shuffled)

    } catch (error) {
        console.error(error)
        } finally {
        setLoading(false)
        }
    }

    // 🔥 FETCH ONLY AFTER START
    useEffect(() => {
        if (startQuiz) {
            fetchQuestions()
        }
    }, [startQuiz])

    // ✅ NEXT QUESTION
    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1

        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion)
            setTimeLeft(10)
        } else {
            setShowScore(true)
        }
    }

    // ⏱️ TIMER LOGIC
    useEffect(() => {
        if (!startQuiz || showScore) return

        if (timeLeft === 0) {
            handleNextQuestion()
            return
        }

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearTimeout(timer)

    }, [timeLeft, currentQuestion, startQuiz])

    // ✅ ANSWER CLICK
    const handleAnswerOptionClick = (isCorrect, answer) => {

        if (selectedAnswers[currentQuestion]) return

        if (isCorrect) {
            setScore((prev) => prev + 1)
        }

        const updatedSelectedAnswers = [...selectedAnswers]
        updatedSelectedAnswers[currentQuestion] = answer
        setSelectedAnswers(updatedSelectedAnswers)

        setTimeout(() => {
            handleNextQuestion()
        }, 1000)
    }

    // ✅ RESTART
    const handlePlayAgainClick = () => {
        setCurrentQuestion(0)
        setShowScore(false)
        setScore(0)
        setSelectedAnswers([])
        setTimeLeft(10)
        setStartQuiz(false) // 👈 go back to start screen
    }

    // 🔥 START SCREEN
    if (!startQuiz) {
        return (
            <div className="quiz">
                <img src={logo1} alt="College Logo" className="logo" />
                <h1>G-Quiz</h1>
                <button
                    className="start-btn"
                    onClick={() => setStartQuiz(true)}
                >
                    Start Quiz
                </button>
            </div>
        )
    }

    // ✅ LOADING
    if (loading) {
        return (
            <div className="quiz">
                <h1>G-Quiz</h1>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className='quiz'>
            <div className="header">
                <img src={logo2} alt="Quiz Logo" className="logo1" />
                <h1 className="title-center">G-Quiz</h1>
            </div>
            {showScore ? (
                <div className='score-section'>
                    <h2>Your Score: {score} / {questions.length}</h2>
                    <button className='playAgain-btn' onClick={handlePlayAgainClick}>
                        Play Again
                    </button>
                </div>
            ) : (
                <>
                    {questions.length > 0 ? (
                        <div className='question-section'>

                            <div className='question-count'>
                                <span>{currentQuestion + 1}</span> / {questions.length}
                            </div>

                            {/* ⏱️ CIRCLE TIMER */}
                            <div className="timer-container">
                                <div
                                    className="circle"
                                    style={{ "--time": timeLeft }}
                                >
                                    <span>{timeLeft}</span>
                                </div>
                            </div>

                            <div className='question-text'>
                                {questions[currentQuestion]?.text}
                            </div>

                            <AnswerSection
                                questions={questions}
                                currentQuestion={currentQuestion}
                                handleAnswerOptionClick={handleAnswerOptionClick}
                                selectedAnswers={selectedAnswers}
                            />

                            <div className='navigation-buttons'>
                                {currentQuestion > 0 && (
                                    <button onClick={() => setCurrentQuestion(currentQuestion - 1)}>
                                        Previous
                                    </button>
                                )}

                                {currentQuestion < questions.length - 1 && (
                                    <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                                        Next
                                    </button>
                                )}
                            </div>

                        </div>
                    ) : (
                        <p>No questions available</p>
                    )}
                </>
            )}
        </div>
    )
}

export default Quiz