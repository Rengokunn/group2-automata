function main(inputs) {
  const raw = String(inputs[0] ?? "").trim();

  const n = parseStrictInt(raw, "Initial value", "7");

  if (n <= 0) throw new Error(`Initial value must be a positive integer greater than 0. You entered: ${raw}`);
  if (n > 1_000_000) throw new Error(`Initial value is too large. Maximum allowed value is 1,000,000.`);
  if (n % 2 === 0) throw new Error(`Initial value must be a positive ODD integer (e.g. 1, 3, 5, 7...). You entered an even number: ${n}.`);

  const sequence = [n];
  let current = n;
  let guard = 200_000;

  while (current !== 1 && guard-- > 0) {
    current = current % 2 !== 0 ? 3 * current + 1 : current / 2;
    sequence.push(current);
  }

  if (guard <= 0) throw new Error("Sequence is taking too long to converge. Try a smaller number.");

  return [
    "This program will find all the terms of the Collatz sequence.",
    "",
    `Initial value: ${n.toLocaleString("en-US")}`,
    `The Collatz sequence: ${sequence.join(", ")}`,
    "",
    `Total terms: ${sequence.length.toLocaleString("en-US")}`,
  ].join("\n");
}

function parseStrictInt(raw, label, example) {
  example = example || "7";
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
    const n = parseStrictInt(raw, "Initial value", "7");
    if (n <= 0) errors[0] = `Must be a positive integer greater than 0.`;
    else if (n > 1_000_000) errors[0] = `Maximum allowed value is 1,000,000.`;
    else if (n % 2 === 0) errors[0] = `Must be a positive ODD integer (e.g. 1, 3, 5...).`;
  } catch (e) { errors[0] = e.message; }
  return errors;
}