import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message, Container, Header, Aside, Main,
  Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem, Card,
  Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, MessageBox, Dialog,
  Tag, Option, Select, Tree, Cascader
} from 'element-ui'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Cascader)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Button)
