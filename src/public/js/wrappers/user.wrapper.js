export default class UserWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // get you
    this._you = this.getAttribute('you') === 'true';


    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  // attributes to observe
  static get observedAttributes() {
    return ["username", "picture", "name", "followers", "following", "user-follow", "verified", "url", "bio"];
  }

  // observe the attributes on change
  attributeChangedCallback(name, oldValue, newValue) {
    // if (oldValue !== newValue) {
    //   // console.log('Attribute changed: ', name, newValue);
    // }
    // else {
    //   console.log('Attribute not changed: ', name, newValue);
    // }
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
    this.handleActionClick(url, body);
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

  // Open user profile
  handleActionClick = (url, body) => {
    const outerThis = this;
    // get a.meta.link
    const content = this.shadowObj.querySelector('a.action.view');

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
      ${this.getUser()}
      ${this.getStyles()}
    `;
  }

  getUser = () => {
    // Get name and check if it's greater than 20 characters
    const name = this.getAttribute('name');

    // GET url
    let url = this.getAttribute('url');

    // trim white spaces and convert to lowercase
    url = url.trim().toLowerCase();

    // Check if the name is greater than 20 characters: replace the rest with ...
    let displayName = name.length > 20 ? `${name.substring(0, 20)}..` : name;

    return /* html */ `
      <div class="author">
        <div class="author-info">
          <div class="avatar">
            <img src="${this.getAttribute('picture')}" alt="Author name">
            ${this.checkVerified(this.getAttribute('verified'))}
          </div>
          <div class="name">
            <h4 class="name">
              <span class="name">${displayName}</span>
            </h4>
            <a href="${url}" class="username" id="username">
              <span class="text">${this.getAttribute('username')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M4.53 4.75A.75.75 0 0 1 5.28 4h6.01a.75.75 0 0 1 .75.75v6.01a.75.75 0 0 1-1.5 0v-4.2l-5.26 5.261a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.48 5.5h-4.2a.75.75 0 0 1-.75-.75Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      ${this.getBio()}
      ${this.getStats()}
      <div class="actions">
        ${this.checkYou(this._you)}
      </div>
    `
  }

  getBio = () => {
    // get bio
    let bio = this.getAttribute('bio') || '';

    bio = bio.trim();

    // check if bio is empty
    if (bio === '') {
      return '';
    }
    else {
      // check if bio is greater than 70 characters
      let displayBio = bio.length > 70 ? `${bio.substring(0, 70)}..` : bio;

      return /*html*/`
        <p class="bio">${displayBio}</p>
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

  // check is the current user: you === true
  checkYou = you => {
    // get url
    let url = this.getAttribute('url');

    // trim white spaces and convert to lowercase
    url = url.trim().toLowerCase();

    if (you) {
      return /*html*/`
        <span  class="action you">You</span>
        <a href="${url}" class="action view">view</a>
        <a href="/profile" class="action manage">manage</a>
      `
    }
    else {
      return /*html*/`
        <a href="${url}" class="action view">view</a>
        ${this.checkFollowing(this.getAttribute('user-follow'))}
        <span class="action donate">donate</span>
      `
    }
  }

  checkFollowing = following => {
    if (following === 'true') {
      return /*html*/`
        <span class="action following">Following</span>
      `
    }
    else {
      return /*html*/`
        <span class="action follow">Follow</span>
      `
    }
  }

  getStats = () => {
    // Get total followers & following and parse to integer
    const followers = this.getAttribute('followers') || 0;
    const following = this.getAttribute('following') || 0;

    // Convert the followers & following to a number
    const totalFollowers = this.parseToNumber(followers);
    const totalFollowing = this.parseToNumber(following);

    //  format the number
    const followersFormatted = this.formatNumber(totalFollowers);
    const followingFormatted = this.formatNumber(totalFollowing);


    return /* html */`
      <div class="stats">
        <span class="stat">
          <span class="number">${followersFormatted}</span>
          <span class="label">Followers</span>
        </span>
        <span class="sp">•</span>
        <span class="stat">
          <span class="number">${followingFormatted}</span>
          <span class="label">Following</span>
        </span>
      </div>
		`
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
          border-bottom: var(--border);
          padding: 10px 0;
          width: 100%;
          display: flex;
          align-items: center;
          flex-flow: column;
          gap: 10px;
        }

        .author {
          display: flex;
          width: 100%;
          flex-flow: column;
          align-items: start;
        }
        
        .author-info {
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        }
        
        .author-info > .avatar {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }
        
        .author-info > .avatar > img {
          width: 100%;
          height: 100%;
          overflow: hidden;
          object-fit: cover;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }
        
        .author-info > .avatar > .icon {
          background: var(--background);
          position: absolute;
          bottom: 0px;
          right: -3px;
          width: 18px;
          height: 18px;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .author-info > .avatar > .icon svg {
          width: 14px;
          height: 14px;
          color: var(--accent-color);
        }
        
        .author-info > .name {
          display: flex;
          justify-content: center;
          flex-flow: column;
          gap: 0;
        }
        
        .author-info > .name > h4.name {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 3px;
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .author-info > .name > a.username {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.8rem;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          gap: 2px;
          align-items: center;
        }
        
        .author-info > .name > a.username svg {
          color: var(--gray-color);
          width: 15px;
          height: 15px;
          margin: 2px 0 0 0;
        }
        
        .author-info > .name > a.username:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }
        
        .author-info > .name > a.username:hover svg {
          color: var(--accent-color);
        }

        p.bio {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          width: 100%;
          text-align: start;
        }

        .stats {
          color: var(--gray-color);
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 10px;
        }

        .stats > .stat {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 5px;
        }

        .stats > .stat > .label {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-transform: lowercase;
          font-size: 0.9rem;
          font-weight: 400;
        }

        .stats > .stat > .number {
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 12px;
          padding: 0;
        }
        
        .actions > .action {
          border: var(--action-border);
          padding: 2.5px 15px;
          background: none;
          font-family: var(--font-main), sans-serif;
          border: var(--border-mobile);
          color: var(--gray-color);
          font-weight: 400;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: lowercase;
          text-align: center;
          justify-content: center;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
        }

        .actions > .action.you {
          text-transform: capitalize;
        }
        
        .actions > .action.follow {
          border: none;
          padding: 3px 15px;
          font-weight: 500;
          background: var(--accent-linear);
          color: var(--white-color);
        }

        @media screen and (max-width:660px) {
          :host {
            font-size: 16px;
            border-bottom: var(--border-mobile);
          }

          .actions > .action,
          a {
            cursor: default !important;
          }
      </style>
    `;
  }
}