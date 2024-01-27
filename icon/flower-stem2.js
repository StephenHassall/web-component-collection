/**
 * Icon Flower Stem 2 <icon-flower-stem2>.
 * @author Stephen Paul Hassall (Web: https://icon-svg.com, Twitter: https://twitter.com/StephenPHassall)
 */
export default class IconFlowerStem2 extends HTMLElement {
    /**
     * Icon Flower Stem 2 constructor.
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
    d="M 8 0 A 8 8 0 0 0 7.4355469 0.50390625 A 8 8 0 0 0 7.2773438 0.66015625 A 8 8 0 0 0 7.2519531 0.68359375 A 7 7 0 0 1 7.2539062 0.68554688 A 8 8 0 0 0 6.5957031 1.4609375 A 8 8 0 0 0 5 0.5859375 L 5 1.6777344 L 5 6 A 3 3 0 0 0 7.5 8.9550781 L 7.5 13.21875 A 8 8 0 0 0 0 8 A 8 8 0 0 0 0.03125 8.6171875 A 8 8 0 0 0 7.3828125 15.96875 A 8 8 0 0 0 8 16 A 8 8 0 0 0 8.6171875 15.96875 A 8 8 0 0 0 15.96875 8.6171875 A 8 8 0 0 0 16 8 A 8 8 0 0 0 8.5 13.244141 L 8.5 8.9550781 A 3 3 0 0 0 11 6 L 11 1.6875 L 11 0.60546875 C 10.433746 0.83449593 9.8991385 1.127299 9.4042969 1.4746094 A 8 8 0 0 0 8.7402344 0.68359375 A 7 7 0 0 1 8.7441406 0.6796875 A 8 8 0 0 0 8.6914062 0.62695312 A 8 8 0 0 0 8.6074219 0.546875 A 8 8 0 0 0 8 0 z M 7.9941406 1.3535156 A 7 7 0 0 1 8.6152344 2.1035156 C 8.3995606 2.2997348 8.1954842 2.5092377 8.0019531 2.7285156 A 8 8 0 0 0 7.3769531 2.09375 A 7 7 0 0 1 7.9941406 1.3535156 z M 6 2.2578125 A 7 7 0 0 1 8.5117188 5.4375 L 9.3769531 4.9375 A 8 8 0 0 0 8.625 3.546875 C 9.024203 3.0629254 9.486983 2.6359847 10 2.2753906 L 10 6 A 2 2 0 0 1 8 8 A 2 2 0 0 1 6 6 L 6 2.2578125 z M 1.1035156 9.0996094 A 7 7 0 0 1 6.9003906 14.896484 A 7 7 0 0 1 1.1035156 9.0996094 z M 14.896484 9.0996094 A 7 7 0 0 1 9.0996094 14.896484 A 7 7 0 0 1 14.896484 9.0996094 z ">
  </path>
</svg>
`;
    }
}

// Define custom control
customElements.define('icon-flower-stem2', IconFlowerStem2);