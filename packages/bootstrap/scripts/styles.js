// Compile each official Bootstrap partial once. Components share low-level CSS
// (grid, form controls, validation, tooltips) instead of copying it into every file.
export const bundles = {
  base: ['root', 'reboot', 'type', 'helpers', 'utilities/api'],
  Accordion: ['accordion'], Alert: ['alert'], Badge: ['badge'],
  Button: ['buttons'], ButtonGroup: ['button-group'], Card: ['card'],
  Container: ['containers'], Grid: ['grid'], DataTable: ['tables'],
  FormField: ['forms/labels', 'forms/form-text', 'forms/validation'],
  Input: ['forms/form-control'], FloatingLabel: ['forms/floating-labels'],
  Select: ['forms/form-select'], Checkbox: ['forms/form-check'],
  InputGroup: ['forms/input-group'], List: ['list-group'],
  Dropdown: ['dropdown'], Tabs: ['nav'], Navbar: ['navbar'],
  Modal: ['modal'], Sidebar: ['offcanvas'], Spinner: ['spinners'],
  Toast: ['toasts'], Tooltip: ['tooltip'], Close: ['close'], Transitions: ['transitions']
}

export const componentStyles = {
  Accordion: ['Accordion', 'Transitions'], Alert: ['Alert', 'Close'], Badge: ['Badge'],
  Button: ['Button', 'Spinner'], ButtonGroup: ['ButtonGroup'], Card: ['Card'],
  Container: ['Container'], Row: ['Grid'], Col: ['Grid'], Chart: [],
  FormField: ['FormField', 'FloatingLabel', 'Tooltip'],
  Input: ['Input'], Textarea: ['Input'], Select: ['Select'],
  InputGroup: ['Input', 'InputGroup'], Autocomplete: ['Input', 'Dropdown'],
  Checkbox: ['FormField', 'Checkbox', 'Tooltip'], Radio: ['FormField', 'Checkbox', 'Tooltip'],
  Switch: ['FormField', 'Checkbox', 'Tooltip'],
  Link: ['Button'], List: ['List'], ListItem: ['List', 'Tooltip'],
  Dropdown: ['Button', 'Dropdown'], Tabs: ['Tabs'], Stepper: [], Navbar: ['Container', 'Tabs', 'Navbar'],
  Modal: ['Modal', 'Close', 'Transitions'], Sidebar: ['Sidebar', 'Transitions'],
  Spinner: ['Spinner'], Toast: ['Toast', 'Close', 'Transitions'],
  Dialog: [], DataTable: ['DataTable'], DataTableColumnButton: [],
  ThemeSwitcher: ['Button'], ThemeSelector: [], ThemeSelectorPanel: []
}
