export function linkPageToParent () {
    window.addEventListener('message', function (event) {
        if (event.data.theme) {
            setTheme(event.data.theme);
        }
    });
}

export function inIframe(){
    return window !== top
}

if(inIframe()){
    document.body.classList.add('in-iframe')
}

export function getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    propagateThemeToIframe(theme);
}

function propagateThemeToIframe(theme) {
    const iframe = document.getElementById('content-frame');
    iframe?.contentWindow.postMessage({theme}, '*');
}

export function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

export function initializeTheme() {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    });
    
    document.getElementById('content-frame')?.addEventListener('load', function () {
        propagateThemeToIframe(document.body.getAttribute('data-theme'));
    });
}

export function linkPageFromParent () {
    
}