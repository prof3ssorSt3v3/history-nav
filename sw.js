//Our service worker, at the root of our project
// in a sw, self === window
// the DOM does not exist for a service worker
const version = 2;

self.addEventListener('install', (ev) => {
  //service worker has been installed
  console.log('installed', version);
});

self.addEventListener('activate', (ev) => {
  //service worker is now actively working
  console.log('activated', version);
});

self.addEventListener('fetch', (ev) => {
  console.log(ev.request);
});
