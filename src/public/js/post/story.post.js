export default class StoryPost extends HTMLElement {
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
    // get url
    let url = this.getAttribute('url');

    url = url.trim().toLowerCase();
 
    // Get the body
    const body = document.querySelector('body');


     // Open Full post
    this.openFullPost(url, body);
  }

  // Open Full post
  openFullPost = (url, body) => {
    // get h3 > a.link
    const content = this.shadowObj.querySelector('h3 > a.link');

    if(body && content) {
      content.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();

        // scroll to the top of the page
        window.scrollTo(0, 0);

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
    // Replace the content with the current url and body content
    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: body.innerHTML },
      url, pageUrl
    );

    // Updating History State
    window.history.pushState(
      { page: 'page', content: post},
      url, url
    );

    // update title of the document
    document.title = `Story | ${this.getAttribute('story-title')}`;
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

  // Get lapse time
  getLapseTime = isoDateStr => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    // Get the current time
    const currentTime = new Date();

    // Get the difference in time
    const timeDifference = currentTime - date;

    // Get the seconds
    const seconds = timeDifference / 1000;

    // Check if seconds is less than 60: return Just now
    if (seconds < 60) {
      return 'Just now';
    }
    // check if seconds is less than 86400: return time AM/PM
    if (seconds < 86400) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    // check if seconds is less than 604800: return day and time
    if (seconds <= 604800) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true });
    }

    // Check if the date is in the current year:: return date and month short 2-digit year without time
    if (date.getFullYear() === currentTime.getFullYear()) {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', });
    }
    else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getHeader = () => {
    return /*html*/`
      <span class="read-time">
        <span class="text">${this.getReadTime()} min read</span>
        <span class="sp">•</span>
        <span class="views">${this.getViews()} views</span>
      </span>
    `
  }

  getReadTime = () => {
    return /*html*/ `
      <span class="time">${this.getAttribute('read-time')}</span>
    `
  }

  getViews = () => {
    // Get the number of views
    const views = this.getAttribute('views');

    // Parse the views to a number
    const viewsNum = this.parseToNumber(views);

    // Format the number of views
    const formattedViews = this.formatNumber(viewsNum);

    return /*html*/ `
      <span class="views-no">${formattedViews}</span>
    `
  }

  getContent = () => {
    // get url
    let url = this.getAttribute('url');
    url = url.trim().toLowerCase();
    return /*html*/`
			<h3 class="title">
        <a href="${url}" class="link">${this.getAttribute('story-title')}</a>
      </h3>
		`;
  }

  getFooter = () => {
    let authorUrl = this.getAttribute('author-url');
    authorUrl = authorUrl.trim().toLowerCase();
    return /*html*/`
      <div class="meta top-meta">
        <span class="by">by</span>
        ${this.getAuthorHover()}
        <span class="sp">•</span>
        <time class="time" datetime="${this.getAttribute('time')}">
          ${this.getLapseTime(this.getAttribute('time'))}
        </time>
      </div>
    `
  }

  getBody() {
    return `
      ${this.getHeader()}
      ${this.getContent()}
      ${this.getFooter()}
    `;
  }

  getAuthorHover = () => {
    let url = this.getAttribute('author-url');
    url = url.trim().toLowerCase();
    return /* html */`
			<hover-author url="${url}" you="${this.getAttribute('author-you')}" hash="${this.getAttribute('author-hash')}"
        picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
        stories="${this.getAttribute('author-stories')}" replies="${this.getAttribute('author-replies')}"
        followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
        verified="${this.getAttribute('author-verified')}" bio='${this.getAttribute("author-bio")}'>
      </hover-author>
		`
  }

  getFullPost = () => {
    return /* html */`
      <app-story story="story" tab="replies" style="display: none;" hash="${this.getAttribute('hash')}"  url="${this.getAttribute('url')}" topics="${this.getAttribute('topics')}"
        story-title="${this.getAttribute('story-title')}" time="${this.getAttribute('time')}"
        replies-url="${this.getAttribute('replies-url')}" likes-url="${this.getAttribute('likes-url')}"
        likes="${this.getAttribute('likes')}" replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}" views="${this.getAttribute('views')}"
        author-you="${this.getAttribute('author-you')}"
        author-stories="${this.getAttribute('author-stories')}" author-replies="${this.getAttribute('author-replies')}"
        author-hash="${this.getAttribute('author-hash')}" author-url="${this.getAttribute('author-url')}"
        author-img="${this.getAttribute('author-img')}" author-verified="${this.getAttribute('author-verified')}" author-name="${this.getAttribute('author-name')}"
        author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
        author-bio="${this.getAttribute('author-bio')}">
        ${this.getAttribute('content')}
      </app-story>
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
        border-bottom: var(--border);
        font-family: var(--font-main), sans-serif;
        padding: 10px 0 0;
        margin: 0;
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: 5px;
      }

      .read-time {
        color: var(--gray-color);
        font-size: 0.9rem;
        font-family: var(--font-main),sans-serif;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .read-time .text .time {
        font-family: var(--font-mono), monospace;
      }

      .read-time .views {
        font-weight: 500;
      }

      .read-time .views .views-no {
        font-family: var(--font-main), monospace;
        font-size: 0.8rem;
      }

      .read-time > span.sp {
        display: inline-block;
        margin: 0 0 -2px;
      }

      h3.title {
        color: var(--text-color);
        font-family: var(--font-text), sans-serif;
        margin: 0;
        padding: 0;
        font-size: 1.1rem;
        font-weight: 500;
        line-height: 1.4;
      }

      h3.title > a {
        text-decoration: none;
        color: inherit;
      }

      .meta {
        height: max-content;
        display: flex;
        position: relative;
        color: var(--gray-color);
        align-items: center;
        font-family: var(--font-mono),monospace;
        gap: 5px;
        font-size: 0.9rem;
        line-height: 1.5;
      }

      .meta > span.sp {
        margin: 1px 0 0 0;
      }

      .meta > time.time {
        font-family: var(--font-main), sans-serif;
        font-size: 0.83rem;
        font-weight: 500;
        margin: 1px 0 0 0;
      }

      .meta a.link {
        text-decoration: none;
        color: transparent;
        background-image: var(--action-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .meta  a.author-link {
        text-decoration: none;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      @media screen and (max-width:660px) {
        :host {
          font-size: 16px;
        }

        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        .meta a.reply-link,
        .meta div.author-name > a,
        a,
        .stats > .stat {
          cursor: default !important;
        }

        h3.title {
          color: var(--text-color);
          margin: 0;
          padding: 0;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.5;
        }

        h3.title > a {
          text-decoration: none;
          color: inherit;
        }
      }
    </style>
    `;
  }
}