document.addEventListener('DOMContentLoaded', () => {
    fetch('./projects/projects.json')
        .then(response => response.json())
        .then(data => {
            const groups = Object.groupBy(data, datum=> datum['group-id']);
            buildNavigation(groups);
        })
        .catch(error => console.error('Error loading projects:', error));
})

/**
 * Build the navigation by inserting groups based on HTML comments.
 * @param {Array} groups - List of all groups with their IDs and items.
 */
function buildNavigation (groups) {
    const comments = findComments(document.body);
    const matcher = /(links|tabs):\s*([\w-]+)/
    comments
        .filter(comment => comment.data.match(matcher))
        .forEach(comment => {
            const [, type, groupId] = comment.data.match(matcher)
            const group =  groups[groupId]
            if (group) {
                const fragment  = document.createDocumentFragment()
                group.forEach(item => {
                    const element = buildLink(item, type === 'tabs')
                    fragment.appendChild(element)
                });
                comment.parentNode.insertBefore(fragment, comment.nextSibling)
            }
        });
}

/**
 * Build a single link or tab element.
 * @param {Object} item - The item data.
 * @param {Boolean} isTab - Whether this link is a tab.
 * @returns {HTMLElement} - The constructed link or tab element.
 */
function buildLink (item, isTab = false) {
    const link = document.createElement('a');
    link.classList.add('sidebar-link');
    link.href = item.link;
    link.textContent = item.title;
    link.target = 'content-frame';
    if(item.title) link.dataset.title = item.title;
    if (item.description) link.dataset.description = item.description
    if (item.year) link.dataset.year = item.year
    if (item.stack) link.dataset.stack = item.stack
    if (item.teacher) link.dataset.teacher = item.teacher
    if (item.tutorial) link.dataset.tutorial = item.tutorial

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
function findComments (node) {
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
