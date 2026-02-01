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
