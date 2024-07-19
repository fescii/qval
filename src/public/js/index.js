// set hash if user is logged
const setHash = name => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  const cookie = parts.length === 2 ? parts.pop().split(';').shift() : null;

  // add cookie to the window
  window.hash = cookie;
}

const setTheme = currentTheme =>{
  // Check the current theme
  const htmlElement = document.documentElement;
  
  // Update the data-theme attribute
  htmlElement.setAttribute('data-theme', currentTheme);
  
  // Store the preference in local storage
  localStorage.setItem('theme', currentTheme);
  
  // Update the theme-color meta tag
  const metaThemeColor = document.querySelector("meta[name=theme-color]");
  if (currentTheme === 'dark') {
    metaThemeColor.setAttribute("content", "#000000");
  } else {
    metaThemeColor.setAttribute("content", "#ffffff");
  }
}

// get theme from local storage
const currentTheme = localStorage.getItem('theme') || 'light';

// set the theme
setTheme(currentTheme);

// set hash
setHash('hash');

// Import apps
import AppHome from "./apps/home.app.js";
import AppPost from "./apps/post.app.js";
import AppProfile from "./apps/profile.app.js";
import AppLogon from "./apps/logon.app.js";
import AppSearch from "./apps/search.app.js";
import AppStory from "./apps/story.app.js";
import AppTopic from "./apps/topic.app.js";
import AppUser from "./apps/user.app.js";

// import uWS class and NotificationManager
import WebSocketManager from "./apps/uWs.js";
import NotificationManager from "./apps/notify.js";

// Import Containers
import AddContainer from "./containers/add.container.js";
import ActivityContainer from "./containers/activity.container.js";
import FormContainer from "./containers/form.container.js";
import HighlightsContainer from "./containers/highlights.container.js";
import InfoContainer from "./containers/info.container.js";
import PeopleContainer from "./containers/people.container.js";
import DiscoverPeople from "./containers/people.discover.js";
import StatContainer from "./containers/stat.container.js";
import StoriesContainer from "./containers/stories.container.js";
import TopicsContainer from "./containers/topics.container.js";
import TrendingContainer from "./containers/trending.container.js";
import FeedContainer from "./containers/feed.container.js";
import UpdateContainer from "./containers/update.container.js";
import ContentContainer from "./containers/content.container.js";

// Import custom elements
import CustomSpan from "./elements/span.element.js";

// Import posts
import QuickPost from "./post/quick.post.js";
import PollPoll from "./post/poll.post.js";
import StoryPost from "./post/story.post.js";
import PreviewPost from "./post/preview.post.js";

// Import feeds
import ActivityFeed from "./feeds/activity.feed.js";
import PeopleFeed from "./feeds/people.feed.js";
import StoriesFeed from "./feeds/stories.feed.js";
import RepliesFeed from "./feeds/replies.feed.js";
import StatFeed from "./feeds/stat.feed.js";
import TopicFeed from "./feeds/topic.feed.js";
import HomeFeed from "./feeds/home.feed.js";
import UpdateFeed from "./feeds/update.feed.js";
import ContentFeed from "./feeds/content.feed.js";

// Import forms
import BioForm from "./forms/bio.form.js";
import EmailForm from "./forms/email.form.js";
import PasswordForm from "./forms/password.form.js";
import ProfileForm from "./forms/profile.form.js";
import NameForm from "./forms/name.form.js";
import SocialForm from "./forms/social.form.js";

// Import Loaders
import AuthorsLoader from "./loaders/authors.loader.js";
import InfoLoader from "./loaders/info.loader.js";
import PeopleLoader from "./loaders/people.loader.js";
import PostLoader from "./loaders/post.loader.js";
import StoryLoader from "./loaders/story.loader.js";
import TopicsLoader from "./loaders/topics.loader.js";
import TopicLoader from "./loaders/topic.loader.js";
import HoverLoader from "./loaders/hover.loader.js";

// Import Sections
import PostSection from "./sections/post.section.js";
import ProfileSection from "./sections/profile.section.js";
import TopicSection from "./sections/topic.section.js";
import StorySection from "./sections/story.section.js";

// Import stats
import ActivityItem from "./stats/activity.item.js";
import AllStat from "./stats/all.stat.js";
import RepliesStat from "./stats/replies.stat.js";
import StatReply from "./stats/stat.reply.js";
import StatStory from "./stats/stat.story.js";
import StoriesStat from "./stats/stories.stat.js";
import UsersStat from "./stats/users.stat.js";
import MonthStat from "./stats/month.stat.js";
import UpdateItem from "./stats/update.item.js";
import ContentStory from "./stats/content.story.js";
import ContentReply from "./stats/content.reply.js";

// Import wrappers
import AuthorWrapper from "./wrappers/author.wrapper.js";
import PostWrapper from "./wrappers/post.wrapper.js";
import HeaderWrapper from "./wrappers/header.wrapper.js";
import PersonWrapper from "./wrappers/person.wrapper.js";
import PollWrapper from "./wrappers/poll.wrapper.js";
import ProfileWrapper from "./wrappers/profile.wrapper.js";
import ShareWrapper from "./wrappers/share.wrapper.js";
import UserWrapper from "./wrappers/user.wrapper.js";
import TopicWrapper from "./wrappers/topic.wrapper.js";
import HoverAuthor from "./wrappers/hover.author.js";
import VotesWrapper from "./wrappers/votes.wrapper.js";
import ActionWrapper from "./wrappers/action.wrapper.js";

// import popups
import JoinPopup from "./popups/join.popup.js";
import UrlPopup from "./popups/url.popup.js";
import StatsPopup from "./popups/stats.popup.js";
import ContactPopup from "./popups/contact.popup.js";
import TopicPopup from "./popups/topic.popup.js";
import ViewsPopup from "./popups/views.popup.js";
import PreviewPopup from "./popups/preview.popup.js";
import NotifyPopup from "./popups/notify.popup.js";

// Start WebSocketManager
// Create a global instance
// get host name
const host = window.location.hostname;
// console.log(host);

window.wss = new WebSocketManager(`${host}`);
window.wss.connect();

// Start NotificationManager
// Create a global instance
window.notify = new NotificationManager();

// Register apps
customElements.define("app-home", AppHome);
customElements.define("app-post", AppPost);
customElements.define("app-profile", AppProfile);
customElements.define("app-logon", AppLogon);
customElements.define("app-search", AppSearch);
customElements.define("app-story", AppStory);
customElements.define("app-topic", AppTopic);
customElements.define("app-user", AppUser);

// Register containers
customElements.define("add-container", AddContainer);
customElements.define("activity-container", ActivityContainer);
customElements.define("form-container", FormContainer);
customElements.define("highlights-container", HighlightsContainer);
customElements.define("info-container", InfoContainer);
customElements.define("people-container", PeopleContainer);
customElements.define("discover-people", DiscoverPeople);
customElements.define("stat-container", StatContainer);
customElements.define("stories-container", StoriesContainer);
customElements.define("topics-container", TopicsContainer);
customElements.define("trending-container", TrendingContainer);
customElements.define("feed-container", FeedContainer);
customElements.define("update-container", UpdateContainer);
customElements.define("content-container", ContentContainer);

// Register custom elements
customElements.define("custom-span", CustomSpan, { extends: "span" });

// Register posts
customElements.define("quick-post", QuickPost);
customElements.define("poll-post", PollPoll);
customElements.define("story-post", StoryPost);
customElements.define("preview-post", PreviewPost);

// Register feeds
customElements.define("activity-feed", ActivityFeed);
customElements.define("people-feed", PeopleFeed);
customElements.define("stories-feed", StoriesFeed);
customElements.define("replies-feed", RepliesFeed);
customElements.define("stat-feed", StatFeed);
customElements.define("topics-feed", TopicFeed);
customElements.define("home-feed", HomeFeed);
customElements.define("update-feed", UpdateFeed);
customElements.define("content-feed", ContentFeed);

// Register forms
customElements.define("bio-form", BioForm);
customElements.define("email-form", EmailForm);
customElements.define("password-form", PasswordForm);
customElements.define("profile-form", ProfileForm);
customElements.define("name-form", NameForm);
customElements.define("social-form", SocialForm);

// Register loaders
customElements.define("authors-loader", AuthorsLoader);
customElements.define("info-loader", InfoLoader);
customElements.define("people-loader", PeopleLoader);
customElements.define("post-loader", PostLoader);
customElements.define("story-loader", StoryLoader);
customElements.define("topics-loader", TopicsLoader);
customElements.define("topic-loader", TopicLoader);
customElements.define("hover-loader", HoverLoader);

// Register sections
customElements.define("post-section", PostSection);
customElements.define("profile-section", ProfileSection);
customElements.define("topic-section", TopicSection);
customElements.define("story-section", StorySection);

// Register stats
customElements.define("activity-item", ActivityItem);
customElements.define("all-stat", AllStat);
customElements.define("replies-stat", RepliesStat);
customElements.define("stat-reply", StatReply);
customElements.define("stat-story", StatStory);
customElements.define("stories-stat", StoriesStat);
customElements.define("users-stat", UsersStat);
customElements.define("month-stat", MonthStat);
customElements.define("update-item", UpdateItem);
customElements.define("content-story", ContentStory);
customElements.define("content-reply", ContentReply);

// Register wrappers
customElements.define("author-wrapper", AuthorWrapper);
customElements.define("post-wrapper", PostWrapper);
customElements.define("header-wrapper", HeaderWrapper);
customElements.define("person-wrapper", PersonWrapper);
customElements.define("poll-wrapper", PollWrapper);
customElements.define("profile-wrapper", ProfileWrapper);
customElements.define("share-wrapper", ShareWrapper);
customElements.define("user-wrapper", UserWrapper);
customElements.define("topic-wrapper", TopicWrapper);
customElements.define("hover-author", HoverAuthor);
customElements.define("votes-wrapper", VotesWrapper);
customElements.define("action-wrapper", ActionWrapper);

// Register popups
customElements.define("join-popup", JoinPopup);
customElements.define("url-popup", UrlPopup);
customElements.define("stats-popup", StatsPopup);
customElements.define("contact-popup", ContactPopup);
customElements.define("topic-popup", TopicPopup);
customElements.define("views-popup", ViewsPopup);
customElements.define("preview-popup", PreviewPopup);
customElements.define("notify-popup", NotifyPopup);
