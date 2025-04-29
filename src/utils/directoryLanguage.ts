import { StreamLanguage } from '@codemirror/language';
import { LanguageSupport } from '@codemirror/language';

interface DirectoryState {
  state: number;
  depth: number;
}

// Define the custom directory structure language
export const directoryLanguage = StreamLanguage.define<DirectoryState>({
  // Start the tokenizer in state 0
  startState: () => ({ state: 0, depth: 0 }),

  // This is the tokenizer function
  token(stream, state) {
    // Skip whitespace
    if (stream.eatSpace()) return null;

    // Handle comments
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    // Node name
    if (state.state === 0) {
      stream.eatWhile(/[a-zA-Z0-9_-]/);
      state.state = 1;
      return "variable";
    }

    // Opening parenthesis
    if (state.state === 1 && stream.eat("(")) {
      state.state = 2;
      state.depth++;
      return "bracket";
    }

    // Child names
    if (state.state === 2) {
      if (stream.eat(")")) {
        state.state = 0;
        state.depth--;
        return "bracket";
      }
      
      if (stream.eat(",")) {
        return "operator";
      }

      stream.eatWhile(/[a-zA-Z0-9_-]/);
      return "atom";
    }

    // Skip any other character and reset the state if we reach the end of the line
    stream.next();
    if (stream.eol()) state.state = 0;
    return null;
  }
});

export function directoryLanguageSupport() {
  return new LanguageSupport(directoryLanguage);
} 