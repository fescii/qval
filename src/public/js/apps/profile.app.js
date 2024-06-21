export default class AppProfile extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // Check if you is true and convert to boolean
    this._you = this.getAttribute('you') === 'true';

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  static get observedAttributes() {
    return ['url', 'name', 'username', 'you', 'picture', 'verified', 'followers', 'following', 'user-follow', 'bio', 'tab', 'stories-url', 'replies-url', 'followers-url', 'following-url', 'search-url', 'auth-url'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
    // if (oldValue !== newValue) {
    //   // log the name of the attribute that changed
    //   console.log(name);
    // }

    return;
  }

  connectedCallback() {
    // Scroll to the top of the page
    window.scrollTo(0, 0);

    // Watch for media query changes
    const mql = window.matchMedia('(max-width: 660px)');

    // Watch for media query changes
    this.watchMediaQuery(mql);
  }

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {
      // Re-render the component
      this.render();
    });
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

  getDate = isoDateStr => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const authorContent = this.getAuthor();

    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getTop()}
        ${authorContent}
        ${this.getSection()}
      `;
    }
    else {
      return /* html */`
        <section class="main">
          ${this.getTop()}
          <div class="body">
            ${authorContent}
            ${this.getSection()}
          </div>
        </section>

        <section class="side">
          ${this.getHighlights()}
          <people-container url="/topics/popular"></people-container>
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Profile" type="profile"
        user-url="${this.getAttribute('url')}" auth-url="${this.getAttribute('auth-url')}"
        url="${this.getAttribute('url')}" search-url="${this.getAttribute('search-url')}">
      </header-wrapper>
    `
  }

  getAuthor = () => {
    // get url
    const url = this.getAttribute('url');

    // trim white spaces and convert to lowercase
    let formattedUrl = url.toLowerCase();
    return /* html */`
      <profile-wrapper name="${this.getAttribute('name')}" username="${this.getAttribute('username')}" you="${this._you}"
        url="${formattedUrl}" picture="${this.getAttribute('picture')}" verified="${this.getAttribute('verified')}"
        followers="${this.getAttribute('followers')}" following="${this.getAttribute('following')}" user-follow="${this.getAttribute('user-follow')}"
        bio="${this.getAttribute('bio')}">
      </profile-wrapper>
    `
  }

  getSection = () => {
    return /* html */`
      <profile-section url="${this.getAttribute('url')}" active="${this.getAttribute('tab')}" section-title="Profile" username="${this.getAttribute('username')}"
        stories-url="${this.getAttribute('stories-url')}" replies-url="${this.getAttribute('replies-url')}"
        followers-url="${this.getAttribute('followers-url')}"
        following-url="${this.getAttribute('following-url')}">
      </profile-section>
    `

  }

  getHighlights = () => {
    // get url
    const url = this.getAttribute('url');
  
    // trim white spaces and convert to lowercase
    let formattedUrl = url.toLowerCase();

    return /* html */`
      <highlights-container url="${formattedUrl}/highlights" 
        followers="${this.getAttribute('followers')}" following="${this.getAttribute('following')}" 
        stories="6376" replies="19863"
        topics="236" views="726398" date-joined="2022-01-03T13:00:00+03:00">
      </highlights-container>
    `
  }

  getInfo = () => {
    return /*html*/`
      <info-container docs="/about/docs" new="/about/new"
       feedback="/about/feedback" request="/about/request" code="/about/code" donate="/about/donate" contact="/about/contact" company="https://github.com/aduki-hub">
      </info-container>
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
          margin: 0;
          display: flex;
          width: 100%;
          justify-content: space-between;
          gap: 30px;
          min-height: 100vh;
        }

        section.main {
          /* border: 1px solid #6b7280; */
          display: flex;
          flex-flow: column;
          align-items: start;
          gap: 0;
          width: 63%;
        }

        .body {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
        }

        section.side {
          padding: 25px 0;
          width: 33%;
          display: flex;
          flex-flow: column;
          gap: 20px;
          position: sticky;
          top: 0;
          height: 100vh;
          max-height: 100vh;
          overflow-y: scroll;
          scrollbar-width: none;
        }

        section.side::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        @media screen and (max-width:900px) {
          section.main {
            width: 58%;
          }

          section.side {
            width: 40%;
          }
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            justify-content: start;
            gap: 0;
					}

          .top {
            display: flex;
            width: 100%;
            flex-flow: row;
            align-items: center;
            gap: 8px;
          }
          
          .tab-control {
            border-bottom: var(--border-mobile);
            margin: 5px 0 5px 0;
            position: sticky;
            top: 50px;
          }

          .actions > .action {
            cursor: default !important;
            display: flex;
            width: calc(50% - 15px);
            padding: 6px 25px;
          }

          .tab-control > ul.tab > li.tab-item,
					.action,
					a {
						cursor: default !important;
          }

          .section.main {
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          section.side {
            padding: 0;
            display: none;
            width: 0%;
          }
				}
	    </style>
    `;
  }
}