<template>
  <div 
    class="block-week-tab" 
    v-bind:class="classObject"
    v-on:click="changeActiveWeek"
  >
    <label>
      Week {{ week.id + 1 }}
    </label>
  </div>
</template>

<style lang="scss" scoped>
  $active-tab-highlight: #6ed5ff;
  .block-week-tab {
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(0,0,0,0.3);
    max-width: 10em;
    & > label {
      color: rgba(0, 0, 0, 0.5);
      display: block;
      height: 100%;
      padding: 0.25em;
    }
    &.active {
      background: none;
      & > label {
        border-bottom: 2px solid $active-tab-highlight;
        color: rgba(0, 0, 0, 0.87);
      }
    } 
  }
</style>

<script>
export default {
  name: 'programWeekTab',
  props: ['week', 'active_week'],
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
    }
  }
}
</script>
