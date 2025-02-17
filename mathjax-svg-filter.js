#!/usr/bin/env node
"use strict";
const pandoc = require("pandoc-filter");
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
var mj = null;

function wrap(display, s) {
  return '<span class="' + (display ? 'display-math' : 'inline-math') +
    '">' + s + '</span>';
}

async function action({t: type, c: content}, _format, meta) {
  // load MathJax if not loaded yet.
  if (mj === null) {
    mj = require('mathjax').init({
      loader: { load: ['input/tex', 'output/svg'] },
      enableAssistiveMml: true,
      SVG: {
        font: meta["mathjax-svg-font"] || 'TeX',
        minScaleAdjust: 75,
        scale: 100,
        matchFontHeight: true,
      }});
  }

  if (type == 'Math') {
    const tex = content[1];
    const display = content[0].t == 'DisplayMath';
    const result = await mj.then((MathJax) => {
      const svg = MathJax.tex2svg(tex, { display: display });
      return MathJax.startup.adaptor.innerHTML(svg);
    }).catch((err) => console.log(err.message));

    const doc = new DOMParser().parseFromString(result, 'text/xml');
    let title = doc.getElementsByTagName('title')[0];
    if (!title) {
      title = doc.createElement('title');
      doc.documentElement.insertBefore(title, doc.documentElement.firstChild);
      title.textContent = tex;
    }

    // We make d=" " because if it is "", tagsoup will render as d
    // and epubcheck wants the d=""!
    const paths = doc.getElementsByTagName('path');
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const dAttr = path.getAttribute('d');
      if (dAttr === '' || dAttr === null) {
        path.setAttribute('d', ' ');
      }
    }
    return pandoc.RawInline("html", wrap(display, new XMLSerializer().serializeToString(doc)));
  }
};

pandoc.stdio(action);
