/*
Make a collapsible webcompontent. Great for making a collapsible footer navigation on mobile (for example ;) ).

HTML Usage:
<collapsible-element data-options='{}' data-collapsible-group>
  <button type="button" class="button" data-collapsible-trigger>
    <span>Collapsible button 1</span>
    <div data-collapsible-trigger-icon>
      <svg class="icon icon-plus icon--sm" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation"  width="16" height="16" viewBox="0 0 16 16">
        <path fill="currentColor" d="M13.32 7.54H8.53V2.68h-.91v4.86H2.68v.92h4.94v4.86h.91V8.46h4.79v-.92z"/>
      </svg>
      <svg class="icon icon-minus icon--sm" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" width="16" height="16" viewBox="0 0 16 16">
        <path fill="currentColor" d="M2.71 7.55H13.3v.91H2.71z"/>
      </svg>
    </div>
  </button>
  <div data-collapsible-target>
    My content
  </div>
</div>
</collapsible-element>

HTML Usage with multiple & nested groups:
<collapsible-element data-options='{}'>
  <div data-collapsible-group> ... </div>
  <div data-collapsible-group>
    <button data-collapsible-trigger> ... </button>
    <div data-collapsible-target>
      <div data-collapsible-group> ... </div>
    </div>
  </div>
</div>
</collapsible-element>
*/

if (!customElements.get('collapsible-element')) {

  class Collapsible extends HTMLElement {

    constructor() {
      super();

      // Options
      this.options = {
        toggleClass: "collapsible-is-open",
        toggleBodyClass: "",
        closeSiblings: false,
        closeChildren: true,
        onHover: false,
        hoverDelay: 0,
        closeOnMouseleave: false
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
        clickTarget: (e) => this.debounceClickEvent(e),
        mouseEnterTarget: (e) => this.debouncedOnMouse(e, 'open'),
        mouseLeaveGroup: (e) => this.debouncedOnMouse(e, 'close'),
        mouseLeaveContainer: (e) => this.debouncedOnMouse(e, 'closeAll')
      }

      this.timeout = null;

      // Construct webcomponent
      this.construct();

    }

    /*
      Construct webcomponent
    */
    construct() {
      // Init elements
      this.groups = this.hasAttribute('data-collapsible-group')
        ? [ this.closest('[data-collapsible-group]') ]
        : this.querySelectorAll('[data-collapsible-group]');
      this.triggers = this.querySelectorAll('[data-collapsible-trigger]');

      // Init events
      // Trigger events on [data-collapsible-trigger]
      this.triggers.forEach((trigger) => {
        trigger.removeEventListener('click', this.reducer.clickTarget);
        trigger.addEventListener('click', this.reducer.clickTarget);

        // Mouse enter
        if (this.options.onHover) {
          trigger.removeEventListener('mouseenter', this.reducer.mouseEnterTarget);
          trigger.addEventListener('mouseenter', this.reducer.mouseEnterTarget);
        }
      });

      // Trigger events on [data-collapsible-group]
      this.groups.forEach((group) => {
        // Mouse leave
        if (this.options.onHover) {
          group.removeEventListener('mouseleave', this.reducer.mouseLeaveGroup);
          group.addEventListener('mouseleave', this.reducer.mouseLeaveGroup);
        }
      });

      // Trigger mouseleave on container <collapsible-element>
      if (this.options.closeOnMouseleave) {
        this.removeEventListener('mouseleave', this.reducer.mouseLeaveContainer);
        this.addEventListener('mouseleave', this.reducer.mouseLeaveContainer);
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
      const buttonType = e.currentTarget.nodeName.toLowerCase();
      const group = e.currentTarget.closest('[data-collapsible-group]');
      // only toggle if is closed or target is not an <a> tag
      if (!group.classList.contains(this.options.toggleClass) || buttonType != 'a') {
        e.preventDefault();
        this.toggle(group);
      }
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

      // clear old trigger
      clearTimeout(this.timeout);

      // add new trigger
      this.timeout = setTimeout(() => {
        const group = e?.target?.closest('[data-collapsible-group]');
        switch(type) {
          case 'open':
            this.open(group);
            break;
          case 'close':
            this.close(group);
            break;
          case 'closeAll':
            this.closeAll();
            break;
          default:
            break;
        }
      }, this.options.hoverDelay);

    }

    /*
      Open collapsible group
      @param group {node}: group selector
    */
    open(group) {
      if (!group) {
        return false;
      }

      // Close sibblings if option is on
      this.options.closeSiblings && this.closeSiblings(group);

      // Open active group
      group.classList.add(this.options.toggleClass);

      // Add body class
      this.toggleBodyClass(true);
    }

    /*
      close collapsible group,
      @param group {node}: group selector
    */
    close(group) {
      if (!group) {
        return false;
      }

      // Close active group
      group.classList.remove(this.options.toggleClass);

      // Close child collapsibles
      if (this.options.closeChildren) {
        group.querySelectorAll('[data-collapsible-group]').forEach((group) => {
          this.close(group);
        });
      }

      // Remove body class
      this.toggleBodyClass(false);
    }

    /*
      Toggle controller, open / close collapsibles
      @param group {node}: group selector
    */
    toggle(group) {
      if (!group) {
        return false;
      }

      // Check if already open
      if (!group.classList.contains(this.options.toggleClass)) {
        // Open
        this.open(group);
      } else {
        // Close
        this.close(group);
      }
    }

    /*
      Close all sibling collapsibles
      @param currentGroup {node}: current group selector
    */
    closeSiblings(currentGroup = null) {
      this.groups.forEach((group) => {
        if (group !== currentGroup && !group.contains(currentGroup) && !currentGroup.contains(group)) {
          this.close(group);
        }
      });
    }

    /*
      Open+ all collapsibles
    */
    openAll() {
      this.groups.forEach((group) => {
        group.classList.add(this.options.toggleClass);
      });

      // Add body class
      this.toggleBodyClass(true);
    }

    /*
      Close all collapsibles
    */
    closeAll() {
      this.groups.forEach((group) => {
        group.classList.remove(this.options.toggleClass);
      });

      // Remove body class
      this.toggleBodyClass(false);
    }

    /*
      Toggle body class
      @param add {boolean}: true/false
    */
    toggleBodyClass(add) {
      if (!this.options.toggleBodyClass) {
        return false;
      }
      if (add) {
        document.querySelector('body').classList.add(this.options.toggleBodyClass);
      } else {
        document.querySelector('body').classList.remove(this.options.toggleBodyClass);
      }
    }

  }

  window.Collapsible = Collapsible;

  customElements.define('collapsible-element', Collapsible);

}
