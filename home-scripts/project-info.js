const teachers = {
    '@Radu': {
        url: 'https://www.youtube.com/@Radu',
        name: 'Dr.Radu',/*Mariescu-Istodor*/
    },
    '@Frank':{
        url: 'https://www.youtube.com/@Frankslaboratory',
        name:'@Franks'
    },
    '@me':{
        url: 'https://github.com/perymimon',
        name: '@pery'
    }
}

export function injectProjectInfo (link) {
    // var template = document.querySelector('#template-info').content.cloneNode(true);
    var mainLink = document.getElementById(link.dataset.mainLink) || link
    var data = mainLink !== link ?{...mainLink.dataset, ...link.dataset}: link.dataset
    var teacher = teachers[data.teacher]
    var infoPanel = document.getElementById('project-info')

    var tabList = mainLink.parentElement.querySelector(':scope > [role="tablist"]')

    var template = `
          <h3 class="info-title">⬡
                <span id="info-title" data-value="${data.title}">${data.title}</span> |
                <span id="info-year" data-value="${data.year}">${data.year}</span> |
                <a href="${data.source}" data-value="${data.source}" class="info-detail" target="_blanck"><strong>⎇Github</strong></a>
                    <a href="${data.npm}"  data-value="${data.npm}" class="info-detail" target="_blanck"><strong>⚙ NPM</strong></a>
                 
                <div class="info-content">
                    <span class="info-detail" data-value="${data.stack}">
                        <strong>Stack▯</strong>
                        <span class="info-value info-stack">${data.stack}</span>
                        <span data-value="${data.teacher}">
                            , seed 
                            <a href="${teacher?.url}">${teacher?.name}</a>
                        </span>
                    </span>
                    
                   
                </div>
          </h3>
          <div class="bottom-bar">
            <span class="info-description info-content info-detail">
                ${data.description?.trim() || 'No description available'}
                
            </span>
            ${tabList?.outerHTML || ''}
          </div>
            
        
            <!--        <div class="info-actions">-->
            <!--            <button class="button-base" id="live-demo-btn">Live</button>-->
            <!--            <button class="button-base" id="source-code-btn">Code</button>-->
            <!--        </div>-->
    `
    infoPanel.innerHTML = template
}
