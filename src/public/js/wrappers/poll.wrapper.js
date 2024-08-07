export default class PollWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  // observe attributes 
  static get observedAttributes() {
    return ['likes', 'replies', 'views', 'author-followers', 'reload', 'author-follow', 'vote'];
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // on attribute change
  attributeChangedCallback(name, oldValue, newValue) {
    const actionEl = this.shadowObj.querySelector('action-wrapper');
    const authorEl = this.shadowObj.querySelector('author-wrapper');
    const voteEl = this.shadowObj.querySelector('votes-wrapper');
    if(name === 'reload' && newValue === 'true') {
      this.setAttribute('reload', 'false');
      this.updateReload(actionEl, authorEl);
    }
    if (oldValue !== newValue) {
      if (name === 'likes') {
        this.updateLikes(actionEl, newValue);
      } else if (name === 'replies') {
        this.updateReplies(actionEl, newValue);
      } else if (name === 'views') {
        this.updateViews(actionEl, newValue);
      } else if (name === 'author-followers') {
        this.updateFollowers(authorEl, newValue);
        // Note: Missing break in the original switch, assuming intentional fall-through
      } else if (name === 'author-follow') {
        this.updateFollow(authorEl, newValue);
      } else if (name === 'vote') {
        voteEl.setAttribute('vote', this.getAttribute('vote'));
      }
    }
  }

  connectedCallback() {
    // Scroll to the top of the page
    window.scrollTo(0, 0);

    // Open the url
    this.openUrl();
  }

  updateReload = (elOne, elTwo) => {
    if (elOne) {
      elOne.setAttribute('reload', 'true');
    }

    if (elTwo) {
      elTwo.setAttribute('reload', 'true');
    }
  }

  updateFollow = (element, value) => {
    if (element) {
      element.setAttribute('user-follow', value);
    }
  }

  updateLikes = (element, value) => {
    // update likes in the element and this element
    this.setAttribute('likes', value);
    if (element) {
      element.setAttribute('likes', value);
    }
  }

  updateFollowers = (element, value) => {
    // update followers in the element and this element
    this.setAttribute('author-followers', value);
    if (element) {
      element.setAttribute('followers', value);
    }
  }

  updateViews = (element, value) => {
    // update views in the element and this element
    this.setAttribute('views', value);
    if (element) {
      element.setAttribute('views', value);
    }
  }

  updateReplies = (element, value) => {
    // update replies in the element and this element
    this.setAttribute('replies', value);
    if (element) {
      element.setAttribute('replies', value);
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

  parseToNumber = str => {
    // Try parsing the string to an integer
    const num = parseInt(str);

    // Check if parsing was successful
    if (!isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  }

  // fn to take number and return a string with commas
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  formatDateWithRelativeTime = isoDateStr => {
    // 1. Convert ISO date string with timezone to local Date object
    let date;
    try {
      date = new Date(isoDateStr);
    }
    catch (error) {
      date = new Date(Date.now())
    }

    // Get date
    const localDate = date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit'
    });

    // Get time
    let localTime = date.toLocaleDateString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });

    localTime = localTime.split(',')[1].trim();

    return { dateStr: localDate, timeStr: localTime }
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
      ${this.getFull()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    // console.log(this)
    const text = this.innerHTML;
    const htmlText = this.parseHTML(text)
    return `
      <div class="content" id="content">
        ${htmlText}
      </div>
    `;
  }

  // Function to detect and parse the text
  parseHTML = text => {
    // Create a temporary element to help with parsing
    const tempElement = document.createElement('div');
    
    // Check if the text is encoded (contains &lt; or &gt;)
    if (text.includes('&lt;') || text.includes('&gt;')) {
      // Create a textarea element to decode the HTML entities
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      tempElement.innerHTML = textarea.value;
    } else {
        // Directly set the innerHTML for plain HTML
      tempElement.innerHTML = text;
    }
    
    // Return the parsed HTML
    return tempElement.innerHTML;
  }

  getPoll = () =>  {
    return /*html*/`
      <votes-wrapper reload="false" votes="${this.getAttribute('votes')}" selected="${this.getAttribute('selected')}"
        hash="${this.getAttribute('hash')}" wrapper="true"
        end-time="${this.getAttribute('end-time')}" voted="${this.getAttribute('voted')}" options="${this.getAttribute('options')}">
      </votes-wrapper>
    `
  }

  getStats = () =>  {
    return /*html*/`
      <action-wrapper full="true" kind="story" reload="false" likes="${this.getAttribute('likes')}" replies="${this.getAttribute('replies')}"
        liked="${this.getAttribute('liked')}" wrapper="true"
        hash="${this.getAttribute('hash')}" views="${this.getAttribute('views')}" url="${this.getAttribute('url')}" summary="Post by - ${this.getAttribute('author-name')}">
      </action-wrapper>
    `
  }

  getMeta = () => {
    let dateObject = this.formatDateWithRelativeTime(this.getAttribute('time'))
    return /* html */`
      <div class="meta">
        <span class="sp">on</span>
        <time class="published" datetime="${this.getAttribute('time')}">${dateObject.dateStr}</time>
        <span class="sp">•</span>
        <span class="sp">at</span>
        <span class="time">${dateObject.timeStr}</span>
      </div>
    `
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper you="${this.getAttribute('author-you')}" hash="${this.getAttribute('author-hash')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
        stories="${this.getAttribute('author-stories')}" replies="${this.getAttribute('author-replies')}"
        followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}" contact='${this.getAttribute("author-contact")}'
        verified="${this.getAttribute('author-verified')}" url="/u/${this.getAttribute('author-hash').toLowerCase()}"
        bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getLoader = () => {
    return `
			<post-loader speed="300"></post-loader>
		`
  }

  getFull = () => {
    // check mql for mobile view
    const mql = window.matchMedia('(max-width: 660px)');
    return `
      ${this.getAuthorContainer(mql.matches)}
      ${this.getContent()}
      ${this.getPoll()}
      ${this.getMeta()}
      ${this.getStats()}
    `;
  }

  getAuthorContainer = mql => {
    return mql ? this.getAuthor() : '';
  }

  getBody() {
    return `
      <div class="content-container">
        ${this.getLoader()}
      </div>
    `;
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
          gap: 0;
          width: 100%;
          height: max-content;
        }

        .content-container {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          height: max-content;
        }

        .content {
          display: flex;
          flex-flow: column;
          color: var(--text-color);
          line-height: 1.5;
          gap: 0;
          margin: 0;
          padding: 5px 0 10px;
        }

        .content p {
          margin: 0 0 5px 0;
          padding: 0;
          line-height: 1.5;
          font-size: 1.05rem;
          font-family: var(--font-text), sans-serif;
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

        .content ul,
        .content ol {
          margin: 10px 0 0 20px;
          line-height: 1.4;
          color: var(--font-text);
          font-family: var(--font-text), sans-serif;
        }

        .meta {
          border-bottom: var(--border);
          border-top: var(--border);
          margin: 5px 0 0 0;
          padding: 10px 0;
          display: flex;
          position: relative;
          color: var(--text-color);
          align-items: center;
          font-family: var(--font-text), sans-serif;
          gap: 5px;
          font-size: 1rem;
          font-weight: 600;
        }

        .meta > .sp {
          font-size: 1rem;
          color: var(--gray-color);
          font-weight: 400;
        }

        @media screen and (max-width: 660px) {
          :host {
            margin: 0;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          .content {
            display: flex;
            flex-flow: column;
            color: var(--text-color);
            line-height: 1.5;
            gap: 0;
            margin: 0;
            padding: 5px 0 0;
          }

          .meta {
            display: flex;
            position: relative;
            color: var(--text-color);
            align-items: center;
            font-family: var(--font-text), sans-serif;
            font-size: 0.9rem;
            gap: 5px;
            font-weight: 600;
          }

          .stats {
            padding: 10px 0;
          }

          a,
          .stats > .stat {
            cursor: default !important;
          }

          .content a {
            cursor: default !important;
          }

          a,
          span.stat,
          span.action {
            cursor: default !important;
          }

          .stats.actions > span.play:hover,
          .stats.actions > span.stat:hover,
          .stats.actions > span.action:hover {
            background: none;
          }
        }
      </style>
    `;
  }
}