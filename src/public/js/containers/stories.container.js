export default class StoriesContainer extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('.stories');

    this.fetchStories(contentContainer);
  }

  fetchStories = (contentContainer) => {
    const storyLoader = this.shadowObj.querySelector('story-loader');
    const content = this.getStories();
    setTimeout(() => {
      storyLoader.remove();
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
			<story-loader speed="300"></story-loader>
		`
  }

  getBody = () => {
    // language=HTML
    return `
			<div class="stories new">
				${this.getLoader()}
      </div>
    `;
  }

  getStories = () => {
		return /* html */`
			<story-post story="story" url="/s/P0A43PBA64AB" hash="P0AJ59AB43PBA" views="609" time="2024-03-13T13:00:00+03:00"
        story-title="The US Senate called on the law markers" topics="engineering, programming, technology" read-time="6"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </story-post>

      <quick-post story="quick" url="/s/P0A43PBA64AB" topics="engineering, programming, technology" likes="9" replies="3872" hash="P0ANB32A43PBA" liked="false"
	      views="4369" time="2019-01-07T23:53:01+03:00"
	      story-title="The US Senate called on the law markers"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
        <p>The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
        'Content here, content here', making it look like readable English.</p>
        <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
        <p>Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
	    </quick-post>

      <quick-post story="quick" url="/s/P0A43PBA64AB" topics="engineering, programming, technology"  likes="9" replies="3872" hash="P0ANB32A43PBA" liked="false"
	      views="4369" time="2024-06-04T23:53:01+03:00"
	      story-title="The US Senate called on the law markers"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
        <p>Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
	    </quick-post>

      <poll-post story="poll" url="/s/P0A43PBA64AB" topics="engineering, programming, technology" hash="P0A43HVA56PBA" views="89609" time="2024-03-13T19:00:00+03:00" end-time="2024-06-10T19:00:00+03:00"
        liked="false" likes="36987" replies="7872" voted="false" selected="null"
        options='[{"name":"control","text":"Control room","votes":11780},{"name":"bth","text":"Beyond the horizon","votes":3367},{"name":"tuku","text":"Tuku","votes":3478},{"name":"kid","text":"The kid","votes":4198}]'
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Which of this comics do find yourself immersed in?</p>
      </poll-post>

      <quick-post story="quick" url="/s/P0A43PBA64AB" topics="engineering, programming, technology" likes="63" replies="372" hash="P0A63HB43PBA" liked="true"
        views="369" time="2019-08-16T13:00:00+03:00"
        story-title="The US Senate called on the law markers"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
        <p>The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
        'Content here, content here', making it look like readable English.</p>
      </quick-post>

      <poll-post story="poll" url="/s/P0A43PBA64AB" topics="engineering, programming, technology" hash="P0A43PBABV69" views="9609" time="2024-03-13T13:00:00+03:00" end-time="2024-05-31T23:00:00+03:00" liked="true"
        likes="6367" replies="872" voted="false" selected="null"
        options='[{"name":"java","text":"Java","votes":367},{"name":"python","text":"Python","votes":986},{"name":"javascript","text":"JavaScript","votes":879},{"name":"csharp","text":"C#","votes":117}]'
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Which is the best programming language?</p>
      </poll-post>

      <story-post story="story" url="/s/P0A43PBA64AB" topics="engineering, programming, technology" hash="P0A4BVC63PBA" views="1369" time="2024-03-13T13:00:00+03:00"
        story-title="The US Senate called on the law markers" read-time="6"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </story-post>

      <quick-post story="quick" url="/s/P0A43PBA64AB" topics="engineering, programming, technology" likes="9" replies="3872" hash="P0A4HAS653PBA" liked="false"
	      views="4369" time="2022-01-03T13:00:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
        <p>The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
        'Content here, content here', making it look like readable English.</p>
        <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.</p>
        <p>Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
	    </quick-post>

      <story-post story="story" url="/s/P0A43PBA64AB" topics="engineering, programming, technology" hash="P0A65HBA43PBA" views="85469" time="2024-03-13T13:00:00+03:00"
        story-title="How to create bootable disk in ubuntu 21.10" read-time="6"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
      </story-post>
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
          width: 100%;
        }

        div.stories {
          padding: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

      </style>
    `;
  }
}