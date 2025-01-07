const teachers = {
    '@Radu': {
        url: 'https://www.youtube.com/@Radu',
        name: 'Dr.Radu Mariescu-Istodor',
    },
    '@Frank':{
        url: 'https://www.youtube.com/@Frankslaboratory',
        name:'@Franks'
    }
}

export function injectExtraContent (link) {
    // var template = document.querySelector('#template-info').content.cloneNode(true);
    var infoPanel = document.getElementById('project-info')
    var {dataset} = link
    var template = `
          <h3 class="info-title">⬡
                <span id="info-title" data-value="${dataset.title}">${dataset.title}</span> |
                <span id="info-year" data-value="${dataset.year}">${dataset.year}</span> |
                <a href="${dataset.source}" data-value="${dataset.source}" class="info-detail" target="_blanck"><strong>⎇Github</strong></a>
                    <a href="${dataset.npm}"  data-value="${dataset.npm}" class="info-detail" target="_blanck"><strong>⚙ NPM</strong></a>
                <div class="info-content">
                    <span class="info-detail" data-value="${dataset.stack}">
                        <strong>Stack▯</strong>
                        <span class="info-value info-stack">${dataset.stack}</span>
                    </span>
                    
                </div>
        </h3>
        <span class="info-description info-detail">
            ${dataset.description.trim() || 'No description available'}
            <span data-value="${dataset.teacher || ''}">
               , teach by <a href="${teachers[dataset.teacher]?.url}">${teachers[dataset.teacher]?.name}</a>
            </span>
        </span>
            <!--        <div class="info-actions">-->
            <!--            <button class="button-base" id="live-demo-btn">Live</button>-->
            <!--            <button class="button-base" id="source-code-btn">Code</button>-->
            <!--        </div>-->
    `
    infoPanel.innerHTML = template
}
