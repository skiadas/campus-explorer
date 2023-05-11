import { degrees } from "./Angle";
import Euler, { eulerFromAngleObject } from "./Euler";
import { degToRad } from "../Math";
import { quaternion, quaternionForRotation } from "./Quaternion";
import { RawEuler, Quaternion } from "./Types";

const PREC_DIGITS = 6;

describe("Quaternions", () => {
	test("can be created directly", () => {
		const q: Quaternion = quaternion(3, 4, 5, 1);
		expect(q.x).toBe(3);
		expect(q.y).toBe(4);
		expect(q.z).toBe(5);
		expect(q.w).toBe(1);
	});

	test("can be created from Euler angles", () => {
		const sampleAngle = { alpha: 45, beta: -45, gamma: 45 };
		const { cbeta, cgamma, calpha, sbeta, sgamma, salpha } =
			trigNumsFromEuler(sampleAngle);
		const q: Quaternion = new Euler(
			sampleAngle.alpha,
			sampleAngle.beta,
			sampleAngle.gamma
		).toQuaternion();
		expect(q.w).toBeCloseTo(
			cbeta * cgamma * calpha - sbeta * sgamma * salpha,
			PREC_DIGITS
		);
		expect(q.x).toBeCloseTo(
			sbeta * cgamma * calpha - cbeta * sgamma * salpha,
			PREC_DIGITS
		);
		expect(q.y).toBeCloseTo(
			cbeta * sgamma * calpha + sbeta * cgamma * salpha,
			PREC_DIGITS
		);
		expect(q.z).toBeCloseTo(
			cbeta * cgamma * salpha + sbeta * sgamma * calpha,
			PREC_DIGITS
		);
	});

	test("can be created from rotation matrix", () => {
		const sampleAngle = eulerFromAngleObject({
			alpha: 45,
			beta: -45,
			gamma: 45,
		});
		const { cbeta, cgamma, calpha, sbeta, sgamma, salpha } =
			trigNumsFromEuler(sampleAngle);
		const q: Quaternion = sampleAngle.toMatrix().toQuaternion();
		expect(q.w).toBeCloseTo(
			cbeta * cgamma * calpha - sbeta * sgamma * salpha,
			PREC_DIGITS
		);
		expect(q.x).toBeCloseTo(
			sbeta * cgamma * calpha - cbeta * sgamma * salpha,
			PREC_DIGITS
		);
		expect(q.y).toBeCloseTo(
			cbeta * sgamma * calpha + sbeta * cgamma * salpha,
			PREC_DIGITS
		);
		expect(q.z).toBeCloseTo(
			cbeta * cgamma * salpha + sbeta * sgamma * calpha,
			PREC_DIGITS
		);
	});
});

test("can be created from axis and angle specification", () => {
	const angle = degrees(45);
	const q: Quaternion = quaternionForRotation([1, 0, 0], angle);
	expect(q.x).toBeCloseTo(angle.times(1 / 2).sin(), PREC_DIGITS);
	expect(q.y).toBeCloseTo(0, PREC_DIGITS);
	expect(q.z).toBeCloseTo(0, PREC_DIGITS);
	expect(q.w).toBeCloseTo(angle.times(1 / 2).cos(), PREC_DIGITS);
});

function trigNumsFromEuler({ alpha, beta, gamma }: RawEuler) {
	return {
		calpha: Math.cos((alpha * degToRad) / 2),
		cbeta: Math.cos((beta * degToRad) / 2),
		cgamma: Math.cos((gamma * degToRad) / 2),
		salpha: Math.sin((alpha * degToRad) / 2),
		sbeta: Math.sin((beta * degToRad) / 2),
		sgamma: Math.sin((gamma * degToRad) / 2),
	};
}
