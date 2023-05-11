export interface Distance {
  kilometers: number;
  miles: number;
  meters: number;
  yards: number;
  inches: number;
  centimeters: number;
  feet: number;
}

enum DistanceUnit {
  KILOMETERS = 'KILOMETERS',
  MILES = 'MILES',
  METERS = 'METERS',
  YARDS = 'YARDS',
  INCHES = 'INCHES',
  CENTIMETERS = 'CENTIMETERS',
  FEET = 'FEET'
}

type enumIndexed<V> = { [key in DistanceUnit]?: V };

const CONVERSIONS: enumIndexed<enumIndexed<number>> = {
  [DistanceUnit.KILOMETERS]: {
    [DistanceUnit.MILES]: 0.621371,
    [DistanceUnit.METERS]: 1000
  },
  [DistanceUnit.METERS]: {
    [DistanceUnit.MILES]: 0.000621371,
    [DistanceUnit.KILOMETERS]: 0.001,
    [DistanceUnit.FEET]: 3.28084
  }
};

class DistanceClass implements Distance {
  unit: DistanceUnit;

  value: number;

  constructor(unit: DistanceUnit, value: number) {
    this.unit = unit;
    this.value = value;
  }

  get kilometers(): number {
    return convert(this, DistanceUnit.KILOMETERS);
  }

  get meters(): number {
    return convert(this, DistanceUnit.METERS);
  }

  get miles(): number {
    return convert(this, DistanceUnit.MILES);
  }

  get yards(): number {
    return convert(this, DistanceUnit.YARDS);
  }

  get inches(): number {
    return convert(this, DistanceUnit.INCHES);
  }

  get centimeters(): number {
    return convert(this, DistanceUnit.CENTIMETERS);
  }

  get feet(): number {
    return convert(this, DistanceUnit.FEET);
  }
}

export function km(kilometers: number): Distance {
  return new DistanceClass(DistanceUnit.KILOMETERS, kilometers);
}

export function meters(mt: number): Distance {
  return new DistanceClass(DistanceUnit.METERS, mt);
}

export function feet(ft: number): Distance {
  return new DistanceClass(DistanceUnit.FEET, ft);
}

function convert(d: DistanceClass, unit: DistanceUnit): number {
  if (d.unit === unit) return d.value;
  return getConversionFactor(d.unit, unit) * d.value;
}

function getConversionFactor(from: DistanceUnit, to: DistanceUnit): number {
  const factor = CONVERSIONS?.[from]?.[to];
  if (!factor) throw new Error(`Don't know how to convert from ${from} to ${to}`);
  return factor;
}
