<template>
  <div class="program-block">
    <!-- <label class="block-title">Block {{ block.id + 1 }}</label> -->
      <!-- tab controls for week go here -->
      
      <div class="block-week-tab-row">
        <div class="tab-offset"></div>
        <program-week-tab
          v-for="item in block.weeks" 
          v-bind:week="item"
          v-bind:key="item.id"
          v-bind:active_week="activeWeek"
          v-on:change_active_week="changeActiveWeek"
          v-on:remove-object="removeObject"
        ></program-week-tab>
        <div class="filler">
          <span class="block-add-week-btn" v-on:click="addObject">
            <icon name="plus"></icon>
          </span>
        </div>
      </div>
      
      <program-week 
        v-for="item in block.weeks" 
        v-bind:week="item"
        v-bind:key="item.id"
        v-bind:active_week="activeWeek"
        v-bind:num_weeks="numWeeks"
        v-on:add-object="addObject"
        v-on:copy-object="copyObject"
        v-on:remove-object="removeObject"
        v-on:move-object="moveObject"
        v-on:update-object="updateObject"
        v-on:change_active_week="changeActiveWeek"
    ></program-week> 
  </div>
</template>

<style lang="scss" scoped>
$tab-bar-height: 2em;
.program-block {
  height: 100%;
}
.block-week-tab-row {
  border: 1px solid rgba(0, 0, 0, 0.3);
  box-shadow: 0 3px 3px rgba(0,0,0,0.3);
  display: flex;
  height: $tab-bar-height;
  overflow: auto;
  & > div {
    flex: 0 0 auto;
  }
  & > .tab-offset {
    background: rgba(0,0,0,0.1);
    border-right: 1px solid rgba(0,0,0,0.3);
    width: 0.25rem;
  }
  & > .filler {
    background: rgba(0,0,0,0.1);
    flex: 1 0 auto;
  }
}
.block-add-week-btn {
  display: inline-block;
  height: 100%;
  margin: 0.4rem 0.8rem;
  opacity: 0.2;
  transition: opacity 100ms linear;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}
.program-week {
  height: calc(100% - #{$tab-bar-height});
}
</style>

<script>
import programWeek from './program-week.vue';
import programWeekTab from './program-week-tab.vue';
import Utilities from './utilities.js';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/plus';

export default {
  name: 'programBlock',
  props: ['block'],
  components: {
    'program-week': programWeek,
    'program-week-tab': programWeekTab,
    Icon
  },
  data: function () {
    return {
      activeWeek: 0
    }
  },
  computed: {
    numWeeks: function () {
      return this.block.weeks.length;
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
