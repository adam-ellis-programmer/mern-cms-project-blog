export function extractErrorMessage(error) {
  console.log(error)
  return error.response?.data?.message || error.message || error.toString()
}

export function getDate() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const months = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ]

  const d = new Date()
  const day = days[d.getDay()]
  const date = d.getDate()
  const month = months[d.getMonth()]
  const year = d.getFullYear()

  let hour = d.getHours()
  let minutes = d.getMinutes()
  const seconds = d.getSeconds()

  minutes = minutes < 10 ? `0${minutes}` : minutes
  // console.log(minutes)
  return {
    date: `${day} ${date} ${month} ${year}`,
    time: `${hour}:${minutes}:${seconds}`,
  }
}

export function clearUpdateVisual() {
  document
    .querySelectorAll('.task-list-item')
    .forEach((item) => item.classList.remove('edit-active'))
}

export function randNum() {
  const rand = (Math.floor(Math.random() * 10000) + 10000).toString().substring(0, 4)
  return rand
}

export function formatedDOB(date, month, year) {
  const months = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ]
  const d = new Date(`${month} ${date}, ${year}`)

  const birthDate = d.getDate()
  const birthMonth = months[d.getMonth()]
  const birthYear = d.getFullYear()
  return `${birthDate} ${birthMonth} ${birthYear}`
}

export function scrollTop() {
  window.scrollTo({
    left: 0,
    top: 0,
  })
}
