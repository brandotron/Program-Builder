<template>
  <div class="program-day"> 
    <div class="day-title">Day {{ day.id + 1 }}</div>
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
        ></exercise-row>
      </tbody>
    </table> 
    <button v-on:click="openAddExercisePanel">Add Exercise</button>
    <button v-on:click="removeDay">Remove Day</button>
    <button v-on:click="copyDay"
      v-if="num_days < 7"
    >Copy Day</button>
    <button v-on:click="moveDay('up')" class="day-move-up-btn">^</button> 
    <button v-on:click="moveDay('down')" class="days-move-down-btn">v</button> 
  </div>
</template>

<script>
import exerciseRow from './exercise-row.vue'

export default {
  name: 'programDay',
  props: ['day', 'num_days'],
  components: {
    'exercise-row': exerciseRow
  },
  data: function () {
    return {
      editsActive: false
    }
  },
  methods: {
    getCurrentBlock: function () {
      return programBuilder.loadedProgram.blocks[this.$parent.$parent.block.id];
    },
    getCurrentWeek: function () {
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
    removeDay: function () {
      var currentWeek = this.getCurrentWeek();

      currentWeek.days.splice(this.day.id, 1);

      this.resequenceDays();
    },
    resequenceDays: function () {
      var currentBlock = this.getCurrentBlock(),
          currentWeek = this.getCurrentWeek(),
          resequencedDays,
          resequencedWeek;

      resequencedWeek = deepExtend({}, currentWeek);
      resequencedDays = resequenceItems(currentWeek.days);

      resequencedWeek.days = resequencedDays;

      currentBlock.weeks.splice(this.$parent.week.id, 1, resequencedWeek);
    },
    copyDay: function () {
      var currentWeek = this.getCurrentWeek(),
          newDayObj;

      newDayObj = deepExtend({}, currentWeek.days.slice(this.day.id, this.day.id + 1)[0]);
      newDayObj.id = currentWeek.days.length; 

      currentWeek.days.push(newDayObj);
    },
    moveDay: function (direction) {
      var currentWeek = this.getCurrentWeek(),
          currentId,
          newId,
          tempObjThis,
          tempObjSwap,
          newObjThis,
          newObjSwap;

      if (direction == 'up') {
        currentId = this.day.id;
        newId = this.day.id - 1;
      } else if (direction == 'down') {
        currentId = this.day.id;
        newId = this.day.id + 1;
      } else {
        return; //TODO: this would be an error
      }

      tempObjThis = deepExtend({}, currentWeek.days.slice(currentId, currentId + 1)[0]);
      tempObjSwap = deepExtend({}, currentWeek.days.slice(newId, newId + 1)[0]);

      tempObjThis.id = newId;
      tempObjSwap.id = this.day.id;

      currentWeek.days.splice(currentId, 1, tempObjSwap);
      currentWeek.days.splice(newId, 1, tempObjThis);
    },
    removeObject: function () {
      var keys = arguments[0];
      keys.day = this.day.id;
      this.$emit('remove-object', keys);
    }
  }
}
</script>
