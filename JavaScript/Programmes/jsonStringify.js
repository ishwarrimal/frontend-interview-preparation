// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler
function isCyclic(input){
    const seen = new Set()
    function helper(value = input){
        if(typeof value !== "object" || value === null){
            return false
        } 
        seen.add(value)
        return Object.values(value).some((val) => seen.has(val) || helper(val))
    }
    return helper()
}

function jsonStringify(data){
    const typeofData = typeof data
    if(isCyclic(data)){
        throw new TypeError('Converting circular structure to JSON');
    }
    if (typeof value === 'bigint') {
        throw new TypeError('Do not know how to serialize a BigInt');
    }
    if(data === '' || data === undefined || typeofData === 'symbol' || typeofData === 'function'){
        return undefined
    }
    if(data === null || data === Infinity || data === -Infinity || data !== data){
        return 'null'
    }
    if(typeofData === "string"){
        return `"${data}"`
    }
    if(typeofData === "number"){
        return `'${data}'`
    }
    if(Array.isArray(data)){
        const res = data.map(d => jsonStringify(d))
        return `'[${res.join(',')}]'`
    }
    if(typeofData instanceof Date){
        return `${data.toISOString()}`
    }
    if(typeofData === "object"){
        const res = Object.entries(data).map(([key,val]) => {
            // console.log(key,val)
            if(val){
                const d = jsonStringify(val)
                return `"${key}":${d}`
            }
        }).filter(d => d !== undefined)
        return `'{${res.join(',')}}'`
    }
}

console.log(jsonStringify(() => {}))
