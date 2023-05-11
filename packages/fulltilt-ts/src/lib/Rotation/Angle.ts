import { degToRad, radToDeg } from "../Math";
import { AngleSpec, AngleType } from "./Types";

export class Angle implements AngleType {
	degrees: number;
	radians: number;
	constructor(angleSpec: AngleSpec) {
		if ("degrees" in angleSpec) {
			this.degrees = angleSpec.degrees;
			this.radians = angleSpec.degrees * degToRad;
		} else {
			this.degrees = angleSpec.radians * radToDeg;
			this.radians = angleSpec.radians;
		}
	}
	sin() {
		return Math.sin(this.radians);
	}
	cos() {
		return Math.cos(this.radians);
	}
	tan() {
		return Math.tan(this.radians);
	}
	times(scale: number) {
		return new Angle({ radians: this.radians * (scale ?? 1) });
	}
}

export function degrees(deg: number): Angle {
	return new Angle({ degrees: deg });
}

export function radians(rad: number): Angle {
	return new Angle({ radians: rad });
}
