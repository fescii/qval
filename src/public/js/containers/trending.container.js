export default class TrendingContainer extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('.stories');

    this.fetchStories(contentContainer);
  }

  fetchStories = (contentContainer) => {
    const storyLoader = this.shadowObj.querySelector('story-loader');
    const content = this.getStories();
    let str = this.getAttribute('topic').toLocaleLowerCase();
    const more = `
      <a class="more" href="/topic/${this.getAttribute('topic-name')}">
        Explore more on ${str.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase())}
      </a>
    `
    setTimeout(() => {
      storyLoader.remove();
      contentContainer.insertAdjacentHTML('beforeend', content);
      contentContainer.insertAdjacentHTML('beforeend', more);
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
			<div class="stories new">
        <div class="title">
          <h2>
            <a href="/topics/${this.getAttribute('topic-name')}">
              ${this.getAttribute('topic')}
            </a>
          </h2>
          <span class="info">
            <a href="/t/${this.getAttribute('topic-id')}">
              ${this.getAttribute('topic-id')}
            </a>
            <span class="sp">•</span>
            <span class="no">${this.getAttribute('stories')}</span>
            <span class="text">stories</span>
          </span>
        </div>
				${this.getLoader()}
      </div>
    `;
  }

  getStories = () => {
    return /* html */`
			<story-wrapper story="story" id="P0A43PBA" views="609" time="2024-03-13T13:00:00+03:00"
        story-title="The US Senate called on the law markers"
        read-time="6" author-username="U0A43PBA" author-img="img/img.jpg"
        author-verified="true" author-name="Fredrick Ochieng"
        author-bio="Student At The East African University"
        author-followers="23" following="false">
      </story-wrapper>
      <story-wrapper story="reply" upvotes="9" id="P0A43PBA" upvoted="true"
	      views="609" time="2022-01-03T13:00:00+03:00"
	      story-title="The US Senate called on the law markers"
	      read-time="6" author-username="U0A43PBA" author-img="img/img.jpg"
	      author-verified="true" author-name="Fredrick Ochieng"
	      author-bio="Student At The East African University"
	      author-followers="23" following="true">
	    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, voluptas ratione! Corporis, enim accusantium possimus minima eum illo atque dolorum provident nisi.
	    Facilis nulla optio quas quod veniam nam voluptas!
	    </story-wrapper>
	    <story-wrapper story="story" id="P0A43PBA" views="609" time="2024-03-13T13:00:00+03:00"
        story-title="Lorem ipsum dolor sit amet consectetur adipisicing elit"
        read-time="6" author-username="U0A43PBA" author-img="img/img.jpg"
        author-verified="true" author-name="Fredrick Ochieng"
        author-bio="Student At The East African University"
        author-followers="23" following="false">
      </story-wrapper>
      <story-wrapper story="story" id="P0A43PBA"
        views="609" time="2022-01-03T13:00:00+03:00" story-title="The US Senate called on the law markers"
        read-time="6" author-username="U0A43PBA" author-img="img/img.jpg" author-verified="true" author-name="Fredrick Ochieng"
        author-bio="Student At The East African University" author-followers="23" following="false">
      </story-wrapper>
      <story-wrapper story="reply" id="P0A43PBA" upvotes="3" upvoted="false"
        views="609" time="2022-01-03T13:00:00+03:00" story-title="The US Senate called on the law markers"
        read-time="6" author-username="U0A43PBA" author-img="img/img.jpg" author-verified="true" author-name="Fredrick Ochieng"
        author-bio="Student At The East African University" author-followers="23" following="true">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, voluptas ratione! Corporis, enim accusantium possimus minima eum illo atque dolorum provident nisi.
      Facilis nulla optio quas quod veniam nam voluptas!
      </story-wrapper>
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
          width: 100%;
        }

        div.stories {
          /* border: 1px solid #000000; */
          padding: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        a.more {
          border-bottom: var(--border);
          padding: 10px 0;
          text-decoration: none;
          font-family: var(--font-text), sans-serif;
          color: var(--gray-color);
          gap: 0;
        }

        a.more:hover {
          /* border: 1px solid #000000; */
          text-decoration: underline;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
          gap: 0;
        }

        div.stories > .title {
          border-bottom: var(--border);
          padding: 0 0 15px 0;
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          color: var(--text-color);
          gap: 0;
        }

        div.stories > .title > .info {
          /* border: 1px solid #000000; */
          padding: 0;
          display: flex;
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-mono), monospace;
          gap: 5px;
        }

        div.stories > .title > .info > span.no {
          /* border: 1px solid #000000; */
          padding: 0;
          font-size: 0.85rem;
          font-family: var(--font-mono), monospace;
        }

        div.stories > .title > .info > a {
          /* border: 1px solid #000000; */
          text-decoration: none;
          color: transparent;
          padding: 0;
          font-size: 0.85rem;
          font-family: var(--font-mono), monospace;
          background: var(--second-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        div.stories > .title > .info > span.text {
          /* border: 1px solid #000000; */
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-text), sans-serif;
        }

        div.stories > .title > h2 {
          /* border: 1px solid #000000; */
          text-transform: capitalize;
          padding: 0;
          margin: 0;
          line-height: 1.5;
          font-weight: 500;
          font-size: 1.3rem;
          gap: 0;
        }

        div.stories > .title > h2 > a {
          /* border: 1px solid #000000; */
          text-decoration: none;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
          gap: 0;
        }

        @media screen and (max-width:660px) {
          a.more,
          div.stories > .title {
            border-bottom: var(--border-mobile);
          }

          a,
          .stats > .stat {
            cursor: default !important;
          }
        }

      </style>
    `;
  }
}