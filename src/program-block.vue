<template>
  <div class="program-block">
    <div class="block-title">Block {{ block.id + 1 }}</div>
      <program-week 
        v-for="item in block.weeks" 
        v-bind:week="item"
        v-bind:key="item.id"
        v-on:remove-exercise="removeExercise"
    ></program-week> 
  </div>
</template>

<script>
import programWeek from './program-week.vue'

export default {
  name: 'programBlock',
  props: ['block'],
  components: {
    'program-week': programWeek
  },
  methods: {
    removeExercise: function () {
      var keys = arguments[0];
      keys.block = this.block.id;
      this.$emit('remove-exercise', keys);
    }
  }
}
</script>
