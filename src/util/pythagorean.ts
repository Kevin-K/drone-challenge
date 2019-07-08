export function pythagorean(a: number, b: number) {
  const a_pow_2 = Math.pow(a, 2);
  const b_pow_2 = Math.pow(b, 2);
  return Math.sqrt(a_pow_2 + b_pow_2);
}
