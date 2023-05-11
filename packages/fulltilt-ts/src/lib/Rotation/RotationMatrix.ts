import {
	AngleType,
	EulerType,
	Quaternion,
	RotationMatrix,
	Vector3D,
} from "./Types";
import { eulerFromAngleObject } from "./Euler";
import {
	eulerFromRotationMatrix,
	quaternionFromRotationMatrix,
} from "./Conversions";
import { quaternion } from "./Quaternion";

class RotationMatrixClass implements RotationMatrix {
	elements: Float32Array;
	constructor(
		m11: number | Float32Array | number[],
		m12?: number,
		m13?: number,
		m21?: number,
		m22?: number,
		m23?: number,
		m31?: number,
		m32?: number,
		m33?: number
	) {
		this.elements = new Float32Array(9);
		if (m11 instanceof Float32Array || m11 instanceof Array) {
			this.elements.set(m11);
		} else {
			this.elements[0] = m11;
			this.elements[1] = m12;
			this.elements[2] = m13;
			this.elements[3] = m21;
			this.elements[4] = m22;
			this.elements[5] = m23;
			this.elements[6] = m31;
			this.elements[7] = m32;
			this.elements[8] = m33;
		}
	}
	multipliedBy(m: RotationMatrix): RotationMatrix {
		return multiplyMatrices(this, m);
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

	rotateByAxisAngle(axis: Vector3D, angle: AngleType): RotationMatrix {
		return this.multipliedBy(matrixForRotation(axis, angle)).normalize();
	}

	normalize(): RotationMatrix {
		const determinant = this.determinant();
		// Normalize matrix values
		this.elements[0] /= determinant;
		this.elements[1] /= determinant;
		this.elements[2] /= determinant;
		this.elements[3] /= determinant;
		this.elements[4] /= determinant;
		this.elements[5] /= determinant;
		this.elements[6] /= determinant;
		this.elements[7] /= determinant;
		this.elements[8] /= determinant;

		return this;
	}

	determinant(): number {
		const R = this.elements;

		return (
			R[0] * R[4] * R[8] -
			R[0] * R[5] * R[7] -
			R[1] * R[3] * R[8] +
			R[1] * R[5] * R[6] +
			R[2] * R[3] * R[7] -
			R[2] * R[4] * R[6]
		);
	}

	toEuler(): EulerType {
		return eulerFromAngleObject(eulerFromRotationMatrix(this.elements));
	}

	toQuaternion(): Quaternion {
		const { x, y, z, w } = quaternionFromRotationMatrix(this.elements);
		return quaternion(x, y, z, w);
	}
}

function multiplyMatrices(
	a: RotationMatrix,
	b: RotationMatrix
): RotationMatrix {
	const aE = a.elements;
	const bE = b.elements;

	return new RotationMatrixClass(
		aE[0] * bE[0] + aE[1] * bE[3] + aE[2] * bE[6],
		aE[0] * bE[1] + aE[1] * bE[4] + aE[2] * bE[7],
		aE[0] * bE[2] + aE[1] * bE[5] + aE[2] * bE[8],

		aE[3] * bE[0] + aE[4] * bE[3] + aE[5] * bE[6],
		aE[3] * bE[1] + aE[4] * bE[4] + aE[5] * bE[7],
		aE[3] * bE[2] + aE[4] * bE[5] + aE[5] * bE[8],

		aE[6] * bE[0] + aE[7] * bE[3] + aE[8] * bE[6],
		aE[6] * bE[1] + aE[7] * bE[4] + aE[8] * bE[7],
		aE[6] * bE[2] + aE[7] * bE[5] + aE[8] * bE[8]
	);
}

export function identityMatrix(): RotationMatrix {
	return new RotationMatrixClass(1, 0, 0, 0, 1, 0, 0, 0, 1);
}

export function matrixForRotation(
	axis: Vector3D,
	angle: AngleType
): RotationMatrix {
	const [x, y, z] = axis;
	const sA = angle.sin();
	const cA = angle.cos();

	return new RotationMatrixClass(
		cA + x * x * (1 - cA),
		x * y * (1 - cA) - z * sA,
		x * z * (1 - cA) + y * sA,
		x * y * (1 - cA) + z * sA,
		cA + y * y * (1 - cA),
		y * z * (1 - cA) - x * sA,
		x * z * (1 - cA) - y * sA,
		y * z * (1 - cA) + x * sA,
		cA + z * z * (1 - cA)
	);
}

export function matrixFromQuaternion(q: Quaternion): RotationMatrix {
	const sqw = q.w * q.w;
	const sqx = q.x * q.x;
	const sqy = q.y * q.y;
	const sqz = q.z * q.z;

	return new RotationMatrixClass(
		sqw + sqx - sqy - sqz, // 1,1
		2 * (q.x * q.y - q.w * q.z), // 1,2
		2 * (q.x * q.z + q.w * q.y), // 1,3

		2 * (q.x * q.y + q.w * q.z), // 2,1
		sqw - sqx + sqy - sqz, // 2,2
		2 * (q.y * q.z - q.w * q.x), // 2,3

		2 * (q.x * q.z - q.w * q.y), // 3,1
		2 * (q.y * q.z + q.w * q.x), // 3,2
		sqw - sqx - sqy + sqz // 3,3
	);
}

export function rotationMatrix(
	m11: number | Float32Array | number[],
	m12?: number,
	m13?: number,
	m21?: number,
	m22?: number,
	m23?: number,
	m31?: number,
	m32?: number,
	m33?: number
): RotationMatrix {
	return new RotationMatrixClass(m11, m12, m13, m21, m22, m23, m31, m32, m33);
}
