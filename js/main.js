document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  const cp = window.location.pathname;
  document.querySelectorAll('.nav-links a, .sub-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (cp === href || (href !== '/' && cp.startsWith(href)))) {
      link.classList.add('active');
    }
  });
});
