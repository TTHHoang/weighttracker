<template>
  <div class="row mb-4 position-relative">
    <div class="col-8 modal-nodata">
      <div v-if="!height">
        <h2>Hi there!</h2>
        <p>
         A height is needed before we can continue. Please add a height in the following field!
        </p>
      </div>

      <form @submit.prevent="">
        <!-- <div class="form-group">
          <label for="weight">Weight</label>
          <input
            type="text"
            placeholder="weight"
            id="weight"
            class="form-control"
            required
            @keypress="IsNumber"
            v-model="newWeight"
            maxlength="5"
          />
        </div> -->
        <div class="form-group">
          <label for="height">Height (in cm)</label>
          <input
            type="text"
            placeholder="height"
            id="height"
            class="form-control"
            required
            @keypress="IsNumber"
            v-model="newHeight"
            maxlength="3"
          />
        </div>
        <div class="row mt-4">
          <div class="col-md-6 offset-md-6">
            <button
              @click="addStartData()"
              class="btn gradient"
              :disabled="!newHeight"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="col-12">
      <div class="overlay" v-if="!height"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoDataModal",
  props: ["height"],
  data() {
    return {
      message: "",
      newWeight: "",
      newHeight: ""
    };
  },

  mounted(){
  },

  methods: {
    IsNumber(event) {
      if (!/\d/.test(event.key)) return event.preventDefault();
    },

    async addStartData() {
      console.log('?');
      try {
        this.$emit("addStartData", this.newHeight);

        this.message = "You have added a new item.";
      } catch (e) {
        console.error("Error adding document: ", e);
        this.message = "An error has occured. Please try again.";
      }
    },



  },
};
</script>