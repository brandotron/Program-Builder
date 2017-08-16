<template>
  <div class="tool-bar">
    <button v-on:click="undo()">Undo</button>
    <button v-on:click="redo()">Redo</button>
  </div>
</template>

<style lang="scss" scoped>
@import 'styles/_variables';

.tool-bar {
  background: rgba(0, 0, 0, 0.1);
  color: $base-text-color;
  padding: 0.25rem;
}
</style>

<script>
// import Icon from 'vue-awesome/components/Icon.vue';

export default {
  name: 'toolBar',
  // components: {
  //   Icon
  // },
  methods: {
    undo: function () {
      this.$emit('load-state', 'undo');
    },
    redo: function () {
      this.$emit('load-state', 'redo');
    }
  }
}
</script>
