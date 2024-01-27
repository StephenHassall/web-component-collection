/**
 * Icon Ungroup <icon-ungroup>.
 * @author Stephen Paul Hassall (Web: https://icon-svg.com, Twitter: https://twitter.com/StephenPHassall)
 */
export default class IconUngroup extends HTMLElement {
    /**
     * Icon Ungroup constructor.
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
    d="M 0 0 L 0 3 L 1 3 L 1 9 L 0 9 L 0 12 L 3 12 L 3 11 L 5 11 L 5 13 L 4 13 L 4 16 L 7 16 L 7 15 L 13 15 L 13 16 L 16 16 L 16 13 L 15 13 L 15 7 L 16 7 L 16 4 L 13 4 L 13 5 L 11 5 L 11 3 L 12 3 L 12 0 L 9 0 L 9 1 L 3 1 L 3 0 L 0 0 z M 1 1 L 2 1 L 2 2 L 1 2 L 1 1 z M 10 1 L 11 1 L 11 2 L 10 2 L 10 1 z M 3 2 L 9 2 L 9 3 L 10 3 L 10 5 L 10 6 L 10 9 L 9 9 L 9 10 L 6 10 L 5 10 L 3 10 L 3 9 L 2 9 L 2 3 L 3 3 L 3 2 z M 14 5 L 15 5 L 15 6 L 14 6 L 14 5 z M 11 6 L 13 6 L 13 7 L 14 7 L 14 13 L 13 13 L 13 14 L 7 14 L 7 13 L 6 13 L 6 11 L 9 11 L 9 12 L 12 12 L 12 9 L 11 9 L 11 6 z M 1 10 L 2 10 L 2 11 L 1 11 L 1 10 z M 10 10 L 11 10 L 11 11 L 10 11 L 10 10 z M 5 14 L 6 14 L 6 15 L 5 15 L 5 14 z M 14 14 L 15 14 L 15 15 L 14 15 L 14 14 z ">
  </path>
</svg>
`;
    }
}

// Define custom control
customElements.define('icon-ungroup', IconUngroup);