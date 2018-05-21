/* global _ */
let navPositions = []

window.addEventListener('load', () => {
  // Prevent following "stage" links
  let stageLinks = document.getElementsByClassName('stage')
  for (let i = 0; i < stageLinks.length; i++) {
    stageLinks[i].addEventListener('click', e => e.preventDefault())
  }

  // Add click handler for skill "more info" links
  let milinks = document.getElementsByClassName('more-info')
  for (let i = 0; i < milinks.length; i++) {
    let link = milinks[i]
    link.addEventListener('click', e => {
      e.preventDefault()
      let p = e.target.parentNode
      while (p.tagName !== 'DIV') p = p.parentNode
      p.classList.toggle('described')
    })
  }

  // Handle read-description links in history section
  let rdb = document.getElementsByClassName('read-description')
  for (let i = 0; i < rdb.length; i++) {
    let button = rdb[i]
    let description = button.parentNode.getElementsByClassName('description')[0]

    // Toggle the show class on the description when the button is clicked
    button.addEventListener('click', e => {
      description.classList.toggle('show')
    })

    // Toggle the text of the button after the animation finishes
    description.addEventListener('transitionend', e => {
      if (description.classList.contains('show')) {
        button.innerText = 'Hide Description'
      } else {
        button.innerText = 'Read Description'
      }
    })
  }

  // Create lists of nav links and their corresponding targets
  let menu = document.getElementById('menu')
  let menuItems = menu.getElementsByTagName('a')

  // Create the list of nav item positions
  for (let i = 0; i < menuItems.length; i++) {
    let item = menuItems[i]
    let parent = item.parentNode

    // Skip the menu handle and the special "#top" link
    if (parent.classList.contains('menu-handle')) continue
    if (item.getAttribute('href') === '#top') continue

    let id = item.getAttribute('href').slice(1)
    let position = item.offsetTop
    navPositions.push({id, position})
  }

  for (let i = 0; i < menuItems.length; i++) {
    let item = menuItems[i]
    let parent = item.parentNode

    // Set the click handler for the menu handle.
    if (parent.classList.contains('menu-handle')) {
      item.addEventListener('click', e => {
        e.preventDefault()
        menu.classList.toggle('show')
      })
      continue
    }

    let id = item.getAttribute('href').slice(1)
    item.addEventListener('click', e => {
      e.preventDefault()
      menu.classList.remove('show')

      if (id === 'top') {
        window.scrollTo(0, 0)
      } else {
        let position = document.getElementById(id).offsetTop
        window.scrollTo(0, position)
      }
    })
  }

  if (window.scrollY > 0) setHighlightPosition()
})

window.addEventListener('scroll', _.throttle(setHighlightPosition, 100))

function setHighlightPosition () {
  let documentEnd = document.documentElement.scrollHeight - window.innerHeight
  let scrollTop = window.scrollY
  let scrollMiddle = scrollTop + window.innerHeight / 2
  let highlight = document.getElementById('nav-highlight')
  let highlightPosition = 0

  let targetPositions = []
  for (let i = 0; i < navPositions.length; i++) {
    let id = navPositions[i].id
    let target = document.getElementById(id)
    let position = target.offsetTop

    targetPositions.push({id, position})
  }

  if (scrollTop === 0) {
    highlightPosition = 0
  } else if (scrollTop === documentEnd) {
    highlightPosition = navPositions[navPositions.length - 1].position
  } else {
    for (let i = 0; i < targetPositions.length; i++) {
      let targetPosition = targetPositions[i].position

      // If the target is very close to the top of the window, use that for the
      // active menu item
      if (Math.abs(targetPosition - scrollTop) < 25 ||
        (scrollTop < targetPosition && targetPosition - scrollTop < 50)) {
        highlightPosition = navPositions[i].position
        break
      }

      if (scrollMiddle > targetPosition) {
        highlightPosition = navPositions[i].position
      }
    }
  }

  highlight.style.transform = `translateY(${highlightPosition}px)`
  highlight.dataset.position = highlightPosition
}