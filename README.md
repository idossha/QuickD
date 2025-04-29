# QuickDir

A visual directory structure generator and visualizer that helps you plan and document your project's folder structure.

![QuickDir Screenshot](public/screenshot.png)

## Features

- Easy-to-use directory structure editor with syntax highlighting
- Visual directory tree representation with custom icons
- Export your structure as JSON or TXT
- Debug mode for visualization of parsed structures
- Support for both modern tree view and simple list view

## Technologies

- React 19
- TypeScript 5
- Material UI 7
- CodeMirror for code editing
- Vite for development and building

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/QuickDir.git
cd QuickDir
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server using either of these commands:

```bash
npm start
# or
npm run dev
```

This will start the application at `http://localhost:5173`.

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

This project is set up for easy deployment to GitHub Pages.

### Automated Deployment

This repository is configured with GitHub Actions to automatically deploy to GitHub Pages whenever changes are pushed to the main branch. The live site will be updated automatically.

The GitHub Action workflow:
1. Checks out the code
2. Sets up Node.js
3. Installs dependencies
4. Builds the project
5. Deploys to GitHub Pages

You can view the workflow file at `.github/workflows/deploy.yml`.

### Manual Deployment

If you need to deploy manually:

1. Make sure your changes are committed to Git
2. Run the deployment command:

```bash
npm run deploy
```

3. The site will be deployed to: `https://idossha.github.io/QuickD/`

### Deployment Workflow

When you make changes to the app, follow these steps to update the live site:

1. Make and test your changes locally using `npm run dev`
2. Commit your changes to git:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. The site will be automatically deployed via GitHub Actions, or you can deploy manually:
   ```bash
   npm run deploy
   ```

The deployment process automatically:
- Builds your project with the correct base path
- Pushes the built files to the `gh-pages` branch
- Updates your live site

## Usage

1. Define your directory structure in the editor using the syntax:
   - `variable = name` to define a node with a specific name
   - `parent = child(child1 child2)` to define parent-child relationships

2. Example structure:
```
level0 = MyProject
level0 = child(src docs tests)

src = child(components utils types)
components = child(Button Header)
utils = child(helpers constants)
```

3. Export your structure as JSON or TXT using the buttons at the bottom of the tree view.

## Project Structure

```
QuickDir/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions and helpers
└── ...              # Configuration files
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
