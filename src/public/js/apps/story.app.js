export default class AppStory extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.topics = this.getTopics();

    this._content = this.innerHTML

    this.render();
  }


  getTopics = () => {
    // get the topics
    let topics = this.getAttribute('topics');

    // 
    return topics ? topics.split(',') : ['story'];
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Change style to flex
    this.style.display='flex';

    // Get mql object
    const mql = window.matchMedia('(max-width: 660px)');

    this.watchMediaQuery(mql);
  }

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {
      // Re-render the component
      this.render();
    });
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function () { };
  }

  getDate = isoDateStr => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getTop()}
        <div class="content" id="content-container">
          ${this.getStoryBody()}
          ${this.getSection()}
        </div>
      `;
    }
    else {
      return /* html */`
        <div class="content" id="content-container">
          ${this.getTop()}
          ${this.getStoryBody()}
          ${this.getSection()}
        </div>

        <section class="side">
          ${this.getAuthor()}
          ${this.getRelatedStories()}
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Story" type="story"
        user-url="${this.getAttribute('user-url')}" auth-url="${this.getAttribute('auth-url')}"
        url="${this.getAttribute('story-url')}" search-url="${this.getAttribute('search-url')}">
      </header-wrapper>
    `
  }

  getStoryBody = () => {
    let str = this.topics[0];
    let formatted = str.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
    // Show HTML Here
    return /* html */ `
      <story-section topic="${formatted}" hash="${this.getAttribute('hash')}" url="${this.getAttribute('url')}"
        story-title="${this.getAttribute('story-title')}" replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
        views="${this.getAttribute('views')}" time="${this.getAttribute('time')}" author-you="${this.getAttribute('author-you')}"
        author-hash="${this.getAttribute('author-hash')}" author-img="${this.getAttribute('author-img')}" author-name="${this.getAttribute('author-name')}"
        author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
        author-verified="${this.getAttribute('author-verified')}" author-url="${this.getAttribute('author-url')}"
        author-bio="${this.getAttribute('author-bio')}">
        ${this.textContent}
      </story-section>
    `
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper hash="${this.getAttribute('author-hash')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
       verified="${this.getAttribute('author-verified')}" url="${this.getAttribute('author-url')}"
       bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getRelatedStories = () => {
    return /* html */`
			<related-container type="related" limit="5" topics='${this.getAttribute("topics")}'>
      </related-container>
		`
  }

  getSection = () => {
    return /* html */`
      <post-section url="${this.getAttribute('url')}" active="${this.getAttribute('tab')}" section-title="Story" hash="${this.getAttribute('author-hash')}"
        replies-url="${this.getAttribute('replies-url')}" likes-url="${this.getAttribute('likes-url')}">
      </post-section>
    `
  }

  getInfo = () => {
    return /*html*/`
      <info-container docs="/about/docs" new="/about/new"
       feedback="/about/feedback" request="/about/request" code="/about/code" donate="/about/donate" contact="/about/contact" company="https://github.com/aduki-hub">
      </info-container>
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
          width: 100%;
          gap: 30px;
          min-height: 100vh;
          justify-content: space-between;
        }

        div.content {
          padding: 0;
          width: 63%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        /* Responses */
        div.content section.responses {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        section.side {
          padding: 25px 0;
          margin: 0;
          background-color: transparent;
          width: 33%;
          height: max-content;
          display: flex;
          flex-flow: column;
          gap: 20px;
          position: sticky;
          top: 0;
          height: 100vh;
          max-height: 100vh;
          overflow-y: scroll;
          scrollbar-width: none;
        }

        section.side::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        @media screen and (max-width:900px) {
          div.content {
            width: 58%;
          }

          section.side {
            width: 40%;
          }
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
						padding: 0;
            margin: 0;
            display: flex;
            min-height: max-content;
            height: max-content;
            flex-flow: column;
            gap: 0;
					}

          div.content .head {
            margin: 10px 0 0 0;
          }

          div.content {
            /* border: 1px solid #000000; */
            padding: 0;
            width: 100%;
            display: flex;
            flex-flow: column;
            gap: 0;
          }

					.action,
					a {
						cursor: default !important;
          }

          section.side {
            padding: 0;
            display: none;
            width: 0%;
          }
				}
	    </style>
    `;
  }
}
