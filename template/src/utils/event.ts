class Event {
	private events: { [key: string]: Function[] } = {};

	on(event: string, cb: Function) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(cb);
	}

	once(event: string, cb: Function) {
		const fn = (...args: any) => {
			cb(...args);
			this.off(event, fn);
		};
		this.on(event, fn);
	}

	off(event: string, cb: Function) {
		if (!this.events[event]) {
			return;
		}
		this.events[event] = this.events[event].filter((fn) => fn !== cb);
	}

	offAll(event: string) {
		if (!this.events[event]) {
			return;
		}
		this.events[event] = [];
	}

	destroy() {
		this.events = {};
	}

	emit(event: string, ...args: any) {
		if (!this.events[event]) {
			return;
		}
		this.events[event].forEach((fn) => fn(...args));
	}
}

export default new Event();
