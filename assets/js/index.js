const experiences = document.querySelector('.experiences > div')
const experiencesList = document.querySelector('.experiences > div > ul')

const leftButton = document.createElement('button')
const rightButton = document.createElement('button')

leftButton.innerHTML = '‹'
rightButton.innerHTML = '›'

experiences.appendChild(leftButton)
experiences.appendChild(rightButton)

const clickDistance = 150

leftButton.addEventListener('click', () => {
  experiencesList.scrollLeft -= clickDistance
})

rightButton.addEventListener('click', () => {
  experiencesList.scrollLeft += clickDistance
})

const conditionallyShowScrollButtons = () => {
  const left = experiencesList.scrollLeft
  const right =
    experiencesList.scrollWidth -
    (experiencesList.scrollLeft + experiencesList.clientWidth) +
    1

  if (left === 0) {
    leftButton.classList.add('hidden')
  } else {
    leftButton.classList.remove('hidden')
  }
  if (right === 1) {
    rightButton.classList.add('hidden')
  } else {
    rightButton.classList.remove('hidden')
  }
}

conditionallyShowScrollButtons()

experiencesList.addEventListener('scroll', conditionallyShowScrollButtons)
