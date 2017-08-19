<template>
  <div class="tool-bar">
    <button v-on:click="undo()" class="undo">
      <icon name="undo"></icon>
      <span class="btn-txt">Undo</span>
    </button>
    <button v-on:click="redo()" class="redo">
      <icon name="repeat"></icon>
      <span class="btn-txt">Redo</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import 'styles/_variables';
@import 'styles/_mixins';

@mixin tool-bar-button () {
  @include hover-button();
  padding: 0.5em 1em;
}

.tool-bar {
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  padding: 0 0.25rem;
  .undo,
  .redo {
    @include tool-bar-button(); 
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
