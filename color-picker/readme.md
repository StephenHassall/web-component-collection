# Color Picker

A simple color picker web component that handles red, green, blue and alpha (transparency) values. Also works with hue, saturation and lightness values.

```html
<color-picker></color-picker>
```

## Attributes

|Name|Details|
|---|---|
|`value`|The current color value. The format of the color is #RRGGBBAA. It is similar to the `<input type="color">` value, but it also contains the alpha amount.|

## Events

|Name|Details|
|---|---|
|`change`|When the user changes the color value. Either but selecting the color or inputting its value.|

## Properties & Functions

|Name|Details|
|---|---|
|`red`|Gets the current red color value. They range from 0 to 255. Read only.|
|`green`|Gets the current green color value. They range from 0 to 255. Read only.|
|`blue`|Gets the current blue color value. They range from 0 to 255. Read only.|
|`alpha`|Gets the current alpha (transparency) value. It ranges from 0.0 to 1.0. Read only.|
|`hue`|Gets the hue part of the HSL color. The hue ranges from 0 to 360. Read only.|
|`saturation`|Gets the saturation part of the HSL color. The saturation ranges from 0 to 100. Read only.|
|`lightness`|Gets the lightness part of the HSL color. The lightness ranges from 0 to 100. Read only.|
|`value`|Gets and sets the current color value. This is in the format #RRGGBBAA, using hexadecimal characters. You can both read and write this value.|

## Notes

- You need to set the width and height.
- The internal parts automatically expand to fill the space available.
- The background, font family and font size are all inherited, so you can style them as you need.


See it running on live here [CodeRunSebug.com/lib/color-picker/](https://coderundebug.com/lib/color-picker/).