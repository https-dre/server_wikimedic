lint:
	npm run lint

docker_build:
	docker build -t server_wikimedic .

docker_start: docker_build
	docker run -d --rm --env-file .env -p 3000:3000 --name wikimedic server_wikimedic

docker_run: docker_build
	docker run --rm --env-file .env -p 3000:3000 --name wikimedic server_wikimedic

ci: lint docker_start
