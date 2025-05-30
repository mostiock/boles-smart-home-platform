# 🚀 BOLES Smart Home Platform - Deployment Guide

## Overview

Complete deployment instructions for the BOLES Smart Home e-commerce platform on various hosting providers.

## 📋 Prerequisites

- Node.js 18+ or Bun
- Git
- GitHub account
- Hosting provider account (Netlify, Vercel, etc.)

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env.local` file in your project root:

```env
# Optional: Exchange Rate API Keys for higher rate limits
EXCHANGE_RATE_API_KEY=your_exchangerate_api_key
OPEN_EXCHANGE_RATES_API_KEY=your_openexchange_api_key

# Optional: Custom fallback exchange rate
FALLBACK_EXCHANGE_RATE=1589.77
```

### Build Configuration

The project uses these build settings:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev --turbo"
  }
}
```

## 🌐 Netlify Deployment

### 1. Automatic Deployment (Recommended)

1. **Connect Repository**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select `boles-smart-home-platform` repository

2. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   Node version: 18
   ```

3. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add your API keys if needed

### 2. Manual Deployment

```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### 3. Netlify Configuration

The project includes `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## ⚡ Vercel Deployment

### 1. Automatic Deployment

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

2. **Build Settings** (Auto-detected):
   ```
   Framework: Next.js
   Build Command: npm run build
   Output Directory: .next
   ```

### 2. Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build Docker image
docker build -t boles-smart-home .

# Run container
docker run -p 3000:3000 boles-smart-home
```

## ☁️ AWS Deployment

### 1. AWS Amplify

1. **Connect Repository**:
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Choose the main branch

2. **Build Settings**:
   ```yml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

### 2. AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🌍 Custom Server Deployment

### 1. VPS/Dedicated Server

```bash
# Clone repository
git clone https://github.com/mostiock/boles-smart-home-platform.git
cd boles-smart-home-platform

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

### 2. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'boles-smart-home',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

## 🔒 Security Considerations

### 1. Environment Variables

- Never commit API keys to repository
- Use hosting provider's environment variable settings
- Rotate API keys regularly

### 2. HTTPS Configuration

- Always deploy with HTTPS enabled
- Use SSL certificates (Let's Encrypt recommended)
- Configure HSTS headers

### 3. CSP Headers

Add to your hosting configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
```

## 📊 Performance Optimization

### 1. Build Optimization

- Static generation for product pages
- Image optimization enabled
- Automatic code splitting

### 2. CDN Configuration

- Enable CDN for static assets
- Configure proper cache headers
- Use image optimization services

### 3. Monitoring

```bash
# Add monitoring (example with Sentry)
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🎯 Domain Configuration

### 1. Custom Domain Setup

1. **DNS Configuration**:
   ```
   Type: CNAME
   Name: www
   Value: your-app.netlify.app
   
   Type: A
   Name: @
   Value: [Your hosting provider's IP]
   ```

2. **SSL Certificate**:
   - Most hosting providers offer free SSL
   - Let's Encrypt is automatically configured

### 2. Subdomain Setup

For admin dashboard on subdomain:

```
Type: CNAME
Name: admin
Value: your-app.netlify.app
```

## 🧪 Testing Deployment

### 1. Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Build completes without errors
- [ ] All routes accessible
- [ ] Admin dashboard functional
- [ ] Currency conversion working
- [ ] Image uploads working (if applicable)
- [ ] Mobile responsiveness verified

### 2. Post-deployment Testing

```bash
# Test critical paths
curl https://your-domain.com
curl https://your-domain.com/api/health
curl https://your-domain.com/admin
```

### 3. Performance Testing

- Use Lighthouse for performance audits
- Test loading times across different devices
- Verify SEO optimization

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **Environment Variables Not Loading**:
   - Verify variable names match exactly
   - Check hosting provider's environment settings
   - Restart deployment after changes

3. **404 Errors**:
   - Configure proper redirects for SPA routing
   - Check `netlify.toml` or hosting-specific configuration

### Support Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Netlify Support](https://docs.netlify.com/)
- [Vercel Support](https://vercel.com/docs)

---

## 🎉 Deployment Complete

Your BOLES Smart Home platform is now live! 

**Test the deployment with:**
- Browse all product categories
- Test pagination functionality  
- Login with demo accounts
- Access admin dashboard
- Verify currency conversion

**Demo URLs to test:**
- Homepage: `https://your-domain.com`
- Admin: `https://your-domain.com/admin`
- Categories: `https://your-domain.com/categories/smart-lighting`

---

Built with ❤️ by BOLES Enterprise Team