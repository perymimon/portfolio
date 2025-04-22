class TechSkillBar extends HTMLElement {
    constructor() {
        super();
        // this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const skill = this.getAttribute('skill') ?? ''
        const years = this.getAttribute('years') ?? ''
        const strength = this.getAttribute('strength') ?? ''

        this.innerHTML = `
            <style>
            @scope{
            :scope{
                display: inline grid;
                grid-template-areas: "skill years" "bar bar";
                font-size:var(--font-size-base);
                gap:var(--space-1);
            }
            .skill {grid-area: skill;}
            .bar {grid-area: bar;}
            .years {grid-area: years; text-align: right}
            
            progress {
                height:.625rem;
                width:100%;
                &::-webkit-progress-bar {
                  border-radius: var(--radius-md);
                  background-color: var(--color-muted);
                }
                
                &::-webkit-progress-value {
                 background: linear-gradient(to right, var(--component-base) 0,  var(--color-primary) 100%);
                 border-radius: var(--radius-md);
                }
            }
            
            }
            </style>
            <span class="skill">${skill}</span>
            <span class="years">${years} years</span>
            <progress value="${strength}" min="0" max="100" class="bar"></progress>
        `;
    }
}

customElements.define('fancy-tech-skill-bar', TechSkillBar);
