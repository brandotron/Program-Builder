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
              exercises: [
                {
                  id: 0,
                  name: 'snatch',
                  sets: 3,
                  reps: 3,
                  weight: '73%',
                  note: ''
                  //percentage: 73,
                  //percentIncrease: 3
                },
                {
                  id: 1,
                  name: 'clean + jerk',
                  sets: 2,
                  reps: '1 + 2',
                  weight: '72%',
                  note: ''
                },
                {
                  id: 2,
                  name: 'squat',
                  sets: 5,
                  reps: 5,
                  weight: '75%',
                  note: ''
                },
                {
                  id: 3,
                  name: 'press',
                  sets: 4,
                  reps: 6,
                  weight: 'X',
                  note: '1-2 reps left in the tank'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

var deepExtend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj) {
      continue;
    }

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (Array.isArray(obj[key])) {
          out[key] = obj[key].slice(0);
          var nestedObj = out[key]
          for (var nestedKey in nestedObj) {
            nestedObj[nestedKey] = deepExtend({}, obj[key][nestedKey]);
          }
        } else if (typeof obj[key] === 'object') {
          out[key] = deepExtend(out[key], obj[key]);
        } else {
          out[key] = obj[key];
        }
      }
    }
  }

  return out;
};

var resequenceItems = function (arr) {
  var resequencedArr = []
  for (var i = 0, item; i < arr.length; i++) {
    item = deepExtend({}, arr[i]);
    item.id = i;

    resequencedArr.push(item);
  }

  return resequencedArr;
};

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
    '<div class="program-block">' +
      '<div class="block-title">Block {{ block.id + 1 }}</div>' +
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
    '<div class="program-week">' +
      '<div class="week-title">Week {{ week.id + 1 }}</div>' +
      '<program-day ' +
        'v-for="item in week.days"' +
        'v-bind:day="item"' +
        'v-bind:key="item.id"' +
        'v-bind:num_days="week.days.length"' +
      '></program-day>' +
      '<button v-on:click="addNewDay" v-if="week.days.length < 7">Add New Day</button>' +
      '<button v-on:click="removeWeek">Remove Week</button>' +
      '<button v-on:click="copyWeek">Copy Week</button>' +
      '<button v-on:click="moveWeek(\'up\')" class="week-move-up-btn">^</button>' + 
      '<button v-on:click="moveWeek(\'down\')" class="week-move-down-btn">v</button>' + 
    '</div>',
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
});
Vue.component('program-day', {
  props: ['day', 'num_days'],
  template: 
    '<div class="program-day">' + 
      '<div class="day-title">Day {{ day.id + 1 }}</div>' +
      '<table class="day-table" v-if="day.exercises.length > 0">' +
        '<thead class="day-head">' +
          '<tr class="day-column-head-row">' +
            '<th class="day-column-head"></th>' +
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
            'v-bind:edits_active="editsActive"' +
          '></exercise-row>' +
        '</tbody>' +
      '</table>' + 
      '<button v-on:click="openAddExercisePanel">Add Exercise</button>' +
      '<button v-on:click="removeDay">Remove Day</button>' +
      '<button v-on:click="copyDay"' +
        'v-if="num_days < 7"' +
      '>Copy Day</button>' +
      '<button v-on:click="moveDay(\'up\')" class="day-move-up-btn">^</button>' + 
      '<button v-on:click="moveDay(\'down\')" class="days-move-down-btn">v</button>' + 
    '</div>',
  data: function () {
    return {
      editsActive: false
    }
  },
  methods: {
    getCurrentBlock: function () {
      return programBuilder.loadedProgram.blocks[this.$parent.$parent.block.id];
    },
    getCurrentWeek: function () {
      return this.getCurrentBlock().weeks[this.$parent.week.id];
    },
    openAddExercisePanel: function () {
      programBuilder.newExercise.day = this.day.id;
      programBuilder.newExercise.week = this.$parent.week.id;
      programBuilder.newExercise.block = this.$parent.$parent.block.id;
      programBuilder.newExercise.id = this.day.exercises.length;
      programBuilder.newExercise.mode = 'add';
      programBuilder.newExercise.active = true;
    },
    removeDay: function () {
      var currentWeek = this.getCurrentWeek();

      currentWeek.days.splice(this.day.id, 1);

      this.resequenceDays();
    },
    resequenceDays: function () {
      var currentBlock = this.getCurrentBlock(),
          currentWeek = this.getCurrentWeek(),
          resequencedDays,
          resequencedWeek;

      resequencedWeek = deepExtend({}, currentWeek);
      resequencedDays = resequenceItems(currentWeek.days);

      resequencedWeek.days = resequencedDays;

      currentBlock.weeks.splice(this.$parent.week.id, 1, resequencedWeek);
    },
    copyDay: function () {
      var currentWeek = this.getCurrentWeek(),
          newDayObj;

      newDayObj = deepExtend({}, currentWeek.days.slice(this.day.id, this.day.id + 1)[0]);
      newDayObj.id = currentWeek.days.length; 

      currentWeek.days.push(newDayObj);
    },
    moveDay: function (direction) {
      var currentWeek = this.getCurrentWeek(),
          currentId,
          newId,
          tempObjThis,
          tempObjSwap,
          newObjThis,
          newObjSwap;

      if (direction == 'up') {
        currentId = this.day.id;
        newId = this.day.id - 1;
      } else if (direction == 'down') {
        currentId = this.day.id;
        newId = this.day.id + 1;
      } else {
        return; //TODO: this would be an error
      }

      tempObjThis = deepExtend({}, currentWeek.days.slice(currentId, currentId + 1)[0]);
      tempObjSwap = deepExtend({}, currentWeek.days.slice(newId, newId + 1)[0]);

      tempObjThis.id = newId;
      tempObjSwap.id = this.day.id;

      currentWeek.days.splice(currentId, 1, tempObjSwap);
      currentWeek.days.splice(newId, 1, tempObjThis);
    }
  }
});
Vue.component('exercise-row', {
  props: ['exercise', 'edits_active'],
  template: 
    '<tr class="ex-row" v-if="!editMode">' +
      '<td class="ex-cell" v-if="!edits_active">' +
        '<button v-on:click="move(\'up\')" class="ex-move-up-btn">^</button>' + 
        '<button v-on:click="move(\'down\')" class="ex-move-down-btn">v</button>' + 
      '</td>' +
      '<td class="ex-cell" v-else>' +
        '<button disabled class="ex-move-up-btn">^</button>' + 
        '<button disabled class="ex-move-down-btn">v</button>' + 
      '</td>' +
      '<td class="ex-cell">{{ exercise.name }}</td>' +
      '<td class="ex-cell">{{ exercise.sets }}</td>' +
      '<td class="ex-cell">{{ exercise.reps }}</td>' +
      '<td class="ex-cell">{{ exercise.weight }}</td>' +
      '<td class="ex-cell">{{ exercise.note }}</td>' +
      '<td class="ex-cell">' + 
        '<button v-on:click="activateEditMode">Edit</button>' +
        '<button v-on:click="removeExercise" v-if="!edits_active">X</button>' +
        '<button disabled v-else>X</button>' +
      '</td>' +
    '</tr>' +
    '<tr class="ex-row" v-else>' +
      '<td class="ex-cell" nowrap="nowrap">' +
        '<button disabled class="ex-move-up-btn">^</button>' + 
        '<button disabled class="ex-move-down-btn">v</button>' + 
      '</td>' +
      '<td class="ex-cell">' +
        '<input type="text" size="8" class="ex-name-input" v-model="updatedExercise.name"/>' +
      '</td>' +
      '<td class="ex-cell">' +
        '<input type="text" size="1" class="ex-sets-input" v-model="updatedExercise.sets"/>' +
      '</td>' +
      '<td class="ex-cell">' +
        '<input type="text" size="2" class="ex-reps-input" v-model="updatedExercise.reps"/>' +
      '</td>' +
      '<td class="ex-cell">' +
        '<input type="text" size="4" class="ex-weight-input" v-model="updatedExercise.weight"/>' +
      '</td>' +
      '<td class="ex-cell">' +
        '<input type="text" size="20" class="ex-note-input" v-model="updatedExercise.note"/>' +
      '</td>' +
      '<td class="ex-cell" nowrap="nowrap">' + 
        '<button v-on:click="updateExercise">Save</button>' +
        '<button v-on:click="cancelUpdate">X</button>' +
      '</td>' +
    '</tr>',
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
});                
var programBuilder = new Vue({
  el: '#program-builder',
  data: {
    programLoaded: true,
    //loading test program for now, will work on capability to deal with multiple programs later
    loadedProgram: testProgram, //{},
    allPrograms: {},
    templates: {},
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
      note: ''//,
      //percentage: 73,
      //percentIncrease: 3
    },
    emptyDay: {
      id: 0,
      exercises: []
    },
    emptyWeek: {
      id: 0,
      days: []
    },
    emptyBlock: {
      id: 0,
      name: '',
      weeks: []
    },
    emptyProgram: {
      id: 0,
      name: '',
      athlete: '',
      startingDate: '',
      blocks: []
    }
  },
  methods: { //rename these functions for new scope (may have more than 1 "panel" to close, etc.)
    addExerciseToDay: function () {
      var exerciseToPush = {
        id: this.newExercise.id,
        name: this.newExercise.name,
        sets: this.newExercise.sets,
        reps: this.newExercise.reps,
        weight: this.newExercise.weight, //calulate this based on percentage
        note: this.newExercise.note//,
        //percentage: 73,
        //percentIncrease: 3
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
        note: this.newExercise.note//,
        //percentage: ,
        //percentIncrease: 
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