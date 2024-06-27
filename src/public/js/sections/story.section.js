export default class StorySection extends HTMLElement {
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

  getDate = isoDateStr => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getContent()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    // check mql for mobile view
    const mql = window.matchMedia('(max-width: 660px)');
    return `
      ${this.getHeader()}
      <article class="article">
        ${this.innerHTML}
      </article>
      ${this.getAuthorContainer(mql.matches)}
      ${this.getMeta()}
      ${this.getShare()}
      ${this.getStats()}
    `;
  }

  getHeader = () => {
    return `
      <div class="head">
        <span class="topic">${this.getAttribute('topic')}</span>
        <h1 class="story-title">${this.getAttribute('story-title')}</h1>
      </div>
    `
  }

  getAuthorContainer = mql => {
    return mql ? this.getAuthor() : '';
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

  getStats = () => {
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
    // Get url to share
    const url = this.getAttribute('url');

    // Get window host url including https/http part
    let host = window.location.protocol + '//' + window.location.host;

    // combine the url with the host
    const shareUrl = `${host}${url}`;

    // Get the tilte of the story
    const title = this.getAttribute('story-title');


    return /* html */`
      <share-wrapper url="${shareUrl.toLowerCase()}" summery="${title}"></share-wrapper>
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
          margin: 0;
          padding: 0;
          display: flex;
          flex-flow: column;
          font-family: var(--font-read), sans-serif;
          gap: 0;
        }

        div.head {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 0;
        }

        div.head > .topic {
          width: max-content;
          color: var(--white-color);
          margin: 5px 0;
          padding: 3px 10px 4px 10px;
          box-shadow: 0 0 0 1px #ffffff25, 0 2px 2px #0000000a, 0 8px 16px -4px #0000000a;
          background: var(--accent-linear);
          font-family: var(--font-read), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        div.head > h1.story-title {
          margin: 0;
          padding: 0;
          font-weight: 700;
          font-size: 1.7rem;
          line-height: 1.5;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
        }

        .meta {
          border-bottom: var(--border);
          border-top: var(--border);
          margin: 10px 0 0;
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

        article.article {
          margin: 3px 0 15px;
          display: flex;
          flex-flow: column;
          color: var(--read-color);
          font-family: var(--font-read), sans-serif;
          gap: 15px;
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

        article.article > .section h2.title {
          padding: 0 !important;
          font-size: 1.3rem !important;
          color: var(--title-color);
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
          font-size: 1.3rem !important;
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

        @media screen and (max-width:660px) {
          :host {
            margin: 0 0 15px;
          }

          * {
            font-size: 1rem;
            line-height: 1.4;
            color: inherit;
            font-family: inherit;
          }

          a {
            cursor: default !important;
          }

          .meta {
            border-bottom: var(--border-mobile);
            border-top: none;
            margin: 5px 0 0 0;
            padding: 12px 0;
            display: flex;
            position: relative;
            color: var(--text-color);
            align-items: center;
            font-family: var(--font-text), sans-serif;
            font-size: 0.95rem;
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

          a,
          .poll > .poll-options > .poll-option label,
          span.stat,
          span.action {
            cursor: default !important;
          }

          .stats.actions > span.play:hover,
          .stats.actions > span.stat:hover,
          .stats.actions > span.action:hover {
            background: none;
          }

          .stats.actions > span.action.share > .overlay {
            position: fixed;
            background-color: var(--modal-overlay);
            z-index: 100;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            display: none;
          }

          .stats.actions > span.action.share > .overlay span.close {
            display: flex;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }

          .stats.actions > span.action.share .options {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-around;
            z-index: 1;
            gap: 0;
            box-shadow: var(--card-box-shadow);
            width: 100%;
            padding: 15px 8px;
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            background: var(--background);
            border: var(--border-mobile);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }

          .stats.actions > span.action.share .options > .option {
            display: flex;
            flex-flow: column-reverse;
            align-items: center;
            justify-content: space-between;
            gap: 5px;
            padding: 10px;
          }

          .stats.actions > span.action.share .options > .option > svg {
            width: 30px;
            height: 30px;
          }

          .stats.actions > span.action.share .options > .option.code > svg {
            width: 29px;
            height: 29px;
          }

          .stats.actions > span.action.share .options > .option.more > svg {
            width: 27px;
            height: 27px;
          }

          .stats.actions > span.action.share .options > .option > span.text {
            font-family: var(--font-read), sans-serif;
            font-weight: 400;
            font-size: 0.8rem;
          }

        }
      </style>
    `;
  }
}