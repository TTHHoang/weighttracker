<template>
  <div class="sidebar">
    <div id="nav" class="d-flex flex-column h-100">
      <a href="/websitedemo/weight-tracker/"> <div class="logo">
        <b-icon icon="graph-down"></b-icon> Weight Tracker
      </div> </a>
      <router-link to="/">
        <b-icon icon="house-door-fill"></b-icon> Home
      </router-link>
      <router-link to="/profile">
        <b-icon icon="person-circle"></b-icon> Profile</router-link
      >
      <button @click="logout" class="btn primary mb-2 mt-auto"><b-icon icon="box-arrow-right"></b-icon>  Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$emit("logout");
    },
  },
};
</script>

<style>
</style>