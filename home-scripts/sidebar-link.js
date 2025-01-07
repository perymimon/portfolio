import {injectProjectInfo} from './project-info.js'

export function processLink() {
    var linkSelector = 'a.sidebar-link, .sidebar-link  a '
    var frameSelector = '#content-frame'
    const links = document.querySelectorAll(linkSelector)
    const contentFrame = document.querySelector(frameSelector)

    links.forEach(link => {
        var parentLink = link.closest('.sidebar-link').querySelector(':scope > a')
        const href = link.getAttribute('href')
        link.id = href
            .replace(/^https?:\/\//, '')
            .replace(/[\/.]/g, '-')
            .replace(/(-index.html)?-?$/, '')
        link.dataset.href = href
        link.href = '#' + link.id

        if(parentLink && parentLink !== link){
            link.dataset.mainLink = parentLink.id
        }

    });

    function loadContent (hash = window.location.hash) {
        if (hash) {
            const decodedHash = hash.slice(1)
            var link = document.getElementById(decodedHash)
            if (link) {
                link.setAttribute('aria-selected', 'true')
                contentFrame.src = link.dataset.href
                injectProjectInfo(link)
            } else {
                contentFrame.src = 'welcome.html';
            }
        }
    }


    window.addEventListener('hashchange', () => { loadContent(); });
    window.addEventListener('load', () => { loadContent() });

}

