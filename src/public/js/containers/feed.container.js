export default class FeedContainer extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._url = this.getAttribute('url');

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    
    const feedContainer = this.shadowObj.querySelector('.stories');

    // check if the total
    if (feedContainer) {
      this.fetchFeeds(feedContainer);
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

  fetching = (url, feedContainer) => {
    const outerThis = this;
    this.fetchWithTimeout(url, { method: "GET" }).then((response) => {
      response.json().then((result) => {
        if (result.success) {
          const data = result.data;
          // console.log(data)
          if (data.last && outerThis._page === 1 && data.stories.length === 0 && data.replies.length === 0) {
            outerThis.populateFeeds(outerThis.getEmptyMsg(), feedContainer);
          }
          else {
            const content = outerThis.mapFeeds(data.stories, data.replies);
            outerThis.populateFeeds(content, feedContainer);
            outerThis.setLastItem(feedContainer);
          }
        }
        else {
          outerThis.populateFeeds(outerThis.getWrongMessage(), feedContainer);
        }
      })
        .catch((error) => {
          console.log(error)
          outerThis.populateFeeds(outerThis.getWrongMessage(), feedContainer);
        });
    });
  }

  fetchFeeds = feedContainer => {
    const outerThis = this;
    const url = this._url;

    if (!this._block && !this._empty) {
      outerThis._empty = true;
      outerThis._block = true;
      setTimeout(() => {
        // fetch the stories
        outerThis.fetching(url, feedContainer)
      }, 1000);
    }
  }

  populateFeeds = (content, feedContainer) => {
    // get the loader and remove it
    const loader = feedContainer.querySelector('story-loader');
    if (loader) {
      loader.remove();
    }

    // insert the content
    feedContainer.insertAdjacentHTML('beforeend', content);
  }

  mapFeeds = (stories, replies) => {
    const outerThis = this;
    let content = '';
    
    // Check if the stories is empty and replies is not empty
    if (stories.length === 0 && replies.length > 0) {
      content = replies.map(reply => outerThis.mapReply(reply)).join('');
    }
    else if (stories.length > 0 && replies.length === 0) {
      content = stories.map(story => outerThis.mapStory(story)).join('');
    }
    else {
      // for each story follow by a reply, if there is any(i.e): append ine story and one reply if either is available else append the other
      // check the longest array
      if (stories.length >= replies.length) {
        for (let i = 0; i < stories.length; i++) {
          content += outerThis.mapStory(stories[i]);
          if (replies[i]) {
            content += outerThis.mapReply(replies[i]);
          }
        }
      }
      else {
        for (let i = 0; i < replies.length; i++) {
          if (stories[i]) {
            content += outerThis.mapStory(stories[i]);
          }
          content += outerThis.mapReply(replies[i]);
        }
      }
    }

    return content;
  }

  mapStory = story => {
    const author = story.story_author;
    const url = `/p/${story.hash.toLowerCase()}`;
    if (story.kind === "post") {
      return /*html*/`
        <quick-post story="quick" url="${url}" hash="${story.hash}" likes="${story.likes}" 
          replies="${story.replies}" liked="${story.liked ? 'true' : 'false'}" views="${story.views}" time="${story.createdAt}" 
          replies-url="/api/v1${url}/replies" likes-url="/api/v1${url}/likes" 
          author-url="/u/${author.hash}" author-stories="${author.stories}" author-replies="${author.replies}"
          author-hash="${author.hash}" author-you="${story.you ? 'true' : 'false'}" author-img="${author.picture}" 
          author-verified="${author.verified ? 'true' : 'false'}" author-name="${author.name}" author-followers="${author.followers}" 
          author-following="${author.following}" author-follow="${author.is_following ? 'true' : 'false'}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
          author-bio="${author.bio === null ? 'This user has not added a bio yet.' : author.bio}">
          ${story.content}
        </quick-post>
      `
    }
    else if (story.kind === "poll") {
      return /*html*/`
        <poll-post story="poll" url="${url}" hash="${story.hash}" likes="${story.likes}" 
          replies="${story.replies}" liked="${story.liked ? 'true' : 'false'}" views="${story.views}" time="${story.createdAt}" 
          voted="${story.option ? 'true' : 'false'}" selected="${story.option}" end-time="${story.end}" replies-url="/api/v1${url}/replies" 
          likes-url="/api/v1${url}/likes" options='${story.poll}' votes="${story.votes}" 
          author-url="/u/${author.hash}" author-stories="${author.stories}" author-replies="${author.replies}"
          author-hash="${author.hash}" author-you="${story.you ? 'true' : 'false'}" author-img="${author.picture}" 
          author-verified="${author.verified ? 'true' : 'false'}" author-name="${author.name}" author-followers="${author.followers}" 
          author-following="${author.following}" author-follow="${author.is_following ? 'true' : 'false'}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
          author-bio="${author.bio === null ? 'This user has not added a bio yet.' : author.bio}">
          ${story.content}
        </poll-post>
      `
    }
    else if (story.kind === "story") {
      return /*html*/`
        <story-post story="story" hash="${story.hash}" url="${url}" 
          topics="${story.topics.length === 0 ? 'story' : story.topics}" story-title="${story.title}" time="${story.createdAt}" replies-url="/api/v1${url}/replies" 
          likes-url="/api/v1${url}/likes" replies="${story.replies}" liked="${story.liked ? 'true' : 'false'}" likes="${story.likes}" 
          views="${story.views}" 
          author-url="/u/${author.hash}" author-stories="${author.stories}" author-replies="${author.replies}"
          author-hash="${author.hash}" author-you="${story.you ? 'true' : 'false'}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
          author-img="${author.picture}" author-verified="${author.verified ? 'true' : 'false'}" author-name="${author.name}" 
          author-followers="${author.followers}" author-following="${author.following}" author-follow="${author.is_following ? 'true' : 'false'}" 
          author-bio="${author.bio === null ? 'This user has not added a bio yet.' : author.bio}">
          ${story.story_sections}
        </story-post>
      `
    }
  }

  mapReply = reply => {
    const author = reply.reply_author;
    return /*html*/`
      <quick-post story="reply" hash="${reply.hash}" url="/r/${reply.hash.toLowerCase()}" likes="${reply.likes}" replies="${reply.replies}" liked="${reply.liked}"
        views="${reply.views}" time="${reply.createdAt}" replies-url="/api/v1/r/${reply.hash}/replies" likes-url="/api/v1/r/${reply.hash}/likes"
        author-hash="${author.hash}" author-you="${reply.you}" author-url="/u/${author.hash}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
        author-stories="${author.stories}" author-replies="${author.replies}" parent="${reply.story ? reply.story : reply.reply}"
        author-img="${author.picture}" author-verified="${author.verified}" author-name="${author.name}" author-followers="${author.followers}"
        author-following="${author.following}" author-follow="${author.is_following}" author-bio="${author.bio === null ? 'The author has no bio yet!' : author.bio}">
        ${reply.content}
      </quick-post>
    `
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

  setLastItem = contentContainer => {
    // get last element child (can be a story or a reply)
    const lastItem = contentContainer.lastElementChild;

    // set border-bottom to none
    if (lastItem) {
      lastItem.style.setProperty('border-bottom', 'none');
    }
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getLoader = () => {
    return `
			<story-loader speed="300"></story-loader>
		`
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="stories">
				${this.getLoader()}
      </div>
    `;
  }

  getEmptyMsg = () => {
    // get the next attribute
    return `
      <div class="empty">
        <h2 class="title">Feed is not available!</h2>
        <p class="next">
          There are no feeds available for this feed. You can always come back later or refresh the page to check for new feeds.
        </p>
      </div>
    `
  }

  getWrongMessage = () => {
    // get the next attribute
    return `
      <div class="last">
        <h2 class="title">Something went wrong!</h2>
        <p class="next">
          Something did not work as expected, I call it shenanigans!
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
          background: var(--gray-background);
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
          background: var(--gray-background);
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
            padding: 5px 0 10px;
            border-bottom: var(--border);
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }

          .empty {
            width: 100%;
            padding: 5px 0 10px;
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