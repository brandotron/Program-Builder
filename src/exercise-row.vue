<template>
  <div class="exercise-grid" v-if="!editMode">
    <div v-if="!edits_active">
      <button v-on:click="moveObject({direction: 'up'})" class="ex-move-up-btn">^</button> 
      <button v-on:click="moveObject({direction: 'down'})" class="ex-move-down-btn">v</button> 
    </div>
    <div v-else>
      <button disabled class="ex-move-up-btn">^</button> 
      <button disabled class="ex-move-down-btn">v</button> 
    </div>
    <div>{{ exercise.name }}</div>
    <div>{{ exercise.sets }}</div>
    <div>{{ exercise.reps }}</div>
    <div>{{ exercise.weight }}</div>
    <div>{{ exercise.note }}</div>
    <div>
      <button v-on:click="activateEditMode()">Edit</button>
      <button v-on:click="removeObject()" v-if="!edits_active">X</button>
      <button disabled v-else>X</button>
    </div>
  </div>
  <div class="exercise-grid" v-else>
    <div>
      <button disabled class="ex-move-up-btn">^</button> 
      <button disabled class="ex-move-down-btn">v</button> 
    </div>
    <div>
      <input type="text" size="8" class="ex-name-input" v-model="updatedExercise.name"/>
    </div>
    <div>
      <input type="text" size="1" class="ex-sets-input" v-model="updatedExercise.sets"/>
    </div>
    <div>
      <input type="text" size="2" class="ex-reps-input" v-model="updatedExercise.reps"/>
    </div>
    <div>
      <input type="text" size="4" class="ex-weight-input" v-model="updatedExercise.weight"/>
    </div>
    <div>
      <input type="text" size="20" class="ex-note-input" v-model="updatedExercise.note"/>
    </div>
    <div> 
      <button v-on:click="updateExercise()">Save</button>
      <button v-on:click="cancelUpdate()">X</button>
    </div>
  </div>
</template>

<script>
import Utilities from './utilities.js';

export default {
  name: 'exerciseRow',
  props: ['exercise', 'edits_active'],
  data: function () {
    return {
      editMode: false,
      updatedExercise: {
        id: this.exercise.id,
        name: this.exercise.name,
        sets: this.exercise.sets,
        reps: this.exercise.reps,
        weight: this.exercise.weight,
        note: this.exercise.note//,
        //percentage: 73,
        //percentIncrease: 3
      }
    }
  },
  created: function () {
    var obj = this.exercise,
        inputsEmpty = true;

    for (var key in obj) {
      if (key == 'id') {
        continue;
      }
      if (obj[key]) {
        inputsEmpty = false;
      }
    }

    if (inputsEmpty) {
      this.activateEditMode(); //TODO: focus name input
    }
  },
  methods: {
    getCurrentWeek: function () { //TODO: remove
      var currentBlock = programBuilder.loadedProgram.blocks[this.$parent.$parent.$parent.block.id];
      return currentBlock.weeks[this.$parent.$parent.week.id];
    },
    getCurrentDay: function () { //TODO: remove
      return this.getCurrentWeek().days[this.$parent.day.id];
    },
    removeObject: function () {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {exercise: this.exercise.id});
      this.$emit('remove-object', keys);
    },
    moveObject: function() {
      var keys = Utilities.deepExtend({}, arguments[0] || {}, {exercise: this.exercise.id});
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      var keys = Utilities.deepExtend(arguments[0] || {}, {exercise: this.exercise.id});
      this.$emit('update-object', keys);
    },
    activateEditMode: function () {
      this.updatedExercise.name = this.exercise.name;
      this.updatedExercise.sets = this.exercise.sets;
      this.updatedExercise.reps = this.exercise.reps;
      this.updatedExercise.weight = this.exercise.weight;
      this.updatedExercise.note = this.exercise.note;

      this.editMode = true;
      this.$emit('edit-mode', true);
    },
    closeEditMode: function () {
      this.editMode = false;
      this.$emit('edit-mode', false);
    },
    cancelUpdate: function () {
      this.updatedExercise = Utilities.deepExtend({}, this.exercise);
      this.closeEditMode();
    },
    updateExercise: function () {
      var updatedObj = Utilities.deepExtend({}, this.updatedExercise);
      var keys = {updatedObj: updatedObj};
      this.updateObject(keys);
      this.closeEditMode();
    }
  }
}
</script>

<style lang="scss" scoped>
.exercise-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  .name {
    grid-column: 2 / 3;
  }
  .sets {
    grid-column: 3 / 4;
  }
  .reps {
    grid-column: 4 / 5;
  }
  .weight {
    grid-column: 5 / 6;
  }
  .note {
    grid-column: 6 / 7
  }
}
</style>