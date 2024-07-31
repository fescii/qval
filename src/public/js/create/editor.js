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
  }

  render() {
		if (!this.convertToBool(this.getAttribute('authorized'))) {
			this.shadowRoot.innerHTML = this.getUnauthorized();
			return;
		}
		else {
			this.shadowRoot.innerHTML = this.getTemplate();
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
        ${this.checkDraft(this.getAttribute('draft'), this.getAttribute('modify'), this.getAttribute('author'))}
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

	checkDraft = (draft, modify, author) => {
		if (this.convertToBool(draft) && modify === 'true') {
			return /*html*/`
				<div class="actions">
					<button class="approve">Approve</button>
					<button class="save">Save</button>
					<!--<button class="discard">discard</button>-->
				</div>
			`;
		}
		else if (this.convertToBool(author)) {
			return /*html*/`
				<div class="actions">
					<button class="save">Save</button>
				</div>
			`;
		}
		else if(this.convertToBool(this.getAttribute('new'))) {
			return /*html*/`
				<div class="actions">
					<button class="save">Save</button>
				</div>
			`;
		}
		else {
			return /*html*/`
				<p class="desc"> You are not authorized to modify this section/draft. Any changes will not be saved. </p>
			`;
		}
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
				height: max-content;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
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