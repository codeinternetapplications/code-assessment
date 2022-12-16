
/*
Toggle class on another element.

HTML Usage:
<toggle-element-class data-options='{}'>
  Toggle element class button
</toggle-element-class>
*/

if (!customElements.get('toggle-element-class')) {
  class ToggleElementClass extends HTMLElement {

    constructor() {
      super();

      // Options
      this.options = {
        toggleClass: "toggle--is-active",
        toggleTriggerClass: "",
        target: "body",
        onHover: false,
        hoverDelay: 0,
        preventDefault: true,
        stopPropagation: true,
        ariaExpanded: false,
      }

      // Get options from element data and combine with this.options
      if (this?.dataset?.options) {
        const dataOptions = JSON.parse(this.dataset.options);
        this.options = {
          ...this.options,
          ...dataOptions
        };
      }

      // Reduce actions (So the event can also be removed)
      this.reducer = {
        click: (e) => this.debounceClickEvent(e),
        mouseEnter: (e) => this.debouncedOnMouse(e, 'add'),
        mouseLeave: (e) => this.debouncedOnMouse(e, 'remove')
      }

      // Construct webcomponent
      this.construct();
    }

    /*
      Construct webcomponent
    */
    construct() {
      this.target = document.querySelector(this.options.target);

      if (!this.target) {
        return false;
      }

      // Click
      this.removeEventListener('click', this.reducer.click);
      this.addEventListener('click', this.reducer.click);

      // Mouse enter and leave
      if (this.options.onHover) {
        this.removeEventListener('mouseenter', this.reducer.mouseEnter);
        this.addEventListener('mouseleave', this.reducer.mouseLeave);
      }

    }

    /*
      Debounce click event
      @param e {object}: mouseevent
      Called by add event listener -> reducer.
    */
    debounceClickEvent(e) {
      if (!e) {
        return false;
      }
      this.preventDefault(e);
      this.stopPropagation(e);
      this.toggle();
    }

    /*
      Debounced mouse event
      @param e {object}: mouseevent
      @param type {string}: open/close/closeAll
      Called by add event listener -> reducer.
    */
    debouncedOnMouse(e, type) {
      if (!e) {
        return false;
      }
      const debouncer = debounce((type) => {
        switch(type) {
          case 'add':
            this.add();
            break;
          case 'remove':
            this.remove();
            break;
          default:
            this.toggle();
            break;
        }
      }, this.options.hoverDelay);
      debouncer(type);
    }

    // @param e {object}: click event
    preventDefault(e) {
      if (this.options.preventDefault) {
        e.preventDefault();
      }
    }

    // @param e {object}: click event
    stopPropagation(e) {
      if (this.options.stopPropagation) {
        e.stopPropagation();
      }
    }

    add() {
      const { toggleClass, toggleTriggerClass } = this.options;
      if (this.target) {
        this.target.classList.add(toggleClass);
      }
      if (toggleTriggerClass) {
        this.classList.add(toggleTriggerClass);
      }
      // Switch aria-expanded
      if (this.options.ariaExpanded) {
        this.setAttribute('aria-expanded', true);
      }
    }

    remove() {
      const { toggleClass, toggleTriggerClass } = this.options;
      if (this.target) {
        this.target.classList.remove(toggleClass);
      }
      if (toggleTriggerClass) {
        this.classList.remove(toggleTriggerClass);
      }
      // Switch aria-expanded
      if (this.options.ariaExpanded) {
        this.setAttribute('aria-expanded', false);
      }
    }

    toggle() {
      const { toggleClass } = this.options;
      if (!this.target) {
        return false;
      }
      if (!this.target.classList.contains(toggleClass)) {
        this.add();
      } else {
        this.remove();
      }
    }

  }

  window.ToggleElementClass = ToggleElementClass;

  customElements.define('toggle-element-class', ToggleElementClass);

}