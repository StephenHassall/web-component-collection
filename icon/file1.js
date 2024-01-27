/**
 * Icon File 1 <icon-file1>.
 * @author Stephen Paul Hassall (Web: https://icon-svg.com, Twitter: https://twitter.com/StephenPHassall)
 */
export default class IconFile1 extends HTMLElement {
    /**
     * Icon File 1 constructor.
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
    d="M 4 0 C 2.892 0 2 0.892 2 2 L 2 14 C 2 15.108 2.892 16 4 16 L 12 16 C 13.108 16 14 15.108 14 14 L 14 7 L 14 5.5 A 1.2071068 1.2071068 0 0 0 13.646484 4.6464844 L 9.3535156 0.35351562 A 1.2071068 1.2071068 0 0 0 8.5 0 L 7 0 L 4 0 z M 4 1 L 8 1 L 8 5 A 1 1 0 0 0 9 6 L 13 6 L 13 14 C 13 14.554 12.554 15 12 15 L 4 15 C 3.446 15 3 14.554 3 14 L 3 2 C 3 1.446 3.446 1 4 1 z M 5.25 8 A 0.25 0.25 0 0 0 5 8.25 L 5 8.75 A 0.25 0.25 0 0 0 5.25 9 L 10.75 9 A 0.25 0.25 0 0 0 11 8.75 L 11 8.25 A 0.25 0.25 0 0 0 10.75 8 L 5.25 8 z M 5.25 10 A 0.25 0.25 0 0 0 5 10.25 L 5 10.75 A 0.25 0.25 0 0 0 5.25 11 L 10.75 11 A 0.25 0.25 0 0 0 11 10.75 L 11 10.25 A 0.25 0.25 0 0 0 10.75 10 L 5.25 10 z M 5.25 12 A 0.25 0.25 0 0 0 5 12.25 L 5 12.75 A 0.25 0.25 0 0 0 5.25 13 L 10.75 13 A 0.25 0.25 0 0 0 11 12.75 L 11 12.25 A 0.25 0.25 0 0 0 10.75 12 L 5.25 12 z ">
  </path>
</svg>
`;
    }
}

// Define custom control
customElements.define('icon-file1', IconFile1);