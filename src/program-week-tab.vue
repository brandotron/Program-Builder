<template>
  <div 
    class="block-week-tab" 
    v-bind:class="classObject"
    v-on:click="changeActiveWeek"
  >
    <label>
      Week {{ week.id + 1 }}
      <button v-on:click="removeObject()" class="week-remove-btn" v-if="isActive">
        <icon name="remove"></icon>
      </button>
    </label>
  </div>
</template>

<style lang="scss" scoped>
  $active-tab-highlight: #6ed5ff;
  
  .block-week-tab {
    background: rgba(0,0,0,0.1);
    border: 1px solid rgba(0,0,0,0.3);
    border-bottom: none;
    max-width: 10em;
    & > label {
      color: rgba(0, 0, 0, 0.54);
      display: block;
      height: 100%;
      padding: 0.25em 0.5em;
      padding-right: 1.75em;
    }
    &.active {
      background: none;
      & > label {
        border-bottom: 3px solid $active-tab-highlight;
        color: rgba(0, 0, 0, 0.87);
        padding-right: 0.25em;
      }
    }
    &:hover {
      background: none;
      & > label {
        border-bottom: 3px solid $active-tab-highlight;
      }
    } 
  }
  .week-remove-btn {
    background: none;
    border: none;
    margin-left: 0.5em;
    opacity: 0.2;
    padding: 0;
    transition: opacity 100ms linear;
    &:not([disabled]):hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
</style>

<script>
import 'vue-awesome/icons/remove';
import Icon from 'vue-awesome/components/Icon.vue';

export default {
  name: 'programWeekTab',
  props: ['week', 'active_week'],
  components: {
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
    changeActiveWeek: function () {
      if (!this.isActive){
        let keys = {week: this.week.id};
        this.$emit('change_active_week', keys);
      }
    },
    removeObject: function () {
      let keys = {week: this.week.id};
      this.$emit('remove-object', keys);
    }
  }
}
</script>
