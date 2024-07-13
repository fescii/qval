export default class HeaderWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // check if the user is authenticated
    this._authenticated = this.isLoggedIn('x-random-token');

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  // add attribute to watch for changes
  static get observedAttributes() {
    return ['section', 'type'];
  }

  isLoggedIn = name => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    const cookie = parts.length === 2 ? parts.pop().split(';').shift() : null;
    
    if (!cookie) {
      return false; // Cookie does not exist
    }
    
    // if cookie exists, check if it is valid
    if (cookie) {
      // check if the cookie is valid
      return true;
    }
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  // check for attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // check if the attribute is section
      if (name === 'section') {
        // select the title element
        const title = this.shadowObj.querySelector('h3.name');
        // update the title
        title.textContent = newValue;
      }
    }
  }

  connectedCallback() {
    // select the back svg
    const back = this.shadowObj.querySelector('nav.nav > .left svg');

    if (back) {
      // activate the back button
      this.activateBackButton(back);
    }
  }

  activateBackButton = btn => {
    btn.addEventListener('click', () => {
      // check window history is greater or equal to 1
      if (window.history.length >= 1) {
        // check if the history has state
        if (window.history.state) {
          // go back
          window.history.back();
          // console.log(window.history.state);
        }
        else {
          // redirect to home
          window.location.href = '/home';
        }
      }
    });
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
    const title = this.getAttribute('section');
    return /* html */`
      <nav data-expanded="false" class="nav">
        ${this.getContent(title)}
      </nav>
    `
  }

  getContent  = title => {
    // mql to check for mobile
    const mql = window.matchMedia('(max-width: 660px)');
    return /* html */ `
      ${this.getTitle(this.getAttribute('type'), mql.matches)}
      ${this.getTopIcons(this._authenticated)}
    `
  }

  getTopIcons = authenticated => {
    if (authenticated) {
      return /* html */ `
        <div class="links">
          <a href="/discover" class="link discover">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M6.906.664a1.749 1.749 0 0 1 2.187 0l5.25 4.2c.415.332.657.835.657 1.367v7.019A1.75 1.75 0 0 1 13.25 15h-3.5a.75.75 0 0 1-.75-.75V9H7v5.25a.75.75 0 0 1-.75.75h-3.5A1.75 1.75 0 0 1 1 13.25V6.23c0-.531.242-1.034.657-1.366l5.25-4.2Zm1.25 1.171a.25.25 0 0 0-.312 0l-5.25 4.2a.25.25 0 0 0-.094.196v7.019c0 .138.112.25.25.25H5.5V8.25a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v5.25h2.75a.25.25 0 0 0 .25-.25V6.23a.25.25 0 0 0-.094-.195Z"></path>
            </svg>
          </a>
          <a href="/profile" class="link profile">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
            </svg>
          </a>
          <a href="/search" class="link search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      `
    }
    else {
      return /* html */ `
        <div class="links">
          <a href="/join/login?next=${this.getAttribute('url')}" class="link signin">
            <span class="text">Sign in</span>
          </a>
          <a href="" class="link search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      `
    }
  }

  // Check if the type is home
  getTitle = (type, mql) => {
    const section = this.getAttribute('section');

    switch (type) {
      case 'home':
        return /*html*/`
          <div class="left home">
            <h3 class="name">${section}</h3>
          </div>
        `
      case 'user':
        if (mql) {
          return /*html*/`
            <div class="left user">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
              </svg>
              <h3 class="name">${section}</h3>
            </div>
          `
        }
        else {
          return /*html*/`
            <div class="left user">
              <h3 class="name">${section}</h3>
            </div>
          `
        }
      default:
        return /*html*/`
          <div class="left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M7.78 12.53a.75.75 0 0 1-1.06 0L2.47 8.28a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L4.81 7h7.44a.75.75 0 0 1 0 1.5H4.81l2.97 2.97a.75.75 0 0 1 0 1.06Z"></path>
            </svg>
            <h3 class="name">${section}</h3>
          </div>
        `
    }
  }

  getHome = () => {
    return /* html */ `
      <app-home url="/home" recent-url="/api/v1/h/recent" feeds-url="/api/v1/h/feeds"
        trending-people="/api/v1/q/trending/people" trending-url="/api/v1/h/trending">
      </app-home>
    `
  }

  getLogon = () => {
    return /* html */ `
      <app-logon
        name="join" next="/home"
        api-login="/api/v1/a/login"
        api-register="/api/v1/a/register"
        api-check-email="/api/v1/a/check-email"
        api-forgot-password="/api/v1/a/forgot-password"
        api-verify-token="/api/v1/a/verify-token"
        api-reset-password="/api/v1/a/reset-password"
        join-url="/join" login="/join/login"
        register="/join/register" forgot="/join/recover"
      >
    `
  }

  getSearch = () => {
    return /* html */ `
      <app-search url="/search" query="" page="1" tab="stories" stories-url="/api/v1/q/stories"
        replies-url="/api/v1/q/replies" people-url="/api/v1/q/people" topics-url="/api/v1/q/topics"
        trending-stories="/api/v1/q/trending/stories" trending-people="/api/v1/q/trending/people"
        trending-topics="/api/v1/q/trending/topics" trending-replies="/api/v1/q/trending/replies">
      </app-search>
    `
  }

  getStyles() {
    const kind = this.getAttribute('type');
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
          width: 100%;
          height: max-content;
          background-color: var(--background);
          gap: 0;
          display: block;
          position: sticky;
          top: 0;
          z-index: 10;
          margin: ${kind === 'story' ? '0' : '0 0 10px'};
        }

        nav.nav {
          border-bottom: var(--border);
          color: var(--title-color);
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 10px;
          height: 60px;
          max-height: 60px;
          padding: 22px 0 8px;
        }

        nav.nav.short {
          border-bottom: none;
          max-height: 10px;
          padding: 0;
          margin: 0 0 10px;
        }

        nav.nav > .left {
          color: var(--title-color);
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        }

        nav.nav > .left h3 {
          margin: 0;
          font-family: var(--font-main), sans-serif;
          font-size: 1.3rem;
          font-weight: 600;
        }

        nav.nav > .left.home h3 {
          margin: 0 0 -2px 0;
          padding: 0 0 0 2px;
          font-weight: 600;
          color: transparent;
          font-size: 1.5rem;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--read-text);
        }

        nav.nav > .left svg {
          cursor: pointer;
          width: 28px;
          height: 28px;
          margin: 0 0 0 -3px;
        }

        nav.nav > .left > svg:hover {
          color: var(--accent-color);
        }

        nav.nav > .links {
          padding: 0 10px 0 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: max-content;
          gap: 15px;
        }

        nav.nav > .links > a.link {
          text-decoration: none;
          color: var(--gray-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        nav.nav > .links > a.link.discover:hover,
        nav.nav > .links > a.link.profile:hover,
        nav.nav > .links > a.link.search:hover {
          transition: color 0.3s ease-in-out;
          -webkit-transition: color 0.3s ease-in-out;
          -moz-transition: color 0.3s ease-in-out;
          -ms-transition: color 0.3s ease-in-out;
          -o-transition: color 0.3s ease-in-out;
          color: var(--accent-color);
        }

        nav.nav > .links a.link.search a svg {
          margin: 0;
          width: 22px;
          height: 22px;
        }

        nav.nav > .links > a.link.discover > svg {
          width: 20px;
          height: 20px;
        }

        nav.nav > .links > a.link.profile > svg {
          width: 23px;
          height: 23px;
          margin: 1px 0 0 0;
        }

        nav.nav > .links > a.link.signin {
          border: var(--border-mobile);
          font-weight: 500;
          padding: 4px 15px 4px;
          font-family: var(--font-read);
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        nav.nav > .links > a.link.signin:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        @media screen and (max-width: 660px) {
          :host {
            font-size: 16px;
            margin: 0;
          }

          nav.nav {
            border-bottom: var(--border);
            height: 50px;
            max-height: 50px;
            padding: 10px 0;
          }


          nav.nav > .left {
            gap: 5px;
            width: calc(100% - 130px);
          }

          nav.nav > .left h3 {
            margin: 0;
            font-family: var(--font-main), sans-serif;
            font-size: 1.3rem;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
          }

          nav.nav > .links {
            width: 130px;
            padding: 0;
          }

          nav.nav > .links > a.link.signin {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          nav.nav > .left svg,
          .stats > .stat {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}