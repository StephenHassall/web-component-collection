/**
 * Buttons
 * 
 * <button-custom>
 * <button-default>
 * <button-primary>
 * <button-secondary>
 * <button-warning>
 * <button-danger>
 * 
 * <button-...>
 *   <div slot="prefix"></div>
 *   <div>default slot</div>
 *   <div slot="suffix"></div>
 * </button-...>
 * 
 * @classdesc
 * A collection of web component buttons.
 * 
 * Attributes:
 * disabled
 * Disables the button from working.
 * 
 * one-click
 * Only allows the button to be pressed once, and then disables itself afterwards
 * 
 * Slots:
 * Default slot is placed in the middle text area. If the text is too long and does not overflow correctly
 * then put it inside a <span>...</span> tag.
 * 
 * prefix
 * Shown before the middle text
 * 
 * suffix
 * Show after the middle text
 * 
 * CSS Variables
 * --background
 * --text-color
 * --border-color
 * Button colors when not hovered, not active and does not have the focus
 * 
 * --hover-background
 * --hover-text-color
 * --hover-border-color
 * Button colors when mouse is hovering over button
 * 
 * --active-background
 * --active-text-color
 * --active-border-color
 * Button colors when button is being pressed
 * 
 * --focus-box-shadow
 * Button colors (and box shadow) when button has the focus
 * 
 * Properties:
 * disabled = true|false
 * Disables or enables the button.
 * 
 * oneClick = true|false
 * If set to true then the user can only press the button once (it disables itself afterwards)
 * 
 * Notes:
 * Does not work with autofocus attribute
 * 
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 */

// Button custom class
class ButtonCustom extends HTMLElement {
    // State that this web component is form associated (acts like a normal button)
    static get formAssociated() { return true; }

    /**
     * Static CSS constant.
     * @return {string} The CSS constant.
     */
    static get CSS() {
        return /*css*/`
        :host {
            display: inline-block;
        }

        button {
            display: grid;
            justify-content: center;
            align-items: center;            
            box-sizing: border-box;
            width: calc(100% - max(0.2em, 0.5rem));       
            height: calc(100% - max(0.2em, 0.5rem));
            grid-template-columns: [prefix] auto [text] auto [suffix] auto;
            grid-template-rows: 1fr;
            gap: 0.5em;
            background: var(--background, inherit);
            border-width: max(0.1em, 0.125rem);
            border-radius: max(0.5em, 0.25rem);
            border-color: var(--border-color, black);
            border-style: solid;
            color: var(--text-color, inherit);
            fill: var(--text-color, inherit);
            font-size: inherit;
            font-weight: inherit;
            text-shadow: inherit;
            text-decoration: inherit;
            text-overflow: inherit;
            white-space: nowrap;
            padding: 0.5em 1em;
            margin: max(0.1em, 0.25rem);
            user-select: none;
            transition: box-shadow 0.15s ease-in-out, background 0.2s ease-in-out;
        }

        button[no-prefix][no-suffix] {
            grid-template-columns: [text] minmax(0, 1fr);
        }

        button[no-prefix] {
            grid-template-columns: [text] auto [suffix] auto;
        }

        button[no-suffix] {
            grid-template-columns: [prefix] auto [text] auto;
        }

        button:hover {
            color: var(--hover-text-color, inherit);
            fill: var(--hover-text-color, inherit);
            background: var(--hover-background, inherit);
            border-color: var(--hover-border-color, inherit);
        }

        button:active {
            color: var(--active-text-color, inherit);
            fill: var(--active-text-color, inherit);
            background: var(--active-background, inherit);
            border-color: var(--active-border-color, inherit);
        }

        button:focus-visible:not(:active) {
            color: var(--hover-text-color, inherit);
            fill: var(--hover-text-color, inherit);
            background: var(--hover-background, inherit);
            border-color: var(--hover-border-color, inherit);
            box-shadow: var(--focus-box-shadow, 0 0 0 max(0.1em, 0.25rem) #e8e8e8);
            outline: none;
        }    

        button[disabled] {
            opacity: 0.5;
            cursor: default;
        }

        button[disabled]:hover {
            color: var(--text-color, inherit);
            fill: var(--text-color, inherit);
            background: var(--background, inherit);
            border-color: var(--border-color, inherit);
        }

        #prefix {
            grid-column: prefix;
        }

        #suffix {
            grid-column: suffix;
        }

        #text {
            grid-column: text;
        }

        slot[name=prefix]::slotted(*) {
            height: 1em;
        }

        slot[name=suffix]::slotted(*) {
            height: 1em;
        }

        slot::slotted(*) {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        @media (hover: hover) {
            button {
                cursor: pointer;
            }
        }
        `;
    }

    /**
     * Static HTML constant.
     * @return {string} The HTML constant.
     */
    static get HTML() {
        return /*html*/`
        <button id="button" no-prefix no-suffix>
            <slot id="prefix" name="prefix"></slot>
            <slot id="text"></slot>
            <slot id="suffix" name="suffix"></slot>
        </button>`;
    }

    /**
     * Base button web component constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open', delegatesFocus: true });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = ButtonDefault.HTML;

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set styles
        style.textContent = ButtonDefault.CSS;
        
        // Insert shadow DOM's styles
        this.shadowRoot.prepend(style);

        // Create attach internals object
        if (this.attachInternals) this._internals = this.attachInternals();

        // Get elements
        this._buttonElement = this.shadowRoot.getElementById('button');
        this._prefixSlotElement = this.shadowRoot.getElementById('prefix');
        this._suffixSlotElement = this.shadowRoot.getElementById('suffix');

        // Bind the events to this
        this._prefixSlotchange = this._prefixSlotchange.bind(this);
        this._suffixSlotchange = this._suffixSlotchange.bind(this);
        this._click = this._click.bind(this);
    }

    /**
     * Gets the one click property. If set to true then the button can only be pressed once and is then
     * disabled.
     */
    get oneClick() {
        // If no one-click attribute
        if (this.hasAttribute('one-click') === false) return false;

        // Attribute exists therefore one click is on
        return true;
    }

    /**
     * Sets the one click property. True to only allow the button to be pressed once.
     */
    set oneClick(value) {
        // If value is set to true
        if (value === true) {
            // Add the one-click attribute
            this.setAttribute('one-click', '');
        } else {
            // Remove the one-click attribute
            this.removeAttribute('one-click');
        }
    }

    /**
     * Gets the disabled status.
     */
    get disabled() {
        // If no disabled attribute
        if (this.hasAttribute('disabled') === false) return false;

        // Attribute exists therefore it is disabled
        return true;
    }

    /**
     * Sets the disabled status.
     */
    set disabled(value) {
        // If value is set to true
        if (value === true) {
            // Add the disabled attribute
            this.setAttribute('disabled', '');
        } else {
            // Remove the disabled attribute
            this.removeAttribute('disabled');
        }
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add slot change event
        this._prefixSlotElement.addEventListener('slotchange', this._prefixSlotchange);
        this._suffixSlotElement.addEventListener('slotchange', this._suffixSlotchange);

        // Add click event
        this._buttonElement.addEventListener('click', this._click);
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove slot change event
        this._prefixSlotElement.removeEventListener('slotchange', this._prefixSlotchange);
        this._suffixSlotElement.removeEventListener('slotchange', this._suffixSlotchange);

        // Remove click event
        this._buttonElement.removeEventListener('click', this._click);
    }

    /**
     * Prefix slot change event.
     * @param {Object} event Slot change event information.
     */
    _prefixSlotchange(event) {
        // Get assigned elements for prefix slot
        const assignedElements = this._prefixSlotElement.assignedElements();

        // If no slotted elements
        if (assignedElements.length === 0) {
            // Add no-prefix attribute
            this._buttonElement.setAttribute('no-prefix', '');            
        } else {
            // Remove the no-prefix attribute
            this._buttonElement.removeAttribute('no-prefix');
        }
    }

    /**
     * Suffix slot change event.
     * @param {Object} event Slot change event information.
     */
    _suffixSlotchange(event) {
        // Get assigned elements for suffix slot
        const assignedElements = this._suffixSlotElement.assignedElements();

        // If no slotted elements
        if (assignedElements.length === 0) {
            // Add no-suffix attribute
            this._buttonElement.setAttribute('no-suffix', '');            
        } else {
            // Remove the no-suffix attribute
            this._buttonElement.removeAttribute('no-suffix');
        }
    }

    /**
     * Button click event.
     * @param {Object} event The click event information.
     */
    _click(event) {        
        // If one-click attribute is set
        if (this.hasAttribute('one-click') === true) {
            // Fire the click event
            this.click();

            // Disable this button web component
            this.setAttribute('disabled', '');

            // Stop the event happening twice (though it is unlikely after disabling it)
            event.stopPropagation();
        }
    }

    /**
    * Override formDisabledCallback function to handle when component is disabled or not.
    * @param {boolean} disabled The current state of the web component.
    * @override
    */
    formDisabledCallback(disabled) {
        // Set disabled value
        this._disabled = disabled;

        // If disabled
        if (disabled === true) {
            // Add disabled attribute
            this._buttonElement.setAttribute('disabled','');
        } else {
            // Remove disabled attribute
            this._buttonElement.removeAttribute('disabled');
        }
    }
}

// Default button class
class ButtonDefault extends ButtonCustom {
    /**
     * Default button web component constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Set CSS variables
        this._buttonElement.style.setProperty('--background', 'hsl(0, 0%, 80%)');
        this._buttonElement.style.setProperty('--text-color', 'hsl(0, 0%, 5%)');
        this._buttonElement.style.setProperty('--border-color', 'hsl(0, 0%, 75%)');
        this._buttonElement.style.setProperty('--hover-background', 'hsl(0, 0%, 75%)');
        this._buttonElement.style.setProperty('--hover-text-color', 'hsl(0, 0%, 6%)');
        this._buttonElement.style.setProperty('--hover-border-color', 'hsl(0, 0%, 70%)');
        this._buttonElement.style.setProperty('--active-background', 'hsl(0, 0%, 40%)');
        this._buttonElement.style.setProperty('--active-text-color', 'hsl(0, 0%, 7%)');
        this._buttonElement.style.setProperty('--active-border-color', 'hsl(0, 0%, 65%)');
        this._buttonElement.style.setProperty('--focus-box-shadow', '0 0 0 max(0.1em, 0.25rem) hsl(0, 0%, 90%)');
    }
}

// Primary button class
class ButtonPrimary extends ButtonCustom {
    /**
     * Primary button web component constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Set CSS variables
        this._buttonElement.style.setProperty('--background', 'hsl(215, 100%, 50%)');
        this._buttonElement.style.setProperty('--text-color', 'hsl(215, 2%, 100%)');
        this._buttonElement.style.setProperty('--border-color', 'hsl(215, 100%, 40%)');
        this._buttonElement.style.setProperty('--hover-background', 'hsl(215, 100%, 40%)');
        this._buttonElement.style.setProperty('--hover-text-color', 'hsl(215, 3%, 100%)');
        this._buttonElement.style.setProperty('--hover-border-color', 'hsl(215, 100%, 35%)');
        this._buttonElement.style.setProperty('--active-background', 'hsl(215, 100%, 20%)');
        this._buttonElement.style.setProperty('--active-text-color', 'hsl(215, 4%, 100%)');
        this._buttonElement.style.setProperty('--active-border-color', 'hsl(215, 100%, 10%)');
        this._buttonElement.style.setProperty('--focus-box-shadow', '0 0 0 max(0.1em, 0.25rem) hsl(215, 50%, 75%)');
    }
}

// Secondary button class
class ButtonSecondary extends ButtonCustom {
    /**
     * Secondary button web component constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Set CSS variables
        this._buttonElement.style.setProperty('--background', 'hsl(110, 60%, 40%)');
        this._buttonElement.style.setProperty('--text-color', 'hsl(110, 2%, 100%)');
        this._buttonElement.style.setProperty('--border-color', 'hsl(110, 60%, 30%)');
        this._buttonElement.style.setProperty('--hover-background', 'hsl(110, 60%, 35%)');
        this._buttonElement.style.setProperty('--hover-text-color', 'hsl(110, 3%, 100%)');
        this._buttonElement.style.setProperty('--hover-border-color', 'hsl(110, 60%, 25%)');
        this._buttonElement.style.setProperty('--active-background', 'hsl(110, 60%, 20%)');
        this._buttonElement.style.setProperty('--active-text-color', 'hsl(110, 4%, 70%)');
        this._buttonElement.style.setProperty('--active-border-color', 'hsl(110, 60%, 10%)');
        this._buttonElement.style.setProperty('--focus-box-shadow', '0 0 0 max(0.1em, 0.25rem) hsl(110, 50%, 75%)');
    }
}

// Warning button class
class ButtonWarning extends ButtonCustom {
    /**
     * Warning button web component constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Set CSS variables
        this._buttonElement.style.setProperty('--background', 'hsl(48, 100%, 50%)');
        this._buttonElement.style.setProperty('--text-color', 'hsl(48, 100%, 20%)');
        this._buttonElement.style.setProperty('--border-color', 'hsl(48, 100%, 40%)');
        this._buttonElement.style.setProperty('--hover-background', 'hsl(48, 100%, 45%)');
        this._buttonElement.style.setProperty('--hover-text-color', 'hsl(48, 100%, 19%)');
        this._buttonElement.style.setProperty('--hover-border-color', 'hsl(48, 100%, 35%)');
        this._buttonElement.style.setProperty('--active-background', 'hsl(48, 100%, 20%)');
        this._buttonElement.style.setProperty('--active-text-color', 'hsl(48, 100%, 50%)');
        this._buttonElement.style.setProperty('--active-border-color', 'hsl(48, 100%, 10%)');
        this._buttonElement.style.setProperty('--focus-box-shadow', '0 0 0 max(0.1em, 0.25rem) hsl(48, 50%, 75%)');
    }
}

// Danger button class
class ButtonDanger extends ButtonCustom {
    /**
     * Danger button web component constructor.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Set CSS variables
        this._buttonElement.style.setProperty('--background', 'hsl(0, 100%, 50%)');
        this._buttonElement.style.setProperty('--text-color', 'hsl(0, 2%, 100%)');
        this._buttonElement.style.setProperty('--border-color', 'hsl(0, 100%, 40%)');
        this._buttonElement.style.setProperty('--hover-background', 'hsl(0, 100%, 45%)');
        this._buttonElement.style.setProperty('--hover-text-color', 'hsl(0, 3%, 100%)');
        this._buttonElement.style.setProperty('--hover-border-color', 'hsl(0, 100%, 35%)');
        this._buttonElement.style.setProperty('--active-background', 'hsl(0, 100%, 20%)');
        this._buttonElement.style.setProperty('--active-text-color', 'hsl(480, 4%, 100%)');
        this._buttonElement.style.setProperty('--active-border-color', 'hsl(0, 100%, 10%)');
        this._buttonElement.style.setProperty('--focus-box-shadow', '0 0 0 max(0.1em, 0.25rem) hsl(0, 50%, 75%)');
    }
}

// Tell the browser about the new tag and the class it is linked to
customElements.define('button-custom', ButtonCustom);
customElements.define('button-default', ButtonDefault);
customElements.define('button-primary', ButtonPrimary);
customElements.define('button-secondary', ButtonSecondary);
customElements.define('button-warning', ButtonWarning);
customElements.define('button-danger', ButtonDanger);
