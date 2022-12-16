class CollapsibleHeader extends Collapsible {
  constructor() {
    super();
    this.header = this.closest('[data-header]');
    this.headerWrapper = this.closest('#shopify-section-header');
    if (this.header) {
      this.inverse = !!this.header.classList.contains('header--inverse');
      this.shadow = this.header.querySelector('.header-shadow');

      // extra events
      this.shadow?.addEventListener('click', this.closeAll.bind(this));
    }
  }

  events() {
    if (!this.header) {
      super.events();
    }
  }

  open(group) {
    super.open(group);
    if (this.headerWrapper) {
      this.headerWrapper.classList.add('shopify-section-header--open');
    }
    this.toggleHeaderClass(true);
  }

  close(group) {
    super.close(group);
    if (this.headerWrapper) {
      this.headerWrapper.classList.remove('shopify-section-header--open');
    }
    this.toggleHeaderClass(false);
  }

  closeSiblings(currentGroup = null) {
    super.closeSiblings(currentGroup);
    this.toggleHeaderClass(false);
  }

  openAll() {
    super.openAll();
    this.toggleHeaderClass(true);
  }

  closeAll() {
    super.closeAll();
    this.toggleHeaderClass(false);
  }

  toggleHeaderClass(open = true) {
    if (!this.header) {
      return false;
    }

    if (open) {
      // set header open
      document.body.classList.add('header-is-open');
    } else {
      // set header closed if all menu items are closed
      let close = true;
      this.groups.forEach((group) => {
        if (group.classList.contains(this.options.toggleClass)) {
          close = false;
        }
      });
      if (close) {
        document.body.classList.remove('header-is-open');
      }
    }
  }
}

class ToggleMobileNavigation extends ToggleElementClass {

  constructor() {
    super();

    this.header = this.closest('[data-header]');
    this.headerWrapper = this.closest('#shopify-section-header');

    if (this.header) {
      this.shadow = this.header.querySelector('.header-shadow');
      this.inverse = !!this.header.classList.contains('header--inverse');

      // Extra events
      document.addEventListener('keyup', (event) => {
        this.onKeyUp(event);
      });

      this.shadow?.addEventListener('click', (event) => {
        this.remove(event);
      });
    }
  }

  events() {
    if (!this.header) {
      super.events();
    }
  }

  onKeyUp(event) {
    if (!document.body.classList.contains('header-is-open')) {
      return;
    }
    if(event?.code.toUpperCase() !== 'ESCAPE') {
      return;
    }
    const { toggleClass } = this.options;
    if (this.target?.classList.contains(toggleClass)) {
      this.remove();
    }
  }

  add() {
    super.add();
    trapFocus(this.header);
  }

  remove() {
    super.remove();
    this.closeAllSibblings();
    removeTrapFocus();
  }

  closeAllSibblings() {
    const collapsibles = this.target.querySelector('collapsible-element');
    collapsibles.closeAll();
  }
}


class ToggleSearch extends ToggleElementClass {
  constructor() {
    super();
  }

  construct() {
    super.construct();

    // elements
    this.header = this.closest('[data-header]');

    // options
    const { toggleClass, target } = this.options;

    // key up escape
    document.addEventListener('keyup', (event) => {
      this.onKeyUp(event);
    });

    // Remove classes incase the header navigation drawer is open.
    this.addEventListener('click', () => {
      document.body.classList.remove('header-is-open');
      document.body.classList.remove('menu-drawer-is-open');
      // Focus on input element if provided
      if(this.options.focusTarget) {
        document.querySelector(this.options.focusTarget)?.focus();
      }
    });

  }

  onKeyUp(event) {
    if (!document.body.classList.contains('header-search-is-open')) {
      return;
    }
    if(event?.code.toUpperCase() !== 'ESCAPE') {
      return;
    }
    const { toggleClass } = this.options;
    if (this.target?.classList.contains(toggleClass)) {
      this.remove();
    }
  }

  add() {
    super.add();
    if (this.header) {
      document.body.classList.add('header-search-is-open');
    }
    if (this.target) {
      trapFocus(this.target);
    }
  }

  remove() {
    super.remove();
    if (this.header) {
      document.body.classList.remove('header-search-is-open');
    }
    removeTrapFocus();
  }

}

class StickyHeader extends HTMLElement {
  constructor() {
    super();

    // select element
    this.headerElement = this;
    this.header = document.querySelector('[data-header]');
    this.headerWrapper = document.querySelector('#shopify-section-header');
    this.announcementBar = document.querySelector('#shopify-section-announcement-bar');
    this.headerInverse = !!this.headerElement.classList.contains('header--inverse');
    this.headerNav = this.querySelector('collapsible-header');
    this.mobileNav = this.querySelector('toggle-mobile-navigation');
    this.search = this.querySelector('[data-header-search]');
    this.searchToggle = this.querySelector('toggle-search');
    this.productInfo = document.querySelector('[data-product-info]')

    if (this.headerWrapper) {
      // scroll parameters
      this.currentScrollTop = 0;
      this.scrollOffset = 0;
      this.headerStart = 0;

      if (this.announcementBar) {
        const announcementBarHeight = this.announcementBar.offsetHeight;
        this.scrollOffset += announcementBarHeight;
        this.headerStart += announcementBarHeight;
      }

      if (this.headerElement) {
        //this.scrollOffset += this.headerElement.offsetHeight;
      }

      // scroll event
      this.raf = null; // Safe request animation frame
      this.timer = null, // Safe scroll timer

      window.addEventListener('scroll', () => {
        clearTimeout(this.timer);
        if (!this.raf) {
          // A request animation frame is used to animate on max 60fps.
          this.raf = requestAnimationFrame(this.scrollAnimation.bind(this));
        }
        this.timer = setTimeout(() => {
          // Stop animation, cancel request animation frame
          cancelAnimationFrame(this.raf);
          this.raf = null;
        }, 25);
      }, false);

    }
  }

  scrollAnimation() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // only animate if header is closed.
    //if (!document.body.classList.contains('header-is-open')) {
      if((scrollTop + window.innerHeight) > document.body.clientHeight) {
        this.hide();
      } else if (scrollTop > this.currentScrollTop && scrollTop > this.scrollOffset) {
        this.hide();
      } else if (scrollTop <= this.headerStart) {
        this.revealTop();
      } else if (scrollTop < this.currentScrollTop && scrollTop > this.headerStart) {
        this.reveal();
        this.hide();
      }
    //}

    this.currentScrollTop = scrollTop;

    // Recall request animation loop
    this.raf = requestAnimationFrame(this.scrollAnimation.bind(this));
  }

  hide() {
    this.headerWrapper.classList.add('shopify-section-header--sticky');
    this.closeHeaderNav();
    this.closeMobileNav();
    this.closeSearch();
    this.productInfoPosition('up');
  }

  reveal() {
    this.headerWrapper.classList.add('shopify-section-header--sticky', 'shopify-section-header--animate');
    this.productInfoPosition('down');
  }

  revealTop() {
    this.headerWrapper.classList.remove('shopify-section-header--sticky', 'shopify-section-header--animate');
    this.productInfoPosition('up');
  }

  closeHeaderNav() {
    if (!this.headerNav || window.innerWidth < 768) {
      return false;
    }
    this.headerNav.closeAll();
  }

  closeMobileNav() {
    if(!this.mobileNav) {
      return false;
    }
    this.mobileNav.remove();
  }

  closeSearch() {
    if (!this.search || !this.searchToggle) {
      return false;
    }
    if (this.search.classList.contains('header__search--is-active')) {
      this.searchToggle.remove();
    }
  }

  productInfoPosition(pos = 'up') {
    if (!this.productInfo) {
      return;
    }
    if (pos == 'down') {
      this.productInfo.classList.add('product-info-col--sticky-with-header');
    } else {
      this.productInfo.classList.remove('product-info-col--sticky-with-header');
    }
  }

}

if (!customElements.get('collapsible-header')) {
  customElements.define('collapsible-header', CollapsibleHeader);
}

if (!customElements.get('toggle-mobile-navigation')) {
  customElements.define('toggle-mobile-navigation', ToggleMobileNavigation);
}

if (!customElements.get('toggle-search')) {
  customElements.define('toggle-search', ToggleSearch);
}

if (!customElements.get('sticky-header')) {
  customElements.define('sticky-header', StickyHeader);
}