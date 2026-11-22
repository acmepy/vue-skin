import type { DefineComponent } from 'vue'
import type { StepId, StepOrientation, UiStepItem } from '@vue-skin/core'

export interface WizardTransition { from: UiStepItem; to: UiStepItem | null; fromIndex: number; toIndex: number | null; direction: 'next' | 'back' | 'step' | 'finish' }
export interface UiWizardProps { modelValue?: StepId | null; items?: UiStepItem[]; title?: string; orientation?: StepOrientation; linear?: boolean; disabled?: boolean; beforeChange?: (transition: WizardTransition) => boolean | string | void | Promise<boolean | string | void>; cancelable?: boolean; cancelText?: string; backText?: string; nextText?: string; finishText?: string }
/** Slots: panel/default, step, actions, complete. Methods: next, back, goTo, finish, reset. */
export const UiWizard: DefineComponent<UiWizardProps>

export interface AppLayoutSection { id: string | number; title?: string; label?: string; groupTitle?: boolean }
/** Slots: default (main content), header (custom sidebar header; overrides the header prop), navbar-actions (extra controls before the theme buttons). */
export interface UiAppLayoutProps { modelValue?: string | number; title?: string; header?: string; sidebarWidth?: string; sections?: Array<AppLayoutSection | [string | number, string]> }
export const UiAppLayout: DefineComponent<UiAppLayoutProps>

export interface UiLoginProps {
  email?: string
  password?: string
  remember?: boolean
  title?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  rememberLabel?: string
  submitLabel?: string
  loading?: boolean
  disabled?: boolean
  fullHeight?: boolean
}
export const UiLogin: DefineComponent<UiLoginProps, {}, {}, {}, {}, {}, {}, ['update:email', 'update:password', 'update:remember', 'submit']>

export interface DashboardSummary { id: string | number; label: string; value: string | number; description?: string; trend?: string; variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' }
export interface DashboardChart {
  id: string | number
  title?: string
  label?: string
  type?: 'bar' | 'line' | 'doughnut' | 'pie' | 'radar' | 'polarArea' | 'scatter' | 'bubble'
  data: { labels?: unknown[]; datasets: Array<Record<string, unknown>> }
  options?: Record<string, unknown>
  height?: string | number
}
export interface DashboardTable {
  id: string | number
  title?: string
  data: Array<Record<string, unknown>>
  header?: Record<string, { label?: string; align?: 'start' | 'center' | 'end' }>
  footer?: string
  filter?: boolean
  striped?: boolean
  scroll?: boolean | string
  showId?: boolean
  verticalBorders?: boolean
  horizontalBorders?: boolean
  detailLabel?: string
}
/** Slots: actions, summary ({ item }), table-detail ({ table, row, index }), default. Compose inside UiAppLayout for navigation. */
export interface UiDashboardProps { title?: string; description?: string; summary?: DashboardSummary[]; charts?: DashboardChart[]; tables?: DashboardTable[] }
export const UiDashboard: DefineComponent<UiDashboardProps>
