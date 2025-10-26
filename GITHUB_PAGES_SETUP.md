# GitHub Pages Setup Guide - Fix 404 Error

## 🚨 **Current Issue**
Your GitHub Pages is showing a 404 error because of configuration mismatches between the repository structure and GitHub Pages settings.

## 🔧 **Solutions Implemented**

### **1. Created GitHub Actions Deployment Workflow**
- ✅ Added `.github/workflows/deploy-website.yml`
- ✅ Automatically builds and deploys website_code to GitHub Pages
- ✅ Triggers on changes to website_code directory

### **2. Fixed Vite Configuration**
- ✅ Updated `website_code/vite.config.ts` to handle production builds correctly
- ✅ Uses proper base path for GitHub Pages

### **3. Improved 404 Handling**
- ✅ Enhanced `website_code/404.html` with better redirect logic
- ✅ Added fallback text for users

## 🚀 **Setup Steps**

### **Step 1: Enable GitHub Pages**
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### **Step 2: Verify Repository Name**
Your repository should be named `Communitiful` for the current configuration to work. If it's different, update the base path in:
- `website_code/vite.config.ts` (line 8)
- `website_code/404.html` (line 10)

### **Step 3: Deploy the Website**
1. **Commit and push** the changes:
   ```bash
   git add .
   git commit -m "Fix GitHub Pages deployment"
   git push origin main
   ```

2. **Check GitHub Actions**:
   - Go to **Actions** tab in your repository
   - You should see "Deploy Website to GitHub Pages" workflow running
   - Wait for it to complete successfully

### **Step 4: Access Your Website**
Your website should be available at:
```
https://[your-username].github.io/Communitiful/
```

## 🔍 **Troubleshooting**

### **If you still get 404:**

1. **Check Repository Name**:
   - If your repo is not named "Communitiful", update the base path:
   ```typescript
   // In website_code/vite.config.ts
   base: process.env.NODE_ENV === 'production' ? "/[your-repo-name]/" : "/",
   ```

2. **Check GitHub Pages Settings**:
   - Repository Settings → Pages → Source should be "GitHub Actions"
   - Not "Deploy from a branch"

3. **Check Actions Tab**:
   - Look for failed deployments
   - Check build logs for errors

4. **Verify File Structure**:
   - Make sure `website_code/dist/` contains built files
   - Check that `index.html` exists in the dist folder

### **Alternative: Manual Deployment**

If GitHub Actions doesn't work, you can deploy manually:

1. **Build the website**:
   ```bash
   cd website_code
   npm install
   npm run build
   ```

2. **Deploy to gh-pages branch**:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

3. **Update GitHub Pages settings**:
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

## 📋 **File Structure After Fix**

```
.github/
  workflows/
    deploy-website.yml          # New deployment workflow
    sync.yml                    # Existing sync workflow

website_code/
  dist/                         # Built files (auto-generated)
  src/                          # Source code
  vite.config.ts               # Fixed base path
  404.html                     # Improved 404 handling
  index.html                   # Main HTML file
  package.json                 # Dependencies
```

## ✅ **Success Indicators**

When everything works correctly, you should see:
- ✅ GitHub Actions workflow completes successfully
- ✅ Website loads at `https://[username].github.io/Communitiful/`
- ✅ No 404 errors
- ✅ All assets (CSS, JS, images) load correctly

## 🆘 **Still Having Issues?**

If you're still getting 404 errors:

1. **Check the exact repository name** and update base paths accordingly
2. **Verify GitHub Pages is enabled** in repository settings
3. **Check the Actions tab** for deployment errors
4. **Try accessing the website** after a few minutes (GitHub Pages can take time to update)

The most common issue is a mismatch between the repository name and the base path configuration. Make sure both match exactly!
