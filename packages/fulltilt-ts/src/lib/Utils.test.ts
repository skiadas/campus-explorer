import { keepTrying, onlyOnce } from "./Utils";

describe("onlyOnce", () => {
	it("only calls its function if called itself", () => {
		const f = callTimesCounter();
		onlyOnce(f);
		expect(f.times()).toBe(0);
	});
	it("calls the function exactly once", () => {
		const f = callTimesCounter();
		const o = onlyOnce(f);
		o();
		o();
		expect(f.times()).toBe(1);
	});
	it("stores the return value from the first call", () => {
		const f = callTimesCounter();
		const o = onlyOnce(f);
		o();
		const v = o();
		expect(v).toBe(1);
	});
});

describe("keepTrying", () => {
	it("tries at most the specified of times", async () => {
		const f = callTimesCounter(false);
		try {
			await keepTrying(f, 10, 20);
		} catch (e) {
			expect(f.times()).toBe(10);
		}
	});
	it("stops trying on success", async () => {
		const f = callTimesCounter(false, false, true);
		try {
			await keepTrying(f, 10, 20);
		} catch (e) {
			expect(f.times()).toBe(3);
		}
	});
	it("tries at the specified interval", async () => {
		let lastTime = undefined;
		const f = () => {
			const newTime = Date.now();
			if (lastTime != undefined) {
        expect(newTime-lastTime).toBeLessThan(10);
			}
			lastTime = newTime;
			return true;
		};
		try {
			await keepTrying(f, 4, 100);
		} catch (e) {}
	});
  it('rejects the promise after enough failed tries', (done) => {
    keepTrying(() => false, 3, 10).then(() => {}).catch(_ => done());
  });
});

function callTimesCounter(...returnValues: any) {
	let times = 0;
	const f = () => {
		times += 1;
		return returnValues.length == 0
			? times
			: returnValues[Math.min(times - 1, returnValues.length)];
	};
	f.times = () => times;
	return f;
}
