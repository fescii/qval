export default class PostWrapper extends HTMLElement {
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

  // fn to take number and return a string with commas
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

    return {dateStr: localDate, timeStr: localTime }
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getFull()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    return `
      <div class="content">
        ${this.innerHTML}
      </div>
    `;
  }

  getMeta = () => {
    let dateObject = this.formatDateWithRelativeTime(this.getAttribute('time'))
    return /* html */`
      <div class="meta">
        <span class="sp">On</span>
        <time class="published" datetime="${this.getAttribute('time')}">${dateObject.dateStr}</time>
        <span class="sp">•</span>
        <span class="sp">at</span>
        <span class="time">${dateObject.timeStr}</span>
      </div>
    `
  }

  getStats = () =>  {
    return /*html*/`
      <action-wrapper full="true" kind="${this.getAttribute('kind')}" reload="false" likes="${this.getAttribute('likes')}" replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}"
        hash="${this.getAttribute('hash')}" views="${this.getAttribute('views')}" url="${this.getAttribute('url')}" summery="Post by - ${this.getAttribute('author-name')}">
      </action-wrapper>
    `
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper hash="${this.getAttribute('author-hash')}" you="${this.getAttribute('author-you')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
       verified="${this.getAttribute('author-verified')}" url="${this.getAttribute('author-url')}" time="${this.getAttribute('time')}"
       bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getFull = () => {
    // check mql for mobile view
    const mql = window.matchMedia('(max-width: 660px)');
    return `
      ${this.getAuthorContainer(mql.matches)}
      ${this.getContent()}
      ${this.getMeta()}
      ${this.getStats()}
    `;
  }

  getAuthorContainer = mql => {
    return mql ? this.getAuthor() : '';
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
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
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

        .content ul a,
        .content ol a {
          background: unset;
          color: var(--font-text);
          font-weight: 500;
          text-decoration-color: var(--anchor) !important;
          text-decoration: underline;
          -moz-text-decoration-color: var(--anchor) !important;
        }

        .content ul a:hover,
        .content ol a:hover {
          text-decoration-color: #4b5563bd !important;
          -moz-text-decoration-color: #4b5563bd !important;
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

        @media screen and (max-width: 660px) {
          :host {
            margin: 0 0 15px;
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

          a,
          .stats > .stat {
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