#!/bin/bash

# Modelia AI Studio - Docker Helper Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_info "Please edit .env file and set your environment variables before continuing."
    exit 1
fi

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_info "Docker is running ✓"
}

# Function to build and start services
start_services() {
    print_info "Building and starting services..."
    docker-compose up --build -d
    print_info "Services started successfully!"
    print_info "Web Client: http://localhost:8080"
    print_info "Backend API: http://localhost:3000"
    print_info "Database: localhost:5432"
}

# Function to stop services
stop_services() {
    print_info "Stopping services..."
    docker-compose down
    print_info "Services stopped."
}

# Function to view logs
view_logs() {
    print_info "Viewing logs... (Press Ctrl+C to exit)"
    docker-compose logs -f
}

# Function to reset everything
reset_all() {
    print_warning "This will delete all data including the database!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        print_info "Removing all containers, volumes, and data..."
        docker-compose down -v
        print_info "Reset complete."
    else
        print_info "Reset cancelled."
    fi
}

# Function to show status
show_status() {
    print_info "Service status:"
    docker-compose ps
}

# Function to run migrations
run_migrations() {
    print_info "Running database migrations..."
    docker-compose exec server pnpm db:push
    print_info "Migrations complete."
}

# Main script
case "$1" in
    start)
        check_docker
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        check_docker
        start_services
        ;;
    logs)
        view_logs
        ;;
    status)
        show_status
        ;;
    migrate)
        run_migrations
        ;;
    reset)
        reset_all
        ;;
    *)
        echo "Modelia AI Studio - Docker Helper"
        echo ""
        echo "Usage: $0 {start|stop|restart|logs|status|migrate|reset}"
        echo ""
        echo "Commands:"
        echo "  start    - Build and start all services"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  logs     - View logs from all services"
        echo "  status   - Show status of all services"
        echo "  migrate  - Run database migrations"
        echo "  reset    - Reset everything (deletes all data!)"
        exit 1
        ;;
esac
