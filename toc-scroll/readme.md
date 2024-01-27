# TOC (tabel of contents) Scroll

Shows a table of contents that automatically sets the header labels and highlights the one you are on.

It searches for `<section>...<h1>` tags and uses them to create the list of rows. Each one gets highlighted when the section header appears on the page. Selecting one the rows will take the page position to that section header.

```html
<section>
    <h1>Header #1</h1>
    ...
</section>
<section>
    <h1>Header #2</h1>
    ...
</section>
<section>
    <h1>Header #3</h1>
    ...
</section>
<!-- Somewhere sticky (always shown on screen) -->
<toc-scroll></toc-scroll>
```

## Notes

See it running on live here [CodeRunSebug.com/learn/web-component/style/](https://coderundebug.com/learn/web-component/style/).
