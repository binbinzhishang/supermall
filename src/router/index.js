import Vue from "vue"
import VueRouter from "vue-router"

const Home = () => import("views/home/Home");
const Category = () => import("views/category/Category");
const ShopCart = () => import("views/shopcart/ShopCart");
const Profile = () => import("views/profile/Profile");

//1.安装插件
Vue.use(VueRouter)

//2.创建router
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/category',
    component: Category,
    meta: {
      title: '分类'
    }
  },
  {
    path: '/shopCart',
    component: ShopCart,
    meta: {
      title: '购物车'
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: {
      title: '我的'
    }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
