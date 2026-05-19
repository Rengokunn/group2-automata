function main(inputs) {
  const rawA = String(inputs[0] ?? "").trim();
  const rawB = String(inputs[1] ?? "").trim();

  const a = parseStrictInt(rawA, "First integer", "48");
  const b = parseStrictInt(rawB, "Second integer", "18");

  if (a <= 0) throw new Error(`First integer must be greater than 0. You entered: ${rawA}`);
  if (b <= 0) throw new Error(`Second integer must be greater than 0. You entered: ${rawB}`);

  const LIMIT = 1_000_000;
  if (a > LIMIT) throw new Error(`First integer is too large. Maximum allowed value is 1,000,000.`);
  if (b > LIMIT) throw new Error(`Second integer is too large. Maximum allowed value is 1,000,000.`);

  const fmt = (x) => x.toLocaleString("en-US");
  const m = Math.max(a, b);
  const n = Math.min(a, b);

  let dividend = m, divisor = n;
  const steps = [];

  while (true) {
    const q = Math.floor(dividend / divisor);
    const r = dividend % divisor;
    if (r === 0) {
      steps.push(`${fmt(dividend)} = ${fmt(divisor)}(${fmt(q)})`);
      break;
    } else {
      steps.push(`${fmt(dividend)} = ${fmt(divisor)}(${fmt(q)}) + ${fmt(r)}`);
    }
    dividend = divisor;
    divisor = r;
  }

  const gcd = divisor;
  const lcm = (m * n) / gcd;

  return [
    "SOLUTION:",
    ...steps,
    "",
    `The integers are ${fmt(m)} and ${fmt(n)}`,
    `The greatest common divisor of ${fmt(m)} and ${fmt(n)} is ${fmt(gcd)}`,
    `The least common multiple of ${fmt(m)} and ${fmt(n)} is ${fmt(lcm)}.`,
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
