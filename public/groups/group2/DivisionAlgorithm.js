function main(inputs) {
  const rawA = String(inputs[0] ?? "").trim();
  const rawB = String(inputs[1] ?? "").trim();

  const a = parseStrictInt(rawA, "First integer", "17");
  const b = parseStrictInt(rawB, "Second integer", "5");

  const m = Math.max(a, b);
  const n = Math.min(a, b);
  const q = Math.floor(m / n);
  const r = m % n;
  const fmt = (x) => x.toLocaleString("en-US");

  return [
    "SOLUTION:",
    `${fmt(m)} = ${fmt(n)}(${fmt(q)}) + ${fmt(r)}`,
    "",
    `The dividend is ${fmt(m)}`,
    `The divisor is ${fmt(n)}`,
    `The quotient is ${fmt(q)} and the remainder is ${fmt(r)}`,
  ].join("\n");
}

function parseStrictInt(raw, label, example) {
  example = example || "42";
  if (raw === "") throw new Error(`${label} is empty. Please enter a number.`);
  if (/^-?0[xX]/.test(raw)) throw new Error(`${label}: Hexadecimal values are not allowed. Please enter a plain integer (e.g. ${example}).`);
  if (/[a-df-wyzA-DF-WYZ]/.test(raw)) throw new Error(`${label}: Letters are not allowed. Please enter a plain integer (e.g. ${example}).`);
  if (/[eE]/.test(raw)) throw new Error(`${label}: Scientific notation is not allowed. Please enter a plain integer (e.g. ${example}).`);
  if (/,/.test(raw)) throw new Error(`${label}: Commas are not allowed in the input. Enter ${raw.replace(/,/g, "")} instead.`);
  if (/\./.test(raw)) throw new Error(`${label}: Decimal numbers are not allowed. Please enter a whole integer (e.g. ${example}).`);
  if (!/^-?\d+$/.test(raw)) throw new Error(`${label}: Invalid input. Please enter a plain integer (e.g. ${example}).`);
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) throw new Error(`${label}: The number is too large to process.`);
  return n;
}

function validate(inputs) {
  const errors = [null, null];
  const rawA = String(inputs[0] ?? "").trim();
  const rawB = String(inputs[1] ?? "").trim();
  try {
    const a = parseStrictInt(rawA, "First integer", "17");
    if (a <= 0) errors[0] = `Must be greater than 0.`;
    else if (a > 1_000_000) errors[0] = `Maximum allowed value is 1,000,000.`;
  } catch (e) { errors[0] = e.message; }
  try {
    const b = parseStrictInt(rawB, "Second integer", "5");
    if (b <= 0) errors[1] = `Must be greater than 0.`;
    else if (b > 1_000_000) errors[1] = `Maximum allowed value is 1,000,000.`;
  } catch (e) { errors[1] = e.message; }
  return errors;
}