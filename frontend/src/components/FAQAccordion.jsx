import { useState } from 'react'

function FAQAccordion({ title, text, index, selected, setSelected }) {
  const toggle = (index) => {
    if (selected === index) {
      return setSelected(null)
    }

    setSelected(index)
  }

  return (
    <article className="question">
      <div className="question-title" onClick={() => toggle(index)}>
        <p>{title} </p>
        <button className="question-btn">
          <span className="question-icon-span">
            {/* if the setSelected equels that index on the loop then run this code */}
            {selected === index ? (
              <>
                {console.log(selected)}
                <i className="fa-solid fa-minus"></i>
              </>
            ) : (
              <i className="fa-solid fa-plus"></i>
            )}
          </span>
        </button>
      </div>
      <div className={selected === index ? 'question-text show' : 'question-text'}>
        <p className="question-p">{text}</p>
      </div>
    </article>
  )
}

export default FAQAccordion
