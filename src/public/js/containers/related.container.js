export default class RelatedContainer extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('div.content');

    this.fetchTopics(contentContainer);
  }

  fetchTopics = contentContainer => {
    //Get type of stories to fetch
    const type = this.getAttribute('type') || 'story';

    const topicsLoader = this.shadowObj.querySelector('post-loader');
    const content = this.getContent(type);
    setTimeout(() => {
      topicsLoader.remove();
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
			<post-loader speed="300"></post-loader>
		`
  }

  getBody = () => {
    // language=HTML
    return /* html */`
			<div class="content">
				${this.getLoader()}
			</div>
    `;
  }

  getTitle = type => {
    switch (type) {
      case 'top':
        return 'Trending stories';
      case 'latest':
        return 'Latest stories';
      case 'related':
        return 'Related stories';
      default:
        return 'Trending stories';
    }
  }

  getContent = type => {
    return /* html */`
			<div class="related">
        <p class="title">${this.getTitle(type)}</p>
        <div class="stories">
          ${this.getStories()}
        </div>
      </div>
		`
  }

  getStories = () => {
    return /* html */`
      
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
          margin: 0;
				  display: flex;
				  flex-flow: column;
				}

				div.content {
				  margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: row;
				  flex-wrap: wrap;
				  align-items: center;
				  justify-content: start;
				  gap: 10px;
				  width: 100%;
				}

				.related {
          background-color: var(--background);
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 2px;
        }

        .related > p.title {
          padding: 0;
          color: var(--text-color);
					font-family: var(--font-main), sans-serif;
				  font-size: 1rem;
					font-weight: 500;
				  line-height: 1;
          margin: 0;
        }

        .related > .stories {
          list-style-type: none;
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .related > ul.stories li.story {
          text-decoration: none;
          padding: 10px 0 0 0;
          display: flex;
        }

        .related > ul.stories li.story a {
          text-decoration: none;
          display: flex;
          flex-flow: column;
          color: var(--gray-color);
        }

        .related > ul.stories li.story a span.title {
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-weight: 400;
          font-size: 1rem;
        }

        .related > ul.stories li.story a:hover > span.title {
          color: var(--read-color);
        }

        .related > ul.stories li.story a span.date {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.4;
          font-size: 0.8rem;
        }

				@media screen and (max-width:660px) {
					:host {
        		font-size: 16px;
						padding: 15px 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
  }
}