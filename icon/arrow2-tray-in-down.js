/**
 * Icon Arrow 2 Tray In Down <icon-arrow2-tray-in-down>.
 * @author Stephen Paul Hassall (Web: https://icon-svg.com, Twitter: https://twitter.com/StephenPHassall)
 */
export default class IconArrow2TrayInDown extends HTMLElement {
    /**
     * Icon Arrow 2 Tray In Down constructor.
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
    d="M 0,15.5 A 0.5,0.5 0 0 0 0.5,16 h 15 A 0.5,0.5 0 0 0 16,15.5 v -5 A 0.5,0.5 0 0 0 15.5,10 h -1 A 0.5,0.5 0 0 0 14,10.5 V 14 H 2 V 10.5 A 0.5,0.5 0 0 0 1.5,10 h -1 A 0.5,0.5 0 0 0 0,10.5 Z M 3.2070312,6.9980469 c -8.23e-5,0.043435 0.00604,0.087787 0.017578,0.1308593 0.022498,0.084891 0.066958,0.1623596 0.1289062,0.2246094 l 4.2929688,4.2929684 c 0.1952535,0.195212 0.5117777,0.195212 0.7070312,0 L 12.646484,7.3535156 c 0.195212,-0.1952535 0.195212,-0.5117777 0,-0.7070312 L 11.853516,5.853516 c -0.195254,-0.195212 -0.511778,-0.195212 -0.707032,0 L 9,8 V 0.5 A 0.5,0.5 0 0 0 8.5,0 h -1 A 0.5,0.5 0 0 0 7,0.5 V 8 L 4.8535156,5.853516 c -0.1952535,-0.195212 -0.5117777,-0.195212 -0.7070312,0 L 3.3535156,6.6464844 C 3.259061,6.7412127 3.2072788,6.8677402 3.2070312,6.9980469 Z">
  </path>
</svg>
`;
    }
}

// Define custom control
customElements.define('icon-arrow2-tray-in-down', IconArrow2TrayInDown);