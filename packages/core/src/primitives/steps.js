import { computed } from 'vue'

/** Ordered step state shared by adapters and compositions, without markup or CSS. */
export function useStepState(props) {
  const activeIndex = computed(() => {
    const selected = props.items.findIndex(item => item.id === props.modelValue && !item.disabled)
    return selected >= 0 ? selected : props.items.findIndex(item => !item.disabled)
  })
  const current = computed(() => props.items[activeIndex.value])
  const completed = index => Boolean(props.items[index]?.completed) || (!props.items[index]?.disabled && index < activeIndex.value)
  return { activeIndex, current, completed }
}
