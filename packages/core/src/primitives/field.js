import { computed, unref, useId } from 'vue'

/**
 * Provides stable, adapter-neutral IDs for a form control and its help/error text.
 * Arguments can be plain values or Vue refs/computed values.
 */
export function useFieldIds(id, help, error) {
  const generatedId = useId()
  const inputId = computed(() => unref(id) || `vue-skin-${generatedId}`)
  const helpId = computed(() => unref(help) ? `${inputId.value}-help` : undefined)
  const errorId = computed(() => unref(error) ? `${inputId.value}-error` : undefined)
  const describedBy = computed(() => [helpId.value, errorId.value].filter(Boolean).join(' ') || undefined)

  return { inputId, helpId, errorId, describedBy }
}
