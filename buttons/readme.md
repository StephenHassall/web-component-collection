# Button

A collection of buttons with different colors that can be expanded to include extra icons.

```html
<button-default>Default</button-default>
```

## Attributes

|Name|Details|
|---|---|
|`disabled`|Disables the button so that it can not be highlighted, clicked or given the focus.|
|`one-click`|Only allows the button to be pressed (clicked) once and then afterwards it disables itself. You can enable it again afterwards. This is used to stop the user from pressing the button more than once by accident.|

## Slots

|Name|Details|
|---|---|
|*default*|The center text of the button. All text will be shown on a single line. When using plain text, if the text is too large to fit then it may not display correctly. To help resolve this issue, you can put the text between some `<span>` tags, which makes the text ellipsis.|
|`prefix`|Inserts the slot item on the left of the text. This can be used to add an icon.|
|`suffix`|Inserts the slot item on the right of the text. This can be used for adding an icon.|

## CSS Variables

The below variables only work with the `<button-custom>` tag.

|Name|Details|
|---|---|
|`--background`|When the button does not have the mouse hovering over it, is not being pressed, and does not have the focus, then these are the variables that are used.|
|`--text-color`||
|`--border-color`||
|`--hover-background`|When the mouse is hovering over the button then these are the CSS variables being used.|
|`--hover-text-color`||
|`--hover-border-color`||
|`--active-background`|While the button is being pressed it is active and these following variables will be used.|
|`--active-text-color`||
|`--active-border-color`||
|`--focus-box-shadow`|When the button has the focus it will be given a box shadow. This sets that CSS property.|

## Notes

- Does not work with the `autofocus` attribute.
- The `one-click` attribute does not currently work with Safari.

See it running on live here [CodeRunSebug.com/lib/buttons/](https://coderundebug.com/lib/buttons/).