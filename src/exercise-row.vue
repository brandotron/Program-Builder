<template>
  <tr class="ex-row" v-if="!editMode">
      <td class="ex-cell" v-if="!edits_active">
        <button v-on:click="move('up')" class="ex-move-up-btn">^</button> 
        <button v-on:click="move('down')" class="ex-move-down-btn">v</button> 
      </td>
      <td class="ex-cell" v-else>
        <button disabled class="ex-move-up-btn">^</button> 
        <button disabled class="ex-move-down-btn">v</button> 
      </td>
      <td class="ex-cell">{{ exercise.name }}</td>
      <td class="ex-cell">{{ exercise.sets }}</td>
      <td class="ex-cell">{{ exercise.reps }}</td>
      <td class="ex-cell">{{ exercise.weight }}</td>
      <td class="ex-cell">{{ exercise.note }}</td>
      <td class="ex-cell"> 
        <button v-on:click="activateEditMode">Edit</button>
        <button v-on:click="removeExercise" v-if="!edits_active">X</button>
        <button disabled v-else>X</button>
      </td>
    </tr>
    <tr class="ex-row" v-else>
      <td class="ex-cell" nowrap="nowrap">
        <button disabled class="ex-move-up-btn">^</button> 
        <button disabled class="ex-move-down-btn">v</button> 
      </td>
      <td class="ex-cell">
        <input type="text" size="8" class="ex-name-input" v-model="updatedExercise.name"/>
      </td>
      <td class="ex-cell">
        <input type="text" size="1" class="ex-sets-input" v-model="updatedExercise.sets"/>
      </td>
      <td class="ex-cell">
        <input type="text" size="2" class="ex-reps-input" v-model="updatedExercise.reps"/>
      </td>
      <td class="ex-cell">
        <input type="text" size="4" class="ex-weight-input" v-model="updatedExercise.weight"/>
      </td>
      <td class="ex-cell">
        <input type="text" size="20" class="ex-note-input" v-model="updatedExercise.note"/>
      </td>
      <td class="ex-cell" nowrap="nowrap"> 
        <button v-on:click="updateExercise">Save</button>
        <button v-on:click="cancelUpdate">X</button>
      </td>
    </tr>
</template>

<script>
export default {
  name: 'exerciseRow',
  props: ['exercise', 'edits_active'],
  data: function () {
    return {
      editMode: false,
      updatedExercise: {
        id: '',
        name: '',
        sets: '',
        reps: '',
        weight: '',
        note: ''//,
        //percentage: 73,
        //percentIncrease: 3
      }
    }
  },
  methods: {
    getCurrentWeek: function () {
      var currentBlock = programBuilder.loadedProgram.blocks[this.$parent.$parent.$parent.block.id];
      return currentBlock.weeks[this.$parent.$parent.week.id];
    },
    getCurrentDay: function () {
      return this.getCurrentWeek().days[this.$parent.day.id];
    },
    removeExercise: function () {
      var currentDay = this.getCurrentDay();

      currentDay.exercises.splice(this.exercise.id, 1);

      this.resequenceExercises();
    },
    resequenceExercises: function () {
      var currentWeek = this.getCurrentWeek(),
          currentDay = this.getCurrentDay(),
          resequencedExercises,
          resequencedDay;

      resequencedDay = deepExtend({}, currentDay);
      resequencedExercises = resequenceItems(currentDay.exercises);

      resequencedDay.exercises = resequencedExercises;

      currentWeek.days.splice(this.$parent.day.id, 1, resequencedDay);
    },
    // openEditExercise: function () {
    //   programBuilder.newExercise.day = this.$parent.day.id;
    //   programBuilder.newExercise.week = this.$parent.$parent.week.id;
    //   programBuilder.newExercise.block = this.$parent.$parent.$parent.block.id;
    //   programBuilder.newExercise.id = this.exercise.id;

    //   programBuilder.newExercise.name = this.exercise.name;
    //   programBuilder.newExercise.sets = this.exercise.sets;
    //   programBuilder.newExercise.reps = this.exercise.reps;
    //   programBuilder.newExercise.weight = this.exercise.weight;
    //   programBuilder.newExercise.note = this.exercise.note;

    //   programBuilder.newExercise.mode = 'update';
    //   programBuilder.newExercise.active = true;
    // },
    move: function(direction) {
      var currentDay = this.getCurrentDay(),
          currentId,
          newId,
          tempObjThis,
          tempObjSwap,
          newObjThis,
          newObjSwap;

      if (direction == 'up') {
        currentId = this.exercise.id;
        newId = this.exercise.id - 1;
      } else if (direction == 'down') {
        currentId = this.exercise.id;
        newId = this.exercise.id + 1;
      } else {
        return; //TODO: this would be an error
      }

      tempObjThis = deepExtend({}, currentDay.exercises.slice(currentId, currentId + 1)[0]);
      tempObjSwap = deepExtend({}, currentDay.exercises.slice(newId, newId + 1)[0]);

      tempObjThis.id = newId;
      tempObjSwap.id = this.exercise.id;

      currentDay.exercises.splice(currentId, 1, tempObjSwap);
      currentDay.exercises.splice(newId, 1, tempObjThis);
    },
    activateEditMode: function () {
      var thisDay,
          buttonsToDisable;

      this.updatedExercise.name = this.exercise.name;
      this.updatedExercise.sets = this.exercise.sets;
      this.updatedExercise.reps = this.exercise.reps;
      this.updatedExercise.weight = this.exercise.weight;
      this.updatedExercise.note = this.exercise.note;

      this.editMode = true;

      this.$parent.editsActive = true;
    },
    updateExercise: function () {
      var updatedObj = deepExtend({}, this.updatedExercise),
          currentDay = this.getCurrentDay();

      currentDay.exercises.splice(this.exercise.id, 1, updatedObj);

      this.editMode = false;
    },
    cancelUpdate: function () {
      var editsActive = false;

      this.editMode = false;

      for (var sibling in this.$parent.$children) {
        if (sibling.editMode == true) {
          editsActive = true;
        }
      }

      this.$parent.editsActive = editsActive;
    }
  }
}
</script>