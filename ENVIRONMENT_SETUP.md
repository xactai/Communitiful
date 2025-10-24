# Environment Variables Setup Guide

## 🔐 **Secure API Key Configuration**

This guide shows you how to securely configure the Groq API key using environment variables.

### **Step 1: Create Environment File**

Create a `.env` file in your project root with the following content:

```env
# Environment Variables for Communitiful
# DO NOT commit this file to version control

# Supabase Configuration
VITE_SUPABASE_URL=https://uvnivlzzcfqotlnijrvv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2bml2bHp6Y2Zxb3RsbmlqcnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NDQ3NzksImV4cCI6MjA3NTMyMDc3OX0.7dCcYWwySkqaSgJjsNLrsGD5ZD6l5hzW1CN4nlAMIJY

# Groq API Configuration
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### **Step 2: Verify Setup**

1. **Check console logs** - You should see:
   - ✅ "Groq API key loaded successfully" (if configured correctly)
   - ⚠️ "Groq API key not configured" (if missing)

2. **Test message moderation** - Try sending messages to verify Groq integration works

### **Step 3: Security Best Practices**

✅ **DO:**
- Keep `.env` files out of version control
- Use different keys for different environments
- Rotate API keys regularly
- Use strong, unique API keys

❌ **DON'T:**
- Commit `.env` files to git
- Share API keys in chat/email
- Use production keys in development
- Hardcode API keys in source code

### **Step 4: Environment-Specific Configuration**

#### **Development (.env.local)**
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

#### **Production (Set in hosting platform)**
- **Netlify**: Site Settings → Environment Variables
- **Vercel**: Project Settings → Environment Variables
- **Railway**: Project Settings → Variables

### **Step 5: Troubleshooting**

#### **If you see "Groq API key not configured":**
1. Check that `.env` file exists in project root
2. Verify the key name is `VITE_GROQ_API_KEY`
3. Restart your development server
4. Check console for validation messages

#### **If moderation isn't working:**
1. Verify the API key is valid
2. Check network requests in browser dev tools
3. Look for error messages in console
4. Test with a simple message first

### **Step 6: Fallback Behavior**

The system is designed to gracefully handle missing API keys:
- ✅ **With API key**: Full Groq moderation + local fallback
- ⚠️ **Without API key**: Local moderation only (messages still work)
- 🔄 **API failure**: Automatic fallback to local moderation

### **Step 7: Verification Commands**

```bash
# Check if .env file exists
ls -la .env

# Check if .env is in .gitignore
grep -n "\.env" .gitignore

# Verify environment variables are loaded
# (Check browser console for validation messages)
```

## 🚀 **Deployment Notes**

### **Netlify Deployment:**
1. Go to Site Settings → Environment Variables
2. Add `VITE_GROQ_API_KEY` with your production key
3. Redeploy the site

### **Vercel Deployment:**
1. Go to Project Settings → Environment Variables
2. Add `VITE_GROQ_API_KEY` with your production key
3. Redeploy the project

### **Local Development:**
1. Create `.env` file with your development key
2. Restart the development server
3. Check console for validation messages

## ✅ **Success Indicators**

When everything is working correctly, you should see:
- ✅ Console shows: "Groq API key loaded successfully"
- ✅ Message moderation works with Groq API
- ✅ No hardcoded API keys in source code
- ✅ `.env` file is not committed to git
- ✅ Different keys for different environments

The new API key is now securely stored in environment variables and used throughout the application!
