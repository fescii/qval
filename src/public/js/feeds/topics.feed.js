export default class TopicsFeed extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('.topics-list');

    this.fetchTopics(contentContainer);
  }

  fetchTopics = (contentContainer) => {
    const topicsLoader = this.shadowObj.querySelector('topic-loader');
    const content = this.getTopics();
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
			<topic-loader speed="300"></topic-loader>
		`
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="topics-list">
				${this.getLoader()}
			</div>
    `;
  }

  getTopics = () => {
    return /*html*/`
      <topic-wrapper hash="T0BC98H63AB1" name="health-care" description="Health care is the maintenance or improvement of health via the prevention, diagnosis, treatment, recovery, or cure of disease, illness, injury, and other physical and mental impairments in people."
        topic-follow="true" subscribed="false" url="/t/T0BC98H63AB1"
        subscribers="236" followers="9734" stories="75624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0YZ92G78LM1" name="technology-is-the-key-to-many-solutions-but-not-definate" description="Technology is the application of scientific knowledge for practical purposes, especially in industry."
         topic-follow="false" subscribed="true" url="/t/T0BC98H63AB1"
        subscribers="987" followers="15632"  stories="75724"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0JQ75H45FD2" name="sports" description="Sports involve physical exertion and skill in which an individual or team competes against another or others for entertainment."
         topic-follow="true" subscribed="false" url="/t/T0BC98H63AB1"
        subscribers="512" followers="8341"  stories="85624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0PL84D56GH3" name="education" description="Education is the process of facilitating learning, or the acquisition of knowledge, skills, values, beliefs, and habits."
         topic-follow="false" subscribed="true" url="/t/T0BC98H63AB1"
        subscribers="674" followers="12098"  stories="5624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0RK39J23NM4" name="science" description="Science is the pursuit and application of knowledge and understanding of the natural and social world following a systematic methodology based on evidence."
        topic-follow="true" subscribed="false" url="/t/T0BC98H63AB1"
        subscribers="856" followers="21045"  stories="15624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0XC49K76PO5" name="travel" description="Travel is the movement of people between distant geographical locations, either for leisure or business purposes."
         topic-follow="true" subscribed="false" url="/t/T0BC98H63AB1"
        subscribers="239" followers="4789"  stories="73624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0ML28P57QW6" name="music" description="Music is the art of arranging sounds in time to produce a composition through the elements of melody, harmony, rhythm, and timbre."
         topic-follow="false" subscribed="true" url="/t/T0BC98H63AB1"
        subscribers="319" followers="9453"  stories="19624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0HZ11L63VK7" name="art" description="Art is a diverse range of human activities involving the creation of visual, auditory, or performed artifacts, expressing the creator's imaginative or technical skill."
         topic-follow="true" subscribed="false" url="/t/T0BC98H63AB1"
        subscribers="728" followers="16349"  stories="75624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0FG54Q23ZX8" name="literature" description="Literature is the body of written works of a language, period, or culture, produced by scholars, researchers, and writers."
         topic-follow="false" subscribed="true" url="/t/T0BC98H63AB1"
        subscribers="442" followers="8076" stories="75624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0NK23B67RP9" name="finance" description="Finance is the study and discipline of money, currency, and capital assets, focusing on investments, financial instruments, and markets."
         topic-follow="true" subscribed="false" url="/t/T0BC98H63AB1"
        subscribers="395" followers="12985" stories="75624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>

      <topic-wrapper hash="T0AB82M34LS0" name="cooking" description="Cooking is the practice or skill of preparing food by combining, mixing, and heating ingredients."
         topic-follow="true" subscribed="false" url="/t/T0BC98H63AB1"
        subscribers="523" followers="6532" stories="75624"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </topic-wrapper>
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
				  background-color: var(--background);
				  padding: 0;
				  display: flex;
				  flex-flow: column;
				  gap: 5px;
          width: 100%;
        }

				.topics-list {
					background-color: var(--background);
					padding: 0;
					display: flex;
					flex-flow: column;
					gap: 0;
					width: 100%;
				}

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
						padding: 0;
					}

					a {
						cursor: default !important;
					}
				}
	    </style>
    `;
  }
}