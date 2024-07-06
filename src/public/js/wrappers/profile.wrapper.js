export default class ProfileWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // check if the user is authenticated
    this._authenticated = this.isLoggedIn('x-random-token');

    // Get if the user is the current user
    this._you = this.getAttribute('you') === 'true';

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.parent = this.getRootNode().host;

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');

    // perform actions
    this.performActions();

    // open highlights
    this.openHighlights();
    this.openContact()
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

  setAttributes = (name, value) => {
    this.parent.setAttribute(name, value);
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

  openHighlights = () => {
    // Get body
    const body = document.querySelector('body');
    // Get the stats action and subscribe action
    const statsBtn = this.shadowObj.querySelector('.actions>.action#highlights-action');

    // add event listener to the stats action
    if (statsBtn) {
      statsBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        // Open the highlights popup
        body.insertAdjacentHTML('beforeend', this.getHighlights());
      });
    }
  }

  openContact = () => {
    // Get body
    const body = document.querySelector('body');
    // Get the social action and subscribe action
    const socialBtn = this.shadowObj.querySelector('.actions>.action#socials-action');

    // add event listener to the social action
    if (socialBtn) {
      socialBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        // Open the highlights popup
        body.insertAdjacentHTML('beforeend', this.getContact());
      });
    }
  }

  // perfom actions
  performActions = () => {
    const outerThis = this;
    // get body 
    const body = document.querySelector('body');

    // get url to 
    let hash = this.getAttribute('hash');
    // trim and convert to lowercase
    hash = hash.trim().toLowerCase();

    // base api
    const url = '/api/v1/u/' + hash;

    // Get the follow action and subscribe action
    const followBtn = this.shadowObj.querySelector('.actions>.action#follow-action');

    // add event listener to the follow action
    if (followBtn) {
      // construct options
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }

      followBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        let action = false;

        // Check if the user is authenticated
        if (!this._authenticated) {
          // Open the join popup
          this.openJoin(body);
        } 
        else {
          // Update the follow button
          if (followBtn.classList.contains('following')) {
            action = true;
            outerThis.updateFollowBtn(false, followBtn);
          }
          else {
            outerThis.updateFollowBtn(true, followBtn);
          }

          // Follow the topic
          this.followUser(`${url}/follow`, options, followBtn, action);
        }
      });
    }
  }

  followUser = (url, options, followBtn, followed) => {
    const outerThis = this;
    this.fetchWithTimeout(url, options)
      .then(response => {
        response.json()
        .then(data => {
          // If data has unverified, open the join popup
          if (data.unverified) {
            // Get body
            const body = document.querySelector('body');

            // Open the join popup
            outerThis.openJoin(body);

            // revert the follow button
            outerThis.updateFollowBtn(followed, followBtn);
          }

          // if success is false, show toast message
          if (!data.success) {
            outerThis.showToast(data.message, false);

            // revert the follow button
            outerThis.updateFollowBtn(followed, followBtn);
          }
          else {
            // Show toast message
            outerThis.showToast(data.message, true);

            // Check for followed boolean
            outerThis.updateFollowBtn(data.followed, followBtn);

            // Update the followers
            outerThis.updateFollowers(data.followed);
          }
        });
      })
      .catch(_error => {
        // console.log(_error);
        // show toast message
        outerThis.showToast('An error occurred while following the user', false);

        // revert the follow button
        outerThis.updateFollowBtn(followed, followBtn);
      });
  }

  fetchWithTimeout = (url, options, timeout = 9000) => {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const signal = controller.signal;

      setTimeout(() => {
        controller.abort();
        // add property to the error object
        reject({ name: 'AbortError', message: 'Request timed out' });
        // reject(new Error('Request timed out'));
      }, timeout);

      fetch(url, { ...options, signal })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  updateFollowBtn = (following, btn) => {
    if (following) {
      // Change the text to following
      btn.textContent = 'following';

      // remove the follow class
      btn.classList.remove('follow');

      // add the following class
      btn.classList.add('following');
    }
    else {
      // Change the text to follow
      btn.textContent = 'follow';

      // remove the following class
      btn.classList.remove('following');

      // add the follow class
      btn.classList.add('follow');
    }
  }

  showToast = (text, success) => {
    // Get the toast element
    const toast = this.getToast(text, success);

    // Get body element
    const body = document.querySelector('body');

    // Insert the toast into the DOM
    body.insertAdjacentHTML('beforeend', toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      // Select the toast element
      const toast = body.querySelector('.toast');

      // Remove the toast
      if(toast) {
        toast.remove();
      }
    }, 3000);
  }

  getToast = (text, success) => {
    if (success) {
      return /* html */`
        <div class="toast true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
        </svg>
          <p class="toast-message">${text}</p>
        </div>
      `;
    }
    else {
      return /* html */`
      <div class="toast false">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
        </svg>
          <p class="toast-message">${text}</p>
        </div>
      `;
    }
    
  }

  openJoin = body => {
    // Insert getJoin beforeend
    body.insertAdjacentHTML('beforeend', this.getJoin());
  }

  getJoin = () => {
    // get url from the : only the path
    const url = window.location.pathname;

    return /* html */`
      <join-popup register="/join/register" login="/join/login" next="${url}"></join-popup>
    `
  }

  updateFollowers = (followed) => {
    const outerThis = this;
    let value = followed ? 1 : -1;
    // Get followers attribute : concvert to number then add value

    let followers = this.parseToNumber(this.getAttribute('followers')) + value;

    // if followers is less than 0, set it to 0
    followers = followers < 0 ? 0 : followers;

    // set user follow attribute
    this.setAttribute('user-follow', followed.toString());

    // Set the followers attribute
    this.setAttribute('followers', followers.toString());

    this.setAttributes('followers', followers)

    this.setAttributes('user-follow', followed.toString());

    // select the followers element
    const followersStat = outerThis.shadowObj.querySelector('.stats > span.followers');
    if (followersStat) {
      // select no element
      const no = followersStat.querySelector('.number');
      const text = followersStat.querySelector('.label');

      // Update the followers
      no.textContent = this.formatNumber(followers);

      // Update the text
      text.textContent = followers === 1 ? 'follower' : 'followers';
    }
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

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getContent()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    return /* html */`
      ${this.getHeader()}
      ${this.getBio()}
      ${this.getActions()}
		`
  }

  getHeader = () => {
    // Get name and check if it's greater than 20 characters
    const name = this.getAttribute('name');

    // Check if the name is greater than 20 characters: replace the rest with ...
    let displayName = name.length > 25 ? `${name.substring(0, 25)}..` : name;

    return /* html */ `
    </contact-popup>
      <div class="top">
        ${this.getPicture(this.getAttribute('picture'))}
        <div class="info">
          <div class="name">
            <h4 class="name">
              <span class="name">${displayName}</span>
            </h4>
            <span class="username">
              <span class="text">${this.getAttribute('hash')}</span>
            </span>
          </div>
          ${this.getStats()}
        </div>
      </div>
    `
  }

  getPicture = picture => {
    // check if picture is empty || null || === "null"
    if (picture === '' || picture === null || picture === 'null') {
      return /*html*/`
        <div class="avatar svg">
          <div class="svg-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"></path>
            </svg>
          </div>
          ${this.checkVerified(this.getAttribute('verified'))}
        </div>
      `
    }
    else {
      return /*html*/`
        <div class="avatar">
          <img src="${picture}" alt="Author picture">
          ${this.checkVerified(this.getAttribute('verified'))}
        </div>
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
        <span class="stat followers">
          <span class="number">${followersFormatted}</span>
          <span class="label">${totalFollowers === 1 ? 'follower' : 'followers'}</span>
        </span>
        <span class="sp">•</span>
        <span class="stat following">
          <span class="number">${followingFormatted}</span>
          <span class="label">following</span>
        </span>
      </div>
		`
  }

  getBio = () => {
    // Get bio content
    let bio = this.getAttribute('bio') || 'The user has not added a bio yet';

    /// trim white spaces
    bio = bio.trim();

    // separate by new lines
    const bioArray = bio.split('\n');

    // trim each line and ignore empty lines
    const bioLines = bioArray.map(line => line.trim()).filter(line => line !== '').map(line => `<p>${line}</p>`).join('');

    return /*html*/`
      <div class="bio">
        ${bioLines}
      </div>
    `
  }

  getActions = () => {
    // You is true
    if (this._you) {
      return /*html*/`
        <div class="actions">
          <span class="action highlights" id="highlights-action">stats</span>
          <a href="/profile" class="action edit" id="edit-action">Edit</a>
          <span class="action socials" id="socials-action">socials</span>
        </div>
      `
    }
    else {
      return /*html*/`
        <div class="actions">
          ${this.checkFollowing(this.getAttribute('user-follow'))}
          <span class="action highlights" id="highlights-action">stats</span>
          <span class="action socials" id="socials-action">socials</span>
        </div>
      `
    }
  }

  checkFollowing = following => {
    if (following === 'true') {
      return /*html*/`
			  <span class="action following" id="follow-action">Following</span>
			`
    }
    else {
      return /*html*/`
			  <span class="action follow" id="follow-action">Follow</span>
			`
    }
  }

  getHighlights = () => {
    // get url
    const url = this.getAttribute('url');
  
    // trim white spaces and convert to lowercase
    let formattedUrl = url.toLowerCase();

    return /* html */`
      <stats-popup url="/api/v1${formattedUrl}/stats" name="${this.getAttribute('name')}"
        followers="${this.getAttribute('followers')}" following="${this.getAttribute('following')}" 
        stories="${this.getAttribute('stories')}" replies="${this.getAttribute('replies')}">
      </stats-popup>
    `
  }

  getContact = () => {
    // get url
    const url = this.getAttribute('url');
  
    // trim white spaces and convert to lowercase
    let formattedUrl = url.toLowerCase();

    return /* html */`
      <contact-popup url="/api/v1${formattedUrl}/contact" name="${this.getAttribute('name')}">
      </contact-popup>
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
          padding: 0;
          width: 100%;
          min-width: 100%;
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0px;
        }

        .top {
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 8px;
        }

        .top > .avatar {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          min-width: 100px;
          min-height: 100px;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar.svg {
          background: var(--gray-background);
        }

        .top > .avatar > .svg-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar > .svg-avatar svg {
          width: 50px;
          height: 50px;
          color: var(--gray-color);
          display: inline-block;
          margin: 0 0 5px 0;
        }

        .top > .avatar > img {
          width: 99px;
          height: 99px;
          object-fit: cover;
          overflow: hidden;
          border-radius: 50%;
          -webkit-border-radius: 50%;
          -moz-border-radius: 50%;
        }

        .top > .avatar > .icon {
          background: var(--background);
          position: absolute;
          bottom: 0;
          right: 0;
          width: 30px;
          height: 30px;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .top > .avatar > .icon svg {
          width: 22px;
          height: 22px;
          color: var(--accent-color);
        }

        .top > .info {
          display: flex;
          flex-flow: column;
          padding: 5px 0 0 10px;
          gap: 10px;
          align-items: start;
          justify-content: center;
          align-content: center;
          width: calc(100% - 100px);
          max-width: calc(100% - 100px);
          height: 100px;
          max-height: 100px;
        }

        .top > .info > .name {
          display: flex;
          justify-content: center;
          flex-flow: column;
          gap: 0;
        }

        .top > .info > .name > h4.name {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          color: var(--text-color);
          font-family: var(--font-read), sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .top > .info > .name > span.username {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          gap: 2px;
          align-items: center;
        }

        .top > .info > .name > span.username svg {
          color: var(--gray-color);
          width: 15px;
          height: 15px;
          margin: 2px 0 0 0;
        }

        .top > .info > .name > span.username:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .top > .info > .name > span.username:hover svg {
          color: var(--accent-color);
        }

        .stats {
          color: var(--gray-color);
          display: flex;
          margin: 10px 0 5px 0;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 5px;
        }

        .stats > .stat {
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 3px;
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
          font-size: 0.84rem;
          font-weight: 500;
        }

        .bio {
          display: flex;
          flex-flow: column;
          margin: 5px 0;
          gap: 5px;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-size: 1rem;
          line-height: 1.4;
          font-weight: 400;
        }

        .bio > p {
          all: inherit;
          margin: 0 0 5px;
        }

        .actions {
          border-bottom: var(--border);
          width: 100%;
          display: flex;
          flex-flow: row;
          gap: 20px;
          padding: 3px 0 15px 0;
          margin: 0;
        }

        .actions > .action {
          text-decoration: none;
          padding: 4px 18px;
          font-weight: 500;
          background: var(--accent-linear);
          color: var(--white-color);
          font-family: var(--font-text), sans-serif;
          cursor: pointer;
          width: max-content;
          text-transform: lowercase;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 10px;
        }

        .actions > .action.donate {
          background: var(--second-linear);
        }

        .actions > .action.you {
          text-transform: capitalize;
          padding: 3px 15px 4px;
          cursor: default;
          pointer-events: none;
          border: none;
          background: var(--gray-background);
        }

        .actions > .action.edit,
        .actions > .action.highlights,
        .actions > .action.socials,
        .actions > .action.following,
        .actions > .action.settings {
          padding: 3.5px 18px;
          background: unset;
          border: var(--action-border);
          color: var(--gray-color);
        }

        @media screen and (max-width: 660px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          .stats > .stat {
            cursor: default !important;
          }

          a,
          span.stat,
          span.action {
            cursor: default !important;
          }

          .top > .avatar {
            width: 80px;
            height: 80px;
            min-width: 80px;
            min-height: 80px;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
          }
  
          .top > .avatar > img {
            width: 100%;
            height: 100%;
          }
  
          .top > .avatar > .icon {
            background: var(--background);
            position: absolute;
            bottom: 0;
            right: 0;
            width: 25px;
            height: 25px;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
          
          .top > .avatar > .icon svg {
            width: 18px;
            height: 18px;
            color: var(--accent-color);
          }
  
          .top > .info {
            display: flex;
            flex-flow: column;
            padding: 0 0 0 10px;
            gap: 10px;
          }

          .top > .info > .name > h4.name {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 5px;
            color: var(--text-color);
            font-family: var(--font-text), sans-serif;
            font-size: 1.3rem;
            font-weight: 600;
          }

          .stats {
            margin: 0 5px 0 0;
            width: 100%;
            gap: 5px;
          }
        }
      </style>
    `;
  }
}