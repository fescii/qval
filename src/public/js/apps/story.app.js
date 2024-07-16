export default class AppStory extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this.setTitle(this.getAttribute('story-title'));

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.boundHandleWsMessage = this.handleWsMessage.bind(this);
    this.checkAndAddHandler = this.checkAndAddHandler.bind(this);

    this.topics = this.getTopics();

    this._content = this.innerHTML

    this.render();
  }

  setTitle = title => {
    // update title of the document
    document.title = `Story | ${title}`;
  }

  getTopics = () => {
    // get the topics
    let topics = this.getAttribute('topics');

    // 
    return topics ? topics.split(',') : ['story'];
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Change style to flex
    this.style.display='flex';

    // connect to the WebSocket
    this.checkAndAddHandler();

    // Get mql object
    const mql = window.matchMedia('(max-width: 660px)');

    this.watchMediaQuery(mql);
  }

  checkAndAddHandler() {
    if (window.wss) {
      window.wss.addMessageHandler(this.boundHandleWsMessage);
      // console.log('WebSocket handler added successfully');
    } else {
      // console.log('WebSocket manager not available, retrying...');
      setTimeout(this.checkAndAddHandler, 500); // Retry after 500ms
    }
  }

  disconnectedCallback() {
    if (window.wss) {
      window.wss.removeMessageHandler(this.boundHandleWsMessage);
    }
  }

  handleWsMessage = message => {
    // Handle the message in this component
    // console.log('Message received in component:', message);
    const data = message.data;

    const user = data?.user;
    const userHash = window.hash;

    const hash = this.getAttribute('hash').toUpperCase();
    const authorHash = this.getAttribute('author-hash').toUpperCase();

    const author = this.shadowObj.querySelector('author-wrapper');
    // get post-section element
    let wrapper = this.shadowObj.querySelector('story-section');

    const target = data.hashes.target;

    // handle connect action
    if (data.action === 'connect' && data.kind === 'user') {
      this.handleConnectAction(data, author, wrapper, userHash, authorHash);
    }
    else if(hash === target) {
      if (data.action === 'reply') {
        const replies = this.parseToNumber(this.getAttribute('replies')) + data.value;
        this.updateReplies(wrapper, replies);
      }
      else if(data.action === 'view') {
        const views = this.parseToNumber(this.getAttribute('views')) + data.value;
        this.updateViews(wrapper, views);
      }
      else if (data.action === 'like') {
        if(user !== null && user === userHash) {
          return;
        }
        // get likes parsed to number
        const likes = (this.parseToNumber(this.getAttribute('likes')) + data.value);
        // update likes
        this.updateLikes(wrapper, likes);
      }
    }
  }

  sendWsMessage(data) {
    window.wss.sendMessage(data);
  }

  handleConnectAction = (data, author, wrapper, userHash, authorHash) => {
    const to = data.hashes.to;
    if(to === authorHash) {
      const followers = this.parseToNumber(this.getAttribute('author-followers')) + data.value;
      this.setAttribute('author-followers', followers)
      this.updateAuthorFollowers(wrapper, followers);
      this.updateFollowers(author, followers);

      if (data.hashes.from === userHash) {
        const value = data.value === 1 ? 'true' : 'false';
        // update user-follow/auth-follow attribute
        this.setAttribute('author-follow', value);
        if(author) {
          author.setAttribute('user-follow', value);
        }
        wrapper.setAttribute('author-follow', value);
      }

      wrapper.setAttribute('reload', 'true');

      if(author) {
        author.setAttribute('reload', 'true');
      }
    }
  }

  updateLikes = (element, value) => {
    // update likes in the element and this element
    this.setAttribute('likes', value);
    element.setAttribute('likes', value);
    element.setAttribute('reload', 'true');
  }

  updateViews = (element, value) => {
    // update views in the element and this element
    this.setAttribute('views', value);
    element.setAttribute('views', value);
    element.setAttribute('reload', 'true');
  }

  updateReplies = (element, value) => {
    // update replies in the element and this element
    this.setAttribute('replies', value);
    element.setAttribute('replies', value);
    element.setAttribute('reload', 'true');
  }

  updateFollowers = (element, value) => {
    if (!element) {
      return;
    }
    element.setAttribute('followers', value);
  }

  updateAuthorFollowers = (element, value) => {
    element.setAttribute('author-followers', value);
    element.setAttribute('reload', 'true');
  }

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {
      // Re-render the component
      this.render();
    });
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
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getTop()}
        <div class="content" id="content-container">
          ${this.getStoryBody()}
          ${this.getSection()}
        </div>
      `;
    }
    else {
      return /* html */`
        <div class="content" id="content-container">
          ${this.getTop()}
          ${this.getStoryBody()}
          ${this.getSection()}
        </div>

        <section class="side">
          ${this.getAuthor()}
          <topics-container url="/api/v1/q/trending/topics"></topics-container>
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Story" type="story"
        user-url="${this.getAttribute('user-url')}" auth-url="${this.getAttribute('auth-url')}"
        url="${this.getAttribute('story-url')}" search-url="${this.getAttribute('search-url')}">
      </header-wrapper>
    `
  }

  getStoryBody = () => {
    let str = this.topics[0];
    let formatted = str.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());
    const contact = this.getAttribute("author-contact");
    // Show HTML Here
    return /* html */ `
      <story-section topic="${formatted}" hash="${this.getAttribute('hash')}" url="${this.getAttribute('url')}"
        story-title="${this.getAttribute('story-title')}" replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
        views="${this.getAttribute('views')}" time="${this.getAttribute('time')}" author-you="${this.getAttribute('author-you')}"
        author-hash="${this.getAttribute('author-hash')}" author-img="${this.getAttribute('author-img')}" author-name="${this.getAttribute('author-name')}"
        author-stories="${this.getAttribute('author-stories')}" author-replies="${this.getAttribute('author-replies')}"
        author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
        author-verified="${this.getAttribute('author-verified')}" author-url="${this.getAttribute('author-url')}" author-contact='${contact}'
        author-bio="${this.getAttribute('author-bio')}">
        ${this.innerHTML}
      </story-section>
    `
  }

  getAuthor = () => {
    const contact = this.getAttribute("author-contact");
    // console.log(contact)
    return /* html */`
			<author-wrapper hash="${this.getAttribute('author-hash')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
        followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
        stories="${this.getAttribute('author-stories')}" replies="${this.getAttribute('author-replies')}" contact='${contact}'
        verified="${this.getAttribute('author-verified')}" url="${this.getAttribute('author-url')}" you="${this.getAttribute('author-you')}"
        bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getSection = () => {
    return /* html */`
      <post-section url="${this.getAttribute('url')}" active="${this.getAttribute('tab')}" section-title="Story" 
        author-hash="${this.getAttribute('author-hash')}" hash="${this.getAttribute('hash')}"
        replies="${this.getAttribute('replies')}" likes="${this.getAttribute('likes')}" kind="story"
        replies-url="${this.getAttribute('replies-url')}" likes-url="${this.getAttribute('likes-url')}">
      </post-section>
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
          display: flex;
          width: 100%;
          gap: 30px;
          min-height: 100vh;
          justify-content: space-between;
        }

        div.content {
          padding: 0;
          width: 63%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        /* Responses */
        div.content section.responses {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        section.side {
          padding: 25px 0;
          margin: 0;
          background-color: transparent;
          width: 33%;
          height: max-content;
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
          div.content {
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
            min-height: max-content;
            height: max-content;
            flex-flow: column;
            gap: 0;
					}

          div.content .head {
            margin: 10px 0 0 0;
          }

          div.content {
            /* border: 1px solid #000000; */
            padding: 0;
            width: 100%;
            display: flex;
            flex-flow: column;
            gap: 0;
          }

					.action,
					a {
						cursor: default !important;
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
