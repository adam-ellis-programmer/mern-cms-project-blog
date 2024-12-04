import { useState, useEffect } from 'react'

function NoDataPlaceHolder({ data }) {
  const { page } = data
  const tasks = 'no-data-icon fa-solid fa-sitemap'
  const emails = 'no-data-icon fa-solid fa-envelope'
  const blogs = 'no-data-icon fa-solid fa-blog'
  const users = 'no-data-icon fa-solid fa-users'
  const messages = 'no-data-icon fa-regular fa-message'
  const [icon, setIcon] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    // we test the value of page as is...
    switch (page) {
      case 'messages':
        setIcon(messages)
        setText('messages')
        break
      case 'users':
        setIcon(users)
        setText('users')
        break
      case 'tasks':
        setIcon(tasks)
        setText('tasks')
        break
      case 'emails':
        setIcon(emails)
        setText('emails')
        break
      case 'blogs':
        setIcon(blogs)
        setText('blogs')
        break

      default:
        setText('no data avalible at this time!')
        break
    }
    return () => {
      setIcon('')
      setText('')
    }
  }, [page])

  return (
    <div className="no-data-place-holder">
      <div>
        <i className={icon}></i>
      </div>

      <div>
        <p>
          <span>no {text} to show!</span>
        </p>
      </div>
    </div>
  )
}

export default NoDataPlaceHolder
