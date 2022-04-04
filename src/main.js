import Vue from 'vue'
import App from './App.vue'

import { LayoutPlugin, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'

// Make BootstrapVue available throughout your project
Vue.use(LayoutPlugin)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

import "@/css/styles.css";

Vue.config.productionTip = false

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBpd5u1enaEdYgtH_fIEI6cpye6riU9rvg",
  authDomain: "weight-tracking-f9ab3.firebaseapp.com",
  projectId: "weight-tracking-f9ab3",
  storageBucket: "weight-tracking-f9ab3.appspot.com",
  messagingSenderId: "708947328103",
  appId: "1:708947328103:web:26abd5c633e146890168c2",
  measurementId: "G-PFEBNK3R5V"
});
const auth = initializeAuth(firebaseApp, {
  persistence: browserLocalPersistence,
  // No popupRedirectResolver defined
});

//firestore
export const db = getFirestore();

//global functions
Vue.mixin({
  methods: {
    //show error message based on errorcode
    showErrors(errorCode) {
      switch (errorCode) {
        case 'auth/wrong-password':
        case 'auth/invalid-email':
        case 'auth/user-not-found':
          errorCode = 'Email or password is incorrect.';
          break;
        case 'auth/internal-error':
          errorCode = 'An error has occured. Please check the fields and try again.';
          break;
        case 'auth/missing-email':
          errorCode = 'Please fill in the email field.';
          break;
        case 'auth/weak-password':
          errorCode = 'Your password is too weak. Try making a stronger one.';
          break;
        case 'auth/too-many-requests':
          errorCode = 'Entered the wrong credentials too often. Please wait and try again later.';
          break; 
        default:
          console.log('default');
          break;
      }

      return errorCode;
    },
  },
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
