export default class VotesAuthor extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    // check if the user is authenticated
    this._authenticated = window.hash ? true : false;

     // Get array of objects for poll options and parse to Array
    this._options = this.combinePollAndVotes(this.getAttribute('options'), this.getAttribute('votes'));

    // Get the end time for the poll
    this._endTime = new Date(this.getAttribute('end-time'));

    // Check if user has voted and convert to boolean
    this._voted = true ? this.getAttribute('voted') === 'true' : false;

    this._selected = this.getAttribute('selected') || 'none';

    // Check if user is the owner of the profile
    this._you = true ? this.getAttribute('you') === 'true' : false;

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.parent = this.getRootNode().host;

    this.outer = this.parent.getRootNode().host;

    this._isWrapper = this.convertToBool(this.getAttribute('wrapper'));

    this.render();
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

  combinePollAndVotes = (poll, votes) => {
    // convert the poll string to an array
    const pollArray = poll.split(',');

    // convert the votes string to an array
    const votesArray = votes.split(',');

    // combine the poll and votes arrays to an object named options
    return pollArray.map((option, index) => {
      return {
        name: index + 1,
        text: option,
        votes: this.parseToNumber(votesArray[index])
      }
    });
  }

  separatePollAndVotes = options => {
    // get the options
    const poll = options.map(option => option.text).join(',');

    // get the votes
    const votes = options.map(option => option.votes).join(',');

    return { poll, votes };
  }

  // observe the attributes
  static get observedAttributes() {
    return ['options', 'votes', 'end-time', 'voted', 'selected', 'you', 'reload', 'vote'];
  }

  // listen for changes in the attributes
  attributeChangedCallback(name, oldValue, newValue) {
    // Check if the attribute is reload
    if (name === 'reload') {

      if (newValue === 'true') {
        // re-render the component
        this.render();

        this.setAttribute('reload', false)

        // re attach the event listeners
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
    }

    if (name === 'vote') {
      const value = this.parseToNumber(this.getAttribute('vote'));
      if(value === 0) {
        return;
      }

      this.setAttribute('vote', 0)
      // add one to the option votes where the option name is equal to the new value
      this._options = this._options.map(option => {
        if (option.name === value) {
          return { ...option, votes: option.votes + 1 };
        }
        else {
          return option;
        }
      });
      

      // update votes attribute
      this.setAttribute('votes', this._options.map(option => option.votes).join(','));

      this.render();

      // re attach the event listeners
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
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
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

  convertToBool = str => {
    return str === 'true' ? true : false;
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

  // perform actions
  performVote = (option, selected, votes) => {
    // get url to 
    let hash = this.getAttribute('hash');
    // trim and convert to lowercase
    hash = hash.trim().toLowerCase();

    // base api
    const url = `/api/v1/p/${hash}/vote/${option}`;

    // define options 
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application',
        'Accept': 'application/json',
      }
    }

    // Vote for the story
    this.vote(url, options, selected, votes);
  }

  vote = (url, options, selectedOption, votes) => {
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

            outerThis.showToast(data.message, false);

            // revert selected to null
            outerThis.setAttribute('selected', null);

            outerThis.setAttribute('voted', 'false');

            selectedOption.setAttribute('votes', votes);

            outerThis._voted = false;
            
            // update reload attribute to true
            outerThis.setAttribute('reload', 'true');
          }

          // if success is false, show toast message
          if (!data.success) {
            outerThis.showToast(data.message, false);

            // revert selected to null
            outerThis.setAttribute('selected', null);

            outerThis.setAttribute('voted', 'false');
            selectedOption.setAttribute('votes', votes);

            outerThis._voted = false;
            
            // update reload attribute to true
            outerThis.setAttribute('reload', 'true');
          }
          else {
            // Show toast message
            outerThis.showToast(data.message, true);

            outerThis._voted = true;
            console.log(data)

            // update the voted attribute
            const sepObj = outerThis.separatePollAndVotes(outerThis._options);
            // set attributes
            outerThis.setAttributes('options', sepObj.poll);
            outerThis.setAttributes('votes', sepObj.votes);
            outerThis.setAttributes('voted', 'true');
            outerThis.setAttributes('selected', data.vote[0].option);
          }
        });
      })
      .catch(_error => {
        outerThis.showToast('An error occurred while following the user', false);

        outerThis.setAttribute('voted', 'false');
        selectedOption.setAttribute('votes', votes);
        outerThis._voted = false;
        // revert selected to null
        outerThis.setAttribute('selected', null);
        // update reload attribute to true
        outerThis.setAttribute('reload', 'true');
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

  // fn to take number and return a string with commas
  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

  // revert all inputs to unchecked
  revertInputs = inputs =>{
    inputs.forEach(input => {
      input.checked = false;
    });
  }

  // Listen for checked radio button
  listenForChecked = () => {
    const outerThis = this;
    // Get the poll options container
    const pollOptions = this.shadowObj.querySelector('.poll-options');

    const body = document.querySelector('body');

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

          // Check if the checked value is true
          if (input.checked) {
            // Check if the user is authenticated
            if (!outerThis._authenticated) {
              // Open the join popup
              outerThis.openJoin(body);

              // revert any checked input
              outerThis.revertInputs(inputs)

              // prevent this function from proceeding
              return;
            } 

            // Get the selected option
            const selectedOption = e.target.parentElement;

            // Get the selected option name
            const selectedOptionName = outerThis.parseToNumber(selectedOption.dataset.name);

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

            selectedOption.setAttribute('votes', votes + 1);
            // console.log(selectedOption.getAttribute('votes'));

            // Update the selected attribute
            outerThis.setAttribute('selected', selectedOptionName);

            // Update the voted attribute
            outerThis.setAttribute('voted', 'true');

            // Update the options attribute
            // outerThis.setAttribute('options', JSON.stringify(newOptions));

            // update the fill width for each option fill element
            outerThis.updateFillWidth();

            // update the total votes element
            outerThis.updateTotalVotes();

            // disable all inputs after voting
            outerThis.disableInputs();

            // call the perform vote function
            outerThis.performVote(selectedOptionName, input.parentElement, votes);
          }
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
        const isHighest = votes >= Math.max(...this._options.map(option => option.votes));

        // add the high class if the option has the highest number of votes
        isHighest ? option.classList.add('high') : option.classList.remove('high');

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
    const totalVotes = this.shadowObj.querySelector('.info > .total > span.total');

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
    const pollTime = this.shadowObj.querySelector('span.count');

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
          if (timeDiff < 1) {
            pollTime.textContent = "Poll ended";
          }

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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getPoll()}
      ${this.getStyles()}
    `;
  }

  getPoll = () =>  {
    // Calculate the total percentage for each option based on the total votes
    const totalVotes = this._options.reduce((acc, option) => acc + option.votes, 0);

    // convert the total votes to a string with commas
    const totalVotesStr = this.numberWithCommas(totalVotes);

    return /*html*/`
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
    const selected = this.parseToNumber(this.getAttribute('selected'));

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
    const selected = this.parseToNumber(this.getAttribute('selected'));

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
          padding: 10px 0 0 0;
          margin: 0;
          display: flex;
          flex-flow: column;
          gap: 15px;
        }

        .poll-options {
          padding: 0;
          display: flex;
          flex-flow: column;
          gap: 8px;
        }

        .poll-options > .poll-option {
          padding: 0;
          display: flex;
          flex-flow: row;
          gap: 0;
        }

        .poll-options > .poll-option label {
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

        .poll-options > .poll-option label span.text {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          display: inline-block;
          z-index: 1;
          width: 70%;
          height: max-content;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 2px 8px;
          transition: width 0.5s ease-in-out;
          -webkit-transition: width 0.5s ease-in-out;
          -moz-transition: width 0.5s ease-in-out;
          -ms-transition: width 0.5s ease-in-out;
          -o-transition: width 0.5s ease-in-out;
        }

        .poll-options > .poll-option label svg {
          position: absolute;
          display: none;
          right: 50px;
          top: 50%;
          z-index: 3;
          transform: translateY(-50%);
          color: var(--gray-color);
        }

        .poll-options > .poll-option label span.percentage {
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

        .poll-options > .poll-option.high label span.percentage {
          font-weight: 600;
          color: transparent;
          background: var(--second-linear);
          background-clip: text;
          -webkit-background-clip: text;
        }

        .poll-options > .poll-option label span.fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          display: inline-block;
          z-index: 0;
          height: 100%;
          background: var(--poll-background);
          border-radius: 9px;
          transition: width 0.5s ease-in-out;
          -webkit-transition: width 0.5s ease-in-out;
          -moz-transition: width 0.5s ease-in-out;
          -ms-transition: width 0.5s ease-in-out;
          -o-transition: width 0.5s ease-in-out;
        }

        .poll-options > .poll-option input[type="radio"] {
          display: none;
        }

        .poll-options > .poll-option.high label span.fill {
          background: var(--light-linear);
        }

        .poll-options > .poll-option.high label span.text {
          font-weight: 500;
          color: var(--title-color);
        }

        .poll-options > .poll-option input[type="radio"]:checked + label svg {
          display: inline-block;
        }

        .poll-options > .poll-option.high input[type="radio"]:checked + label svg {
          display: inline-block;
          color: var(--alt-color);
        }

        .info {
          padding: 0;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: start;
          color: var(--gray-color);
          gap: 5px;
          font-size: 0.97rem;
        }

        .info .sp {
          font-size: 0.83rem;
          margin: 0;
        }

        .info > .total .total {
          font-family: var(--font-main), sans-serif;
          color: var(--highlight-color);
          font-weight: 600;
          font-size: 0.8rem;
          display: inline-block;
          margin: 1px 0 0 0;
        }
        .info .count {
          font-family: var(--font-main), sans-serif;
          font-weight: 500;
          font-size: 0.75rem;
          display: inline-block;
          margin: 2px 0 0 0;
        }

        @media screen and (max-width: 660px) {
          ::-webkit-scrollbar {
            -webkit-appearance: none;
          }

          :host {
            padding: 10px 0 0 0;
            margin: 0;
          }


          a,
          .poll-options > .poll-option label {
            cursor: default !important;
          }
        }
      </style>
    `;
  }
}