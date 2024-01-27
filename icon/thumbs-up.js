/**
 * Icon Thumbs Up <icon-thumbs-up>.
 * @author Stephen Paul Hassall (Web: https://icon-svg.com, Twitter: https://twitter.com/StephenPHassall)
 */
export default class IconThumbsUp extends HTMLElement {
    /**
     * Icon Thumbs Up constructor.
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
    d="M 8,1.5001367 C 8,1.5001367 7.7051959,3.8096794 7.2,5 6.6948041,6.1903206 6.515904,5.9843523 5.5859375,6.9140625 5.1880444,7.3440917 4.9772764,7.9145705 5,8.5 v 4 c 0,1 3,2 4,2 h 3.5 c 0.552285,0 1,-0.447715 1,-1 0,-0.552285 -0.447715,-1 -1,-1 H 13 c 0.552285,0 1,-0.447715 1,-1 0,-0.552285 -0.447715,-1 -1,-1 h 0.5 c 0.552285,0 1,-0.447715 1,-1 0,-0.5522847 -0.447715,-1 -1,-1 H 14 c 0.552285,0 1,-0.4477153 1,-1 0,-0.5522847 -0.448022,-0.9816007 -1,-1 H 9 c 0,0 1,-2.0001367 1,-3.0001367 0,-0.9427446 0,-2 -2,-1.9997266 z M 1,7.5 c -0.55228475,0 -1,0.4477153 -1,1 v 4 c 0,0.552285 0.44771525,1 1,1 h 2 c 0.5522847,0 1,-0.447715 1,-1 v -4 C 4,7.9477153 3.5522847,7.5 3,7.5 Z m 1.5,4 C 2.7761424,11.5 3,11.723858 3,12 3,12.276142 2.7761424,12.5 2.5,12.5 2.2238576,12.5 2,12.276142 2,12 2,11.723858 2.2238576,11.5 2.5,11.5 Z">
  </path>
</svg>
`;
    }
}

// Define custom control
customElements.define('icon-thumbs-up', IconThumbsUp);