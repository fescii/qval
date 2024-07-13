export default class UpdateItem extends HTMLElement {
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
    // open preview
    this.openPreview();
  }

  openPreview = () => {
    // get replying-to
    const viewBtn = this.shadowObj.querySelector('.actions > .action#view-action');
    const body = document.querySelector('body');
    const hash = this.getAttribute('hash');
    const url = this.getPreviewUrl(this.getAttribute('kind'), hash.toLowerCase());

    if (viewBtn) {
      viewBtn.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        //get the preview
        let preview = this.getPreview(url);

        // open the preview
        body.insertAdjacentHTML('beforeend', preview);
      });
    }
  }

  getPreviewUrl = (kind, hash) => {
    if (kind === 'story') {
      return `/api/v1/p/${hash}/preview`;
    }

    if (kind === 'reply') {
      return `/api/v1/r/${hash}/preview`;
    }

    if (kind === 'user') {
      return `/api/v1/u/${hash}/preview`;
    }

    if (kind === 'topic') {
      return `/api/v1/t/${hash}/preview`;
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

    // check for minutes
    if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} mins ago`;
    }

    // check if seconds is less than 86400: return time AM/PM
    if (seconds < 86400) {
      // check if the date is today or yesterday
      if (date.getDate() === currentTime.getDate()) {
        return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
      }
      else {
        return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
      }
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
      ${this.getContent(this.innerHTML)}
      ${this.getActions()}
    `;
  }

  getContent = content => {
    return `
      <span class="content">
        ${content}
      </span>
    `
  }

  getActions = () => {
    const viewUrl = this.getUrl(this.getAttribute('kind'), this.getAttribute('hash'));
    return /*html*/`
      <div class="actions">
        <a href="${viewUrl}" class="action view" id="view-action">view</a>
        <span class="action time plain">${this.getLapseTime(this.getAttribute('time'))}</span>
      </div>
    `
  }

  getUrl = (kind, hash) => {
    hash = hash.toLowerCase();
    if (kind === 'story') {
      return `/p/${hash}`;
    }

    if (kind === 'reply') {
      return `/r/${hash}`;
    }

    if (kind === 'user') {
      return `/u/${hash}`;
    }

    if (kind === 'topic') {
      return `/t/${hash}`;
    }
  }

  getHeader = (kind) => {
    const itemType = this.getAttribute('action');
    const name = this.getAttribute('name');
    if (itemType === 'like') {
      return /* html */`
        <div class="head">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" class="liked" fill="currentColor">
            <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
          </svg>
          <span class="text">${name} ${this.getAttribute('verb')} your ${kind}</span>
        </div>
      `
    }

    if (itemType === 'follow') {
      return /* html */`
        <div class="head">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" class="at" fill="currentColor">
            <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
          </svg>
          <span class="text">${name} started following you</span>
        </div>
      `
    }

    if (itemType === 'subscribe') {
      return /* html */`
        <div class="head">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" class="at" fill="currentColor">
            <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path>
          </svg>
          <span class="text">${name} subscribed to your ${kind}</span>
        </div>
      `
    }

    if (itemType === 'reply') {
      return /* html */`
        <div class="head">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" class="reply" fill="currentColor">
            <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22v-2.19a.75.75 0 0 1 .75-.75h1a.25.25 0 0 0 .25-.25Z"></path>
          </svg>
          <span class="text">${name} ${this.getAttribute('verb')} your ${kind}</span>
        </div>
      `
    }

    if (itemType === 'vote') {
      return /* html */`
        <div class="head">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" class="reply" fill="currentColor">
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm1.5 0a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm10.28-1.72-4.5 4.5a.75.75 0 0 1-1.06 0l-2-2a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l1.47 1.47 3.97-3.97a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
          </svg>
          <span class="text">${name} voted on your ${kind}</span>
        </div>
      `
    }
    
    return /* html */`
      <div class="head">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
          <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
        </svg>
        <span class="text">${name} ${this.getAttribute('verb')} your ${kind}</span>
      </div>
    `
  }

  getPreview = url => {
    return /*html*/`
      <preview-popup url="${url}"></preview-popup> 
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
        display: flex;
        flex-flow: column;
        gap: 5px;
        padding: 15px 0;
        width: 100%;
      }

      .head {
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
        width: 14px;
        height: 14px;
        color: var(--gray-color);
        margin: 0 0 0 0;
      }

      .head svg.saved {
        width: 13px;
        height: 13px;
        color: var(--gray-color);
        margin: -2px 0 0 0;
      }

      .head svg.reply,
      .head svg.liked {
        width: 13px;
        height: 13px;
        color: var(--gray-color);
        margin: 0 0 0;
      }

      .head > span.text {
        color: var(--gray-color);
        font-size: 0.9rem;
        font-family: var(--font-read), sans-serif;
        font-style: italic;
      }

      .content {
        color: var(--text-color);
        font-family: var(--font-text), sans-serif;
        display: flex;
        flex-flow: column;
        font-size: 1rem;
        gap: 5px;
        padding: 0;
        width: 100%;
      }

      .foot {
        display: flex;
        flex-flow: row;
        color: var(--text-color);
        align-items: center;
        gap: 5px;
        width: 100%;
        padding: 0;
        font-size: 1rem;
        font-family: var(--font-text), sans-serif;
      }

      .foot span.by {
        font-size: 0.85rem;
        font-family: var(--font-mono), monospace;
        display: flex;
        align-items: center;
        color: var(--gray-color);
        font-weight: 500;
        gap: 3px;
      }
      
      .actions {
        display: flex;
        font-family: var(--font-main), sans-serif;
        width: 100%;
        flex-flow: row;
        align-items: center;
        gap: 8px;
        margin: 5px 0 0 0;
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
        justify-content: center;
        padding: 1.5px 10px 2.5px;
        border-radius: 10px;
      }

      .actions > .action.edit {
        border: none;
        background: var(--action-linear);
        color: var(--white-color);
        font-size: 0.9rem;
      }

      .actions > .action.plain {
        padding: 0;
        pointer-events: none;
        font-family: var(--font-main), sans-serif;
        color: var(--gray-color);
        font-size: 0.95rem;
        border: none;
        background: none;
      }

      .actions > .action.plain > span.text {
        display: inline-block;
        padding: 0 0 0 3px;
      }

      @media screen and (max-width:660px) {
        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        a,
        .actions > .action {
          cursor: default !important;
        }
      }
    </style>
    `;
  }
}