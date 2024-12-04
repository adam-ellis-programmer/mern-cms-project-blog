import { useState, useEffect } from 'react'
import FAQAccordion from '../components/FAQAccordion'
import { scrollTop } from '../utils'

const questions = [
  {
    id: 1,
    title: 'how do i start blogging',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit',
  },
  {
    id: 2,
    title: 'how much does it cost',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit.',
  },
  {
    id: 2,
    title: 'how long will my blog be seen for',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit',
  },
  {
    id: 3,
    title: 'how many images can i upload',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est dolore illo dolores quia nemo doloribus quaerat, magni numquam repellat reprehenderit',
  },
  // Add more questions here
]

function FAQS() {
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    scrollTop()

    return () => {}
  }, [])

  return (
    <div className="page-container faq-pge-container">
      <section className="faq-header">
        <h1>the blogging site faqs</h1>
      </section>

      <section className="accordion-section">
        <div className="close-all-questions-btn-container"></div>
        {questions.map(({ title, text }, i) => (
          <FAQAccordion
            key={i}
            title={title}
            text={text}
            index={i}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </section>
    </div>
  )
}

export default FAQS
