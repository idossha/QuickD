import React from 'react';
import {
  // Folders
  Folder, FolderOpen, 
  // Files
  Code, Javascript, Html, InsertDriveFile, Description, 
  // Special folders
  Storage, Api, Settings, Build, Image, Public, Dataset,
  // Development
  CloudQueue, Devices, Architecture, Language, Extension, 
  // Testing
  BugReport, VpnKey, QueryStats, Search, 
  // Media
  AudioFile, VideoFile, TextSnippet, PictureAsPdf, Article,
  // Config
  Lock, BusinessCenter, Cable, StyleOutlined
} from '@mui/icons-material';

// Map of folder names to custom icons
const folderIconMap: Record<string, React.ReactElement> = {
  // General
  node_modules: <Storage fontSize="small" color="action" />,
  public: <Public fontSize="small" color="action" />,
  dist: <Build fontSize="small" color="action" />,
  build: <Build fontSize="small" color="action" />,
  assets: <BusinessCenter fontSize="small" color="action" />,
  
  // Development
  src: <Code fontSize="small" color="primary" />,
  components: <Extension fontSize="small" color="primary" />,
  hooks: <Architecture fontSize="small" color="primary" />,
  context: <CloudQueue fontSize="small" color="primary" />,
  redux: <Storage fontSize="small" color="primary" />,
  utils: <Cable fontSize="small" color="action" />,
  helpers: <Cable fontSize="small" color="action" />,
  
  // Documentation
  docs: <Article fontSize="small" color="action" />,
  documentation: <Article fontSize="small" color="action" />,
  
  // Config
  config: <Settings fontSize="small" color="action" />,
  settings: <Settings fontSize="small" color="action" />,
  
  // Testing
  tests: <BugReport fontSize="small" color="action" />,
  test: <BugReport fontSize="small" color="action" />,
  "__tests__": <BugReport fontSize="small" color="action" />,
  e2e: <QueryStats fontSize="small" color="action" />,
  
  // Media
  images: <Image fontSize="small" color="action" />,
  img: <Image fontSize="small" color="action" />,
  icons: <Image fontSize="small" color="action" />,
  media: <VideoFile fontSize="small" color="action" />,
  audio: <AudioFile fontSize="small" color="action" />,
  videos: <VideoFile fontSize="small" color="action" />,
  
  // Data
  types: <Dataset fontSize="small" color="action" />,
  interfaces: <Dataset fontSize="small" color="action" />,
  models: <Dataset fontSize="small" color="action" />,
  schemas: <Dataset fontSize="small" color="action" />,
  api: <Api fontSize="small" color="action" />,
  
  // Styling
  styles: <StyleOutlined fontSize="small" color="action" />,
  css: <StyleOutlined fontSize="small" color="action" />,
  sass: <StyleOutlined fontSize="small" color="action" />,
  scss: <StyleOutlined fontSize="small" color="action" />,
  less: <StyleOutlined fontSize="small" color="action" />,
  themes: <StyleOutlined fontSize="small" color="action" />,
};

// Map of file extensions to custom icons
const fileIconMap: Record<string, React.ReactElement> = {
  // JavaScript/TypeScript
  js: <Javascript fontSize="small" color="warning" />,
  jsx: <Javascript fontSize="small" color="warning" />,
  ts: <Javascript fontSize="small" color="info" />,
  tsx: <Javascript fontSize="small" color="info" />,
  
  // HTML/CSS
  html: <Html fontSize="small" color="error" />,
  htm: <Html fontSize="small" color="error" />,
  css: <StyleOutlined fontSize="small" color="primary" />,
  scss: <StyleOutlined fontSize="small" color="primary" />,
  sass: <StyleOutlined fontSize="small" color="primary" />,
  
  // Documents
  md: <TextSnippet fontSize="small" color="action" />,
  txt: <TextSnippet fontSize="small" color="action" />,
  pdf: <PictureAsPdf fontSize="small" color="error" />,
  doc: <Description fontSize="small" color="primary" />,
  docx: <Description fontSize="small" color="primary" />,
  
  // Config
  json: <Code fontSize="small" color="action" />,
  yaml: <Code fontSize="small" color="action" />,
  yml: <Code fontSize="small" color="action" />,
  xml: <Code fontSize="small" color="action" />,
  
  // Security
  env: <Lock fontSize="small" color="error" />,
  lock: <Lock fontSize="small" color="action" />,
  key: <VpnKey fontSize="small" color="error" />,
};

// Function to get icon for a node
export function getNodeIcon(nodeName: string, isDirectory: boolean, isOpen = false): React.ReactElement {
  try {
    if (isDirectory) {
      // Get folder name in lowercase for comparison
      const folderName = nodeName.toLowerCase();
      
      // Check if we have a custom icon for this folder
      if (folderIconMap[folderName]) {
        return folderIconMap[folderName];
      }
      
      // Default folder icon (open or closed)
      return isOpen ? 
        <FolderOpen fontSize="small" color="action" /> : 
        <Folder fontSize="small" color="action" />;
    } else {
      // For files, check if we recognize the extension
      const extension = nodeName.split('.').pop()?.toLowerCase();
      
      if (extension && fileIconMap[extension]) {
        return fileIconMap[extension];
      }
      
      // Default file icon
      return <InsertDriveFile fontSize="small" color="action" />;
    }
  } catch (error) {
    console.error('Error getting icon:', error);
    return isDirectory ? 
      <Folder fontSize="small" color="action" /> : 
      <InsertDriveFile fontSize="small" color="action" />;
  }
} 