# Removing Custom Domain from GitHub Pages

If your site is still redirecting to `communitiful.com`, it's because GitHub Pages has a custom domain configured in the repository settings. Follow these steps:

## Step 1: Remove Custom Domain in GitHub Settings

1. Go to your repository: `https://github.com/xactai/Communitiful`
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Custom domain**, you'll see `www.communitiful.com` if configured
5. **Clear the custom domain field** (delete the text)
6. **Uncheck "Enforce HTTPS"** if it's checked (optional, but recommended)
7. Click **Save**

## Step 2: Verify Deployment Source

While in the Pages settings:
- Make sure **Source** is set to **"GitHub Actions"**
- NOT "Deploy from a branch"

## Step 3: Clear DNS Cache (if needed)

If you still see redirects after removing the custom domain:

1. **Browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache for the site

2. **DNS cache:**
   ```bash
   # On Mac/Linux:
   sudo dscacheutil -flushcache
   
   # On Windows:
   ipconfig /flushdns
   ```

## Step 4: Re-deploy

After removing the custom domain:
1. Push a new commit to trigger the deployment
2. Wait for the GitHub Actions workflow to complete
3. Visit: `http://xactai.github.io/Communitiful`

## Step 5: Verify

The site should now:
- ✅ Load at `http://xactai.github.io/Communitiful` (or `https://xactai.github.io/Communitiful`)
- ✅ NOT redirect to `communitiful.com`
- ✅ Show the GitHub Pages URL in the address bar

## Troubleshooting

**If it still redirects after 10-15 minutes:**
- Check GitHub Actions logs to ensure deployment completed
- Verify no CNAME file exists in the deployed files
- Try accessing in an incognito/private window
- Wait a bit longer (DNS changes can take time to propagate)

