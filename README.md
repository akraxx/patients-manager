[![Build Status](https://travis-ci.org/akraxx/patients-manager.svg?branch=master)](https://travis-ci.org/akraxx/patients-manager)

# Patients Manager

## Contribution

### Requirements

* git
* docker
* docker-compose
* node & npm (> 13)
* angular-cli
* make

### Launch MongoDB and Keycloak first

```bash
make deploy-dev
```

### Backend

#### Install dependencies

```bash
make deps-backend
```

**What is used :**
* express
* inversify
* jwt auth
* mongoose
* nodemailer

#### Run

```bash
make dev-backend
```

Backend will be running on port 4000, authentication is disabled on dev environment.

Live reload is enabled (using ts-node-dev)

#### Build

```bash
make build-backend
```

### Frontend

#### Install dependencies

```bash
make deps-frontend
```

**What is used :**
* angular libraries
* nebular & bootstrap
* angular-keycloak
* ckeditor
* ngx-pagination
* echarts / chartjs
* angular-file-uploader
* intl

#### Run

```bash
make dev-frontend
```

Frontend will be running on port 4200.

Live reload is enabled (using ng serve)

#### Build

```bash
make build-frontend
```

# CI

Travis Build is automatically triggered for each git push : [![Build Status](https://travis-ci.org/akraxx/patients-manager.svg?branch=master)](https://travis-ci.org/akraxx/patients-manager)

A docker image will be pushed for the frontend and the backend on the docker hub.

* Docker image of the [frontend](https://hub.docker.com/repository/docker/akraxx/patients-manager-web/general)
* Docker image of the [backend](https://hub.docker.com/repository/docker/akraxx/patients-manager-api/general)

