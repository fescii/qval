export default class RepliesFeed extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._block = false;
    this._empty = false;
    this._page = this.parseToNumber(this.getAttribute('page'));
    this._total = this.parseToNumber(this.getAttribute('replies'));
    this._pages = 1;
    this._url = this.getAttribute('url');
    this._kind = this.getAttribute('kind');

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');
    const repliesContainer = this.shadowObj.querySelector('.replies');

    // check if the total
    if (this._total === 0) {
      this.populateReplies(this.getEmptyMsg(this._kind), repliesContainer);
    } else {
      this.fetchReplies(repliesContainer);

      this.scrollEvent(repliesContainer);
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

  fetching = (url, repliesContainer) => {
    const outerThis = this;
    this.fetchWithTimeout(url, { method: "GET" }).then((response) => {
      response.json().then((result) => {
        if (result.success) {
          const data = result.data;
          if (data.last && outerThis._page === 1 && data.replies.length === 0) {
            outerThis.populateReplies(outerThis.getEmptyMsg(outerThis._kind), repliesContainer);
          } 
          else if (data.last && data.replies.length < 10) {
            const content = outerThis.mapFields(data.replies);
            outerThis.populateReplies(content, repliesContainer);
            outerThis.populateReplies(
              outerThis.getLastMessage(outerThis._kind), repliesContainer);
          } 
          else {
            outerThis._empty = false;
            outerThis._block = false;
            outerThis._pages = data.pages;
            
            const content = outerThis.mapFields(data.replies);
            outerThis.populateReplies(content, repliesContainer);
            }
          }
          else {
            outerThis.populateReplies(outerThis.getWrongMessage(), repliesContainer);
          }
        })
        .catch((error) => {
          outerThis.populateReplies(outerThis.getWrongMessage(), repliesContainer);
        });
    });
  }

  fetchReplies = repliesContainer => {
    const outerThis = this;
    const url = `${this._url}?replies=${this._total}&page=${this._page}`;

    if(!this._block && !this._empty) {
      outerThis._empty = true;
      outerThis._block = true;
      setTimeout(() => {
        // fetch the replies
        outerThis.fetching(url, repliesContainer)
      }, 3000);
    }
  }

  populateReplies = (content, repliesContainer) => {
    // get the loader and remove it
    const loader = repliesContainer.querySelector('.loader-container');
    if (loader){
      loader.remove();
    }

    // insert the content
    repliesContainer.insertAdjacentHTML('beforeend', content);
  }
  
  scrollEvent = repliesContainer => {
    const outerThis = this;
    window.addEventListener('scroll', function () {
      let margin = document.body.clientHeight - window.innerHeight - 150;
      if (window.scrollY > margin && !outerThis._empty && !outerThis._block) {
        outerThis._page += 1;
        outerThis.populateReplies(outerThis.getLoader(), repliesContainer);
        outerThis.fetchReplies(repliesContainer);
      }
    });

    // Launch scroll event
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
  }

  mapFields = data => {
    return data.map(reply => {
      const author = reply.reply_author;
      let name = author.name.split(" ");
      let picture = author.picture === null ? "https://ui-avatars.com/api/?background=ff932f&bold=true&size=100&color=fff&name=" + name[0] + "+" + name[1] : author.picture;
      return /*html*/`
        <quick-post story="reply" hash="${reply.hash}" url="/r/${reply.hash}" likes="${reply.likes}" replies="${reply.replies}" liked="${reply.liked}"
          views="${reply.views}" time="${reply.createdAt}" replies-url="/api/v1/r/${reply.hash}/replies" likes-url="/api/v1/r/${reply.hash}/likes"
          author-hash="${author.hash}" author-you="${reply.you}" author-url="/u/${author.hash}"
          author-img="${picture}" author-verified="${author.verified}" author-name="${author.name}" author-followers="${author.followers}"
          author-following="${author.following}" author-follow="${author.is_following}" author-bio="${author.bio === null ? 'The author has no bio yet!': author.bio }">
          ${reply.content}
        </quick-post>
      `
    }).join('');
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
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getLoader() {
    return /* html */`
      <div class="loader-container">
        <span id="btn-loader">
          <span class="loader-alt"></span>
        </span>
      </div>
    `
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="replies">
				${this.getLoader()}
      </div>
    `;
  }

  getEmptyMsg = text => {
    // get the next attribute
   if (text === "post") {
    return `
      <div class="empty">
        <h2 class="title">No replies found!</h2>
        <p class="next">
          The post has no replies yet. You can be the first one to reply or come back later, once available they'll appear here.
        </p>
      </div>
    `
   } 
   else if(text === "reply") {
    return `
      <div class="empty">
        <h2 class="title">No replies found!</h2>
        <p class="next">
          The reply has no replies yet. You can be the first one to reply or come back later, once available they'll appear here.
        </p>
      </div>
    `
   }
   else if(text === "search") {
    return `
      <div class="empty">
        <h2 class="title">No replies found!</h2>
        <p class="next">
          There are no replies found for this search. You can try a different searching using a different keyword.
        </p>
      </div>
    `
   }
   else if(text === "user") {
    return `
      <div class="empty">
        <h2 class="title">No replies found!</h2>
        <p class="next">
          The user has no replies yet. You can come back later, once available they'll appear here.
        </p>
      </div>
    `
   } else {
    return `
      <div class="empty">
        <h2 class="title">No replies found!</h2>
        <p class="next">
          There are no replies yet. You can come back later, once available they'll appear here.
        </p>
      </div>
    `
   }
  }

  getLastMessage = text => {
    // get the next attribute
    if (text === "post") {
      return `
        <div class="last">
          <h2 class="title">No more replies!</h2>
          <p class="next">
            You have exhausted all of the post's replies. You can add a new reply or come back later to check for new replies.
          </p>
        </div>
      `
    } 
    else if(text === "reply") {
      return `
        <div class="last">
          <h2 class="title">No more replies!</h2>
          <p class="next">
            You have exhausted all of the reply's replies. You can add a new reply or come back later to check for new replies.
          </p>
        </div>
      `
    }
    else if(text === "search") {
      return `
        <div class="last">
          <h2 class="title">No more replies!</h2>
          <p class="next">
            You have exhausted all of the search's results. You can try a different search using a different keyword.
          </p>
        </div>
      `
    }
    else if(text === "user") {
      return `
        <div class="last">
          <h2 class="title">No more replies!</h2>
          <p class="next">
            You have exhausted all of the user's replies. You can always come back later to check for new replies.
          </p>
        </div>
      `
    }
    else {
      return `
        <div class="last">
          <h2 class="title">No more replies!</h2>
          <p class="next">
            You have reached the end of the replies. You can always come back later to check for new replies.
          </p>
        </div>
      `
    }
   
  }

  getWrongMessage = () => {
    // get the next attribute
    return `
      <div class="last">
        <h2 class="title">Something went wrong!</h2>
        <p class="next">
          Something did not work as expected, I call it shinanigans!
        </p>
      </div>
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
          width: 100%;
          padding: 0;
        }

        div.loader-container {
          position: relative;
          width: 100%;
          height: 150px;
          padding: 20px 0 0 0;
        }

        #btn-loader {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
        }

        #btn-loader > .loader-alt {
          width: 35px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        #btn-loader > .loader {
          width: 20px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        .empty {
          width: 100%;
          padding: 10px 0 30px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }

        .last {
          width: 100%;
          padding: 10px 0 30px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }

        .last > h2,
        .empty > h2 {
          width: 100%;
          margin: 5px 0;
          text-align: start;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
          line-height: 1.4;
          font-size: 1.2rem;
        }

        .last p,
        .empty p {
          width: 100%;
          margin: 0;
          text-align: start;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          line-height: 1.4;
          font-size: 0.95rem;
        }

        .last p.next > .url,
        .empty  p.next > .url {
          background: var(--poll-background);
          color: var(--gray-color);
          padding: 2px 5px;
          font-size: 0.95rem;
          font-weight: 400;
          border-radius: 5px;
        }

        .last p.next > .warn,
        .empty  p.next .warn {
          color: var(--error-color);
          font-weight: 500;
          font-size: 0.9rem;
          background: var(--poll-background);
          padding: 2px 5px;
          border-radius: 5px;
        }

        div.stories {
          padding: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        @media screen and (max-width:660px) {
          .last {
            width: 100%;
            padding: 10px 0 25px;
            border-bottom: var(--border);
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }

          .empty {
            width: 100%;
            padding: 10px 0 30px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }
        }
      </style>
    `;
  }
}