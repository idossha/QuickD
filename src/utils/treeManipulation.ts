import { DirectoryNode } from '../types/types';

function validateNodeName(name: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(name);
}

function updateLevels(node: DirectoryNode, level: number): DirectoryNode {
  return {
    ...node,
    level,
    children: node.children.map(child => updateLevels(child, level + 1))
  };
}

export function findNodeById(tree: DirectoryNode, id: string): DirectoryNode | null {
  const [depth, name] = id.split('-');
  const currentDepth = parseInt(depth);

  if (currentDepth === tree.level && tree.name === name) {
    return tree;
  }

  for (const child of tree.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }

  return null;
}

export function updateNodeName(tree: DirectoryNode, id: string, newName: string): DirectoryNode {
  if (!validateNodeName(newName)) {
    throw new Error('Invalid node name. Use only letters, numbers, underscores, and hyphens.');
  }

  const [depth, name] = id.split('-');
  const currentDepth = parseInt(depth);

  if (currentDepth === tree.level && tree.name === name) {
    return { ...tree, name: newName };
  }

  return {
    ...tree,
    children: tree.children.map(child => updateNodeName(child, id, newName))
  };
}

export function deleteNode(tree: DirectoryNode, id: string): DirectoryNode {
  const [depth, name] = id.split('-');
  const currentDepth = parseInt(depth);

  // If this is the parent of the node to delete
  if (tree.level === currentDepth - 1) {
    return {
      ...tree,
      children: tree.children.filter(child => child.name !== name)
    };
  }

  // If this is not the parent, recurse through children
  return {
    ...tree,
    children: tree.children.map(child => deleteNode(child, id))
  };
}

export function addNode(
  tree: DirectoryNode, 
  parentId: string, 
  type: 'file' | 'folder'
): DirectoryNode {
  const [depth, name] = parentId.split('-');
  const currentDepth = parseInt(depth);

  if (currentDepth === tree.level && tree.name === name) {
    const newName = type === 'folder' ? 'new_folder' : 'new_file';
    let suffix = 1;
    const existingNames = new Set(tree.children.map(child => child.name));
    
    // Find a unique name
    while (existingNames.has(`${newName}${suffix}`)) {
      suffix++;
    }

    const newNode: DirectoryNode = {
      name: `${newName}${suffix}`,
      children: [],
      level: tree.level + 1
    };

    // Sort children by name after adding the new node
    const newChildren = [...tree.children, newNode]
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      ...tree,
      children: newChildren
    };
  }

  return {
    ...tree,
    children: tree.children.map(child => addNode(child, parentId, type))
  };
}

export function moveNode(
  tree: DirectoryNode,
  sourceId: string,
  targetId: string
): DirectoryNode {
  const sourceNode = findNodeById(tree, sourceId);
  if (!sourceNode) return tree;

  // First remove the source node
  const treeWithoutSource = deleteNode(tree, sourceId);
  if (!treeWithoutSource) return tree;

  // Then add it to the target location with its children
  const [targetDepth, targetName] = targetId.split('-');
  const targetLevel = parseInt(targetDepth);

  const addNodeWithChildren = (baseTree: DirectoryNode): DirectoryNode => {
    if (baseTree.level === targetLevel && baseTree.name === targetName) {
      const updatedSourceNode = updateLevels(sourceNode, baseTree.level + 1);
      return {
        ...baseTree,
        children: [...baseTree.children, updatedSourceNode]
          .sort((a, b) => a.name.localeCompare(b.name))
      };
    }

    return {
      ...baseTree,
      children: baseTree.children.map(child => addNodeWithChildren(child))
    };
  };

  return addNodeWithChildren(treeWithoutSource);
}

export function treeToCode(tree: DirectoryNode): string {
  const lines: string[] = [];
  
  function processNode(node: DirectoryNode) {
    if (node.children.length === 0) {
      lines.push(node.name);
    } else {
      // Sort children by name for consistent output
      const sortedChildren = [...node.children].sort((a, b) => a.name.localeCompare(b.name));
      const childrenStr = sortedChildren.map(child => child.name).join(', ');
      lines.push(`${node.name}(${childrenStr})`);
      
      // Process children in sorted order
      sortedChildren.forEach(child => processNode(child));
    }
  }
  
  processNode(tree);
  return lines.join('\n');
} 