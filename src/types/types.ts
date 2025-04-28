export interface DirectoryNode {
  name: string;
  children: DirectoryNode[];
  level: number;
}

export interface ParsedLine {
  variable: string;
  operation: string;
  value: string;
}

export interface VariableMap {
  [key: string]: DirectoryNode;
} 