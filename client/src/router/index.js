import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Error from "../views/Error.vue";
import store from "../store"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/admin/list",
    name: "Userlist",
    component: () => import("../views/Userlist.vue"),
  },
  {
    path: "/task",
    name: "Task",
    component: () => import("../views/Task.vue"),
  },
  {
    path: '/:match(.*)*',
    component: Error
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.name == "Userlist" ) {
    if(store.state.user.auth && store.state.user.role === 0){
      return next()
    }
    else {
      next({path: "/"})
    }
  }
  next();
});

export default router;
