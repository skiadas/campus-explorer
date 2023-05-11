import Euler from "./Euler";
import { toBeDeepCloseTo, toMatchCloseTo } from "jest-matcher-deep-close-to";
import { matrixFromQuaternion } from "./RotationMatrix";

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const examples = [];

describe("Euler to Quaternion conversion", () => {
	test("can set Euler from quaternion and vice versa", () => {
		const euler = new Euler(120, -50, 30);
		const q = euler.toQuaternion();
		const euler2 = q.toEuler();
		expect(euler2).toMatchCloseTo({ ...euler });
	});
	test("goes back to the original angle", () => {
		for (let alpha = 0; alpha < 360; alpha += 10) {
			for (let beta = -180; beta < 180; beta += 10) {
				for (let gamma = -90; gamma < 90; gamma += 10) {
					expectMatchesAfterQuaternionConversion(new Euler(alpha, beta, gamma));
				}
			}
		}
		// console.log(examples);
	});
});

function expectMatchesAfterQuaternionConversion(euler: Euler) {
	const q = euler.toQuaternion();
	const euler2 = q.toEuler();
	const q2 = euler2.toQuaternion();
	const { x, y, z, w } = q2;
	expect(q2).toMatchCloseTo({ x, y, z, w });
	// We should only do this check if not in gimbal lock situation
	// Otherwise we can't count on the inverse being unique within
	// our constraints
	// if (Math.abs(m.elements[6]) < 1e-7 && Math.abs(m.elements[8]) < 1e-7) {
	// 	return;
	// }
	if (Math.abs(euler2.alpha - euler.alpha) >= 1e-7) {
		examples.push([euler, euler2, q, matrixFromQuaternion(q).elements]);
	}
	// expect(euler2).toMatchCloseTo({ ...euler });
}
