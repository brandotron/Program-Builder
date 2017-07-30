Vue.component('program-exercise-row', {
  props: ['exercise'],
  template: '<tr class="day-exercise-row">' +
              '<td class="day-exercise-cell">{{ exercise.name }}</td>' +
              '<td class="day-exercise-cell">{{ exercise.sets }}</td>' +
              '<td class="day-exercise-cell">{{ exercise.reps }}</td>' +
              '<td class="day-exercise-cell">{{ exercise.weight }}</td>' +
              '<td class="day-exercise-cell">{{ exercise.note }}</td>' +
            '</tr>'
});
Vue.component('program-day-table', {
  props: ['day'],
  template: '<table class="day-table">' +
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
                '<program-exercise-row v-for="item in day" v-bind:exercise="item"></program-exercise-row>' +
              '</tbody>' +
            '</table>'
});
var programDisplay = new Vue({
  el: '#program-display',
  data: {
    program: [
      [
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
    ]
  }
});
var addExercisePanel = new Vue({
  el: '#add-exercise-panel',
  data: {
    program: '',
    block: '',
    week: '',
    day: '',
    name: '',
    sets: '',
    reps: '',
    weight: '',
    note: ''
  },
  methods: {
    addExerciseToDay: function () {
      var exerciseToPush = {
        name: this.name,
        sets: this.sets,
        reps: this.reps,
        weight: this.weight,
        note: this.note
      }
      programDisplay.program[0].push(exerciseToPush);
      this.resetInputs();
    },
    resetInputs: function () {
      this.program = '';
      this.block = '';
      this.week = '';
      this.day = '';
      this.name = '';
      this.sets = '';
      this.reps = '';
      this.weight = '';
      this.note = '';
    }
  }
});