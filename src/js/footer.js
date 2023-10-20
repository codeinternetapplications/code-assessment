class CollapsibleFooter extends Collapsible {
  constructor() {
    super();
    if (!this.options.breakpoint) {
      this.options.breakpoint = parseInt(768);
    }
    this.windowWidth = window.innerWidth;
    this.displayDetails();
  }

  construct() {
    super.construct();

    window.addEventListener('resize', () => {
      if (this.windowWidth == window.innerWidth) {
        return
      }
      this.windowWidth = window.innerWidth;
      this.displayDetails();
    });
  }

  open(group) {
    if (window.innerWidth < this.options.breakpoint) {
      super.open(group);
    }
  }

  close(group) {
    if (window.innerWidth < this.options.breakpoint) {
      super.close(group);
    }
  }

  displayDetails() {
    if (window.innerWidth >= this.options.breakpoint) {
      this.openAll();
    } else {
      this.closeAll();
    }
  }

  // Additional method to handle opening and closing of footer elements
  handleFooterMenu() {
    const headings = document.querySelectorAll('.footer-block--menu__link.level-1');

    headings.forEach(heading => {
      heading.addEventListener('click', () => {
        const submenu = heading.nextElementSibling;
        submenu.classList.toggle('collapsed');
      });
    });
  }
}

if (!customElements.get('collapsible-footer')) {
  customElements.define('collapsible-footer', CollapsibleFooter);
}
