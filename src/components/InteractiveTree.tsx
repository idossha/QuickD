import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, Typography, IconButton, TextField, 
  Tooltip, Snackbar, Alert
} from '@mui/material';
import {
  Edit, Delete,
  CreateNewFolder, NoteAdd
} from '@mui/icons-material';
import { getNodeIcon } from '../utils/iconMapping';
import { DirectoryNode } from '../types/types';
import {
  updateNodeName,
  deleteNode,
  addNode
} from '../utils/treeManipulation';

const TreeContainer = styled(Box)({
  padding: '12px',
  height: '100%',
  overflowY: 'auto',
});

const NodeContainer = styled(Box)({
  marginLeft: '24px',
  borderLeft: '1px dashed #ccc',
  paddingLeft: '12px',
});

const NodeWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 4px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    '& .node-actions': {
      opacity: 1,
    },
  },
});

const NodeActions = styled(Box)({
  display: 'flex',
  gap: '4px',
  opacity: 0,
  transition: 'opacity 0.2s',
});

interface TreeNodeProps {
  node: DirectoryNode;
  depth: number;
  onUpdate: (newTree: DirectoryNode) => void;
  parentTree: DirectoryNode;
  onError: (message: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  node, depth, onUpdate, parentTree, onError
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.name);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleRename = () => {
    if (editValue.trim() && editValue !== node.name) {
      try {
        const newTree = updateNodeName(parentTree, `${depth}-${node.name}`, editValue.trim());
        onUpdate(newTree);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Failed to rename node');
        setEditValue(node.name); // Reset to original name
      }
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    try {
      // Don't allow deleting the root node
      if (depth === 0) {
        onError("Cannot delete the root node");
        return;
      }
      const newTree = deleteNode(parentTree, `${depth}-${node.name}`);
      onUpdate(newTree);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to delete node');
    }
  };

  const handleAddChild = (type: 'file' | 'folder') => {
    try {
      const newTree = addNode(parentTree, `${depth}-${node.name}`, type);
      onUpdate(newTree);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to add node');
    }
  };

  const isDirectory = node.children && node.children.length > 0;
  const icon = getNodeIcon(node.name, isDirectory);

  return (
    <Box>
      <NodeWrapper>
        {icon}
        
        {isEditing ? (
          <TextField
            size="small"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
            sx={{ minWidth: 120 }}
          />
        ) : (
          <Typography
            variant="body2"
            onDoubleClick={handleDoubleClick}
            sx={{ flex: 1, cursor: 'pointer' }}
          >
            {node.name}
          </Typography>
        )}

        <NodeActions className="node-actions">
          <Tooltip title="Rename">
            <IconButton size="small" onClick={() => setIsEditing(true)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Folder">
            <IconButton size="small" onClick={() => handleAddChild('folder')}>
              <CreateNewFolder fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add File">
            <IconButton size="small" onClick={() => handleAddChild('file')}>
              <NoteAdd fontSize="small" />
            </IconButton>
          </Tooltip>
          {depth !== 0 && (
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </NodeActions>
      </NodeWrapper>

      {node.children && node.children.length > 0 && (
        <NodeContainer>
          {node.children.map((child, index) => (
            <TreeNode
              key={`${depth}-${child.name}-${index}`}
              node={child}
              depth={depth + 1}
              onUpdate={onUpdate}
              parentTree={parentTree}
              onError={onError}
            />
          ))}
        </NodeContainer>
      )}
    </Box>
  );
};

interface InteractiveTreeProps {
  data: DirectoryNode | null;
  onUpdate: (newTree: DirectoryNode) => void;
}

const InteractiveTree: React.FC<InteractiveTreeProps> = ({ data, onUpdate }) => {
  const [error, setError] = useState<string | null>(null);

  if (!data) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: 'text.secondary'
      }}>
        No directory structure available
      </Box>
    );
  }

  return (
    <TreeContainer>
      <TreeNode
        node={data}
        depth={0}
        onUpdate={onUpdate}
        parentTree={data}
        onError={setError}
      />
      <Snackbar 
        open={!!error} 
        autoHideDuration={4000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </TreeContainer>
  );
};

export default InteractiveTree; 