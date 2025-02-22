class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  async lock(callback) {
    const unlock = () => {
      if (this.queue.length > 0) {
        this.queue.shift()();
      } else{
        this.locked = false;
      }
    };

    if (this.locked) {
      return await new Promise(resolve => this.queue.push(async () => {
        await callback()
        unlock()
        resolve();
      }));
    } else {
      this.locked = true;
      await callback()
      unlock()
      return Promise.resolve();
    }
  }
}

export { Mutex }