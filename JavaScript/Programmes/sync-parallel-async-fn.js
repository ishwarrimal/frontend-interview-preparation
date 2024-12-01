// For sequence of async tasks
function sequence(asyncFunctionList){
    //TODO:  what happens when asyncFunctionList is empty or has non compliant types?
    return function(callback, input){
        function helper(data = input){
            if(0 === asyncFunctionList.length){
                callback(null, data)
                return;
            }
            const fn = asyncFunctionList.shift()
            fn((err,idata) => {
                if(err){
                    callback(err, undefined)
                    return;
                }
                helper(idata)
            },data)
        }
        helper()
    }
}

const asyncTimes2 = (callback, num) => {
   setTimeout(() => callback(null, num * 2), 100)
}

const asyncTimes4 = sequence(
  [
    asyncTimes2,
    asyncTimes2
  ]
)
asyncTimes4((error, data) => {
   console.log(data) // 4
}, 2)


//For parallel of async tasks
function parallel(funcs){
  let hasError = false, funcIndex = 0, result = [];
  
  return function(finalCallback, input) {
    funcs.forEach((func, idx) => {
      func((err, cbData) => {
        if (hasError) {
          return;
        }
        if (err) {
          hasError = true;
          finalCallback(err, undefined);
          return;
        }
        result[idx] = cbData;
        funcIndex++;
        if (funcIndex === funcs.length) {
          finalCallback(undefined, result)
        }
      })
    })
  }
}

function parallenUsingPromise(list){
    let err;
    return function(callback, input){
        Promise.all(list.map(fn => {
            return new Promise((res,rej) => {
                fn((err,data) => err ? rej(err) : res(data), input)
            })
        }))
        .then(op => callback(null, op))
        .catch(err => callback(err, null))
    }
}

const async1 = (callback) => {
   callback(undefined, 1)
}
const async2 = (callback) => {
   callback(undefined, 2)
}
const async3 = (callback) => {
   callback(undefined, 3)
}
const all = parallel(
  [
    async1,
    async2,
    async3
  ]
)
all((error, data) => {
   console.log(data) // [1, 2, 3]
}, 1)
