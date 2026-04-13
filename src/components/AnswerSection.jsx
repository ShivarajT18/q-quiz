import React, { useMemo } from 'react'

const AnswerSection = ({
  questions,
  currentQuestion,
  handleAnswerOptionClick,
  selectedAnswers
}) => {

  const current = questions[currentQuestion]

  if (!current || !current.answers) {
    return <p>Loading...</p>
  }

  const selected = selectedAnswers[currentQuestion]

  // ✅ SHUFFLE ONLY ONCE PER QUESTION
  const answers = useMemo(() => {
    return [...current.answers].sort(() => Math.random() - 0.5)
  }, [currentQuestion])

  return (
    <div className='answer-section'>
      {answers.map((ans, index) => {

        let className = "answer-options"

        if (selected) {
          if (ans.isCorrect) {
            className += " correct"
          } else if (selected === ans.text) {
            className += " wrong"
          }
        }

        return (
          <button
            key={ans.text + index}
            className={className}
            onClick={() => handleAnswerOptionClick(ans.isCorrect, ans.text)}
            disabled={selected}
          >
            {ans.text}
          </button>
        )
      })}
    </div>
  )
}

export default AnswerSection