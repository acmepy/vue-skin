import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { syncVersions } from '../../../scripts/sync-versions.js'

let root
const writeJson = (path, data) => writeFile(path, `${JSON.stringify(data, null, 2)}\n`)
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'vue-skin-version-test-'))
  await mkdir(join(root, 'packages', 'core'), { recursive: true })
  await mkdir(join(root, 'packages', 'bootstrap'), { recursive: true })
  await mkdir(join(root, 'playground'))
  await writeJson(join(root, 'package.json'), { private: true, version: '0.2.0-beta.1' })
  await writeJson(join(root, 'packages', 'core', 'package.json'), { name: '@vue-skin/core', version: '0.0.1' })
  await writeJson(join(root, 'packages', 'bootstrap', 'package.json'), { name: '@vue-skin/bootstrap', version: '0.0.1', dependencies: { '@vue-skin/core': 'file:../core' } })
  await writeJson(join(root, 'playground', 'package.json'), { private: true, version: '0.1.1' })
})
afterEach(async () => {
  const target = resolve(root)
  if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith('vue-skin-version-test-')) {
    throw new Error('Unexpected temporary fixture path')
  }
  await rm(target, { recursive: true, force: true })
})

describe('version:sync', () => {
  it('syncs library and lockfile versions without changing other metadata or the playground', async () => {
    const lock = {
      version: '0.0.1', lockfileVersion: 3,
      packages: {
        '': { version: '0.0.1', workspaces: ['packages/*', 'playground'] },
        'packages/core': { version: '0.0.1' },
        'packages/bootstrap': { version: '0.0.1', dependencies: { '@vue-skin/core': 'file:../core' } },
        playground: { version: '0.1.1' },
        'node_modules/vue': { version: '3.5.0', integrity: 'unchanged' },
        'node_modules/@vue-skin/core': { resolved: 'packages/core', link: true }
      }
    }
    const lockPath = join(root, 'package-lock.json')
    await writeJson(lockPath, lock)
    const result = await syncVersions(root)
    expect(result).toEqual({ version: '0.2.0-beta.1', packages: ['@vue-skin/bootstrap', '@vue-skin/core'] })
    const core = await readJson(join(root, 'packages', 'core', 'package.json'))
    const bootstrap = await readJson(join(root, 'packages', 'bootstrap', 'package.json'))
    expect(core.version).toBe(result.version)
    expect(bootstrap.version).toBe(result.version)
    expect(bootstrap.dependencies).toEqual({ '@vue-skin/core': 'file:../core' })
    const updated = await readJson(lockPath)
    expect(updated.version).toBe(result.version)
    expect(updated.packages[''].version).toBe(result.version)
    expect(updated.packages['packages/core'].version).toBe(result.version)
    expect(updated.packages['packages/bootstrap'].version).toBe(result.version)
    expect(updated.packages.playground).toEqual(lock.packages.playground)
    expect(updated.packages['node_modules/vue']).toEqual(lock.packages['node_modules/vue'])
    expect(updated.packages['node_modules/@vue-skin/core']).toEqual(lock.packages['node_modules/@vue-skin/core'])
    expect((await readJson(join(root, 'playground', 'package.json'))).version).toBe('0.1.1')
    const text = await readFile(lockPath, 'utf8')
    await syncVersions(root)
    expect(await readFile(lockPath, 'utf8')).toBe(text)
  })

  it('works without a lockfile and skips directories without manifests', async () => {
    await mkdir(join(root, 'packages', 'notes'))
    await syncVersions(root)
    expect((await readJson(join(root, 'packages', 'core', 'package.json'))).version).toBe('0.2.0-beta.1')
  })

  it('fails before changing any manifest when the lockfile is incomplete', async () => {
    await writeJson(join(root, 'package-lock.json'), { lockfileVersion: 3, packages: { '': { version: '0.0.1' } } })
    await expect(syncVersions(root)).rejects.toThrow('Ejecuta npm install')
    expect((await readJson(join(root, 'packages', 'core', 'package.json'))).version).toBe('0.0.1')
    expect((await readJson(join(root, 'packages', 'bootstrap', 'package.json'))).version).toBe('0.0.1')
  })
})
