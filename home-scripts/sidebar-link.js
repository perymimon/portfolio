import {injectProjectInfo} from './project-info.js'

export function processLink () {
    var linkSelector = 'a.sidebar-link, .sidebar-link  a '
    var frameSelector = '#content-frame'
    const links = document.querySelectorAll(linkSelector)
    const contentFrame = document.querySelector(frameSelector)

    links.forEach(link => {
        var sidebarLink =link.closest('.sidebar-link')
        var parentLink = sidebarLink.querySelector(':scope > a')
        const href = link.getAttribute('href')
         var id = href
            .replace(/^https?:\/\//, '')
            .replace(/[\/.]/g, '-')
            .replace(/(-index.html)?-?$/, '')
        link.id = id
        link.dataset.href = href
        link.href = '#' + id

        if (parentLink && parentLink !== link) {
            link.dataset.mainLink = parentLink.id
        }

    });

    function loadContent (hash = window.location.hash) {
        if (hash) {
            const decodedHash = hash.slice(1)
            var link = document.getElementById(decodedHash)
            if (link) {
                toggleLink(link)
                var subActiveLink = link
                    .closest('.sidebar-link')
                    .querySelector('[role=tablist]')
                    ?.querySelector('[aria-selected="true"]')
                link = subActiveLink ?? link
                contentFrame.src = link.dataset.href
                injectProjectInfo(link)
            } else {
                contentFrame.src = 'welcome.html';
            }
        }
    }

    function toggleTab (activeTab) {
        var tablist = activeTab.closest('[role="tablist"]')
        tablist?.querySelectorAll('[aria-selected]')
            .forEach(tab => tab.ariaSelected = String(tab === activeTab))
    }

    function toggleLink (activeLink) {
        if (activeLink.role === 'tab') {
            toggleTab(activeLink)
            var mainLinkId = activeLink.dataset.mainLink
            var parentLink = document.getElementById(mainLinkId)
            toggleLink(parentLink)
        } else {
            activeLink?.closest('nav')
                ?.querySelectorAll('a.sidebar-link, .sidebar-link > a')
                .forEach(link => link.ariaSelected = String(link === activeLink))
        }
    }

    window.addEventListener('hashchange', () => { loadContent(); });
    window.addEventListener('load', () => { loadContent() });

}

