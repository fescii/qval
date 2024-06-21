export default class HeaderContainer extends HTMLElement {
  constructor() {
    // We are not even going to touch this.
    super();

    this._authenticated = false;

    // let's create our shadow root
    this.shadowObj = this.attachShadow({ mode: "open" });

    this.render();
  }

  render() {
    this.shadowObj.innerHTML = this.getTemplate();
  }

  connectedCallback() {
    // console.log('We are inside connectedCallback');
    this.expandLists();
    this.activateSlide();
  }

  activateSlide = () => {
    const self = this;
    // Mobile Switcher
    const mobileCheckbox = this.shadowObj.querySelector('.nav input.nav-input');
    const mobileOptions = this.shadowObj.querySelector('ul.left');

    // console.log(mobileCheckbox);
    // console.log(mobileOptions);

    if (mobileCheckbox && mobileOptions) {
      mobileCheckbox.addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
          // console.log(mobileOptions);
          mobileOptions.style.setProperty('left', 0);
          self.disableScroll();
        }
        else {
          mobileOptions.style.setProperty('left', '-115%');
          self.enableScroll();
        }
      })
    }
  }

  expandLists = () => {
    const mql = window.matchMedia('(max-width: 600px)');
    if (mql.matches) {
      const expandableHeaderLinks = this.shadowObj.querySelectorAll('ul.left > li.link.options-link');
      let activeLink = this.shadowObj.querySelector('ul.left > li.link.options-link.active');
      if (expandableHeaderLinks) {
        expandableHeaderLinks.forEach(link => {
          // const options = link.querySelector('div.drop-down');
          link.addEventListener('click', event => {
            event.preventDefault();

            if (activeLink) {
              if (activeLink.dataset.name !== link.dataset.name) {
                activeLink.classList.remove('active');
              }
            }

            // let isActive = event.target.classList.contains('active');

            // console.log(isActive);
            link.classList.toggle('active');
            activeLink = link;
          })
        });
      }
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

  getTemplate() {
    // Show HTML Here
    return `
      ${this.getBody()}
      ${this.getStyles()}
    `;
  }

  getBody() {
    return `
      ${this.getNav()}
      ${this.getLogo()}
      ${this.getLeft(this._authenticated)}
      ${this.getRight(this._authenticated)}
    `;
  }

  getNav = () => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches) {
      return /* html */`
        <div class="nav">
          <input class="nav-input" type="checkbox" />
          <svg>
            <use xlink:href="#menu" />
            <use xlink:href="#menu" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
            <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 56" id="menu">
              <path d="M48.33,45.6H18a14.17,14.17,0,0,1,0-28.34H78.86a17.37,17.37,0,0,1,0,34.74H42.33l-21-21.26L47.75,4" />
            </symbol>
          </svg>
        </div>
      `;
    }
    else {
      return '';
    }
  }

  getLogo = () => {
    return `
			<h2 class="site-name">Qval</h2>
		`
  }

  getLeft = (authenticated) => {
    const mql = window.matchMedia('(max-width: 660px)');
    if (mql.matches && authenticated) {
      return `
        <ul class="left">
          ${this.getLeftAccount(authenticated)}
          ${this.getLeftLogout(authenticated)}
        </ul>
      `
    }
    else if (mql.matches && !authenticated) {
      return `
        <ul class="left">
          ${this.getLeftAccount(authenticated)}
          ${this.getLeftAll()}
          ${this.getLeftArticles()}
          ${this.getLeftResources()}
        </ul>
      `
    }
    else {
      return `
        <ul class="left">
          ${this.getLeftAccount(authenticated)}
          ${this.getLeftAll()}
          ${this.getLeftArticles()}
          ${this.getLeftResources()}
        </ul>
      `
    }
  }

  getLeftAccount = (authenticated) => {
    if (authenticated) {
      return /* html */`
        <div class="account">
          <a href="" class="profile">
            <span class="text">Your account</span>
            <span class="image">
              <img src="${this.getAttribute('user-img')}" alt="Profile picture">
            </span>
          </a>
          <a href="" class="donate">
            <span class="text">Donate to us</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
              <path  d="M304 24V41.3c8.5 1.2 16.7 3.1 24.1 5.1c8.5 2.3 13.6 11 11.3 19.6s-11 13.6-19.6 11.3c-11.1-3-22-5.2-32.1-5.3c-8.4-.1-17.3 1.8-23.6 5.5c-5.7 3.4-8.1 7.3-8.1 12.8c0 3.7 1.3 6.5 7.3 10.1c6.9 4.1 16.6 7.1 29.2 10.9l.5 .1 0 0c11.3 3.4 25.3 7.6 36.3 14.6c12.1 7.6 22.4 19.7 22.7 38.2c.3 19.3-9.6 33.3-22.9 41.6c-7.7 4.8-16.4 7.6-25.1 9.1V232c0 8.8-7.2 16-16 16s-16-7.2-16-16V214.2c-11.2-2.1-21.7-5.7-30.9-8.9c-2.1-.7-4.2-1.4-6.2-2.1c-8.4-2.8-12.9-11.9-10.1-20.2s11.9-12.9 20.2-10.1c2.5 .8 4.8 1.6 7.1 2.4l0 0 0 0c13.6 4.6 24.6 8.4 36.3 8.7c9.1 .3 17.9-1.7 23.7-5.3c5.1-3.2 7.9-7.3 7.8-14c-.1-4.6-1.8-7.8-7.7-11.6c-6.8-4.3-16.5-7.4-29-11.2l-1.6-.5 0 0c-11-3.3-24.3-7.3-34.8-13.7c-12-7.2-22.6-18.9-22.7-37.3C224 71.1 234.9 57.7 247.9 50c7.5-4.4 15.8-7.2 24.1-8.7V24c0-8.8 7.2-16 16-16s16 7.2 16 16zM151 317.4c13.1-8.8 28.6-13.4 44.4-13.4H344c30.9 0 56 25.1 56 56c0 8.6-1.9 16.7-5.4 24h5.6l94.7-56.4c8.3-4.9 17.8-7.6 27.5-7.6h1.3c28.9 0 52.3 23.4 52.3 52.3c0 17.7-9 34.2-23.8 43.8L432.6 493.9c-18.2 11.8-39.4 18.1-61 18.1H16c-8.8 0-16-7.2-16-16s7.2-16 16-16H371.5c15.5 0 30.6-4.5 43.6-12.9l119.6-77.8c5.8-3.7 9.2-10.2 9.2-17c0-11.2-9.1-20.3-20.3-20.3h-1.3c-3.9 0-7.7 1.1-11.1 3l-98.5 58.7c-2.5 1.5-5.3 2.3-8.2 2.3H344 320 256c-8.8 0-16-7.2-16-16s7.2-16 16-16h64 24c13.3 0 24-10.7 24-24s-10.7-24-24-24H195.4c-9.5 0-18.7 2.8-26.6 8.1L88.9 397.3c-2.6 1.8-5.7 2.7-8.9 2.7H16c-8.8 0-16-7.2-16-16s7.2-16 16-16H75.2L151 317.4z" />
            </svg>
          </a>
          <a href="" class="settings">
            <span class="text">Control center</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75024 11.9999C8.75024 13.7919 10.2082 15.2499 12.0002 15.2499C13.7922 15.2499 15.2502 13.7919 15.2502 11.9999C15.2502 10.2079 13.7922 8.74988 12.0002 8.74988C10.2082 8.74988 8.75024 10.2079 8.75024 11.9999ZM10.2502 11.9999C10.2502 11.0349 11.0352 10.2499 12.0002 10.2499C12.9652 10.2499 13.7502 11.0349 13.7502 11.9999C13.7502 12.9649 12.9652 13.7499 12.0002 13.7499C11.0352 13.7499 10.2502 12.9649 10.2502 11.9999Z" fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M8.77475 19.0081C8.77475 20.7961 10.2217 22.2501 11.9997 22.2501C13.7777 22.2501 15.2247 20.7961 15.2247 19.0081C15.2247 18.5851 15.5047 18.3781 15.6257 18.3081C15.7447 18.2411 16.0557 18.1061 16.4117 18.3111C17.1567 18.7451 18.0248 18.8591 18.8568 18.6371C19.6908 18.4131 20.3878 17.8751 20.8188 17.1231C21.7058 15.5771 21.1758 13.5921 19.6388 12.6981C19.2798 12.4881 19.2407 12.1401 19.2407 12.0001C19.2407 11.8601 19.2798 11.5121 19.6397 11.3031C21.1758 10.4101 21.7048 8.42512 20.8188 6.87712C20.3868 6.12412 19.6898 5.58712 18.8557 5.36312C18.0238 5.14312 17.1567 5.25812 16.4127 5.69012C16.0567 5.89512 15.7427 5.75912 15.6257 5.69112C15.5047 5.62212 15.2247 5.41512 15.2247 4.99212C15.2247 3.20412 13.7777 1.75012 11.9997 1.75012C10.2217 1.75012 8.77475 3.20412 8.77475 4.99212C8.77475 5.41512 8.49475 5.62212 8.37375 5.69112C8.25575 5.76212 7.94275 5.89612 7.58875 5.69012C6.84375 5.25812 5.97675 5.14312 5.14375 5.36312C4.30975 5.58712 3.61275 6.12412 3.18075 6.87712C2.29475 8.42512 2.82375 10.4101 4.35975 11.3031C4.71975 11.5121 4.75775 11.8601 4.75775 12.0001C4.75775 12.1391 4.71975 12.4881 4.35975 12.6971C2.82375 13.5921 2.29475 15.5771 3.18075 17.1231C3.61175 17.8751 4.30875 18.4121 5.14275 18.6371C5.97375 18.8591 6.84275 18.7441 7.58975 18.3101C7.94275 18.1051 8.25575 18.2411 8.37375 18.3081C8.49375 18.3781 8.77475 18.5851 8.77475 19.0081ZM9.12075 17.0091C8.76475 16.8041 8.37375 16.7011 7.98275 16.7011C7.58775 16.7011 7.19375 16.8051 6.83475 17.0141C6.43675 17.2441 5.97375 17.3061 5.53175 17.1871C5.08675 17.0681 4.71275 16.7801 4.48275 16.3771C4.00375 15.5441 4.28775 14.4741 5.11475 13.9941C5.83075 13.5771 6.25775 12.8311 6.25775 12.0001C6.25775 11.1691 5.83075 10.4231 5.11375 10.0061C4.28875 9.52512 4.00475 8.45712 4.48175 7.62312C4.71275 7.22012 5.08675 6.93112 5.53175 6.81212C5.97575 6.69612 6.43775 6.75712 6.83575 6.98712C7.55075 7.40312 8.40575 7.40412 9.12175 6.99212C9.84375 6.57612 10.2747 5.82912 10.2747 4.99212C10.2747 4.03112 11.0487 3.25012 11.9997 3.25012C12.9507 3.25012 13.7247 4.03112 13.7247 4.99212C13.7247 5.82812 14.1547 6.57512 14.8767 6.99112C15.5937 7.40412 16.4487 7.40112 17.1657 6.98712C17.5627 6.75712 18.0237 6.69412 18.4677 6.81212C18.9137 6.93112 19.2868 7.22012 19.5177 7.62312C19.9948 8.45712 19.7118 9.52612 18.8848 10.0061C18.1688 10.4231 17.7417 11.1691 17.7417 12.0001C17.7417 12.8311 18.1688 13.5771 18.8848 13.9941C19.7118 14.4741 19.9958 15.5441 19.5177 16.3771C19.2868 16.7801 18.9137 17.0681 18.4677 17.1871C18.0247 17.3061 17.5627 17.2441 17.1657 17.0141C16.4507 16.5981 15.5947 16.5971 14.8777 17.0091C14.1557 17.4241 13.7247 18.1721 13.7247 19.0081C13.7247 19.9691 12.9507 20.7501 11.9997 20.7501C11.0487 20.7501 10.2747 19.9691 10.2747 19.0081C10.2747 18.1711 9.84375 17.4241 9.12075 17.0091Z" fill="currentColor" />
            </svg>
          </a>
        </div>
      `
    }
    else {
    return /* html */`
      <div class="account out">
        <a href="" class="login">Login</a>
        <a href="" class="signup">Sign Up</a>
      </div>
    `
    }
  }

  getLeftAnalytics = (authenticated) => {
    if (authenticated) {
      return `
        <a href="${this.getAttribute('user-analytics')}" class="link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-activity" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2" />
          </svg>
          <span class="content">
            <h5 class="name">Analytics</h5>
            <span class="text">View content performance</span>
          </span>
        </a>
      `
    }
    else {
      return `
        <a href="${this.getAttribute('create-account')}" class="link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-activity" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2" />
          </svg>
          <span class="content">
            <h5 class="name">Analytics</h5>
            <span class="text">Log in to view</span>
          </span>
        </a>
      `
    }
  }

  getLeftAll = () => {
    return /* html */ `
      <li data-name="all" class="link options-link">
        <span class="link-item">
          <span class="text">All</span>
          <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z" fill="currentColor"></path>
          </svg>
        </span>
        <div class="drop-down">
          <span class="arrow"></span>
          <ul class="main">
            <h4 class="title">avalQ</h4>
            <li class="item article">
              <a href="${this.getAttribute('home')}" class="link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.62573 15.6965C7.62573 15.2823 7.96152 14.9465 8.37573 14.9465H15.5957C16.0099 14.9465 16.3457 15.2823 16.3457 15.6965C16.3457 16.1107 16.0099 16.4465 15.5957 16.4465H8.37573C7.96152 16.4465 7.62573 16.1107 7.62573 15.6965Z" fill="currentColor" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.62573 11.9368C7.62573 11.5226 7.96152 11.1868 8.37573 11.1868H15.5957C16.0099 11.1868 16.3457 11.5226 16.3457 11.9368C16.3457 12.351 16.0099 12.6868 15.5957 12.6868H8.37573C7.96152 12.6868 7.62573 12.351 7.62573 11.9368Z" fill="currentColor" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.62598 8.17749C7.62598 7.76328 7.96176 7.42749 8.37598 7.42749H11.131C11.5452 7.42749 11.881 7.76328 11.881 8.17749C11.881 8.5917 11.5452 8.92749 11.131 8.92749H8.37598C7.96176 8.92749 7.62598 8.5917 7.62598 8.17749Z" fill="currentColor" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.89011 4.26997C6.42204 2.58117 8.79844 2.00024 12.001 2.00024C15.204 2.00024 17.5804 2.58116 19.1123 4.26999C20.624 5.93673 21.142 8.50197 21.142 12.0002C21.142 15.4985 20.624 18.0638 19.1123 19.7305C17.5804 21.4193 15.204 22.0002 12.001 22.0002C8.79844 22.0002 6.42204 21.4193 4.89011 19.7305C3.37819 18.0638 2.85999 15.4986 2.85999 12.0002C2.85999 8.50191 3.37819 5.93669 4.89011 4.26997ZM6.00111 5.27777C4.89078 6.5018 4.35999 8.56158 4.35999 12.0002C4.35999 15.4389 4.89078 17.4987 6.00111 18.7227C7.09143 19.9247 8.91053 20.5002 12.001 20.5002C15.092 20.5002 16.911 19.9247 18.0012 18.7227C19.1114 17.4987 19.642 15.439 19.642 12.0002C19.642 8.56151 19.1114 6.50175 18.0012 5.27775C16.911 4.07583 15.092 3.50024 12.001 3.50024C8.91053 3.50024 7.09143 4.07582 6.00111 5.27777Z" fill="currentColor" />
                </svg>
                <span class="content">
                  <h5 class="name">Articles</h5>
                  <span class="text">View and create articles.</span>
                </span>
              </a>
            </li>
            <li class="item bulk">
              <a href="${this.getAttribute('journals')}" class="link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.15552 15.45C8.15552 15.0357 8.4913 14.7 8.90552 14.7H14.3055C14.7197 14.7 15.0555 15.0357 15.0555 15.45C15.0555 15.8642 14.7197 16.2 14.3055 16.2H8.90552C8.4913 16.2 8.15552 15.8642 8.15552 15.45Z" fill="currentColor" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.15454 11.4386C8.15454 11.0244 8.49033 10.6886 8.90454 10.6886H12.2605C12.6748 10.6886 13.0105 11.0244 13.0105 11.4386C13.0105 11.8528 12.6748 12.1886 12.2605 12.1886H8.90454C8.49033 12.1886 8.15454 11.8528 8.15454 11.4386Z" fill="currentColor" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.93052 4.27249C6.46237 2.58293 8.83824 2 12.0399 2C12.9666 2 13.8214 2.05142 14.5917 2.15694C14.7477 2.17832 14.8931 2.24827 15.0071 2.3569L20.6771 7.7569C20.7923 7.86656 20.8696 8.00998 20.8979 8.16645C21.0983 9.27377 21.1899 10.5511 21.1899 12C21.1899 15.4998 20.6712 18.0653 19.1576 19.7318C17.6242 21.42 15.2455 22 12.0399 22C8.83897 22 6.46283 21.4199 4.93074 19.7315C3.41862 18.0651 2.8999 15.4999 2.8999 12C2.8999 8.5048 3.41874 5.93992 4.93052 4.27249ZM6.04178 5.28001C4.93107 6.50508 4.3999 8.5652 4.3999 12C4.3999 15.4401 4.93118 17.4999 6.04156 18.7235C7.13197 19.9251 8.95083 20.5 12.0399 20.5C15.1343 20.5 16.9557 19.925 18.0472 18.7232C19.1586 17.4997 19.6899 15.4402 19.6899 12C19.6899 10.7185 19.6149 9.61383 19.4626 8.67165L14.1509 3.61282C13.52 3.53823 12.8146 3.5 12.0399 3.5C8.95156 3.5 7.13244 4.07707 6.04178 5.28001Z" fill="currentColor" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9343 2.08264C14.3485 2.08264 14.6843 2.41843 14.6843 2.83264V5.49364C14.6843 6.93714 15.8542 8.10664 17.2983 8.10664H20.2493C20.6635 8.10664 20.9993 8.44243 20.9993 8.85664C20.9993 9.27086 20.6635 9.60664 20.2493 9.60664H17.2983C15.0264 9.60664 13.1843 7.76615 13.1843 5.49364V2.83264C13.1843 2.41843 13.5201 2.08264 13.9343 2.08264Z" fill="currentColor" />
                </svg>
                <span class="content">
                  <h5 class="name">Journals</h5>
                  <span class="text">Add public journals</span>
                </span>
              </a>
            </li>
            <li class="item icon">
              ${this.getLeftAnalytics(this._authenticated)}
            </li>
            <li class="item bulk authors">
              <a href="${this.getAttribute('authors')}" class="link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.58012 12.0259H9.61012C12.4301 12.0259 14.7241 9.73187 14.7241 6.91087C14.7241 4.09087 12.4301 1.79688 9.61012 1.79688C6.79112 1.79688 4.49712 4.09088 4.49712 6.90788C4.49112 8.27087 5.01712 9.55287 5.97712 10.5199C6.93612 11.4849 8.21512 12.0209 9.58012 12.0259ZM5.99712 6.91088C5.99712 4.91788 7.61812 3.29688 9.61012 3.29688C11.6031 3.29688 13.2241 4.91788 13.2241 6.91088C13.2241 8.90388 11.6031 10.5259 9.61012 10.5259H9.58312C8.62112 10.5219 7.71812 10.1449 7.04212 9.46187C6.36412 8.77987 5.99312 7.87488 5.99712 6.91088Z" fill="currentColor" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.05078 18.6743C2.05078 22.2033 7.54278 22.2033 9.60978 22.2033C11.4788 22.2033 17.1688 22.2033 17.1688 18.6543C17.1688 15.9673 13.7078 13.6963 9.60978 13.6963C5.51178 13.6963 2.05078 15.9753 2.05078 18.6743ZM3.55078 18.6743C3.55078 17.0323 6.14178 15.1963 9.60978 15.1963C13.0778 15.1963 15.6688 17.0213 15.6688 18.6543C15.6688 20.3473 12.3738 20.7033 9.60978 20.7033C5.58878 20.7033 3.55078 20.0203 3.55078 18.6743Z" fill="currentColor" />
                  <path d="M16.8532 10.8261C16.5212 10.8261 16.2182 10.6051 16.1282 10.2691C16.0222 9.86909 16.2592 9.45909 16.6602 9.35109C17.7672 9.05509 18.5402 8.04809 18.5402 6.90009C18.5412 5.70009 17.6902 4.65409 16.5162 4.41309C16.1102 4.33009 15.8482 3.93309 15.9322 3.52809C16.0142 3.12209 16.4102 2.85609 16.8172 2.94409C18.6862 3.32809 20.0412 4.99209 20.0412 6.90009C20.0412 8.72509 18.8092 10.3301 17.0462 10.8011C16.9822 10.8181 16.9162 10.8261 16.8532 10.8261Z" fill="currentColor" />
                  <path d="M18.9932 18.0196C19.0742 18.3646 19.3822 18.5976 19.7222 18.5976C19.7792 18.5976 19.8372 18.5916 19.8952 18.5776C21.0842 18.2976 21.9492 17.2986 21.9492 16.2016C21.9492 14.4746 19.8342 12.9016 17.5122 12.9016C17.0982 12.9016 16.7622 13.2376 16.7622 13.6516C16.7622 14.0656 17.0982 14.4016 17.5122 14.4016C19.1332 14.4016 20.4492 15.4916 20.4492 16.2016C20.4492 16.5486 20.1132 16.9856 19.5512 17.1176C19.1482 17.2116 18.8982 17.6166 18.9932 18.0196Z" fill="currentColor" />
                </svg>
                <span class="content">
                  <h5 class="name">Authors</h5>
                  <span class="text">Explore stories by authors</span>
                </span>
              </a>
            </li>
          </ul>
          <ul class="main">
            <h4 class="title">Technologies</h4>
            <li class="item icon">
              <a href="${this.getAttribute('github')}" class="link icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                </svg>
                <span class="content">
                  <h5 class="name">Github</h5>
                  <span class="text">Open source code.</span>
                </span>
              </a>
            </li>
            <li class="item supabase">
              <a href="${this.getAttribute('supabase')}" class="link">
                <svg width="109" height="113" viewBox="0 0 109 113" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)" />
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fill-opacity="0.2" />
                  <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#249361" />
                      <stop offset="1" stop-color="#3ECF8E" />
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
                      <stop />
                      <stop offset="1" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <span class="content">
                  <h5 class="name">Supabase</h5>
                  <span class="text">Try supabase</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
    `
  }

  getLeftProfile = authenticated => {
    if (authenticated) {
      return /* html */`
        <li class="item bulk create">
          <a href="${this.getAttribute('create-content')}" class="link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22.0001C4.617 22.0001 2 19.3831 2 12.0001C2 4.61712 4.617 2.00012 12 2.00012C12.414 2.00012 12.75 2.33612 12.75 2.75012C12.75 3.16412 12.414 3.50012 12 3.50012C5.486 3.50012 3.5 5.48612 3.5 12.0001C3.5 18.5141 5.486 20.5001 12 20.5001C18.514 20.5001 20.5 18.5141 20.5 12.0001C20.5 11.5861 20.836 11.2501 21.25 11.2501C21.664 11.2501 22 11.5861 22 12.0001C22 19.3831 19.383 22.0001 12 22.0001Z" fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2365 9.38606L20.2952 8.19072C21.4472 6.88972 21.3252 4.89472 20.0252 3.74172C19.3952 3.18372 18.5812 2.90372 17.7452 2.95572C16.9052 3.00672 16.1352 3.38272 15.5772 4.01272L9.6932 10.6607C7.8692 12.7187 9.1172 15.4397 9.1712 15.5547C9.2602 15.7437 9.4242 15.8877 9.6232 15.9497C9.6802 15.9687 10.3442 16.1717 11.2192 16.1717C12.2042 16.1717 13.4572 15.9127 14.4092 14.8367L19.0774 9.56571C19.1082 9.54045 19.1374 9.51238 19.1646 9.4815C19.1915 9.45118 19.2155 9.41925 19.2365 9.38606ZM10.4082 14.5957C11.0352 14.7097 12.4192 14.8217 13.2862 13.8427L17.5371 9.04299L15.0656 6.85411L10.8172 11.6557C9.9292 12.6567 10.2122 13.9917 10.4082 14.5957ZM16.0596 5.73076L18.5322 7.91938L19.1722 7.19672C19.7752 6.51472 19.7122 5.46872 19.0312 4.86572C18.7002 4.57372 18.2712 4.42472 17.8362 4.45272C17.3962 4.48072 16.9932 4.67672 16.7002 5.00672L16.0596 5.73076Z" fill="currentColor" />
            </svg>
            <span class="content">
              <h5 class="name">Create</h5>
              <span class="text">Create new stories</span>
            </span>
          </a>
        </li>
        <li class="item bulk">
          <a href="${this.getAttribute('user-profile')}" class="link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9617 11.8921H11.9927C14.8247 11.8921 17.1287 9.58814 17.1287 6.75614C17.1287 3.92414 14.8247 1.61914 11.9927 1.61914C9.15975 1.61914 6.85575 3.92414 6.85575 6.75314C6.85075 8.12214 7.37975 9.41014 8.34375 10.3811C9.30675 11.3511 10.5917 11.8881 11.9617 11.8921ZM8.35575 6.75614C8.35575 4.75114 9.98775 3.11914 11.9927 3.11914C13.9977 3.11914 15.6287 4.75114 15.6287 6.75614C15.6287 8.76114 13.9977 10.3921 11.9927 10.3921H11.9647C10.9967 10.3901 10.0897 10.0101 9.40775 9.32314C8.72575 8.63714 8.35275 7.72614 8.35575 6.75614Z" fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.40552 18.7561C4.40552 22.3811 10.1215 22.3811 11.9995 22.3811C13.8775 22.3811 19.5945 22.3811 19.5945 18.7341C19.5945 15.9411 16.1165 13.5811 11.9995 13.5811C7.88352 13.5811 4.40552 15.9511 4.40552 18.7561ZM5.90552 18.7561C5.90552 17.0211 8.51152 15.0811 11.9995 15.0811C15.4885 15.0811 18.0945 17.0101 18.0945 18.7341C18.0945 20.1581 16.0435 20.8811 11.9995 20.8811C7.95652 20.8811 5.90552 20.1661 5.90552 18.7561Z" fill="currentColor" />
            </svg>
            <span class="content">
              <h5 class="name">Profile</h5>
              <span class="text">Visit your profile</span>
            </span>
          </a>
        </li>
      `
    }
    else {
      return `
        <li class="item bulk create">
          <a href="${this.getAttribute('create-account')}" class="link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22.0001C4.617 22.0001 2 19.3831 2 12.0001C2 4.61712 4.617 2.00012 12 2.00012C12.414 2.00012 12.75 2.33612 12.75 2.75012C12.75 3.16412 12.414 3.50012 12 3.50012C5.486 3.50012 3.5 5.48612 3.5 12.0001C3.5 18.5141 5.486 20.5001 12 20.5001C18.514 20.5001 20.5 18.5141 20.5 12.0001C20.5 11.5861 20.836 11.2501 21.25 11.2501C21.664 11.2501 22 11.5861 22 12.0001C22 19.3831 19.383 22.0001 12 22.0001Z" fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2365 9.38606L20.2952 8.19072C21.4472 6.88972 21.3252 4.89472 20.0252 3.74172C19.3952 3.18372 18.5812 2.90372 17.7452 2.95572C16.9052 3.00672 16.1352 3.38272 15.5772 4.01272L9.6932 10.6607C7.8692 12.7187 9.1172 15.4397 9.1712 15.5547C9.2602 15.7437 9.4242 15.8877 9.6232 15.9497C9.6802 15.9687 10.3442 16.1717 11.2192 16.1717C12.2042 16.1717 13.4572 15.9127 14.4092 14.8367L19.0774 9.56571C19.1082 9.54045 19.1374 9.51238 19.1646 9.4815C19.1915 9.45118 19.2155 9.41925 19.2365 9.38606ZM10.4082 14.5957C11.0352 14.7097 12.4192 14.8217 13.2862 13.8427L17.5371 9.04299L15.0656 6.85411L10.8172 11.6557C9.9292 12.6567 10.2122 13.9917 10.4082 14.5957ZM16.0596 5.73076L18.5322 7.91938L19.1722 7.19672C19.7752 6.51472 19.7122 5.46872 19.0312 4.86572C18.7002 4.57372 18.2712 4.42472 17.8362 4.45272C17.3962 4.48072 16.9932 4.67672 16.7002 5.00672L16.0596 5.73076Z" fill="currentColor" />
            </svg>
            <span class="content">
              <h5 class="name">Create</h5>
              <span class="text">Create new stories</span>
            </span>
          </a>
        </li>
        <li class="item bulk">
          <a href="${this.getAttribute('create-account')}" class="link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9617 11.8921H11.9927C14.8247 11.8921 17.1287 9.58814 17.1287 6.75614C17.1287 3.92414 14.8247 1.61914 11.9927 1.61914C9.15975 1.61914 6.85575 3.92414 6.85575 6.75314C6.85075 8.12214 7.37975 9.41014 8.34375 10.3811C9.30675 11.3511 10.5917 11.8881 11.9617 11.8921ZM8.35575 6.75614C8.35575 4.75114 9.98775 3.11914 11.9927 3.11914C13.9977 3.11914 15.6287 4.75114 15.6287 6.75614C15.6287 8.76114 13.9977 10.3921 11.9927 10.3921H11.9647C10.9967 10.3901 10.0897 10.0101 9.40775 9.32314C8.72575 8.63714 8.35275 7.72614 8.35575 6.75614Z" fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.40552 18.7561C4.40552 22.3811 10.1215 22.3811 11.9995 22.3811C13.8775 22.3811 19.5945 22.3811 19.5945 18.7341C19.5945 15.9411 16.1165 13.5811 11.9995 13.5811C7.88352 13.5811 4.40552 15.9511 4.40552 18.7561ZM5.90552 18.7561C5.90552 17.0211 8.51152 15.0811 11.9995 15.0811C15.4885 15.0811 18.0945 17.0101 18.0945 18.7341C18.0945 20.1581 16.0435 20.8811 11.9995 20.8811C7.95652 20.8811 5.90552 20.1661 5.90552 18.7561Z" fill="currentColor" />
            </svg>
            <span class="content">
              <h5 class="name">Profile</h5>
              <span class="text">Create your profile</span>
            </span>
          </a>
        </li>
      `
    }
  }

  getLeftArticles = () => {
    return /* html */`
      <li data-name="articles" class="link articles options-link">
        <span class="link-item">
          <span class="text">Stories</span>
          <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z" fill="currentColor"></path>
          </svg>
        </span>
        <div class="drop-down">
          <span class="arrow"></span>
          <ul class="main">
            <h4 class="title">Stories</h4>
            <li class="item icon">
              <a href="${this.getAttribute('stories-popular')}" class="link">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M352 120c0-13.3 10.7-24 24-24H552c13.3 0 24 10.7 24 24V296c0 13.3-10.7 24-24 24s-24-10.7-24-24V177.9L337 369c-9.4 9.4-24.6 9.4-33.9 0l-111-111L41 409c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L175 207c9.4-9.4 24.6-9.4 33.9 0l111 111L494.1 144H376c-13.3 0-24-10.7-24-24z" />
                </svg>
                <span class="content">
                  <h5 class="name">Popular</h5>
                  <span class="text">Popular stories now</span>
                </span>
              </a>
            </li>
            <li class="item icon">
              <a href="${this.getAttribute('stories-recent')}" class="link">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M48 106.7V56c0-13.3-10.7-24-24-24S0 42.7 0 56V168c0 13.3 10.7 24 24 24H136c13.3 0 24-10.7 24-24s-10.7-24-24-24H80.7c37-57.8 101.7-96 175.3-96c114.9 0 208 93.1 208 208s-93.1 208-208 208c-42.5 0-81.9-12.7-114.7-34.5c-11-7.3-25.9-4.3-33.3 6.7s-4.3 25.9 6.7 33.3C155.2 496.4 203.8 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C170.3 0 94.4 42.1 48 106.7zM256 128c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z" />
                </svg>
                <span class="content">
                  <h5 class="name">Recent</h5>
                  <span class="text">Recently added stories</span>
                </span>
              </a>
            </li>
            <li class="item bulk icon">
              <a href="${this.getAttribute('stories-curated')}" class="link">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M192 88c0-48.6 39.4-88 88-88H528c26.5 0 48 21.5 48 48V160v96c0 20.9-13.4 38.7-32 45.3V368h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H520 272c-44.2 0-80-35.8-80-80V88zM528 48H280c-22.1 0-40 17.9-40 40V262.7c9.8-4.3 20.6-6.7 32-6.7H520h8V160 48zM272 304c-17.7 0-32 14.3-32 32s14.3 32 32 32H496V304H272zM160 96v48H88c-22.1 0-40 17.9-40 40V358.7c9.8-4.3 20.6-6.7 32-6.7h81.1c2.5 17.7 9.2 34 18.9 48H80c-17.7 0-32 14.3-32 32s14.3 32 32 32H304V448h48v16h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H328 80c-44.2 0-80-35.8-80-80V184c0-48.6 39.4-88 88-88h72z" />
                </svg>
                <span class="content">
                  <h5 class="name">Curated</h5>
                  <span class="text">Explore curated stories</span>
                </span>
              </a>
            </li>
            <li class="item bulk icon">
              <a href="${this.getAttribute('discover')}" class="link">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M188.7 32.5c13 2.6 21.4 15.2 18.8 28.2L192.5 136h111l16.9-84.7c2.6-13 15.2-21.4 28.2-18.8s21.4 15.2 18.8 28.2L352.5 136H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H342.9L314.1 328H392c13.3 0 24 10.7 24 24s-10.7 24-24 24H304.5l-16.9 84.7c-2.6 13-15.2 21.4-28.2 18.8s-21.4-15.2-18.8-28.2L255.5 376h-111l-16.9 84.7c-2.6 13-15.2 21.4-28.2 18.8s-21.4-15.2-18.8-28.2L95.5 376H24c-13.3 0-24-10.7-24-24s10.7-24 24-24h81.1l28.8-144H56c-13.3 0-24-10.7-24-24s10.7-24 24-24h87.5l16.9-84.7c2.6-13 15.2-21.4 28.2-18.8zM182.9 184L154.1 328h111l28.8-144h-111z" />
                </svg>
                <span class="content">
                  <h5 class="name">Topics</h5>
                  <span class="text">Explore topics</span>
                </span>
              </a>
            </li>
          </ul>
          <ul class="main">
            <h4 class="title">You</h4>
            ${this.getLeftProfile(this._authenticated)}
          </ul>
        </div>
      </li>
    `
  }

  getLeftResources = () => {
    return /* html */`
      <li data-name="resources" class="link options-link resources">
        <span class="link-item">
          <span class="text">Resources</span>
          <svg height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" aria-hidden="true">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0607 6.74999L11.5303 7.28032L8.7071 10.1035C8.31657 10.4941 7.68341 10.4941 7.29288 10.1035L4.46966 7.28032L3.93933 6.74999L4.99999 5.68933L5.53032 6.21966L7.99999 8.68933L10.4697 6.21966L11 5.68933L12.0607 6.74999Z" fill="currentColor"></path>
          </svg>
        </span>
        <div class="drop-down">
          <span class="arrow"></span>
          <ul class="main">
            <h4 class="title">Tools</h4>
            <li class="item icon">
              <a href="${this.getAttribute('resource-apis')}" class="link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
                  <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" />
                </svg>
                <span class="content">
                  <h5 class="name">Integration</h5>
                  <span class="text">Consume our APIs</span>
                </span>
              </a>
            </li>
            <li class="item journal">
              <a href="${this.getAttribute('resource-feature')}" class="link">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 640 512">
                  <path d="M168 56a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm80 0A56 56 0 1 0 136 56a56 56 0 1 0 112 0zM179.3 160H224V320H160V164c6-2.6 12.5-4 19.3-4zM160 496V352h64V496c0 8.8 7.2 16 16 16s16-7.2 16-16V160H400c8.8 0 16-7.2 16-16s-7.2-16-16-16H352V48c0-8.8 7.2-16 16-16H592c8.8 0 16 7.2 16 16V272c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V192H320v80c0 26.5 21.5 48 48 48H592c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H368c-26.5 0-48 21.5-48 48v80H243.1 179.3c-29.5 0-56.7 16.3-70.6 42.3L49.9 280.5c-4.2 7.8-1.2 17.5 6.6 21.7s17.5 1.2 21.7-6.6L128 202.2V496c0 8.8 7.2 16 16 16s16-7.2 16-16z" />
                </svg>
                <span class="content">
                  <h5 class="name">Feature</h5>
                  <span class="text">Request a feature</span>
                </span>
              </a>
            </li>
            <li class="item shop">
              <a href="${this.getAttribute('resource-shop')}" class="link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.43775 6.42099C7.44374 3.91887 9.47616 1.895 11.9792 1.89979C14.4809 1.90578 16.505 3.93866 16.4997 6.44032C16.4997 6.44074 16.4997 6.44116 16.4997 6.44158L15.7497 6.43979L16.4997 6.44032V9.47179C16.4997 9.886 16.164 10.2218 15.7497 10.2218C15.3355 10.2218 14.9997 9.886 14.9997 9.47179V6.43979L14.9997 6.43799C15.0038 4.76435 13.65 3.40399 11.9763 3.39979C10.3018 3.39677 8.94221 4.75037 8.93774 6.42374V9.47179C8.93774 9.886 8.60196 10.2218 8.18774 10.2218C7.77353 10.2218 7.43774 9.886 7.43774 9.47179L7.43775 6.42099Z" fill="currentColor" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.38521 9.28342C4.24823 10.1733 3.69995 11.6443 3.69995 14.2076C3.69995 16.7703 4.2482 18.241 5.38518 19.1308C6.57922 20.0653 8.60338 20.5156 11.969 20.5156C15.3345 20.5156 17.3587 20.0653 18.5527 19.1308C19.6897 18.241 20.238 16.7703 20.238 14.2076C20.238 11.6443 19.6897 10.1733 18.5527 9.28342C17.3587 8.34887 15.3345 7.89856 11.969 7.89856C8.60338 7.89856 6.57924 8.34887 5.38521 9.28342ZM4.46069 8.1022C6.08517 6.83075 8.57053 6.39856 11.969 6.39856C15.3674 6.39856 17.8527 6.83075 19.4772 8.1022C21.1587 9.4183 21.738 11.4768 21.738 14.2076C21.738 16.9379 21.1587 18.9961 19.4772 20.3121C17.8527 21.5834 15.3674 22.0156 11.969 22.0156C8.57052 22.0156 6.08519 21.5834 4.46072 20.3121C2.7792 18.9961 2.19995 16.9379 2.19995 14.2076C2.19995 11.4768 2.77918 9.4183 4.46069 8.1022Z" fill="currentColor" />
                </svg>
                <span class="content">
                  <h5 class="name">Shop</h5>
                  <span class="text">View our catalogue</span>
                </span>
              </a>
            </li>
            <li class="item icon">
              <a href="${this.getAttribute('resource-guide')}" class="link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16">
                  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                </svg>
                <span class="content">
                  <h5 class="name">Guides</h5>
                  <span class="text">Find help quickly</span>
                </span>
              </a>
            </li>
          </ul>
          <ul class="main">
            <h4 class="title">Company</h4>
            <li class="item icon">
              <a href="${this.getAttribute('resource-newsletter')}" class="link icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-paper" viewBox="0 0 16 16">
                  <path d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2zm10 4.267.47.25A1 1 0 0 1 15 5.4v.817l-1 .6zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267zm13 .566v5.734l-4.778-2.867zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083zM1 13.116V7.383l4.778 2.867L1 13.117Z" />
                </svg>
                <span class="content">
                  <h5 class="name">Newsletter</h5>
                  <span class="text">Subscribe to our newsletter</span>
                </span>
              </a>
            </li>
            <li class="item icon">
              <a href="${this.getAttribute('resource-rss')}" class="link">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M0 56C0 42.7 10.7 32 24 32c234.2 0 424 189.8 424 424c0 13.3-10.7 24-24 24s-24-10.7-24-24C400 248.3 231.7 80 24 80C10.7 80 0 69.3 0 56zM64 432a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm0-80a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM24 176c154.6 0 280 125.4 280 280c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-128.1-103.9-232-232-232c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
                </svg>
                <span class="content">
                  <h5 class="name">RSS</h5>
                  <span class="text">Open rss feeds</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </li>
    `
  }

  getLeftLogout = (authenticated) => {
    if (authenticated) {
      return /* html */`
        <li class="logout">
          <a href="" class="settings">
            <span class="text">Logout</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9 12.1208C9 11.7066 9.33579 11.3708 9.75 11.3708H21.791C22.2052 11.3708 22.541 11.7066 22.541 12.1208C22.541 12.5351 22.2052 12.8708 21.791 12.8708H9.75C9.33579 12.8708 9 12.5351 9 12.1208Z" fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18.3328 8.67559C18.6251 8.3821 19.1 8.38112 19.3935 8.67342L22.3215 11.5894C22.4628 11.7302 22.5423 11.9214 22.5423 12.1208C22.5423 12.3203 22.4628 12.5115 22.3215 12.6523L19.3935 15.5683C19.1 15.8605 18.6251 15.8596 18.3328 15.5661C18.0405 15.2726 18.0415 14.7977 18.335 14.5054L20.7294 12.1208L18.335 9.73625C18.0415 9.44396 18.0405 8.96909 18.3328 8.67559Z" fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2883 4.45009C15.065 5.02564 15.4533 5.96655 15.613 7.69884C15.651 8.11131 16.0162 8.41485 16.4287 8.37683C16.8411 8.33881 17.1447 7.97362 17.1066 7.56116C16.9363 5.71345 16.4896 4.21436 15.1813 3.24491C13.927 2.31546 12.0372 2 9.35981 2C5.80999 2 3.62744 2.55654 2.50738 4.37994C1.97354 5.249 1.73763 6.3253 1.62299 7.55739C1.50881 8.78465 1.50881 10.259 1.50881 11.9684V12.0316C1.50881 13.741 1.50881 15.2154 1.62299 16.4426C1.73763 17.6747 1.97354 18.751 2.50738 19.6201C3.62744 21.4435 5.80999 22 9.35981 22C12.0372 22 13.927 21.6845 15.1813 20.7551C16.4896 19.7856 16.9363 18.2866 17.1066 16.4388C17.1447 16.0264 16.8411 15.6612 16.4287 15.6232C16.0162 15.5851 15.651 15.8887 15.613 16.3012C15.4533 18.0334 15.065 18.9744 14.2883 19.5499C13.4576 20.1655 12.0124 20.5 9.35981 20.5C5.80864 20.5 4.44068 19.9015 3.7855 18.8349C3.43171 18.259 3.22381 17.4565 3.11654 16.3036C3.00953 15.1535 3.00881 13.7472 3.00881 12C3.00881 10.2528 3.00953 8.84654 3.11654 7.69636C3.22381 6.54345 3.43171 5.741 3.7855 5.16506C4.44068 4.09846 5.80864 3.5 9.35981 3.5C12.0124 3.5 13.4576 3.83454 14.2883 4.45009Z" fill="currentColor" />
            </svg>
          </a>
        </li>
      `
    }
  }

  getRight = (authenticated) => {
    if (authenticated) {
      return /* html */`
        <ul class="right">
          <li class="link icon profile">
            <a href="${this.getAttribute('user-profile')}" class="link-item">
              <img src="${this.getAttribute('user-img')}" alt="Profile photo" srcset="">
            </a>
          </li>
          <li class="link icon search">
            <a href="" class="link-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </a>
          </li>
        </ul>
      `
    }
    else {
      return /* html */`
        <ul class="right">
          <li class="link icon signin">
            <a href="${this.getAttribute('create-account')}" class="link-item">Sign in</a>
          </li>
          <li class="link icon search">
            <a href="" class="link-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11.7666" cy="11.7667" r="8.98856" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M18.0183 18.4853L21.5423 22.0001" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </a>
          </li>
        </ul>
      `
    }
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

      ul,
      ol {
        padding: 0;
        margin: 0;
      }

      a {
        text-decoration: none;
      }

      *:focus {
        outline: inherit !important;
      }

      *::-webkit-scrollbar {
        -webkit-appearance: none;
      }

      :host {
        font-size: 16px;
        /*border: 1px solid red;*/
        padding: 0 0 0 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        min-height: 60px;
        height: 60px;
        position: sticky;
        z-index: 5;
        top: 0;
        background-color: var(--background);
      }

      h2.site-name {
        position: absolute;
        left: 0;
        margin: 0;
        font-weight: 700;
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
        font-family: var(--font-text);
      }

      /* Nav */
      .nav {
        z-index: inherit;
        background: none;
        max-width: 50px;
        max-height: 40px;
        position: relative;
        margin-left: -7px;
        cursor: default !important;
        display: flex;
        justify-content: start;
        align-items: start;
      }

      .nav * {
        display: flex;
        cursor: default !important;
      }

      .nav svg {
        fill: none;
        height: 40px;
        stroke: var(--text-color);
        stroke-width: 7px;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .nav svg use:nth-of-type(1) {
        opacity: 1;
        stroke-dashoffset: 221;
        stroke-dasharray: 46 249;
        transition: stroke-dashoffset 0.12s linear 0.2s, stroke-dasharray 0.12s linear 0.2s, opacity 0s linear 0.2s;
      }

      .nav svg use:nth-of-type(2) {
        animation: stroke-animation-reverse 1.2s ease-out forwards;
      }

      .nav input.nav-input {
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 2;
        cursor: pointer;
        opacity: 0;
      }

      .nav input.nav-input:checked + svg use:nth-of-type(1) {
        stroke-dashoffset: 175;
        stroke-dasharray: 0 295;
        opacity: 0;
        transition: stroke-dashoffset 0.07s linear 0.07s, stroke-dasharray 0.07s linear 0.07s, opacity 0s linear 0.14s;
      }

      .nav input.nav-input:checked + svg use:nth-of-type(2) {
        animation: stroke-animation 1.2s ease-out forwards;
      }

      @keyframes stroke-animation {
        0% {
          stroke-dashoffset: 295;
          stroke-dasharray: 25 270;
        }

        50% {
          stroke-dashoffset: 68;
          stroke-dasharray: 59 236;
        }

        65% {
          stroke-dashoffset: 59;
          stroke-dasharray: 59 236;
        }

        100% {
          stroke-dashoffset: 68;
          stroke-dasharray: 59 236;
        }
      }

      @keyframes stroke-animation-reverse {
        0% {
          stroke-dashoffset: 68;
          stroke-dasharray: 59 236;
        }

        50% {
          stroke-dashoffset: 290;
          stroke-dasharray: 25 270;
        }

        65% {
          stroke-dashoffset: 295;
          stroke-dasharray: 25 270;
        }

        100% {
          stroke-dashoffset: 290;
          stroke-dasharray: 25 270;
        }
      }

      ul {
        /* border: 1px solid black; */
        height: 100%;
        display: flex;
        align-items: center;
        gap: 25px;
      }


      ul.left {
        position: relative
      }

      ul.left > .account {
        display: none;
      }

      ul > li.link {
        /* border: 1px solid black; */
        /* font-family: var(--font-mono); */
        color: var(--gray-color);
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        list-style-type: none;
        gap: 6px;
        font-weight: 500;
      }

      ul > li.logout {
        display: none;
      }

      ul > li.link.active,
      ul > li.link:hover {
        /* font-weight: 600; */
        color: transparent;
        background: var(--accent-linear);
        background-clip: text;
        -webkit-background-clip: text;
        /* font-family: var(--font-mono); */
      }

      ul > li.link span.link-item,
      ul > li.link a {
        /* border: 1px solid black; */
        color: inherit;
        cursor: pointer;
        font-family: inherit;
        text-decoration: none;
      }

      ul > li.link span.link-item svg,
      ul > li.link a svg {
        margin: 0 0 -2px 0;
        width: 15px;
        height: 15px;
      }

      ul > li.link span.link-item svg,
      ul > li.link a svg {
        transition: all 300ms ease-in-out;
        -webkit-transition: all 300ms ease-in-out;
        -moz-transition: all 300ms ease-in-out;
        -ms-transition: all 300ms ease-in-out;
        -o-transition: all 300ms ease-in-out;
      }

      ul > li.link span.link-item svg,
      ul > li.link.active > a > svg,
      ul > li.link:hover  > a > svg {
        color: var(--accent-color);
      }


      ul.right {
        position: relative;
        gap: 15px;
      }

      ul.right > li.link.search a svg {
        margin: 0 0 0 0;
        width: 25px;
        height: 25px;
      }

      ul.right > li.link.signin > a {
        border: var(--border-mobile);
        padding: 4px 15px;
        font-family: var(--font-read);
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        -ms-border-radius: 10px;
        -o-border-radius: 10px;
      }


      ul.right > li.link.profile > a {
        width: 30px;
        height: 30px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        font-family: var(--font-read);
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        -ms-border-radius: 50px;
        -o-border-radius: 50px;
      }

      ul.right > li.link.profile > a img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        -ms-border-radius: 50px;
        -o-border-radius: 50px;
      }

      ul > li.link a span.text {
        font-family: inherit;
      }


      /* Dropdown */
      ul > li.link > div.drop-down {
        border: 0.002rem solid #6b72802f;
        background-color: var(--background);
        padding: 15px 0;
        position: absolute;
        left: -50px;
        top: 60px;
        width: 530px;
        color: var(--gray-color);
        display: none;
        align-items: center;
        flex-flow: column;
        gap: 15px;
        justify-content: space-evenly;
        list-style-type: none;
        box-shadow: 0 0 0 1px #ffffff25, 0 2px 2px #0000000a, 0 8px 16px -4px #0000000a;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
      }

      ul > li.link:hover > div.drop-down,
      ul > li.link.active > div.drop-down {
        display: flex;
        transition: all 300ms ease-in-out;
        -webkit-transition: all 300ms ease-in-out;
        -moz-transition: all 300ms ease-in-out;
        -ms-transition: all 300ms ease-in-out;
        -o-transition: all 300ms ease-in-out;
      }

      ul > li.link.active span.link-item svg,
      ul > li.link:hover span.link-item svg {
        rotate: 180deg;
      }

      ul > li.link > div.drop-down > span.arrow {
        border: 0.002rem solid #6b72802f;
        border-bottom: none;
        border-right: none;
        background-color: var(--background);
        position: absolute;
        left: 53px;
        top: -7px;
        width: 14px;
        height: 14px;
        rotate: 45deg;
        color: var(--gray-color);
        display: flex;
        border-radius: 1px;
        -webkit-border-radius: 1px;
        -moz-border-radius: 1px;
      }

      ul > li.link.articles > div.drop-down > span.arrow {
        left: 136px;
      }

      ul > li.link.resources > div.drop-down > span.arrow {
        left: 250px;
      }

      ul > li.link a span.text {
        font-family: inherit;
      }

      ul > li.link > div.drop-down > ul.main {
        /* border: 1px solid red; */
        width: 100%;
        margin: 0;
        padding: 0 10px;
        list-style-type: none;
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 0;
        row-gap: 10px;
      }


      ul > li.link > div.drop-down ul * {
        transition: all 300ms ease-in-out;
        -webkit-transition: all 300ms ease-in-out;
        -moz-transition: all 300ms ease-in-out;
        -ms-transition: all 300ms ease-in-out;
        -o-transition: all 300ms ease-in-out;
      }

      ul > li.link > div.drop-down ul:last-of-type {
        border-top: 0.002rem solid #6b72802f;
        padding: 15px 10px 0 10px;
      }


      ul > li.link > div.drop-down ul > h4.title {
        grid-column: 1/3;
        padding: 0 0 0 10px;
        font-weight: 400;
      }

      ul > li.link > div.drop-down ul > li {
        /* border: 1px solid red; */
        width: 100%;
        color: var(--gray-color);
        font-weight: 400;
        padding: 3px 8px 5px;
        font-size: 0.9rem;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
      }

      ul > li.link > div.drop-down ul > li:hover {
        background-color: var(--hover-background);
      }

      ul > li.link > div.drop-down ul > li a {
        width: 100%;
        font-weight: 400;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      ul > li.link > div.drop-down ul > li a:hover svg {
        color: inherit;
      }

      ul > li.link > div.drop-down ul > li svg {
        width: 24px;
        height: 24px;
      }

      ul > li.link > div.drop-down ul > li.icon svg {
        width: 20px;
        height: 20px;
      }


      ul > li.link > div.drop-down ul > li a span.content {
        display: flex;
        flex-flow: column;
        line-height: 1.5;
      }

      ul > li.link > div.drop-down ul > li a span.content h5 {
        font-weight: 500;
        font-size: 1rem;
        color: var(--title-color);
      }

      @media screen and (max-width:660px) {
        :host {
        font-size: 16px;
          /* border: 1px solid red; */
          z-index: 10;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        h2.site-name {
          position: unset;
          margin: 0;
        }

        a {
          cursor: default !important;
        }

        ul.left {
          /* border: 5px solid black; */
          background-color: var(--background);
          position: fixed;
          left: calc(100% + 15px);
          flex-flow: column;
          z-index: 5;
          top: 60px;
          bottom: 0;
          width: 100%;
          height: calc(var(--vh-height, 100vh) - 60px);
          max-height: calc(var(--vh-height, 100vh) - 60px);
          min-height: calc(var(--vh-height, 100vh) - 60px);
          align-items: stretch;
          justify-content: start;
          gap: 0;
          padding: 10px 15px;
          overflow-y: scroll;
          -ms-overflow-style: none;
          scrollbar-width: none;
          transition: all 500ms ease-in-out;
          -webkit-transition: all 500ms ease-in-out;
          -moz-transition: all 500ms ease-in-out;
          -ms-transition: all 500ms ease-in-out;
          -o-transition: all 500ms ease-in-out;
        }

        ul.left::-webkit-scrollbar {
          display: none !important;
          visibility: hidden;
        }

        ul.left > .account {
          /* border: 1px solid #ff00ff; */
          display: flex;
          flex-flow: column;
          width: 100%;
          padding: 0;
          gap: 0;
        }

        ul.left > .account.out {
          padding: 0 0 15px 0;
        }

        ul.left > li.logout > a,
        ul.left > .account > a {
          /* border: 1px solid #ff00ff; */
          display: flex;
          flex-flow: column;
          margin: 8px 0;
          width: 100%;
          font-weight: 500;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        ul.left > .account > a.login {
          border: 0.002rem solid #6b72808f;
          padding: 10px 0;
          color: var(--title-color);
          text-align: center;
        }

        ul.left > .account > a.signup {
          border: none;
          padding: 10px 0;
          color: var(--white-color);
          text-align: center;
          background: var(--accent-linear);
        }

        ul.left > li.logout {
          list-style-type: none;
          display: flex;
          position: absolute;
          bottom: 20px;
          left: 15px;
          right: 15px;
          font-weight: 600;
        }

        ul.left > li.logout.active {
          bottom: -100px;
        }

        ul.left > .account > a.donate,
        ul.left > li.logout > a,
        ul.left > .account > a.settings,
        ul.left > .account > a.profile {
          border: var(--border-header);
          color: var(--title-color);
          padding: 2px 5px 2px 10px;
          min-height: 40px;
          height: 40px;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
        }

        ul.left > li.logout > a {
          border: 0.002rem solid #c56139a1;
        }

        ul.left > .account > a.donate > svg,
        ul.left > li.logout > a svg,
        ul.left > .account > a.settings svg {
          color: var(--gray-color);
          width: 28px;
          height: 28px;
        }

        ul.left > .account > a.profile span.image {
          /* border: 0.002rem solid #6b72808f; */
          width: 30px;
          height: 30px;
          overflow: hidden;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        ul.left > .account > a.profile span.image img {
          width: 100%;
          height: 100%;
          overflow: hidden;
          object-fit: cover;
          border-radius: 50px;
          -webkit-border-radius: 50px;
          -moz-border-radius: 50px;
          -ms-border-radius: 50px;
          -o-border-radius: 50px;
        }

        ul.left > li.logout > a > span.text,
        ul.left > .account > a > span.text {
          font-weight: 600;
          color: var(--title-color);
          text-align: center;
        }

        ul.left > li.logout > a > span.text,
        ul.left > li.logout > a > svg,
        ul.left > li.logout > a {
          color: #c56139 !important;
        }


        ul.left > li.link {
          border-bottom: var(--border-header);
          min-width: 100%;
          width: 100%;
          margin: 0;
          padding: 10px 0;
          height: max-content;
          display: flex;
          flex-flow: column;
          align-items: start;
          justify-content: center;
        }


        ul.left > li.link.active,
        ul.left > li.link:hover {
          background: unset;
          background-clip: unset;
          -webkit-background-clip: unset;
          /* font-family: var(--font-mono); */
        }

        ul.left > li.link span.link-item svg{
          color: #4b5563;
        }

        ul.left > li.link:hover span.link-item svg {
          rotate: unset;
        }

        ul.left > li.link span.link-item {
          /* border: 3px solid #ff00ff; */
          display: flex;
          align-items: stretch;
          justify-content: space-between;
        }

        ul.left > li.link a {
          color: var(--gray-color);
          cursor: default;
          font-family: inherit;
        }

        ul.left > li.link a {
          /* border: 1px solid black; */
          /* color: #4b5563; */
          color: var(--title-color);
          font-weight: 600;
          cursor: default;
          font-family: inherit;
        }

        ul.left > li.link span.link-item > span.text {
          /* border: 1px solid black; */
          color: var(--title-color);
          font-weight: 600;
          margin: 0 0 0 3px;
          cursor: default;
          font-family: inherit;
        }

        ul.left > li.link span.link-item svg {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2px 0 0 0;
        }

        ul.left > li.link > div.drop-down {
          /* border: 1px solid #0059ff; */
          border: none;
          display: none;
          padding: 10px 0 0 0;
          min-width: 100%;
          width: 100%;
          position: unset;
          left: unset;
          top: unset;
          width: unset;
          color: var(--gray-color);
          align-items: center;
          flex-flow: column;
          gap: 0;
          justify-content: space-evenly;
          list-style-type: none;
          box-shadow: none;
          border-radius: 0;
        }

        ul.left > li.link.active > div.drop-down {
          display: flex;
        }

        ul.left > li.link.active span.link-item svg {
          rotate: 180deg;
        }


        ul.left > li.link > div.drop-down * {
          transition: all 500ms ease-in-out;
          -webkit-transition: all 500ms ease-in-out;
          -moz-transition: all 500ms ease-in-out;
          -ms-transition: all 500ms ease-in-out;
          -o-transition: all 500ms ease-in-out;
        }

        ul.left > li.link > div.drop-down > span.arrow {
          display: none;
        }

        ul.left > li.link > div.drop-down > ul.main {
          /* border: 1px solid red; */
          width: 100%;
          margin: 0;
          padding: 0;
          gap: 0;
          display: flex;
          flex-flow: column;
          align-items: start;
        }

        ul.left > li.link > div.drop-down ul:last-of-type {
          border: flex;
          padding: 10px 0 0 0;
        }

        ul.left > li.link > div.drop-down ul > h4.title {
          display: none;
        }

        ul.left > li.link > div.drop-down ul.main > li {
          /* border: 2px solid #057232; */
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin: 0;
          padding: 8px 0;
        }

        ul.left > li.link > div.drop-down ul.main > li > a {
          /* border: 0.002rem solid #6b72809a; */
          color: var(--title-color);
          padding: 0;
          padding: 0 10px;
          display: flex;
          flex-flow: row;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          -ms-border-radius: 10px;
          -o-border-radius: 10px;
        }

        ul.left > li.link > div.drop-down ul.main > li:nth-of-type(odd) {
          background-color: #6b728021;
        }

        ul > li.link > div.drop-down ul > li:hover {
          background-color: unset;
        }

        ul > li.link > div.drop-down ul > li svg {
          /* border: 1px solid red; */
          color: var(--gray-color);
          display: none;
          width: 30px;
          height: 30px;
          margin: -2px 0 0 -8px;
        }

        ul > li.link > div.drop-down ul > li.supabase svg {
          /* border: 1px solid red; */
          margin-bottom: -5px;
          padding: 4px;
        }

        ul > li.link > div.drop-down ul > li.bulk svg {
          /* border: 1px solid red; */
          margin-bottom: -5px;
        }

        ul > li.link > div.drop-down ul > li.authors svg {
          /* border: 1px solid red; */
          margin-bottom: -10px;
        }

        ul > li.link > div.drop-down ul > li.icon svg {
          /* border: 1px solid red; */
          width: 30px;
          height: 30px;
          padding: 4px;
        }

        ul > li.link > div.drop-down ul > li.create svg {
          /* border: 1px solid red; */
          padding: 2px;
        }

        ul > li.link > div.drop-down ul > li a span.content {
          margin: 0;
          /* border: 1px solid red; */
          display: flex;
          flex-flow: column;
          line-height: 1.5;
          gap: 0;
          width: 100%;
        }

        ul > li.link > div.drop-down ul > li a span.content h5 {
          /* border: 1px solid red; */
          font-weight: 500;
          font-size: 1rem;
          color: var(--gray-color);
        }

        ul > li.link > div.drop-down ul > li a span.content span.text {
          display: flex;
        }

        ul > li.link.theme > .options span.option,
        ul > li.link span.link-item,
        a {
          cursor: default !important;
          text-decoration: none;
        }

      }
    </style>
    `;
  }
}