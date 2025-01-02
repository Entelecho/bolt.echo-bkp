#!/bin/bash

# Load environment variables
source .env

# Determine environment
ENV=${1:-production}
echo "Deploying to $ENV environment..."

# Build the application
echo "Building application..."
npm run build

# Deploy to Cloudflare Workers
echo "Deploying to Cloudflare Workers..."
npx wrangler deploy --env $ENV

# If this is production, also deploy to staging
if [ "$ENV" = "production" ]; then
    echo "Also deploying to staging..."
    npx wrangler deploy --env staging
fi

echo "Deployment complete!"
