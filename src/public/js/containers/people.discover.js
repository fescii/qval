export default class DiscoverPeople extends HTMLElement {
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
    const content = this.getPeople();
    setTimeout(() => {
      peopleLoader.remove();
      contentContainer.insertAdjacentHTML('beforeend', content);
			contentContainer.insertAdjacentHTML('beforeend', this.getControls(mql));

			outerThis.activateControls(contentContainer);
    }, 2000)
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
    // language=HTML
    return `
			<div class="people-list">
				${this.getLoader()}
			</div>
    `;
  }

	getControls = mql => {
		// Check if mql is desktop
		if (mql) {
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
	}

  getPeople = () => {
    return /*html*/`
			<person-wrapper username="U0BC98H63AB1" name="John Doe" picture="/img/img.jpg" verified="true" user-follow="true"
				url="/u/U0BC98H63AB1" following="236" followers="9734" you="false"
				bio="I'm John Doe, a passionate software developer with a love for coding and problem-solving.">
			</person-wrapper>

			<person-wrapper username="U0BC98H63BCA" name="Janet Doe" picture="/img/img3.png" you="true"
				verified="false" user-follow="false" url="/u/U0BC98H63AB1" following="736" followers="5134"
				bio="Hi, I'm Janet Doe, a nature enthusiast and aspiring photographer.">
			</person-wrapper>

			<person-wrapper username="U0BC9BAC53H4" name="Yosemite Sam" picture="/img/img2.png" you="false"
				verified="true" user-follow="true" url="/u/U0BC98H63AB1" following="36" followers="234"
				bio="Yosemite Sam here! I'm a cowboy with a passion for adventure and the great outdoors.">
			</person-wrapper>

			<person-wrapper username="U0PHAB693NBA" name="Farghon Legon" picture="/img/img3.png" you="false"
				verified="false" user-follow="true" url="/u/U0BC98H63AB1" following="36" followers="9734"
				bio="Hey there, I'm Farghon Legon. I'm an artist by heart and a dreamer by soul.">
			</person-wrapper>

			<person-wrapper username="U0DAB69B79NH" name="Porky Pig" picture="/img/img4.png" you="false"
				verified="false" user-follow="false" url="/u/U0BC98H63AB1" following="6723" followers="79734"
				bio="Oink! I'm Porky Pig, always up for some fun and mischief.">
			</person-wrapper>

			<person-wrapper username="U0BCCA53HP1" name="Bugs Bunny" picture="/img/img5.png" you="false"
				verified="true" user-follow="false" url="/u/U0BC98H63AB1" following="836" followers="1034"
				bio="What's up, doc? I'm Bugs Bunny, the carrot-loving mischief-maker.">
			</person-wrapper>

			<person-wrapper username="U0PC98H63AB8" name="Marvin Martian" picture="/img/img.jpg" you="false"
				verified="false" user-follow="true" url="/u/U0BC98H63AB1" following="6" followers="934"
				bio="Greetings, earthlings! I'm Marvin Martian, on a mission to conquer the universe.">
			</person-wrapper>
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
				  gap: 5px;
          width: 100%;
          max-width: 100%;
				}

        .title {
				  padding: 0 0 10px 3px;
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
					top: 50%;
					left: 0;
					transform: translateY(-50%);
					width: 40px;
					height: 100%;
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

				@media screen and (max-width:660px) {
					:host {
        		font-size: 16px;
						padding: 15px 0;
						border-bottom: var(--border-mobile);
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
  }
}