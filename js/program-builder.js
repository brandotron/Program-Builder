Vue.component('loaded-program', {
  props: ['program'],
  template: 
    '<div class="loaded-program">' +
      '<program-block ' +
        'v-for="item in program.blocks"' + 
        'v-bind:block="item"' +
      '></program-block>' +
    '</div>'
});
Vue.component('program-block', {
  props: ['block'],
  template: 
    '<div class="program-block">' +
      '<program-week ' +
        'v-for="item in block.weeks"' + 
        'v-bind:week="item"' +
      '></program-week>' +
    '</div>'
});
Vue.component('program-week', {
  props: ['week'],
  template: 
    '<div class="program-week">' +
      '<program-day ' +
        'v-for="item in week.days"' +
        'v-bind:day="item"' +
      '></program-day>' +
    '</div>'
});
Vue.component('program-day', {
  props: ['day'],
  template: 
    '<div class="program-day">' + 
      '<table class="day-table">' +
        '<thead class="day-head">' +
          '<tr class="day-column-head-row">' +
            '<th class="day-column-head">Exercise</th>' +
            '<th class="day-column-head">Sets</th>' +
            '<th class="day-column-head">Reps</th>' +
            '<th class="day-column-head">Weight</th>' +
            '<th class="day-column-head">Note</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody class="day-body">' +
          '<program-exercise-row ' +
            'v-for="item in day.exercises"' +
            'v-bind:exercise="item"' +
          '></program-exercise-row>' +
        '</tbody>' +
      '</table>' + 
      '<button v-on:click="openAddExercisePanel">Add Exercise</button>' +
    '</div>',
  methods: {
    openAddExercisePanel: function () {
      programBuilder.addExercise.active = true;
      //set block, week, day for new exercise
    }
  }
});
Vue.component('program-exercise-row', {
  props: ['exercise'],
  template: 
    '<tr class="day-exercise-row">' +
      '<td class="day-exercise-cell">{{ exercise.name }}</td>' +
      '<td class="day-exercise-cell">{{ exercise.sets }}</td>' +
      '<td class="day-exercise-cell">{{ exercise.reps }}</td>' +
      '<td class="day-exercise-cell">{{ exercise.weight }}</td>' +
      '<td class="day-exercise-cell">{{ exercise.note }}</td>' +
    '</tr>'
});                
var programBuilder = new Vue({
  el: '#program-builder',
  data: {
    programLoaded: false,
    loadedProgram: {},
    allPrograms: {},
    addExercise: {
      active: false,
      block: '',
      week: '',
      day: '',
      name: '',
      sets: '',
      reps: '',
      weight: '',
      note: ''
    },
    week: { //to be eliminated and replaced by loadedProgram
      id: 0,
      days: [
        {
          id: 0,
          exercises: [
            {
              name: 'snatch',
              sets: 3,
              reps: 3,
              weight: '75%',
              note: ''
            },
            {
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
  },
  methods: { //rename these for new scope (may have more than 1 "panel" to close)
    addExerciseToDay: function () {
      var exerciseToPush = {
        name: this.addExercise.name,
        sets: this.addExercise.sets,
        reps: this.addExercise.reps,
        weight: this.addExercise.weight,
        note: this.addExercise.note
      },
      currentDay = programBuilder.week.days[0]; //use properties set when panel added
      currentDay.exercises.push(exerciseToPush);
      this.resetInputs();
    },
    closePanel: function () {
      this.addExercise.active = false;
      this.resetInputs();
    },
    resetInputs: function () {
      //this.active = this.active;
      this.addExercise.block = '';
      this.addExercise.week = '';
      this.addExercise.day = '';
      this.addExercise.name = '';
      this.addExercise.sets = '';
      this.addExercise.reps = '';
      this.addExercise.weight = '';
      this.addExercise.note = '';
    }
  }
});