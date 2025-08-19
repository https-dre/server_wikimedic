lint:
	npm run lint

docker_start:
	docker build -t server_wikimedic .
	docker run -d --rm --env-file .env -p 3000:3000 --name wikimedic server_wikimedic

ci: lint docker_start
