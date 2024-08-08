import { ClassicEditor, AccessibilityHelp, Autoformat,
	AutoLink, Autosave, Bold, Essentials, Heading,
	Italic, Link, List, Paragraph, SelectAll, Table, TableCaption, TableCellProperties,
	TableColumnResize, TableProperties, TableToolbar,
	TextTransformation, TodoList, Underline, Undo 
} from 'https://cdn.ckeditor.com/ckeditor5/42.0.2/ckeditor5.js';
const editorConfig = {
	height: '450px',
  width: '100%',
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'|',
			'link',
			'bulletedList',
			'numberedList',
		],
		shouldNotGroupWhenFull: false
	},
	toolbarLocation: 'bottom',
	plugins: [
		AccessibilityHelp,
		Autoformat,
		AutoLink,
		Autosave,
		Bold,
		Essentials,
		Heading,
		Italic,
		Link,
		List,
		Paragraph,
		SelectAll,
		Table,
		TableCaption,
		TableCellProperties,
		TableColumnResize,
		TableProperties,
		TableToolbar,
		TextTransformation,
		TodoList,
		Underline,
	],
	heading: {
		options: [
			{
				model: 'paragraph',
				title: 'Paragraph',
				class: 'ck-heading_paragraph'
			},
			{
				model: 'heading2',
				view: 'h2',
				title: 'Heading 2',
				class: 'ck-heading_heading2'
			},
			{
				model: 'heading3',
				view: 'h3',
				title: 'Heading 3',
				class: 'ck-heading_heading3'
			},
			{
				model: 'heading4',
				view: 'h4',
				title: 'Heading 4',
				class: 'ck-heading_heading4'
			}
		]
	},
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
export default class TextEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initEditor();

		// handle update
		this.handleUpdate();
  }

  render() {
		this.shadowRoot.innerHTML = this.getTemplate();
  }

	handleUpdate = async () => {
		// get save button
		const updateBtn = this.shadowRoot.querySelector('.actions > button.update');

		if (updateBtn) {
			updateBtn.addEventListener('click', async e => {
				const data = await this.getData(this.shadowRoot.querySelector('.top'));
				this.updateData(data, this.shadowRoot.querySelector('.top'));
			})
		}
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

	getData = async top => {
		console.log(this.editor)
		let title = top.querySelector('input.title').value.trim();
		let content;
		this.editor.then(editor => {
			content = editor.getData()
		});
		return { title, content };
	}

	updateData = async (data, top) => {
		const outerThis = this;
		let body = {}
		// CHECK IF title is empty
		if (data.title === '') {
			body = {
				id: this.convertToNumber(this.getAttribute('section-id')),
				content: data.content
			}
		}
		else {
			body = {
				section: this.convertToNumber(this.getAttribute('section-id')),
				title: data.title,
				content: data.content
			}
		}

		// send data to server
		const options = {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		};

		const api = this.getAttribute('api');

		const url = `${api}/edit`;

		try {
			// insert loader to the host element
			top.insertAdjacentHTML('beforeend', this.getLoader());

			const response = await outerThis.fetchWithTimeout(url, options);
			const result = await response.json();

			// check if request was successful
			if (result.success) {
				// show success message
				top.insertAdjacentHTML('beforeend', 
					outerThis.getServerSuccessMsg(true, result.message)
				);

				// remove the loader
				const loader = top.querySelector('#loader-container');
				if (loader) {
					loader.remove();
				}
			} else {
				// show error message
				top.insertAdjacentHTML('beforeend', outerThis.getServerSuccessMsg(false, result.message));

				// remove the loader
				const loader = top.querySelector('#loader-container');
				if (loader) {
					loader.remove();
				}
			}
		}
		catch (error) {
			// show error message
			top.insertAdjacentHTML('beforeend', outerThis.getServerSuccessMsg(false, 'An error occurred, please try again'));

			// remove the loader
			const loader = top.querySelector('#loader-container');
			if (loader) {
				loader.remove();
			}
		}
	}

	convertToBool = str => {
		return str === 'true' ? true : false;
	}

	convertToNumber = str => {
		let num = parseInt(str);
		return isNaN(num) ? 0 : num;
	}

	getTemplate = () => {
		return /*html*/`
			${this.getHeader()}
			<div id="editor"></div>
			${this.getStyles()}
		`;
	}

	getUnauthorized = () => {
		return /*html*/`
			<div class="unauthorize">
				<h4 class="title">Unauthorized!</h4>
				<p class="desc"> You are not allow to modify this section/content in any way. </p>
			</div>
			${this.getStyles()}
		`;
	}

	getHeader = () => {
		let title = this.getAttribute('section-title');
		if (title === null || title === '' || title === 'undefined' || title === 'null') {
			title = '';
		}
    return /* html */`
      <div class="top">
        ${this.checkDraft(this.getAttribute('draft'))}
				<input type="text" class="title" placeholder="Section title - (optional) -" value="${title}">
      </div>
    `;
  }

  initEditor() {
    this.editor = ClassicEditor.create(this.shadowRoot.getElementById('editor'), editorConfig);

		// set content
		this.editor.then(editor => {
			editor.setData(this.innerHTML || '');
		});
  }

	checkDraft = (draft) => {
		if (this.convertToBool(draft)) {
			return /*html*/`
				<div class="actions">
					${this.checkNew()}
					<button class="approve">Approve</button>
					<button class="discard">Discard</button>
				</div>
			`;
		}
		else {
			return /*html*/`
				<div class="actions">
					${this.checkNew()}
				</div>
			`;
		}
	}

	checkNew = () => {
		if (this.convertToBool(this.getAttribute('new'))) {
			return /*html*/`
				<button class="save">Save</button>
			`;
		}
		return /*html*/`
			<button class="update">Update</button>
		`;
	}

	getLoader() {
    return /*html*/`
      <div id="loader-container">
				<div class="loader"></div>
			</div>
    `
  }

	getStyles = () => {
		return /*css*/`
		<link rel="stylesheet" href="/static/css/ckeditor.css">
		<style>
			::-webkit-scrollbar {
				width: 3px;
			}

			:host {
				display: block;
				width: 100%;
				min-height: calc(100dvh - 70px);
				position: relative;
				height: max-content;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
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

			.unauthorize {
				display: flex;
				flex-flow: column;
				align-items: center;
				justify-content: center;
				gap: 5px;
				padding: 30px 0;
				width: 100%;
				min-height: calc(100dvh - 150px);
			}

			.unauthorize > h4.title {
				display: flex;
				align-items: center;
				color: var(--error-color);
				font-size: 1.35rem;
				font-weight: 500;
				margin: 0;
				padding: 0 0 6px 0;
			}

			.unauthorize > .desc {
				margin: 0;
				padding: 10px 0;
				color: var(--editor-color);
				font-size: 1rem;
				font-family: var(--font-main), sans-serif;
			}

			.top {
				display: flex;
				flex-flow: column;
				gap: 5px;
				padding: 0 0 20px;
				width: 100%;
			}

			.top > h4.title {
				border-bottom: var(--border-mobile);
				display: flex;
				align-items: center;
				color: var(--editor-color);
				font-size: 1.3rem;
				font-weight: 500;
				margin: 0;
				padding: 0 0 6px 0;
			}

			.top > div.actions {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 20px;
				padding: 0 0 10px;
				margin: 0 0 10px;
				border-bottom: var(--border);
			}

			.top > div.actions > button {
				font-size: 0.9rem;
				color: var(--white-color);
				font-family: var(--font-text), sans-serif;
				font-weight: 500;
				background: var(--accent-linear);
				outline: none;
				cursor: pointer;
				width: max-content;
				padding: 3px 10px 4px 10px;
				height: max-content;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 10px;
				border: none;
			}

			.top > div.actions > button.discard {
				background: var(--error-linear);
			}

			.top > div.actions > button.approve {
				background: var(--action-linear);
			}

			.top > .desc {
				margin: 0;
				padding: 10px 0;
				color: var(--editor-color);
				font-size: 1rem;
				font-family: var(--font-main), sans-serif;
			}

			.top > input {
				border: var(--input-border);
				background-color: var(--background) !important;
				font-size: 1rem;
				font-weight: 500;
				width: 95%;
				height: max-content;
				outline: none;
				padding: 8px 12px;
				border-radius: 12px;
				color: var(--editor-color);
			}
			
			.top > input:-webkit-autofill,
			.top > input:-webkit-autofill:hover, 
			.top > input:-webkit-autofill:focus {
				-webkit-box-shadow: 0 0 0px 1000px var(--background) inset;
				-webkit-text-fill-color: var(--text-color) !important;
				transition: background-color 5000s ease-in-out 0s;
				color: var(--text-color) !important;
			}
			
			.top > input:autofill {
				filter: none;
				color: var(--text-color) !important;
			}

			.top > input:focus {
				border: var(--input-border-focus);
			}

			#editor {
				height: 450px;
				overflow-y: auto;
				height: calc(100% - 70px);
			}
			.ck.ck-editor__main > .ck-editor__editable {
				color: var(--editor-color);
			}
			.ck.ck-editor__main > .ck-editor__editable a {
				color: var(--anchor-color);
			}
			.ck-editor__editable_inline:not(.ck-comment__input *) {
				height: 420px;
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
		</style>`;
	}
}