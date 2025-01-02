#!/bin/bash

# Load environment variables
source .env

# Function to list current workers
list_workers() {
    echo "Listing workers..."
    wrangler whoami
    wrangler workers list
}

# Function to deploy workers
deploy_workers() {
    ENV=${1:-production}
    echo "Deploying to $ENV environment..."
    
    # Build and deploy
    npm run build
    wrangler deploy --env $ENV
    
    if [ "$ENV" = "production" ]; then
        echo "Also deploying to staging..."
        wrangler deploy --env staging
    fi
}

# Main menu
while true; do
    echo -e "\nWorker Management Menu"
    echo "1) List current workers"
    echo "2) Deploy to production"
    echo "3) Deploy to staging"
    echo "4) Exit"
    
    read -p "Select an option: " choice
    
    case $choice in
        1) list_workers ;;
        2) deploy_workers production ;;
        3) deploy_workers staging ;;
        4) exit 0 ;;
        *) echo "Invalid option" ;;
    esac
done
