/** Use as: 
  <div is="custom-video" class="video-wrapper">
    <div class="img (img--double or img--landscape) img--cover">
      <video {% if video_placeholder != blank %}poster="{{ video_placeholder | img_url: 'master' }}"{% endif %} preload muted playsinline> 
        <source src="{{- video_url -}}" type="video/mp4" />
      </video>
      <button class="button button--link" data-video-play-button>
        {%- render 'global-icon', icon: 'play' -%}
      </button>
    </div>
  </div>

  Note that custom elements cannot be used in a page template, hence the is="custom-video" property. This needs a polyfill for iOS!!! 
*/

class CustomVideo extends HTMLDivElement {
  constructor(videoElement,videoTrigger) {
    super();

    // Get options from element data and combine with this.options
    if (this?.dataset?.options) {
      this.options = JSON.parse(this.dataset.options);
    }

    this.videoElement = this.querySelector('video');
    this.videoTrigger = this.querySelector('[data-video-trigger]');

    // video and button click
    [this.videoTrigger, this.videoElement].forEach(element => element.addEventListener('click', (e) => this.loadVideo(e)));
  }

  // when video is manually paused, add data attribute to keep track of paused state
  loadVideo(e) {
    e.preventDefault();
    if (this.videoElement.paused) {
      this.playVideo();
    }
    else {
      this.pauseVideo();
    }
  }

  playVideo() {
    this.videoTrigger.classList.add('hidden');
    this.videoElement.play();
    this.videoElement.controls = true;
  }

  pauseVideo() {
    this.videoTrigger.classList.remove('hidden');
    this.videoElement.pause();
    this.videoElement.controls = false;
  }
}

if (!customElements.get('custom-video')) {
  customElements.define('custom-video', CustomVideo, { extends: 'div' });
}