export default class StatFeed extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');
    const contentContainer = this.shadowObj.querySelector('.activities');

    this.fetchStories(contentContainer);
  }

  fetchStories = (contentContainer) => {
    const statLoader = this.shadowObj.querySelector('.loader-container');
    const content = this.getStories();
    setTimeout(() => {
      statLoader.remove();
      contentContainer.insertAdjacentHTML('beforeend', content);
    }, 2000)
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getLoader() {
    return /* html */`
      <div class="loader-container">
        <span id="btn-loader">
          <span class="loader-alt"></span>
        </span>
      </div>
    `
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="activities">
				${this.getLoader()}
      </div>
    `;
  }

  getStories = () => {
    return /* html */`
			<stat-story id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
      <stat-story id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
      <stat-story id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
      <stat-story id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
      <stat-story id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" likes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
		`
  }

  getStyles() {
    return /* css */`
    <style>
      *,
      *:after,
      *:before {
        box-sizing: border-box !important;
        font-family: inherit;
        -webkit-box-sizing: border-box !important;
      }

      *:focus {
        outline: inherit !important;
      }

      *::-webkit-scrollbar {
        width: 3px;
      }

      *::-webkit-scrollbar-track {
        background: var(--scroll-bar-background);
      }

      *::-webkit-scrollbar-thumb {
        width: 3px;
        background: var(--scroll-bar-linear);
        border-radius: 50px;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        padding: 0;
        margin: 0;
        font-family: inherit;
      }

      p,
      ul,
      ol {
        padding: 0;
        margin: 0;
      }

      a {
        text-decoration: none;
      }

      :host {
        font-size: 16px;
        display: flex;
        flex-flow: column;
        gap: 0;
        padding: 5px 0 10px;
        width: 100%;
      }

      div.loader-container {
        position: relative;
        width: 100%;
        height: 150px;
        padding: 20px 0 0 0;
      }

      #btn-loader {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: inherit;
      }

      #btn-loader > .loader-alt {
        width: 35px;
        aspect-ratio: 1;
        --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
        --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
        --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
        --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
        background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
        background-size: 30% 30%;
        animation: l38 .9s infinite ease-in-out;
        -webkit-animation: l38 .9s infinite ease-in-out;
      }

      #btn-loader > .loader {
        width: 20px;
        aspect-ratio: 1;
        --_g: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
        --_g1: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
        --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
        --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
        background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
        background-size: 30% 30%;
        animation: l38 .9s infinite ease-in-out;
        -webkit-animation: l38 .9s infinite ease-in-out;
      }

      @keyframes l38 {
        100% {
          background-position: 100% 0, 100% 100%, 0 100%, 0 0
        }
      }

      .activities {
        display: flex;
        flex-flow: column;
        gap: 0;
        padding: 0;
        width: 100%;
      }

    </style>
    `;
  }
}