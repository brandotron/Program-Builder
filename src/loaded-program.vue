<template>
  <div class="loaded-program">
    <label class="loaded-program-title">Loaded Program</label>
    <program-block 
      v-for="item in program.blocks" 
      v-bind:block="item" 
      v-bind:key="item.id"
      v-on:add-object="addObject"
      v-on:copy-object="copyObject"
      v-on:remove-object="removeObject"
      v-on:move-object="moveObject"
      v-on:update-object="updateObject"
    ></program-block> 
  </div>
</template>

<script>
import programBlock from './program-block.vue';
import Utilities from './utilities.js';

export default {
  name: 'loadedProgram',
  props: ['program'],
  components: {
    'program-block': programBlock
  },
  methods: {
    addObject: function () {
      var keys = arguments[0];
      this.$emit('add-object', keys);
    },
    copyObject: function () {
      var keys = arguments[0];
      this.$emit('copy-object', keys);
    },
    removeObject: function () {
      var keys = arguments[0];
      this.$emit('remove-object', keys);
    },
    moveObject: function () {
      var keys = arguments[0];
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      var keys = arguments[0];
      this.$emit('update-object', keys);
    }
  }
}
</script>
