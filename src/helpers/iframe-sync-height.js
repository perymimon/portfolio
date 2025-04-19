
/* Inject into Iframe*/
export function emitHeight() {
    const resize = () => {
        parent.postMessage({
            type: 'resize-iframe',
            height: document.documentElement.scrollHeight
        }, '*');
    };
    window.addEventListener('load', resize);
    new ResizeObserver(resize).observe(document.body);
}
export function listenResize(iframe) {
    /* Listen on the Parrent */
    iframe.addEventListener('message', (event) => {
        if (event.data?.type === 'resize-iframe') {
            const iframe = document.querySelector('iframe'); // update selector if needed
            if (iframe) iframe.style.height = `${event.data.height}px`;
        }
    })
}