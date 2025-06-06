import {runCommands} from "../src/helpers/typing.js";
import {injectProjectInfo2} from './project-info.js'
import {startViewTransition} from './view-transition.js'


document.addEventListener('click', async function handleGlobalClick(event) {
    if (!(event.target instanceof HTMLAnchorElement)) return
    if (event.target.getAttribute('href').startsWith('http')) return
    event.preventDefault()
    window.location.hash = event.target.id
})
window.addEventListener('hashchange', (event) => navigateToProjectPage())

const contentFrame = document.querySelector('#content-frame')
export var projects = null
export var byGroups = null


async function loadProjects() {
    projects = await fetch('./projects/projects.json')
        .then(response => response.json())
        .catch(error => console.error('Error loading projects:', error))
    /* add id to each project */
    // projects.forEach(project => project.id = href2id(project.link))
    /* group by group-id*/
    byGroups = Object.groupBy(projects, (datum) => datum.groupId);
}

const loadingProjects = loadProjects()

export async function initSidebar(event) {
    await loadingProjects
    buildNavigation()
    await navigateToProjectPage()
}


function toggleAnchor(anchor) {
    anchor = (typeof anchor === 'string') ? document.getElementById(anchor) : anchor
    if (!anchor) throw 'no anchor get or found'
    if (anchor.role === 'tab') {
        var roleset = anchor.closest('[role="tablist"]')
        roleset.querySelectorAll('[aria-selected]')
            .forEach(tab => tab.ariaSelected = String(tab === anchor))
        toggleAnchor(roleset.dataset.parent)

    } else {
        anchor.closest('nav')
            .querySelectorAll('a.sidebar-link')
            .forEach(link => link.ariaSelected = String(link === anchor))
    }
}

/**
 * @param id - can be project-id or object id, or undefined to get value from location.hash
 * @returns {Promise<string|*|boolean|boolean>}
 */
const historyMem = []
async function navigateToProjectPage(id = window.location.hash) {
    id = id.replace(/^#/, '')
    var project = getProjectById(id)


    var link = document.getElementById(id)
    var href = project?.link ?? link?.href

    if (contentFrame.src.includes(href)) return false

    var tabs = getProjectsOfGroup(project?.id)
    if (tabs) return (window.location.hash = tabs.at(0)?.id)
    if (!href) return navigateToProjectPage('welcome')
    /* what if we already on that project / page */
    project ??= {id, title: link.textContent}
    window.location.hash = id
    historyMem.push(id)
    await terminal(project)

    var viewTransition = startViewTransition(async _ => {
        contentFrame.src = href
        injectProjectInfo2(project)
    })
    await viewTransition.finished
    toggleAnchor(id)
    return project
}

async function terminal(project) {
    const {main = `index.js`,coolWord = `Loading`} = project.meta ?? {}
    const commands = `
        ${historyMem.at(-1)? `cd ../${project.id}`: `cd /projects/${project.id}`}
        chmod 755 initialize.sh
        Access Granted
        ./${main}
        ${coolWord} ${project.title} algorithms...
        Project ${project.title} activated.
    `
    await runCommands(commands);
}

export function getProjectById(projectId) {
    return projects.find(item => item.id === projectId)
}

export function getProjectsOfGroup(groupId) {
    return byGroups[groupId]
}

/**
 * Build the navigation by inserting groups based on HTML comments.
 * @param {Object} groups - Object where keys are group IDs and values are arrays of items.
 */
const commentMatcher = /(links|tabs):\s*([\w-]+)/

function buildNavigation() {
    const comments = findComments(document.body)
    comments
        .filter(comment => comment.data.match(commentMatcher))
        .forEach(comment => {
            addGroupAfterComment(comment)
        });
}

export function getAnchorsGroup(groupId, type) {
    var group = getProjectsOfGroup(groupId)
    const fragment = document.createDocumentFragment()
    if (!group) return null

    group.forEach((item, i) => {
        var isTabs = type === 'tabs'
        const element = buildLink(item, isTabs)
        if (isTabs) element.textContent = i + 1
        fragment.appendChild(element)
    });
    return fragment
}

export function addGroupAfterComment(comment) {
    const [, type, groupId] = comment.data.match(commentMatcher)
    const fragment = getAnchorsGroup(groupId, type)
    comment.parentNode.insertBefore(fragment, comment.nextSibling)
}

/**
 * Build a single link or tab element.
 * @param {Object} item - The item data.
 * @param {Boolean} isTab - Whether this link is a tab.
 * @returns {HTMLElement} - The constructed link or tab element.
 */
function buildLink(item, isTab = false) {
    const link = document.createElement('a');
    if (!isTab) link.classList.add('sidebar-link');
    link.href = item.link;
    link.id = item.id
    link.textContent = item.title;
    link.target = 'content-frame';

    if (isTab) {
        link.role = 'tab'
        link.ariaSelected = 'false'
    }
    return link;
}

/**
 * Find all HTML comments in a given node.
 * @param {Node} node - The root node to search within.
 * @returns {Array} - List of comment nodes.
 */
function findComments(node) {
    const comments = [];
    const iterator = document.createNodeIterator(
        node,
        NodeFilter.SHOW_COMMENT,
        null,
        false,
    );
    let currentNode;
    while ((currentNode = iterator.nextNode())) {
        comments.push(currentNode);
    }
    return comments;
}
