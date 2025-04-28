import { StreamLanguage } from '@codemirror/language';
import { LanguageSupport } from '@codemirror/language';

interface DirectoryState {
  state: number;
  variable: string;
}

// Define the custom directory structure language
export const directoryLanguage = StreamLanguage.define<DirectoryState>({
  // Start the tokenizer in state 0
  startState: () => ({ state: 0, variable: "" }),

  // This is the tokenizer function
  token(stream, state) {
    // Skip whitespace
    if (stream.eatSpace()) return null;

    // Handle comments
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    // Variable declaration
    if (state.state === 0) {
      const varMatch = stream.match(/[a-zA-Z0-9_]+/);
      if (varMatch && typeof varMatch !== 'boolean') {
        state.variable = varMatch[0];
        state.state = 1;
        return "variable";
      }
    }

    // Equal sign
    if (state.state === 1 && stream.eat("=")) {
      state.state = 2;
      return "operator";
    }

    // Handle values (after the =)
    if (state.state === 2) {
      // Check for child() function
      if (stream.match("child(")) {
        state.state = 3;
        return "keyword";
      } else {
        // Regular value (project name)
        stream.eatWhile(/[a-zA-Z0-9_-]/);
        state.state = 0; // Reset for next line
        return "string";
      }
    }

    // Inside child() function, handling arguments
    if (state.state === 3) {
      if (stream.eat(")")) {
        state.state = 0; // Reset for next line
        return "keyword";
      }
      
      // Child names inside the function
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