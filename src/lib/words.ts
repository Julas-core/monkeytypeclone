// Common English words for typing practice
export const commonWords = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it",
  "he", "was", "for", "on", "are", "as", "with", "his", "they", "I",
  "at", "be", "this", "have", "from", "or", "one", "had", "by", "word",
  "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
  "there", "each", "which", "she", "do", "how", "their", "if", "will", "up",
  "other", "about", "out", "many", "then", "them", "these", "so", "some", "her",
  "would", "make", "like", "into", "him", "has", "two", "more", "go", "no",
  "way", "could", "my", "than", "first", "water", "been", "call", "who", "oil",
  "its", "now", "find", "long", "down", "day", "did", "get", "come", "made",
  "may", "part", "over", "new", "sound", "take", "only", "little", "work", "know",
  "place", "year", "live", "me", "back", "give", "most", "very", "after", "thing",
  "our", "just", "name", "good", "sentence", "man", "think", "say", "great", "where",
  "help", "through", "much", "before", "line", "right", "too", "mean", "old", "any",
  "same", "tell", "boy", "follow", "came", "want", "show", "also", "around", "form",
  "three", "small", "set", "put", "end", "why", "again", "turn", "here", "off",
  "went", "old", "number", "great", "tell", "men", "say", "small", "every", "found",
  "still", "between", "mane", "should", "home", "big", "give", "air", "line", "set",
  "own", "under", "read", "last", "never", "us", "left", "end", "along", "while",
  "might", "next", "sound", "below", "saw", "something", "thought", "both", "few", "those",
  "always", "looked", "show", "large", "often", "together", "asked", "house", "don't", "world",
  "going", "want", "school", "important", "until", "form", "food", "keep", "children", "feet",
  "land", "side", "without", "boy", "once", "animal", "life", "enough", "took", "sometimes",
  "four", "head", "above", "kind", "began", "almost", "live", "page", "got", "earth",
  "need", "far", "hand", "high", "year", "mother", "light", "country", "father", "let",
  "night", "picture", "being", "study", "second", "book", "carry", "took", "science", "eat"
];

export function generateWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  return words;
}

export function generateQuote(): string {
  const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "The only way to do great work is to love what you do.",
    "In the middle of difficulty lies opportunity.",
    "Life is what happens to you while you're busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is during our darkest moments that we must focus to see the light.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only impossible journey is the one you never begin."
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
}
