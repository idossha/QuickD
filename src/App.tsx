import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { styled } from '@mui/material/styles';
import { 
  Box, Paper, Typography, Button, Switch, FormControlLabel, 
  Tooltip, IconButton
} from '@mui/material';
import {
  FileDownload, Code as CodeIcon, TextSnippet, 
  Refresh, ViewList, BugReport
} from '@mui/icons-material';
import DirectoryTree from './components/DirectoryTree';
import FallbackTree from './components/FallbackTree';
import TreeDebugger from './components/TreeDebugger';
import { parseDirectoryStructure } from './utils/parser';
import { directoryLanguageSupport } from './utils/directoryLanguage';

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

const ButtonContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  marginTop: '10px',
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

const simpleExample = `// Simple Example
// Try this basic structure first

level0 = MyProject
level0 = child(src docs)

src = child(components)
components = child(Button Header)`;

const initialCode = `// QuickDir - Directory Structure Visualizer
// Define your project structure below:

level0 = my_project
level0 = child(src docs tests)

src = child(components utils types)
components = child(ui core)
utils = child(helpers constants)

docs = child(api guides examples)
tests = child(unit integration e2e)`;

function App() {
  const [code, setCode] = useState(initialCode);
  const [tree, setTree] = useState(parseDirectoryStructure(initialCode));
  const [debug, setDebug] = useState<string>("");
  const [showDebug, setShowDebug] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    try {
      const newTree = parseDirectoryStructure(code);
      console.log("Parsed tree:", newTree);
      
      if (!newTree) {
        setDebug("Failed to parse tree structure");
      } else {
        setDebug(`Tree parsed successfully: Root is '${newTree.name}' with ${newTree.children.length} children`);
      }
      
      setTree(newTree);
    } catch (error) {
      console.error("Error parsing tree:", error);
      setDebug(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [code]);

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
            <Tooltip title="Switch between tree view styles">
              <FormControlLabel
                control={
                  <Switch 
                    checked={useFallback}
                    onChange={(e) => setUseFallback(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <ViewList fontSize="small" />
                    <Typography variant="caption">Simple View</Typography>
                  </Box>
                }
                labelPlacement="start"
              />
            </Tooltip>
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
        <TreeViewWrapper>
          {useFallback 
            ? <FallbackTree data={tree} />
            : <DirectoryTree data={tree} />
          }
          {showDebug && tree && <TreeDebugger data={tree} />}
        </TreeViewWrapper>
        {showDebug && <DebugInfo>{debug}</DebugInfo>}
        <ButtonContainer>
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
        </ButtonContainer>
      </TreeContainer>
    </Container>
  );
}

export default App;
