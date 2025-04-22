# Exercise 1: Deploy the Frontend Application

## Overview

In this exercise, you will deploy the frontend of the task management application to a production environment. You'll have three options to choose from based on your comfort level and preferences: Bolt.new (AI-assisted), Replit (collaborative platform), or Vercel (professional hosting). Each platform offers different advantages for beginners.

## Learning Objectives

- Configure a frontend application for production deployment
- Set up environment variables for production use
- Deploy a React application to Bolt.new, Replit, or Vercel
- Configure custom domains (optional)
- Implement continuous deployment from GitHub

## Prerequisites

- Completed task management frontend application from Chapter 8
- Basic understanding of environment variables

For specific platforms:
- **Bolt.new**: A web browser (no account required initially)
- **Replit**: Replit account (free at replit.com) 
- **Vercel**: GitHub account and Vercel account (free at vercel.com)

## Exercise

### Part 1: Prepare the Frontend for Production

1. **Update Environment Variables**:

Modify your `.env` file to point to the correct backend API that you'll deploy later:

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

Create a `.env.production` file with production-specific variables.

### Part 2: Choose Your Deployment Platform

Select one of the following platforms based on your preference:

#### Option A: Deploy with Bolt.new (AI-Assisted Approach)

1. **Create Your Project on Bolt.new**:
   - Visit [Bolt.new](https://bolt.new)
   - Use the prompt interface to describe your task management frontend
   - Example prompt: "Create a React task management application frontend with user authentication, task creation, editing, and filtering capabilities"

2. **Customize Your Generated Application**:
   - Upload your existing code or adapt the AI-generated code
   - Modify the code using the built-in editor
   - Test your application in the preview window

3. **Configure Environment Variables**:
   - Click on "Environment" in the Bolt interface
   - Add your `REACT_APP_API_URL` and other variables

4. **Deploy Your Application**:
   - Click the "Deploy" button in the Bolt interface
   - Choose Netlify as your deployment platform
   - Follow the prompts to complete the deployment
   - Your application will be live at the provided URL

#### Option B: Deploy with Replit (Collaborative Approach)

1. **Create a New Replit**:
   - Log in to [Replit](https://replit.com)
   - Click "+ Create Repl"
   - Select "React.js" as your template
   - Name your project "TaskManager-Frontend"

2. **Import Your Existing Code**:
   - Click on the three dots in the files panel
   - Select "Upload Folder" and upload your frontend code
   - Alternatively, use the Git import feature to import from GitHub

3. **Configure Environment Variables**:
   - Click on the lock icon in the left sidebar
   - Add your environment variables including `REACT_APP_API_URL`

4. **Run and Test Your Application**:
   - Click the "Run" button to build and run your application
   - Test the application in the preview window

5. **Deploy Your Application**:
   - Your application is automatically deployed at `https://TaskManager-Frontend.yourusername.repl.co`
   - For a custom domain, click on the "Connect Domain" option in settings

#### Option C: Deploy with Vercel (Professional Approach)

1. **Create `vercel.json`**:

Create a `vercel.json` file in the root of your project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    { "src": "/static/(.*)", "dest": "/static/$1" },
    { "src": "/favicon.ico", "dest": "/favicon.ico" },
    { "src": "/manifest.json", "dest": "/manifest.json" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

2. **Update `package.json`**:

Make sure your `package.json` has the correct build script:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

3. **Push Your Code to GitHub**:

Make sure your frontend code is in a GitHub repository. If it's not, create a new repository and push your code:

```bash
git init
git add .
git commit -m "Prepare for production deployment"
git remote add origin https://github.com/yourusername/taskmanager-frontend.git
git push -u origin main
```

4. **Connect Vercel to GitHub**:

- Go to [Vercel](https://vercel.com) and sign in with your account
- Click "New Project"
- Import your GitHub repository
- Configure project settings:
  - Framework Preset: Create React App
  - Build Command: `npm run build`
  - Output Directory: `build`
  - Environment Variables: Add the same variables from your `.env.production` file

5. **Deploy the Application**:

- Click "Deploy"
- Vercel will build and deploy your application
- Once complete, you'll receive a URL for your deployed application (e.g., `https://taskmanager-frontend.vercel.app`)

### Part 3: Configure Continuous Deployment

1. **Set Up Automatic Deployments**:

- In your Vercel project settings, ensure "Auto Deployment" is enabled
- This will automatically deploy updates when you push changes to your GitHub repository

2. **Test the Deployment Pipeline**:

- Make a small change to your frontend code
- Commit and push the change to GitHub
- Watch the automatic deployment process in Vercel's dashboard
- Verify that your changes appear on the production site

### Part 4: Advanced Configuration (Optional)

If you have a custom domain, configure it for your deployed application:

1. **Add a Custom Domain in Vercel**:

- Go to your project settings in Vercel
- Click on "Domains"
- Add your custom domain (e.g., `taskmanager.yourdomain.com`)
- Follow Vercel's instructions to update your DNS settings

2. **Configure HTTPS**:

- Vercel automatically provisions SSL certificates
- Verify that HTTPS is working correctly on your custom domain

## Deliverables

1. URL of the deployed frontend application
2. Source code repository (GitHub for Vercel, Replit link, or Bolt.new project link)
3. Screenshot of the deployed application
4. Brief document explaining:
   - Which platform you chose and why
   - Steps you took to deploy
   - Any challenges you faced
   - How you solved those challenges
   - Pros and cons of your chosen platform

## Assessment Criteria

- Successful deployment with accessible URL
- Proper environment variable configuration
- UI works correctly in the production environment
- Code is properly structured for production
- Documentation clearly explains the deployment process and platform choice
- Creative use of the chosen platform's unique features and challenges

## Resources

- [Bolt.new Documentation](https://bolt.new/docs)
- [Replit Documentation](https://docs.replit.com)
- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Environment Variables in Create React App](https://create-react-app.dev/docs/adding-custom-environment-variables/)

## Next Steps

After completing this exercise, you can:
- Deploy the backend API (see Exercise 2)
- Set up monitoring for your frontend (see Exercise 3)
- Implement advanced deployment strategies like preview deployments
