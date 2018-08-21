<template>
  <div 
    class="block-week-tab" 
    v-bind:class="classObject"
    v-on:click="changeActiveWeek"
  >
    <label>
      Week {{ week.id + 1 }}
      <span v-on:click="removeObject()" class="week-remove-btn" v-if="isActive">
        <icon name="minus-circle"></icon>
      </span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
@import 'styles/_partials';

.block-week-tab {
  background: rgba(0,0,0,0.1);
  border-right: 1px solid rgba(0,0,0,0.3);
  & > label {
    color: $light-secondary-text-color;
    display: block;
    height: 100%;
    padding: 0.4rem 0.5rem;
    padding-right: 1.95rem;
  }
  &.active {
    background: #5794bb;
    & > label {
      color: $light-primary-text-color;
      line-height: 0.8;
      padding-right: 0.25em;
    }
  }
  &:not(.active):hover {
    background: rgba(0, 0, 0, 0.4);
  } 
}
.week-remove-btn {
  background: none;
  border: none;
  margin-left: 0.3em;
  margin-right: 0.3em;
  opacity: 0.4;
  padding: 0;
  transition: opacity 100ms linear;
  vertical-align: middle;
  &:not([disabled]):hover {
    cursor: pointer;
    opacity: 0.8;
  }
}
</style>

<script>
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/minus-circle';

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
