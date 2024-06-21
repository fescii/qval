export default class StorySection extends HTMLElement {
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

    // Add event listeners
    this.likePost();
    this.scrollLikes();
  }

  fetchStoryContent = (contentContainer) => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);

    const storyLoaders = this.shadowObj.querySelectorAll('story-loader');
    const content = this.getContent();
    setTimeout(() => {
      storyLoaders.forEach(loader  => {
        loader.remove()
      })
      contentContainer.insertAdjacentHTML('beforeend', content);

      // Add event listeners
      this.likePost();
      this.scrollLikes();
    }, 2000);
  }

  // fn to like a post
  likePost = () => {
    // Select like button
    const likeButton = this.shadowObj.querySelector('span.action.like');

    // If like button, add event listener
    if (likeButton) {
      // Get the svg node
      const svg = likeButton.querySelector('svg');


      likeButton.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Toggle the active class
        likeButton.classList.toggle('true');

        // Get the current like status
        const liked = this.getAttribute('liked') || 'false';

        // Get the total likes
        const likes = this.getAttribute('likes') || 0;

        // Parse the likes to an integer
        const totalLikes = this.parseToNumber(likes);

        // add scaling to the svg: reduce the size of the svg
        svg.style.transform = 'scale(0.8)';

        // Add a transition to the svg
        svg.style.transition = 'transform 0.2s ease-in-out';

        // Check if the user has liked the post
        if (liked === 'true') {
          // Set the new value of likes
          this.setAttribute('likes', totalLikes - 1);

          // Set the new value of liked
          this.setAttribute('liked', 'false');

          // replace the svg with the new svg
          setTimeout(() => {
            svg.innerHTML = `
              <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
            `;
            // scale the svg back to 1
            svg.style.transform = 'scale(1)';
          }, 200);
        }
        else {
          // Set the new value of likes
          this.setAttribute('likes', totalLikes + 1);

          // Set the new value of liked
          this.setAttribute('liked', 'true');

          // replace the svg with the new svg
          setTimeout(() => {
            svg.innerHTML = `
              <path d="M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"></path>
            `;

            // scale the svg back to 1
            svg.style.transform = 'scale(1)';
          }, 200);
        }

        // Re-render the component
        // this.render();

        // Scroll the likes
        this.scrollLikes();
      });
    }
  }

  // fn to take number and return a string with commas
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // fn to scroll likes numbers: bring the appropriate number into view
  scrollLikes = () => {
    // Check if user has liked the post
    const liked = this.getAttribute('liked') || 'false';

    // Get the numbers container
    const numbers = this.shadowObj.querySelector('.numbers.likes');

    // Get the previous and next elements
    if (numbers) {
      const prevElement = numbers.querySelector('#prev');
      const nextElement = numbers.querySelector('#next');

      // Check if the elements exist
      if (prevElement && nextElement) {
        // Get the height of the container
        const containerHeight = numbers.clientHeight;

        // Get the height of the previous and next elements
        // const prevHeight = prevElement.clientHeight;
        const nextHeight = nextElement.clientHeight;

        // If the user has liked the post, scroll to the next element
        if (liked === 'true') {
          // Scroll to the next element
          // numbers.scrollTo({ top: nextElement.offsetTop - containerHeight + nextHeight, behavior: 'smooth' });
          // numbers.scrollTo({ top: nextElement.offsetTop - containerHeight + nextHeight, behavior: 'smooth' });

          // Scroll to the next element using custom scrollTo
          this.scrollTo(numbers, nextElement.offsetTop - containerHeight + nextHeight, 200);
        }
        else {
          // Scroll to the top of the container
          // numbers.scrollTo({ top: 0, behavior: 'smooth' });

          // Scroll to the top of the container using custom scrollTo
          this.scrollTo(numbers, 0, 200);
        }
      }
    }
  }

  // Define the easeInOutQuad function for smoother scrolling
  easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  // Create a custom smooth scrollTo to accommodate chrome and other browsers
  scrollTo = (element, to, duration) => {
    const outThis = this;

    // Get the current scroll position
    let start = element.scrollTop,
      change = to - start,
      currentTime = 0,
      increment = 20;

    // Create the animation
    const animateScroll = function () {
      currentTime += increment;
      let val = outThis.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  formatNumber = n => {
    if (n >= 0 && n <= 999) {
      return n.toString();
    } else if (n >= 1000 && n <= 9999) {
      const value = (n / 1000).toFixed(2);
      return `${value}k`;
    } else if (n >= 10000 && n <= 99999) {
      const value = (n / 1000).toFixed(1);
      return `${value}k`;
    } else if (n >= 100000 && n <= 999999) {
      const value = (n / 1000).toFixed(0);
      return `${value}k`;
    } else if (n >= 1000000 && n <= 9999999) {
      const value = (n / 1000000).toFixed(2);
      return `${value}M`;
    } else if (n >= 10000000 && n <= 99999999) {
      const value = (n / 1000000).toFixed(1);
      return `${value}M`;
    } else if (n >= 100000000 && n <= 999999999) {
      const value = (n / 1000000).toFixed(0);
      return `${value}M`;
    } else {
      return "1B+";
    }
  }

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

  formatDateWithRelativeTime = isoDateStr => {
    // 1. Convert ISO date string with timezone to local Date object
    let date;
    try {
      date = new Date(isoDateStr);
    }
    catch (error) {
      date = new Date(Date.now())
    }

    // Get date
    const localDate = date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit'
    });

    // Get time
    let localTime = date.toLocaleDateString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });

    localTime = localTime.split(',')[1].trim();

    return { dateStr: localDate, timeStr: localTime }
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getContent()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    // check mql for mobile view
    const mql = window.matchMedia('(max-width: 660px)');
    return `
      ${this.getHeader()}
      <article class="article">
        ${this.innerHTML}
      </article>
      ${this.getAuthorContainer(mql.matches)}
      ${this.getMeta()}
      ${this.getShare()}
      ${this.getStats()}
      <form-container type="post"></form-container>
    `;
  }

  getHeader = () => {
    return `
      <div class="head">
        <span class="topic">${this.getAttribute('topic')}</span>
        <h1 class="story-title">${this.getAttribute('story-title')}</h1>
      </div>
    `
  }

  getAuthorContainer = mql => {
    return mql ? this.getAuthor() : '';
  }

  getMeta = () => {
    let dateObject = this.formatDateWithRelativeTime(this.getAttribute('time'))

    // Get total number of views
    let views = this.getAttribute('views');

    // views format
    views = this.numberWithCommas(views);


    return /* html */`
      <div class="meta">
        <span class="time">${dateObject.timeStr}</span>
        <span class="sp">•</span>
        <time class="published" datetime="${this.getAttribute('time')}">${dateObject.dateStr}</time>
        <span class="sp">•</span>
        <span class="views">
          <span class="no">${views}</span>
          <span class="text">views</span>
        </span>
      </div>
    `
  }

  getStats = () => {
    return /* html */`
      <div class="actions stats">
        <span class="action write open">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00016 1.83337C3.3755 1.83337 1.8335 3.37537 1.8335 8.00004C1.8335 12.6247 3.3755 14.1667 8.00016 14.1667C12.6248 14.1667 14.1668 12.6247 14.1668 8.00004" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0189 2.86915V2.86915C12.3569 2.28315 11.3456 2.34449 10.7596 3.00649C10.7596 3.00649 7.84694 6.29649 6.83694 7.43849C5.8256 8.57982 6.56694 10.1565 6.56694 10.1565C6.56694 10.1565 8.23627 10.6852 9.23227 9.55982C10.2289 8.43449 13.1563 5.12849 13.1563 5.12849C13.7423 4.46649 13.6803 3.45515 13.0189 2.86915Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.0061 3.86719L12.4028 5.98919" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${this.getReplies()}
          <span class="line"></span>
        </span>
        ${this.getLike(this.getAttribute('liked'))}
        ${this.getViews()}
      </div>
		`
  }

  getReplies = () => {
    // Get total replies and parse to integer
    const replies = this.getAttribute('replies') || 0;

    // Convert the replies to a number
    const totalReplies = this.parseToNumber(replies);

    //  format the number
    const repliesFormatted = this.formatNumber(totalReplies);

    return /*html*/`
      <span class="numbers">
        <span id="prev">${repliesFormatted}</span>
      </span>
    `
  }

  getViews = () => {
    // Get total views and parse to integer
    const views = this.getAttribute('views') || 0;

    // Convert the views to a number
    const totalViews = this.parseToNumber(views);

    // Format the number
    const viewsFormatted = this.formatNumber(totalViews);

    return /*html*/`
      <span class="stat views">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16">
          <path d="M8.75 1.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0V2.25a.75.75 0 0 1 .75-.75Zm-3.5 3a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Zm7 0a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75Z"></path>
        </svg>
        <span class="numbers">
          <span id="prev">${viewsFormatted}</span>
        </span>
      </span>
    `
  }

  getLike = liked => {
    if (liked === 'true') {
      return /*html*/`
        <span class="action like true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"></path>
          </svg>
          <span class="numbers likes">
            ${this.getLikeNumbers()}
          </span>
        </span>
			`
    }
    else {
      return /*html*/`
        <span class="action like">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
          </svg>
          <span class="numbers likes">
            ${this.getLikeNumbers()}
          </span>
        </span>
			`
    }
  }

  getLikeNumbers = () => {
    // Get total likes and parse to integer
    const likes = this.getAttribute('likes') || 0;
    const totalLikes = this.parseToNumber(likes);

    // Format the number
    const likesFormatted = this.formatNumber(totalLikes);

    // Check if user has liked the post
    const liked = this.getAttribute('liked') || 'false';

    // Check if the user has liked the post
    if (liked === 'true') {
      // next value is the current value
      const nextValue = likesFormatted;

      // Get the previous value by subtracting 1, if the value is less than 0, return 0: wrap in formatNumber
      const prevValue = this.formatNumber(totalLikes - 1 >= 0 ? totalLikes - 1 : 0);


      // Return the HTML for prev and next values
      return /*html*/`
        <span id="prev">${prevValue}</span>
        <span id="next">${nextValue}</span>
      `
    }
    else {
      // next value is the current value + 1
      const nextValue = this.formatNumber(totalLikes + 1);

      // the previous value is the current value
      const prevValue = likesFormatted;

      // Return the HTML for prev and next values
      return /*html*/`
        <span id="prev">${prevValue}</span>
        <span id="next">${nextValue}</span>
      `
    }
  }

  getAuthor = () => {
    return /* html */`
			<author-wrapper username="${this.getAttribute('author-username')}" picture="${this.getAttribute('author-picture')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
       verified="${this.getAttribute('author-verified')}" url="${this.getAttribute('author-url')}"
       bio="${this.getAttribute('author-bio')}">
      </author-wrapper>
		`
  }

  getShare = () => {
    // Get url to share
    const url = this.getAttribute('url');

    // Get window host url including https/http part
    let host = window.location.protocol + '//' + window.location.host;

    // combine the url with the host
    const shareUrl = `${host}${url}`;

    // Get the tilte of the story
    const title = this.getAttribute('story-title');


    return /* html */`
      <share-wrapper url="${shareUrl.toLowerCase()}" summery="${title}"></share-wrapper>
    `
  }

  getLoader = () => {
    return `
			<story-loader speed="300"></story-loader>
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
          padding: 0;
          display: flex;
          flex-flow: column;
          font-family: var(--font-read), sans-serif;
          gap: 0;
        }

        div.head {
          display: flex;
          flex-flow: column;
          gap: 0;
          margin: 0;
        }

        div.head > .topic {
          width: max-content;
          color: var(--white-color);
          margin: 5px 0;
          padding: 3px 10px 4px 10px;
          box-shadow: 0 0 0 1px #ffffff25, 0 2px 2px #0000000a, 0 8px 16px -4px #0000000a;
          background: var(--accent-linear);
          font-family: var(--font-read), sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        div.head > h1.story-title {
          margin: 0;
          padding: 0;
          font-weight: 700;
          font-size: 1.7rem;
          line-height: 1.5;
          font-family: var(--font-main), sans-serif;
          color: var(--title-color);
        }

        .meta {
          border-bottom: var(--border);
          border-top: var(--border);
          margin: 10px 0 0;
          padding: 12px 0;
          display: flex;
          position: relative;
          color: var(--text-color);
          align-items: center;
          font-family: var(--font-text), sans-serif;
          gap: 5px;
          font-size: 1rem;
          font-weight: 600;
        }

        .stats.actions {
          /* border: var(--input-border); */
          padding: 5px 0 0 0;
          margin: 0 0 15px 0;
          display: flex;
          align-items: center;
          gap: 0;
        }

        .stats.actions > span.write.action {
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          font-family: var(--font-text) sans-serif;
          font-size: 0.95rem;
          justify-content: start;
          gap: 5px;
          padding: 5px 5px;
          height: 30px;
          border-radius: 50px;
          font-weight: 500;
          font-size: 1rem;
          color: var(--gray-color);
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        .stats.actions > span.write.action > svg {
          width: 19px;
          height: 19px;
          margin: -2px 0 0 0;
        }

        .stats.actions > span.write.action span.line {
          background: var(--accent-linear);
          position: absolute;
          top: 30px;
          left: 13px;
          display: none;
          width: 3px;
          height: 20px;
          border-radius: 5px;
        }

        .stats.actions > span.write.action.open span.line {
          display: inline-block;
        }

        .stats.actions > span.write.action.open {
          color: var(--accent-color);
        }

        .stats.actions > span.write.action.open > span.numbers {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .stats.actions > span.stat,
        .stats.actions > span.action {
          min-height: 35px;
          height: 30px;
          width: max-content;
          position: relative;
          padding: 5px 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 1rem;
          font-weight: 400;
          color: var(--gray-color);
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        .stats.actions > span.stat.views {
          gap: 2px;
        }

        .stats.actions > span.stat.views {
          padding: 5px 5px;
        }

        .stats.actions > span:first-of-type {
          margin: 0 0 0 -7px;
        }

        .stats.actions > span.action.share {
          min-height: 35px;
          height: 35px;
          width: 35px;
          max-width: 35px;
          padding: 0;
        }

        .stats.actions > span.play:hover,
        .stats.actions > span.stat:hover,
        .stats.actions > span.action:hover {
          background: var(--hover-background);
        }

        .stats.actions > span.stat.views:hover {
          background: inherit;
        }

        .stats.actions span.numbers {
          /* border: var(--input-border); */
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .stats.actions > span {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          font-size: 1rem;
          font-weight: 400;
        }

        .stats.actions > .stat > .numbers,
        .stats.actions > .action > .numbers {
          height: 21px;
          min-height: 21px;
          padding: 0;
          margin: 0;
          display: flex;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          gap: 0;
          align-items: start;
          justify-content: start;
          flex-flow: column;
          transition: height 0.5s ease, min-height 0.5s ease; /* Specify the properties to transition */
          -ms-overflow-style: none;
          scrollbar-width: none;
          will-change: transform;
        }

        .stats.actions > span > .numbers::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        .stats.actions > span > .numbers > span {
          scroll-snap-align: start;
          transition: height 0.5s ease, min-height 0.5s ease;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 21px;
          min-height: 21px;
          padding: 3px 0;
          margin: 0;
          font-family: var(--font-main), sans-serif;
          font-size: 0.95rem;
        }

        .stats.actions > span.true > .numbers > span,
        .stats.actions > span.active > .numbers > span {
          color: transparent;
          background: var(--second-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .stats.actions > span.up > .numbers > span {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .stats.actions > span.down > .numbers > span {
          color: transparent;
          background: var(--error-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .stats.actions > span.action.share {
          min-width: 45px;
        }

        .stats.actions > span.action.share > .icon {
          display: flex;
          gap: 0;
        }
        .stats.actions > span.action.share > .icon > span.sp {
          display: inline-block;
          font-size: 1.2rem;
          margin: 0 0 2px 0;
          /* color: var(--gray-color); */
        }

        .stats.actions > span svg {
          color: inherit;
          width: 16px;
          height: 16px;
        }

        .stats.actions > span.action.like svg {
          margin: -1px 0 0 0;
          width: 16px;
          height: 16px;
          transition: transform 0.5s ease;
        }

        .stats.actions > span.stat.views svg {
          color: inherit;
          width: 16px;
          height: 16px;
        }

        .stats.actions > span.stat.up svg {
          color: var(--accent-color);
        }

        .stats.actions > span.stat.down svg {
          color: var(--error-color);
        }

        .stats.actions > span.true svg,
        .stats.actions > span.active svg {
          color: var(--alt-color);
        }

        article.article {
          margin: 3px 0 15px;
          display: flex;
          flex-flow: column;
          color: var(--read-color);
          font-family: var(--font-read), sans-serif;
          gap: 15px;
          font-size: 1rem;
          font-weight: 400;
        }

        article.article * {
          font-size: 1.05rem;
          line-height: 1.4;
          color: inherit;
          font-family: inherit;
        }

        article.article .section {
          margin: 0;
          padding: 0;
          display: flex;
          flex-flow: column;
        }

        article.article > .section h2.title {
          padding: 0 !important;
          font-size: 1.3rem !important;
          color: var(--title-color);
          font-weight: 500;
          line-height: 1.5;
          margin: 0;
        }

        article.article h6,
        article.article h5,
        article.article h4,
        article.article h3,
        article.article h1 {
          padding: 0 !important;
          font-size: 1.3rem !important;
          color: var(--title-color);
          font-weight: 500;
          line-height: 1.5;
          margin: 5px 0;
        }

        article.article p {
          margin: 5px 0;
          line-height: 1.5;
        }

        article.article a {
          text-decoration: none;
          cursor: pointer;
          color: var(--anchor-color) !important;
        }

        article.article a:hover {
          text-decoration: underline;
        }

        article.article blockquote {
          margin: 10px 0;
          padding: 5px 15px;
          font-style: italic;
          border-left: 2px solid var(--gray-color);
          background: var(--background);
          color: var(--text-color);
          font-weight: 400;
        }

        article.article blockquote:before {
          content: open-quote;
          color: var(--gray-color);
          font-size: 1.5rem;
          line-height: 1;
          margin: 0 0 0 -5px;
        }

        article.article blockquote:after {
          content: close-quote;
          color: var(--gray-color);
          font-size: 1.5rem;
          line-height: 1;
          margin: 0 0 0 -5px;
        }

        article.article hr {
          border: none;
          background-color: var(--gray-color);
          height: 1px;
          margin: 10px 0;
        }

        article.article b,
        article.article strong {
          font-weight: 500;

        }

        article.article ul,
        article.article ol {
          margin: 5px 0 15px 20px;
          padding: 0 0 0 15px;
          color: inherit;
        }

        @media screen and (max-width:660px) {
          :host {
            margin: 0 0 15px;
          }

          * {
            font-size: 1rem;
            line-height: 1.4;
            color: inherit;
            font-family: inherit;
          }

          a {
            cursor: default !important;
          }

          .meta {
            border-bottom: var(--border-mobile);
            border-top: none;
            margin: 5px 0 0 0;
            padding: 12px 0;
            display: flex;
            position: relative;
            color: var(--text-color);
            align-items: center;
            font-family: var(--font-text), sans-serif;
            font-size: 0.95rem;
            gap: 5px;
            font-weight: 600;
          }

          .stats {
            padding: 10px 0;
          }

          a,
          .stats > .stat {
            cursor: default !important;
          }

          a,
          .poll > .poll-options > .poll-option label,
          span.stat,
          span.action {
            cursor: default !important;
          }

          .stats.actions > span.play:hover,
          .stats.actions > span.stat:hover,
          .stats.actions > span.action:hover {
            background: none;
          }

          .stats.actions > span.action.share > .overlay {
            position: fixed;
            background-color: var(--modal-overlay);
            z-index: 100;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            display: none;
          }

          .stats.actions > span.action.share > .overlay span.close {
            display: flex;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
          }

          .stats.actions > span.action.share .options {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: space-around;
            z-index: 1;
            gap: 0;
            box-shadow: var(--card-box-shadow);
            width: 100%;
            padding: 15px 8px;
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            background: var(--background);
            border: var(--border-mobile);
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }

          .stats.actions > span.action.share .options > .option {
            display: flex;
            flex-flow: column-reverse;
            align-items: center;
            justify-content: space-between;
            gap: 5px;
            padding: 10px;
          }

          .stats.actions > span.action.share .options > .option > svg {
            width: 30px;
            height: 30px;
          }

          .stats.actions > span.action.share .options > .option.code > svg {
            width: 29px;
            height: 29px;
          }

          .stats.actions > span.action.share .options > .option.more > svg {
            width: 27px;
            height: 27px;
          }

          .stats.actions > span.action.share .options > .option > span.text {
            font-family: var(--font-read), sans-serif;
            font-weight: 400;
            font-size: 0.8rem;
          }

        }
      </style>
    `;
  }
}