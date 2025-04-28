import React from 'react';
import { TreeView, TreeItem } from '@mui/lab';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { DirectoryNode } from '../types/types';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { getNodeIcon } from '../utils/iconMapping.tsx';

const StyledTreeView = styled(TreeView)({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '8px',
});

const StyledTreeItem = styled(TreeItem)({
  '& .MuiTreeItem-content': {
    padding: '6px 8px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  '& .MuiTreeItem-label': {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '2px 0',
  },
  '& .MuiTreeItem-iconContainer': {
    marginRight: '4px',
  },
  '& .MuiTreeItem-group': {
    marginLeft: '24px',
    borderLeft: '1px dashed rgba(0, 0, 0, 0.2)',
    paddingLeft: '8px',
  },
});

const NodeContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
});

const NodeText = styled(Typography)({
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const EmptyState = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: '#666',
  fontSize: '14px',
  flexDirection: 'column',
  padding: '20px',
  textAlign: 'center',
});

interface DirectoryTreeProps {
  data: DirectoryNode | null;
}

const DirectoryTree: React.FC<DirectoryTreeProps> = ({ data }) => {
  if (!data) {
    return <EmptyState>No directory structure available</EmptyState>;
  }

  // Simple function to generate IDs
  const getNodeId = (node: DirectoryNode, path: string = '') => {
    return `${path}-${node.name}`;
  };

  // Recursive function to render tree items
  const renderTree = (node: DirectoryNode, path: string = '') => {
    const nodeId = getNodeId(node, path);
    const isDirectory = node.children && node.children.length > 0;
    const icon = getNodeIcon(node.name, isDirectory);

    return (
      <StyledTreeItem
        key={nodeId}
        nodeId={nodeId}
        label={
          <NodeContent>
            {icon}
            <NodeText variant="body2">{node.name}</NodeText>
          </NodeContent>
        }
      >
        {Array.isArray(node.children) && 
          node.children.map((child) => renderTree(child, nodeId))}
      </StyledTreeItem>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <StyledTreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        defaultExpanded={['', '-' + data.name]}
      >
        {renderTree(data)}
      </StyledTreeView>
    </Box>
  );
};

export default DirectoryTree; 