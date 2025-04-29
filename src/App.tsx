import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { styled } from '@mui/material/styles';
import { 
  Box, Paper, Typography, Button, Switch, FormControlLabel, 
  Tooltip
} from '@mui/material';
import {
  Code as CodeIcon, TextSnippet, 
  Refresh, BugReport,
  Image as ImageIcon
} from '@mui/icons-material';
import TreeDebugger from './components/TreeDebugger';
import { parseDirectoryStructure } from './utils/parser';
import { directoryLanguageSupport } from './utils/directoryLanguage';
import html2canvas from 'html2canvas';
import InteractiveTree from './components/InteractiveTree';
import { treeToCode } from './utils/treeManipulation';
import { DirectoryNode } from './types/types';

const Container = styled(Box)({
  display: 'flex',
  height: '100vh',
  padding: '20px',
  gap: '20px',
  backgroundColor: '#f5f5f5',
});

const EditorContainer = styled(Paper)({
  flex: '0 0 40%',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  overflow: 'hidden',
});

const TreeContainer = styled(Paper)({
  flex: '0 0 55%',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  overflow: 'hidden',
});

const TreeViewWrapper = styled(Box)({
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

// For debugging
const DebugInfo = styled(Box)({
  padding: '10px',
  marginTop: '10px',
  backgroundColor: '#f0f0f0',
  borderRadius: '4px',
  fontSize: '12px',
  color: '#666',
  maxHeight: '80px',
  overflow: 'auto',
});

const ControlsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
});

const ExportButtonsContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  marginTop: '10px',
});

const simpleExample = `// Simple Example
// Try this basic structure first

MyProject(src, docs)
src(components)
components(Button, Header)`;

const initialCode = `// QuickDir - Directory Structure Visualizer
// Define your project structure below:

my_project(src, docs, tests)
src(components, utils, types)
components(ui, core)
utils(helpers, constants)
docs(api, guides, examples)
tests(unit, integration, e2e)`;

function App() {
  const [code, setCode] = useState(initialCode);
  const [tree, setTree] = useState(parseDirectoryStructure(initialCode));
  const [debug, setDebug] = useState<string>("");
  const [showDebug, setShowDebug] = useState(false);
  const treeRef = useRef<HTMLDivElement>(null);
  const [isUpdatingFromTree, setIsUpdatingFromTree] = useState(false);

  // Update tree when code changes
  useEffect(() => {
    if (!isUpdatingFromTree) {
      try {
        const newTree = parseDirectoryStructure(code);
        if (!newTree) {
          setDebug("Failed to parse tree structure");
        } else {
          setDebug(`Tree parsed successfully: Root is '${newTree.name}' with ${newTree.children.length} children`);
          setTree(newTree);
        }
      } catch (error) {
        console.error("Error parsing tree:", error);
        setDebug(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    setIsUpdatingFromTree(false);
  }, [code, isUpdatingFromTree]);

  const handleTreeUpdate = (newTree: DirectoryNode) => {
    setIsUpdatingFromTree(true);
    setTree(newTree);
    
    try {
      const newCode = treeToCode(newTree);
      setCode(newCode);
      setDebug("Tree structure updated successfully");
    } catch (error) {
      console.error("Error converting tree to code:", error);
      setDebug(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const exportAsJSON = () => {
    if (!tree) return;
    
    const dataStr = "data:text/json;charset=utf-8," 
      + encodeURIComponent(JSON.stringify(tree, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "directory_structure.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportAsTXT = () => {
    if (!tree) return;
    
    // Convert the tree to a text representation
    const lines: string[] = [];
    const traverseNode = (node: any, depth: number) => {
      const indent = "  ".repeat(depth);
      lines.push(`${indent}- ${node.name}`);
      node.children.forEach((child: any) => traverseNode(child, depth + 1));
    };
    
    traverseNode(tree, 0);
    const dataStr = "data:text/plain;charset=utf-8," 
      + encodeURIComponent(lines.join('\n'));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "directory_structure.txt");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportAsPNG = async () => {
    if (!treeRef.current || !tree) return;
    
    try {
      // Create a clone of the tree container to manipulate
      const treeContainer = treeRef.current.cloneNode(true) as HTMLElement;
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '-9999px';
      wrapper.appendChild(treeContainer);
      document.body.appendChild(wrapper);

      // Reset scroll position and expand the container
      treeContainer.style.height = 'auto';
      treeContainer.style.width = 'fit-content';
      treeContainer.style.overflow = 'visible';

      // Render to canvas
      const canvas = await html2canvas(treeContainer, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        windowWidth: treeContainer.scrollWidth,
        windowHeight: treeContainer.scrollHeight,
        width: treeContainer.scrollWidth,
        height: treeContainer.scrollHeight
      });
      
      // Clean up
      document.body.removeChild(wrapper);
      
      // Download
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = 'directory_structure.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error exporting as PNG:', error);
      setDebug(`Error exporting as PNG: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const setSimpleExample = () => {
    setCode(simpleExample);
  };

  return (
    <Container>
      <EditorContainer elevation={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Directory Structure Editor</Typography>
          <Tooltip title="Load a simple example structure">
            <Button 
              variant="outlined" 
              size="small" 
              onClick={setSimpleExample}
              startIcon={<Refresh />}
            >
              Load Example
            </Button>
          </Tooltip>
        </Box>
        <CodeMirror
          value={code}
          height="100%"
          theme={oneDark}
          extensions={[directoryLanguageSupport()]}
          onChange={(value) => setCode(value)}
          style={{ flex: 1 }}
        />
      </EditorContainer>
      <TreeContainer elevation={3}>
        <ControlsContainer>
          <Typography variant="h6">Directory Tree</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Show debug information">
              <FormControlLabel
                control={
                  <Switch 
                    checked={showDebug}
                    onChange={(e) => setShowDebug(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <BugReport fontSize="small" />
                    <Typography variant="caption">Debug</Typography>
                  </Box>
                }
                labelPlacement="start"
              />
            </Tooltip>
          </Box>
        </ControlsContainer>
        <TreeViewWrapper ref={treeRef}>
          <InteractiveTree data={tree} onUpdate={handleTreeUpdate} />
          {showDebug && tree && <TreeDebugger data={tree} />}
        </TreeViewWrapper>
        {showDebug && <DebugInfo>{debug}</DebugInfo>}
        <ExportButtonsContainer>
          <Tooltip title="Export as JSON file">
            <Button 
              variant="contained" 
              color="primary" 
              onClick={exportAsJSON}
              startIcon={<CodeIcon />}
              fullWidth
            >
              Export JSON
            </Button>
          </Tooltip>
          <Tooltip title="Export as text file">
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={exportAsTXT}
              startIcon={<TextSnippet />}
              fullWidth
            >
              Export TXT
            </Button>
          </Tooltip>
          <Tooltip title="Export as PNG image">
            <Button 
              variant="contained" 
              color="info" 
              onClick={exportAsPNG}
              startIcon={<ImageIcon />}
              fullWidth
            >
              Export PNG
            </Button>
          </Tooltip>
        </ExportButtonsContainer>
      </TreeContainer>
    </Container>
  );
}

export default App;
