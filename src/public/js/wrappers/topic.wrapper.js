export default class TopicWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // check if the user is authenticated
    this._authenticated = this.isLoggedIn('x-random-token');

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
 
    this.openTopicPage(url, body);

    // perform actions
    this.performActions();

    // open highlights
    this.openHighlights(body);
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

  openHighlights = body => {
    // Get the stats action and subscribe action
    const statsBtn = this.shadowObj.querySelector('.actions>.action#stats-action');

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

  // perform actions
  performActions = () => {
    const outerThis = this;
    // get body 
    const body = document.querySelector('body');

    // get url to 
    let hash = this.getAttribute('hash');
    // trim and convert to lowercase
    hash = hash.trim().toLowerCase();

    // base api
    const url = '/api/v1/t/' + hash;

    // Get the follow action and subscribe action
    const followBtn = this.shadowObj.querySelector('.actions>.action#follow-action');

    // add event listener to the follow action
    if (followBtn) {
      // construct options
      const options = {
        method: 'POST',
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
          this.followTopic(`${url}/follow`, options, followBtn, action);
        }
      });
    }
  }

  followTopic = (url, options, followBtn, followed) => {
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
        outerThis.showToast('An error occurred while following the topic', false);

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
        reject(new Error('Request timed out'));
        
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

    // Set the followers attribute
    this.setAttribute('followers', followers.toString());

    // Set topic-follow attribute to true or false based on followed bool
    this.setAttribute('topic-follow', `${followed}`);

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

  // Open topic page
  openTopicPage = (url, body) => {
    const outerThis = this;
    // get a.meta.link
    const content = this.shadowObj.querySelector('a.action.view');

    if(body && content) { 
      content.addEventListener('click', event => {
        event.preventDefault();

        // Get full post
        const topic =  this.getTopic();
        
        // replace and push states
        outerThis.replaceAndPushStates(url, body, topic);

        body.innerHTML = topic;
      })
    }
  }

  // Replace and push states
  replaceAndPushStates = (url, body, topic) => {
    // Replace the content with the current url and body content
    // get the first custom element in the body
    const firstElement = body.firstElementChild;

    // convert the custom element to a string
     const elementString = firstElement.outerHTML;
    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: elementString },
      url, pageUrl
    );

    // Updating History State
    window.history.pushState(
      { page: 'page', content: topic},
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
      ${this.getInfo()}
      ${this.getStyles()}
    `;
  }

  getInfo = () => {
    // Get name and check if it's greater than 20 characters
    let name = this.getAttribute('name');

    // Replace - with space and capitalize first letter of the first word using regex: heath-care becomes Heath care
    name = name.toLowerCase().replace(/-/g, ' ');
    
    // Capitalize the first letter of the first word
    const formattedName = name.replace(/^\w/, c => c.toUpperCase());

    return /* html */ `
      <div class="topic">
        <h4 class="name">
          <span class="name">${formattedName}</span>
        </h4>
        ${this.getDescription()}
        ${this.getStats()}
        <div class="actions">
          ${this.checkFollowing(this.getAttribute('topic-follow'))}
        </div>
      </div>
    `
  }

  getDescription = () => {
    // Get description and check if it's greater than 100 characters
    let description = this.getAttribute('description');

    // Check if the description is greater than 100 characters: replace the rest with ...
    let displayDescription = description.length > 120 ? `${description.substring(0, 120)}...` : description;

    return /* html */ `
      <p class="description">${displayDescription}</p>
    `
  }

  checkFollowing = following => {
    // GET url
    const url = this.getAttribute('url');

    if (following === 'true') {
      return /*html*/` 
        <a href="${url.toLowerCase()}" class="action view" id="view-action">view</a>
        <span class="action following" id="follow-action">following</span>
        <span class="action contribute" id="stats-action">stats</span>
			`
    }
    else {
      return /*html*/`
        <a href="${url.toLowerCase()}" class="action view" id="view-action">view</a>
        <span class="action follow" id="follow-action">follow</span>
        <span class="action contribute" id="stats-action">stats</span>
			`
    }
  }

  getStats = () => {
    // Get total followers & following and parse to integer
    const followers = this.getAttribute('followers') || 0;
    const subscribers = this.getAttribute('subscribers') || 0;

    // Convert the followers & following to a number
    const totalFollowers = this.parseToNumber(followers);
    const totalSubscribers = this.parseToNumber(subscribers);

    //  format the number
    const followersFormatted = this.formatNumber(totalFollowers);
    const subscribersFormatted = this.formatNumber(totalSubscribers);


    return /* html */`
      <div class="stats">
        <span class="stat followers">
          <span class="number">${followersFormatted}</span>
          <span class="label">follower${ totalFollowers === 1 ? '' : 's'}</span>
        </span>
        <span class="sp">•</span>
        <span class="stat subscribers">
          <span class="number">${subscribersFormatted}</span>
          <span class="label">subscriber${ totalSubscribers === 1 ? '' : 's'}</span>
        </span>
      </div>
		`
  }

  getTopic = () => {
    // get url
    let url = this.getAttribute('url');
 
    // trim white spaces and convert to lowercase
    url = url.trim().toLowerCase();

    let apiUrl = `/api/v1/t/${this.getAttribute('hash')}`;

   return /* html */`
    <app-topic tab="article" hash="${this.getAttribute('hash')}" subscribers="${this.getAttribute('subscribers')}"
      followers="${this.getAttribute('followers')}" views="${this.getAttribute('views')}"
      stories="${this.getAttribute('stories')}" subscribed="${this.getAttribute('subscribed')}" topic-follow="${this.getAttribute('topic-follow')}"
      name="${this.getAttribute('name')}" url="${url}" summary="${this.getAttribute('description')}" slug="${this.getAttribute('slug')}"
      stories-url="${apiUrl}/stories" contributors-url="${apiUrl}/contributors" followers-url="${apiUrl}/followers" 
      author-hash="${this.getAttribute('author-hash')}" author-you="${this.getAttribute('author-you')}" author-contact='${this.getAttribute("author-contact")}'
      author-stories="${this.getAttribute('author-stories')}" author-img="${this.getAttribute('author-img')}" 
      author-follow="${this.getAttribute('author-follow')}" author-replies="${this.getAttribute('author-replies')}" 
      author-name="${this.getAttribute('author-name')}" author-followers="${this.getAttribute('author-followers')}" 
      author-following="${this.getAttribute('author-following')}" author-verified="${this.getAttribute('author-verified')}" 
      author-bio="${this.getAttribute('author-bio')}">
      ${this.innerHTML}
    </app-topic>
   `
  }

  getHighlights = () => {
    return /* html */`
      <topic-popup url="/api/v1/t/${this.getAttribute('hash').toLowerCase()}/stats" name="${this.getAttribute('name')}" views="${this.getAttribute('views')}"
        followers="${this.getAttribute('followers')}" subscribers="${this.getAttribute('subscribers')}" 
        stories="${this.getAttribute('stories')}">
      </topic-popup>
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
          padding: 10px 0 15px;
          width: 100%;
          display: flex;
          align-items: center;
          flex-flow: column;
          gap: 8px;
        }

        .topic {
          display: flex;
          width: 100%;
          padding: 0;
          display: flex;
          width: 100%;
          flex-flow: column;
          gap: 0;
        }
        
        .topic > h4.name {
          margin: 0;
          display: flex;
          align-items: center;
          color: var(--title-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1.1rem;
          line-height: 1.3;
          font-weight: 500;
          break-word: break-all;
          word-wrap: break-word;
        }
        
        .topic > .hori > a.hash {
          color: var(--gray-color);
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          display: flex;
          gap: 2px;
          padding: 8px 0 0 0;
          align-items: center;
        }

        p.description {
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.93rem;
          font-weight: 400;
          margin: 0;
          line-height: 1.3;
          padding: 0;
          margin: 5px 0;
        }

        div.actions {
          display: flex;
          flex-flow: row;
          width: 100%;
          gap: 10px;
          margin: 10px 0 0 0;
          padding: 0;
        }
        
        div.actions > .action {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5px 10px;
          height: max-content;
          width: max-content;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          background: var(--accent-linear);
          color: var(--white-color);
          font-weight: 500;
          font-size: 0.9rem;
          line-height: 1.3;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          cursor: pointer;
          outline: none;
          border: none;
          text-transform: lowercase;
        }
        
        div.actions > .action.contribute,
        div.actions > .action.view,
        div.actions > .action.following {
          padding: 2px 10px;
          background: none;
          border: var(--border-mobile);
          color: var(--gray-color);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .stats {
          color: var(--gray-color);
          display: flex;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 5px;
          padding: 0;
          margin: 5px 0;
        }

        .stats > span.sp {
          margin: 0 0 2px 0;
          font-size: 0.8rem;
        }

        .stats > .stat {
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .stats > .stat > .label {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          text-transform: lowercase;
          font-size: 0.93rem;
          font-weight: 400;
        }

        .stats > .stat > .number {
          color: var(--text-color);
          font-family: var(--font-main), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
        }     

        @media screen and (max-width:660px) {
          :host {
            font-size: 16px;
            border-bottom: none;
          }

          button.action,
          div.actions > .action,
          a {
            cursor: default !important;
          }
      </style>
    `;
  }
}