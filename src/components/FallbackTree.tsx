import React from 'react';
import { DirectoryNode } from '../types/types';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { getNodeIcon } from '../utils/iconMapping.tsx';

const TreeContainer = styled(Box)({
  padding: '12px',
  height: '100%',
  overflowY: 'auto',
  fontFamily: 'monospace',
});

const TreeNodeContainer = styled(Box)({
  marginLeft: '24px',
  borderLeft: '1px dashed #ccc',
  paddingLeft: '12px',
});

const NodeLabel = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '6px 4px',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const NodeText = styled(Typography)({
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

interface FallbackTreeProps {
  data: DirectoryNode | null;
}

const FallbackTree: React.FC<FallbackTreeProps> = ({ data }) => {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  if (!data) {
    return (
      <Box 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          color: 'text.secondary'
        }}
      >
        No directory structure available
      </Box>
    );
  }

  const toggleNode = (nodeId: string) => {
    setExpanded(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const renderNode = (node: DirectoryNode, path: string = '') => {
    const nodeId = `${path}-${node.name}`;
    const isDirectory = node.children && node.children.length > 0;
    const isExpanded = expanded[nodeId] !== false; // Default to expanded
    const icon = getNodeIcon(node.name, isDirectory);
    const chevron = isDirectory ? (
      isExpanded ? 
        <ExpandMore fontSize="small" color="action" /> : 
        <ChevronRight fontSize="small" color="action" />
    ) : null;

    return (
      <Box key={nodeId}>
        <NodeLabel onClick={() => isDirectory && toggleNode(nodeId)}>
          {chevron}
          {icon}
          <NodeText variant="body2">{node.name}</NodeText>
        </NodeLabel>
        
        {isDirectory && isExpanded && (
          <TreeNodeContainer>
            {node.children.map(child => renderNode(child, nodeId))}
          </TreeNodeContainer>
        )}
      </Box>
    );
  };

  return (
    <TreeContainer>
      {renderNode(data)}
    </TreeContainer>
  );
};

export default FallbackTree; 