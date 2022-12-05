/**
 * SwiperSlider
 * @description Web component used to create sliders, configurable with data-options attribute.
 * @documentation https://swiperjs.com/swiper-api
 * @example 
<swiper-slider>
  <div 
    class="swiper" 
    data-swiper
    data-options='{
      "threshold": 10,
      "loop": false,
      "scrollbar": true,
      "navigation": {
        "nextEl": ".swiper-button-next-{{ section.id }}",
        "prevEl": ".swiper-button-prev-{{ section.id }}"
      },
      "pagination": {
        "el": ".swiper-pagination-{{ section.id }}",
        "type": "bullets"
      },
      "slidesPerView": 1,
      "spaceBetween": 16,
      "breakpoints": {
        "768": {
          "slidesPerView": 2,
          "spaceBetween": 24
        },
        "1024": {
          "slidesPerView": 3,
          "spaceBetween": 32
        }
      }
    }'
  >
    <div class="swiper-wrapper">
      {%- for item in (1..8) -%}
        <div class="swiper-slide" data-swiper-slide-index="{{ forloop.index }}">
          <h2>
            Your slide
          </h2>
        </div>
      {%- endfor -%}
    </div>
    <div class="swiper-pagination swiper-pagination-{{ section.id }}"></div>
    <button type="button" class="swiper-button-prev swiper-button-prev-{{ section.id }}" aria-label='{% render "format-translation", namespace: "accessibility", key: "previous_slide", fallback: "Previous slide" %}'>
      {%- render 'global-icon', icon: 'chevron-left', icon_size: 'sm' -%}
    </button>
    <button type="button" class="swiper-button-next swiper-button-next-{{ section.id }}" aria-label='{% render "format-translation", namespace: "accessibility", key: "next_slide", fallback: "Next slide" %}'>
      {%- render 'global-icon', icon: 'chevron-right', icon_size: 'sm' -%}
    </button>
    <div class="swiper-scrollbar"></div>
  </div>
</swiper-slider>
 */

(async () => {

  
  if (!customElements.get('swiper-slider')) {

    const { default: Swiper, Navigation, Pagination, Scrollbar, Autoplay } = await import("./ext/swiper.esm.async.js");
    
    Swiper.use([
      Navigation,
      Pagination,
      Scrollbar,
      Autoplay
    ]);
    
    class SwiperSlider extends HTMLElement {
      constructor() {
        super();
        this.swiper = this.querySelector('[data-swiper]');
        
        // Stop when the swiper is not found
        if(!this.swiper) {
          return;
        }

        // Default to improve user experience
        this.swiperOptions = {
          threshold: 10
        };
        
        // Check if we have extra options on the HTML
        if (this.swiper.dataset.options) {
          const options = JSON.parse(this.swiper.dataset.options);
          if (options) {
            this.swiperOptions = {
              ...this.swiperOptions,
              ...options
            }
          }
        }

        // Call swiper with selected swiper element and options
        this.swiperInstance = new Swiper(this.swiper, this.swiperOptions);
  
        /**
        * Listen to extra events when in Shopify editor
        */
        if (Shopify.designMode) {
  
          // Update the swiper when the section event is triggerd
          window.addEventListener('shopify:section:load', (event) => {
            this.swiperInstance.update();
            if (this.swiperOptions.navigation) {
              this.swiperInstance.navigation.init();
              this.swiperInstance.navigation.update();
            }
          });
          
          // When on block select go to the slide in front-end
          window.addEventListener('shopify:block:select', (event) => {
            this.swiperInstance.update();
            if (this.swiperOptions.navigation) {
              this.swiperInstance.navigation.init();
              this.swiperInstance.navigation.update();
            }
            this.handleBlockSelect(event);
          });
  
          // When on block deselect go to the slide in front-end
          window.addEventListener('shopify:block:deselect', (event) => {
            this.swiperInstance.update();
            if (this.swiperOptions.navigation) {
              this.swiperInstance.navigation.init();
              this.swiperInstance.navigation.update();
            }
            this.handleBlockSelect(event);
          });
  
        }
        
      }
      
      /**
      * Handles the theme editor block change/edit event
      * @param {Object} event
      */
      handleBlockSelect(event) {
  
        // Check if the slide index is set
        if (!("swiperSlideIndex" in event.target.dataset)) { return; }
  
        // Set the slide index based on loop settings or not
        let swipeToSlideIndex = parseInt(event.target.dataset.swiperSlideIndex) - 1;
        if(this.swiperOptions.loop) {
          swipeToSlideIndex = parseInt(event.target.dataset.swiperSlideIndex) + 1;
        }
  
        // Slide to slide based on the data attribute from the target
        this.swiperInstance.slideTo(swipeToSlideIndex, 1000);
        
      }
      
    }
    
    window.SwiperSlider = SwiperSlider;
    
    customElements.define('swiper-slider', SwiperSlider);
    
  }
  
})();