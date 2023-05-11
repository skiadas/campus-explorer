import {
	SCREEN_ROTATION_90,
	SCREEN_ROTATION_180,
	SCREEN_ROTATION_270,
	SCREEN_ROTATION_MINUS_90,
	screenActive,
} from "./WindowConstants";

// import {
// 	sensors,
// 	handleDeviceMotionChange,
// 	registerForScreenOrientationChange,
// } from "./Events";

interface p3d {
	x: number;
	y: number;
	z: number;
}

interface rotEuler {
	alpha: number;
	beta: number;
	gamma: number;
}

export class DeviceMotion {
	options: any;
	constructor(options) {
		// placeholder object since no options are currently supported
		this.options = options || {};
	}
	start(callback?: () => void) {
		if (
			callback &&
			Object.prototype.toString.call(callback) == "[object Function]"
		) {
			// sensors.motion.callbacks.push(callback);
		}
		if (!screenActive) {
			// registerForScreenOrientationChange();
		}
		// if (!sensors.motion.active) {
		// 	window.addEventListener("devicemotion", handleDeviceMotionChange, false);
		// 	sensors.motion.active = true;
		// }
	}

	stop() {
		// if (sensors.motion.active) {
		// 	window.removeEventListener(
		// 		"devicemotion",
		// 		handleDeviceMotionChange,
		// 		false
		// 	);
		// 	sensors.motion.active = false;
		// }
	}

	listen(callback) {
		this.start(callback);
	}

	// getScreenAdjustedAcceleration(): p3d {
	// 	var accData =
	// 		sensors.motion.data && sensors.motion.data.acceleration
	// 			? sensors.motion.data.acceleration
	// 			: { x: 0, y: 0, z: 0 };
	// 	var screenAccData = { x: 0, y: 0, z: 0 };

	// 	switch (screenOrientation.angle) {
	// 		case SCREEN_ROTATION_90:
	// 			screenAccData.x = -accData.y;
	// 			screenAccData.y = accData.x;
	// 			break;
	// 		case SCREEN_ROTATION_180:
	// 			screenAccData.x = -accData.x;
	// 			screenAccData.y = -accData.y;
	// 			break;
	// 		case SCREEN_ROTATION_270:
	// 		case SCREEN_ROTATION_MINUS_90:
	// 			screenAccData.x = accData.y;
	// 			screenAccData.y = -accData.x;
	// 			break;
	// 		default: // SCREEN_ROTATION_0
	// 			screenAccData.x = accData.x;
	// 			screenAccData.y = accData.y;
	// 			break;
	// 	}
	// 	screenAccData.z = accData.z;

	// 	return screenAccData;
	// }

	// getScreenAdjustedAccelerationIncludingGravity(): p3d {
	// 	const accGData =
	// 		sensors.motion.data && sensors.motion.data.accelerationIncludingGravity
	// 			? sensors.motion.data.accelerationIncludingGravity
	// 			: { x: 0, y: 0, z: 0 };
	// 	const screenAccGData = { x: 0, y: 0, z: 0 };

	// 	switch (screenOrientation.angle) {
	// 		case SCREEN_ROTATION_90:
	// 			screenAccGData.x = -accGData.y;
	// 			screenAccGData.y = accGData.x;
	// 			break;
	// 		case SCREEN_ROTATION_180:
	// 			screenAccGData.x = -accGData.x;
	// 			screenAccGData.y = -accGData.y;
	// 			break;
	// 		case SCREEN_ROTATION_270:
	// 		case SCREEN_ROTATION_MINUS_90:
	// 			screenAccGData.x = accGData.y;
	// 			screenAccGData.y = -accGData.x;
	// 			break;
	// 		default: // SCREEN_ROTATION_0
	// 			screenAccGData.x = accGData.x;
	// 			screenAccGData.y = accGData.y;
	// 			break;
	// 	}
	// 	screenAccGData.z = accGData.z;
	// 	return screenAccGData;
	// }

	// getScreenAdjustedRotationRate() {
	// 	const rotRateData =
	// 		sensors.motion.data && sensors.motion.data.rotationRate
	// 			? sensors.motion.data.rotationRate
	// 			: { alpha: 0, beta: 0, gamma: 0 };
	// 	const screenRotRateData: rotEuler = { alpha: 0, beta: 0, gamma: 0 };

	// 	switch (screenOrientation.angle) {
	// 		case SCREEN_ROTATION_90:
	// 			screenRotRateData.beta = -rotRateData.gamma;
	// 			screenRotRateData.gamma = rotRateData.beta;
	// 			break;
	// 		case SCREEN_ROTATION_180:
	// 			screenRotRateData.beta = -rotRateData.beta;
	// 			screenRotRateData.gamma = -rotRateData.gamma;
	// 			break;
	// 		case SCREEN_ROTATION_270:
	// 		case SCREEN_ROTATION_MINUS_90:
	// 			screenRotRateData.beta = rotRateData.gamma;
	// 			screenRotRateData.gamma = -rotRateData.beta;
	// 			break;
	// 		default: // SCREEN_ROTATION_0
	// 			screenRotRateData.beta = rotRateData.beta;
	// 			screenRotRateData.gamma = rotRateData.gamma;
	// 			break;
	// 	}
	// 	screenRotRateData.alpha = rotRateData.alpha;

	// 	return screenRotRateData;
	// }

	// getLastRawEventData() {
	// 	return sensors.motion.data || {};
	// }
}
