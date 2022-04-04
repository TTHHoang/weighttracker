<template>
  <div class="row no-gutters mb-4">
    <div class="mb-4 back col-12">
      <span @click="closeAddComponent"> &lt; Go back to main dashboard</span>
    </div>

    <div class="message mb-3 col-12 px-3" v-show="message">
      <span>{{ message }}</span>
    </div>

    <div class="dashboard-component col-12 p-4">
      <h2>Add new weight</h2>
      <form @submit.prevent="addData(userId)" class="mt-3">
        <div class="form-group">
          <label for="weight">Weight (in kg)</label>
          <input
            type="text"
            v-model="user.weight"
            placeholder="weight"
            id="weight"
            class="form-control"
            required
            @focus="message = ''"
            @keypress="IsNumber"
            maxlength="5"
          />
        </div>
        <div class="form-group">
          <label for="weight">Date (you weighed yourself) </label>
          <input
            type="date"
            v-model="user.date"
            placeholder="date"
            id="date"
            class="form-control"
            required
            value-type="DD/MM/YYYY"
          />
        </div>
        <button class="btn gradient mt-5">Add data</button> <br />
        <span @click="closeAddComponent" class="close-button">
          <b-icon-x> </b-icon-x>
        </span>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from "@/main.js";
import { query, getDocs, where, collection } from "firebase/firestore";

export default {
  props: ["id", "weight"],
  name: "AddWeight",
  data() {
    return {
      userId: this.id,
      user: {
        weight: "",
        date: new Date().toISOString().slice(0, 10),
      },
      message: "",
      showAddComponent: false,
    };
  },

  mounted() {
    if (!this.weight) {
      this.message =
        "Please add a start weight in order to continue using the website.";
    }
  },

  methods: {
    dateOfToday() {
      return new Date().toLocaleDateString();
    },
    IsNumber(event) {
      if (!/\d/.test(event.key) && event.key !== ".")
        return event.preventDefault();
    },
    closeAddComponent() {
      this.message = "";
      this.$parent.hideAddWeightComponent();
    },
    async addData(id) {
      // check if data already exists else update only dont
      const userRef = collection(db, "users", id, "data");
      const q = query(userRef, where("date", "==", this.user.date));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          this.message =
            "This data already contains a weight. Remove or update the data in the list.";
        });
      } else {
        if (this.formValidation(this.user.weight)) {
          if (this.user.date > new Date().toISOString().slice(0, 10)) {
            this.message = "You cannot pick a date in the future. Try a different date."
          } else {
            try {
              this.$emit("addData", id, this.user.weight, this.user.date);

              this.message = "You have added a new item.";
              this.user.weight = "";
              this.user.date = "";
            } catch (e) {
              console.error("Error adding document: ", e);
              this.message = "An error has occured. Please try again.";
            }
          }
        } else {
          this.message = "Please check your field on errors. Decimals should be added with a dot.";
        }
      }
    },
    formValidation(field) {
      let pattern = /^[0-9]+(\.)?[0-9]*$/;
      let result = pattern.test(field);

      return result;
    },
  },
};
</script>