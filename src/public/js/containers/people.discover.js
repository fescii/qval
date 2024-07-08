export default class DiscoverPeople extends HTMLElement {
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

    const contentContainer = this.shadowObj.querySelector('.people-list');

		if (contentContainer) {
			this.fetchPeople(contentContainer, mql.matches);
		}
  }

  fetchPeople = (contentContainer, mql) => {
    const outerThis = this;
		const peopleLoader = this.shadowObj.querySelector('authors-loader');
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
					const data = result.data;
          // check for success response
          if (result.success) {
            if(data.people.length === 0) {
              // display empty message
              const content = outerThis.getEmpty();
							// remove loader
							peopleLoader.remove();
              contentContainer.insertAdjacentHTML('beforeend', content);
              return;
            }
            // update the content
            const content = outerThis.mapUsers(data.people);
            // remove loader
						peopleLoader.remove();
						// add title
						contentContainer.insertAdjacentHTML('beforebegin', outerThis.getTitle());
            contentContainer.insertAdjacentHTML('beforeend', content);
						// activate controls
						if(mql) {
							outerThis.activateControls(contentContainer);
						}
          }
          else {
            // display error message
            const content = outerThis.getEmpty();
            // remove loader
						peopleLoader.remove();
            contentContainer.insertAdjacentHTML('beforeend', content);;
          }
        })
        .catch(error => {
					// console.error(error);
          // display error message
          const content = outerThis.getEmpty();
          // remove loader
					peopleLoader.remove();
          contentContainer.insertAdjacentHTML('beforeend', content);
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

	mapUsers = data => {
    return data.map(user => {
      return /*html*/`
				<person-wrapper hash="${user.hash}" you="${user.you}" url="/u/${user.hash}" stories="${user.stories}" replies="${user.replies}" posts="${user.posts}"
          picture="${user.picture}" verified="${user.verified}" name="${user.name}" followers="${user.followers}"
          following="${user.following}" user-follow="${user.is_following}" bio="${user.bio === null ? 'The author has no bio yet!': user.bio }">
				</person-wrapper>
      `
    }).join('');
  }

	// Activate controls
	activateControls = contentContainer => {
		// select all controls
		const letfControl = this.shadowObj.querySelector('.control.left');
		const rightControl = this.shadowObj.querySelector('.control.right');

		// If left control and right control exists
		if (letfControl && rightControl) {

			// add event listener to left control
			letfControl.addEventListener('click', () => {
				// Scroll by 200px smoothly
				contentContainer.scrollTo({
					left: contentContainer.scrollLeft - 300,
					behavior: 'smooth'
				})
			})

			// add event listener to right control
			rightControl.addEventListener('click', () => {
				// Scroll by 200px smoothly
				contentContainer.scrollTo({
					left: contentContainer.scrollLeft + 300,
					behavior: 'smooth'
				})
			})
			
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
			<authors-loader speed="300"></authors-loader>
		`
  }

  getBody = () => {
		// get mql
		const mql = window.matchMedia('(min-width: 660px)');
    // language=HTML
    return `
			<div class="people-list">
				${this.getLoader()}
				${this.getControls(mql.matches)}
			</div>
    `;
  }

	getControls = mql => {
		// Check if mql is desktop
		if(mql) {
			return /*html*/`
				<div class="left control">
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
							<path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06Z"></path>
						</svg>
					</span>
				</div>
				<div class="right control">
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
							<path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"></path>
						</svg>
					</span>
				</div>
			`
		}
		else return '';
	}

	getTitle = () => {
		return /*html*/`
			<div class="title">
				<h2>Discover people</h2>
				<p class="info">Trending authors on the platform</p>
			</div>
		`
	}

	getEmpty = () => {
    return /* html */`
      <div class="empty">
        <p>No authors recommendation found at the moment.</p>
				<p> There might an issues, try refreshing the page or check back later.</p>
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
				  background-color: var(--background);
					border-bottom: var(--border);
				  padding: 15px 0;
					position: relative;
				  display: flex;
				  flex-flow: column;
				  gap: 15px;
          width: 100%;
          max-width: 100%;
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

        .title {
				  padding: 2px 0 10px 5px;
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

				.people-list {
					background-color: var(--background);
					display: flex;
					flex-flow: row;
					padding: 0 50px 0 0;
					gap: 20px;
					width: 100%;
          max-width: 100%;
					overflow-x: scroll;
					-ms-overflow-style: none;
					scrollbar-width: none;
				}

				.people-list::-webkit-scrollbar {
					display: none !important;
					visibility: hidden;
					-webkit-appearance: none;
				}

				.control {
					position: absolute;
					z-index: 3;
					opacity: 0;
					top: 30%;
					left: 0;
					/* transform: translateY(-50%); */
					width: 40px;
					height: 70%;
					pointer-events: none;
					display: flex;
					align-items: center;
					justify-content: center;
					background: var(--controls-gradient-left);
					transition: all 0.3s ease-in-out;
				}

				.control.right {
					left: unset;
					right: 0;
					background: var(--controls-gradient-right);
				}

				.people-list:hover .control {
					opacity: 1;
					pointer-events: all;
				}

				.control > span {
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;
					background: var(--accent-linear);
					color: var(--white-color);
					border-radius: 50%;
					width: 30px;
					height: 30px;
					transition: background-color 0.3s;
				}

				.title {
          display: flex;
					width: 100%;
          flex-flow: column;
					padding: 5px 5px 8px;
          gap: 0;
					background: var(--light-linear);
					border-radius: 10px;
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
						padding: 15px 0 10px;
						border-bottom: none;
					}

					.title {
						padding: 2px 0 10px 8px;
						margin: 0 0 10px 0;
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