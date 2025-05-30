#!/bin/bash

# BOLES Smart Home Platform - Deployment Setup Script
# This script helps you set up automatic deployment for your project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BOLD}${BLUE}🚀 BOLES Smart Home - Deployment Setup${NC}"
    echo -e "${BLUE}=================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
check_project_structure() {
    if [[ ! -f "package.json" ]] || [[ ! -f "next.config.js" ]]; then
        print_error "This doesn't appear to be the BOLES Smart Home project directory"
        print_info "Please run this script from the boles-smart-shop directory"
        exit 1
    fi
    print_success "Project structure validated"
}

# Check if required tools are installed
check_dependencies() {
    echo -e "${BOLD}Checking dependencies...${NC}"
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js: $(node --version)"
    
    # Check for Bun
    if ! command -v bun &> /dev/null; then
        print_warning "Bun is not installed"
        print_info "Installing Bun..."
        curl -fsSL https://bun.sh/install | bash
        source ~/.bashrc
    fi
    print_success "Bun: $(bun --version)"
    
    # Check for Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    print_success "Git: $(git --version)"
    
    echo ""
}

# Install project dependencies
install_dependencies() {
    echo -e "${BOLD}Installing project dependencies...${NC}"
    bun install
    print_success "Dependencies installed"
    echo ""
}

# Build the project to test
test_build() {
    echo -e "${BOLD}Testing project build...${NC}"
    bun run build
    
    if [[ -d "dist" ]]; then
        print_success "Build completed successfully"
        print_info "Build output saved to: dist/"
        
        # Show build size
        if command -v du &> /dev/null; then
            BUILD_SIZE=$(du -sh dist/ | cut -f1)
            print_info "Build size: $BUILD_SIZE"
        fi
    else
        print_error "Build failed - dist/ directory not created"
        exit 1
    fi
    echo ""
}

# Check Git status
check_git_status() {
    echo -e "${BOLD}Checking Git repository status...${NC}"
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "This is not a Git repository"
        print_info "Please initialize Git first: git init"
        exit 1
    fi
    
    # Check for remote origin
    if ! git remote get-url origin > /dev/null 2>&1; then
        print_warning "No remote origin configured"
        print_info "Add remote: git remote add origin https://github.com/mostiock/boles-smart-home-platform.git"
    else
        REMOTE_URL=$(git remote get-url origin)
        print_success "Remote origin: $REMOTE_URL"
    fi
    
    # Check current branch
    CURRENT_BRANCH=$(git branch --show-current)
    print_info "Current branch: $CURRENT_BRANCH"
    
    echo ""
}

# Setup deployment platforms
setup_vercel() {
    echo -e "${BOLD}Setting up Vercel deployment...${NC}"
    
    print_info "Vercel configuration (vercel.json) is already set up"
    
    echo -e "${YELLOW}To complete Vercel setup:${NC}"
    echo "1. Go to https://vercel.com"
    echo "2. Sign up/login with your GitHub account"
    echo "3. Click 'New Project'"
    echo "4. Import: https://github.com/mostiock/boles-smart-home-platform"
    echo "5. Configure settings:"
    echo "   - Framework: Next.js"
    echo "   - Build Command: bun run build"
    echo "   - Output Directory: dist"
    echo "   - Install Command: bun install"
    
    echo ""
    echo -e "${YELLOW}For GitHub Actions integration, add these secrets:${NC}"
    echo "Repository Settings > Secrets and variables > Actions:"
    echo "- VERCEL_TOKEN (from Vercel Dashboard > Settings > Tokens)"
    echo "- VERCEL_ORG_ID (from team settings)"
    echo "- VERCEL_PROJECT_ID (from project settings)"
    
    echo ""
}

setup_netlify() {
    echo -e "${BOLD}Setting up Netlify deployment...${NC}"
    
    print_info "Netlify configuration (netlify.toml) is already set up"
    
    echo -e "${YELLOW}To complete Netlify setup:${NC}"
    echo "1. Go to https://netlify.com"
    echo "2. Sign up/login with your GitHub account"
    echo "3. Click 'New site from Git'"
    echo "4. Choose GitHub and select: boles-smart-home-platform"
    echo "5. Settings will be auto-detected from netlify.toml"
    
    echo ""
}

setup_github_pages() {
    echo -e "${BOLD}Setting up GitHub Pages...${NC}"
    
    print_info "GitHub Actions workflow (.github/workflows/deploy.yml) is already configured"
    
    echo -e "${YELLOW}To enable GitHub Pages:${NC}"
    echo "1. Go to your repository on GitHub"
    echo "2. Settings > Pages"
    echo "3. Source: GitHub Actions"
    echo "4. The workflow will deploy automatically on push to main"
    
    echo ""
}

# Deploy to test
deploy_test() {
    echo -e "${BOLD}Testing deployment...${NC}"
    
    # Check if there are any uncommitted changes
    if [[ -n $(git status --porcelain) ]]; then
        print_warning "You have uncommitted changes"
        echo -e "${YELLOW}Commit your changes to trigger deployment:${NC}"
        echo "git add ."
        echo "git commit -m 'Setup automatic deployment'"
        echo "git push origin main"
    else
        print_info "Repository is clean"
        echo -e "${YELLOW}To trigger deployment:${NC}"
        echo "git commit --allow-empty -m 'Test: trigger deployment'"
        echo "git push origin main"
    fi
    
    echo ""
}

# Show next steps
show_next_steps() {
    echo -e "${BOLD}${GREEN}🎉 Deployment setup complete!${NC}\n"
    
    echo -e "${BOLD}Next steps:${NC}"
    echo "1. Choose your preferred deployment platform:"
    echo "   - ⭐ Vercel (Recommended for Next.js)"
    echo "   - 🌐 Netlify (Great alternative)"
    echo "   - 📄 GitHub Pages (Static hosting)"
    
    echo ""
    echo "2. Set up automatic deployment by following the instructions above"
    
    echo ""
    echo "3. Test your deployment:"
    echo "   - Make a change to your code"
    echo "   - Commit and push to main branch"
    echo "   - Watch the automatic deployment happen!"
    
    echo ""
    echo -e "${BOLD}Useful commands:${NC}"
    echo "- Check deployment status: ${YELLOW}bun run deploy:check${NC}"
    echo "- Force deployment: ${YELLOW}bun run deploy:force${NC}"
    echo "- Build locally: ${YELLOW}bun run build${NC}"
    echo "- Start development: ${YELLOW}bun run dev${NC}"
    
    echo ""
    echo -e "${BOLD}Documentation:${NC}"
    echo "- 📖 Full deployment guide: AUTOMATIC-DEPLOYMENT.md"
    echo "- 🔧 Environment variables: .env.example"
    echo "- 🚀 GitHub repository: https://github.com/mostiock/boles-smart-home-platform"
    
    echo ""
    print_success "Happy deploying! 🚀"
}

# Main execution
main() {
    print_header
    
    check_project_structure
    check_dependencies
    install_dependencies
    test_build
    check_git_status
    
    echo -e "${BOLD}${BLUE}Setting up deployment platforms...${NC}\n"
    setup_vercel
    setup_netlify
    setup_github_pages
    
    deploy_test
    show_next_steps
}

# Run the setup
main "$@"