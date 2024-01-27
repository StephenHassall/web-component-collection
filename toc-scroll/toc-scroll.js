/**
 * Table of content (toc) scroll web component
 * 
 * <toc-scroll></toc-scroll>
 * 
 * <section>
 *   <h1>Content title</h1>
 * </section>
 * 
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 */ 
class TocScroll extends HTMLElement {
    /**
     * Static CSS constant.
     * @return {string} The CSS constant.
     */
    static get CSS() {
        return /*css*/`
            :host {
                --text-color: rgb(48, 48, 48);
                --background-color: white;
                --active-background-color: #dde6e9;  
            }

            @media (prefers-color-scheme: dark) {
                :host {
                    --text-color: rgb(248, 248, 248);
                    --background-color: #404040;
                    --active-background-color: #037094;
                }
            }
        
            a {
                display: block;
                height: fit-content;
                font-size: 0.85em;
                border-left: 0.125rem solid lightgray;
                padding: 0.5em 0em 0.5em 1em;
                color: gray;
                background-color: inherit;
                transition: background-color 0.5s;
            }
            a.active {
                background-color: var(--active-background-color);
                border-left: 0.25em solid #287ea1;
                font-weight: 600;
                color: var(--text-color);
                transition: background-color 0.5s;
            }
            a:focus {
                outline-offset: -0.125rem;
                outline-color: #287ea1;
            }
            a:link { text-decoration: none;}
            a:visited { text-decoration: none; }
            a:hover { text-decoration: none; color: #287ea1; }
            a:active { text-decoration: none; }
        `;
    }

    /**
     * TOC scroll web component constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this._shadowRoot = this.attachShadow({mode: 'open'});

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = TocScroll.CSS;

        // Add styles
        this._shadowRoot.appendChild(style);

        // Bind the events functions to this
        this._sectionHeaderEvent = this._sectionHeaderEvent.bind(this);
        this._sectionEvent = this._sectionEvent.bind(this);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Get a list of all the section header elements
        let sectionHeaderElementList = document.querySelectorAll("section h1:first-child");

        // If none found
        if (sectionHeaderElementList.length === 0) return;

        // Create html list
        let htmlList = [];

        // Set id count
        let idCount = 1;

        // For each section header element
        sectionHeaderElementList.forEach((element) => {
            // Set id
            let id = element.id;

            // If there is no id
            if (!id) {
                // Set the id to the id count
                id = 'toc-' + idCount.toString();

                // Increase id count
                idCount++;

                // Set the section header element id value
                element.id = id;
            }

            // Create anchor HTML
            const html = '<a href="#' + id + '" id="link-hash-' + id + '">' + element.innerText + '</a>';

            // Add to list
            htmlList.push(html);            
        });

        // Create root HTML
        const rootHtml = document.createElement('div');

        // Add the HTML to the element
        rootHtml.innerHTML = htmlList.join('');

        // Add root HTML to shadow DOM
        this._shadowRoot.appendChild(rootHtml);

        // Set link hash list
        this._linkHashList = null;

        // Monitor the section header elements
        this._monitorSectionHeader(sectionHeaderElementList);

        // Monitor the section elements
        this._monitorSection();
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Stop observing if required
        if (this._sectionHeaderObserver) this._sectionHeaderObserver.disconnect();
        if (this._sectionObserver) this._sectionObserver.disconnect();

        // Clear observers
        this._sectionHeaderObserver = null;
        this._sectionObserver = null;
    }

    /**
     * Check the link hash element list exists
     */
    _checkLinkHashList() {
        // If there is a link hash list
        if (this._linkHashList !== null) return;

        // Get a list of all the list anchor elements
        this._anchorElementList = this._shadowRoot.querySelectorAll("a");
    }

    /**
     * Sort the list of entries. We sort by intersecting and interesction ratio.
     * @param entries The list of entries to be sorted.
     */
    _sortEntries(entries) {
        // Sort the list
        entries.sort(function (entry1, entry2) {
            // Check intersecting. We want intersecting true at the top of the list
            if (entry1.isIntersecting === false && entry2.isIntersecting === true) return 1;
            if (entry1.isIntersecting === true && entry2.isIntersecting === false) return -1;

            // If both are not intersecting then we can stop here
            if (entry1.isIntersecting === false && entry2.isIntersecting === false) return 0;

            // Compare the intesection ratio. The higher the value the more of the element is in the view zone
            if (entry1.intersectionRatio > entry2.intersectionRatio) return -1;
            if (entry1.intersectionRatio < entry2.intersectionRatio) return 1;

            // Return the same
            return 0;
        });
    }

    /**
     * Monitor the section header elements when being scrolled.
     * @param {Element[]} sectionHeaderElementList The list of section header elements to monitor.
     */
    _monitorSectionHeader(sectionHeaderElementList) {
        // Set oberver options
        const options = {
            root: null,
            rootMargin: '0% 0% -75% 0% ',
            threshold: 0.5
        };
        
        // Create intersection observer object
        this._sectionHeaderObserver = new IntersectionObserver(this._sectionHeaderEvent, options);

        // Set to observe each of the section header elements
        sectionHeaderElementList.forEach((element) => { this._sectionHeaderObserver.observe(element) });
    }

    /**
     * Monitor the section elements when being scrolled.
     */
    _monitorSection() {
        // Get a list of all the section elements
        let sectionElementList = document.querySelectorAll("section");

        // Set oberver options
        const options = {
            root: null,
            rootMargin: '0% 0% 0% 0% ',
            threshold: 0.01
        };
        
        // Create intersection observer object
        this._sectionObserver = new IntersectionObserver(this._sectionEvent, options);

        // Set to observe each of the section header elements
        sectionElementList.forEach((element) => { this._sectionObserver.observe(element) });
    }

    /**
     * Change the URL to included the #id part.
     * @param {string} anchorId The id of the element that is the anchor point.
     */
    _changeUrlHash(anchorId) {
        // Set URL without hash
        let urlWithoutHash = window.location.href;

        // Check for hash
        const hashIndex = window.location.href.indexOf(window.location.hash);
        if (hashIndex !== -1) urlWithoutHash = urlWithoutHash.substring(0, hashIndex);

        // Set URL with anchor hash
        const url = urlWithoutHash + '#' + anchorId;

        // Update the URL without reloading page
        window.history.pushState({ path: url }, '', url);        
    }

    /**
     * Section header event.
     * @param {Object[]} entries List of entry items with information about the each event.
     * @param {Object} observer The observer object.
     */
    _sectionHeaderEvent(entries, observer) {
        // Check we have the list of link hash elements
        this._checkLinkHashList();

        // Sort the list of entries
        this._sortEntries(entries);

        // For each entry
        for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
            // Get entry
            const entry = entries[entryIndex];

            // If not intersection then skip
            if (entry.isIntersecting === false) continue;

            // Get target id
            const targetId = entry.target.id;

            // Set anchor id
            const anchorId = 'link-hash-' + targetId;

            // For each anchor element
            this._anchorElementList.forEach((element) => {
                // If the element id is not the one we want
                if (element.id !== anchorId) {
                    // Remove the active class
                    element.classList.remove('active');
                } else {
                    // Add the active class
                    element.classList.add('active');

                    // Change the URL to point to the anchor hashtag
                    this._changeUrlHash(targetId);
                }
            });

            // Stop after finding the first entry
            return;
        };
    }

    /**
     * Section event.
     * @param {Object[]} entries List of entry items with information about the each event.
     * @param {Object} observer The observer object.
     */
    _sectionEvent(entries, oberver) {
        // Check we have the list of link hash elements
        this._checkLinkHashList();

        // For each anchor element
        for (let index = 0; index < this._anchorElementList.length; index++) {
            // Get anchor element
            const anchorElement = this._anchorElementList[index];

            // If also ready active then do nothing more
            if (anchorElement.classList.contains('active') === true) return;
        }

        // Sort the list of entries
        this._sortEntries(entries);

        // For each entry
        for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
            // Get entry
            const entry = entries[entryIndex];

            // If not intersection then skip
            if (entry.isIntersecting === false) continue;

            // Get the first header element for this section
            let header = entry.target.querySelector("h1:first-child");

            // If not found
            if (header === null) continue;

            // If no id
            if (!header.id) continue;

            // Get target id
            const targetId = header.id;

            // Set anchor id
            const anchorId = 'link-hash-' + targetId;

            // For each anchor element
            for (let index = 0; index < this._anchorElementList.length; index++) {
                // Get anchor element
                const anchorElement = this._anchorElementList[index];
                
                // If the element id is not the one we want
                if (anchorElement.id !== anchorId) continue;

                // Add the active class
                anchorElement.classList.add('active');

                // Change the URL to point to the anchor hashtag
                this._changeUrlHash(targetId);

                // Stop when we find the first one
                return;
            }
        }
    }
}
 
// Define controller web component
customElements.define('toc-scroll', TocScroll);
