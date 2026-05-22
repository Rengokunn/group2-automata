function main(inputs) {
  const raw = String(inputs[0] ?? "").trim();
  const n = parseStrictInt(raw, "Number of terms", "7");

  const memo = {};
  function fib(k) {
    if (k === 0) return 0;
    if (k === 1) return 1;
    if (memo[k] !== undefined) return memo[k];
    return (memo[k] = fib(k - 1) + fib(k - 2));
  }

  const terms = Array.from({ length: n }, (_, i) => fib(i));

  return [
    "This program will find all the terms of the Fibonacci numbers.",
    "",
    `Input the number of terms: ${n}`,
    "",
    `The Fibonacci numbers are: ${terms.join(", ")}`,
  ].join("\n");
}

function parseStrictInt(raw, label, example) {
  example = example || "5";
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
    const n = parseStrictInt(raw, "Number of terms", "7");
    if (n < 0) errors[0] = `Cannot be negative.`;
    else if (n <= 2) errors[0] = `Must be greater than 2. Enter 3 or more.`;
    else if (n > 78) errors[0] = `Maximum allowed is 78.`;
  } catch (e) { errors[0] = e.message; }
  return errors;
}