function main(inputs) {
  const raw = String(inputs[0] ?? "").trim();
  const n = parseStrictInt(raw, "Number of terms", "10");

  const memo = {};
  function trib(k) {
    if (k === 0) return 0;
    if (k === 1) return 0;
    if (k === 2) return 1;
    if (memo[k] !== undefined) return memo[k];
    return (memo[k] = trib(k - 1) + trib(k - 2) + trib(k - 3));
  }

  const terms = Array.from({ length: n }, (_, i) => trib(i));

  return [
    "This program will find all the terms of the Tribonacci numbers.",
    "",
    `Input the number of terms: ${n}`,
    "",
    `The Tribonacci numbers are: ${terms.join(", ")}`,
  ].join("\n");
}

function parseStrictInt(raw, label, example) {
  example = example || "10";
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
  const errors = [null];
  const raw = String(inputs[0] ?? "").trim();
  try {
    const n = parseStrictInt(raw, "Number of terms", "10");
    if (n < 0) errors[0] = `Cannot be negative.`;
    else if (n <= 3) errors[0] = `Must be greater than 3. Enter 4 or more.`;
    else if (n > 56) errors[0] = `Maximum allowed is 56.`;
  } catch (e) { errors[0] = e.message; }
  return errors;
}