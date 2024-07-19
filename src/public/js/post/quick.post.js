export default class QuickPost extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.boundHandleWsMessage = this.handleWsMessage.bind(this);
    this.checkAndAddHandler = this.checkAndAddHandler.bind(this);

    this.viewTimer = null;
    this.hasBeenViewed = false;
    this.observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Consider the post visible when 50% is in view
    };

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.style.display = 'flex';

    // Check and add handler
    this.checkAndAddHandler();

    this.setupIntersectionObserver();

    // Open read more
    this.openReadMore();

    // Open full post
    this.openQuickPost()

    // Open url
    this.openUrl();
  }

  checkAndAddHandler() {
    if (window.wss) {
      window.wss.addMessageHandler(this.boundHandleWsMessage);
      // console.log('WebSocket handler added successfully');
    } else {
      // console.log('WebSocket manager not available, retrying...');
      setTimeout(this.checkAndAddHandler, 500); // Retry after 500ms
    }
  }

  disconnectedCallback() {
    if (window.wss) {
      window.wss.removeMessageHandler(this.boundHandleWsMessage);
    }

    if (this.observer) {
      this.observer.disconnect();
    }
    this.clearViewTimer();
  }

  handleWsMessage = message => {
    // Handle the message in this component
    // console.log('Message received in component:', message);
    const data = message.data;

    if (message.type !== 'action') return;

    const user = data?.user;
    const userHash = window.hash;

    const author = this.shadowObj.querySelector('hover-author');
    const actionWrapper = this.shadowObj.querySelector('action-wrapper');

    const hash = this.getAttribute('hash').toUpperCase();
    const authorHash = this.getAttribute('author-hash').toUpperCase();

    const target = data.hashes.target;

    if (data.action === 'connect' && data.kind === 'user') {
      this.handleConnectAction(data, author, userHash, authorHash);
    } else if (target === hash) {
      if (data.action === 'like') {
        if(user !== null && user === userHash) {
          return;
        }
        // get likes parsed to number
        const likes = (this.parseToNumber(this.getAttribute('likes')) + data.value);
        // update likes
        this.setAttribute('likes', likes);
        // update likes in the action wrapper
        actionWrapper.setAttribute('likes', likes);
        actionWrapper.setAttribute('reload', 'true');
      } 
      else if(data.action === 'reply'){
        const replies = this.parseToNumber(this.getAttribute('replies')) + data.value;
        this.setAttribute('replies', replies);
        actionWrapper.setAttribute('replies', replies);
        actionWrapper.setAttribute('reload', 'true');
      } 
      else if(data.action === 'view') {
        const views = this.parseToNumber(this.getAttribute('views')) + data.value;
        this.setAttribute('views', views);
        actionWrapper.setAttribute('views', views);
        actionWrapper.setAttribute('reload', 'true');
      }
    }
  }

  sendWsMessage(data) {
    if (window.wss) {
      window.wss.sendMessage(data);
    } else {
      console.warn('WebSocket connection not available. view information not sent.');
    }
  }

  handleConnectAction = (data, author, userHash, authorHash) => {
    const to = data.hashes.to;
    if(to === authorHash) {
      const followers = this.parseToNumber(this.getAttribute('author-followers')) + data.value;
      this.setAttribute('author-followers', followers)
      this.updateFollowers(author, this.getAttribute('author-followers'));

      if (data.hashes.from === userHash) {
        const value = data.value === 1 ? 'true' : 'false';
  
        // update user-follow/auth-follow attribute
        this.setAttribute('author-follow', value);
        author.setAttribute('user-follow', value);
      }

      author.setAttribute('reload', 'true');
    }
  }

  updateFollowers = (element, value) => {
    element.setAttribute('followers', value);
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.startViewTimer();
        } else {
          this.clearViewTimer();
        }
      });
    }, this.observerOptions);

    this.observer.observe(this);
  }

  startViewTimer() {
    if (this.hasBeenViewed) return;

    this.viewTimer = setTimeout(() => {
      this.sendViewData();
      this.hasBeenViewed = true;
    }, 5000); // 5 seconds
  }

  clearViewTimer() {
    if (this.viewTimer) {
      clearTimeout(this.viewTimer);
      this.viewTimer = null;
    }
  }

  sendViewData() {
    const authorHash = this.getAttribute('author-hash').toUpperCase();
    // check if the author is the user
    if (authorHash === window.hash) return;

    const hash = this.getAttribute('hash').toUpperCase();
    let kind = this.getAttribute('story');
    if(kind === 'quick') {
      kind = 'story';
    }
    const viewData = {
      type: 'action',
      frontend: true,
      data: {
        kind: kind,
        publish: true,
        hashes: { target: hash },
        action: 'view',
        value: 1
      }
    };

    // send the view data
    this.sendWsMessage(viewData);
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
    } else if (n >= 1000000000) {
      return "1B+";
    }
    else {
      return 0;
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
      let url = parent.startsWith('P') ? `/api/v1/p/${parent.toLowerCase()}/preview` : `/api/v1/r/${parent.toLowerCase()}/preview`;
      return /*html*/`
        <preview-post url="${url}" hash="${parent}" preview="quick"></preview-post>
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
        picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}" contact='${this.getAttribute("author-contact")}'
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
        author-stories="${this.getAttribute('author-stories')}" author-replies="${this.getAttribute('author-replies')}" author-contact='${this.getAttribute("author-contact")}'
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

        .meta {
          width: 100%;
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
          width: 100%;
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
            width: 100%;
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