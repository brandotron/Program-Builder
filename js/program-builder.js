var testProgram = {
  id: 0,
  name: '',
  athlete: '',
  startingDate: '',
  blocks: [
    {
      id: 0,
      name: '',
      weeks: [
        {
          id: 0,
          days: [
            {
              id: 0,
              dayNumber: 0,
              exercises: [
                // {
                //     id: 0
                //     name: '',
                //     sets: 0,
                //     reps: 0,
                //     percentage: 0,
                //     weight: 0,
                //     note: ''
                // }
                {
                  id: 0,
                  name: 'snatch',
                  sets: 3,
                  reps: 3,
                  weight: '75%',
                  note: ''
                },
                {
                  id: 1,
                  name: 'clean + jerk',
                  sets: 2,
                  reps: '1 + 2',
                  weight: '75%',
                  note: ''
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
Vue.component('loaded-program', {
  props: ['program'],
  template: 
    '<div class="loaded-program">Loaded Program' +
      '<program-block ' +
        'v-for="item in program.blocks"' + 
        'v-bind:block="item"' +
        'v-bind:key="item.id"' +
      '></program-block>' +
    '</div>'
});
Vue.component('program-block', {
  props: ['block'],
  template: 
    '<div class="program-block">Block' +
      '<program-week ' +
        'v-for="item in block.weeks"' + 
        'v-bind:week="item"' +
        'v-bind:key="item.id"' +
      '></program-week>' +
    '</div>'
});
Vue.component('program-week', {
  props: ['week'],
  template: 
    '<div class="program-week">Week' +
      '<program-day ' +
        'v-for="item in week.days"' +
        'v-bind:day="item"' +
        'v-bind:key="item.id"' +
      '></program-day>' +
    '</div>'
});
Vue.component('program-day', {
  props: ['day'],
  template: 
    '<div class="program-day">Day' + 
      '<table class="day-table">' +
        '<thead class="day-head">' +
          '<tr class="day-column-head-row">' +
            '<th class="day-column-head">Exercise</th>' +
            '<th class="day-column-head">Sets</th>' +
            '<th class="day-column-head">Reps</th>' +
            '<th class="day-column-head">Weight</th>' +
            '<th class="day-column-head">Note</th>' +
            '<th class="day-column-head"></th>' +
          '</tr>' +
        '</thead>' +
        '<tbody class="day-body">' +
          '<exercise-row ' +
            'v-for="item in day.exercises"' +
            'v-bind:exercise="item"' +
            'v-bind:key="item.id"' +
          '></exercise-row>' +
        '</tbody>' +
      '</table>' + 
      '<button v-on:click="openAddExercisePanel">Add Exercise</button>' +
    '</div>',
  methods: {
    openAddExercisePanel: function () {
      programBuilder.newExercise.day = this.day.id;
      programBuilder.newExercise.week = this.$parent.week.id;
      programBuilder.newExercise.block = this.$parent.$parent.block.id;
      programBuilder.newExercise.id = this.day.exercises.length;
      programBuilder.newExercise.mode = 'add';
      programBuilder.newExercise.active = true;
    }
  }
});
Vue.component('exercise-row', {
  props: ['exercise'],
  template: 
    '<tr class="exercise-row">' +
      '<td class="exercise-cell">{{ exercise.name }}</td>' +
      '<td class="exercise-cell">{{ exercise.sets }}</td>' +
      '<td class="exercise-cell">{{ exercise.reps }}</td>' +
      '<td class="exercise-cell">{{ exercise.weight }}</td>' +
      '<td class="exercise-cell">{{ exercise.note }}</td>' +
      '<td class="exercise-cell">' +
        '<button v-on:click="openEditExercise">Edit</button>' +
        '<button v-on:click="removeExercise">X</button>' +
        '<button v-on:click="move(\'up\')" class="exercise-move-up-btn">Up</button>' + 
        '<button v-on:click="move(\'down\')" class="exercise-move-down-btn">Down</button>' + 
      '</td>' +
    '</tr>',
  // data: {
  //   day: function () {
  //     return this.$parent.day.id;
  //   },
  //   week: function () {
  //     return this.$parent.$parent.week.id;
  //   },
  //   block: function () {
  //     return this.$parent.$parent.$parent.block.id;
  //   }
  // },
  methods: {
    getCurrentDay: function () {
      var currentBlock = programBuilder.loadedProgram.blocks[this.$parent.$parent.$parent.block.id];
      var currentWeek = currentBlock.weeks[this.$parent.$parent.week.id];
      var currentDay = currentWeek.days[this.$parent.day.id];

      return currentDay;
    },
    removeExercise: function () {
      var currentDay = this.getCurrentDay();

      currentDay.exercises.splice(this.exercise.id, 1);
    },
    openEditExercise: function () {
      programBuilder.newExercise.day = this.$parent.day.id;
      programBuilder.newExercise.week = this.$parent.$parent.week.id;
      programBuilder.newExercise.block = this.$parent.$parent.$parent.block.id;
      programBuilder.newExercise.id = this.exercise.id;

      programBuilder.newExercise.name = this.exercise.name;
      programBuilder.newExercise.sets = this.exercise.sets;
      programBuilder.newExercise.reps = this.exercise.reps;
      programBuilder.newExercise.weight = this.exercise.weight;
      programBuilder.newExercise.note = this.exercise.note;

      programBuilder.newExercise.mode = 'update';
      programBuilder.newExercise.active = true;
    },
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
      } else { // direction == 'down'
        currentId = this.exercise.id;
        newId = this.exercise.id + 1;
      }

      tempObjThis = currentDay.exercises.slice(currentId, currentId + 1)[0];
      newobjThis = {
        id: newId,
        name: tempObjThis.name,
        sets: tempObjThis.sets,
        reps: tempObjThis.reps,
        weight: tempObjThis.weight,
        note: tempObjThis.note
      };

      tempObjSwap = currentDay.exercises.slice(newId, newId + 1)[0];
      newobjSwap = {
        id: this.exercise.id,
        name: tempObjSwap.name,
        sets: tempObjSwap.sets,
        reps: tempObjSwap.reps,
        weight: tempObjSwap.weight,
        note: tempObjSwap.note
      };

      currentDay.exercises.splice(currentId, 1, newobjSwap);
      currentDay.exercises.splice(newId, 1, newobjThis);
    }
  }
});                
var programBuilder = new Vue({
  el: '#program-builder',
  data: {
    programLoaded: true,
    //loading test program for now, will work on capability to deal with multiple programs later
    loadedProgram: testProgram, //{},
    allPrograms: {},
    newExercise: {
      active: false,
      mode: 'add',
      block: '',
      week: '',
      day: '',
      id: 0,
      name: '',
      sets: '',
      reps: '',
      weight: '',
      note: ''
    }
  },
  methods: { //rename these functions for new scope (may have more than 1 "panel" to close, etc.)
    addExerciseToDay: function () {
      var exerciseToPush = {
        id: this.newExercise.id,
        name: this.newExercise.name,
        sets: this.newExercise.sets,
        reps: this.newExercise.reps,
        weight: this.newExercise.weight,
        note: this.newExercise.note
      }
      var currentBlock = programBuilder.loadedProgram.blocks[this.newExercise.block];
      var currentWeek = currentBlock.weeks[this.newExercise.week];
      var currentDay = currentWeek.days[this.newExercise.day];

      currentDay.exercises.push(exerciseToPush);
      this.resetExerciseInputs();

      this.newExercise.id += 1;
    },
    updateExercise: function () { //TODO: combine this and above function
      var exerciseToPush = {
        id: this.newExercise.id,
        name: this.newExercise.name,
        sets: this.newExercise.sets,
        reps: this.newExercise.reps,
        weight: this.newExercise.weight,
        note: this.newExercise.note
      }
      var currentBlock = programBuilder.loadedProgram.blocks[this.newExercise.block];
      var currentWeek = currentBlock.weeks[this.newExercise.week];
      var currentDay = currentWeek.days[this.newExercise.day];

      currentDay.exercises.splice(this.newExercise.id, 1, exerciseToPush);

      this.resetExerciseInputs();

      this.newExercise.block = '';
      this.newExercise.week = '';
      this.newExercise.day = '';
    },
    closeExercisePanel: function () {
      this.newExercise.active = false;

      this.resetExerciseInputs();

      this.newExercise.block = '';
      this.newExercise.week = '';
      this.newExercise.day = '';

    },
    resetExerciseInputs: function () {
      // this.active = this.active;
      // this.newExercise.block = '';
      // this.newExercise.week = '';
      // this.newExercise.day = '';
      this.newExercise.name = '';
      this.newExercise.sets = '';
      this.newExercise.reps = '';
      this.newExercise.weight = '';
      this.newExercise.note = '';
      this.newExercise.mode = 'add';
    }
  }
});