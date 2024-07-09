export default class QuickPost extends HTMLElement {
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
    this.style.display = 'flex';
    // Open read more
    this.openReadMore();

    // Open full post
    this.openQuickPost()

    // Open url
    this.openUrl();

    // open preview
    this.openPreview();
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

  openPreview = () => {
    // get replying-to
    const replyingTo = this.shadowObj.querySelector('.replying-to');
    const body = document.querySelector('body');

    if (replyingTo) {
      replyingTo.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        // get url attribute
        let url = replyingTo.getAttribute('url');

        //get the preview
        let preview = this.getPreview(url);

        // open the preview
        body.insertAdjacentHTML('beforeend', preview);
      });
    }
  }

  // Open quick post
  openQuickPost = () => {
    // get url
    let url = this.getAttribute('url');

    url = url.trim().toLowerCase();

    // Get the body
    const body = document.querySelector('body');

    // get current content
    const content = this.shadowObj.querySelector('#content')

    if(body && content) {
      content.addEventListener('click', event => {
        event.preventDefault();

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

  // Open read more
  openReadMore = () => {
    // Get the read more button
    const readMore = this.shadowObj.querySelector('.content .read-more');

    // Get the content
    const content = this.shadowObj.querySelector('.content');

    // Check if the read more button exists
    if (readMore && content) {
      readMore.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Prevent event from reaching any immidiate nodes.
        e.stopImmediatePropagation()

        // Toggle the active class
        content.classList.remove('extra');

        // remove the read more button
        readMore.remove();
      });
    }
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

  openUrl = () => {
    // get all the links
    const links = this.shadowObj.querySelectorAll('div#content a');
    const body = document.querySelector('body');

    // loop through the links
    if (!links) return;

    links.forEach(link => {
      // add event listener to the link
      link.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        // get the url
        const url = link.getAttribute('href');

        // link pop up
        let linkPopUp = `<url-popup url="${url}"></url-popup>`

        // open the popup
        body.insertAdjacentHTML('beforeend', linkPopUp);
      });
    });
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody() {
    return `
      ${this.getReply(this.getAttribute('story'))}
      ${this.getHeader()}
      ${this.getContent()}
      ${this.getFooter()}
    `;
  }

  getHeader = () => {
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

  getContent = () => {
    const content = this.innerHTML;

    // Convert content to str and check length
    const contentStr = content.toString();
    const contentLength = contentStr.length;

    // Check if content length is greater than 400
    if (contentLength > 600) {
      return /*html*/`
        <div class="content extra" id="content">
          ${content}
          <div class="read-more">
            <span class="action">view more</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
            </svg>
          </div>
        </div>
      `
    }
    else {
      return /*html*/`
        <div class="content" id="content">
          ${content}
        </div>
      `
    }
  }

  getPreview = url => {
    return /*html*/`
      <preview-popup url="${url}"></preview-popup> 
    `
  }

  getReply = story => {
    if (story === 'reply') {
      const parent = this.getAttribute('parent');
      let text = parent ? parent.toLowerCase() : 'A story';
      let url = parent.startsWith('P') ? `/api/v1/p/${parent.toLowerCase()}/preview` : `/api/v1/r/${parent.toLowerCase()}/preview`;
      return /*html*/`
        <a class="replying-to" href="/preview/${parent.toLowerCase()}" url=${url}>
          <span class="meta-reply">
            <span class="text">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="16px" height="16px" fill="currentColor">
                <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z"/>
              </svg>
              <span class="reply">Replying to</span>
            </span>
            <span class="parent">${text.toUpperCase()}</span>
          </span>
        </a>
      `
    } else return '';
  }

  getFooter = () => {
    return /*html*/`
      <action-wrapper full="false" kind="${this.getAttribute('story')}" reload="false" likes="${this.getAttribute('likes')}" 
        replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}" wrapper="false"
        hash="${this.getAttribute('hash')}" views="${this.getAttribute('views')}"  url="${this.getAttribute('url')}" summary="Post by - ${this.getAttribute('author-name')}">
      </action-wrapper>
    `
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
          border-bottom: var(--border);
          font-family: var(--font-main), sans-serif;
          padding: 10px 0 0;
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .replying-to {
          position: relative;
          text-decoration: none;
          width: 100%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 0;
          margin: 0 0 5px;
          padding: 0 0 0 8px;
        }

        .replying-to::before {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          transform: translateY(-48%);
          left: 0;
          width: 1.5px;
          height: 82%;
          background: var(--action-linear);
          border-radius: 5px;
        }
        
        .replying-to > .meta-reply {
          display: flex;
          width: max-content;
          align-items: start;
          color: var(--gray-color);
          flex-flow: column;
          font-size: 1rem;
          gap: 2px;
        }
        
        .replying-to > .meta-reply > .text {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
        }

        .replying-to > .meta-reply > .text > .reply {
          display: flex;
          font-size: 0.85rem;
          font-family: var(--font-text), sans-serif;
          padding: 0;
          font-weight: 500;
        }
        
        .replying-to > .meta-reply > .text > svg {
          color: var(--gray-color);
          width: 16px;
          height: 16px;
          display: inline-block;
          margin: 0 0 1px 0px;
        }
        
        .replying-to > .meta-reply .parent {
          background: var(--action-linear);
          font-family: var(--font-mono), monospace;
          font-size: 0.8rem;
          line-height: 1;
          color: transparent;
          font-weight: 600;
          background-clip: text;
          -webkit-background-clip: text;
          -moz-background-clip: text;
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

        .meta > span.by {
          font-weight: 500;
          font-size: 0.93rem;
          margin: 0 0 1px 1px;
        }

        .meta > time.time {
          font-family: var(--font-text), sans-serif;
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

        .content {
          display: flex;
          cursor: pointer;
          flex-flow: column;
          color: var(--text-color);
          line-height: 1.4;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        .content.extra {
          max-height: 200px;
          overflow: hidden;
          position: relative;
        }

        .content.extra .read-more {
          position: absolute;
          bottom: -5px;
          right: 0;
          left: 0;
          width: 100%;
          padding: 5px 0;
          display: flex;
          align-items: end;
          justify-content: center;
          min-height: 80px;
          gap: 3px;
          cursor: pointer;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          color: var(--gray-color);
          background: var(--fade-linear-gradient);
        }

        .content.extra .read-more svg {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin: 0 0 2px 0;
        }

        .content p {
          margin: 0 0 5px 0;
          padding: 0;
          line-height: 1.4;
          font-family: var(--font-text), sans-serif;
        }

        .content p:last-of-type {
          margin: 0;
        }

        .content a {
          cursor: pointer;
          color: var(--anchor-color);
          text-decoration: none;
        }

        .content a:hover {
          text-decoration-color: var(--anchor-active) !important;
          text-decoration: underline;
          -moz-text-decoration-color: var(--anchor-active) !important;
        }

        .content ul a:hover,
        .content ol a:hover {
          text-decoration-color: #4b5563bd !important;
          -moz-text-decoration-color: #4b5563bd !important;
        }

        @media screen and (max-width:660px) {
          :host {
            font-size: 16px;
            border-bottom: var(--border);
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

          .content a {
            cursor: default !important;
          }

          a,
          .content.extra .read-more,
          .replying-to,
          .content,
          span.action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}