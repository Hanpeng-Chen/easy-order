import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'
import ConfirmOrder from '../views/ConfirmOrder.vue'
import Index from '../views/Index.vue'
import OrderList from '../views/OrderList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/confirmOrder',
    name: 'ConfirmOrder',
    component: ConfirmOrder
  },
  {
    path: '/orderList',
    name: 'OrderList',
    component: OrderList
  }
]

const router = new VueRouter({
  routes
})

export default router
