import { LitElement, html} from 'lit-element';

export class tabBar extends LitElement {
    private tabCount;
    private selectedTab;
    private tabs;

    static get properties() {
        return { 
          tabs: { type: Array }
        };
      }

    constructor() {
        super();
        this.tabs = [];

    }
    
    render() {
        if(!this.selectedTab && this.tabs.length > 0) {
            this.selectedTab = this.tabs[0]
        }
        this.tabCount = 0;
        for (let i = 0; i < this.shadowRoot.childNodes.length; i++) {
            if (this.shadowRoot.childNodes[i].nodeName == "tab") {
                ++this.tabCount;
            }        
        }
        return html`
            ${this.tabs.map((tab) => html`<button @click=${this.selectedButton}>${tab}</button>`)}
            <p><slot name="${this.selectedTab}"></slot>`
    }

    selectedButton(e) {
        this.selectedTab = e.srcElement.innerText;
        this.requestUpdate();
    }
}