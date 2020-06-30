.PHONY: help dev-frontend dev-backend deploy-dev deploy-local deploy-production

help: ## prints help
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*## *" | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

include .env
export $(shell sed 's/=.*//' .env)

deps-frontend: 	## download frontend dependencies
	npm ci --prefix frontend

deps-backend: 	## download backend dependencies
	npm ci --prefix backend

run-frontend: 	## frontend development with livereload
	cd frontend && ng serve --poll 1000

run-backend: 	## backend development with livereload
	npm run dev --prefix backend

build-frontend: 	## frontend build
	npm run build:prod --prefix frontend

build-backend: 	## backend build
	npm run build --prefix backend

deploy-dev: 	## deploy mongodb and keycloak only
	docker-compose up -d

deploy-local: 	## deploy using docker images locally built
	docker-compose -f docker-compose.yml -f docker-compose-local.yml up --build -d

deploy-production: ## deploy using docker images from docker hub
	./scripts/set-version.sh
	VERSION=`cat .version` docker-compose -f docker-compose.yml -f docker-compose-production.yml up -d

logs-production: ## follow logs in production
	./scripts/set-version.sh
	VERSION=`cat .version` docker-compose -f docker-compose.yml -f docker-compose-production.yml logs --tail=5 -f

