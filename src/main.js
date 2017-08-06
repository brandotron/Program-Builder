import Vue from 'vue';
import loadedProgram from './loaded-program.vue';
import Utilities from './utilities.js';

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

window.programBuilder = new Vue({  //TODO: remove 'window.' once proper vue event handling is set up
  el: '#program-builder',
  components: {
    'loaded-program': loadedProgram    
  },
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
      //percentage: 73, //need "100%" value for this to be meaningful
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
  methods: {
    addExerciseToDay: function () {
      var exerciseToPush = {
        id: this.newExercise.id,
        name: this.newExercise.name,
        sets: this.newExercise.sets,
        reps: this.newExercise.reps,
        weight: this.newExercise.weight, //calulate this based on percentage one we have "100%" values
        note: this.newExercise.note//,
        //percentage: 73,
        //percentIncrease: 3
      }
      var currentBlock = this.loadedProgram.blocks[this.newExercise.block];
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
    },
    removeObject: function () { //this is only firing from exercise row, but day seems to pass all the way to loaded program OK
      var keys = arguments[0],
          targetArr,
          objectIndex;
      if (keys.exercise !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days[keys.day].exercises;
        objectIndex = keys.exercise;
      } else if (keys.day !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days;
        objectIndex = keys.day;
      } else if (keys.week !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks;
        objectIndex = keys.week;
      } else if (keys.block !== undefined) {
        targetArr = this.loadedProgram.blocks;
        objectIndex = keys.block;
      } else { //TODO: This would be an error
        return;
      }

      targetArr.splice(objectIndex, 1);
      this.resequenceObject(keys);
    },
    resequenceObject: function (keys) {
      var parentObj,
          targetObj,
          newObj,
          targetId,
          parentArrKey,
          targetArrKey,
          newArr;

      if (keys.exercise !== undefined) {
        parentObj = this.loadedProgram.blocks[keys.block].weeks[keys.week];
        targetObj = parentObj.days[keys.day];
        parentArrKey = 'days';
        targetArrKey = 'exercises';
      } else if (keys.day !== undefined) {
        parentObj = this.loadedProgram.blocks[keys.block];
        targetObj = parentObj.weeks[keys.week];
        parentArrKey = 'weeks';
        targetArrKey = 'days';
      } else if (keys.week !== undefined) {
        parentObj = this.loadedProgram;
        targetObj = parentObj.blocks[keys.block];
        parentArrKey = 'blocks';
        targetArrKey = 'weeks';
      } else if (keys.block !== undefined) {
        parentObj = this;
        targetObj = this.loadedProgram;
        parentArrKey = 'loadedProgram';
        targetArrKey = 'blocks';
      } else { //TODO: This would be an error
        return;
      }

      targetId = targetObj.id;

      newObj = Utilities.deepExtend({}, targetObj);
      newArr = Utilities.resequenceItems(targetObj[targetArrKey]);

      newObj[targetArrKey] = newArr;

      parentObj[parentArrKey].splice(targetId, 1, newObj);
    },
    moveObject: function () {
      var keys = arguments[0],
          targetArr,//currentDay.exercises
          currentId,
          newId,
          tempObjThis,
          tempObjSwap,
          newObjThis,
          newObjSwap;

      if (keys.exercise !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days[keys.day].exercises;
        currentId = keys.exercise;
      } else if (keys.day !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days;
        currentId = keys.day;
      } else if (keys.week !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks;
        currentId = keys.week;
      } else if (keys.block !== undefined) {
        targetArr = this.loadedProgram.blocks;
        currentId = keys.block;
      } else { //TODO: This would be an error
        return;
      }

      if (keys.direction == 'up') {
        newId = currentId - 1;
      } else if (keys.direction == 'down') {
        newId = currentId + 1;
      } else {
        return; //TODO: this would be an error
      }

      tempObjThis = deepExtend({}, targetArr.slice(currentId, currentId + 1)[0]);
      tempObjSwap = deepExtend({}, targetArr.slice(newId, newId + 1)[0]);

      tempObjThis.id = newId;
      tempObjSwap.id = currentId;

      targetArr.splice(currentId, 1, tempObjSwap);
      targetArr.splice(newId, 1, tempObjThis);
    },
    updateObject: function () {
      var keys = arguments[0],
          targetArr,//currentDay.exercises
          currentId,
          updatedObj;

      if (keys.exercise !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days[keys.day].exercises;
        currentId = keys.exercise;
      } else if (keys.day !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days;
        currentId = keys.day;
      } else if (keys.week !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks;
        currentId = keys.week;
      } else if (keys.block !== undefined) {
        targetArr = this.loadedProgram.blocks;
        currentId = keys.block;
      } else { //TODO: This would be an error
        return;
      } 
      
      updatedObj = Utilities.deepExtend({}, keys.updatedObj);

      targetArr.splice(currentId, 1, updatedObj);
    }
  }
});
