export default class TopicSection extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // Get default active tab
    this._active = this.getAttribute('active');

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');

    const contentContainer = this.shadowObj.querySelector('div.feeds');
    const tabContainer = this.shadowObj.querySelector('ul#tab');

    this.fetchContent(contentContainer, tabContainer);
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

  fetchContent = (contentContainer, tabContainer) => {
    const outerThis = this;
    const storyLoader = this.shadowObj.querySelector('story-loader');
    const content = this.getContent(this._active);
    setTimeout(() => {
      storyLoader.remove();
      contentContainer.insertAdjacentHTML('beforeend', content);
      outerThis.updateActiveTab(tabContainer);
      outerThis.activateTab(contentContainer, tabContainer);
    }, 2000)
  }

  updateActiveTab = tabContainer => {
    // Select tab with active class
    const tab = tabContainer.querySelector(`ul#tab > li.${this._active}`);

    if (tab) {
      tab.classList.add('active');
    }
    else {
      // Select the stories tab
      const storiesTab = tabContainer.querySelector("ul#tab > li.article");
      storiesTab.classList.add('active');
    }
  }

  activateTab = (contentContainer, tabContainer) => {
    const outerThis = this;
    if (tabContainer && contentContainer) {
      const line = tabContainer.querySelector('span.line');
      const tabItems = tabContainer.querySelectorAll('li.tab-item');
      let activeTab = tabContainer.querySelector('li.tab-item.active');

      tabItems.forEach(tab => {
        tab.addEventListener('click', e => {
          e.preventDefault()
          e.stopPropagation()

          // Calculate half tab width - 10px
          const tabWidth = (tab.offsetWidth/2) - 20;

          line.style.left = `${tab.offsetLeft + tabWidth}px`;

          if (tab.dataset.element === activeTab.dataset.element) {
            return;
          }
          else {
            activeTab.classList.remove('active');
            tab.classList.add('active');
            activeTab = tab;

            // get current feed
            const currentFeed = outerThis.getCurrentFeed(tab.dataset.element);

            // Updating History State
            window.history.pushState(
              { tab: tab.dataset.element, content: currentFeed},
              tab.dataset.element, `${tab.getAttribute('url')}`
            );

            // update active attribute
            outerThis.setAttribute('active', tab.dataset.element);

            switch (tab.dataset.element) {
              case "article":
                contentContainer.innerHTML = outerThis.getArticle();
                break;
              case "stories":
                contentContainer.innerHTML = outerThis.getStories();
                break;
              case "contributors":
                contentContainer.innerHTML = outerThis.getPeople();
                break;
              default:
                break;
            }

          }
        })
      })

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

              // Calculate half tab width - 10px
              const tabWidth = (tab.offsetWidth/2) - 20;

              // update line 
              line.style.left = `${tab.offsetLeft + tabWidth}px`;

              outerThis.updateState(event.state, contentContainer);

              //Update active attribute
              outerThis.setAttribute('active', event.state.tab);
            }
          }
        }
        else {
           // Select li with class name as current and content Container
           const currentTab = outerThis.shadowObj.querySelector(`ul#tab > li.tab-item.${this._active}`);
          if (currentTab) {
            activeTab.classList.remove('active');
            activeTab = currentTab;
            currentTab.classList.add('active');
            
            // Calculate half tab width - 10px
            const tabWidth = (currentTab.offsetWidth/2) - 20;

            // Update line
            line.style.left = `${currentTab.offsetLeft + tabWidth}px`;

            outerThis.updateDefault(contentContainer);

            // Update active attribute
            outerThis.setAttribute('active', this._active);
          }
        }
      };
    }
  }

  updatePage = content => {
    // select body
    const body = document.querySelector('body');

    // populate content
    body.innerHTML = content;
  }

  updateState = (state, contentContainer)=> {
    // populate content
    contentContainer.innerHTML = state.content;
  }

  updateDefault = contentContainer => {
    contentContainer.innerHTML = this.getContent(this._active);
  }

  // get current feed
  getCurrentFeed = tab => {
    switch (tab) {
      case "article":
        return this.getArticle();
      case "stories":
        return this.getStories();
      case "contributors":
        return this.getPeople();
      default:
        return this.getArticle();
    }
  }

  getTemplate() {
    // Show HTML Here
    return /* html */`
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      ${this.getTab()}
      <div class="feeds">
        ${this.getLoader()}
      </div>
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
          <li url="${url}/article" data-element="article" class="tab-item article">
            <span class="text">Article</span>
          </li>
          <li url="${url}/stories" data-element="stories" class="tab-item stories">
            <span class="text">Stories</span>
          </li>
          <li url="${url}/contributors" data-element="contributors" class="tab-item contributors">
            <span class="text">Contributors</span>
          </li>
          <span class="line"></span>
        </ul>
      </div>
    `
  }

  getContent = active => {
    switch (active) {
      case "article":
        return this.getArticle();
      case "stories":
        return this.getStories();
      case "contributors":
        return this.getPeople();
      default:
        return this.getArticle();
    }
  }

  getArticle = () => {
    return this.innerHTML;
  }

  getStories = () => {
    return /* html */`
      <stories-feed stories="all" url="/U0A89BA6/stories"></stories-feed>
    `
  }

  getPeople = () => {
    return /* html */`
      <people-feed replies="all" url="/U0A89BA6/followers"></people-feed>
    `
  }

  getLoader = () => {
    return /* html */`
			<story-loader speed="300"></story-loader>
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
          -webkit-appearance: none;
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
          width: 100%;
          min-width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .feeds {
          width: 100%;
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
        }

        .tab-control {
          border-bottom: var(--border);
          background-color: var(--background);
          display: flex;
          flex-flow: column;
          gap: 0;
          z-index: 3;
          width: 100%;
          min-width: 100%;
          position: sticky;
          top: 60px;
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
          /* border: var(--border); */
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

        article.article {
          margin: 15px 0;
          display: flex;
          flex-flow: column;
          color: var(--read-color);
          font-family: var(--font-read), sans-serif;
          gap: 10px;
          font-size: 1rem;
          font-weight: 400;
        }

        article.article * {
          font-size: 1.05rem;
          line-height: 1.4;
          color: inherit;
          font-family: inherit;
        }

        article.article .section {
          margin: 0;
          padding: 0;
          display: flex;
          flex-flow: column;
        }

        article.article > .section h4.section-title {
          padding: 0 !important;
          font-size: 1.3rem !important;
          font-weight: 500;
          line-height: 1.5;
          margin: 0;
        }

        article.article h6,
        article.article h5,
        article.article h4,
        article.article h3,
        article.article h1 {
          padding: 0 !important;
          font-size: 1.25rem !important;
          color: var(--title-color);
          font-weight: 500;
          line-height: 1.5;
          margin: 5px 0;
        }

        article.article p {
          margin: 5px 0;
          line-height: 1.5;
        }

        article.article a {
          text-decoration: none;
          cursor: pointer;
          color: var(--anchor-color) !important;
        }

        article.article a:hover {
          text-decoration: underline;
        }

        article.article blockquote {
          margin: 10px 0;
          padding: 5px 15px;
          font-style: italic;
          border-left: 2px solid var(--gray-color);
          background: var(--background);
          color: var(--text-color);
          font-weight: 400;
        }

        article.article blockquote:before {
          content: open-quote;
          color: var(--gray-color);
          font-size: 1.5rem;
          line-height: 1;
          margin: 0 0 0 -5px;
        }

        article.article blockquote:after {
          content: close-quote;
          color: var(--gray-color);
          font-size: 1.5rem;
          line-height: 1;
          margin: 0 0 0 -5px;
        }

        article.article hr {
          border: none;
          background-color: var(--gray-color);
          height: 1px;
          margin: 10px 0;
        }

        article.article b,
        article.article strong {
          font-weight: 500;

        }

        article.article ul,
        article.article ol {
          margin: 5px 0 15px 20px;
          padding: 0 0 0 15px;
          color: inherit;
        }

        @media screen and (max-width: 660px) {
          .tab-control {
            border-bottom: var(--border-mobile);
            margin: 0;
            position: sticky;
            top: 50px;
          }

          .tab-control > ul.tab > li.tab-item,
					.action,
					a {
						cursor: default !important;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          .stats > .stat {
            cursor: default !important;
          }

          a,
          span.stat,
          span.action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}