.PHONY: help dev-up dev-down dev-logs prod-up prod-down prod-logs build clean

# Variables
DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.dev.yml
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yml

# Help
help:
	@echo "Available commands:"
	@echo "  dev-up     - Start development environment"
	@echo "  dev-down   - Stop development environment"
	@echo "  dev-logs   - View development logs"
	@echo "  prod-up    - Start production environment"
	@echo "  prod-down  - Stop production environment"
	@echo "  prod-logs  - View production logs"
	@echo "  build      - Build all services"
	@echo "  clean      - Remove all containers and volumes"

# Development
dev-up:
	$(DOCKER_COMPOSE_DEV) up -d --build

dev-down:
	$(DOCKER_COMPOSE_DEV) down

dev-logs:
	$(DOCKER_COMPOSE_DEV) logs -f

# Production
prod-up:
	$(DOCKER_COMPOSE_PROD) up -d --build

prod-down:
	$(DOCKER_COMPOSE_PROD) down

prod-logs:
	$(DOCKER_COMPOSE_PROD) logs -f

# Build
build:
	$(DOCKER_COMPOSE_DEV) build

# Clean
clean:
	$(DOCKER_COMPOSE_DEV) down -v
	docker system prune -f
