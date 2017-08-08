class Utilities {
  static deepExtend(out) {
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
    var resequencedArr = []
    for (var i = 0, item; i < arr.length; i++) {
      item = this.deepExtend({}, arr[i]);
      item.id = i;

      resequencedArr.push(item);
    }

    return resequencedArr;
  }

};

export default Utilities;
