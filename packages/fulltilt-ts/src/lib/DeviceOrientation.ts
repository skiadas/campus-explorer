import { radians } from "./Rotation/Angle";
import Euler, { eulerFromAngleObject } from "./Rotation/Euler";
import { Quaternion } from "./Rotation/Types";
import * as orientation from "./orientation";

export default class DeviceOrientation {
	options: any;
	alphaOffsetScreen: number;
	alphaOffsetDevice: Euler;

	constructor(options) {
		this.options = options || {}; // by default use UA deviceorientation 'type' ("game" on iOS, "world" on Android)
		this.alphaOffsetScreen = 0;
		this.alphaOffsetDevice = undefined;

		let tries = 0;
		let successCount = 0;
		const maxTries = 200;
		const successThreshold = 10;

		// Create a game-based deviceorientation object (initial alpha === 0 degrees)
		if (this.options.type === "game") {
			const setGameAlphaOffset = function (evt) {
				if (evt.alpha !== null) {
					// do regardless of whether 'evt.absolute' is also true
					this.alphaOffsetDevice = new Euler(evt.alpha, 0, 0);
					this.alphaOffsetDevice.rotateZ(-orientation.data.angle);

					// Discard first {successThreshold} responses while a better compass lock is found by UA
					if (++successCount >= successThreshold) {
						window.removeEventListener(
							"deviceorientation",
							setGameAlphaOffset,
							false
						);
						return;
					}
				}

				if (++tries >= maxTries) {
					window.removeEventListener(
						"deviceorientation",
						setGameAlphaOffset,
						false
					);
				}
			}.bind(this);

			window.addEventListener("deviceorientation", setGameAlphaOffset, false);

			// Create a compass-based deviceorientation object (initial alpha === compass degrees)
		} else if (this.options.type === "world") {
			const setCompassAlphaOffset = function (evt) {
				if (
					evt.absolute !== true &&
					evt.webkitCompassAccuracy !== undefined &&
					evt.webkitCompassAccuracy !== null &&
					+evt.webkitCompassAccuracy >= 0 &&
					+evt.webkitCompassAccuracy < 50
				) {
					this.alphaOffsetDevice = new Euler(evt.webkitCompassHeading, 0, 0);
					this.alphaOffsetDevice.rotateZ(orientation.data.angle);
					this.alphaOffsetScreen = orientation.data.angle;

					// Discard first {successThreshold} responses while a better compass lock is found by UA
					if (++successCount >= successThreshold) {
						window.removeEventListener(
							"deviceorientation",
							setCompassAlphaOffset,
							false
						);
						return;
					}
				}

				if (++tries >= maxTries) {
					window.removeEventListener(
						"deviceorientation",
						setCompassAlphaOffset,
						false
					);
				}
			}.bind(this);
			window.addEventListener(
				"deviceorientation",
				setCompassAlphaOffset,
				false
			);
		} // else... use whatever orientation system the UA provides ("game" on iOS, "world" on Android)
	}

	start(callback?: () => void) {
		if (callback) {
			orientation.listen(callback);
		}

		orientation.registerForScreenOrientationChange();

		orientation.start();
	}

	stop() {
		orientation.stop();
	}

	listen(callback) {
		this.start(callback);
	}

	getFixedFrameQuaternion(): Quaternion {
		return this.getFixedFrameEuler().toQuaternion();
	}

	// TODO: Simplify
	getFixedFrameEuler() {
		// TODO: added the "relative" but it's not necessarily right
		// Need to rephrase the questions?
		let orientationData = orientation.data.relative || {
			alpha: 0,
			beta: 0,
			gamma: 0,
		};

		let adjustedAlpha = orientationData.alpha;

		if (this.alphaOffsetDevice) {
			adjustedAlpha -= this.alphaOffsetDevice
				.toMatrix()
				.rotateZ(radians(-this.alphaOffsetScreen))
				.toEuler().alpha;
			return new Euler(
				adjustedAlpha,
				orientationData.beta,
				orientationData.gamma
			);
		} else {
			return eulerFromAngleObject(orientationData);
		}
	}

	getScreenAdjustedQuaternion() {
		return this.getFixedFrameQuaternion().rotateZ(
			radians(-orientation.data.angle)
		);
	}

	getFixedFrameMatrix() {
		return this.getFixedFrameEuler().toMatrix();
	}

	getScreenAdjustedMatrix() {
		return this.getFixedFrameMatrix().rotateZ(
			radians(-orientation.data.angle)
		);
	}

	getScreenAdjustedEuler() {
		return this.getScreenAdjustedMatrix().toEuler();
	}

	// TODO: This method doesn't mean much as named
	isAbsolute() {
		return orientation.data.absolute.alpha != undefined;
	}

	getLastRawEventData() {
		return orientation.data || {};
	}
}
