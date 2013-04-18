SRC = $(wildcard client/*/*.js)
CSS = $(wildcard client/*/*.css)
JSON = $(wildcard client/*/component.json)
HTML = $(wildcard client/*/*.html)
TEMPLATES = $(HTML:.html=.js)

build: components $(SRC) $(TEMPLATES) $(CSS) $(JSON)
	@component build

components: $(JSON)
	@component install
 
%.js: %.html
	@component convert $<
 
clean:
	rm -fr build components template.js

.PHONY: clean
