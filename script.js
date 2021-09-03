'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSelections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight= document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const btnTheme = document.querySelector('.theme');

// Smooth scroll to section1
btnScrollTo.addEventListener('click', event => {
  // new way
  section1.scrollIntoView({ behavior: 'smooth' })
})

const openModal = e => {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Event delagation
// 1. Add event listener to common parent element
// 2. Determine what element orignated the event -> event.target
document.querySelector('.nav__links').addEventListener(
  'click', function (e) {
    e.preventDefault();
    // Matching
    if(e.target.classList.contains('nav__link')){
      const id = e.target.getAttribute('href'); //this.href returns absolute link
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
    }
  }
)

// Tabbed component

// problem: we have span element inside button
tabsContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause, if we didnt click on button
  if(!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  // Activate content area
  document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
    )
    .classList.add(
      'operations__content--active'
    );
})

// Menu fade animation
const handleHover = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation: Intersection Observer API
const stickyNav = entries => {
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver
(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-90px'
})

headerObserver.observe(header);


// Reveal section
const revealSection = (entries, observer) => {
  const [entry] = entries
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver
(revealSection, {
  root: null,
  threshold: 0.15,
})
allSelections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImg, 
{
  root: null,
  threshold: 0,
  rootMargin: '-200px'
});

imgTargets.forEach(img => imgObserver.observe(img)); 


// Slider
const slider = () => {
  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', 
        `<button class="dots__dot" data-slide="${i}"></button>`
      )
    })
  };


  const activateDot = slide => {
    document.querySelectorAll('.dots__dot').forEach(
      dot => dot.classList.remove('dots__dot--active')
    );
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add(
      'dots__dot--active'
    );
  };

  const goToSlide = slide => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    });
  };

  // Next slide
  const nextSlide = () => {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const prevSlide = () => {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  }

  const init = () => {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && prevSlide();
  });

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')){
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

// Dark/Light mode
const changeTheme = theme => {
  if (theme) {
    DarkReader.setFetchMethod(window.fetch)
    DarkReader.enable({
      brightness: 100,
      contrast: 90,
      sepia: 10
  });
    btnTheme.textContent = 'Light mode';
  } else{
    DarkReader.disable();
    btnTheme.textContent = 'Dark mode';
  }
}

let dark = false;
btnTheme.addEventListener('click', event => {
  event.preventDefault();
  changeTheme(!dark);
  dark = !dark;
})


window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}













// SELECTING ELEMENTS

// console.log(document.documentElement); // html
// console.log(document.head); // head, body

// const header = document.querySelector('.header');
// const allSelections = document.querySelectorAll('.section'); 
// // returns NodeList type object -> static

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// // returns HTMLCollection -> live

// // live v static -> live means that changes in the DOM automatically update
// // the collection, while static dont

// console.log(document.getElementsByClassName('btn'));
// // returns HTMLCollection

// // CREATING ELEMENTS

// // .insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality!';
// message.innerHTML = 
// 'We use cookies for improved functionality. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message); // as 1st child of the element
// header.append(message); // as last shild of the parent

// // NOTE, IT CANNOT BE AT 2 PLACES AT THE SAME TIME

// header.before(message); // header.after; before/after element

// // DELETING ELEMENTS
// document.querySelector('.btn--close-cookie').addEventListener(
//   'click', () => message.remove()
//   // message.parentElement.removeChild(message);
// )


// // STYLES

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// // what if we wanna read height property with .style method ?
// // well it wont work, it only works on styles u explicitly defined urself
// // like width or backgroundColor and the reason for this is that .style
// // generates inline css once the page renders

// console.log(getComputedStyle(message).color);

// message.style.height = Number.parseFloat(
//   getComputedStyle(message).height, 10) + 40 + 'px';

// // CSS variables

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// //set/getAttributes => exp. logo.src returns absolute path while
// // getAttribute will return relative

// // Data attrs
// console.log(logo.dataset.versionNumber);

// // Classes
// log.classList.add() //.remove, .toggle, .contains


// SMOOTH SCROLLING

// returns DOMReact obj, containing coords of object compared to viewport
// const s1coords = section1.getBoundingClientRect();
// // get amount of vert and horz scroll, if no scroll x=y=0
// console.log(window.pageXOffset, window.pageYOffset);
// // height/width of viewport
// console.log(
//   document.documentElement.clientHeight,
//   document.documentElement.clientWidth
// );
// // Old school way of doing it
// window.scrollTo(s1coords.left, s1coords.top + window.pageYOffset);
// window.scrollTo({
//   left: s1coords.left + window.pageXOffset,
//   top: s1coords.top + window.pageYOffset,
//   behavior: 'smooth'
// })
// NOTE: left/top property is calculated as total left, 
// not left/top of viewport, thats why we need to add how much we scrolled

// EVENT PROPAGATION 

// const randomInt = (min, max) => 
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () => {
//   return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`
// };

// // they all receive same event object
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // this === e.currentTarget
//   this.style.backgroundColor = randomColor();
//   // stop propagation
//   // e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
// }, true); //-> enable capturing (nav->links->link)

// Page navigation

// document.querySelectorAll('.nav__link').forEach((el) => {
//   el.addEventListener('click', function (event) {
//     event.preventDefault();
//     const id = this.getAttribute('href'); //this.href returns absolute link
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
//   });
// });

// This works, but for each element we attach eventHandler, which means
// we create function for every element which is not very efficient
// Solution -> Event delegation, attach handler on parent element


// DOM Traversing
// const h1 = document.querySelector('h1');

// // going downwards: child
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); 
// // returns nodes-> text, comments, br etc...
// console.log(h1.children);
// // returns HTMLCollection

// h1.firstElementChild.style.color = 'white'

// //going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// //h1.closest('.header').style.background = 'var(--gradient-secondary)'

// // Going sideways: siblings -> only closest siblings
// console.log(h1.previousElementSibling);

// console.log(h1.parentElement.children);

// const obsCallback = (entries, observer) => {
//   entries.forEach(entry => console.log(entry))
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2]
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);