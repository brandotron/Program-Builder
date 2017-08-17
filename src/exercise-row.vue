<template>
  <div class="exercise-grid" v-if="!editMode">
    <div v-if="!edits_active">
      <button v-on:click="moveObject({direction: 'up'})" class="ex-move-up-btn">
        <icon name="chevron-up"></icon>
      </button> 
      <button v-on:click="moveObject({direction: 'down'})" class="ex-move-down-btn">
        <icon name="chevron-down"></icon>
      </button> 
    </div>
    <div v-else>
      <button disabled class="ex-move-up-btn">
        <icon name="chevron-up"></icon>
      </button> 
      <button disabled class="ex-move-down-btn">
        <icon name="chevron-down"></icon>
      </button> 
    </div>
    <div>{{ exercise.name }}</div>
    <div>{{ exercise.sets }}</div>
    <div>{{ exercise.reps }}</div>
    <div>{{ exercise.weight }}</div>
    <div>{{ exercise.note }}</div>
    <div>
      <button v-on:click="activateEditMode()" class="ex-edit-btn">
        <icon name="pencil"></icon>
      </button>
      <button v-on:click="removeObject()" v-if="!edits_active" class="ex-remove-btn">
        <icon name="remove"></icon>
      </button>
      <button disabled v-else class="ex-remove-btn">
        <icon name="remove"></icon>
      </button>
    </div>
  </div>
  <div class="exercise-grid" v-else>
    <div>
      <button disabled class="ex-move-up-btn">
        <icon name="chevron-up"></icon>
      </button> 
      <button disabled class="ex-move-down-btn">
        <icon name="chevron-down"></icon>
      </button> 
    </div>
    <div>
      <input type="text" class="ex-name-input" v-model="updatedExercise.name" ref="name-input"/>
    </div>
    <div>
      <input type="text" class="ex-sets-input" v-model="updatedExercise.sets"/>
    </div>
    <div>
      <input type="text" class="ex-reps-input" v-model="updatedExercise.reps"/>
    </div>
    <div>
      <input type="text" class="ex-weight-input" v-model="updatedExercise.weight"/>
    </div>
    <div>
      <input type="text" class="ex-note-input" v-model="updatedExercise.note"/>
    </div>
    <div> 
      <button v-on:click="updateExercise()" class="ex-update-btn">
        <icon name="save"></icon>
      </button>
      <button v-on:click="cancelUpdate()" class="ex-cancel-update-btn">
        <icon name="reply"></icon>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
@import 'styles/_variables';

.exercise-grid {
  color: $light-primary-text-color;
  display: grid;
  grid-template-columns: 40px 2fr 4em 5em 5em 3fr 50px;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  & > div {
    padding: 0.25em;
  }
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
  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    font-size: 0.8rem;
    padding: 0.4em;
  }
  %row-buttons {
    background: none;
    border: none;
    color: $light-primary-text-color;
    opacity: 0.3;
    padding: 0;
    transition: opacity 100ms linear;
    &:not([disabled]):hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
  .ex-move-up-btn,
  .ex-move-down-btn,
  .ex-cancel-update-btn {
    @extend %row-buttons;
    .fa-icon {
      width: auto;
      height: 1em;
    }
  }
  .ex-edit-btn,
  .ex-remove-btn,
  .ex-update-btn {
    @extend %row-buttons;
  }
  .ex-remove-btn {
    color: #a41c1c;
  }
}
</style>

<script>
import Utilities from './utilities.js';
import Icon from 'vue-awesome/components/Icon.vue';
import 'vue-awesome/icons/chevron-up';
import 'vue-awesome/icons/chevron-down';
import 'vue-awesome/icons/pencil';
import 'vue-awesome/icons/remove';
import 'vue-awesome/icons/save';
import 'vue-awesome/icons/reply';

export default {
  name: 'exerciseRow',
  props: ['exercise', 'edits_active'],
  components: {
    Icon
  },
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
    let obj = this.exercise,
        inputsEmpty = true;

    for (let key in obj) {
      if (key == 'id') {
        continue;
      }
      if (obj[key]) {
        inputsEmpty = false;
      }
    }

    if (inputsEmpty) {
      this.activateEditMode();
    }
  },
  mounted: function () {
    this.focusOnEditMode();
  },
  // updated: function () {
  //   this.focusOnEditMode();
  // },
  methods: {
    removeObject: function () {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {exercise: this.exercise.id});
      this.$emit('remove-object', keys);
    },
    moveObject: function() {
      let keys = Utilities.deepExtend({}, arguments[0] || {}, {exercise: this.exercise.id});
      this.$emit('move-object', keys);
    },
    updateObject: function () {
      let keys = Utilities.deepExtend(arguments[0] || {}, {exercise: this.exercise.id});
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
      let updatedObj = Utilities.deepExtend({}, this.updatedExercise);
      let keys = {updatedObj: updatedObj};
      this.updateObject(keys);
      this.closeEditMode();
    },
    focusOnEditMode: function () {
      if (this.editMode) {
        this.$refs['name-input'].focus();
      }
    }
  }
}
</script>
