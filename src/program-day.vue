<template>
  <div class="program-day"> 
    <label class="day-title">Day {{ day.id + 1 }}</label>
    <div class="day-grid" v-if="day.exercises.length > 0">
      <div class="day-head">
        <div class="name">Exercise</div>
        <div class="sets">Sets</div>
        <div class="reps">Reps</div>
        <div class="weight">Weight</div>
        <div class="note">Note</div>
      </div>
      <div class="day-body">
        <exercise-row
          v-for="item in day.exercises"
          v-bind:exercise="item"
          v-bind:key="item.id"
          v-bind:edits_active="editsActive"
          v-on:remove-object="removeObject"
          v-on:move-object="moveObject"
          v-on:update-object="updateObject"
          v-on:edit-mode="childEditMode"
        ></exercise-row>
      </div>
      <div class="day-buttons">
        <button v-on:click="addObject()">Add Exercise</button>
        <button v-on:click="removeObject()">Remove Day</button>
        <button v-on:click="copyObject()" v-if="num_days < 7">Copy Day</button>
        <button v-on:click="moveObject({direction: 'up'})" class="day-move-up-btn">^</button> 
        <button v-on:click="moveObject({direction: 'down'})" class="day-move-down-btn">v</button> 
      </div>
    </div>
  </div>
</template>

<script>
import exerciseRow from './exercise-row.vue';
import Utilities from './utilities.js';

export default {
  name: 'programDay',
  props: ['day', 'num_days'],
  components: {
    'exercise-row': exerciseRow
  },
  data: function () {
    return {
      editsActive: false,
      editCount: 0
    }
  },
  methods: {
    addObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {day: this.day.id});
      this.$emit('add-object', keys);
    },
    copyObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {day: this.day.id});
      this.$emit('copy-object', keys);
    },
    removeObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {day: this.day.id});
      this.$emit('remove-object', keys);
    },
    moveObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {day: this.day.id});
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {day: this.day.id});
      this.$emit('update-object', keys);
    },
    childEditMode: function () {
      let editActivated = true,
          editDeactivated = false;
      if (arguments[0] == editActivated) {
        this.editCount++;
      } else if (arguments[0] == editDeactivated) {
        this.editCount--;
      } else { //TODO: would be an error
        return;
      }

      if (this.editCount > 0) {
        this.editsActive = true;
      } else {
        this.editsActive = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.day-grid {
  margin: 0.5rem 0;
  width: 760px;
}
.day-head {
  display: grid;
  // grid-template-columns: repeat(7, 1fr);
  grid-template-columns: 75px 2fr 4em 5em 5em 3fr 100px;
  %head-item {
    background: #ddd;
    padding: 0.25em;
  }
  .name {
    @extend %head-item;
    grid-column: 2 / 3;
  }
  .sets {
    @extend %head-item;
    grid-column: 3 / 4;
  }
  .reps {
    @extend %head-item;
    grid-column: 4 / 5;
  }
  .weight {
    @extend %head-item;
    grid-column: 5 / 6;
  }
  .note {
    @extend %head-item;
    grid-column: 6 / 7
  }
}
.day-buttons {
  margin-top: 0.5rem;
}
</style>
