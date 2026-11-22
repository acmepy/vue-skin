export const gridBreakpoints = ['sm', 'md', 'lg', 'xl', 'xxl']
export const gridGaps = { none: 0, xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }
export function validSpan(value) {
  return value === 'auto' || (typeof value === 'number' ? Number.isInteger(value) && value >= 1 && value <= 12 : /^(?:[1-9]|1[0-2])$/.test(value))
}
export const spanProp = { type: [Number, String], validator: validSpan }
