<template>
  <div class="program-week">
    <div class="week-title">Week {{ week.id + 1 }}</div>
    <program-day 
      v-for="item in week.days"
      v-bind:day="item"
      v-bind:key="item.id"
      v-bind:num_days="week.days.length"
    ></program-day> 
    <button v-on:click="addNewDay" v-if="week.days.length < 7">Add New Day</button>
    <button v-on:click="removeWeek">Remove Week</button>
    <button v-on:click="copyWeek">Copy Week</button>
    <button v-on:click="moveWeek('up')" class="week-move-up-btn">^</button> 
    <button v-on:click="moveWeek('down')" class="week-move-down-btn">v</button> 
  </div>
</template>

<script>
import programDay from './program-day.vue'

export default {
  name: 'programWeek',
  props: ['week'],
  components: {
    'program-day': programDay
  },
  methods: {
    getCurrentBlock: function () {
      return programBuilder.loadedProgram.blocks[this.$parent.block.id];
    },
    addNewDay: function () {
      var currentBlock = this.getCurrentBlock(),
          newDay = deepExtend({}, programBuilder.emptyDay),
          currentWeek;
      
      currentWeek = currentBlock.weeks[this.week.id];

      newDay.id = currentWeek.days.length;

      currentWeek.days.push(newDay);
    },
    removeWeek: function () {
      var currentBlock = this.getCurrentBlock();

      currentBlock.weeks.splice(this.week.id, 1);

      this.resequenceWeeks();
    },
    copyWeek: function () {
      var currentBlock = this.getCurrentBlock(),
          newWeekObj;

      newWeekObj = deepExtend({}, currentBlock.weeks.slice(this.week.id, this.week.id + 1)[0]);
      newWeekObj.id = currentBlock.weeks.length; 

      currentBlock.weeks.push(newWeekObj);
    },
    resequenceWeeks: function () {
      var currentBlock = this.getCurrentBlock(),
          resequencedWeeks,
          resequencedBlock;

      resequencedBlock = deepExtend({}, currentBlock);
      resequencedWeeks = resequenceItems(currentBlock.weeks);

      resequencedBlock.weeks = resequencedWeeks;

      programBuilder.loadedProgram.blocks.splice(this.$parent.block.id, 1, resequencedBlock);
    },
    moveWeek: function (direction) {
      var currentBlock = this.getCurrentBlock(),
          currentId,
          newId,
          tempObjThis,
          tempObjSwap,
          newObjThis,
          newObjSwap;

      if (direction == 'up') {
        currentId = this.week.id;
        newId = this.week.id - 1;
      } else if (direction == 'down') {
        currentId = this.week.id;
        newId = this.week.id + 1;
      } else {
        return; //TODO: this would be an error
      }

      tempObjThis = deepExtend({}, currentBlock.weeks.slice(currentId, currentId + 1)[0]);
      tempObjSwap = deepExtend({}, currentBlock.weeks.slice(newId, newId + 1)[0]);

      tempObjThis.id = newId;
      tempObjSwap.id = this.week.id;

      currentBlock.weeks.splice(currentId, 1, tempObjSwap);
      currentBlock.weeks.splice(newId, 1, tempObjThis);
    }
  }
}
</script>
