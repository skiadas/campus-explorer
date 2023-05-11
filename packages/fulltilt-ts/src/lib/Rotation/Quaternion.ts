import { Vector3D, Quaternion, AngleType, EulerType } from "./Types";
import { eulerFromAngleObject } from "./Euler";
import { eulerFromQuaternionX } from "./Conversions";

class QuaternionClass implements Quaternion {
	[key: string]: any;
	x: number;
	y: number;
	z: number;
	w: number;

	constructor(x: number, y: number, z: number, w: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	multipliedWith(quat) {
		return multiplyQuaternions(this, quat);
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

	toEuler(): EulerType {
		return eulerFromAngleObject(
			eulerFromQuaternionX(this.x, this.y, this.z, this.w)
		);
	}

	normalize() {
		const len = this.length();

		if (len === 0) {
			throw new Error("Cannot normalize zero quaternion");
		}

		this.x /= len;
		this.y /= len;
		this.z /= len;
		this.w /= len;

		return this;
	}
	length(): number {
		return Math.sqrt(
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
		);
	}
	rotateByAxisAngle(axis: Vector3D, angle: AngleType): Quaternion {
		return multiplyQuaternions(
			this,
			quaternionForRotation(axis, angle)
		).normalize();
	}
}

const multiplyQuaternions = function (a: Quaternion, b: Quaternion) {
	return quaternion(
		a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y, // x
		a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z, // y
		a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x, // z
		a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z // w
	);
};

export function quaternionForRotation(axis: Vector3D, angle: AngleType) {
	const halfAngle = angle.times(1 / 2);
	const sA = halfAngle.sin();
	const cA = halfAngle.cos();
	return quaternion(
		(axis[0] ?? 0) * sA,
		(axis[1] ?? 0) * sA,
		(axis[2] ?? 0) * sA,
		cA // w
	);
}

export function quaternion(
	x: number,
	y: number,
	z: number,
	w: number
): Quaternion {
	return new QuaternionClass(x, y, z, w);
}
