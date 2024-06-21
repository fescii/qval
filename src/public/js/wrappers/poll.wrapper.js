export default class PollWrapper extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // Get array of objects for poll options and parse to Array
    this._options = Array.from(JSON.parse(this.getAttribute('options')));

    // Get the end time for the poll
    this._endTime = new Date(this.getAttribute('end-time'));

    // Check if user has voted and convert to boolean
    this._voted = true ? this.getAttribute('voted') === 'true' : false;

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // like post
    this.likePost();

    // scroll likes
    this.scrollLikes();

    // Update poll expiry time per second
    this.updatePollTime();

    // Check if user has voted
    if (this._voted) {
      // disable all inputs
      this.disableInputs();
    }
    else {
      // Listen for checked radio button
      this.listenForChecked();
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

  // fn to take number and return a string with commas
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Disable all inputs
  disableInputs = () => {
    // Select radio inputs
    const inputs = this.shadowObj.querySelectorAll('input[type="radio"]');

    // Loop through the inputs and disable them
    if (inputs) {
      inputs.forEach(input => {
        input.disabled = true;
      });
    }
  }

  // Listen for checked radio button
  listenForChecked = () => {
    const outerThis = this;
    // Get the poll options container
    const pollOptions = this.shadowObj.querySelector('.poll-options');

    // Check if the poll options container exists
    if (pollOptions) {
      // Get all the poll inputs
      const inputs = pollOptions.querySelectorAll('input[type="radio"]');

      // Add event listener to the poll options container
      inputs.forEach(input => {
        // add event listener to the input
        input.addEventListener('change', e => {
          // prevent the default action
          e.preventDefault();

          // prevent the propagation of the event
          e.stopPropagation();

          // Get the selected option
          const selectedOption = e.target.parentElement;

          // Get the selected option name
          const selectedOptionName = selectedOption.dataset.name;

          // Get the new options
          const newOptions = outerThis._options.map(option => {
            // Check if the option is the selected option
            if (option.name === selectedOptionName) {
              return { ...option, votes: option.votes + 1 };
            }
            else {
              return option;
            }
          });

          // Update the options
          outerThis._options = newOptions;

          // Calculate the total percentage for each option based on the total votes
          const totalVotes = newOptions.reduce((acc, option) => acc + option.votes, 0);

          // Calculate the percentage for each option
          newOptions.forEach(option => { option.percentage = (option.votes / totalVotes) * 100 });

          // update votes attribute in the selected option
          let votes = outerThis.parseToNumber(selectedOption.getAttribute('votes'));
          // console.log(votes);
          selectedOption.setAttribute('votes', votes + 1);
          // console.log(selectedOption.getAttribute('votes'));

          // Update the selected attribute
          outerThis.setAttribute('selected', selectedOptionName);

          // Update the voted attribute
          outerThis.setAttribute('voted', 'true');

          // Update the options attribute
          outerThis.setAttribute('options', JSON.stringify(newOptions));

          // update the fill width for each option fill element
          outerThis.updateFillWidth();

          // update the total votes element
          outerThis.updateTotalVotes();

          // disable all inputs after voting
          outerThis.disableInputs();
        });
      });

    }
  }

  // Update width of the fill element for each option
  updateFillWidth = () => {
    // Get the poll options container
    const pollOptions = this.shadowObj.querySelector('.poll-options');

    // Check if the poll options container exists
    if (pollOptions) {
      // Get all the poll options
      const options = pollOptions.querySelectorAll('.poll-option');

      // Loop through the options and update the fill width
      options.forEach(option => {
        // Get the fill element
        const fill = option.querySelector('.fill');

        // Get the votes for the option
        const votes = this.parseToNumber(option.getAttribute('votes'));

        // Get the total votes
        const totalVotes = this._options.reduce((acc, option) => acc + option.votes, 0);

        // Check if the current option has the highest number of votes
        const isHighest = votes === Math.max(...this._options.map(option => option.votes));

        // add the high class if the option has the highest number of votes
        if (isHighest) {
          option.classList.add('high');
        }

        // Calculate the percentage for the option
        const percentage = (votes / totalVotes) * 100;

        // Update the fill width
        fill.style.width = `${percentage}%`;

        // Update the percentage text
        let html = `
          <span class="percentage">${percentage.toFixed(1)}%</span>
        `

        // Insert the html beforeend of the label
        option.querySelector('label').insertAdjacentHTML('beforeend', html);
      });
    }
  }

  // Update total votes element
  updateTotalVotes = () => {
    // Select the total votes element
    const totalVotes = this.shadowObj.querySelector('.poll .info > .total > span.total');

    if (totalVotes) {
      // Get the total votes
      const votes = this._options.reduce((acc, option) => acc + option.votes, 0);

      // Convert the total votes to a string with commas
      const votesStr = this.numberWithCommas(votes);

      // Update the total votes
      totalVotes.textContent = votesStr;
    }
  }

  // Update poll expiry time per second
  updatePollTime = () => {
    // select the poll time element
    const pollTime = this.shadowObj.querySelector('.poll span.count');

    const endTime = this._endTime;

    // Convert the end time to local time
    const localEndTime = new Date(endTime.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));

    // Get the current time
    const currentTime = new Date(Date.now());

    // Get the difference between the current time and the end time
    let timeDiff = localEndTime - currentTime;

    // Check if the poll time element exists
    if (pollTime) {
      // Check if the time difference is less than 0
      if (timeDiff <= 0) {
        pollTime.textContent = "Poll ended";
      }
      else {
        // Update the poll time every second
        setInterval(() => {
          pollTime.textContent = this.getRemainingTime(timeDiff);

          // update the time difference
          timeDiff = localEndTime - new Date(Date.now());
        }, 1000);
      }
    }
  }

  // Get remaining time for the poll
  getRemainingTime = timeDiff => {
    // get the number of hours if any in the time difference
    let hours = Math.floor(timeDiff / (1000 * 60 * 60));

    // Get the number of minutes if any in the time difference excluding days and hours
    let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    // Get the number of seconds if any in the time difference excluding days, hours and minutes
    let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);


    // Check if total hours is less than 10, add a leading zero
    hours = hours < 10 ? `0${hours}` : hours;

    // Check if minutes is less than 10, add a leading zero
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    // Check if seconds is less than 10, add a leading zero
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${hours}:${minutes}:${seconds}`;
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

  formatDateWithRelativeTime = (isoDateStr) => {
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getFull()}
      ${this.getStyles()}
    `;
  }

  getContent = () => {
    return `
      <div class="content">
        ${this.innerHTML}
      </div>
    `;
  }

  getPoll = () =>  {
    // Calculate the total percentage for each option based on the total votes
    const totalVotes = this._options.reduce((acc, option) => acc + option.votes, 0);

    // convert the total votes to a string with commas
    const totalVotesStr = this.numberWithCommas(totalVotes);

    return /*html*/`
      <div class="poll">
        <div class="poll-options">
          ${this.getPollOptions()}
        </div>

        <span class="info">
          <span class="total">
            <span class="total">${totalVotesStr}</span>
            <span class="text">votes</span>
          </span>
          <span class="sp">•</span>
          <span class="count">00:00:00</span>
        </span>
      </div>
    `
  }

  getPollOptions = () => {
    // Check if poll has ended
    const pollEnded = new Date(Date.now()) > this._endTime;

    // Check if poll has ended
    if (pollEnded) {
      return this.getEndedOptions();
    }
    // Check if user has voted
    else if (this._voted) {
      return this.getVotedOptions();
    }
    else {
      return this.getOptions();
    }
  }

  getEndedOptions = () => {
    // Get the options
    const options = this._options;

    // get selected option
    const selected = this.getAttribute('selected');

    // Calculate the total percentage for each option based on the total votes
    const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);

    // Calculate the percentage for each option
    options.forEach(option => { option.percentage = (option.votes / totalVotes) * 100 });

    // get the option highest number of votes
    const highestVotes = Math.max(...options.map(option => option.votes));

    // loop through the options and return the html
    return options.map((option, index) => {
      // Check which option is selected
      const isSelected = selected === option.name;

      // Check if the option has the highest number of votes
      const isHighest = option.votes === highestVotes;

      return /*html*/`
        <div votes="${option.votes}" data-name="${option.name}" class="poll-option ${isSelected ? 'selected' : ''} ${isHighest ? 'high' : ''}">
          <input type="radio" name="poll" id="poll-${index + 1}" ${isSelected ? 'checked="true"' : ''} disabled="true">
          <label for="poll-${index + 1}">
            <span class="text">${option.text}</span>
            <span is="custom-span" width="${option.percentage.toFixed(2)}%" class="fill"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
            </svg>
            <span class="percentage">${option.percentage.toFixed(1)}%</span>
          </label>
        </div>
      `;
    }).join('');
  }

  getOptions = () => {
    // get the options
    const options = this._options;

    // Map through the options and return the html
    return options.map((option, index) => {
      return /*html*/`
        <div votes="${option.votes}" data-name="${option.name}" class="poll-option">
          <input type="radio" name="poll" id="poll-${index + 1}">
          <label for="poll-${index + 1}">
            <span class="text">${option.text}</span>
            <span is="custom-span" width="0" class="fill"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
            </svg>
          </label>
        </div>
      `;
    }).join('');
  }

  getVotedOptions = () => {
    // Get the options
    const options = this._options;

    // get selected option
    const selected = this.getAttribute('selected');

    // Calculate the total percentage for each option based on the total votes
    const totalVotes = options.reduce((acc, option) => acc + option.votes, 0);

    // Calculate the percentage for each option
    options.forEach(option => { option.percentage = (option.votes / totalVotes) * 100 });

    // get the option highest number of votes
    const highestVotes = Math.max(...options.map(option => option.votes));

    // loop through the options and return the html
    return options.map((option, index) => {
      // Check which option is selected
      const isSelected = selected === option.name;

      // Check if the option has the highest number of votes
      const isHighest = option.votes === highestVotes;

      return /*html*/`
        <div votes="${option.votes}" data-name="${option.name}" class="poll-option ${isSelected ? 'selected' : ''} ${isHighest ? 'high' : ''}">
          <input type="radio" name="poll" id="poll-${index+1}" ${isSelected ? 'checked' : ''}>
          <label for="poll-${index+1}">
            <span class="text">${option.text}</span>
            <span is="custom-span" width="${option.percentage.toFixed(2)}%" class="fill"></span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z"></path>
            </svg>
            <span class="percentage">${option.percentage.toFixed(1)}%</span>
          </label>
        </div>
      `;
    }).join('');
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
    // get content of the story
    let content = this.innerHTML;

    // remove all html tags from the content
    content = content.replace(/<[^>]*>?/gm, '');

    // trim all white spaces from the content
    content = content.trim();

    // shorten the content to 85 characters
    content = content.length > 85 ? content.substring(0, 85) : content;

    // Get url to share
    const url = this.getAttribute('url');

    // Get window host url including https/http part
    let host = window.location.protocol + '//' + window.location.host;

    // combine the url with the host
    const shareUrl = `${host}${url}`;

    return /* html */`
      <share-wrapper url="${shareUrl.toLowerCase()}" summery="${content}"></share-wrapper>
    `
  }

  getLoader = () => {
    return `
			<post-loader speed="300"></post-loader>
		`
  }

  getFull = () => {
    // check mql for mobile view
    const mql = window.matchMedia('(max-width: 660px)');
    return `
      ${this.getContent()}
      ${this.getPoll()}
      ${this.getAuthorContainer(mql.matches)}
      ${this.getShare()}
      ${this.getMeta()}
      ${this.getStats()}
      <form-container type="post"></form-container>
    `;
  }

  getAuthorContainer = mql => {
    return mql ? this.getAuthor() : '';
  }

  getBody() {
    return `
      <div class="content-container">
        ${this.getLoader()}
      </div>
    `;
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
          /* border: 1px solid #6b7280;*/
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          height: max-content;
        }

        .content-container {
          display: flex;
          flex-flow: column;
          gap: 0;
          width: 100%;
          height: max-content;
        }

        .content {
          display: flex;
          flex-flow: column;
          color: var(--text-color);
          line-height: 1.5;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        .content p {
          margin: 5px 0 0 0;
          padding: 0;
          line-height: 1.5;
          font-size: 1.05rem;
          font-family: var(--font-text), sans-serif;
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
          color: var(--font-text);
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

        .meta {
          border-bottom: var(--border);
          border-top: none;
          margin: 0;
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

        .poll {
          padding: 10px 0 15px 0;
          margin: 0;
          border-bottom: var(--border);
          display: flex;
          flex-flow: column;
          gap: 15px;
        }

        .poll > .poll-options {
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 8px;
        }

        .poll > .poll-options > .poll-option {
          padding: 0;
          display: flex;
          flex-flow: row;
          gap: 0;
        }

        .poll > .poll-options > .poll-option label {
          display: inline-block;
          position: relative;
          height: 30px;
          width: 100%;
          cursor: pointer;
          line-height: 1.5;
          border: var(--border);
          padding: 0;
          font-family: var(--font-text), sans-serif;
          color: var(--gray-color);
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        .poll > .poll-options > .poll-option label span.text {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          display: inline-block;
          z-index: 1;
          width: 100%;
          height: max-content;
          padding: 2px 8px;
          transition: width 0.5s ease-in-out;
          -webkit-transition: width 0.5s ease-in-out;
          -moz-transition: width 0.5s ease-in-out;
          -ms-transition: width 0.5s ease-in-out;
          -o-transition: width 0.5s ease-in-out;
        }

        .poll > .poll-options > .poll-option label svg {
          position: absolute;
          display: none;
          right: 50px;
          top: 50%;
          z-index: 3;
          transform: translateY(-50%);
          color: var(--gray-color);
        }

        .poll > .poll-options > .poll-option label span.percentage {
          position: absolute;
          right: 5px;
          top: 50%;
          z-index: 2;
          transform: translateY(-50%);
          font-family: var(--font-main), sans-serif;
          color: var(--gray-color);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .poll > .poll-options > .poll-option.high label span.percentage {
          font-weight: 600;
          color: transparent;
          background: var(--second-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .poll > .poll-options > .poll-option label span.fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          display: inline-block;
          z-index: 0;
          height: 100%;
          background: var(--poll-background);
          border-top-left-radius: 9px;
          border-bottom-left-radius: 9px;
          transition: width 0.5s ease-in-out;
          -webkit-transition: width 0.5s ease-in-out;
          -moz-transition: width 0.5s ease-in-out;
          -ms-transition: width 0.5s ease-in-out;
          -o-transition: width 0.5s ease-in-out;
        }

        .poll > .poll-options > .poll-option input[type="radio"] {
          display: none;
        }

        .poll > .poll-options > .poll-option.high label span.fill {
          background: var(--poll-linear);
        }

        .poll > .poll-options > .poll-option.high label span.text {
          font-weight: 500;
          color: var(--title-color);
        }

        .poll > .poll-options > .poll-option input[type="radio"]:checked + label svg {
          display: inline-block;
        }

        .poll > .poll-options > .poll-option.high input[type="radio"]:checked + label svg {
          display: inline-block;
          color: var(--alt-color);
        }

        .poll > .info {
          padding: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: start;
          color: var(--gray-color);
          gap: 5px;
          font-size: 0.95rem;
        }

        .poll > .info .sp {
          font-size: 0.83rem;
          margin: 2px 0 0 0;
        }

        .poll > .info > .total .total,
        .poll > .info .count {
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          font-size: 0.75rem;
          display: inline-block;
          margin: 3px 0 0 0;
        }

        .stats.actions {
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
          /* color: var(--action-color); */
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
          /* border: var(--input-border); */
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          font-size: 1rem;
          font-weight: 400;
          /* color: var(--gray-color); */
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
          transition: height 0.5s ease, min-height 0.5s ease; 
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

        @media screen and (max-width: 660px) {
          :host {
            margin: 0 0 15px;
          }

          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          .meta {
            border-bottom: var(--border-mobile);
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

          .poll {
            padding: 10px 0 10px 0;
            margin: 0 0 15px;
            border-bottom: var(--border-mobile);
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
        }
      </style>
    `;
  }
}