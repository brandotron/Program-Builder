<template>
  <div class="tool-bar">
    <button v-on:click="undo()" class="undo">
      <icon name="undo"></icon>
      <span class="btn-text">Undo</span>
    </button>
    <button v-on:click="redo()" class="redo">
      <icon name="repeat"></icon>
      <span class="btn-text">Redo</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import 'styles/_variables';
%tool-bar-button {
  background: none;
  border: none;
  opacity: 0.4;
  padding: 0.5em 1em;
  transition: all 100ms linear;
  &:not([disabled]):hover {
    background: rgba(0, 0, 0, 0.2);
    cursor: pointer;
    opacity: 0.8;
  }
}
.tool-bar {
  background: rgba(0, 0, 0, 0.1);
  color: $base-text-color;
  padding: 0 0.25rem;
  .undo,
  .redo {
    @extend %tool-bar-button;
  }
}
</style>

<script>
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/undo';
import 'vue-awesome/icons/repeat';

export default {
  name: 'toolBar',
  components: {
    Icon
  },
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
