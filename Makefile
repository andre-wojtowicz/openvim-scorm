site:
	@echo \* Preparing openvim website files...
	cd openvim && \
	git apply --whitespace=nowarn ../extension.patch
	@echo \* ...done

scorm:
	@echo \* Creating SCORM ZIP file...
	rm -rf dist
	mkdir dist
	cp -r imsmanifest.xml materials dist
	sed -i "s/Last edit: .../Last edit: $(shell date '+%Y-%m-%d %H:%M')/" dist/imsmanifest.xml
	cp -r openvim/* dist/materials
	cd dist && \
	zip "openvim-scorm-$(shell date '+%Y_%m_%d-%H_%M').zip" -r .
	@echo ------------------------------------------
	@echo \* SCORM ZIP file created:
	@ls ./dist/*.zip

clean:
	@echo \* Removing openvim website files and SCORM build directory...
	rm -rf dist
	@echo \*...done
