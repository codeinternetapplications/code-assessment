const footerButtons = document.querySelectorAll('.footer-button');

footerButtons.forEach((button, i) => {
  button.addEventListener('click', () => toggleFooter(i));
});

const toggleFooter = (i) => {
  const footerItems = document.getElementsByClassName('footer-items')[i];

  footerItems.classList.contains('visible')
    ? footerItems.classList.remove('visible')
    : footerItems.classList.add('visible');
};
