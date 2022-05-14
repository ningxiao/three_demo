self.addEventListener('message', ev => {
    if (ev.data === 'hello') {
        self.postMessage('hiya!');
    }
});
