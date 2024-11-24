export function roundToClosest(value: number, valuesArray: number[]) {
  return valuesArray.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
  );
}
