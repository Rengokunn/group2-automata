function main(inputs) {
  const raw = String(inputs[0] ?? "");

  if (raw.trim() === "") throw new Error("Please enter a string before running.");

  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    if (code > 126 || code < 32) {
      throw new Error(
        `Invalid character "${raw[i]}" found at position ${i + 1}. ` +
        `Only standard ASCII characters are allowed (A–Z, a–z, 0–9, spaces, basic punctuation). ` +
        `Accented characters like é, ñ, ü are not supported.`
      );
    }
  }

  const original = raw;
  const length = original.length;

  let lower = "";
  for (let i = 0; i < original.length; i++) {
    const code = original.charCodeAt(i);
    lower += (code >= 65 && code <= 90) ? String.fromCharCode(code + 32) : original[i];
  }

  let cleaned = "";
  for (let i = 0; i < lower.length; i++) {
    const code = lower.charCodeAt(i);
    if ((code >= 97 && code <= 122) || (code >= 48 && code <= 57)) cleaned += lower[i];
  }

  if (cleaned.length === 0) {
    throw new Error("The string contains no letters or digits. Please enter a string with at least one alphanumeric character.");
  }

  let isPalindrome = true;
  for (let i = 0; i < Math.floor(cleaned.length / 2); i++) {
    if (cleaned[i] !== cleaned[cleaned.length - 1 - i]) { isPalindrome = false; break; }
  }

  const reversed = cleaned.split("").reverse().join("");

  return [
    `Entered string: ${original}`,
    `Length of string: ${length}`,
    `Cleaned (letters/digits only): ${cleaned}`,
    `Reversed: ${reversed}`,
    "",
    isPalindrome ? "The string is a PALINDROME :D" : "The string is NOT a PALINDROME >:(",
  ].join("\n");
}

function validate(inputs) {
  const errors = [null];
  const raw = String(inputs[0] ?? "");
  if (raw.trim() === "") {
    errors[0] = `Please enter a string before running.`;
    return errors;
  }
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    if (code > 126 || code < 32) {
      errors[0] = `Invalid character "${raw[i]}" at position ${i + 1}. Only standard ASCII allowed.`;
      return errors;
    }
  }
  const cleaned = raw.toLowerCase().split("").filter(c => /[a-z0-9]/.test(c)).join("");
  if (cleaned.length === 0) errors[0] = `No letters or digits found. Enter at least one alphanumeric character.`;
  return errors;
}