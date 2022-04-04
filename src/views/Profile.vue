<template>
  <div class="container-fluid mt-4">
    <div class="row no-gutters">
      <div class="col-12">
        <h1 class="">Profile</h1>
        <h2>Hello {{ user.displayName }}!</h2>
        <p>You can edit your current profile here.</p>
      </div>
      <div class="message mb-3 col-12 px-3" v-show="message">
        <span>{{ message }}</span>
      </div>
      <div class="message mb-4 col-12 px-3" v-if="this.user.email == 'demoweighttracker@gmail.com'">
          The profile page cannot be edited for a demo account.
        </div>

      <div class="col-md-12 mb-2 dashboard-component p-4">
        <form @submit.prevent="save" class="mt-3">
          <div class="form-group">
            <label for="weight">Display name</label>
            <input
              type="text"
              v-model="editUser.displayName"
              :placeholder="user.displayName"
              class="form-control"
              :disabled="
                this.user.email == 'demoweighttracker@gmail.com' ? true : false
              "
            />
          </div>
          <div class="form-group">
            <label for="weight">Email</label>
            <input
              type="text"
              v-model="editUser.email"
              :placeholder="user.email"
              class="form-control"
              :disabled="
                this.user.email == 'demoweighttracker@gmail.com' ? true : false
              "
            />
          </div>
          <div class="form-group">
            <label for="weight">New password</label>
            <input
              type="password"
              v-model="editUser.password"
              class="form-control"
              :disabled="
                this.user.email == 'demoweighttracker@gmail.com' ? true : false
              "
            />
          </div>
          <div class="form-group">
            <label for="weight">Repeat new password</label>
            <input
              type="password"
              v-model="editUser.repeatPassword"
              class="form-control"
              :disabled="
                this.user.email == 'demoweighttracker@gmail.com' ? true : false
              "
            />
          </div>
          <div v-if="error" class="error">{{ showErrors(error) }}</div>

          <button
            class="btn gradient mt-5"
            :disabled="
              this.user.email == 'demoweighttracker@gmail.com' ? true : false
            "
          >
            Save data
          </button>
          <br />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAuth,
  updatePassword,
  updateProfile,
  updateEmail,
} from "firebase/auth";

export default {
  name: "Profile",
  props: ["id", "user"],
  data() {
    return {
      editUser: {
        displayName: "",
        password: "",
        email: "",
        repeatPassword: "",
      },
      currentUser: this.user,
      message: "",
      error: "",
    };
  },
  created() {},
  methods: {
    save() {
      const auth = getAuth();

      if (this.user.email != "demoweighttracker@gmail.com") {
        // name change
        if (this.editUser.displayName != "") {
          let newName = this.editUser.displayName;

          updateProfile(auth.currentUser, {
            displayName: newName,
          })
            .then(() => {
              this.message = "Your name has been updated!";
            })
            .catch((error) => {
              const errorCode = error.code;
              this.error = errorCode;
            });
        }

        // email change
        if (this.editUser.email != "") {
          let email = this.editUser.email;
          updateEmail(auth.currentUser, email)
            .then(() => {
              this.message = "Your email has been updated!";
            })
            .catch((error) => {
              const errorCode = error.code;
              this.error = errorCode;
              if (error.code === "auth/requires-recent-login") {
                this.$router.push({
                  name: "login",
                  query: { redirect: "/profile" },
                });
              }
            });
        }

        // password change
        if (this.editUser.password != "") {
          if (this.editUser.password == this.editUser.repeatPassword) {
            const user = auth.currentUser;
            let newPassword = this.editUser.password;

            updatePassword(user, newPassword)
              .then(() => {
                // Update successful.
                this.error = "";
                this.message = "Your password has been successfully updated.";
                this.editUser.password = "";
                this.editUser.repeatPassword = "";
              })
              .catch((error) => {
                const errorCode = error.code;
                this.error = errorCode;
                if (error.code === "auth/requires-recent-login") {
                  this.$router.push({
                    name: "login",
                    query: { redirect: "/profile" },
                  });
                }
              });
          } else {
            this.message = "Your passwords don't match. Please check again.";
          }
        }
      }
    },
  },
};
</script>

<style>
</style>