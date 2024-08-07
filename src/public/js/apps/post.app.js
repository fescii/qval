export default class AppPost extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this.setTitle();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.boundHandleWsMessage = this.handleWsMessage.bind(this);
    this.checkAndAddHandler = this.checkAndAddHandler.bind(this);

    this.render();
  }

  setTitle = () => {
    // update title of the document
    document.title = `Post | by ${this.getAttribute('author-name')}`;
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // Change style to flex
    this.style.display='flex';

    // request user to enable notifications
    this.checkNotificationPermission();

    // connect to the WebSocket
    this.checkAndAddHandler();

    // mql query at: 660px
    const mql = window.matchMedia('(max-width: 660px)');

    this.watchMediaQuery(mql);

    // scroll the window to the top and set height to 100vh
    window.scrollTo(0, 0);
  }

  checkNotificationPermission = () => {
    const body = document.querySelector('body');
    if (window.notify && !window.notify.permission) {
      // request user to enable notifications
      const html =/*html*/`<notify-popup url="/notifications"></notify-popup>`;

      body.insertAdjacentHTML('beforeend', html);
    }
  }

  checkAndAddHandler() {
    this.enableScroll();
    if (window.wss) {
      window.wss.addMessageHandler(this.boundHandleWsMessage);
      // console.log('WebSocket handler added successfully');
    } else {
      // console.log('WebSocket manager not available, retrying...');
      setTimeout(this.checkAndAddHandler, 500); // Retry after 500ms
    }
  }

  disconnectedCallback() {
    this.enableScroll();
    if (window.wss) {
      window.wss.removeMessageHandler(this.boundHandleWsMessage);
    }
  }

  handleWsMessage = message => {
    // Handle the message in this component
    // console.log('Message received in component:', message);
    const data = message.data;

    if (message.type !== 'action') return;

    const user = data?.user;
    const userHash = window.hash;

    const hash = this.getAttribute('hash').toUpperCase();
    const authorHash = this.getAttribute('author-hash').toUpperCase();

    const author = this.shadowObj.querySelector('author-wrapper');
    // get post-section element
    let wrapper = this.shadowObj.querySelector('post-wrapper');

    // if post-section is not found, select poll-wrapper
    if (!wrapper) {
      wrapper = this.shadowObj.querySelector('poll-wrapper');
    }

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
      else if (data.action === 'vote') {
        if(user !== null && user === userHash) {
          return;
        }
        // update likes
        this.updateVote(wrapper, data.value);
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

  updateVote = (element, value) => {
    if(element) {
      element.setAttribute('vote', value);
      element.setAttribute('reload', 'true');
    }
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
    element.setAttribute('reload', 'true');
  }

  updateAuthorFollowers = (element, value) => {
    element.setAttribute('author-followers', value);
    element.setAttribute('reload', 'true');
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

  // watch for mql changes
  watchMediaQuery = mql => {
    mql.addEventListener('change', () => {

      this.render();
    });
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

  getTemplate = () => {
    // Show HTML Here
    return `
      <div class="container">
        ${this.getBody()}
      </div>
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    // Get story type
    const story = this.getAttribute('story');

    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getTop()}
        ${this.getReply(this.getAttribute('story'))}
        ${this.getPost(story)}
        ${this.getSection()}
      `;
    }
    else {
      return /* html */`
        <div class="feeds">
          ${this.getTop()}
          ${this.getReply(this.getAttribute('story'))}
          ${this.getPost(story)}
          ${this.getSection()}
        </div>
        <div class="side">
          ${this.getAuthor()}
          <people-container url="/api/v1/users/recommended" type="profile"></people-container>
          ${this.getInfo()}
        </div>
      `;
    }
  }

  getPost = story => {
    // get url from the story
    let url = this.getAttribute('url');
    // trim and convert to lowercase
    url = url.trim().toLowerCase();
  
    switch (story) {
      case 'poll':
        return /*html */`
          <poll-wrapper hash="${this.getAttribute('hash')}" url="${url}" kind="${this.getAttribute('story')}"
            replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
            views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
            options='${this.getAttribute("options")}' voted="${this.getAttribute('voted')}" selected="${this.getAttribute('selected')}"
            end-time="${this.getAttribute('end-time')}" votes="${this.getAttribute('votes')}" author-you="${this.getAttribute('author-you')}"
            author-stories="${this.getAttribute('author-stories')}" author-replies="${this.getAttribute('author-replies')}"
            author-hash="${this.getAttribute('author-hash')}" author-img="${this.getAttribute('author-img')}" author-name="${this.getAttribute('author-name')}"
            author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
            author-verified="${this.getAttribute('author-verified')}" author-url="${this.getAttribute('author-url')}" author-contact='${this.getAttribute("author-contact")}'
            author-bio="${this.getAttribute('author-bio')}">
            ${this.innerHTML}
          </poll-wrapper>
        `
      default:
        return /* html */`
          <post-wrapper hash="${this.getAttribute('hash')}" url="${url}" kind="${this.getAttribute('story')}"
            replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
            views="${this.getAttribute('views')}" time="${this.getAttribute('time')}" author-you="${this.getAttribute('author-you')}"
            author-stories="${this.getAttribute('author-stories')}" author-replies="${this.getAttribute('author-replies')}"
            author-hash="${this.getAttribute('author-hash')}" author-img="${this.getAttribute('author-img')}" author-name="${this.getAttribute('author-name')}"
            author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
            author-verified="${this.getAttribute('author-verified')}" author-url="${this.getAttribute('author-url')}" author-contact='${this.getAttribute("author-contact")}'
            author-bio="${this.getAttribute('author-bio')}">
            ${this.innerHTML}
          </post-wrapper>
        `
    }
  }

  getSection = () => {
    return /* html */`
      <post-section kind="${this.getAttribute('story')}" url="${this.getAttribute('url')}" active="${this.getAttribute('tab')}" section-title="Post" 
        author-hash="${this.getAttribute('author-hash')}" hash="${this.getAttribute('hash')}" 
        replies="${this.getAttribute('replies')}" likes="${this.getAttribute('likes')}"
        replies-url="${this.getAttribute('replies-url')}" likes-url="${this.getAttribute('likes-url')}">
      </post-section>
    `
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Post" type="post"
        user-url="${this.getAttribute('user-url')}" auth-url="${this.getAttribute('auth-url')}"
        url="${this.getAttribute('story-url')}" search-url="${this.getAttribute('search-url')}">
      </header-wrapper>
    `
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper you="${this.getAttribute('author-you')}" hash="${this.getAttribute('author-hash')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
        stories="${this.getAttribute('author-stories')}" replies="${this.getAttribute('author-replies')}"
        followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}" contact='${this.getAttribute("author-contact")}'
        verified="${this.getAttribute('author-verified')}" url="/u/${this.getAttribute('author-hash').toLowerCase()}"
        bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getInfo = () => {
    return /*html*/`
      <info-container docs="/about/docs" new="/about/new"
       feedback="/about/feedback" request="/about/request" code="/about/code" donate="/about/donate" contact="/about/contact" company="https://github.com/aduki-hub">
      </info-container>
    `
  }

  getReply = story => {
    if (story === 'reply') {
      const parent = this.getAttribute('parent');
      let url = parent.startsWith('P') ? `/api/v1/p/${parent.toLowerCase()}/preview` : `/api/v1/r/${parent.toLowerCase()}/preview`;
      return /*html*/`
        <preview-post url="${url}" hash="${parent}" preview="full"></preview-post>
      `
    } else return '';
  }

  getStyles() {
    return /*css*/`
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
          flex-flow: column;
          gap: 0;
        }

        .container {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          min-height: 100dvh;
        }

        .feeds {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 63%;
        }

        div.side {
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

        div.side::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        @media screen and (max-width:900px) {
          .feeds {
            width: 58%;
          }

          div.side {
            width: 40%;
          }
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
					}

          .container {
            display: flex;
            flex-flow: column;
            justify-content: flex-start;
            gap: 0;
            min-height: max-content;
          }

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}
					a {
						cursor: default !important;
          }

          .feeds {
            display: flex;
            flex-flow: column;
            gap: 0;
            width: 100%;
          }

          div.side {
            padding: 0;
            width: 100%;
          }
				}
	    </style>
    `;
  }
}