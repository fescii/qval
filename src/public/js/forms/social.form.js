export default class FormName extends HTMLElement {
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
      ${this.getHeader()}
      <form class="fields initial" id="social-form">
        <div class="field bio">
          <div class="input-group email">
            <span class="wrapper">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                  <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"></path>
                </svg>
              </span>
              ${this.getEmail(this.getAttribute('email'))}
            </span>
          </div>
          <div class="input-group x">
            <span class="wrapper">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                </svg>
              </span>
              ${this.getX(this.getAttribute('x'))}
            </span>
          </div>
          <div class="input-group linkedin">
            <span class="wrapper">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </span>
              ${this.getLinkedin(this.getAttribute('linkedin'))}
            </span>
          </div>
          <div class="input-group threads">
            <span class="wrapper">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-threads" viewBox="0 0 16 16">
                  <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161" />
                </svg>
              </span>
              ${this.getThreads(this.getAttribute('threads'))}
            </span>
          </div>
          <div class="input-group threads">
            <span class="wrapper">
              <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"  fill="currentColor"  width="16" height="16">
                  <path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>
                </svg>
              </span>
              ${this.getLink(this.getAttribute('link'))}
            </span>
          </div>
        </div>
        <div class="actions">
          <button type="submit" class="action next">
            <span class="text">Update socials</span>
          </button>
        </div>
      </form>
    `;
  }

  getHeader = () => {
    return /* html */`
      <div class="top">
        <p class="desc">
          Your socials are how people will connect with you outside the platform. You can add your email, twitter, linkedin, and x accounts.
        </p>
      </div>
    `;
  }

  getEmail = email => {
    if(email !== 'null' && email !== undefined && email !== null) {
      return `
        <input type="email" name="email" id="email" placeholder="e.g john@example.com" value="${email}">
      `;
    }
    else {
      return `
        <input type="email" name="email" id="email" placeholder="e.g john@example.com">
      `;
    }
  }

  getX = data => {
    if (data !== 'null' && data !== undefined && data !== null) {
      return `
        <input type="text" name="x" id="x" placeholder="Your X(twitter) username" value="${data}">
      `;
    }
    else {
      return `
        <input type="text" name="x" id="x" placeholder="Your X(twitter) username">
      `;
    }
  }

  getLinkedin = data => {
    if (data !== 'null' && data !== undefined && data !== null) {
      return `
        <input type="text" name="linkedin" id="linkedin" placeholder="Your linkedin username" value="${data}">
      `;
    }
    else {
      return `
        <input type="text" name="linkedin" id="linkedin" placeholder="Your linkedin username">
      `;
    }
  }

  getThreads = data => {
    if (data !== 'null' && data !== undefined && data !== null) {
      return `
        <input type="text" name="threads" id="threads" placeholder="Your threads username" value="${data}">
      `;
    }
    else {
      return `
        <input type="text" name="threads" id="threads" placeholder="Your threads username">
      `;
    }
  }

  getLink = data => {
    if (data !== 'null' && data !== undefined && data !== null) {
      return `
        <input type="url" name="link" id="link" placeholder="Your website or a link" value="${data}">
      `;
    }
    else {
      return `
        <input type="url" name="link" id="link" placeholder="Your website or a link">
      `;
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
          display: flex;
          flex-flow: column;
          gap: 10px;
          padding: 0;
          width: 100%;
        }

        .top {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          width: 100%;
        }

        .top > h4.title {
          border-bottom: var(--border-mobile);
          display: flex;
          align-items: center;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0 6px 0;
        }

        .top > .desc {
          margin: 0;
          padding: 10px 0;
          color: var(--gray-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        form.fields {
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        form.fields > .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 20px;
        }

        form.fields.center > .field {
          align-items: center;
        }

        form.fields .field .input-group {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          color: var(--text-color);
          gap: 5px;
          position: relative;
          transition: border-color 0.3s ease-in-out;
        }

        form.fields .field.bio .input-group {
          width: 100%;
        }

        form.fields .field.bio .input-group.code,
        form.fields .field.bio .input-group.email {
          grid-column: 1/3;
          width: 100%;
        }

        form.fields .field .input-group > svg {
          position: absolute;
          right: 10px;
          top: 38px;
          width: 20px;
          height: 20px;
        }

        form.fields .field .input-group > svg {
          display: none;
        }

        form.fields .field .input-group.success > svg {
          display: inline-block;
        }

        form.fields .field .input-group.failed > svg {
          display: inline-block;
        }

        form.fields .field .input-group.success > svg {
          color: var(--accent-color);
        }

        form.fields .field .input-group.failed > svg {
          color: var(--error-color);
        }

        form.fields label {
          padding: 0 0 5px 0;
          color: var(--text-color);
        }

        form.fields .field.bio label {
          padding: 0 0 0 5px;
        }

        form.fields label {
          color: var(--text-color);
          font-size: 1.1rem;
          font-family: var(--font-main), sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        form.fields .field input {
          border: var(--input-border);
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          -ms-border-radius: 12px;
          -o-border-radius: 12px;
        }

        form.fields .field input:focus {
          border: var(--input-border-focus);
        }

        form.fields .field span.wrapper {
          display: flex;
          align-items: center;
          align-items: center;
          gap: 0;
          width: 100%;
        }
        form.fields .field span.wrapper {
          display: flex;
          align-items: center;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        form.fields .field span.wrapper > span.icon {
          border: var(--input-border);
          border-right: none;
          max-height: 40px;
          min-height: 40px;
          font-size: 1rem;
          width: 40px;
          padding: 10px 12px;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
          color: var(--gray-color);
          display: flex;
          align-items: center;
        }

        form.fields .field span.wrapper > input {
          font-size: 1rem;
          padding: 10px 12px;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          width: calc(100% - 40px);
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        form.fields .field .input-group.success > span.wrapper > input,
        form.fields .field .input-group.success > span.wrapper > input:focus,
        form.fields .field .input-group.success input,
        form.fields .field .input-group.success input:focus {
          border: var(--input-border-focus);
        }

        form.fields .field .input-group.failed > span.wrapper > input,
        form.fields .field .input-group.failed > span.wrapper > input:focus,
        form.fields .field .input-group.failed input,
        form.fields .field .input-group.failed input:focus {
          border: var(--input-border-error);
        }

        form.fields .field .input-group.success span.wrapper > input,
        form.fields .field .input-group.success input {
          color: var(--accent-color);
        }

        form.fields .field .input-group.failed span.wrapper > input,
        form.fields .field .input-group.failed input {
          color: var(--error-color);
        }

        form.fields label.focused {
          top: -10px;
          font-size: 0.9rem;
          background-color: var(--label-focus-background);
          padding: 0 5px;
        }

        form.fields .field span.status {
          color: var(--error-color);
          font-size: 0.95rem;
          display: none;
          padding: 0 0 0 5px;
        }

        form.fields .field .input-group.failed span.status {
          color: var(--error-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          color: var(--accent-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          display: none;
        }

        form.fields .actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin: 0 0 0 2px;
        }

        form.fields .actions > .action {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          border: none;
          border-radius: 10px;
          font-family: var(--font-main), sans-serif;
          line-height: 1.2;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          width: max-content;
          padding: 8px 20px;
          height: 40px;
          cursor: pointer;
          position: relative;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        form.fields .actions > .action.prev svg path {
          fill: var(--text-color);
        }

        form.fields .actions > .action.next {
          color: var(--white-color);
          background: var(--stage-no-linear);
        }

        form.fields .actions > .action.next svg path {
          fill: var(--white-color);
        }

        form.fields .actions > .action.disabled {
          pointer-events: none;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          .top > .desc {
            margin: 0;
            padding: 6px 0 10px;
            color: var(--gray-color);
            font-size: 1rem;
            line-height: 1.5;
            font-family: var(--font-main), sans-serif;
          }
        }
      </style>
    `;
  }
}