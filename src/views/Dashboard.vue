<template>
  <div class="container-fluid mt-4">
    <div class="row h-100" v-if="!hideMainDashboard">
      <div class="col-md-12 mb-2">
        <h1 class="">Dashboard</h1>
        <h2>Hello {{ user.displayName }}!</h2>
        <p>You can add, edit and view your data here!</p>
      </div>
    </div>
    <GoalWeight
      v-show="showGoalWeightComponent"
      @hideGoalWeightComponent="hideGoalWeightComponent"
      :goalWeight="goalWeight"
      @addGoalWeight="addGoalWeight"
      @getGoalWeight="getGoalWeight"
      @updateGoalWeight="updateGoalWeight"
      @deleteGoalWeight="deleteGoalWeight"
      :id="id"
    />
    <Bmi
      v-show="showBmiComponent"
      @addHeight="addHeight"
      :height="height"
      @getHeight="getHeight"
      @getBmi="getBmi"
      :currentBmi="currentBmi"
      @updateHeight="updateHeight"
    />
    <AddWeight
      :id="id"
      v-if="showAddComponent"
      @addData="addData"
      :weight="currentWeight"
    />
    <EditWeight
      :id="id"
      v-if="showEditComponent"
      @deleteWeight="deleteWeight"
      @getWeightData="getWeightData"
      @updateWeight="updateWeight"
      :list="list"
      :listItem="listItem"
    />
    <h2 class="mb-3" v-if="!hideMainDashboard">Progress</h2>
    <!-- progress -->
    <div class="row mb-3">
      <div class="col-md-6 d-flex flex-column" v-if="!hideMainDashboard">
        <div
          class="
            dashboard-component
            d-flex
            flex-column
            p-4
            flex-grow-1
            mb-4
            align-items-center
            text-center
            justify-content-center
          "
        >
          <div class="message" v-show="doughnutMessage">
            {{ doughnutMessage }}
          </div>

          <span v-if="!goalWeight || !currentWeight" class="mb-3">
            No goal and/or current weight has been added
          </span>

          <h3 v-else class="mb-3"></h3>
          <!-- doughnut chart -->
          <DoughnutChart
            v-if="loadedDoughnut && goalWeight && currentWeight"
            :chartData="doughnutData"
            :options="optionsDoughnut"
            class="mt-5"
            style="width: 99%"
          />
          <div v-if="goalWeight && currentWeight" class="text-center">
            <span class="weight">{{ currentWeight }}</span
            >kg
            <p v-if="totalWeight > 0">
              Lost <span class="text-pink">{{ totalWeight }} kg</span>
              since
              {{ startDateWeightTracking }}
            </p>
            <p v-else-if="totalWeight < 0">
              Gained
              <span class="text-pink">{{ totalWeight * -1 }}kg</span> since
              {{ startDateWeightTracking }}
            </p>
          </div>
        </div>
      </div>
      <!-- start weight -->
      <div class="col-md-6 d-flex flex-column">
        <div class="row flex-grow-1">
          <div class="col-xl-6 d-flex flex-column">
            <div
              class="
                dashboard-component
                d-flex
                flex-column
                p-4
                flex-grow-1
                mb-4
                justify-content-center
                text-center
                align-items-center
                pink
              "
              v-if="!hideMainDashboard"
            >
              <div v-if="startWeight">
                <span class="weight">{{ startWeight }}</span
                >kg<br />Start
              </div>
              <span v-else>No start weight has been added</span>
            </div>
          </div>

          <!-- current weight -->
          <div class="col-xl-6 d-flex flex-column">
            <div
              class="
                dashboard-component
                d-flex
                flex-column
                p-4
                flex-grow-1
                mb-4
                justify-content-center
                align-items-center
                text-center
                blue
              "
              v-if="!hideMainDashboard"
            >
              <span v-if="currentWeight == ''">
                No current weight has been added
              </span>
              <div v-else>
                <span class="weight">{{ currentWeight }}</span
                >kg<br />Current
              </div>
            </div>
          </div>
          <!-- goal weight -->
          <div class="col-xl-6 d-flex flex-column dashboard-home-hover">
            <div
              class="
                dashboard-component
                d-flex
                flex-column
                p-4
                flex-grow-1
                mb-4
                justify-content-center
                align-items-center
                text-center
                pink
              "
              v-if="!hideMainDashboard"
              @click="
                (showGoalWeightComponent = true), (hideMainDashboard = true)
              "
            >
              <span v-if="goalWeight == ''">No goal weight added</span>
              <div v-else>
                <span class="weight">{{ goalWeight }}</span
                >kg<br />Goal
              </div>

              <button class="edit-button">
                <b-icon-pencil-square> </b-icon-pencil-square>
              </button>
            </div>
          </div>
          <!-- bmi -->
          <div class="col-xl-6 d-flex flex-column dashboard-home-hover">
            <div
              class="
                dashboard-component
                d-flex
                flex-column
                p-4
                flex-grow-1
                mb-4
                justify-content-center
                align-items-center
                text-center
                blue
              "
              v-if="!hideMainDashboard"
              @click="
                (showBmiComponent = true),
                  (hideMainDashboard = true),
                  (startDate = ''),
                  (endDate = '')
              "
            >
              <span v-if="currentBmi == ''"> No weight added yet </span>
              <div v-else>
                <span class="weight">{{ currentBmi }}</span
                ><br />BMI
              </div>
              <button class="edit-button">
                <b-icon-pencil-square> </b-icon-pencil-square>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- graph and filter -->
    <h2 class="mb-3" v-if="!hideMainDashboard">Journey</h2>

    <div class="row no-gutters mb-3">
      <div
        class="col-12 dashboard-component p-4 mb-4"
        v-show="!hideMainDashboard"
      >
        <p v-show="list.length == 0" class="message">No data found.</p>
        <span>Select a start and end date to filter</span>
        <div class="message" v-show="chartMessage">{{ chartMessage }}</div>

        <form @submit.prevent="getWeightData">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="startDate">Start &nbsp; </label>
              <input
                type="date"
                v-model="startDate"
                class="form-control"
                required
              />
            </div>
            <div class="form-group col-md-6">
              <label for="endDate">End &nbsp; </label>
              <input
                type="date"
                v-model="endDate"
                class="form-control"
                required
              />
            </div>
          </div>
          <button class="btn gradient">Filter</button>
        </form>
        <!-- chart -->
        <Chart
          v-if="loaded"
          :chartData="chartData"
          :options="options"
          class="chart mt-5"
        />
        <div class="row">
          <div class="col-md-6 offset-md-6 mt-5">
            <button @click="getWeightData(true)" class="btn gradient">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <h2 class="mb-3" v-if="!hideMainDashboard">Edit</h2>

    <!-- add/edit weight -->
    <div class="row" v-show="!hideMainDashboard">
      <div class="col-md-6 mb-4">
        <div class="dashboard-component p-4 h-100">
          <h3 class="mb-4">New weight</h3>
          <button
            @click="
              (showAddComponent = !showAddComponent), (hideMainDashboard = true)
            "
            class="btn gradient"
          >
            Add
          </button>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="dashboard-component h-100 p-4">
          <h3 class="mb-4">Previous weights</h3>

          <button
            @click="
              (showEditComponent = !showEditComponent),
                (hideMainDashboard = true)
            "
            class="btn gradient"
          >
            edit
          </button>
        </div>
      </div>
    </div>

    <!-- loggedin user but there's no data -->
    <NoDataModal
      @addStartData="addHeight"
      :height="height"
      :currentWeight="currentWeight"
      v-if="loadedPage && !height"
    />
  </div>
</template>

<script>
import { db } from "@/main.js";

import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
  where,
  addDoc,
} from "firebase/firestore";

export default {
  name: "Dashboard",
  props: ["id", "user"],
  components: {
    AddWeight: () => import(/* webpackPrefetch: true */'@/components/AddWeight'),
    EditWeight: () => import(/* webpackPrefetch: true */'@/components/EditWeight'),
    Chart: () => import(/* webpackPrefetch: true */'@/components/Chart'),
    GoalWeight: () => import(/* webpackPrefetch: true */'@/components/GoalWeight'),
    Bmi: () => import(/* webpackPrefetch: true */'@/components/Bmi'),
    DoughnutChart: () => import(/* webpackPrefetch: true */'@/components/DoughnutChart'),
    NoDataModal: () => import(/* webpackPrefetch: true */'@/components/NoDataModal')
  },
  data() {
    return {
      doughnutData: null,
      optionsDoughnut: {},
      startDate: "",
      endDate: "",
      showAddComponent: false,
      showEditComponent: false,
      addWeight: false,
      loaded: false,
      chartData: null,
      options: { maintainAspectRatio: false },
      list: [],
      listFilter: [],
      labelsArray: [],
      dataArray: [],
      labelsArrayFilter: [],
      dataArrayFilter: [],
      listItem: {
        date: "",
        weight: "",
      },
      userId: this.id,
      datasets: [],
      currentFilter: "asc",
      chartMessage: "",
      goalWeight: "",
      showGoalWeightComponent: false,
      hideMainDashboard: false,
      currentGoalWeightId: "",
      showBmiComponent: false,
      currentBmi: "",
      height: "",
      currentWeight: "",
      heightId: "",
      startWeight: "",
      loadedDoughnut: false,
      doughnutMessage: "",
      totalWeight: "",
      startDateWeightTracking: "",
      weightLeft: "",
      loadedPage: false,
    };
  },
  async mounted() {
    this.loaded = false;
    this.loadedDoughnut = false;
    return this.getGoalWeight().then(() => {
      this.getWeightData();
      this.showChart();
    });
  },
  methods: {
    addStartWeight() {
      if (!this.currentWeight) {
        this.showAddComponent = true;
        this.hideMainDashboard = true;
      }
    },
    updateChart() {
      if (this.startDate && this.endDate) {
        let datasets = [];
        datasets.push({
          label: "weight (kg)",
          data: this.dataArrayFilter,
          fill: false,
          borderColor: "#f4acdf",
          tension: 0.1,
        });
        //update with new data, so that the chart rerenders
        this.chartData = Object.assign({}, this.datasets, {
          labels: this.labelsArrayFilter,
          datasets: datasets,
        });
      } else {
        let datasets = [];
        datasets.push({
          label: "weight (kg)",
          data: this.dataArray,
          fill: false,
          borderColor: "#f4acdf",
          tension: 0.1,
        });
        //update with new data, so that the chart rerenders
        this.chartData = Object.assign({}, this.datasets, {
          labels: this.labelsArray,
          datasets: datasets,
        });
      }
    },
    showChart() {
      try {
        this.chartData = {
          labels: this.labelsArray,
          datasets: [
            {
              label: "weight (kg)",
              data: this.dataArray,
              borderColor: "#f4acdf",
              fill: false,
            },
          ],
        };

        this.loaded = true;
      } catch (e) {
        console.error(e);
      }
    },
    showDoughnutChart() {
      try {
        this.optionsDoughnut = {
          responsive: true,
          maintainAspectRatio: false,
          circumference: Math.PI,
          rotation: Math.PI,
          tooltips: {
            enabled: false,
          },
        };
        var kgLabel;
        var kgDesc;

        this.totalWeight = this.startWeight - this.currentWeight;
        this.totalWeight = this.totalWeight.toFixed(1);

        if (this.startWeight !== "") {
          //lose weight
          if (this.startWeight > this.goalWeight) {
            this.weightLeft = this.currentWeight - this.goalWeight;
            this.weightLeft = this.weightLeft.toFixed(1);
            kgLabel = "Lost " + this.totalWeight + " kg";
            kgDesc = this.weightLeft + " kg Left to lose";

            //check if user already lost weight or not
            if (this.totalWeight <= 0) {
              this.doughnutData = {
                labels: [kgDesc],
                datasets: [
                  {
                    data: [this.weightLeft],
                    backgroundColor: ["#abc0ed"],
                    hoverOffset: 4,
                  },
                ],
              };
            } else {
              //check if user passed his own goal weight
              if (this.currentWeight < this.goalWeight) {
                this.doughnutMessage =
                  "You have passed your goal weight. Please update your goal weight or gain weight to achieve your current goal.";
                kgDesc = "KG left to gain";
                this.weightLeft = this.weightLeft * -1;
              }
              this.doughnutData = {
                labels: [kgLabel, kgDesc],
                datasets: [
                  {
                    data: [this.totalWeight, this.weightLeft],
                    backgroundColor: ["#f4acdf", "#abc0ed"],
                    hoverOffset: 4,
                  },
                ],
              };
            }
          } else {
            //gain weight
            this.weightLeft = this.currentWeight - this.goalWeight;
            this.weightLeft = this.weightLeft.toFixed(2) * -1;
            kgLabel = this.totalWeight + " gained kg";
            kgDesc = this.weightLeft + " kg left to gain";

            // check if user gained any weight yet
            if (this.totalWeight >= 0) {
              this.doughnutData = {
                labels: [kgDesc],
                datasets: [
                  {
                    data: [this.weightLeft],
                    backgroundColor: ["#abc0ed"],
                    hoverOffset: 4,
                  },
                ],
              };
            } else {
              //check if user passed his own goal weight
              if (this.currentWeight > this.goalWeight) {
                this.doughnutMessage =
                  "You have passed your goal weight. Please update your goal weight or lose weight to achieve your current goal weight.";
                kgDesc = "Kg left to lose";
                this.weightLeft = this.weightLeft * -1;
              }
              this.doughnutData = {
                labels: [kgLabel, kgDesc],
                datasets: [
                  {
                    data: [this.totalWeight * -1, this.weightLeft],
                    backgroundColor: ["#f4acdf", "#abc0ed"],
                    hoverOffset: 4,
                  },
                ],
              };
            }
          }
        }
        //loss weight goal
        if (this.goalWeight == this.currentWeight && this.totalWeight > 0) {
          this.doughnutMessage =
            "You have achieved your goals! You have lost a total of " +
            this.totalWeight +
            "KG!";
          this.loadedDoughnut = false;
          //gain weight goal
        } else if (
          this.goalWeight == this.currentWeight &&
          this.totalWeight < 0
        ) {
          this.doughnutMessage =
            "You have achieved your goals! You have gained a total of " +
            (this.totalWeight *= -1) +
            "KG!";
          this.loadedDoughnut = false;
        } else {
          this.loadedDoughnut = true;
        }
      } catch (e) {
        console.error(e);
      }
    },
    correctDate(date) {
      return new Date(date).toLocaleString("nl-NL", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    },
    async getGoalWeight() {
      const userRef = collection(db, "users", this.userId, "goalWeight");
      const q = query(userRef);

      const querySnapshot = await getDocs(q);

      var gw;
      var gwId;

      if (!querySnapshot.empty) {
        querySnapshot.forEach(function (doc) {
          gw = doc.data().goalWeight;
          gwId = doc.id;
        });

        if (this.goalWeight != gw) {
          this.goalWeight = Number(gw);
          this.currentGoalWeightId = gwId;
          this.showDoughnutChart();
        }
      } else {
        this.goalWeight = "";
      }
    },

    async getWeightData(reset) {
      let q;
      let x;

      if (reset == true) {
        this.startDate = "";
        this.endDate = "";
      }

      if (this.startDate && this.endDate) {
        if (this.startDate > this.endDate) {
          this.chartMessage =
            "The start date is later than the end date. Please correct the dates.";
        } else if (this.startDate == this.endDate) {
          this.chartMessage =
            "The startdate cannot be the same as the enddate.";
        } else {
          this.chartMessage = "";
          x = query(
            collection(db, "users", this.userId, "data"),
            orderBy("date", "asc"),
            where("date", ">=", this.startDate),
            where("date", "<=", this.endDate)
          );

          const querySnapshotFilter = await getDocs(x);

          if (!querySnapshotFilter.empty) {
            this.listFilter = [];
            this.labelsArrayFilter = [];
            this.dataArrayFilter = [];

            querySnapshotFilter.forEach((doc) => {
              var listItemFilter = doc.data();

              var weightFilter = listItemFilter.weight;
              this.dataArrayFilter.push(weightFilter);

              var date = listItemFilter.date;

              this.labelsArrayFilter.push(this.correctDate(date));

              listItemFilter.id = doc.id;
              this.listFilter.push(listItemFilter);
            });
          }
        }
      }
      q = query(
        collection(db, "users", this.userId, "data"),
        orderBy("date", this.currentFilter)
      );

      const querySnapshot = await getDocs(q);

      this.list = [];
      this.labelsArray = [];
      this.dataArray = [];

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          var listItem = doc.data();

          var weight = listItem.weight;
          this.dataArray.push(weight);

          var date = listItem.date;

          this.labelsArray.push(this.correctDate(date));

          listItem.id = doc.id;
          this.list.push(listItem);
        });

        //set currentweight to use for bmi calc
        this.currentWeight = Number(this.dataArray[this.dataArray.length - 1]);

        //set startWeight to calculate progress
        this.startWeight = Number(this.dataArray[0]);
        this.startDateWeightTracking = this.labelsArray[0];

        if (this.currentWeight && this.startWeight && this.goalWeight) {
          this.showDoughnutChart();
        }
      } else {
        this.currentWeight = "";
        this.startWeight = "";
        this.startDateWeightTracking = "";
      }
      this.addStartWeight();
      this.updateChart();
      this.getBmi();
      this.loadedPage = true;
    },

    getBmi() {
      try {
        if (this.height && this.dataArray.length !== 0) {
          var heightInMeters = this.height / 100;
          this.currentBmi = (
            this.currentWeight /
            (heightInMeters * heightInMeters)
          ).toFixed(1);

          return this.currentBmi;
        } else {
          this.currentBmi = "";
        }
      } catch (error) {
        console.log("there is no height or weight");
      }
    },
    hideAddWeightComponent() {
      this.showAddComponent = false;
      this.hideMainDashboard = !this.hideMainDashboard;
    },
    hideEditWeightComponent() {
      this.showEditComponent = false;
      this.hideMainDashboard = !this.hideMainDashboard;
    },
    hideGoalWeightComponent() {
      this.showGoalWeightComponent = false;
      this.hideMainDashboard = !this.hideMainDashboard;
    },
    hideBmiComponent() {
      this.showBmiComponent = false;
      this.hideMainDashboard = !this.hideMainDashboard;
    },
    async deleteWeight(currentListId) {
      await deleteDoc(doc(db, "users", this.userId, "data", currentListId));
      return this.getWeightData(), this.getBmi();
    },
    async updateWeight(docId, newWeight) {
      const updateRef = doc(db, "users", this.userId, "data", docId);

      await updateDoc(updateRef, {
        weight: newWeight,
      });
      return this.getWeightData(), this.getBmi();
    },
    //add weight/data
    async addData(id, weight, date) {
      const userRef = collection(db, "users", id, "data");
      const q = query(userRef, where("date", "==", date));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        addDoc(collection(db, "users", id, "data"), {
          weight: weight,
          date: date,
        });
        return this.getWeightData(), this.getBmi();
      }
    },
    async addGoalWeight(weight) {
      if (!this.goalWeight) {
        await addDoc(collection(db, "users", this.userId, "goalWeight"), {
          goalWeight: weight,
        });
        return this.getGoalWeight();
      } else {
        console.log("already exists");
      }
    },
    async updateGoalWeight(weight) {
      const updateRef = doc(
        db,
        "users",
        this.userId,
        "goalWeight",
        this.currentGoalWeightId
      );

      await updateDoc(updateRef, {
        goalWeight: weight,
      });
      return this.getGoalWeight();
    },
    async updateHeight(height) {
      const updateRef = doc(db, "users", this.userId, "height", this.heightId);

      await updateDoc(updateRef, {
        currentHeight: height,
      });
      return this.getHeight();
    },
    async deleteGoalWeight() {
      await deleteDoc(
        doc(db, "users", this.userId, "goalWeight", this.currentGoalWeightId)
      );
      return this.getGoalWeight();
    },

    async addHeight(height) {
      if (!this.height) {
        await addDoc(collection(db, "users", this.userId, "height"), {
          currentHeight: height,
        });
        return this.getHeight();
      } else {
        console.log("already exists");
      }
    },

    async getHeight() {
      const userRef = collection(db, "users", this.userId, "height");
      const q = query(userRef);

      const querySnapshot = await getDocs(q);

      var h;
      var hId;

      if (!querySnapshot.empty) {
        querySnapshot.forEach(function (doc) {
          h = doc.data().currentHeight;
          hId = doc.id;
        });
        this.height = h;
        this.heightId = hId;
        return this.getBmi();
      } else {
        this.height = "";
        console.log("No height has been found");
      }
    },
  },
};
</script>