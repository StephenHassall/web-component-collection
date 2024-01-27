/**
 * Icon Column Line Chart <icon-column-line-chart>.
 * @author Stephen Paul Hassall (Web: https://icon-svg.com, Twitter: https://twitter.com/StephenPHassall)
 */
export default class IconColumnLineChart extends HTMLElement {
    /**
     * Icon Column Line Chart constructor.
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
    d="M 0.25 0 C 0.11192881 0 0 0.11192881 0 0.25 L 0 16 L 15.75 16 C 15.888071 16 16 15.888071 16 15.75 L 16 15.25 C 16 15.111929 15.888071 15 15.75 15 L 1 15 L 1 0.25 C 1 0.11192881 0.88807119 0 0.75 0 L 0.25 0 z M 8.5 0 A 1.5000001 1.5 0 0 0 7 1.5 A 1.5000001 1.5 0 0 0 7.0859375 1.9902344 L 4.2929688 4.2265625 A 1.5 1.5 0 0 0 3.5 4 A 1.5 1.5 0 0 0 2 5.5 A 1.5 1.5 0 0 0 3.5 7 A 1.5 1.5 0 0 0 5 5.5 A 1.5 1.5 0 0 0 4.9140625 5 L 4.9257812 5 L 7.7089844 2.7714844 A 1.5000001 1.5 0 0 0 8.5 3 A 1.5000001 1.5 0 0 0 9.6269531 2.4882812 L 12.003906 3.4414062 A 1.5 1.5 0 0 0 12 3.5 A 1.5 1.5 0 0 0 13.5 5 A 1.5 1.5 0 0 0 15 3.5 A 1.5 1.5 0 0 0 13.5 2 A 1.5 1.5 0 0 0 12.373047 2.5117188 L 9.9960938 1.5585938 A 1.5000001 1.5 0 0 0 10 1.5 A 1.5000001 1.5 0 0 0 8.5 0 z M 8.5 1 A 0.5 0.5 0 0 1 9 1.5 A 0.5 0.5 0 0 1 8.5 2 A 0.5 0.5 0 0 1 8 1.5 A 0.5 0.5 0 0 1 8.5 1 z M 13.5 3 A 0.5 0.5 0 0 1 14 3.5 A 0.5 0.5 0 0 1 13.5 4 A 0.5 0.5 0 0 1 13 3.5 A 0.5 0.5 0 0 1 13.5 3 z M 3.5 5 A 0.5 0.5 0 0 1 4 5.5 A 0.5 0.5 0 0 1 3.5 6 A 0.5 0.5 0 0 1 3 5.5 A 0.5 0.5 0 0 1 3.5 5 z M 7.5 5 C 7.223858 5 7 5.2238576 7 5.5 L 7 13.5 C 7 13.776142 7.223858 14 7.5 14 L 9.5 14 C 9.776142 14 10 13.776142 10 13.5 L 10 5.5 C 10 5.2238576 9.776142 5 9.5 5 L 7.5 5 z M 8.25 6 L 8.75 6 C 8.888071 6 9 6.1119288 9 6.25 L 9 12.75 C 9 12.888071 8.888071 13 8.75 13 L 8.25 13 C 8.111929 13 8 12.888071 8 12.75 L 8 6.25 C 8 6.1119288 8.111929 6 8.25 6 z M 12.5 7 C 12.223858 7 12 7.2238576 12 7.5 L 12 13.5 C 12 13.776142 12.223858 14 12.5 14 L 14.5 14 C 14.776142 14 15 13.776142 15 13.5 L 15 7.5 C 15 7.2238576 14.776142 7 14.5 7 L 12.5 7 z M 13.25 8 L 13.75 8 C 13.888071 8 14 8.1119288 14 8.25 L 14 12.75 C 14 12.888071 13.888071 13 13.75 13 L 13.25 13 C 13.111929 13 13 12.888071 13 12.75 L 13 8.25 C 13 8.1119288 13.111929 8 13.25 8 z M 2.5 9 C 2.2238576 9 2 9.2238576 2 9.5 L 2 13.5 C 2 13.776142 2.2238576 14 2.5 14 L 4.5 14 C 4.7761424 14 5 13.776142 5 13.5 L 5 9.5 C 5 9.2238576 4.7761424 9 4.5 9 L 2.5 9 z M 3.25 10 L 3.75 10 C 3.8880712 10 4 10.111929 4 10.25 L 4 12.75 C 4 12.888071 3.8880712 13 3.75 13 L 3.25 13 C 3.1119288 13 3 12.888071 3 12.75 L 3 10.25 C 3 10.111929 3.1119288 10 3.25 10 z ">
  </path>
</svg>
`;
    }
}

// Define custom control
customElements.define('icon-column-line-chart', IconColumnLineChart);