import { createRequire } from 'node:module'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeBasecoatCss } from './normalize-css.js'
// Package the official compiled CSS; applications do not need a Tailwind pipeline.
const dependency = dirname(createRequire(import.meta.url).resolve('basecoat-css/package.json'))
const destination = fileURLToPath(new URL('../src/styles/vendor/', import.meta.url))
mkdirSync(destination, { recursive: true })
const css = readFileSync(resolve(dependency, 'dist/basecoat.cdn.min.css'), 'utf8')
writeFileSync(resolve(destination, 'basecoat.css'), normalizeBasecoatCss(css), 'utf8')
copyFileSync(resolve(dependency, 'LICENSE.md'), resolve(destination, 'LICENSE.basecoat.md'))
