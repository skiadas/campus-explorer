///// FULLTILT API Root Object /////
import orientation from "./orientation";
import * as utils from "./Utils";
import { DeviceMotion } from "./DeviceMotion";
import DeviceOrientation from "./DeviceOrientation";
import { SensorCheck } from "./Utils";

const FULLTILT = {
	version: "0.5.3",
	// getDeviceOrientation: function (options) {
	// 	const promise = new Promise(function (resolve, reject) {
	// 		const control = new DeviceOrientation(options);
	// 		control.start();
	// 		const orientationSensorCheck = SensorCheck(sensors.orientation);

	// 		orientationSensorCheck
	// 			.then(function () {
	// 				resolve(control);
	// 			})
	// 			.catch(function () {
	// 				control.stop();
	// 				reject("DeviceOrientation is not supported");
	// 			});
	// 	});
	// 	return promise;
	// },
	// getDeviceMotion: function (options) {
	// 	const promise = new Promise(function (resolve, reject) {
	// 		const control = new DeviceMotion(options);
	// 		control.start();
	// 		const motionSensorCheck = SensorCheck(sensors.motion);
	// 		motionSensorCheck
	// 			.then(function () {
	// 				resolve(control);
	// 			})
	// 			.catch(function () {
	// 				control.stop();
	// 				reject("DeviceMotion is not supported");
	// 			});
	// 	});
	// 	return promise;
	// },
	orientation: orientation,
	utils: utils
};

export default FULLTILT;
