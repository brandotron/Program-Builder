<template>
  <div class="program-block">
    <label class="block-title">Block {{ block.id + 1 }}</label>
      <!-- tab controls for week go here -->
      
      <div class="block-week-tab-row">
        <program-week-tab
          v-for="item in block.weeks" 
          v-bind:week="item"
          v-bind:key="item.id"
          v-bind:active_week="activeWeek"
          v-on:change_active_week="changeActiveWeek"
        ></program-week-tab>
      </div>
      
      <program-week 
        v-for="item in block.weeks" 
        v-bind:week="item"
        v-bind:key="item.id"
        v-bind:active_week="activeWeek"
        v-on:add-object="addObject"
        v-on:copy-object="copyObject"
        v-on:remove-object="removeObject"
        v-on:move-object="moveObject"
        v-on:update-object="updateObject"
    ></program-week> 
  </div>
</template>

<style lang="scss" scoped>
  .block-week-tab-row {
    border: 1px solid rgba(0, 0, 0, 0.3);
    display: flex;
    & > div {
      flex: 1 0 auto;
    }
  }
</style>

<script>
import programWeek from './program-week.vue';
import programWeekTab from './program-week-tab.vue';
import Utilities from './utilities.js';

export default {
  name: 'programBlock',
  props: ['block'],
  components: {
    'program-week': programWeek,
    'program-week-tab': programWeekTab
  },
  data: function () {
    return {
      activeWeek: 0
    }
  },
  methods: {
    addObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('add-object', keys);
    },
    copyObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('copy-object', keys);
    },
    removeObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('remove-object', keys);
    },
    moveObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('update-object', keys);
    },
    changeActiveWeek: function () {
      var keys = arguments[0];
      if (keys.week !== undefined) {
        this.activeWeek = keys.week;
      }
    }
  }
}
</script>
