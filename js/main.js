document.addEventListener('DOMContentLoaded', init);
window.addEventListener('popstate', handlePop);
const log = console.log;

function init() {
  addListeners();
}
function addListeners() {
  document.body.addEventListener('navevent', nav);
  document.querySelector('nav').addEventListener('click', handleNavClick);
}
function handleNavClick(ev) {
  ev.preventDefault();
  //click nav link -> dispatch navevent
  log('CLICK', ev.target.href);
}
function handlePop(ev) {
  //popstate - user triggered move through history array -> dispatch navevent
  log('POP', location.href);
}
function nav(ev) {
  //navevent
  //ev.detail should have {path, hash, query}
  //add to history array
  //update ui
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
    if (!response.ok) throw new FetchError('Could not fetch users', req, res);
    return res.json();
  });
}
function getUser(id) {
  const href = `https://jsonplaceholder.typicode.com/users/${id}`;
  const url = new URL(href);
  const req = new Request(url, { method: 'get' });
  //return the Promise with the response object or a FetchError
  return fetch(req).then((res) => {
    if (!response.ok) throw new FetchError('Could not fetch that user', req, res);
    return res.json();
  });
}
function getTodos() {
  let href = 'https://jsonplaceholder.typicode.com/todos';
  const url = new URL(href);
  const req = new Request(url, { method: 'get' });
  //return the Promise with the response object or a FetchError
  return fetch(req).then((res) => {
    if (!response.ok) throw new FetchError('Could not fetch todo list', req, res);
    return res.json();
  });
}
