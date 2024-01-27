# Clip Path Arc

Take an existing element and create a clip path for it, in the form of an arc, part of a circle or donut shape.

```html
<clip-path-arc style="width: 20rem; height: 20rem;">
    <div
        style="background-color: darkorange;"
        start-angle="20"
        end-angle="135"
        radius-outer="100"
        radius-inner="80"></div>
    <div
        style="background-color: lightblue;"
        start-angle="140"
        end-angle="235"
        radius-outer="100"
        radius-inner="80"></div>
    <div
        style="background-color: gold;"
        start-angle="240"
        end-angle="15"
        radius-outer="100"
        radius-inner="80"></div>
</clip-path-arc>
```

## Attributes

|Name|Details|
|---|---|
|`radius-outer`|The radius length of the outer part of the arc. The value is a percentage amount, between 0 to 100.|
|`radius-inner`|The radius length of the inner part of the arc. The value is a percentage amount, between 0 to 100.|
|`start-angle`|The angle from which the arc starts from. The value is in degrees, between 0 and 360.|
|`end-angle`|The angle to where the arc ends. The value is in degrees, between 0 and 360.|

## Properties & Functions

|Name|Details|
|---|---|
|`update`|After you have changed any of the attributes on the default slots, call this function to recalculate the clip paths.|

## Slots

|Name|Details|
|---|---|
|*default*|Each element inside the web component is a default slot. You need to set the attributes for each one to control the radius and the angles of the arc that will be used to clip around the part of the element you want to remain.|

## Notes

See it running on live here [CodeRunSebug.com/lib/clip-path-arc/](https://coderundebug.com/lib/clip-path-arc/).