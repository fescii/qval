export default class AppStory extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.topics = this.getTopics();

    this.render();
  }


  getTopics = () => {
    // get the topics
    let topics = this.getAttribute('topics');

    // Check if the topics is null
    if (topics === null) {
      return ['story'];
    }

    // Return the topics
    return topics.split(',');
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // scroll to top of the page
    window.scrollTo(0, 0);

    // Get mql object
    const mql = window.matchMedia('(max-width: 660px)');

    // add listener for the media query
    mql.addEventListener('change', () => {
      this.render();
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

  getDate = isoDateStr => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // userTimezone.replace('%2F', '/')

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    return `
      ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    `
  }

  getTemplate = () => {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        ${this.getTop()}
        <div class="content">
          ${this.getStoryBody()}
          ${this.getSection()}
        </div>
      `;
    }
    else {
      return /* html */`
        <div class="content">
          ${this.getTop()}
          ${this.getStoryBody()}
          ${this.getSection()}
        </div>

        <section class="side">
          ${this.getAuthor()}
          ${this.getRelatedStories()}
          ${this.getInfo()}
        </section>
      `;
    }
  }

  getTop = () => {
    return /* html */ `
      <header-wrapper section="Story" type="story"
        user-url="${this.getAttribute('user-url')}" auth-url="${this.getAttribute('auth-url')}"
        url="${this.getAttribute('story-url')}" search-url="${this.getAttribute('search-url')}">
      </header-wrapper>
    `
  }

  getStoryBody = () => {
    let str = this.topics[0];
    let formatted = str.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase());

    // Show HTML Here
    return /* html */ `
      <story-section topic="${formatted}" hash="${this.getAttribute('hash')}" url="${this.getAttribute('url')}"
        story-title="${this.getAttribute('story-title')}" replies="${this.getAttribute('replies')}" liked="${this.getAttribute('liked')}" likes="${this.getAttribute('likes')}"
        views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
        author-username="${this.getAttribute('author-username')}" author-picture="${this.getAttribute('author-img')}" author-name="${this.getAttribute('author-name')}"
        author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
        author-verified="${this.getAttribute('author-verified')}" author-url="${this.getAttribute('author-url')}"
        author-bio="${this.getAttribute('author-bio')}">
        ${this.getStoryContent()}
      </story-section>
    `
  }

  // fetchNextArticle = async () => {
  //   const url = `https://jsonplaceholder.typicode.com/posts/${this.getAttribute('next-id')}`;
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   return data;
  // }

  getStoryContent = () => {
    return /*html*/`
      <div class="intro">
          <p>If you’re looking for a Linux distribution, you’ve likely seen recommendations for both <a
            href="https://www.blogger.com/#">Debian</a> or <a href="https://www.blogger.com/#">Ubuntu</a>.
            <br>Their similarities, and the fact that Ubuntu is technically based on
            Debian, blur the lines between them.<br> Let’s explore the important
            differences.
          </p>
          <blockquote>
            Debian and Ubuntu are both popular Linux distributions, but they have
              different philosophies and target audiences. <br/> Debian is community-driven
              and focuses on stability, while Ubuntu is corporate-backed and
              emphasizes ease of use.
          </blockquote>
          <p>Following our <a href="https://femar.me">Series B last December</a>, I'm happy to announce we've raised a <a href=""><strong>$102M
              Series C</strong></a> from existing and new investors.</p>
          <p>Our vision of the Web is a global realtime medium for both creators
            and consumers,
            where all friction and latency are eliminated.</p>
          <p>We'll use this investment to:</p>
          <ol>
            <li>
              <a href="">Build the SDK for Web</a>
            </li>
            <li>
              <a href="">Lower the barrier of entry</a>
            </li>
            <li><a href="">Focus on the end-user</a></li>
          </ol>
          <hr />
        </div>
        <div class="section" id="section1">
          <h2 class="title">Debian Has Lower System Requirements</h2>
          <p>If the device you want to <strong>install Linux</strong> on is light on resources, you’ll
            want to note Debian and Ubuntu’s differing minimum requirements. <a href="https://www.blogger.com/#">A Debian 11 desktop
              install requires</a>
            at least a 1GHz processor, 1GB RAM, and
            10GB storage.
          </p>
          <p>
            <a href="https://www.blogger.com/#">Ubuntu Desktop more than doubles those requirements</a> with a
            2GHz dual-core processor, 4GB of RAM, and 25GB of disk space.
          </p>
          <p>That said, when we tested standard installations of both Debian 11
            and Ubuntu Desktop 20.04, the pull on resources didn’t differ
            significantly, using about 1GB of RAM at idle.
          </p>
          <p>
            For older devices, this
            can be asking a lot, so you may want a more minimal desktop. <br>That’s
            relatively easy to get with Debian, but for Ubuntu, you’re better off
            going with another “<a href="https://www.blogger.com/#">Ubuntu flavor</a>” like <a
              href="https://www.blogger.com/#">Lubuntu</a> or <a href="https://www.blogger.com/#">Xubuntu</a>.
          </p>
          <p>Why? Much of the resource consumption comes from the GNOME desktop environment (DE), not the <a
              href="https://www.blogger.com/#">operating system</a>
            itself.
          </p>
          <p>You can reduce&nbsp;Debian’s weight significantly if, at install,
            you simply choose a lightweight DE like Xfce or LXQt instead of GNOME
            (optionally, deselect “standard system utilities” as well to forgo most
            of the preinstalled apps).
          </p>
          <p>
            On Ubuntu, you could <a href="https://www.blogger.com/#">get one of those DEs after
            installation</a>, but that process is a bit more
            complicated and leaves you with an additional DE you might not use.
          </p>
        </div>
        <div class="section" id="section2">
          <h2 class="title">Ubuntu Makes Proprietary Software Easier to Get</h2>
          <p>Ubuntu and Debian take different approaches to the debate on free and <a href="https://www.blogger.com/#">open
              source</a>
            (FOSS) versus closed source or “proprietary” software.
          </p>
          <p>When you first
            run Debian, you don’t have immediate access to proprietary software,
            which includes popular apps like Spotify, Steam, and Microsoft Teams.
          </p>
          <p>
            This also includes drivers necessary to make some critical hardware
            work, including NVIDIA GPUs. You can only get that proprietary software
            by&nbsp;<a href="https://www.blogger.com/#">adding specific repositories</a> to your software sources, downloading
            <a href="https://www.blogger.com/#">DEB files</a> from official websites, or installing them through services like
            <a href="https://www.blogger.com/#">Snap</a> or <a href="https://www.blogger.com/#">Flathub</a>.
          </p>
          <p>In stark contrast, Ubuntu Desktop doesn’t hold any proprietary
            software back.
          </p>
          <p>Generally, if there’s a popular app available for Linux,
            you can get it with ease the moment you first boot up Ubuntu (an
            exception might be <a href="https://www.blogger.com/#">Google Chrome</a>). Ubuntu will also make sure you get all
            necessary hardware
            drivers at installation, proprietary and otherwise.
          </p>
          <p>Why the dramatic difference? Debian tries to serve a wider community
            by making it easy for people who are dedicated to the FOSS way of life
            to use Debian in good conscience.
          </p>
          <p>
            Ubuntu, however, prioritizes
            convenience for the everyday user who doesn’t care about code
            philosophies. If that’s you, you’ll likely find Ubuntu more appealing.</p>
        </div>
        <div class="section" id="section3">
          <h2 class="title">Debian Supports Older Hardware</h2>
          <p>If you’re thinking of <a href="https://www.blogger.com/#">reviving an aging device</a>
            with Linux, you’re more likely to have success with Debian. That’s
            partly because Debian still maintains support for 32-bit architectures
            (also known as&nbsp;i386).
          </p>
          <p> Most consumer PCs released in or after the year
            2009 use 64-bit architectures. But if your computer is from before that
            year, you may need a distribution (distro) that still supports 32-bit,
            such as Debian.
          </p>
          <p>Ubuntu, in contrast, dropped full 32-bit support with version 18.04.
            Earlier versions with 32-bit support are still available for download,
            but standard updates have already ended.
          </p>
          <p>Extended security updates&nbsp;for
            version 14.04 will continue only until April 2024 and April 2026 for
            16.04.
          </p>
          <p>The decision to drop 32-bit allowed the Ubuntu development team to
            focus on serving modern users with modern devices.
          </p>
          <p>The Debian team, in
            contrast, carries on the 32-bit legacy so that outmoded but otherwise
            functioning devices can stay out of the trash bin. These are two
            different but honorable objectives, and which serves you better depends
            on your device.
          </p>
        </div>
        <div class="section" id="section4">
          <h2 class="title">Ubuntu Is Corporate-Backed</h2>
          <p>Ubuntu is maintained by an organization called <a href="https://www.blogger.com/#">Canonical</a>.
            Debian, in contrast, is developed completely by a community of volunteers. Both offer their distros free of charge,
            but Canonical also
            offers paid support if you’re using Ubuntu professionally.</p>
        </div>
    `
  }

  getNextArticle = () => {
    return `
      <div class="next-article">
        <a href="/story/${this.getAttribute('next-id')}" class="article">
          <span class="title">Next article</span>
          <span class="text">${this.getAttribute('next-title')}</span>
          <span class="date">${this.getDate(this.getAttribute('next-date'))}</span>
        </a>
      </div>
    `
  }

  getForm = () => {
    return `
      <form-container type="story"></form-container>
    `
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper username="${this.getAttribute('author-username')}" picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
       verified="${this.getAttribute('author-verified')}" url="${this.getAttribute('author-url')}"
       bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getRelatedStories = () => {
    return /* html */`
			<related-container type="related" limit="5" topics='${this.getAttribute("topics")}'>
      </related-container>
		`
  }

  getSection = () => {
    return /* html */`
      <post-section url="${this.getAttribute('url')}" active="${this.getAttribute('tab')}" section-title="Story" username="${this.getAttribute('author-username')}"
        replies-url="${this.getAttribute('replies-url')}" likes-url="${this.getAttribute('likes-url')}">
      </post-section>
    `
  }

  getInfo = () => {
    return /*html*/`
      <info-container docs="/about/docs" new="/about/new"
       feedback="/about/feedback" request="/about/request" code="/about/code" donate="/about/donate" contact="/about/contact" company="https://github.com/aduki-hub">
      </info-container>
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
          width: 100%;
          gap: 30px;
          min-height: 100vh;
          justify-content: space-between;
        }

        div.content {
          padding: 0;
          width: 63%;
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        /* Responses */
        div.content section.responses {
          display: flex;
          flex-flow: column;
          gap: 0;
        }

        section.side {
          padding: 25px 0;
          margin: 0;
          background-color: transparent;
          width: 33%;
          height: max-content;
          display: flex;
          flex-flow: column;
          gap: 20px;
          position: sticky;
          top: 0;
          height: 100vh;
          max-height: 100vh;
          overflow-y: scroll;
          scrollbar-width: none;
        }

        section.side::-webkit-scrollbar {
          visibility: hidden;
          display: none;
        }

        @media screen and (max-width:900px) {
          div.content {
            width: 58%;
          }

          section.side {
            width: 40%;
          }
        }

				@media screen and (max-width:660px) {
					:host {
            font-size: 16px;
						padding: 0;
            margin: 0;
            display: flex;
            flex-flow: column;
            gap: 0;
					}

          div.content .head {
            margin: 10px 0 0 0;
          }

          div.content {
            /* border: 1px solid #000000; */
            padding: 0;
            width: 100%;
            display: flex;
            flex-flow: column;
            gap: 0;
          }

					.action,
					a {
						cursor: default !important;
          }

          section.side {
            padding: 0;
            display: none;
            width: 0%;
          }
				}
	    </style>
    `;
  }
}
