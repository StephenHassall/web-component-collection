/**
 * Table of content (TOC) tree web component
 * 
 * <toc-tree open>
 *   <div slot="title">Click here for a list of stuff</div>
 *   <a href="..." slot="content">Item 1</a>
 *   <a href="..." slot="content">Item 2</a>
 *   <a href="..." slot="content">Item 3</a>
 * </toc-tree>
 * 
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 */ 
class TocTree extends HTMLElement {
    /**
     * Static CSS constant.
     * @return {string} The CSS constant.
     */
    static get CSS() {
        return /*css*/`
        .content-list {
            display: none;
        }

        .title {
            --arrow-height: 0.625em;
            --arrow-width: 1em;
            --arrow-line-height: 1.25em            
        }

        :host {
            --text-color: rgb(48, 48, 48);
            --background-color: white;          
        }

        @media (prefers-color-scheme: dark) {
            :host {
              --text-color: rgb(248, 248, 248);
              --background-color: #404040;
            }
        }          

        :host([open]) .content-list {
            display: block;
        }

        .title::slotted(*) {
            cursor: pointer;
            margin-top: 0.5em;
            font-size: 1em;
            font-weight: normal;
            color: var(--text-color);
            margin-top: 0.5em;
            margin-bottom: 0.5em;
        }

        .title::slotted(*):before {
            content: '';
            display: inline-block;
            width: 0;
            height: 0;
            margin-right: 0;
            margin-left: calc(var(--arrow-width) / 2);
            margin-top: calc((var(--arrow-line-height) - var(--arrow-height)) / 2);
            margin-bottom: calc((var(--arrow-line-height) - var(--arrow-height)) / 2);
            border-style: solid;
            border-color: transparent transparent transparent #287ea1;
            border-width: calc(var(--arrow-height) / 2) calc(var(--arrow-width) / 2);
            transform-origin: calc(var(--arrow-width) / 4) calc(var(--arrow-height) / 2);
            transform: rotate(0deg);
            transition: transform 0.25s;
            vertical-align: middle;
        }

        :host([open]) .title::slotted(*):before {
            transform-origin: calc(var(--arrow-width) / 4) calc(var(--arrow-height) / 2);
            transform: rotate(90deg);
            transition: transform 0.25s;
        }

        .content::slotted(*) {
            display: block;
            margin: 0.5em 0.5em 0.5em 1.8em;
            padding: 0;
            text-decoration: none;
            color: var(--text-color);
        }

        .content::slotted(*:focus) {
            outline-color: #287ea1;
            outline-offset: 0.3em;
            outline-width: 0.25em;
        }

        .content::slotted(:not(toc-tree):hover) { text-decoration: underline; }
        .content::slotted(toc-tree) { text-decoration: none; }
        `;
    }

    /**
     * Static HTML constant.
     * @return {string} The HTML constant.
     */
    static get HTML() {
        return /*html*/`
            <slot id="title" name="title" class="title"></slot>
            <div class="content-list">
                <slot name="content" class="content"></slot>
            </div>`;
    }

    /**
     * TOC tree web component constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this._shadowRoot = this.attachShadow({mode: 'open'});

        // Set shadow DOM's inner HTML
        this._shadowRoot.innerHTML = TocTree.HTML;

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set styles
        style.textContent = TocTree.CSS;
        
        // Insert shadow DOM's styles
        this._shadowRoot.prepend(style);

        // Bind the click event function to this
        this._titleClickEvent = this._titleClickEvent.bind(this);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Get slot title element (there should only be one)
        this._titleElement = this.shadowRoot.getElementById('title');

        // Set title click event
        this._titleElement.addEventListener('click', this._titleClickEvent);
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove the item click event
        this._titleElement.removeEventListener('click', this._titleClickEvent);
    }

    /**
     * Title click event.
     */
    _titleClickEvent(event) {
        // If attribute open
        if (this.hasAttribute('open') === true) {
            // Remove the open attribute
            this.removeAttribute('open');
        } else {
            // Add the open attribute
            this.setAttribute('open', '');
        }
    }
}
 
// Define controller web component
customElements.define('toc-tree', TocTree);
