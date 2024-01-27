# Grid Setup

A grid of cells that the user can setup live, in the browser, adding, removing cells, resizing columns, rows and so on.

```html
<grid-setup></grid-setup>
```

## Attributes


### `edit-mode`
This is the type of information that is being edited. The value can be one of the following.

- `size` Adjust the percentage size of the columns and rows
- `number` Add and remove the number of columns and rows
- `block` Add, remove cells and change their span sizes       
- `select` Allows the user to select one of the cells|

### `menu`
Controls if the menu should be shown. If not used then no menu is displayed. The value can be one of the following.

- `top-left`
- `top-right`
- `bottom-left`
- `bottom-right`

## Slots

### *default*

Each default slot is placed within the grid. Each cell needs the following attributes to control where it is placed and what its size is.

- `column`
- `row`
- `colspan`
- `rowspan`

#### Notes:
- The column and row values start at 1.
- The span values are only required if the cell is stretched over multiple cells.
- You will also need to add an `id` value for all your cells.

## Events

### `add`

When the user selects to add a new cell. It is up to you to show the user what to add and then add a new element inside the `<grid-setup>`, with column and row attributes. The whole `<grid-setup>` becomes disabled, and you cannot select or change anything, until you either add a new cell slot or call the `cancelAdd` function.

Extra event information is as follows.

|Name|Details|
|---|---|
|`event.detail.column`|The column of the cell that is being added.|
|`event.detail.row`|The row of the cell that is being added.|

### `remove`

When the user selects to remove an existing block. This is fired after the element was removed from the `<grid-setup>`.

Extra event information is as follows.

|Name|Details|
|---|---|
|`event.detail.id`|The id of the cell slot element that was removed.|
|`event.detail.column`|The column of the cell that is being removed.|
|`event.detail.row`|The row of the cell that is being removed.|

### `changed`

When the grid columns or rows have changed in size or have been added or removed. When a cell is resized (span length adjusted).

### `select`

When the select edit-mode is used, this returns the chosen slotted cell element.

## Properties & Functions

|Name|Details|
|---|---|
|`columns` `rows`|Gets and sets the list of columns and rows. The columns and rows attributes contain a string of integer values that give the column or row sizes in percentages. This gets and sets the same information but as a list of integer numbers. They will all add up to 100.|
|`cancelAdd`|When the user selects to add a new cell, it is highlighted, and the "add" event is fired. The highlighted cell is unhighlighted when a new cell slot element is added. But if the user changes their mind and wants to cancel the adding of a new cell, then you need to cancel the add process, which will unhighlight the cell.|

## Notes

- The grid will show all the cells in the places you have set them.
You need to set the attribute `edit-mode` or `menu` to start the editing process and allowing the user to change and configure the grid. You are responsible for saving the updated cell and grid changes.

- You can work in two different ways. The first option is to have the edit mode controlled somewhere outside the grid-setup element, allowing the user to select what they want to edit.
The second method is to have some option that turns the menu on and off, which switches the grid in and out of editing.          

- The `edit-mode` option `select` is not part of the menu. If you want to give the user the option to select one of the slotted cells then you need to set the `edit-mode` attribute manually. After the user has selected a slotted cell, it is up to you to remove the `edit-mode` attribute, otherwise the selection options will remain shown.      

- The order of the cells will not change if the direction is different, so it looks the same in `ltr` (left to right) and `rtl` (right to left) for example. It will not change when the writing mode is different too. It always uses the `horizontal-tb` (top to bottom) mode.          


See it running on live here [CodeRunSebug.com/lib/grid-setup/](https://coderundebug.com/lib/grid-setup/).
