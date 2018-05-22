/* global _ */
window.addEventListener('load', () => {
  // Prevent following "stage" links
  const stageLinks = document.getElementsByClassName('stage');
  for (let i = 0; i < stageLinks.length; i += 1) {
    stageLinks[i].addEventListener('click', e => e.preventDefault());
  }

  // Add click handler for skill "more info" links
  const milinks = document.getElementsByClassName('more-info');
  for (let i = 0; i < milinks.length; i += 1) {
    const link = milinks[i];
    link.addEventListener('click', (e) => {
      e.preventDefault();
      let p = e.target.parentNode;
      while (p.tagName !== 'DIV') p = p.parentNode;
      p.classList.toggle('described');
    });
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
  const menu = document.getElementById('menu');
  const menuItems = Array.from(menu.getElementsByTagName('a'));

  // Create the list of nav item positions
  const nav = {};
  nav.positions = menuItems
    .filter((item) => {
      const parent = item.parentNode;

      const handle = parent.classList.contains('menu-handle');
      const top = item.getAttribute('href') === '#top';
      return (!handle && !top);
    })
    .reduce((navPositions, item) => {
      const id = item.getAttribute('href').slice(1);
      const position = item.offsetTop;
      return navPositions.concat({ id, position });
    }, []);

  // Show the menu when we click on the menu handle.
  document.querySelector('.menu-handle').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('menu').classList.toggle('show');
  });

  menuItems
    .filter(item => !item.classList.contains('menu-handle'))
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

  if (window.scrollY > 0) setHighlightPosition(nav);
});

function setHighlightPosition(nav) {
  const documentEnd = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY;
  const scrollMiddle = scrollTop + (window.innerHeight / 2);
  const highlight = document.getElementById('nav-highlight');
  const navPositions = nav.positions;
  let highlightPosition = 0;

  const targetPositions = [];
  for (let i = 0; i < navPositions.length; i += 1) {
    const { id } = navPositions[i];
    const target = document.getElementById(id);
    const position = target.offsetTop;

    targetPositions.push({ id, position });
  }

  if (scrollTop === 0) {
    highlightPosition = 0;
  } else if (scrollTop === documentEnd) {
    highlightPosition = navPositions[navPositions.length - 1].position;
  } else {
    for (let i = 0; i < targetPositions.length; i += 1) {
      const targetPosition = targetPositions[i].position;

      // If the target is very close to the top of the window, use that for the
      // active menu item
      if (Math.abs(targetPosition - scrollTop) < 25 ||
        (scrollTop < targetPosition && targetPosition - scrollTop < 50)) {
        highlightPosition = navPositions[i].position;
        break;
      }

      if (scrollMiddle > targetPosition) {
        highlightPosition = navPositions[i].position;
      }
    }
  }

  highlight.style.transform = `translateY(${highlightPosition}px)`;
  highlight.dataset.position = highlightPosition;
}
