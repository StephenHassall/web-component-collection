/**
 * Color picker web component.
 * 
 * @classdesc
 * Shows a color picker and allows the user to change the red, green, blue and alpha parts of a color.
 * 
 * Attributes:
 * value
 * The color value in #RRGGBBAA format.
 * 
 * @version: 0.2
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 */
class ColorPicker extends HTMLElement {
    /**
     * Static CSS constant.
     * @return {string} The CSS constant.
     */
    static get CSS() {
        return /*css*/`
        :host {
            display: block;
        }

        .base {
            height: 100%;
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 3fr;
            grid-template-rows: 6fr 1fr 1fr 2fr;
            padding: 5px;
            box-sizing: border-box;
            gap: 0.75rem;
            touch-action: none;
        }

        #map {
            grid-column: 1 / span 2;
            grid-row: 1;
            position: relative;
            border-radius: 0.5rem;
            box-shadow: 0 0 5px rgb(0 0 0 / 50%);
        }

        .map-base {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 0;
            border-radius: 0.5rem;
            pointer-events: none;
        }

        .map-light {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 100%);
            z-index: 1;
            border-radius: 0.5rem;
            pointer-events: none;
        }

        .map-dark {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, black 100%);
            z-index: 2;
            border-radius: 0.5rem;
            pointer-events: none;
        }

        #map-color {
            position: absolute;
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 0.5rem;
            box-sizing: border-box;
            z-index: 3;
            cursor: move;
            box-shadow: 0 0 1px 2px black, 0 0 0 4px white, 0 0 3px 6px black;     
        }

        .preview {
            position: relative;
            grid-column: 1;
            grid-row: 2 / span 2;
        }

        .preview-base {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            border-radius: 0.5rem;
            background-color: #ffffff;
            background-image: 
                repeating-linear-gradient(
                    45deg,
                    rgba(211, 211, 211, 1) 25%,
                    transparent 25%,
                    transparent 75%,
                    rgba(211, 211, 211, 1) 75%,
                    rgba(211, 211, 211, 1)),
                repeating-linear-gradient(
                    45deg,
                    rgba(211, 211, 211, 1) 25%,
                    #ffffff 25%,
                    #ffffff 75%,
                    rgba(211, 211, 211, 1) 75%,
                    rgba(211, 211, 211, 1));
            background-position: 0 0, 0.5rem 0.5rem;
            background-size: 1rem 1rem;
            box-shadow: 0 0 3px rgb(0 0 0 / 50%);
        }

        #preview-color {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            border-radius: 0.5rem;
        }

        #slider {
            grid-column: 2;
            grid-row: 2;
            position: relative;
            background: linear-gradient(
                to right,
                hsl(0deg 100% 50%) 0%,
                hsl(36deg 100% 50%) 10%,
                hsl(72deg 100% 50%) 20%,
                hsl(108deg 100% 50%) 30%,
                hsl(144deg 100% 50%) 40%,
                hsl(180deg 100% 50%) 50%,
                hsl(216deg 100% 50%) 60%,
                hsl(252deg 100% 50%) 70%,
                hsl(288deg 100% 50%) 80%,
                hsl(324deg 100% 50%) 90%,
                hsl(360deg 100% 50%) 100%
            );
            border-radius: 0.5rem;
            box-shadow: 0 0 3px rgb(0 0 0 / 50%);
        }

        #slider-color {
            position: absolute;
            width: 0.5rem;
            height: 100%;
            border-radius: 0.5rem;
            box-sizing: border-box;
            cursor: ew-resize;
            box-shadow: 0 0 1px 2px black, 0 0 0 4px white, 0 0 3px 6px black;
        }

        #alpha {
            grid-column: 2;
            grid-row: 3;
            position: relative;
            border-radius: 0.5rem;
        }

        .alpha-base {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: #ffffff;
            background-image: 
                repeating-linear-gradient(
                    45deg,
                    rgba(211, 211, 211, 1) 25%,
                    transparent 25%,
                    transparent 75%,
                    rgba(211, 211, 211, 1) 75%,
                    rgba(211, 211, 211, 1)),
                repeating-linear-gradient(
                    45deg,
                    rgba(211, 211, 211, 1) 25%,
                    #ffffff 25%,
                    #ffffff 75%,
                    rgba(211, 211, 211, 1) 75%,
                    rgba(211, 211, 211, 1));
            background-position: 0 0, 0.5rem 0.5rem;
            background-size: 1rem 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 0 3px rgb(0 0 0 / 50%);
            pointer-events: none;
            z-index: 0;
        }

        .alpha-scale {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            border-radius: 0.5rem;
            pointer-events: none;
            z-index: 1;
        }

        #alpha-color {
            position: absolute;
            width: 0.5rem;
            height: 100%;
            border-radius: 0.5rem;
            box-sizing: border-box;
            cursor: ew-resize;
            box-shadow: 0 0 1px 2px black, 0 0 0 4px white, 0 0 3px 6px black;
            z-index: 2;
        }

        #inputs input[type="text"] {
            border-radius: 0;
            outline: none;
            border: 2px solid gray;
            font-size: inherit;
        }

        #inputs input:focus-visible {
            border: 2px solid #2d95f2;
            box-shadow: 0 0 3px rgb(0 0 0 / 50%);
        }

        #inputs {
            grid-column: 1 / span 2;
            grid-row: 4;
            display: grid;
            grid-template-columns: 1fr 3rem;
            grid-template-rows: 1fr 1fr;
            align-items: center;
            justify-items: center;            
        }

        #rgba {
            grid-column: 1;
            grid-row: 1;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            gap: 0.5rem;
        }

        #rgba > input {
            text-align: center;
            width: 100%;
            padding: 0;
            margin: 0;
            border: 2px solid gray;
            box-sizing: border-box;
        }

        #hsla {
            grid-column: 1;
            grid-row: 1;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            gap: 0.5rem;
        }

        #hsla > input {
            text-align: center;
            width: 100%;
            padding: 0;
            margin: 0;
            border: 2px solid gray;
            box-sizing: border-box;
        }

        #hex {
            grid-column: 1;
            grid-row: 1;
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            gap: 0.5rem;
        }

        #hex > input {
            text-align: center;
            width: 100%;
            padding: 0;
            margin: 0;
            border: 2px solid gray;
            box-sizing: border-box;
        }

        .label {
            grid-column: 1;
            grid-row: 2;
            width: 100%;
            height: 100%;
            display: grid;
            align-items: center;
            justify-items: center;
            font-size: 120%;
            color: gray;
            font-weight: bold;
            user-select: none;
        }

        #hsla-label {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            gap: 0.5rem;
        }

        #rgba-label {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr;
            gap: 0.5rem;
        }

        #hex-label {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
        }

        #scroll {
            grid-column: 2;
            grid-row: 1;
            width: 2rem;
            height: 2rem;
            fill: gray;
            cursor: pointer;
        }
        
        #scroll:focus-visible {
            outline-style: dashed;
            outline-width: 2px;
            outline-offset: 2px;
            outline-color: gray;
        }
        `;
    }

    /**
     * Static HTML constant.
     * @return {string} The HTML constant.
     */
    static get HTML() {
        return /*html*/`
        <div class="base" aria-label="color picker">
            <div id="map">
                <div class="map-base"></div>
                <div class="map-light"></div>
                <div class="map-dark"></div>
                <div id="map-color"></div>
            </div>
            <div class="preview">
                <div class="preview-base"></div>
                <div id="preview-color"></div>
            </div>
            <div id="slider">
                <div id="slider-color"></div>
            </div>
            <div id="alpha">
                <div class="alpha-base"></div>
                <div class="alpha-scale"></div>
                <div id="alpha-color"></div>
            </div>
            <div id="inputs">
                <div id="hsla">
                    <input id="hsla-h" type="text" spellcheck="false" autocomplete="off" aria-label="hue">
                    <input id="hsla-s" type="text" spellcheck="false" autocomplete="off" aria-label="saturation">
                    <input id="hsla-l" type="text" spellcheck="false" autocomplete="off" aria-label="lightness">
                    <input id="hsla-a" type="text" spellcheck="false" autocomplete="off" aria-label="transparency">
                </div>
                <div id="rgba">
                    <input id="rgba-r" type="text" spellcheck="false" autocomplete="off" aria-label="red">
                    <input id="rgba-g" type="text" spellcheck="false" autocomplete="off" aria-label="green">
                    <input id="rgba-b" type="text" spellcheck="false" autocomplete="off" aria-label="blue">
                    <input id="rgba-a" type="text" spellcheck="false" autocomplete="off" aria-label="transparency">
                </div>
                <div id="hex">
                    <input id="hex-color" type="text" spellcheck="false" autocomplete="off" aria-label="hex color value">
                </div>
                <div id="scroll" tabindex="0" aria-label="switch color input mode"></div>
                <div id="hsla-label" class="label" aria-hidden="true">
                    <div>H</div>
                    <div>S</div>
                    <div>L</div>
                    <div>A</div>
                </div>
                <div id="rgba-label" class="label" aria-hidden="true">
                    <div>R</div>
                    <div>G</div>
                    <div>B</div>
                    <div>A</div>
                </div>
                <div id="hex-label" class="label" aria-hidden="true">
                    <div>HEX #RRGGBBAA</div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Static scroll HTML SVG.
     */
    static get scrollHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path d="
                m 0.42609008,8.1559417 a 1,1 0 0 0 0.28125,0.5507812 L 5.5862463,13.585629 A 0.82842712,0.82842712 0 0 0 7.0003088,12.999692 V 2.9996917 
                A 0.82842712,0.82842712 0 0 0 5.5862463,2.4137537 L 0.70734008,7.2926605 a 1,1 0 0 0 -0.28125,0.8632812 z M 9.0003088,12.999692
                a 0.82842712,0.82842712 0 0 0 1.4140622,0.585937 l 4.878907,-4.8789061 a 1,1 0 0 0 0,-1.4140624 L 10.414371,2.4137537 a 0.82842712,0.82842712 0 0 0 -1.4140622,0.585938 z">
            </path>
        </svg>`;
    }

    /**
     * Create a new DigitalClock object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({ mode: 'open' });

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = ColorPicker.HTML;

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = ColorPicker.CSS;

        // Insert shadow DOM's styles
        this.shadowRoot.prepend(style);

        // Set default color parts
        this._red = 0;
        this._green = 0;
        this._blue = 0;
        this._hue = 0;
        this._saturation = 0;
        this._lightness = 0;
        this._alpha = 1;
        this._hex = '';

        // Get color elements
        this._mapElement = this.shadowRoot.getElementById('map');
        this._mapBaseElement = this.shadowRoot.querySelector('.map-base');
        this._mapColorElement = this.shadowRoot.getElementById('map-color');
        this._sliderElement = this.shadowRoot.getElementById('slider');
        this._sliderColorElement = this.shadowRoot.getElementById('slider-color');
        this._alphaElement = this.shadowRoot.getElementById('alpha');
        this._alphaScaleElement = this.shadowRoot.querySelector('.alpha-scale');
        this._alphaColorElement = this.shadowRoot.getElementById('alpha-color');
        this._previewColorElement = this.shadowRoot.getElementById('preview-color');

        // Get input elements
        this._hslaElement = this.shadowRoot.getElementById('hsla');
        this._rgbaElement = this.shadowRoot.getElementById('rgba');
        this._hexElement = this.shadowRoot.getElementById('hex');
        this._scrollElement = this.shadowRoot.getElementById('scroll');
        this._hsla_hElement = this.shadowRoot.getElementById('hsla-h');
        this._hsla_sElement = this.shadowRoot.getElementById('hsla-s');
        this._hsla_lElement = this.shadowRoot.getElementById('hsla-l');
        this._hsla_aElement = this.shadowRoot.getElementById('hsla-a');
        this._rgba_rElement = this.shadowRoot.getElementById('rgba-r');
        this._rgba_gElement = this.shadowRoot.getElementById('rgba-g');
        this._rgba_bElement = this.shadowRoot.getElementById('rgba-b');
        this._rgba_aElement = this.shadowRoot.getElementById('rgba-a');
        this._hexColorElement = this.shadowRoot.getElementById('hex-color');
        this._hslaLabelElement = this.shadowRoot.getElementById('hsla-label');
        this._rgbaLabelElement = this.shadowRoot.getElementById('rgba-label');
        this._hexLabelElement = this.shadowRoot.getElementById('hex-label');

        // Set SVG parts
        this._scrollElement.innerHTML = ColorPicker.scrollHtml;

        // Set pointer event function binding to this
        this._pointerUpEvent = this._pointerUpEvent.bind(this);
        this._pointerDownEvent = this._pointerDownEvent.bind(this);
        this._pointerMoveEvent = this._pointerMoveEvent.bind(this);

        // Set other event function bindings
        this._scrollClickEvent = this._scrollClickEvent.bind(this);
        this._inputBeforeInputEvent = this._inputBeforeInputEvent.bind(this);
        this._inputInputEvent = this._inputInputEvent.bind(this);
        this._scrollKeypressEvent = this._scrollKeypressEvent.bind(this);

        // Set pointer event details
        this._pointerMoveType = 'none';

        // Set not connected
        this._connected = false;
    }

    /**
     * Gets the current color value.
     * @type {String} The color value in #RRGGBBAA format.
     */
    get value() {
        // Return the color hex value
        return this._hex;
    }

    /**
     * Sets the current color value.
     * @param {String} value The color value in #RRGGBBAA format.
     * @type {String}
     */
    set value(value) {
        // Set the attribute to the value
        this.setAttribute('value', value);
    }

    /**
     * Gets the current red color part.
     */
    get red() {
        // Return the current red value
        return this._red;
    }

    /**
     * Gets the current green color part.
     */
    get green() {
        // Return the current green value
        return this._green;
    }

    /**
     * Gets the current blue color part.
     */
    get blue() {
        // Return the current blue value
        return this._blue;
    }

    /**
     * Gets the current hue color part.
     */
    get hue() {
        // Return the current hue value
        return this._hue;
    }

    /**
     * Gets the current saturation color part.
     */
    get saturation() {
        // Return the current saturation value
        return this._saturation;
    }

    /**
     * Gets the current lightness color part.
     */
    get lightness() {
        // Return the current lightness value
        return this._lightness;
    }

    /**
     * Gets the current alpha color part.
     */
    get alpha() {
        // Return the current alpha value
        return this._alpha;
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Set connected
        this._connected = true;

        // Add pointer events
        this._addPointerEvents(this._mapElement);
        this._addPointerEvents(this._mapColorElement);
        this._addPointerEvents(this._sliderElement);
        this._addPointerEvents(this._sliderColorElement);
        this._addPointerEvents(this._alphaElement);
        this._addPointerEvents(this._alphaColorElement);

        // Add input events
        this._addInputEvents(this._hsla_hElement);
        this._addInputEvents(this._hsla_sElement);
        this._addInputEvents(this._hsla_lElement);
        this._addInputEvents(this._hsla_aElement);
        this._addInputEvents(this._rgba_rElement);
        this._addInputEvents(this._rgba_gElement);
        this._addInputEvents(this._rgba_bElement);
        this._addInputEvents(this._rgba_aElement);
        this._addInputEvents(this._hexColorElement);

        // Add scroll events
        this._scrollElement.addEventListener('click', this._scrollClickEvent);
        this._scrollElement.addEventListener('keypress', this._scrollKeypressEvent);

        // If nothing set yet then set default
        if (!this._hex) this._hex = '#000000FF';

        // If the current input mode is not set yet then set it to the default (1=HSLA, 2=RBGA, 3=HEX)
        if (!ColorPicker._inputMode) ColorPicker._inputMode = 2;

        // Convert from hex to RBGA
        this._convertHexToRgba();

        // Convert from RGB to HSL
        this._convertRgbToHsl();

        // Update colors
        this._updateColors();

        // Update inputs
        this._updateInputs();

        // Update the input labels
        this._updateLabels();

        // Update sliders
        this._updateSliders();
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove pointer events
        this._removePointerEvents(this._mapElement);
        this._removePointerEvents(this._mapColorElement);
        this._removePointerEvents(this._sliderElement);
        this._removePointerEvents(this._sliderColorElement);
        this._removePointerEvents(this._alphaElement);
        this._removePointerEvents(this._alphaColorElement);

        // Add input events
        this._removeInputEvents(this._hsla_hElement);
        this._removeInputEvents(this._hsla_sElement);
        this._removeInputEvents(this._hsla_lElement);
        this._removeInputEvents(this._hsla_aElement);
        this._removeInputEvents(this._rgba_rElement);
        this._removeInputEvents(this._rgba_gElement);
        this._removeInputEvents(this._rgba_bElement);
        this._removeInputEvents(this._rgba_aElement);
        this._removeInputEvents(this._hexColorElement);

        // Remove scroll events
        this._scrollElement.removeEventListener('click', this._scrollClickEvent);
        this._scrollElement.removeEventListener('keypress', this._scrollKeypressEvent);

        // Set not connected
        this._connected = false;
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @param {string} name Then name of the attribute that has changed.
     * @param {string} oldValue The old value of the attribute before it was changed.
     * @param {string} newValue The new value the attribute is being changed to.
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If this is an internal attribute adjustment
        if (this._internalAttributeAdjustment === true) return;

        // If not a valid hex
        if (this._validHex(newValue) === false) {
            // If the value is empty then set default
            if (newValue.length === 0) newValue = '#000000FF';
        }

        // Set hex
        this._hex = newValue;

        // If not connected
        if (this._connected === false) return;

        // Convert from hex to RBGA
        this._convertHexToRgba();

        // Convert from RGB to HSL
        this._convertRgbToHsl();

        // Update colors
        this._updateColors();

        // Update inputs
        this._updateInputs();

        // Update the input labels
        this._updateLabels();

        // We may need to wait for the component to be shown before setting the slidders
        setTimeout(() => {
            // Update sliders
            this._updateSliders();        
        });
    
        // Update sliders
        this._updateSliders();        
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
        return ['value'];
    }

    /**
     * Focus function. This overrides the element's default focus function. The color picker itself cannot be focused
     * by if you want it to be given the focus then it needs to give it to the first input, which is the red input.
     */
    focus() {
        // Give the red input the focus
        this._rgba_rElement.focus();
    }

    /**
     * Add the pointer events.
     * @param {HTMLElement} element The element to add the pointer events to.
     */
    _addPointerEvents(element) {
        // Add pointer events
        element.addEventListener('pointerdown', this._pointerDownEvent);
        element.addEventListener('pointerup', this._pointerUpEvent);
        element.addEventListener('pointermove', this._pointerMoveEvent);
    }

    /**
     * Remove the pointer events.
     * @param {HTMLElement} element The element to remove the pointer events to.
     */
    _removePointerEvents(element) {
        // Remove pointer events
        element.removeEventListener('pointerdown', this._pointerDownEvent);
        element.removeEventListener('pointerup', this._pointerUpEvent);
        element.removeEventListener('pointermove', this._pointerMoveEvent);
    }

    /**
     * Add input events for the given input element.
     * @param {HTMLElement} element The input element we want to add the events to.
     */
    _addInputEvents(element) {
        // Add events
        element.addEventListener('beforeinput', this._inputBeforeInputEvent);
        element.addEventListener('input', this._inputInputEvent);
    }

    /**
     * Remove input events for the given input element.
     * @param {HTMLElement} element The input element we want to remove the events from.
     */
    _removeInputEvents(element) {
        // Remove events
        element.removeEventListener('beforeinput', this._inputBeforeInputEvent);
        element.removeEventListener('input', this._inputInputEvent);
    }

    /**
     * Pointer down event.
     * @param {object} event The pointer down event data.
     */
    _pointerDownEvent(event) {
        // Set to capture all pointer movements (even outside target element)
        event.target.setPointerCapture(event.pointerId);

        // Set pointer move type
        this._pointerMoveType = event.target.id;

        // If map
        if (this._pointerMoveType === 'map') {
            // Process the pointer event
            this._processPointerEvent(event.clientX, event.clientY, this._mapElement, this._mapColorElement);
        }

        // If slider
        if (this._pointerMoveType === 'slider') {
            // Process the pointer event
            this._processPointerEvent(event.clientX, event.clientY, this._sliderElement, this._sliderColorElement);
        }

        // If alpha
        if (this._pointerMoveType === 'alpha') {
            // Process the pointer event
            this._processPointerEvent(event.clientX, event.clientY, this._alphaElement, this._alphaColorElement);
        }
    }

    /**
     * Pointer up event.
     * @param {object} event The pointer up event data.
     */
    _pointerUpEvent(event) {
        // Stop capturing the pointer movements
        event.target.releasePointerCapture(event.pointerId);

        // Set no longer moving
        this._pointerMoveType = 'none';

        // Update value attribute
        this._updateValueAttribute();

        // Create change event
        const changeEvent = new CustomEvent('change');

        // Dispatch the event
        this.dispatchEvent(changeEvent);
    }

    /**
     * Pointer move event.
     * @param {object} event The pointer move event data.
     */
    _pointerMoveEvent(event) {
        // If no pointer move type set
        if (this._pointerMoveType === 'none') return;

        // If map related
        if (this._pointerMoveType === 'map' || this._pointerMoveType === 'map-color') {
            // Process the pointer event
            this._processPointerEvent(event.clientX, event.clientY, this._mapElement, this._mapColorElement);
        }

        // If slider related
        if (this._pointerMoveType === 'slider' || this._pointerMoveType === 'slider-color') {
            // Process the pointer event
            this._processPointerEvent(event.clientX, event.clientY, this._sliderElement, this._sliderColorElement);
        }

        // If alpha related
        if (this._pointerMoveType === 'alpha' || this._pointerMoveType === 'alpha-color') {
            // Process the pointer event
            this._processPointerEvent(event.clientX, event.clientY, this._alphaElement, this._alphaColorElement);
        }
    }

    /**
     * Process pointer event.
     * @param 
     */
    _processPointerEvent(clientX, clientY, element, sliderElement) {
        // Get element's rect
        const elementRect = element.getBoundingClientRect();

        // Set pointer X and Y parts in relation to the element
        let relativeX = clientX - elementRect.left;
        let relativeY = clientY - elementRect.top;

        // Set limits
        const minLimitX = (sliderElement.clientWidth + 9) / 2;
        const maxLimitX = element.clientWidth - ((sliderElement.clientWidth + 9) / 2);
        const minLimitY = (sliderElement.clientHeight + 9) / 2;
        const maxLimitY = element.clientHeight - ((sliderElement.clientHeight + 9) / 2);

        // Set range
        const rangeX = maxLimitX - minLimitX;
        const rangeY = maxLimitY - minLimitY;

        // Check limits
        if (relativeX < minLimitX) relativeX = minLimitX;
        if (relativeX > maxLimitX) relativeX = maxLimitX;
        if (relativeY < minLimitY) relativeY = minLimitY;
        if (relativeY > maxLimitY) relativeY = maxLimitY;

        // Set percentage moved (0 to 1)
        const percentageX = (relativeX - minLimitX) / rangeX;
        const percentageY = (relativeY - minLimitY) / rangeY;

        // Set width and height of element that moved
        let movedElementWidth = sliderElement.clientWidth;
        let movedElementHeight = sliderElement.clientHeight;

        // Workout the left and right parts
        const left = relativeX - (movedElementWidth / 2);
        const top = relativeY - (movedElementHeight / 2);

        // If pointer move type is map color or map
        if (this._pointerMoveType === 'map' || this._pointerMoveType === 'map-color') {
            // Set the left and top parts
            this._mapColorElement.style.left = left.toString() + 'px';
            this._mapColorElement.style.top = top.toString() + 'px';

            // Set HSV values to get lightness
            const hsvValue = 1 - percentageY;
            const hsvSaturation = percentageX;
            const lightness = (hsvValue / 2) * (2 - hsvSaturation);
            let saturation = 0;
            const delta = 1 - Math.abs(2 * lightness - 1);
            if (delta !== 0) {
                saturation = (hsvValue * hsvSaturation) / delta;
            }

            // Set lightness
            this._lightness = lightness * 100;

            // Set saturation
            this._saturation = saturation * 100;
        }

        // If pointer move type is slider color
        if (this._pointerMoveType === 'slider' || this._pointerMoveType === 'slider-color') {
            // Set the left part
            this._sliderColorElement.style.left = left.toString() + 'px';
            
            // Set hue
            this._hue = percentageX * 360;
        }

        // If pointer move type is alpha color
        if (this._pointerMoveType === 'alpha' || this._pointerMoveType === 'alpha-color') {
            // Set the left part
            this._alphaColorElement.style.left = left.toString() + 'px';
            
            // Set alpha
            this._alpha = percentageX;
        }

        // Convert the HSL color parts into RGB
        this._convertHslToRgb();

        // Convert the RGB color parts into hex
        this._convertRgbaToHex();

        // Update colors
        this._updateColors();

        // Update inputs
        this._updateInputs();
    }

    /**
     * Scroll click event.
     */
    _scrollClickEvent() {
        // Cycle the input mode
        if (ColorPicker._inputMode === 1) ColorPicker._inputMode = 2;
        else if (ColorPicker._inputMode === 2) ColorPicker._inputMode = 3;
        else if (ColorPicker._inputMode === 3) ColorPicker._inputMode = 1;

        // Update the input labels
        this._updateLabels();
    }

    /**
     * Scroll keypress event.
     */
    _scrollKeypressEvent(event) {
        // Cycle the input mode
        if (ColorPicker._inputMode === 1) ColorPicker._inputMode = 2;
        else if (ColorPicker._inputMode === 2) ColorPicker._inputMode = 3;
        else if (ColorPicker._inputMode === 3) ColorPicker._inputMode = 1;

        // Update the input labels
        this._updateLabels();

        // Stop the normal keypress event
        event.preventDefault();
    }

    /**
     * Input before input event. Something was typed into one of the color inputs.
     * @param {Object} event Information about the input event.
     */
    _inputBeforeInputEvent(event) {
        // Set valid
        let valid = true;

        // Set what the final text would look like
        let text = event.target.value;

        // If input type is insertText or insertFromPaste
        if (event.inputType === 'insertText' || event.inputType === 'insertFromPaste' ) {
            // Set the text
            text = 
                event.target.value.substring(0, event.target.selectionStart) +
                event.data +
                event.target.value.substring(event.target.selectionEnd);
        }

        // Else if input type is deleteContentForward
        else if (event.inputType === 'deleteContentForward') {
            // Set the text
            text =
                event.target.value.substring(0, event.target.selectionStart) +
                event.target.value.substring(event.target.selectionEnd + 1);
        }

        // Else if input type is deleteContentBackward
        else if (event.inputType === 'deleteContentBackward') {
            // Set the text
            text =
                event.target.value.substring(0, event.target.selectionStart - 1) +
                event.target.value.substring(event.target.selectionEnd);
        }
        
        // Else something it odd, so do not allow it
        else {
            // Stop the character being entered
            event.preventDefault();

            // Stop here
            return;
        }

        // If hex color
        if (event.target.id === 'hex-color') {
            // If not starting with # character
            if (text.startsWith('#') === false) valid = false;

            // Else if too long
            else if (text.length > 9) valid = false;

            // Else check other characters are hex values
            else {
                // For each other character
                for (let index = 1; index < text.length; index++) {
                    // Get character
                    const character = text.charAt(index);

                    // If valid hex
                    if (character >= '0' && character <= '9') continue;
                    if (character >= 'a' && character <= 'f') continue;
                    if (character >= 'A' && character <= 'F') continue;

                    // Set not valid and stop looking
                    valid = false;
                    break;
                }
            }
        } else if (event.target.id.endsWith('a') === true) {
            // Else if alpha

            // If only 1 character long then it must be either 0 or 1
            if (text.length === 1 && text !== '0' && text !== '1') valid = false;

            // If 2 characters long then it must be either 0. or 1.
            if (text.length === 2 && text.startsWith('0.') === false && text.startsWith('1.') === false) valid = false;

            // If 3 or 4 character long
            if (text.length === 3 || text.length === 4) {
                // Must start with either 0. or 1.
                if (text.startsWith('0.') === false && text.startsWith('1.') === false) valid = false;

                // Check the next character is a number
                let character = text.charAt(2);
                if (character < '0' || character > '9') valid = false;

                // If there is a fourth character then check it is a number
                if (text.length === 4) {
                    character = text.charAt(2);
                    if (character < '0' || character > '9') valid = false;    
                }
            }
            if (text.length > 4) valid = false;
        } else if (event.target.id.startsWith('rgba') === true) {
            // Else if RGB

            // If not a valid 0 to 255 number
            if (this._validNumber(text, 255) === false) valid = false;
        } else if (event.target.id === 'hsla-h') {
            // Else if HSLA hue

            // If not a valid 0 to 360 number
            if (this._validNumber(text, 360) === false) valid = false;
        } else {
            // Else it is HSLA saturation and lightness

            // If not a valid 0 to 100 number
            if (this._validNumber(text, 100) === false) valid = false;
        }

        // If valid input then stop here
        if (valid === true) return;

        // Stop the character being entered
        event.preventDefault();
    }

    /**
     * Input input event. One of the inputs has been changed.
     * @param {Object} event Information about the input event.
     */
    _inputInputEvent(event) {
        // If rgba input
        if (event.target.id.startsWith('rgba') === true) {
            // Update the red, green and blue values from the changed inputted one
            if (event.target.id === 'rgba-r') this._red = parseInt(this._rgba_rElement.value);
            if (event.target.id === 'rgba-g') this._green = parseInt(this._rgba_gElement.value);
            if (event.target.id === 'rgba-b') this._blue = parseInt(this._rgba_bElement.value);
        }

        // If hsla input
        if (event.target.id.startsWith('hsla') === true) {
            // Update the hue, saturation and lightness values from the changed inputted one
            if (event.target.id === 'hsla-h') this._hue = parseInt(this._hsla_hElement.value);
            if (event.target.id === 'hsla-s') this._saturation = parseInt(this._hsla_sElement.value);
            if (event.target.id === 'hsla-l') this._lightness = parseInt(this._hsla_lElement.value);
        }

        // If alpha
        if (event.target.id === 'rgba-a') {
            // Get alpha value
            this._alpha = parseFloat(this._rgba_aElement.value);

            // Reset other alpha input
            this._hsla_aElement.value = this._rgba_aElement.value;
        }
        if (event.target.id === 'hsla-a') {
            // Get alpha value
            this._alpha = parseFloat(this._hsla_aElement.value);

            // Reset other alpha input
            this._rgba_aElement.value = this._hsla_aElement.value;
        }

        // If hex
        if (event.target.id === 'hex-color') {
            // If not valid
            if (this._hexColorElement.value.length !== 9) return;

            // Set hex value
            this._hex = this._hexColorElement.value;
        }

        // If RGB
        if (event.target.id.startsWith('rgba') === true) {
            // Convert to HSLA
            this._convertRgbToHsl();

            // Convert to hex
            this._convertRgbaToHex();

            // Update other inputs
            this._hsla_hElement.value = this._hue.toFixed(0);
            this._hsla_sElement.value = this._saturation.toFixed(0);
            this._hsla_lElement.value = this._lightness.toFixed(0);
            this._hexColorElement.value = this._hex;
        }

        // If HSL
        if (event.target.id.startsWith('hsla') === true) {
            // Convert to RGB
            this._convertHslToRgb();

            // Convert to hex
            this._convertRgbaToHex();

            // Update other inputs
            this._rgba_rElement.value = this._red.toFixed(0);
            this._rgba_gElement.value = this._green.toFixed(0);
            this._rgba_bElement.value = this._blue.toFixed(0);    
            this._hexColorElement.value = this._hex;
        }

        // If hex
        if (event.target.id === 'hex-color') {
            // Convert to RGB
            this._convertHexToRgba();

            // Convert to HSLA
            this._convertRgbToHsl();

            // Update other inputs
            this._hsla_hElement.value = this._hue.toFixed(0);
            this._hsla_sElement.value = this._saturation.toFixed(0);
            this._hsla_lElement.value = this._lightness.toFixed(0);
            this._hsla_aElement.value = this._alpha.toFixed(2);
            this._rgba_rElement.value = this._red.toFixed(0);
            this._rgba_gElement.value = this._green.toFixed(0);
            this._rgba_bElement.value = this._blue.toFixed(0);    
            this._rgba_aElement.value = this._alpha.toFixed(2);
        }

        // Update colors
        this._updateColors();

        // Update sliders
        this._updateSliders();

        // Update value attribute
        this._updateValueAttribute();

        // Create change event
        const changeEvent = new CustomEvent('change');

        // Dispatch the event
        this.dispatchEvent(changeEvent);
    }

    /**
     * Checks to see if the given text is a valid hex color. The format must be #RRGGBBAA
     * @param {String} text The hex text to check.
     * @return {Boolean} True if the text is valid, otherwise false.
     */
    _validHex(text) {
        // If not 9 characters long
        if (text.length !== 9) return false;

        // If not starting with #
        if (text.startsWith('#') === false) return false;

        // For each other character
        for (let index = 1; index < text.length; index++) {
            // Get character
            const character = text.charAt(index);

            // If valid hex
            if (character >= '0' && character <= '9') continue;
            if (character >= 'a' && character <= 'f') continue;
            if (character >= 'A' && character <= 'F') continue;

            // Return not valid
            return false;
        }

        // Return valid
        return true;
    }

    /**
     * Checks to see if the given text value of a number, is a valid number and under the given limit.
     * @param {String} text The numeric value as text to check.
     * @param {Number} max The maximum value the number must be below.
     * @return {Boolean} True if the number is valid, otherwise false.
     */
    _validNumber(text, max) {
        // If more than one character long
        if (text.length > 1) {
            // If starts with '0' then not valid
            if (text.startsWith('0') === true) return false;
        }

        // For each character
        for (let index = 0; index < text.length; index++) {
            // Get character
            const character = text.charAt(index);

            // If valid number
            if (character >= '0' && character <= '9') continue;

            // Return not valid
            return false;
        }

        // Convert into a number
        let number = parseInt(text);

        // If the number is over the maximum amount
        if (number > max) return false;

        // Return a valid integer
        return true;
    }

    /**
     * Update the colors. The values of the colors have changed. Update the element color parts.
     */
    _updateColors() {
        // Set hue only color
        const hueOnlyColor = 'hsl(' + this._hue.toFixed(0) + 'deg 100% 50%)';

        // Refresh slider background color
        this._sliderColorElement.style.backgroundColor = hueOnlyColor;

        // Refresh map background color
        this._mapBaseElement.style.backgroundColor = hueOnlyColor;

        // Set hsl color
        const hslColor = 'hsl(' + this._hue.toFixed(0) + 'deg ' + this._saturation.toFixed(0) + '% ' + this._lightness.toFixed(0) + '%)';

        // Refresh map background color
        this._mapColorElement.style.backgroundColor = hslColor;

        // Set hsla color
        const hslaColor = 'hsla(' + this._hue.toFixed(0) + 'deg ' + this._saturation.toFixed(0) + '% ' + this._lightness.toFixed(0) + '% / ' + this._alpha.toString() + ')';

        // Refresh preview background color
        this._previewColorElement.style.backgroundColor = hslaColor;

        // Set alpha scale
        const alphaScale = 'linear-gradient(to right, rgba(0,0,0,0) 0%, ' + hslColor + ' 100%)';

        // Refresh alpha scale
        this._alphaScaleElement.style.background = alphaScale;

        // Refresh the alpha color
        this._alphaColorElement.style.backgroundColor = hslaColor;
    }

    /**
     * Update the input values. The values of the colors have changed. Update the inputs.
     */
    _updateInputs() {
        // Set input values
        this._hsla_hElement.value = this._hue.toFixed(0);
        this._hsla_sElement.value = this._saturation.toFixed(0);
        this._hsla_lElement.value = this._lightness.toFixed(0);
        this._hsla_aElement.value = this._alpha.toFixed(2);
        this._rgba_rElement.value = this._red.toFixed(0);
        this._rgba_gElement.value = this._green.toFixed(0);
        this._rgba_bElement.value = this._blue.toFixed(0);
        this._rgba_aElement.value = this._alpha.toFixed(2);
        this._hexColorElement.value = this._hex;
    }

    /**
     * Update the input labels. The input mode has changed, so update what is shown.
     */
    _updateLabels() {
        // Hide all inputs
        this._hslaElement.style.visibility = 'hidden';
        this._rgbaElement.style.visibility = 'hidden';
        this._hexElement.style.visibility = 'hidden';

        // Hide all labels
        this._hslaLabelElement.style.visibility = 'hidden';
        this._rgbaLabelElement.style.visibility = 'hidden';
        this._hexLabelElement.style.visibility = 'hidden';

        // Show the current input
        if (ColorPicker._inputMode === 1) { this._hslaElement.style.visibility = 'visible'; this._hslaLabelElement.style.visibility = 'visible'; }
        if (ColorPicker._inputMode === 2) { this._rgbaElement.style.visibility = 'visible'; this._rgbaLabelElement.style.visibility = 'visible'; }
        if (ColorPicker._inputMode === 3) { this._hexElement.style.visibility = 'visible'; this._hexLabelElement.style.visibility = 'visible'; }        
    }

    /**
     * Update the slider locations. The color values have changed (not by using the sliders) and we now need
     * to move the sliders into place.
     */
    _updateSliders() {
        // Set slider width
        const sliderWidth = this._sliderElement.clientWidth - this._sliderColorElement.clientWidth - 9;

        // Set slider left part
        let left = (this._hue / 360 * sliderWidth) + (this._sliderColorElement.clientWidth / 2);

        // Set slider left location
        this._sliderColorElement.style.left = left.toFixed(0) + 'px';

        // Set alpha width
        const alphaWidth = this._alphaElement.clientWidth - this._alphaColorElement.clientWidth - 9;

        // Set alpha left part
        left = (this._alpha * alphaWidth) + (this._alphaColorElement.clientWidth / 2);

        // Set alpha left location
        this._alphaColorElement.style.left = left.toFixed(0) + 'px';

        // Set map width and height
        const mapWidth = this._mapElement.clientWidth - this._mapColorElement.clientWidth - 9;
        const mapHeight = this._mapElement.clientHeight - this._mapColorElement.clientHeight - 9;

        // Convert the red, green and blue parts into sx and vy (the s and v parts from converting to HSV)

        // Set the red, green and blue parts (0 to 1)
        const red = this._red / 255;
        const green = this._green / 255;
        const blue = this._blue / 255;

        // Set max and min
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);

        // Set diff
        const diff = max - min;

        // Set sx
        let sx = 0;
        if (max !== 0) sx = diff / max;

        // Set vy
        let vy = 1 - max;

        // Set map left and top
        left = (sx * mapWidth) + (this._mapColorElement.clientWidth / 2);
        let top = (vy * mapHeight) + (this._mapColorElement.clientHeight / 2);

        // Set map left location
        this._mapColorElement.style.left = left.toFixed(0) + 'px';
        this._mapColorElement.style.top = top.toFixed(0) + 'px';
    }

    /**
     * Update the value attribute value to the latest hex value.
     */
    _updateValueAttribute() {
        // Set internal attribute adjustment
        this._internalAttributeAdjustment = true;

        // Set the attribute
        this.setAttribute('value', this._hex);

        // Reset internal attribute adjustment
        this._internalAttributeAdjustment = false;
    }

    /**
     * Convert the hue part into a RGB part.
     * @param {Number} p The p factor.
     * @param {Number} q The q factor
     * @param {Number} t The t factor.
     * @return {Number} The calculated rgb factor.
     */
    _convertHueToRgb(p, q, t) {
        // If t factor is less than zero then add 1 to it
        if (t < 0) t += 1;

        // If t factor is more than 1 then subtract 1 from it
        if (t > 1) t -= 1;

        // If t factor less than 1 sixth
        if (t < 1/6) return p + (q - p) * 6 * t;

        // Else if t factor less than 1 half
        if (t < 1/2) return q;

        // Else if t factor less the 2 thirds
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;

        // Otherwise just return p factor
        return p;
    }

    /**
     * Convert the HSL parts into the RGB parts.
     */
    _convertHslToRgb() {
        // Set hue, saturation and lightness into 0 to 1 ranges
        const hue = this._hue / 360.0;
        const saturation = this._saturation / 100.0;
        const lightness = this._lightness / 100.0;

        // Set red, green and blue parts (0 to 1)
        let red = 0;
        let green = 0;
        let blue = 0;

        // If achromatic
        if (saturation === 0) {
            // Make red, green and blue parts the same as the lightness
            red = lightness;
            green = lightness;
            blue = lightness;
        } else {
            // Set q factor
            let q = 0;

            // If lightness is less than half
            if (lightness < 0.5) {
                q = lightness * (1 + saturation);
            } else {
                q = lightness + saturation - (lightness * saturation);
            }

            // Set p factor
            let p = (2 * lightness) - q;

            // Calculatr the red, green and blue parts
            red = this._convertHueToRgb(p, q, hue + (1 / 3));
            green = this._convertHueToRgb(p, q, hue);
            blue = this._convertHueToRgb(p, q, hue - (1 / 3));
        }

        // Convert the red, green, blue (0 to 1) values into the 0 to 255 values
        this._red = Math.round(red * 255);
        this._green = Math.round(green * 255);
        this._blue = Math.round(blue * 255);
    }

    /**
     * Convert the RGB parts into the HSL parts.
     */
    _convertRgbToHsl() {
        // Set the red, green and blue parts (0 to 1)
        const red = this._red / 255;
        const green = this._green / 255;
        const blue = this._blue / 255;

        // Set max and min
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);

        // Set hue, saturation and lightness values
        let hue = 0;
        let saturation = 0;
        const lightness = (max + min) / 2;

        // If not achromatic
        if (max !== min) {
            // Set delta
            const delta = max - min;

            // If lightness is over half
            if (lightness > 0.5) {
                saturation = delta / (2 - delta);
            } else {
                saturation = delta / (max + min);
            }

            // If red is the max
            if (red === max) {
                // If green is less than blue
                if (green < blue) {
                    // Set hue
                    hue = (green - blue) / delta + 6;
                } else {
                    // Set hue
                    hue = (green - blue) / delta;
                }
            }

            // If green is the max
            if (green === max) {
                // Set hue
                hue = (blue - red) / delta + 2;
            }

            // If blue is the max
            if (blue === max) {
                // Set hue
                hue = (red - green) / delta + 4;
            }

            // Divide hue by 6
            hue = hue / 6;
        }

        // Convert into hue (0 to 360), saturation (0 to 100%) and lightness (9 to 100)
        this._hue = hue * 360;
        this._saturation = saturation * 100;
        this._lightness = lightness * 100;
    }

    /**
     * Convert the HEX value #RRGGBBAA into red, green, blue and alpha parts.
     */
    _convertHexToRgba() {
        // Convert the #RRGGBBAA parts into red, green, blue and alpha parts
        this._red = parseInt(this._hex.substring(1, 3), 16);
        this._green = parseInt(this._hex.substring(3, 5), 16);
        this._blue = parseInt(this._hex.substring(5, 7), 16);
        this._alpha = parseInt(this._hex.substring(7, 9), 16) / 255;
    }

    /**
     * Convert the red, green, blue and alpha parts into the hex value.
     */
    _convertRgbaToHex() {
        // Convert red, green and blue parts into hex values
        let redHex = this._red.toString(16);
        let greenHex = this._green.toString(16);
        let blueHex = this._blue.toString(16);
        let alphaHex = Math.round(this._alpha * 255).toString(16);

        // Make sure there are 2 digits long
        if (redHex.length === 1) redHex = '0' + redHex;
        if (greenHex.length === 1) greenHex = '0' + greenHex;
        if (blueHex.length === 1) blueHex = '0' + blueHex;
        if (alphaHex.length === 1) alphaHex = '0' + alphaHex;

        // Set hex value
        this._hex = '#' + redHex + greenHex + blueHex + alphaHex;
    }
}

// Tell the browser about the new tag and the class it is linked to
customElements.define('color-picker', ColorPicker);
