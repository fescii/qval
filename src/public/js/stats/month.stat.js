export default class MonthStat extends HTMLElement {
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
    // get mql
		const mql = window.matchMedia('(min-width: 660px)');

    const contentContainer = this.shadowObj.querySelector('.stats');

		if (contentContainer) {
			this.fetchStat(contentContainer, mql.matches);
		}
  }

  fetchStat = contentContainer => {
    const outerThis = this;
		setTimeout(() => {
      // fetch the user stats
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // set the cache control to max-age to 1 day
          "Cache-Control": "max-age=86400",
          "Accept": "application/json"
        }
      }

      this.getCacheData(this._url, options)
        .then(result => { 
          const data = result.data;
          // console.log(data);
          // check for success response
          if (result.success) {
            if(!data) {
              // display empty message
              const content = outerThis.getEmpty();
              contentContainer.innerHTML = content;
              return;
            }
            // update the content
            data.all =  outerThis.calculateTotal(data.story, data.reply);

            const content = outerThis.getContent(data);
            contentContainer.innerHTML = content;
          }
          else {
            // display error message
            const content = outerThis.getEmpty();
            contentContainer.innerHTML = content;
          }
        })
        .catch(error => {
          // console.error(error);
          const content = outerThis.getEmpty();
          contentContainer.innerHTML = content;
        });
		}, 1000)
	}

  fetchWithTimeout = (url, options, timeout = 9000) => {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const signal = controller.signal;

      setTimeout(() => {
        controller.abort();
        // add property to the error object
        reject({ name: 'AbortError', message: 'Request timed out' });
        // Throw a custom error
        // throw new Error('Request timed out');
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
        // console.log('Network cache is added');
        const data = await networkResponse.json();
        return data;
      }
    } catch (error) {
      throw error;
    }
  }

  calculateTotal = (story, reply) => {
    const data = {
      stories: {
        last: (story.replies.last + story.views.last + story.likes.last),
        current: (story.replies.current + story.views.current + story.likes.current)
      },
      replies: {
        last: (reply.replies.last + reply.views.last + reply.likes.last),
        current: (reply.replies.current + reply.views.current + reply.likes.current)
      }
    }

    data.total = {
      last: (data.stories.last + data.replies.last),
      current: (data.stories.current + data.replies.current),
    }

    return data;
  }

	getContent = data => {
    const all = this.getAll(data.all);
    const story = this.getStories(data.story);
    const reply = this.getReplies(data.reply);

    return /* html */`
      ${all}
      ${story}
      ${reply}
    `;
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

  getAll = all => {
    return /* html */`
			<all-stat all="${all.total.current}" all-last="${all.total.last}" stories="${all.stories.current}" 
        stories-last="${all.stories.last}" replies="${all.replies.current}" replies-last="${all.replies.last}">
      </all-stat>
		`;
  }

  getStories = data => {
    return /* html */`
			<stories-stat views="${data.views.current}" views-last="${data.views.last}" 
        replies="${data.replies.current}" replies-last="${data.replies.last}" 
        likes="${data.likes.current}" likes-last="${data.likes.last}">
      </stories-stat>
		`
  }

  getReplies = data => {
    return /* html */`
      <replies-stat views="${data.views.current}" views-last="${data.views.last}" 
        replies="${data.replies.current}" replies-last="${data.replies.last}" 
        likes="${data.likes.current}" likes-last="${data.likes.last}">
      </replies-stat>
		`;
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="stats">
				${this.getLoader()}
			</div>
    `;
  }

	getEmpty = () => {
    return /* html */`
      <div class="empty">
        <p>Something went wrong, but not horribly wrong.</p>
				<p>You can try refreshing the page or check back later. If the problem persists, please contact support.</p>
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
				  padding: 0;
					position: relative;
				  display: flex;
				  flex-flow: column;
				  gap: 15px;
          width: 100%;
          max-width: 100%;
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

				div.empty {
          width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 5px;
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

        .title {
				  padding: 2px 0 10px 5px;
          margin: 20px 0;
				  display: flex;
				  flex-flow: column;
				  gap: 0;
				}

				.title h4 {
				  color: #1f2937;
				  font-size: 1.3rem;
				  font-weight: 500;
					padding: 0;
					margin: 0;
				}

				.title > span {
				  color: var(--gray-color);
          font-family: var(--font-text);
				  font-size: 0.85rem;
				}

				.stats {
					background-color: var(--background);
					display: flex;
					flex-flow: column;
					padding:  0;
          min-height: 60vh;
					gap: 0;
					width: 100%;
          max-width: 100%;
				}

				@media screen and (max-width:660px) {
					:host {
        		font-size: 16px;
						padding: 0;
						border-bottom: none;
					}

					.title {
						padding: 2px 0 10px 8px;
						margin: 20px 0;
						display: flex;
						flex-flow: column;
						gap: 0;
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
  }
}