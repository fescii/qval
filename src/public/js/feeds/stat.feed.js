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
    const storyLoader = this.shadowObj.querySelector('story-loader');
    const content = this.getStories();
    setTimeout(() => {
      storyLoader.remove();
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

  getLoader = () => {
    return `
			<story-loader speed="300"></story-loader>
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
			<stat-story id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
      <stat-story id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
      <stat-story id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
      <stat-story id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile. Something here...">
      </stat-reply>
      <stat-story id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
        content="This is a story about how you added an article to your profile."
        >
      </stat-story>
      <stat-reply id="256" upvotes="609" views="531" date="2021-08-12T12:00:00Z"
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
        padding: 0;
        width: 100%;
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