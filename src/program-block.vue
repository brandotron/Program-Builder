<template>
  <div class="program-block">
    <div class="block-title">Block {{ block.id + 1 }}</div>
      <program-week 
        v-for="item in block.weeks" 
        v-bind:week="item"
        v-bind:key="item.id"
        v-on:remove-exercise="removeChildObject"
        v-on:remove-day="removeChildObject"
        v-on:remove-week="removeChildObject"
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
    removeBlock: function () {
      var keys = {block: this.block.id};
      this.$emit('remove-block', keys);
    },
    removeChildObject: function () {
      var keys = arguments[0] || {},
      event;

      keys.block = this.block.id;

      if (keys.exercise !== undefined) {
        event = 'remove-exercise';
      } else if (keys.day !== undefined) {
        event = 'remove-day';
      } else if (keys.week !== undefined) {
        event = 'remove-week';
      } else { //TODO: This would be an error
        return;
      }

      this.$emit(event, keys);
    }
  }
}
</script>
