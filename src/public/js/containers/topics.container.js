export default class TopicsContainer extends HTMLElement {
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
		const contentContainer = this.shadowObj.querySelector('div.content');

		// if contentContainer exists
		if (contentContainer) {
			this.fetchTopics(contentContainer);
		}
	}

	fetching = (url, topicsContainer) => {
    const outerThis = this;
    const options = { method: 'GET'}
    this.getCacheData(url, options)
    .then(result => {
      if (result.success) {
        const data = result.data;
        if(data.topics.length === 0) {
          topicsContainer.innerHTML = outerThis.getWrongMessage();
        }
        else {
          const content = outerThis.mapFields(data.topics);
          topicsContainer.insertAdjacentHTML('beforebegin', outerThis.getTitle())
          topicsContainer.innerHTML =  content
          outerThis.setLastItem(topicsContainer);
        }
      }
      else {
        topicsContainer.innerHTML = outerThis.getWrongMessage();
      }
    })
    .catch((error) => {
      // console.log(error)
      topicsContainer.innerHTML = outerThis.getWrongMessage();
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

  fetchTopics = topicsContainer => {
    const outerThis = this;
    const url = `${this._url}?limit=10`;

    if(!this._block && !this._empty) {
      outerThis.fetching(url, topicsContainer);
    }
  }

  populateTopics = (content, topicsContainer) => {
    // get the loader and remove it
    const loader = topicsContainer.querySelector('topic-loader');
    if (loader){
      loader.remove();
    }

    // insert the content
    topicsContainer.insertAdjacentHTML('beforeend', content);
  }
  
  mapFields = data => {
    return data.map(topic => {
      const author = topic.topic_author;
      const sections = topic.topic_sections;
      const url = `/t/${topic.hash.toLowerCase()}`;
      // Remove all HTML tags
      const noHtmlContent = topic.summary.replace(/<\/?[^>]+(>|$)/g, "");
      return /*html*/`
        <topic-wrapper hash="${topic.hash}" name="${topic.name}" description="${noHtmlContent}" slug="${topic.slug}"
          topic-follow="${topic.is_following}" subscribed="${topic.is_subscribed}" url="${url}" views="${topic.views}"
          subscribers="${topic.subscribers}" followers="${topic.followers}" stories="${topic.stories}"
          author-hash="${author.hash}" author-you="${topic.you}" author-url="/u/${author.hash}"
          author-img="${author.picture}" author-verified="${author.verified}" author-name="${author.name}" author-followers="${author.followers}"
          author-following="${author.following}" author-follow="${author.is_following}" author-contact='${author.contact ? JSON.stringify(author.contact) : null}'
          author-bio="${author.bio === null ? 'The has not added their bio yet' : author.bio}">
          ${this.mapTopicSections(sections, topic.hash)}
        </topic-wrapper>
      `
    }).join('');
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
  };

  setLastItem = contentContainer => {
    // get last element child (topic)
    const lastItem = contentContainer.lastElementChild;

    // set border-bottom to none
    if (lastItem) {
      lastItem.style.setProperty('border-bottom', 'none');
      lastItem.style.setProperty('padding-bottom', '0');
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
			<topic-loader speed="300"></topic-loader>
		`
	}

	getBody = () => {
		// get mql for media query: desktop
		return /* html */`
		  <div class="content">
				${this.getLoader()}
			</div>
		`;
	}

	getTitle = () => {
		return /*html*/`
			<div class="title">
				<h2>Most read topics</h2>
			</div>
		`
	}

	getWrongMessage = () => {
    // get the next attribute
    return `
      <div class="last">
        <h2 class="title">Something went wrong!</h2>
        <p class="next">
          Something did not work as expected. Topics could be empty or there was an error fetching the topics.
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
					margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: column;
				  gap: 0;
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

				div.content {
				  margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: row;
				  flex-wrap: wrap;
				  align-items: center;
				  justify-content: start;
				  gap: 0;
				  width: 100%;
				}

				.title {
          display: flex;
					width: 100%;
          flex-flow: column;
					padding: 5px 10px 6px;
          gap: 0;
					background: var(--light-linear);
					border-radius: 7px;
        }

        .title > h2 {
          font-size: 1.5rem;
          font-weight: 500;
          font-family: var(--font-text), sans-serif;
          margin: 0;
          color: var(--text-color);
        }

        .title > p.info {
          margin: 0;
          font-size: 0.9rem;
          font-style: italic;
          font-weight: 400;
          font-family: var(--font-text), sans-serif;
          margin: 0;
          color: var(--text-color);
        }


				@media screen and (max-width:660px) {
					:host {
        		font-size: 16px;
						padding: 5px 0 10px;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
	}
}