/**
 * Clip path arc web component.
 * 
 * <clip-path-arc>
 *   <div radius-outer="100" radius-inner="50" start-angle="10" end-angle="130">default slots</div>
 * </clip-path-arc>
 * 
 * @classdesc
 * Clips an element so only an inner arc part is shown.
 * 
 * Attributes:
 * radius-outer
 * The radius of the outer arc. This is a percentage value 0 to 100.
 * 
 * radius-inner
 * The radius of the inner arc. This is a percentage value 0 to 100.
 * 
 * start-angle
 * The starting angle of the arc. This is in degress (0 to 360).
 * 
 * end-angle
 * The ending angle of the arc. This is in degress (0 to 360).
 * 
 * @version: 0.2
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 */
export default class ClipPathArc extends HTMLElement {
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
            width: 100%;
            height: 100%;
            position: relative;
        }

        ::slotted(*) {
            position: absolute;
            inset: 0;
        }
        `;
    }

    /**
     * Static HTML constant.
     * @return {string} The HTML constant.
     */
    static get HTML() {
        return /*html*/`
        <div class="base">
            <slot id="slot"></slot>
        </div>
        `;
    }

    // Set count (each clip-path id needs to be unique)
    static count = 0;

    // Set XML namespace for SVG
    static xmlns = "http://www.w3.org/2000/svg";

    /**
     * Clip path arc constructor.
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({mode: 'open'});

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = ClipPathArc.HTML;

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = ClipPathArc.CSS;

        // Insert shadow DOM's styles
        this.shadowRoot.prepend(style);

        // Get slot element
        this._slotElement = this.shadowRoot.getElementById('slot');

        // Set binding functions
        this._slotChangeEvent = this._slotChangeEvent.bind(this);
        
        // Create SVG element
        this._svgElement = document.createElementNS(ClipPathArc.xmlns, 'svg');

        // Set clip path marker (so it does not get processed as an arc slot)
        this._svgElement.setAttributeNS(null, 'clip-path-arc-svg', '');

        // Set width and height to zero
        this._svgElement.setAttributeNS(null, 'width', '0');
        this._svgElement.setAttributeNS(null, 'height', '0');

        // Add to the inner part of the web component (but not to the shadow DOM). The 
        // slot element's CSS clip-path needs to be able to see clip path element (not hidden within a shadow DOM)
        this.prepend(this._svgElement);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add events
        this._slotElement.addEventListener('slotchange', this._slotChangeEvent);
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove events
        this._slotElement.removeEventListener('slotchange', this._slotChangeEvent);
    }

    /**
     * Update the arc clip paths after you have changed some of the slot attributes.
     */
    update() {
        // Call the slot change event to recreate all clip path SVG parts.
        this._slotChangeEvent();
    }

    /**
     * Slot change event.
     */
    _slotChangeEvent() {
        // Get assigned elements
        const assignedElements = this._slotElement.assignedElements();

        // Clear SVG clip path parts
        this._svgElement.innerHTML = '';

        // For each assigned element
        assignedElements.forEach((element) => {
            // Make sure it isn't the SVG we are using for clip paths
            if (element.hasAttribute('clip-path-arc-svg') === true) return;

            // Get radius outer
            let radiusOuter = 0.5;
            if (element.hasAttribute('radius-outer') === true) radiusOuter = parseFloat(element.getAttribute('radius-outer')) / 200;

            // Get radius inner
            let radiusInner = 0.4;
            if (element.hasAttribute('radius-inner') === true) radiusInner = parseFloat(element.getAttribute('radius-inner')) / 200;

            // Get start angle
            let startAngle = 0;
            if (element.hasAttribute('start-angle') === true) startAngle = parseFloat(element.getAttribute('start-angle'));

            // Get end angle
            let endAngle = 60;
            if (element.hasAttribute('end-angle') === true) endAngle = parseFloat(element.getAttribute('end-angle'));

            // Create the SVG clip path
            const clipPathId = this._createClipPath(radiusOuter, radiusInner, startAngle, endAngle);

            // Set styling
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.clipPath = 'url(\'#clip-path-arc-' + clipPathId.toString() + '\')';
        });
    }

    /**
     * Create SVG clip path.
     * @param {Number} radiusOuter The radius of the outer part (0 to 1).
     * @param {Number} radiusInner The radius of the inner part (0 to 1).
     * @param {Number} startAngle The starting angle (in degrees).
     * @param {Number} endAngle  The ending angle (in degrees).
     * @return {Number} The id of the clip path.
     */
    _createClipPath(radiusOuter, radiusInner, startAngle, endAngle) {
        // Set starting 1 position
        const starting1Position = this._workoutPosition(radiusOuter, endAngle);

        // Set ending 1 position
        const ending1Position = this._workoutPosition(radiusOuter, startAngle);

        // Set starting 2 position
        const starting2Position = this._workoutPosition(radiusInner, endAngle);

        // Set ending 2 position
        const ending2Position = this._workoutPosition(radiusInner, startAngle);

        // Set arc and sweep flags
        let arcFlagOuter;
        let sweepFlagOuter;
        let arcFlagInner;
        let sweepFlagInner;

        // If start angle is less than the end angle
        if (startAngle < endAngle) {
            // If difference is greater than 180 degrees
            if (endAngle - startAngle > 180) {
                arcFlagOuter = '1';
                sweepFlagOuter = '0';
                arcFlagInner = '1';
                sweepFlagInner = '1';
            } else {
                arcFlagOuter = '0';
                sweepFlagOuter = '0';
                arcFlagInner = '0';
                sweepFlagInner = '1';
            }
        } else {
            // If difference is greater than 180 degrees
            if (startAngle - endAngle > 180) {
                arcFlagOuter = '0';
                sweepFlagOuter = '0';
                arcFlagInner = '0';
                sweepFlagInner = '1';
            } else {
                arcFlagOuter = '1';
                sweepFlagOuter = '0';
                arcFlagInner = '1';
                sweepFlagInner = '1';
            }
        }
    
        // Set path list
        const pathList = [];

        // If start angle and end angle are the same
        if (startAngle === endAngle || startAngle + 360 === endAngle) {
            // Workout parts
            const outerXPosition = 0.5 - radiusOuter;
            const outerYPosition = 0.5;
            const radiusOuter2 = radiusOuter * 2;
            const minusRadiusOuter2 = radiusOuter * -2;
            const innerXPosition = 0.5 - radiusInner;
            const innerYPosition = 0.5;
            const radiusInner2 = radiusInner * 2;
            const minusRadiusInner2 = radiusInner * -2;

            // Add starting point
            pathList.push('M');
            pathList.push(outerXPosition.toString());
            pathList.push(outerYPosition.toString());

            // Add first arc
            pathList.push('a');
            pathList.push(radiusOuter.toString());
            pathList.push(radiusOuter.toString());
            pathList.push(0);
            pathList.push(1);
            pathList.push(0);
            pathList.push(radiusOuter2.toString());
            pathList.push(0);

            // Add second arc
            pathList.push('a');
            pathList.push(radiusOuter.toString());
            pathList.push(radiusOuter.toString());
            pathList.push(0);
            pathList.push(1);
            pathList.push(0);
            pathList.push(minusRadiusOuter2.toString());
            pathList.push(0);

            // Add ending
            pathList.push('z');

            // Add starting point
            pathList.push('M');
            pathList.push(innerXPosition.toString());
            pathList.push(innerYPosition.toString());

            // Add first arc
            pathList.push('a');
            pathList.push(radiusInner.toString());
            pathList.push(radiusInner.toString());
            pathList.push(0);
            pathList.push(0);
            pathList.push(1);
            pathList.push(radiusInner2.toString());
            pathList.push(0);

            // Add second arc
            pathList.push('a');
            pathList.push(radiusInner.toString());
            pathList.push(radiusInner.toString());
            pathList.push(0);
            pathList.push(0);
            pathList.push(1);
            pathList.push(minusRadiusInner2.toString());
            pathList.push(0);

            // Add ending
            pathList.push('z');
        } else {
            // Add starting point
            pathList.push('M');
            pathList.push(starting1Position.x.toString());
            pathList.push(starting1Position.y.toString());

            // Add arc parts
            pathList.push('A');
            pathList.push(radiusOuter.toString());
            pathList.push(radiusOuter.toString());
            pathList.push('0');
            pathList.push(arcFlagOuter);
            pathList.push(sweepFlagOuter);
            pathList.push(ending1Position.x.toString());
            pathList.push(ending1Position.y.toString());

            // Add line
            pathList.push('L');
            pathList.push(ending2Position.x.toString());
            pathList.push(ending2Position.y.toString());

            // Add arc parts
            pathList.push('A');
            pathList.push(radiusInner.toString());
            pathList.push(radiusInner.toString());
            pathList.push('0');
            pathList.push(arcFlagInner);
            pathList.push(sweepFlagInner);
            pathList.push(starting2Position.x.toString());
            pathList.push(starting2Position.y.toString());

            // Add line
            pathList.push('L');
            pathList.push(starting1Position.x.toString());
            pathList.push(starting1Position.y.toString());

            // Add ending connection to start
            pathList.push('z');
        }

        // Set path
        const path = pathList.join(' ');

        // Set the element clip path id
        const id = ClipPathArc.count;

        // Increase count
        ClipPathArc.count++;

        // Create clip path element
        const clipPathElement = document.createElementNS(ClipPathArc.xmlns, 'clipPath');

        // Set id
        clipPathElement.setAttribute('id', 'clip-path-arc-' + id.toString());

        // Set clip path units
        clipPathElement.setAttributeNS(null, 'clipPathUnits', 'objectBoundingBox');

        // Create path element
        const pathElement = document.createElementNS(ClipPathArc.xmlns, 'path');

        // Set d path
        pathElement.setAttributeNS(null, 'd', path);

        // Add elements together
        clipPathElement.appendChild(pathElement);

        // Add clip path element to the SVG
        this._svgElement.appendChild(clipPathElement);

        // Return the id of the clip path
        return id;
    }

    /**
     * Workout the position base off the radius and angle.
     * @param {Number} radius The radius to make the calculations with.
     * @param {Number} angle The angle to rotate by.
     * @return {Object} The X, Y position result.
     */
    _workoutPosition(radius, angle) {
        // Convert to radians
        var radians = (angle - 90) * Math.PI / 180.0;

        // Set result object
        let result = {};

        // Work out the x and y parts
        result.x = (radius * Math.cos(radians)) + 0.50;
        result.y = (radius * Math.sin(radians)) + 0.50;

        // Return the result
        return result;
    }    
}

// Define custom control
customElements.define('clip-path-arc', ClipPathArc);