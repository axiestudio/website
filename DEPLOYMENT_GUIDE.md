# 🚀 AxieStudio Admin Dashboard - Deployment Guide

## 📋 Project Overview

**AxieStudio Admin Dashboard** - A professional, production-ready admin system with:
- ✅ **Trinity Security System** (3-factor authentication)
- ✅ **Neon PostgreSQL Database** integration
- ✅ **Professional Excel Export** system
- ✅ **Sequential Authentication Flow** with animations
- ✅ **Consultation Management CMS**
- ✅ **Newsletter & Download Tracking**

---

## 🌐 STEP 1: Deploy to Vercel (DO THIS FIRST!)

### 1.1 Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Login with your account

### 1.2 Create New Project
1. Click **"Add New"** → **"Project"**
2. Choose **"Import Git Repository"**
3. Select this project folder or upload as ZIP

### 1.3 Configure Environment Variables
**CRITICAL:** Add these environment variables in Vercel:

```
ADMIN_KEY_1=axiestudio_admin_2024
ADMIN_KEY_2=axiestudio_secure_2024
ADMIN_KEY_3=axiestudio_premium_2024
DATABASE_URL=postgresql://neondb_owner:npg_1j2dIDKFagEw@ep-icy-block-agr2fspv-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
RESEND_API_KEY=re_TFYH1MkB_4J44rqHrmLw9aWR4gaLXgfkH
EMAIL=stefanjohnmiranda5@gmail.com
```

### 1.4 Deploy Settings
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 1.5 Deploy!
- Click **"Deploy"**
- Wait for deployment to complete
- Test the admin dashboard at your Vercel URL

---

## 🔐 Trinity Security System

Your admin dashboard uses **3-factor authentication** (Christian Doctrine):

**Step 1:** `axiestudio_admin_2024`
**Step 2:** `axiestudio_secure_2024`  
**Step 3:** `axiestudio_premium_2024`

Users must enter all 3 codes sequentially to access the dashboard.

---

## 📊 Features Included

### 🎯 Admin Dashboard
- Professional consultation management
- Real-time analytics and statistics
- Search and filter capabilities
- Status tracking and priority management
- Follow-up scheduling

### 📧 Communication
- Direct email integration
- Newsletter subscriber management
- Automated email notifications

### 💻 Desktop App Tracking
- Download analytics by platform
- User preference tracking
- Comprehensive reporting

### 📈 Excel Export System
- Professional, organized reports
- Executive summaries
- Action items and follow-ups
- Business intelligence insights

---

## 🐙 STEP 2: Push to GitHub (ONLY AFTER Vercel deployment!)

### 2.1 Create GitHub Repository
1. Go to https://github.com/new
2. Create repository named: `axiestudio-website`
3. Keep it private for security

### 2.2 Push Code to GitHub
Run these commands in your terminal:

```bash
git remote add origin https://github.com/yourusername/axiestudio-website.git
git branch -M main
git add .
git commit -m "Deploy: AxieStudio Admin Dashboard with Trinity Security"
git push -u origin main
```

---

## ✅ Post-Deployment Checklist

- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Admin dashboard accessible
- [ ] Trinity authentication working
- [ ] Database connection established
- [ ] Excel export functioning
- [ ] GitHub repository created
- [ ] Code pushed to GitHub

---

## 🔧 Troubleshooting

### Database Issues
- Verify DATABASE_URL is correct
- Check Neon PostgreSQL connection
- Ensure SSL settings are proper

### Authentication Issues
- Confirm all 3 ADMIN_KEY variables are set
- Test each authentication step
- Check for typos in security codes

### Export Issues
- Verify RESEND_API_KEY is valid
- Check email configuration
- Test CSV/Excel download functionality

---

## 📞 Support

For any deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connectivity
4. Confirm authentication flow

**Your AxieStudio Admin Dashboard is now ready for production! 🎉**
