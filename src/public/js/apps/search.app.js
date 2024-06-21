export default class AppSearch extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // Get default tab
    this._tab = this.getAttribute('tab');

    // get query
    this._query = this.getAttribute('query') || '';

    //Get url in lowercase
    this._url = this.getAttribute('url').trim().toLowerCase();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Activate tab
    const contentContainer = this.shadowObj.querySelector('div.content-container');
    const tabContainer = this.shadowObj.querySelector('ul#tab');

    // update active tab
    this.updateActiveTab(this._tab);


    if (contentContainer && tabContainer) {
      this.activateTab(contentContainer, tabContainer);
    }

    // Scroll to top of the page
    window.scrollTo(0, 0);

    // watch for mql changes
    const mql = window.matchMedia('(max-width: 660px)');

    this.watchMediaQuery(mql, contentContainer);
  }

  // watch for mql changes
  watchMediaQuery = (mql, contentContainer) => {
    mql.addEventListener('change', () => {
      // Re-render the component
      this.render();

      // update active tab
      this.updateActiveTab(this.getAttribute('tab'));

      //activate tab
      if (contentContainer) {
        this.activateTab(contentContainer);
      }
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

  updateActiveTab = active => {
    // Select tab with active class
    const tab = this.shadowObj.querySelector(`ul#tab > li.${active}`);

    if (tab) {
      tab.classList.add('active');
    }
    else {
      // Select the stories tab
      const storiesTab = this.shadowObj.querySelector("ul#tab > li.stories");
      storiesTab.classList.add('active');
    }
  }

  activateTab = (contentContainer, tabContainer) => {
    const outerThis = this;

    const line = tabContainer.querySelector('span.line');
    const tabItems = tabContainer.querySelectorAll('li.tab-item');
    let activeTab = tabContainer.querySelector('li.tab-item.active');

    tabItems.forEach(tab => {
      tab.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()

        // Calculate half tab width - 10px
        const tabWidth = (tab.offsetWidth / 2) - 20;

        line.style.left = `${tab.offsetLeft + tabWidth}px`;

        if (tab.dataset.element === activeTab.dataset.element) {
          return;
        }
        else {
          activeTab.classList.remove('active');
          tab.classList.add('active');
          activeTab = tab;

          // update tab attribute  and this._tab
          this._tab = tab.dataset.element;

          // get tab url attribute
          let url = tab.getAttribute('url');

          // check if this._query is empty or null, if not update url
          if (this._query !== '' && this._query !== null && this._query !== 'null') {
            url = `${url}/$?q=${this._query}`;
          }

          console.log('URL: ', url);

          // get current feed
          const currentFeed = outerThis.selectCurrentFeed(tab.dataset.element);

          // Updating History State
          window.history.pushState(
            { tab: tab.dataset.element, content: currentFeed },
            tab.dataset.element, `${url}`
          );

          switch (tab.dataset.element) {
            case "stories":
              contentContainer.innerHTML = outerThis.getStories();
              break;
            case "topics":
              contentContainer.innerHTML = outerThis.getTopics();
              break;
            case "people":
              contentContainer.innerHTML = outerThis.getPeople();
            default:
              break;
          }
        }
      })
    });

    // Update state on window.onpopstate
    window.onpopstate = event => {
      // This event will be triggered when the browser's back button is clicked

      // console.log(event.state);
      if (event.state) {
        if (event.state.page) {
          outerThis.updatePage(event.state.content)
        }
        else if (event.state.tab) {

          // Select the state tab
          const tab = outerThis.shadowObj.querySelector(`ul#tab > li.${event.state.tab}`);

          if (tab) {
            activeTab.classList.remove('active');

            tab.classList.add('active');
            activeTab = tab;

            // update tab attribute  and this._tab
            outerThis._tab = event.state.tab;

            // Calculate half tab width - 10px
            const tabWidth = (tab.offsetWidth / 2) - 20;

            // Update the line
            line.style.left = `${tab.offsetLeft + tabWidth}px`;

            outerThis.updateState(event.state, contentContainer);

            // Update tab
            outerThis._tab = tab.dataset.element;
          }
        }
      }
      else {
        // Select li with class name as current and content Container
        const currentTab = outerThis.shadowObj.querySelector(`ul#tab > li.tab-item.${this.getAttribute('tab')}`);
        if (currentTab) {
          activeTab.classList.remove('active');
          activeTab = currentTab;
          currentTab.classList.add('active');

          // update tab attribute  and this._tab
          outerThis._tab = currentTab.dataset.element;

          console.log('Current Tab: ', currentTab.dataset.element);

          // Calculate half tab width - 10px
          const tabWidth = (currentTab.offsetWidth / 2) - 20;

          line.style.left = `${currentTab.offsetLeft + tabWidth}px`;

          outerThis.updateDefault(contentContainer);

          // Update active attribute
          outerThis._tab = currentTab.dataset.element;
        }
      }
    };
  }

  updatePage = content => {
    // select body
    const body = document.querySelector('body');

    // populate content
    body.innerHTML = content;
  }

  updateState = (state, contentContainer) => {
    // populate content
    contentContainer.innerHTML = state.content;
  }

  updateDefault = contentContainer => {
    contentContainer.innerHTML = this.getContainer(this._tab);
  }

  selectCurrentFeed = tab => {
    // Select the current feed
    switch (tab) {
      case "stories":
        return this.getStories();
      case "topics":
        return this.getTopics();
      case "people":
        return this.getPeople();
      default:
        break;
    }
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getTopics = () => {
    const topics = this.getAttribute('topics');

    const arrayOfObjects = JSON.parse(topics);

    let html = '';

    arrayOfObjects.forEach((topic, index) => {
      if (index === 1) {
        html += /* html */`
          <discover-people url="/people/discover"></discover-people>
        `
      }
      else if (index === 2) {
        html += /* html */`
          <topics-container url="/topics/popular"></topics-container>
        `
      }

      html += /* html */`
        <trending-container topic-id="${topic.id}"
          topic-name="${topic.url}" topic="${topic.name}"
          stories="${topic.stories}" url="/trending/${topic.id}" >
        </trending-container>
      `
    });

    return html;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getTop()}
        ${this.getForm()}
        ${this.getTab()}
        <div class="content-container">
          ${this.getContainer(this._tab)}
        </div>
      `;
    }
    else {
      return /* html */`
        <section class="main">
          ${this.getTop()}
          ${this.getForm()}
          ${this.getTab()}
          <div class="content-container">
            ${this.getContainer(this._tab)}
          </div>
        </section>

        <section class="side">
          <topics-container url="/topics/popular"></topics-container>
          ${this.getRelatedStories()}
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getForm = () => {
    return /*html*/`
      <form action="" method="get" class="search">
        <div class="contents">
          <input type="text" name="q" id="query" placeholder="What's your query?">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"  stroke-linejoin="round" />
            <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <button type="submit">Search</button>
        </div>
      </form>
    `
  }

  getContainer = active => {
    // Switch active tab
    switch (active) {
      case "stories":
        return this.getStories();
      case "people":
        return this.getPeople();
      case "topic":
        return this.getTopics();
      default:
        return this.getStories();
    }
  }

  getStories = () => {
    return `
      <stories-feed stories="all" url="${this._url}/stories"></stories-feed>
    `
  }

  getTopics = () => {
    return `
      <topics-feed topics="all" url="${this._url}/topics"></topics-feed>
    `
  }

  getPeople = () => {
    return `
      <people-feed replies="all" url="${this._url}/people"></people-feed>
    `
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Search" type="search"
        user-url="${this.getAttribute('user-url')}">
      </header-wrapper>
    `
  }

  getRelatedStories = () => {
    return /* html */`
			<related-container type="top" limit="5" topics='top1, top2, top3'>
      </related-container>
		`
  }

  getInfo = () => {
    return /*html*/`
      <info-container docs="/about/docs" new="/about/new"
       feedback="/about/feedback" request="/about/request" code="/about/code" donate="/about/donate" contact="/about/contact" company="https://github.com/aduki-hub">
      </info-container>
    `
  }

  getTab = () => {
    // Get url 
    let url = this.getAttribute('url');

    // convert url to lowercase
    url = url.toLowerCase();
    return /* html */`
      <div class="tab-control">
        <ul id="tab" class="tab">
          <li url="${url}/stories" data-element="stories" class="tab-item stories">
            <span class="text">Stories</span>
          </li>
          <li url="${url}/topics" data-element="topics" class="tab-item topics">
            <span class="text">Topics</span>
          </li>
          <li url="${url}/people" data-element="people" class="tab-item people">
            <span class="text">People</span>
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
          justify-content: space-between;
          gap: 30px;
        }

        section.main {
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
          width: 63%;
          min-height: 100vh;
        }

        form.search {
          background: var(--background);
          padding: 0;
          margin: 15px 0;
          display: flex;
          flex-flow: column;
          align-items: start;
          flex-wrap: nowrap;
          gap: 15px;
          z-index: 3;
          width: 100%;
        }

        form.search > .contents {
          /* border: 1px solid #6b7280; */
          padding: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          flex-wrap: nowrap;
          gap: 0;
          width: 100%;
          position: relative;
        }

        form.search > .contents > input {
          border: var(--input-border);
          display: flex;
          flex-flow: row;
          align-items: center;
          font-family: var(--font-text);
          color: var(--text-color);
          font-size: 1rem;
          padding: 10px 10px 10px 35px;
          gap: 0;
          width: 100%;
          border-radius: 18px;
          -webkit-border-radius: 18px;
          -moz-border-radius: 18px;
          -ms-border-radius: 18px;
          -o-border-radius: 18px;
        }

        form.search > .contents > svg {
          position: absolute;
          height: 20px;
          color: var(--gray-color);
          width: 20px;
          left: 10px;
          top: calc(50% - 12px);
        }

        form.search > .contents > button {
          position: absolute;
          right: 10px;
          top: calc(50% - 14px);
          border: none;
          cursor: pointer;
          color: var(--white-color);
          background: var(--accent-linear);
          height: 28px;
          width: max-content;
          padding: 0 10px;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .tab-control {
          border-bottom: var(--border);
          background-color: var(--background);
          display: flex;
          flex-flow: column;
          gap: 0;
          z-index: 3;
          width: 100%;
          position: sticky;
          top: 58px;
        }

        .tab-control > .author {
          border-bottom: var(--border);
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 400;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
        }

        .tab-control > ul.tab {
          height: max-content;
          width: 100%;
          padding: 5px 0 0 0;
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
          font-family: var(--font-text);
        }

        .tab-control > ul.tab > li.active {
          font-size: 0.95rem;
        }

        .tab-control > ul.tab > li.active > .text {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-text);
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

        section.side {
          padding: 25px 0;
          width: 33%;
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
            justify-content: space-between;
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

          .section.main {
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          .tab-control {
            border: none;
            border-bottom: var(--border-mobile);
            position: sticky;
            top: 49px;
          }

          section.side {
            /* border: 1px solid #ff0000; */
            padding: 0;
            display: none;
            width: 100%;
          }
				}
	    </style>
    `;
  }
}