# Deployment Guide for Google Cloud App Engine

This guide provides step-by-step instructions for deploying the Voice Agent Web App to Google Cloud App Engine.

## Prerequisites

- Google Cloud SDK (`gcloud`) installed and configured
- Access to Google Cloud project: `ai-ac-470019`
- Node.js and npm installed locally for testing

## Project Information

- **Project ID**: `ai-ac-470019`
- **Service**: Google App Engine
- **Runtime**: Node.js

## Deployment Steps

### 1. Install Google Cloud SDK

If you haven't installed the Google Cloud SDK yet:

```bash
# macOS
brew install --cask google-cloud-sdk

# Or download from: https://cloud.google.com/sdk/docs/install
```

### 2. Authenticate with Google Cloud

```bash
# Login to your Google account
gcloud auth login

# Set the project
gcloud config set project ai-ac-470019
```

### 3. Create App Engine Configuration

Create an `app.yaml` file in the project root:

```yaml
runtime: nodejs20
env: standard

instance_class: F2

automatic_scaling:
  min_instances: 0
  max_instances: 10
  target_cpu_utilization: 0.65

env_variables:
  NODE_ENV: "production"

handlers:
  - url: /_next/static
    static_dir: .next/static
    secure: always

  - url: /.*
    script: auto
    secure: always
```

### 4. Update package.json

Ensure your `package.json` has the correct build and start scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p $PORT",
    "lint": "next lint"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 5. Create .gcloudignore

Create a `.gcloudignore` file to exclude unnecessary files from deployment:

```
.git
.gitignore
node_modules/
.next/cache/
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
.DS_Store
README.md
CLAUDE.md
```

### 6. Build the Application

```bash
# Install dependencies
npm install

# Build the Next.js application
npm run build
```

### 7. Deploy to App Engine

```bash
# Deploy to App Engine
gcloud app deploy --project=ai-ac-470019

# When prompted, confirm the deployment
```

### 8. View Your Deployed Application

```bash
# Open the deployed application in your browser
gcloud app browse --project=ai-ac-470019

# Or get the URL
gcloud app describe --project=ai-ac-470019
```

## Environment Variables

If your application requires environment variables (API keys, etc.), set them using:

```bash
# Set environment variables in app.yaml
env_variables:
  OPENAI_API_KEY: "your-api-key-here"
  NODE_ENV: "production"
```

Or use Google Cloud Secret Manager for sensitive data:

```bash
# Create a secret
gcloud secrets create openai-api-key --project=ai-ac-470019 --data-file=-
# (paste your API key and press Ctrl+D)

# Grant App Engine access to the secret
gcloud secrets add-iam-policy-binding openai-api-key \
  --member=serviceAccount:ai-ac-470019@appspot.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor \
  --project=ai-ac-470019
```

## Monitoring and Logs

```bash
# View logs
gcloud app logs tail --project=ai-ac-470019

# View application in Cloud Console
gcloud app open --project=ai-ac-470019
```

## Update Deployment

To deploy updates:

```bash
# Build the latest changes
npm run build

# Deploy
gcloud app deploy --project=ai-ac-470019
```

## Troubleshooting

### Build Fails

- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs: `gcloud app logs tail --project=ai-ac-470019`

### Application Won't Start

- Verify `start` script uses `$PORT` environment variable
- Check `app.yaml` configuration
- Review application logs

### Performance Issues

- Increase `instance_class` in `app.yaml` (F2, F4, F4_1G)
- Adjust `automatic_scaling` parameters
- Enable Cloud CDN for static assets

## Costs

App Engine charges based on:
- Instance hours
- Outbound bandwidth
- Other Google Cloud services used

Set up billing alerts in the Google Cloud Console to monitor costs.

## Useful Commands

```bash
# Check deployment status
gcloud app versions list --project=ai-ac-470019

# Stop a version
gcloud app versions stop VERSION_ID --project=ai-ac-470019

# Delete old versions
gcloud app versions delete VERSION_ID --project=ai-ac-470019

# View service details
gcloud app services list --project=ai-ac-470019
```

## Additional Resources

- [Google App Engine Documentation](https://cloud.google.com/appengine/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [App Engine Pricing](https://cloud.google.com/appengine/pricing)
