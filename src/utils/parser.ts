import { DirectoryNode, ParsedLine, VariableMap } from '../types/types';

export function parseLine(line: string): ParsedLine | null {
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine.startsWith('//')) return null;

  const parts = trimmedLine.split('=').map(part => part.trim());
  if (parts.length !== 2) return null;

  const operation = parts[1].startsWith('child(') ? 'child' : 'name';
  const value = operation === 'child' 
    ? parts[1].slice(6, -1).trim() 
    : parts[1];

  return {
    variable: parts[0],
    operation,
    value
  };
}

export function parseDirectoryStructure(text: string): DirectoryNode | null {
  if (!text.trim()) return null;

  console.log("Parsing text:", text);
  const lines = text.split('\n');
  const variables: VariableMap = {};
  let rootNode: DirectoryNode | null = null;

  // First pass: Create all nodes and handle name assignments
  lines.forEach((line, index) => {
    const parsed = parseLine(line);
    if (!parsed) return;

    console.log(`Line ${index + 1}: Parsed as ${parsed.operation}`, parsed);

    if (parsed.operation === 'name') {
      if (!variables[parsed.variable]) {
        variables[parsed.variable] = {
          name: parsed.value,
          children: [],
          level: parsed.variable === 'level0' ? 0 : -1
        };
      } else {
        variables[parsed.variable].name = parsed.value;
      }
    }
  });

  // Second pass: Build relationships
  lines.forEach((line, index) => {
    const parsed = parseLine(line);
    if (!parsed || parsed.operation !== 'child') return;

    console.log(`Line ${index + 1}: Processing child relationship for ${parsed.variable}`);
    
    const parent = variables[parsed.variable];
    if (!parent) {
      console.log(`Warning: Parent variable "${parsed.variable}" not found`);
      return;
    }

    const childNames = parsed.value.split(/[,\s]+/).filter(Boolean);
    console.log(`Child names for ${parsed.variable}:`, childNames);
    
    childNames.forEach(childName => {
      if (!variables[childName]) {
        variables[childName] = {
          name: childName,
          children: [],
          level: parent.level + 1
        };
      }
      const childNode = variables[childName];
      childNode.level = parent.level + 1;
      
      // Avoid duplicate children
      if (!parent.children.some(child => child.name === childNode.name)) {
        parent.children.push(childNode);
      }
    });
  });

  // Find root node (level0)
  rootNode = variables['level0'] || null;

  // If we have a root node but it doesn't have a name, use its variable name
  if (rootNode && !rootNode.name) {
    rootNode.name = 'level0';
  }

  console.log("Parsed variables:", Object.keys(variables));
  console.log("Root node:", rootNode);

  return rootNode;
} 