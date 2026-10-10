import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

async function readJson(path) {
  const text = await readFile(path, 'utf8')
  return { path, text, data: JSON.parse(text) }
}

function serialize(file) {
  const indent = file.text.match(/\n([\t ]+)"/)?.[1] ?? '  '
  const newline = file.text.includes('\r\n') ? '\r\n' : '\n'
  const trailingNewline = file.text.endsWith('\n') ? newline : ''
  return JSON.stringify(file.data, null, indent).replace(/\n/g, newline) + trailingNewline
}

/** Synchronize library versions only; keep private root/playground metadata otherwise intact. */
export async function syncVersions(root = repositoryRoot) {
  const manifest = await readJson(join(root, 'package.json'))
  const version = manifest.data.version
  if (typeof version !== 'string' || !version.trim()) {
    throw new Error('El package.json raíz debe declarar una versión no vacía.')
  }

  const packages = []
  const entries = await readdir(join(root, 'packages'), { withFileTypes: true })
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue
    try {
      const file = await readJson(join(root, 'packages', entry.name, 'package.json'))
      packages.push({ file, key: `packages/${entry.name}` })
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }

  let lock
  try {
    lock = await readJson(join(root, 'package-lock.json'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  // Validate everything before writing; never regenerate dependencies or run npm hooks.
  if (lock) {
    if (![2, 3].includes(lock.data.lockfileVersion) || !lock.data.packages?.['']) {
      throw new Error('Se requiere un package-lock.json de npm con lockfileVersion 2 o 3.')
    }
    for (const { key } of packages) {
      if (!lock.data.packages[key]) {
        throw new Error(`Falta ${key} en package-lock.json. Ejecuta npm install antes de sincronizar.`)
      }
    }
  }

  const files = []
  for (const { file, key } of packages) {
    file.data.version = version
    files.push(file)
    if (lock) lock.data.packages[key].version = version
  }
  if (lock) {
    lock.data.version = version
    lock.data.packages[''].version = version
    files.push(lock)
  }
  for (const file of files) {
    const text = serialize(file)
    if (text !== file.text) await writeFile(file.path, text, 'utf8')
  }
  return { version, packages: packages.map(({ file }) => file.data.name) }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncVersions().then(({ version, packages }) => {
    console.log(`Versión sincronizada: ${version}`)
    for (const name of packages) console.log(`  ${name}`)
  }).catch((error) => {
    console.error(`No se pudieron sincronizar las versiones: ${error.message}`)
    process.exitCode = 1
  })
}
