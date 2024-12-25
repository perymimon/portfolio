export function linkPageToParent () {

    window.addEventListener('message', function (event) {
        if (event.data.theme) {
            document.body.setAttribute('data-theme', event.data.theme);
        }
    });

}

export function toggleTheme () {
    document.body.setAttribute('data-theme',
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark',
    );
    // Propagate theme change to iframe
    const iframe = document.getElementById('content-frame');
    iframe.contentWindow.postMessage({theme: document.body.getAttribute('data-theme')}, '*');
}

export function linkPageFromParent () {
    // Set initial theme based on user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('data-theme', 'dark');
    }

    // Listen for iframe load events to sync theme
    document.getElementById('content-frame').addEventListener('load', function () {
        this.contentWindow.postMessage({theme: document.body.getAttribute('data-theme')}, '*');
    });
}