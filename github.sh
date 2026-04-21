#!/bin/bash

echo "=================================="
echo "🚀 CareerCanvas GitHub Helper"
echo "=================================="
echo ""

# Check git exists
if ! command -v git &> /dev/null; then
  echo "❌ Git is not installed."
  exit 1
fi

# Init repo if needed
if [ ! -d ".git" ]; then
  echo "📦 Initializing Git repository..."
  git init
else
  echo "✔ Git repository detected"
fi

echo ""

# Ask repo URL
read -p "🔗 Enter your GitHub repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "❌ No repo URL provided."
  exit 1
fi

echo ""

# Stage files
echo "📦 Staging files..."
git add .

# Commit message
read -p "💬 Commit message (default: Initial CareerCanvas setup): " COMMIT_MSG

if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="Initial CareerCanvas setup"
fi

git commit -m "$COMMIT_MSG"

echo ""

# Set remote safely
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

git branch -M main

echo ""
echo "🚀 Pushing to GitHub..."
echo ""

# Try push and capture error
git push -u origin main

# Check result
if [ $? -eq 0 ]; then
  echo ""
  echo "=================================="
  echo "🎉 SUCCESS!"
  echo "=================================="
  echo "✔ Project pushed to GitHub"
  exit 0
fi

echo ""
echo "⚠️ Push failed."

# AUTH CHECK LOGIC
echo ""
echo "Possible reasons:"
echo "- Not authenticated with GitHub"
echo "- Invalid repository URL"
echo "- No access rights"

echo ""
read -p "Do you want to authenticate Git now? (y/n): " AUTH_CHOICE

if [ "$AUTH_CHOICE" = "y" ] || [ "$AUTH_CHOICE" = "Y" ]; then
  echo ""
  echo "🔐 Starting Git authentication..."
  echo "If prompted, use:"
  echo "- GitHub username"
  echo "- Personal Access Token (NOT password)"
  echo ""

  git config --global credential.helper store

  # Retry push
  git push -u origin main

  if [ $? -eq 0 ]; then
    echo ""
    echo "=================================="
    echo "🎉 SUCCESS AFTER AUTH!"
    echo "=================================="
    exit 0
  else
    echo ""
    echo "❌ Still failed. Check token permissions or repo access."
    exit 1
  fi
else
  echo ""
  echo "⏭ Skipped authentication. You can run the script again later."
  exit 1
fi