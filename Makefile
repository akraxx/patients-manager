.PHONY: help dev-frontend dev-backend deploy-dev deploy-local deploy-production

help: ## prints help
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*: *.*## *" | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

dev-frontend: 	## frontend development with livereload
	cd frontend && ng serve --poll 1000

dev-backend: 	## bakend development with livereload
	npm run dev --prefix backend

deploy-dev: 	## deploy mongodb and keycloak only
	docker-compose up -d

deploy-local: 	## deploy using docker images locally built
	docker-compose -f docker-compose.yml -f docker-compose-local.yml up --build -d

deploy-production: ## deploy using docker images from docker hub
	./scripts/set-version.sh
	VERSION=$(cat .version) docker-compose -f docker-compose.yml -f docker-compose-production.yml up -d


