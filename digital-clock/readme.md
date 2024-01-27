# Digital Clock

Displays a simple digital clock.

```html
<digital-clock
    style="
        --base-color: lightgoldenrodyellow;
        --line-on-color: purple;
        --line-off-color: antiquewhite;">
</digital-clock>
```

## Attributes

|Name|Details|
|---|---|
|`show-24`|If given then the clock will be shown in 24 hour mode. The AM/PM parts will no longer shown. The hour value ranges from 00 to 23.|

## CSS Variables

|Name|Details|
|---|---|
|`--base-color`|The color of the base or background color. Default is `rgb(48, 48, 48)`.|
|`--line-on-color`|The color of the digital number line when shown. Default is `rgb(248, 248, 248)`.|
|`--line-off-color`|The color of the digital number line when it is not shown. Default is `rgb(55, 55, 55)`.|

## Notes

There is an internal minimum width of `20rem` and height of `5rem`. These will be used if no height or width is given to the web component.

See it running on live here [CodeRunSebug.com/lib/digital-clock/](https://coderundebug.com/lib/digital-clock/).