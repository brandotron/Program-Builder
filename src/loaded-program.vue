<template>
  <div class="loaded-program">
    Loaded Program
    <program-block 
      v-for="item in program.blocks" 
      v-bind:block="item" 
      v-bind:key="item.id"
    ></program-block> 
  </div>
</template>

<script>
import programBlock from './program-block.vue'

export default {
  name: 'loadedProgram',
  props: ['program'],
  components: {
    'program-block': programBlock
  }
}
</script>
