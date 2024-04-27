export default class LogonApp extends HTMLElement {
  constructor() {

    // We are not even going to touch this.
    super();

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: 'open' });

    this._step = 0;

    this._success = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
				<path	d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
			</svg>
    `

    this._failed = `
		  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"	viewBox="0 0 16 16">
				<path	d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
			</svg>
    `

    this._data = {
      "register": {},
      "login": {},
      "recovery": {}
    };

    this.render();
  }

  render() {
    // this.shadowObj.innerHTML = this.getTemplate();
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    const outerThis = this;
    const initialName = this.getAttribute('name');
    const contentContainer = this.shadowObj.querySelector('.logon-container');
    if (contentContainer) {
      const contentTitle = contentContainer.querySelector('.head > .logo h2 span.action')
      const stagesContainer = contentContainer.querySelector('.stages');

      switch (initialName) {
        case 'join':
          outerThis.activateRegister(contentContainer, stagesContainer, contentTitle);
          outerThis.activateLogin(contentContainer, stagesContainer, contentTitle);
          break;
        case 'login':
          outerThis.loginLoaded(contentContainer, stagesContainer, contentTitle);
          break;
        case 'register':
          outerThis.registerLoaded(contentContainer, stagesContainer, contentTitle);
        default:
          outerThis.activateRegister(contentContainer, stagesContainer, contentTitle);
          outerThis.activateLogin(contentContainer, stagesContainer, contentTitle);
          break;
      }
    }
  }

  disconnectedCallback() {
    // console.log('We are inside disconnectedCallback');
  }


  loginLoaded = (contentContainer, stagesContainer, contentTitle) => {
    const outerThis = this;

    contentTitle.textContent = 'Login';
    outerThis.changeStages('login', stagesContainer);
    outerThis.nextStep('login', stagesContainer);


    outerThis.submitEvent('login', contentContainer.querySelector('form'));
    outerThis.prevStep('login', stagesContainer, contentContainer)
  }

  registerLoaded = (contentContainer, stagesContainer, contentTitle) => {
    const outerThis = this;

    contentTitle.textContent = 'Register';
    outerThis.changeStages('register', stagesContainer);
    outerThis.nextStep('register', stagesContainer);

    outerThis.submitEvent('register', contentContainer.querySelector('form'));
    outerThis.prevStep('register', stagesContainer, contentContainer)
  }

  activateRegister(contentContainer, stagesContainer, contentTitle) {
    const loader = this.getLoader();
    const form = this.getRegistrationForm();
    const outerThis = this;
    const registerButton = contentContainer.querySelector('.welcome > a.register');
    if (registerButton) {
      registerButton.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        contentContainer.insertAdjacentHTML('afterbegin', loader);

        const welcome = contentContainer.querySelector('.welcome');

        setTimeout(() => {
          welcome.remove();
          contentTitle.textContent = 'Register';
          outerThis.changeStages('register', stagesContainer);
          outerThis.nextStep('register', stagesContainer);
          stagesContainer.insertAdjacentHTML('afterend', form);

          // Updating History State
          window.history.pushState(
            { content: form, page: 'register' },
            outerThis.getAttribute('register'), outerThis.getAttribute('register')
          );

          contentContainer.querySelector('#loader-container').remove();

          outerThis.submitEvent('register', contentContainer.querySelector('form'));
          outerThis.prevStep('register', stagesContainer, contentContainer)
        }, 1000);

      })
    }
  }

  activateLogin(contentContainer, stagesContainer, contentTitle) {
    const loader = this.getLoader();
    const form = this.getLoginForm();
    const outerThis = this;
    const loginButton = contentContainer.querySelector('a.login');
    if (loginButton) {
      loginButton.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        contentContainer.insertAdjacentHTML('afterbegin', loader);

        const welcome = contentContainer.querySelector('.welcome');
        const finish = contentContainer.querySelector('.finish');

        setTimeout(() => {
          if (welcome) {
            welcome.remove();
          }
          if (finish) {
            finish.remove();
          }
          contentTitle.textContent = 'Login';
          outerThis.changeStages('login', stagesContainer);
          outerThis.nextStep('login', stagesContainer);
          stagesContainer.insertAdjacentHTML('afterend', form);

          // Remove the loader
          contentContainer.querySelector('#loader-container').remove();

          // Updating History State
          window.history.pushState(
            { content: form, page: 'login' },
            outerThis.getAttribute('login'), outerThis.getAttribute('login')
          );

          outerThis.submitEvent('login', contentContainer.querySelector('form'));
          outerThis.prevStep('login', stagesContainer, contentContainer)
        }, 1000);

      })
    }
  }

  changeStages(stageType, stagesContainer) {
    const stages = stagesContainer.querySelectorAll('.no');

    switch (stageType) {
      case 'register':
        stagesContainer.classList.remove('login', 'welcome-stages');
        stagesContainer.classList.add('register');

        stages.forEach(stage => {
          stage.style.display = 'inline-block';
        });

        break;

      case 'login':
        stagesContainer.classList.remove('register', 'welcome-stages');
        stagesContainer.classList.add('login');

        stages.forEach((stage, index) => {
          if(index === 2 || index === 3) {
            stage.style.display = 'none';
          }
        });

        break;

      case 'welcome':
        stagesContainer.classList.remove('register', 'login');
        stagesContainer.classList.add('welcome-stages');

        stages.forEach((stage, index) => {
          if (index === 2 || index === 3) {
            stage.style.display = 'none';
          }
        });

        break;
      default:
        break;
    }
  }

  nextStep(stageType, stagesContainer) {
    const stages = stagesContainer.querySelectorAll('span.stage');

    switch (stageType) {
      case "register":
        stages[this._step + 1].classList.add('active');
        this._step += 1;
        break;
      case "login":
        if(this._step >= 3) {
          stages[3].classList.remove('active');
          stages[2].classList.remove('active');
          stages[1].classList.add('active');
          this._step = 1;
        }
        else if((this._step + 1) === 2) {
          stages[stages.length - 1].classList.add('active');
          this._step = (stages.length - 1);
        }
        else {
          stages[this._step + 1].classList.add('active');
          this._step += 1;
        }
        break;
      default:
        break;
    }
  }

  prevStep(stageType, stagesContainer, contentContainer) {
    const outerThis = this;
    const welcome = this.getWelcome();
    const form = contentContainer.querySelector('form.fields');
    const stages = stagesContainer.querySelectorAll('span.stage');
    const contentTitle = contentContainer.querySelector('.head > .logo h2 span.action');

    const prevButton = form.querySelector('.actions > .action.prev ');

    prevButton.addEventListener('click', e => {
      e.preventDefault()

      prevButton.innerHTML = outerThis.getBtnAltLoader();
      prevButton.style.setProperty("pointer-events", 'none');

      switch (stageType) {
        case "register":
          if (outerThis._step <= 1) {
            setTimeout(() => {
              stages[1].classList.remove('active');
              form.remove();
              stagesContainer.insertAdjacentHTML('afterend', welcome)
              outerThis._step = 0;

              // Going back history state
              window.history.back();

              contentTitle.textContent = 'Join';

              outerThis.activateRegister(contentContainer, stagesContainer, contentTitle);
              outerThis.activateLogin(contentContainer, stagesContainer, contentTitle);
            }, 1500);
          }
          else if(outerThis._step === 2) {
            setTimeout(() => {
              stages[outerThis._step].classList.remove('active');
              outerThis._step -= 1;
              const currentFields = form.querySelector('.field.password');
              if (currentFields) {
                currentFields.remove();
              }

              form.insertAdjacentHTML('afterbegin', outerThis.getBioFields())
            }, 1500);
          }
          break;
        case "login":
          if (this._step <= 1) {
            setTimeout(() => {
              stages[1].classList.remove('active');
              form.remove();
              stagesContainer.insertAdjacentHTML('afterend', welcome)
              outerThis._step = 0;

              // Going back history state
              window.history.back();

              contentTitle.textContent = 'Join';

              outerThis.activateRegister(contentContainer, stagesContainer, contentTitle);
              outerThis.activateLogin(contentContainer, stagesContainer, contentTitle);
            }, 1500);
          }
          break;
        default:
          break;
      }

      setTimeout(() => {
        prevButton.innerHTML = `<span class="text">Back</span>`
        prevButton.style.setProperty("pointer-events", 'auto');
      }, 1500);
    })
  }

  submitEvent(stageType, form) {
    const outerThis = this;
    form.addEventListener('submit', e => {
      e.preventDefault();

      switch (stageType) {
        case 'register':
          if (outerThis._step === 1) {
            outerThis.validateBio(form);
          }
          else if (outerThis._step === 2) {
            outerThis.validatePassword(form);
          }
          break;
        case 'login':
          outerThis.validateLogin(form);
        default:
          break;
      }
    })
  }

  validateLogin(form) {
    const outerThis = this;
    const data = {};
    const submitButton = form.querySelector('.actions > .action.next ');
    const inputField = form.querySelector('.field.login');
    const userKeyGroup = inputField.querySelector('.input-group.user-key');
    const passwordGroup = inputField.querySelector('.input-group.password');

    submitButton.innerHTML = outerThis.getButtonLoader();
    submitButton.style.setProperty("pointer-events", 'none');

    userKeyGroup.classList.remove('success', 'failed');
    passwordGroup.classList.remove('success', 'failed');

    let svg = userKeyGroup.querySelector('svg');
    let passwordSvg = passwordGroup.querySelector('svg');
    if (svg && passwordSvg) {
      svg.remove();
      passwordSvg.remove();
    }

    const userKeyValue = userKeyGroup.querySelector('input').value.trim();
    const passwordValue = passwordGroup.querySelector('input').value.trim();

    const userKeyStatus = userKeyGroup.querySelector('span.status');
    const passwordStatus = passwordGroup.querySelector('span.status');


    if (userKeyValue === '') {
      userKeyStatus.textContent = 'Username or email is required!';
      userKeyGroup.insertAdjacentHTML('beforeend', outerThis._failed);
      userKeyGroup.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Login</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }
    else {
      userKeyGroup.insertAdjacentHTML('beforeend', this._success);
      setTimeout(() => {
        userKeyGroup.classList.add('success');
      }, 2000);
      data['user-key'] = userKeyValue;
    }

    if (passwordValue === '') {
      passwordStatus.textContent = 'Password is required!';
      passwordGroup.insertAdjacentHTML('beforeend', outerThis._failed);
      passwordGroup.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Login</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }
    else {
      passwordGroup.insertAdjacentHTML('beforeend', this._success);
      setTimeout(() => {
        passwordGroup.classList.add('success');
      }, 2000);
      data['password'] = passwordValue;
    }

    if (data['user-key'] && data['password']) {
      //API CALL
      outerThis.performLogin(form, data)
    }
  }

  performLogin(form, data) {
    const outerThis = this;
    const submitButton = form.querySelector('.actions > .action.next ');

    // After API call
    let _msg = 'Username is available' // From API

    setTimeout(() => {
      submitButton.innerHTML = `<span class="text">Continue</span>`
      submitButton.style.setProperty("pointer-events", 'auto');

      outerThis.activateLoginFinish(form.parentElement, 'Fredrick');
    }, 3000);
  }

  activateBio(form) {
    const stagesContainer = form.parentElement.querySelector('.stages');
    form.firstElementChild.remove()
    this.nextStep('register', stagesContainer);

    form.insertAdjacentHTML('afterbegin', this.getBioFields())
  }

  validateBio(form) {
    const outerThis = this;
    const submitButton = form.querySelector('.actions > .action.next ');
    const inputField = form.querySelector('.field.bio');

    // const inputGroups = inputField.querySelectorAll('.input-group');
    const firstName = inputField.querySelector('.input-group.firstname');
    const lastname = inputField.querySelector('.input-group.lastname');
    const email = inputField.querySelector('.input-group.email');

    submitButton.innerHTML = outerThis.getButtonLoader();
    submitButton.style.setProperty("pointer-events", 'none');


    // Validate names
    if (this.validateName(firstName, submitButton) && this.validateName(lastname, submitButton)) {
      const input = email.querySelector('input').value.trim();

      email.classList.remove('success', 'failed');
      let svg = email.querySelector('svg');
      if (svg) {
        svg.remove();
      }
      const emailStatus = email.querySelector('span.status');

      if (input === '') {
        emailStatus.textContent = 'Enter a valid email!';
        email.insertAdjacentHTML('beforeend', outerThis._failed);
        email.classList.add('failed');

        setTimeout(() => {
          submitButton.innerHTML = `<span class="text">Continue</span>`
          submitButton.style.setProperty("pointer-events", 'auto');
        }, 1000);
      }
      else {
        // no Inspection
        let validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (input.match(validRegex)) {

          // Call the API
          outerThis.checkEmail(form, input, email, emailStatus);
        }
        else {
          emailStatus.textContent = 'Enter a valid email!';
          email.insertAdjacentHTML('beforeend', outerThis._failed);
          email.classList.add('failed');

          setTimeout(() => {
            submitButton.innerHTML = `<span class="text">Continue</span>`
            submitButton.style.setProperty("pointer-events", 'auto');
          }, 1000);
        }
      }
    }
  }

  validateName = (nameElement, submitButton) => {
    const outerThis = this;
    const inputElement = nameElement.querySelector('input')
    const input = nameElement.querySelector('input').value.trim();

    nameElement.classList.remove('success', 'failed');
    let svg = nameElement.querySelector('svg');
    if (svg) {
      svg.remove();
    }
    const nameStatus = nameElement.querySelector('span.status');

    if (input === '') {
      nameStatus.textContent = 'This field is required!';
      nameElement.insertAdjacentHTML('beforeend', outerThis._failed);
      nameElement.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Continue</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);

      return false;
    }
    else {
      nameStatus.textContent = '';
      nameElement.insertAdjacentHTML('beforeend', this._success);

      if (inputElement.dataset.name === "firstname") {
        this._data.register['first_name'] = input;
      }
      else {
        this._data.register['last_name'] = input;
      }

      nameElement.classList.add('success');

      return true;
    }
  }

  checkEmail = async (form, input, email, emailStatus) =>  {
    const submitButton = form.querySelector('.actions > .action.next');

    // After API call
    const {
      result,
      error
    } = await this.checkIfEmailExists({ email: input });

    // If error occurs
    if (error) {
      const errorMsg = this.getServerMsg('Something went wrong, try again!');
      form.insertAdjacentHTML('afterbegin', errorMsg);

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Continue</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }

    // If email does not exists
    if (result.success) {
      // Add email to the data object
      this._data.register['email'] = input;

      emailStatus.textContent = result.message;
      email.insertAdjacentHTML('beforeend', this._success);

      email.classList.add('success');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Register</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
        this.activatePassword(form)
      }, 2000);
    }
    else {
      emailStatus.textContent = result.message;
      email.insertAdjacentHTML('beforeend', this._failed);
      email.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Continue</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }
  }

  activatePassword = form => {
    const stagesContainer = form.parentElement.querySelector('.stages');
    form.firstElementChild.remove()
    this.nextStep('register', stagesContainer);

    // console.log(this.getPasswordFields());

    form.insertAdjacentHTML('afterbegin', this.getPasswordFields())
  }

  validatePassword = async form => {
    const outerThis = this;
    const submitButton = form.querySelector('.actions > .action.next');
    const inputField = form.querySelector('.field.password');

    // const inputGroups = inputField.querySelectorAll('.input-group');
    const password = inputField.querySelector('.input-group.password');
    const repeatPassword = inputField.querySelector('.input-group.repeat-password');

    submitButton.innerHTML = outerThis.getButtonLoader();
    submitButton.style.setProperty("pointer-events", 'none');

    const input = password.querySelector('input').value.trim();
    const inputRepeat = repeatPassword.querySelector('input').value.trim();

    password.classList.remove('success', 'failed');
    repeatPassword.classList.remove('success', 'failed');
    let svg = password.querySelector('svg');
    let svgRepeat = repeatPassword.querySelector('svg');
    let serverMsg = form.querySelector('.server-status');
    if(svg){
      svg.remove();
    }
    if (svgRepeat) {
      svgRepeat.remove();
    }

    if (serverMsg) {
      serverMsg.remove();
    }


    const passwordStatus = password.querySelector('span.status');
    const repeatStatus = repeatPassword.querySelector('span.status');

    if (input === '') {
      passwordStatus.textContent = 'Password is required!';
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      setTimeout(() => {
        submitButton.innerHTML = `<span class="text">Continue</span>`
        submitButton.style.setProperty("pointer-events", 'auto');
      }, 1000);
    }
    else {
      if(this.isPassword(input, password, passwordStatus)){
        if (input === inputRepeat) {
          repeatStatus.textContent = '';
          repeatPassword.insertAdjacentHTML('beforeend', this._success);

          this._data.register['password'] = input;

          // console.log(this._data);

          repeatPassword.classList.add('success');

          // API Call

          const {
            result,
            error
          } = await outerThis.performRegistration(outerThis._data.register);

          if (error) {
            const errorMsg = outerThis.getServerMsg('Something went wrong, try again!');
            form.insertAdjacentHTML('afterbegin', errorMsg);

            setTimeout(() => {
              submitButton.innerHTML = `<span class="text">Continue</span>`
              submitButton.style.setProperty("pointer-events", 'auto');
            }, 1000);
          }

          if (result.success) {
            this.activateFinish(form.parentElement, result.user);
          }
          else {
            const errorMsg = outerThis.getServerMsg(result.message);
            form.insertAdjacentHTML('afterbegin', errorMsg);

            setTimeout(() => {
              submitButton.innerHTML = `<span class="text">Continue</span>`
              submitButton.style.setProperty("pointer-events", 'auto');
            }, 1000);
          }
        }
        else {
          repeatStatus.textContent = 'Passwords must match be equal!';
          repeatPassword.insertAdjacentHTML('beforeend', outerThis._failed);
          repeatPassword.classList.add('failed');

          setTimeout(() => {
            submitButton.innerHTML = `<span class="text">Continue</span>`
            submitButton.style.setProperty("pointer-events", 'auto');
          }, 1000);
        }
      }
      else {
        setTimeout(() => {
          submitButton.innerHTML = `<span class="text">Continue</span>`
          submitButton.style.setProperty("pointer-events", 'auto');
        }, 1000);
      }
    }
  }

  performRegistration = async data => {
    const outerThis = this;
    const registerUrl = outerThis.getAttribute('api-register');
    try {
      const response = await fetch(registerUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      return  {
        result: result,
        error: null
      }
    }
    catch (error) {
      return {
        result: null,
        error: error
      }
    }
  }

  checkIfEmailExists = async data => {
    const outerThis = this;
    const checkEmailUrl = outerThis.getAttribute('api-check-email');
    try {
      const response = await fetch(checkEmailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      return {
        result: result,
        error: null
      }
    }
    catch (error) {
      return {
        result: null,
        error: error
      }
    }
  }

  isPassword(input, password, passwordStatus) {
    const outerThis = this;
    // Regular expressions for each criterion
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialSymbolRegex = /[^A-Za-z0-9]/;

    // Check each criterion
    if (input.length < 6) {
      passwordStatus.textContent = "Password must be at least 6 characters long.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else if (!uppercaseRegex.test(input)) {
      passwordStatus.textContent = "Password must contain at least one uppercase letter.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else if (!lowercaseRegex.test(input)) {
      passwordStatus.textContent = "Password must contain at least one lowercase letter.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else if (!digitRegex.test(input)) {
      passwordStatus.textContent = "Password must contain at least one digit.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else if (!specialSymbolRegex.test(input)) {
      passwordStatus.textContent = "Password must contain at least one special symbol.";
      password.insertAdjacentHTML('beforeend', outerThis._failed);
      password.classList.add('failed');

      return false;
    }
    else {
      passwordStatus.textContent = '';
      password.insertAdjacentHTML('beforeend', this._success);

      password.classList.add('success');

      return true;
    }
  }

  activateFinish(contentContainer, data) {
    const outerThis = this;
    const stagesContainer = contentContainer.querySelector('.stages');
    const contentTitle = contentContainer.querySelector('.head > .logo h2 span.action');
    const finish = this.getRegSuccess(data);
    const form = contentContainer.querySelector('form');

    setTimeout(() => {
      form.remove();
      outerThis.nextStep('register', stagesContainer);
      stagesContainer.insertAdjacentHTML('afterend', finish)

      outerThis.activateLogin(contentContainer, stagesContainer, contentTitle);
    }, 1000);
  }

  activateLoginFinish(contentContainer, name) {
    const outerThis = this;
    const stagesContainer = contentContainer.querySelector('.stages');
    // const contentTitle = contentContainer.querySelector('.head > .logo h2 span.action');
    const finish = this.getLoginSuccess(name);
    const form = contentContainer.querySelector('form');

    setTimeout(() => {
      form.remove();
      outerThis.nextStep('login', stagesContainer);
      stagesContainer.insertAdjacentHTML('afterend', finish)
    }, 1000);
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
    return `
      <div class="logon-container">
        ${this.getHeader()}
        ${this.getStages()}
        ${this.initialInterface(this.getAttribute('name'))}
        ${this.getFooter()}
      </div>

      ${this.getStyles()}
    `
  }

  initialInterface = (startName) => {
    const outerThis = this;
    switch (startName) {
      case 'join':
        return outerThis.getWelcome()
      case 'login':
        return outerThis.getLoginForm();
      case 'register':
        return outerThis.getRegistrationForm();
      default:
        return outerThis.getWelcome();
    }
  }

  getLoader() {
    return `
      <div id="loader-container">
				<div class="loader"></div>
			</div>
    `
  }

  getButtonLoader() {
    return `
      <span id="btn-loader">
				<span class="loader"></span>
			</span>
    `
  }

  getBtnAltLoader() {
    return `
      <span id="btn-loader">
				<span class="loader-alt"></span>
			</span>
    `
  }

  getHeader() {
    return `
      <div class="head">
				<div class="logo">
					<h2 class="main">
						<span class="action">Join</span> - Qval</h2>
					<span class="slogan">Create and contribute to ideas that can change the world.</span>
				</div>
			</div>
    `
  }

  getStages() {
    return `
      <div class="stages welcome-stages">
				<span class="no stage first active">1</span>
				<span class="no stage second">2</span>
				<span class="no stage third">3</span>
				<span class="stage done">
					<span class="left"></span>
					<span class="right"></span>
				</span>
			</div>
    `
  }

  getWelcome() {
    return `
      <div class="welcome">
				<p>
					Connect with your audience, amplify collaborations, and share your knowledge without limits.
					Build a vibrant project hub where ideas ignite and progress shines.
				</p>
				<a href=${this.getAttribute('login')} class="login">Login</a>
				<a href=${this.getAttribute('register')} class="register">Register</a>
				<div class="info">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill"
						viewBox="0 0 16 16">
						<path
							d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
					By continuing you indicate that you agree to <a href="" class="aduki">aduki's</a> <a href="">Terms of Service</a> and <a href="">Privacy
						Policy</a>.
				</div>
			</div>
    `
  }

  getRegSuccess(data) {
    return `
      <div class="finish">
        <h2 class="title">Welcome!</h2>
				<p>
					Dear ${data.name} your account has been created successfully. Please log in into your account to start sharing great ideas.
				</p>
				<a href="/login/" class="login">Login</a>
			</div>
    `
  }

  getLoginSuccess(name) {
    return `
      <div class="finish login-success">
        <p>Welcome</p>
        <h2 class="title">${name}</h2>
				<p>
					You've successfully login into your account, click continue to proceed.
				</p>
				<a href="/login/" class="continue">Continue</a>
			</div>
    `
  }

  getRegistrationForm() {
    return /* html */`
      <form class="fields initial">
				${this.getBioFields()}
				<div class="actions">
					<button type="button" class="action prev">
						<span class="text">Back</span>
					</button>
					<button type="submit" class="action next">
						<span class="text">Continue</span>
					</button>
				</div>
			</form>
    `
  }

  getServerMsg = text => {
    return `
      <p class="server-status">${text}</p>
    `
  }

  getBioFields() {
    return `
      <div class="field bio">
				<div class="input-group firstname">
					<label for="firstname" class="center">First name</label>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
					<input data-name="firstname" type="text" name="firstname" id="firstname" placeholder="Enter your first name" required>
					<span class="status">First name is required</span>
				</div>
				<div class="input-group lastname">
					<label for="lastname" class="center">Last name</label>
					<input data-name="lastname" type="text" name="lastname" id="lastname" placeholder="Enter your last name" required>
					<span class="status">Last name is required</span>
				</div>
				<div class="input-group email">
					<label for="email" class="center">Email</label>
					<input data-name="Email" type="email" name="email" id="email" placeholder="Enter your email" required>
					<span class="status">Email is required</span>
				</div>
			</div>
    `
  }

  getPasswordFields() {
    return `
      <div class="field password bio">
				<div class="input-group password">
					<label for="password" class="center">Password</label>
					<input data-name="password" type="password" name="password" id="password" placeholder="Enter your password" required>
					<span class="status">Password is required</span>
				</div>
				<div class="input-group repeat-password">
					<label for="password2" class="center">Repeat password</label>
					<input data-name="password2" type="password" name="password2" id="password2" placeholder="Repeat your password" required>
					<span class="status">Password is required</span>
				</div>
			</div>
    `
  }

  getLoginForm() {
    return `
      <form class="fields initial bio">
				<div class="field login bio">
					<div class="input-group user-key">
						<label for="user-key" class="center">Username or email</label>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
						</svg>
						<input data-name="user-key" type="text" name="user-key" id="user-key" placeholder="Enter username or email"
							required>
						<span class="status">Username or email is required</span>
					</div>
					<div class="input-group password">
						<label for="password" class="center">Password</label>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
							<path
								d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
						</svg>
						<input data-name="password" type="password" name="password" id="password" placeholder="Enter password"
							required>
						<span class="status">Password is required</span>
					</div>
				</div>
				<div class="actions">
					<button type="button" class="action prev">
						<span class="text">Back</span>
					</button>
					<button type="submit" class="action next">
						<span class="text">Login</span>
					</button>
				</div>
			</form>
    `
  }

  getFooter() {
    const newDate = new Date(Date.now());
    return `
      <ul class="footer">
				<li>
					<span class="dot"></span>
					<a href="" class="copyright">
						<span class="copy">&copy;</span>
						<span class="year">${newDate.getFullYear()}</span>
						aduki Inc.
					</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">About</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">Community</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">Privacy</a>
				</li>
				<li>
					<span class="dot"></span>
					<a href="">Terms</a>
				</li>
			</ul>
    `
  }

  getStyles() {
    return /*css*/`
      <style>
        * {
          box-sizing: border-box !important;
        }
        *,
        *:after,
        *:before {
          box-sizing: border-box;
          font-family: var(--font-read), sans-serif;
        }

        *:focus {
          outline: inherit !important;
        }

        *::-webkit-scrollbar {
          width: 3px;
        }

        *::-webkit-scrollbar-track {
          background: #DDDDD7;
        }

        *::-webkit-scrollbar-thumb {
          width: 3px;
          background: linear-gradient(#53595f, #627ea0);
          border-radius: 50px;
        }

        :host{
          width: 100%;
          min-height: 100vh;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-position: 100%;
          background-size: cover;
          background-size: 1rem 1rem;
          background-color: #f8f9fa;
          background-image: radial-gradient(circle, #dee2e6 1px, rgba(0, 0, 0, 0) 1px);
        }

        #loader-container {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 5;
          background-color: var(--loader-background);
          backdrop-filter: blur(1px);
          -webkit-backdrop-filter: blur(1px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
          -webkit-border-radius: inherit;
          -moz-border-radius: inherit;
        }

        #loader-container > .loader {
          width: 35px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        @keyframes l38 {
          100% {
            background-position: 100% 0, 100% 100%, 0 100%, 0 0
          }
        }

        #btn-loader {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
        }

        #btn-loader > .loader-alt {
          width: 20px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #18A565 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #21D029 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        #btn-loader > .loader {
          width: 20px;
          aspect-ratio: 1;
          --_g: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g1: no-repeat radial-gradient(farthest-side, #ffffff 94%, #0000);
          --_g2: no-repeat radial-gradient(farthest-side, #df791a 94%, #0000);
          --_g3: no-repeat radial-gradient(farthest-side, #f09c4e 94%, #0000);
          background:    var(--_g) 0 0,    var(--_g1) 100% 0,    var(--_g2) 100% 100%,    var(--_g3) 0 100%;
          background-size: 30% 30%;
          animation: l38 .9s infinite ease-in-out;
          -webkit-animation: l38 .9s infinite ease-in-out;
        }

        .logon-container {
          background: var(--logon-background);
          z-index: 3;
          padding: 20px;
          width: 700px;
          height: max-content;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: var(--logon-shadow);
          border-radius: 10px;
          position: relative;
        }

        .logon-container > .head {
          background-color: transparent;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-family: var(--font-text), sans-serif;
        }

        .logon-container > .head > .logo {
          max-height: max-content;
          position: relative;
          padding: 0;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .logon-container >.head>.logo h2 {
          margin: 0;
          padding: 0;
          line-height: 1.4;
          font-weight: 600;
          font-size: 1.8rem;
          color: transparent;
          background: var(--stage-no-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-family: var(--font-main), monospace;
        }

        .logon-container > .head > .logo span.slogan {
          margin: 0;
          width: 100%;
          color: var(--gray-color);
          line-height: 1.4;
          font-family: var(--font-main), sans-serif;
          font-weight: 400;
          font-size: 0.9rem;
          text-align: center;
        }

        .logon-container > .stages {
          background-color: transparent;
          height: max-content;
          width: max-content;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin: 10px 0 10px 0;
        }

        .logon-container > .stages span.done {
          background: var(--stage-done-linear);
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .logon-container>.stages span.done > span {
          display: inline-block;
          height: 3px;
          width: 8px;
          position: absolute;
          background-color: var(--white-color);
          border-radius: 5px;
          -webkit-border-radius: 5px;
          -moz-border-radius: 5px;
        }

        .logon-container>.stages span.done>span.left {
          top: 15px;
          left: 7px;
          rotate: 45deg;
        }

        .logon-container>.stages span.done>span.right {
          rotate: -45deg;
          left: 11px;
          width: 14px;
        }

        .logon-container>.stages span.done.active {
          background: var(--stage-active-linear);
        }

        .logon-container > .stages span.no {
          text-align: center;
          font-weight: 600;
          font-size: 1.2rem;
          padding: 3px 2px 0 2px;
          background: var(--stage-done-linear);
          color: var(--white-color);
          width: 30px;
          height: 30px;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .logon-container > .stages.login span.no.fourth,
        .logon-container > .stages.login span.no.third {
          display: none;
        }

        .logon-container > .stages.welcome-stages span.no.fourth,
        .logon-container > .stages.welcome-stages span.no.third {
          display: none;
        }

        .logon-container > .stages.register span.no.fourth,
        .logon-container > .stages.register span.no.third {
          display: none;
        }

        .logon-container > .stages span.no.active {
          background: var(--stage-no-linear);
        }

        .logon-container > .welcome {
          width: 90%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          row-gap: 10px;
          justify-content: center;
        }

        .logon-container > .finish {
          width: 90%;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }

        .logon-container > .finish > h2 {
          margin: 10px 0;
          text-align: center;
          color: var(--text-color);
          line-height: 1.4;
          font-size: 1.5rem;
        }

        p.server-status {
          grid-column: 1/3;
          margin: 0;
          order: 0;
          text-align: center;
          font-family: var(--font-read), sans-serif;
          color: var(--error-color);
          font-weight: 500;
          line-height: 1.4;
          font-size: 1.18rem;
        }

        .logon-container > .finish  p,
        .logon-container>.welcome  p {
          grid-column: 1/3;
          margin: 0;
          text-align: center;
          font-family: var(--font-read), sans-serif;
          color: var(--text-color);
          line-height: 1.4;
          font-size: 1.15rem;
        }

        .logon-container > .finish > a,
        .logon-container >.welcome > a {
          background: var(--stage-no-linear);
          text-decoration: none;
          padding: 10px 20px;
          cursor: pointer;
          margin: 20px 0;
          width: 150px;
          justify-self: center;
          text-align: center;
          color: var(--white-color);
          border: none;
          font-size: 1.15rem;
          font-weight: 500;
          border-radius: 15px;
        }

        .logon-container > .welcome > a:last-of-type {
          background: var(--stage-active-linear);
        }

        .logon-container >.welcome > .info {
          grid-column: 1/3;
          text-align: center;
          color: var(--text-color);
          line-height: 1.4;
        }


        .logon-container > .welcome > .info svg {
          margin: 0 0 -3px 0;
          color: var(--accent-color);
          width: 18px;
          height: 18px;
        }

        .logon-container > .welcome > .info .aduki {
          color: transparent;
          background: var(--stage-no-linear);
          background-clip: text;
          -webkit-background-clip: text;
          font-weight: 400;
        }

        .logon-container>.welcome>.info a {
          color: var(--gray-color);
          /* font-style: italic; */
          font-size: 1em;
        }

        .logon-container>.welcome>.info a:hover {
          color: transparent;
          text-decoration: underline;
          background: var(--stage-active-linear);
          background-clip: text;
          -webkit-background-clip: text;

        }

        .logon-container > .fields {
          margin: 0 0 20px 0;
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .logon-container > .fields .field.bio{
          display: grid;
          grid-template-columns: 1fr 1fr;
          justify-content: center;
          column-gap: 20px;
          row-gap: 20px;
        }

        .logon-container > .fields > .field {
          width: 90%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          gap: 2px;
        }

        .logon-container > .fields.center > .field {
          align-items: center;
        }

        .logon-container > .fields .field .input-group {
          width: 100%;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: start;
          color: var(--text-color);
          gap: 5px;
          position: relative;
          transition: border-color 0.3s ease-in-out;
        }

        .logon-container > .fields .field.bio .input-group {
          width: 100%;
        }

        .logon-container > .fields .field.bio .input-group.email {
          grid-column: 1/3;
          width: 100%;
        }

        .logon-container > .fields .field .input-group > svg {
          position: absolute;
          right: 10px;
          top: 38px;
          width: 20px;
          height: 20px;
        }

        .logon-container > .fields .field .input-group > svg {
          display: none;
        }

        .logon-container > .fields .field .input-group.success > svg {
          display: inline-block;
        }
        .logon-container > .fields .field  .input-group.failed > svg {
          display: inline-block;
        }

        .logon-container > .fields .field .input-group.success > svg {
          color: var(--accent-color);
        }

        .logon-container > .fields .field  .input-group.failed > svg {
          color: var(--error-color);
        }

        .logon-container > .fields label {
          padding: 0 0 5px 0;
          color: var(--text-color);
        }

        .logon-container > .fields .field.bio label{
          padding: 0 0 0 5px;
        }

        .logon-container > .fields label {
          color: var(--text-color);
          font-size: 1.1rem;
          font-family: var(--font-main),sans-serif;
          transition: all 0.3s ease-in-out;
          pointer-events: none;
        }

        .logon-container > .fields .field input {
          border: var(--input-border);
          font-size: 1rem;
          width: 100%;
          height: 40px;
          outline: none;
          padding: 10px 12px;
          border-radius: 12px;
          color: var(--text-color);
        }

        .logon-container > .fields .field input:focus {
          border: var(--input-border-focus);
        }

        .logon-container > .fields .field  .input-group.success input,
        .logon-container > .fields .field  .input-group.success input:focus {
          border: var(--input-border-focus);
        }

        .logon-container > .fields .field  .input-group.failed input,
        .logon-container > .fields .field  .input-group.failed input:focus {
          border: var(--input-border-error);
        }

        .logon-container > .fields .field  .input-group.success input {
          color: var(--accent-color);
        }

        .logon-container > .fields .field .input-group.failed input {
          color: var(--error-color);
        }

        .logon-container > .fields label.focused {
          top: -10px;
          font-size: 0.9rem;
          background-color: var(--label-focus-background);
          padding: 0 5px;
        }

        .logon-container > .fields .field span.status {
          color: var(--error-color);
          font-size: 0.95rem;
          display: none;
          padding: 0 0 0 5px;
        }

        .logon-container > .fields .field .input-group.failed span.status {
          color: var(--error-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        .logon-container > .fields .field  .input-group.success span.status {
          color: var(--accent-color);
          font-size: 0.8rem;
          display: inline-block;
        }

        .logon-container > .fields .field  .input-group.success span.status {
          display: none;
        }

        .logon-container > .fields .actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 90%;
          margin: 20px 0 0 0;
        }

        .logon-container > .fields .actions > .action {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          border: none;
          border-radius: 15px;
          font-family: var(--font-main), sans-serif;
          line-height: 1.2;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--text-color);
          width: 120px;
          padding: 8px 10px;
          height: 40px;
          cursor: pointer;
          position: relative;
          -webkit-border-radius: 15px;
          -moz-border-radius: 15px;
        }

        .logon-container > .fields .actions > .action.prev {
          background: var(--stage-done-linear);
        }

        .logon-container > .fields .actions > .action.prev svg path {
          fill: var(--text-color);
        }

        .logon-container > .fields .actions > .action.next {
          color: var(--white-color);
          background: var(--stage-no-linear);
        }

        .logon-container >.fields .actions > .action.next svg path {
          fill: var(--white-color);
        }

        .logon-container>.fields .actions>.action.disabled {
          pointer-events: none;
        }


        /* Logon Footer */
        .logon-container >.footer {
          border-top: var(--story-border);
          margin: 10px 0 0 0;
          width: 100%;
          padding: 10px 0 10px 0;
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 15px;
        }

        .logon-container > .footer > li {
          display: flex;
          flex-flow: row;
          justify-content: center;
          align-items: center;
          gap: 5px;
          font-family: var(--font-read), sans-serif;
          color: var(--gray-color);
          cursor: pointer;
        }

        .logon-container > .footer > li span.dot {
          display: inline-block;
          margin: 2px 0 0 0;
          width: 5px;
          height: 5px;
          background-color: var(--gray-color);
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
        }

        .logon-container > .footer > li a {
          color: inherit;
          line-height: 1.4;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 400;
        }

        .logon-container > .footer > li:hover {
          color: var(--anchor-active);
          text-decoration: underline;
        }

        .logon-container > .footer > li:hover span.dot {
          background-color: var(--anchor-active);
        }

        .logon-container > .footer > li a.copyright {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          font-family: var(--font-read), sans-serif;
        }

        .logon-container > .footer > li a.copyright .year {
          font-family: var(--font-read), sans-serif;
          font-size: 1em;
          padding: 0 5px 0 2px;
          font-weight: 400;
        }

        @media screen and (max-width:700px) {

          :host {
            width: 100%;
            min-height: 100vh;
            height: 100%;
            display: flex;
            align-items: start;
            justify-content: center;
            background-color: var(--background);
            background-position: unset;
            background-size: unset;
            background-size: unset;
            background-image: unset;
          }

          .logon-container > .head {
            background-color: transparent;
            margin: 20px 0 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            font-family: var(--font-text), sans-serif;
          }

          .logon-container > .stages {
            background-color: transparent;
            height: max-content;
            width: max-content;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin: 0 0 20px 0;
          }

          .logon-container {
            background: var(--background);
            box-shadow: unset;
            z-index: 3;
            padding: 20px 10px;
            width: 100%;
            height: max-content;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            border-radius: 0;
            position: relative;
          }

          .logon-container > .welcome {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            row-gap: 10px;
            justify-content: center;
          }

          .logon-container > .finish > a,
          .logon-container > .welcome > a {
            background: var(--stage-no-linear);
            text-decoration: none;
            padding: 8px 20px;
            cursor: default;
            margin: 20px 0;
            width: 130px;
          }

          .logon-container > .finish  p,
          .logon-container>.welcome  p {
            font-size: 1rem;
          }

          .logon-container > .fields .actions > .action {
            cursor: default;
          }

          .logon-container > .fields .field.bio{
            display: flex;
            flex-flow: column;
            gap: 20px;
          }

          .logon-container > .welcome > .info {
            margin: 20px 0 0 0;
            font-size: 0.9rem;
          }

          .logon-container > .welcome > .info svg {
            margin: 0 0 -3px 0;
            color: var(--accent-color);
            width: 14px;
            height: 14px;
          }

          .logon-container > .footer {
            margin: 10px 0 0 0;
            display: flex;
            flex-flow: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 0;
          }

          .logon-container > .footer > li {
            display: flex;
            margin: 5px 10px 0 0;
            cursor: default;
          }

          .logon-container > .footer > li a {
            color: inherit;
            line-height: 1.4;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 400;
          }

          .logon-container > .footer > li:first-of-type {
            order: 5;
          }
        }

      </style>
    `;
  }
}