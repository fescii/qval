export default class AllStat extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._up  = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z"></path>
      </svg>
    `;

    this._down = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M4.22 4.179a.75.75 0 0 1 1.06 0l5.26 5.26v-4.2a.75.75 0 0 1 1.5 0v6.01a.75.75 0 0 1-.75.75H5.28a.75.75 0 0 1 0-1.5h4.2L4.22 5.24a.75.75 0 0 1 0-1.06Z"></path>
      </svg>
    `;

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

  calculatePercentageChange = (last, current) => {
    // Calculate the difference between the new and old values
    const difference = current - last;

    // Calculate the percentage change
    const percentageChange = (difference / Math.abs(last)) * 100;

    // Round the result to two decimal places
    const roundedPercentageChange = Math.round(percentageChange * 100) / 100;

    // Format the result as a signed float with two decimal places
    const formattedPercentageChange = roundedPercentageChange.toFixed(2);

    // Convert the formatted string back to a number
    const percentageChangeNumber = parseFloat(formattedPercentageChange);

    return percentageChangeNumber;
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
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader()}
      <div class="content">
        ${this.getAll()}
        ${this.getStories()}
        ${this.getOpinion()}
      </div>
    `;
  }

  getHeader = () => {
    return /* html */`
      <div class="title">
        <h4 class="text">All contents</h4>
        <span class="desc"> Summary of all engagements</span>
      </div>
    `
  }

  getAll = () => {
    let icon = ''
    const lastAll = this.parseToNumber(this.getAttribute('all-last'));
    const currentAll = this.parseToNumber(this.getAttribute('all'));

    // console.log(`Last All: ${lastAll}, Current All: ${currentAll}`);

    const percentageChange = this.calculatePercentageChange(lastAll, currentAll);

    // if percentageChange is negative, we need to make it positive
    const percentage = Math.abs(percentageChange);

    // console.log(`All Percentage Change: ${percentageChange}`);
    if (percentageChange > 0) {
      icon = `
        <span class="change up">
          ${this._up}
          <span class="percentage">${percentage}%</span>
        </span>
      `;

    }
    else {
      icon = `
        <span class="change down">
          ${this._down}
          <span class="percentage">${percentage}%</span>
        </span>
      `;
    }

    return /* html */`
      <div class="main">
        <div class="views">
          <div class="text">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
              <path d="M8.75 1.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V2.25a.75.75 0 0 1 .75-.75Zm-3.5 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm7 0a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Z"></path>
            </svg>
            <h2 class="no">
              ${this.formatNumber(currentAll)}
            </h2>
          </div>
          <span class="desc">Total stats</span>
        </div>
        <div class="compared">
          ${icon}
          <span class="info">Compared to prior month</span>
        </div>
      </div>
    `
  }

  getStories = () => {
    let icon = '';
    const lastStory = this.parseToNumber(this.getAttribute('stories-last'));
    const currentStory = this.parseToNumber(this.getAttribute('stories'));

    // console.log(`Last Story: ${lastStory}, Current Story: ${currentStory}`);

    const percentageChange = this.calculatePercentageChange(lastStory, currentStory);
    // console.log(`Story Percentage Change: ${percentageChange}`);

    // if percentageChange is negative, we need to make it positive
    const percentage = Math.abs(percentageChange);

    if (percentageChange > 0) {
      icon = `
        <span class="change up">
          ${this._up}
          <span class="percentage">${percentage}%</span>
        </span>
      `;

    }
    else {
      icon = `
        <span class="change down">
          ${this._down}
          <span class="percentage">${percentage}%</span>
        </span>
      `;
    }

    return /* html */`
      <div class="main">
        <div class="views">
          <div class="text">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
              <path d="M8.75 1.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V2.25a.75.75 0 0 1 .75-.75Zm-3.5 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm7 0a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Z"></path>
            </svg>
            <h2 class="no">
              ${this.formatNumber(currentStory)}
            </h2>
          </div>
          <span class="desc">All stories</span>
        </div>
        <div class="compared">
          ${icon}
          <span class="info">Compared to prior month</span>
        </div>
      </div>
    `
  }

  getOpinion = () => {
    let icon = '';
    const lastOpinion = this.parseToNumber(this.getAttribute('replies-last'));
    const currentOpinion = this.parseToNumber(this.getAttribute('replies'));

    // console.log(`Last Reply: ${lastOpinion}, Current Reply: ${currentOpinion}`);

    const percentageChange = this.calculatePercentageChange(lastOpinion, currentOpinion);
    // console.log(`Reply Percentage Change: ${percentageChange}`);

    // if percentageChange is negative, we need to make it positive
    const percentage = Math.abs(percentageChange);

    if (percentageChange > 0) {
      icon = `
        <span class="change up">
          ${this._up}
          <span class="percentage">${percentage}%</span>
        </span>
      `;

    }
    else {
      icon = `
        <span class="change down">
          ${this._down}
          <span class="percentage">${percentage}%</span>
        </span>
      `;
    }

    return /* html */`
      <div class="main">
        <div class="views">
          <div class="text">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
              <path d="M8.75 1.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V2.25a.75.75 0 0 1 .75-.75Zm-3.5 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm7 0a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Z"></path>
            </svg>
            <h2 class="no">
              ${this.formatNumber(currentOpinion)}
            </h2>
          </div>
          <span class="desc">All replies</span>
        </div>
        <div class="compared">
          ${icon}
          <span class="info">Compared to prior month</span>
        </div>
      </div>
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
          border-bottom: var(--border-mobile);
          margin: 10px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 10px;
          justify-content: center;
          padding: 0 0 10px;
        }

        .title {
          display: flex;
          position: relative;
          flex-flow: column;
          padding: 6px 0;
          gap: 0;
          justify-content: center;
          color: var(--text-color);
        }

        .title time {
          position: absolute;
          right: 10px;
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          border: var(--input-border);
          padding: 2px 10px;
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
          -ms-border-radius: 5px;
          -o-border-radius: 5px;
        }

        .title > h4 {
          color: var(--text-color);
          font-size: 1.2rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          margin: 0;
        }

        .title > span.desc {
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-text), sans-serif;
        }

        .content {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          gap: 20px;
          padding: 6px 0;
          width: 100%;
        }

        .content > .main {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
        }

        .content > .main .views {
          display: flex;
          width: max-content;
          flex-flow: column;
          align-items: center;
          gap: 0;
          padding: 0;
        }

        .content > .main .views .text {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 0;
          color: var(--text-color);
        }

        .content > .main .views .text svg {
          width: 25px;
          height: 25px;
        }

        .content > .main .views .text > h2 {
          color: var(--text-color);
          font-size: 1.25rem;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          margin: 0;
        }

        .content > .main .views .desc {
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-main), sans-serif;
        }

        .content > .main .compared {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          margin: 20px 0 0 0;
        }

        .content > .main .compared > .change {
          display: flex;
          flex-flow: row;
          gap: 2px;
          padding: 0;
          align-items: center;
        }

        .content > .main .compared > .change.up {
          color: var(--accent-alt);
        }

        .content > .main .compared > .change.down {
          color: var(--error-color);
        }

        .content > .main .compared > .change.up .percentage {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .content > .main .compared > .change .percentage {
          /* color: var(--text-color); */
          font-size: 1.05rem;
          font-weight: 500;
          font-family: var(--font-read), sans-serif;
          margin: 0;
        }

        .content > .main .compared > .change svg {
          width: 20px;
          height: 20px;
        }

        .content > .main .compared span.info {
          color: var(--gray-color);
          font-size: 0.9rem;
          font-family: var(--font-text), sans-serif;
          font-style: italic;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          :host {
            border-bottom: none;
          }

          .content {
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            gap: 0;
            padding: 6px 0;
            width: 100%;
          }

          .content > .main {
            border-bottom: var(--border-mobile);
            width: 100%;
            display: flex;
            flex-flow: column;
            gap: 0;
            padding: 15px 5px;
            border-radius: 5px;
          }
        }
      </style>
    `;
  }
}