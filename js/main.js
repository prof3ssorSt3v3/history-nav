document.addEventListener('DOMContentLoaded', init);
const log = console.log;
const PAGES = ['home', 'users', 'user', 'todos'];

//REPO: https://github.com/prof3ssorSt3v3/history-nav
function init() {
  addListeners();
  handlePop();
  registerSW();
}
function registerSW() {
  navigator.serviceWorker.register('./sw.js').then(() => {
    console.log('registered');
  });
}
function addListeners() {
  document.body.addEventListener('navevent', nav);
  window.addEventListener('popstate', handlePop);
  document.querySelector('nav').addEventListener('click', handleNavClick);
}
function handleNavClick(ev) {
  ev.preventDefault();
  //click nav link -> dispatch navevent
  log('CLICK', ev.target.href);
  //check that the user clicked an anchor tag
  const isAnchor = ev.target.closest('a');
  if (!isAnchor) return;
  let url = new URL(ev.target.href);
  pushDispatch(url);
}
function handlePop(ev) {
  //popstate - user triggered move through history array -> dispatch navevent
  log('POP', location.href);
  let url = new URL(location.href);
  pushDispatch(url);
}
function pushDispatch(url) {
  // console.log(url);
  let path = url.pathname == '/' || url.pathname == null || url.pathname == undefined ? '/index.html' : url.pathname;
  //redirect from '/' to '/index.html'
  let query = null;
  let href = url.origin + path;
  let pathParam = href;
  if (url.search && url.search.length > 1) {
    //url has a queryString '?'
    query = url.searchParams; //this is the URLSearchParams object version of the querystring
    href = href + url.search;
  }
  let hash = url.hash; //could be empty string, null, valid value or invalid
  hash = hash.replace('#', ''); //remove the #
  //if empty, set as 'home'
  //check if it is one of the valid values or set to 'home'
  if (!PAGES.includes(hash)) {
    hash = 'home';
  }
  href = href + '#' + hash;
  // log(href);
  //pushState();
  history.pushState({}, null, href);
  //update what is written in the browser location bar AND save it in history array

  //dispatch the navevent({origin+pathname, hash without #, URLSearchParams})
  const navEv = new NavEvent({ path: pathParam, hash, query });
  document.body.dispatchEvent(navEv);
}
function nav(ev) {
  //navevent
  log(ev.detail);
  let { path, hash, query } = ev.detail;
  //ev.detail should have {path, hash, query}
  //add to history array
  //update ui
  document.body.className = hash;
  document.querySelector('.current').classList.remove('current');
  //at this point NO pages are showing
  let page = document.querySelector(`#${hash}.page`);
  page.classList.add('current');
  switch (hash) {
    case 'home':
      //nothing needed
      break;
    case 'users':
      getUsers()
        .then((data) => {
          page.innerHTML = data
            .map((user) => {
              return `<p><a href="${path}?id=${user.id}#user">${user.email}</a></p>`;
            })
            .join('');
        })
        .then(() => {
          //add a click listener for the anchor tags
          page.addEventListener('click', (ev) => {
            //should be in its own named function...
            let anchor = ev.target.closest('a');
            if (!anchor) return;
            let url = new URL(anchor.href);
            ev.preventDefault();
            pushDispatch(url);
          });
        })
        .catch((err) => {
          console.warn(err.message);
        });
      break;
    case 'user':
      //get the id from query
      let id = query.get('id') ?? 0;
      getUser(id)
        .then((data) => {
          //data could be empty
          page.textContent = JSON.stringify(data, null, '\t');
        })
        .catch((err) => {
          console.warn(err.message);
        });
      break;
    case 'todos':
      getTodos()
        .then((data) => {
          page.textContent = JSON.stringify(data, null, '\t');
        })
        .catch((err) => {
          console.warn(err.message);
        });
      break;
    default:
    //should never happen
  }
}

class NavEvent extends CustomEvent {
  constructor(props = {}) {
    super('navevent', {
      detail: { ...props },
      bubbles: true,
    });
  }
}
class FetchError extends Error {
  constructor(msg, req, res) {
    super(msg);
    this.request = req;
    this.response = res;
    this.status = res.status;
  }
}

function getUsers() {
  const href = 'https://jsonplaceholder.typicode.com/users';
  const url = new URL(href);
  const req = new Request(url, { method: 'get' });
  //return the Promise with the response object or a FetchError
  return fetch(req).then((res) => {
    if (!res.ok) throw new FetchError('Could not fetch users', req, res);
    return res.json();
  });
}
function getUser(id) {
  const href = `https://jsonplaceholder.typicode.com/users/${id}`;
  const url = new URL(href);
  const req = new Request(url, { method: 'get' });
  //return the Promise with the response object or a FetchError
  return fetch(req).then((res) => {
    if (!res.ok) throw new FetchError('Could not fetch that user', req, res);
    return res.json();
  });
}
function getTodos() {
  let href = 'https://jsonplaceholder.typicode.com/todos';
  const url = new URL(href);
  const req = new Request(url, { method: 'get' });
  //return the Promise with the response object or a FetchError
  return fetch(req).then((res) => {
    if (!res.ok) throw new FetchError('Could not fetch todo list', req, res);
    return res.json();
  });
}
