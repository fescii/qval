export default class StatReply extends HTMLElement {
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
    // open post
    this.openPost();
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

  openPost = () => {
    // get url
    let url = this.getAttribute('url');

    url = url.trim().toLowerCase();

    // Get the body
    const body = document.querySelector('body');

    // get current content
    const content = this.shadowObj.querySelector('.actions>.action#view-action')

    if(body && content) {
      content.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // Get full post
        const post =  this.getFullPost();

        // replace and push states
        this.replaceAndPushStates(url, body, post);

        body.innerHTML = post;
      })
    }
  }

  // Replace and push states
  replaceAndPushStates = (url, body, post) => {
    // get the first custom element in the body
    const firstElement = body.firstElementChild;

    // convert the custom element to a string
     const elementString = firstElement.outerHTML;

    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: elementString },
      url, pageUrl
    );

    // Updating History State
    window.history.pushState(
      { page: 'page', content: post},
      url, url
    );
  }

  formatNumber = n => {
    if (n >= 0 && n <= 999) {
      return n.toString();
    } else if (n >= 1000 && n <= 9999) {
      const value = (n / 1000).toFixed(2);
      return `${value}k`;
    } else if (n >= 10000 && n <= 99999) {
      const value = (n / 1000).toFixed(1);
      return `${value}k`;
    } else if (n >= 100000 && n <= 999999) {
      const value = (n / 1000).toFixed(0);
      return `${value}k`;
    } else if (n >= 1000000 && n <= 9999999) {
      const value = (n / 1000000).toFixed(2);
      return `${value}M`;
    } else if (n >= 10000000 && n <= 99999999) {
      const value = (n / 1000000).toFixed(1);
      return `${value}M`;
    } else if (n >= 100000000 && n <= 999999999) {
      const value = (n / 1000000).toFixed(0);
      return `${value}M`;
    } else {
      return "1B+";
    }
  }

  parseToNumber = num_str => {
    // Try parsing the string to an integer
    const num = parseInt(num_str);

    // Check if parsing was successful
    if (!isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const likes = this.parseToNumber(this.getAttribute('likes'));
    const views = this.parseToNumber(this.getAttribute('views'));
    return /* html */`
      <span class="content">
        ${this.getAttribute('content')}
      </span>
      ${this.getActions(likes, views)}
    `;
  }

  getBody = () => {
    const likes = this.parseToNumber(this.getAttribute('likes'));
    const views = this.parseToNumber(this.getAttribute('views'));
    return /* html */`
      <span class="content">
        ${this.removeHtml(this.innerHTML)}
      </span>
      ${this.getActions(likes, views)}
    `;
  }

  removeHtml = text => {
    const mql = window.matchMedia('(max-width: 660px)');
    let str = text;
    // Check if the text is encoded (contains &lt; or &gt;)
    if (text.includes('&lt;') || text.includes('&gt;')) {
      // remove them from the text
      str = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    } else {
      // Directly remove all HTML tags
      str = text.replace(/<[^>]*>/g, '');
    }

    if (mql.matches) {
      // trim the text and return first 150 characters
      return str.trim().substring(0, 150) + '...';
    } else {
      return str.trim().substring(0, 170) + '...';
    }
  }

  getActions = (likes, views) => {
    const viewUrl = this.getAttribute('url');
    const editUrl = viewUrl + '/edit';
    return /*html*/`
      <div class="actions">
        <a href="${editUrl}" class="action edit" id="edit-action">edit</a>
        <a href="${viewUrl}" class="action view" id="view-action">view</a>
        <span class="action likes plain">
          <span class="no">${this.formatNumber(likes)}</span> <span class="text">${likes === 1 ? 'like' : 'likes'}</span>
        </span>
        <span class="action views plain">
          <span class="no">${this.formatNumber(views)}</span> <span class="text">${views === 1 ? 'view' : 'views'}</span>
        </span>
      </div>
    `
  }

  getFullPost = () => {
    const parent = this.getAttribute('parent');
    let text = parent ? `parent="${parent}"` : '';
    return /* html */`
      <app-post story="quick" tab="replies" url="${this.getAttribute('url')}" hash="${this.getAttribute('hash')}"
        likes="${this.getAttribute('likes')}" replies="${this.getAttribute('replies')}" ${text}
        replies-url="${this.getAttribute('replies-url')}" likes-url="${this.getAttribute('likes-url')}"
        liked="${this.getAttribute('liked')}" views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
        author-stories="${this.getAttribute('author-stories')}" author-replies="${this.getAttribute('author-replies')}"
        author-you="${this.getAttribute('author-you')}" author-hash="${this.getAttribute('author-hash')}" author-url="${this.getAttribute('author-url')}"
        author-img="${this.getAttribute('author-img')}" author-verified="${this.getAttribute('author-verified')}" author-name="${this.getAttribute('author-name')}"
        author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
        author-bio="${this.getAttribute('author-bio')}">
        ${this.innerHTML}
      </app-post>
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
        display: flex;
        flex-flow: column;
        gap: 10px;
        padding: 10px 0;
        width: 100%;
      }

      .content {
        color: var(--text-color);
        font-family: var(--font-text), sans-serif;
        display: flex;
        flex-flow: column;
        font-size: 1rem;
        gap: 5px;
        padding: 0;
        width: 100%;
      }

      .actions {
        display: flex;
        font-family: var(--font-main), sans-serif;
        width: 100%;
        flex-flow: row;
        align-items: center;
        gap: 8px;
        margin: 0;
      }
      
      .actions > .action {
        border: var(--border);
        text-decoration: none;
        color: var(--gray-color);
        font-size: 0.9rem;
        display: flex;
        width: max-content;
        flex-flow: row;
        align-items: center;
        text-transform: lowercase;
        justify-content: center;
        padding: 1.5px 10px 2.5px;
        border-radius: 10px;
      }

      .actions > .action.edit {
        border: none;
        background: var(--action-linear);
        color: var(--white-color);
        font-size: 0.9rem;
      }

      .actions > .action.plain {
        padding: 0;
        font-weight: 500;
        pointer-events: none;
        font-family: var(--font-text), sans-serif;
        color: var(--gray-color);
        border: none;
        background: none;
      }
      
      .actions > .action.plain > span.no {
        font-family: var(--font-main), sans-serif;
        font-size: 0.85rem;
        color: var(--text-color);
      }

      .actions > .action.plain > span.text {
        display: inline-block;
        padding: 0 0 0 3px;
      }

      @media screen and (max-width:660px) {
        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        .actions {
          width: 100%;
        }

        .actions > .action.plain > span.no {
          font-family: var(--font-main), sans-serif;
          font-size: 0.8rem;
          color: var(--text-color);
        }

        a {
          cursor: default !important;
        }
      }
    </style>
    `;
  }
}