export type LengthUnit = {
  unit: string;
  cm: number;
};

export const LengthUnits: {
  [key: string]: LengthUnit;
} = {
  cm: { unit: "cm", cm: 1 },
  m: { unit: "m", cm: 100 },
};
