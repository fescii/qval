export default class SummeryPost extends HTMLElement {
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
        ${this.getReadTime()}
        <span class="sp">•</span>
        <time class="time" datetime="${this.getAttribute('time')}">
          ${this.getLapseTime(this.getAttribute('time'))}
        </time>
      </div>
    `
  }

  getReadTime = () => {
    return /*html*/ `
      <span class="read">${this.getAttribute('read-time')} read</span>
    `
  }

  getBody() {
    return `
      ${this.getContent()}
      ${this.getFooter()}
    `;
  }

  getFullPost = () => {
    return /* html */`
      <app-story story="story" tab="replies" hash="${this.getAttribute('hash')}"  url="${this.getAttribute('url')}" topics="${this.getAttribute('topics')}"
        story-title="${this.getAttribute('story-title')}" time="${this.getAttribute('time')}"
        replies-url="${this.getAttribute('replies-url')}" likes-url="${this.getAttribute('likes-url')}"
        likes="${this.getAttribute('likes')}" replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}" views="${this.getAttribute('views')}"
        author-you="${this.getAttribute('author-you')}"
        author-username="${this.getAttribute('author-username')}" author-url="${this.getAttribute('author-url')}"
        author-img="${this.getAttribute('author-img')}" author-verified="${this.getAttribute('author-verified')}" author-name="${this.getAttribute('author-name')}"
        author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
        author-bio="${this.getAttribute('author-bio')}">
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
        font-family: var(--font-main), sans-serif;
        padding: 10px 0 0 0;
        margin: 0;
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: 0;
      }

      h3.title {
        color: var(--text-color);
        font-family: var(--font-text), sans-serif;
        margin: 0;
        padding: 0;
        font-size: 1rem;
        font-weight: 400;
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
        font-family: var(--font-main), sans-serif;
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
          border-bottom: var(--border-mobile);
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