#!/bin/bash

# Load environment variables
source .env

# Install required packages
npm install @cloudflare/workers-sdk --save-dev

# Function to list current workers
list_workers() {
    echo "Listing current workers..."
    npx tsx scripts/list-workers.ts
}

# Function to cleanup workers
cleanup_workers() {
    echo "Cleaning up workers..."
    npx tsx scripts/cleanup-workers.ts
}

# Function to deploy workers
deploy_workers() {
    ENV=${1:-production}
    echo "Deploying to $ENV environment..."
    
    # Build and deploy
    npm run build
    npx wrangler deploy --env $ENV
    
    if [ "$ENV" = "production" ]; then
        echo "Also deploying to staging..."
        npx wrangler deploy --env staging
    fi
}

# Main menu
while true; do
    echo -e "\nWorker Management Menu"
    echo "1) List current workers"
    echo "2) Cleanup unused workers"
    echo "3) Deploy to production"
    echo "4) Deploy to staging"
    echo "5) Exit"
    
    read -p "Select an option: " choice
    
    case $choice in
        1) list_workers ;;
        2) cleanup_workers ;;
        3) deploy_workers production ;;
        4) deploy_workers staging ;;
        5) exit 0 ;;
        *) echo "Invalid option" ;;
    esac
done
