export const colors = [
  { value: 'blue', label: 'Azul', color: '#2563eb' }, { value: 'indigo', label: 'Índigo', color: '#4f46e5' },
  { value: 'purple', label: 'Violeta', color: '#9333ea' }, { value: 'pink', label: 'Rosa', color: '#db2777' },
  { value: 'red', label: 'Rojo', color: '#dc2626' }, { value: 'orange', label: 'Naranja', color: '#ea580c' },
  { value: 'teal', label: 'Turquesa', color: '#0d9488' }, { value: 'green', label: 'Verde', color: '#16a34a' }
]
const rgb = value => value.match(/[\da-f]{2}/gi).map(part => parseInt(part,16))
const mix = (a,b,weight) => '#' + rgb(a).map((part,i) => Math.round(part*(1-weight)+rgb(b)[i]*weight).toString(16).padStart(2,'0')).join('')
const luminance = value => rgb(value).map(part => { const c=part/255; return c<=.04045 ? c/12.92 : ((c+.055)/1.055)**2.4 }).reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0)
const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05)
let nextId = 0
export function createTerminalTheme({ target = document.documentElement } = {}) {
  const id = 'terminal-' + ++nextId
  const old = target.getAttribute('data-ui-terminal'), darkBefore = target.classList.contains('dark')
  const style = document.createElement('style')
  style.dataset.terminalThemeStyle = id
  document.head.append(style)
  return {
    apply(state) {
      const dark = state.resolvedMode === 'dark'
      const base = (colors.find(item=>item.value===state.color) ?? colors[0]).color
      const primary = state.vibrant ? mix(base,'#ffffff',.05) : mix(base,'#71717a',.24)
      const text = contrast(primary,'#ffffff') >= contrast(primary,'#000000') ? '#ffffff' : '#000000'
      const tint = value => state.monochrome ? value : mix(value,primary,dark?.1:.045)
      const background = tint(dark?'#09090b':'#ffffff'), surface = tint(dark?'#18181b':'#fafafa')
      const border = tint(dark?'#3f3f46':'#e4e4e7'), foreground = dark?'#fafafa':'#18181b'
      target.dataset.uiTerminal = id
      target.classList.toggle('dark',dark)
      style.textContent = `[data-ui-terminal="${id}"] { color-scheme: ${state.resolvedMode}; --background: ${background}; --foreground: ${foreground}; --card: ${background}; --card-foreground: ${foreground}; --popover: ${background}; --popover-foreground: ${foreground}; --primary: ${primary}; --primary-foreground: ${text}; --ring: ${primary}; --muted: ${surface}; --muted-foreground: ${dark?'#a1a1aa':'#52525b'}; --secondary: ${surface}; --secondary-foreground: ${foreground}; --accent: ${surface}; --accent-foreground: ${foreground}; --border: ${border}; --input: ${border}; --sidebar: ${surface}; --sidebar-foreground: ${foreground}; --sidebar-primary: ${primary}; --sidebar-primary-foreground: ${text}; --sidebar-accent: ${surface}; --sidebar-accent-foreground: ${foreground}; --sidebar-border: ${border}; --sidebar-ring: ${primary}; --ui-layout-surface: ${surface}; --ui-sidebar-scroll-thumb: ${dark?'#52525b':'#a1a1aa'}; --tc-background: ${background}; --radius:0px; --destructive:${dark?'#f87171':'#b91c1c'}; --terminal-bg:${background}; --terminal-fg:${foreground}; --border-color:${border}; --surface:${surface}; --muted:${dark?'#a1a1aa':'#52525b'}; --success:${dark?'#4ade80':'#15803d'}; --warning:${dark?'#facc15':'#a16207'}; --danger:${dark?'#f87171':'#b91c1c'}; --info:${dark?'#38bdf8':'#0369a1'}; }`
    },
    dispose() { style.remove(); if(target.dataset.uiTerminal !== id) return; if(old===null)target.removeAttribute('data-ui-terminal');else target.setAttribute('data-ui-terminal',old);target.classList.toggle('dark',darkBefore) }
  }
}
