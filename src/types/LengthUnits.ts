export type LengthUnit = {
  name: string;
  cm: number;
};

export const LengthUnits: {
  [key: string]: LengthUnit;
} = {
  cm: { name: "cm", cm: 1 },
  m: { name: "m", cm: 100 },
};
