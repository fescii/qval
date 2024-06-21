export default class QuickPost extends HTMLElement {
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
    // open the form
    this.openForm();

    // scroll the likes
    this.scrollLikes();

    // activate the like button
    this.likePost();

    // Open read more
    this.openReadMore();

    // Open full post
    this.openQuickPost()
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

  // Open quick post
  openQuickPost = () => {
    // get url
    let url = this.getAttribute('url');

    url = url.trim().toLowerCase();

    // Get the body
    const body = document.querySelector('body');

    // get current content
    const content = this.shadowObj.querySelector('#content')

    if(body && content) {
      content.addEventListener('click', event => {
        event.preventDefault();

        // Get full post
        const post =  this.getFullPost();
  
        // replace and push states
        this.replaceAndPushStates(url, body, post);

        body.innerHTML = post;
      })
    }
  }

   // Replace and push states
   replaceAndPushStates = (url, body, post) => {
    // Replace the content with the current url and body content
    // get window location
    const pageUrl = window.location.href;
    window.history.replaceState(
      { page: 'page', content: body.innerHTML },
      url, pageUrl
    );

    // Updating History State
    window.history.pushState(
      { page: 'page', content: post},
      url, url
    );
  }

  // Get lapse time
  getLapseTime = (isoDateStr) => {
    const dateIso = new Date(isoDateStr); // ISO strings with timezone are automatically handled
    let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Convert posted time to the current timezone
    const date = new Date(dateIso.toLocaleString('en-US', { timeZone: userTimezone }));

    // Get the current time
    const currentTime = new Date();

    // Get the difference in time
    const timeDifference = currentTime - date;

    // Get the seconds
    const seconds = timeDifference / 1000;

    // Check if seconds is less than 60: return Just now
    if (seconds < 60) {
      return 'Just now';
    }
    // check if seconds is less than 86400: return time AM/PM
    if (seconds < 86400) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }

    // check if seconds is less than 604800: return day and time
    if (seconds <= 604800) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: true });
    }

    // Check if the date is in the current year:: return date and month short 2-digit year without time
    if (date.getFullYear() === currentTime.getFullYear()) {
      return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', });
    }
    else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  // fn to like a post
  likePost = () => {
    // Select like button
    const likeButton = this.shadowObj.querySelector('.action.like');

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

  // Open read more
  openReadMore = () => {
    // Get the read more button
    const readMore = this.shadowObj.querySelector('.content .read-more');

    // Get the content
    const content = this.shadowObj.querySelector('.content');

    // Check if the read more button exists
    if (readMore && content) {
      readMore.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // Prevent event from reaching any immidiate nodes.
        e.stopImmediatePropagation()

        // Toggle the active class
        content.classList.remove('extra');

        // remove the read more button
        readMore.remove();
      });
    }
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

  openForm = () => {
    const writeBtn = this.shadowObj.querySelector('span.action.write');
    const formContainer = this.shadowObj.querySelector('div.form-container');
    if (writeBtn && formContainer) {
      const formElement = this.getForm();

      writeBtn.addEventListener('click', event => {
        event.preventDefault();

        // console.log(writeContainer);
        // console.log(formElement);

        // writeContainer.classList.toggle('active');
        if (writeBtn.classList.contains('open')) {
          writeBtn.classList.remove('open');

          // adjust the margin top of the form container
          formContainer.style.setProperty('margin-top', '0');
          formContainer.innerHTML = '';
        }
        else {
          writeBtn.classList.add('open');
          // adjust the margin top of the form container
          formContainer.style.setProperty('margin-top', '15px');

          // Add the form to the form container
          formContainer.insertAdjacentHTML('beforeend', formElement);
        }
      })
    }
  }

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody() {
    return `
      ${this.getHeader()}
      ${this.getContent()}
      ${this.getFooter()}
      <div class="form-container"></div>
    `;
  }

  getHeader = () => {
    let authorUrl = this.getAttribute('author-url');
    authorUrl = authorUrl.trim().toLowerCase();
    return /*html*/`
      <div class="meta top-meta">
        <span class="by">by</span>
        ${this.getAuthorHover()}
        <span class="sp">•</span>
        <time class="time" datetime="${this.getAttribute('time')}">
          ${this.getLapseTime(this.getAttribute('time'))}
        </time>
      </div>
    `
  }

  getContent = () => {
    const content = this.innerHTML;

    // Convert content to str and check length
    const contentStr = content.toString();
    const contentLength = contentStr.length;

    // Check if content length is greater than 400
    if (contentLength > 400) {
      return /*html*/`
        <div class="content extra" id="content">
          ${content}
          <div class="read-more">
            <span class="action">view more</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
            </svg>
          </div>
        </div>
      `
    }
    else {
      return /*html*/`
        <div class="content" id="content">
          ${content}
        </div>
      `
    }
  }

  getFooter = () => {
    return /* html */`
      <div class="actions stats">
        <span class="action write">
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
    const opinionsFormatted = this.formatNumber(totalReplies);

    return /*html*/`
      <span class="numbers">
        <span id="prev">${opinionsFormatted}</span>
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

  getLike = (liked) => {
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

  getForm = () => {
    return `
      <form-container type="reply"></form-container>
    `
  }

  getAuthorHover = () => {
    let url = this.getAttribute('author-url');
    url = url.trim().toLowerCase();
    return /* html */`
			<hover-author url="${url}" you="${this.getAttribute('author-you')}" username="${this.getAttribute('author-username')}"
        picture="${this.getAttribute('author-img')}" name="${this.getAttribute('author-name')}"
       followers="${this.getAttribute('author-followers')}" following="${this.getAttribute('author-following')}" user-follow="${this.getAttribute('author-follow')}"
       verified="${this.getAttribute('author-verified')}" bio='${this.getAttribute("author-bio")}'>
      </hover-author>
		`
  }

  getFullPost = () => {
    return /* html */`
      <app-post story="quick" tab="replies" url="${this.getAttribute('url')}" hash="${this.getAttribute('hash')}"
        likes="${this.getAttribute('likes')}" replies="${this.getAttribute('replies')}"
        replies-url="${this.getAttribute('replies-url')}" likes-url="${this.getAttribute('likes-url')}"
        liked="${this.getAttribute('liked')}" views="${this.getAttribute('views')}" time="${this.getAttribute('time')}"
        author-you="${this.getAttribute('author-you')}"
        author-username="${this.getAttribute('author-username')}" author-url="${this.getAttribute('author-url')}"
        author-img="${this.getAttribute('author-img')}" author-verified="${this.getAttribute('author-verified')}" author-name="${this.getAttribute('author-name')}"
        author-followers="${this.getAttribute('author-followers')}" author-following="${this.getAttribute('author-following')}" author-follow="${this.getAttribute('author-follow')}"
        author-bio="${this.getAttribute('author-bio')}">
        ${this.innerHTML}
      </app-post>
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
        border-bottom: var(--border);
        font-family: var(--font-main), sans-serif;
        padding: 15px 0 10px;
        margin: 0;
        width: 100%;
        display: flex;
        flex-flow: column;
        gap: 0;
      }

      .meta {
        height: max-content;
        display: flex;
        position: relative;
        color: var(--gray-color);
        align-items: center;
        font-family: var(--font-mono),monospace;
        gap: 5px;
        font-size: 0.9rem;
        line-height: 1.5;
      }

      .meta > span.sp {
        margin: 1px 0 0 0;
      }

      .meta > time.time {
        font-family: var(--font-main), sans-serif;
        font-size: 0.83rem;
        font-weight: 500;
        margin: 1px 0 0 0;
      }

      .meta a.link {
        text-decoration: none;
        color: transparent;
        background-image: var(--action-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .meta  a.author-link {
        text-decoration: none;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .content {
        display: flex;
        cursor: pointer;
        flex-flow: column;
        color: var(--text-color);
        line-height: 1.4;
        gap: 0;
        margin: 0;
        padding: 0;
      }

      .content.extra {
        max-height: 200px;
        overflow: hidden;
        position: relative;
      }

      .content.extra .read-more {
        position: absolute;
        bottom: -5px;
        right: 0;
        left: 0;
        width: 100%;
        padding: 5px 0;
        display: flex;
        align-items: end;
        justify-content: center;
        min-height: 80px;
        gap: 3px;
        cursor: pointer;
        font-weight: 500;
        font-family: var(--font-text), sans-serif;
        color: var(--gray-color);
        background: var(--fade-linear-gradient);
      }

      .content.extra .read-more svg {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin: 0 0 2px 0;
      }

      .content p {
        margin: 0 0 5px 0;
        padding: 0;
        line-height: 1.4;
        font-family: var(--font-text), sans-serif;
      }

      .content p:last-of-type {
        margin: 0;
      }

      .content a {
        cursor: pointer;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
      }

      .content a:hover {
        text-decoration-color: var(--anchor-active) !important;
        text-decoration: underline;
        -moz-text-decoration-color: var(--anchor-active) !important;
      }

      .content ul,
      .content ol {
        margin: 10px 0 0 20px;
        line-height: 1.4;
        color: var(--font-text);
        font-family: var(--font-text), sans-serif;
      }

      .content ul a,
      .content ol a {
        background: unset;
        color:var(--font-text);
        font-weight: 500;
        text-decoration-color: var(--anchor) !important;
        text-decoration: underline;
        -moz-text-decoration-color: var(--anchor) !important;
      }

      .content ul a:hover,
      .content ol a:hover {
        text-decoration-color: #4b5563bd !important;
        -moz-text-decoration-color: #4b5563bd !important;
      }

      .stats.actions {
        /*border: var(--input-border);*/
        padding: 5px 0 0 1px;
        margin: 0;
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
        /* border: var(--input-border); */
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
        margin: 0 0 0 -5px;
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
        /* border: 1px solid red; */
        scroll-snap-align: start;
         transition: height 0.5s ease, min-height 0.5s ease; /* Specify the properties to transition */
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

      @media screen and (max-width:660px) {
        :host {
          font-size: 16px;
          border-bottom: var(--border-mobile);
        }

        ::-webkit-scrollbar {
          -webkit-appearance: none;
        }

        .meta a.reply-link,
        .meta div.author-name > a,
        a,
        .stats > .stat {
          cursor: default !important;
        }


        a,
        .content.extra .read-more,
        .content,
        span.stat,
        span.action {
          cursor: default !important;
        }

        .stats.actions {
          padding: 5px 0 0 0;
        }

        .stats.actions > span.play:hover,
        .stats.actions > span.stat:hover,
        .stats.actions > span.action:hover {
          background: none;
        }
      }
    </style>
    `;
  }
}