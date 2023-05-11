import { Callback, RawEuler } from "./Rotation/Types";
import { keepTrying, throttle, isIOS } from "./Utils";
import { degToRad } from "./Math";
import Euler, { eulerFromAngleObject } from "./Rotation/Euler";
import { radians } from "./Rotation/Angle";

enum Status {
	Inactive,
	Pending,
	Active,
}
let status: Status = Status.Inactive;
let initialTries = 10;

// - webkitHeading is the true direction (clockwise from true north) that the
// device is facing (in whatever its main orientation is)
// - initialAngle is the angle in a clockwise direction that
// the device has been rotated from its main orientation
// - relative.alpha is the relative change in the direction of the main orientation
// compared to what it was when the device started reporting
// - angle is the angle in a clockwise direction that the current device's current
// orientation differs from its normal orientation
//
// We want "screen" to correspond to the true direction that
// the screen "points to". This may or may not agree with the
// "device" direction, depending on whether the device has been turned
// sideways

// Rotation needed to account for device offset
// relative to real world
function getAlphaOffsetDevice() {
	return new Euler(data.webkitHeading, 0, 0);
}

function getAlphaOffsetScreen() {
	return getAlphaOffsetDevice().rotateZ(radians(-data.initialAngle));
}

export interface OrientationData {
	angle: number; // current screen rotation angle
	webkitHeading: number; // Initial webkitHeading if provided
	initialAngle: number; // Initial screen rotation angle
	initial: RawEuler;
	absolute: RawEuler;
	relative: RawEuler;
	screen: RawEuler;
}

export const data: OrientationData = {
	angle: undefined,
	webkitHeading: undefined,
	initialAngle: undefined,
	initial: { alpha: undefined, beta: undefined, gamma: undefined },
	absolute: { alpha: undefined, beta: undefined, gamma: undefined },
	relative: { alpha: undefined, beta: undefined, gamma: undefined },
	get screen() {
		return getScreenEuler();
	},
};

function getScreenEuler() {
	const { alpha, beta, gamma } = data.relative;
	const adjustedAlpha =
		alpha - getAlphaOffsetDevice().rotateZ(radians(-data.angle)).alpha;
	return eulerFromAngleObject({ alpha: adjustedAlpha, beta, gamma });
}

// Internal screen orientation variables
const callbacks: Callback<OrientationData>[] = [];
export const hasScreenOrientationAPI = () =>
	window &&
	window.screen &&
	window.screen.orientation &&
	window.screen.orientation.angle !== undefined &&
	window.screen.orientation.angle !== null
		? true
		: false;

// Must be attached to an action triggered by user action
// e.g. button
// Returns a promise that will be fulfilled when the system
// is ready for use
export async function activate() {
	if (!window.DeviceOrientationEvent)
		throw new Error("Cannot use device orientation");
	if ("requestPermission" in window.DeviceOrientationEvent) {
		const permission = await (
			window.DeviceOrientationEvent as any
		).requestPermission();
		if (permission != "granted") throw new Error("No permission granted");
	}
	start();
	await keepTrying(() => status == Status.Active, 20);
	return { listen, data };
}

export function listen(callback: (data: OrientationData) => void) {
	callbacks.push(callback);
}

export function stopListening(callback: (data: OrientationData) => void) {
	const i = callbacks.indexOf(callback);
	if (i > -1) {
		callbacks.splice(i, 1);
	}
}

export function start() {
	if (status == Status.Inactive) {
		console.log("starting");
		window.addEventListener("deviceorientation", handleChange, false);
		window.addEventListener("deviceorientationabsolute", handleChange, false);
		registerForScreenOrientationChange();
		status = Status.Pending;
	}
}

export function stop() {
	if (status != Status.Inactive) {
		window.removeEventListener("deviceorientation", handleChange, false);
		window.removeEventListener(
			"deviceorientationabsolute",
			handleChange,
			false
		);

		status = Status.Inactive;
	}
}

const callCallbacks = throttle(
	() => {
		const dataCopy = cloneData(data);
		for (const c of callbacks) {
			c.call(null, dataCopy);
		}
	},
	250,
	null
);

function handleChange(event) {
	const { absolute, alpha, beta, gamma } = event;
	if (absolute) {
		data.absolute = { alpha, beta, gamma };
	} else {
		data.relative = { alpha, beta, gamma };
		if (initialTries > 0) {
			data.initial = { alpha, beta, gamma };
			initialTries -= 1;
			const { webkitCompassAccuracy, webkitCompassHeading } = event;
			if (
				webkitCompassAccuracy != null &&
				webkitCompassAccuracy > 0 &&
				webkitCompassAccuracy < 50
			) {
				data.webkitHeading = webkitCompassHeading;
			}
			data.initialAngle = getScreenOrientationAngle();
			data.angle = data.initialAngle;
		} else {
			status = Status.Active;
		}
	}
	// Fire every callback function each time deviceorientation is updated
	// TODO: Should throttle
	callCallbacks();
}

function getScreenOrientationAngle() {
	const angle = hasScreenOrientationAPI()
		? window.screen.orientation.angle
		: window.orientation;
	const iOSAdjust = isIOS() ? -1 : 1;
	return (angle || 0) * iOSAdjust * degToRad;
}

export function registerForScreenOrientationChange() {
	if (hasScreenOrientationAPI()) {
		console.log("Using screen orientation API");
		window.screen.orientation.addEventListener(
			"change",
			() => {
				data.angle = getScreenOrientationAngle();
			},
			false
		);
	} else {
		console.log("Using old screen orientation API");
		window.addEventListener(
			"orientationchange",
			() => {
				data.angle = getScreenOrientationAngle();
			},
			false
		);
	}
}

export default {
	activate,
	data,
	start,
	stop,
	listen,
	stopListening,
	registerForScreenOrientationChange,
};
function cloneData(data: OrientationData): OrientationData {
	const { angle, webkitHeading, initialAngle, initial, absolute, relative } =
		data;
	return {
		angle,
		webkitHeading,
		initialAngle,
		initial: cloneAngle(initial),
		absolute: cloneAngle(absolute),
		relative: cloneAngle(relative),
		get screen() {
			return getScreenEuler();
		},
	};
}

function cloneAngle({ alpha, beta, gamma }) {
	return { alpha, beta, gamma };
}
