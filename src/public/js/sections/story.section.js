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
    // open the url
    this.openUrl();

    // get the content
    const content = this.shadowObj.querySelector('.article');

    // adjust the indicator
    this.adjustIndicator(content);
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

  openUrl = () => {
    // get all the links
    const links = this.shadowObj.querySelectorAll('article.article a');
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
      <span class="indicator"></span>
      ${this.getContent()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    const htmlText = this.parseHTML(this.innerHTML);
    return `
      ${this.getHeader()}
      <article class="article">
        ${htmlText}
      </article>
      ${this.getMeta()}
      ${this.getStats()}
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

  getHeader = () => {
    // check mql for mobile view
    const mql = window.matchMedia('(max-width: 660px)');
    return `
      ${this.getAuthorContainer(mql.matches)}
      <div class="head">
        <span class="topic">${this.getAttribute('topic')}</span>
        <h1 class="story-title">${this.getAttribute('story-title')}</h1>
      </div>
    `
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

  getStats = () => {
    return /*html*/`
      <action-wrapper full="true" kind="story" reload="false" likes="${this.getAttribute('likes')}" replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}"
        hash="${this.getAttribute('hash')}" views="${this.getAttribute('views')}"  url="${this.getAttribute('url')}" summery="${this.getAttribute('story-title')}">
      </action-wrapper>
    `
  }

  getAuthorContainer = mql => {
    return mql ? this.getAuthor() : '';
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

  adjustIndicator = content => {
    // get total height of the content(including padding and scroll height)
    const totalHeight = content.scrollHeight;

    // get the scroll position of the content
    const scrollPosition = document.documentElement.scrollTop;

    // calculate the percentage of the scroll position
    const scrollPercentage = (scrollPosition / totalHeight) * 100;

    // get the indicator
    const indicator = this.shadowObj.querySelector('.indicator');

    // if percentage is greater than 100, set the indicator to 100%
    if (scrollPercentage + 8 >= 100) {
      indicator.style.width = `100%`;
      return;
    }

    // set the width of the indicator
    indicator.style.width = `${scrollPercentage + 8}%`;


    // add scroll event listener to body but check if the content is still in view
    document.addEventListener('scroll', () => {
      // get total height of the content(minus padding)
      const totalHeight = content.scrollHeight;
      // console.log("totalHeight: ", totalHeight);

      // get the scroll position of the content in the y-axis
      const scrollPosition = document.documentElement.scrollTop + 143;
      // console.log("scrollPosition: ", scrollPosition);

      // calculate the percentage of the scroll position
      const scrollPercentage = (scrollPosition / totalHeight) * 100;

      // if the scroll position is greater than the total height of the content, set the indicator to 100%
      if (scrollPosition >= totalHeight) {
        indicator.style.width = `100%`;
        return;
      }

      // if percentage + 8  is greater than 100, set the indicator to 100%
      if (scrollPercentage + 8 >= 100) {
        indicator.style.width = `100%`;
        return;
      }

      // set the width of the indicator
      indicator.style.width = `${scrollPercentage + 8}%`;
    })
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

        span.indicator {
          display: flex;
          z-index: 4;
          width: 0%;
          height: 3px;
          background: var(--alt-linear);
          border-radius: 5px;
          transition: width 0.3s;
          position: sticky;
          top: 60px;
          left: 0;
        }

        div.head {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 15px 0 0;
        }

        div.head > .topic {
          width: max-content;
          color: var(--gray-color);
          padding: 3px 10px 3px 10px;
          background: var(--light-linear);
          font-family: var(--font-read), sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
        }

        div.head > h1.story-title {
          margin: 8px 0 0 0;
          padding: 0;
          font-weight: 600;
          font-size: 1.6rem;
          line-height: 1.5;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
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

        article.article {
          margin: 3px 0 0;
          display: flex;
          flex-flow: column;
          color: var(--read-color);
          font-family: var(--font-text), sans-serif;
          gap: 0;
          font-size: 1rem;
          font-weight: 400;
        }

        article.article * {
          font-size: 1.05rem;
          line-height: 1.4;
          color: inherit;
          font-family: inherit;
        }

        article.article h6,
        article.article h5,
        article.article h4,
        article.article h3,
        article.article h1 {
          padding: 0;
          font-size: 1.3rem !important;
          color: var(--title-color);
          font-weight: 500;
          line-height: 1.5;
          margin: 5px 0;
        }

        article.article .intro p {
          margin: 0 0 5px 0;
          line-height: 1.5;
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

        article.article .section {
          margin: 15px 0 0 0;
          padding: 0;
          display: flex;
          flex-flow: column;
        }

        article.article > .section > h2.title {
          font-size: 1.3rem !important;
          color: var(--title-color);
          font-weight: 500;
          line-height: 1.5;
          margin: 0;
          padding: 0 0 0 13px;
          position: relative;
        }

        article.article > .section h2.title:before {
          content: "";
          position: absolute;
          bottom: 10%;
          left: 0;
          width: 4px;
          height: 80%;
          background: var(--accent-linear);
          border-radius: 5px;
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

          span.indicator {
            display: flex;
            width: 10%;
            height: 3px;
            border-radius: 5px;
            transition: width 0.3s;
            position: sticky;
            top: 50px;
            left: 0;
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
          span.action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}