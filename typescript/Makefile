.PHONY: build test

build:
	npm install
	npm run build

test: build
	node test.js
	node test_builder.js
	node test_dsl.js
