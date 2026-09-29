import type { App, Component, ComputedRef, DefineComponent, MaybeRef, Plugin } from 'vue'

/** Keeps editor completion for known values while allowing adapter-specific strings. */
export type SuggestedValue<T extends string> = T | (string & {})
export type Variant = SuggestedValue<'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost'>
export type ControlSize = SuggestedValue<'sm' | 'lg'>
export type IconSize = SuggestedValue<'xs' | 'sm' | 'md' | 'lg' | 'xl'> | number
export type InputType = SuggestedValue<'text' | 'password' | 'email' | 'search' | 'tel' | 'url' | 'number' | 'date' | 'time' | 'datetime-local'>
export type ButtonType = SuggestedValue<'button' | 'submit' | 'reset'>
export type ModalSize = SuggestedValue<'sm' | 'lg' | 'xl' | 'fullscreen'>
export type ToastPosition = 'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end'
export type DialogType = 'alert' | 'confirm' | 'prompt' | 'preloader'
export type Theme = 'light' | 'dark'
export type ComponentOf<Props> = DefineComponent<Props, {}, {}, {}, {}, {}, {}, string[]>

export interface UiButtonProps { variant?: Variant; size?: ControlSize; disabled?: boolean; loading?: boolean; type?: ButtonType }
export interface UiButtonGroupProps { size?: ControlSize; vertical?: boolean; label?: string }
export interface UiIconProps { name: string; label?: string; size?: IconSize }
export type ValidatorResult = boolean | string | null | undefined | void
export type Validator = (value: unknown) => ValidatorResult | Promise<ValidatorResult>
export interface UiInputProps { modelValue?: string | number; label?: string; type?: InputType; name?: string; placeholder?: string; help?: string; tooltip?: string; error?: string | boolean | null; validator?: Validator; disabled?: boolean; readonly?: boolean; required?: boolean; autocomplete?: string }
export interface UiInputGroupProps extends UiInputProps { prefix?: string; suffix?: string }
export interface UiSelectOption { value: string | number; label: string }
export interface UiSelectProps { modelValue?: string | number; label?: string; options?: UiSelectOption[]; placeholder?: string; help?: string; tooltip?: string; error?: string | boolean | null; disabled?: boolean; required?: boolean }
export interface UiCheckboxProps { modelValue?: unknown; label?: string; help?: string; tooltip?: string; error?: string | boolean | null; disabled?: boolean; required?: boolean; trueValue?: unknown; falseValue?: unknown }
export interface UiRadioProps { modelValue?: string | number | boolean; value: string | number | boolean; name?: string; label?: string; help?: string; tooltip?: string; error?: string | boolean | null; disabled?: boolean; required?: boolean }
export interface UiSwitchProps extends UiCheckboxProps {}
export interface UiTextareaProps { modelValue?: string | number; label?: string; name?: string; placeholder?: string; help?: string; tooltip?: string; error?: string | boolean | null; disabled?: boolean; readonly?: boolean; required?: boolean; rows?: number; maxlength?: number }
export interface UiListProps { title?: string; divided?: boolean; bordered?: boolean }
export interface UiListItemProps { href?: string; target?: string; header?: string; title?: string; subtitle?: string; text?: string; footer?: string; after?: string; badge?: string | number; badgeVariant?: Variant; active?: boolean; disabled?: boolean; groupTitle?: boolean; tooltip?: string }
export interface UiLinkProps { href?: string; target?: string; disabled?: boolean }
export interface UiNavbarProps { title?: string; fixed?: boolean; sticky?: boolean }
export interface UiThemeSwitcherProps { modelValue?: Theme | null; storageKey?: string; persist?: boolean }
export interface UiSidebarProps { modelValue?: boolean; position?: SuggestedValue<'start' | 'end'>; width?: string; breakpoint?: SuggestedValue<'sm' | 'md' | 'lg' | 'xl' | 'xxl'> }
export interface UiCardProps { title?: string }
export interface UiAccordionItem { id: string | number; title: string; content: string }
export interface UiAccordionProps { modelValue?: string | number | null; items?: UiAccordionItem[]; flush?: boolean }
export interface UiTabItem { id: string | number; label: string; content: string; disabled?: boolean }
export interface UiTabsProps { modelValue?: string | number | null; items?: UiTabItem[]; justified?: boolean }
export interface UiModalProps { modelValue?: boolean; title?: string; size?: ModalSize; centered?: boolean; closable?: boolean }
export interface UiDialogProps { modelValue?: boolean; type?: DialogType; title?: string; message?: string; label?: string; inputValue?: string; placeholder?: string; acceptText?: string; cancelText?: string }
export interface UiDropdownItem { label: string; value?: unknown; href?: string; disabled?: boolean }
export interface UiDropdownProps { label?: string; items?: UiDropdownItem[]; variant?: Variant; size?: ControlSize; align?: SuggestedValue<'start' | 'end'>; disabled?: boolean }
export interface UiAlertProps { variant?: Variant; dismissible?: boolean }
export interface UiBadgeProps { variant?: Variant; pill?: boolean }
export interface UiToastProps { modelValue?: boolean; title?: string; message?: string; variant?: Variant; position?: ToastPosition; autohide?: boolean; delay?: number; closable?: boolean }
export interface UiSpinnerProps { size?: ControlSize; label?: string }

export const UiIcon: ComponentOf<UiIconProps>
export const requiredComponents: readonly string[]
export const componentContracts: Readonly<Record<string, { props: readonly string[]; events?: readonly string[]; slots?: readonly string[] }>>

export interface VueSkinAdapter { name: string; components: Record<string, Component>; install?: (app: App, options?: unknown) => void }
export interface DialogOptions { label?: string; initialValue?: string; placeholder?: string; acceptText?: string; cancelText?: string }
export interface DialogService { alert(message: string, title?: string, options?: DialogOptions): Promise<void>; confirm(message: string, title?: string, options?: DialogOptions): Promise<boolean>; prompt(message: string, title?: string, options?: DialogOptions): Promise<string | null>; preloader(title?: string, options?: DialogOptions): { close(): void }; Host: Component }
export type VueSkin = Plugin & { dialog: DialogService }

export function validateAdapter(adapter: VueSkinAdapter): VueSkinAdapter
export function createVueSkin(options: { adapter: VueSkinAdapter }): VueSkin
export function createDialogService(adapter: VueSkinAdapter): DialogService
export function useFieldIds(id?: MaybeRef<string | undefined>, help?: MaybeRef<unknown>, error?: MaybeRef<unknown>): { inputId: ComputedRef<string>; helpId: ComputedRef<string | undefined>; errorId: ComputedRef<string | undefined>; describedBy: ComputedRef<string | undefined> }

declare module 'vue' {
  export interface GlobalComponents {
    UiButton: ComponentOf<UiButtonProps>
    UiButtonGroup: ComponentOf<UiButtonGroupProps>
    UiIcon: ComponentOf<UiIconProps>
    UiInput: ComponentOf<UiInputProps>
    UiInputGroup: ComponentOf<UiInputGroupProps>
    UiSelect: ComponentOf<UiSelectProps>
    UiCheckbox: ComponentOf<UiCheckboxProps>
    UiRadio: ComponentOf<UiRadioProps>
    UiSwitch: ComponentOf<UiSwitchProps>
    UiTextarea: ComponentOf<UiTextareaProps>
    UiList: ComponentOf<UiListProps>
    UiListItem: ComponentOf<UiListItemProps>
    UiLink: ComponentOf<UiLinkProps>
    UiNavbar: ComponentOf<UiNavbarProps>
    UiThemeSwitcher: ComponentOf<UiThemeSwitcherProps>
    UiSidebar: ComponentOf<UiSidebarProps>
    UiCard: ComponentOf<UiCardProps>
    UiAccordion: ComponentOf<UiAccordionProps>
    UiTabs: ComponentOf<UiTabsProps>
    UiModal: ComponentOf<UiModalProps>
    UiDialog: ComponentOf<UiDialogProps>
    UiDialogHost: ComponentOf<Record<string, never>>
    UiDropdown: ComponentOf<UiDropdownProps>
    UiAlert: ComponentOf<UiAlertProps>
    UiBadge: ComponentOf<UiBadgeProps>
    UiToast: ComponentOf<UiToastProps>
    UiSpinner: ComponentOf<UiSpinnerProps>
  }
}

export {}
