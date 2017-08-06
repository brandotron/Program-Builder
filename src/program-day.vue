<template>
  <div class="program-day"> 
    <label class="day-title">Day {{ day.id + 1 }}</label>
    <table class="day-table" v-if="day.exercises.length > 0">
      <thead class="day-head">
        <tr class="day-column-head-row">
          <th class="day-column-head"></th>
          <th class="day-column-head">Exercise</th>
          <th class="day-column-head">Sets</th>
          <th class="day-column-head">Reps</th>
          <th class="day-column-head">Weight</th>
          <th class="day-column-head">Note</th>
          <th class="day-column-head"></th>
        </tr>
      </thead>
      <tbody class="day-body">
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
      </tbody>
    </table> 
    <button v-on:click="openAddExercisePanel">Add Exercise</button>
    <button v-on:click="removeObject">Remove Day</button>
    <button v-on:click="copyDay"
      v-if="num_days < 7"
    >Copy Day</button>
    <button v-on:click="moveObject({direction: 'up'})" class="day-move-up-btn">^</button> 
    <button v-on:click="moveObject({direction: 'down'})" class="day-move-down-btn">v</button> 
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
    getCurrentBlock: function () { //TODO: remove
      return programBuilder.loadedProgram.blocks[this.$parent.$parent.block.id];
    },
    getCurrentWeek: function () { //TODO: remove
      return this.getCurrentBlock().weeks[this.$parent.week.id];
    },
    openAddExercisePanel: function () {
      programBuilder.newExercise.day = this.day.id;
      programBuilder.newExercise.week = this.$parent.week.id;
      programBuilder.newExercise.block = this.$parent.$parent.block.id;
      programBuilder.newExercise.id = this.day.exercises.length;
      programBuilder.newExercise.mode = 'add';
      programBuilder.newExercise.active = true;
    },
    copyDay: function () {
      var currentWeek = this.getCurrentWeek(),
          newDayObj;

      newDayObj = Utilities.deepExtend({}, currentWeek.days.slice(this.day.id, this.day.id + 1)[0]);
      newDayObj.id = currentWeek.days.length; 

      currentWeek.days.push(newDayObj);
    },
    removeObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {day: this.day.id});
      this.$emit('remove-object', keys);
    },
    moveObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {day: this.day.id});
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {day: this.day.id});
      this.$emit('update-object', keys);
    },
    childEditMode: function () {
      var editActivated = true,
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
