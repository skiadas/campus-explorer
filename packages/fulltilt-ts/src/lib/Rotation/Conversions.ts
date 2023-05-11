import { abs, asin, atan2, degToRad, M_PI, M_PI_2, radToDeg } from "../Math";
import { sign } from "../Utils";
import { RawEuler, RawQuaternion } from "./Types";

const EPSILON = 1e-6; // rounding factor

export function matrixFromEuler(euler: RawEuler): Float32Array {
	const _z = (euler.alpha || 0) * degToRad;
	const _x = (euler.beta || 0) * degToRad;
	const _y = (euler.gamma || 0) * degToRad;

	const cX = Math.cos(_x);
	const cY = Math.cos(_y);
	const cZ = Math.cos(_z);
	const sX = Math.sin(_x);
	const sY = Math.sin(_y);
	const sZ = Math.sin(_z);

	//
	// ZXY-ordered rotation matrix construction.
	//
	const R = new Float32Array(9);
	R[0] = cZ * cY - sZ * sX * sY; // 1,1
	R[1] = -cX * sZ; // 1,2
	R[2] = cY * sZ * sX + cZ * sY; // 1,3

	R[3] = cY * sZ + cZ * sX * sY; // 2,1
	R[4] = cZ * cX; // 2,2
	R[5] = sZ * sY - cZ * cY * sX; // 2,3

	R[6] = -cX * sY; // 3,1
	R[7] = sX; // 3,2
	R[8] = cX * cY; // 3,3

	return R;
}

export function eulerFromRotationMatrix(R: Float32Array): RawEuler {
	// From Z-X-Y order
	// R[1]: -cos(beta)sin(alpha)
	// R[4]: cos(beta)cos(alpha)
	// R[6]: -cos(beta)sin(gamma)
	// R[7]: sin(beta)
	// R[8]: cos(beta)cos(gamma)
	const r8_zero = abs(R[8]) < 1e-7;
	const r6_zero = abs(R[6]) < 1e-7;
	// cos(gamma) >= 0 since gamma in [-pi/2, pi/2]
	// cos(beta) is < 0 exactly when R[8] < 0, or when R[8] = 0 and R[6] < 0
	const cos_beta_neg = (r8_zero && R[6] < 0) || R[8] < 0;

	if (r8_zero && r6_zero) {
		// gimbal lock discontinuity
		// gamma = 0 arbitrary but alpha depends on this choice
		return fromRad(atan2(R[3], R[0]), asin(R[7]), 0);
	} else if (cos_beta_neg) {
		return fromRad(atan2(R[1], -R[4]), -M_PI - asin(R[7]), atan2(R[6], -R[8]));
	} else {
		return fromRad(atan2(-R[1], R[4]), asin(R[7]), atan2(-R[6], R[8]));
	}
}

export function eulerFromQuaternionX(
	x: number,
	y: number,
	z: number,
	w: number
): RawEuler {
	const sqw = w * w;
	const sqx = x * x;
	const sqy = y * y;
	const sqz = z * z;

	// Normalised == 1, otherwise correction divisor.
	const unitLength = sqw + sqx + sqy + sqz;
	// If normalized:
	// wxyz:  0.5*sin(beta)
	const wxyz = w * x + y * z;
	// aX: cos(alpha)cos(beta)
	const aX = sqw - sqx + sqy - sqz;
	// aY: sin(alpha)cos(beta)
	const aY = 2 * (w * z - x * y);
	// gX: cos(gamma)cos(beta)
	const gX = sqw - sqx - sqy + sqz;
	// gY: sin(gamma)cos(beta)
	const gY = 2 * (w * y - x * z);

	// cos(gamma) always non-negative
	const sin_beta_is_1 = wxyz > (0.5 - EPSILON) * unitLength;
	const sin_beta_is_minus_1 = wxyz < (-0.5 + EPSILON) * unitLength;
	const cos_beta_is_zero = sin_beta_is_1 || sin_beta_is_minus_1;
	const gX_is_zero = abs(gX) < 1e-7;
	const cos_beta_not_pos = gX_is_zero || gX < 0;

	if (cos_beta_is_zero) {
		return fromRad(
			sin_beta_is_1 ? 2 * atan2(y, w) : -2 * atan2(y, w),
			-M_PI - asin((2 * wxyz) / unitLength),
			0
		);
	} else {
		return fromRad(
			cos_beta_not_pos ? atan2(-aY, -aX) : atan2(aY, aX),
			cos_beta_not_pos
				? -M_PI - asin((2 * wxyz) / unitLength)
				: asin((2 * wxyz) / unitLength),
			gX_is_zero ? -M_PI_2 : gX > 0 ? atan2(gY, gX) : atan2(-gY, -gX)
		);
	}
}

export function quatFromEuler(euler: RawEuler): RawQuaternion {
	const _z = (euler?.alpha || 0) * degToRad;
	const _x = (euler?.beta || 0) * degToRad;
	const _y = (euler?.gamma || 0) * degToRad;

	const cX = Math.cos(_x / 2);
	const cY = Math.cos(_y / 2);
	const cZ = Math.cos(_z / 2);
	const sX = Math.sin(_x / 2);
	const sY = Math.sin(_y / 2);
	const sZ = Math.sin(_z / 2);

	const x = sX * cY * cZ - cX * sY * sZ;
	const y = cX * sY * cZ + sX * cY * sZ;
	const z = cX * cY * sZ + sX * sY * cZ;
	const w = cX * cY * cZ - sX * sY * sZ;
	return { x, y, z, w };
}

export function quaternionFromRotationMatrix(R: Float32Array): RawQuaternion {
	return {
		x: 0.5 * Math.sqrt(1 + R[0] - R[4] - R[8]) * sign(R[7] - R[5]), // x
		y: 0.5 * Math.sqrt(1 - R[0] + R[4] - R[8]) * sign(R[2] - R[6]), // y
		z: 0.5 * Math.sqrt(1 - R[0] - R[4] + R[8]) * sign(R[3] - R[1]), // z
		w: 0.5 * Math.sqrt(1 + R[0] + R[4] + R[8]), // w
	};
}

export function fromRad(
	alphaRad: number,
	betaRad: number,
	gammaRad: number
): RawEuler {
	return {
		alpha: alphaRad * radToDeg,
		beta: betaRad * radToDeg,
		gamma: gammaRad * radToDeg,
	};
}
