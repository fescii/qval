export default class AppHome extends HTMLElement {
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
    //Scroll the window to the top
    window.scrollTo(0, 0);

    // onpopstate event
    this.onpopEvent();

    // Watch for media query changes
    const mql = window.matchMedia('(max-width: 660px)');
    this.watchMediaQuery(mql);
  }

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {
      // Re-render the component
      this.render();

      // call onpopstate event
      this.onpopEvent();
    });
  }

  onpopEvent = () => {
    const outerThis = this;
    // Update state on window.onpopstate
    window.onpopstate = event => {
      // This event will be triggered when the browser's back button is clicked

      // console.log(event.state);
      if (event.state) {
        if (event.state.page) {
          outerThis.updatePage(event.state.content)
        }
      }
    }
  }

  updatePage = content => {
    // select body
    const body = document.querySelector('body');

    // populate content
    body.innerHTML = content;
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
        <add-container type="story"></add-container>
        <stories-container stories="popular" url="/stories/popular"></stories-container>
        <topics-container url="/topics/popular"></topics-container>
        <stories-container stories="recent" url="/stories/recent"></stories-container>
        <discover-people url="/people/discover"></discover-people>
        <stories-feed stories="all" url="/stories/feed"></stories-feed>
      `;
    }
    else {
      return /* html */`
        <div class="feeds">
          ${this.getTop()}
          <add-container type="story"></add-container>
          <stories-container stories="popular" url="/stories/popular"></stories-container>
          <discover-people url="/people/discover"></discover-people>
          <stories-feed stories="all" url="/stories/feed"></stories-feed>
        </div>
        <div class="side">
          <topics-container url="/topics/popular"></topics-container>
          ${this.getInfo()}
        </div>
      `;
    }
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Qval" type="home"
        user-url="${this.getAttribute('url')}" auth-url="${this.getAttribute('auth-url')}"
        url="${this.getAttribute('url')}" search-url="${this.getAttribute('search-url')}">
      </header-wrapper>
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
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
          gap: 30px;
        }

        .feeds {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 63%;
        }

        div.side {
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

        div.side::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        @media screen and (max-width:900px) {
         .feeds {
            width: 58%;
          }

          div.side {
            width: 40%;
          }
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            gap: 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}
					a {
						cursor: default !important;
          }

          .feeds {
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          div.side {
            /* border: 1px solid #ff0000; */
            padding: 0;
            width: 100%;
          }
				}
	    </style>
    `;
  }
}