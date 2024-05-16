let token;
let refreshTokenTimeout;
let api;

const startRefreshTokenTimer = () => {
  const expires = new Date(JSON.parse(atob(token.split('.')[1])).exp * 1000);
  const timeout = expires.getTime() - Date.now() - (1000 * 60 * 2);
  console.log(expires, timeout);
  refreshTokenTimeout = setTimeout(() => refreshToken(), timeout);
}

const refreshToken = () => {
  fetch(`${api}/internal/users/token/refresh`, {
    method: "POST",
    headers: {
      "Authorization": token
    }
  }).then(res => res.json()).then(user => {
    token = user.token;
    startRefreshTokenTimer();
  }).catch(error => {
    console.error(error);
  });
}

self.addEventListener('message', event => {
  if (event.data.type == "SET_TOKEN") {
    api = event.data.api;
    token = event.data.token;
    console.log("[SW] Token set!");
    startRefreshTokenTimer();
  }
  if (event.data.type == "REMOVE_TOKEN") {
    console.log("[SW] Removing token");
    clearTimeout(refreshTokenTimeout);
    fetch(`${api}/internal/users/token/revoke`, {
      method: "POST",
      headers: {
        "Authorization": token
      }
    }).then(_ => {
      token = null;
    }).catch(error => {
      console.log(error);
      navigator.serviceWorker.postMessage({
        type: "ERROR",
        error
      })
    });
  }
})

self.addEventListener('fetch', event => {
  const isApiUrl = event.request.url.startsWith(api);
  const isInternal = event.request.url.includes('internal');
  if (isApiUrl && isInternal) {
    const modifiedHeaders = new Headers(event.request.headers);
    modifiedHeaders.append('Authorization', token);

    const authReq = new Request(event.request, {
      headers: modifiedHeaders,
      mode: 'cors'
    });
    event.respondWith((async () => fetch(authReq))());
  }
})

importScripts('./ngsw-worker.js');
