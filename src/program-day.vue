<template>
  <div class="program-day"> 
    <div class="day-grid">
      <label class="day-title">Day {{ day.id + 1 }}</label>
      <div class="day-head" v-if="day.exercises.length > 0">
        <div class="name">Exercise</div>
        <div class="sets">Sets</div>
        <div class="reps">Reps</div>
        <div class="weight">Weight</div>
        <div class="note">Note</div>
      </div>
      <div class="day-body" v-if="day.exercises.length > 0">
        <!-- <transition-group name="flip-list" tag="div"> look into making this work-->
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
        <!-- </transition-group> -->
      </div>
      <div class="day-buttons">
        <button v-on:click="addObject()" class="day-add-ex-btn">
          <icon name="plus"></icon>
          <span class="btn-txt">Add Exercise</span>
        </button>
        <button v-on:click="removeObject()" class="day-remove-btn">
          <icon name="times-circle"></icon>
          <span class="btn-txt">Remove Day</span>
        </button>
        <button v-on:click="copyObject()" v-if="num_days < 7" class="day-copy-btn">
          <icon name="copy"></icon>
          <span class="btn-txt">Copy Day</span>
        </button>
        <button v-on:click="moveObject({direction: 'up'})" class="day-move-up-btn">
          <icon name="chevron-up"></icon>
        </button> 
        <button v-on:click="moveObject({direction: 'down'})" class="day-move-down-btn">
          <icon name="chevron-down"></icon>
        </button> 
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$head-border-color: rgba(0,0,0,0.2);
.day-title {
  color: rgba(0,0,0,0.54);
  display: block;
}
.day-grid {
  display: inline-block;
  border: 0px solid transparent;
  border-radius: 3px;
  box-shadow: 0 0 3px rgba(0,0,0,0.3);
  margin: 0.5rem 0;
  padding: 1rem;
  position: relative;
}
.day-head {
  display: grid;
  grid-template-columns: 40px 2fr 4em 5em 5em 3fr 50px;
  %head-item {
    padding: 0.25em;
    border-bottom: 1px solid $head-border-color;
    font-weight: bold;
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
%day-button {
  background: none;
  border: none;
  display: inline-flex;
  opacity: 0.2;
  overflow: hidden;
  padding: 0;
  transition: opacity 100ms linear;
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
.day-buttons {
  margin-top: 0.5rem;
  .day-add-ex-btn {
    @extend %day-button;
    &:not([disabled]):hover > span {
      width: 6.25em;
    }
  }
  .day-remove-btn {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0.5em;
    @extend %day-button;
  }
  .day-copy-btn {
    @extend %day-button;
    &:not([disabled]):hover > span {
      width: 5em;
    }
  }
  .day-move-up-btn,
  .day-move-down-btn {
    @extend %day-button;
  }
}
</style>

<script>
import exerciseRow from './exercise-row.vue';
import Utilities from './utilities.js';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/chevron-up';
import 'vue-awesome/icons/chevron-down';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/times-circle';
import 'vue-awesome/icons/copy';

export default {
  name: 'programDay',
  props: ['day', 'num_days'],
  components: {
    'exercise-row': exerciseRow,
    Icon
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
