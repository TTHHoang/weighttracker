import Vue from 'vue'
import VueRouter from 'vue-router'
// import { getAuth } from "firebase/auth";

Vue.use(VueRouter)

  const routes = [
  {
    path: '/signup',
    name: 'signup',
    component: () => import(/* webpackPrefetch: true */ '../views/Signup.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackPrefetch: true */ '../views/Login.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import(/* webpackPrefetch: true */ '../views/ForgotPassword.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackPrefetch: true */ '../views/Home.vue'),
  }, 
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackPrefetch: true */ '../views/Home.vue'),
    meta: {
      authRequired: true,
    },
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// //check if user has permission
// const auth = getAuth();

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.authRequired)) {
//     if (auth.currentUser) {
//       next();
//     } else {
//       alert('You must be logged in to see this page');
//       next({
//         path: '/',
//       });
//     }
//   } else {
//     next();
//   }
// });

export default router
