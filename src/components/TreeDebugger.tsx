import React from 'react';
import { DirectoryNode } from '../types/types';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const DebugContainer = styled(Paper)({
  padding: '10px',
  marginTop: '10px',
  fontSize: '12px',
  backgroundColor: '#f8f8f8',
  color: '#333',
  overflowX: 'auto',
  maxHeight: '150px',
});

const NodeInfo = styled(Box)({
  marginLeft: '20px',
  borderLeft: '1px solid #ccc',
  paddingLeft: '10px',
});

interface TreeDebuggerProps {
  data: DirectoryNode | null;
  title?: string;
}

const TreeDebugger: React.FC<TreeDebuggerProps> = ({ data, title = "Tree Structure" }) => {
  if (!data) {
    return (
      <DebugContainer>
        <Typography variant="caption" color="error">
          No tree data available
        </Typography>
      </DebugContainer>
    );
  }

  const renderNode = (node: DirectoryNode, depth = 0) => {
    const indent = '  '.repeat(depth);
    
    return (
      <div key={`${node.name}-debug-${depth}`}>
        <div>{indent}• {node.name} (Level: {node.level})</div>
        <NodeInfo>
          {Array.isArray(node.children) && node.children.map(child => 
            renderNode(child, depth + 1)
          )}
          {(!Array.isArray(node.children) || node.children.length === 0) && 
            <div style={{ color: '#888', fontSize: '11px' }}>{indent}  (No children)</div>
          }
        </NodeInfo>
      </div>
    );
  };

  return (
    <DebugContainer>
      <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
        {title}
      </Typography>
      <Box sx={{ fontFamily: 'monospace' }}>
        {renderNode(data)}
      </Box>
    </DebugContainer>
  );
};

export default TreeDebugger; 