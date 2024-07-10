export default class StatOpinion extends HTMLElement {
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const likes = this.parseToNumber(this.getAttribute('likes'));
    const views = this.parseToNumber(this.getAttribute('views'));
    return /* html */`
      <span class="content">
        ${this.getAttribute('content')}
      </span>
      ${this.getActions(likes, views)}
    `;
  }

  getActions = (likes, views) => {
    const viewUrl = this.getAttribute('url');
    const editUrl = this.getAttribute('edit-url');
    return /*html*/`
      <div class="actions">
        <a href="${editUrl}" class="action edit" id="edit-action">edit</a>
        <a href="${viewUrl}" class="action view" id="view-action">view</a>
        <span class="action likes plain">
          <span class="no">${this.formatNumber(likes)}</span> <span class="text">${likes === 1 ? 'like' : 'likes'}</span>
        </span>
        <span class="action views plain">
          <span class="no">${this.formatNumber(views)}</span> <span class="text">${views === 1 ? 'view' : 'views'}</span>
        </span>
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
        display: flex;
        flex-flow: column;
        gap: 10px;
        padding: 10px 0;
        width: 100%;
      }

      .content {
        color: var(--text-color);
        font-family: var(--font-read), sans-serif;
        display: flex;
        flex-flow: column;
        font-size: 0.95rem;
        gap: 5px;
        padding: 0;
        width: 100%;
      }

      .actions {
        display: flex;
        font-family: var(--font-main), sans-serif;
        width: 100%;
        flex-flow: row;
        align-items: center;
        gap: 8px;
        margin: 0;
      }
      
      .actions > .action {
        border: var(--border);
        text-decoration: none;
        color: var(--gray-color);
        font-size: 0.9rem;
        display: flex;
        width: max-content;
        flex-flow: row;
        align-items: center;
        text-transform: lowercase;
        justify-content: center;
        padding: 1.5px 10px 2.5px;
        border-radius: 10px;
      }

      /*.actions > .action.edit {
        border: none;
        background: var(--action-linear);
        color: var(--white-color);
        font-size: 0.9rem;
      }*/

      .actions > .action.plain {
        padding: 0;
        font-weight: 500;
        pointer-events: none;
        font-family: var(--font-text), sans-serif;
        color: var(--gray-color);
        border: none;
        background: none;
      }
      
      .actions > .action.plain > span.no {
        font-family: var(--font-main), sans-serif;
        font-size: 0.85rem;
        color: var(--text-color);
      }

      .actions > .action.plain > span.text {
        display: inline-block;
        padding: 0 0 0 3px;
      }

      @media screen and (max-width:660px) {
        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        .actions {
          width: 100%;
        }
        a {
          cursor: default !important;
        }
      }
    </style>
    `;
  }
}