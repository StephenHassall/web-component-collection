/**
 * Digital clock web component.
 * 
 * @classdesc
 * Shows a digital clock with the current time.
 * 
 * Attributes:
 * show-24
 * Shows a 24 hour clock instead of the default 12 hour clock
 * 
 * CSS Variables
 * --base-color
 * The color of the base or background color. Default is rgb(48, 48, 48).
 * 
 * --line-on-color
 * The color of the digit number line when shown. Default is rgb(248, 248, 248).
 * 
 * --line-off-color
 * The color of the digit number line when it is not shown. Default is rgb(55, 55, 55).
 * 
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 */
class DigitalClock extends HTMLElement {
    /**
     * Static CSS constant.
     * @return {string} The CSS constant.
     */
    static get CSS() {
        return /*css*/`
        :host {
            display: inline-block;
        }
        .base {
            min-width: 20rem;
            min-height: 5rem;
            height: 100%;
            width: 100%;
            background-color: var(--base-color, rgb(48, 48, 48));
            display: grid;
            grid-template-columns: 4fr 4fr 1fr 4fr 4fr 2fr;
            grid-template-rows: 1fr;
            grid-column-gap: 0.5rem;
            padding: 0.5rem;
            box-sizing: border-box;
        }
        .base.show-24 {
            grid-template-columns: 4fr 4fr 1fr 4fr 4fr;
        }
        .digit {
            height: 100%;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            grid-template-rows: 1fr 2fr 1fr 2fr 1fr;
            grid-column-gap: 1px;
            grid-row-gap: 1px;
        }
        .digit-line-on {
            background-color: var(--line-on-color, rgb(248, 248, 248));
        }
        .digit-line-off {
            background-color: var(--line-off-color, rgb(55, 55, 55));
        }
        .digit-gap {
            background-color: var(--base-color, rgb(48, 48, 48));
        }
        .dots {      
            height: 100%;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 4fr 1fr 4fr 1fr;
            grid-column-gap: 1px;
            grid-row-gap: 1px;
        }
        .dot {
            background-color: var(--line-on-color, rgb(248, 248, 248));
            border-radius: 50%;
            aspect-ratio: 1 / 1;
            max-width: 80%;
            align-self: center;
            margin-left: 10%;
        }
        .ampm {
            height: 100%;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            grid-column-gap: 1px;
            grid-row-gap: 1px;
            font-family: "Lucida Console", Courier, monospace;
            font-size: 1em;
        }
        .ampm-parent {
            position: relative;
            width: 100%;
            height: 100%;
        }
        .ampm-child {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .ampm-on {
            color: var(--line-on-color, rgb(248, 248, 248));
        }
        .ampm-off {
            color: var(--line-off-color, rgb(55, 55, 55));
        }
        @keyframes blink {
            50% {
                opacity: 0.0;
            }
        }
        .blink {
            animation: blink 1s step-start 0s infinite;
        }`;
    }

    /**
     * Create a new DigitalClock object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({mode: 'open'});

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = DigitalClock.CSS;

        // Add styles
        this.shadowRoot.appendChild(style);

        // Bind update event to this
        this._update = this._update.bind(this);

        // Set not connected
        this._connected = false;
    }

    /**
     * Gets if we are showing the 24 hour clock (or the 12 hour clock).
     * @type {boolean}
     */
    get show24() {
        // If there is no show-24 attribute
        if (this.hasAttribute('show-24') === true) return true;

        // Otherwise it is showing the 12 hour clock
        return false;
    }

    /**
     * Sets if we are showing the 24 hour clock.
     * @param {boolean} value True to show 24 hour clock, False to show 12 hour clock.
     * @type {boolean}
     */
    set show24(value) {
        // If we want to show 24 hour clock
        if (value === true) {
            // Add the attribute
            this.setAttribute('show-24', '');
        } else {
            // Remove the attribute
            this.removeAttribute('show-24');
        }
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @param {string} name Then name of the attribute that has changed.
     * @param {string} oldValue The old value of the attribute before it was changed.
     * @param {string} newValue The new value the attribute is being changed to.
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If not connected
        if (this._connected === false) return;

        // Recreate and update clock
        this._create();
        this._update();
    }

    /**
     * Override the observedAttributes function to return the list
     * of attributes to monitor.
     * @return {Array} List of attribute names.
     * @static
     * @override
     */
    static get observedAttributes() {
        // Return the list of attributes
        return ['show-24'];
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Create parts
        this._create();

        // Update to the current time
        this._update();

        // Start clock
        this._timerId = setInterval(this._update, 1000);

        // Set connected
        this._connected = true;
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // If timer exists
        if (this.timerId) {
            // Clear timer
            clearInterval(this._timerId);

            // Remove timer id
            delete this._timerId;
        }

        // Set not connected
        this._connected = false;
    }

    /**
     * Create the DOM elements.
     * @private
     */
    _create() {
        // Set show 24
        let show24 = false;

        // If there is a show 24 attribute
        if (this.hasAttribute('show-24') === true) {
            // Set to show 24 hour clock
            show24 = true;
        }

        // Create base element
        const baseElement = document.createElement('div');

        // Set base class
        baseElement.classList.add('base');

        // Set base class
        if (show24 === true) baseElement.classList.add('show-24');

        // Create digit line element list
        this._digit = [4];
        this._digit[0] = {};
        this._digit[1] = {};
        this._digit[2] = {};
        this._digit[3] = {};

        // Create digit DOM elements
        const digit1DomElement = this._createDigit(0);
        const digit2DomElement = this._createDigit(1);
        const dotsDomElement = this._createDots();
        const digit3DomElement = this._createDigit(2);
        const digit4DomElement = this._createDigit(3);

        // Append DOM elements to the base element
        baseElement.appendChild(digit1DomElement);
        baseElement.appendChild(digit2DomElement);
        baseElement.appendChild(dotsDomElement);
        baseElement.appendChild(digit3DomElement);
        baseElement.appendChild(digit4DomElement);

        // If showing 12 hour clock
        if (show24 === false) {
            // Create AM PM DOM elements
            const ampmDomElement = this._createAmpm();

            // Append to the base element
            baseElement.appendChild(ampmDomElement);
        }

        // If there is a current base element
        if (this._baseElement) {
            // Remove current base element from shadow DOM
            this.shadowRoot.removeChild(this._baseElement);
        }

        // Set the new current base element
        this._baseElement = baseElement;

        // Add base element to shadow DOM
        this.shadowRoot.appendChild(this._baseElement);

        // If there is a current time then remove it
        if (this._currentTime) delete this._currentTime;
    }

    /**
     * Create the digit DOM elements.
     * @param {number} digitIndex The digit index to create (0 to 3).
     * @return {HTMLElement} Digit DOM element.
     */
    _createDigit(digitIndex) {
        // Set digit object
        const digit = this._digit[digitIndex];

        // Create line list
        digit.lineList = [];

        // Create digit DOM element
        const digitDomElement = document.createElement('div');

        // Set grid styles
        digitDomElement.style.gridRow = 1;
        digitDomElement.style.gridColumn = digit;

        // Set class
        digitDomElement.className = 'digit';

        // For each row
        for (let row = 1; row <= 5; row++) {
            // For each column
            for (let column = 1; column <= 3; column++) {
                // Create digit grid cell
                const digitGridCellDomElement = document.createElement('div');

                // Set styles
                digitGridCellDomElement.style.gridRow = row;
                digitGridCellDomElement.style.gridColumn = column;

                // If corner
                if (column === 1 && row === 1) digitGridCellDomElement.style.borderTopLeftRadius = '50%';
                if (column === 3 && row === 1) digitGridCellDomElement.style.borderTopRightRadius = '50%';
                if (column === 1 && row === 5) digitGridCellDomElement.style.borderBottomLeftRadius = '50%';
                if (column === 3 && row === 5) digitGridCellDomElement.style.borderBottomRightRadius = '50%';

                // Set class
                digitGridCellDomElement.className = 'digit-line-off';

                // If gaps
                if (column === 2 && (row === 2 || row === 4)) digitGridCellDomElement.className = 'digit-gap';

                // Append grid cell DOM element to digit DOM element
                digitDomElement.appendChild(digitGridCellDomElement);

                // Add to digit's line list
                digit.lineList.push(digitGridCellDomElement);
            }
        }

        // Return the digit DOM element
        return digitDomElement;
    }

    /**
     * Create the dot DOM elements.
     * @return {HTMLElement} Dots DOM element.
     */
    _createDots() {
        // Create dots DOM element
        const dotsDomElement = document.createElement('div');

        // Set grid styles
        dotsDomElement.style.gridRow = 1;
        dotsDomElement.style.gridColumn = 3;

        // Set class
        dotsDomElement.className = 'dots';

        // Create first dot DOM element
        const dot1DomElement = document.createElement('div');

        // Set grid styles
        dot1DomElement.style.gridRow = 2;
        dot1DomElement.style.gridColumn = 1;

        // Set class
        dot1DomElement.className = 'dot blink';

        // Create second dot DOM element
        const dot2DomElement = document.createElement('div');

        // Set grid styles
        dot2DomElement.style.gridRow = 4;
        dot2DomElement.style.gridColumn = 1;

        // Set class
        dot2DomElement.className = 'dot blink';

        // Append the first and second dot to the dots DOM element
        dotsDomElement.appendChild(dot1DomElement);
        dotsDomElement.appendChild(dot2DomElement);

        // Return the dots DOM element
        return dotsDomElement;
    }

    /**
     * Create the ampm DOM elements.
     * @return {HTMLElement} AMPM DOM element.
     */
    _createAmpm() {
        // Create ampm DOM element
        const ampmDomElement = document.createElement('div');

        // Set grid styles
        ampmDomElement.style.gridRow = 1;
        ampmDomElement.style.gridColumn = 6;

        // Set class
        ampmDomElement.className = 'ampm';

        // Create am DOM element
        const amDomElement = document.createElement('div');

        // Set grid styles
        amDomElement.style.gridRow = 1;
        amDomElement.style.gridColumn = 1;

        // Create am parent
        const amParentDomElement = document.createElement('div');

        // Set class
        amParentDomElement.className = 'ampm-parent';

        // Create am child
        this._amChildDomElement = document.createElement('div');

        // Set class
        this._amChildDomElement.className = 'ampm-child ampm-off';

        // Set AM inner text
        this._amChildDomElement.innerText = 'AM';

        // Add am parts together
        amParentDomElement.appendChild(this._amChildDomElement);
        amDomElement.appendChild(amParentDomElement);

        // Create pm DOM element
        const pmDomElement = document.createElement('div');

        // Set grid styles
        pmDomElement.style.gridRow = 2;
        pmDomElement.style.gridColumn = 1;

        // Create pm parent
        const pmParentDomElement = document.createElement('div');

        // Set class
        pmParentDomElement.className = 'ampm-parent';

        // Create pm child
        this._pmChildDomElement = document.createElement('div');

        // Set class
        this._pmChildDomElement.className = 'ampm-child ampm-off';

        // Set PM inner text
        this._pmChildDomElement.innerText = 'PM';

        // Add pm parts together
        pmParentDomElement.appendChild(this._pmChildDomElement);
        pmDomElement.appendChild(pmParentDomElement);

        // Append the am and pm elements to the ampm DOM element
        ampmDomElement.appendChild(amDomElement);
        ampmDomElement.appendChild(pmDomElement);

        // Return the am pm DOM element
        return ampmDomElement;
    }

    /**
     * Update the time shown.
     * @private
     */
    _update() {
        // Get time now
        const time = new Date();

        // If there is a current time
        if (this._currentTime) {
            // If nothing has changed then stop here
            if (this._currentTime.getHours() === time.getHours() && this._currentTime.getMinutes() === time.getMinutes()) return;
        }

        // Update current time
        this._currentTime = time;

        // Set show 24 hour clock
        let show24 = false;

        // If there is a show 24 attribute
        if (this.hasAttribute('show-24') === true) {
            // Set to show 24 hour clock
            show24 = true;
        }

        // Set hour
        let hour = time.getHours();

        // If showing 12 hour clock and over 12 hours
        if (show24 === false && hour > 12) {
            // Minus 12 hours
            hour -= 12;
        }

        // Set digit numbers
        let digit1Number = Math.floor(hour / 10);
        let minutes = time.getMinutes();
        const digit2Number = hour % 10;
        const digit3Number = Math.floor(minutes / 10);
        const digit4Number = minutes % 10;

        // If showing 12 hour clock and digit 1 number is zero
        if (show24 === false && digit1Number === 0) {
            // Set the digit 1 number so that it hides the number
            digit1Number = -1;
        }

        // Set the digit lines
        this._setDigitLines(this._digit[0], digit1Number);
        this._setDigitLines(this._digit[1], digit2Number);
        this._setDigitLines(this._digit[2], digit3Number);
        this._setDigitLines(this._digit[3], digit4Number);

        // If 12 hour clock shown
        if (show24 === false) {
            // If AM
            if (this._currentTime.hour < 12) {
                // Show AM
                this._amChildDomElement.className = 'ampm-child ampm-on';
                this._pmChildDomElement.className = 'ampm-child ampm-off';
            } else {
                // Show PM
                this._amChildDomElement.className = 'ampm-child ampm-off';
                this._pmChildDomElement.className = 'ampm-child ampm-on';
            }
        }
    }

    /**
     * Set the digit lines for the given number.
     * @param {object} digit The digit we want to set the number to.
     * @param {number} digitNumber The number to set the digit to.
     * @private
     */
    _setDigitLines(digit, digitNumber) {
        // Get digit number switch list
        const numberSwitchList = DigitalClock._getNumberSwitchList(digitNumber);

        // For each digit line
        for (let index = 0; index < 15; index++) {
            // If one of the gaps
            if (index === 4 || index === 10) continue;

            // Get digit grid cell DOM element
            const digitGridCellDomElement = digit.lineList[index];

            // If line is on
            if (numberSwitchList[index] === true) {
                // Set class to turn the line on
                digitGridCellDomElement.className = 'digit-line-on';
            } else {
                // Set class to turn the line off
                digitGridCellDomElement.className = 'digit-line-off';
            }
        }
    }

    /**
     * Get the parts of a digit that should be on or off depending on the number.
     * @param {number} number The number 0-9 to get the digit switch list for. The value -1 means blank all lines.
     * @return {boolean[]} The list of digit switch parts to be on or off.
     * @private
     * @static
     */
    static _getNumberSwitchList(number) {
        // Check numbers
        if (number === -1) return [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        if (number === 0) return [true, true, true, true, false, true, true, false, true, true, false, true, true, true, true];
        if (number === 1) return [false, false, true, false, false, true, false, false, true, false, false, true, false, false, true];
        if (number === 2) return [true, true, true, false, false, true, true, true, true, true, false, false, true, true, true];
        if (number === 3) return [true, true, true, false, false, true, false, true, true, false, false, true, true, true, true];
        if (number === 4) return [true, false, true, true, false, true, true, true, true, false, false, true, false, false, true];
        if (number === 5) return [true, true, true, true, false, false, true, true, true, false, false, true, true, true, true];
        if (number === 6) return [true, true, true, true, false, false, true, true, true, true, false, true, true, true, true];
        if (number === 7) return [true, true, true, false, false, true, false, false, true, false, false, true, false, false, true];
        if (number === 8) return [true, true, true, true, false, true, true, true, true, true, false, true, true, true, true];
        if (number === 9) return [true, true, true, true, false, true, true, true, true, false, false, true, true, true, true];
    }
}

// Tell the browser about the new tag and the class it is linked to
customElements.define('digital-clock', DigitalClock);
