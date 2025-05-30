#!/bin/bash

# BOLES Smart Home Platform - New Repository Setup Script
echo "🏠 BOLES Smart Home Platform - Repository Setup"
echo "=============================================="
echo ""

# Suggested repository names
echo "📋 SUGGESTED REPOSITORY NAMES:"
echo "1. boles-smart-home-platform"
echo "2. smart-home-ecommerce-platform"
echo "3. boles-enterprise-platform"
echo "4. nextjs-smart-home-store"
echo "5. boles-smart-home-store"
echo ""

echo "💡 RECOMMENDED: boles-smart-home-platform"
echo ""

echo "⏳ Please follow these steps:"
echo ""
echo "1. 🌐 Go to https://github.com/new"
echo "2. 📝 Choose repository name (suggestion: boles-smart-home-platform)"
echo "3. 📄 Add description:"
echo "   'Complete e-commerce platform for smart home devices with admin dashboard, email notifications, and modern tech stack (Next.js 15, TypeScript, Supabase, Clerk)'"
echo ""
echo "4. 🏷️ Repository settings:"
echo "   ✅ Public repository"
echo "   ❌ Do NOT initialize with README (we have our own)"
echo "   ❌ Do NOT add .gitignore (we have our own)"
echo "   ❌ Do NOT choose a license (we have MIT license)"
echo ""
echo "5. 🔧 After creating repository, run the commands below:"
echo ""

# Get user input for repository details
read -p "Enter your GitHub username: " github_username
echo ""
read -p "Enter repository name (e.g., boles-smart-home-platform): " repo_name
echo ""

# Display the commands to run
echo "📤 COMMANDS TO PUSH TO NEW REPOSITORY:"
echo "======================================"
echo ""
echo "# Set up remote repository"
echo "git remote add origin https://github.com/$github_username/$repo_name.git"
echo ""
echo "# Push to new repository"
echo "git push -u origin main"
echo ""

# Also create the commands in a file for easy copy-paste
cat > push-to-github.sh << EOF
#!/bin/bash
echo "🚀 Pushing BOLES Smart Home Platform to GitHub..."
git remote add origin https://github.com/$github_username/$repo_name.git
git push -u origin main
echo ""
echo "✅ Repository successfully pushed!"
echo "🌐 View at: https://github.com/$github_username/$repo_name"
EOF

chmod +x push-to-github.sh

echo "💾 Commands saved to 'push-to-github.sh' for easy execution"
echo ""
echo "🏷️ SUGGESTED REPOSITORY TOPICS (add in GitHub settings):"
echo "nextjs, typescript, ecommerce, smart-home, admin-dashboard,"
echo "supabase, clerk-auth, tailwindcss, shadcn-ui, email-notifications,"
echo "bun, react, node, javascript, web-development"
echo ""
echo "📊 REPOSITORY STATS AFTER PUSH:"
echo "• 75+ files"
echo "• Complete documentation"
echo "• Production-ready codebase"
echo "• MIT license"
echo "• Professional README"
echo ""
echo "🎯 NEXT STEPS AFTER PUSH:"
echo "1. Add repository topics"
echo "2. Enable GitHub Pages (if desired)"
echo "3. Set up deployment to Vercel/Netlify"
echo "4. Configure environment variables for production"
echo ""
echo "🏆 Your BOLES Smart Home Platform will be showcased professionally!"
