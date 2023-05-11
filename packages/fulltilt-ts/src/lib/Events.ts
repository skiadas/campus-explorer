////// Internal Event Handlers //////

import { Callback, RawEuler } from "./Rotation/Types";


type xyz = {
	x: number;
	y: number;
	z: number;
};

interface MotionData {
	acceleration: xyz;
	accelerationIncludingGravity: xyz;
	rotationRate: RawEuler;
}

interface Sensor<T> {
	active: boolean;
	// TODO: add status
	callbacks: Callback<T>[];
	data: T;
	start: () => void;
	stop: () => void;
}


// export function handleDeviceMotionChange(event) {
// 	sensors.motion.data = event;
// 	// Fire every callback function each time devicemotion is updated
// 	for (var i in sensors.motion.callbacks) {
// 		sensors.motion.callbacks[i].call(this);
// 	}
// }
