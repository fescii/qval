export default class ActionWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // check if the user is authenticated
    this._authenticated = window.hash ? true : false;

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.parent = this.getRootNode().host;

    this.outer = this.parent.getRootNode().host;

    this._isWrapper = this.convertToBool(this.getAttribute('wrapper'));

    this.render();
  }

  // observe the attributes
  static get observedAttributes() {
    return ['reload', 'likes', 'views', 'replies', 'liked'];
  }

  // listen for changes in the attributes
  attributeChangedCallback(name, oldValue, newValue) {
    // check if old value is not equal to new value
    if (name==='reload') {
      if(newValue === 'true') {
        // set the value of reload to false
        this.setAttribute('reload', 'false');
        this.reRender();
      }
    }
  }

  render() {
    const full = this.convertToBool(this.getAttribute('full'));
    this.shadowObj.innerHTML = this.getTemplate(full);
  }

  reRender = () => {
    this.render();
    // like post
    this.likePost();
    // Check if user has liked the post
    const liked = this.convertToBool(this.getAttribute('liked'))

    const body = document.querySelector('body');
     
    // scroll likes
    this.scrollLikes(liked);

    const full = this.convertToBool(this.getAttribute('full'))

    // open the form
    this.openForm(full);

    // open the highlights
    this.openHighlights(body);
  }

  connectedCallback() {
    // like post
    this.likePost();
    // Check if user has liked the post
    const liked = this.convertToBool(this.getAttribute('liked'))

    const body = document.querySelector('body');
     
    // scroll likes
    this.scrollLikes(liked);

    const full = this.convertToBool(this.getAttribute('full'))

    // open the form
    this.openForm(full);

    // open the highlights
    this.openHighlights(body);
  }

  updateViews = (element, value) => {
    // update views in the element and this element
    this.setAttribute('views', value);
    element.textContent = value;
  }

  updateReplies = (element, value) => {
    // update replies in the element and this element
    this.setAttribute('replies', value);
    element.textContent = value;
  }

  setAttributes = (name, value) => {
    if (this._isWrapper) {
      this.parent.setAttribute(name, value);
      this.outer.setAttribute(name, value);
    }
    else {
      this.parent.setAttribute(name, value);
    }
  }

  openHighlights = body => {
    // Get the stats action and subscribe action
    const statsBtn = this.shadowObj.querySelector('.stats > .stat.views');

    // add event listener to the stats action
    if (statsBtn) {
      statsBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        // Open the highlights popup
        body.insertAdjacentHTML('beforeend', this.getHighlights());
      });
    }
  }

  convertToBool = str => {
    switch (str) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return false;
    }
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

  openForm = full => {
    const writeBtn = this.shadowObj.querySelector('span.action.write');
    const formContainer = this.shadowObj.querySelector('div.form-container');
    if (writeBtn && formContainer && !full) {
      const formElement = this.getForm();

      writeBtn.addEventListener('click', event => {
        event.preventDefault();

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

  // perform actions
  performActions = (likeBtn, liked) => {
    // get url to 
    let baseUrl = this.getAttribute('url');

    // base api
    const url = `/api/v1${baseUrl}/like`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }

    // Follow the topic
    this.like(url, options, likeBtn, liked);
  }

  like = (url, options, likeBtn, liked) => {
    const outerThis = this;
    this.fetchWithTimeout(url, options)
      .then(response => {
        response.json()
        .then(data => {
          // If data has unverified, open the join popup
          if (data.unverified) {
            // Get body
            const body = document.querySelector('body');

            // Open the join popup
            outerThis.openJoin(body);

            // revert the like button
            outerThis.updateLikeBtn(likeBtn, liked);
          }

          // if success is false, show toast message
          if (!data.success) {
            outerThis.showToast(data.message, false);

            // revert the like button
            outerThis.updateLikeBtn(likeBtn, liked);
          }
          else {
            // Show toast message
            outerThis.showToast(data.message, true);

            // check the data.liked
            if (data.liked !== liked) {
              // revert the like button
              outerThis.updateLikeBtn(likeBtn, data.liked ? false : true); 
            }
          }
        });
      })
      .catch(_error => {
        // console.log(_error);
        // show toast message
        outerThis.showToast('An error occurred while following the user', false);

        // revert the like button
        outerThis.updateLikeBtn(likeBtn, liked);
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
  };

  showToast = (text, success) => {
    // Get the toast element
    const toast = this.getToast(text, success);

    // Get body element
    const body = document.querySelector('body');

    // Insert the toast into the DOM
    body.insertAdjacentHTML('beforeend', toast);

    // Remove the toast after 3 seconds
    setTimeout(() => {
      // Select the toast element
      const toast = body.querySelector('.toast');

      // Remove the toast
      if(toast) {
        toast.remove();
      }
    }, 3000);
  }

  getToast = (text, success) => {
    if (success) {
      return /* html */`
        <div class="toast true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
        </svg>
          <p class="toast-message">${text}</p>
        </div>
      `;
    }
    else {
      return /* html */`
      <div class="toast false">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
        </svg>
          <p class="toast-message">${text}</p>
        </div>
      `;
    }
    
  }

  openJoin = body => {
    // Insert getJoin beforeend
    body.insertAdjacentHTML('beforeend', this.getJoin());
  }

  getJoin = () => {
    // get url from the : only the path
    const url = window.location.pathname;

    return /* html */`
      <join-popup register="/join/register" login="/join/login" next="${url}"></join-popup>
    `
  }

  updateLikeBtn = (btn, liked) => {
    const svg = btn.querySelector("svg");

    // Toggle the active class
    btn.classList.toggle("true");

    // Parse the likes to an integer
    const totalLikes = this.parseToNumber(this.getAttribute("likes"));

    // add scaling to the svg: reduce the size of the svg
    svg.style.transform = "scale(0.8)";

    // Add a transition to the svg
    svg.style.transition = "transform 0.2s ease-in-out";

    this.scrollLikes(liked ? false : true);

    // Check if the user has liked the post
    if (liked) {
      // Set the new value of likes
      this.setAttribute("likes", totalLikes - 1);

      // Set the new value of liked
      this.setAttribute("liked", "false");

      // replace the svg with the new svg
      setTimeout(() => {
        svg.innerHTML = `
              <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
            `;
        // scale the svg back to 1
        svg.style.transform = "scale(1)";
      }, 200);
    } else {
      // Set the new value of likes
      this.setAttribute("likes", totalLikes + 1);

      // Set the new value of liked
      this.setAttribute("liked", "true");

      // replace the svg with the new svg
      setTimeout(() => {
        svg.innerHTML = `
              <path d="M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"></path>
            `;

        // scale the svg back to 1
        svg.style.transform = "scale(1)";
      }, 200);
    }
  }

  // fn to like a post
  likePost = () => {
    const outerThis = this;
    // Select like button
    const likeButton = this.shadowObj.querySelector('.action.like');

    const body = document.querySelector('body');

    // If like button, add event listener
    if (likeButton) {
      // Get the svg node
      const svg = likeButton.querySelector('svg');

      likeButton.addEventListener('click', e => {
        // prevent the default action
        e.preventDefault()

        // prevent the propagation of the event
        e.stopPropagation();

        // check if the user is authenticated
        // Check if the user is authenticated
        if (!outerThis._authenticated) {
          // Open the join popup
          outerThis.openJoin(body);

          // prevet this function from proceeding
          return;
        } 

        // Toggle the active class
        likeButton.classList.toggle('true');

        // Get the current like status
        const liked = outerThis.convertToBool(this.getAttribute('liked'));

        // Parse the likes to an integer
        const totalLikes = this.parseToNumber(this.getAttribute('likes'));

        // add scaling to the svg: reduce the size of the svg
        svg.style.transform = 'scale(0.8)';

        // Add a transition to the svg
        svg.style.transition = 'transform 0.2s ease-in-out';

        // Check if the user has liked the post
        if (liked) {
          // Set the new value of likes
          this.setAttribute('likes', totalLikes - 1);
          outerThis.setAttributes('likes', totalLikes - 1)

          // Set the new value of liked
          this.setAttribute('liked', 'false');
          outerThis.setAttributes('liked', 'false');

          // replace the svg with the new svg
          setTimeout(() => {
            svg.innerHTML = `
              <path d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"></path>
            `;
            // scale the svg back to 1
            svg.style.transform = 'scale(1)';
          }, 200);

          // perform like
          outerThis.performActions(likeButton, false);
        }
        else {
          // Set the new value of likes
          this.setAttribute('likes', totalLikes + 1);
          outerThis.setAttributes('likes', totalLikes + 1);

          // Set the new value of liked
          this.setAttribute('liked', 'true');
          outerThis.setAttributes('liked', 'true');

          // replace the svg with the new svg
          setTimeout(() => {
            svg.innerHTML = `
              <path d="M7.655 14.916v-.001h-.002l-.006-.003-.018-.01a22.066 22.066 0 0 1-3.744-2.584C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.044 5.231-3.886 6.818a22.094 22.094 0 0 1-3.433 2.414 7.152 7.152 0 0 1-.31.17l-.018.01-.008.004a.75.75 0 0 1-.69 0Z"></path>
            `;

            // scale the svg back to 1
            svg.style.transform = 'scale(1)';
          }, 200);

          // perform like
          outerThis.performActions(likeButton, true)
        }
        // Scroll the likes
        this.scrollLikes(liked ? false : true);
      });
    }
  }

  // fn to scroll likes numbers: bring the appropriate number into view
  scrollLikes = liked => {
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
        if (liked) {
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
    } else if (n >= 1000000000) {
      return "1B+";
    }
    else {
      return 0;
    }
  }

  parseToNumber = str => {
    // Try parsing the string to an integer
    const num = parseInt(str);

    // Check if parsing was successful
    if (!isNaN(num)) {
      return num;
    } else {
      return 0;
    }
  }

  getTemplate = full => {
    // Show HTML Here
    if (full) {
      return `
        ${this.getStats()}
          <div class="form-container">${this.getForm()}</div>
        ${this.getStyles()}
      `;
    } else {
     return `
        ${this.getStats()}
          <div class="form-container"></div>
        ${this.getStyles()}
      `;
    }
  }

  getStats = () => {
    return /* html */`
      <div class="actions stats">
        ${this.getWrite(this.convertToBool(this.getAttribute('full')))}
        ${this.getLike(this.getAttribute('liked'))}
        ${this.getViews()}
        ${this.getShare()}
      </div>
		`
  }

  getWrite = full => {
    if (full) {
      return /*html*/`
        <span class="action write open">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00016 1.83337C3.3755 1.83337 1.8335 3.37537 1.8335 8.00004C1.8335 12.6247 3.3755 14.1667 8.00016 14.1667C12.6248 14.1667 14.1668 12.6247 14.1668 8.00004" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0189 2.86915V2.86915C12.3569 2.28315 11.3456 2.34449 10.7596 3.00649C10.7596 3.00649 7.84694 6.29649 6.83694 7.43849C5.8256 8.57982 6.56694 10.1565 6.56694 10.1565C6.56694 10.1565 8.23627 10.6852 9.23227 9.55982C10.2289 8.43449 13.1563 5.12849 13.1563 5.12849C13.7423 4.46649 13.6803 3.45515 13.0189 2.86915Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.0061 3.86719L12.4028 5.98919" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${this.getReplies()}
          <span class="line"></span>
        </span>
      `
    }
    else {
      return /*html*/`
        <span class="action write">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00016 1.83337C3.3755 1.83337 1.8335 3.37537 1.8335 8.00004C1.8335 12.6247 3.3755 14.1667 8.00016 14.1667C12.6248 14.1667 14.1668 12.6247 14.1668 8.00004" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0189 2.86915V2.86915C12.3569 2.28315 11.3456 2.34449 10.7596 3.00649C10.7596 3.00649 7.84694 6.29649 6.83694 7.43849C5.8256 8.57982 6.56694 10.1565 6.56694 10.1565C6.56694 10.1565 8.23627 10.6852 9.23227 9.55982C10.2289 8.43449 13.1563 5.12849 13.1563 5.12849C13.7423 4.46649 13.6803 3.45515 13.0189 2.86915Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.0061 3.86719L12.4028 5.98919" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          ${this.getReplies()}
          <span class="line"></span>
        </span>
      `
    }
  }

  getForm = () => {
    return /* html*/`
      <form-container full="${this.getAttribute('full')}" type="reply"></form-container>
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

  getShare = () => {
    // Get url to share
    const url = this.getAttribute('url');

    // Get window host url including https/http part
    let host = window.location.protocol + '//' + window.location.host;

    // combine the url with the host
    const shareUrl = `${host}${url}`;

    // Get the tilte of the story
    const title = this.getAttribute('summary');


    return /* html */`
      <share-wrapper url="${shareUrl.toLowerCase()}" summary="${title}"></share-wrapper>
    `
  }

  getHighlights = () => {
    return /* html */`
      <views-popup name="post"likes="${this.getAttribute('likes')}" liked="${this.getAttribute('liked')}" views="${this.getAttribute('views')}"
        replies="${this.getAttribute('replies')}">
      </views-popup>
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
          margin: 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          gap: 0;
          padding: 5px 0;
        }

        .actions.stats {
          padding: 0;
          margin: 0 0 ${this.getAttribute('full') === 'true' ? '15px' : '0'} 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 0;
        }

        span.write.action {
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          font-family: var(--font-text) sans-serif;
          font-size: 0.95rem;
          justify-content: start;
          gap: 5px;
          padding: 5px 10px;
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

        span.write.action > svg {
          width: 19px;
          height: 19px;
          margin: -1px 0 0 0;
        }

        span.write.action span.line {
          background: var(--accent-linear);
          position: absolute;
          top: 30px;
          left: 18px;
          display: none;
          width: 3px;
          height: 16px;
          border-radius: 5px;
        }

        span.write.action.open span.line {
          display: inline-block;
        }

        span.write.action.open {
          color: var(--accent-color);
        }

        span.write.action.open > span.numbers {
          color: transparent;
          background: var(--accent-linear);
          font-weight: 500;
          background-clip: text;
          -webkit-background-clip: text;
        }

        span.stat,
        span.action {
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
          color: var(--action-color);
          color: var(--gray-color);
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        span:first-of-type {
          margin: 0 0 0 -7px;
        }

        span.play:hover,
        span.stat:hover,
        span.action:hover {
          background: var(--hover-background);
        }

        .action span.numbers {
          font-family: var(--font-main), sans-serif;
          font-size: 1rem;
          font-weight: 500;
        }

        .action span {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          font-size: 1rem;
          font-weight: 400;
        }

        .stat > .numbers,
        .action > .numbers {
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
          transition: height 0.5s ease, min-height 0.5s ease; 
          -ms-overflow-style: none;
          scrollbar-width: none;
          will-change: transform;
        }

        span > .numbers::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        span > .numbers > span {
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
          font-weight: 500;
          font-family: var(--font-main), sans-serif;
          font-size: 0.95rem;
        }

        span.true > .numbers > span,
        span.active > .numbers > span {
          color: transparent;
          background: var(--second-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        span.up > .numbers > span {
          color: transparent;
          background: var(--accent-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        span.down > .numbers > span {
          color: transparent;
          background: var(--error-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        span svg {
          color: inherit;
          width: 16px;
          height: 16px;
        }

        span.action.like svg {
          margin: -1px 0 0 0;
          width: 16px;
          height: 16px;
          transition: transform 0.5s ease;
        }

        span.stat.views svg {
          color: inherit;
          width: 16px;
          height: 16px;
        }

        span.stat.up svg {
          color: var(--accent-color);
        }

        span.stat.down svg {
          color: var(--error-color);
        }

        span.true svg,
        span.active svg {
          color: var(--alt-color);
        }

        @media screen and (max-width: 660px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          a,
          span.stat,
          span.action {
            cursor: default !important;
          }

          span.play:hover,
          span.stat:hover,
          span.action:hover {
            background: none;
          }
        }
      </style>
    `;
  }
}