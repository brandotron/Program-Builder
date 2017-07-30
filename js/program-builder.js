Vue.component('program-day', {
  props: ['day'],
  template: '<div class="program-day">' + 
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
                  '<program-exercise-row v-for="item in day" v-bind:exercise="item"></program-exercise-row>' +
                '</tbody>' +
              '</table>' + 
              '<button v-on:click="openAddExercisePanel">Add Exercise</button>' +
            '</div>',
  methods: {
    openAddExercisePanel: function () {
      addExercisePanel.active = true;
    }
  }
});
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
// Vue.component('', {
//   props: ['exercise'],
//   template: '<div class="add-exercise-input-panel" v-if="active == true">' +
//               '<input type="text" v-model="name" placeholder="name" />' +
//               '<input type="text" v-model="sets" placeholder="sets" />' +
//               '<input type="text" v-model="reps" placeholder="reps" />' +
//               '<input type="text" v-model="weight" placeholder="weight" />' +
//               '<input type="text" v-model="note" placeholder="note" />' +
//               '<button v-on:click="addExerciseToDay">Add</button>' +
//               '<button v-on:click="closePanel">Close</button>' +
//           '</div>'
// });          
var programDisplay = new Vue({
  el: '#program-display',
  data: {
    week: [
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
    active: false,
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
      programDisplay.week[0].push(exerciseToPush);
      this.resetInputs();
    },
    closePanel: function () {
      this.active = false;
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