const IMAGE_PREFIX = '[[image]]';

export function encodeChatContent(text: string, imageUrl?: string | null) {
  const trimmed = text.trim();
  if (imageUrl && trimmed) {
    return `${IMAGE_PREFIX}${imageUrl}\n${trimmed}`;
  }
  if (imageUrl) {
    return `${IMAGE_PREFIX}${imageUrl}`;
  }
  return trimmed;
}

export function decodeChatContent(content: string) {
  const match = content.match(/^\[\[image\]\](\S+)(?:\n([\s\S]*))?$/);
  if (match) {
    return {
      imageUrl: match[1],
      text: (match[2] || '').trim(),
    };
  }

  return {
    imageUrl: null as string | null,
    text: content,
  };
}
