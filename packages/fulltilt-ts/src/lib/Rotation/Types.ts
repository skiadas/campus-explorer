export type Callback<T> = (data: T) => void;
export type AngleSpec = { radians: number } | { degrees: number };
export type AngleType = {
	radians: number;
	degrees: number;
	sin: () => number;
	cos: () => number;
	tan: () => number;
	times: (scale: number) => AngleType;
};
export interface RawEuler {
	alpha: number;
	beta: number;
	gamma: number;
}
export interface RawQuaternion {
	x: number;
	y: number;
	z: number;
	w: number;
}
export type Vector3D = [number, number, number];
export interface EulerType extends RawEuler {
	toMatrix(): RotationMatrix;
	toQuaternion(): Quaternion;
	rotateX(angle: AngleType): EulerType;
	rotateY(angle: AngleType): EulerType;
	rotateZ(angle: AngleType): EulerType;
}
export interface Quaternion extends RawQuaternion {
	rotateX(angle: AngleType): Quaternion;
	rotateY(angle: AngleType): Quaternion;
	rotateZ(angle: AngleType): Quaternion;
	multipliedWith(q: Quaternion): Quaternion;
	normalize(): Quaternion;
	length(): number;
	toEuler(): EulerType;
}
export type RotationMatrix = {
	elements: Float32Array;
	rotateX(angle: AngleType): RotationMatrix;
	rotateY(angle: AngleType): RotationMatrix;
	rotateZ(angle: AngleType): RotationMatrix;
	multipliedBy(m: RotationMatrix): RotationMatrix;
	rotateByAxisAngle(axis: Vector3D, angle: AngleType): RotationMatrix;
	normalize(): RotationMatrix;
	determinant(): number;
	toEuler(): EulerType;
	toQuaternion(): Quaternion;
};
