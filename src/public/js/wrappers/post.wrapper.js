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

    // Get total number of views
    let views = this.getAttribute('views');

    // views format
    views = this.numberWithCommas(views);

    return /* html */`
      <div class="meta">
        <span class="time">${dateObject.timeStr}</span>
        <span class="sp">•</span>
        <time class="published" datetime="${this.getAttribute('time')}">${dateObject.dateStr}</time>
        <span class="sp">•</span>
        <span class="views">
          <span class="no">${views}</span>
          <span class="text">views</span>
        </span>
      </div>
    `
  }

  getStats = () =>  {
    return /*html*/`
      <action-wrapper full="true" kind="story" reload="false" likes="${this.getAttribute('likes')}" replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}"
        hash="${this.getAttribute('hash')}" views="${this.getAttribute('views')}">
      </action-wrapper>
    `
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper hash="${this.getAttribute('author-hash')}" picture="${this.getAttribute('author-picture')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
       verified="${this.getAttribute('author-verified')}" url="${this.getAttribute('author-url')}"
       bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getShare = () => {
    // get content of the story
    let content = this.innerHTML;

    // remove all html tags from the content
    content = content.replace(/<[^>]*>?/gm, '');

    // trim all white spaces from the content
    content = content.trim();

    // shorten the content to 85 characters
    content = content.length > 85 ? content.substring(0, 85) : content;

    // Get url to share
    const url = this.getAttribute('url');

    // Get window host url including https/http part
    let host = window.location.protocol + '//' + window.location.host;

    // combine the url with the host
    const shareUrl = `${host}${url}`;

    return /* html */`
      <share-wrapper url="${shareUrl.toLowerCase()}" summery="${content}"></share-wrapper>
    `
  }

  getFull = () => {
    // check mql for mobile view
    const mql = window.matchMedia('(max-width: 660px)');
    return `
      ${this.getContent()}
      ${this.getAuthorContainer(mql.matches)}
      ${this.getShare()}
      ${this.getMeta()}
      ${this.getStats()}
      <form-container type="post"></form-container>
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
          /* border: 1px solid #6b7280;*/
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
          border-bottom: var(--border);
          color: var(--text-color);
          line-height: 1.5;
          gap: 0;
          margin: 0;
          padding: 0 0 15px 0;
        }

        .content p {
          margin: 5px 0 0 0;
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
          border-top: none;
          margin: 0;
          padding: 12px 0;
          display: flex;
          position: relative;
          color: var(--text-color);
          align-items: center;
          font-family: var(--font-text), sans-serif;
          gap: 5px;
          font-size: 1rem;
          font-weight: 600;
        }

        .stats.actions {
          /* border: var(--input-border); */
          padding: 5px 0 0 0;
          margin: 0 0 15px 0;
          display: flex;
          align-items: center;
          gap: 0;
        }

        .stats.actions > span.write.action {
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          font-family: var(--font-text) sans-serif;
          font-size: 0.95rem;
          justify-content: start;
          gap: 5px;
          padding: 5px 5px;
          height: 30px;
          border-radius: 50px;
          font-weight: 500;
          font-size: 1rem;
          color: var(--gray-color);
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        .stats.actions > span.write.action > svg {
          width: 19px;
          height: 19px;
          margin: -2px 0 0 0;
        }

        .stats.actions > span.write.action span.line {
          background: var(--accent-linear);
          position: absolute;
          top: 30px;
          left: 13px;
          display: none;
          width: 3px;
          height: 20px;
          border-radius: 5px;
        }

        .stats.actions > span.write.action.open span.line {
          display: inline-block;
        }

        .stats.actions > span.write.action.open {
          color: var(--accent-color);
        }

        .stats.actions > span.write.action.open > span.numbers {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .stats.actions > span.stat,
        .stats.actions > span.action {
          /* border: var(--input-border); */
          min-height: 35px;
          height: 30px;
          width: max-content;
          position: relative;
          padding: 5px 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 1rem;
          font-weight: 400;
          /* color: var(--action-color); */
          color: var(--gray-color);
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        .stats.actions > span.stat.views {
          gap: 2px;
        }

        .stats.actions > span.stat.views {
          padding: 5px 5px;
        }

        .stats.actions > span:first-of-type {
          margin: 0 0 0 -7px;
        }

        .stats.actions > span.play:hover,
        .stats.actions > span.stat:hover,
        .stats.actions > span.action:hover {
          background: var(--hover-background);
        }

        .stats.actions > span.stat.views:hover {
          background: inherit;
        }

        .stats.actions span.numbers {
          /* border: var(--input-border); */
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .stats.actions > span {
          /* border: var(--input-border); */
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          font-size: 1rem;
          font-weight: 400;
          /* color: var(--gray-color); */
        }

        .stats.actions > .stat > .numbers,
        .stats.actions > .action > .numbers {
          height: 21px;
          min-height: 21px;
          padding: 0;
          margin: 0;
          display: flex;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          gap: 0;
          align-items: start;
          justify-content: start;
          flex-flow: column;
          transition: height 0.5s ease, min-height 0.5s ease; /* Specify the properties to transition */
          -ms-overflow-style: none;
          scrollbar-width: none;
          will-change: transform;
        }

        .stats.actions > span > .numbers::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        .stats.actions > span > .numbers > span {
          /* border: 1px solid red; */
          scroll-snap-align: start;
          transition: height 0.5s ease, min-height 0.5s ease; /* Specify the properties to transition */
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 21px;
          min-height: 21px;
          padding: 3px 0;
          margin: 0;
          font-family: var(--font-main), sans-serif;
          font-size: 0.95rem;
        }

        .stats.actions > span.true > .numbers > span,
        .stats.actions > span.active > .numbers > span {
          color: transparent;
          background: var(--second-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .stats.actions > span.up > .numbers > span {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .stats.actions > span.down > .numbers > span {
          color: transparent;
          background: var(--error-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .stats.actions > span svg {
          color: inherit;
          width: 16px;
          height: 16px;
        }

        .stats.actions > span.action.like svg {
          margin: -1px 0 0 0;
          width: 16px;
          height: 16px;
          transition: transform 0.5s ease;
        }

        .stats.actions > span.stat.views svg {
          color: inherit;
          width: 16px;
          height: 16px;
        }

        .stats.actions > span.stat.up svg {
          color: var(--accent-color);
        }

        .stats.actions > span.stat.down svg {
          color: var(--error-color);
        }

        .stats.actions > span.true svg,
        .stats.actions > span.active svg {
          color: var(--alt-color);
        }

        @media screen and (max-width: 660px) {
          :host {
            margin: 0 0 15px;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          .content {
            border-bottom: var(--border-mobile);
            margin: 0 0 15px;
          }

          .meta {
            border-bottom: var(--border-mobile);
            margin: 5px 0 0 0;
            padding: 12px 0;
            display: flex;
            position: relative;
            color: var(--text-color);
            align-items: center;
            font-family: var(--font-text), sans-serif;
            font-size: 0.95rem;
            gap: 5px;
            font-weight: 500;
          }

          .stats {
            padding: 10px 0;
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