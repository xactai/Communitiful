# GitHub Pages Setup Guide

## ✅ **Setup Complete!**

Your project is now configured for GitHub Pages deployment with GitHub Actions.

## 🚀 **Quick Start**

### **Step 1: Enable GitHub Pages in Repository Settings**

1. Go to your repository on GitHub: `https://github.com/xactai/Communitiful`
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### **Step 2: Push to Deploy**

Simply push your code to the `main` branch:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

The GitHub Actions workflow will automatically:
- Build your React/Vite application
- Deploy it to GitHub Pages
- Copy the CNAME file for your custom domain

### **Step 3: Access Your Website**

Your website will be available at:
- **Custom Domain**: `https://www.communitiful.com` (if DNS is configured)
- **GitHub Pages URL**: `https://xactai.github.io/Communitiful/` (if not using custom domain)

## 📋 **What Was Configured**

### **1. GitHub Actions Workflow**
- ✅ Created `.github/workflows/deploy.yml`
- ✅ Automatically builds and deploys on push to `main`
- ✅ Copies CNAME file to dist folder
- ✅ Copies 404.html for SPA routing support

### **2. Vite Configuration**
- ✅ Updated `vite.config.ts` with base path configuration
- ✅ Configured for custom domain (base: "/")
- ✅ Production builds will work correctly

### **3. SPA Routing Support**
- ✅ Created `404.html` for handling client-side routing
- ✅ Redirects all routes to index.html for React Router support

## 🔧 **Configuration Details**

### **Custom Domain Setup**

Your `CNAME` file contains: `www.communitiful.com`

To use the custom domain:
1. Configure your DNS records:
   - Type: `CNAME`
   - Name: `www`
   - Value: `xactai.github.io`
2. Wait for DNS propagation (can take up to 24 hours)
3. GitHub Pages will automatically detect and use the custom domain

### **Base Path Configuration**

If you need to change the base path (for example, if not using a custom domain), update `vite.config.ts`:

```typescript
// For custom domain (current)
base: process.env.NODE_ENV === 'production' ? "/" : "/"

// For GitHub Pages subpath
base: process.env.NODE_ENV === 'production' ? "/Communitiful/" : "/"
```

## 🔍 **Monitoring Deployment**

### **Check Deployment Status**

1. Go to the **Actions** tab in your repository
2. Look for "Deploy to GitHub Pages" workflow
3. Click on a run to see detailed logs

### **Troubleshooting**

**If deployment fails:**
- Check the Actions tab for error messages
- Verify Node.js version (should be 18)
- Check that `package.json` has a build script
- Ensure all dependencies are listed in `package.json`

**If website shows 404:**
- Verify GitHub Pages source is set to "GitHub Actions"
- Check that the workflow completed successfully
- Wait a few minutes for GitHub Pages to update
- Clear your browser cache

**If assets don't load:**
- Verify the base path in `vite.config.ts` matches your deployment URL
- Check browser console for 404 errors
- Ensure `CNAME` file is copied to dist folder (handled automatically)

## 📁 **File Structure**

```
.github/
  workflows/
    deploy.yml              # GitHub Actions deployment workflow

vite.config.ts              # Vite config with base path
404.html                    # SPA routing support
CNAME                       # Custom domain configuration
package.json                # Build scripts and dependencies
```

## ✅ **Success Indicators**

When everything works correctly, you should see:
- ✅ GitHub Actions workflow completes successfully
- ✅ Website loads at your custom domain or GitHub Pages URL
- ✅ No 404 errors
- ✅ All assets (CSS, JS, images) load correctly
- ✅ React Router navigation works (if you add routing later)

## 🔄 **Automatic Deployments**

Every time you push to the `main` branch, the website will automatically rebuild and deploy. No manual steps required!

## 📝 **Notes**

- The workflow uses Node.js 18
- Build artifacts are cached for faster deployments
- The deployment uses the latest GitHub Pages Actions (v4)
- Custom domain (www.communitiful.com) is automatically handled via CNAME file

## 🆘 **Need Help?**

If you encounter any issues:
1. Check the GitHub Actions logs
2. Verify repository settings
3. Ensure DNS is configured correctly (for custom domain)
4. Review the troubleshooting section above
