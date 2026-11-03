import { createRequire } from 'node:module'
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
// Package the official compiled CSS; applications do not need a Tailwind pipeline.
const dependency = dirname(createRequire(import.meta.url).resolve('basecoat-css/package.json'))
const destination = fileURLToPath(new URL('../src/styles/vendor/', import.meta.url))
mkdirSync(destination, { recursive: true })
copyFileSync(resolve(dependency, 'dist/basecoat.cdn.min.css'), resolve(destination, 'basecoat.css'))
copyFileSync(resolve(dependency, 'LICENSE.md'), resolve(destination, 'LICENSE.basecoat.md'))
