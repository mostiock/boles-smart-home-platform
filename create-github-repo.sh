#!/bin/bash

# BOLES Smart Home Platform - GitHub Repository Setup Script
# This script helps create and push the repository to GitHub

echo "🚀 BOLES Smart Home Platform - GitHub Setup"
echo "==========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Instructions for GitHub repository creation
echo "📋 INSTRUCTIONS:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: boles-smart-home-platform"
echo "3. Description: Complete e-commerce platform for smart home devices with comprehensive admin dashboard"
echo "4. Set as Public repository"
echo "5. Do NOT initialize with README (we have our own)"
echo "6. Click 'Create repository'"
echo ""

echo "⏳ After creating the repository on GitHub, enter your GitHub username:"
read -p "GitHub Username: " github_username

echo ""
echo "🔗 Setting up remote repository..."

# Add remote origin
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$github_username/boles-smart-home-platform.git"

echo "✅ Remote origin added: https://github.com/$github_username/boles-smart-home-platform.git"
echo ""

# Rename branch to main
git branch -M main

echo "📤 Pushing code to GitHub..."
echo "You may be prompted for your GitHub credentials..."
echo ""

# Push to GitHub
if git push -u origin main; then
    echo ""
    echo "🎉 SUCCESS! Repository created and code pushed!"
    echo ""
    echo "📍 Your repository is now available at:"
    echo "   https://github.com/$github_username/boles-smart-home-platform"
    echo ""
    echo "🔧 Recommended next steps:"
    echo "1. Add repository topics: nextjs, typescript, ecommerce, smart-home, admin-dashboard"
    echo "2. Set up environment variables for deployment"
    echo "3. Configure Supabase and Clerk for production"
    echo "4. Deploy to Vercel or Netlify"
    echo ""
    echo "📚 Documentation available in:"
    echo "   - README.md (main documentation)"
    echo "   - .same/ folder (detailed guides)"
    echo ""
else
    echo ""
    echo "❌ Error occurred during push. Please check:"
    echo "1. GitHub repository was created correctly"
    echo "2. You have access to the repository"
    echo "3. Your GitHub credentials are correct"
    echo ""
    echo "Try running: git push -u origin main"
fi
