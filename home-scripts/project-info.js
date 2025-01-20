import {getAnchorsGroup, getProjectById} from './new-link-processing.js'

const teachers = {
    '@Radu': {
        url: 'https://www.youtube.com/@Radu',
        name: 'Dr.Radu',/* Mariescu-Istodor */
    },
    '@Frank': {
        url: 'https://www.youtube.com/@Frankslaboratory',
        name: '@Franks',
    },
    '@me': {
        url: 'https://github.com/perymimon',
        name: '@pery',
    },
}

export function injectProjectInfo2 (project) {
    var $infoPanel = document.getElementById('project-info')
    var $tabContainer = document.getElementById('tabs-container')
    if (!project) return $infoPanel.replaceChildren(/*empty*/)

    var parentProject = getProjectById(project.parent) ?? {}
    var data = {...parentProject, ...project}
    var teacher = teachers[data.teacher]
    var parentId = '', fragment = ''
    if (data.tabsId){
        parentId = parentProject.id ?? data.id
        if($tabContainer.dataset.parent !== parentId){
            fragment = getAnchorsGroup(data.tabsId, 'tabs')
            $tabContainer.replaceChildren(fragment)
            $tabContainer.dataset.parent = parentId
        }
    }else {
        $tabContainer.replaceChildren()
        delete $tabContainer.dataset.parent
    }

    $infoPanel.innerHTML = `
          <h3 class="info-header">⬡
            <span id="info-title" data-value="${data.title}">${data.title}</span> 
            <span id="info-year" data-value="${data.year}">| ${data.year}</span> 
            <span class="info-detail" data-value="${data.github || data.npm}"> |
                <a href="${data.github}" data-value="${data.github}" class="info-detail" target="_blanck">⎇Github</a>
                <span data-value="${data.npm}" class="info-detail">· <a href="${data.npm}" target="_blanck">⚙ NPM</a></span>
                <span data-value="${data.tutorial}" class="info-detail">· <a href="${data.tutorial}" target="_blanck">▶YouTube</a></span>
             </span>
           
          </h3>
           <div class="info-content">
                <span class="info-detail" data-value="${data.stack}">
                    <span>Stack▯</span>
                    <strong class="info-value info-stack">${data.stack}</strong>
                    <div data-value="${data.teacher}">
                    seed <a href="${teacher?.url}">${teacher?.name}</a>
                    </div>
                </span>
            </div>
          <div class="bottom-bar">
            <span class="info-description info-content info-detail">
                ${data.description?.trim() || 'No description available'}
            </span>
          </div>
        
            <!--        <div class="info-actions">-->
            <!--            <button class="button-base" id="live-demo-btn">Live</button>-->
            <!--            <button class="button-base" id="source-code-btn">Code</button>-->
            <!--        </div>-->
    `
}