import type { DefineComponent } from 'vue'

export interface AppLayoutSection { id: string | number; title?: string; label?: string }
export interface UiAppLayoutProps { modelValue?: string | number; title?: string; header?: string; sections?: Array<AppLayoutSection | [string | number, string]> }
export const UiAppLayout: DefineComponent<UiAppLayoutProps>
