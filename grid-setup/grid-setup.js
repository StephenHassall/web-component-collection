/**
 * Grid setup web component.
 * 
 * <grid-setup>
 *   <div row="1" column="2" rowspan="1" colspan="2">default slots are placed in grid cells</div>
 * </grid-setup>
 * 
 * @classdesc
 * A grid of cells that the user can setup live, in the browser, adding, removing cells,
 * resizing columns, rows, etc.
 * 
 * Attributes:
 * edit-mode
 * This is the type of information that is being edited. The value can be one of the following
 *   size = Adjust the percentage size of the columns and rows
 *   number = Add and remove the number of columns and rows
 *   block = Add, remove cells and change their span sizes
 *   select = Allows the user to select one of the slotted elements
 * 
 * menu
 * Controls if the menu should be shown. If not used then no menu is displayed. The value can be one of the following
 *   top-left, top-right, bottom-left or bottom-right
 * 
 * columns, rows
 * The list of columns and rows to show. These are percentage amounts, for example columns="20, 30, 50".
 * They must add up to 100. The values are automatically updated whenever the column/row information is changed
 * by the user.
 * 
 * Events:
 * add
 * When the user selects to add a new cell. It is up to you to show the user what to add and then add
 * a new element inside the <grid-setup>, with column and row attributes set. The whole <grid-setup> becomes
 * disabled, and you cannot select or change anything, until you either add a new cell slot or call the
 * cancelAdd function.
 *   event.detail.column
 *   event.detail.row
 *   The column and row of the block that the user wants to add something to.
 * 
 * removed
 * When the user selects to remove an existing block. This is fired after the element was removed
 * from the <grid-setup>.
 *   event.detail.id
 *   The id value of the element removed.
 * 
 *   event.detail.column
 *   event.detail.row
 *   The column and row of the block that the user removed.
 * 
 * changed
 * When the grid columns or rows have changed in size or have been added or removed. When a cells
 * is resized (span length adjusted).
 * 
 * select
 * When the select edit-mode is used, this returns the chosen slotted cell element
 * 
 * @version: 0.2
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 * 
 * Row and column indexes start at 1 (not 0). Empty span values default to 1.
 */
class GridSetup extends HTMLElement {
    /**
     * Static CSS constant.
     * @return {string} The CSS constant.
     */
    static get CSS() {
        return /*css*/`
        :host {
            display: block;
            touch-action: none;
            direction: ltr;
            writing-mode: horizontal-tb;
        }

        .base {
            width: 100%;
            height: 100%;
            position: relative;
            isolation: isolate;
            background-color: transparent;
        }

        .base.adding {
            pointer-events: none;
        }

        .grid {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: grid;
            z-index: 1;
        }

        .setup-menu {
            position: absolute;
            z-index: 10;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            gap: 1rem;
            background-color: rgba(248, 248, 248, 0.8);
            border: 2px solid gray;
            border-radius: 0.5rem;
            padding: 0.5rem;
        }

        .setup-menu > * {
            width: 2rem;
            height: 2rem;
            cursor: pointer;
            fill: gray;
            padding: 0.5rem;
            box-sizing: content-box;
            border: none;
            background: none;
        }

        .setup-menu > *:hover {
            background-color: rgba(200, 200, 200, 0.6);
            border-radius: 0.5rem;
        }

        .setup-menu.open {
            grid-template-rows: 1fr 1fr 1fr;
        }

        .setup-menu.top-left {
            left: 1rem;
            top: 1rem;
        }

        .setup-menu.top-right {
            right: 1rem;
            top: 1rem;
        }

        .setup-menu.bottom-left {
            left: 1rem;
            bottom: 1rem;
        }

        .setup-menu.bottom-right {
            right: 1rem;
            bottom: 1rem;
        }

        .setup-menu:not(.open) > *:not(.selected) {
            display: none;
        }

        .size {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: grid;
            z-index: 2;
        }

        .adjustment-bar {
            background-color: rgba(126, 126, 126, 0.5);
            border: 0.125rem dashed lightgray;
        }

        .adjustment-bar-column {
            cursor: ew-resize;
        }

        .adjustment-bar-row {
            cursor: ns-resize;
        }

        .adjustment-bar-cross {
            cursor: all-scroll;
        }

        .adjustment-bar-highlight {
            background-color: rgba(249, 199, 80, 0.9);
            border: 0.125rem dashed gold;
        }

        .adjustment-label {
            background-color: rgba(248, 248, 248, 0.8);
            border: 2px solid gray;
            border-radius: 0.25rem;
            padding: 0.25rem;
            color: gray;
        }

        .number {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: grid;
            z-index: 2;
        }

        .number .cell {
            background-color: rgba(248, 248, 248, 0.5);
            border: 1px dashed gray;
            z-index: 3;
        }

        .number .cell.selected {
            background-color: rgba(126, 126, 126, 0.5);
        }

        .number .menu {
            background-color: rgba(248, 248, 248, 0.8);
            border-radius: 0.5rem;
            border: 2px solid gray;
            display: grid;
            align-self: center;
            justify-self: center;
            gap: 0.5rem;
            z-index: 5;
            padding: 0.5rem;
        }

        .number .menu > * {
            width: 2rem;
            height: 2rem;
            cursor: pointer;
            fill: gray;
            padding: 0.5rem;
            box-sizing: content-box;
            border: none;
            background: none;            
        }

        .number .menu > *:hover {
            background-color: rgba(200, 200, 200, 0.6);
            border-radius: 0.5rem;
        }

        .number .menu.column .arrow1 {
            transform: rotate(180deg);
        }

        .number .menu.row .arrow1 {
            transform: rotate(-90deg);
        }

        .number .menu.row .arrow2 {
            transform: rotate(90deg);
        }

        .block {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: grid;
            z-index: 2;
        }

        .block .cell {
            background-color: transparent;
            border: 1px dashed gray;
            z-index: 3;
        }

        .block .cell.selected {
            background-color: rgba(126, 126, 126, 0.5);
        }

        .base.adding .cell.selected {
            border: 4px solid gold;
        }

        .block .tile {
            background-color: rgba(248, 248, 248, 0.5);
            border: 1px dashed gray;
            z-index: 4;
        }

        .block .tile.selected {
            background-color: rgba(126, 126, 126, 0.5);
        }

        .block .menu {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr 1fr;
            gap: 0.25rem;
            align-items: center;
            justify-items: center;
            z-index: 5;
        }

        .block .menu > * {
            width: 1rem;
            height: 1rem;
            z-index: 6;
            background-color: rgba(248, 248, 248, 0.8);
            border: 2px solid gray;
            border-radius: 0.5rem;
            cursor: pointer;
            fill: gray;
            padding: 0.5rem;
            box-sizing: content-box;
        }

        .block .menu > *:hover {
            background-color: rgba(200, 200, 200, 0.6);
        }

        .block .menu .add {
            grid-column: 2 / span 2;
            grid-row: 2 / span 2;
        }

        .block .menu .remove {
            grid-column: 2 / span 2;
            grid-row: 2 / span 2;
        }

        .block .menu .arrow.left.in {
            grid-column: 1;
            grid-row: 1 / span 2;
            justify-self: start;
            align-self: end;
        }

        .block .menu .arrow.left.out {
            transform: rotate(180deg);
            grid-column: 1;
            grid-row: 3 / span 2;
            justify-self: start;
            align-self: start;
        }

        .block .menu .arrow.left.in:not(.double) {
            grid-column: 1;
            grid-row: 2 / span 2;
            align-self: center;
        }

        .block .menu .arrow.left.out:not(.double) {
            grid-column: 1;
            grid-row: 2 / span 2;
            align-self: center;
        }

        .block .menu .arrow.right.in {
            transform: rotate(180deg);
            grid-column: 4;
            grid-row: 1 / span 2;
            justify-self: end;
            align-self: end;
        }

        .block .menu .arrow.right.out {
            grid-column: 4;
            grid-row: 3 / span 2;
            justify-self: end;
            align-self: start;
        }

        .block .menu .arrow.right.in:not(.double) {
            grid-column: 4;
            grid-row: 2 / span 2;
            align-self: center;
        }

        .block .menu .arrow.right.out:not(.double) {
            grid-column: 4;
            grid-row: 2 / span 2;
            align-self: center;
        }

        .block .menu .arrow.up.in {
            transform: rotate(90deg);
            grid-column: 1 / span 2;
            grid-row: 1;
            justify-self: end;
            align-self: start;
        }

        .block .menu .arrow.up.out {
            transform: rotate(-90deg);
            grid-column: 3 / span 2;
            grid-row: 1;
            justify-self: start;
            align-self: start;
        }

        .block .menu .arrow.up.in:not(.double) {
            grid-column: 2 / span 2;
            grid-row: 1;
            justify-self: center;
        }

        .block .menu .arrow.up.out:not(.double) {
            grid-column: 2 / span 2;
            grid-row: 1;
            justify-self: center;
        }

        .block .menu .arrow.down.in {
            transform: rotate(-90deg);
            grid-column: 1 / span 2;
            grid-row: 4;
            justify-self: end;
            align-self: end;
        }

        .block .menu .arrow.down.out {
            transform: rotate(90deg);
            grid-column: 3 / span 2;
            grid-row: 4;
            justify-self: start;
            align-self: end;
        }

        .block .menu .arrow.down.in:not(.double) {
            grid-column: 2 / span 2;
            grid-row: 4;
            justify-self: center;
        }

        .block .menu .arrow.down.out:not(.double) {
            grid-column: 2 / span 2;
            grid-row: 4;
            justify-self: center;
        }
        
        .select {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: grid;
            z-index: 2;
        }
        
        .select .tile {
            display: flex;
            background-color: rgba(248, 248, 248, 0.5);
            border: 1px dashed gray;
            z-index: 3;
        }

        .select button {
            z-index: 6;
            background-color: rgba(248, 248, 248, 0.8);
            border: 2px solid gray;
            border-radius: 0.5rem;
            cursor: pointer;
            fill: gray;
            padding: 0.5rem;
            margin: auto;
        }

        .select button:hover {
            background-color: rgba(200, 200, 200, 0.6);
        }

        .select button > * {
            width: 1rem;
            height: 1rem;
            pointer-events: none;
        }
        `;
    }

    /**
     * Static HTML constant.
     * @return {string} The HTML constant.
     */
    static get HTML() {
        return /*html*/`
        <div id="base" class="base">
            <div id="grid" class="grid">
                <slot id="cell"></slot>
            </div>
        </div>`;
    }

    /**
     * Static add HTML SVG.
     */
    static get addHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path d="M 6.5 0 A 0.5 0.5 0 0 0 6 0.5 L 6 6 L 0.5 6 A 0.5 0.5 0 0 0 0 6.5 L 0 9.5 A 0.5 0.5 0 0 0 0.5 10 L 6 10 L 6 15.5 A 0.5 0.5 0 0 0 6.5 16 L 9.5 16 A 0.5 0.5 0 0 0 10 15.5 L 10 10 L 15.5 10 A 0.5 0.5 0 0 0 16 9.5 L 16 6.5 A 0.5 0.5 0 0 0 15.5 6 L 10 6 L 10 0.5 A 0.5 0.5 0 0 0 9.5 0 L 6.5 0 z ">
            </path>
        </svg>`;
    }

    /**
     * Static rotate HTML SVG.
     */
    static get rotateHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path d="
                M 9.1289062,0.22502925 A 0.5,0.5 0 0 1 9.3535156,0.35393549 L 13.146484,4.1469043 a 0.5,0.5 0 0 1 0,0.7070312
                L 9.3535156,8.6469043 a 0.5,0.5 0 0 1 -0.7070312,0 L 7.8535156,7.8539355 a 0.5,0.5 0 0 1 0,-0.7070312 L 9.5,5.5004199
                H 8 c -2.209139,0 -4,1.790861 -4,4 0,2.2091391 1.790861,4.0000001 4,4.0000001 2.040196,0 3.7232,-1.528254 3.96875,-3.501953
                C 12.00283,9.724532 12.223857,9.5004199 12.5,9.5004199 h 1 c 0.276142,0 0.503141,0.2248681 0.480469,0.5000001
                -0.253809,3.080032 -2.834946,5.5 -5.980469,5.5 -3.313708,0 -6,-2.686292 -6,-6.0000001 0,-3.3137085 2.686292,-6 6,-6
                H 9.5 L 7.8535156,1.8539355 a 0.5,0.5 0 0 1 0,-0.7070312 L 8.6464844,0.35393549 A 0.5,0.5 0 0 1 9.1289062,0.22502925 Z">
            </path>
        </svg>`;
    }

    /**
     * Static size HTML SVG.
     */
    static get sizeHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path d="
                M 0,0 V 2 H 2 V 0 Z M 7,0 V 2 H 9 V 0 Z m 7,0 v 2 h 2 V 0 Z M 3,0.5 v 1 h 1 v -1 z m 2,0 v 1 h 1 v -1 z m 5,0 v 1 h 1
                v -1 z m 2,0 v 1 h 1 v -1 z M 0.5,3 v 1 h 1 V 3 Z m 7,0 v 1 h 1 V 3 Z m 7,0 v 1 h 1 V 3 Z m -14,2 v 1 h 1 V 5 Z m 7,0
                v 1 h 1 V 5 Z m 7,0 v 1 h 1 V 5 Z M 0,7 V 9 H 2 V 7 Z M 7,7 V 9 H 9 V 7 Z m 7,0 v 2 h 2 V 7 Z M 3,7.5 v 1 h 1 v -1 z
                m 2,0 v 1 h 1 v -1 z m 5,0 v 1 h 1 v -1 z m 2,0 v 1 h 1 v -1 z M 0.5,10 v 1 h 1 v -1 z m 7,0 v 1 h 1 v -1 z m 7,0 v 1
                h 1 v -1 z m -14,2 v 1 h 1 v -1 z m 7,0 v 1 h 1 v -1 z m 7,0 v 1 h 1 V 12 Z M 7,14 v 2 h 2 v -2 z m -7,0 v 2 h 2 v -2 z
                m 14,0 v 2 h 2 V 14 Z M 3,14.5 v 1 h 1 v -1 z m 2,0 v 1 h 1 v -1 z m 5,0 v 1 h 1 v -1 z m 2,0 v 1 h 1 v -1 z">
            </path>
        </svg>`;
    }

    /**
     * Static number HTML SVG.
     */
    static get numberHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path d="
                M 0.5 0 A 0.5 0.5 0 0 0 0 0.5 L 0 15.5 A 0.5 0.5 0 0 0 0.5 16 L 15.5 16 A 0.5 0.5 0 0 0 16 15.5 L 16 0.5 A 0.5 0.5 0 0 0 15.5 0
                L 0.5 0 z M 1.25 1 L 14.75 1 A 0.25 0.25 0 0 1 15 1.25 L 15 4.75 A 0.25 0.25 0 0 1 14.75 5 L 1.25 5 A 0.25 0.25 0 0 1 1 4.75
                L 1 1.25 A 0.25 0.25 0 0 1 1.25 1 z M 1.25 6 L 9.75 6 A 0.25 0.25 0 0 1 10 6.25 L 10 9.75 A 0.25 0.25 0 0 1 9.75 10 L 1.25 10
                A 0.25 0.25 0 0 1 1 9.75 L 1 6.25 A 0.25 0.25 0 0 1 1.25 6 z M 11.25 6 L 14.75 6 A 0.25 0.25 0 0 1 15 6.25 L 15 14.75
                A 0.25 0.25 0 0 1 14.75 15 L 11.25 15 A 0.25 0.25 0 0 1 11 14.75 L 11 6.25 A 0.25 0.25 0 0 1 11.25 6 z M 1.25 11 L 9.75 11
                A 0.25 0.25 0 0 1 10 11.25 L 10 14.75 A 0.25 0.25 0 0 1 9.75 15 L 1.25 15 A 0.25 0.25 0 0 1 1 14.75 L 1 11.25 A 0.25 0.25 0 0 1 1.25 11 z ">
            </path>
        </svg>`;
    }

    /**
     * Static block HTML SVG.
     */
    static get blockHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path d="
                M 0.5 0 C 0.22385763 0 0 0.22385763 0 0.5 L 0 6.5 C 0 6.7761424 0.22385763 7 0.5 7 L 6.5 7 C 6.7761424 7 7 6.7761424 7 6.5
                L 7 0.5 C 7 0.22385763 6.7761424 0 6.5 0 L 0.5 0 z M 12 0 A 0.5 0.5 0 0 0 11.5 0.5 L 11.5 2.5 L 9.5 2.5 A 0.5 0.5 0 0 0 9 3
                L 9 4 A 0.5 0.5 0 0 0 9.5 4.5 L 11.5 4.5 L 11.5 6.5 A 0.5 0.5 0 0 0 12 7 L 13 7 A 0.5 0.5 0 0 0 13.5 6.5 L 13.5 4.5 L 15.5 4.5
                A 0.5 0.5 0 0 0 16 4 L 16 3 A 0.5 0.5 0 0 0 15.5 2.5 L 13.5 2.5 L 13.5 0.5 A 0.5 0.5 0 0 0 13 0 L 12 0 z M 0.5 9 C 0.22385763 9 0 9.2238576 0 9.5
                L 0 15.5 C 0 15.776142 0.22385763 16 0.5 16 L 6.5 16 C 6.7761424 16 7 15.776142 7 15.5 L 7 9.5 C 7 9.2238576 6.7761424 9 6.5 9 L 0.5 9 z M 9.5 9
                C 9.2238576 9 9 9.2238576 9 9.5 L 9 15.5 C 9 15.776142 9.2238576 16 9.5 16 L 15.5 16 C 15.776142 16 16 15.776142 16 15.5 L 16 9.5
                C 16 9.2238576 15.776142 9 15.5 9 L 9.5 9 z ">
            </path>
        </svg>`;
    }

    /**
     * Static remove HTML SVG.
     */
    static get removeHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path d="M 0.35355339,2.6464466 2.6464466,0.35355339 a 0.5,0.5 0 0 1 0.7071068,0 L 8,5 12.646447,0.35355339 a 0.5,0.5 0 0 1 0.707106,0 l 2.292894,2.29289321 a 0.5,0.5 90 0 1 0,0.7071068 L 11,8 l 4.646447,4.646447 a 0.5,0.5 90 0 1 0,0.707106 l -2.292894,2.292894 a 0.5,0.5 0 0 1 -0.707106,0 L 8,11 3.3535534,15.646447 a 0.5,0.5 0 0 1 -0.7071068,0 L 0.35355339,13.353553 a 0.5,0.5 90 0 1 0,-0.707106 L 5,8 0.35355339,3.3535534 a 0.5,0.5 90 0 1 0,-0.7071068 z">
            </path>
        </svg>`;
    }

    /**
     * Static arrow HTML SVG (pointing right).
     */
    static get arrowHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path d="M 5.3535534,0.35355339 12.646447,7.6464466 a 0.5,0.5 0 0 1 0,0.7071068 L 5.3535534,15.646447 a -0.5,0.5 0 0 1 -0.707106,0 l -1.292894,-1.292894 a 0.5,0.5 0 0 1 0,-0.707106 L 9.0000004,8 3.3535534,2.3535534 a 0.5,0.5 0 0 1 0,-0.7071068 l 1.292894,-1.29289321 a -0.5,0.5 0 0 1 0.707106,0 z">
            </path>
        </svg>`;
    }

    /**
     * Static arrow row column HTML SVG (pointing right).
     */
    static get arrowRowColumnHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path
                d="
                M 2.5 0.5 C 2.223858 0.5 2 0.72385763 2 1 L 2 3 C 2 3.2761424 2.223858 3.5 2.5 3.5 L 3.5 3.5 C 3.776142 3.5 4 3.2761424 4 3 L 4 1
                C 4 0.72385763 3.776142 0.5 3.5 0.5 L 2.5 0.5 z M 9 2.2070312 C 8.867399 2.2070514 8.7402344 2.2597428 8.6464844 2.3535156 L 7.8535156 3.1464844
                C 7.6583036 3.3417379 7.6583036 3.6582621 7.8535156 3.8535156 L 12 8 L 7.8535156 12.146484 C 7.6583036 12.341738 7.6583036 12.658262 7.8535156 12.853516
                L 8.6464844 13.646484 C 8.8417384 13.841696 9.1582626 13.841696 9.3535156 13.646484 L 14.646484 8.3535156 C 14.841696 8.1582621 14.841696 7.8417379 14.646484 7.6464844
                L 9.3535156 2.3535156 C 9.2597636 2.2597432 9.1326 2.2070513 9 2.2070312 z M 2.5 4.5 C 2.223858 4.5 2 4.7238576 2 5 L 2 7 C 2 7.2761424 2.223858 7.5 2.5 7.5
                L 3.5 7.5 C 3.776142 7.5 4 7.2761424 4 7 L 4 5 C 4 4.7238576 3.776142 4.5 3.5 4.5 L 2.5 4.5 z M 2.5 8.5 C 2.223858 8.5 2 8.7238576 2 9 L 2 11
                C 2 11.276142 2.223858 11.5 2.5 11.5 L 3.5 11.5 C 3.776142 11.5 4 11.276142 4 11 L 4 9 C 4 8.7238576 3.776142 8.5 3.5 8.5 L 2.5 8.5 z M 2.5 12.5
                C 2.223858 12.5 2 12.723858 2 13 L 2 15 C 2 15.276142 2.223858 15.5 2.5 15.5 L 3.5 15.5 C 3.776142 15.5 4 15.276142 4 15 L 4 13 C 4 12.723858 3.776142 12.5 3.5 12.5
                L 2.5 12.5 z ">
            </path>
        </svg>`;
    }

    /**
     * Static select edit HTML SVG.
     */
    static get selectEditHtml() {
        return /*html*/`
        <svg viewBox="0 0 16 16" style="display: block; height: inherit;">
            <path
                d="
                M 8 0 C 7.3246287 0.00505977 6.6526165 0.09562391 6 0.26953125 L 6 2.359375 C 5.3071247 2.6004333 4.6643314 2.9665144 4.1035156 3.4394531
                L 2.3105469 2.4042969 C 1.357792 3.3682647 0.6655659 4.5584903 0.29882812 5.8632812 L 2.1113281 6.9101562 C 2.041062 7.2692825 2.0037973 7.6340839 2 8
                C 2.0038 8.3659161 2.041062 8.7307175 2.1113281 9.0898438 L 0.29882812 10.136719 C 0.66556594 11.44151 1.357792 12.631735 2.3105469 13.595703
                L 4.1035156 12.560547 C 4.6643314 13.033486 5.3071247 13.399567 6 13.640625 L 6 14.695312 L 6 15.5 L 6 15.730469 C 6.6526165 15.904376 7.3246287 15.99494 8 16
                C 8.6753713 15.9949 9.3473835 15.90438 10 15.730469 L 10 13.640625 C 10.692875 13.399567 11.335668 13.033486 11.896484 12.560547 L 13.689453 13.595703
                C 14.642208 12.631735 15.334434 11.44151 15.701172 10.136719 L 13.888672 9.0898438 C 13.958938 8.7307175 13.996203 8.3659161 14 8
                C 13.99978 7.6324257 13.965782 7.2656493 13.898438 6.9042969 L 15.707031 5.8613281 C 15.344567 4.5556358 14.656383 3.3634094 13.707031 2.3964844
                L 11.896484 3.4394531 C 11.336905 2.9609521 10.694034 2.5895306 10 2.34375 L 10 0.26171875 C 9.3470453 0.09044815 8.6750386 0.00250978 8 0 z M 8.03125 5.09375
                A 2.9375 2.890625 0 0 1 10.96875 7.984375 A 2.9375 2.890625 0 0 1 8.03125 10.875 A 2.9375 2.890625 0 0 1 5.09375 7.984375 A 2.9375 2.890625 0 0 1 8.03125 5.09375 z">
            </path>
        </svg>`;
    }

    /**
     * Create a new GridSetup object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({mode: 'open'});

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = GridSetup.HTML;

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = GridSetup.CSS;

        // Insert shadow DOM's styles
        this.shadowRoot.prepend(style);

        // Get base element
        this._baseElement = this.shadowRoot.getElementById('base');

        // Get grid element
        this._gridElement = this.shadowRoot.getElementById('grid');

        // Get cell slot element
        this._cellSlotElement = this.shadowRoot.getElementById('cell');

        // Binding functions

        // SETUP
        this._setupCellSlotChanged = this._setupCellSlotChanged.bind(this);

        // MENU
        this._menuSizeClickEvent = this._menuSizeClickEvent.bind(this);
        this._menuNumberClickEvent = this._menuNumberClickEvent.bind(this);
        this._menuBlockClickEvent = this._menuBlockClickEvent.bind(this);

        // SIZE
        this._sizePointerDownEvent = this._sizePointerDownEvent.bind(this);
        this._sizePointerUpEvent = this._sizePointerUpEvent.bind(this);
        this._sizePointerMoveEvent = this._sizePointerMoveEvent.bind(this);

        // NUMBER
        this._numberCellClickEvent = this._numberCellClickEvent.bind(this);
        this._numberRemoveClickEvent = this._numberRemoveClickEvent.bind(this);
        this._numberArrow1ClickEvent = this._numberArrow1ClickEvent.bind(this);
        this._numberArrow2ClickEvent = this._numberArrow2ClickEvent.bind(this);
        this._numberRotateClickEvent = this._numberRotateClickEvent.bind(this);

        // BLOCK
        this._blockCellClickEvent = this._blockCellClickEvent.bind(this);
        this._blockTileClickEvent = this._blockTileClickEvent.bind(this);
        this._blockOptionMenuClickEvent = this._blockOptionMenuClickEvent.bind(this);
        this._blockAddClickEvent = this._blockAddClickEvent.bind(this);
        this._blockRemoveClickEvent = this._blockRemoveClickEvent.bind(this);
        this._blockArrowLeftInClickEvent = this._blockArrowLeftInClickEvent.bind(this);
        this._blockArrowLeftOutClickEvent = this._blockArrowLeftOutClickEvent.bind(this);
        this._blockArrowRightInClickEvent = this._blockArrowRightInClickEvent.bind(this);
        this._blockArrowRightOutClickEvent = this._blockArrowRightOutClickEvent.bind(this);
        this._blockArrowUpInClickEvent = this._blockArrowUpInClickEvent.bind(this);
        this._blockArrowUpOutClickEvent = this._blockArrowUpOutClickEvent.bind(this);
        this._blockArrowDownInClickEvent = this._blockArrowDownInClickEvent.bind(this);
        this._blockArrowDownOutClickEvent = this._blockArrowDownOutClickEvent.bind(this);

        // SELECT
        this._selectTileButtonClickEvent = this._selectTileButtonClickEvent.bind(this);

        // Set connected
        this._connected = false;
    }

    /**
     * Override attributeChangedCallback function to handle attribute changes
     * @param {string} name Then name of the attribute that has changed.
     * @param {string} oldValue The old value of the attribute before it was changed.
     * @param {string} newValue The new value the attribute is being changed to.
     * @override
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // If not connected
        if (this._connected === false) return;

        // If edit mode changed then update the setup parts
        if (name === 'edit-mode') this._setupUpdate();

        // If menu changed then update setup
        if (name === 'menu') {
            // Remove the menu
            this._menuRemove();

            // If there is menu attribute
            if (newValue) {
                // Create the menu
                this._menuCreate();

                // Update the menu for the first time
                this._menuUpdateMenu();
            } else {
                // The menu is off, so we need to make sure the edit-mode is off too
                this.removeAttribute('edit-mode');
            }
        }
    }

    /**
     * Override the observedAttributes function to return the list
     * of attributes to monitor.
     * @return {Array} List of attribute names.
     * @static
     * @override
     */
    static get observedAttributes() {
        // Return the list of attributes
        return ['edit-mode', 'menu'];
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Create the grid
        this._gridCreate();

        // If menu used
        if (this.hasAttribute('menu') === true) {
            // Create the menu
            this._menuCreate();

            // Update the menu for the first time
            this._menuUpdateMenu();
        }

        // Add cell slot change event
        this._cellSlotElement.addEventListener('slotchange', this._setupCellSlotChanged);        

        // Set connected
        this._connected = true;

        // Set pointer down
        this._pointerDown = false;
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove cell slot change event
        this._cellSlotElement.removeEventListener('slotchange', this._setupCellSlotChanged);        

        // Set not connected
        this._connected = false;
    }

    /**
     * PROPERTIES AND FUNCTIONS
     * You can get and set some of the properties and call some useful functions.
     */

    /**
     * Gets the list of columns. The columns attribute is a string of integer values that give the column
     * sizes in percentages. This gets the same information but as a list of integer numbers. They will all add
     * up to 100.
     * @return {int[]} A list of column percentage values (integers).
     */
    get columns() {
        // Create column list
        let columnList = [];

        // For each column percentage
        this._columnPercentageList.forEach((columnPercentage) => {
            // Convert into an integer and add to list
            columnList.push(parseInt(columnPercentage));
        });

        // Return the column list
        return columnList;
    }

    /**
     * Sets the list of columns. You may need to manual set the number and size of columns to be shown. You can
     * do this by passing a list of integers that related to the column percentage sizes. Make sure all the numbers
     * add up to 100.
     * @param {int[]} value List of column percentage values. This is not validated, so make sure it is correct.
     */
    set columns(value) {
        // Clear column percentage list
        this._columnPercentageList = [];

        // For each value
        value.forEach((columnPercentage) => {
            // Convert to string and add to list
            this._columnPercentageList.push(columnPercentage.toFixed(0));
        });

        // Set the columns attribute
        this.setAttribute('columns', this._columnPercentageList.join(', '));

        // Update the grid
        this._gridUpdate();

        // Update the setup
        this._setupUpdate();
    }

    /**
     * Gets the list of rows. The rows attribute is a string of integer values that give the row
     * sizes in percentages. This gets the same information but as a list of integer numbers. They will all add
     * up to 100.
     * @return {int[]} A list of row percentage values (integers).
     */
    get rows() {
        // Create row list
        let rowList = [];

        // For each row percentage
        this._rowPercentageList.forEach((rowPercentage) => {
            // Convert into an integer and add to list
            rowList.push(parseInt(rowPercentage));
        });

        // Return the row list
        return rowList;
    }

    /**
     * Sets the list of rows. You may need to manual set the number and size of rows to be shown. You can
     * do this by passing a list of integers that related to the row percentage sizes. Make sure all the numbers
     * add up to 100.
     * @param {int[]} value List of row percentage values. This is not validated, so make sure it is correct.
     */
    set rows(value) {
        // Clear row percentage list
        this._rowPercentageList = [];

        // For each value
        value.forEach((rowPercentage) => {
            // Convert to string and add to list
            this._rowPercentageList.push(rowPercentage.toFixed(0));
        });

        // Set the rows attribute
        this.setAttribute('rows', this._rowPercentageList.join(', '));

        // Update the grid
        this._gridUpdate();

        // Update the setup
        this._setupUpdate();
    }

    /**
     * When the user selects to add a new cell, it is highlighted, and the "add" event is fired. The highlighted
     * cell is unhighlighted when a new cell slot element is added. But if the user changes their mind and wants
     * to cancel the adding of a new cell, then you need to cancel the add process, which will unhighlight the cell.
     */
    cancelAdd() {
        // Remove the adding class from the base element
        this._baseElement.classList.remove('adding');
    }

    /**
     * GRID
     * The grid area is what is shown when the user is not setting up how the grid looks. It shows the
     * slot cells in the locations required. This will always be shown in the background when the user
     * is setting up the grid.
     */

    /**
     * Create the grid parts. This takes the "columns" and "rows" attributes, and places the default slots
     * into the correct places.
     */
    _gridCreate() {
        // Get columns
        let columns = '100';
        if (this.hasAttribute('columns') === true) columns = this.getAttribute('columns');

        // Convert into list of column percentage amount
        this._columnPercentageList = columns.split(',');

        // Get rows
        let rows = '100';
        if (this.hasAttribute('rows') === true) rows = this.getAttribute('rows');

        // Convert into list of row percentage amount
        this._rowPercentageList = rows.split(',');

        // Update the grid CSS style grid template
        this._gridUpdate();

        // The next part is to set all the default slot elements to be placed in the required grid location. This
        // is down by setting their CSS style grid-column and row parts

        // Get the list of cell slot elements
        this._cellSlotElementList = this._cellSlotElement.assignedElements();

        // For each cell slot element
        this._cellSlotElementList.forEach((cellSlotElement) => {
            // Set the attribute parts
            let column = 0;
            let row = 0;
            let columnSpan = 1;
            let rowSpan = 1;

            // Get the attribute parts if they are set
            if (cellSlotElement.hasAttribute('column') === true) column = parseInt(cellSlotElement.getAttribute('column'));
            if (cellSlotElement.hasAttribute('row') === true) row = parseInt(cellSlotElement.getAttribute('row'));
            if (cellSlotElement.hasAttribute('colspan') === true) columnSpan = parseInt(cellSlotElement.getAttribute('colspan'));
            if (cellSlotElement.hasAttribute('rowspan') === true) rowSpan = parseInt(cellSlotElement.getAttribute('rowspan'));

            // Set the CSS style that puts the cell inside the grid

            // If no row span
            if (rowSpan === 1) {
                // Set just the row without the span part
                cellSlotElement.style.gridRow = row.toString();
            } else {
                // Set the row and the span part
                cellSlotElement.style.gridRow = row.toString() + ' / span ' + rowSpan.toString();
            }

            // If no column span
            if (columnSpan === 1) {
                // Set just the column without the span part
                cellSlotElement.style.gridColumn = column.toString();
            } else {
                // Set the column and the span part
                cellSlotElement.style.gridColumn = column.toString() + ' / span ' + columnSpan.toString();
            }
        });
    }

    /**
     * Update the grid's outer grid template CSS styles.
     */
    _gridUpdate() {
        // Create the CSS style parts for the grid
        let templateColumnsList = [];
        let templateRowsList = [];

        // For each column percentage
        this._columnPercentageList.forEach((columnPercentage) => {
            // Add to template as a percentage
            templateColumnsList.push(columnPercentage + '%');
        });

        // For each row percentage
        this._rowPercentageList.forEach((rowPercentage) => {
            // Add to template as a percentage
            templateRowsList.push(rowPercentage + '%');
        });

        // Set the grid CSS style of the template columns and rows
        this._gridElement.style.gridTemplateColumns = templateColumnsList.join(' ');
        this._gridElement.style.gridTemplateRows = templateRowsList.join(' ');
    }

    /**
     * SETUP
     * The setup parts are used to control the size, number and cell areas.
     */

    /**
     * Update the current setup. This controls what happens when the edit mode changes.
     */
    _setupUpdate() {
        // Remove size, number and cell areas (if they are being shown)
        this._sizeRemove();
        this._numberRemove();
        this._blockRemove();
        this._selectRemove();

        // Set default edit mode to size
        let editMode = 'size';

        // If no edit mode (it has been turned off)
        if (this.hasAttribute('edit-mode') === false) {
            // If there is no menu attribute
            if (this.hasAttribute('menu') === false) return;
        } else {
            // Get edit mode
            editMode = this.getAttribute('edit-mode').trim().toLowerCase();
        }

        // If edit mode is size
        if (editMode === 'size') this._sizeCreate();

        // If edit mode is number
        if (editMode === 'number') this._numberCreate();

        // If edit mode is block
        if (editMode === 'block') this._blockCreate();

        // If edit mode is select
        if (editMode === 'select') this._selectCreate();

        // If no menu attribute
        if (this.hasAttribute('menu') === false) {
            // Remove the menu
            this._menuRemove();
        }
    }

    /**
     * Setup cell slot change event.
     * @param {Object} event The slot change event information.
     */
    _setupCellSlotChanged(event) {
        // Remove the adding class from the base element
        this._baseElement.classList.remove('adding');

        // Create the grid from scratch
        this._gridCreate();

        // Remove size, number and cell areas (if they are being shown)
        this._sizeRemove();
        this._numberRemove();
        this._blockRemove();

        // Set default edit mode to size
        let editMode = 'size';

        // If no edit mode (it has been turned off)
        if (this.hasAttribute('edit-mode') === false) {
            // If there is no menu attribute
            if (this.hasAttribute('menu') === false) return;
        } else {
            // Get edit mode
            editMode = this.getAttribute('edit-mode').trim().toLowerCase();
        }

        // If edit mode is size
        if (editMode === 'size') this._sizeCreate();

        // If edit mode is number
        if (editMode === 'number') this._numberCreate();

        // If edit mode is block
        if (editMode === 'block') this._blockCreate();
    }

    /**
     * Remove one of the cell slot elements.
     * @param {Number} column The cell slot element's column value to look for.
     * @param {Number} row The cell slot element's row value to look for.
     */
    _setupRemoveCellSlot(column, row) {
        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(column, row);

        // Create add event
        const addEvent = new CustomEvent(
            'removed',
            {
                detail: {
                    id: cellSlotElement.id,
                    row: row,
                    column: column
                }
            }
        );

        // Remove the cell slot element from the web component
        this.removeChild(cellSlotElement);

        // Dispatch the event
        this.dispatchEvent(addEvent);
    }

    /**
     * Setup has been changed. Fire event relating to it.
     */
    _setupChanged() {
        // Create change event
        const changeEvent = new CustomEvent('changed');

        // Dispatch the event
        this.dispatchEvent(changeEvent);
    }

    /**
     * Get the cell slot element from the given column and row values.
     * @return {HTMLElement} The cell slot element or null if not found.
     */
    _setupGetCellSlotElement(column, row) {
        // For each cell slot element
        for (let index = 0; index < this._cellSlotElementList.length; index++) {
            // Get cell slot element
            const cellSlotElement = this._cellSlotElementList[index];

            // Check column
            if (cellSlotElement.hasAttribute('column') === false) continue;
            if (column !== parseInt(cellSlotElement.getAttribute('column'))) continue;

            // Check row
            if (cellSlotElement.hasAttribute('row') === false) continue;
            if (row !== parseInt(cellSlotElement.getAttribute('row'))) continue;

            // Return the found cell slot element
            return cellSlotElement;
        }

        // Return not found
        return null;
    }

    /**
     * Update the columns and rows attributes to reflect the new column and row percentages.
     */
    _setupUpdateColumnRowAttributes() {
        // Set column and row attributes
        this.setAttribute('columns', this._columnPercentageList.join(', '));
        this.setAttribute('rows', this._rowPercentageList.join(', '));
    }

    /**
     * MENU
     * If shown, this is the menu that allows the user to change the edit-mode.
     */

    /**
     * Create the menu parts.
     */
    _menuCreate() {
        // Create menu DIV element
        const menuElement = document.createElement('DIV');

        // Set the class
        menuElement.classList.add('setup-menu');

        // Set the new menu element
        this._menuElement = menuElement;

        // Add the new menu element to the base element
        this._baseElement.appendChild(this._menuElement);

        // Create menu option elements
        this._menuSizeElement = document.createElement('button');
        this._menuNumberElement = document.createElement('button');
        this._menuBlockElement = document.createElement('button');

        // Set inner HTML
        this._menuSizeElement.innerHTML = GridSetup.sizeHtml;
        this._menuNumberElement.innerHTML = GridSetup.numberHtml;
        this._menuBlockElement.innerHTML = GridSetup.blockHtml;

        // Add to option menu element
        this._menuElement.appendChild(this._menuSizeElement);
        this._menuElement.appendChild(this._menuNumberElement);
        this._menuElement.appendChild(this._menuBlockElement);

        // Add menu events
        this._menuAddMenuEvents();

        // Set menu as not open
        this._menuOpen = false;
    }

    /**
     * Add the menu events.
     */
    _menuAddMenuEvents() {
        // Add menu click events
        this._menuSizeElement.addEventListener('click', this._menuSizeClickEvent);
        this._menuNumberElement.addEventListener('click', this._menuNumberClickEvent);
        this._menuBlockElement.addEventListener('click', this._menuBlockClickEvent);
    }

    /**
     * Removes the menu parts. This removes the elements and any events linked to them.
     */
    _menuRemove() {
        // If there is no menu element
        if (!this._menuElement) return;

        // Remove the menu events
        this._menuRemoveMenuEvents();

        // Remove the menu element from the base element
        this._baseElement.removeChild(this._menuElement);

        // Clear the menu element
        this._menuElement = undefined;

        // Reset current menu parts
        this._menuCurrentSelected = '';
        this._menuCurrentMenu = '';
    }

    /**
     * Remove the menu events.
     */
    _menuRemoveMenuEvents() {
        // Remove menu click events
        this._menuSizeElement.removeEventListener('click', this._menuSizeClickEvent);
        this._menuNumberElement.removeEventListener('click', this._menuNumberClickEvent);
        this._menuBlockElement.removeEventListener('click', this._menuBlockClickEvent);
    }

    /**
     * Menu size click event.
     * @param {object} event The click event information.
     */
    _menuSizeClickEvent(event) {
        // If menu is not open
        if (this._menuOpen === false) {
            // Set menu as open
            this._menuOpen = true;

            // Add the menu element class as open
            this._menuElement.classList.add('open');
        } else {
            // Set menu as not open
            this._menuOpen = false;

            // Remove the menu element class as open
            this._menuElement.classList.remove('open');

            // Change the edit mode to size
            this.setAttribute('edit-mode', 'size');

            // Update the menu
            this._menuUpdateMenu();
        }
    }

    /**
     * Menu number click event.
     * @param {object} event The click event information.
     */
    _menuNumberClickEvent(event) {
        // If menu is not open
        if (this._menuOpen === false) {
            // Set menu as open
            this._menuOpen = true;

            // Add the menu element class as open
            this._menuElement.classList.add('open');
        } else {
            // Set menu as not open
            this._menuOpen = false;

            // Remove the menu element class as open
            this._menuElement.classList.remove('open');

            // Change the edit mode to number
            this.setAttribute('edit-mode', 'number');

            // Update the menu
            this._menuUpdateMenu();
        }
    }

    /**
     * Menu block click event.
     * @param {object} event The click event information.
     */
    _menuBlockClickEvent(event) {
        // If menu is not open
        if (this._menuOpen === false) {
            // Set menu as open
            this._menuOpen = true;

            // Add the menu element class as open
            this._menuElement.classList.add('open');
        } else {
            // Set menu as not open
            this._menuOpen = false;

            // Remove the menu element class as open
            this._menuElement.classList.remove('open');

            // Change the edit mode to block
            this.setAttribute('edit-mode', 'block');

            // Update the menu
            this._menuUpdateMenu();
        }
    }

    /**
     * Update the menu shown.
     */
    _menuUpdateMenu() {
        // If there is no menu element
        if (!this._menuElement) return;

        // Get edit mode to the default size
        let editMode = 'size';

        // If has edit-mode attribute
        if (this.hasAttribute('edit-mode') === true) editMode = this.getAttribute('edit-mode').trim().toLowerCase();

        // If something has changed
        if (this._menuCurrentSelected !== editMode) {
            // Reset current selected option
            this._menuCurrentSelected = editMode;

            // Clear selected class
            this._menuSizeElement.classList.remove('selected');
            this._menuNumberElement.classList.remove('selected');
            this._menuBlockElement.classList.remove('selected');

            // If edit mode is size
            if (editMode === 'size') this._menuSizeElement.classList.add('selected');

            // If edit mode is number
            if (editMode === 'number') this._menuNumberElement.classList.add('selected');

            // If edit mode is block
            if (editMode === 'block') this._menuBlockElement.classList.add('selected');
        }

        // Get menu type
        let menu = this.getAttribute('menu').trim().toLowerCase();

        // If edit mode is number
        if (editMode === 'number') {
            // Do we need to swap menu location
            if (this._numberRotationMode === 0 && this._numberCurrentColumn === 1 && menu === 'top-left') menu = 'top-right';
            else if (this._numberRotationMode === 0 && this._numberCurrentColumn === 1 && menu === 'bottom-left') menu = 'bottom-right';
            else if (this._numberRotationMode === 0 && this._numberCurrentColumn === this._columnPercentageList.length && menu === 'top-right') menu = 'top-left';
            else if (this._numberRotationMode === 0 && this._numberCurrentColumn === this._columnPercentageList.length && menu === 'bottom-right') menu = 'bottom-left';
            else if (this._numberRotationMode === 1 && this._numberCurrentRow === 1 && menu === 'top-left') menu = 'bottom-left';
            else if (this._numberRotationMode === 1 && this._numberCurrentRow === 1 && menu === 'top-right') menu = 'bottom-right';
            else if (this._numberRotationMode === 1 && this._numberCurrentRow === this._rowPercentageList.length && menu === 'bottom-left') menu = 'top-left';
            else if (this._numberRotationMode === 1 && this._numberCurrentRow === this._rowPercentageList.length && menu === 'bottom-right') menu = 'top-right';
        }

        // If edit mode is block
        if (editMode === 'block') {
            if (this._blockCurrentCellColumn === 1 && this._blockCurrentCellRow === 1 && menu === 'top-left') menu = 'top-right';
            else if (this._blockCurrentCellColumn === this._columnPercentageList.length && this._blockCurrentCellRow === 1 && menu === 'top-right') menu = 'top-left';
            else if (this._blockCurrentCellColumn === 1 && this._blockCurrentCellRow === this._rowPercentageList.length && menu === 'bottom-left') menu = 'bottom-right';
            else if (this._blockCurrentCellColumn === this._columnPercentageList.length && this._blockCurrentCellRow === this._rowPercentageList.length && menu === 'bottom-right') menu = 'bottom-left';
            else if (this._blockCurrentTileColumn === 1 && this._blockCurrentTileRow === 1 && menu === 'top-left') menu = 'top-right';
            else if (
                this._blockCurrentTileColumn + this._blockCurrentTileColumnSpan - 1 === this._columnPercentageList.length &&
                this._blockCurrentTileRow === 1 &&
                menu === 'top-right') menu = 'top-left';
            else if (
                this._blockCurrentTileColumn === 1 &&
                this._blockCurrentTileRow + this._blockCurrentTileRowSpan - 1 === this._rowPercentageList.length &&
                menu === 'bottom-left') menu = 'bottom-right';
            else if (
                this._blockCurrentTileColumn + this._blockCurrentTileColumnSpan - 1 === this._columnPercentageList.length &&
                this._blockCurrentTileRow + this._blockCurrentTileRowSpan - 1 === this._rowPercentageList.length &&
                menu === 'bottom-right') menu = 'bottom-left';
        }

        // If something has changed
        if (this._menuCurrentMenu !== menu) {
            // Reset current menu
            this._menuCurrentMenu = menu;

            // Remove classes
            this._menuElement.classList.remove('top-left');
            this._menuElement.classList.remove('top-right');
            this._menuElement.classList.remove('bottom-left');
            this._menuElement.classList.remove('bottom-right');

            // Set menu type class
            this._menuElement.classList.add(menu);
        }
    }

    /**
     * SIZE
     * The size area allows the user to resize the columns and rows. It shows bars they can drag left/right or
     * up/down. It shows percentage values too.
     */

    /**
     * Create the size parts.
     */
    _sizeCreate() {
        // Create size DIV element
        const sizeElement = document.createElement('DIV');

        // Set the class
        sizeElement.classList.add('size');

        // Update the size grid template CSS styling
        this._sizeUpdateGridTemplate(sizeElement);

        // Create the size adjustment bars
        this._sizeCreateAdjustmentBars(sizeElement);

        // Add the size adjustment bar events
        this._sizeAddAdjustmentBarEvents();

        // Create the size adjustment labels
        this._sizeCreateAdjustmentLabels(sizeElement);

        // Set the new size element
        this._sizeElement = sizeElement;

        // Add the new size element to the base element
        this._baseElement.appendChild(this._sizeElement);
    }

    /**
     * Update the size's outer grid template CSS styles.
     * @param {HTMLElement} sizeElement The size element to set.
     */
    _sizeUpdateGridTemplate(sizeElement) {
        // We need to have a column and row that has 1rem gaps for the adjustment bars
        // but not around the outside edge

        // If only 1 column
        if (this._columnPercentageList.length === 1) sizeElement.style.gridTemplateColumns = '100%';

        // If only 1 row
        if (this._rowPercentageList.length === 1) sizeElement.style.gridTemplateRows = '100%';

        // If more than 1 column
        if (this._columnPercentageList.length > 1) {
            // Set template column list
            let templateColumnsList = [];

            // For each column percentage
            for (let index = 0; index < this._columnPercentageList.length; index++) {
                // Get percentage text
                const percentageText = this._columnPercentageList[index];

                // Set gap offset
                let gapOffset = '1rem';
                if (index === 0 || index + 1 === this._columnPercentageList.length) gapOffset = '0.5rem';

                // Add to template as a percentage
                templateColumnsList.push(
                    'calc(' +
                    percentageText + '% - ' +
                    gapOffset +
                    ')');

                // If the last in the list
                if (index + 1 === this._columnPercentageList.length) break;

                // Add an adjustment bar
                templateColumnsList.push('1rem');
            }

            // Set the size CSS style of the template columns
            sizeElement.style.gridTemplateColumns = templateColumnsList.join(' ');
        }

        // If more than 1 row
        if (this._rowPercentageList.length > 1) {
            // Set template row list
            let templateRowsList = [];

            // For each row percentage
            for (let index = 0; index < this._rowPercentageList.length; index++) {
                // Get percentage text
                const percentageText = this._rowPercentageList[index];

                // Set gap offset
                let gapOffset = '1rem';
                if (index === 0 || index + 1 === this._rowPercentageList.length) gapOffset = '0.5rem';

                // Add to template as a percentage
                templateRowsList.push(
                    'calc(' +
                    percentageText + '% - ' +
                    gapOffset +
                    ')');

                // If the last in the list
                if (index + 1 === this._rowPercentageList.length) break;

                // Add an adjustment bar
                templateRowsList.push('1rem');
            }

            // Set the size CSS style of the template rows
            sizeElement.style.gridTemplateRows = templateRowsList.join(' ');
        }
    }

    /**
     * Create the size's adjustment bars. These are the inner bars that allow the user to adjust the size
     * of the columns and rows.
     * @param {HTMLElement} sizeElement The size element to set.
     */
    _sizeCreateAdjustmentBars(sizeElement) {
        // We do not want to include the first and last lines, only the inner ones

        // Add column bars first

        // Create column adjustment bar element list
        this._sizeColumnBarList = [];

        // For each inner column
        for (let column = 1; column < this._columnPercentageList.length; column++) {
            // Create column bar object
            let columnBar = {};
            columnBar.column = column;
            columnBar.barElementList = [];

            // For each row
            for (let row = 0; row < this._rowPercentageList.length; row++) {
                // Create adjustment bar element
                let adjustmentBarElement = document.createElement('DIV');

                // Set class
                adjustmentBarElement.classList.add('adjustment-bar');
                adjustmentBarElement.classList.add('adjustment-bar-column');

                // Set grid column and row
                const gridColumn = column * 2;
                const gridRow = (row * 2) + 1;

                // Set CSS styles
                adjustmentBarElement.style.gridColumn = gridColumn.toString();
                adjustmentBarElement.style.gridRow = gridRow.toString();
                
                // Set grid size values
                adjustmentBarElement.gridSizeType = 0;
                adjustmentBarElement.gridSizeColumn = column - 1;
                adjustmentBarElement.gridSizeRow = row;

                // Append to size element
                sizeElement.appendChild(adjustmentBarElement);

                // Add to column bar element list
                columnBar.barElementList.push(adjustmentBarElement);
            }

            // Add to column bar list
            this._sizeColumnBarList.push(columnBar);
        }

        // Add row bars next

        // Create row adjustment bar element list
        this._sizeRowBarList = [];

        // For each inner row
        for (let row = 1; row < this._rowPercentageList.length; row++) {
            // Create row bar object
            let rowBar = {};
            rowBar.row = row;
            rowBar.barElementList = [];

            // For each column
            for (let column = 0; column < this._columnPercentageList.length; column++) {
                // Create adjustment bar element
                let adjustmentBarElement = document.createElement('DIV');

                // Set class
                adjustmentBarElement.classList.add('adjustment-bar');
                adjustmentBarElement.classList.add('adjustment-bar-row');

                // Set grid column and row
                const gridColumn = (column * 2) + 1;
                const gridRow = row * 2;

                // Set CSS styles
                adjustmentBarElement.style.gridColumn = gridColumn.toString();
                adjustmentBarElement.style.gridRow = gridRow.toString();

                // Set grid size values
                adjustmentBarElement.gridSizeType = 1;
                adjustmentBarElement.gridSizeColumn = column;
                adjustmentBarElement.gridSizeRow = row - 1;

                // Append to size element
                sizeElement.appendChild(adjustmentBarElement);

                // Add to row bar element list
                rowBar.barElementList.push(adjustmentBarElement);
            }

            // Add to row bar list
            this._sizeRowBarList.push(rowBar);
        }

        // Add the cross point elements next

        // Create cross bar element list
        this._sizeCrossBarList = [];

        // For each inner column
        for (let column = 1; column < this._columnPercentageList.length; column++) {
            // Create column bar object
            let columnBar = {};
            columnBar.column = column;
            columnBar.barElementList = [];

            // For each row
            for (let row = 1; row < this._rowPercentageList.length; row++) {
                // Create adjustment bar element
                let adjustmentBarElement = document.createElement('DIV');

                // Set class
                adjustmentBarElement.classList.add('adjustment-bar');
                adjustmentBarElement.classList.add('adjustment-bar-cross');

                // Set grid column and row
                const gridColumn = column * 2;
                const gridRow = row * 2;

                // Set CSS styles
                adjustmentBarElement.style.gridColumn = gridColumn.toString();
                adjustmentBarElement.style.gridRow = gridRow.toString();
                
                // Set grid size values
                adjustmentBarElement.gridSizeType = 2;
                adjustmentBarElement.gridSizeColumn = column - 1;
                adjustmentBarElement.gridSizeRow = row - 1;

                // Append to size element
                sizeElement.appendChild(adjustmentBarElement);

                // Add to column bar element list
                columnBar.barElementList.push(adjustmentBarElement);
            }

            // Add to cross bar list
            this._sizeCrossBarList.push(columnBar);
        }
    }

    /**
     * Create the size adjustment labels
     * @param {HTMLElement} sizeElement The size element to set.
     */
    _sizeCreateAdjustmentLabels(sizeElement) {
        // Create adjustment label elements
        this._sizeBeforeColumnAdjustmentLabelElement = document.createElement('DIV');
        this._sizeAfterColumnAdjustmentLabelElement = document.createElement('DIV');
        this._sizeBeforeRowAdjustmentLabelElement = document.createElement('DIV');
        this._sizeAfterRowAdjustmentLabelElement = document.createElement('DIV');

        // Set the styles to be hidden
        this._sizeBeforeColumnAdjustmentLabelElement.style.visibility = 'hidden';
        this._sizeAfterColumnAdjustmentLabelElement.style.visibility = 'hidden';
        this._sizeBeforeRowAdjustmentLabelElement.style.visibility = 'hidden';
        this._sizeAfterRowAdjustmentLabelElement.style.visibility = 'hidden';

        // Set grid styling
        this._sizeBeforeColumnAdjustmentLabelElement.style.alignSelf = 'start';
        this._sizeBeforeColumnAdjustmentLabelElement.style.justifySelf = 'center';
        this._sizeAfterColumnAdjustmentLabelElement.style.alignSelf = 'start';
        this._sizeAfterColumnAdjustmentLabelElement.style.justifySelf = 'center';
        this._sizeBeforeRowAdjustmentLabelElement.style.alignSelf = 'center';
        this._sizeBeforeRowAdjustmentLabelElement.style.justifySelf = 'left';
        this._sizeAfterRowAdjustmentLabelElement.style.alignSelf = 'center';
        this._sizeAfterRowAdjustmentLabelElement.style.justifySelf = 'left';

        // Set the class
        this._sizeBeforeColumnAdjustmentLabelElement.classList.add('adjustment-label');
        this._sizeAfterColumnAdjustmentLabelElement.classList.add('adjustment-label');
        this._sizeBeforeRowAdjustmentLabelElement.classList.add('adjustment-label');
        this._sizeAfterRowAdjustmentLabelElement.classList.add('adjustment-label');

        // Add to size element
        sizeElement.appendChild(this._sizeBeforeColumnAdjustmentLabelElement);
        sizeElement.appendChild(this._sizeAfterColumnAdjustmentLabelElement);
        sizeElement.appendChild(this._sizeBeforeRowAdjustmentLabelElement);
        sizeElement.appendChild(this._sizeAfterRowAdjustmentLabelElement);
    }

    /**
     * Go through all the adjustments bars and add the required events.
     */
    _sizeAddAdjustmentBarEvents() {
        // For each column bar
        this._sizeColumnBarList.forEach((columnBar) => {
            // For each bar element
            columnBar.barElementList.forEach((barElement) => {
                // Add the pointer events functions
                barElement.addEventListener('pointerdown', this._sizePointerDownEvent);
                barElement.addEventListener('pointerup', this._sizePointerUpEvent);
                barElement.addEventListener('pointermove', this._sizePointerMoveEvent);
            });
        });

        // For each row bar
        this._sizeRowBarList.forEach((rowBar) => {
            // For each bar element
            rowBar.barElementList.forEach((barElement) => {
                // Add the pointer events functions
                barElement.addEventListener('pointerdown', this._sizePointerDownEvent);
                barElement.addEventListener('pointerup', this._sizePointerUpEvent);
                barElement.addEventListener('pointermove', this._sizePointerMoveEvent);
            });
        });

        // For each cross bar
        this._sizeCrossBarList.forEach((crossBar) => {
            // For each bar element
            crossBar.barElementList.forEach((barElement) => {
                // Add the pointer events functions
                barElement.addEventListener('pointerdown', this._sizePointerDownEvent);
                barElement.addEventListener('pointerup', this._sizePointerUpEvent);
                barElement.addEventListener('pointermove', this._sizePointerMoveEvent);
            });
        });
    }

    /**
     * Removes the size parts. This removes the elements and any events linked to them.
     */
    _sizeRemove() {
        // If there is no size element
        if (!this._sizeElement) return;

        // Remove all the adjustment bar events
        this._sizeRemoveAdjustmentBarEvents();

        // Remove the size element from the base element
        this._baseElement.removeChild(this._sizeElement);

        // Clear the size element
        this._sizeElement = undefined;
    }

    /**
     * Go through all the adjustments bars and remove the events.
     */
    _sizeRemoveAdjustmentBarEvents() {
        // For each column bar
        this._sizeColumnBarList.forEach((columnBar) => {
            // For each row
            columnBar.barElementList.forEach((barElement) => {
                // Remove the pointer events functions
                barElement.removeEventListener('pointerdown', this._sizePointerDownEvent);
                barElement.removeEventListener('pointerup', this._sizePointerUpEvent);
                barElement.removeEventListener('pointermove', this._sizePointerMoveEvent);
            });
        });

        // For each row bar
        this._sizeRowBarList.forEach((rowBar) => {
            // For each bar element
            rowBar.barElementList.forEach((barElement) => {
                // Remove the pointer events functions
                barElement.addEventListener('pointerdown', this._sizePointerDownEvent);
                barElement.addEventListener('pointerup', this._sizePointerUpEvent);
                barElement.addEventListener('pointermove', this._sizePointerMoveEvent);
            });
        });

        // For each cross bar
        this._sizeCrossBarList.forEach((crossBar) => {
            // For each bar element
            crossBar.barElementList.forEach((barElement) => {
                // Add the pointer events functions
                barElement.removeEventListener('pointerdown', this._sizePointerDownEvent);
                barElement.removeEventListener('pointerup', this._sizePointerUpEvent);
                barElement.removeEventListener('pointermove', this._sizePointerMoveEvent);
            });
        });
    }

    /**
     * Size pointer down event.
     * @param {Object} event The pointer down event data.
     */
    _sizePointerDownEvent(event) {
        // Set to capture all pointer movements (even outside target element)
        event.target.setPointerCapture(event.pointerId);

        // Set pointer down
        this._pointerDown = true;

        // Get grid size values
        const type = event.target.gridSizeType;
        const column = event.target.gridSizeColumn;
        const row = event.target.gridSizeRow;

        // Heighlight the adjustment bars
        this._sizeHighlightAdjustmentBar(type, column, row);

        // Update the adjustment labels
        this._sizeUpdateAdjustmentLabel(type, column, row);

        // Set mouse starting parts
        this._mouseStartX = event.clientX;
        this._mouseStartY = event.clientY;

        // Set before column element
        let beforeColumnElement = null;
        if ((type === 0 || type === 2) && column > 0) beforeColumnElement = this._sizeColumnBarList[column - 1].barElementList[row];

        // Set after column element
        let afterColumnElement = null;
        if ((type === 0 || type === 2) && column + 1 < this._sizeColumnBarList.length) afterColumnElement = this._sizeColumnBarList[column + 1].barElementList[row];

        // Set before row element
        let beforeRowElement = null;
        if ((type === 1 || type === 2) && row > 0) beforeRowElement = this._sizeRowBarList[row - 1].barElementList[column];

        // Set after row element
        let afterRowElement = null;
        if ((type === 1 || type === 2) && row + 1 < this._sizeRowBarList.length) afterRowElement = this._sizeRowBarList[row + 1].barElementList[column];

        // Set column width and start
        this._columnWidth = 0;
        this._columnStart = 0;
        if (beforeColumnElement !== null && afterColumnElement !== null) {
            // Set the width between the before and after adjustment bars
            this._columnWidth = afterColumnElement.offsetLeft - beforeColumnElement.offsetLeft;
            this._columnStart = beforeColumnElement.offsetLeft + (beforeColumnElement.offsetWidth / 2); 
        } else if (beforeColumnElement === null && afterColumnElement !== null) {
            // Set the width between start and after adjustment bar
            this._columnWidth = afterColumnElement.offsetLeft + (afterColumnElement.offsetWidth / 2);
            this._columnStart = 0;
        } else if (beforeColumnElement !== null && afterColumnElement === null) {
            // Set the width between the parent right and before adjustment bar
            this._columnWidth = this._sizeElement.offsetWidth - beforeColumnElement.offsetLeft -  + (beforeColumnElement.offsetWidth / 2);
            this._columnStart = beforeColumnElement.offsetLeft + (beforeColumnElement.offsetWidth / 2);
        } else if (beforeColumnElement === null && afterColumnElement === null) {
            // Set the width for the whole width
            this._columnWidth = this._sizeElement.offsetWidth;
            this._columnStart = this._sizeElement.offsetLeft;
        }

        // Set row height and start
        this._rowHeight = 0;
        this._rowStart = 0;
        if (beforeRowElement !== null && afterRowElement !== null) {
            // Set the height between the before and after adjustment bars
            this._rowHeight = afterRowElement.offsetTop - beforeRowElement.offsetTop;
            this._rowStart = beforeRowElement.offsetTop + (beforeRowElement.offsetHeight / 2); 
        } else if (beforeRowElement === null && afterRowElement !== null) {
            // Set the height between start and after adjustment bar
            this._rowHeight = afterRowElement.offsetTop + (afterRowElement.offsetHeight / 2);
            this._rowStart = 0;
        } else if (beforeRowElement !== null && afterRowElement === null) {
            // Set the height between the parent bottom and before adjustment bar
            this._rowHeight = this._sizeElement.offsetHeight - beforeRowElement.offsetTop -  + (beforeRowElement.offsetHeight / 2);
            this._rowStart = beforeRowElement.offsetTop + (beforeRowElement.offsetHeight / 2);
        } else if (beforeRowElement === null && afterRowElement === null) {
            // Set the height for the whole height
            this._rowHeight = this._sizeElement.offsetHeight;
            this._rowStart = this._sizeElement.offsetTop;
        }

        // Set column before and after percentages
        let beforeColumnPercentage = 0;
        if (type === 0 || type === 2) beforeColumnPercentage = parseInt(this._columnPercentageList[column]);
        let afterColumnPercentage = 0;
        if (type === 0 || type === 2) afterColumnPercentage = parseInt(this._columnPercentageList[column + 1]);

        // Set row before and after percentages
        let beforeRowPercentage = 0;
        if (type === 1 || type === 2) beforeRowPercentage = parseInt(this._rowPercentageList[row]);
        let afterRowPercentage = 0;
        if (type === 1 || type === 2) afterRowPercentage = parseInt(this._rowPercentageList[row + 1]);

        // Set percentage lengths
        this._startColumnPercentage = beforeColumnPercentage + afterColumnPercentage;
        this._startRowPercentage = beforeRowPercentage + afterRowPercentage;

        // Set target center parts
        this._targetCenterX = event.target.offsetLeft + (event.target.offsetWidth / 2);
        this._targetCenterY = event.target.offsetTop + (event.target.offsetHeight / 2);
    }

    /**
     * Size pointer up event.
     * @param {Object} event The pointer up event data.
     */
    _sizePointerUpEvent(event) {
        // Stop capturing the pointer movements
        event.target.releasePointerCapture(event.pointerId);

        // Set pointer not down
        this._pointerDown = false;

        // Get grid size values
        const column = event.target.gridSizeColumn;
        const row = event.target.gridSizeRow;

        // Un-highlight the adjustment bars
        this._sizeHighlightAdjustmentBar(-1, column, row);

        // Update the adjustment labels
        this._sizeUpdateAdjustmentLabel(-1, column, row);

        // Update the grid's CSS grid template parts
        this._gridUpdate();

        // Update the columns and rows attributes
        this._setupUpdateColumnRowAttributes();

        // Send changed event
        this._setupChanged();
    }

    /**
     * Size pointer move event.
     * @param {Object} event The pointer move event data.
     */
    _sizePointerMoveEvent(event) {
        // If pointer not down
        if (this._pointerDown === false) return;

        // Get grid size values
        const type = event.target.gridSizeType;
        const column = event.target.gridSizeColumn;
        const row = event.target.gridSizeRow;

        // Get parent's rect
        const parentRect = this._sizeElement.getBoundingClientRect();

        // Set mouse X and Y parts in relation to the parent
        let relativeX = event.clientX - parentRect.left;
        let relativeY = event.clientY - parentRect.top;

        // Set moved x and y
        const movedX = relativeX + parentRect.left - this._mouseStartX;
        const movedY = relativeY + parentRect.top - this._mouseStartY;

        // Set update required
        let updateRequired = false;

        // If looking at column
        if (type === 0 || type === 2) {
            // Set before X
            let beforeX = (this._targetCenterX + movedX - this._columnStart) / this._columnWidth;

            // Set before and after percentage (rounding to 0 decimal points)
            let beforePercentage = Math.round(this._startColumnPercentage * beforeX);
            let afterPercentage = this._startColumnPercentage - beforePercentage;

            // Check limits
            if (beforePercentage >= 10 &&
                beforePercentage <= 90 &&
                afterPercentage >= 10 &&
                afterPercentage <= 90) {
                // If something has changed
                if (parseInt(this._columnPercentageList[column]) !== beforePercentage) {
                    // Set the new column percentage parts
                    this._columnPercentageList[column] = beforePercentage.toFixed(0);
                    this._columnPercentageList[column + 1] = afterPercentage.toFixed(0);

                    // Set update required
                    updateRequired = true;
                }
            }
        }

        // If looking at row
        if (type === 1 || type === 2) {
            // Set before Y
            let beforeY = (this._targetCenterY + movedY - this._rowStart) / this._rowHeight;

            // Set before and after percentage (rounding to 2 decimal points)
            let beforePercentage = Math.round(this._startRowPercentage * beforeY * 100);
            beforePercentage = Math.floor(beforePercentage / 100);
            let afterPercentage = this._startRowPercentage - beforePercentage;

            // Check limits
            if (beforePercentage >= 10 &&
                beforePercentage <= 90 &&
                afterPercentage >= 10 &&
                afterPercentage <= 90) {
                // If something has changed
                if (parseInt(this._rowPercentageList[row]) !== beforePercentage) {
                    // Set the new row percentage parts
                    this._rowPercentageList[row] = beforePercentage.toFixed(0);
                    this._rowPercentageList[row + 1] = afterPercentage.toFixed(0);

                    // Set update required
                    updateRequired = true;
                }
            }
        }

        // If update is not required
        if (updateRequired === false) return;

        // Update the size's grid template CSS style
        this._sizeUpdateGridTemplate(this._sizeElement);

        // Update the adjustment labels
        this._sizeUpdateAdjustmentLabel(type, column, row);
    }

    /**
     * Update the size adjustment bars to highlight some and reset others.
     * @param {Number} type The type to highlight (0=column, 1=row, 2=both, -1=clear).
     * @param {Number} column The column to highlight (if type is 0).
     * @param {Number} row The row to highlight (if type is 1).
     */
    _sizeHighlightAdjustmentBar(type, column, row) {
        // For each column bar
        this._sizeColumnBarList.forEach((columnBar) => {
            // For each bar element
            columnBar.barElementList.forEach((barElement) => {
                // Remove the adjustment-bar-highlight class
                barElement.classList.remove('adjustment-bar-highlight');
            });
        });

        // For each row bar
        this._sizeRowBarList.forEach((rowBar) => {
            // For each bar element
            rowBar.barElementList.forEach((barElement) => {
                // Remove the adjustment-bar-highlight class
                barElement.classList.remove('adjustment-bar-highlight');
            });
        });

        // If type is column or both
        if (type === 0 || type === 2) {
            // Get column
            const columnBar = this._sizeColumnBarList[column];

            // For each bar element
            columnBar.barElementList.forEach((barElement) => {
                // Add the adjustment-bar-highlight class
                barElement.classList.add('adjustment-bar-highlight');
            });
        }

        // If type is row or both
        if (type === 1 || type === 2) {
            // Get row
            const rowBar = this._sizeRowBarList[row];

            // For each bar element
            rowBar.barElementList.forEach((barElement) => {
                // Add the adjustment-bar-highlight class
                barElement.classList.add('adjustment-bar-highlight');
            });
        }
    }

    /**
     * Update the size adjustment labels.
     * @param {Number} type The type to show (0=column, 1=row, 2=both, -1=clear).
     * @param {Number} column The column to highlight (if type is 0).
     * @param {Number} row The row to highlight (if type is 1).
     */
    _sizeUpdateAdjustmentLabel(type, column, row) {
        // If type of column
        if (type === 0 || type === 2) {
            // Set before adjustment label parts
            this._sizeBeforeColumnAdjustmentLabelElement.style.gridColumn = (column * 2) + 1;
            this._sizeBeforeColumnAdjustmentLabelElement.style.gridRow = 1;
            this._sizeBeforeColumnAdjustmentLabelElement.innerText = this._columnPercentageList[column].trim() + '%';
            this._sizeBeforeColumnAdjustmentLabelElement.style.visibility = 'visible';

            // Set after adjustment label parts
            this._sizeAfterColumnAdjustmentLabelElement.style.gridColumn = (column * 2) + 3;
            this._sizeAfterColumnAdjustmentLabelElement.style.gridRow = 1;
            this._sizeAfterColumnAdjustmentLabelElement.innerText = this._columnPercentageList[column + 1].trim() + '%';
            this._sizeAfterColumnAdjustmentLabelElement.style.visibility = 'visible';
        } else {
            // Hide the adjustment labels
            this._sizeBeforeColumnAdjustmentLabelElement.style.visibility = 'hidden';
            this._sizeAfterColumnAdjustmentLabelElement.style.visibility = 'hidden';
        }

        // If type of row
        if (type === 1 || type === 2) {
            // Set before adjustment label parts
            this._sizeBeforeRowAdjustmentLabelElement.style.gridColumn = 1;
            this._sizeBeforeRowAdjustmentLabelElement.style.gridRow = (row * 2) + 1;
            this._sizeBeforeRowAdjustmentLabelElement.innerText = this._rowPercentageList[row].trim() + '%';
            this._sizeBeforeRowAdjustmentLabelElement.style.visibility = 'visible';

            // Set after adjustment label parts
            this._sizeAfterRowAdjustmentLabelElement.style.gridColumn = 1;
            this._sizeAfterRowAdjustmentLabelElement.style.gridRow = (row * 2) + 3;
            this._sizeAfterRowAdjustmentLabelElement.innerText = this._rowPercentageList[row + 1].trim() + '%';
            this._sizeAfterRowAdjustmentLabelElement.style.visibility = 'visible';
        } else {
            // Hide the adjustment labels
            this._sizeBeforeRowAdjustmentLabelElement.style.visibility = 'hidden';
            this._sizeAfterRowAdjustmentLabelElement.style.visibility = 'hidden';
        }
    }

    /**
     * NUMBER
     * The number area allows the user to add and remove the columns and rows.
     */

    /**
     * Create the number parts.
     */
    _numberCreate() {
        // Create number DIV element
        const numberElement = document.createElement('DIV');

        // Set the class
        numberElement.classList.add('number');

        // Set rotation mode (0=column, 1=row)
        this._numberRotationMode = 0;

        // Update the number grid template CSS styling
        this._numberUpdateGridTemplate(numberElement);

        // Create the cells
        this._numberCreateCells(numberElement);

        // Add cell events
        this._numberAddCellEvents();

        // Create the number add/remove row/column options
        this._numberCreateOptions(numberElement);

        // Add option events
        this._numberAddOptionEvents();

        // Set the new number element
        this._numberElement = numberElement;

        // Add the new number element to the base element
        this._baseElement.appendChild(this._numberElement);
    }

    /**
     * Update the number's outer grid template CSS styles.
     * @param {HTMLElement} numberElement The number element to set.
     */
    _numberUpdateGridTemplate(numberElement) {
        // We need to have a column and row that matches the base grid

        // Create the CSS style parts for the grid
        let templateColumnsList = [];
        let templateRowsList = [];

        // For each column percentage
        for (let index = 0; index < this._columnPercentageList.length; index++) {
            // Get percentage text
            const percentageText = this._columnPercentageList[index];

            // Add to template as a percentage
            templateColumnsList.push(percentageText + '%');
        }

        // For each row percentage
        for (let index = 0; index < this._rowPercentageList.length; index++) {
            // Get percentage text
            const percentageText = this._rowPercentageList[index];

            // Add to template as a percentage
            templateRowsList.push(percentageText + '%');
        }

        // Set the number CSS style of the template columns and rows
        numberElement.style.gridTemplateColumns = templateColumnsList.join(' ');
        numberElement.style.gridTemplateRows = templateRowsList.join(' ');
    }

    /**
     * Create the number cells. Each cell in the grid needs to be selectable.
     * @param {HTMLElement} numberElement The number element to set.
     */
    _numberCreateCells(numberElement) {
        // Set cell list
        this._numberCellList = [];

        // For each column
        for (let column = 1; column <= this._columnPercentageList.length; column++) {
            // For each row
            for (let row = 1; row <= this._rowPercentageList.length; row++) {
                // Create cell element
                const cellElement = document.createElement('DIV');

                // Set class
                cellElement.classList.add('cell');

                // Set grid location
                cellElement.style.gridColumn = column;
                cellElement.style.gridRow = row;

                // Set grid number parts
                cellElement.gridNumberColumn = column;
                cellElement.gridNumberRow = row;

                // Add to cell list
                this._numberCellList.push(cellElement);

                // Add to number element
                numberElement.appendChild(cellElement);
            }
        }
    }

    /**
     * Add the cell events.
     */
    _numberAddCellEvents() {
        // For each cell
        this._numberCellList.forEach((cellElement) => {
            // Add cell click event
            cellElement.addEventListener('click', this._numberCellClickEvent);
        });
    }

    /**
     * Create the number options.
     * @param {HTMLElement} numberElement The number element to set.
     */
    _numberCreateOptions(numberElement) {
        // Create option menu element
        this._numberOptionMenuElement = document.createElement('DIV');

        // Set class
        this._numberOptionMenuElement.classList.add('menu');
        if (this._numberRotationMode === 0) {
            // Set column class
            this._numberOptionMenuElement.classList.add('column');
        } else {
            // Set row class
            this._numberOptionMenuElement.classList.add('row');
        }

        // Set the styles to be hidden
        this._numberOptionMenuElement.style.visibility = 'hidden';
        this._numberOptionMenuElement.style.gridColumn = '1';
        this._numberOptionMenuElement.style.gridRow = '1';

        // Add to number element
        numberElement.appendChild(this._numberOptionMenuElement);

        // Create menu option elements
        this._numberRotateElement = document.createElement('button');
        this._numberRemoveElement = document.createElement('button');
        this._numberArrow1Element = document.createElement('button');
        this._numberArrow2Element = document.createElement('button');

        // Set the class
        this._numberRotateElement.classList.add('rotate');
        this._numberRemoveElement.classList.add('remove');
        this._numberArrow1Element.classList.add('arrow1');
        this._numberArrow2Element.classList.add('arrow2');

        // Set inner HTML
        this._numberRotateElement.innerHTML = GridSetup.rotateHtml;
        this._numberRemoveElement.innerHTML = GridSetup.removeHtml;
        this._numberArrow1Element.innerHTML = GridSetup.arrowRowColumnHtml;
        this._numberArrow2Element.innerHTML = GridSetup.arrowRowColumnHtml;

        // Add to option menu element
        this._numberOptionMenuElement.appendChild(this._numberRotateElement);
        this._numberOptionMenuElement.appendChild(this._numberRemoveElement);
        this._numberOptionMenuElement.appendChild(this._numberArrow1Element);
        this._numberOptionMenuElement.appendChild(this._numberArrow2Element);
    }

    /**
     * Add the option events.
     */
    _numberAddOptionEvents() {
        // Add option click events
        this._numberRemoveElement.addEventListener('click', this._numberRemoveClickEvent);
        this._numberArrow1Element.addEventListener('click', this._numberArrow1ClickEvent);
        this._numberArrow2Element.addEventListener('click', this._numberArrow2ClickEvent);
        this._numberRotateElement.addEventListener('click', this._numberRotateClickEvent);
    }

    /**
     * Removes the number parts. This removes the elements and any events linked to them.
     */
    _numberRemove() {
        // If there is no number element
        if (!this._numberElement) return;

        // Remove the cell events
        this._numberRemoveCellEvents();

        // Remove the option events
        this._numberRemoveOptionEvents();

        // Remove the number element from the base element
        this._baseElement.removeChild(this._numberElement);

        // Clear the number element
        this._numberElement = undefined;

        // Reset the current column and row
        this._numberCurrentColumn = -1;
        this._numberCurrentRow = -1;
    }

    /**
     * Remove the cell events.
     */
    _numberRemoveCellEvents() {
        // For each cell
        this._numberCellList.forEach((cellElement) => {
            // Remove cell click event
            cellElement.removeEventListener('click', this._numberCellClickEvent);
        });
    }

    /**
     * Remove the option events.
     */
    _numberRemoveOptionEvents() {
        // Remove option click events
        this._numberRemoveElement.removeEventListener('click', this._numberRemoveClickEvent);
        this._numberArrow1Element.removeEventListener('click', this._numberArrow1ClickEvent);
        this._numberArrow2Element.removeEventListener('click', this._numberArrow2ClickEvent);
        this._numberRotateElement.removeEventListener('click', this._numberRotateClickEvent);
    }

    /**
     * Reset the number parts after adding or removing a column or row.
     */
    _numberReset() {
        // Remove the cell events
        this._numberRemoveCellEvents();

        // Remove the option events
        this._numberRemoveOptionEvents();

        // Create number DIV element
        const numberElement = document.createElement('DIV');

        // Set the class
        numberElement.classList.add('number');

        // Update the number grid template CSS styling
        this._numberUpdateGridTemplate(numberElement);

        // Create the cells
        this._numberCreateCells(numberElement);

        // Add cell events
        this._numberAddCellEvents();

        // Create the number add/remove row/column options
        this._numberCreateOptions(numberElement);

        // Add option events
        this._numberAddOptionEvents();

        // Remove the current number element
        this._baseElement.removeChild(this._numberElement);

        // Set the new number element
        this._numberElement = numberElement;

        // Add the new number element to the base element
        this._baseElement.appendChild(this._numberElement);

        // Set the cells
        this._numberSetCells();

        // Set the options
        this._numberSetOptions();
    }

    /**
     * Number cell click event.
     * @param {object} event The click event information.
     */
    _numberCellClickEvent(event) {
        // If the same column or row is selected
        if ((this._numberRotationMode === 0 && this._numberCurrentColumn === event.target.gridNumberColumn) ||
            (this._numberRotationMode === 1 && this._numberCurrentRow === event.target.gridNumberRow)) {
            // Reset the current column and row
            this._numberCurrentColumn = -1;
            this._numberCurrentRow = -1;
        } else {
            // Set current column and row
            this._numberCurrentColumn = event.target.gridNumberColumn;
            this._numberCurrentRow = event.target.gridNumberRow;
        }

        // Set the cells
        this._numberSetCells();

        // Set the options
        this._numberSetOptions();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();
    }

    /**
     * Number rotate click event.
     * @param {object} event The click event information.
     */
    _numberRotateClickEvent(event) {
        // If rotation mode is column
        if (this._numberRotationMode === 0) {
            // Set rotation mode to row
            this._numberRotationMode = 1;

            // Set row class and remove column class
            this._numberOptionMenuElement.classList.add('row');
            this._numberOptionMenuElement.classList.remove('column');
        } else {
            // Set rotation mode to column
            this._numberRotationMode = 0;

            // Set column class and remove row class
            this._numberOptionMenuElement.classList.add('column');
            this._numberOptionMenuElement.classList.remove('row');
        }

        // Set the cells
        this._numberSetCells();

        // Set the options
        this._numberSetOptions();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();
    }

    /**
     * Number option remove click event.
     * @param {object} event The click event information.
     */
    _numberRemoveClickEvent(event) {
        // If current column selected
        if (this._numberRotationMode === 0) {
            // Get column percentage
            const columnPercentage = parseInt(this._columnPercentageList[this._numberCurrentColumn - 1]);

            // If column is at the start
            if (this._numberCurrentColumn === 1) {
                // Get after percentage
                const afterPercentage = parseInt(this._columnPercentageList[1]);

                // Set new after percentage
                const newAfterPercentage = columnPercentage + afterPercentage;

                // Set the new after percentage
                this._columnPercentageList[1] = newAfterPercentage.toString();

                // Remove the column
                this._columnPercentageList.splice(0, 1);
            } else if (this._numberCurrentColumn === this._columnPercentageList.length) {
                // Else if column is at the end

                // Get before percentage
                const beforePercentage = parseInt(this._columnPercentageList[this._numberCurrentColumn - 2]);

                // Set new before percentage
                const newBeforePercentage = columnPercentage + beforePercentage;

                // Set the new before percentage
                this._columnPercentageList[this._numberCurrentColumn - 2] = newBeforePercentage.toString();

                // Remove the column
                this._columnPercentageList.splice(this._numberCurrentColumn - 1, 1);
            } else {
                // The column is between two other columns

                // Get before and after percentage
                const beforePercentage = parseInt(this._columnPercentageList[this._numberCurrentColumn - 2]);
                const afterPercentage = parseInt(this._columnPercentageList[this._numberCurrentColumn]);

                // Half the column percentage
                const half1 = Math.floor(columnPercentage / 2);
                const half2 = columnPercentage - half1;

                // Set the new before and after percentage
                const newBeforePercentage = beforePercentage + half1;
                const newAfterPercentage = afterPercentage + half2;

                // Set the new before and after percentages
                this._columnPercentageList[this._numberCurrentColumn - 2] = newBeforePercentage.toString();
                this._columnPercentageList[this._numberCurrentColumn] = newAfterPercentage.toString();

                // Remove the column
                this._columnPercentageList.splice(this._numberCurrentColumn - 1, 1);
            }
        }

        // If current row selected
        if (this._numberRotationMode === 1) {
            // Get row percentage
            const rowPercentage = parseInt(this._rowPercentageList[this._numberCurrentRow - 1]);

            // If row is at the start
            if (this._numberCurrentRow === 1) {
                // Get after percentage
                const afterPercentage = parseInt(this._rowPercentageList[1]);

                // Set new after percentage
                const newAfterPercentage = rowPercentage + afterPercentage;

                // Set the new after percentage
                this._rowPercentageList[1] = newAfterPercentage.toString();

                // Remove the row
                this._rowPercentageList.splice(0, 1);
            } else if (this._numberCurrentRow === this._rowPercentageList.length) {
                // Else if row is at the end

                // Get before percentage
                const beforePercentage = parseInt(this._rowPercentageList[this._numberCurrentRow - 2]);

                // Set new before percentage
                const newBeforePercentage = rowPercentage + beforePercentage;

                // Set the new before percentage
                this._rowPercentageList[this._numberCurrentRow - 2] = newBeforePercentage.toString();

                // Remove the row
                this._rowPercentageList.splice(this._numberCurrentRow - 1, 1);
            } else {
                // The row is between two other rows

                // Get before and after percentage
                const beforePercentage = parseInt(this._rowPercentageList[this._numberCurrentRow - 2]);
                const afterPercentage = parseInt(this._rowPercentageList[this._numberCurrentRow]);

                // Half the row percentage
                const half1 = Math.floor(rowPercentage / 2);
                const half2 = rowPercentage - half1;

                // Set the new before and after percentage
                const newBeforePercentage = beforePercentage + half1;
                const newAfterPercentage = afterPercentage + half2;

                // Set the new before and after percentages
                this._rowPercentageList[this._numberCurrentRow - 2] = newBeforePercentage.toString();
                this._rowPercentageList[this._numberCurrentRow] = newAfterPercentage.toString();

                // Remove the row
                this._rowPercentageList.splice(this._numberCurrentRow - 1, 1);
            }
        }

        // Update the grid's CSS grid template parts
        this._gridUpdate();

        // If rotation mode is column
        if (this._numberRotationMode === 0) {
            // Delete the column from the grid
            this._numberGridDeleteColumn(this._numberCurrentColumn);
        }

        // If rotation mode is row
        if (this._numberRotationMode === 1) {
            // Delete the row from the grid
            this._numberGridDeleteRow(this._numberCurrentRow);
        }

        // Reset the current column and row
        this._numberCurrentColumn = -1;
        this._numberCurrentRow = -1;

        // Reset the number parts
        this._numberReset();

        // Update the columns and rows attributes
        this._setupUpdateColumnRowAttributes();

        // Send changed event
        this._setupChanged();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();
    }

    /**
     * Number option arrow 1 click event.
     * @param {object} event The click event information.
     */
    _numberArrow1ClickEvent(event) {
        // Insert a column or row
        this._numberInsert();

        // Update the grid's CSS grid template parts
        this._gridUpdate();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();

        // If rotation mode is column
        if (this._numberRotationMode === 0) {
            // Adjust the grid of slot cells
            this._numberGridInsertColumn(this._numberCurrentColumn);
        }

        // If rotation mode is row
        if (this._numberRotationMode === 1) {
            // Adjust the grid of slot cells
            this._numberGridInsertRow(this._numberCurrentRow);
        }

        // Update the columns and rows attributes
        this._setupUpdateColumnRowAttributes();

        // Send changed event
        this._setupChanged();
    }

    /**
     * Number option arrow 2 click event.
     * @param {object} event The click event information.
     */
    _numberArrow2ClickEvent(event) {
        // Insert a column or row
        this._numberInsert();

        // Update the grid's CSS grid template parts
        this._gridUpdate();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();

        // If rotation mode is column
        if (this._numberRotationMode === 0) {
            // If we did not added a new column on the end
            if (this._numberCurrentColumn < this._columnPercentageList.length) {
                // Adjust the grid of slot cells
                this._numberGridInsertColumn(this._numberCurrentColumn + 1);
            }
        }

        // If rotation mode is row
        if (this._numberRotationMode === 1) {
            // If we did not added a new row on the end
            if (this._numberCurrentRow < this._rowPercentageList.length) {
                // Adjust the grid of slot cells
                this._numberGridInsertRow(this._numberCurrentRow + 1);
            }
        }

        // Update the columns and rows attributes
        this._setupUpdateColumnRowAttributes();

        // Send changed event
        this._setupChanged();
    }
   
    /**
     * Set the cells. Works out which cells are selected and not selected.
     */
    _numberSetCells() {
        // If rotation mode is column
        if (this._numberRotationMode === 0) {
            // For each cell
            this._numberCellList.forEach((cellElement) => {
                // If the same column
                if (cellElement.gridNumberColumn === this._numberCurrentColumn) {
                    // Add the selected class
                    cellElement.classList.add('selected');
                } else {
                    // Remove the selected class
                    cellElement.classList.remove('selected');
                }
            });
        }

        // If rotation mode is row
        if (this._numberRotationMode === 1) {
            // For each cell
            this._numberCellList.forEach((cellElement) => {
                // If the same row
                if (cellElement.gridNumberRow === this._numberCurrentRow) {
                    // Add the selected class
                    cellElement.classList.add('selected');
                } else {
                    // Remove the selected class
                    cellElement.classList.remove('selected');
                }
            });
        }
    }

    /**
     * Set the option location.
     */
    _numberSetOptions() {
        // If rotation mode is column
        if (this._numberRotationMode === 0) {
            // Set option menu grid parts
            this._numberOptionMenuElement.style.gridColumn = this._numberCurrentColumn.toString();
            this._numberOptionMenuElement.style.gridRow = '1 / span ' + this._rowPercentageList.length.toString();
        }

        // If rotation mode is row
        if (this._numberRotationMode === 1) {
            // Set option menu grid parts
            this._numberOptionMenuElement.style.gridColumn = '1 / span ' + this._columnPercentageList.length.toString();
            this._numberOptionMenuElement.style.gridRow = this._numberCurrentRow.toString();
        }

        // If no current column and row
        if (this._numberCurrentColumn === -1 && this._numberCurrentRow === -1) {
            // Set the option menu styles to be hidden
            this._numberOptionMenuElement.style.visibility = 'hidden';

            // Reset option menu location
            this._numberOptionMenuElement.style.gridColumn = '1';
            this._numberOptionMenuElement.style.gridRow = '1';
        } else {
            // Set the option menu styles to be visible
            this._numberOptionMenuElement.style.visibility = 'visible';
        }

        // Set hide arrow
        let hideArrow = false;

        // If rotation is column
        if (this._numberRotationMode === 0) {
            // If the percentage of the column is less than 20%
            if (parseInt(this._columnPercentageList[this._numberCurrentColumn - 1]) <= 20) {
                // Set to hide arrow
                hideArrow = true;
            }
        }

        // If rotation is row
        if (this._numberRotationMode === 1) {
            // If the percentage of the row is less than 20%
            if (parseInt(this._rowPercentageList[this._numberCurrentRow - 1]) <= 20) {
                // Set to hide arrow
                hideArrow = true;
            }
        }

        // Set hide remove
        let hideRemove = false;

        // If rotation is column
        if (this._numberRotationMode === 0) {
            // If there is only one column then we can not remove it
            if (this._columnPercentageList.length === 1) hideRemove = true;
        }

        // If rotation is row
        if (this._numberRotationMode === 1) {
            // If there is only one row then we can not remove it
            if (this._rowPercentageList.length === 1) hideRemove = true;
        }

        // Set fr list
        let frList = ['1fr'];

        // If hide arrow
        if (hideArrow === true) {
            // Set arrows display style to hide option
            this._numberArrow1Element.style.display = 'none';
            this._numberArrow2Element.style.display = 'none';
        } else {
            // Set arrows display style to show option
            this._numberArrow1Element.style.display = 'block';
            this._numberArrow2Element.style.display = 'block';

            // Add 2 button fr to the list
            frList.push('1fr');
            frList.push('1fr');
        }

        // If hide remove
        if (hideRemove === true) {
            // Set remove display style to hide option
            this._numberRemoveElement.style.display = 'none';
        } else {
            // Set remove display style to show option
            this._numberRemoveElement.style.display = 'block';

            // Add a button fr to the list
            frList.push('1fr');
        }

        // If rotation mode is column
        if (this._numberRotationMode === 0) {
            // Set option menu grid for row
            this._numberOptionMenuElement.style.gridTemplateColumns = '1fr';
            this._numberOptionMenuElement.style.gridTemplateRows = frList.join(' ');
        } else {
            // Set option menu grid for column
            this._numberOptionMenuElement.style.gridTemplateColumns = frList.join(' ');
            this._numberOptionMenuElement.style.gridTemplateRows = '1fr';
        }
    }

    /**
     * Insert a column or row before or after the current column or row.
     */
    _numberInsert() {
        // If rotation is column
        if (this._numberRotationMode === 0) {
            // Get column percentage
            const columnPercentage = parseInt(this._columnPercentageList[this._numberCurrentColumn - 1]);

            // Set before and after percentages
            const beforePercentage = Math.floor(columnPercentage / 2);
            const afterPercentage = columnPercentage - beforePercentage;

            // Reset column percentage
            this._columnPercentageList[this._numberCurrentColumn - 1] = beforePercentage.toString();

            // Insert the new column
            this._columnPercentageList.splice(this._numberCurrentColumn - 1, 0, afterPercentage.toString());

            // Reset the number area
            this._numberReset();
        }

        // If rotation is row
        if (this._numberRotationMode === 1) {
            // Get row percentage
            const rowPercentage = parseInt(this._rowPercentageList[this._numberCurrentRow - 1]);

            // Set before and after percentages
            const beforePercentage = Math.floor(rowPercentage / 2);
            const afterPercentage = rowPercentage - beforePercentage;

            // Reset row percentage
            this._rowPercentageList[this._numberCurrentRow - 1] = beforePercentage.toString();

            // Insert the new row
            this._rowPercentageList.splice(this._numberCurrentRow - 1, 0, afterPercentage.toString());

            // Reset the number area
            this._numberReset();
        }
    }

    /**
     * Insert a column into the grid. This adjusts the slot element's row, column, rowspan and colspan attributes.
     * @param {Number} insertColumn The column that is after the newly added column, for example (1, 2, +, 3) column would 3.
     */
    _numberGridInsertColumn(insertColumn) {
        // Go through all the cell slot elements
        this._cellSlotElementList.forEach((cellSlotElement) => {
            // Set the attribute parts
            let column = 0;
            let columnSpan = 1;

            // Get the attribute parts if they are set
            if (cellSlotElement.hasAttribute('column') === true) column = parseInt(cellSlotElement.getAttribute('column'));
            if (cellSlotElement.hasAttribute('colspan') === true) columnSpan = parseInt(cellSlotElement.getAttribute('colspan'));

            // If the column is greater than the current column
            if (column >= insertColumn) {
                // Increase column
                column++;

                // Set the column attribute
                cellSlotElement.setAttribute('column', column.toString());
            } else if (column + columnSpan - 1 >= insertColumn) {
                // Else if the column and span hits or goes over the new column
            
                // Increase column span
                columnSpan++;

                // Set the column span attribute
                cellSlotElement.setAttribute('colspan', columnSpan.toString());
            }

            // If no column span
            if (columnSpan === 1) {
                // Set just the column without the span part
                cellSlotElement.style.gridColumn = column.toString();
            } else {
                // Set the column and the span part
                cellSlotElement.style.gridColumn = column.toString() + ' / span ' + columnSpan.toString();
            }
        });
    }

    /**
     * Insert a row into the grid. This adjusts the slot element's row, column, rowspan and colspan attributes.
     * @param {Number} insertRow The row that is after the newly added row, for example (1, 2, +, 3) row would 3.
     */
    _numberGridInsertRow(insertRow) {
        // Go through all the cell slot elements
        this._cellSlotElementList.forEach((cellSlotElement) => {
            // Set the attribute parts
            let row = 0;
            let rowSpan = 1;

            // Get the attribute parts if they are set
            if (cellSlotElement.hasAttribute('row') === true) row = parseInt(cellSlotElement.getAttribute('row'));
            if (cellSlotElement.hasAttribute('rowspan') === true) rowSpan = parseInt(cellSlotElement.getAttribute('rowspan'));

            // If the row is greater than the current row
            if (row >= insertRow) {
                // Increase row
                row++;

                // Set the row attribute
                cellSlotElement.setAttribute('row', row.toString());
            } else if (row + rowSpan - 1 >= insertRow) {
                // Else if the row and span hits or goes over the new row
            
                // Increase row span
                rowSpan++;

                // Set the row span attribute
                cellSlotElement.setAttribute('rowspan', rowSpan.toString());
            }

            // If no row span
            if (rowSpan === 1) {
                // Set just the row without the span part
                cellSlotElement.style.gridRow = row.toString();
            } else {
                // Set the row and the span part
                cellSlotElement.style.gridRow = row.toString() + ' / span ' + rowSpan.toString();
            }
        });
    }

    /**
     * Delete a column from the grid. This adjusts the slot element's row, column, rowspan and colspan attributes.
     * It will also remove any cell slots that sit in the column.
     * @param {Number} deleteColumn The column to be deleted.
     */
    _numberGridDeleteColumn(deleteColumn) {
        // Set update cell slot element list
        let updateCellSlotElementList = false;

        // Go through all the cell slot elements
        this._cellSlotElementList.forEach((cellSlotElement) => {
            // Set the attribute parts
            let column = 0;
            let row = 0;
            let columnSpan = 1;
            let rowSpan = 1;

            // Get the attribute parts if they are set
            if (cellSlotElement.hasAttribute('column') === true) column = parseInt(cellSlotElement.getAttribute('column'));
            if (cellSlotElement.hasAttribute('row') === true) row = parseInt(cellSlotElement.getAttribute('row'));
            if (cellSlotElement.hasAttribute('colspan') === true) columnSpan = parseInt(cellSlotElement.getAttribute('colspan'));
            if (cellSlotElement.hasAttribute('rowspan') === true) rowSpan = parseInt(cellSlotElement.getAttribute('rowspan'));

            // Set current column and row parts
            const currentColumn = column;
            const currentRow = row;
            const currentColumnSpan = columnSpan;
            const currentRowSpan = rowSpan;

            // If the cell needs removing
            if (column === deleteColumn && columnSpan === 1) {
                // Remove the cell slot
                this._setupRemoveCellSlot(currentColumn, currentRow);

                // Set that we need to update the cell slot element list
                updateCellSlotElementList = true;

                // Stop here
                return;
            } else if (column === deleteColumn && columnSpan > 1) {
                // Else if cell has a span

                // Decrease the column span
                columnSpan--;
            } else if (column > deleteColumn) {
                // Else if cell is after the delete column

                // Decrease the column
                column--;
            } else if (column + columnSpan - 1 >= deleteColumn) {
                // Else if the column is before the delete column but the span meets it or goes over it

                // Decrease the column span
                columnSpan--;
            }

            // Update attributes
            if (column !== currentColumn) cellSlotElement.setAttribute('column', column.toString());
            if (row !== currentRow) cellSlotElement.setAttribute('row', row.toString());
            if (columnSpan !== currentColumnSpan) {
                // If not used
                if (columnSpan === 1) {
                    // Remove the colspan attribute
                    cellSlotElement.removeAttribute('colspan');
                } else {
                    // Reset colspan attribute
                    cellSlotElement.setAttribute('colspan', columnSpan.toString());
                }
            }
            if (rowSpan !== currentRowSpan) {
                // If not used
                if (rowSpan === 1) {
                    // Remove the rowspan attribute
                    cellSlotElement.removeAttribute('rowspan');
                } else {
                    // Reset rowspan attribute
                    cellSlotElement.setAttribute('rowspan', rowSpan.toString());
                }
            }

            // If no column span
            if (columnSpan === 1) {
                // Set just the column without the span part
                cellSlotElement.style.gridColumn = column.toString();
            } else {
                // Set the column and the span part
                cellSlotElement.style.gridColumn = column.toString() + ' / span ' + columnSpan.toString();
            }

            // If no row span
            if (rowSpan === 1) {
                // Set just the row without the span part
                cellSlotElement.style.gridRow = row.toString();
            } else {
                // Set the row and the span part
                cellSlotElement.style.gridRow = row.toString() + ' / span ' + rowSpan.toString();
            }
        });

        // If we do not need to update the cell slot element list
        if (updateCellSlotElementList === false) return;

        // Get the list of cell slot elements
        this._cellSlotElementList = this._cellSlotElement.assignedElements();
    }

    /**
     * Delete a row from the grid. This adjusts the slot element's row, column, rowspan and colspan attributes.
     * It will also remove any cell slots that sit in the row.
     * @param {Number} deleteRow The row to be deleted.
     */
    _numberGridDeleteRow(deleteRow) {
        // Set update cell slot element list
        let updateCellSlotElementList = false;

        // Go through all the cell slot elements
        this._cellSlotElementList.forEach((cellSlotElement) => {
            // Set the attribute parts
            let column = 0;
            let row = 0;
            let columnSpan = 1;
            let rowSpan = 1;

            // Get the attribute parts if they are set
            if (cellSlotElement.hasAttribute('column') === true) column = parseInt(cellSlotElement.getAttribute('column'));
            if (cellSlotElement.hasAttribute('row') === true) row = parseInt(cellSlotElement.getAttribute('row'));
            if (cellSlotElement.hasAttribute('colspan') === true) columnSpan = parseInt(cellSlotElement.getAttribute('colspan'));
            if (cellSlotElement.hasAttribute('rowspan') === true) rowSpan = parseInt(cellSlotElement.getAttribute('rowspan'));

            // Set current column and row parts
            const currentColumn = column;
            const currentRow = row;
            const currentColumnSpan = columnSpan;
            const currentRowSpan = rowSpan;

            // If the cell needs removing
            if (row === deleteRow && rowSpan === 1) {
                // Remove the cell slot
                this._setupRemoveCellSlot(currentColumn, currentRow);

                // Set that we need to update the cell slot element list
                updateCellSlotElementList = true;

                // Stop here
                return;
            } else if (row === deleteRow && rowSpan > 1) {
                // Else if cell has a span

                // Decrease the row span
                rowSpan--;
            } else if (row > deleteRow) {
                // Else if cell is after the delete row

                // Decrease the row
                row--;
            } else if (row + rowSpan - 1 >= deleteRow) {
                // Else if the row is before the delete row but the span meets it or goes over it

                // Decrease the row span
                rowSpan--;
            }

            // Update attributes
            if (column !== currentColumn) cellSlotElement.setAttribute('column', column.toString());
            if (row !== currentRow) cellSlotElement.setAttribute('row', row.toString());
            if (columnSpan !== currentColumnSpan) {
                // If not used
                if (columnSpan === 1) {
                    // Remove the colspan attribute
                    cellSlotElement.removeAttribute('colspan');
                } else {
                    // Reset colspan attribute
                    cellSlotElement.setAttribute('colspan', columnSpan.toString());
                }
            }
            if (rowSpan !== currentRowSpan) {
                // If not used
                if (rowSpan === 1) {
                    // Remove the rowspan attribute
                    cellSlotElement.removeAttribute('rowspan');
                } else {
                    // Reset rowspan attribute
                    cellSlotElement.setAttribute('rowspan', rowSpan.toString());
                }
            }

            // If no column span
            if (columnSpan === 1) {
                // Set just the column without the span part
                cellSlotElement.style.gridColumn = column.toString();
            } else {
                // Set the column and the span part
                cellSlotElement.style.gridColumn = column.toString() + ' / span ' + columnSpan.toString();
            }

            // If no row span
            if (rowSpan === 1) {
                // Set just the row without the span part
                cellSlotElement.style.gridRow = row.toString();
            } else {
                // Set the row and the span part
                cellSlotElement.style.gridRow = row.toString() + ' / span ' + rowSpan.toString();
            }
        });

        // If we do not need to update the cell slot element list
        if (updateCellSlotElementList === false) return;

        // Get the list of cell slot elements
        this._cellSlotElementList = this._cellSlotElement.assignedElements();
    }

    /**
     * BLOCK
     * Add, remove and change the span sizes of each cell slot element (tiles).
     */

    /**
     * Create the block parts.
     */
    _blockCreate() {
        // Create block DIV element
        const blockElement = document.createElement('DIV');

        // Set the class
        blockElement.classList.add('block');

        // Update the block grid template CSS styling
        this._blockUpdateGridTemplate(blockElement);

        // Create the cells
        this._blockCreateCells(blockElement);

        // Add cell events
        this._blockAddCellEvents();

        // Create the tiles
        this._blockCreateTiles(blockElement);

        // Add tile events
        this._blockAddTileEvents();

        // Create the options
        this._blockCreateOptions(blockElement);

        // Add option events
        this._blockAddOptionEvents();

        // Set the new block element
        this._blockElement = blockElement;

        // Add the new block element to the base element
        this._baseElement.appendChild(this._blockElement);
    }

    /**
     * Update the block's outer grid template CSS styles.
     * @param {HTMLElement} blockElement The block element to set.
     */
    _blockUpdateGridTemplate(cellElement) {
        // We need to have a column and row that matches the base grid

        // Create the CSS style parts for the grid
        let templateColumnsList = [];
        let templateRowsList = [];

        // For each column percentage
        for (let index = 0; index < this._columnPercentageList.length; index++) {
            // Get percentage text
            const percentageText = this._columnPercentageList[index];

            // Add to template as a percentage
            templateColumnsList.push(percentageText + '%');
        }

        // For each row percentage
        for (let index = 0; index < this._rowPercentageList.length; index++) {
            // Get percentage text
            const percentageText = this._rowPercentageList[index];

            // Add to template as a percentage
            templateRowsList.push(percentageText + '%');
        }

        // Set the cell CSS style of the template columns and rows
        cellElement.style.gridTemplateColumns = templateColumnsList.join(' ');
        cellElement.style.gridTemplateRows = templateRowsList.join(' ');
    }

    /**
     * Create the block cells. Each cell in the grid needs to be selectable.
     * @param {HTMLElement} blockElement The block element to set.
     */
    _blockCreateCells(blockElement) {
        // Set cell list
        this._blockCellList = [];

        // For each column
        for (let column = 1; column <= this._columnPercentageList.length; column++) {
            // For each row
            for (let row = 1; row <= this._rowPercentageList.length; row++) {
                // Create cell element
                const cellElement = document.createElement('DIV');

                // Set class
                cellElement.classList.add('cell');

                // Set grid location
                cellElement.style.gridColumn = column;
                cellElement.style.gridRow = row;

                // Set grid block parts
                cellElement.gridBlockColumn = column;
                cellElement.gridBlockRow = row;

                // Add to cell list
                this._blockCellList.push(cellElement);

                // Add to block element
                blockElement.appendChild(cellElement);
            }
        }

        // Set the current cell column and row
        this._blockCurrentCellColumn = -1;
        this._blockCurrentCellRow = -1;
    }

    /**
     * Add the cell events.
     */
    _blockAddCellEvents() {
        // For each cell
        this._blockCellList.forEach((cellElement) => {
            // Add cell click event
            cellElement.addEventListener('click', this._blockCellClickEvent);
        });
    }

    /**
     * Create the tiles, which are the cell slot elements on the base grid.
     * @param {HTMLElement} blockElement The block element to set.
     */
    _blockCreateTiles(blockElement) {
        // Create tile list
        this._blockTileList = [];

        // For each cell slot element
        this._cellSlotElementList.forEach((cellSlotElement) => {
            // Set the attribute parts
            let column = 0;
            let row = 0;
            let columnSpan = 1;
            let rowSpan = 1;

            // Get the attribute parts if they are set
            if (cellSlotElement.hasAttribute('column') === true) column = parseInt(cellSlotElement.getAttribute('column'));
            if (cellSlotElement.hasAttribute('row') === true) row = parseInt(cellSlotElement.getAttribute('row'));
            if (cellSlotElement.hasAttribute('colspan') === true) columnSpan = parseInt(cellSlotElement.getAttribute('colspan'));
            if (cellSlotElement.hasAttribute('rowspan') === true) rowSpan = parseInt(cellSlotElement.getAttribute('rowspan'));

            // Create tile element
            const tileElement = document.createElement('DIV');

            // Set grid parts
            tileElement.gridBlockColumn = column;
            tileElement.gridBlockRow = row;
            tileElement.gridBlockColumnSpan = columnSpan;
            tileElement.gridBlockRowSpan = rowSpan;

            // Set classes
            tileElement.classList.add('tile');

            // Set the CSS style that puts the tile inside the grid

            // If no row span
            if (rowSpan === 1) {
                // Set just the row without the span part
                tileElement.style.gridRow = row.toString();
            } else {
                // Set the row and the span part
                tileElement.style.gridRow = row.toString() + ' / span ' + rowSpan.toString();
            }

            // If no column span
            if (columnSpan === 1) {
                // Set just the column without the span part
                tileElement.style.gridColumn = column.toString();
            } else {
                // Set the column and the span part
                tileElement.style.gridColumn = column.toString() + ' / span ' + columnSpan.toString();
            }

            // Add to list
            this._blockTileList.push(tileElement);

            // Add to block element
            blockElement.appendChild(tileElement);
        });

        // Set the current tile column and row
        this._blockCurrentTileColumn = -1;
        this._blockCurrentTileRow = -1;
        this._blockCurrentTileColumnSpan = -1;
        this._blockCurrentTileRowSpan = -1;
    }

    /**
     * Add the tile events.
     */
    _blockAddTileEvents() {
        // For each tile
        this._blockTileList.forEach((tileElement) => {
            // Add tile click event
            tileElement.addEventListener('click', this._blockTileClickEvent);
        });
    }

    /**
     * Create the block tile options.
     * @param {HTMLElement} blockElement The block element to set.
     */
    _blockCreateOptions(blockElement) {
        // Create option menu element
        this._blockOptionMenuElement = document.createElement('DIV');

        // Set class
        this._blockOptionMenuElement.classList.add('menu');

        // Set the styles to be hidden
        this._blockOptionMenuElement.style.visibility = 'hidden';
        this._blockOptionMenuElement.style.gridColumn = '1';
        this._blockOptionMenuElement.style.gridRow = '1';

        // Add to block element
        blockElement.appendChild(this._blockOptionMenuElement);

        // Create menu option elements
        this._blockAddElement = document.createElement('button');
        this._blockRemoveElement = document.createElement('button');
        this._blockArrowLeftInElement = document.createElement('button');
        this._blockArrowLeftOutElement = document.createElement('button');
        this._blockArrowRightInElement = document.createElement('button');
        this._blockArrowRightOutElement = document.createElement('button');
        this._blockArrowUpInElement = document.createElement('button');
        this._blockArrowUpOutElement = document.createElement('button');
        this._blockArrowDownInElement = document.createElement('button');
        this._blockArrowDownOutElement = document.createElement('button');

        // Set the class
        this._blockAddElement.classList.add('add');
        this._blockRemoveElement.classList.add('remove');
        this._blockArrowLeftInElement.classList.add('arrow', 'left', 'in');
        this._blockArrowLeftOutElement.classList.add('arrow', 'left', 'out');
        this._blockArrowRightInElement.classList.add('arrow', 'right', 'in');
        this._blockArrowRightOutElement.classList.add('arrow', 'right', 'out');
        this._blockArrowUpInElement.classList.add('arrow', 'up', 'in');
        this._blockArrowUpOutElement.classList.add('arrow', 'up', 'out');
        this._blockArrowDownInElement.classList.add('arrow', 'down', 'in');
        this._blockArrowDownOutElement.classList.add('arrow', 'down', 'out');

        // Set inner HTML
        this._blockAddElement.innerHTML = GridSetup.addHtml;
        this._blockRemoveElement.innerHTML = GridSetup.removeHtml;
        this._blockArrowLeftInElement.innerHTML = GridSetup.arrowHtml;
        this._blockArrowLeftOutElement.innerHTML = GridSetup.arrowHtml;
        this._blockArrowRightInElement.innerHTML = GridSetup.arrowHtml;
        this._blockArrowRightOutElement.innerHTML = GridSetup.arrowHtml;
        this._blockArrowUpInElement.innerHTML = GridSetup.arrowHtml;
        this._blockArrowUpOutElement.innerHTML = GridSetup.arrowHtml;
        this._blockArrowDownInElement.innerHTML = GridSetup.arrowHtml;
        this._blockArrowDownOutElement.innerHTML = GridSetup.arrowHtml;

        // Add to option menu element
        this._blockOptionMenuElement.appendChild(this._blockAddElement);
        this._blockOptionMenuElement.appendChild(this._blockRemoveElement);
        this._blockOptionMenuElement.appendChild(this._blockArrowLeftInElement);
        this._blockOptionMenuElement.appendChild(this._blockArrowLeftOutElement);
        this._blockOptionMenuElement.appendChild(this._blockArrowRightInElement);
        this._blockOptionMenuElement.appendChild(this._blockArrowRightOutElement);
        this._blockOptionMenuElement.appendChild(this._blockArrowUpInElement);
        this._blockOptionMenuElement.appendChild(this._blockArrowUpOutElement);
        this._blockOptionMenuElement.appendChild(this._blockArrowDownInElement);
        this._blockOptionMenuElement.appendChild(this._blockArrowDownOutElement);
    }

    /**
     * Add the option events.
     */
    _blockAddOptionEvents() {
        // Add option click events
        this._blockOptionMenuElement.addEventListener('click', this._blockOptionMenuClickEvent);
        this._blockAddElement.addEventListener('click', this._blockAddClickEvent);
        this._blockRemoveElement.addEventListener('click', this._blockRemoveClickEvent);
        this._blockArrowLeftInElement.addEventListener('click', this._blockArrowLeftInClickEvent);
        this._blockArrowLeftOutElement.addEventListener('click', this._blockArrowLeftOutClickEvent);
        this._blockArrowRightInElement.addEventListener('click', this._blockArrowRightInClickEvent);
        this._blockArrowRightOutElement.addEventListener('click', this._blockArrowRightOutClickEvent);
        this._blockArrowUpInElement.addEventListener('click', this._blockArrowUpInClickEvent);
        this._blockArrowUpOutElement.addEventListener('click', this._blockArrowUpOutClickEvent);
        this._blockArrowDownInElement.addEventListener('click', this._blockArrowDownInClickEvent);
        this._blockArrowDownOutElement.addEventListener('click', this._blockArrowDownOutClickEvent);
    }

    /**
     * Removes the block parts. This removes the elements and any events linked to them.
     */
    _blockRemove() {
        // If there is no block element
        if (!this._blockElement) return;

        // Remove the cell events
        this._blockRemoveCellEvents();

        // Remove the tile events
        this._blockRemoveTileEvents();

        // Remove the option events
        this._blockRemoveOptionEvents();

        // Remove the block element from the base element
        this._baseElement.removeChild(this._blockElement);

        // Clear the block element
        this._blockElement = undefined;
    }

    /**
     * Remove the cell events.
     */
    _blockRemoveCellEvents() {
        // For each cell
        this._blockCellList.forEach((cellElement) => {
            // Remove cell click event
            cellElement.removeEventListener('click', this._blockCellClickEvent);
        });
    }

    /**
     * Remove the tile events.
     */
    _blockRemoveTileEvents() {
        // For each tile
        this._blockTileList.forEach((tileElement) => {
            // Remove tile click event
            tileElement.removeEventListener('click', this._blockTileClickEvent);
        });
    }

    /**
     * Remove the option events.
     */
    _blockRemoveOptionEvents() {
        // Remove option click events
        this._blockOptionMenuElement.addEventListener('click', this._blockOptionMenuClickEvent);
        this._blockAddElement.removeEventListener('click', this._blockAddClickEvent);
        this._blockRemoveElement.removeEventListener('click', this._blockRemoveClickEvent);
        this._blockArrowLeftInElement.removeEventListener('click', this._blockArrowLeftInClickEvent);
        this._blockArrowLeftOutElement.removeEventListener('click', this._blockArrowLeftOutClickEvent);
        this._blockArrowRightInElement.removeEventListener('click', this._blockArrowRightInClickEvent);
        this._blockArrowRightOutElement.removeEventListener('click', this._blockArrowRightOutClickEvent);
        this._blockArrowUpInElement.removeEventListener('click', this._blockArrowUpInClickEvent);
        this._blockArrowUpOutElement.removeEventListener('click', this._blockArrowUpOutClickEvent);
        this._blockArrowDownInElement.removeEventListener('click', this._blockArrowDownInClickEvent);
        this._blockArrowDownOutElement.removeEventListener('click', this._blockArrowDownOutClickEvent);
    }

    /**
     * Block cell click event.
     * @param {object} event The click event information.
     */
    _blockCellClickEvent(event) {
        // If the same cell is selected
        if (this._blockCurrentCellColumn === event.target.gridBlockColumn && this._blockCurrentCellRow === event.target.gridBlockRow) {
            // Reset the current cell column and row
            this._blockCurrentCellColumn = -1;
            this._blockCurrentCellRow = -1;
        } else {
            // Set current cell column and row
            this._blockCurrentCellColumn = event.target.gridBlockColumn;
            this._blockCurrentCellRow = event.target.gridBlockRow;

            // Reset the current tile column and row
            this._blockCurrentTileColumn = -1;
            this._blockCurrentTileRow = -1;
            this._blockCurrentTileColumnSpan = -1;
            this._blockCurrentTileRowSpan = -1;
        }

        // Set the cells
        this._blockSetCells();

        // Set the tiles
        this._blockSetTiles();

        // Set the options
        this._blockSetOptions();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();
    }

    /**
     * Block tile click event.
     * @param {object} event The click event information.
     */
    _blockTileClickEvent(event) {
        // If the same tile is selected
        if (this._blockCurrentTileColumn === event.target.gridBlockColumn && this._blockCurrentTileRow === event.target.gridBlockRow) {
            // Reset the current tile column and row
            this._blockCurrentTileColumn = -1;
            this._blockCurrentTileRow = -1;
            this._blockCurrentTileColumnSpan = -1;
            this._blockCurrentTileRowSpan = -1;

            // Set current tile element
            this._blockCurrentTileElement = null;
        } else {
            // Set current tile column and row
            this._blockCurrentTileColumn = event.target.gridBlockColumn;
            this._blockCurrentTileRow = event.target.gridBlockRow;
            this._blockCurrentTileColumnSpan = event.target.gridBlockColumnSpan;
            this._blockCurrentTileRowSpan = event.target.gridBlockRowSpan;

            // Set current tile element
            this._blockCurrentTileElement = event.target;

            // Reset the current cell column and row
            this._blockCurrentCellColumn = -1;
            this._blockCurrentCellRow = -1;
        }

        // Set the tiles
        this._blockSetTiles();

        // Set the cells
        this._blockSetCells();

        // Set the options
        this._blockSetOptions();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();
    }

    /**
     * Block option menu click event.
     * @param {object} event The click event information.
     */
    _blockOptionMenuClickEvent(event) {
        // Reset the current cell column and row
        this._blockCurrentCellColumn = -1;
        this._blockCurrentCellRow = -1;

        // Reset the current tile column and row
        this._blockCurrentTileColumn = -1;
        this._blockCurrentTileRow = -1;
        this._blockCurrentTileColumnSpan = -1;
        this._blockCurrentTileRowSpan = -1;

        // Set the cells
        this._blockSetCells();

        // Set the tiles
        this._blockSetTiles();

        // Set the options
        this._blockSetOptions();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();
    }

    /**
     * Block add click event.
     * @param {object} event The click event information.
     */
    _blockAddClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Create add event
        const addEvent = new CustomEvent(
            'add',
            {
                detail: {
                    row: this._blockCurrentCellRow,
                    column: this._blockCurrentCellColumn
                }
            }
        );

        // Set base element as adding
        this._baseElement.classList.add('adding');

        // Dispatch the event
        this.dispatchEvent(addEvent);
    }

    /**
     * Block remove click event.
     * @param {object} event The click event information.
     */
    _blockRemoveClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Remove the cell slot
        this._setupRemoveCellSlot(this._blockCurrentTileColumn, this._blockCurrentTileRow);
    }

    /**
     * Block arrow left in click event.
     * @param {object} event The click event information.
     */
    _blockArrowLeftInClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(this._blockCurrentTileColumn, this._blockCurrentTileRow);

        // Adjust the current tile column, row and span information
        this._blockCurrentTileColumn++;
        this._blockCurrentTileColumnSpan--;

        // Update the tile, cell and option menu
        this._blockUpdateTileCellOptionMenu(cellSlotElement);
    }

    /**
     * Block arrow left out click event.
     * @param {object} event The click event information.
     */
    _blockArrowLeftOutClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(this._blockCurrentTileColumn, this._blockCurrentTileRow);

        // Adjust the current tile column, row and span information
        this._blockCurrentTileColumn--;
        this._blockCurrentTileColumnSpan++;

        // Update the tile, cell and option menu
        this._blockUpdateTileCellOptionMenu(cellSlotElement);
    }

    /**
     * Block arrow right in click event.
     * @param {object} event The click event information.
     */
    _blockArrowRightInClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(this._blockCurrentTileColumn, this._blockCurrentTileRow);

        // Adjust the current tile column, row and span information
        this._blockCurrentTileColumnSpan--;

        // Update the tile, cell and option menu
        this._blockUpdateTileCellOptionMenu(cellSlotElement);
    }

    /**
     * Block arrow right out click event.
     * @param {object} event The click event information.
     */
    _blockArrowRightOutClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(this._blockCurrentTileColumn, this._blockCurrentTileRow);

        // Adjust the current tile column, row and span information
        this._blockCurrentTileColumnSpan++;

        // Update the tile, cell and option menu
        this._blockUpdateTileCellOptionMenu(cellSlotElement);
    }

    /**
     * Block arrow up in click event.
     * @param {object} event The click event information.
     */
    _blockArrowUpInClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(this._blockCurrentTileColumn, this._blockCurrentTileRow);

        // Adjust the current tile column, row and span information
        this._blockCurrentTileRow++;
        this._blockCurrentTileRowSpan--;

        // Update the tile, cell and option menu
        this._blockUpdateTileCellOptionMenu(cellSlotElement);
    }

    /**
     * Block arrow up out click event.
     * @param {object} event The click event information.
     */
    _blockArrowUpOutClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(this._blockCurrentTileColumn, this._blockCurrentTileRow);

        // Adjust the current tile column, row and span information
        this._blockCurrentTileRow--;
        this._blockCurrentTileRowSpan++;

        // Update the tile, cell and option menu
        this._blockUpdateTileCellOptionMenu(cellSlotElement);
    }

    /**
     * Block arrow down in click event.
     * @param {object} event The click event information.
     */
    _blockArrowDownInClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(this._blockCurrentTileColumn, this._blockCurrentTileRow);

        // Adjust the current tile column, row and span information
        this._blockCurrentTileRowSpan--;

        // Update the tile, cell and option menu
        this._blockUpdateTileCellOptionMenu(cellSlotElement);
    }

    /**
     * Block arrow down out click event.
     * @param {object} event The click event information.
     */
    _blockArrowDownOutClickEvent(event) {
        // Stop option menu getting click event
        event.stopPropagation();

        // Get cell slot element
        const cellSlotElement = this._setupGetCellSlotElement(this._blockCurrentTileColumn, this._blockCurrentTileRow);

        // Adjust the current tile column, row and span information
        this._blockCurrentTileRowSpan++;

        // Update the tile, cell and option menu
        this._blockUpdateTileCellOptionMenu(cellSlotElement);
    }

    /**
     * Set the cells.
     */
    _blockSetCells() {
        // For each cell element
        this._blockCellList.forEach((cellElement) => {
            // Get grid column and row
            const gridColumn = cellElement.gridBlockColumn;
            const gridRow = cellElement.gridBlockRow;

            // If the currently selected cell
            if (gridColumn === this._blockCurrentCellColumn && gridRow === this._blockCurrentCellRow) {
                // Set class as selected
                cellElement.classList.add('selected');
            } else {
                // Remove the class selected
                cellElement.classList.remove('selected');
            }
        });
    }

    /**
     * Set the tiles.
     */
    _blockSetTiles() {
        // For each tile element
        this._blockTileList.forEach((tileElement) => {
            // Get grid column and row
            const gridColumn = tileElement.gridBlockColumn;
            const gridRow = tileElement.gridBlockRow;

            // If the currently selected tile
            if (gridColumn === this._blockCurrentTileColumn && gridRow === this._blockCurrentTileRow) {
                // Set class as selected
                tileElement.classList.add('selected');
            } else {
                // Remove the class selected
                tileElement.classList.remove('selected');
            }
        });
    }

    /**
     * Set the options.
     */
    _blockSetOptions() {
        // If nothing selected
        if (this._blockCurrentCellColumn === -1 && this._blockCurrentTileRow === -1) {
            // Make the option menu hidden
            this._blockOptionMenuElement.style.visibility = 'hidden';

            // Stop here
            return;
        }

        // If current cell selected
        if (this._blockCurrentCellColumn !== -1) {
            // Set option menu element grid location
            this._blockOptionMenuElement.style.gridColumn = this._blockCurrentCellColumn.toString();
            this._blockOptionMenuElement.style.gridRow = this._blockCurrentCellRow.toString();

            // This is an empty cell therefore make sure the add option is shown
            this._blockAddElement.style.display = 'block';
            this._blockRemoveElement.style.display = 'none';
        }

        // If current tile selected
        if (this._blockCurrentTileColumn !== -1) {
            // If no row span
            if (this._blockCurrentTileRowSpan === 1) {
                // Set just the row without the span part
                this._blockOptionMenuElement.style.gridRow = this._blockCurrentTileRow.toString();
            } else {
                // Set the row and the span part
                this._blockOptionMenuElement.style.gridRow = this._blockCurrentTileRow.toString() + ' / span ' + this._blockCurrentTileRowSpan.toString();
            }

            // If no column span
            if (this._blockCurrentTileColumnSpan === 1) {
                // Set just the column without the span part
                this._blockOptionMenuElement.style.gridColumn = this._blockCurrentTileColumn.toString();
            } else {
                // Set the column and the span part
                this._blockOptionMenuElement.style.gridColumn = this._blockCurrentTileColumn.toString() + ' / span ' + this._blockCurrentTileColumnSpan.toString();
            }

            // This is a tile therefore make sure the remove option is shown
            this._blockRemoveElement.style.display = 'block';
            this._blockAddElement.style.display = 'none';
        }

        // If there is a column span, then we can shrink the cell's column span
        if (this._blockCurrentTileColumnSpan > 1) {
            // Show arrow left/right in options
            this._blockArrowLeftInElement.style.display = 'block';
            this._blockArrowRightInElement.style.display = 'block';
        } else {
            // Hide arrow left/right in options
            this._blockArrowLeftInElement.style.display = 'none';
            this._blockArrowRightInElement.style.display = 'none';
        }

        // If there is a row span, then we can shrink the cell's row span
        if (this._blockCurrentTileRowSpan > 1) {
            // Show arrow up/down in options
            this._blockArrowUpInElement.style.display = 'block';
            this._blockArrowDownInElement.style.display = 'block';
        } else {
            // Hide arrow up/down in options
            this._blockArrowUpInElement.style.display = 'none';
            this._blockArrowDownInElement.style.display = 'none';
        }        

        // Set can move left, right, up and down
        let canMoveLeft = true;
        let canMoveRight = true;
        let canMoveUp = true;
        let canMoveDown = true;

        // If tile being used
        if (this._blockCurrentTileColumn !== -1) {
            // Check move left

            // If on the first column
            if (this._blockCurrentTileColumn === 1) {
                // Set we cannot move left
                canMoveLeft = false;
            } else {
                // Else if there is a row span

                // For each row
                for (let row = 0; row < this._blockCurrentTileRowSpan; row++) {
                    // If the cell is not free
                    if (this._blockIsFree(this._blockCurrentTileColumn - 1, this._blockCurrentTileRow + row) === false) {
                        // Set we cannot move left
                        canMoveLeft = false;

                        // Stop looking
                        break;
                    }
                }
            }

            // Check move right

            // If on the last column
            if (this._blockCurrentTileColumn === this._columnPercentageList.length) {
                // Set we cannot move right
                canMoveRight = false;
            } else if (this._blockCurrentTileColumn + this._blockCurrentTileColumnSpan - 1 === this._columnPercentageList.length) {
                // Else if there is a span the has already reached the end

                // Set we cannot move right
                canMoveRight = false;
            } else {
                // Else if there is a row span

                // For each row
                for (let row = 0; row < this._blockCurrentTileRowSpan; row++) {
                    // If the cell is not free
                    if (this._blockIsFree(this._blockCurrentTileColumn + this._blockCurrentTileColumnSpan, this._blockCurrentTileRow + row) === false) {
                        // Set we cannot move right
                        canMoveRight = false;

                        // Stop looking
                        break;
                    }
                }
            }

            // Check move up

            // If on the first row
            if (this._blockCurrentTileRow === 1) {
                // Set we cannot move up
                canMoveUp = false;
            } else {
                // Else if there is a column span

                // For each column
                for (let column = 0; column < this._blockCurrentTileColumnSpan; column++) {
                    // If the cell is not free
                    if (this._blockIsFree(this._blockCurrentTileColumn + column, this._blockCurrentTileRow - 1) === false) {
                        // Set we cannot move up
                        canMoveUp = false;

                        // Stop looking
                        break;
                    }
                }
            }

            // Check move down

            // If on the last row
            if (this._blockCurrentTileRow === this._rowPercentageList.length) {
                // Set we cannot move down
                canMoveDown = false;
            } else if (this._blockCurrentTileRow + this._blockCurrentTileRowSpan - 1 === this._rowPercentageList.length) {
                // Else if there is a span the has already reached the end

                // Set we cannot move down
                canMoveDown = false;
            } else {
                // Else if there is a column span

                // For each column
                for (let column = 0; column < this._blockCurrentTileColumnSpan; column++) {
                    // If the cell is not free
                    if (this._blockIsFree(this._blockCurrentTileColumn + column, this._blockCurrentTileRow + this._blockCurrentTileRowSpan) === false) {
                        // Set we cannot move down
                        canMoveDown = false;

                        // Stop looking
                        break;
                    }
                }
            }
        }

        // If current cell being used
        if (this._blockCurrentCellColumn !== -1) {
            // Set we can not move in any direction
            canMoveLeft = false;
            canMoveRight = false;
            canMoveUp = false;
            canMoveDown = false;
        }

        // Check for and set single
        if (canMoveLeft === true && this._blockCurrentTileColumnSpan > 1) {
            // Add the double class
            this._blockArrowLeftInElement.classList.add('double');
            this._blockArrowLeftOutElement.classList.add('double');
        } else {
            // Remove the double class
            this._blockArrowLeftInElement.classList.remove('double');
            this._blockArrowLeftOutElement.classList.remove('double');
        }
        if (canMoveRight === true && this._blockCurrentTileColumnSpan > 1) {
            // Add the double class
            this._blockArrowRightInElement.classList.add('double');
            this._blockArrowRightOutElement.classList.add('double');
        } else {
            // Remove the double class
            this._blockArrowRightInElement.classList.remove('double');
            this._blockArrowRightOutElement.classList.remove('double');
        }
        if (canMoveUp === true && this._blockCurrentTileRowSpan > 1) {
            // Add the double class
            this._blockArrowUpInElement.classList.add('double');
            this._blockArrowUpOutElement.classList.add('double');
        } else {
            // Remove the double class
            this._blockArrowUpInElement.classList.remove('double');
            this._blockArrowUpOutElement.classList.remove('double');
        }
        if (canMoveDown === true && this._blockCurrentTileRowSpan > 1) {
            // Add the double class
            this._blockArrowDownInElement.classList.add('double');
            this._blockArrowDownOutElement.classList.add('double');
        } else {
            // Remove the double class
            this._blockArrowDownInElement.classList.remove('double');
            this._blockArrowDownOutElement.classList.remove('double');
        }

        // If we can move left
        if (canMoveLeft === true) {
            // Show arrow left out in options
            this._blockArrowLeftOutElement.style.display = 'block';
        } else {
            // Hide arrow left out in options
            this._blockArrowLeftOutElement.style.display = 'none';
        }

        // If we can move right
        if (canMoveRight === true) {
            // Show arrow right out in options
            this._blockArrowRightOutElement.style.display = 'block';
        } else {
            // Hide arrow right out in options
            this._blockArrowRightOutElement.style.display = 'none';
        }

        // If we can move up
        if (canMoveUp === true) {
            // Show arrow up out in options
            this._blockArrowUpOutElement.style.display = 'block';
        } else {
            // Hide arrow up out in options
            this._blockArrowUpOutElement.style.display = 'none';
        }

        // If we can move down
        if (canMoveDown === true) {
            // Show arrow down out in options
            this._blockArrowDownOutElement.style.display = 'block';
        } else {
            // Hide arrow down out in options
            this._blockArrowDownOutElement.style.display = 'none';
        }
        
        // Show menu
        this._blockOptionMenuElement.style.visibility = 'visible';
    }

    /**
     * Looks to see if the given cell is free.
     * @param {Number} column The column in the grid to search.
     * @param {Number} row The row in the grid to search.
     * @return {Boolean} True if the cell is free, false if a tile is taking up the space.
     */
    _blockIsFree(column, row) {
        // For each tile element
        for (let index = 0; index < this._blockTileList.length; index++) {
            // Get tile element
            const tileElement = this._blockTileList[index];

            // If past column
            if (tileElement.gridBlockColumn > column) continue;

            // If past row
            if (tileElement.gridBlockRow > row) continue;

            // If before column (with span)
            if (tileElement.gridBlockColumn + tileElement.gridBlockColumnSpan - 1 < column) continue;

            // If before row (with span)
            if (tileElement.gridBlockRow + tileElement.gridBlockRowSpan - 1 < row) continue;

            // This cell is not free
            return false;
        }

        // Return the cell is free
        return true;
    }

    /**
     * With the updated current tile column, row and span information, we need to update the
     * cell slot element's attributes and styles, and the tile element and the option menu.
     * @param {HTMLElement} cellSlotElement The cell slot element the tile was related to.
     */
    _blockUpdateTileCellOptionMenu(cellSlotElement) {
        // Reset the cell slot element attributes
        cellSlotElement.setAttribute('column', this._blockCurrentTileColumn.toString());
        cellSlotElement.setAttribute('row', this._blockCurrentTileRow.toString());
        cellSlotElement.setAttribute('colspan', this._blockCurrentTileColumnSpan.toString());
        cellSlotElement.setAttribute('rowspan', this._blockCurrentTileRowSpan.toString());

        // Set tile grid block parts
        this._blockCurrentTileElement.gridBlockColumn = this._blockCurrentTileColumn;
        this._blockCurrentTileElement.gridBlockRow = this._blockCurrentTileRow;
        this._blockCurrentTileElement.gridBlockColumnSpan = this._blockCurrentTileColumnSpan;
        this._blockCurrentTileElement.gridBlockRowSpan = this._blockCurrentTileRowSpan;

        // Set the CSS style for the tile and cell

        // If no row span
        if (this._blockCurrentTileRowSpan <= 1) {
            // Set just the row without the span part
            cellSlotElement.style.gridRow = this._blockCurrentTileRow.toString();
            this._blockCurrentTileElement.style.gridRow = this._blockCurrentTileRow.toString();
        } else {
            // Set the row and the span part
            cellSlotElement.style.gridRow = this._blockCurrentTileRow.toString() + ' / span ' + this._blockCurrentTileRowSpan.toString();
            this._blockCurrentTileElement.style.gridRow = this._blockCurrentTileRow.toString() + ' / span ' + this._blockCurrentTileRowSpan.toString();
        }

        // If no column span
        if (this._blockCurrentTileColumnSpan <= 1) {
            // Set just the column without the span part
            cellSlotElement.style.gridColumn = this._blockCurrentTileColumn.toString();
            this._blockCurrentTileElement.style.gridColumn = this._blockCurrentTileColumn.toString();
        } else {
            // Set the column and the span part
            cellSlotElement.style.gridColumn = this._blockCurrentTileColumn.toString() + ' / span ' + this._blockCurrentTileColumnSpan.toString();
            this._blockCurrentTileElement.style.gridColumn = this._blockCurrentTileColumn.toString() + ' / span ' + this._blockCurrentTileColumnSpan.toString();
        }

        // Update the options
        this._blockSetOptions();

        // Send changed event
        this._setupChanged();

        // Update the menu (it may need to be moved)
        this._menuUpdateMenu();
    }

    /**
     * SELECT
     * Allow the user to select one of the cells.
     */

    /**
     * Create the select parts.
     */
    _selectCreate() {
        // Create select DIV element
        const selectElement = document.createElement('DIV');

        // Set the class
        selectElement.classList.add('select');

        // Update the select grid template CSS styling
        this._selectUpdateGridTemplate(selectElement);

        // Create the tiles
        this._selectCreateTiles(selectElement);

        // Add tile button events
        this._selectAddTileButtonEvents();

        // Set the new select element
        this._selectElement = selectElement;

        // Add the new select element to the base element
        this._baseElement.appendChild(this._selectElement);
    }

    /**
     * Update the select's outer grid template CSS styles.
     * @param {HTMLElement} selectElement The select element to set.
     */
    _selectUpdateGridTemplate(cellElement) {
        // We need to have a column and row that matches the base grid

        // Create the CSS style parts for the grid
        let templateColumnsList = [];
        let templateRowsList = [];

        // For each column percentage
        for (let index = 0; index < this._columnPercentageList.length; index++) {
            // Get percentage text
            const percentageText = this._columnPercentageList[index];

            // Add to template as a percentage
            templateColumnsList.push(percentageText + '%');
        }

        // For each row percentage
        for (let index = 0; index < this._rowPercentageList.length; index++) {
            // Get percentage text
            const percentageText = this._rowPercentageList[index];

            // Add to template as a percentage
            templateRowsList.push(percentageText + '%');
        }

        // Set the cell CSS style of the template columns and rows
        cellElement.style.gridTemplateColumns = templateColumnsList.join(' ');
        cellElement.style.gridTemplateRows = templateRowsList.join(' ');
    }

    /**
     * Create the tiles, which are the cell slot elements on the base grid.
     * @param {HTMLElement} selectElement The select element to set.
     */
    _selectCreateTiles(selectElement) {
        // Create tile button list
        this._selectTileButtonList = [];

        // For each cell slot element
        this._cellSlotElementList.forEach((cellSlotElement) => {
            // Set the attribute parts
            let column = 0;
            let row = 0;
            let columnSpan = 1;
            let rowSpan = 1;

            // Get the attribute parts if they are set
            if (cellSlotElement.hasAttribute('column') === true) column = parseInt(cellSlotElement.getAttribute('column'));
            if (cellSlotElement.hasAttribute('row') === true) row = parseInt(cellSlotElement.getAttribute('row'));
            if (cellSlotElement.hasAttribute('colspan') === true) columnSpan = parseInt(cellSlotElement.getAttribute('colspan'));
            if (cellSlotElement.hasAttribute('rowspan') === true) rowSpan = parseInt(cellSlotElement.getAttribute('rowspan'));

            // Create tile element
            const tileElement = document.createElement('DIV');

            // Set grid parts
            tileElement.gridBlockColumn = column;
            tileElement.gridBlockRow = row;
            tileElement.gridBlockColumnSpan = columnSpan;
            tileElement.gridBlockRowSpan = rowSpan;

            // Set classes
            tileElement.classList.add('tile');

            // Set the CSS style that puts the tile inside the grid

            // If no row span
            if (rowSpan === 1) {
                // Set just the row without the span part
                tileElement.style.gridRow = row.toString();
            } else {
                // Set the row and the span part
                tileElement.style.gridRow = row.toString() + ' / span ' + rowSpan.toString();
            }

            // If no column span
            if (columnSpan === 1) {
                // Set just the column without the span part
                tileElement.style.gridColumn = column.toString();
            } else {
                // Set the column and the span part
                tileElement.style.gridColumn = column.toString() + ' / span ' + columnSpan.toString();
            }

            // Create button
            const buttonElement = document.createElement('button');

            // Set a link to the cell slot element
            buttonElement._cellSlotElement = cellSlotElement;

            // Set button's inner HTML to the SVG icon
            buttonElement.innerHTML = GridSetup.selectEditHtml;

            // Add button to tile
            tileElement.appendChild(buttonElement);

            // Add button to list
            this._selectTileButtonList.push(buttonElement);

            // Add to select element
            selectElement.appendChild(tileElement);
        });
    }

    /**
     * Add tile button click event.
     */
    _selectAddTileButtonEvents() {
        // For each select tile
        this._selectTileButtonList.forEach((buttonElement) => {
            // Add click event
            buttonElement.addEventListener('click', this._selectTileButtonClickEvent);
        });
    }

    /**
     * Select title button click event.
     * @param {object} event The click event information.
     */
    _selectTileButtonClickEvent(event) {
        // Create select event (this can bubble through the shadow DOM)
        const selectEvent = new CustomEvent('select', { bubbles: true, composed: true });

        // Dispatch the event
        event.target._cellSlotElement.dispatchEvent(selectEvent);
    }

    /**
     * Removes the select parts. This removes the elements and any events linked to them.
     */
    _selectRemove() {
        // If there is no select element
        if (!this._selectElement) return;

        // Remove tile button events
        this._selectRemoveTileButtonEvents();
        
        // Remove the select element from the base element
        this._baseElement.removeChild(this._selectElement);

        // Clear the select element
        this._selectElement = undefined;
    }

    /**
     * Remove tile button click event.
     */
    _selectRemoveTileButtonEvents() {
        // For each select tile
        this._selectTileButtonList.forEach((buttonElement) => {
            // Remove click event
            buttonElement.removeEventListener('click', this._selectTileButtonClickEvent);
        });
    }
}

// Tell the browser about the new tag and the class it is linked to
customElements.define('grid-setup', GridSetup);
