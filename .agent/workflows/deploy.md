---
description: How to deploy the Task Planner to GitHub Pages
---

1. Ensure all changes are committed:

```bash
git add .
git commit -m "Ready for deployment"
```

2. Create a new repository on GitHub (do not initialize with README).

3. Link your local repo to GitHub (replace with your URL):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

4. Go to your repository on GitHub.com.
5. Navigate to **Settings** > **Pages**.
6. Under **Build and deployment** > **Branch**, select `main` and folder `/ (root)`.
7. Click **Save**.
8. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` in a few minutes.
