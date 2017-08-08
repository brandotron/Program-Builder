class Utilities {
  static deepExtend(out) {
    out = out || {};

    for (let i = 1; i < arguments.length; i++) {
      let obj = arguments[i];

      if (!obj) {
        continue;
      }

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (Array.isArray(obj[key])) {
            out[key] = obj[key].slice(0);
            let nestedObj = out[key]
            for (let nestedKey in nestedObj) {
              nestedObj[nestedKey] = this.deepExtend({}, obj[key][nestedKey]);
            }
          } else if (typeof obj[key] === 'object') {
            out[key] = this.deepExtend(out[key], obj[key]);
          } else {
            out[key] = obj[key];
          }
        }
      }
    }

    return out;
  }

  static resequenceItems(arr) {
    let resequencedArr = []
    for (let i = 0, item; i < arr.length; i++) {
      item = this.deepExtend({}, arr[i]);
      item.id = i;

      resequencedArr.push(item);
    }

    return resequencedArr;
  }

};

export default Utilities;
