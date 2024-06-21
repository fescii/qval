export default class RelatedContainer extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');
    const contentContainer = this.shadowObj.querySelector('div.content');

    this.fetchTopics(contentContainer);
  }

  fetchTopics = contentContainer => {
    //Get type of stories to fetch
    const type = this.getAttribute('type') || 'story';

    const topicsLoader = this.shadowObj.querySelector('post-loader');
    const content = this.getContent(type);
    setTimeout(() => {
      topicsLoader.remove();
      contentContainer.insertAdjacentHTML('beforeend', content);
    }, 2000)
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getLoader = () => {
    return `
			<post-loader speed="300"></post-loader>
		`
  }

  getBody = () => {
    // language=HTML
    return /* html */`
			<div class="content">
				${this.getLoader()}
			</div>
    `;
  }

  getTitle = type => {
    switch (type) {
      case 'top':
        return 'Trending stories';
      case 'latest':
        return 'Latest stories';
      case 'related':
        return 'Related stories';
      default:
        return 'Trending stories';
    }
  }

  getContent = type => {
    return /* html */`
			<div class="related">
        <p class="title">${this.getTitle(type)}</p>
        <div class="stories">
          ${this.getStories()}
        </div>
      </div>
		`
  }

  getStories = () => {
    return /* html */`
      <summery-post story="story" url="/s/P0A43PBA64AB" hash="P0AJ59AB43PBA" views="609" time="2024-03-13T13:00:00+03:00"
        story-title="The US Senate called on the law markers" topics="engineering, programming, technology" read-time="5 min"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A" 
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </summery-post>
      <summery-post story="story" url="/s/P0B78NCA96DC" hash="P0BC57N78CA96" views="1024" time="2024-05-22T09:15:00+03:00"
        story-title="Breakthroughs in Quantum Computing" topics="quantum computing, science, technology" read-time="3 min"
        author-username="U0B78NCA96DC" author-you="false" author-url="/u/U0B78NCA96DC"
        author-img="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=S+W" author-verified="true" author-name="Sophia Williams" author-followers="12456"
        author-following="512" author-follow="true" author-bio="Quantum physicist and tech writer. Passionate about the future of computing and scientific advancements.">
      </summery-post>

      <summery-post story="story" url="/s/P0C65OBA47EA" hash="P0CB56C65BA47" views="784" time="2024-02-19T17:30:00+03:00"
        story-title="Advances in AI and Machine Learning" topics="AI, machine learning, technology" read-time="7 min"
        author-username="U0C65OBA47EA" author-you="false" author-url="/u/U0C65OBA47EA"
        author-img="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=J+R" author-verified="false" author-name="James Rodriguez" author-followers="8523"
        author-following="193" author-follow="false" author-bio="AI researcher and data scientist. Writing about the latest trends in artificial intelligence and its applications.">
      </summery-post>

      <summery-post story="story" url="/s/P0D54PDA98FB" hash="P0DB54D54DA98" views="1342" time="2024-04-10T12:45:00+03:00"
        story-title="The Future of Renewable Energy" topics="renewable energy, environment, technology" read-time="2 min"
        author-username="U0D54PDA98FB" author-you="true" author-url="/u/U0D54PDA98FB"
        author-img="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=E+K" author-verified="true" author-name="Elena Kim" author-followers="20456"
        author-following="356" author-follow="true" author-bio="Environmental scientist focused on sustainable technologies. Dedicated to promoting green energy solutions.">
      </summery-post>

      <summery-post story="story" url="/s/P0E43QEA21GC" hash="P0EC54E43QA21" views="1573" time="2024-01-29T15:20:00+03:00"
        story-title="Innovations in Biotechnology" topics="biotechnology, health, technology" read-time="5 min"
        author-username="U0E43QEA21GC" author-you="false" author-url="/u/U0E43QEA21GC"
        author-img="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=M+C" author-verified="false" author-name="Michael Chen" author-followers="17645"
        author-following="488" author-follow="true" author-bio="Biotech engineer and medical writer. Exploring the intersections of technology and health.">
      </summery-post>

      <summery-post story="story" url="/s/P0F32REA10HD" hash="P0FC32F32RA10" views="923" time="2024-03-05T10:10:00+03:00"
        story-title="Cybersecurity Trends in 2024" topics="cybersecurity, IT, technology" read-time="13 min"
        author-username="U0F32REA10HD" author-you="true" author-url="/u/U0F32REA10HD"
        author-img="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=A+P" author-verified="true" author-name="Anika Patel" author-followers="9523"
        author-following="342" author-follow="false" author-bio="Cybersecurity analyst and tech blogger. Writing about the latest in cybersecurity and IT infrastructure.">
      </summery-post>
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
          margin: 0;
				  display: flex;
				  flex-flow: column;
				}

				div.content {
				  margin: 0;
				  padding: 0;
				  display: flex;
				  flex-flow: row;
				  flex-wrap: wrap;
				  align-items: center;
				  justify-content: start;
				  gap: 10px;
				  width: 100%;
				}

				.related {
          background-color: var(--background);
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 2px;
        }

        .related > p.title {
          padding: 0;
          color: var(--text-color);
					font-family: var(--font-main), sans-serif;
				  font-size: 1rem;
					font-weight: 500;
				  line-height: 1;
          margin: 0;
        }

        .related > .stories {
          list-style-type: none;
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        .related > ul.stories li.story {
          text-decoration: none;
          padding: 10px 0 0 0;
          display: flex;
        }

        .related > ul.stories li.story a {
          text-decoration: none;
          display: flex;
          flex-flow: column;
          color: var(--gray-color);
        }

        .related > ul.stories li.story a span.title {
          color: var(--text-color);
          font-family: var(--font-text), sans-serif;
          font-weight: 400;
          font-size: 1rem;
        }

        .related > ul.stories li.story a:hover > span.title {
          color: var(--read-color);
        }

        .related > ul.stories li.story a span.date {
          color: var(--gray-color);
          font-family: var(--font-main), sans-serif;
          line-height: 1.4;
          font-size: 0.8rem;
        }

				@media screen and (max-width:660px) {
					:host {
        		font-size: 16px;
						padding: 15px 0;
					}

					::-webkit-scrollbar {
						-webkit-appearance: none;
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
  }
}