//Implementaition using function
(() => {
    const FLAG_DATA = {
        flag1: true,
        flag2: '123'
    }
    const CACHE = new Map()
    let promiseInstance = null;
    
    async function fetchFeatureFlag(){
        console.log('Api call')
        return new Promise((resolve, reject) => {
            setTimeout(resolve, 100, FLAG_DATA)
        })
    }
    function updateCache(fflist){
        Object.entries(fflist).forEach(([key,val]) => {
            CACHE.set(key,val)
        })
    }
    async function getFeatureState(key, defaultVal){
        if(promiseInstance instanceof Promise){
            const data = await promiseInstance
        }
        if(CACHE.size > 0){
            const result = CACHE.has(key) ? CACHE.get(key) : defaultVal
            return Promise.resolve(result)
        }
        promiseInstance =  fetchFeatureFlag().then(data => {
            updateCache(data)
            if(CACHE.has(key)){
                return CACHE.get(key)
            }else{
                return defaultVal
            }
        }).catch(e => {
            //TODO : add logger
            return defaultVal
        })
        return promiseInstance
    }
    getFeatureState('flag1', false).then(data => {
        console.log(data)
    }).catch(e => {
        return defaultVal
    })
    getFeatureState('flag3', false).then(data => {
        console.log(data)
    }).catch(e => {
        return defaultVal
    })
    setTimeout(() => {
         getFeatureState('flag2', false).then(data => {
            console.log(data)
        }).catch(e => {
            return defaultVal
        })
    }, 200)
})()

// Implementaion using class using singleton design pattern
const FLAG_DATA = {
    flag1: 'abc',
    flag2: '123'
}

const TTL = 500;
    
async function fetchFeatureFlag(){
    console.log('Api call')
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 100, FLAG_DATA)
    })
}


class FeatureFlag {
    constructor(){
        if(FeatureFlag.instance){
            return FeatureFlag.instance
        }
        this.cache = new Map()
        this.cacheExpiryTime = 0;
        this.promiseInstance = null;
        FeatureFlag.instance = this
    }
    async getFeatureFlag(key, defaultVal){
        if(this.promiseInstance instanceof Promise){
            await this.promiseInstance
            this.promiseInstance = null
        }
        if(this.cache.size > 0 && performance.now() < this.cacheExpiryTime){
            const result = this.cache.has(key) ? this.cache.get(key) : defaultVal
            return Promise.resolve(result)
        }
        this.promiseInstance = fetchFeatureFlag().then(data => {
            Object.entries(data).forEach(([key,val]) => {
                this.cache.set(key,val)
            })
            this.cacheExpiryTime = performance.now() + TTL
            return this.cache.has(key) ? this.cache.get(key) : defaultVal
        }).catch(e => {
            //TODO log error
            return defaultVal
        })
        return this.promiseInstance
    }
}


const featureFlag = new FeatureFlag()
const featureFlag1 = new FeatureFlag()
featureFlag.getFeatureFlag('flag1', false).then(data => {
    console.log(data)
})
featureFlag1.getFeatureFlag('flag1', false).then(data => {
    console.log(data)
})
featureFlag.getFeatureFlag('flag2', false).then(data => {
        console.log(data)
})
setTimeout(() => {
    featureFlag.getFeatureFlag('flag2', false).then(data => {
        console.log(data)
    })
},1000)
