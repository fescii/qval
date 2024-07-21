export default class ActivityFeed extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this._block = false;
    this._empty = false;
    this._page = this.parseToNumber(this.getAttribute('page'));
    this._url = this.getAttribute('url');

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const contentContainer = this.shadowObj.querySelector('.activities');

    this.fetchActivities(contentContainer);

    // watch event 
    setTimeout(() => {
      this.scrollEvent(contentContainer);
    }, 3000);
  }

  fetching = (url, activitiesContainer) => {
    const outerThis = this;
    this.fetchWithTimeout(url, { method: "GET" }).then((response) => {
      response.json().then((data) => {
        if (data.success) {
          if (data.activities.length === 0 && outerThis._page === 1) {
            outerThis._empty = true;
            outerThis._block = true;
            outerThis.populateActivities(outerThis.getEmptyMsg(), activitiesContainer);
            
          } else if (data.activities.length < 10) {
            outerThis._empty = true;
            outerThis._block = true;
            const content = outerThis.mapData(data.activities);
            outerThis.populateActivities(content, activitiesContainer);
            outerThis.populateActivities(outerThis.getLastMessage(), activitiesContainer)
          }
          else {
            outerThis._empty = false;
            outerThis._block = false;
            const content = outerThis.mapData(data.activities);
            outerThis.populateActivities(content, activitiesContainer);
          }
        }
        else {
          outerThis._empty = true;
          outerThis._block = true;
          outerThis.populateActivities(outerThis.getWrongMessage(), activitiesContainer);
        }
      })
        .catch((error) => {
          // console.log(error)
          outerThis._empty = true;
          outerThis._block = true;
          outerThis.populateActivities(outerThis.getWrongMessage(), activitiesContainer);
        });
    });
  }

  fetchActivities = activitiesContainer => {
    const outerThis = this;
    const url = `${this._url}?page=${this._page}`;

    if (!this._block && !this._empty) {
      outerThis._empty = true;
      outerThis._block = true;
      setTimeout(() => {
        // fetch the activities
        outerThis.fetching(url, activitiesContainer)
      }, 2000);
    }
  }

  populateActivities = (content, activitiesContainer) => {
    // get the loader and remove it
    const loader = activitiesContainer.querySelector('.loader-container');
    if (loader) {
      loader.remove();
    }

    // insert the content
    activitiesContainer.insertAdjacentHTML('beforeend', content);
  }

  scrollEvent = activitiesContainer => {
    const outerThis = this;
    window.addEventListener('scroll', function () {
      let margin = document.body.clientHeight - window.innerHeight - 150;
      if (window.scrollY > margin && !outerThis._empty && !outerThis._block) {
        outerThis._page += 1;
        outerThis.populateActivities(outerThis.getLoader(), activitiesContainer);
        outerThis.fetchActivities(activitiesContainer);
      }
    });

    // Launch scroll event
    const scrollEvent = new Event('scroll');
    window.dispatchEvent(scrollEvent);
  }

  mapData = activities => {
    return activities.map(activity => {
      return /*html*/`
        <activity-item id="${activity.id}" hash="${activity.target}" time="${activity.createdAt}" kind="${activity.kind}"
          to="${activity.to}" verb="${activity.verb}" action="${activity.action}" author="${activity.author}">
          ${activity.content}
        </activity-item>
      `
    }).join('');
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

  getBody = () => {
    // language=HTML
    return `
			<div class="activities">
				${this.getLoader()}
      </div>
    `;
  }

  getEmptyMsg = () => {
    // get the next attribute
    return `
      <div class="empty">
        <h2 class="title">You no activities yet!</h2>
        <p class="next">
         Your activities will appear here once you performing various actions on the platform.
        </p>
      </div>
    `
  }

  getLastMessage = () => {
    // get the next attribute
    return `
      <div class="last">
        <h2 class="title">That's all for now!</h2>
        <p class="next">
         That's it, you have reached the end of your activities.
        </p>
      </div>
    `
  }

  getWrongMessage = () => {
    // get the next attribute
    return `
      <div class="last">
        <h2 class="title">Something went wrong!</h2>
        <p class="next">
          Something did not work as expected, I call it shenanigans!
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
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 5px 0 10px;
          width: 100%;
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

        .activities {
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 0;
          width: 100%;
        }

        @media screen and (max-width:660px) {
          .last {
            width: 100%;
            padding: 10px 0 25px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }

          .empty {
            width: 100%;
            padding: 10px 0 30px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
          }
        }

      </style>
    `;
  }
}