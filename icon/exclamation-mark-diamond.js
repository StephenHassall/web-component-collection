/**
 * Icon Exclamation Mark Diamond <icon-exclamation-mark-diamond>.
 * @author Stephen Paul Hassall (Web: https://icon-svg.com, Twitter: https://twitter.com/StephenPHassall)
 */
export default class IconExclamationMarkDiamond extends HTMLElement {
    /**
     * Icon Exclamation Mark Diamond constructor.
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
    d="M 8 0.70703125 A 0.99999998 0.99999998 0 0 0 7.2929688 1 L 1 7.2929688 A 0.99999998 0.99999998 0 0 0 1 8.7070312 L 7.2929688 15 A 1 1 0 0 0 8.7070312 15 L 15 8.7070312 A 1 1 0 0 0 15 7.2929688 L 8.7070312 1 A 0.99999998 0.99999998 0 0 0 8 0.70703125 z M 7.8710938 1.9316406 A 0.50000001 0.50000001 0 0 1 8.3535156 2.0605469 L 13.939453 7.6464844 A 0.49999999 0.49999999 0 0 1 13.939453 8.3535156 L 8.3535156 13.939453 A 0.49999999 0.49999999 0 0 1 7.6464844 13.939453 L 2.0605469 8.3535156 A 0.50000001 0.50000001 0 0 1 2.0605469 7.6464844 L 7.6464844 2.0605469 A 0.50000001 0.50000001 0 0 1 7.8710938 1.9316406 z M 7.5 4.5 C 7.2286656 4.4999994 7.0137622 4.7292298 7.03125 5 L 7.21875 8 C 7.23579 8.280909 7.4685746 8.5 7.75 8.5 L 8.25 8.5 C 8.5314254 8.5 8.76421 8.280909 8.78125 8 L 8.96875 5 C 8.9862378 4.7292298 8.7713344 4.4999994 8.5 4.5 L 7.5 4.5 z M 8 9 C 7.4477153 9 7 9.4477151 7 10 C 7 10.552285 7.4477153 11 8 11 C 8.5522847 11 9 10.552285 9 10 C 9 9.4477151 8.5522847 9 8 9 z ">
  </path>
</svg>
`;
    }
}

// Define custom control
customElements.define('icon-exclamation-mark-diamond', IconExclamationMarkDiamond);