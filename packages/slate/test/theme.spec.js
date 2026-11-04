import { describe, expect, it } from 'vitest'
import { colors, contrast, createSlateTheme, slatePalette } from '../src/theme.js'

describe('Slate palette', () => {
  it('keeps body text, muted text, primary labels and semantic labels readable in every palette', () => {
    for (const { value: color } of colors) for (const resolvedMode of ['light','dark']) for (const vibrant of [true,false]) for (const monochrome of [true,false]) {
      const palette = slatePalette({ color, resolvedMode, vibrant, monochrome })
      expect(contrast(palette.foreground, palette.background)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(palette.mutedForeground, palette.background)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(palette.primary, palette.onPrimary)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(palette.primary, palette.card)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(palette.primary, palette.accent)).toBeGreaterThanOrEqual(4.5)
      // The same label-selection rule is used for semantic filled buttons.
      for (const name of ['success','danger','warning','info']) {
        expect(Math.max(contrast(palette[name], '#ffffff'), contrast(palette[name], '#101827'))).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('separates the page from its cards and changes tint independently of accent intensity', () => {
    for (const resolvedMode of ['light','dark']) {
      const plain = slatePalette({ resolvedMode })
      const vibrant = slatePalette({ resolvedMode, vibrant:true })
      const tinted = slatePalette({ resolvedMode, monochrome:false })
      expect(plain.background).not.toBe(plain.card)
      expect(plain.primary).not.toBe(vibrant.primary)
      expect(plain.background).toBe(vibrant.background)
      expect(plain.primary).toBe(tinted.primary)
      expect(plain.background).not.toBe(tinted.background)
      expect(plain.card).not.toBe(tinted.card)
    }
  })

  it('scopes tokens and restores the target and stylesheet when disposed', () => {
    const target = document.createElement('div')
    target.dataset.uiSlate = 'previous'
    target.className = 'dark custom'
    const theme = createSlateTheme({ target })
    try {
      theme.apply({ resolvedMode:'light', color:'blue', monochrome:true, vibrant:false })
      const owner = target.dataset.uiSlate
      const style = document.querySelector(`[data-slate-theme-style="${owner}"]`)
      expect(style.textContent).toContain(`[data-ui-slate="${owner}"]`)
      expect(style.textContent).toContain('--sl-chrome:')
      expect(target.classList.contains('dark')).toBe(false)
      theme.dispose()
      expect(document.querySelector(`[data-slate-theme-style="${owner}"]`)).toBeNull()
      expect(target.dataset.uiSlate).toBe('previous')
      expect(target.className).toBe('custom dark')
    } finally { theme.dispose() }
  })
})
