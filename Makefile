run dev:
	yarn run dev

run build-prod:
	docker build . -t ranggarizky/instaapp-fe --platform linux/amd64

run push:
	$(MAKE) build-prod
	docker push ranggarizky/instaapp-fe