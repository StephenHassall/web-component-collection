/**
 * Background moving blocks web component.
 * 
 * <background-moving-blocks>
 *   <div>Default Slot #1</div>
 *   <div>Default Slot #2</div>
 *   <div>Default Slot #3</div> 
 * </background-moving-blocks>
 * 
 * @classdesc
 * Shows a background with blocks moving into spaces, up, down, left, right, all randomlly.
 * 
 * Attributes:
 * square
 * If used then all the cells will be perfect squares. The last row of cells may not fit correctly and overflow
 * 
 * CSS Variables
 * --fill-ratio
 * What is the ratio between the cells that are empty to those that contain a block. Percentage value between 1 and 90
 * 
 * --cell-row-count
 * The number of cell rows. This is only used if the attribute square is not set
 * 
 * --cell-column-count
 *  The number of cell columns.
 * 
 * --move-speed
 * The time it takes for a block to move from one cell to another (default is 1 second)
 * 
 * --move-transition
 * The type of transition the block will move in (default is linear)
 * 
 * --move-interval
 * The number of milliseconds between a move is made (if possible)
 * 
 * @author Stephen Paul Hassall
 * @license https://CodeRunDebug.com/license.html
 * @web https://CodeRunDebug.com
 */
class BackgroundMovingBlocks extends HTMLElement {
    /**
     * Static CSS constant.
     * @return {string} The CSS constant.
     */
    static get CSS() {
        return /*css*/`
        :host {
            display: block;
        }

        #cell-area {
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        }

        #slot-list {
            display: none;
        }

        .block {
            position: absolute;
            transition: 
                left var(--move-speed, 1s) var(--move-transition, linear),
                top var(--move-speed, 1s) var(--move-transition, linear);
        }`;
    }

    /**
     * Static HTML constant.
     * @return {string} The HTML constant.
     */
    static get HTML() {
        return /*html*/`
        <div id="cell-area"></div>
        <div id="slot-list">
            <slot id="block"></slot>
        </div>`;
    }

    /**
     * Create a new BackgroundMovingBlocks object.
     * @constructor
     */
    constructor() {
        // Must call super first
        super();

        // Attach shadow DOM root
        this.attachShadow({mode: 'open'});

        // Set shadow DOM's inner HTML
        this.shadowRoot.innerHTML = BackgroundMovingBlocks.HTML;

        // Create the CSS parts for the shadow DOM
        const style = document.createElement('style');

        // Set style
        style.textContent = BackgroundMovingBlocks.CSS;

        // Add styles
        this.shadowRoot.appendChild(style);

        // Get cell area element
        this._cellAreaElement = this.shadowRoot.getElementById('cell-area');

        // Get slot element
        this._slotElement = this.shadowRoot.getElementById('block');

        // Bind the event functions to this
        this._resizeEvent = this._resizeEvent.bind(this);
        this._transitionEndEvent = this._transitionEndEvent.bind(this);
        this._timerEvent = this._timerEvent.bind(this);

        // Set current create width and height
        this._currentCreateWidth = -1;
        this._currentCreateHeight = -1;
    }

    /**
    * Override connectedCallback function to handle when component is attached into the DOM.
    * @override
    */
    connectedCallback() {
        // Add the resize event
        window.addEventListener('resize', this._resizeEvent);

        // Create the backgound
        this._create();
    }

    /**
     * Override disconnectedCallback function to handle when component is detached from the DOM.
     * @override
     */
    disconnectedCallback() {
        // Remove the resize event
        window.removeEventListener('resize', this._resizeEvent);

        // Stop the timer
        this._stopTimer();

        // Clear the block element's transition end events
        this._clearTransitionEndEvents();
    }

    /**
     * Resize event.
     * @param {Object} event The resize event object. 
     */
    _resizeEvent(event) {
        // Recreate the whole background
        this._create();
    }

    /**
     * Transition end event.
     * @param {Object} event The transition end event information.
     */
    _transitionEndEvent(event) {
        // Adjust the moving to cell parts
        event.currentTarget.movingToCell.empty = false;
        event.currentTarget.movingToCell.moving = false;
        event.currentTarget.movingToCell.element = event.currentTarget.movingFromCell.element;

        // Adjust the moving from cell parts
        event.currentTarget.movingFromCell.empty = true;
        event.currentTarget.movingFromCell.moving = false;
        event.currentTarget.movingFromCell.element = null;

        // Reset the moving from/to cell parts
        event.currentTarget.movingToCell.element.movingFromCell = null;
        event.currentTarget.movingToCell.element.movingToCell = null;
    }

    /**
     * Timer event.
     * @param {Object} event The timer event information.
     */
    _timerEvent(event) {
        // Look for the next block to move
        const result = this._getNextBlockToMove();

        // If nothing to move
        if (result === null) return;

        // Move the block
        this._moveBlock(result.cellFrom, result.cellTo);
    }

    /**
     * Create the background parts.
     */
    _create() {
        // If nothing has changed then do nothing
        if (this.offsetWidth === this._currentCreateWidth && this.offsetHeight === this._currentCreateHeight) return;

        // Reset the current create width and height
        this._currentCreateWidth = this.offsetWidth;
        this._currentCreateHeight = this.offsetHeight;

        // Clear all inner elements from the cell area
        this._cellAreaElement.innerHTML = '';

        // Clear any previous block element's transition end events
        this._clearTransitionEndEvents();

        // Get styles (they may be inline or in a class somewhere)
        const ccStyleDeclaraction = window.getComputedStyle(this);

        // Set cell row count
        this._cellRowCount = parseInt(ccStyleDeclaraction.getPropertyValue('--cell-row-count'));
        if (isNaN(this._cellRowCount) === true) this._cellRowCount = 10;
        if (this._cellRowCount < 2 || this._cellRowCount > 100) this._cellRowCount = 10;

        // Set cell column count
        this._cellColumnCount = parseInt(ccStyleDeclaraction.getPropertyValue('--cell-column-count'));
        if (isNaN(this._cellColumnCount) === true) this._cellColumnCount = 10;
        if (this._cellColumnCount < 2 || this._cellColumnCount > 100) this._cellColumnCount = 10;

        // If all the cells are perfect squares
        if (this.hasAttribute('square') === true) {
            // Set cell width and height
            this._cellWidth = Math.floor(this.offsetWidth / this._cellColumnCount);
            this._cellHeight = this._cellWidth;

            // Set cell row count
            this._cellRowCount = Math.ceil(this.offsetHeight / this._cellHeight);

            // Set padding gap
            this._paddingGap = Math.floor((this.offsetWidth - (this._cellColumnCount * this._cellWidth )) / 2);
        } else {
            // Set cell width and height
            this._cellWidth = Math.floor(this.offsetWidth / this._cellColumnCount);
            this._cellHeight = Math.floor(this.offsetHeight / this._cellRowCount);

            // Set padding gap
            this._paddingGap = 0;
        }

        // Create the cells
        this._createCells();

        // Set fill ratio
        this._fillRatio = parseInt(ccStyleDeclaraction.getPropertyValue('--fill-ratio'));
        if (isNaN(this._fillRatio) === true) this._fillRatio = 90;
        if (this._fillRatio < 1 || this._fillRatio > 90) this._fillRatio = 90;

        // Set cell count
        this._cellCount = this._cellRowCount * this._cellColumnCount;

        // Set block count
        this._blockCount = Math.floor(this._cellCount * this._fillRatio / 100);
        if (this._blockCount < 1) this._blockCount = 1;
        if (this._blockCount >= this._cellCount) this._blockCount = this._cellCount - 1;

        // Set empty cell count
        this._emptyCellCount = this._cellCount - this._blockCount;

        // Get default assigned elements
        this._assignedElements = this._slotElement.assignedElements();

        // If none then stop here
        if (this._assignedElements.length === 0) return;

        // Create the blocks
        this._createBlocks();

        // Setup the blocks with the cells
        this._setupBlocksWithCells();

        // Get the move interval (in milliseconds)
        this._moveInterval = parseInt(ccStyleDeclaraction.getPropertyValue('--move-interval'));
        if (isNaN(this._moveInterval) === true) this._moveInterval = 250;
        if (this._moveInterval < 0 || this._moveInterval > 60 * 60 * 1000) this._moveInterval = 250;

        // Start timer
        this._startTimer();
    }

    /**
     * Create the cells that the blocks could be located in.
     */
    _createCells() {
        // Set cell row list
        this._cellRowList = [];

        // For each row
        for (let rowIndex = 0; rowIndex < this._cellRowCount; rowIndex++) {
            // Create a new cell row object
            let cellRow = {};

            // Set members
            cellRow.row = rowIndex;
            cellRow.cellColumnList = [];

            // Add to list
            this._cellRowList.push(cellRow);

            // For each column
            for (let columnIndex = 0; columnIndex < this._cellColumnCount; columnIndex++) {
                // Create new cell object
                let cell = {};

                // Set members
                cell.row = rowIndex;
                cell.column = columnIndex;
                cell.left = this._paddingGap + (this._cellWidth * columnIndex);
                cell.top = this._paddingGap + (this._cellHeight * rowIndex);
                cell.width = this._cellWidth;
                cell.height = this._cellHeight;
                cell.leftText = cell.left.toString() + 'px';
                cell.topText = cell.top.toString() + 'px';
                cell.widthText = cell.width.toString() + 'px';
                cell.heightText = cell.height.toString() + 'px';
                cell.empty = false;
                cell.moving = false;
                cell.element = null;

                // Add to list
                cellRow.cellColumnList.push(cell);
            }
        }
    }

    /**
     * Create the blocks from the slot elements.
     */
    _createBlocks() {
        // Set the block list
        this._blockList = [];

        // For each block
        for (let count = 0; count < this._blockCount; count++) {
            // Create random slot element index
            let randomIndex = Math.floor(Math.random() * this._assignedElements.length);
            if (randomIndex === this._assignedElements.length) randomIndex--;

            // Create block object
            let block = {};

            // Clone the slot element
            block.element = this._assignedElements[randomIndex].cloneNode(true);

            // Set class
            block.element.classList.add('block');

            // Set moving from/to cell parts
            block.element.movingFromCell = null;
            block.element.movingToCell = null;

            // Add transition end event
            block.element.addEventListener('transitionend', this._transitionEndEvent);

            // Add to block list
            this._blockList.push(block);

            // Add block element to cell area element
            this._cellAreaElement.appendChild(block.element);
        }
    }

    /**
     * Set which cell each block will start off in.
     */
    _setupBlocksWithCells() {
        // All the cells are set as not empty. We want to randomly pick the ones that will start off as
        // being empty

        // For each empty cell
        for (let count = 0; count < this._emptyCellCount; count++) {
            // Set cell row
            let cellRow = null;

            // Until one found
            while (true) {
                // Select random row
                let row = Math.floor(Math.random() * this._cellRowCount);
                if (row === this._cellRowCount) row--;

                // Set cell row
                cellRow = this._cellRowList[row]; 

                // Set non empty found
                let nonEmptyFound = false;

                // For each cell in row
                for (let cellIndex = 0; cellIndex < cellRow.cellColumnList.length; cellIndex++) {
                    // Get cell
                    let cell = cellRow.cellColumnList[cellIndex];

                    // If empty
                    if (cell.empty === true) continue;

                    // Set there is a non empty found and stop looking
                    nonEmptyFound = true;
                    break;
                }

                // If there is a non empty cell then this row is good
                if (nonEmptyFound === true) break;
            }

            // Until one found
            while (true) {
                // Select random column
                let column = Math.floor(Math.random() * this._cellColumnCount);
                if (column === this._cellColumnCount) column--;

                // Get cell
                let cell = cellRow.cellColumnList[column];

                // If already empty
                if (cell.empty === true) continue;

                // Set this cell as empty and stop looking
                cell.empty = true;
                break;
            }
        }

        // Set block index
        let blockIndex = 0;

        // For each cell row
        for (let cellRowIndex = 0; cellRowIndex < this._cellRowList.length; cellRowIndex++) {
            // Get cell row
            const cellRow = this._cellRowList[cellRowIndex];

            // For each cell column
            for (let cellColumnIndex = 0; cellColumnIndex < cellRow.cellColumnList.length; cellColumnIndex++) {
                // Get cell
                let cell = cellRow.cellColumnList[cellColumnIndex];

                // If empty then skip
                if (cell.empty === true) continue;

                // Set cells block
                const block = this._blockList[blockIndex];

                // Set cell's element
                cell.element = block.element;

                // Set location
                cell.element.style.left = cell.leftText;
                cell.element.style.top = cell.topText;
                cell.element.style.width = cell.widthText;
                cell.element.style.height = cell.heightText;

                // Move on to the next block
                blockIndex++;
            }
        }
    }

    /**
     * Get the next block to move.
     * @return {Object} The result containing the cell from and to. If null then there is currently no cell that can be moved.
     */
    _getNextBlockToMove() {
        // Set available count
        let availableCount = 0;

        // For each cell row
        for (let cellRowIndex = 0; cellRowIndex < this._cellRowList.length; cellRowIndex++) {
            // Get cell row
            const cellRow = this._cellRowList[cellRowIndex];

            // For each cell column
            for (let cellColumnIndex = 0; cellColumnIndex < cellRow.cellColumnList.length; cellColumnIndex++) {
                // Get cell
                let cell = cellRow.cellColumnList[cellColumnIndex];

                // If moving
                if (cell.moving === true) continue;

                // If not empty
                if (cell.empty === false) continue;

                // If there are no surrounding blocks to move into this one
                if (this._getSurroundingBlock(cell) === null) continue;

                // Increase available count
                availableCount++;
            }
        }

        // Randomly pick one of the available cells
        let emptyCellNumber = Math.floor(Math.random() * availableCount);
        if (emptyCellNumber === availableCount) emptyCellNumber = availableCount - 1;

        // Set empty cell
        let emptyCell = null;

        // Set empty count
        let emptyCount = 0;

        // For each cell row
        for (let cellRowIndex = 0; cellRowIndex < this._cellRowList.length; cellRowIndex++) {
            // Get cell row
            const cellRow = this._cellRowList[cellRowIndex];

            // For each cell column
            for (let cellColumnIndex = 0; cellColumnIndex < cellRow.cellColumnList.length; cellColumnIndex++) {
                // Get cell
                let cell = cellRow.cellColumnList[cellColumnIndex];

                // If moving
                if (cell.moving === true) continue;

                // If not empty
                if (cell.empty === false) continue;

                // If there are no surrounding blocks to move into this one
                if (this._getSurroundingBlock(cell) === null) continue;

                // If this is the empty cell we want to use
                if (emptyCellNumber === emptyCount) {
                    // Set this as the empty cell and stop looking
                    emptyCell = cell;
                    break;
                }

                // Increase empty count
                emptyCount++;
            }

            // If we have found the empty cell
            if (emptyCell !== null) break;
        }

        // If no empty cells
        if (emptyCell === null) return null;

        // Set result
        let result = {};

        // Set the cell to part
        result.cellTo = emptyCell;

        // Set the cell from part
        result.cellFrom = this._getSurroundingBlock(result.cellTo);

        // Return the result
        return result;
    }

    /**
     * Checks to see if the given cell has some surrounding blocks that can be moved into it and selects one
     * at random.
     * @param {Object} cell The cell to check for.
     * @return The cell that can be moved, or null of there are none.
     */
    _getSurroundingBlock(cell) {
        // Set cells
        let cellTopCenter = null;
        let cellMiddleLeft = null;
        let cellMiddleRight = null;
        let cellBottomCenter = null;

        // If there is a previous row
        if (cell.row !== 0) {
            // Get the previous row
            const previousRow = this._cellRowList[cell.row - 1];

            // Set top center
            cellTopCenter = previousRow.cellColumnList[cell.column];
        }

        // Get middle row
        const middleRow = this._cellRowList[cell.row];

        // If there is a previous column
        if (cell.column !== 0) {
            // Set middle left
            cellMiddleLeft = middleRow.cellColumnList[cell.column - 1]
        }

        // If there is a next column
        if (cell.column + 1 < this._cellColumnCount) {
            // Set middle right
            cellMiddleRight = middleRow.cellColumnList[cell.column + 1];
        }

        // If there is a next row
        if (cell.row + 1 < this._cellRowCount) {
            // Get the next row
            const nextRow = this._cellRowList[cell.row + 1];

            // Set bottom center
            cellBottomCenter = nextRow.cellColumnList[cell.column];
        }

        // Set block list
        let blockList = [];

        // Workout which ones can be used
        if (cellTopCenter !== null) {
            if (cellTopCenter.empty === false && cellTopCenter.moving === false) blockList.push(cellTopCenter);
        }
        if (cellMiddleLeft !== null) {
            if (cellMiddleLeft.empty === false && cellMiddleLeft.moving === false) blockList.push(cellMiddleLeft);
        }
        if (cellMiddleRight !== null) {
            if (cellMiddleRight.empty === false && cellMiddleRight.moving === false) blockList.push(cellMiddleRight);
        }
        if (cellBottomCenter !== null) {
            if (cellBottomCenter.empty === false && cellBottomCenter.moving === false) blockList.push(cellBottomCenter)
        }

        // If the list is empty
        if (blockList.length === 0) return null;

        // Set random block index
        let blockIndex = Math.floor(Math.random() * blockList.length);
        if (blockIndex === blockList.length) blockIndex = blockList.length - 1;

        // Get and return the block
        return blockList[blockIndex];
    }

    /**
     * Start the process of moving the block from one cell to another.
     * @param {Object} cellFrom The cell to move from.
     * @param {Object} cellTo The cell to move to.
     */
    _moveBlock(cellFrom, cellTo) {
        // Set both cells as moving
        cellFrom.moving = true;
        cellTo.moving = true;

        // Set location new location
        cellFrom.element.style.left = cellTo.leftText;
        cellFrom.element.style.top = cellTo.topText;
        cellFrom.element.style.width = cellTo.widthText;
        cellFrom.element.style.height = cellTo.heightText;

        // Set moving from and to cell parts
        cellFrom.element.movingFromCell = cellFrom;
        cellFrom.element.movingToCell = cellTo;
    }

    /**
     * Clear all the transition end events.
     */
    _clearTransitionEndEvents() {
        // If no blocks
        if (!this._blockList) return;
        
        // For each block (with its element)
        this._blockList.forEach((block) => {
            // Remove the transition end event
            block.element.removeEventListener('transitionend', this._transitionEndEvent);
        });
    }

    /**
     * Start the timer process.
     */
    _startTimer() {
        // Stop the timer if it is still working
        this._stopTimer();

        // Create timer
        this._timerId = setInterval(this._timerEvent, this._moveInterval);
    }

    /**
     * Stops the timer process.
     */
    _stopTimer() {
        // If we need to stop the last timer
        if (this._timerId) {
            // Clear the timer
            clearInterval(this._timerId);

            // Clear the timer id
            this._timerId = 0;
        }
    }
}

// Tell the browser about the new tag and the class it is linked to
customElements.define('background-moving-blocks', BackgroundMovingBlocks);
