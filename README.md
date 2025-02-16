# mathjax-svg-filter

A pandoc filter that uses MathJaX to convert math inlines into
inline raw HTML blocks containing SVG elements.  A title element
with the original TeX math source is included in each SVG for
accessibility.

## Installation

To install this locally, just do
```
npm install github:jgm/mathjax-svg-filter
```
in the directory where you'd like to run pandoc.  This will
create a `node_modules` directory.  You can then specify
```
--filter ./node_modules/.bin/mathjax-svg-filter.js
```
on the command line when using pandoc to convert content to
HTML or EPUB.

## Configuration

You can specify the SVG font to be used by setting the
`mathjax-svg-font` metadata field in your document.
Valid values are `TeX`, `STIX-Web`, `Asana-Math`, `Neo-Euler`,
`Gyre-Pagella`, `Gyre-Termes` and `Latin-Modern`.

## Alternatives

These filters have not been recently maintained and do not
work with recent versions of MathJaX:

- <https://github.com/lierdakil/mathjax-pandoc-filter>
- <https://github.com/shreevatsa/pandoc-mathjax-filter>

