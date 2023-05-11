// Math.sign polyfill
export function sign(x) {
	x = +x; // convert to a number
	if (x === 0 || isNaN(x)) return x;
	return x > 0 ? 1 : -1;
}

export function onlyOnce<T>(f: () => T): () => T {
	let evaluated = false;
	let value = undefined;
	return () => {
		if (!evaluated) {
			value = f();
			evaluated = true;
		}
		return value;
	};
}

///// Promise-based Sensor Data checker //////

// TODO: Understand what this does
export function SensorCheck(sensorRootObj): Promise<void> {
	const promise = new Promise<void>(function (resolve, reject) {
		const runCheck = function (tries) {
			setTimeout(function () {
				if (sensorRootObj && sensorRootObj.data) {
					resolve();
				} else if (tries >= 20) {
					reject();
				} else {
					runCheck(++tries);
				}
			}, 50);
		};
		runCheck(0);
	});

	return promise;
}

export function keepTrying(
	tester: () => boolean,
	maxTries: number,
	millis: number = 500
) {
	// Must keep trying on an interval
	return new Promise<void>((resolve, reject) => {
		let h = setInterval(() => {
			maxTries -= 1;
			if (maxTries <= 0) {
				clearInterval(h);
				reject("Exceeded number of tries");
			}
			if (tester()) {
				clearInterval(h);
				resolve();
			}
		}, millis);
	});
}

export function throttle(
	fn: () => void,
	threshold: number,
	scope: any
): () => void {
	let last: any;
	let deferTimer: any;
	let context = scope || null;

	return function () {
		const now = +new Date();
		const args = arguments;
		const remaining = last ? last + threshold - now : 0;
		const apply = () => {
			last = now;
			fn.apply(context, args);
		};
		if (remaining > 0) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(apply, remaining);
		} else {
			apply();
		}
	};
}

// I really wish I didn't have to resort to this
// kind of test, but screen orientation values are reversed
// in iOS, with a clockwise rotation of 90 degrees corresponding
// to the value of -90. On the other hand the android/MDN/w3c
// convention is the opposite. Feature detection would not work here
// as the feature is implemented inconsistently.
// https://developer.apple.com/documentation/webkitjs/domwindow/1632568-orientation
// https://w3c.github.io/screen-orientation/#the-current-screen-orientation-type-and-angle
export const isIOS = onlyOnce(() => {
	return (
		[
			"iPad Simulator",
			"iPhone Simulator",
			"iPod Simulator",
			"iPad",
			"iPhone",
			"iPod",
		].includes(navigator.platform) ||
		// iPad on iOS 13 detection
		(navigator.userAgent.includes("Mac") && "ontouchend" in document)
	);
});
