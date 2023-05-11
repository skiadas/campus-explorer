import { degrees } from "./Angle";
import { matrixForRotation } from "./RotationMatrix";
import { RotationMatrix } from "./Types";
import { toBeDeepCloseTo, toMatchCloseTo } from "jest-matcher-deep-close-to";

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe("Rotation Matrix", () => {
	test("can be constructed for rotation along axis and angle", () => {
		const angle = degrees(20);
		const mx: RotationMatrix = matrixForRotation([1, 0, 0], angle);
		const my: RotationMatrix = matrixForRotation([0, 1, 0], angle);
		const mz: RotationMatrix = matrixForRotation([0, 0, 1], angle);
		expect(mx.elements).toBeDeepCloseTo([
			1,
			0,
			0,
			0,
			angle.cos(),
			-angle.sin(),
			0,
			angle.sin(),
			angle.cos(),
		]);
		expect(my.elements).toBeDeepCloseTo([
			angle.cos(),
			0,
			angle.sin(),
			0,
			1,
			0,
			-angle.sin(),
			0,
			angle.cos(),
		]);
		expect(mz.elements).toBeDeepCloseTo([
			angle.cos(),
			-angle.sin(),
			0,
			angle.sin(),
			angle.cos(),
			0,
			0,
			0,
			1,
		]);
	});
});
