# 🚀 Automatic Deployment Guide

## Overview

The BOLES Smart Home e-commerce platform is configured for automatic deployment across multiple platforms with comprehensive CI/CD pipeline integration.

## 🏆 Recommended Platform: Vercel

**Vercel** is the primary recommended deployment platform for this Next.js 15 project because:

- ✅ **Native Next.js Support**: Built by the same team that creates Next.js
- ✅ **Zero Configuration**: Works out of the box with Next.js projects
- ✅ **Automatic Optimizations**: Built-in performance optimizations
- ✅ **Preview Deployments**: Automatic preview URLs for pull requests
- ✅ **Edge Functions**: Global performance with edge computing
- ✅ **Analytics**: Built-in web analytics and performance monitoring

## 🔧 Deployment Platforms Setup

### 1. Vercel Deployment (Primary)

#### Quick Setup:
1. **Connect Repository**: 
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub: `https://github.com/mostiock/boles-smart-home-platform`

2. **Configure Settings**:
   ```
   Framework Preset: Next.js
   Build Command: bun run build
   Output Directory: dist
   Install Command: bun install
   Development Command: bun run dev
   ```

3. **Environment Variables** (if needed):
   ```
   NODE_ENV=production
   NEXT_TELEMETRY_DISABLED=1
   ```

#### GitHub Actions Integration:
To enable automatic deployments via GitHub Actions, add these secrets to your repository:

```bash
# Repository Settings > Secrets and variables > Actions
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**Get these values:**
1. **VERCEL_TOKEN**: Go to Vercel Dashboard > Settings > Tokens
2. **VERCEL_ORG_ID**: Found in team settings or use `vercel teams ls`
3. **VERCEL_PROJECT_ID**: Found in project settings

### 2. Netlify Deployment (Alternative)

#### Configuration File: `netlify.toml`
Already configured in the repository. Simply:

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Deploy settings are auto-detected from `netlify.toml`

#### Manual Configuration:
```
Build command: bun run build
Publish directory: dist
```

### 3. GitHub Pages (Backup)

Automatically configured via GitHub Actions. No additional setup required.
- Builds on every push to `main`
- Deploys to GitHub Pages
- Available at: `https://mostiock.github.io/boles-smart-home-platform`

## 📋 CI/CD Pipeline Features

### Automated Workflows

The GitHub Actions pipeline (`/.github/workflows/deploy.yml`) includes:

#### 🔍 **Quality Checks**
- TypeScript type checking
- Code formatting validation with Biome
- Dependency caching for faster builds

#### 🏗️ **Build and Test**
- Project compilation
- Build artifact generation
- Build size reporting
- Artifact upload for deployment

#### 🚀 **Multi-Platform Deployment**
- **Production**: Automatic deployment to Vercel on `main` branch pushes
- **Preview**: Automatic preview deployments for pull requests
- **Backup**: GitHub Pages deployment as fallback

### Branch-Based Deployments

| Branch | Deployment Type | URL |
|--------|----------------|-----|
| `main` | Production | Primary domain |
| `develop` | Staging | Staging subdomain |
| `feature/*` | Preview | Temporary preview URL |
| Pull Requests | Preview | PR-specific preview URL |

## 🎯 Deployment Triggers

### Automatic Deployments Trigger On:

1. **Push to main branch** → Production deployment
2. **Pull request creation** → Preview deployment
3. **Pull request updates** → Updated preview deployment
4. **Merge to main** → Production deployment

### Manual Deployments:

```bash
# Trigger deployment manually
git push origin main

# Force deployment
git commit --allow-empty -m "Deploy: force rebuild"
git push origin main
```

## 📊 Deployment Status & Monitoring

### Check Deployment Status:

1. **GitHub Actions**: Repository > Actions tab
2. **Vercel Dashboard**: Monitor deployments and performance
3. **Netlify Dashboard**: View deploy logs and status

### Deployment Notifications:

- ✅ **GitHub**: Status checks on pull requests
- ✅ **Email**: Deployment success/failure notifications
- ✅ **Slack**: Integration available for team notifications

## 🛠️ Build Configuration

### Project Specifications:
- **Framework**: Next.js 15
- **Package Manager**: Bun
- **Build Command**: `bun run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x or later

### Environment Variables:
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Build Optimizations:
- Static export configuration
- Image optimization disabled for static hosting
- Trailing slash handling
- Security headers configuration

## 🔄 Rollback Procedures

### Vercel Rollback:
1. Go to Vercel Dashboard
2. Select project
3. Navigate to "Deployments"
4. Click "Promote to Production" on previous deployment

### GitHub Actions Rollback:
1. Revert the problematic commit:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

### Emergency Rollback:
1. Disable auto-deployment temporarily
2. Deploy specific commit:
   ```bash
   git checkout <stable-commit>
   git push -f origin main
   ```

## 🧪 Testing Deployment

### Local Testing:
```bash
# Build and test locally
bun run build
bun run start

# Verify build output
ls -la dist/
```

### Preview Testing:
1. Create a pull request
2. Wait for preview deployment
3. Test preview URL provided in PR comments

### Production Testing:
1. Deploy to staging first
2. Run acceptance tests
3. Promote to production

## 📈 Performance Monitoring

### Built-in Analytics:
- **Vercel Analytics**: Real-time performance metrics
- **Core Web Vitals**: Automatic monitoring
- **Error Tracking**: Deploy-time error detection

### Custom Monitoring:
```bash
# Add monitoring tools
bun add @vercel/analytics
bun add @sentry/nextjs
```

## 🔧 Troubleshooting

### Common Issues:

#### Build Failures:
```bash
# Check build logs
bun run build --verbose

# Clear cache
rm -rf .next dist node_modules
bun install
bun run build
```

#### Deployment Failures:
1. Check GitHub Actions logs
2. Verify environment variables
3. Ensure dependencies are up to date
4. Check platform-specific error logs

#### Performance Issues:
1. Analyze bundle size: `bun run build`
2. Check Core Web Vitals in deployment dashboard
3. Review image optimization settings

### Getting Help:
- GitHub Issues: Repository issue tracker
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Community: Next.js Discord or GitHub Discussions

## 📚 Additional Resources

- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Netlify Deployment Guide](https://docs.netlify.com/site-deploys/overview/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone https://github.com/mostiock/boles-smart-home-platform.git
cd boles-smart-home-platform/boles-smart-shop
bun install

# Local development
bun run dev

# Build for production
bun run build

# Deploy to production
git push origin main
```

**🎉 Your BOLES Smart Home platform is now ready for automatic deployment!**