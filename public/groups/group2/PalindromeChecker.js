function main(inputs) {
  const raw = String(inputs[0] ?? "");
  const original = raw;
  const length = original.length;

  // toLowerCase manually
  let lower = "";
  for (let i = 0; i < original.length; i++) {
    const code = original.charCodeAt(i);
    lower += (code >= 65 && code <= 90) ? String.fromCharCode(code + 32) : original[i];
  }

  // Remove non-alphanumeric characters manually
  let cleaned = "";
  for (let i = 0; i < lower.length; i++) {
    const code = lower.charCodeAt(i);
    if ((code >= 97 && code <= 122) || (code >= 48 && code <= 57)) cleaned += lower[i];
  }

  // Palindrome check manually
  let isPalindrome = true;
  let half = 0;
  while (half * 2 < cleaned.length) half++;
  half = (cleaned.length - half * 2 === 0) ? cleaned.length / 2 : (cleaned.length - 1) / 2;
  for (let i = 0; i < half; i++) {
    if (cleaned[i] !== cleaned[cleaned.length - 1 - i]) { isPalindrome = false; break; }
  }

  // Reverse string manually
  let reversed = "";
  for (let i = cleaned.length - 1; i >= 0; i--) {
    reversed += cleaned[i];
  }

  // Build result string manually (no join/template literals use array methods)
  const lines = [
    "Entered string: " + original,
    "Length of string: " + length,
    "Cleaned (letters/digits only): " + cleaned,
    "Reversed: " + reversed,
    "",
    isPalindrome ? "The string is a PALINDROME :D" : "The string is NOT a PALINDROME >:("
  ];

  let result = "";
  for (let i = 0; i < lines.length; i++) {
    result += lines[i];
    if (i < lines.length - 1) result += "\n";
  }

  return result;
}

function validate(inputs) {
  const errors = [null];
  const raw = String(inputs[0] ?? "");

  // Manual trim check
  let allWhitespace = true;
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    if (code !== 32 && code !== 9 && code !== 10 && code !== 13) {
      allWhitespace = false;
      break;
    }
  }
  if (raw.length === 0 || allWhitespace) {
    errors[0] = "Please enter a string before running.";
    return errors;
  }

  // Manual ASCII range check
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    if (code > 126 || code < 32) {
      errors[0] = "Invalid character \"" + raw[i] + "\" at position " + (i + 1) + ". Only standard ASCII allowed.";
      return errors;
    }
  }

  // Manual toLowerCase + alphanumeric filter
  let cleaned = "";
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    let c;
    if (code >= 65 && code <= 90) {
      c = String.fromCharCode(code + 32);
    } else {
      c = raw[i];
    }
    const lc = c.charCodeAt(0);
    if ((lc >= 97 && lc <= 122) || (lc >= 48 && lc <= 57)) {
      cleaned += c;
    }
  }

  if (cleaned.length === 0) {
    errors[0] = "No letters or digits found. Enter at least one alphanumeric character.";
  }

  return errors;
}