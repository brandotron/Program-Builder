import Vue from 'vue';
import loadedProgram from './loaded-program.vue';
import Utilities from './utilities.js';

let testProgram = {
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

programBuilder = new Vue({  //TODO: remove 'window.' once proper vue event handling is set up
  el: '#program-builder',
  components: {
    'loaded-program': loadedProgram    
  },
  data: {
    programLoaded: true,
    //loading test program for now, will work on capability to deal with multiple programs later
    loadedProgram: testProgram, //{},
    programs: {},
    templates: {},
    undoStates: [],
    redoStates: [],
    emptyExercise: {
      id: 0,
      name: '',
      sets: '',
      reps: '',
      weight: '',
      note: ''//,
      //percentage: 0, //need "100%" value for this to be meaningful
      //percentIncrease: 0
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
    addObject: function () {
      let keys = arguments[0],
          targetArr,
          newObj;

      this.saveState();
      
      if (keys.exercise !== undefined) {
        return; //exercise has no child objects, but it might at some point
      } else if (keys.day !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days[keys.day].exercises;
        newObj = Utilities.deepExtend({}, this.emptyExercise);
      } else if (keys.week !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days;
        newObj = Utilities.deepExtend({}, this.emptyDay);
      } else if (keys.block !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks;
        newObj = Utilities.deepExtend({}, this.emptyWeek);
      } else { 
        targetArr = this.loadedProgram.blocks;
        newObj = Utilities.deepExtend({}, this.emptyBlock);
      }

      newObj.id = targetArr.length;

      targetArr.push(newObj);
    },
    copyObject: function () {
      let keys = arguments[0],
          targetArr,
          newObj;

      this.saveState();
      
      if (keys.exercise !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days[keys.day].exercises;
        newObj = Utilities.deepExtend({}, targetArr[keys.exercise]);
      } else if (keys.day !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks[keys.week].days;
        newObj = Utilities.deepExtend({}, targetArr[keys.day]);
      } else if (keys.week !== undefined) {
        targetArr = this.loadedProgram.blocks[keys.block].weeks;
        newObj = Utilities.deepExtend({}, targetArr[keys.week]);
      } else if (keys.block !== undefined) {
        targetArr = this.loadedProgram.blocks;
        newObj = Utilities.deepExtend({}, targetArr[keys.block]);
      } else { //TODO: no keys, this would be an error
        return;
      }

      newObj.id = targetArr.length;  // insert with 0 id after original and resequence array instead of adding to end?

      targetArr.push(newObj);
    },
    removeObject: function () {
      let keys = arguments[0],
          targetArr,
          objectIndex;

      this.saveState();
      
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
      } else { //TODO: no keys, this would be an error
        return;
      }

      targetArr.splice(objectIndex, 1);
      this.resequenceObject(keys);
    },
    resequenceObject: function (keys) {
      let parentObj,
          targetObj,
          newObj,
          targetId,
          parentArrKey,
          targetArrKey,
          newArr;

      this.saveState();
      
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
      } else { //TODO: no keys, this would be an error
        return;
      }

      targetId = targetObj.id;

      newObj = Utilities.deepExtend({}, targetObj);
      newArr = Utilities.resequenceItems(targetObj[targetArrKey]);

      newObj[targetArrKey] = newArr;

      parentObj[parentArrKey].splice(targetId, 1, newObj);
    },
    moveObject: function () {
      let keys = arguments[0],
          targetArr,
          currentId,
          newId,
          tempObjThis,
          tempObjSwap,
          newObjThis,
          newObjSwap;

      this.saveState();
      
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
      } else { //TODO: no keys, this would be an error
        return;
      }

      if ((keys.direction == 'up' && currentId == 0) || 
          (keys.direction == 'down' && currentId == targetArr.length - 1)) {
        return;
      }

      if (keys.direction == 'up') {
        newId = currentId - 1;
      } else if (keys.direction == 'down') {
        newId = currentId + 1;
      } else {
        return; //TODO: no direction, this would be an error
      }

      tempObjThis = Utilities.deepExtend({}, targetArr.slice(currentId, currentId + 1)[0]);
      tempObjSwap = Utilities.deepExtend({}, targetArr.slice(newId, newId + 1)[0]);

      tempObjThis.id = newId;
      tempObjSwap.id = currentId;

      targetArr.splice(currentId, 1, tempObjSwap);
      targetArr.splice(newId, 1, tempObjThis);
    },
    updateObject: function () {
      let keys = arguments[0],
          targetArr,
          currentId,
          updatedObj;

      this.saveState();

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
      } else { //TODO: no keys, this would be an error
        return;
      } 
      
      updatedObj = Utilities.deepExtend({}, keys.updatedObj);
    

      targetArr.splice(currentId, 1, updatedObj);
    },
    saveState: function () {
      var maxStates = 5,
          action = arguments[0] || '',
          targetArr;

      if (action == 'undo') {
        targetArr = this.redoStates;
      } else {
        targetArr = this.undoStates;
      }

      targetArr.push(Utilities.deepExtend({}, this.loadedProgram)); //encapsulate pgm state in obj with prop for action performed to display in drop-down?
      if (targetArr.length > maxStates) {
        targetArr.shift();
      }
    },
    loadState: function () {
      var action = arguments[0],
          sourceArr,
          state;

      if (action == 'undo') {
        sourceArr = this.undoStates;
      } else if (action == 'redo') {
        sourceArr = this.redoStates;
      }
      
      if (sourceArr[sourceArr.length - 1] !== undefined) {
        this.saveState(action);
        this.loadedProgram = Utilities.deepExtend({}, sourceArr.pop());
      }
    }
  }
});
