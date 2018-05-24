/* global _ */
window.addEventListener('load', () => {
  const nextPageLink = document.getElementById('nextPage');
  nextPageLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.currentTarget.getAttribute('href').slice(1);
    window.scrollTo(0, document.getElementById(target).offsetTop);
  });

  // Prevent following "stage" links
  const stageLinks = document.getElementsByClassName('stage');
  for (let i = 0; i < stageLinks.length; i += 1) {
    stageLinks[i].addEventListener('click', e => e.preventDefault());
  }

  // Handle read-description links in history section
  const rdb = document.getElementsByClassName('read-description');
  for (let i = 0; i < rdb.length; i += 1) {
    const button = rdb[i];
    const description = button.parentNode.getElementsByClassName('description')[0];

    // Toggle the show class on the description when the button is clicked
    button.addEventListener('click', () => description.classList.toggle('show'));

    // Toggle the text of the button after the animation finishes
    description.addEventListener('transitionend', () => {
      if (description.classList.contains('show')) {
        button.innerText = 'Hide Description';
      } else {
        button.innerText = 'Read Description';
      }
    });
  }

  // Create lists of nav links and their corresponding targets
  const menuItems = Array.from(document.querySelectorAll('#menu ul li a'));

  // Create the list of nav item positions
  const nav = {};
  nav.positions = menuItems
    .reduce((navPositions, item) => {
      const id = item.getAttribute('href').slice(1);
      const position = item.offsetTop;
      const targeted = item.classList.contains('targeted');
      return navPositions.concat({ id, position, targeted });
    }, []);

  // Show the menu when we click on the menu handle.
  document.querySelector('.menu-handle').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('menu').classList.toggle('show');
  });

  menuItems
    .filter(item => !item.parentNode.classList.contains('menu-handle'))
    .forEach((item) => {
      const id = item.getAttribute('href').slice(1);
      item.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('menu').classList.remove('show');

        if (id === 'top') {
          window.scrollTo(0, 0);
        } else {
          const position = document.getElementById(id).offsetTop;
          window.scrollTo(0, position);
        }
      });
    });

  window.addEventListener('scroll', _.throttle(() => setHighlightPosition(nav), 100));
  window.addEventListener('scroll', _.throttle(() => setMenuPosition(), 10));

  if (window.scrollY > 0) setHighlightPosition(nav);
  if (window.scrollY > 0) setMenuPosition();
});

function setHighlightPosition(nav) {
  const documentEnd = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY;
  const scrollMiddle = scrollTop + (window.innerHeight / 2);
  const highlight = document.getElementById('nav-highlight');

  const getTargetPosition = item => document.getElementById(item.id).offsetTop;

  const isCloseToTop = (item) => {
    const position = getTargetPosition(item);
    const closeAfter = scrollTop > position && scrollTop - position < 25;
    const closeBefore = scrollTop < position && position - scrollTop < 50;
    return closeAfter || closeBefore;
  };

  const isPastMiddle = item => scrollMiddle > getTargetPosition(item);

  const findLastIndex = (array, test) => {
    const tested = array.map(elem => test(elem));
    return tested.lastIndexOf(true);
  };

  const topIndex = nav.positions.findIndex(item => item.targeted && isCloseToTop(item));
  const middleIndex = findLastIndex(nav.positions, item => item.targeted && isPastMiddle(item));

  let highlightIndex = 0;
  if (topIndex !== -1) {
    highlightIndex = topIndex;
  } else if (middleIndex !== -1) {
    highlightIndex = middleIndex;
  }
  if (scrollTop === documentEnd) highlightIndex = nav.positions.length - 1;

  const highlightTarget = nav.positions[highlightIndex].id || 'top';

  highlight.style.transform = `translateY(${nav.positions[highlightIndex].position}px)`;
  highlight.dataset.target = highlightTarget;
}

function setMenuPosition() {
  const menu = document.getElementById('menu');
  const scrollTop = window.scrollY;

  if (scrollTop >= document.querySelector('section').offsetTop) {
    menu.classList.add('fixed');
  } else {
    menu.classList.remove('fixed');
  }
}
