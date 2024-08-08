import { ClassicEditor, AccessibilityHelp, Autoformat,
	AutoLink, Autosave, Bold, Essentials, Heading,
	Italic, Link, List, Paragraph, SelectAll, Table, TableCaption, TableCellProperties,
	TableColumnResize, TableProperties, TableToolbar,
	TextTransformation, TodoList, Underline, Undo 
} from 'https://cdn.ckeditor.com/ckeditor5/42.0.2/ckeditor5.js';
const editorConfig = {
	height: '200px',
	toolbar: {
		items: ['bold', 'italic', 'underline', '|', 'link', 'bulletedList', 'numberedList'],
		shouldNotGroupWhenFull: false
	},
	toolbarLocation: 'bottom',
	plugins: [
		AccessibilityHelp,
		Autoformat, AutoLink, Autosave, Bold,
		Essentials, Italic, Link, List,
		Paragraph, SelectAll, Table,
		TableCaption, TableCellProperties, TableColumnResize,
		TableProperties, TableToolbar,
		TextTransformation, TodoList, Underline,
	],
	link: {
		addTargetToExternalLinks: true,
		defaultProtocol: 'https://',
		decorators: {
			toggleDownloadable: {
				mode: 'manual',
				label: 'Downloadable',
				attributes: {
					download: 'file'
				}
			}
		}
	},
	placeholder: 'Type or paste your content here!',
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
	}
};

export default class NewPost extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this.editor = null;

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this._url = this.getAttribute('api');

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // initialize the editor
    this.initEditor();

    // select the form
    const form = this.shadowObj.querySelector('form');

    // add event listener to the form
    this.submitForm(form);

    // validate the slug
    this.validateForm(form);

    const btns = this.shadowObj.querySelectorAll('.cancel-btn');
    const overlay = this.shadowObj.querySelector('.overlay');

    // Close the modal
    if (overlay && btns) {
      this.closePopup(overlay, btns);
    }

    this.disableScroll();
  }

  initEditor() {
    ClassicEditor.create(this.shadowRoot.getElementById('editor'), editorConfig)
    .then(editor => {
      this.editor = editor;
      this.editor.setData(this.innerHTML || '');
    })
    .catch(error => {
      console.log('Failed to initialize the editor. Error: ', error);
    });
  }

  disconnectedCallback() {
    this.enableScroll();
  }

  activateNextButton = next => {
    if (!this._topic) return;
    const url = `/t/${this._topic.hash.toLowerCase()}/edit`;
    // Add an event listener to the post button
    next.addEventListener('click', e => {
      e.preventDefault();
      // Get the body element
      const body = document.querySelector('body');
      // Get the content of the post page
      const content = this.getTopic(this._topic);
      // Replace and push the states
      this.replaceAndPushStates(url, body, content);
    });
  }

  replaceAndPushStates = (url, body, content) => {
    // Replace the content with the current url and body content
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
      { page: 'page', content: content},
      url, url
    );

    // update the body content
    body.innerHTML = content;
  }

  getTopic = data => {
    const url = `/t/${data.hash.toLowerCase()}/edit`;
    
    return /*html*/`
      <edit-topic url="${url}" name="${data.name}" slug="${data.slug}" summary="${data.summary}" hash="${data.hash}"
        author="${data.author}" created="${data.created}" updated="${data.updated}">
      </edit-topic>
    `;
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
        method: 'PUT',
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
            outerThis.getServerSuccessMsg(true, 'Topic created successfully. Click continue to edit the topic')
          );

          outerThis._topic = result.topic;

          // reset button
          button.innerHTML = '<span class="text">Continue</span>';
          // remove the loader
          const loader = content.querySelector('#loader-container');
          if (loader) {
            loader.remove();
          }

          // activate the next button
          outerThis.activateNextButton(button);
        } else {
          // show error message
          actions.insertAdjacentHTML('beforebegin', outerThis.getServerSuccessMsg(false, result.message));

          // reset button
          button.innerHTML = '<span class="text">Create</span>';
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
        button.innerHTML = '<span class="text">Create</span>';

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
      <div class="overlay"></div>
      <section id="content" class="content">
        <span class="control cancel-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
        </span>
        ${this.getBody()}
      </section>
    ${this.getStyles()}`
  }

  getBody = () => {
    return /* html */`
      ${this.getHeader()}
      <form class="fields post" id="post-form">
        <textarea name="editor" id="editor" cols="30" rows="10" required placeholder="Type or paste your content hare!"></textarea>
        <div class="actions">
          <button class="action cancel-btn">
            <span class="text">Cancel</span>
          </button>
          <button type="submit" class="action next">
            <span class="text">Post</span>
          </button>
        </div>
      </form>
    `;
  }

  getDaysInput = () => {
    return /* html */`
      <div class="field">
        <label for="days">Days</label>
        <div class="input-group">
          <input type="number" name="days" id="days" placeholder="Enter number of days" required/>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 1a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 1a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 1a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 1a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 1a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        </div>
      </div>
    `;
  }

  getHeader = () => {
    return /* html */`
      <h2 class="pop-title">Create post</h2>
      <div class="top">
        <p class="desc">
          Create a new post by typing or pasting your content in the editor below.
          <br>
          <span>Note: For polls, only one poll can be created per post and each poll can have a maximum of 4 options. Poll runs upto a maximum 7 days(1 week), i.e 168 hours.</span>
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
      <link rel="stylesheet" href="/static/css/ckeditor.css">
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
        }

        a {
          text-decoration: none;
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
          padding: 20px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: start;
          gap: 0;
          width: 700px;
          max-height: 90%;
          height: max-content;
          border-radius: 15px;
          position: relative;
        }
  
        #content span.control {
          padding: 0;
          cursor: pointer;
          display: none;
          flex-flow: column;
          gap: 0px;
          justify-content: center;
          position: absolute;
          right: 9px;
          top: 9px;
        }

        #content span.control svg {
          width: 16px;
          height: 16px;
          color: var(--text-color);
        }

        #content span.control svg:hover{
          color: var(--error-color);
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

        h2.pop-title {
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

        .top {
          display: flex;
          flex-flow: column;
          gap: 5px;
          padding: 0;
          width: 100%;
        }

        .top > .desc {
          margin: 0;
          padding: 10px 0 20px;
          color: var(--text-color);
          font-size: 0.95rem;
          font-family: var(--font-main), sans-serif;
        }

        .top > .desc > span {
          display: inline-block;
          margin: 10px 0 5px;
          color: var(--gray-color);
          font-size: 0.85rem;
          font-style: italic;
          font-family: var(--font-read), sans-serif;
        }

        form.fields {
          margin: 0;
          width: 100%;
          min-width: 100%;
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

        form.fields .field.bio .input-group {
          width: 100%;
        }

        form.fields .field.bio .input-group.code,
        form.fields .field.bio .input-group.slug {
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

        form.fields .field.bio label {
          padding: 0 0 0 5px;
        }

        form.fields label {
          color: var(--label-color);
          font-size: 1.1rem;
          font-family: var(--font-read), sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        form.fields .field input {
          border: var(--input-border);
          background: var(--background);
          font-family: var(--font-read), sans-serif;
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

        form.fields .field input {
          border: none;
          border: var(--border);
          font-family: var(--font-read), sans-serif;
          background-color: var(--background) !important;
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
        }
        
        form.fields .field input:-webkit-autofill,
        form.fields .field input:-webkit-autofill:hover, 
        form.fields .field input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px var(--background) inset;
          -webkit-text-fill-color: var(--text-color) !important;
          transition: background-color 5000s ease-in-out 0s;
          color: var(--text-color) !important;
        }
        
        form.fields .field input:autofill {
          filter: none;
          color: var(--text-color) !important;
        }

        form.fields .field input:focus {
          border: var(--input-border-focus);
        }

        form.fields textarea {
          border: none;
          border: var(--border);
          font-family: var(--font-read), sans-serif;
          background: var(--background);
          font-size: 1rem;
          padding: 10px 12px;
          margin: 0;
          width: 100%;
          resize: none;
          height: 120px;
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

        form.fields textarea:focus {
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
          width: 100%;
          gap: 20px;
          margin: 0 0 0 2px;
        }

        form.fields .actions > .action {
          border: none;
          background: var(--accent-linear);
          text-decoration: none;
          color: var(--white-color);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          width: max-content;
          flex-flow: row;
          align-items: center;
          text-transform: capitalize;
          justify-content: center;
          padding: 4px 15px 5px;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
        }

        form.fields .actions > .action.cancel-btn {
          background: var(--gray-background);
          fill: var(--text-color);
          /*text-transform: lowercase;*/
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

        #editor {
          min-width: 100%;
          width: 100%;
          max-height: 200px;
          height: 200px;
          overflow-y: auto;
        }

        .ck.ck-editor__main > .ck-editor__editable {
          color: var(--editor-color);
        }

        .ck.ck-editor__main > .ck-editor__editable a {
          color: var(--anchor-color);
        }

        .ck-editor__editable_inline:not(.ck-comment__input *) {
          height: 150px;
          overflow-y: auto;
        }

        .ck-body-wrapper {
          display: none
          opacity: 0
          visibility: hidden
        }

        .ck.ck-reset.ck-editor {
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -webkit-flex-direction: column;
          -moz-flex-direction: column;
          -ms-flex-direction: column;
          flex-direction: column;
        }

        .ck-focused, .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
          border: none;
          border: none;
          outline: none !important;
          -moz-outline: none !important;
          -webkit-outline: none !important;
          -ms-outline: none !important;
          -webkit-box-shadow: none;
          -moz-box-shadow: none;
          box-shadow: none
        }

        @media screen and (max-width:600px) {
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
            min-width: 100dvw;
            min-height: 100dvh;
          }

          #content {
            box-sizing: border-box !important;
            padding: 20px 10px 25px 10px;
            margin: 0;
            width: 100%;
            max-width: 100%;
            max-height: 100%;
            min-height: 100%;
            border-radius: 0;
            border: none;
            overflow-y: auto;
          }

          #content span.control {
            cursor: default !important;
            display: none;
            top: 15px;
            right: 15px;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          h2.pop-title {
            width: 100%;
            font-size: 1.2rem;
            margin: 0 0 15px;
            padding: 10px 10px;
            background-color: var(--gray-background);
            text-align: center;
            border-radius: 12px;
          }

          .top > .desc {
            margin: 0;
            padding: 6px 0 10px;
            font-size: 0.95rem;
            line-height: 1.5;
            font-family: var(--font-main), sans-serif;
          }

          form.fields textarea {
            height: 120px;
          }

          form.fields .actions {
            display: flex;
            align-items: center;
            width: 100%;
            gap: 25px;
            margin: 10px 0 0 2px;
          }

          form.fields .actions > .action {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}