export default class PersonWrapper extends HTMLElement {
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
    // get url
    let url = this.getAttribute('url');

    url = url.trim().toLowerCase();

    // Get the body
    const body = document.querySelector('body');

    this.handleUserClick(url, body);
  }

  // Open user profile
  handleUserClick = (url, body) => {
    const outerThis = this;
    // get a.meta.link
    const content = this.shadowObj.querySelector('a#username');

    // Get full post
    const profile =  this.getProfile();

    if(body && content) { 
      content.addEventListener('click', event => {
        event.preventDefault();
        
        // replace and push states
        outerThis.replaceAndPushStates(url, body, profile);

        body.innerHTML = profile;
      })
    }
  }

  // Replace and push states
  replaceAndPushStates = (url, body, profile) => {
    // Replace the content with the current url and body content
    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: body.innerHTML },
      url, pageUrl
    );

    // Updating History State
    window.history.pushState(
      { page: 'page', content: profile},
      url, url
    );
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    // Get name and check if it's greater than 20 characters
    const name = this.getAttribute('name');

    // GET url
    const url = this.getAttribute('url');

    // Check if the name is greater than 20 characters: replace the rest with ...
    let displayName = name.length > 20 ? `${name.substring(0, 20)}..` : name;

    return /*html*/`
      <div class="head">
        <div class="image">
          <img src="${this.getAttribute('picture')}" alt="User profile">
          ${this.checkVerified(this.getAttribute('verified'))}
        </div>
        <div class="name">
          <h4 class="uid">${displayName}</h4>
          <a href="${url.toLowerCase()}" class="username" id="username">
            <span class="text">${this.getAttribute('username')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z" />
            </svg>
          </a>
        </div>
      </div>
      ${this.checkFollow(this.getAttribute('user-follow'))}
    `
  }

  checkFollow = following => {
    if (following === 'true') {
      return /*html*/`
        <button class="action following">following</button>
			`
    }
    else {
      return /*html*/`
        <button class="action follow">follow</button>
			`
    }
  }

  checkVerified = verified => {
    if (verified === 'true') {
      return /*html*/`
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
            <path  d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708" />
          </svg>
        </div>
			`
    }
    else {
      return ''
    }
  }

  getProfile = () => {
    // get url
    let url = this.getAttribute('url');
 
    // trim white spaces and convert to lowercase
    url = url.trim().toLowerCase();

   return /* html */`
     <app-profile tab="stories" you="${this.getAttribute('you')}" url="${url}" tab="stories"
       stories-url="${url}/stories" replies-url="${url}/replies" followers-url="${url}/followers" following-url="${url}/following"
       username="${this.getAttribute('username')}" picture="${this.getAttribute('picture')}" verified="${this.getAttribute('verified')}"
       name="${this.getAttribute('name')}" followers="${this.getAttribute('followers')}"
       following="${this.getAttribute('following')}" user-follow="${this.getAttribute('user-follow')}" bio="${this.getAttribute('bio')}">
     </app-profile>
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
          border: none;
          background-color: var(--user-background);
          padding: 14px;
          width: 156px;
          min-width: 156px;
          height: 204px;
          max-height: 204px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: space-between;
          gap: 0;
          border-radius: 16px;
        }

        .head {
          display: flex;
          flex-flow: column;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .head > .image {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .head > .image img {
          width: 100%;
          height: 100%;
          overflow: hidden;
          object-fit: cover;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .head > .image > .icon {
          background: var(--user-background);
          position: absolute;
          bottom: 0px;
          right: -3px;
          width: 28px;
          height: 28px;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .head > .image > .icon svg {
          width: 20px;
          height: 20px;
          color: var(--accent-color);
        }

        .head > .name {
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          gap:  0;
          position: relative;
        }

        .head > .name h4.uid {
          color: var(--text-color);
          font-family: var(--font-text), sans serif;
          font-weight: 500;
          font-size: 0.9rem;
          /* prevet the text from overflowing */
          white-space: nowrap;
          overflow: hidden;
        }

        .name > a.username {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.8rem;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          gap: 2px;
          align-items: center;
        }
        
        .name > a.username svg {
          color: var(--gray-color);
          width: 15px;
          height: 15px;
          margin: 2px 0 0 0;
        }
        
        .name > a.username:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }
        
        .name > a.username:hover svg {
          color: var(--accent-color);
        }

        button.action {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 10px;
          height: max-content;
          width: 120px;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          background-color: var(--action-background);
          color: var(--white-color);
          font-weight: 500;
          font-size: 0.9rem;
          line-height: 1.3;
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          cursor: pointer;
          outline: none;
          border: none;
          text-transform: capitalize;
        }
        
        button.action.following {
          background: none;
          border: var(--border-mobile);
          color: var(--text-color);
          font-weight: 400;
          font-size: 0.9rem;
        } 

        @media screen and (max-width:660px) {
          :host {
            font-size: 16px;
            background-color: var(--author-background);
          }

          .action,
          a {
            cursor: default !important;
          }
      </style>
    `;
  }
}