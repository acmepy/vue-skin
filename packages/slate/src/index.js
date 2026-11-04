import { Button, ButtonGroup, Badge, Spinner, Card, Link, Navbar, Container, Row, Col, Icon } from './components/basic.js'
import Input from './components/Input.vue'
import InputGroup from './components/InputGroup.vue'
import Select from './components/Select.vue'
import Textarea from './components/Textarea.vue'
import Checkbox from './components/Checkbox.vue'
import Radio from './components/Radio.vue'
import Switch from './components/Switch.vue'
import Autocomplete from './components/Autocomplete.vue'
import List from './components/List.vue'
import ListItem from './components/ListItem.vue'
import DataTable from './components/DataTable.vue'
import DataTableColumnButton from './components/DataTableColumnButton.vue'
import Chart from './components/Chart.vue'
import Modal from './components/Modal.vue'
import Dialog from './components/Dialog.vue'
import Sidebar from './components/Sidebar.vue'
import Dropdown from './components/Dropdown.vue'
import Tabs from './components/Tabs.vue'
import Accordion from './components/Accordion.vue'
import Alert from './components/Alert.vue'
import Toast from './components/Toast.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import { colors, createSlateTheme } from './theme.js'
import './styles/integration.css'

export const adapterName = 'slate'
export default {
  name: adapterName,
  theme: { colors, create: createSlateTheme },
  components: { Button, ButtonGroup, Badge, Spinner, Card, Link, Navbar, Container, Row, Col, Icon, Input, InputGroup, Select, Textarea, Checkbox, Radio, Switch, Autocomplete, List, ListItem, DataTable, DataTableColumnButton, Chart, Modal, Dialog, Sidebar, Dropdown, Tabs, Accordion, Alert, Toast, ThemeSwitcher, ThemeSelector }
}
