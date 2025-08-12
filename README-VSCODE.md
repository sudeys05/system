# VS Code Development Setup - Police Management System

This project is fully configured for VS Code development with all features intact.

## 🚀 Quick Start with VS Code

1. **Open in VS Code**: Open this folder in VS Code
2. **Install Recommended Extensions**: VS Code will prompt you to install recommended extensions
3. **Start Development**: Press `Ctrl+Shift+P` and run "Tasks: Run Task" → "Start Development Server"
4. **Navigate to App**: Open http://localhost:5000 in your browser

**Windows Users**: The server automatically uses `localhost` instead of `0.0.0.0` to avoid socket binding issues.

## 🔧 VS Code Configuration

### Debugging
- **F5**: Launch full stack (server + client debugging)
- **Server Debug**: Debug Node.js/Express backend
- **Client Debug**: Debug React frontend in Chrome

### Tasks Available
- `Ctrl+Shift+P` → "Tasks: Run Task"
  - **Start Development Server**: Launch the app
  - **Build Project**: Build for production
  - **Database Push**: Push database schema changes
  - **Type Check**: Run TypeScript type checking

### Extensions Configured
- **Tailwind CSS IntelliSense**: Auto-complete for CSS classes
- **Prettier**: Code formatting on save
- **TypeScript**: Enhanced JavaScript/TypeScript support
- **Auto Rename Tag**: Automatically rename paired HTML/JSX tags
- **Path Intellisense**: Auto-complete file paths

## 📁 Project Structure (VS Code Optimized)

```
├── .vscode/                 # VS Code configuration
│   ├── settings.json       # Editor settings
│   ├── launch.json         # Debug configuration
│   ├── tasks.json          # Build tasks
│   └── extensions.json     # Recommended extensions
├── client/                 # React frontend
│   ├── src/               # Source files
│   └── index.html         # Entry point
├── server/                # Node.js backend
│   ├── index.ts          # Main server file
│   ├── routes.js         # API routes
│   └── vite.js           # Vite integration
├── shared/               # Shared code/schemas
└── package.json         # Dependencies
```

## 💻 Development Workflow

### Starting Development
1. Open VS Code in project folder
2. Press `F5` to start debugging, or
3. Use `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Development Server"
4. Navigate to `http://localhost:5000`

### Code Formatting
- **Auto-format on save** enabled
- **Prettier** configured for consistent styling
- **Tailwind CSS** classes auto-sorted

### Debugging Features
- **Breakpoints** in both frontend and backend
- **Live reload** with Vite for instant updates
- **Source maps** for debugging compiled code
- **Console integration** for server logs

## 🔍 Key Features Available in VS Code

### Backend (Node.js + Express)
- Full debugging support with breakpoints
- Auto-restart on file changes
- Environment variable management
- Database integration with Drizzle ORM

### Frontend (React + Vite)
- Hot module replacement (HMR)
- JSX syntax highlighting and IntelliSense
- Component auto-imports
- Tailwind CSS class suggestions

### Full Stack Features
- **Case Management**: Complete CRUD operations
- **Officer Profiles**: Role-based access control
- **Police Vehicle Tracking**: Interactive maps
- **Database Integration**: PostgreSQL with Drizzle ORM
- **Authentication System**: Session-based auth
- **File Management**: Geofiles and evidence handling

## 🛠 Troubleshooting

### Common Issues
1. **Extensions not installed**: Accept the prompt to install recommended extensions
2. **Debugging not working**: Ensure tasks are running (`Ctrl+Shift+P` → Tasks)
3. **IntelliSense issues**: Reload VS Code window (`Ctrl+Shift+P` → "Developer: Reload Window")

### Performance Tips
- Use `Ctrl+Shift+P` → "TypeScript: Restart TS Server" if IntelliSense is slow
- Enable "Format on Save" in settings for consistent code style
- Use the integrated terminal for npm commands

## 📋 Available Scripts (VS Code Tasks)

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run db:push` - Update database schema
- `npm run check` - TypeScript type checking

All scripts are available through VS Code's task runner for easy access.