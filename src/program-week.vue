<template>
  <div class="program-week" v-if="isActive">
    <!-- <label class="week-title">Week {{ week.id + 1 }}</label> -->
    <div class="week-days">
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
    </div>
    <div class="week-buttons">      
      <button v-on:click="addObject()" class="week-add-day-btn" v-if="week.days.length < 7">
        <icon name="plus"></icon>
        <span class="btn-txt">Add Day</span>
      </button>
      <button v-on:click="copyObject()" class="week-copy-btn">
        <icon name="copy"></icon>
        <span class="btn-txt">Copy Week</span>
      </button>
      <button v-on:click="moveObject({direction: 'up'})" class="week-move-up-btn">
        <icon name="chevron-left"></icon>
      </button> 
      <button v-on:click="moveObject({direction: 'down'})" class="week-move-down-btn">
        <icon name="chevron-right"></icon>
      </button> 
    </div> 
  </div>
</template>

<style lang="scss" scoped>
@import 'styles/_variables';

.program-week {
  border: 1px solid rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}
.week-days {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0.25rem;
}
%week-button {
  background: none;
  border: none;
  color: $light-primary-text-color;
  display: inline-flex;
  opacity: 0.3;
  overflow: hidden;
  padding: 0;
  transition: opacity 100ms linear;
  vertical-align: middle;
  white-space: nowrap;
  &:not([disabled]):hover {
    cursor: pointer;
    opacity: 0.8;
  }
  > .fa-icon {
    flex: 0 0 auto;
  }
  .btn-txt {
    flex: 1 1 auto;
    overflow: hidden;
    transition: width 100ms linear;
    width: 0;
  }
}
.week-buttons {
  background: rgba(0,0,0,0.05);
  border-top: 1px solid rgba(0,0,0,0.2);
  flex: 0 0 auto;
  padding: 0.25rem;
  .week-add-day-btn {
    @extend %week-button;
    &:not([disabled]):hover > span {
      width: 4.5em;
    }
  }
  .week-copy-btn {
    @extend %week-button;
    &:not([disabled]):hover > span {
      width: 6em;
    }
  }
  .week-move-up-btn,
  .week-move-down-btn {
    @extend %week-button;
  }
}
</style>

<script>
import programDay from './program-day.vue';
import Utilities from './utilities.js';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/chevron-left';
import 'vue-awesome/icons/chevron-right';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/copy';

export default {
  name: 'programWeek',
  props: ['week', 'active_week', 'num_weeks'],
  components: {
    'program-day': programDay,
    Icon
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
      if (keys.day === undefined) { 
        let tabKeys;
        //if we are moving this week, keep it active
        if (keys.direction == 'up' && this.week.id != 0) {
          tabKeys = {week: this.week.id - 1};
        } else if (keys.direction == 'down' && this.week.id != this.$props.num_weeks - 1) {
          tabKeys = {week: this.week.id + 1};
        } else {
          return; //TODO: this is an error
        }
        this.$emit('change_active_week', tabKeys);
      }
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {week: this.week.id});
      this.$emit('update-object', keys);
    }
  }
}
</script>
