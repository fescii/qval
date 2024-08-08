export default class TopicInfo extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this._url = this.getAttribute('api');

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // select form
    const form = this.shadowObj.querySelector('form');

    // submit form
    this.submitForm(form);

    // validate form
    this.validateForm(form);
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

  submitForm = async form => {
    const outerThis = this;
    // add submit event listener
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const serverStatus = form.querySelector('.server-status');

      // if server status is already showing, remove it
      if (serverStatus) {
        serverStatus.remove();
      }

      const actions = form.querySelector('.actions');

      // get and validate form data
      const formData = new FormData(form);

      // get form data
      const data = {
        slug: formData.get('slug'),
        name: formData.get('title'),
        summary: formData.get('summary')
      };

      // check if form data is valid
      if (!data.slug) {
        
        const errorMsg = 'slug must be defined!';

        // show error message
        actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, errorMsg));
        setTimeout(() => {
          const serverStatus = form.querySelector('.server-status');
          if (serverStatus) {
            serverStatus.remove();
          }
        }, 5000);

        return;
      }

      // validate slug
      if (data.slug.length < 3) {
        // show error message
        actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, 'slug must be at least 3 characters'));

        setTimeout(() => {
          const serverStatus = form.querySelector('.server-status');
          if (serverStatus) {
            serverStatus.remove();
          }
        }, 5000);

        return;
      }

      // validate slug: only letters, numbers, and hyphens and lower case
      if(!/^[a-z0-9-]*$/.test(data.slug)) {
        // show error message
        actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, 'slug can only contain letters, numbers, and hyphens and lowercase'));

        setTimeout(() => {
          const serverStatus = form.querySelector('.server-status');
          if (serverStatus) {
            serverStatus.remove();
          }
        }, 5000);

        return;
      }

      // validate title and not less than 2 characters
      if (!data.name || data.name.length < 2) {
        // show error message
        actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, 'title must be at least 2 characters'));

        setTimeout(() => {
          const serverStatus = form.querySelector('.server-status');
          if (serverStatus) {
            serverStatus.remove();
          }
        }, 5000);

        return;
      }

      // validate summary and not less than 100 characters
      if (!data.summary || data.summary.length < 100) {
        // show error message
        actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, 'summary must be at least 100 characters'));

        setTimeout(() => {
          const serverStatus = form.querySelector('.server-status');
          if (serverStatus) {
            serverStatus.remove();
          }
        }, 5000);

        return;
      }

      const button = form.querySelector('.action.next');

      // show loader
      const content = form.parentElement;
      content.insertAdjacentHTML('beforeend', outerThis.getLoader());

      // send data to server
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };

      try {
        const response = await outerThis.fetchWithTimeout(outerThis._url, options);
        const result = await response.json();

        // check if request was successful
        if (result.success) {
          // show success message
          actions.insertAdjacentHTML('beforebegin', 
            outerThis.getServerSuccessMsg(true, result.message)
          );

          outerThis._topic = result.topic;

          // reset button
          button.innerHTML = '<span class="text">Update</span>';
          // remove the loader
          const loader = content.querySelector('#loader-container');
          if (loader) {
            loader.remove();
          }
        } else {
          // show error message
          actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, result.message));

          // reset button
          button.innerHTML = '<span class="text">Update</span>';
          // remove the loader
          const loader = content.querySelector('#loader-container');
          if (loader) {
            loader.remove();
          }
        }
      }
      catch (error) {
        // show error message
        actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, 'An error occurred, please try again'));

        // reset button
        button.innerHTML = '<span class="text">Update</span>';

        // remove the loader
        const loader = content.querySelector('#loader-container');
        if (loader) {
          loader.remove();
        }
      }

      // remove success message
      setTimeout(() => {
        const serverStatus = form.querySelector('.server-status');
        if (serverStatus) {
          serverStatus.remove();
        }
      }, 5000);
    });
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
  }

  getServerSuccessMsg = (success, text) => {
    if (!success) {
      return `
        <p class="server-status">${text}</p>
      `
    }
    return `
      <p class="server-status success">${text}</p>
    `
  }

  getTemplate() {
    // Show HTML Here
    return /*html*/`
      <section id="content" class="content">
        ${this.getBody()}
      </section>
    ${this.getStyles()}`
  }

  getBody = () => {
    const name = this.getAttribute('name');
    const slug = this.getAttribute('slug');
    const summary = this.getAttribute('summary');
    return /* html */`
      ${this.getHeader()}
      <form class="fields slug" id="topic-form">
        <div class="field new">
          <div class="input-group title">
            <input type="text" name="title" id="title" placeholder="Enter topic title" required value="${name}"/>
            <span class="status">title is required</span>
          </div>
          <div class="input-group slug">
            <input type="text" name="slug" id="slug" placeholder="Enter topic slug" required value="${slug}"/>
            <span class="status">slug is required</span>
          </div>
          <div class="input-group your-summary">
            <textarea name="summary" id="summary" cols="30" rows="10" required placeholder="Enter topic summary">${summary}</textarea>
            <span class="status">summary is required</span>
          </div>
        </div>
        <div class="actions">
          <button type="submit" class="action next">
            <span class="text">Edit</span>
          </button>
        </div>
      </form>
    `;
  }

  getHeader = () => {
    return /* html */`
      <div class="top">
        <p class="desc">
          Edit the topic details below. Make sure to provide a unique slug for the topic. The slug is used to identify the topic in the URL and summary should be at least 100 characters.
        </p>
      </div>
    `;
  }

  validateForm = form => {
    const input = form.querySelector('input[name="slug"]');
    const title = form.querySelector('input[name="title"]');
    const summary = form.querySelector('textarea[name="summary"]');

    if (input && title && summary) {
      // add an input event listener
      input.addEventListener('input', e => {
        const value = e.target.value;

        if (!value) {
          input.parentElement.classList.remove('success');
          input.parentElement.classList.add('failed');
          input.parentElement.querySelector('span.status').textContent = 'slug is required';
          return;
        }

        if (value.length < 3) {
          input.parentElement.classList.remove('success');
          input.parentElement.classList.add('failed');
          input.parentElement.querySelector('span.status').textContent = 'slug must be at least 3 characters';
          return;
        }

        if(!/^[a-z0-9-]*$/.test(value)) {
          input.parentElement.classList.remove('success');
          input.parentElement.classList.add('failed');
          input.parentElement.querySelector('span.status').textContent = 'slug can only contain letters, numbers, and hyphens and be in lowercase';
          return;
        }

        input.parentElement.classList.remove('failed');
        input.parentElement.classList.add('success');
        input.parentElement.querySelector('span.status').textContent = '';
      });

      // add an input event listener to title
      title.addEventListener('input', e => {
        const value = e.target.value;

        if (!value) {
          title.parentElement.classList.remove('success');
          title.parentElement.classList.add('failed');
          title.parentElement.querySelector('span.status').textContent = 'title is required';
          return;
        }

        // check for length
        if (value.length < 2) {
          title.parentElement.classList.remove('success');
          title.parentElement.classList.add('failed');
          title.parentElement.querySelector('span.status').textContent = 'title must be at least 2 characters';
          return;
        }

        title.parentElement.classList.remove('failed');
        title.parentElement.classList.add('success');
        title.parentElement.querySelector('span.status').textContent = '';
      });

      // add an input event listener to summary
      summary.addEventListener('input', e => {
        const value = e.target.value;

        if (!value) {
          summary.parentElement.classList.remove('success');
          summary.parentElement.classList.add('failed');
          summary.parentElement.querySelector('span.status').textContent = 'summary is required';
          return;
        }

        // check for length
        if (value.length < 100) {
          summary.parentElement.classList.remove('success');
          summary.parentElement.classList.add('failed');
          summary.parentElement.querySelector('span.status').textContent = 'summary must be at least 100 characters';
          return;
        }

        summary.parentElement.classList.remove('failed');
        summary.parentElement.classList.add('success');
        summary.parentElement.querySelector('span.status').textContent = '';
      });
    }
  }

  getLoader() {
    return /*html*/`
      <div id="loader-container">
				<div class="loader"></div>
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
          -webkit-appearance: none;
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
          gap: 10px;
          padding: 0;
          width: 100%;
        }

        p.server-status {
          margin: 0;
          width: 100%;
          text-align: start;
          font-family: var(--font-read), sans-serif;
          color: var(--error-color);
          font-weight: 500;
          line-height: 1.4;
          font-size: 1.18rem;
        }

        p.server-status.success {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        #loader-container {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 5;
          background-color: var(--loader-background);
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
          -webkit-border-radius: inherit;
          -moz-border-radius: inherit;
        }

        #loader-container > .loader {
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

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        .top {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          width: 100%;
        }

        .top > h4.title {
          border-bottom: var(--border-mobile);
          display: flex;
          align-items: center;
          color: var(--title-color);
          font-size: 1.3rem;
          font-weight: 500;
          margin: 0;
          padding: 0 0 6px 0;
        }

        .top > .desc {
          margin: 0;
          padding: 10px 0;
          color: var(--text-color);
          font-size: 1rem;
          font-family: var(--font-main), sans-serif;
        }

        .top > .desc span {
          color: var(--gray-color);
          font-size: 0.9rem;
          display: inline-block;
          padding: 5px 0 0 0;
          font-family: var(--font-read), sans-serif;
        }

        form.fields {
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        form.fields > .field {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 20px;
        }

        form.fields.center > .field {
          align-items: center;
        }

        form.fields .field .input-group {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          color: var(--text-color);
          gap: 5px;
          position: relative;
          transition: border-color 0.3s ease-in-out;
        }

        form.fields .field.summary .input-group {
          width: 100%;
        }

        form.fields .field.summary .input-group.code,
        form.fields .field.summary .input-group.email {
          grid-column: 1/3;
          width: 100%;
        }

        form.fields .field .input-group > svg {
          position: absolute;
          right: 10px;
          top: 38px;
          width: 20px;
          height: 20px;
        }

        form.fields .field .input-group > svg {
          display: none;
        }

        form.fields .field .input-group.success > svg {
          display: inline-block;
        }

        form.fields .field .input-group.failed > svg {
          display: inline-block;
        }

        form.fields .field .input-group.success > svg {
          color: var(--accent-color);
        }

        form.fields .field .input-group.failed > svg {
          color: var(--error-color);
        }

        form.fields label {
          padding: 0 0 5px 0;
          color: var(--text-color);
        }

        form.fields .field.summary label {
          padding: 0 0 0 5px;
        }

        form.fields label {
          color: var(--label-color);
          font-size: 1.1rem;
          font-family: var(--font-main), sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        form.fields .field input {
          border: var(--input-border);
          background: var(--background);
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
          -webkit-border-radius: 12px;
          -moz-border-radius: 12px;
          -ms-border-radius: 12px;
          -o-border-radius: 12px;
        }

        form.fields textarea {
          border: none;
          border: var(--input-border);
          background: var(--background);
          font-size: 1rem;
          padding: 10px 12px;
          margin: 0;
          width: 100%;
          resize: none;
          height: 160px;
          gap: 5px;
          font-weight: 400;
          color: var(--text-color);
          -ms-overflow-style: none;
          scrollbar-width: none;
          border-radius: 12px;
        }

        form.fields textarea::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        form.fields textarea:focus,
        form.fields .field input:focus {
          border: var(--input-border-focus);
        }

        form.fields .field span.wrapper {
          display: flex;
          align-items: center;
          align-items: center;
          gap: 0;
          width: 100%;
        }

        form.fields .field .input-group.success > span.wrapper > input,
        form.fields .field .input-group.success > span.wrapper > input:focus,
        form.fields .field .input-group.success input,
        form.fields .field .input-group.success input:focus {
          border: var(--input-border-focus);
        }

        form.fields .field .input-group.failed > span.wrapper > input,
        form.fields .field .input-group.failed > span.wrapper > input:focus,
        form.fields .field .input-group.failed input,
        form.fields .field .input-group.failed input:focus {
          border: var(--input-border-error);
        }

        form.fields .field .input-group.success span.wrapper > input,
        form.fields .field .input-group.success input {
          color: var(--accent-color);
        }

        form.fields .field .input-group.failed span.wrapper > input,
        form.fields .field .input-group.failed input {
          color: var(--error-color);
        }

        form.fields label.focused {
          top: -10px;
          font-size: 0.9rem;
          background-color: var(--label-focus-background);
          padding: 0 5px;
        }

        form.fields .field span.status {
          color: var(--error-color);
          font-size: 0.95rem;
          display: none;
          padding: 0 0 0 5px;
        }

        form.fields .field .input-group.failed span.status {
          color: var(--error-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          color: var(--accent-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        form.fields .field .input-group.success span.status {
          display: none;
        }

        form.fields .actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin: 0 0 0 2px;
        }

        form.fields .actions > .action {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          border: none;
          border-radius: 10px;
          font-family: var(--font-main), sans-serif;
          line-height: 1.2;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
          width: max-content;
          min-width: 150px;
          padding: 8px 20px;
          height: 40px;
          cursor: pointer;
          position: relative;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        form.fields .actions > .action.prev svg path {
          fill: var(--text-color);
        }

        form.fields .actions > .action.next {
          color: var(--white-color);
          background: var(--stage-no-linear);
        }

        form.fields .actions > .action.next svg path {
          fill: var(--white-color);
        }

        form.fields .actions > .action.disabled {
          pointer-events: none;
        }

        @media screen and (max-width:600px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          .top > .desc {
            margin: 0;
            padding: 6px 0 10px;
            font-size: 1rem;
            line-height: 1.5;
            font-family: var(--font-main), sans-serif;
          }

          form.fields .actions > .action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}