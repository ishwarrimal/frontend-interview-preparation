// Fake timer
class FakeTimer{
    constructor(){
        this.currentTime = 0;
        this.timers = {}
        this.id = 1
    }
    fakeSetTimeout(cb, wait){
        const timerId = this.id++
        this.timers[timerId] = {callback: cb, delay: this.currentTime + wait}
        return timerId;
    }
    fakeClearTimeout(id){
        delete this.timers[id]
    }
    tick(ms){
        this.currentTime += ms;
        for(let [id, timer] of Object.entries(this.timers)){
            if(this.currentTime >= timer.delay){
                timer.callback()
                this.fakeClearTimeout(id)
            }else{
                console.log(`In the queue : ${id}`)
            }
        }
    }
}

const fakeTimer = new FakeTimer();

// Example usage
const timerId = fakeTimer.fakeSetTimeout(() => {
  console.log('Executed after 100ms');
}, 200);

// Simulate the passage of time
fakeTimer.tick(50);  // Nothing should happen
fakeTimer.tick(50);  // Nothing should happen
fakeTimer.tick(50);  // Nothing should happen
fakeTimer.tick(50);  // Now it should execute the callback
