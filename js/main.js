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
    .reduce((navPositions, item) => {
      const id = item.getAttribute('href').slice(1);
      const position = item.offsetTop;
      const targeted = id.length > 0 && id !== 'top';
      return navPositions.concat({ id, position, targeted });
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

  let highlightItem = 0;
  for (let i = 0; i < nav.positions.length; i += 1) {
    const item = nav.positions[i];
    if (!item.targeted) continue;

    const target = document.getElementById(item.id);
    const position = target.offsetTop;

    // If the target is close to the top of the window, set the highlighted item
    // and don't check any more.
    if (
      (Math.abs(position - scrollTop) < 25) ||
      (scrollTop < position && position - scrollTop < 50)
    ) {
      highlightItem = i;
      break;
    }

    // Check the position of a target near the middle of the window if there
    // were no targets near the top of the window.
    if (scrollMiddle > position) {
      highlightItem = i;
    }
  }

  if (scrollTop === documentEnd) {
    highlightItem = nav.positions.length - 1;
  }

  highlight.style.transform = `translateY(${nav.positions[highlightItem].position}px)`;
  highlight.dataset.position = highlightItem;
}
