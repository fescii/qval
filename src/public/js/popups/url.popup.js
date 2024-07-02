export default class UrlPopup extends HTMLElement {
  constructor() {

    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({mode: 'open'});

    this.render();

  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
    // this.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');
    this.disableScroll();

    // Select the close button & overlay
    const overlay = this.shadowObj.querySelector('.overlay');
    const btns = this.shadowObj.querySelectorAll('.cancel-btn');

    // Close the modal
    if (overlay && btns) {
      this.closePopup(overlay, btns);
    }
  }

  disconnectedCallback() {
    // console.log('We are inside disconnectedCallback');\
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
    return `
      <div class="welcome">
        <h2>You are leaving the application!</h2>
				<p>
          You are about to leave the application and visit an external website. We are not responsible for the content of the external website.
          By clicking continue, you will be redirected to below address <br> <span class="url">${this.getAttribute('url')}</span>
        </p>
        <div class="actions">
          <span class="cancel-btn action">Cancel</span>
          <a noopenner="true" blank="true" target="_blank" href="${this.getAttribute('url')}" class="action">Continue</a>
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
          right: 18px;
          top: 18px;
        }

        #content span.control svg {
          width: 25px;
          height: 25px;
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
          margin: 5px 0 20px;
          font-family: var(--font-text), sans-serif;
          color: var(--text-color);
          font-size: 1.9rem;
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

        .welcome p span.url {
          display: flex;
          padding: 0;
          margin: 10px 0 0 0;
          font-size: 0.95rem;
          font-weight: 400;
          border-radius: 5px;
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-weight: 500;
          align-items: center;
          justify-content: center;
        }

        .welcome > .actions {
          grid-column: 1/3;
          margin: 20px 0 5px;
          width: 80%;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .welcome > .actions .action {
          background: var(--accent-linear);
          text-decoration: none;
          padding: 10px 20px;
          cursor: pointer;
          margin: 20px 0;
          width: 150px;
          justify-self: center;
          text-align: center;
          color: var(--white-color);
          border: none;
          font-size: 1.15rem;
          font-weight: 500;
          border-radius: 15px;
        }

        .welcome > .actions .action.cancel-btn {
          background: var(--poll-background);
          color: var(--text-color);
        }

        .welcome > .info {
          grid-column: 1/3;
          text-align: center;
          color: var(--text-color);
          line-height: 1.4;
        }
        
        .welcome > .info svg {
          margin: 0 0 -3px 0;
          color: var(--accent-color);
          width: 18px;
          height: 18px;
        }

        .welcome > .info .aduki {
          color: transparent;
          background: var(--stage-no-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-weight: 400;
        }

        .welcome>.info a {
          color: var(--gray-color);
          /* font-style: italic; */
          font-size: 1em;
        }

        .welcome>.info a:hover {
          color: transparent;
          text-decoration: underline;
          background: var(--stage-active-linear);
          background-clip: text;
          -webkit-background-clip: text;

        }

        .welcome > p.forgot {
          grid-column: 1/3;
          text-align: center;
          margin: 0 0 10px 0;
          color: var(--text-color);
          line-height: 1.4;
        }

        .welcome > p.forgot a {
          color: var(--gray-color);
          text-decoration: none;
          font-size: 1em;
        }

        .welcome > p.forgot a:hover {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
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
            backdrop-filter: blur(3px);
            -webkit-backdrop-filter: blur(3px);
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
            padding: 0 15px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }

          .welcome > h2 {
            width: 100%;
            margin: 0 0 10px;
            text-align: center;
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
        }
      </style>
    `;
  }
}