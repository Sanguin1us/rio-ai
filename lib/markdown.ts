export const normalizeMathDelimiters = (input: string): string => {
  if (!input || !input.includes('\\')) {
    return input;
  }

  const segments: string[] = [];
  const codePattern = /(```[\s\S]*?```|`[^`]*`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Split input into code and non-code segments, preserving delimiters.
  while ((match = codePattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      const textSegment = input.slice(lastIndex, match.index);
      segments.push(convertMathDelimiters(textSegment));
    }
    segments.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push(convertMathDelimiters(input.slice(lastIndex)));
  }

  return segments.join('');
};

const convertMathDelimiters = (segment: string): string => {
  if (!segment.includes('\\')) {
    return segment;
  }

  return segment.replace(/\\([()[\]])/g, (match, delimiter, offset, source) => {
    const previousChar = offset > 0 ? source[offset - 1] : null;

    // Preserve escaped backslashes (e.g. "\\(" should remain "\(").
    if (previousChar === '\\') {
      return match;
    }

    if (delimiter === '(' || delimiter === ')') {
      return '$';
    }

    if (delimiter === '[' || delimiter === ']') {
      return '$$';
    }

    return match;
  });
};
