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
# 🚀 PathWise AI Complete Project Setup Guide

This guide walks you through setting up the PathWise AI project inside **WSL Ubuntu** from scratch. Follow the steps carefully, and by the end, you'll have both the frontend and backend running with MongoDB connected.

---

## 1️⃣ Install WSL and Ubuntu

Run this command from **PowerShell** (as Administrator) on Windows to install WSL with Ubuntu:

```bash
wsl --install
```

After installation, **restart your PC** and open Ubuntu (WSL) from your terminal dropdown.

---

## 2️⃣ Update Ubuntu Packages

Inside Ubuntu, update and upgrade your system:

```bash
sudo apt update && sudo apt upgrade -y
```

**Note:** You will be prompted to enter your **system password** (the password you use to log into your Windows laptop). Type it carefully as characters won't be displayed on screen.

---

## 3️⃣ Install Python 3

Ubuntu usually comes with Python 3 preinstalled. Confirm the installation:

```bash
python3 --version
```

If not installed or you need additional Python tools:

```bash
sudo apt install -y python3 python3-venv python3-pip
```

**Note:** You may need to enter your system password again.

---

## 4️⃣ Create and Activate Python Virtual Environment

Navigate to your project directory and create a virtual environment:

```bash
python3 -m venv .venv
```

Activate the virtual environment:

```bash
source .venv/bin/activate
```

**Important:** Once activated, you should see `(.venv)` at the beginning of your terminal prompt, indicating the virtual environment is active.

---

## 5️⃣ Install curl

Install curl, which we'll need for downloading Node.js:

```bash
sudo apt install -y curl
```

---

## 6️⃣ Remove Outdated Node.js and npm

The default Ubuntu repositories often have outdated Node.js and npm. Remove them first:

```bash
sudo apt remove -y nodejs npm
```

Clean up any leftover dependencies:

```bash
sudo apt autoremove -y
```

**Why we do this:** The existing Node.js and npm versions in Ubuntu's default repos are typically outdated. We need the latest stable versions for modern development.

---

## 7️⃣ Install Latest Node.js (LTS)

Add the official NodeSource repository for the latest Node.js 20.x LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

Install Node.js:

```bash
sudo apt install -y nodejs
```

**Note:** You may be prompted for your system password again.

Verify the installation:

```bash
node -v
npm -v
```

Both commands should return version numbers (Node.js 20.x and npm 10.x or higher).

---

## 8️⃣ Install uv Inside Virtual Environment

**Important:** Make sure your virtual environment is activated (you should see `(.venv)` in your prompt).

Install uv using pip:

```bash
pip install uv
```

**Why inside virtual environment:** Ubuntu manages system packages strictly, so we install uv inside the virtual environment to avoid conflicts.

---

## 9️⃣ Setup Frontend

Navigate to the frontend folder and install dependencies:

```bash
cd Pathwise-frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

If successful, your frontend will start running (usually on `http://localhost:3000` or similar).

---

## 🔟 Setup Backend

**Open a new terminal** in Ubuntu (WSL) while keeping the frontend running.

Navigate to your project root and activate the Python environment:

```bash
cd PathWise-AI
source .venv/bin/activate
```

Move into the backend folder:

```bash
cd Pathwise-backend
```

**Note:** Before running the backend, we need to install and configure MongoDB.

---

## 1️⃣1️⃣ Install MongoDB

MongoDB doesn't yet provide repositories for Ubuntu "Noble" (24.04). We'll use the Jammy (22.04) repository which is fully compatible.

### Add MongoDB GPG Key

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo tee /usr/share/keyrings/mongodb-server-7.0.gpg > /dev/null
```

### Add MongoDB Repository

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

### Update Package Lists

```bash
sudo apt update
```

### Install MongoDB

```bash
sudo apt install -y mongodb-org
```

---

## 1️⃣2️⃣ Start and Enable MongoDB

Start MongoDB immediately:

```bash
sudo systemctl start mongod
```

Enable MongoDB to auto-start on system boot:

```bash
sudo systemctl enable mongod
```

Check MongoDB status:

```bash
sudo systemctl status mongod
```

**Expected output:** You should see `Active: active (running)` in green text.

---

## 1️⃣3️⃣ Verify MongoDB Connection

Test the MongoDB connection:

```bash
mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
```

If MongoDB is working correctly, you should see `"ok" : 1` in the output 🎉.

---

## 1️⃣4️⃣ Run Backend

Now install backend dependencies and start the server:

```bash
npm install
npm start
```

If MongoDB is running properly, the backend should connect successfully and display connection confirmation messages.

---

## ✅ Final Verification

You should now have:

1. **Frontend running** (usually `http://localhost:3000`)
2. **Backend running** (usually `http://localhost:8000` or `http://localhost:5000`)
3. **MongoDB active** and connected

---

## 🔧 Important Notes

- **Virtual Environment:** Always activate your virtual environment (`source .venv/bin/activate`) before running backend commands or installing Python packages.

- **MongoDB:** MongoDB is installed system-wide in Ubuntu, not inside your Python virtual environment.

- **Auto-start:** With `systemctl enable`, MongoDB will automatically start every time WSL boots up.

- **Password Prompts:** Throughout this process, you'll be asked to enter your system password multiple times. This is the same password you use to log into your Windows laptop.

- **Terminal Management:** Keep your frontend and backend running in separate terminal windows for easier development.

---

## 🚨 Troubleshooting

**If Node.js installation fails:**
- Make sure you're connected to the internet
- Try running `sudo apt update` again before the curl command

**If MongoDB won't start:**
- Check if it's already running: `sudo systemctl status mongod`
- Try restarting: `sudo systemctl restart mongod`

**If you get permission errors:**
- Make sure you're using `sudo` where indicated
- Verify you're entering the correct system password

**If virtual environment doesn't activate:**
- Make sure you're in the correct directory
- Try recreating it: `rm -rf .venv && python3 -m venv .venv`

Your PathWise AI development environment is now ready! 🚀

## License

[MIT](LICENSE)

---
*Made for Nigerian graduates and job hunters by students*
