import { DirectoryNode } from '../types/types';

interface ParsedNode {
  name: string;
  children: string[];
}

function parseNodeLine(line: string): ParsedNode | null {
  // Skip comments and empty lines
  if (line.trim().startsWith('//') || !line.trim()) {
    return null;
  }

  // Match pattern: name(child1, child2, ...)
  const match = line.match(/^([a-zA-Z0-9_-]+)(?:\((.*)\))?$/);
  if (!match) return null;

  const [, name, childrenStr] = match;
  const children = childrenStr 
    ? childrenStr.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return { name, children };
}

export function parseDirectoryStructure(text: string): DirectoryNode | null {
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !line.startsWith('//'));

  if (lines.length === 0) return null;

  // First, parse all lines into node definitions
  const nodeDefinitions = new Map<string, string[]>();
  
  for (const line of lines) {
    const parsed = parseNodeLine(line);
    if (parsed) {
      nodeDefinitions.set(parsed.name, parsed.children);
    }
  }

  // Build the tree starting from root
  const buildNode = (name: string, level: number, visited = new Set<string>()): DirectoryNode => {
    if (visited.has(name)) {
      console.error(`Circular reference detected for node: ${name}`);
      return { name, children: [], level };
    }

    visited.add(name);
    const children = (nodeDefinitions.get(name) || []).map(childName => 
      buildNode(childName, level + 1, new Set(visited))
    );

    return { name, children, level };
  };

  // The first node is always the root
  const firstNode = parseNodeLine(lines[0]);
  if (!firstNode) {
    return null;
  }

  return buildNode(firstNode.name, 0);
}

export function treeToCode(tree: DirectoryNode): string {
  const lines: string[] = [];

  function processNode(node: DirectoryNode) {
    if (node.children.length === 0) {
      lines.push(`${node.name}`);
    } else {
      const childrenStr = node.children.map(child => child.name).join(', ');
      lines.push(`${node.name}(${childrenStr})`);
      node.children.forEach(processNode);
    }
  }

  processNode(tree);
  return lines.join('\n');
} 