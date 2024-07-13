export default class AppUpdate extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // Get default tab
    this._tab = this.getAttribute('tab');

    //Get url in lowercase
    this._url = this.getAttribute('url').trim().toLowerCase();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  setTitle = () => {
    // update title of the document
    if (this._query) {
      document.title = `Search | ${this._query}`;
    }
    else {
      document.title = 'Search | Discover and connect with people, topics and stories';
    }
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Activate tab
    const contentContainer = this.shadowObj.querySelector('div.content-container');
    const tabContainer = this.shadowObj.querySelector('ul#tab');
    const svgBtn = this.shadowObj.querySelector('.head > svg');

    const mql = window.matchMedia('(max-width: 660px)');
  
    if (contentContainer && tabContainer) {
      this.updateActiveTab(this._tab, tabContainer);
      this.activateTab(contentContainer, tabContainer);

      if(svgBtn){
        this.activateBackButton(svgBtn);
      }
    }
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

  updateActiveTab = (active, tabContainer) => {
    // Select tab with active class
    const tab = this.shadowObj.querySelector(`ul#tab > li.${active}`);

    // select line
    const line = tabContainer.querySelector('span.line');

    if (tab && line) {
      tab.classList.add('active');

      // update active tab
      this._active = tab;

      // Calculate half tab width - 10px
      const tabWidth = (tab.offsetWidth/2) - 20;

      // update line
      line.style.left = `${tab.offsetLeft + tabWidth}px`;
    }
    else {
      // Select the all tab
      const allTab = this.shadowObj.querySelector("ul#tab > li.all");
      allTab.classList.add('active');
    }
  }

  removeActiveTab = tabContainer => {
    // remove active tab
    const activeTab = tabContainer.querySelector('li.tab-item.active');
    if (activeTab) {
      activeTab.classList.remove('active');
    }
  }

  activateTab = (contentContainer, tabContainer) => {
    const outerThis = this;

    const line = tabContainer.querySelector('span.line');
    const tabItems = tabContainer.querySelectorAll('li.tab-item');

    tabItems.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        // Calculate half tab width - 10px
        const tabWidth = (tab.offsetWidth / 2) - 20;

        line.style.left = `${tab.offsetLeft + tabWidth}px`;

        if (tab.dataset.element === outerThis._active.dataset.element) {
          return;
        }
        else {
          outerThis._active.classList.remove('active');
          tab.classList.add('active');
          outerThis._active = tab;

          // update tab attribute  and this._tab
          outerThis._tab = tab.dataset.element;
          outerThis.setAttribute('tab', outerThis._tab);

          // update tab attribute  and this._tab
          outerThis._tab = tab.dataset.element;

          if (tab.dataset.element === "stories") {
            contentContainer.innerHTML = outerThis.getStories();
          } else if (tab.dataset.element === "replies") {
            contentContainer.innerHTML = outerThis.getReplies();
          } else if (tab.dataset.element === "topics") {
            contentContainer.innerHTML = outerThis.getTopics();
          } else if (tab.dataset.element === "people") {
            contentContainer.innerHTML = outerThis.getPeople();
          } else {
            contentContainer.innerHTML = outerThis.getStories();
          }
        }
      })
    });
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  activateBackButton = btn => {
    btn.addEventListener('click', () => {
      // check window history is greater or equal to 1
      if (window.history.length >= 1) {
        // check if the history has state
        if (window.history.state) {
          // go back
          window.history.back();
        }
        else {
          // redirect to home
          window.location.href = '/home';
        }
      }
    });
  }

  getBody = () => {
    return /* html */`
      <div class="head">
        <div class="title">
          <h3 class="name">Updates</h3>
        </div>
        ${this.getTab()}
      </div>
      <div class="content-container">
      </div>
    `;
  }

  getTab = () => {
    return /* html */`
      <div class="tab-control">
        <ul id="tab" class="tab">
          <li data-element="all" class="tab-item all">
            <span class="text">All</span>
          </li>
          <li data-element="unread" class="tab-item unread">
            <span class="text">Unread</span>
          </li>
          <li data-element="read" class="tab-item read">
            <span class="text">Read</span>
          </li>
          <li data-element="explore" class="tab-item explore">
            <span class="text">Explore</span>
          </li>
          <span class="line"></span>
        </ul>
      </div>
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
          flex-flow: column;
          gap: 0;
          width: 100%;
          min-height: 100vh;
        }

        .head {
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }
        
        .head > .title {
          width: 100%;
          border: none;
          display: flex;
          align-items: center;
        }
        
        .head > .title h3 {
          border: none;
          color: var(--text-color);
          font-family: var(--font-read);
          font-weight: 600;
          font-size: 1.3rem;
        }

        .head > svg {
          position: absolute;
          left: -12px;
          top: calc(50% - 15px);
          color: var(--text-color);
          cursor: pointer;
          width: 40px;
          height: 40px;
        }

        .head > svg:hover {
          color: var(--accent-color);
        }

        .tab-control {
          border-bottom: var(--border);
          background-color: var(--background);
          display: flex;
          flex-flow: column;
          padding: 5px 0 0 0;
          gap: 0;
          z-index: 5;
          width: 100%;
          position: sticky;
          top: 60px;
        }

        .tab-control > ul.tab {
          height: max-content;
          width: 100%;
          padding: 0;
          margin: 0;
          list-style-type: none;
          display: flex;
          gap: 0;
          align-items: center;
          max-width: 100%;
          overflow-x: scroll;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .tab-control > ul.tab::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        .tab-control > ul.tab > li.tab-item {
          color: var(--gray-color);
          font-family: var(--font-text), sans-serif;
          font-weight: 400;
          padding: 6px 20px 8px 0;
          margin: 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          overflow: visible;
          font-size: 0.95rem;
        }

        .tab-control > ul.tab > li.tab-item > .text {
          font-weight: 500;
          font-size: 1rem;
        }

        .tab-control > ul.tab > li.tab-item:hover > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .tab-control > ul.tab > li.active {
          font-size: 0.95rem;
        }

        .tab-control > ul.tab > li.active > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-read);
        }

        .tab-control > ul.tab span.line {
          position: absolute;
          z-index: 1;
          background: var(--accent-linear);
          display: inline-block;
          bottom: -3px;
          left: 12px;
          width: 20px;
          min-height: 5px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          transition: all 300ms ease-in-out;
        }

        div.content-container {
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          flex-wrap: nowrap;
          gap: 15px;
          width: 100%;
        }

        @media screen and (max-width:900px) {
          section.main {
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
            flex-flow: column;
            gap: 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

          .tab-control > ul.tab > li.tab-item,
					a {
						cursor: default !important;
          }

          form.search > .contents > input {
            padding: 10px 10px 10px 35px;
            width: 100%;
            border-radius: 18px;
            -webkit-border-radius: 18px;
            -moz-border-radius: 18px;
            -ms-border-radius: 18px;
            -o-border-radius: 18px;
          }

          .tab-control {
            border: none;
            padding: 0;
            border-bottom: var(--border);
            position: sticky;
            top: 60px;
          }
				}
	    </style>
    `;
  }
}