import { matrixFromEuler, quatFromEuler } from "./Conversions";
import {
	AngleType,
	RawEuler,
	EulerType,
	Quaternion,
	RotationMatrix,
	Vector3D,
} from "./Types";
import { rotationMatrix } from "./RotationMatrix";
import { quaternion } from "./Quaternion";

export default class Euler implements EulerType {
	[key: string]: any;
	alpha: number;
	beta: number;
	gamma: number;

	constructor(alpha: number, beta: number, gamma: number) {
		this.alpha = ensureInAlphaRange(alpha ?? 0);
		this.beta = ensureInBetaRange(beta ?? 0);
		this.gamma = ensureInGammaRange(gamma ?? 0);
	}

	rotateX(angle: AngleType) {
		return this.rotateByAxisAngle([1, 0, 0], angle);
	}

	rotateY(angle: AngleType) {
		return this.rotateByAxisAngle([0, 1, 0], angle);
	}

	rotateZ(angle: AngleType) {
		return this.rotateByAxisAngle([0, 0, 1], angle);
	}

	rotateByAxisAngle(axis: Vector3D, angle: AngleType) {
		return this.toMatrix().rotateByAxisAngle(axis, angle).toEuler();
	}

	toQuaternion(): Quaternion {
		const { x, y, z, w } = quatFromEuler(this);
		return quaternion(x, y, z, w).normalize();
	}

	toMatrix(): RotationMatrix {
		return rotationMatrix(matrixFromEuler(this)).normalize();
	}
}

export function eulerFromAngleObject(obj: RawEuler): Euler {
	return new Euler(obj.alpha, obj.beta, obj.gamma);
}

function ensureInAlphaRange(alpha: number): number {
	while (alpha < 0) alpha += 360;
	return alpha % 360;
}

function ensureInBetaRange(beta: number): number {
	while (beta < -180) beta += 360;
	return beta % 360;
}

function ensureInGammaRange(gamma: number): number {
	if (gamma < -90 || gamma > 90)
		throw new Error(
			`Incorrect gamma range. It was ${gamma} but should be between -90 and 90.`
		);
	return gamma;
}
