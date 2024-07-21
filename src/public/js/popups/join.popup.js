export default class JoinPopup extends HTMLElement {
  constructor() {

    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({mode: 'open'});

    this.render();

  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    
    this.disableScroll();

    // Const body element
    const body = document.querySelector('body');

    // Handle action click
    this.handleActionClick(body);

    // Select the close button & overlay
    const overlay = this.shadowObj.querySelector('.overlay');
    const btn = this.shadowObj.querySelector('#close-btn');

    // Close the modal
    if (overlay && btn) {
      this.closePopup(overlay, btn);
    }
  }

  // Open user profile
  handleActionClick = (body) => {
    const outerThis = this;
    // get a.meta.link
    const actions = this.shadowObj.querySelectorAll('.actions > a.action');

    if(body && actions) { 
      actions.forEach(content => {
        content.addEventListener('click', event => {
          event.preventDefault();

          // get join
          const join = outerThis.getJoin(content.dataset.name);

          // get url
          let url = content.dataset.name === 'login' ? outerThis.getAttribute('login') : outerThis.getAttribute('register');

          if (content.dataset.name === 'forgot') {
            url = '/join/recover';   
          }
          
          // replace and push states
          outerThis.replaceAndPushStates(url, body, join);

          body.innerHTML = join;
        })
      })
    }
  }

  replaceAndPushStates = (url, body, join) => {
     // get the first custom element in the body
     const firstElement = body.firstElementChild;

     // convert the custom element to a string
     const elementString = firstElement.outerHTML;

    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: elementString },
      url, pageUrl
    );

    // Updating History State
    window.history.pushState(
      { page: 'page', content: join},
      url, url
    );
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
  closePopup = (overlay, btn) => {
    overlay.addEventListener('click', e => {
      e.preventDefault();
      this.remove();
    });

    btn.addEventListener('click', e => {
      e.preventDefault();
      this.remove();
    });
  }

  getTemplate() {
    // Show HTML Here
    return `
      <div class="overlay"></div>
      <section id="content" class="content">
        <span class="control" id="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
        </span>
        ${this.getWelcome()}
      </section>
    ${this.getStyles()}`
  }

  getWelcome() {
    return `
      <div class="welcome">
        <h2>Unauthorized.</h2>
				<p>
          Please note that you need to be logged in order to perform certain actions on this platform.
          Although you can still view content, you will not be able to interact with it.
        </p>
        <div class="actions">
          <a data-name="login" href="${this.getAttribute('login')}?next=${this.getAttribute('next')}" class="login action">Login</a>
          <a data-name="forgot" href="/join/recover?next=${this.getAttribute('next')}" class="recover action">Recover</a>
          <a data-name="register" href="${this.getAttribute('register')}?next=${this.getAttribute('next')}" class="register action">Register</a>
        </div>
			</div>
    `
  }

  getJoin = action => {
   return /* html */`
    <app-logon name="${action}" next="${this.getAttribute('next')}" api-login="/api/v1/a/login" 
      api-register="/api/v1/a/register" api-check-email="/api/v1/a/check-email" 
      api-forgot-password="/api/v1/a/forgot-password" api-verify-token="/api/v1/a/verify-token" 
      api-reset-password="/api/v1/a/reset-password" join-url="/join" login="/join/login" 
      register="/join/register" forgot="/join/recover">
    </app-logon>
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
          right: 15px;
          top: 15px;
        }

        #content span.control svg {
          width: 20px;
          height: 20px;
          color: var(--text-color);
        }

        #content span.control svg:hover{
          color: var(--error-color);
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

        .welcome  p {
          margin: 0;
          text-align: center;
          font-family: var(--font-read), sans-serif;
          color: var(--text-color);
          line-height: 1.3;
          font-size: 1rem;
        }

        .welcome > .actions {
          margin: 20px 0 5px;
          width: 80%;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .welcome > .actions a {
          background: var(--stage-no-linear);
          text-decoration: none;
          padding: 5px 20px 6px;
          cursor: pointer;
          margin: 20px 0;
          width: 150px;
          justify-self: center;
          text-align: center;
          color: var(--white-color);
          border: none;
          font-size: 1.15rem;
          font-weight: 500;
          border-radius: 12px;
        }

        .welcome > .actions a.register {
          background: var(--stage-active-linear);
        }

        .welcome > .actions a.recover {
          background: var(--gray-background);
          color: var(--text-color);
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
            padding: 20px 0 0 0;
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
            top: 12px;
            right: 12px;
          }

          .welcome {
            width: 100%;
            padding: 0 15px;
          }

          .welcome > h2 {
            margin: 0 0 10px;
          }

          .welcome > .actions {
            width: 100%;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 18px;
            margin: 10px 0 20px;
          }

          .welcome > .actions .action {
            background: var(--stage-no-linear);
            text-decoration: none;
            padding: 6px 15px 7px;
            font-size: 1rem;
            cursor: default;
            margin: 5px 0;
            width: max-content;
            cursor: default !important;
            border-radius: 12px;
          }
        }
      </style>
    `;
  }
}