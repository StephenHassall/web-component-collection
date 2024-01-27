/**
 * Background rotating fans web component.
 * 
 * @classdesc
 * Shows a background with rotating fans.
 * 
 * CSS Variables
 * --fan1-???
 * --fan2-???
 * --fan3-???
 * You can have up to 50 fans, each with their own set of variables. They need to start at number 1
 * and increase by 1 for each extra fan you are adding
 *
 * --fan1-color1
 * --fan1-color2
 * The fan has two colors. Use these to set the color of each fan blade.
 * 
 * --fan1-gap
 * The size of each fan blade, in deg units. Make sure they can be divided by 360 degrees, otherwise it will not look correct.
 * 
 * --fan1-color-gap
 * There is a gap between each color blade that has a smooth shading. The larger
 * this amount the more blurry the fin joins look (in deg).
 * 
 * --fan1-speed
 * The time it takes to rotate 360 degrees.
 * 
 * --fan1-x
 * --fan1-y
 * The offset where the center of the fan is located. To be in the top left corner, set x to -50% and y to -50%.
 * You can use rem, em and so on, but not "0".
 * 
 * --fan-opacity
 * How transparent the whole fan is (0 to 1) 
 * 
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 */
class BackgroundRotatingFans extends HTMLElement {
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
            overflow: hidden;
            --background-rotating-fans-rotate-angle: 0deg;
        }

        .fan {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: repeating-conic-gradient(
                from var(--background-rotating-fans-rotate-angle)
                at calc(var(--fan-x) + 50%) calc(var(--fan-y) + 50%),
                var(--fan-color1, rgb(255,0,0)) 0deg calc(var(--fan-gap, 10deg) - var(--fan-color-gap, 1deg)),
                var(--fan-color1, rgb(255,0,0)) calc(var(--fan-gap, 10deg) - var(--fan-color-gap, 1deg)),
                var(--fan-color2, rgb(0,0,255)) var(--fan-gap, 10deg),
                var(--fan-color2, rgb(0,0,255)) var(--fan-gap, 10deg) calc((var(--fan-gap, 10deg) * 2) - var(--fan-color-gap, 1deg)),
                var(--fan-color2, rgb(0,0,255)) calc((var(--fan-gap, 10deg) * 2) - var(--fan-color-gap, 1deg)),
                var(--fan-color1, rgb(255,0,0)) calc(var(--fan-gap, 10deg) * 2));
            animation-duration: var(--fan-speed, 60s);
            animation-name: rotate-fan;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
            opacity: var(--fan-opacity);
        }

        @keyframes rotate-fan {
            0% {
                --background-rotating-fans-rotate-angle: 0deg;
            }
            100% {
                --background-rotating-fans-rotate-angle: 360deg;
            }  
        }`;
    }

    // Set registered rotate angle property flag
    static _registeredRotateAngleProperty = false;

    /**
     * Create a new BackgroundRotatingFans object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // If we have not registered the rotate angle property
        if (BackgroundRotatingFans._registeredRotateAngleProperty === false) {
            // Set the flag to say we have registered property
            BackgroundRotatingFans._registeredRotateAngleProperty = true;


            // If there is a CSS register property function
            if (window.CSS.registerProperty) {
                // Register the property. This should only be done once for all instances of this web component
                window.CSS.registerProperty({
                    name: "--background-rotating-fans-rotate-angle",
                    syntax: "<angle>",
                    inherits: false,
                    initialValue: "0deg",
                });
            }
        }

        // Attach shadow DOM root
        this.attachShadow({mode: 'open'});

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = BackgroundRotatingFans.CSS;

        // Add styles
        this.shadowRoot.appendChild(style);

        // Create base element
        this._baseElement = document.createElement('DIV');

        // Set class
        this._baseElement.classList.add('base');

        // Add to shadow DOM
        this.shadowRoot.appendChild(this._baseElement);
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Get styles (they may be inline or in a class somewhere)
        const ccStyleDeclaraction = window.getComputedStyle(this);

        // Set fan count
        let fanCount = 1;

        // Check style properties to see how many fans there are
        for (let checkCount = 2; checkCount < 50; checkCount++) {
            // Create --fan1-x property string for the fan number
            const fanProperty = '--fan' + checkCount.toString() + '-x';

            // If the property does not exist
            if (!ccStyleDeclaraction.getPropertyValue(fanProperty)) break;

            // There is a fan for this check count, therefore adjust the fan count
            fanCount = checkCount;
        }

        // For each fan
        for (let fan = 1; fan <= fanCount; fan++) {
            // Set starting fan style property name
            const fanPrefix = '--fan' + fan.toString() + '-';

            // Create fan element
            let fanElement = document.createElement('DIV');

            // Set class
            fanElement.classList.add('fan');

            // Set styles
            fanElement.style.setProperty('--fan-color1', ccStyleDeclaraction.getPropertyValue(fanPrefix + 'color1'));
            fanElement.style.setProperty('--fan-color2', ccStyleDeclaraction.getPropertyValue(fanPrefix + 'color2'));
            fanElement.style.setProperty('--fan-gap', ccStyleDeclaraction.getPropertyValue(fanPrefix + 'gap'));
            fanElement.style.setProperty('--fan-color-gap', ccStyleDeclaraction.getPropertyValue(fanPrefix + 'color-gap'));
            fanElement.style.setProperty('--fan-speed', ccStyleDeclaraction.getPropertyValue(fanPrefix + 'speed'));
            fanElement.style.setProperty('--fan-x', ccStyleDeclaraction.getPropertyValue(fanPrefix + 'x'));
            fanElement.style.setProperty('--fan-y', ccStyleDeclaraction.getPropertyValue(fanPrefix + 'y'));
            fanElement.style.setProperty('--fan-opacity', ccStyleDeclaraction.getPropertyValue(fanPrefix + 'opacity'));

            // Add to base
            this._baseElement.appendChild(fanElement);
        }
    }
}

// Tell the browser about the new tag and the class it is linked to
customElements.define('background-rotating-fans', BackgroundRotatingFans);
