<template>
  <div class="program-block">
    <label class="block-title">Block {{ block.id + 1 }}</label>
      <program-week 
        v-for="item in block.weeks" 
        v-bind:week="item"
        v-bind:key="item.id"
        v-on:add-object="addObject"
        v-on:copy-object="copyObject"
        v-on:remove-object="removeObject"
        v-on:move-object="moveObject"
        v-on:update-object="updateObject"
    ></program-week> 
  </div>
</template>

<script>
import programWeek from './program-week.vue';
import Utilities from './utilities.js';

export default {
  name: 'programBlock',
  props: ['block'],
  components: {
    'program-week': programWeek
  },
  methods: {
    addObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('add-object', keys);
    },
    copyObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('copy-object', keys);
    },
    removeObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('remove-object', keys);
    },
    moveObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {block: this.block.id});
      this.$emit('update-object', keys);
    }
  }
}
</script>
