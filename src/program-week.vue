<template>
  <div class="program-week">
    <label class="week-title">Week {{ week.id + 1 }}</label>
    <program-day 
      v-for="item in week.days"
      v-bind:day="item"
      v-bind:key="item.id"
      v-bind:num_days="week.days.length"
      v-on:remove-object="removeObject"
      v-on:move-object="moveObject"
      v-on:update-object="updateObject"
    ></program-day> 
    <button v-on:click="addNewDay" v-if="week.days.length < 7">Add New Day</button>
    <button v-on:click="removeObject">Remove Week</button>
    <button v-on:click="copyWeek">Copy Week</button>
    <button v-on:click="moveObject({direction: 'up'})" class="week-move-up-btn">^</button> 
    <button v-on:click="moveObject({direction: 'down'})" class="week-move-down-btn">v</button> 
  </div>
</template>

<script>
import programDay from './program-day.vue';
import Utilities from './utilities.js';

export default {
  name: 'programWeek',
  props: ['week'],
  components: {
    'program-day': programDay
  },
  methods: {
    getCurrentBlock: function () { //TODO: remove
      return programBuilder.loadedProgram.blocks[this.$parent.block.id];
    },
    addNewDay: function () {
      var currentBlock = this.getCurrentBlock(),
          newDay = Utilities.deepExtend({}, programBuilder.emptyDay),
          currentWeek;
      
      currentWeek = currentBlock.weeks[this.week.id];

      newDay.id = currentWeek.days.length;

      currentWeek.days.push(newDay);
    },
    copyWeek: function () {
      var currentBlock = this.getCurrentBlock(),
          newWeekObj;

      newWeekObj = Utilities.deepExtend({}, currentBlock.weeks.slice(this.week.id, this.week.id + 1)[0]);
      newWeekObj.id = currentBlock.weeks.length; 

      currentBlock.weeks.push(newWeekObj);
    },
    removeObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('remove-object', keys);
    },
    moveObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('update-object', keys);
    }
  }
}
</script>
