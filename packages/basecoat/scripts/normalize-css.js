// Basecoat 1.0.2 ships an empty :has() on a tooltip pseudo-element.
// Browsers discard this invalid rule; remove only that known selector so
// bundlers do not warn while minifying the otherwise unchanged vendor CSS.
export function normalizeBasecoatCss(css) {
  return css.replace(/(^|})\[data-tooltip\]::?before:has\(\)\s*\{[^{}]*\}/g, '$1')
}
