<template>
  <div
    class="container-fluid h-100"
    v-if="user && loaded"
    :class="[user ? 'logged-in' : '']"
  >
    <div class="row">
      <div class="col-md-3 col-xl-2 pl-3 pl-md-0 d-none d-md-block position-fixed">
        <Sidebar @logout="logout" />
      </div>
      <div class="col-md-9 offset-md-3 col-xl-10 offset-xl-2">
        <div
          class="hamburger d-block d-md-none text-right"
          @click="showSidebar = !showSidebar"
        >
          <b-icon-list :class="{ showSidebar: showSidebar }"></b-icon-list>
        </div>
        <!-- dashboard -->
        <Dashboard :id="user.id" :user="user" v-if="dashboard" />
        <!-- profile -->
        <Profile :id="user.id" :user="user" v-else />
      </div>
    </div>
    <div
      class="mobile-sidebar d-block d-md-none"
      :class="{ showSidebar: showSidebar }"
    >
      <Sidebar @logout="logout" />
    </div>
  </div>
  <div class="container h-100" v-else-if="loaded">
    <!-- buttons -->
    <div
      class="row flex-column justify-content-center align-items-center h-100"
    >
      <div class="col-md-6 d-flex flex-column justify-content-center">
        <h1 class="text-center mb-5">
          <b-icon icon="graph-down"></b-icon> Weight Tracker
        </h1>

        <button class="btn home mb-5">
          <router-link to="/login">Login</router-link>
        </button>
        <button class="btn home mb-5">
          <router-link to="/signup">Signup</router-link>
        </button>
      </div>
    </div>
  </div>
  <div v-else>loading...</div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/views/Dashboard";
import Profile from "@/views/Profile";

export default {
  name: "Home",
  components: {
    Sidebar,
    Dashboard,
    Profile,
  },
  data() {
    return {
      user: false,
      showSidebar: false,
      loaded: false,
      dashboard: true,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        if (this.$route.path == "/") {
          this.dashboard = true;
        } else {
          this.dashboard = false;
        }
      },
    },
  },
  async created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.user.id = user.uid;
      } else {
        // User is signed out
        this.user = null;
      }

      this.loaded = true;
    });
  },
  methods: {
    logout() {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          console.log("signout");
        })
        .catch((error) => {
          // An error happened.
          console.log("something went wrong during logout");
        });
    },
  },
};
</script>