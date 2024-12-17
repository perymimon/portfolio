export function linkPageToParent () {

    window.addEventListener('message', function (event) {
        if (event.data.theme) {
            document.body.setAttribute('data-theme', event.data.theme);
        }
    });

}