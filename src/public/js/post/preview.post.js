export default class PreviewPost extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._url = this.getAttribute('url');

    this._story = null;
    this._reply = null;
    this._item = '';

    // let's create our shadow root
    this.shadowObj = this.attachShadow({mode: 'open'});

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const contentContainer = this.shadowObj.querySelector('div.preview');

    // Close the modal
    if (contentContainer) {
      this.activateBtn(contentContainer);
      this.activateFetchPreview(contentContainer);
    }
  }

  activateFetchPreview = contentContainer => {
    // const kind = this.getAttribute('preview');

    // if the kind is full, fetch the preview
    // if (kind === 'full') {
    //   this.fetchPreview(contentContainer);
    // }

    this.fetchPreview(contentContainer);
  }

  activateBtn = contentContainer => {
    const btn = this.shadowObj.querySelector('button.fetch');

    if (btn && contentContainer) {
      btn.addEventListener('click', event => {
        event.preventDefault();
        this.fetchPreview(contentContainer);
      })
    }
  }

  activateCloseBtn = contentContainer => {
    const outerThis = this;
    const closeBtn = this.shadowObj.querySelector('.action.close');

    if (closeBtn && contentContainer) {
      closeBtn.addEventListener('click', event => {
        event.preventDefault();
        contentContainer.innerHTML = /*html*/`<button class="fetch">Preview</button>`;

        // activate the button
        outerThis.activateBtn(contentContainer);
      });
    }
  }

  fetchPreview = contentContainer => {
    const outerThis = this;
    // Add the loader
    contentContainer.innerHTML = this.getLoader();
		const previewLoader = this.shadowObj.querySelector('#loader-container');

    // Check if reply or story is already fetched
    if (this._story || this._reply) {
      // remove the loader
      previewLoader.remove();
      
      const likes = this._story ? this._story.likes : this._reply.likes;
      const views = this._story ? this._story.views : this._reply.views;
      const url = this._story ? `/p/${this._story.hash.toLowerCase()}` : `/r/${this._reply.hash.toLowerCase()}`;
      const itemContent = this._story ? outerThis.removeHtml(this._story.content, this._story.title) : outerThis.removeHtml(this._reply.content, null);
      const content = outerThis.getContent(itemContent, url, this._story ? this._story.story_author.hash : this._reply.reply_author.hash, views, likes);

      // insert the content
      contentContainer.innerHTML = content;;

      // activate the close button
      outerThis.activateCloseBtn(contentContainer);

      // open the story
      this.openStory();
      return;
    }

		setTimeout(() => {
      // fetch the user stats
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Set cookie age to 2 hours
          'Cache-Control': 'public, max-age=7200'
        }
      };
  
      this.getCacheData(this._url, options)
        .then(result => {
          // check for success response
          if (result.success) {
            if(result.reply) {
              const reply = result.reply;
              outerThis._reply = reply;
              outerThis._item = outerThis.mapReply(reply);
              const replyContent = outerThis.removeHtml(reply.content, null);
              const content = outerThis.getContent(replyContent, `/r/${reply.hash.toLowerCase()}`, reply.reply_author.hash, reply.views, reply.likes);

              // remove the loader
              previewLoader.remove();

              // insert the content
              contentContainer.innerHTML = content;;

              // activate the close button
              outerThis.activateCloseBtn(contentContainer);

              // open the story
              outerThis.openStory();
            }
            else if (result.story){
              const story = result.story;
              outerThis._story = story;
              const storyContent = outerThis.removeHtml(story.content, story.title);
              outerThis._item = outerThis.mapStory(story);
              const content = outerThis.getContent(storyContent, `/p/${story.hash.toLowerCase()}`, story.story_author.hash, story.views, story.likes);

              // remove the loader
              previewLoader.remove();

              // insert the content
              contentContainer.innerHTML = content;;

              // activate the close button
              outerThis.activateCloseBtn(contentContainer);

              // open the story
              outerThis.openStory();
            }
            else {
              // display error message
              const content = outerThis.getEmpty();
              previewLoader.remove();
              contentContainer.innerHTML = content;;

              // activate close button
              outerThis.activateCloseBtn(contentContainer);

              // activate the button
              outerThis.activateBtn(contentContainer);
            }
          }
          else {
            // display error message
            const content = outerThis.getEmpty();
            previewLoader.remove();
            contentContainer.innerHTML = content;;

            // activate close button
            outerThis.activateCloseBtn(contentContainer);

            // activate the button
            outerThis.activateBtn(contentContainer);
          }
        })
        .catch(error => {
          // display error message
          const content = outerThis.getEmpty();
          previewLoader.remove();
          contentContainer.innerHTML = content;;

          // activate close button
          outerThis.activateCloseBtn(contentContainer);

          // activate the button
          outerThis.activateBtn(contentContainer);
        });
		}, 100)
	}

  fetchWithTimeout = (url, options, timeout = 9500) => {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const signal = controller.signal;
  
      const timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('Request timed out'));
      }, timeout);
  
      fetch(url, { ...options, signal })
        .then(response => {
          clearTimeout(timeoutId);
          resolve(response);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            // This error is thrown when the request is aborted
            reject(new Error('Request timed out'));
          } else {
            // This is for other errors
            reject(error);
          }
        });
    });
  }

  getCacheData = async (url, options) => {
    const outerThis = this;
    const cacheName = "user-cache";
    try {
      const cache = await caches.open(cacheName);
      const response = await cache.match(url);
      if (response) {
        const data = await response.json();
        return data;
      } else {
        const networkResponse = await outerThis.fetchWithTimeout(url, options);
        await cache.put(url, networkResponse.clone());
        const data = await networkResponse.json();
        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  removeHtml = (text, title)=> {
    let str = text;
    // Check if the text is encoded (contains &lt; or &gt;)
    if (text.includes('&lt;') || text.includes('&gt;')) {
      // remove them from the text
      str = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    } else {
      // Directly remove all HTML tags
      str = text.replace(/<[^>]*>/g, '');
    }

    str = str.trim();
    const filteredTitle = title ? `<h3>${title}</h3>` : '';
    const content = `<p>${this.trimContent(str)}</p>`;

    return `
      ${filteredTitle}
      ${content}
    `
  }

  trimContent = text => {
    // if text is less than 150 characters
    if (text.length <= 150) return text;


    // check for mobile view
    const mql = window.matchMedia('(max-width: 660px)');

    // Check if its a mobile view
    if (mql.matches) {
      // return text substring: 150 characters + ...
      return text.substring(0, 150) + '...';
    } else {
      // trim the text to 250 characters
      return text.substring(0, 250) + '...';
    }
  }

  openStory = () => {
    // Get the body
    const body = document.querySelector('body');

    // get current content
    const content = this.shadowObj.querySelector('.actions > .action#view-action');

    if(body && content) {
      content.addEventListener('click', event => {
        event.preventDefault();

        let url = content.getAttribute('href');

        // Get full post
        const post =  this._item;
  
        // replace and push states
        this.replaceAndPushStates(url, body, post);

        body.innerHTML = post;
      })
    }
  }

  // Replace and push states
  replaceAndPushStates = (url, body, post) => {
    // get the first custom element in the body
    const firstElement = body.firstElementChild;

    // convert the custom element to a string
    const elementString = firstElement.outerHTML;

    // Replace the content with the current url and body content
    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: elementString },
      url, pageUrl
    );

    // Updating History State
    window.history.pushState(
      { page: 'page', content: post},
      url, url
    );
  }

  mapStory = story => {
    const author = story.story_author;
    const url = `/p/${story.hash.toLowerCase()}`;
    if (story.kind === "post") {
      return /*html*/`
        <app-post story="quick" tab="replies" url="${url}" hash="${story.hash}" likes="${story.likes}" replies="${story.replies}" 
          replies-url="/api/v1${url}/replies" likes-url="/api/v1${url}/likes"
          views="${story.views}"  time="${story.createdAt}" liked="${story.liked ? 'true' : 'false'}" 
          author-url="/u/${author.hash}" author-stories="${author.stories}" author-replies="${author.replies}"
          author-hash="${author.hash}" author-you="${story.you ? 'true' : 'false'}" author-img="${author.picture}" 
          author-verified="${author.verified ? 'true' : 'false'}" author-name="${author.name}" author-followers="${author.followers}" 
          author-following="${author.following}" author-follow="${author.is_following ? 'true' : 'false'}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
          author-bio="${author.bio === null ? 'This user has not added a bio yet.' : author.bio}">
          ${story.content}
        </app-post>
      `
    }
    else if (story.kind === "poll") {
      return /*html*/`
        <app-post story="poll" tab="replies" url="${url}" hash="${story.hash}" likes="${story.likes}"
          replies="${story.replies}" liked="${story.liked ? 'true' : 'false'}" views="${story.views}" time="${story.createdAt}"
          replies-url="/api/v1${url}/replies" likes-url="/api/v1${url}/likes" options='${story.poll}' voted="${story.option ? 'true' : 'false'}" 
          selected="${story.option}" end-time="${story.end}" votes="${story.votes}" 
          author-url="/u/${author.hash}" author-stories="${author.stories}" author-replies="${author.replies}"
          author-hash="${author.hash}" author-you="${story.you ? 'true' : 'false'}" author-img="${author.picture}" 
          author-verified="${author.verified ? 'true' : 'false'}" author-name="${author.name}" author-followers="${author.followers}" 
          author-following="${author.following}" author-follow="${author.is_following ? 'true' : 'false'}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}' 
          author-bio="${author.bio === null ? 'This user has not added a bio yet.' : author.bio}">
          ${story.content}
        </app-post>
      `
    }
    else if (story.kind === "story") {
      return /*html*/`
        <app-story story="story" hash="${story.hash}" url="${url}" tab="replies" topics="${story.topics.length === 0 ? 'story' : story.topics}" 
          story-title="${story.title}" time="${story.createdAt}" replies-url="/api/v1${url}/replies" 
          likes-url="/api/v1${url}/likes" likes="${story.likes}" replies="${story.replies}" liked="${story.liked ? 'true' : 'false'}" views="${story.views}" 
          author-url="/u/${author.hash}" author-stories="${author.stories}" author-replies="${author.replies}"
          author-hash="${author.hash}" author-you="${story.you ? 'true' : 'false'}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}' 
          author-img="${author.picture}" author-verified="${author.verified ? 'true' : 'false'}" author-name="${author.name}" 
          author-followers="${author.followers}" author-following="${author.following}" author-follow="${author.is_following ? 'true' : 'false'}" 
          author-bio="${author.bio === null ? 'This user has not added a bio yet.' : author.bio}">
          ${story.story_sections}
        </app-story>
      `
    }
  }

  mapReply = reply => {
    const author = reply.reply_author;
    return /*html*/`
      <app-post story="reply" tab="replies" hash="${reply.hash}" url="/r/${reply.hash.toLowerCase()}" likes="${reply.likes}" liked="${reply.liked}"
        replies="${reply.replies}" views="${reply.views}" time="${reply.createdAt}" replies-url="/api/v1/r/${reply.hash}/replies" 
        parent="${reply.story ? reply.story : reply.reply}" preview="full" likes-url="/api/v1/r/${reply.hash}/likes" 
        author-url="/u/${author.hash}" author-hash="${author.hash}" author-you="${reply.you}" author-stories="${author.stories}" 
        author-replies="${author.replies}" author-img="${author.picture}" author-verified="${author.verified}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
        author-name="${author.name}" author-followers="${author.followers}" author-following="${author.following}" 
        author-follow="${author.is_following}" author-bio="${author.bio === null ? 'The author has no bio yet!' : author.bio}">
        ${reply.content}
      </app-post>
    `
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
    } else if (n >= 1000000000) {
      return "1B+";
    }
    else {
      return 0;
    }
  }

  parseToNumber = str => {
    // Try parsing the string to an integer
    const num = parseInt(str);

    // Check if parsing was successful
    if (!isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  }

  disableScroll() {
    // Get the current page scroll position
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    let scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    document.body.classList.add("stop-scrolling");

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function() {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    document.body.classList.remove("stop-scrolling");
    window.onscroll = function() {};
  }

  getTemplate() {
    const className = this.getClass(this.getAttribute('preview'));
    const parent = this.getAttribute('hash');
    // Show HTML Here
    return /*html*/`
      <div class="welcome">
        <div class="replying-to">
          <span class="meta-reply">
            <span class="text">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="16px" height="16px" fill="currentColor">
                <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z"/>
              </svg>
              <span class="reply">Replying to</span>
            </span>
            <span class="parent">${parent.toUpperCase()}</span>
          </span>
        </div>
        <div class="preview ${className}">
          <button class="fetch">Preview</button>
        </div>
      </div>
      ${this.getStyles()}
    `
  }

  getContent = (content, url, hash, views, likes) => {
    return /*html*/`
      <p>${content}</p>
      <span class="meta">
        <span class="by">by</span>
        <span class="hash">${hash}</span>
      </span>
      ${this.getActions(likes, views, url)}
    `
  }

  getActions = (likes, views, url) => {
    return /*html*/`
      <div class="actions">
        <a href="${url}" class="action view" id="view-action">view</a>
        <span class="action close" id="close-action">close</span>
        <span class="action likes plain">
          <span class="no">${this.formatNumber(likes)}</span> <span class="text">likes</span>
        </span>
        <span class="action views plain">
          <span class="no">${this.formatNumber(views)}</span> <span class="text">views</span>
        </span>
      </div>
    `
  }

  getEmpty = () => {
    return /* html */`
      <div class="empty">
        <p>An error has occurred.</p>
        <div class="actions">
          <button class="fetch last">Retry</button>
          <span class="action close" id="close-action">close</span>
        </div>
      </div>
    `
  }

  getFullCss = preview => {
    if (preview === 'full') {
      return "padding: 10px 0;"
    } else {
      return "padding: 0;"
    }
  }

  getClass = preview => {
    return preview === 'full' ? '' : 'feed';
  }

  getLoader() {
    return `
      <div id="loader-container">
				<div class="loader"></div>
			</div>
    `
  }

  getStyles() {
    return /*css*/`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host{
          border: none;
          padding: 0;
          ${this.getFullCss(this.getAttribute('preview'))}
          justify-self: end;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-width: 100%;
        }

        #loader-container {
          padding: 10px 0;
          width: 50px;
          background-color: var(--loader-background);
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
          -webkit-border-radius: inherit;
          -moz-border-radius: inherit;
        }

        #loader-container > .loader {
          width: 20px;
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

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        .welcome {
          width: 100%;
          height: max-content;
          position: relative;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          row-gap: 0;
        }

        .preview {
          width: 100%;
          position: relative;
          display: flex;
          flex-flow: column;
          color: var(--text-color);
          line-height: 1.4;
          gap: 0;
          margin: 2px 0;
          padding: 0 0 0 15px;
        }

        .preview.feed {
          padding: 0 0 0 10px;
        }

        .preview::before {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
          width: 1.5px;
          height: 93%;
          background: var(--action-linear);
          border-radius: 5px;
        }

        .preview p,
        .preview h3 {
          margin: 0;
          line-height: 1.2;
        }

        .preview h3 {
          margin: 0;
        }

        .replying-to {
          position: relative;
          text-decoration: none;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 0;
          margin: 0;
          padding: 0;
        }
        
        .replying-to > .meta-reply {
          display: flex;
          width: max-content;
          align-items: start;
          color: var(--gray-color);
          flex-flow: column;
          font-size: 1rem;
          gap: 2px;
        }
        
        .replying-to > .meta-reply > .text {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 5px;
        }

        .replying-to > .meta-reply > .text > .reply {
          display: flex;
          font-size: 0.85rem;
          font-family: var(--font-text), sans-serif;
          padding: 0;
          font-weight: 500;
        }
        
        .replying-to > .meta-reply > .text > svg {
          color: var(--gray-color);
          width: 16px;
          height: 16px;
          display: inline-block;
          margin: 0 0 1px 0px;
        }
        
        .replying-to > .meta-reply .parent {
          background: var(--action-linear);
          font-family: var(--font-mono), monospace;
          font-size: 0.8rem;
          line-height: 1;
          color: transparent;
          font-weight: 600;
          background-clip: text;
          -webkit-background-clip: text;
          -moz-background-clip: text;
        }

        .meta {
          height: max-content;
          display: flex;
          position: relative;
          color: var(--gray-color);
          align-items: center;
          font-family: var(--font-mono),monospace;
          gap: 5px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .meta > span.sp {
          margin: 1px 0 0 0;
        }

        .meta > span.by {
          font-weight: 500;
          font-size: 0.93rem;
          margin: 0 0 1px 1px;
        }

        .meta > span.hash {
          background: var(--action-linear);
          font-family: var(--font-mono), monospace;
          font-size: 0.9rem;
          line-height: 1;
          color: transparent;
          font-weight: 600;
          background-clip: text;
          -webkit-background-clip: text;
          -moz-background-clip: text;
        }

        .meta > time.time {
          font-family: var(--font-text), sans-serif;
          font-size: 0.83rem;
          font-weight: 500;
          margin: 1px 0 0 0;
        }

        .preview p {
          margin: 0 0 5px 0;
          padding: 0;
          line-height: 1.4;
          font-family: var(--font-text), sans-serif;
        }

        div.empty {
          width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 10px;
        }

        div.empty > p {
          width: max-content;
          padding: 0;
          margin: 5px 0 0 0;
          color: var(--error-color);
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        div.empty > .actions {
          margin: 0;
        }

        button.fetch {
          width: max-content;
          margin: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px 10px 3px;
          font-size: 0.9rem;
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          background: var(--accent-linear);
          color: var(--white-color);
          border: none;
          border-radius: 10px;
          cursor: pointer
        }

        button.fetch.last {
          margin: 0 0 5px;
        }

        .preview.feed button.fetch {
          margin: 5px 0 3px 0;
          padding: 1px 10px 2px;
          border-radius: 7px;
          font-size: 0.8rem;
        }
        
        .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 15px;
          margin: 10px 0 3px;
        }
        
        .actions > .action {
          border: var(--border-button);
          text-decoration: none;
          color: var(--gray-color);
          font-size: 0.9rem;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: lowercase;
          justify-content: center;
          padding: 1px 10px 2px;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
        }

        .actions > .action.close {
          color: var(--error-color);
          cursor: pointer;
        }

        .actions > .action.plain {
          padding: 0;
          font-weight: 500;
          pointer-events: none;
          font-family: var(--font-text), sans-serif;
          color: var(--gray-color);
          border: none;
          background: none;
        }
        
        .actions > .action.plain > span.no {
          font-family: var(--font-main), sans-serif;
          font-size: 0.9rem;
          color: var(--text-color);
        }

        .actions > .action.plain > span.text {
          display: inline-block;
          padding: 0 0 0 3px;
        }
        
        @media screen and ( max-width: 850px ){
          #content {
            width: 90%;
          }
        }

        @media screen and ( max-width: 660px ) {
          :host {
            border: none;
            ${this.getFullCss(this.getAttribute('preview'))}
            justify-self: end;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            min-width: 100%;
          }

          button.fetch,
          .actions > .action.close,
          a {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}