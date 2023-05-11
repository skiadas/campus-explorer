import Euler from "./Euler";
import { toBeDeepCloseTo, toMatchCloseTo } from "jest-matcher-deep-close-to";

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe("Euler angle descriptions", () => {
	test("store the three angle values", () => {
		const euler = new Euler(120, -50, 30);
		expect(euler.alpha).toBe(120);
		expect(euler.beta).toBe(-50);
		expect(euler.gamma).toBe(30);
	});
	test("can be converted to matrix and back", () => {
		for (let alpha = 0; alpha < 360; alpha += 10) {
			for (let beta = -180; beta < 180; beta += 10) {
				for (let gamma = -90; gamma < 90; gamma += 10) {
					expectMatchesAfterMatrixConversion(new Euler(alpha, beta, gamma));
				}
			}
		}
	});
	test("different sets of angles may give same matrix in gimbal lock setting", () => {
		const e1 = new Euler(0, -90, -90);
		const m1 = e1.toMatrix();
		const e2 = new Euler(90, -90, 0);
		const m2 = e2.toMatrix();
		expect(m1.elements).toMatchCloseTo(m2.elements);
	});
});

function expectMatchesAfterMatrixConversion(euler: Euler) {
	const m = euler.toMatrix();
	const euler2 = m.toEuler();
	const m2 = euler2.toMatrix();
	expect(m2.elements).toBeDeepCloseTo(m.elements);
	// We should only do this check if not in gimbal lock situation
	// Otherwise we can't count on the inverse being unique within
	// our constraints
	if (Math.abs(m.elements[6]) < 1e-7 && Math.abs(m.elements[8]) < 1e-7) {
		return;
	}
	expect(euler2).toMatchCloseTo({ ...euler });
}
