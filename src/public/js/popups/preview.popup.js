export default class PreviewPopup extends HTMLElement {
  constructor() {

    // We are not even going to touch this.
    super();

    this._url = this.getAttribute('url');

    this._story = '';

    // let's create our shadow root
    this.shadowObj = this.attachShadow({mode: 'open'});

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    this.disableScroll();

    // Select the close button & overlay
    const overlay = this.shadowObj.querySelector('.overlay');
    const btns = this.shadowObj.querySelectorAll('.cancel-btn');
    const contentContainer = this.shadowObj.querySelector('div.preview');

    // Close the modal
    if (overlay && btns && contentContainer) {
      this.fetchPreview(contentContainer);
      this.closePopup(overlay, btns);
    }
  }

  fetchPreview = (contentContainer) => {
    const outerThis = this;
		const previewLoader = this.shadowObj.querySelector('.loader-container');
		setTimeout(() => {
      // fetch the user stats
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
  
      this.fetchWithTimeout(this._url, options)
        .then(response => {
          return response.json();
        })
        .then(result => {
          // check for success response
          if (result.success) {
            if(result.reply) {
              const reply = result.reply;
              outerThis._story = outerThis.mapReply(reply);
              const replyContent = outerThis.removeHtml(reply.content, null);
              const content = outerThis.getContent(replyContent, `/r/${reply.hash.toLowerCase()}`, reply.reply_author.hash, reply.views, reply.likes);

              // remove the loader
              previewLoader.remove();
              // insert the content
              contentContainer.insertAdjacentHTML('beforeend', content);

              // open the story
              outerThis.openStory();
            }
            else if (result.story){
              const story = result.story;
              const storyContent = outerThis.removeHtml(story.content, story.title);
              outerThis._story = outerThis.mapStory(story);
              const content = outerThis.getContent(storyContent, `/p/${story.hash.toLowerCase()}`, story.story_author.hash, story.views, story.likes);

              // remove the loader
              previewLoader.remove();

              // insert the content
              contentContainer.insertAdjacentHTML('beforeend', content);

              // open the story
              outerThis.openStory();
            }
            else if (result.user){
              const user = result.user;
              const bio = user.bio === null ? 'This user has not added a bio yet.' : user.bio;
              const userContent = outerThis.removeHtml(bio, user.name);
              outerThis._story = outerThis.mapUser(user);
              const content = outerThis.getUserContent(userContent, `/u/${user.hash.toLowerCase()}`, user.hash, user.followers);

              // remove the loader
              previewLoader.remove();

              // insert the content
              contentContainer.insertAdjacentHTML('beforeend', content);

              // open the story
              outerThis.openStory();
            }
            else if (result.topic){
              const topic = result.topic;
              const topicContent = outerThis.removeHtml(topic.summary, topic.name);
              outerThis._story = outerThis.mapTopic(topic);
              const content = outerThis.getTopicContent(topicContent, `/t/${topic.hash.toLowerCase()}`, topic.author, topic.followers);

              // remove the loader
              previewLoader.remove();

              // insert the content
              contentContainer.insertAdjacentHTML('beforeend', content);

              // open the story
              outerThis.openStory();
            }

            else {
              // display error message
              const content = outerThis.getEmpty();
              previewLoader.remove();
              contentContainer.insertAdjacentHTML('beforeend', content);
            }
          }
          else {
            // display error message
            const content = outerThis.getEmpty();
            previewLoader.remove();
            contentContainer.insertAdjacentHTML('beforeend', content);
          }
        })
        .catch(error => {
          // display error message
          const content = outerThis.getEmpty();
          previewLoader.remove();
          contentContainer.insertAdjacentHTML('beforeend', content);
        });
		}, 2000)
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

    return `
      ${title ? "<h3>" + title + "</h3>" : ""}
      ${str.length > 250 ? "<p>" + str.substring(0, 250) + "</p>" : "<p>" + str + "</p>"}
    `
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
        const post =  this._story;
  
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
        parent="${reply.story ? reply.story : reply.reply}" likes-url="/api/v1/r/${reply.hash}/likes" 
        author-url="/u/${author.hash}" author-hash="${author.hash}" author-you="${reply.you}" author-stories="${author.stories}" 
        author-replies="${author.replies}" author-img="${author.picture}" author-verified="${author.verified}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
        author-name="${author.name}" author-followers="${author.followers}" author-following="${author.following}" 
        author-follow="${author.is_following}" author-bio="${author.bio === null ? 'The author has no bio yet!' : author.bio}">
        ${reply.content}
      </app-post>
    `
  }

  mapUser = user => {
    const url = `/u/${user.hash.toLowerCase()}`;
    return /*html*/`
			<app-profile tab="stories" hash="${user.hash}" you="${user.you}" url="${url}" stories="${user.stories}" replies="${user.replies}"
        picture="${user.picture}" verified="${user.verified}" name="${user.name}" followers="${user.followers}" contact='${user.contact ? JSON.stringify(user.contact) : null}'
        following="${user.following}" user-follow="${user.is_following}" bio="${user.bio === null ? 'The author has no bio yet!': user.bio }"
        followers-url="/api/v1${url}/followers" following-url="/api/v1${url}/following"
        stories-url="/api/v1${url}/stories" replies-url="/api/v1${url}/replies">
			</app-profile>
    `
  }

  mapTopic = topic => {
    const author = topic.topic_author;
    const sections = topic.topic_sections;
    const url = `/t/${topic.hash.toLowerCase()}`;
    let apiUrl = `/api/v1${url}`
    // Remove all HTML tags
    const noHtmlContent = topic.summary.replace(/<\/?[^>]+(>|$)/g, "");
    return /*html*/`
      <app-topic tab="article" hash="${topic.hash}" name="${topic.name}" summary="${noHtmlContent}" slug="${topic.slug}"
        topic-follow="${topic.is_following}" subscribed="${topic.is_subscribed}" url="${url}" views="${topic.views}"
        subscribers="${topic.subscribers}" followers="${topic.followers}" stories="${topic.stories}"
        stories-url="${apiUrl}/stories" contributors-url="${apiUrl}/contributors" followers-url="${apiUrl}/followers" 
        author-hash="${author.hash}" author-you="${topic.you}" author-url="/u/${author.hash}" 
        author-stories="${author.stories}" author-replies="${author.replies}"
        author-img="${author.picture}" author-verified="${author.verified}" author-name="${author.name}" author-followers="${author.followers}"
        author-following="${author.following}" author-follow="${author.is_following}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
        author-bio="${author.bio === null ? 'The has not added their bio yet' : author.bio}">
        ${sections}
      </app-topic>
    `
  }

  mapTopicSections = (data, hash) => {
    if (data.length <= 0) {
      return /*html*/`
        <div class="empty">
          <p>The topic has no information yet. You can contribute to this topic by adding relevant information about the topic.</p>
          <a href="/t/${hash}/contribute" class="button">Contribute</a>
        </div>
      `;
    }
    else {
      const html = data.map(section => {
        const title = section.title !== null ? `<h2 class="title">${section.title}</h2>` : '';
        return /*html*/`
          <div class="section" order="${section.order}" id="section${section.order}">
            ${title}
            ${section.content}
          </div>
        `
      }).join('');
  
      const last = /*html*/`
        <div class="last">
          <p>Do you have more information about this topic? You can contribute to this topic by adding or editing information.</p>
          <a href="/t/${hash}/contribute" class="button">Contribute</a>
        </div>
      `
  
      return html + last;
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

  disconnectedCallback() {
    this.enableScroll()
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

  // close the modal
  closePopup = (overlay, btns) => {
    overlay.addEventListener('click', e => {
      e.preventDefault();
      this.remove();
    });

    btns.forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        this.remove();
      });
    })
  }

  getTemplate() {
    // Show HTML Here
    return `
      <div class="overlay"></div>
      <section id="content" class="content">
        <span class="control cancel-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
        </span>
        ${this.getWelcome()}
      </section>
    ${this.getStyles()}`
  }

  getWelcome() {
    return /*html*/`
      <div class="welcome">
        <h2>Preview</h2>
        <div class="preview">
				  ${this.getLoader()}
        </div>
			</div>
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

  getUserContent = (content, url, hash, followers) => {
    return /*html*/`
      <p>${content}</p>
      <span class="meta">
        <span class="by">@</span>
        <span class="hash">${hash}</span>
      </span>
      ${this.getUserActions(followers, url)}
    `
  }

  getTopicContent = (content, url, hash, followers) => {
    return /*html*/`
      <p>${content}</p>
      <span class="meta">
        <span class="by">by</span>
        <span class="hash">${hash}</span>
      </span>
      ${this.getTopicActions(followers, url)}
    `
  }

  getActions = (likes, views, url) => {
    return /*html*/`
      <div class="actions">
        <a href="${url}" class="action view" id="view-action">view</a>
        <span class="action likes plain">
          <span class="no">${this.formatNumber(likes)}</span> <span class="text">likes</span>
        </span>
        <span class="action views plain">
          <span class="no">${this.formatNumber(views)}</span> <span class="text">views</span>
        </span>
      </div>
    `
  }

  getUserActions = (followers, url) => {
    return /*html*/`
      <div class="actions">
        <a href="${url}" class="action view" id="view-action">view</a>
        <span class="action likes plain">
          <span class="no">${this.formatNumber(followers)}</span> <span class="text">followers</span>
        </span>
      </div>
    `
  }

  getTopicActions = (followers, url) => {
    return /*html*/`
      <div class="actions">
        <a href="${url}" class="action view" id="view-action">view</a>
        <span class="action likes plain">
          <span class="no">${this.formatNumber(followers)}</span> <span class="text">followers</span>
        </span>
      </div>
    `
  }

  getEmpty = () => {
    return /* html */`
      <div class="empty">
        <p>There was an error fetching the preview.</p>
        <p>Try refreshing the page or check your internet connection. If the problem persists, please contact support.</p>
      </div>
    `
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

  getStyles() {
    return /*css*/`
      <style>
        * {
          box-sizing: border-box !important;
        }

        :host{
          border: none;
          padding: 0;
          justify-self: end;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          z-index: 100;
          width: 100%;
          min-width: 100vw;
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          left: 0;
        }

        div.overlay {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: var(--modal-background);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
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

        #content {
          z-index: 1;
          background-color: var(--background);
          padding: 35px 15px 20px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          width: 700px;
          max-height: 90%;
          height: max-content;
          border-radius: 25px;
          position: relative;
        }
  
        #content span.control {
          padding: 0;
          cursor: pointer;
          display: flex;
          flex-flow: column;
          gap: 0px;
          justify-content: center;
          position: absolute;
          right: 14px;
          top: 14px;
        }

        #content span.control svg {
          width: 21px;
          height: 21px;
          color: var(--text-color);
        }

        #content span.control svg:hover{
          color: var(--error-color);
        }

        .preview {
          width: 100%;
          display: flex;
          flex-flow: column;
          color: var(--text-color);
          line-height: 1.4;
          gap: 4px;
          margin: 0;
          padding: 0;
        }

        .preview p,
        .preview h3 {
          margin: 0;
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

        .welcome {
          width: 90%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          row-gap: 0;
        }

        .welcome > h2 {
          width: 100%;
          font-size: 1.35rem;
          font-weight: 600;
          margin: 0 0 10px;
          padding: 10px 10px;
          background-color: var(--gray-background);
          text-align: center;
          border-radius: 12px;
          font-family: var(--font-read), sans-serif;
          color: var(--text-color);
          font-weight: 500;
        }

        div.empty {
          width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 8px;
        }

        div.empty > p {
          width: 100%;
          padding: 0;
          margin: 0;
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-size: 1rem;
          font-weight: 400;
        }

        div.empty > p.italics {
          font-style: italic;
        }
        
        .actions {
          display: flex;
          font-family: var(--font-main), sans-serif;
          width: 100%;
          flex-flow: row;
          align-items: center;
          gap: 20px;
          margin: 10px 0 0;
        }
        
        .actions > .action {
          background: var(--accent-linear);
          text-decoration: none;
          color: var(--white-color);
          font-size: 0.9rem;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: lowercase;
          justify-content: center;
          padding: 1px 15px 2px;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
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

        @media screen and ( max-width: 600px ){
          :host {
            border: none;
            background-color: var(--modal-background);
            padding: 0px;
            justify-self: end;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: end;
            gap: 10px;
            z-index: 20;
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            left: 0;
          }

          #content {
            box-sizing: border-box !important;
            padding: 25px 0 0 0;
            margin: 0;
            width: 100%;
            max-width: 100%;
            max-height: 90%;
            min-height: max-content;
            border-radius: 0px;
            border-top: var(--mobile-border);
            border-top-right-radius: 15px;
            border-top-left-radius: 15px;
          }

          #content span.control {
            cursor: default !important;
            display: none;
            top: 15px;
            right: 15px;
          }

          .welcome {
            width: 100%;
            padding: 0 15px 20px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }

          .welcome > h2 {
            width: 100%;
            font-size: 1.2rem;
            margin: 0 0 10px;
            padding: 10px 10px;
            background-color: var(--gray-background);
            text-align: center;
            border-radius: 12px;
          }

          .welcome > .actions {
            width: 100%;
          }

          .welcome > .actions .action {
            background: var(--stage-no-linear);
            text-decoration: none;
            padding: 7px 20px 8px;
            cursor: default;
            margin: 10px 0;
            width: 120px;
            cursor: default !important;
            border-radius: 12px;
          }
          a {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}