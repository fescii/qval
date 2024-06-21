export default class StatStory extends HTMLElement {
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
      <span class="content">
        ${this.getAttribute('content')}
      </span>
      <div class="foot">
        <span class="by">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>
          </svg>
          ${this.getAttribute('views')}
        </span>
        <span class="sp">•</span>
        <time datetime="2021-08-12T12:00:00Z">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z"></path>
          </svg>
          ${this.getAttribute('upvotes')}
        </time>
        <span class="sp">•</span>
        <a href="/story/${this.getAttribute('hash')} " class="link">view</a>
        <span class="sp">•</span>
        <a href="/story/${this.getAttribute('hash')}/manage" class="edit">manage</a>
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
        border-bottom: var(--border);
        display: flex;
        flex-flow: column;
        gap: 5px;
        padding: 15px 0;
        width: 100%;
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
        /* font-family: var(--font-main), sans-serif; */
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

      .foot span.by,
      .foot time {
        font-size: 0.85rem;
        font-family: var(--font-main), sans-serif;
        display: flex;
        gap: 5px;
        align-items: center;
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