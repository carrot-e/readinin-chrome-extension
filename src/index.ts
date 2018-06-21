import auth from './auth.js';
import userList from './userList.js';

chrome.storage.sync.get('user', (storage) => {
    Promise.resolve()
        .then(() => !storage.user.access_token ? auth() : storage.user)
        .then(user => userList(user))
        .then(json => {
            console.log(json);
        })
        .catch(e => console.warn(e));
});
