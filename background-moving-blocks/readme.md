# Background Moving Blocks

Creates a grid of cells with a collection of blocks randomly moving around from one cell to another.

```html
<background-moving-blocks
    square
    style="
        width: 100%;
        height: 10rem;
        --cell-column-count: 30;
        --fill-ratio: 50;
        --move-speed: 0.25s;
        --move-transition: ease-in-out;
        --move-interval: 250;">
    <div style="background-color: #f3732d;"></div>
    <div style="background-color: #f8961f;"></div>
    <div style="background-color: #f9c750;"></div>
    <div style="background-color: #287ea1;"></div>
    <div style="background-color: #44aa8b;"></div>
</background-moving-blocks>
```

## Attributes

|Name|Details|
|---|---|
|`square`|If used then all the cells will be perfect squares. The last row of cells may not fit correctly and overflow.|

## Slots

|Name|Details|
|---|---|
|*default*|Each of the default slot elements will be cloned a number of times into blocks that are then moved around the grid of cells. Plain text cannot be used, they must be elements.|

## CSS Variables

|Name|Details|
|---|---|
|`--fill-ratio`|The ratio between the cells that are empty and those that contain a block. Percentage value between 1 and 90.|
|`--cell-row-count`|The number of cell rows. This is only used if the attribute square is not set.|
|`--cell-column-count`|The number of cell columns.|
|`--move-speed`|The time it takes for a block to move from one cell to another (default is 1 second).|
|`--move-transition`|The type of transition the block will move in (default is linear).|
|`--move-interval`|The number of milliseconds between each block move (if possible).|

## Notes

The slots you give can be styled however you like, but it must all be done with inline styling. Using classes will not work, as the class styling will not get through the web component's shadow DOM.

See it running on live here [CodeRunSebug.com/lib/background-moving-blocks/](https://coderundebug.com/lib/background-moving-blocks/).
