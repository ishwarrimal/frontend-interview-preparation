//Asked in atlassian
class SDK{
    constructor(delay=1000){
       this.queue = []
       this.count = 1;
       this.delay = delay;
    }
    logEvent = (ev) => {
        this.queue.push(ev)
    }
    wait = () => new Promise((resolve,reject) => {
        setTimeout(() => {
            if(this.count % 5 === 0){
                reject()
            }else{
                resolve()
            }
        }, this.delay)
    })
    send = async function() {
        if(this.queue.length === 0){
            return
        }
        const curEvent = this.queue.shift()
        try{
            await this.wait();
            console.log(`Analytics sent ${curEvent}`)
            this.count++;
        }catch(e){
            console.log("-----------------------");
            console.log("Failed to send " + curEvent);
            console.log("Retrying sending " + curEvent);
            console.log("-----------------------");
            this.count = 1;
            this.queue.unshift(curEvent)
        }finally {
            this.send()
        }
    }
    
}

const sdk = new SDK();

sdk.logEvent("event 1");
sdk.logEvent("event 2");
sdk.logEvent("event 3");
sdk.logEvent("event 4");
sdk.logEvent("event 5");
sdk.logEvent("event 6");
sdk.logEvent("event 7");
sdk.logEvent("event 8");
sdk.logEvent("event 9");
sdk.logEvent("event 10");

sdk.send();
