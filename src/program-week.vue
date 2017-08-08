<template>
  <div class="program-week">
    <label class="week-title">Week {{ week.id + 1 }}</label>
    <program-day 
      v-for="item in week.days"
      v-bind:day="item"
      v-bind:key="item.id"
      v-bind:num_days="week.days.length"
      v-on:add-object="addObject"
      v-on:copy-object="copyObject"
      v-on:remove-object="removeObject"
      v-on:move-object="moveObject"
      v-on:update-object="updateObject"
    ></program-day> 
    <button v-on:click="addObject" v-if="week.days.length < 7">Add New Day</button>
    <button v-on:click="removeObject">Remove Week</button>
    <button v-on:click="copyObject">Copy Week</button>
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
    addObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('add-object', keys);
    },
    copyObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('copy-object', keys);
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
