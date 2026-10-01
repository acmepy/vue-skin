import type { DefineComponent } from 'vue'

export interface AppLayoutSection { id: string | number; title?: string; label?: string; groupTitle?: boolean }
export interface UiAppLayoutProps { modelValue?: string | number; title?: string; header?: string; sections?: Array<AppLayoutSection | [string | number, string]> }
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
