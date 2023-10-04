let isCollapsible = false;

const toggleHidden = (element) => {
  if (element.style.display === "none") element.style.display = "";
  else element.style.display = "none";
};

const makeCollapsible = () => {
  if (isCollapsible) return;

  const footerMenus = document.querySelectorAll(
    ".footer-block--menu__item.level-1"
  );

  footerMenus.forEach((footerMenu) => {
    const link = footerMenu.querySelector(".footer-block--menu__link.level-1");
    const list = footerMenu.querySelector(".footer-block--menu__list.level-2");
    if (link) {
      link.addEventListener("click", () => {
        if (isCollapsible) {
          toggleHidden(list);
        }
      });
    }
  });

  isCollapsible = true;
};

const mediaQuery = window.matchMedia("( max-width: 768px )");

if (mediaQuery.matches) {
  makeCollapsible();
}

mediaQuery.addListener((e) => {
  if (e.matches) {
    makeCollapsible();
  } else {
    isCollapsible = false;
  }
});
