# Background Rotating Fans

Show up to 50 fans, each with two different colors, rotating at different speeds.

```html
<background-rotating-fans
    style="
        height: 15rem;
        --fan1-color1: #f9c750;
        --fan1-color2: #287ea1;
        --fan1-speed: 120s;
        --fan1-gap: 20deg;
        --fan1-color-gap: 0.5deg;
        --fan1-x: -40%;
        --fan1-y: -30%;
        --fan1-opacity: 1.0;">
</background-rotating-fans>
```

## CSS Variables

|Name|Details|
|---|---|
|`--fan1-???`|You can have up to 50 fans, each with their own set of variables. They need to start at number 1 and increase by 1 for each extra fan you are adding.|
|`--fan1-color1` `--fan1-color2`|The fan has two colors. Use these to set the color of each fan blade.|
|`--fan1-gap`|The size of each fan blade, in deg units. Make sure they can be divided by 360 degrees, otherwise it will not look correct.|
|`--fan1-color-gap`|There is a gap between each color blade that has a smooth shading. The larger this amount the more blurry the fin joins look (in deg).|
|`--fan1-speed`|The time it takes to rotate 360 degrees.|
|`--fan1-x` `--fan1-y`|The offset where the center of the fan is located. To be in the top left corner, set x to -50% and y to -50%. You can use rem, em and so on, but not "0".|
|`--fan1-opacity`|How transparent the whole fan is (0 to 1).|

## Notes

Be careful with the opacity value. You may block other fans if you do not allow them to be seen through.

See it running on live here [CodeRunSebug.com/lib/background-rotating-fans/](https://coderundebug.com/lib/background-rotating-fans/).
