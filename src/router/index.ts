import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import addItem from '@/views/AddItem.vue'
import Search from '../views/Search.vue'
import Login from '@/views/Login.vue'
import * as config from '../../config/config.json'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Search',
    name: 'Search',
    component: Search
  },
  {
    path: '/addItem',
    name: 'Add Item',
    component: addItem
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/shelf',
    name: 'Shelf',
    component: () => import(/* webpackChunkName: "about" */ '../components/Shelf.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../components/Register.vue')
  },
  {
    path: '/MAC',
    name: 'MACAddress',
    component: () => import('../components/MACAddress.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/Settings.vue')
  },
  {
    path: '/about',
    name: 'AboutUs',
    component: () => import('../components/AboutUs.vue')
  },
  {
    path: '/itemToShelf',
    name: 'ItemToShelf',
    component: () => import('../components/ItemToShelf.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// Authentication, can be disabled in config.json
if (!config.disableAuth) {
  router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register']
    const adminPages = ['/itemToShelf', '/MAC', '/addItem', '/shelf']
    const authRequired = !publicPages.includes(to.path)
    const adminRequired = adminPages.includes(to.path)
    const loggedIn = localStorage.getItem('user')
    let isAdmin = false
    if (localStorage.getItem(('user'))) {
      isAdmin = (JSON.parse(localStorage.getItem('user')!).role === 'admin')
    }
    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
      next('/login')
    } else {
      // Trying to access a restricted page only for admins
      if (adminRequired) {
        if (isAdmin) {
          next()
        } else next('/')
      } else next()
    }
  })
}
export default router
