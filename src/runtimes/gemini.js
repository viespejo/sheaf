import matter from 'gray-matter';

function tomlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function toGeminiToml({ composedMarkdown, promptName }) {
  const parsed = matter(composedMarkdown);
  const description =
    typeof parsed.data.description === 'string' &&
    parsed.data.description.trim().length > 0
      ? parsed.data.description
      : promptName;

  const prompt = parsed.content.replace(/\$ARGUMENTS/g, '{{args}}').trimEnd();

  const lines = [];
  lines.push(`description = ${tomlString(description)}`);
  lines.push('');
  lines.push('prompt = """');
  lines.push(prompt);
  lines.push('"""');

  return `${lines.join('\n')}\n`;
}
