/**
 * Icon Pi <icon-pi>.
 * @author Stephen Paul Hassall (Web: https://icon-svg.com, Twitter: https://twitter.com/StephenPHassall)
 */
export default class IconPi extends HTMLElement {
    /**
     * Icon Pi constructor.
     */
    constructor() {
        // Must call super first
        super();

        // Set class name
        this.classList.add('icon-svg');

        // Set the inner HTML to the SVG
        this.innerHTML =
`
<svg
  viewBox="0 0 16 16" style="display: block; height: inherit;">
  <path
    d="m 3,1 h 12 a 1,1 45 0 1 1,1 1,1 135 0 1 -1,1 h -3 v 9 a 1,1 45 0 0 1,1 1,1 135 0 0 1,-1 v -1 a 1,1 135 0 1 1,-1 1,1 45 0 1 1,1 v 2 a 2,2 135 0 1 -2,2 l -2,0 A 2,2 45 0 1 10,13 V 3 H 7 v 9 a 2.4142136,2.4142136 112.5 0 1 -0.7071068,1.707107 l -1.5857864,1.585786 a 1.3874259,1.3874259 170.78253 0 1 -1.601534,0.259893 L 2.8944272,15.447214 A 0.72075922,0.72075922 80.782526 0 1 2.7071068,14.292893 L 4.2928932,12.707107 A 2.4142136,2.4142136 112.5 0 0 5,11 V 3 H 4 A 2,2 153.43495 0 0 2.4,3.8 L 2.1,4.2 A 1.0570976,1.0570976 170.27998 0 1 0.66794971,4.4452998 0.90676588,0.90676588 84.93342 0 1 0.5547002,3.1679497 L 1.4452998,1.8320503 A 1.8685171,1.8685171 151.84503 0 1 3,1 Z">
  </path>
</svg>
`;
    }
}

// Define custom control
customElements.define('icon-pi', IconPi);