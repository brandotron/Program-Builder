<template>
  <div class="program-week" v-if="isActive">
    <!-- <label class="week-title">Week {{ week.id + 1 }}</label> -->
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
    <!-- <button v-on:click="removeObject">Remove Week</button> -->
    <button v-on:click="copyObject">Copy Week</button>
    <button v-on:click="moveObject({direction: 'up'})" class="week-move-up-btn">&lt;</button> 
    <button v-on:click="moveObject({direction: 'down'})" class="week-move-down-btn">&gt;</button> 
  </div>
</template>

<style lang="scss" scoped>
  .program-week {
    border: 1px solid rgba(0,0,0,0.2);
    padding: 0.25rem;
  }
</style>

<script>
import programDay from './program-day.vue';
import Utilities from './utilities.js';

export default {
  name: 'programWeek',
  props: ['week', 'active_week'],
  components: {
    'program-day': programDay
  },
  computed: {
    classObject: function () {
      return {
        active: this.week.id == this.$props.active_week
      }
    },
    isActive: function () {
      return this.week.id == this.$props.active_week;
    }
  },
  methods: {
    getCurrentBlock: function () { //TODO: remove
      return programBuilder.loadedProgram.blocks[this.$parent.block.id];
    },
    addObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('add-object', keys);
    },
    copyObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('copy-object', keys);
    },
    removeObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('remove-object', keys);
    },
    moveObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('update-object', keys);
    }
  }
}
</script>
