import auth from './auth.js';
import userList from './userList.js';

chrome.storage.sync.get('user', (storage) => {
    Promise.resolve()
        .then(() => !storage.user.access_token ? auth() : storage.user)
        .then(user => userList(user))
        .then(json => {
            window.addEventListener('message', event => {
                document.getElementById('content')!.innerHTML = event.data.html;
            });

            (<HTMLIFrameElement> document.getElementById('sandbox')).contentWindow!.postMessage({
                command: 'render', content: json
            }, '*');
        })
        .catch(e => console.warn(e));
});
