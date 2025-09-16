# PathWise-AI

![Pathwise](Pathwise.png)

PathWise-AI is an interactive career guidance platform designed to help Nigerian graduates and job seekers explore career paths, build relevant skills, and complete hands-on projects. The platform provides curated learning roadmaps, assessments, and project workspaces for various tech and professional roles.

## Features

- **Career Roadmaps:** Step-by-step skill trees for roles like Frontend Developer, Backend Developer, Fullstack Developer, Product Designer, and more.
- **Skill Assessments:** Interactive quizzes to validate your knowledge and earn certificates.
- **Project Workspaces:** Guided, real-world projects with code editors and progress tracking.
- **Resource Library:** Curated links to top learning materials for each skill.
- **AI Agent Integration:** Powered by AIQ toolkit for intelligent career guidance and recommendations.
- **Responsive UI:** Built with React, Tailwind CSS, and Vite for fast, modern web experience.

## Folder Structure

```
PathWise-frontend/
├── public/
│   ├── images/
│   └── ...icons and manifest
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── ...
```

- **components/**: React UI components (e.g., `Projects.jsx`, `Skills.jsx`, `Result.jsx`)
- **data/**: Static data for skills, roles, and projects (e.g., [`SkillsData.js`](src/data/SkillsData.js), [`roleProjectSets.js`](src/data/roleProjectSets.js))
- **pages/**: Top-level route components (e.g., `About.jsx`)
- **assets/**: Images and static assets

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- Python 3.8+

### Frontend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/pathwise-ai.git
   cd PathWise-frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

### Backend Setup

4. Open another Terminal to run the MongoDB server:

   **CD to "Pathwise-backend"** - ensure the DB is installed and connected to the environment variables
   ```sh
   npm install
   npm start
   ```

### AI Agent Setup

5. **Create Python Environment - New Terminal:**
   ```sh
   # Create Python environment
   uv venv --seed .venv

   # Activate the Python environment
   source .venv/bin/activate
   ```

6. **Install AI Dependencies:**
   ```sh
   # Install AIQ toolkit (just 30MB)
   uv add aiqtoolkit
   uv add fastapi uvicorn

   # Install the agent
   uv pip install -e .
   uv pip install -e nigeria_pathwise
   ```

7. **Configure AI Agent:**
   ```sh
   # Delete existing agent to remove system symlink
   nat workflow delete nigeria_pathwise

   # Create the agent
   nat workflow create nigeria_pathwise
   ```

8. **Update Agent Files:**

   Replace the following files in your directory with the latest versions:

   - **Function File:** Replace `nigeria_pathwise/src/nigeria_pathwise/nigeria_pathwise_function.py` with:
     https://github.com/codewithgaji/PathWise-AI/blob/master/nigeria_pathwise/src/nigeria_pathwise/nigeria_pathwise_function.py

   - **Config File:** Replace `nigeria_pathwise/src/nigeria_pathwise/configs/config.yml` with:
     https://github.com/codewithgaji/PathWise-AI/blob/master/nigeria_pathwise/src/nigeria_pathwise/configs/config.yml

9. **Run the AI Agent:**
   ```sh
   # Start the AI agent server
   nat serve --config_file nigeria_pathwise/configs/config.yml
   ```

10. **Start CORS Proxy:**
    ```sh
    # In a new terminal, run the CORS proxy
    python cors_proxy.py
    ```

### Access the Application

- **Frontend:** Open [http://localhost:5173](http://localhost:5173) in your browser
- **Backend:** MongoDB server running on configured port
- **AI Agent:** Running with FastAPI and accessible through the frontend

## Development

### Build for Production

```sh
npm run build
# or
yarn build
```

### Linting

```sh
npm run lint
# or
yarn lint
```

## Customization

- To add or edit skills, modify [`SkillsData.js`](src/data/SkillsData.js).
- To update project sets for each role, edit [`roleProjectSets.js`](src/data/roleProjectSets.js).
- UI components can be found in [`components/`](src/components/).
- AI agent configuration can be modified in the `config.yml` file.

## Troubleshooting

### Common Issues

**MongoDB Connection Issues:**
```sh
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Restart MongoDB if needed
sudo systemctl restart mongod  # Linux
brew services restart mongodb-community  # macOS
```

**User Registration Issues:**
- Verify backend server is running on correct port
- Check MongoDB connection in backend logs
- Ensure CORS is properly configured for frontend-backend communication
- Verify environment variables are loaded correctly

**General Troubleshooting:**
- Ensure Python environment is activated before running AI agent commands
- Check that all ports are available (5173 for frontend, 5000 for backend, AI agent port)
- Verify MongoDB connection and environment variables are properly configured
- Make sure to update the agent files from the GitHub repository for latest functionality
- Check browser console and backend logs for specific error messages

## License

[MIT](LICENSE)

---
*Made for Nigerian graduates and job hunters by students*
