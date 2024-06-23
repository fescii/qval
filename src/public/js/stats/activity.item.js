export default class ActivityItem extends HTMLElement {
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader(this.getAttribute('kind'))}
      <span class="content">
        ${this.getAttribute('content')}
      </span>
      <div class="foot">
        ${this.getAuthor(this.getAttribute('by'))}
        <time datetime="2021-08-12T12:00:00Z">${this.getAttribute('on')}</time>
        <span class="sp">•</span>
        <a href="/story/${this.getAttribute('hash')} " class="link">view</a>
        ${this.getAction(this.getAttribute('by'))}
      </div>
    `;
  }

  getAuthor = (by) => {
    if (by === 'you') {
      return ''
    }
    else {
      return /* html */ `
        <span class="by">by<span>${this.getAttribute('by')}</span></span>
        <span class="sp">•</span>
      `
    }
  }

  getAction = (by) => {
    if (by === 'you') {
      return /* html */ `
        <span class="sp">•</span>
        <a href="/story/${this.getAttribute('hash')}/manage" class="edit">manage</a>
      `
    }
    else {
      return ''
    }
  }

  getHeader = (kind) => {
    const itemType = this.getAttribute('type');
    switch (kind) {
      case 'added':
        if (itemType === 'story') {
          return /* html */`
            <div class="head">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
                <path
                  d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z">
                </path>
              </svg>
              <span class="text">You added a story</span>
            </div>
          `
        }
        else {
          return /* html */`
            <div class="head">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
                <path
                  d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z">
                </path>
              </svg>
              <span class="text">You added an reply</span>
            </div>
          `
        }
      case 'saved':
        if (itemType === 'story') {
          return /* html */`
            <div class="head">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" class="saved">
                <path
                  d="m11.294.984 3.722 3.722a1.75 1.75 0 0 1-.504 2.826l-1.327.613a3.089 3.089 0 0 0-1.707 2.084l-.584 2.454c-.317 1.332-1.972 1.8-2.94.832L5.75 11.311 1.78 15.28a.749.749 0 1 1-1.06-1.06l3.969-3.97-2.204-2.204c-.968-.968-.5-2.623.832-2.94l2.454-.584a3.08 3.08 0 0 0 2.084-1.707l.613-1.327a1.75 1.75 0 0 1 2.826-.504ZM6.283 9.723l2.732 2.731a.25.25 0 0 0 .42-.119l.584-2.454a4.586 4.586 0 0 1 2.537-3.098l1.328-.613a.25.25 0 0 0 .072-.404l-3.722-3.722a.25.25 0 0 0-.404.072l-.613 1.328a4.584 4.584 0 0 1-3.098 2.537l-2.454.584a.25.25 0 0 0-.119.42l2.731 2.732Z">
                </path>
              </svg>
              <span class="text">You saved a story</span>
            </div>
          `
        }
        else {
          return /* html */`
            <div class="head">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" class="saved">
                <path
                  d="m11.294.984 3.722 3.722a1.75 1.75 0 0 1-.504 2.826l-1.327.613a3.089 3.089 0 0 0-1.707 2.084l-.584 2.454c-.317 1.332-1.972 1.8-2.94.832L5.75 11.311 1.78 15.28a.749.749 0 1 1-1.06-1.06l3.969-3.97-2.204-2.204c-.968-.968-.5-2.623.832-2.94l2.454-.584a3.08 3.08 0 0 0 2.084-1.707l.613-1.327a1.75 1.75 0 0 1 2.826-.504ZM6.283 9.723l2.732 2.731a.25.25 0 0 0 .42-.119l.584-2.454a4.586 4.586 0 0 1 2.537-3.098l1.328-.613a.25.25 0 0 0 .072-.404l-3.722-3.722a.25.25 0 0 0-.404.072l-.613 1.328a4.584 4.584 0 0 1-3.098 2.537l-2.454.584a.25.25 0 0 0-.119.42l2.731 2.732Z">
                </path>
              </svg>
              <span class="text">You saved an reply</span>
            </div>
          `
        }
      case 'upvoted':
        if (itemType === 'story') {
          return /* html */`
            <div class="head">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" class="upvoted">
                <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z"></path>
              </svg>
              <span class="text">You upvoted a story</span>
            </div>
          `
        }
        else {
          return /* html */`
            <div class="head">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" class="upvoted">
                <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z"></path>
              </svg>
              <span class="text">You upvoted an reply</span>
            </div>
          `
        }
      case 'mentioned':
        if (itemType === 'story') {
          return /* html */`
            <div class="head">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" class="at">
                <path
                  d="M4.75 2.37a6.501 6.501 0 0 0 6.5 11.26.75.75 0 0 1 .75 1.298A7.999 7.999 0 0 1 .989 4.148 8 8 0 0 1 16 7.75v1.5a2.75 2.75 0 0 1-5.072 1.475 3.999 3.999 0 0 1-6.65-4.19A4 4 0 0 1 12 8v1.25a1.25 1.25 0 0 0 2.5 0V7.867a6.5 6.5 0 0 0-9.75-5.496ZM10.5 8a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z">
                </path>
              </svg>
              <span class="text">You were mentioned in a story</span>
            </div>
          `
        }
        else {
          return /* html */`
            <div class="head">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" class="at">
                <path
                  d="M4.75 2.37a6.501 6.501 0 0 0 6.5 11.26.75.75 0 0 1 .75 1.298A7.999 7.999 0 0 1 .989 4.148 8 8 0 0 1 16 7.75v1.5a2.75 2.75 0 0 1-5.072 1.475 3.999 3.999 0 0 1-6.65-4.19A4 4 0 0 1 12 8v1.25a1.25 1.25 0 0 0 2.5 0V7.867a6.5 6.5 0 0 0-9.75-5.496ZM10.5 8a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z">
                </path>
              </svg>
              <span class="text">You were mentioned in an reply</span>
            </div>
          `
        }
      default:
        return /* html */`
          <div class="head">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
              <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
            </svg>
            <span class="text">An activity was added</span>
          </div>
        `
    }

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
        display: flex;
        flex-flow: column;
        gap: 5px;
        padding: 15px 0;
        width: 100%;
      }

      .head {
        /* border: 1px solid #6b7280; */
        color: var(--text-color);
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 0;
        width: 100%;
      }

      .head svg {
        width: 15px;
        height: 15px;
        color: var(--gray-color);
        margin: 0 0 -1px 0;
      }

      .head svg.at {
        width: 13px;
        height: 13px;
        /* rotate: 45deg; */
        color: var(--gray-color);
        margin: 0 0 -1px 0;
      }

      .head svg.saved {
        width: 13px;
        height: 13px;
        color: var(--gray-color);
        margin: -2px 0 0 0;
      }

      .head svg.upvoted {
        width: 14px;
        height: 14px;
        color: var(--gray-color);
        margin: -0.5px 0 0 0;
      }

      .head > span.text {
        color: var(--gray-color);
        font-size: 0.9rem;
        font-family: var(--font-text), sans-serif;
        font-style: italic;
      }

      .content {
        /* border: 1px solid #6b7280; */
        color: var(--text-color);
        font-family: var(--font-read), sans-serif;
        display: flex;
        flex-flow: column;
        font-size: 0.95rem;
        gap: 5px;
        padding: 0;
        width: 100%;
      }

      .foot {
        /* border: 1px solid #6b7280; */
        color: var(--gray-color);
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        gap: 5px;
        padding: 0;
        width: 100%;
      }

      .foot > .hash {
        color: var(--gray-color);
        font-size: 0.85rem;
        font-family: var(--font-main), sans-serif;
      }

      .foot a {
        color: var(--gray-color);
        font-size: 0.9rem;
        font-family: var(--font-main), sans-serif;
        text-decoration: none;
      }

      .foot a:hover {
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .foot .sp {
        color: var(--gray-color);
        font-size: 0.8rem;
        margin: 0;
      }

      .foot span.by {
        font-size: 0.85rem;
        font-family: var(--font-mono), monospace;
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .foot span.by > span {
        font-size: 0.8rem;
        margin: 0 0 -2px 0;
      }
      .foot time {
        font-size: 0.9rem;
        font-family: var(--font-mono), monospace;
        text-transform: capitalize;
      }

      @media screen and (max-width:660px) {
        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }
      }
    </style>
    `;
  }
}