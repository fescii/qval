export default class RepliesFeed extends HTMLElement {
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
    const contentContainer = this.shadowObj.querySelector('.replies');

    this.fetchReplies(contentContainer);
  }

  fetchReplies = (contentContainer) => {
    const storyLoader = this.shadowObj.querySelector('story-loader');
    const content = this.getReplies();
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
			<div class="replies">
				${this.getLoader()}
      </div>
    `;
  }

  getReplies = () => {
    return /* html */`
      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="120" replies="450" liked="false"
        views="512" time="2019-08-17T14:30:00+03:00"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>The new legislation aims to address ongoing issues in healthcare reform.</p>
        <p>It includes provisions for better access to medical services for underprivileged communities.</p>
      </quick-post>

      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="75" replies="210" liked="true"
        views="380" time="2019-08-18T10:15:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Climate change continues to have a significant impact on agricultural productivity.</p>
        <p>Farmers are adapting by implementing new techniques and technologies.</p>
      </quick-post>

      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="89" replies="340" liked="false"
        views="420" time="2019-08-19T09:45:00+03:00"
        author-username="U0A43PBAH6A" author-you="true" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Artificial Intelligence is rapidly advancing, bringing new possibilities to various industries.</p>
        <p>From healthcare to finance, AI is revolutionizing the way we work and live.</p>
      </quick-post>

      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="102" replies="390" liked="true"
        views="485" time="2019-08-20T11:20:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Renewable energy sources are becoming more viable and widespread.</p>
        <p>Investment in solar and wind energy is crucial for a sustainable future.</p>
      </quick-post>
  
      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="140" replies="520" liked="false"
        views="600" time="2019-08-21T12:30:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Researchers have made significant progress in the fight against cancer.</p>
        <p>New treatments are showing promising results in clinical trials.</p>
      </quick-post>

      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="64" replies="310" liked="true"
        views="405" time="2019-08-22T14:00:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>From tropical beaches to historical cities, 2020 has many travel destinations to offer.</p>
        <p>Plan your next vacation with these top travel spots.</p>
      </quick-post>

      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="110" replies="470" liked="false"
        views="520" time="2019-08-23T15:45:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Scientists have discovered new species in the deepest parts of the ocean.</p>
        <p>These findings could provide insights into the origins of life on Earth.</p>
      </quick-post>

      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="95" replies="360" liked="true"
        views="450" time="2019-08-24T16:10:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Education plays a critical role in shaping the future of society.</p>
        <p>Investing in education is investing in the future.</p>
      </quick-post>
  
      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="80" replies="400" liked="false"
        views="490" time="2019-08-25T10:50:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>The stock market is experiencing significant changes in 2020.</p>
        <p>Investors should keep an eye on these key trends.</p>
      </quick-post>

      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="87" replies="280" liked="true"
        views="430" time="2019-08-26T11:35:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Modern art has evolved significantly over the past century.</p>
        <p>Artists continue to push the boundaries of creativity and expression.</p>
      </quick-post>

      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="77" replies="320" liked="false"
        views="370" time="2019-08-27T13:20:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>Mental health awareness is crucial for overall well-being.</p>
        <p>Support and understanding can make a significant difference.</p>
      </quick-post>
      <quick-post story="reply" hash="R0B5HB2N2QCA" url="/r/R0B5HB2N2QCA" topics="engineering, programming, technology" likes="92" replies="350" liked="true"
        views="480" time="2019-08-28T14:40:00+03:00"
        author-username="U0A43PBAH6A" author-you="false" author-url="/u/U0A43PBAH6A"
        author-img="/img/img.jpg" author-verified="true" author-name="Fredrick Ochieng" author-followers="7623"
        author-following="263" author-follow="false" author-bio="I am a student at the East African University, I am a software developer and a tech enthusiast.
          I love to write about technology and software development.">
        <p>The 2020 Olympics showcased incredible athletic talent and sportsmanship.</p>
        <p>Here are some of the most memorable moments from the games.</p>
      </quick-post>
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
        padding: 0 0 30px;
      }

			div.stories {
			  /* border: 1px solid #000000; */
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