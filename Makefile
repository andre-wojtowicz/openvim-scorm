site:
	@echo \* Preparing openvim website files...
	cd openvim && \
	git apply --whitespace=nowarn ../extension.patch && \
	cp js/virtual_keyboard.js js/virtual_keyboard-pl.js && \
	cp js/view/context_help.js js/view/context_help-pl.js && \
	cp js/view/view.js js/view/view-pl.js && \
	cp js/tutorial/init_tutorial.js js/tutorial/init_tutorial-pl.js && \
	cp js/tutorial/sections.js js/tutorial/sections-pl.js && \
	cp css/tutorial.css css/tutorial-pl.css && \
	cp sandbox.html sandbox-pl.html && \
	cp tutorial.html tutorial-pl.html && \
	patch -p1 -i ../translation.patch && \
	mkdir -p production && \
	./toproduction.sh
	@echo \* ...done

scorm:
	@echo \* Creating SCORM ZIP file...
	rm -rf dist
	mkdir dist
	cp -r imsmanifest.xml materials dist
	sed -i "s/Last edit: .../Last edit: $(shell date '+%Y-%m-%d %H:%M')/" dist/imsmanifest.xml
	cp -r openvim/production/* dist/materials
	cd dist && \
	zip "openvim-scorm-$(shell date '+%Y_%m_%d-%H_%M').zip" -r .
	@echo ------------------------------------------
	@echo \* SCORM ZIP file created:
	@ls ./dist/*.zip

clean:
	@echo \* Removing openvim website files and SCORM build directory...
	rm -rf dist
	@echo \*...done
