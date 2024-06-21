export default class TopicWrapper extends HTMLElement {
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
 
     this.handleActionClick(url, body);
  }

  // Open user profile
  handleActionClick = (url, body) => {
    const outerThis = this;
    // get a.meta.link
    const content = this.shadowObj.querySelector('a.action.view');

    // Get full post
    const topic =  this.getTopic();

    if(body && content) { 
      content.addEventListener('click', event => {
        event.preventDefault();
        
        // replace and push states
        outerThis.replaceAndPushStates(url, body, topic);

        body.innerHTML = topic;
      })
    }
  }


  // Replace and push states
  replaceAndPushStates = (url, body, topic) => {
    // Replace the content with the current url and body content
    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: body.innerHTML },
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
    let displayDescription = description.length > 87 ? `${description.substring(0, 87)}...` : description;

    return /* html */ `
      <p class="description">${displayDescription}</p>
    `
  }

  checkFollowing = following => {
    // GET url
    const url = this.getAttribute('url');

    if (following === 'true') {
      return /*html*/` 
        <a href="${url.toLowerCase()}/contribute"class="action contribute">contribute</a>
        <a href="${url.toLowerCase()}" class="action view">view</a>
        <span class="action following">following</span>
			`
    }
    else {
      return /*html*/`
        <a href="${url.toLowerCase()}/contribute"class="action contribute">contribute</a>
        <a href="${url.toLowerCase()}" class="action view">view</a>
        <button class="action follow">follow</button>
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
        <span class="stat">
          <span class="number">${followersFormatted}</span>
          <span class="label">followers</span>
        </span>
        <span class="sp">•</span>
        <span class="stat">
          <span class="number">${subscribersFormatted}</span>
          <span class="label">subscribers</span>
        </span>
      </div>
		`
  }

  getTopic = () => {
    // get url
    let url = this.getAttribute('url');
 
    // trim white spaces and convert to lowercase
    url = url.trim().toLowerCase();

   return /* html */`
     <app-topic tab="article" hash="${this.getAttribute('hash')}" subscribers="${this.getAttribute('subscribers')}" followers="${this.getAttribute('followers')}" 
      stories="${this.getAttribute('stories')}"
      name="${this.getAttribute('name')}" url="${url}" stories-url="${url}/stories" subscribed="${this.getAttribute('subscribed')}" 
      topic-follow="${this.getAttribute('topic-follow')}" contributers-url="${url}/contributers" followers-url="${url}/followers"
      description="${this.getAttribute('description')}"
      author-username="${this.getAttribute('author-username')}" author-picture="${this.getAttribute('author-img')}" author-verified="${this.getAttribute('author-verified')}"
      author-name="${this.getAttribute('author-name')}" author-followers="${this.getAttribute('author-followers')}"
      author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-user-follow')}" author-bio="${this.getAttribute('author-bio')}">
    </app-topic>
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
            border-bottom: var(--border-mobile);
          }

          button.action,
          a {
            cursor: default !important;
          }
      </style>
    `;
  }
}