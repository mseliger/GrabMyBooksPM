grabMyBooks = new Object();

grabMyBooks.ext = new Object();
grabMyBooks.ext.createTimer = function()
{
	var result = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
	return result;
};
grabMyBooks.ext.initTimerWithCallback_OneShot = function(timer, timerEvent, time)
{
	timer.initWithCallback(timerEvent, time, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
};
grabMyBooks.ext.createFile = function()
{
	var result = Components.classes["@mozilla.org/file/local;1"]
                     .createInstance(Components.interfaces.nsILocalFile);
    return result;
};
grabMyBooks.ext.getHomeDir = function()
{
	var directoryService = Components.classes["@mozilla.org/file/directory_service;1"].
	                 getService(Components.interfaces.nsIProperties);
	var result = directoryService.get("Home", Components.interfaces.nsIFile);
	return result;
};
grabMyBooks.ext.getTmpDir = function()
{
	var directoryService = Components.classes["@mozilla.org/file/directory_service;1"].
	                 getService(Components.interfaces.nsIProperties);
	var result = directoryService.get("TmpD", Components.interfaces.nsIFile);
	return result;
};
grabMyBooks.ext.createFilePicker = function()
{
	var result = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
	return result;
};
grabMyBooks.ext.initFilePickerForLoad = function(filePicker, title)
{
	filePicker.init(window, title, Components.interfaces.nsIFilePicker.modeOpen);
};
grabMyBooks.ext.getFilePickerModeSave = function()
{
	return Components.interfaces.nsIFilePicker.modeSave;
};
grabMyBooks.ext.showFilePicker = function(filePicker, toDoWithFileFunction)
{
	var rv = filePicker.show();
	if (rv == Components.interfaces.nsIFilePicker.returnOK || rv == Components.interfaces.nsIFilePicker.returnReplace) 
	{
  		var file = filePicker.file;
  		toDoWithFileFunction(file);
    }
};
grabMyBooks.ext.createUnicodeConverter = function()
{
	var result = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	return result;
};
grabMyBooks.ext.createZipReader = function()
{
	var result = Components.classes["@mozilla.org/libjar/zip-reader;1"]
                .createInstance(Components.interfaces.nsIZipReader);
    return result;
};
grabMyBooks.ext.getZipEntryAsString = function(zipReader, zipEntryPath)
{
	var utf8Converter = Components.classes["@mozilla.org/intl/utf8converterservice;1"].getService(Components.interfaces.nsIUTF8ConverterService);
	var zipEntryInputStream = zipReader.getInputStream(zipEntryPath);
	
	var converterInputStream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);
	converterInputStream.init(zipEntryInputStream, "UTF-8", 1024, Components.interfaces.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
	var readObject = new Object();
	var result = [];
	while (converterInputStream.readString(4096, readObject) != 0)
	{
		result.push(readObject.value);
	}
	converterInputStream.close();
	zipEntryInputStream.close();
	var joinedResult = result.join("");
	return joinedResult;
};
grabMyBooks.ext.removeImgFromCache = function(imgUrl)
{
	var tools = Components.classes["@mozilla.org/image/tools;1"].getService(Components.interfaces.imgITools);
	var imgCache = tools.getImgCacheForDocument(grabMyBooks.bookTabBrowser.contentDocument);
	
	var imgUri = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(imgUrl, null, null);
	imgCache.removeEntry(imgUri);
};
grabMyBooks.ext.path = function(file)
{
	var result = file.path;
	return result;
};
grabMyBooks.ext.leafName = function(file)
{
	var result = file.leafName;
	return result;
};
grabMyBooks.ext.setLeafName = function(file, leafName)
{
	file.leafName = leafName;
};
grabMyBooks.ext.parentFile = function(file)
{
	var result = file.parent;
	return result;
};
grabMyBooks.ext.setTabLabel = function(tab, label)
{
	tab.label = label;
};
grabMyBooks.ext.setSelectedTab = function(tab)
{
	gBrowser.selectedTab = tab;
};
grabMyBooks.ext.getMainWindow = function()
{
	var result = document.getElementById("main-window");
	return result;
};
grabMyBooks.ext.openPopup = function(panel, win, infoPanelXPosition, infoPanelYPosition)
{
	panel.openPopup(win, "overlap", infoPanelXPosition, infoPanelYPosition, false, false);
};
grabMyBooks.ext.hidePopup = function(panel)
{
	panel.hidePopup();
};

grabMyBooks.ext.getWebBrowserPersist = function()
{
	var result = Components.classes["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Components.interfaces.nsIWebBrowserPersist);
	result.persistFlags = Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
	result.persistFlags |= Components.interfaces.nsIWebBrowserPersist.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;
	return result;
};
grabMyBooks.ext.listenToWebBrowserPersist = function(webBrowserPersist, endFunction)
{
	var progressListener = new Object();
	progressListener.onProgressChange =
		function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) 
	  	{
			var percentComplete = (aCurTotalProgress/aMaxTotalProgress)*100;
		}; 
	progressListener.onStateChange = 
		function(endFunction)
		{	
	  		return function(aWebProgress, aRequest, aStateFlags, aStatus)
	  		{
	  			if(aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP)
	  			{
	  				endFunction();
	  			}
	  		};
		}(endFunction);
		
	progressListener.onStatusChange =
		function(aWebProgress, aRequest, aStatus, aMessage)
		{
		};
	
	webBrowserPersist.progressListener = progressListener;
};

grabMyBooks.ext.getPrivacyContext = function()
{
	var privacyContext = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                     .getInterface(Components.interfaces.nsIWebNavigation)
                                     .QueryInterface(Components.interfaces.nsILoadContext);
    return privacyContext;
};


grabMyBooks.ext.getIoService = function()
{
	var result = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	return result;
};

grabMyBooks.ext.emptySelectNode = function(selectNode)
{
	selectNode.removeAllItems();
}
grabMyBooks.ext.setUiNodeValue = function(node, value)
{
	node.value = value;
}

grabMyBooks.ext.isImgSrcFullUrl = function(imgSrc)
{
	return false;
};


grabMyBooks.ext.appendItemToSelect = function(selectNode, text)
{
	selectNode.appendItem(text);
};
grabMyBooks.ext.getUriUrl = function(uri)
{
	var result = uri.spec;
	return result;
};
grabMyBooks.ext.getSelectChangeEvent = function()
{
	return "command";
};
grabMyBooks.ext.getNormalImageQuality = function()
{
	return 0.2;
};

grabMyBooks.ext.extraFillOptions = function()
{
};

grabMyBooks.ext.getWrappedJSObject = function(object)
{
	return object.wrappedJSObject;
};

grabMyBooks.ext.getCoverHtmlObject = function(imgDiv, savedImgInfo)
{
	var canvas = savedImgInfo.getAsCanvas(grabMyBooks.bookTabBrowser.contentDocument, false).canvas;
	canvas.style.margin="auto";
	canvas.style.display="inline";
	imgDiv.appendChild(canvas);
	savedImgInfo.expandCanvas(canvas);
	return canvas;
};

grabMyBooks.ext.getFilePickerFilePath = function(filePicker, selectedFile)
{
	var result = filePicker.fileURL.resolve("");
	return result;
};

grabMyBooks.onDeleteAll = function()
{
	grabMyBooks.ext.deleteBookContent();
};

grabMyBooks.ext.checkArticlesForWrite = function(articles)
{
	return articles;
};

grabMyBooks.ext.setImgSrc = function(imgObject, imgSrc)
{
	imgObject.src = imgSrc;
};

grabMyBooks.ext.onSelectedCoverImgPath = function(path)
{
	return path;
};

grabMyBooks.ext.createDirImgTmp = function()
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	var result = grabMyBooks.initDir(saveDir, grabMyBooks.img.tmpDirName);
	return result;
};

grabMyBooks.ext.getImgSrcFromName = function(imgName)
{
	var imgTmpFile = grabMyBooks.ext.createFile();
	imgTmpFile.initWithPath(grabMyBooks.ext.path(grabMyBooks.img.getImgTmpDir()));
	imgTmpFile.append(imgName);
	var ioService = grabMyBooks.ext.getIoService();
	var url = ioService.newFileURI(imgTmpFile);
	var imgSrc = grabMyBooks.ext.getUriUrl(url);
	return imgSrc;
};

grabMyBooks.ext.getImgSrcFromNameForBookLoad = function(imgName)
{
	var result = grabMyBooks.ext.getImgSrcFromName(imgName);
	return result;
};

grabMyBooks.ext.onFillBook = function()
{
	
};

grabMyBooks.onHtmlArticleDisplayed = function(containingNode)
{
	var doc = containingNode.ownerDocument;
	var toDoWithLinksFunction =
		function(aNode, index, count)
		{
			var href = aNode.getAttribute("href");
			var eventFunction =
				function(href)
				{
					return function(e)
					{
						grabMyBooks.ext.openWebSiteUrl(href);
						e.preventDefault();
						return false;
					};
				}(href);
				aNode.addEventListener("click",eventFunction,false);
		};
	grabMyBooks.xml.xPathQueryFunction("//a", doc, containingNode, toDoWithLinksFunction);
};

grabMyBooks.grabMyBooksUrl = "http://www.grabmybooks.com";
grabMyBooks.widgetDefaultCover = grabMyBooks.grabMyBooksUrl+"/img/grabBook2.png";
grabMyBooks.extensionId = "info@grabMyBooks.com";
grabMyBooks.toolBarButtonId = "grabMyBooksToolbarButton";
grabMyBooks.bookMailFrom = "no-reply@grabMyBooks.com";

grabMyBooks.PR_RDONLY      = 0x01;  
grabMyBooks.PR_WRONLY      = 0x02;  
grabMyBooks.PR_RDWR        = 0x04;  
grabMyBooks.PR_CREATE_FILE = 0x08;  
grabMyBooks.PR_APPEND      = 0x10;  
grabMyBooks.PR_TRUNCATE    = 0x20;  
grabMyBooks.PR_SYNC        = 0x40;  
grabMyBooks.PR_EXCL        = 0x80;

grabMyBooks.filePicker;
grabMyBooks.loadFilePicker;
grabMyBooks.tempDir;
grabMyBooks.homeDir;
grabMyBooks.saveDir = ".grabMyBooks";
grabMyBooks.detectionRuleFileName = "detectionRules.xml";
grabMyBooks.optionsFileName = "options.xml";
grabMyBooks.articles = [];
grabMyBooks.infoPanel;
grabMyBooks.infoIFrame;
grabMyBooks.pRatio = 60;
grabMyBooks.minimumPCount = 2;
grabMyBooks.supportedExtensions = ["epub","mobi"];
grabMyBooks.conversionNeededExtensions = ["mobi"];

grabMyBooks.timer = null;
grabMyBooks.getTimer = function()
{
	if(grabMyBooks.timer == null)
	{
		grabMyBooks.timer = grabMyBooks.ext.createTimer();
	}
	return grabMyBooks.timer;
};



grabMyBooks.bookTabBrowser = null;
grabMyBooks.bookTab = null;
grabMyBooks.articleDisplayed;
grabMyBooks.isEditMode = false;
grabMyBooks.contentNode;
grabMyBooks.articleNode;
grabMyBooks.textAreaNode;
grabMyBooks.titleEditNode;
grabMyBooks.title2EditNode;
grabMyBooks.editSpan;
grabMyBooks.updateIconsForReadFunction;
grabMyBooks.updateIconsForEditFunction;
grabMyBooks.bookIcon;

grabMyBooks.isEmpty = function(text)
{
	if(text==null)
	{
		return true;
	}
	if(grabMyBooks.isEmptyObject(text.replace))
	{
		return true;
	}
	text = text.replace(/\s+/g, "");
	if(text.length==0)
	{
		return true;
	}
	return false;
};

grabMyBooks.isEmptyObject = function(obj)
{
	if(typeof obj == "undefined")
	{
		return true;
	}
	if(obj==null)
	{
		return true;
	}
	return false;
};

grabMyBooks.ifEmpty = function(text, emptyValue)
{
	if(grabMyBooks.isEmpty(text))
	{
		return emptyValue;
	}
	return text;
};

grabMyBooks.ifNumber = function(text, notNumberValue)
{
	if(isNaN(text))
	{
		return notNumberValue;
	}
	return parseInt(text);
};

grabMyBooks.getEventFunction = function(toWrapFunction)
{
	var result =
		function(toWrapFunction)
		{
			return function(e)
			{
				toWrapFunction();
			};
		}(toWrapFunction);
	return result;
};
grabMyBooks.attachNonEventFunction = function(eventType, node, toWrapFunction)
{
	node.addEventListener(eventType, grabMyBooks.getEventFunction(toWrapFunction), false);
};

grabMyBooks.scrollToTop = function(node, timer)
{
	var toDoFunction =
		function(node)
		{
			return function()
			{
				node.scrollTop = 0;
			}
		}(node);
	grabMyBooks.execWithAnyTimer(timer, toDoFunction, 1);
};
grabMyBooks.scrollToNode = function(nodeToScroll, destinationNode, timer)
{
	var toDoFunction =
		function(nodeToScroll, destinationNode)
		{
			return function()
			{
				var toScrollValue = destinationNode.offsetTop;
				nodeToScroll.scrollTop = toScrollValue;
			}
		}(nodeToScroll, destinationNode);
	grabMyBooks.execWithAnyTimer(timer, toDoFunction, 1);
};

grabMyBooks.getElementAbsolutePosition = function(node)
{
	var result = new Object();
	result.x = node.offsetLeft;
	result.y = node.offsetTop;
	result.width = null;
	result.height = null;
	var currentOffsetParent = node.offsetParent;
	while(!grabMyBooks.isEmptyObject(currentOffsetParent))
	{
		result.x+=currentOffsetParent.offsetLeft;
		result.y+=currentOffsetParent.offsetTop;
		currentOffsetParent = currentOffsetParent.offsetParent;
	}
	result.width = node.offsetWidth;
	result.height = node.offsetHeight;
	return result;
};

grabMyBooks.isPositionOnNode = function(x, y, node)
{
	var getElementAbsolutePositionResult =
		grabMyBooks.getElementAbsolutePosition(node);
	
	var result = (x>=getElementAbsolutePositionResult.x);
	result = result && (x<=(getElementAbsolutePositionResult.x+getElementAbsolutePositionResult.width));
	result = result && (y>=getElementAbsolutePositionResult.y);
	result = result && (y<=(getElementAbsolutePositionResult.y+getElementAbsolutePositionResult.height));
	return result;
};

grabMyBooks.isNodeChildOf = function(node, parentNode)
{
	if(node == parentNode)
	{
		return true;
	}
	var nodeParentNode = node.parentNode;
	if(nodeParentNode==null)
	{
		return false;
	}
	return grabMyBooks.isNodeChildOf(nodeParentNode, parentNode);
};

grabMyBooks.deleteTmpFiles = function(writeBookContext)
{
	var generatedFile = grabMyBooks.ext.createFile();
		
	var generatedTmpDir = grabMyBooks.ext.createFile();
		generatedTmpDir.initWithPath(grabMyBooks.ext.path(grabMyBooks.tempDir));
		generatedTmpDir.append(writeBookContext.tempDirName);
	
	
	var currentSupportedExtension;
	for(var i_supportedExtension=0; i_supportedExtension<grabMyBooks.supportedExtensions.length; i_supportedExtension++)
	{
		currentSupportedExtension = grabMyBooks.supportedExtensions[i_supportedExtension];
		generatedFile.initWithPath(grabMyBooks.ext.path(grabMyBooks.tempDir));
		generatedFile.append(writeBookContext.tempGeneratedFileName+"."+currentSupportedExtension);
		if(generatedFile.exists())
		{
			generatedFile.remove(false);
		}
	}
	
	if(generatedTmpDir.exists())
	{
		generatedTmpDir.remove(true);
	}
		
};

grabMyBooks.addZeroIfNeeded = function(number)
{
  	if(number<10)
  	{
  		return '0'+number;
  	}
  	return ''+number;
};

grabMyBooks.addZerosIfNeeded = function(number, numberLength)
{
  	var result = ""+number;
  	while(result.length<numberLength)
  	{
  		result = "0"+result;
  	}
  	return result;
};

grabMyBooks.getLoadFile = function(toToWithFileFunction)
{
	grabMyBooks.ext.showFilePicker(grabMyBooks.loadFilePicker, toToWithFileFunction);
};

grabMyBooks.getSaveFileNameWithoutExtension = function(writeBookContext)
{
	var result;
	
	if(grabMyBooks.metadata.isTitleDefault(writeBookContext.metadata))
	{
		var nowDate = new Date();
	  	var year = nowDate.getFullYear();
	  	var month = grabMyBooks.addZeroIfNeeded(nowDate.getMonth()+1);
	  	var day = grabMyBooks.addZeroIfNeeded(nowDate.getDate());
	  	var hours = grabMyBooks.addZeroIfNeeded(nowDate.getHours());
	  	var minutes = grabMyBooks.addZeroIfNeeded(nowDate.getMinutes());
	  	result = "articlesBook_"+year+"_"+month+"_"+day+"_"+hours+"_"+minutes;
	}
	else
	{
		result = writeBookContext.metadata.title.replace(/\s+/g,"_");
		result = writeBookContext.metadata.title.replace(/[\\\/\?\%\*\#\:\|\"\'\<\>]/g,"_");
	}
	
	return result;
};

grabMyBooks.getSaveFileName = function(writeBookContext)
{
	var result = grabMyBooks.getSaveFileNameWithoutExtension(writeBookContext);
	result = result+"."+grabMyBooks.options.defaultExtension;
	
	return result;
};

grabMyBooks.handleSaveFileExtension = function(file, writeBookContext)
{
	var fileLeafName = grabMyBooks.ext.leafName(file).toLowerCase();
	writeBookContext.fileNameWithoutExtension = grabMyBooks.ext.leafName(file);
	
	var extensionSeen = false;
	var currentExtensionIndex;
	for(var i_supportedExtension=0; i_supportedExtension<grabMyBooks.supportedExtensions.length; i_supportedExtension++)
	{
		currentSupportedExtension = grabMyBooks.supportedExtensions[i_supportedExtension];
		currentExtensionIndex = fileLeafName.indexOf("."+currentSupportedExtension);
		if(currentExtensionIndex>0 && (currentExtensionIndex==fileLeafName.length-currentSupportedExtension.length-1))
		{
			extensionSeen = true;
			writeBookContext.selectedExtension = currentSupportedExtension;
			break;
		}
	}
	if(!extensionSeen)
	{
		grabMyBooks.ext.setLeafName(file, grabMyBooks.ext.leafName(file) + "." + grabMyBooks.options.defaultExtension);
		writeBookContext.selectedExtension = grabMyBooks.options.defaultExtension;
	}
	
	writeBookContext.fileNameWithoutExtension = grabMyBooks.ext.leafName(file).substr(0, grabMyBooks.ext.leafName(file).length - writeBookContext.selectedExtension.length-1);
	
	
	if(grabMyBooks.isConversionNeeded(writeBookContext))
	{
		var testOutputConverterResult = grabMyBooks.testOutputConverter(writeBookContext);
		if(!testOutputConverterResult.valid)
		{
			grabMyBooks.bookPopin.showMessage("The '"+writeBookContext.selectedExtension+"' file format requires a valid Calibre configuration in the options.<br><br>"+testOutputConverterResult.errorMessage);
			return false;
		}
	}
	
	return true;
};

grabMyBooks.getSaveFile = function(writeBookContext, toDoOnSaveFileReadyFunction)
{
	
	var defaultFileName = grabMyBooks.getSaveFileName(writeBookContext);
	
	grabMyBooks.filePicker = grabMyBooks.ext.createFilePicker();
	
	var extensionFilterValue = "*."+grabMyBooks.options.defaultExtension+";";
	var filterLabel = "ebook ("+grabMyBooks.options.defaultExtension;
	var currentSupportedExtension;
	for(var i_supportedExtension=0; i_supportedExtension<grabMyBooks.supportedExtensions.length; i_supportedExtension++)
	{
		currentSupportedExtension = grabMyBooks.supportedExtensions[i_supportedExtension];
		if(currentSupportedExtension == grabMyBooks.options.defaultExtension)
		{
			continue;
		}
		extensionFilterValue += "*."+currentSupportedExtension+";";
		
		filterLabel+=", ";
		filterLabel+=currentSupportedExtension;
	}
	filterLabel+=")";
	
	grabMyBooks.filePicker.appendFilter(filterLabel, extensionFilterValue);
	grabMyBooks.filePicker.init(window, "Save to", grabMyBooks.ext.getFilePickerModeSave());
	
  	
  	grabMyBooks.filePicker.defaultString = defaultFileName;
  	grabMyBooks.filePicker.defaultExtension = grabMyBooks.options.defaultExtension;
  	
  	
  		var filePickerToDoWithFileFunction =
  			function(writeBookContext, toDoOnSaveFileReadyFunction)
  			{
  				return function(file)
  				{
  					var handleExtensionResult = grabMyBooks.handleSaveFileExtension(file, writeBookContext);
  		
			  		if(handleExtensionResult)
			  		{
			  			toDoOnSaveFileReadyFunction(file);
			  		}
  				};
  			}(writeBookContext, toDoOnSaveFileReadyFunction);
  		
  	grabMyBooks.ext.showFilePicker(grabMyBooks.filePicker, filePickerToDoWithFileFunction);
};

grabMyBooks.isConversionNeeded = function(writeBookContext)
{
	var selectedExtension = writeBookContext.selectedExtension;
	var currentConversionNeededExtension;
	for(var i_conversionNeededExtension=0; i_conversionNeededExtension<grabMyBooks.conversionNeededExtensions.length; i_conversionNeededExtension++)
	{
		currentConversionNeededExtension = grabMyBooks.conversionNeededExtensions[i_conversionNeededExtension];
		if(currentConversionNeededExtension == selectedExtension)
		{
			return true;
		}
	}
	return false;
}

grabMyBooks.testOutputConverter = function(writeBookContext)
{
	var result = new Object();

	var setErrorFunction =
		function(result)
		{
			return function(message)
			{
				result.valid = false;
				result.errorMessage = message;
			};
		}(result);
	
	var converterPath = grabMyBooks.options.outputConverterPath;
	if(grabMyBooks.isEmpty(converterPath))
	{
		setErrorFunction("Calibre converter path is empty");
		return result;
	}
	try
	{
		var eBookConverterFile = grabMyBooks.ext.createFile();  
			eBookConverterFile.initWithPath(converterPath);
		if(!eBookConverterFile.exists())
		{
			setErrorFunction("Calibre converter cannot be found:'"+converterPath+"'");
			return result;
		}
		if(!eBookConverterFile.isExecutable())
		{
			setErrorFunction("Calibre converter path is not executable:'"+converterPath+"'");
			return result;
		}
		writeBookContext.eBookConverterFile = eBookConverterFile;
	}
	catch(e)
	{
		setErrorFunction("Calibre converter path is incorrect: '"+converterPath+"'");
		return result;
	}
	
	result.valid = true;
	return result;
};

  
grabMyBooks.ext.writeFile = function(dir, fileName, content)
{
  	var file = grabMyBooks.ext.createFile();
	file.initWithPath(grabMyBooks.ext.path(dir));
	file.append(fileName);
	
  	var outputStream =
         Components.classes["@mozilla.org/network/file-output-stream;1"].
         createInstance( Components.interfaces.nsIFileOutputStream );
     outputStream.init( file, 0x04 | 0x08 | 0x20, 420, 0 );
     
     var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].  
                 createInstance(Components.interfaces.nsIConverterOutputStream);  
	converter.init(outputStream, "UTF-8", 0, 0);  
	converter.writeString(content);  
	converter.close();
	return file;
};

grabMyBooks.ext.readFile = function(dir, fileName)
{
  	var file = grabMyBooks.ext.createFile();
	file.initWithPath(grabMyBooks.ext.path(dir));
	file.append(fileName);
	
	if(!file.exists())
	{
		return "";
	}
	
  	var inputStream =
         Components.classes["@mozilla.org/network/file-input-stream;1"].
         createInstance( Components.interfaces.nsIFileInputStream );
     inputStream.init( file, -1 , 0, 0 );
     
     var converter = Components.classes["@mozilla.org/intl/converter-input-stream;1"].  
                 createInstance(Components.interfaces.nsIConverterInputStream);  
	converter.init(inputStream, "UTF-8", 0, 0);  
	var result = "";
	var read = 0;
	var currentString = new Object();
	do
	{
		read = converter.readString(0xffffffff, currentString);
		result += currentString.value;
	} 
	while(read!=0);
	converter.close();
	return result;
};

grabMyBooks.createDir = function(parentDirPath, dirName)
{
	return grabMyBooks.ext.createDirBase(parentDirPath, dirName, false);
};

grabMyBooks.createDirTmp = function(parentDirPath, dirName)
{
	return grabMyBooks.ext.createDirBase(parentDirPath, dirName, true);
};
  
grabMyBooks.ext.createDirBase = function(parentDirPath, dirName, temporary)
{
  	var dir = grabMyBooks.ext.createFile();
	dir.initWithPath(parentDirPath);
	dir.append(dirName);
	if(temporary)
	{
		dir.createUnique(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0o777);
	}
	else
	{
		dir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0o777);
	}
	return dir;
};

grabMyBooks.ext.getOrCreateDir = function(parentDirPath, dirName)
{
	var dir = grabMyBooks.ext.createFile();
	dir.initWithPath(parentDirPath);
	dir.append(dirName);
	
	if(!dir.exists())
	{
		dir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0o777);
	}
	return dir;
};
  
grabMyBooks.ext.createZipFile = function(dir, zipFileName, filesBaseDir, filesTab)
{
  	var zipFile = grabMyBooks.ext.createFile();
	zipFile.initWithPath(grabMyBooks.ext.path(dir));
	zipFile.append(zipFileName);
	if(zipFile.exists())
	{
		zipFile.remove(false);
	}
	
  	var zipWriter = Components.classes["@mozilla.org/zipwriter;1"]
                .createInstance(Components.interfaces.nsIZipWriter);
  	zipWriter.open(zipFile, grabMyBooks.PR_RDWR | grabMyBooks.PR_CREATE_FILE | grabMyBooks.PR_TRUNCATE);
  	grabMyBooks.ext.addEntryFileRecursivly(zipWriter, filesTab, filesBaseDir);
	zipWriter.close();
	return zipFile;
};
  
grabMyBooks.ext.addEntryFileRecursivly = function(zipWriter, filesTab, filesBaseDir)
{
  	var i_file;
  	var relativePath;
  	var fileBaseDirIndex;
  	var compressionMode;
  	var normalZip = Components.interfaces.nsIZipWriter.COMPRESSION_DEFAULT;
  	var noZip = Components.interfaces.nsIZipWriter.COMPRESSION_NONE;
  	for(i_file=0;i_file<filesTab.length;i_file++)
  	{
  		if(grabMyBooks.ext.leafName(filesTab[i_file])=="mimetype")
  		{
  			compressionMode = noZip;
  		}
  		else
  		{
  			compressionMode = normalZip;
  		}
  		fileBaseDirIndex = grabMyBooks.ext.path(filesTab[i_file]).indexOf(grabMyBooks.ext.path(filesBaseDir));
  		if(fileBaseDirIndex==-1)
  		{
  			continue;
  		}
  		relativePath = grabMyBooks.ext.path(filesTab[i_file]).substr(fileBaseDirIndex + grabMyBooks.ext.path(filesBaseDir).length + 1);
  		relativePath = relativePath.replace(/\\/g,"/");
  		zipWriter.addEntryFile(relativePath, compressionMode, filesTab[i_file], false);
  		if(filesTab[i_file].isDirectory())
  		{
  			var childEntries = filesTab[i_file].directoryEntries;
  			var childFiles = [];
			while(childEntries.hasMoreElements())
			{
			  var entry = childEntries.getNext();
			  entry.QueryInterface(Components.interfaces.nsIFile);
			  childFiles.push(entry);
			} 
			grabMyBooks.ext.addEntryFileRecursivly(zipWriter, childFiles, filesBaseDir);
  		} 
  	} 
};

grabMyBooks.WriteBookContext = function(articles, blockIfEditMode, coverSavedImgInfo, metadata)
{
	this.articles = grabMyBooks.ext.checkArticlesForWrite(articles);
	this.blockIfEditMode = blockIfEditMode;
	this.coverSavedImgInfo = coverSavedImgInfo;
	this.metadata = metadata;
	this.eBookConverterFile = null;
	this.tempDirName = "grabMyBooksTmpDir";
	this.tempGeneratedFileName = "generated";
	this.overridenDestinationFile = null;
	this.showFileWrittenMessage = true;
	this.grabToDirCheckDone = false;
	this.endFunction = null;
	this.endOfWriting = function()
	{
		var deleteTmpFilesFunction =
			function(writeBookContext)
			{
				return function()
				{
					grabMyBooks.deleteTmpFiles(writeBookContext);
				};
			}(this);
		var endToDo =
			function(writeBookContext, deleteTmpFilesFunction)
			{
				return function()
				{
					if(writeBookContext.endFunction != null)
					{
						writeBookContext.endFunction(writeBookContext.writeBookEndInfo);
					}
					deleteTmpFilesFunction();
				};
			}(this, deleteTmpFilesFunction);
		if(this.mailToInfo != null)
		{
			grabMyBooks.ext.mailBook(this, endToDo, deleteTmpFilesFunction);
		}
		else
		{
			endToDo();
		}
	};
	this.forceOverride = false;
	this.writeBookEndInfo = new Object();
	this.writeBookEndInfo.savedToFile = null;
	this.writeBookEndInfo.epubCopySavedToFile = null;
	this.writeBookEndInfo.sentViaMail = false;
	
	this.onBookFileReadyFunction = null;
	
	this.mailAlreadyTriedWithError = false;
	this.mailToInfo = null;
	this.mailCommandFile = null;
};

grabMyBooks.ext.mailBook = function(writeBookContext, endFunction, errorFunction)
{
	var mailProcess = Components.classes["@mozilla.org/process/util;1"]  
				                        .createInstance(Components.interfaces.nsIProcess);
	var mailObserver = new Object();
    mailObserver.observe =
    	function(mailProcess, writeBookContext, endFunction, errorFunction)
    	{
    		return function(subject, topic, data)
    		{
    			if(topic!="process-finished" && topic!="process-failed")
    			{
    				errorFunction();
    				return;
    			}
    			var exitValue = mailProcess.exitValue;
				if(exitValue==0)
				{
					writeBookContext.writeBookEndInfo.sentViaMail = true;
					endFunction();
				}
				else
				{
					errorFunction();
					grabMyBooks.SmallInfo.showSmallInfoPanel(
							"Error while trying to send mail.",
							 function(writeBookContext)
							 {
							 	 return function(smallInfoState)
								 {
									smallInfoState.iconType = "ERROR";
									smallInfoState.buttonOkFunction =
										writeBookContext.mailToInfo.mailToErrorFunction;
								 };
						 	 }(writeBookContext)
					);
				}
    		};
    	}(mailProcess, writeBookContext, endFunction, errorFunction);

	mailProcess.init(writeBookContext.mailCommandFile);
	var mailOptionsArgs = ["-s", grabMyBooks.ext.leafName(writeBookContext.writeBookEndInfo.savedToFile), "-e", grabMyBooks.options.mailSecurity, "-r", grabMyBooks.options.mailServer];
	var mailCommandArgs = ["-a", grabMyBooks.ext.path(writeBookContext.writeBookEndInfo.savedToFile), grabMyBooks.options.mailFrom, grabMyBooks.options.mailTo, "Please find your book attached to this mail."]
	
	
	var mailExtraArgs = grabMyBooks.options.mailCommandExtra;
	if(mailExtraArgs == null)
	{
		mailExtraArgs = "";
	}
	var mailExtraArgTab = grabMyBooks.splitBySpaceAllowingQuotes(mailExtraArgs);
	if(mailExtraArgTab != null)
	{
		grabMyBooks.tabCopy2(mailOptionsArgs, mailExtraArgTab);
	}
	var mailArgs = [];
	grabMyBooks.tabCopy2(mailArgs, mailOptionsArgs);
	grabMyBooks.tabCopy2(mailArgs, mailCommandArgs);
	mailProcess.runAsync(mailArgs, mailArgs.length, mailObserver);
};

grabMyBooks.splitBySpaceAllowingQuotes = function(s)
{
	var result = s.match(/[^\s"]+|"(?:\\"|[^"])+"/g);
	if(result == null)
	{
		return [];
	}
	var removeQuotesFunction =
		function(s)
		{
			if(s.indexOf("\"")==0 && s.length>0)
			{
				s = s.substring(1);
			}
			if(s.indexOf("\"")==(s.length-1) && s.length>0)
			{
				s = s.substring(0,s.length-1);
			}
			return s;
		};
	result = grabMyBooks.tabTransform(result, removeQuotesFunction);
	return result;
};

grabMyBooks.handleGrabToDir = function(writeBookContext)
{
	writeBookContext.grabToDirCheckDone = true;
	
	var onErrorFunction =
		function(writeBookContext)
		{
			return function()
			{
				grabMyBooks.writeBook(writeBookContext);
			};
		}(writeBookContext);
	
	var pathErrorPrepareSmallInfoStateFunction =
		function(onErrorFunction)
		{
			return function(smallInfoState)
			{
				smallInfoState.iconType = "ERROR";
				smallInfoState.buttonOkFunction = onErrorFunction;
			};
		}(onErrorFunction);
	
	var grabToDirFile = grabMyBooks.ext.createFile();
     
    try
    {
    	grabToDirFile.initWithPath(grabMyBooks.options.grabToDir);
    }
    catch(e)
    {
    	var pathErrorMessage = "Path <u>"+grabMyBooks.options.grabToDir+"</u> is not correct."
    	grabMyBooks.SmallInfo.showSmallInfoPanel(pathErrorMessage, pathErrorPrepareSmallInfoStateFunction);
    	return;
    }
    
    if(!grabToDirFile.exists())
    {
    	var pathDoesntExistErrorMessage = "Path <u>"+grabMyBooks.options.grabToDir+"</u> doesn't exist.";
    	grabMyBooks.SmallInfo.showSmallInfoPanel(pathDoesntExistErrorMessage, pathErrorPrepareSmallInfoStateFunction);
    	return;
    }
    if(!grabToDirFile.isDirectory())
    {
    	var pathNotDirectoryErrorMessage = "Path <u>"+grabMyBooks.options.grabToDir+"</u> is not a directory.";
    	grabMyBooks.SmallInfo.showSmallInfoPanel(pathNotDirectoryErrorMessage, pathErrorPrepareSmallInfoStateFunction);
    	return;
    }
    var bookFileName = grabMyBooks.getSaveFileName(writeBookContext);
    grabToDirFile.append(bookFileName);
    
    var handleSaveFileExtensionResult = grabMyBooks.handleSaveFileExtension(grabToDirFile, writeBookContext);
    if(!handleSaveFileExtensionResult)
    {
    	return;
    }
    
    var saveToDirFunction =
    	function(writeBookContext, grabToDirFile)
    	{
    		return function()
    		{
    			writeBookContext.overridenDestinationFile = grabToDirFile;
    			grabMyBooks.writeBook(writeBookContext);
    		};
    	}(writeBookContext, grabToDirFile);
    
    if(grabToDirFile.exists() && !writeBookContext.forceOverride)
    {
    	var fileAlreadyExistsMessage = "A file named <u>"+bookFileName+"</u> already exists in <u>"+grabMyBooks.options.grabToDir+"</u>.<br><br>Would you like to override it?";
    	var fileAlreadyExistsPrepareSmallInfoStateFunction =
		function(saveToDirFunction)
		{
			return function(smallInfoState)
			{
				smallInfoState.iconType = "WARN";
				smallInfoState.buttonYesFunction = saveToDirFunction;
				smallInfoState.showButtonYes = true;
				smallInfoState.showButtonNo = true;
				smallInfoState.showButtonOk = false;
			};
		}(saveToDirFunction);
		grabMyBooks.SmallInfo.showSmallInfoPanel(fileAlreadyExistsMessage, fileAlreadyExistsPrepareSmallInfoStateFunction);
    }
    else
    {
    	saveToDirFunction();
    }
};

grabMyBooks.getShowFileSuccessfullyWrittenFunction = function(writeBookContext)
{
	var successPrepareSmallInfoStateFunction =
		function(writeBookContext)
		{
			return function(smallInfoState)
			{
				smallInfoState.showButtonDelete = (!writeBookContext.writeBookEndInfo.sentViaMail || (writeBookContext.writeBookEndInfo.epubCopySavedToFile != null));
				smallInfoState.buttonDeleteFunction =
					function(writeBookContext)
					{
						return function()
						{
							if(!writeBookContext.writeBookEndInfo.sentViaMail && writeBookContext.writeBookEndInfo.savedToFile.exists())
							{
								writeBookContext.writeBookEndInfo.savedToFile.remove(false);
							}
							if(writeBookContext.writeBookEndInfo.epubCopySavedToFile != null && writeBookContext.writeBookEndInfo.epubCopySavedToFile.exists())
							{
								writeBookContext.writeBookEndInfo.epubCopySavedToFile.remove(false);
							}
						};
					}(writeBookContext);
			};
		}(writeBookContext);
	
	var successWritingFunction =
		function(successPrepareSmallInfoStateFunction)
		{
			return function(writeBookEndInfo)
			{
				
				var successWritingMessage = null;
				
				if(writeBookEndInfo.sentViaMail)
				{
					successWritingMessage = "Book "+grabMyBooks.ext.leafName(writeBookEndInfo.savedToFile)+" has been sent to "+grabMyBooks.options.mailTo+".";
				}
				else
				{
					successWritingMessage = "Book has been saved to:<br><br><u>"+grabMyBooks.ext.path(writeBookEndInfo.savedToFile)+"</u>";
				}
				
			    if(writeBookEndInfo.epubCopySavedToFile != null)
			    {
			    	successWritingMessage += "<br><br>Epub version of book has been saved to:<br><br><u>"+grabMyBooks.ext.path(writeBookEndInfo.epubCopySavedToFile)+"</u>";
			    }
				grabMyBooks.SmallInfo.showSmallInfoPanel(successWritingMessage, successPrepareSmallInfoStateFunction);
			};
		}(successPrepareSmallInfoStateFunction);
		
	return successWritingFunction;
};
  
grabMyBooks.writeBook = function(writeBookContext)
{
  	try
  	{
	  	if(writeBookContext.articles.length==0 || (writeBookContext.blockIfEditMode && grabMyBooks.isEditMode))
	  	{
	  		return;
	  	}
	  	
	  	var saveToFile = null;
	  	
	  	
	  	var writeBookFileFunction =
	  		function(writeBookContext)
	  		{
	  			return function(saveToFile)
	  			{
	  			
	  				writeBookContext.onBookFileReadyFunction =
			  			function(saveToFile, writeBookContext)
			  			{
			  				return function(bookFile, bookFileName)
			  				{
			  					bookFile.copyTo(grabMyBooks.ext.parentFile(saveToFile), bookFileName);
								var savedToFile = grabMyBooks.ext.parentFile(saveToFile).clone();
								savedToFile.append(grabMyBooks.ext.leafName(saveToFile));
								writeBookContext.writeBookEndInfo.savedToFile = savedToFile;
			  				};
			  			}(saveToFile, writeBookContext);
	  			
	  				try
	  				{
		  				if(saveToFile.exists())
						{
							saveToFile.remove(false);
						}
						
						if(writeBookContext.showFileWrittenMessage)
						{
							var successWritingFunction = grabMyBooks.getShowFileSuccessfullyWrittenFunction(writeBookContext);
				    		writeBookContext.endFunction = successWritingFunction;
						}
						
					  	
					  	grabMyBooks.deleteTmpFiles(writeBookContext);
					  	
					  	var generatedTmpDir = grabMyBooks.createDirTmp(grabMyBooks.ext.path(grabMyBooks.tempDir), writeBookContext.tempDirName);
					  	var metaInfDir = grabMyBooks.createDirTmp(grabMyBooks.ext.path(generatedTmpDir), "META-INF");
					  	
						var containerContent =
							"<?xml version=\"1.0\" encoding=\"UTF-8\" ?><container version=\"1.0\" xmlns=\"urn:oasis:names:tc:opendocument:xmlns:container\">"+
								"<rootfiles>"+
									"<rootfile full-path=\"OEBPS/content.opf\" media-type=\"application/oebps-package+xml\"/>"+
						    	"</rootfiles></container>";
						grabMyBooks.ext.writeFile(metaInfDir, "container.xml", containerContent);
						
					  	var oeBpsDir = grabMyBooks.createDirTmp(grabMyBooks.ext.path(generatedTmpDir), "OEBPS");
					  	
					  	
					  	var articlesTabToUseForContent = writeBookContext.articles;
						var savedImgInfoTab = [];
					  	if(grabMyBooks.img.isThereAtLeastOneImgInBook(writeBookContext))
					  	{
					  		var applyImgToContentForWriteResult = grabMyBooks.img.applyImgToContentForWrite(true, true, writeBookContext.articles, writeBookContext.coverSavedImgInfo);
							articlesTabToUseForContent = applyImgToContentForWriteResult.updatedArticlesWithImgContent;
							
					  		var imgDir = grabMyBooks.createDirTmp(grabMyBooks.ext.path(oeBpsDir), "img");
					  		var currentSavedImgInfo;
					  		for(var i_imgToCopy=0; i_imgToCopy<applyImgToContentForWriteResult.savedImgInfoToCopyTab.length; i_imgToCopy++)
					  		{
					  			currentSavedImgInfo = applyImgToContentForWriteResult.savedImgInfoToCopyTab[i_imgToCopy];
					  			try
					  			{
					  				currentSavedImgInfo.imgLocalFile.copyTo(imgDir, grabMyBooks.ext.leafName(currentSavedImgInfo.imgLocalFile));
					  			}
					  			catch(e)
					  			{
					  				grabMyBooks.ext.alert("Error copying image: "+currentSavedImgInfo.imgLocalName);
					  			}
					  		}
					  		
					  		savedImgInfoTab = applyImgToContentForWriteResult.savedImgInfoToCopyTab;
					  	}
					  	
					  	var setCover = ((writeBookContext.coverSavedImgInfo != null) && (writeBookContext.coverSavedImgInfo.imgLocalFile != null));
					  	
						if(setCover)
						{
							var cover = [];
							cover.push(
								"<?xml version=\"1.0\" encoding=\"UTF-8\" ?>",
								"<!DOCTYPE html PUBLIC",
								     "\"-//W3C//DTD XHTML 1.1//EN\"",
								     "\"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">",
								"<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\""+writeBookContext.metadata.lang+"\">",
								  "<head>",
								   "<title>Cover</title>",
								   "<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\"/>",
								  "</head>",
								  "<body>",
								    "<div style=\"text-align: center; page-break-after: always;\">",
								       "<img src=\"img/"+writeBookContext.coverSavedImgInfo.imgLocalName+"\" alt=\"Cover\" style=\"height:100%;max-width:100%;\"/>",
								    "</div>",
								  "</body>",
								"</html>"
							);
							grabMyBooks.ext.writeFile(oeBpsDir, "cover.xhtml", cover.join("\n"));
						}
					
						var dateTime = new Date().getTime();
						var bookId = ""+dateTime+"_"+grabMyBooks.addZerosIfNeeded(Math.floor(Math.random()*(1000000-1)), 6);
						var grabMyBooksUrl = grabMyBooks.grabMyBooksUrl;
						var content = [];
						content.push(
							"<?xml version=\"1.0\"?>",
							"<package xmlns=\"http://www.idpf.org/2007/opf\" unique-identifier=\"bookId\" ",
							"   version=\"2.0\">",
							"   <metadata xmlns:dc=\"http://purl.org/dc/elements/1.1/\"",
							"      xmlns:dcterms=\"http://purl.org/dc/terms/\"",
							"      xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"",
							"      xmlns:opf=\"http://www.idpf.org/2007/opf\">",
							"      <dc:title>"+grabMyBooks.escapeTagsExtended(writeBookContext.metadata.title)+"</dc:title>"
						);
							
						if(writeBookContext.metadata.description != null)
						{
							content.push(
								"      <dc:description>"+grabMyBooks.escapeTagsExtended(writeBookContext.metadata.description)+"</dc:description>"
							);
						}
							
						content.push(
							"      <dc:language xsi:type=\"dcterms:RFC3066\">"+writeBookContext.metadata.lang+"</dc:language>",
							"      <dc:identifier id=\"bookId\" opf:scheme=\"URI\">",
							"         "+grabMyBooks.escapeTagsExtended(grabMyBooksUrl)+"/"+bookId,
							"      </dc:identifier>",
							"      <dc:creator>"+grabMyBooks.escapeTagsExtended(writeBookContext.metadata.author)+"</dc:creator>",
							"      <dc:publisher>"+grabMyBooks.escapeTagsExtended(grabMyBooksUrl)+"</dc:publisher>"
						);
						
						if(setCover)
						{
							content.push(
							"      <meta content=\""+writeBookContext.coverSavedImgInfo.getImgNameWithoutExtension()+"\" name=\"cover\"/>"
							);
						}
						
						content.push(
							"      <meta content=\""+grabMyBooks.options.imgType+"\" name=\"imgType\"/>"
							);
						
						content.push(
							"   </metadata>",
							"   <manifest>",
							"      <item id=\"ncx\"      href=\"toc.ncx\" media-type=\"application/x-dtbncx+xml\"/>                 "
						);
					
					
						var i_article;
						for(i_article=0;i_article<writeBookContext.articles.length;i_article++)
						{
							content.push(
								"      <item id=\"article"+i_article+"\"      href=\"article"+i_article+".xhtml\" media-type=\"application/xhtml+xml\"/>                 "
							);
						}
						content.push(
						"<item id=\"book-css\"",
					    "  href=\"css/book.css\"",
					    " media-type=\"text/css\"/>"
					    );
						
						if(setCover)
						{
							content.push(
								"      <item id=\"cover\"      href=\"cover.xhtml\" media-type=\"application/xhtml+xml\"/>                 "
							);
						}
						
						var currentSavedImgInfo;
						for(var i_savedImg=0; i_savedImg<savedImgInfoTab.length; i_savedImg++)
						{
							currentSavedImgInfo = savedImgInfoTab[i_savedImg];
							var imgName = currentSavedImgInfo.getImgNameWithoutExtension();
							content.push(
								"<item id=\""+imgName+"\"",
							    "  href=\"img/"+currentSavedImgInfo.imgLocalName+"\"",
							    " media-type=\"image/"+grabMyBooks.options.imgType+"\"/>"
							    );
						}
						
						content.push(
						"   </manifest>",
						"   <spine toc=\"ncx\">"
						);
						
						if(setCover)
						{
							content.push(
							"	<itemref idref=\"cover\"/>"
							);
						}
						
						for(i_article=0;i_article<writeBookContext.articles.length;i_article++)
						{
							content.push(
								"      <itemref idref=\"article"+i_article+"\" />"
							);
						}
						
						content.push(
							"   </spine>"
						);
						
						if(setCover)
						{
							content.push(
							"	<guide>",
							"		<reference href=\"cover.xhtml\" type=\"cover\" title=\"Cover\"/>",	
							"	</guide>"
							);
						}
						
						content.push(
							"</package>"
						);	
							
							
						grabMyBooks.ext.writeFile(oeBpsDir, "content.opf", content.join("\n"));
						
						var toc = [];
						toc.push(
							"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
							"<!DOCTYPE ncx PUBLIC \"-//NISO//DTD ncx 2005-1//EN\" ",
							"\"http://www.daisy.org/z3986/2005/ncx-2005-1.dtd\">",
							" ",
							"<ncx version=\"2005-1\" xml:lang=\"en\" xmlns=\"http://www.daisy.org/z3986/2005/ncx/\">",
							" ",
							"  <head>",
							"<!-- The following four metadata items are required for all NCX documents,",
							"including those conforming to the relaxed constraints of OPS 2.0 -->",
							" ",
							"    <meta name=\"dtb:uid\" content=\""+grabMyBooks.escapeTagsExtended(grabMyBooksUrl)+"/"+bookId+"\"/> <!-- same as in .opf -->",
							"    <meta name=\"dtb:depth\" content=\"1\"/> <!-- 1 or higher -->",
							"    <meta name=\"dtb:totalPageCount\" content=\"0\"/> <!-- must be 0 -->",
							"    <meta name=\"dtb:maxPageNumber\" content=\"0\"/> <!-- must be 0 -->",
							"  </head>",
							" ",
							"  <docTitle>",
							"    <text>"+grabMyBooks.escapeTagsExtended(grabMyBooksUrl)+"</text>",
							"  </docTitle>",
							" ",
							"  <docAuthor>",
							"    <text>"+grabMyBooks.escapeTagsExtended(grabMyBooksUrl)+"</text>",
							"  </docAuthor>",
							" ",
							"  <navMap>"
						);
						for(i_article=0;i_article<writeBookContext.articles.length;i_article++)
						{
							toc.push(
								"    <navPoint class=\"chapter\" id=\"article"+i_article+"\" playOrder=\""+(i_article+1)+"\">",
								"      <navLabel><text>"+grabMyBooks.escapeTagsExtended(grabMyBooks.replaceVariablesInText(writeBookContext.articles[i_article].getTitleOrDefaultTitle(), i_article, true))+"</text></navLabel>",
								"      <content src=\"article"+i_article+".xhtml\"/>",
								"    </navPoint>"
							);
						}
						toc.push(
							"  </navMap>",
							" ",
							"</ncx>"
						);
						
						grabMyBooks.ext.writeFile(oeBpsDir, "toc.ncx", toc.join("\n"));
						
						
						
						for(i_article=0;i_article<writeBookContext.articles.length;i_article++)
						{
							var currentArticleContent = [];
							currentArticleContent.push(
							"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
							"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">",
							"<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\""+writeBookContext.metadata.lang+"\">",
							"<head>",
							"<meta http-equiv=\"Content-Type\" content=\"application/xhtml+xml; charset=utf-8\" />",
							"<title>"+grabMyBooksUrl+"</title>",
							"<link rel=\"stylesheet\" href=\"css/book.css\" type=\"text/css\"/>",
							"</head>",
							"<body>");
							
							if(!grabMyBooks.isEmpty(writeBookContext.articles[i_article].title))
							{
								currentArticleContent.push("<h2>"+grabMyBooks.escapeTagsExtended(grabMyBooks.replaceVariablesInText(writeBookContext.articles[i_article].title, i_article, true))+"</h2>");
							}
							
							if(!grabMyBooks.isEmpty(writeBookContext.articles[i_article].title2))
							{
								currentArticleContent.push("<h3>"+grabMyBooks.escapeTagsExtended(grabMyBooks.replaceVariablesInText(writeBookContext.articles[i_article].title2, i_article, true))+"</h3>");
							}
							currentArticleContent.push(
							articlesTabToUseForContent[i_article].getHtmlContentToWriteBook(),
							"</body>",
							"</html>"
							);
							grabMyBooks.ext.writeFile(oeBpsDir, "article"+i_article+".xhtml", currentArticleContent.join("\n"));
						}
						
						var cssDir = grabMyBooks.createDirTmp(grabMyBooks.ext.path(oeBpsDir), "css");
						var css = [];
						css.push(
							"@page {margin-top:"+grabMyBooks.options.marginPageTopBottom+";margin-bottom:"+grabMyBooks.options.marginPageTopBottom+";margin-left:"+grabMyBooks.options.marginPageLeftRight+";margin-right:"+grabMyBooks.options.marginPageLeftRight+";}",
							"body {padding:0;}",
							"h2 {padding-top:0;display:block;text-align:left;}",
						  	"h3 {display:block;text-align:left;}",
							"p {text-indent:"+grabMyBooks.options.marginParagraphIndent+";margin-top:"+grabMyBooks.options.marginParagraphTopBottom+";margin-bottom:"+grabMyBooks.options.marginParagraphTopBottom+";text-align:"+grabMyBooks.options.textAlign+";}",
							"p .imgBig {display:block;width:100%;text-align:center;text-indent:0px;}",
						  	"p .imgBig img{margin-bottom:5px;max-width:100%;}",
						  	"p .imgSmall img{display:inline-block;max-width:100%;}",
							"pre, code {font-family:monospace;text-indent:0;white-space:pre-wrap;}",
						  	"table {max-width:100%;}",
						  	"table td{vertical-align:top;text-align:left;}",
						  	"table .row img {max-width:100px;max-height:100px;}",
						  	"table .rowSingleImg img {max-width:100%;}",
						  	"table .rowSingleImg td {text-align:center;}"
						  	);
						grabMyBooks.ext.writeFile(cssDir, "book.css", css.join("\n"));
						
						
						
						var mimeFile = grabMyBooks.ext.writeFile(generatedTmpDir, "mimetype", "application/epub+zip");
						
						
						var filesToZipTab = [mimeFile,metaInfDir,oeBpsDir];
						var zipFile = grabMyBooks.ext.createZipFile(grabMyBooks.tempDir, writeBookContext.tempGeneratedFileName+".epub", generatedTmpDir, filesToZipTab);
						
						if(writeBookContext.eBookConverterFile==null)
						{
							writeBookContext.onBookFileReadyFunction(zipFile, grabMyBooks.ext.leafName(saveToFile));
							writeBookContext.endOfWriting();
						}
						else
						{
							var eBookConverterFile = writeBookContext.eBookConverterFile;
							var eBookConverterProcess = Components.classes["@mozilla.org/process/util;1"]  
				                        .createInstance(Components.interfaces.nsIProcess);
				                        
				            var convertedFile = grabMyBooks.ext.createFile();
				            convertedFile.initWithPath(grabMyBooks.ext.path(grabMyBooks.tempDir));
				            convertedFile.append(writeBookContext.tempGeneratedFileName+"."+writeBookContext.selectedExtension);
				            
				            var conversionObserver = new Object();
				            conversionObserver.observe =
				            	function(eBookConverterProcess, writeBookContext, saveToFile, convertedFile)
				            	{
				            		return function(subject, topic, data)
				            		{
				            			if(topic!="process-finished" && topic!="process-failed")
				            			{
				            				return;
				            			}
				            			var exitValue = eBookConverterProcess.exitValue;
										if(exitValue==0)
										{
											var saveToFileName = writeBookContext.fileNameWithoutExtension+"."+writeBookContext.selectedExtension;
											writeBookContext.onBookFileReadyFunction(convertedFile, saveToFileName);
							                writeBookContext.endOfWriting();
										}
										else
										{
											grabMyBooks.bookPopin.showMessage("Error during file creation");
										}
				            		};
				            	}(eBookConverterProcess, writeBookContext, saveToFile, convertedFile);
				            
							eBookConverterProcess.init(eBookConverterFile);
							var eBookConverterArgs = [grabMyBooks.ext.path(zipFile), grabMyBooks.ext.path(convertedFile)];
							
							var runConversionFunction =
								function(eBookConverterProcess, eBookConverterArgs, conversionObserver)
								{
									return function()
									{
										eBookConverterProcess.runAsync(eBookConverterArgs, eBookConverterArgs.length, conversionObserver);
									};
								}(eBookConverterProcess, eBookConverterArgs, conversionObserver);
							  
							if(grabMyBooks.isEmpty(grabMyBooks.options.epubCopyToDir))
							{
								runConversionFunction();
								return;
							}
							var epubCopyToDirectory = grabMyBooks.ext.createFile();
                     		epubCopyToDirectory.initWithPath(grabMyBooks.options.epubCopyToDir);
                     		var epubCopyErrorMessage = null;
                     		if(!epubCopyToDirectory.exists())
                     		{
                     			epubCopyErrorMessage = "Can't save epub copy of book: directory '"+grabMyBooks.options.epubCopyToDir+"' doesn't exist.";
                     		}
							else if(!epubCopyToDirectory.isDirectory())
							{
								epubCopyErrorMessage = "Can't save epub copy of book: '"+grabMyBooks.options.epubCopyToDir+"' is not a directory.";
							}
							
							if(!grabMyBooks.isEmpty(epubCopyErrorMessage))
							{
								grabMyBooks.SmallInfo.showSmallInfoPanel(epubCopyErrorMessage,
									function(smallInfoState)
									{
										smallInfoState.iconType = "ERROR";
									} 
								);
								return;
							}
							
							var epubCopyDestinationFile = grabMyBooks.ext.createFile();
                     		epubCopyDestinationFile.initWithPath(grabMyBooks.ext.path(epubCopyToDirectory));
                     		epubCopyDestinationFile.append(writeBookContext.fileNameWithoutExtension+".epub");
                     		
                     		var makeEpubCopyAndRunConversionFunction =
                     			function(writeBookContext, runConversionFunction, zipFile, epubCopyDestinationFile)
                     			{
                     				return function()
                     				{
                     					if(epubCopyDestinationFile.exists())
                     					{
                     						epubCopyDestinationFile.remove(false);
                     					}
                     					zipFile.copyTo(grabMyBooks.ext.parentFile(epubCopyDestinationFile), grabMyBooks.ext.leafName(epubCopyDestinationFile));
                     					writeBookContext.writeBookEndInfo.epubCopySavedToFile = epubCopyDestinationFile;
                     					runConversionFunction();
                     				};
                     			}(writeBookContext, runConversionFunction, zipFile, epubCopyDestinationFile);
                     		
                     		if(!epubCopyDestinationFile.exists())
                     		{
                     			makeEpubCopyAndRunConversionFunction();
                     			return;
                     		}
                     		grabMyBooks.SmallInfo.showSmallInfoPanel(
                     			"A file named <u>"+grabMyBooks.ext.leafName(epubCopyDestinationFile)+"</u> already exists in <u>"+grabMyBooks.ext.path(grabMyBooks.ext.parentFile(epubCopyDestinationFile))+"</u>.<br><br>Would you like to override it?",
                     			function(makeEpubCopyAndRunConversionFunction)
                     			{
                     				return function(smallInfoState)
                     				{
                     					smallInfoState.iconType = "WARN";
                     					smallInfoState.buttonOkFunction = makeEpubCopyAndRunConversionFunction;
                     					smallInfoState.showButtonCancel = true;
                     				};
                     			}(makeEpubCopyAndRunConversionFunction)
                     		);
						}
					}
					catch(e) 
				    { 
				        grabMyBooks.ext.alert(e+'::'+e.lineNumber);  
				    }
	  			};
	  		}(writeBookContext);
	  		
	  	
	  	var toDoOnSaveFileReadyFunction = 
		  	function(writeBookContext, writeBookFileFunction)
		  	{
		  		return function(file)
		  		{
		  			var toDoWriteBookFileFunction =
				  		function(writeBookFileFunction, file)
				  		{
				  			return function()
				  			{
				  				writeBookFileFunction(file);
				  			};
				  		}(writeBookFileFunction, file);
				  		
		  			if(!writeBookContext.showFileWrittenMessage)
				  	{
				  		toDoWriteBookFileFunction();
				  		return;
				  	}
				  	
				  	grabMyBooks.execWithLoadingMessage(toDoWriteBookFileFunction, "Saving book...", writeBookContext, "writeFileTimer");
				  	
		  		};
		  	}(writeBookContext, writeBookFileFunction);
	  	
	  	
	  	
	  		
	  	if(grabMyBooks.options.mailEnabled && !writeBookContext.mailAlreadyTriedWithError)
	  	{
	  		writeBookContext.mailToInfo = new Object();
	  		writeBookContext.mailToInfo.mailToErrorFunction =
	  			function(writeBookContext)
	  			{
	  				return function()
	  				{
	  					writeBookContext.mailToInfo = null;
	  					writeBookContext.mailAlreadyTriedWithError = true;
	  					writeBookContext.mailCommandFile = null;
	  					writeBookContext.grabToDirCheckDone = true;
	  					grabMyBooks.writeBook(writeBookContext);
	  					return;
	  				};
	  			}(writeBookContext);
	  		
	  		var mailConfErrorMessagePrepareFunction = function(writeBookContext)
			{
				return function(smallInfoState)
				{
					smallInfoState.iconType = "ERROR";
					smallInfoState.buttonOkFunction = writeBookContext.mailToInfo.mailToErrorFunction;
				};
			}(writeBookContext);
			
			var mailErrorTab = [];
			if(grabMyBooks.isEmpty(grabMyBooks.options.mailServer))
			{
				mailErrorTab.push("Mail smtp server is not properly configured");
			}
			if(grabMyBooks.isEmpty(grabMyBooks.options.mailCommandPath))
			{
				mailErrorTab.push("Path to Calibre's smtp command is not configured");
			}
			else
			{
				var mailCommandFile = grabMyBooks.ext.createFile();
				var mailCommandError = false;
				try
				{
				    mailCommandFile.initWithPath(grabMyBooks.options.mailCommandPath);
				}
				catch(e)
				{
				    mailCommandError = true;
				}
				if(mailCommandError || !mailCommandFile.exists() || !mailCommandFile.isExecutable())
				{
					mailErrorTab.push("Path to Calibre's smtp command is not properly configured");
				}
				else
				{
					writeBookContext.mailCommandFile = mailCommandFile;
				}
			}
			if(grabMyBooks.isEmpty(grabMyBooks.options.mailTo))
			{
				mailErrorTab.push("Mail destination address is not configured");
			}
			if(grabMyBooks.isEmpty(grabMyBooks.options.mailFrom))
			{
				mailErrorTab.push("Mail from address is not configured");
			}
			if(mailErrorTab.length>0)
			{
				var mailErrorMessage = mailErrorTab.join("<br>");
				grabMyBooks.SmallInfo.showSmallInfoPanel(mailErrorMessage, mailConfErrorMessagePrepareFunction);
				return;
			}

			saveToFile = grabMyBooks.ext.createFile();
			saveToFile.initWithPath(grabMyBooks.ext.path(grabMyBooks.tempDir));
			saveToFile.append(writeBookContext.tempDirName);
			var saveToFileName = grabMyBooks.getSaveFileNameWithoutExtension(writeBookContext);
	  		saveToFileName += ("."+grabMyBooks.options.defaultExtension);
	  		saveToFile.append(saveToFileName);
	  		var handleSaveFileExtensionResult = grabMyBooks.handleSaveFileExtension(saveToFile, writeBookContext);
		    if(!handleSaveFileExtensionResult)
		    {
		    	return;
		    }
		    toDoOnSaveFileReadyFunction(saveToFile);
	  	}
	  	else if(writeBookContext.overridenDestinationFile == null)
	  	{
	  		if(!grabMyBooks.isEmpty(grabMyBooks.options.grabToDir) && !writeBookContext.grabToDirCheckDone)
	  		{
	  			grabMyBooks.handleGrabToDir(writeBookContext);
	  			return;
	  		}
		  	grabMyBooks.getSaveFile(writeBookContext, toDoOnSaveFileReadyFunction);
	  	}
	  	else
	  	{
	  		saveToFile = writeBookContext.overridenDestinationFile;
	  		toDoOnSaveFileReadyFunction(saveToFile);
	  	}
  	}
    catch(e) 
    { 
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);  
    }
};


grabMyBooks.onLoad = function() 
{
  	try
  	{    
	   	grabMyBooks.tempDir = grabMyBooks.ext.getTmpDir();
		grabMyBooks.homeDir = grabMyBooks.ext.getHomeDir();
		
		grabMyBooks.loadFilePicker = grabMyBooks.ext.createFilePicker();
		grabMyBooks.loadFilePicker.appendFilter("epub","*.epub");
		grabMyBooks.ext.initFilePickerForLoad(grabMyBooks.loadFilePicker, "Load");
	
		grabMyBooks.loadDetectionRules();
		grabMyBooks.loadOptions();
		grabMyBooks.metadata.setDefaultValues();
		if(grabMyBooks.options.firstRun)
		{
			grabMyBooks.firstRun();
			grabMyBooks.saveOptions();
		}
		grabMyBooks.autoSave.recoverBook();
		grabMyBooks.reader.readInfos.load();
	}
    catch(e) 
     {  
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);  
     }
};

grabMyBooks.getSelectionAsNode = function(tabDocument)
{
	var selection = content.getSelection();
	
	var selectionRangeCount = selection.rangeCount;
	if(selectionRangeCount==0)
	{
		return null;
	}
	
	var selectionNode = tabDocument.createElement("span");
	
	var currentRange;
	var currentRangeNode;
	var currentCommonAncestor;
	var currentWrapNode;
	for(var i_range=0; i_range<selectionRangeCount; i_range++)
	{
		currentRange = selection.getRangeAt(i_range);
		currentCommonAncestor = currentRange.commonAncestorContainer;
		currentWrapNode = null;
		currentRangeNode = currentRange.cloneContents();
		if(!grabMyBooks.isEmptyObject(currentCommonAncestor))
		{
			currentWrapNode = grabMyBooks.wrapNodeDependingOnAncestors(currentCommonAncestor, tabDocument);
		}
		if(currentWrapNode != null)
		{
			currentWrapNode.appendChild(currentRangeNode);
			currentRangeNode = currentWrapNode;
		}
		selectionNode.appendChild(currentRangeNode);
	}

	var selectionNodeHtml = selectionNode.innerHTML;
	var htmlParseResult = grabMyBooks.ext.HTMLParser2(selectionNodeHtml);
    selectionNode = htmlParseResult.body;

	return selectionNode;
};


grabMyBooks.addSelectedLinks = function()
{
	if(!grabMyBooks.areThereAtLeastTwoLinksSelected())
	{
		return;
	}
	var tabBrowser = gBrowser.getBrowserForTab(gBrowser.selectedTab);
	var tabDocument = tabBrowser.contentDocument;
	
	var url = grabMyBooks.ext.getUriUrl(tabBrowser.currentURI);
	
	var docBase = grabMyBooks.getDocumentBase(tabDocument);
	
	var selectionNode = grabMyBooks.getSelectionAsNode(tabDocument);
	var selectionNodeDoc = grabMyBooks.getDefaultDocument();

	var linksToAdd = [];
	
	var getLinksFromSelectionFunction =
		function(linksToAdd, url, docBase)
		{
			return function(node, index, count)
			{
				if(!grabMyBooks.isValidLinkNode(node))
				{
					return;
				}
				var nodeHref = node.getAttribute("href").trim();
				nodeHref = grabMyBooks.appendUrlPrefixIfMissing(nodeHref, url, docBase);
				if(linksToAdd.indexOf(nodeHref)!=-1)
				{
					return;
				}
				linksToAdd.push(nodeHref);
			};
		}(linksToAdd, url, docBase);
	grabMyBooks.xml.xPathQueryFunction("//a[not(ancestor-or-self::*[contains(@style,'display:none')]) and not(ancestor-or-self::*[contains(@style,'visibility:hidden')])]", selectionNodeDoc, selectionNode, getLinksFromSelectionFunction);
	
	if(linksToAdd.length==0)
	{
		return;
	}
	
	var selectedTab = gBrowser.selectedTab;


	var restoreViewFunction =
			function(selectedTab)
			{
				return function()
				{
					if(selectedTab == null)
					{
						return;
					}
					grabMyBooks.ext.setSelectedTab(selectedTab);
				};
			}(selectedTab);
	
	var prepareAddToBookContextFunction =
		function(restoreViewFunction)
		{
			return function(addToBookContext)
			{
				addToBookContext.endFunction2 = restoreViewFunction;
			};
		}(restoreViewFunction);
	
	var addSelectLinksFunction =
		function(linksToAdd, prepareAddToBookContextFunction)
		{
			return function()
			{
				grabMyBooks.addLinks(linksToAdd, prepareAddToBookContextFunction, grabMyBooks.bookPopin.showAddToBookProgress);
			};
		}(linksToAdd, prepareAddToBookContextFunction);
	grabMyBooks.showBook(addSelectLinksFunction);
};

grabMyBooks.addSelection = function()
{
	var tabBrowser = gBrowser.getBrowserForTab(gBrowser.selectedTab);
	var tabDocument = tabBrowser.contentDocument;
	
	var selectionNode = grabMyBooks.getSelectionAsNode(tabDocument);
	if(selectionNode == null)
	{
		return;
	}
	
	var url = grabMyBooks.ext.getUriUrl(tabBrowser.currentURI);
	
	var docTitle = grabMyBooks.getDocumentTitle(tabDocument);
	var base = grabMyBooks.getDocumentBase(tabDocument);

	grabMyBooks.addSelectionNode(selectionNode, url, docTitle, base);
};

grabMyBooks.addSelectionNode = function(selectionNode, url, title, base)
{
	var getTextFromNodeContext = new grabMyBooks.GetTextFromNodeContext(selectionNode, url);
	getTextFromNodeContext.base = base;
	grabMyBooks.getTextFromNode(getTextFromNodeContext);
	var selectionText = getTextFromNodeContext.getResult();
	
	selectionText = grabMyBooks.textFormat.formatText(selectionText);
	
	var articleInfo = new grabMyBooks.ArticleInfo(url, title, selectionText);
	var addToBookContext = new grabMyBooks.AddToBookContext([url]);
	addToBookContext.addArticleInfo(articleInfo);
};

grabMyBooks.addCurrentPage = function()
{
	if(gBrowser.selectedTab==null)
	{
		return;
	}

	var htmlParseResult = grabMyBooks.HTMLParserCurrentPage();
	var url = htmlParseResult.url;
	var addToBookContext = new grabMyBooks.AddToBookContext([url]);

	grabMyBooks.handleArticlePageWithHtmlParseResult(htmlParseResult, addToBookContext);
};

grabMyBooks.addCurrentPageExpress = function()
{
	if(gBrowser.selectedTab==null)
	{
		return;
	}

	var htmlParseResult = grabMyBooks.HTMLParserCurrentPage();

	var url = htmlParseResult.url;
	var testUrl = url.trim().toLowerCase();
	if(testUrl.indexOf("http")!=0 && testUrl.indexOf("file")!=0)
	{
		return;
	}
	var title = htmlParseResult.title;
	var addToBookContext = new grabMyBooks.AddToBookContext([url]);
	addToBookContext.directGrab = true;
	addToBookContext.title = grabMyBooks.ifEmpty(title, null);
	addToBookContext.popinToUse = null;
	try
	{
		grabMyBooks.handleArticlePageWithHtmlParseResult(htmlParseResult, addToBookContext);
	}
	catch(e)
	{
		grabMyBooks.ext.alert(e.stack);
	}
};

grabMyBooks.addTabs = function()
{
	var tabCount = gBrowser.browsers.length;
	var pageInfoTab = [];
	var currentTabBrowser;
	var currentUri;
	var currentPageInfo;
	for(var i_tab=0; i_tab<tabCount; i_tab++)
	{
		currentTabBrowser = gBrowser.getBrowserAtIndex(i_tab);
		currentUri = grabMyBooks.ext.getUriUrl(currentTabBrowser.currentURI).trim().toLowerCase();
		if(currentUri.indexOf("http")!=0 && currentUri.indexOf("file")!=0)
		{
			continue;
		}
		currentPageInfo = new Object();
		currentPageInfo.uri = currentUri;
		currentPageInfo.doc = currentTabBrowser.contentDocument;
		currentPageInfo.title = currentTabBrowser.contentTitle;
		currentPageInfo.base = grabMyBooks.getDocumentBase(currentTabBrowser.contentDocument);
		pageInfoTab.push(currentPageInfo);
	}
	if(pageInfoTab.length==0)
	{
		return;
	}
	var uriTabTransformFunction =
		function(pageInfo)
		{
			return pageInfo.uri;
		};
	var uriTab = grabMyBooks.tabTransform(pageInfoTab, uriTabTransformFunction);
	var addToBookContext = new grabMyBooks.AddToBookContext(uriTab);
	var addUriFunction =
		function(addToBookContext)
		{
			return function(pageInfo, index, count)
			{
				grabMyBooks.handleArticlePage(pageInfo.uri, pageInfo.title, pageInfo.base, pageInfo.doc, pageInfo.doc, addToBookContext);
			};
		}(addToBookContext);
	grabMyBooks.tabDo(pageInfoTab, addUriFunction);
};

grabMyBooks.LoadBookContext = function(append, overrideMeta, overrideCover)
{
	this.append = append;
	this.overrideMeta = overrideMeta;
	this.overrideCover = overrideCover;
	this.overridenToLoadFile = null;
};

grabMyBooks.emptyBookLoadBookContext = new grabMyBooks.LoadBookContext(false, true, true);

grabMyBooks.UrlXPathInfo = function(url, xpath)
{
	this.url = url;
	this.xpath = xpath;
};

grabMyBooks.AddToBookContext = function(urlTab)
{
	this.toAddCount = urlTab.length;
	this.addedCount = 0;
	this.addedArticleInfos = new Array(this.toAddCount);
	this.nonNullAddedArticleInfos = [];
	this.notCompletedUrls = [];
	this.articleLinks = urlTab;
	this.changeFunction = null;
	this.endFunction = null;
	this.endFunction2 = null;
	this.urlRedirectionFunction = null;
	this.articleInfoAddedFunction = null;
	this.canceled = false;
	this.oldUrlsAfterRedirection = [];
	this.endDelay = null;
	this.urlXPathInfos = [];
	this.globalXPath = null;
	this.coverUrl= null;
	this.title = null;
	this.description = null;
	this.language = null;
	this.directGrab = false;
	this.prepareWriteBookContextForDirectGrabFunction = null;
	this.onUrlCanceled = null;
	this.popinToUse = grabMyBooks.bookPopin;
	this.quietModeInfo = null;
	this.onUrlAddedFunction = null;
	this.grabWholePage = false;
	
	for(var i_toAddCount=0;i_toAddCount<this.toAddCount;i_toAddCount++)
	{
		this.addedArticleInfos[i_toAddCount]=null;
		this.notCompletedUrls[i_toAddCount] = this.articleLinks[i_toAddCount];
	}
	
	this.cancel = function()
	{
		this.canceled = true;
	};
	
	this.addUrl = function(url, afterUrl)
	{
		if(this.articleLinks.indexOf(url)!=-1)
		{
			return;
		}
		var afterUrlIndex = this.articleLinks.indexOf(afterUrl);
		if(afterUrlIndex==-1)
		{
			return;
		}
		this.articleLinks.splice(afterUrlIndex+1, 0, url);
		this.notCompletedUrls.push(url);
		this.toAddCount+=1;
		if(this.onUrlAddedFunction != null)
		{
			this.onUrlAddedFunction(url, afterUrl);
		}
	};
	
	this.onUrlCanceled = function(url)
	{
		var urlToCancelFound = false;
		for(var i_notCompletedUrls=0;i_notCompletedUrls<this.notCompletedUrls.length;i_notCompletedUrls++)
		{
			if(url==this.notCompletedUrls[i_notCompletedUrls])
			{
				this.notCompletedUrls.splice(i_notCompletedUrls, 1);
				urlToCancelFound = true;
				break;
			}
		}
		for(var i_linkUrl=0; urlToCancelFound && i_linkUrl<this.articleLinks.length;i_linkUrl++)
		{
			if(url==this.articleLinks[i_linkUrl])
			{
				this.articleLinks.splice(i_linkUrl, 1);
				this.addedArticleInfos.splice(i_linkUrl, 1);
				break;
			}
		}
		var currentUrlXPathInfo;
		for(var i_urlXPathInfo=0; urlToCancelFound && i_urlXPathInfo<this.urlXPathInfos.length; i_urlXPathInfo++)
		{
			currentUrlXPathInfo = this.urlXPathInfos[i_urlXPathInfo];
			if(url==currentUrlXPathInfo.url)
			{
				this.urlXPathInfos.splice(i_urlXPathInfo, 1);
				break;
			}
		}
		if(urlToCancelFound)
		{
			this.nextAdding();
		}
	};
	
	this.nextAdding = function()
	{
		if(this.canceled)
		{
			return;
		}
		if(this.addedCount<this.toAddCount)
		{
			this.addedCount +=1;
		}
		if(this.changeFunction != null)
		{
			this.changeFunction();
		}
		if(this.isAtLastAdding())
		{
			if(this.endDelay==null)
			{
				this.endOfAdding();
			}
			else
			{
				var endOfAddingTimerFunction =
				function(addToBookContext)
				{
					return function()
					{
						if(addToBookContext.canceled)
						{
							return;
						}
						addToBookContext.endOfAdding();
					};
				}(this);
			
				grabMyBooks.execWithTimer(endOfAddingTimerFunction,this.endDelay);
			}
		}
	};
	this.isAtLastAdding = function()
	{
		return (this.addedCount == this.toAddCount);
	};
	this.isMulti = function()
	{
		return this.nonNullAddedArticleInfos.length > 1;
	};
	this.addArticleInfo = function(articleInfo)
	{
		for(var i_linkUrl=0;i_linkUrl<this.articleLinks.length;i_linkUrl++)
		{
			if(this.articleLinks[i_linkUrl] == articleInfo.url)
			{
				this.addedArticleInfos[i_linkUrl] = articleInfo;
				for(var i_notCompletedUrls=0;i_notCompletedUrls<this.notCompletedUrls.length;i_notCompletedUrls++)
				{
					if(articleInfo.url==this.notCompletedUrls[i_notCompletedUrls])
					{
						this.notCompletedUrls.splice(i_notCompletedUrls, 1);
						break;
					}
				}
				grabMyBooks.img.handleImgs(articleInfo.content);
				if(this.articleInfoAddedFunction != null)
				{
					this.articleInfoAddedFunction(articleInfo);
				}
				this.nextAdding();
				break;
			}
		}
	};
	
	this.urlHasBeenRedirected = function(oldUrl, newUrl)
	{
		this.oldUrlsAfterRedirection.push(oldUrl);
		for(var i_notCompletedUrls=0;i_notCompletedUrls<this.notCompletedUrls.length;i_notCompletedUrls++)
		{
			if(oldUrl==this.notCompletedUrls[i_notCompletedUrls])
			{
				this.notCompletedUrls.splice(i_notCompletedUrls, 1, newUrl);
				break;
			}
		}
		for(var i_linkUrl=0;i_linkUrl<this.articleLinks.length;i_linkUrl++)
		{
			if(oldUrl==this.articleLinks[i_linkUrl])
			{
				this.articleLinks.splice(i_linkUrl, 1, newUrl);
				break;
			}
		}
		var currentUrlXPathInfo;
		for(var i_urlXPathInfo=0; i_urlXPathInfo<this.urlXPathInfos.length; i_urlXPathInfo++)
		{
			currentUrlXPathInfo = this.urlXPathInfos[i_urlXPathInfo];
			if(oldUrl==currentUrlXPathInfo.url)
			{
				currentUrlXPathInfo.url = newUrl;
				break;
			}
		}
		
		if(this.urlRedirectionFunction != null)
		{
			this.urlRedirectionFunction(oldUrl, newUrl);
		}
	};
	
	this.endOfAdding = function()
	{
		var writeBookContext = null;
		var setCoverSavedImgInfoFunction = null;
		var getMetadataFunction = null;
		var articles = null;
		
		if(this.directGrab)
		{
			articles = [];
			
			var writeBookContextMetadata = new Object();
			writeBookContextMetadata.title = grabMyBooks.metadata.defaultTitle;
			writeBookContextMetadata.lang = "en";
			writeBookContextMetadata.description = null;
			
			writeBookContext = new grabMyBooks.WriteBookContext(articles, false, null, writeBookContextMetadata);
			
			setCoverSavedImgInfoFunction =
				function(writeBookContext)
				{
					return function(coverSavedImgInfo)
					{
						writeBookContext.coverSavedImgInfo = coverSavedImgInfo;
					};
				}(writeBookContext);
				
			getMetadataFunction =
				function(writeBookContext)
				{
					return function()
					{
						return writeBookContext.metadata;
					};
				}(writeBookContext);
		}
		else
		{
			articles = grabMyBooks.articles;
			
			setCoverSavedImgInfoFunction =
				function(coverSavedImgInfo)
				{
					grabMyBooks.img.savedCoverSavedImgInfo = coverSavedImgInfo;
				};
				
			getMetadataFunction =
				function()
				{
					return grabMyBooks.metadata;
				};
		}
		
		for(var i_addedArticleInfo=0;i_addedArticleInfo<this.addedArticleInfos.length;i_addedArticleInfo++)
		{
			if(this.addedArticleInfos[i_addedArticleInfo]==null)
			{
				continue;
			}
			articles.push(this.addedArticleInfos[i_addedArticleInfo]);
			grabMyBooks.feeds.feedHistory.addAddedUrl(this.addedArticleInfos[i_addedArticleInfo].url);
			for(var i_oldRedirectedUrl=0; i_oldRedirectedUrl<this.oldUrlsAfterRedirection.length; i_oldRedirectedUrl++)
			{
				grabMyBooks.feeds.feedHistory.addAddedUrl(this.oldUrlsAfterRedirection[i_oldRedirectedUrl]);
			}
			this.nonNullAddedArticleInfos.push(this.addedArticleInfos[i_addedArticleInfo]);
		}
		
		if(!this.directGrab && grabMyBooks.bookTabBrowser != null)
		{
			grabMyBooks.viewMode();
			grabMyBooks.fillBook();
		}
		
		if(this.coverUrl != null)
		{
			var coverSavedImgInfo = grabMyBooks.img.handleImg(this.coverUrl, !this.directGrab);
			setCoverSavedImgInfoFunction(coverSavedImgInfo);
		}
		if(this.title!=null)
		{
			getMetadataFunction().title = this.title;
		}
		if(this.description!=null)
		{
			getMetadataFunction().description = this.description;
		}
		if(this.language!=null)
		{
			getMetadataFunction().lang = this.language;
		}
		
		if(this.endFunction != null && !this.directGrab)
		{
			this.endFunction();
		}
		if(this.endFunction2 != null && !this.directGrab)
		{
			this.endFunction2();
		}
		//grabMyBooks.ext.alert(detectionType+", "+articleText);
		if(this.directGrab)
		{
			if(this.prepareWriteBookContextForDirectGrabFunction != null)
			{
				this.prepareWriteBookContextForDirectGrabFunction(writeBookContext);
			}
			var waitForImgLoadFunction =
				function(writeBookContext, addToBookContext)
				{
					return function()
					{
						var applyImgToContentForWriteResult = grabMyBooks.img.applyImgToContentForWrite(false, false, writeBookContext.articles, writeBookContext.coverSavedImgInfo);
						
						if(!writeBookContext.waitImgStarted)
						{
							writeBookContext.waitImgStarted = true;
							var currentImgUrl;
							var taskInfos = [];
							for(var i_loadedImgInfo=0; i_loadedImgInfo<applyImgToContentForWriteResult.savedImgInfoToCopyTab.length; i_loadedImgInfo++)
							{
								currentImgUrl = applyImgToContentForWriteResult.savedImgInfoToCopyTab[i_loadedImgInfo].imgUrl;
								taskInfos.push(new grabMyBooks.popin.TaskInfo(currentImgUrl, "Copying image "+currentImgUrl+"..."));
							}
							for(var i_notLoadedImgInfo=0; i_notLoadedImgInfo<applyImgToContentForWriteResult.discartedImgInfoTab.length; i_notLoadedImgInfo++)
							{
								currentImgUrl = applyImgToContentForWriteResult.discartedImgInfoTab[i_notLoadedImgInfo].imgUrl;
								taskInfos.push(new grabMyBooks.popin.TaskInfo(currentImgUrl, "Copying image "+currentImgUrl+"..."));
							}
							var loadingProcessContext = new grabMyBooks.popin.LoadingProcessContext(taskInfos);
							loadingProcessContext.atLeastOneTaskDone = true;
							loadingProcessContext.onCancel =
								function(addToBookContext)
								{
									return function()
									{
										addToBookContext.cancel();
									};
								}(addToBookContext);
							writeBookContext.loadingProcessContext = loadingProcessContext;
							if(addToBookContext.popinToUse != null)
							{
								addToBookContext.popinToUse.showLoadingProcess(loadingProcessContext);
							}
						}
						else
						{
							var currentImgUrl;
							for(var i_loadedImgInfo=0; i_loadedImgInfo<applyImgToContentForWriteResult.savedImgInfoToCopyTab.length; i_loadedImgInfo++)
							{
								currentImgUrl = applyImgToContentForWriteResult.savedImgInfoToCopyTab[i_loadedImgInfo].imgUrl;
								writeBookContext.loadingProcessContext.performTaskDone(currentImgUrl);
							}
							for(var i_discardedImgInfo=0; i_discardedImgInfo<applyImgToContentForWriteResult.discartedImgInfoTab.length; i_discardedImgInfo++)
							{
								currentImgUrl = applyImgToContentForWriteResult.discartedImgInfoTab[i_discardedImgInfo].imgUrl;
								if(writeBookContext.loadingProcessContext.hasTaskBeenCanceled(currentImgUrl))
								{
									applyImgToContentForWriteResult.discartedImgInfoTab.splice(i_discardedImgInfo, 1);
									i_discardedImgInfo-=1;
								}
							}
						}
						
						if(!addToBookContext.canceled && applyImgToContentForWriteResult.discartedImgInfoTab.length==0)
						{
							if(addToBookContext.endFunction != null)
							{
								addToBookContext.endFunction();
							}
							if(addToBookContext.endFunction2 != null)
							{
								addToBookContext.endFunction2();
							}
							var writeBookFunction = 
								function(writeBookContext, addToBookContext)
								{
									return function()
									{
										if(!addToBookContext.canceled)
										{
											grabMyBooks.writeBook(writeBookContext);
										}
									};
								}(writeBookContext, addToBookContext);
							grabMyBooks.execWithTimer(writeBookFunction, addToBookContext.endDelay);
						}
						else
						{
							grabMyBooks.execWithTimer(writeBookContext.waitImgFunction, 500);
						}
					};
				}(writeBookContext, this);
			writeBookContext.waitImgStarted = false;
			writeBookContext.waitImgFunction = waitForImgLoadFunction;
			if(grabMyBooks.options.grabImages)
			{
				writeBookContext.waitImgFunction();
			}
			else
			{
				grabMyBooks.writeBook(writeBookContext);
			}
			
		}
		else
		{
			grabMyBooks.showAddedArticle(this);
			grabMyBooks.autoSave.markModified();
		}
	};
	
	this.getUrlXPathInfo = function(url)
	{
		var currentUrlXPathInfo;
		for(var i_urlXPathInfo=0; i_urlXPathInfo<this.urlXPathInfos.length; i_urlXPathInfo++)
		{
			currentUrlXPathInfo = this.urlXPathInfos[i_urlXPathInfo];
			if(url==currentUrlXPathInfo.url)
			{
				return currentUrlXPathInfo;
			}
		}
		return null;
	}
};

grabMyBooks.addLinks = function(links, prepareAddToBookContextFunction, showLoadingPopinFunction)
{
	if(links.length==0)
	{
		return;
	}
	var multiAddToBookContext = new grabMyBooks.AddToBookContext(links);
	if(prepareAddToBookContextFunction!=null)
	{
		prepareAddToBookContextFunction(multiAddToBookContext);
	}
	if(showLoadingPopinFunction!=null)
	{
		showLoadingPopinFunction(multiAddToBookContext);
	}
	for(var i_link=0; i_link<links.length; i_link++)
	{
		grabMyBooks.addLink(links[i_link], multiAddToBookContext);
	}
};

grabMyBooks.addLink = function(url, addToBookContext)
{
  	try
  	{
  		if(addToBookContext.toAddCount==0)
	    {
	    	return;
	    }
	    
	    var isUrlImg = false;
	    var lowerCaseUrl = url.toLowerCase();
	    var urlLength = lowerCaseUrl.length;
	    var currentImgExt;
	    var currentImgExtLastIndex;
	    for(var i_imgExt=0; i_imgExt<grabMyBooks.img.allowedImgExtensions.length; i_imgExt++)
		{
			currentImgExt = grabMyBooks.img.allowedImgExtensions[i_imgExt];
			currentImgExtLastIndex = lowerCaseUrl.lastIndexOf("."+currentImgExt);
			if( currentImgExtLastIndex != -1 && (currentImgExtLastIndex == (urlLength-currentImgExt.length-1)))
			{
				isUrlImg = true;
				break;
			}
		}
		
		var handleImageFunction =
			function(url, addToBookContext)
			{
				return function()
				{
					var imgNode = grabMyBooks.getImgAsHtmlNode(url);
					var ImgNodeDoc = imgNode.ownerDocument;
					grabMyBooks.handleArticlePage(url, grabMyBooks.img.getImgNameFromPath(url), null, imgNode, ImgNodeDoc, addToBookContext);
				};
			}(url, addToBookContext);
		
		if(isUrlImg)
		{
			handleImageFunction();
			return;
		}
	    
	    
	    var toDoWithResponseTextFunction =
	    	function(url, addToBookContext)
	    	{
	    		return function(url, responseText)
	    		{
	    			var htmlParseResult = grabMyBooks.ext.HTMLParser2(responseText);
					var domPage = htmlParseResult.body;
					var title = htmlParseResult.title;
					var base = htmlParseResult.base;
					var doc = htmlParseResult.document;
					grabMyBooks.handleArticlePage(url, title, base, domPage, doc, addToBookContext);
	    		};
	    	}(url, addToBookContext);
	    
	    
	    	if(lowerCaseUrl.indexOf("http")==0)
			{
	    		var getLinkContentViaHttpChannelContext = new grabMyBooks.GetLinkContentViaHttpChannelContext(url);
	    		var onEndFunction =
	    			function(getLinkContentViaHttpChannelContext, toDoWithResponseTextFunction)
	    			{
	    				return function()
	    				{
	    					toDoWithResponseTextFunction(getLinkContentViaHttpChannelContext.getFinalUrl(), getLinkContentViaHttpChannelContext.data);
	    				};
	    			}(getLinkContentViaHttpChannelContext, toDoWithResponseTextFunction);
	    		var onUrlChangeFunction =
	    			function(getLinkContentViaHttpChannelContext, addToBookContext)
	    			{
	    				return function()
	    				{
	    					addToBookContext.urlHasBeenRedirected(getLinkContentViaHttpChannelContext.url, getLinkContentViaHttpChannelContext.redirectUrl);
	    				};
	    			}(getLinkContentViaHttpChannelContext, addToBookContext);
	    		getLinkContentViaHttpChannelContext.onEndFunction = onEndFunction;
	    		getLinkContentViaHttpChannelContext.onUrlChangeFunction = onUrlChangeFunction;
	    		getLinkContentViaHttpChannelContext.onImageFunction = handleImageFunction;
	    		grabMyBooks.ext.getLinkContentViaHttpChannel(getLinkContentViaHttpChannelContext); 
			}
  	}
  	catch(e) 
     {  
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);  
     }
};

grabMyBooks.GetLinkContentViaHttpChannelContext = function(url)
{
	this.url = url;
	this.redirectUrl = null;
	this.data = "";
	
	this.httpCharset = null;
	this.contentCharset = null;
	
	this.charsetRegExpString = "charset=([\\w\\-]+)";
	
	this.getFinalUrl = function()
	{
		if(this.redirectUrl!=null)
		{
			return this.redirectUrl;
		}
		return this.url;
	};
	this.onEndFunction = null;
	this.onImageFunction = null;
	this.onUrlChangeFunction = null;
	this.addData = function(dataToAdd)
	{
		this.data+=dataToAdd;
	};
	
	this.getCharsetFromText = function(text)
	{
		var charSet = null;
		var charsetRegExp = new RegExp(this.charsetRegExpString, "gi");
		var charsetRegExpResult = charsetRegExp.exec(text);
		if(charsetRegExpResult!=null)
		{
			charSet = charsetRegExpResult[1];
		}
		return charSet;
	};
	this.getCharsetFromRecievedData = function()
	{
		this.contentCharset = this.getCharsetFromText(this.data);
	};
	this.getCharset = function()
	{
		if(this.contentCharset!=null)
		{
			return this.contentCharset;
		}
		if(this.httpCharset!=null)
		{
			return this.httpCharset;
		}
		return null;
	};
	
	this.convertDataWithCharset = function()
	{
		var charsetToUse = this.getCharset();
		if(charsetToUse==null)
		{
			return;
		}
		charsetToUse = charsetToUse.toUpperCase();
		
		var unicodeConverter = grabMyBooks.ext.createUnicodeConverter();
		unicodeConverter.charset=charsetToUse;
		
		var codeArray = [];
		for(var i_data=0; i_data<this.data.length; i_data++)
		{
			codeArray.push(this.data.charCodeAt(i_data));
		}
		try
		{
			this.data = unicodeConverter.convertFromByteArray(codeArray, codeArray.length);
		}
		catch(e)
		{
			//Prevents error no data.
		}
	};
};


grabMyBooks.ext.getLinkContentViaHttpChannel = function(getLinkContentViaHttpChannelContext)
{
	var url = getLinkContentViaHttpChannelContext.url;
	var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	var channel = ioService.newChannel(url, null, null).QueryInterface(Components.interfaces.nsIHttpChannel);
	
	channel.setRequestHeader("User-Agent", window.navigator.userAgent, false);
	
	var channelListener = new Object();
	channelListener.onStartRequest = function(request, context)
	{
	};
	channelListener.onDataAvailable = 
		function(getLinkContentViaHttpChannelContext)
		{
			return function(request, context, stream, sourceOffset, length)
			{
				var scriptableInputStream =
			      Components.classes["@mozilla.org/scriptableinputstream;1"]
			        .createInstance(Components.interfaces.nsIScriptableInputStream);
			    scriptableInputStream.init(stream);
			 
			    getLinkContentViaHttpChannelContext.addData(scriptableInputStream.read(length));
			};
		}(getLinkContentViaHttpChannelContext);
	
	channelListener.onStopRequest = 
		function(channel, getLinkContentViaHttpChannelContext)
		{
			return function(request, context, status)
			{
				if (Components.isSuccessCode(status)) 
				{
					var url = getLinkContentViaHttpChannelContext.url;
				
					var isImg = false;
					
					var requestHeaderVisitor = new Object();
					requestHeaderVisitor.visitHeader = function(header, value)
					{
						if(header=="Location")
						{
							getLinkContentViaHttpChannelContext.redirectUrl = grabMyBooks.appendUrlPrefixIfMissing(value);
							if(getLinkContentViaHttpChannelContext.onUrlChangeFunction != null)
							{
								getLinkContentViaHttpChannelContext.onUrlChangeFunction();
							}
						}
						else if(header=="Content-Type")
						{
							if(value!=null && value.toLowerCase().indexOf("image/")==0)
							{
								isImg = true;
							}
							else
							{
								var httpCharset = getLinkContentViaHttpChannelContext.getCharsetFromText(value);
								if(httpCharset!=null)
								{
									getLinkContentViaHttpChannelContext.httpCharset = httpCharset;
								}
							}
						}
					};
					requestHeaderVisitor.isFlash = function()
					{
						return false;
					};
					try
					{
						channel.visitResponseHeaders(requestHeaderVisitor);
					}
					catch(e)
					{
						//Header not set ?
					}
					
					channel.cancel(Components.results.NS_BINDING_ABORTED);
					
					if(isImg && getLinkContentViaHttpChannelContext.onImageFunction != null)
					{
						getLinkContentViaHttpChannelContext.onImageFunction();
					}
					else
					{
						getLinkContentViaHttpChannelContext.getCharsetFromRecievedData();
						getLinkContentViaHttpChannelContext.convertDataWithCharset();
						getLinkContentViaHttpChannelContext.onEndFunction();
					}
				}
			};
		}(channel, getLinkContentViaHttpChannelContext);
	channelListener.onChannelRedirect = function(oldChannel, newChannel, flags) 
	{
	};
	channelListener.asyncOnChannelRedirect = function(oldChannel, newChannel, flags, callback)
	{
		callback.onRedirectVerifyCallback(0);
	};
	channelListener.getInterface = function (aIID) 
	{
		try
		{
	      return this.QueryInterface(aIID);
	    }
	    catch(e)
	    {
	      throw Components.results.NS_NOINTERFACE;
	    }
	};
	channelListener.onProgress = function (request, context, progress, progressMax)
	{
		
	};
	channelListener.onStatus = function (request, context, status, statusArg)
	{
		
	};
	channelListener.onRedirect = function (oldChannel, newChannel)
	{
	};
	channelListener.QueryInterface = function(aIID)
	{
	    if (aIID.equals(Components.interfaces.nsISupports) ||
	        aIID.equals(Components.interfaces.nsIInterfaceRequestor) ||
	        aIID.equals(Components.interfaces.nsIChannelEventSink) ||
	        aIID.equals(Components.interfaces.nsIProgressEventSink) ||
	        aIID.equals(Components.interfaces.nsIHttpEventSink) ||
	        aIID.equals(Components.interfaces.nsIStreamListener))
	      return this;
	    throw Components.results.NS_NOINTERFACE;
	 };
	 
	channel.notificationCallbacks = channelListener;
	channel.asyncOpen(channelListener, null);
	
};

grabMyBooks.onMenuItemCommand = function(e) 
{
  try
  	{
    	grabMyBooks.addLink(grabMyBooks.articleLink, new grabMyBooks.AddToBookContext([grabMyBooks.articleLink]));
    }
    catch(e) 
     {  
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);  
     }
    
};
  
grabMyBooks.onToolbarButtonCommand = function(e) 
{
    grabMyBooks.onMenuItemCommand(e);
};

grabMyBooks.getTitleFromContent = function(content)
{
	var title = null;
	var titleRegExp = new RegExp("<title>(.*?)<\\/title>","i");
	var titleRegExpResult = titleRegExp.exec(content);
	if(titleRegExpResult)
	{
		title = titleRegExpResult[1];
	}
	return title;
};
grabMyBooks.getBaseFromContent = function(content)
{
	var base = null;
	var baseRegExp = new RegExp("<\\s*?base\\s+.*?href=\"(.+?)\".*?\\s*?\\/?\\s*?>","i");
	var baseRegExpResult = baseRegExp.exec(content);
	if(baseRegExpResult)
	{
		base = baseRegExpResult[1];
	}
	return base;
};

grabMyBooks.ext.HTMLParser = function(aHTMLString)
{
 	var html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null),
    body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
  	html.documentElement.appendChild(body);

	body.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
    .getService(Components.interfaces.nsIScriptableUnescapeHTML)
    .parseFragment(aHTMLString, false, null, body));

	var title = grabMyBooks.getTitleFromContent(aHTMLString);
	
	var result = new Object();
	result.body = body;
	result.title = title;
	result.document = html;

	return result;
};

grabMyBooks.ext.getUrlHost = function(url)
{
	if(grabMyBooks.isEmpty(url))
	{
		return null;
	}
	var uri = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(url, null, null);
	var urlObject = uri.QueryInterface(Components.interfaces.nsIURL);
	return urlObject.host;
};

grabMyBooks.ext.HTMLParser2 = function(aHTMLString)
{
	var html = grabMyBooks.getTextAsHtmlNode(aHTMLString);
	var result = new Object();
	result.body = html;
	var title = grabMyBooks.getTitleFromContent(aHTMLString);
	result.title = title;
	var base = grabMyBooks.getBaseFromContent(aHTMLString);
	result.base = base;
	result.document = grabMyBooks.getDefaultDocument();
	
	return result;
};

grabMyBooks.HTMLParserCurrentPage = function()
{
    if(gBrowser.selectedTab==null)
    {
        return null;
    }
    var tabBrowser = gBrowser.getBrowserForTab(gBrowser.selectedTab);
    var currentPageNode = tabBrowser.contentDocument;

    var url = grabMyBooks.ext.getUriUrl(tabBrowser.currentURI);
    var docTitle = grabMyBooks.getDocumentTitle(currentPageNode);
    var docBase = grabMyBooks.getDocumentBase(currentPageNode);

    var currentPageHtml = currentPageNode.body.innerHTML;
    var htmlParseResult = grabMyBooks.ext.HTMLParser2(currentPageHtml);
    htmlParseResult.base = docBase;
    htmlParseResult.title = docTitle;
    htmlParseResult.url = url;

    return htmlParseResult;
};

grabMyBooks.getDefaultDocument = function()
{
    var result = document.getElementById("grabMyBooksBookPanelIframe").contentDocument;
    return result;
};

grabMyBooks.getUrlAsDom = function(url, onDomEndFunction)
{
	var getLinkContentViaHttpChannelContext = new grabMyBooks.GetLinkContentViaHttpChannelContext(url);
	var onEndFunction =
		function(onDomEndFunction)
		{
			return function()
			{
				var pageData = getLinkContentViaHttpChannelContext.data;
				var pageDomInfo = grabMyBooks.ext.HTMLParser2(pageData);
				onDomEndFunction(pageDomInfo);
			};
		}(onDomEndFunction);

	getLinkContentViaHttpChannelContext.onEndFunction = onEndFunction;
	grabMyBooks.ext.getLinkContentViaHttpChannel(getLinkContentViaHttpChannelContext);
};

grabMyBooks.isNodeParagraph = function(node)
{
	var paragraph = (node.localName!=null && node.localName.toUpperCase()=="P");
	return paragraph;
};

grabMyBooks.FindArticleWithMostParagraphsInfo = function(node)
{
	this.node = node;
	this.paragraphCount = 0;
	this.text = "";
	this.ratio = 0;
};

grabMyBooks.FindArticleWithMostTextInfo = function(node)
{
	this.node = node;
	this.textLength = 0;
};

grabMyBooks.ArticleInfo = function(url, title, content)
{
	this.url = url;
	this.content=content;

	this.getTitleDefaultValue = function()
	{
		return "Article $num";
	};

	this.getTitleContentFromOptionValue = function(optionValue, title, url)
	{
		if(optionValue == "title" && !grabMyBooks.isEmpty(title))
		{
			return title;
		}
		if(optionValue == "article" || (optionValue == "title" && grabMyBooks.isEmpty(title)))
		{
			return this.getTitleDefaultValue();
		}
		if(optionValue == "url")
		{
			return url;
		}
		return null;
	};

	this.title = this.getTitleContentFromOptionValue(grabMyBooks.options.title1Default, title, url);
	this.title2 = this.getTitleContentFromOptionValue(grabMyBooks.options.title2Default, title, url);

	this.cloneWithNewGetHtmlContentToWriteBookFunction = function(newContent)
	{
		var result = new grabMyBooks.ArticleInfo(this.url, this.title, this.content);
		result.getHtmlContentToWriteBook =
			function(htmlContent)
			{
				return function()
				{
					return htmlContent;
				};
			}(newContent);
		return result;
	};

	this.getTitleOrDefaultTitle = function()
	{
		if(!grabMyBooks.isEmpty(this.title))
		{
			return this.title;
		}
		return this.getTitleDefaultValue();
	};

	this.getHtmlContent = function()
	{
		return grabMyBooks.textFormat.formatTextForHtml(this.content);
	};

	this.getHtmlContentToWriteBook = function()
	{
		return this.getHtmlContent();
	};
};

grabMyBooks.findArticleNodeWithMostParagraphs = function(node, findArticleWithMostParagraphsInfo, url)
{
	try
	{
		var childCount = node.childNodes.length;
		var currentChildNode;
		var paragraphCount = 0;
		var index;
		var newMostPCandidateText;
		var newMostPCandidateRatio;
		for (index=0;index<childCount;index++)
		{
			currentChildNode = node.childNodes[index];
			if(grabMyBooks.isNodeParagraph(currentChildNode))
			{
				paragraphCount+=1;
			}
		}
		if(paragraphCount>findArticleWithMostParagraphsInfo.paragraphCount && paragraphCount>grabMyBooks.minimumPCount)
		{
			var getTextFromNodeContext = new grabMyBooks.GetTextFromNodeContext(node, url);
			grabMyBooks.getTextFromNode(getTextFromNodeContext);
			newMostPCandidateText = getTextFromNodeContext.getResult();
			newMostPCandidateRatio = newMostPCandidateText.length/paragraphCount;
			//grabMyBooks.ext.alert("new spot: length:"+newMostPCandidateText.length+", count:"+paragraphCount+", ratio:"+newMostPCandidateRatio);
			if(newMostPCandidateRatio>=grabMyBooks.pRatio && newMostPCandidateRatio>=findArticleWithMostParagraphsInfo.ratio)
			{
				findArticleWithMostParagraphsInfo.node = node;
				findArticleWithMostParagraphsInfo.paragraphCount = paragraphCount;
				findArticleWithMostParagraphsInfo.text = newMostPCandidateText;
				findArticleWithMostParagraphsInfo.ratio = newMostPCandidateRatio;
			}
		}
		for (index=0;index<childCount;index++)
		{
			currentChildNode = node.childNodes[index];
			if(!grabMyBooks.isNodeValid(currentChildNode) || !grabMyBooks.inValidVisibleNode(currentChildNode))
			{
				continue;
			}
			grabMyBooks.findArticleNodeWithMostParagraphs(currentChildNode, findArticleWithMostParagraphsInfo, url);
		}
	}
     catch(e)
     {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
     }
};

grabMyBooks.findArticleNodeWithMostText = function(node, findArticleWithMostTextInfo)
{
	try
	{
		var childCount = node.childNodes.length;
		var currentChildNode;
		var textLength = 0;
		var index;
		for (index=0;index<childCount;index++)
		{
			currentChildNode = node.childNodes[index];
			if(!grabMyBooks.isNodeValid(currentChildNode) || !grabMyBooks.inValidVisibleNode(currentChildNode))
			{
				continue;
			}
			if(currentChildNode.nodeType==3)
			{
				textLength+=currentChildNode.nodeValue.length;
			}
		}
		if(textLength>findArticleWithMostTextInfo.textLength)
		{
			findArticleWithMostTextInfo.node = node;
			findArticleWithMostTextInfo.textLength = textLength;
		}
		for (index=0;index<childCount;index++)
		{
			currentChildNode = node.childNodes[index];
			if(!grabMyBooks.isNodeValid(currentChildNode) || !grabMyBooks.inValidVisibleNode(currentChildNode))
			{
				continue;
			}
			grabMyBooks.findArticleNodeWithMostText(currentChildNode, findArticleWithMostTextInfo);
		}
	}
     catch(e)
     {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
     }
};

grabMyBooks.textFormat = new Object();

grabMyBooks.textFormat.formatTextForHtml_1 = function(articleText)
{
	articleText = grabMyBooks.textFormat.formatText(articleText);
	articleText = grabMyBooks.escapeTagsExtended(articleText);
	return articleText;
};

grabMyBooks.textFormat.formatTextForHtml_2 = function(articleText)
{
	articleText = grabMyBooks.textFormat.protectPreformattedWhitespace(articleText);
	articleText = articleText.replace(/\$i\{/g,"<i>");
	articleText = articleText.replace(/\$b\{/g,"<b>");
	articleText = articleText.replace(/\$c\{/g,"<code>");
	articleText = articleText.replace(/\$pre\{/g,"<pre>");
	articleText = articleText.replace(/\$h1\{/g,"<h1>");
	articleText = articleText.replace(/\$h2\{/g,"<h2>");
	articleText = articleText.replace(/\$h3\{/g,"<h3>");
	articleText = articleText.replace(/\$h4\{/g,"<h4>");
	articleText = articleText.replace(/\$h5\{/g,"<h5>");
	articleText = articleText.replace(/\$h6\{/g,"<h6>");
	articleText = articleText.replace(/\$ul\{/g,"<ul>");
	articleText = articleText.replace(/\$ol\{/g,"<ol>");
	articleText = articleText.replace(/\$li\{/g,"<li>");
	articleText = articleText.replace(/\$blockquote\{/g,"<blockquote>");
	articleText = articleText.replace(/\$cite\{/g,"<cite>");
	articleText = articleText.replace(/\$k\{/g,"<span style=\"text-decoration:line-through;\">");
	articleText = articleText.replace(/\$u\{/g,"<span style=\"text-decoration:underline;\">");
	articleText = articleText.replace(/\$q\{/g,"<sub>");
	articleText = articleText.replace(/\$d\{/g,"<sup>");
	articleText = articleText.replace(/\$s\{/g,"<small>");
	articleText = articleText.replace(/\$s\{/g,"<small>");
	articleText = articleText.replace(/\}i\$/g,"</i>");
	articleText = articleText.replace(/\}b\$/g,"</b>");
	articleText = articleText.replace(/\}c\$/g,"</code>");
	articleText = articleText.replace(/\}pre\$/g,"</pre>");
	articleText = articleText.replace(/\}h1\$/g,"</h1>");
	articleText = articleText.replace(/\}h2\$/g,"</h2>");
	articleText = articleText.replace(/\}h3\$/g,"</h3>");
	articleText = articleText.replace(/\}h4\$/g,"</h4>");
	articleText = articleText.replace(/\}h5\$/g,"</h5>");
	articleText = articleText.replace(/\}h6\$/g,"</h6>");
	articleText = articleText.replace(/\}ul\$/g,"</ul>");
	articleText = articleText.replace(/\}ol\$/g,"</ol>");
	articleText = articleText.replace(/\}li\$/g,"</li>");
	articleText = articleText.replace(/\}blockquote\$/g,"</blockquote>");
	articleText = articleText.replace(/\}cite\$/g,"</cite>");
	articleText = articleText.replace(/\}k\$/g,"</span>");
	articleText = articleText.replace(/\}u\$/g,"</span>");
	articleText = articleText.replace(/\}q\$/g,"</sub>");
	articleText = articleText.replace(/\}d\$/g,"</sup>");
	articleText = articleText.replace(/\}s\$/g,"</small>");

	articleText = articleText.replace(/\$tb\{/g,"<table border=\"1\">");
	articleText = articleText.replace(/\}tb\$/g,"</table>");


	articleText = articleText.replace(/^\s+/g,"");
	articleText = articleText.replace(/\s+$/g,"");
	articleText = articleText.replace(/\n{2,}/g,"</p>\n\n<p>");

	articleText = "<p>"+articleText+"</p>";

	articleText = articleText.replace(/<\/table><\/p>/g,"</table>");
	articleText = articleText.replace(/<p><table/g,"<table");
	

	var textHolder = new Object();
	textHolder.text = articleText;
	articleText = grabMyBooks.textFormat.formatTextForHtmlSequential(textHolder);
	return articleText;
};

grabMyBooks.textFormat.formatTextForHtml = function(articleText)
{
	articleText = grabMyBooks.textFormat.formatTextForHtml_1(articleText);
	articleText = grabMyBooks.textFormat.formatTextForHtml_2(articleText);
	articleText = grabMyBooks.img.replaceImgTagsInText(articleText);
	return articleText;
};

grabMyBooks.textFormat.formatText = function(articleText)
{
	var textHolder = new Object();
	textHolder.text = articleText;
	articleText = grabMyBooks.textFormat.formatTextSequential(textHolder);
	//Whitespace is only collapsed outside of pre and code blocks. Inside them, spaces, tabs and line breaks are content.
	var segments = grabMyBooks.textFormat.splitPreformatted(articleText);
	var resultTab = [];
	var currentSegment;
	for(var i_segment=0; i_segment<segments.length; i_segment++)
	{
		currentSegment = segments[i_segment];
		if(currentSegment.pre)
		{
			resultTab.push(currentSegment.text);
		}
		else
		{
			resultTab.push(grabMyBooks.textFormat.collapseWhitespace(currentSegment.text));
		}
	}
	articleText = resultTab.join("");
	articleText = articleText.replace(/^\s+/g,"");
	articleText = articleText.replace(/\s+$/g,"");
	//articleText = articleText.replace(/\n{3,}/g,"\n\n");
	//articleText = articleText.replace(/[\t ]{2,}/g," ");
	//articleText = articleText.replace(/\n /g,"\n");
	//articleText = articleText.replace(/\n{3,}/g,"\n\n");//second time needed.
	return articleText;
};

grabMyBooks.textFormat.collapseWhitespace = function(text)
{
	text = text.replace(/\n{3,}/g,"\n\n");
	text = text.replace(/[\t ]{2,}/g," ");
	text = text.replace(/\n /g,"\n");
	text = text.replace(/\n{3,}/g,"\n\n");//second time needed.
	return text;
};

grabMyBooks.textFormat.preformattedOpenings = ["$pre{", "$c{"];
grabMyBooks.textFormat.preformattedClosings = ["}pre$", "}c$"];

grabMyBooks.textFormat.markerAt = function(text, index, markers)
{
	for(var i_marker=0; i_marker<markers.length; i_marker++)
	{
		if(text.substr(index, markers[i_marker].length)==markers[i_marker])
		{
			return markers[i_marker];
		}
	}
	return null;
};

//Cuts the text into segments {text, pre}. pre is true for everything from an opening $pre{ or $c{ to its matching closing (markers included).
grabMyBooks.textFormat.splitPreformatted = function(text)
{
	var segments = [];
	var textLength = text.length;
	var depth = 0;
	var segmentStart = 0;
	var i_char = 0;
	var currentChar;
	var marker;
	while(i_char < textLength)
	{
		currentChar = text.charAt(i_char);
		if(currentChar=="$")
		{
			marker = grabMyBooks.textFormat.markerAt(text, i_char, grabMyBooks.textFormat.preformattedOpenings);
			if(marker != null)
			{
				if(depth==0 && i_char>segmentStart)
				{
					segments.push({text:text.substring(segmentStart, i_char), pre:false});
					segmentStart = i_char;
				}
				depth++;
				i_char += marker.length;
				continue;
			}
		}
		else if(currentChar=="}" && depth>0)
		{
			marker = grabMyBooks.textFormat.markerAt(text, i_char, grabMyBooks.textFormat.preformattedClosings);
			if(marker != null)
			{
				depth--;
				i_char += marker.length;
				if(depth==0)
				{
					segments.push({text:text.substring(segmentStart, i_char), pre:true});
					segmentStart = i_char;
				}
				continue;
			}
		}
		i_char++;
	}
	if(segmentStart < textLength)
	{
		segments.push({text:text.substring(segmentStart), pre:(depth>0)});
	}
	return segments;
};

grabMyBooks.textFormat.preformattedTabSize = 4;

//Html renderers (and e-readers) collapse spaces, tabs and new lines, so inside pre/code blocks they are written as
//&#160; (non breaking space) and <br/>. The first space after a visible character stays a normal space
//(it is the separator of $lnk{url text}lnk$), the other spaces of the run become non breaking.
grabMyBooks.textFormat.protectWhitespace = function(text)
{
	var tabText = new Array(grabMyBooks.textFormat.preformattedTabSize + 1).join("&#160;");
	text = text.replace(/\t/g, tabText);
	var lines = text.split("\n");
	var resultLines = [];
	var currentLine;
	for(var i_line=0; i_line<lines.length; i_line++)
	{
		currentLine = lines[i_line];
		currentLine = currentLine.replace(/^ +/, function(spaces){return new Array(spaces.length + 1).join("&#160;");});
		currentLine = currentLine.replace(/ {2,}/g, function(spaces){return " " + new Array(spaces.length).join("&#160;");});
		resultLines.push(currentLine);
	}
	return resultLines.join("<br/>");
};

grabMyBooks.textFormat.protectPreformattedWhitespace = function(text)
{
	var segments = grabMyBooks.textFormat.splitPreformatted(text);
	var resultTab = [];
	var currentSegment;
	for(var i_segment=0; i_segment<segments.length; i_segment++)
	{
		currentSegment = segments[i_segment];
		if(currentSegment.pre)
		{
			resultTab.push(grabMyBooks.textFormat.protectWhitespace(currentSegment.text));
		}
		else
		{
			resultTab.push(currentSegment.text);
		}
	}
	return resultTab.join("");
};

grabMyBooks.textFormat.InstructionStack = function()
{
	this.instructions = [];

	this.inText = false;

	this.isSomethingClosingWith = function(closing)
	{
		var currentInstruction;
		for(var i_inst=this.instructions.length-1; i_inst>=0; i_inst--)
		{
			currentInstruction = this.instructions[i_inst];
			if(currentInstruction.getClosing()==closing)
			{
				return true;
			}
		}
		return false;
	};

	this.isThereOpenedInstruction = function(key)
	{
		var currentInstruction;
		for(var i_inst=this.instructions.length-1; i_inst>=0; i_inst--)
		{
			currentInstruction = this.instructions[i_inst];
			if(currentInstruction.key==key)
			{
				return true;
			}
		}
		return false;
	};

	this.closeWith = function(closing)
	{
		var currentInstruction;
		var closeTextTab = [];

		while(this.instructions.length>0)
		{
			currentInstruction = this.instructions.pop();
			closeTextTab.push(currentInstruction.getClosingText());
			if(currentInstruction.outsideP)
			{
				closeTextTab.push("\n\n");
			}
			if(currentInstruction.getClosing()==closing)
			{
				break;
			}
		}
		this.inText = false;
		return closeTextTab.join("");
	};

	this.closeAt = function(closingIndex)
	{
		var currentInstruction;
		var closeTextTab = [];

		while(this.instructions.length>closingIndex)
		{
			currentInstruction = this.instructions.pop();
			closeTextTab.push(currentInstruction.getClosingText());
			if(currentInstruction.outsideP)
			{
				closeTextTab.push("\n\n");
			}
		}
		this.inText = false;
		return closeTextTab.join("");
	};

	this.closeAll = function()
	{
		return this.closeWith("nonExistingClosing");
	};

	this.openWith = function(instruction, resultTab)
	{
		var currentInstruction;

		for(var i_inst=0; i_inst<this.instructions.length; i_inst++)
		{
			currentInstruction = this.instructions[i_inst];
			if(!currentInstruction.acceptSubChildInstruction(instruction))
			{
				resultTab.push(this.closeAt(i_inst));
				this.inText = false;
				break;
			}
		}

		for(var i_inst=this.instructions.length-1; i_inst>=0; i_inst--)
		{
			currentInstruction = this.instructions[i_inst];
			if(!currentInstruction.acceptDirectChildInstruction(instruction))
			{
				resultTab.push(this.closeWith(currentInstruction.getClosing()));
				this.inText = false;
			}
			else
			{
				break;
			}
		}

		if(!instruction.canStartOutOfNowhere && (this.instructions.length == 0))
		{
			return false;
		}

		if(instruction.outsideP)
		{
			resultTab.push("\n\n");
		}
		if(this.instructions.length > 0)
		{
			this.instructions[this.instructions.length - 1].directChildSeen = true;
		}
		this.instructions.push(instruction);
		this.inText = false;
		resultTab.push(instruction.getOpening());
		return true;
	};

	this.setInText = function(resultTab)
	{
		if(!this.inText && this.instructions.length > 0)
		{
			var instructionsToAddTab = this.instructions[this.instructions.length - 1].onTextSeen();
			if(instructionsToAddTab != null)
			{
				var openInstructionFunction =
					function(instructionStack, resultTab)
					{
						return function(toAddInstruction, index, count)
						{
							instructionStack.openWith(toAddInstruction, resultTab);
						};
					}(this, resultTab);
				grabMyBooks.tabDo(instructionsToAddTab, openInstructionFunction);
			}
		}
		this.inText = true;
	};

	this.separatorSeen = function(separator)
	{
		if(this.instructions.length==0)
		{
			return;
		}
		this.instructions[this.instructions.length-1].separatorSeen(separator);
	};
};


grabMyBooks.textFormat.InstructionImg = function()
{
	this.key = "img";
	this.outsideP = false;
	this.canStartOutOfNowhere = true;
	this.directChildSeen = false;
	this.getOpening = function()
	{
		return "$IMG{";
	};
	this.getClosing = function()
	{
		return "}";
	};
	this.getClosingText = function(){return this.getClosing();};
	this.acceptDirectChildInstruction = function(instruction)
	{
		return false;
	};
	this.acceptSubChildInstruction = function(instruction)
	{
		return false;
	};
	this.separatorSeen = function(separator){};
	this.onTextSeen = function(){return null;};
};
grabMyBooks.textFormat.InstructionLink = function()
{
	this.key = "link";
	this.outsideP = false;
	this.canStartOutOfNowhere = true;
	this.directChildSeen = false;
	this.separator = false;
	this.getOpening = function()
	{
		return "$lnk{";
	};
	this.getClosing = function()
	{
		return "}lnk$";
	};
	this.getClosingText = function(){return this.getClosing();};
	this.acceptDirectChildInstruction = function(instruction)
	{
		if(!this.separator || (instruction.key == "link" || instruction.key == "tr" || instruction.key == "td"))
		{
			return false;
		}
		return true;
	};
	this.acceptSubChildInstruction = function(instruction)
	{
		return this.acceptDirectChildInstruction(instruction);
	};
	this.separatorSeen = function(separator)
	{
		if(!this.separator && separator==" ")
		{
			this.separator = true;
		}
	};
	this.onTextSeen = function(){return null;};
};

grabMyBooks.textFormat.getStyleInstruction = function(style)
{
	var result = new Object();
	result.style = style;
	result.key = "style_"+style;
	result.outsideP = false;
	result.canStartOutOfNowhere = true;
	result.directChildSeen = false;
	result.getOpening = function()
	{
		return "$"+this.style+"{";
	};
	result.getClosing = function()
	{
		return "}"+this.style+"$";
	};
	result.getClosingText = function(){return this.getClosing();};
	result.acceptDirectChildInstruction = function(instruction)
	{
		return (instruction.key != "tr" && instruction.key != "td");
	};
	result.acceptSubChildInstruction = function(instruction)
	{
		return true;
	};
	result.separatorSeen = function(separator){};
	result.onTextSeen = function(){return null;};
	return result;
};
grabMyBooks.textFormat.getTableInstruction = function(type)
{
	var result = new Object();
	result.key = type;
	result.outsideP = (result.key == "tb");
	result.canStartOutOfNowhere = (result.key == "tb");
	result.directChildSeen = false;
	result.getOpening = function()
	{
		return "$"+this.key+"{";
	};
	result.getClosing = function()
	{
		return "}"+this.key+"$";
	};
	result.getClosingText = function()
	{
		var resultTab = [];

		if(!this.directChildSeen && this.key == "tb")
		{
			resultTab.push("$tr{$td{}td$}tr$");
		}
		else if(!this.directChildSeen && this.key == "tr")
		{
			resultTab.push("$td{}td$");
		}

		resultTab.push(this.getClosing());
		return resultTab.join("");
	};
	result.acceptDirectChildInstruction = function(instruction)
	{
		if(this.key=="tb")
		{
			return (instruction.key == "tr");
		}
		if(this.key=="tr")
		{
			return (instruction.key == "td");
		}
		if(this.key=="td")
		{
			return (instruction.key != "tr" && instruction.key != "td");
		}
		return true;
	};
	result.acceptSubChildInstruction = function(instruction)
	{
		if(this.key=="tb")
		{
			return (instruction.key != "tb");
		}
		return true;
	};
	result.separatorSeen = function(separator){};
	result.onTextSeen = function()
	{
		if(this.key=="tb")
		{
			return [grabMyBooks.textFormat.getTableInstruction("tr"), grabMyBooks.textFormat.getTableInstruction("td")];
		}
		if(this.key=="tr")
		{
			return [grabMyBooks.textFormat.getTableInstruction("td")];
		}
		return null;
	};
	return result;
};

grabMyBooks.textFormat.skipSpanFunction = function(textHolder, cursorHolder)
{
	//only cspan not rspan as with rspan not sure if image by itself on line.
	var span = (textHolder.text.indexOf("cspan", cursorHolder.cursor)==cursorHolder.cursor);
	if(!span)
	{
		return;
	}
	var cursor = cursorHolder.cursor + 5;
	if(isNaN(textHolder.text.charAt(cursor)))
	{
		return;
	}
	cursor += 1;
	while(!isNaN(textHolder.text.charAt(cursor)))
	{
		cursor += 1;
	}
	cursorHolder.cursor = cursor;
};

grabMyBooks.textFormat.doesRowOnlyContainsOneImg = function(textHolder, rowStartIndex)
{
	var rowEndIndex = textHolder.text.indexOf("}tr$", rowStartIndex);
	if(rowEndIndex<rowStartIndex)
	{
		return false;
	}
	var cellIndex = textHolder.text.indexOf("$td{", rowStartIndex + 4);
	var cellCount = 0;
	while(cellIndex != -1 && cellIndex<rowEndIndex)
	{
		cellCount += 1;
		cellIndex = textHolder.text.indexOf("$td{", cellIndex + 4);
	}
	if(cellCount != 1)
	{
		return false;
	}
	var cursorHolder = new Object();
	cursorHolder.start = textHolder.text.indexOf("$td{", rowStartIndex + 4) + 4;
	cursorHolder.end = textHolder.text.indexOf("}td$", cursorHolder.start) - 1;
	cursorHolder.cursor = cursorHolder.start;
	cursorHolder.cursorEnd = cursorHolder.end;
	cursorHolder.spaceRegexp = /\s/;
	cursorHolder.remaining = function()
	{
		return (this.end - this.cursor);
	};

	var isNextFunction =
		function(textHolder, cursorHolder)
		{
			return function(text)
			{
				var result = (textHolder.text.indexOf(text, cursorHolder.cursor) == cursorHolder.cursor);
				return result;
			};
		}(textHolder, cursorHolder);
	var isLastFunction =
		function(textHolder, cursorHolder)
		{
			return function(text)
			{
				var position = (cursorHolder.cursorEnd+1-text.length);
				var result = (textHolder.text.indexOf(text, position) == position);
				return result;
			};
		}(textHolder, cursorHolder);

	var skipSpaceFunction =
		function(textHolder, cursorHolder)
		{
			return function(direction)
			{
				if(direction)
				{
					while(cursorHolder.spaceRegexp.test(textHolder.text.charAt(cursorHolder.cursor)) && cursorHolder.cursor<=cursorHolder.end)
					{
							cursorHolder.cursor += 1;
					}
				}
				else
				{
					while(cursorHolder.spaceRegexp.test(textHolder.text.charAt(cursorHolder.cursorEnd)) && cursorHolder.cursorEnd>=cursorHolder.start)
					{
							cursorHolder.cursorEnd -= 1;
					}
				}
			};
		}(textHolder, cursorHolder);

	skipSpaceFunction(true);
	skipSpaceFunction(false);
	grabMyBooks.textFormat.skipSpanFunction(textHolder, cursorHolder);
	skipSpaceFunction(true);
	if(isNextFunction("$IMG{") && isLastFunction("}"))
	{
		return true;
	}
	if(!isNextFunction("$lnk{") || !isLastFunction("}lnk$"))
	{
		return false;
	}
	cursorHolder.cursor += 5;
	cursorHolder.cursorEnd -= 5;
	skipSpaceFunction(true);
	var linkSeparatorIndex = textHolder.text.indexOf(" ", cursorHolder.cursor);
	if(linkSeparatorIndex==-1 || linkSeparatorIndex>=cursorHolder.cursorEnd)
	{
		return false;
	}
	cursorHolder.cursor = linkSeparatorIndex+1;
	if(isNextFunction("$IMG{") && isLastFunction("}"))
	{
		return true;
	}
	return false;
};

grabMyBooks.textFormat.formatTextForHtmlSequential = function(textHolder)
{
	var resultTab = [];
	var textLength = textHolder.text.length;
	var currentChar;
	var linkSeen = false;
	var linkSeparatorSeen = false;
	var remaining;
	for(var i_char=0; i_char<textLength; i_char++)
	{
		remaining = (textLength - i_char);
		currentChar = textHolder.text.charAt(i_char);
		if(currentChar=="\n" && i_char>0 && i_char<(textLength-1))
		{
			if(textHolder.text.charAt(i_char-1)!="\n" && textHolder.text.charAt(i_char+1)!="\n")
			{
				resultTab.push("<br/>");
				continue;
			}
		}
		else if(remaining>=5 && textHolder.text.substr(i_char, 5)=="$lnk{")
		{
			linkSeen = true;
			resultTab.push("<a href=\"");
			i_char+=(5-1);
			continue;
		}
		else if(!linkSeparatorSeen && linkSeen && textHolder.text.charAt(i_char)==" ")
		{
			linkSeparatorSeen = true;
			resultTab.push("\">");
			continue;
		}
		else if(linkSeen && textHolder.text.substr(i_char, 5)=="}lnk$")
		{
			if(!linkSeparatorSeen)
			{
				resultTab.push("\">");
			}
			resultTab.push("</a>");
			linkSeen = false;
			linkSeparatorSeen = false;
			i_char+=(5-1);
			continue;
		}
		else if(remaining>=4 && textHolder.text.substr(i_char, 4)=="$tr{")
		{
			resultTab.push("<tr");
			var onlyImg = grabMyBooks.textFormat.doesRowOnlyContainsOneImg(textHolder, i_char);
			if(onlyImg)
			{
				resultTab.push(" class=\"rowSingleImg\"");
			}
			else
			{
				resultTab.push(" class=\"row\"");
			}
			resultTab.push(">");
			i_char+=(4-1);
			continue;
		}
		else if(remaining>=4 && textHolder.text.substr(i_char, 4)=="$td{")
		{
			resultTab.push("<td");
			var tdStyle = "";
			var nextTdClose = textHolder.text.indexOf("}td$", i_char+4);
			var nextTdDistance = (nextTdClose-(i_char+4));
			if(nextTdDistance>=500 && nextTdDistance<1000)
			{
				tdStyle += "font-size:0.7em;";
			}
			else if(nextTdDistance>=1000 && nextTdDistance<4000)
			{
				tdStyle += "font-size:0.5em;";
			}
			else if(nextTdDistance>=4000)
			{
				tdStyle += "font-size:0.4em;";
			}

			for(var i_spanCount=5; i_spanCount>0; i_spanCount--)
			{
				if(remaining>=(8+i_spanCount) && (textHolder.text.substr(i_char+4, 5)=="cspan" || textHolder.text.substr(i_char+4, 5)=="rspan") && !isNaN(textHolder.text.substr(i_char+9, i_spanCount)))
				{
					var spanNumber = textHolder.text.substr(i_char+9, i_spanCount);
					spanNumber = parseInt(spanNumber, 10);
					var isColSpan = (textHolder.text.substr(i_char+4, 1)=="c");
					if(spanNumber > 1 && isColSpan)
					{
						tdStyle += "text-align:center;";
					}
					resultTab.push(" ",(isColSpan?"col":"row"),"span=\"",spanNumber,"\" ");
					i_char+=(5+i_spanCount);
					break;
				}
			}
			if(!grabMyBooks.isEmpty(tdStyle))
			{
				resultTab.push(" style=\"", tdStyle, "\"");
			}
			resultTab.push(">");
			i_char+=(4-1);
			continue;
		}
		else if(remaining>=4 && textHolder.text.substr(i_char, 4)=="}td$")
		{
			resultTab.push("</td>");
			i_char+=(4-1);
			continue;
		}
		else if(remaining>=4 && textHolder.text.substr(i_char, 4)=="}tr$")
		{
			resultTab.push("</tr>");
			i_char+=(4-1);
			continue;
		}
		resultTab.push(currentChar);
	}
	var result = resultTab.join("");
	return result;
}

grabMyBooks.isCharHexa = function(text)
{
	var charCode = text.toUpperCase().charCodeAt(0);
	var result = ((charCode>=65 && charCode<=70) || (charCode>=48 && charCode<=57));
	return result;
};
grabMyBooks.escapeForDecodeUri = function(text)
{
	var resultTab = [];
	var textLength = text.length;
	var currentChar;
	for(var i_char=0; i_char<textLength; i_char++)
	{
		currentChar = text.charAt(i_char);
		if(currentChar=="%")
		{
			if(i_char>=(textLength-2))
			{
				resultTab.push("%25");
				continue;
			}
			var nextChar = text.charAt(i_char+1);
			var nextNextChar = text.charAt(i_char+2);
			if(!grabMyBooks.isCharHexa(nextChar) || !grabMyBooks.isCharHexa(nextNextChar))
			{
				resultTab.push("%25");
				continue;
			}
		}
		resultTab.push(currentChar);
	}
	var result = resultTab.join("");
	return result;
};

grabMyBooks.textFormat.validInstructionTypes = ["b","i","k","u","q","d","s","tb","tr","td"];
grabMyBooks.textFormat.isValidInstructionType = function(type)
{
	var result = (grabMyBooks.textFormat.validInstructionTypes.indexOf(type)!=-1);
	return result;
};

grabMyBooks.textFormat.formatTextSequential = function(textHolder)
{
	var instructionStack = new grabMyBooks.textFormat.InstructionStack();

	var resultTab = [];
	var textLength = textHolder.text.length;
	textHolder.cursor = 0;
	var preformattedDepth = 0;

	var isNextFunction =
		function(textHolder)
		{
			return function(pattern)
			{
				var patternLength = pattern.length;
				if(textHolder.remainingCount<patternLength)
				{
					return false;
				}
				var currentPatternChar;
				var currentTextChar;
				for(var i_char=0; i_char<patternLength; i_char++)
				{
					currentPatternChar = pattern.charAt(i_char);
					currentTextChar = textHolder.text.charAt(textHolder.cursor + i_char);
					if(currentPatternChar=="*" && currentTextChar!=" ")
					{
						continue;
					}
					if(currentPatternChar=="#" && !isNaN(currentTextChar))
					{
						continue;
					}
					if(currentTextChar != currentPatternChar)
					{
						return false;
					}
				}
				return true;
			};
		}(textHolder);

	var handleClosingFunction =
		function(resultTab, textHolder, instructionStack)
		{
			return function(closing)
			{
				if(!instructionStack.isSomethingClosingWith(closing))
				{	//if just } without opened image before.
					if(closing.length==1)
					{
						instructionStack.setInText(resultTab);
						resultTab.push(closing);
					}
				}
				else
				{
					resultTab.push(instructionStack.closeWith(closing));
				}
				textHolder.cursor+=closing.length;
			};
		}(resultTab, textHolder, instructionStack);


	while(textHolder.cursor<textLength)
	{
		textHolder.remainingCount = textLength - textHolder.cursor;
		//inside pre/code new lines are content, they are never dropped.
		var cursorChar = textHolder.text.charAt(textHolder.cursor);
		if(cursorChar=="$")
		{
			if(isNextFunction("$pre{") || isNextFunction("$c{"))
			{
				preformattedDepth++;
			}
		}
		else if(cursorChar=="}" && preformattedDepth>0)
		{
			if(isNextFunction("}pre$") || isNextFunction("}c$"))
			{
				preformattedDepth--;
			}
		}

		//style close
		if(isNextFunction("}*$"))
		{
			var styleChar = textHolder.text.charAt(textHolder.cursor+1);
			if(grabMyBooks.textFormat.isValidInstructionType(styleChar))
			{
				var styleClosing = ("}"+styleChar+"$");
				handleClosingFunction(styleClosing);
				continue;
			}
		}
		//table element close
		if(isNextFunction("}t*$"))
		{
			var type = textHolder.text.substr(textHolder.cursor+1,2);
			if(grabMyBooks.textFormat.isValidInstructionType(type))
			{
				var closing = ("}"+type+"$");
				handleClosingFunction(closing);
				continue;
			}
		}
		//link close
		if(isNextFunction("}lnk$"))
		{
			handleClosingFunction("}lnk$");
			continue;
		}
		//img close
		if(isNextFunction("}"))
		{
			handleClosingFunction("}");
			continue;
		}
		//link separator
		if(isNextFunction(" "))
		{
			resultTab.push(" ");
			textHolder.cursor+=1;
			instructionStack.separatorSeen(" ");
			continue;
		}
		//img start
		if(isNextFunction("$IMG{"))
		{
			var instruction = new grabMyBooks.textFormat.InstructionImg();
			instructionStack.openWith(instruction, resultTab);
			textHolder.cursor+=5;
			continue;
		}
		//link start
		if(isNextFunction("$lnk{"))
		{
			var instruction = new grabMyBooks.textFormat.InstructionLink();
			instructionStack.openWith(instruction, resultTab);
			textHolder.cursor+=5;
			continue;
		}
		//style open
		if(isNextFunction("$*{"))
		{
			var styleChar = textHolder.text.charAt(textHolder.cursor+1);
			if(grabMyBooks.textFormat.isValidInstructionType(styleChar))
			{
				var instruction = grabMyBooks.textFormat.getStyleInstruction(styleChar);
				instructionStack.openWith(instruction, resultTab);
				textHolder.cursor+=3;
				continue;
			}
		}
		//table element open
		if(isNextFunction("$t*{"))
		{
			var type = textHolder.text.substr(textHolder.cursor+1, 2);
			if(grabMyBooks.textFormat.isValidInstructionType(type))
			{
				var instruction = grabMyBooks.textFormat.getTableInstruction(type);
				var opened = instructionStack.openWith(instruction, resultTab);
				textHolder.cursor+=4;
				if(!opened && type=="td")
				{
					grabMyBooks.textFormat.skipSpanFunction(textHolder, textHolder);
				}
				continue;
			}
		}
		//end of paragraph
		if(isNextFunction("\n\n"))
		{
			if(instructionStack.isThereOpenedInstruction("tb"))
			{
				textHolder.cursor+=1;
				continue;
			}
			resultTab.push(instructionStack.closeAll());
			resultTab.push("\n\n");
			textHolder.cursor+=2;
			continue;
		}
		if(isNextFunction("\n"))
		{	//we don't want <br> in middle of tb tr tags.
			//if(!instructionStack.inText)
			if(!instructionStack.inText && preformattedDepth==0)
			{
				textHolder.cursor+=1;
				continue;
			}
		}
		instructionStack.setInText(resultTab);
		resultTab.push(textHolder.text.charAt(textHolder.cursor));
		textHolder.cursor+=1;
	}
	var lastCloseAll = instructionStack.closeAll();
	resultTab.push(lastCloseAll);
	var resultString = resultTab.join("");
	return resultString;
};

grabMyBooks.convertAttributeNodeToTextNode = function(attributeNode, doc)
{
	var textNode = doc.createTextNode(attributeNode.nodeValue);
	return textNode;
};

grabMyBooks.applyRulesToNode = function(url, node, nodeDocument, addToBookContext, toDoAfterRulesCheckFunction)
{
	var result = new Object();
	result.detectedByRule = false;
	result.node = node;

	if(addToBookContext.grabWholePage)
	{
		toDoAfterRulesCheckFunction(result);
		return;
	}

	try
	{
		var handleRuleXPathResultFunction =
			function(url, node, nodeDocument, addToBookContext, result)
			{
				return function(xPathResult)
				{
					if(xPathResult.snapshotLength==1)
					{
						result.detectedByRule = true;
						result.node = xPathResult.snapshotItem(0);
						var parentNode = result.node.parentNode;
						var wrapNode = null;
						if(parentNode!=null)
						{
							wrapNode = grabMyBooks.wrapNodeDependingOnAncestors(parentNode, nodeDocument);
						}
						if(wrapNode!=null)
						{
							wrapNode.appendChild(result.node.cloneNode(true));
							result.node = wrapNode;
						}
						if(result.node.nodeType==2)
						{
							result.node = grabMyBooks.convertAttributeNodeToTextNode(result.node, nodeDocument);
						}
						return result;
					}
					var currentXPathNode;
					var currentClonedXPathNode;
					var parentNode = nodeDocument.createElement("span");
					var currentSeparatorPNode;
					var currentTextNode;
					var currentWrapNode;
					var currentParentNode;
					for (var i_xPathNode = 0; i_xPathNode < xPathResult.snapshotLength; i_xPathNode++)
					{
						currentXPathNode = xPathResult.snapshotItem(i_xPathNode);
						currentClonedXPathNode = currentXPathNode.cloneNode(true);
						currentWrapNode = null;
						if(currentXPathNode.nodeType==2)
						{
							currentSeparatorPNode = nodeDocument.createElement("p");
							currentTextNode = grabMyBooks.convertAttributeNodeToTextNode(currentXPathNode, nodeDocument);
							currentSeparatorPNode.appendChild(currentTextNode);
							parentNode.appendChild(currentSeparatorPNode);
						}
						else if(!grabMyBooks.isNodeParagraph(currentXPathNode))
						{
							currentParentNode = currentXPathNode.parentNode;
							if(currentParentNode != null)
							{
								currentWrapNode = grabMyBooks.wrapNodeDependingOnAncestors(currentParentNode, nodeDocument);
							}
							if(currentWrapNode != null)
							{
								currentSeparatorPNode = currentWrapNode;
							}
							else
							{
								currentSeparatorPNode = nodeDocument.createElement("p");
							}
							currentSeparatorPNode.appendChild(currentClonedXPathNode);
							parentNode.appendChild(currentSeparatorPNode);
						}
						else
						{
							parentNode.appendChild(currentClonedXPathNode);
						}
					}
					result.detectedByRule = true;
					result.node = parentNode;
				};
			}(url, node, nodeDocument, addToBookContext, result);

		var xPathToUseFromContext = null;
		var urlXPathInfo = addToBookContext.getUrlXPathInfo(url);
		if(urlXPathInfo != null)
		{
			xPathToUseFromContext = urlXPathInfo.xpath;
		}
		else
		{
			xPathToUseFromContext = addToBookContext.globalXPath;
		}

		var testXPathFunction =
			function(doc, node)
			{
				return function(xPath)
				{
					var xPathResult = doc.evaluate(xPath ,node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

					if(xPath.indexOf("//body")!=-1)
					{
						var xPathTab = xPath.split("|");
						var currentXPathPart;
						for(var i_xPath=0; i_xPath<xPathTab.length; i_xPath++)
						{
							currentXPathPart = xPathTab[i_xPath].trim();
							if(currentXPathPart.indexOf("//body")==0)
							{
								currentXPathPart = currentXPathPart.substr(6);
								if(grabMyBooks.isEmpty(currentXPathPart))
								{
									currentXPathPart = "/";
								}
								xPathTab[i_xPath] = currentXPathPart;
							}
						}
						xPath = xPathTab.join(" | ");
						var xPathResult2 = doc.evaluate(xPath ,node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
						if(xPathResult2.snapshotLength > xPathResult.snapshotLength)
						{
							return xPathResult2;
						}
					}
					return xPathResult;
				};
			}(nodeDocument, node);

		var getXPathAttributeValueFunction =
			function(doc, node)
			{
				return function(xPath)
				{
					var xPathResult = doc.evaluate(xPath ,node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
					if(xPathResult.snapshotLength == 0)
					{
						return null;
					}
					var xPathAttributeNode = xPathResult.snapshotItem(0);
					if(xPathAttributeNode.nodeType!=2)
					{
						return null;
					}
					var result = xPathAttributeNode.nodeValue;
					if(grabMyBooks.isEmpty(result))
					{
						return null;
					}
					return result;
				};
			}(nodeDocument, node);

		var foundDetectionRule = null;

		var i_siteDetectionRule;
		for(i_siteDetectionRule=0;i_siteDetectionRule<grabMyBooks.siteDetectionRules.length;i_siteDetectionRule++)
		{
			if(!grabMyBooks.siteDetectionRules[i_siteDetectionRule].isUrlDetected(url))
			{
				continue;
			}
			foundDetectionRule = grabMyBooks.siteDetectionRules[i_siteDetectionRule];
			break;
		}

		var detectionXpathToUse = xPathToUseFromContext;
		if(grabMyBooks.isEmpty(detectionXpathToUse) && foundDetectionRule != null && !grabMyBooks.isEmpty(foundDetectionRule.xpath))
		{
			detectionXpathToUse = foundDetectionRule.xpath;
		}

		if(!grabMyBooks.isEmpty(detectionXpathToUse))
		{
			var xPathResult = testXPathFunction(detectionXpathToUse);
			if(xPathResult.snapshotLength>0)
			{

				handleRuleXPathResultFunction(xPathResult);
			}
		}
		if(foundDetectionRule == null)
		{
			toDoAfterRulesCheckFunction(result);
			return;
		}

		if(grabMyBooks.isEmpty(foundDetectionRule.linkInsteadOfPageUrlXpath) && grabMyBooks.isEmpty(foundDetectionRule.nextPageUrlXpath))
		{
			toDoAfterRulesCheckFunction(result);
			return;
		}
		if(!grabMyBooks.isEmpty(foundDetectionRule.linkInsteadOfPageUrlXpath))
		{
			var linkUrl = getXPathAttributeValueFunction(foundDetectionRule.linkInsteadOfPageUrlXpath);
			if(grabMyBooks.isEmpty(linkUrl))
			{
				toDoAfterRulesCheckFunction(result);
				return;
			}
			linkUrl = grabMyBooks.appendUrlPrefixIfMissing(linkUrl, url, null);
			if(url == linkUrl)
			{
				toDoAfterRulesCheckFunction(result);
				return;
			}
			addToBookContext.urlHasBeenRedirected(url, linkUrl);
			grabMyBooks.addLink(linkUrl, addToBookContext);
			return;
		}
		if(!grabMyBooks.isEmpty(foundDetectionRule.nextPageUrlXpath))
		{
			var linkUrl = getXPathAttributeValueFunction(foundDetectionRule.nextPageUrlXpath);
			if(grabMyBooks.isEmpty(linkUrl))
			{
				toDoAfterRulesCheckFunction(result);
				return;
			}
			linkUrl = grabMyBooks.appendUrlPrefixIfMissing(linkUrl, url, null);
			if(url == linkUrl)
			{
				toDoAfterRulesCheckFunction(result);
				return;
			}
			addToBookContext.addUrl(linkUrl, url);
			grabMyBooks.addLink(linkUrl, addToBookContext);
			toDoAfterRulesCheckFunction(result);
		}

	}
    catch(e)
    {
       grabMyBooks.ext.alert(e+'::'+e.lineNumber);
       return;
    }
};

grabMyBooks.findArticleNode = function(node, url)
{
	var findArticleWithMostParagraphsInfo = new grabMyBooks.FindArticleWithMostParagraphsInfo(node);
	grabMyBooks.findArticleNodeWithMostParagraphs(node, findArticleWithMostParagraphsInfo, url);
	var findArticleWithMostTextInfo = new grabMyBooks.FindArticleWithMostTextInfo(node);
	grabMyBooks.findArticleNodeWithMostText(node, findArticleWithMostTextInfo);
	var result = new Object();

	if(findArticleWithMostParagraphsInfo.paragraphCount >= grabMyBooks.minimumPCount && (findArticleWithMostParagraphsInfo.ratio>=grabMyBooks.pRatio))
	{
		result.detectionType ="paragraphs";
		result.node = findArticleWithMostParagraphsInfo.node;
	}
	else
	{
		result.detectionType ="most text";
		result.node = findArticleWithMostTextInfo.node;
	}

	return result;
};

grabMyBooks.handleArticlePage = function(url, title, base, articleNode, articleDocument, addToBookContext)
{
	try
	{
		var toDoAfterRulesCheckFunction =
			function(url, title, base, articleNode, addToBookContext)
			{
				return function(applyRulesToNodeResult)
				{
					var articleText;
					var detectionType;
					var getTextFromNodeContext;
					if(addToBookContext.grabWholePage)
					{
						detectionType ="wholePage";
						getTextFromNodeContext = new grabMyBooks.GetTextFromNodeContext(applyRulesToNodeResult.node, url);
					}
					else if(!applyRulesToNodeResult.detectedByRule)
					{
						articleNode = applyRulesToNodeResult.node;
						var findArticleNodeResult = grabMyBooks.findArticleNode(articleNode, url);
						detectionType = findArticleNodeResult.detectionType;
						getTextFromNodeContext = new grabMyBooks.GetTextFromNodeContext(findArticleNodeResult.node, url);
					}
					else
					{
						detectionType ="byRules";
						getTextFromNodeContext = new grabMyBooks.GetTextFromNodeContext(applyRulesToNodeResult.node, url);
					}
					getTextFromNodeContext.base = base;
					grabMyBooks.getTextFromNode(getTextFromNodeContext);
					articleText = getTextFromNodeContext.getResult();

					articleText = grabMyBooks.textFormat.formatText(articleText);

					var toAddArticleInfo = new grabMyBooks.ArticleInfo(url, title, articleText);

					addToBookContext.addArticleInfo(toAddArticleInfo);
				};
			}(url, title, base, articleNode, addToBookContext);

		grabMyBooks.applyRulesToNode(url, articleNode, articleDocument, addToBookContext, toDoAfterRulesCheckFunction);

	}
     catch(e)
     {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
     }
};

grabMyBooks.handleArticlePageWithHtmlParseResult = function(htmlParseResult, addToBookContext)
{
    var url = htmlParseResult.url;
    var toGrabNode = htmlParseResult.body;
    var doc = htmlParseResult.document;
    var title = htmlParseResult.title;
    var base = htmlParseResult.base;

    grabMyBooks.handleArticlePage(url, title, base, toGrabNode, doc, addToBookContext);
};

grabMyBooks.setOpacity = function(opacity, panel, endFunction)
{
	if(panel==null)
	{
		return;
	}
	panel.style.opacity=""+opacity;
	panel.style.visibility="visible";

	if(opacity>=1)
	{
		if(endFunction != null)
		{
			endFunction();
		}
		return;
	}
	var timerEvent = new Object();
	timerEvent.notify =
		function(opacity, panel, endFunction)
		{
			return function(timer)
			{
				grabMyBooks.setOpacity(opacity+0.1, panel, endFunction);
			};
		}(opacity, panel, endFunction);
	grabMyBooks.ext.initTimerWithCallback_OneShot(grabMyBooks.getTimer(), timerEvent, 50);
};


grabMyBooks.deleteSingleAddedArticle = function(e)
{
	grabMyBooks.ext.hidePopup(grabMyBooks.infoPanel);
	grabMyBooks.removeLastArticle();
};

grabMyBooks.deleteMultiAddedArticle = function(e)
{
	grabMyBooks.deleteMultiAddedArticle.deleteMultiAddedArticleActionFunction();
};

grabMyBooks.editSingleAddedArticle = function(e)
{
	grabMyBooks.ext.hidePopup(grabMyBooks.infoPanel);
	grabMyBooks.showAndEditLastArticleBook();
}
grabMyBooks.editMultiAddedArticle = function(e)
{
	grabMyBooks.editMultiAddedArticle.editMultiAddedArticleFunction();
}

grabMyBooks.selectMultiArticle = function(e)
{
	grabMyBooks.selectMultiArticle.selectMultiArticleFunction();
};

grabMyBooks.deleteMultiArticles = function(e)
{
	grabMyBooks.deleteMultiArticles.deleteMultiArticlesFunction();
};

grabMyBooks.showPreviousMultiArticle = function(e)
{
	grabMyBooks.showPreviousMultiArticle.showPreviousMultiArticleFunction();
};

grabMyBooks.showNextMultiArticle = function(e)
{
	grabMyBooks.showNextMultiArticle.showNextMultiArticleFunction();
};

grabMyBooks.showAddedArticle = function(addToBookContext)
{
	try
	{
		if(addToBookContext.nonNullAddedArticleInfos.length==0)
		{
			return;
		}

		if(addToBookContext.quietModeInfo != null)
		{
			return;
		}

		grabMyBooks.infoIFrame = document.getElementById("grabMyBooksBookPanelIframe");
		var iFrameDoc = grabMyBooks.infoIFrame.contentDocument;
		while(iFrameDoc.hasChildNodes())
		{
			iFrameDoc.removeChild(iFrameDoc.childNodes[0]);
		}

		var deleteArticleButton = document.getElementById("grabMyBooksBookPanelButtonDelete");
		deleteArticleButton.removeEventListener('click', grabMyBooks.deleteSingleAddedArticle, false);
		deleteArticleButton.removeEventListener('click', grabMyBooks.deleteMultiAddedArticle, false);

		var editArticleButton = document.getElementById("grabMyBooksBookPanelButtonEdit");
		editArticleButton.removeEventListener('click', grabMyBooks.editSingleAddedArticle, false);
		editArticleButton.removeEventListener('click', grabMyBooks.editMultiAddedArticle, false);

		var bookPanelArticleSelectBox = document.getElementById("grabMyBooksBookPanelArticleSelectBox");
		var bookPanelArticleSelect = document.getElementById("grabMyBooksBookPanelArticleSelect");
		bookPanelArticleSelect.removeEventListener(grabMyBooks.ext.getSelectChangeEvent(), grabMyBooks.selectMultiArticle, false);
		grabMyBooks.ext.emptySelectNode(bookPanelArticleSelect);
		bookPanelArticleSelect.addEventListener(grabMyBooks.ext.getSelectChangeEvent(), grabMyBooks.selectMultiArticle, false);

		var deleteArticleMultiButton = document.getElementById("grabMyBooksBookPanelButtonDeleteMulti");
		deleteArticleMultiButton.removeEventListener('click', grabMyBooks.deleteMultiArticles, false);
		deleteArticleMultiButton.addEventListener('click', grabMyBooks.deleteMultiArticles, false);

		var showPreviousArticleMultiButton = document.getElementById("grabMyBooksBookPanelMultiPrevious");
		showPreviousArticleMultiButton.removeEventListener('click', grabMyBooks.showPreviousMultiArticle, false);
		showPreviousArticleMultiButton.addEventListener('click', grabMyBooks.showPreviousMultiArticle, false);

		var nextPreviousArticleMultiButton = document.getElementById("grabMyBooksBookPanelMultiNext");
		nextPreviousArticleMultiButton.removeEventListener('click', grabMyBooks.showNextMultiArticle, false);
		nextPreviousArticleMultiButton.addEventListener('click', grabMyBooks.showNextMultiArticle, false);


		var positionNodesFunction = function(iFrameDoc)
		{
			return function()
			{
				grabMyBooks.img.replaceImgsByCanvas(iFrameDoc, iFrameDoc, null);
				var toDoWithTdFunction =
					function(tdNode, index, count)
					{
						tdNode.style.verticalAlign = "top";
					};
				grabMyBooks.xml.xPathQueryFunction("//td", iFrameDoc, iFrameDoc, toDoWithTdFunction);
				var centerOnlyImgTableElementFunction =
					function(onlyImgTdNode, index, count)
					{
						onlyImgTdNode.style.textAlign = "center";
					};
				grabMyBooks.xml.xPathQueryFunction("//tr[contains(@class,'rowSingleImg')]//td", iFrameDoc, iFrameDoc, centerOnlyImgTableElementFunction);
				var toDoWithTableElementFunction =
					function(tableNode, index, count)
					{
						tableNode.style.maxWidth = "340px";
					};
				grabMyBooks.xml.xPathQueryFunction("//td//canvas", iFrameDoc, iFrameDoc, toDoWithTableElementFunction);

				var multiArticleContentNode = iFrameDoc.getElementById("grabMyBooks.multiArticleContent");
				if(multiArticleContentNode != null)
				{
					grabMyBooks.onHtmlArticleDisplayed(multiArticleContentNode);
				}
			};
		}(iFrameDoc);


		var bodyContent;
		if(!addToBookContext.isMulti())
		{
			bodyContent = addToBookContext.addedArticleInfos[0].getHtmlContent();
			deleteArticleButton.addEventListener("click",grabMyBooks.deleteSingleAddedArticle,false);
			editArticleButton.addEventListener("click",grabMyBooks.editSingleAddedArticle,false);
			bookPanelArticleSelectBox.style.display = "none";
			//ONLY_FIREFOX
			grabMyBooks.infoIFrame.style.height = "430px";
			//ONLY_FIREFOX
		}
		else
		{
			var bookPanelArticleMultiLabel = document.getElementById("grabMyBooksBookPanelArticleMultiLabel");
			grabMyBooks.ext.setUiNodeValue(bookPanelArticleMultiLabel, addToBookContext.nonNullAddedArticleInfos.length+" articles just added:");
			bodyContent = "";
			deleteArticleButton.addEventListener("click",grabMyBooks.deleteMultiAddedArticle,false);
			editArticleButton.addEventListener("click",grabMyBooks.editMultiAddedArticle,false);
			bookPanelArticleSelectBox.style.display = "block";
			//ONLY_FIREFOX
			grabMyBooks.infoIFrame.style.height = "405px";
			//ONLY_FIREFOX
		}

		var body = grabMyBooks.ext.HTMLParser2(bodyContent).body;
		body.setAttribute("style","font-family:\"Times New Roman\", Times, serif;font-size:0.84em;line-height:1.375;");
		iFrameDoc.appendChild(body);

		positionNodesFunction();

		if(addToBookContext.isMulti())
		{
			var refreshBodyForMultiFunction =
			function(addToBookContext, bodyNode, iFrameDoc, bookPanelArticleSelect, positionNodesFunction)
			{
				return function()
				{
					var bodyContent = [];
					var firstIndexIsForThreeDots = (grabMyBooks.articles.length - addToBookContext.nonNullAddedArticleInfos.length)>0;
					if(firstIndexIsForThreeDots)
					{
						grabMyBooks.ext.appendItemToSelect(bookPanelArticleSelect, "...");
					}
					for(var i_addedArticleInfo=0; i_addedArticleInfo<addToBookContext.nonNullAddedArticleInfos.length; i_addedArticleInfo++)
					{
						grabMyBooks.ext.appendItemToSelect(bookPanelArticleSelect, grabMyBooks.ext.decodeHtml((grabMyBooks.articles.length-addToBookContext.nonNullAddedArticleInfos.length+i_addedArticleInfo+1)+"-"+grabMyBooks.replaceVariablesInText(addToBookContext.nonNullAddedArticleInfos[i_addedArticleInfo].getTitleOrDefaultTitle(20), i_addedArticleInfo)));
					}
					bodyContent.push("<span id=\"grabMyBooks.multiArticleContent\">");
					bodyContent.push(addToBookContext.nonNullAddedArticleInfos[addToBookContext.nonNullAddedArticleInfos.length-1].getHtmlContent());
					bodyContent.push("</span>");

					grabMyBooks.setNodeContentFromString(iFrameDoc, bodyNode, bodyContent.join("\n"));
					positionNodesFunction();

					var selectNode = bookPanelArticleSelect;
					var multiArticleContentNode = iFrameDoc.getElementById("grabMyBooks.multiArticleContent");
					if(firstIndexIsForThreeDots)
					{
						selectNode.selectedIndex = addToBookContext.nonNullAddedArticleInfos.length;
					}
					else
					{
						selectNode.selectedIndex = addToBookContext.nonNullAddedArticleInfos.length-1;
					}
					grabMyBooks.selectMultiArticle.selectMultiArticleFunction =
					function(iFrameDoc, selectNode, multiArticleContentNode, addToBookContext, positionNodesFunction)
					{
						return function(e)
						{
							var selectedIndex = selectNode.selectedIndex;
							var firstIndexIsForThreeDots = (grabMyBooks.articles.length - addToBookContext.nonNullAddedArticleInfos.length)>0;
							if(selectedIndex==0 && firstIndexIsForThreeDots)
							{
								grabMyBooks.ext.hidePopup(grabMyBooks.infoPanel);
								grabMyBooks.showBook();
								return;
							}
							if(firstIndexIsForThreeDots)
							{
								selectedIndex -=1;
							}
							var articleToShowContent = addToBookContext.nonNullAddedArticleInfos[selectedIndex].getHtmlContent();
							grabMyBooks.setNodeContentFromString(iFrameDoc, multiArticleContentNode, articleToShowContent);
							positionNodesFunction();
						};
					}(iFrameDoc, selectNode, multiArticleContentNode, addToBookContext, positionNodesFunction);

					grabMyBooks.showPreviousMultiArticle.showPreviousMultiArticleFunction =
					function(iFrameDoc, selectNode, addToBookContext, multiArticleContentNode, positionNodesFunction)
					{
						return function()
						{
							var firstIndexIsForThreeDots = (grabMyBooks.articles.length - addToBookContext.nonNullAddedArticleInfos.length)>0;
							var lowerIndex = 0;
							if(firstIndexIsForThreeDots)
							{
								lowerIndex = 1;
							}
							var selectedIndex = selectNode.selectedIndex;
							if(selectedIndex>lowerIndex)
							{
								var newIndexToShow = selectedIndex - 1;
								selectNode.selectedIndex = newIndexToShow;
								var articleToShowContent = addToBookContext.nonNullAddedArticleInfos[newIndexToShow - lowerIndex].getHtmlContent();
								grabMyBooks.setNodeContentFromString(iFrameDoc, multiArticleContentNode, articleToShowContent);
								positionNodesFunction();
							}
						};
					}(iFrameDoc, bookPanelArticleSelect, addToBookContext, multiArticleContentNode, positionNodesFunction);

					grabMyBooks.showNextMultiArticle.showNextMultiArticleFunction =
					function(iFrameDoc, selectNode, addToBookContext, multiArticleContentNode, positionNodesFunction)
					{
						return function()
						{
							var firstIndexIsForThreeDots = (grabMyBooks.articles.length - addToBookContext.nonNullAddedArticleInfos.length)>0;
							var higherIndex = addToBookContext.nonNullAddedArticleInfos.length - 1;
							if(firstIndexIsForThreeDots)
							{
								higherIndex += 1;
							}
							var selectedIndex = selectNode.selectedIndex;
							if(selectedIndex<higherIndex)
							{
								var newIndexToShow = selectedIndex + 1;
								selectNode.selectedIndex = newIndexToShow;
								var articleToShowContent = addToBookContext.nonNullAddedArticleInfos[newIndexToShow - higherIndex + addToBookContext.nonNullAddedArticleInfos.length - 1].getHtmlContent();
								grabMyBooks.setNodeContentFromString(iFrameDoc, multiArticleContentNode, articleToShowContent);
								positionNodesFunction();
							}
						};
					}(iFrameDoc, bookPanelArticleSelect, addToBookContext, multiArticleContentNode, positionNodesFunction);
				};
			}(addToBookContext, body, iFrameDoc, bookPanelArticleSelect, positionNodesFunction);

			refreshBodyForMultiFunction();

			grabMyBooks.deleteMultiAddedArticle.deleteMultiAddedArticleActionFunction =
			function(bookPanelArticleSelect, addToBookContext)
			{
				return function()
				{
					var selectNode = bookPanelArticleSelect;
					var selectedIndex = selectNode.selectedIndex;
					var firstIndexIsForThreeDots = (grabMyBooks.articles.length - addToBookContext.nonNullAddedArticleInfos.length)>0;
					if(firstIndexIsForThreeDots)
					{
						selectedIndex -=1;
					}
					var addedArticleCount = addToBookContext.nonNullAddedArticleInfos.length;
					addToBookContext.nonNullAddedArticleInfos.splice(selectedIndex, 1);
					var articleToRemoveFromBookIndex = grabMyBooks.articles.length - addedArticleCount + selectedIndex;
					grabMyBooks.removeArticle(articleToRemoveFromBookIndex);
					grabMyBooks.showAddedArticle(addToBookContext);
				}
			}(bookPanelArticleSelect, addToBookContext);

			grabMyBooks.deleteMultiArticles.deleteMultiArticlesFunction =
			function(addToBookContext)
			{
				return function()
				{
					grabMyBooks.ext.hidePopup(grabMyBooks.infoPanel);
					var addedArticleCount = addToBookContext.nonNullAddedArticleInfos.length;
					grabMyBooks.articles.splice(grabMyBooks.articles.length - addedArticleCount, addedArticleCount);
					grabMyBooks.fillBook();
				};
			}(addToBookContext);

			grabMyBooks.editMultiAddedArticle.editMultiAddedArticleFunction =
			function(bookPanelArticleSelect, addToBookContext)
			{
				return function()
				{
					var selectNode = bookPanelArticleSelect;
					var selectedIndex = selectNode.selectedIndex;
					var firstIndexIsForThreeDots = (grabMyBooks.articles.length - addToBookContext.nonNullAddedArticleInfos.length)>0;
					if(firstIndexIsForThreeDots)
					{
						selectedIndex -=1;
					}
					var addedArticleCount = addToBookContext.nonNullAddedArticleInfos.length;
					var articleToEditInBookIndex = grabMyBooks.articles.length - addedArticleCount + selectedIndex;
					grabMyBooks.ext.hidePopup(grabMyBooks.infoPanel);
					grabMyBooks.showAndEditArticleBook(articleToEditInBookIndex);
				};
			}(bookPanelArticleSelect, addToBookContext);

		}
		else
		{
			grabMyBooks.onHtmlArticleDisplayed(body);
		}

		grabMyBooks.infoPanel = document.getElementById("grabMyBooksBookPanel");

		var numberOfArticleLabel = document.getElementById("grabMyBooksAddedLabelNum");
		grabMyBooks.ext.setUiNodeValue(numberOfArticleLabel, "("+grabMyBooks.articles.length+" article"+(grabMyBooks.articles.length>1?"s":"")+" in book)");

		var panelDisplayEndFunction =
			function()
			{
				grabMyBooks.infoIFrame.style.overflow = "auto";
			};

		grabMyBooks.showPanelOnScreen(grabMyBooks.infoPanel, 410, 510, panelDisplayEndFunction);
	}
     catch(e)
     {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
     }
};

grabMyBooks.showPanelOnScreen = function(panel, panelWidth, panelHeight, endFunction)
{
	panel.style.visibility="hidden";
	var timerEvent = new Object();
	timerEvent.notify = function(timer)
	{
		grabMyBooks.setOpacity(0.1, panel, endFunction);
	};
	var mainWindow = grabMyBooks.ext.getMainWindow();
	var infoPanelWidth = panelWidth;
	var infoPanelHeight = panelHeight;
	var infoPanelXPosition = mainWindow.clientWidth;
	var infoPanelYPosition = mainWindow.clientHeight;
	grabMyBooks.ext.initTimerWithCallback_OneShot(grabMyBooks.getTimer(), timerEvent, 50);
	infoPanelXPosition -= infoPanelWidth;
	infoPanelYPosition -= infoPanelHeight;
	if(mainWindow.clientWidth < infoPanelWidth)
	{
		infoPanelXPosition = 0;
	}
	if(mainWindow.clientHeight < infoPanelHeight)
	{
		infoPanelYPosition = 0;
	}
	grabMyBooks.ext.openPopup(panel, mainWindow, infoPanelXPosition, infoPanelYPosition);
};

grabMyBooks.SmallInfo = new Object();
grabMyBooks.SmallInfo.state = new Object();
grabMyBooks.SmallInfo.state.initialized = false;
grabMyBooks.SmallInfo.hidePanelFunction =
		function()
		{
			grabMyBooks.ext.hidePopup(grabMyBooks.SmallInfo.panel);
		};
grabMyBooks.SmallInfo.showOrHideButton = function(button, show)
{
	button.style.display=show?"inline":"none";
};

grabMyBooks.SmallInfo.state.reset = function()
{
	grabMyBooks.SmallInfo.state.buttonOkFunction = grabMyBooks.SmallInfo.hidePanelFunction;
	grabMyBooks.SmallInfo.state.buttonCancelFunction = grabMyBooks.SmallInfo.hidePanelFunction;
	grabMyBooks.SmallInfo.state.buttonYesFunction = null;
	grabMyBooks.SmallInfo.state.buttonNoFunction = grabMyBooks.SmallInfo.hidePanelFunction;
	grabMyBooks.SmallInfo.state.buttonDeleteFunction = null;
	grabMyBooks.SmallInfo.state.showButtonOk = true;
	grabMyBooks.SmallInfo.state.showButtonCancel = false;
	grabMyBooks.SmallInfo.state.showButtonYes = false;
	grabMyBooks.SmallInfo.state.showButtonNo = false;
	grabMyBooks.SmallInfo.state.showButtonDelete = false;
	grabMyBooks.SmallInfo.state.iconType = "OK";
};
grabMyBooks.SmallInfo.init = function()
{
	grabMyBooks.SmallInfo.state.initialized = true;
	grabMyBooks.SmallInfo.panel = document.getElementById("grabMyBooksSmallInfoPanel");
	grabMyBooks.SmallInfo.buttonOk = document.getElementById("grabMyBooksBookSmallInfoPanelButtonOk");
	grabMyBooks.SmallInfo.buttonCancel = document.getElementById("grabMyBooksBookSmallInfoPanelButtonCancel");
	grabMyBooks.SmallInfo.buttonYes = document.getElementById("grabMyBooksBookSmallInfoPanelButtonYes");
	grabMyBooks.SmallInfo.buttonNo = document.getElementById("grabMyBooksBookSmallInfoPanelButtonNo");
	grabMyBooks.SmallInfo.buttonDelete = document.getElementById("grabMyBooksBookSmallInfoPanelButtonDelete");
	grabMyBooks.SmallInfo.icon = document.getElementById("grabMyBooksSmallInfoPanelIcon");

	grabMyBooks.SmallInfo.buttonOk.addEventListener("click",
		function(e)
		{
			grabMyBooks.SmallInfo.hidePanelFunction();
			if(grabMyBooks.SmallInfo.state.buttonOkFunction != null)
			{
				grabMyBooks.SmallInfo.state.buttonOkFunction();
			}
		}
		,false);
	grabMyBooks.SmallInfo.buttonCancel.addEventListener("click",
		function(e)
		{
			grabMyBooks.SmallInfo.hidePanelFunction();
			if(grabMyBooks.SmallInfo.state.buttonCancelFunction != null)
			{
				grabMyBooks.SmallInfo.state.buttonCancelFunction();
			}
		}
		,false);
	grabMyBooks.SmallInfo.buttonYes.addEventListener("click",
		function(e)
		{
			grabMyBooks.SmallInfo.hidePanelFunction();
			if(grabMyBooks.SmallInfo.state.buttonYesFunction != null)
			{
				grabMyBooks.SmallInfo.state.buttonYesFunction();
			}
		}
		,false);
	grabMyBooks.SmallInfo.buttonNo.addEventListener("click",
		function(e)
		{
			grabMyBooks.SmallInfo.hidePanelFunction();
			if(grabMyBooks.SmallInfo.state.buttonNoFunction != null)
			{
				grabMyBooks.SmallInfo.state.buttonNoFunction();
			}
		}
		,false);
	grabMyBooks.SmallInfo.buttonDelete.addEventListener("click",
		function(e)
		{
			grabMyBooks.SmallInfo.hidePanelFunction();
			if(grabMyBooks.SmallInfo.state.buttonDeleteFunction != null)
			{
				grabMyBooks.SmallInfo.state.buttonDeleteFunction();
			}
		}
		,false);
};

grabMyBooks.SmallInfo.showSmallInfoPanel = function(htmlContent, prepareSmallInfoStateFunction)
{
	if(!grabMyBooks.SmallInfo.state.initialized)
	{
		grabMyBooks.SmallInfo.init();
	}

	grabMyBooks.SmallInfo.state.reset();

	if(prepareSmallInfoStateFunction != null)
	{
		prepareSmallInfoStateFunction(grabMyBooks.SmallInfo.state);
	}

	grabMyBooks.SmallInfo.showOrHideButton(grabMyBooks.SmallInfo.buttonOk, grabMyBooks.SmallInfo.state.showButtonOk);
	grabMyBooks.SmallInfo.showOrHideButton(grabMyBooks.SmallInfo.buttonCancel, grabMyBooks.SmallInfo.state.showButtonCancel);
	grabMyBooks.SmallInfo.showOrHideButton(grabMyBooks.SmallInfo.buttonYes, grabMyBooks.SmallInfo.state.showButtonYes);
	grabMyBooks.SmallInfo.showOrHideButton(grabMyBooks.SmallInfo.buttonNo, grabMyBooks.SmallInfo.state.showButtonNo);
	grabMyBooks.SmallInfo.showOrHideButton(grabMyBooks.SmallInfo.buttonDelete, grabMyBooks.SmallInfo.state.showButtonDelete);

	var iconSrc = "chrome://grabMyBooks/content/icons/bookReader.png";
	if(grabMyBooks.SmallInfo.state.iconType == "WARN")
	{
		iconSrc = "chrome://grabMyBooks/content/icons/bookReaderWarn.png";
	}
	else if(grabMyBooks.SmallInfo.state.iconType == "ERROR")
	{
		iconSrc = "chrome://grabMyBooks/content/icons/bookReaderError.png";
	}
	grabMyBooks.SmallInfo.icon.src=iconSrc;

	var htmlContent = htmlContent;

	var smallInfoPanelIFrame = document.getElementById("grabMyBooksSmallInfoPanelIframe");
	var smallInfoPanelIFrameDocument = smallInfoPanelIFrame.contentDocument;
	while(smallInfoPanelIFrameDocument.hasChildNodes())
	{
		smallInfoPanelIFrameDocument.removeChild(smallInfoPanelIFrameDocument.childNodes[0]);
	}
	var smallInfoPanelIFrameHtml = smallInfoPanelIFrameDocument.createElement("html");
	grabMyBooks.setNodeContentFromString(smallInfoPanelIFrameDocument, smallInfoPanelIFrameHtml, htmlContent);
	smallInfoPanelIFrameHtml.setAttribute("style","font-family:\"Times New Roman\", Times, serif;font-size:0.84em;line-height:1.375;");
	smallInfoPanelIFrameDocument.appendChild(smallInfoPanelIFrameHtml);

	var smallPanelDisplayEndFunction =
		function(smallInfoPanelIFrame)
		{
			return function()
			{
				smallInfoPanelIFrame.style.overflow = "auto";
			};
		}(smallInfoPanelIFrame);

	grabMyBooks.showPanelOnScreen(grabMyBooks.SmallInfo.panel, 310, 210, smallPanelDisplayEndFunction);
};


grabMyBooks.inValidNodeNames = ["SCRIPT","HEAD","STYLE","IFRAME","NOSCRIPT","NOFRAMES"];
grabMyBooks.isNodeValid = function(node)
{
	if(node.nodeType==3)
	{
		return true;
	}
	var nodeName = node.nodeName.toUpperCase();
	var i_inValidNodeNames;
	for(i_inValidNodeNames=0; i_inValidNodeNames<grabMyBooks.inValidNodeNames.length; i_inValidNodeNames++)
	{
		if(nodeName == grabMyBooks.inValidNodeNames[i_inValidNodeNames])
		{
			return false;
		}
	}
	if(grabMyBooks.zone.skipNode(node))
	{
		return false;
	}
	return true;
};

grabMyBooks.hasNodeParent = function(node, nodeType)
{
	var currentNode = node.parentNode;
	var currentNodeName;
	while(currentNode != null)
	{
		currentNodeName = currentNode.localName;
		if(!grabMyBooks.isEmpty(currentNodeName) && (currentNodeName.toUpperCase()==nodeType.toUpperCase()))
		{
			return true;
		}
		currentNode = currentNode.parentNode;
	}
	return false;
};
grabMyBooks.hasNodeParentClass = function(node, className)
{
	var currentNode = node.parentNode;
	var currentNodeClassName;
	while(currentNode != null)
	{
		if(currentNode.className!=null)
		{
			if(currentNode.className.indexOf(className)!=-1)
			{
				return true;
			}
		}
		currentNode = currentNode.parentNode;
	}
	return false;
};

grabMyBooks.inValidVisibleNode = function(node)
{
	if(grabMyBooks.options.grabHidden)
	{
		return true;
	}
	if(grabMyBooks.isEmptyObject(node.style))
	{
		return true;
	}
	if(node.style.display == "none")
	{
		return false;
	}
	if(node.style.visibility == "hidden")
	{
		return false;
	}
	return true;
};

grabMyBooks.isCharCodeToEscape = function(charCode)
{
	if(charCode==34 || charCode==38 || charCode==39 || charCode==60 || charCode==62)
	{
		return true;
	}
	if(charCode>=128 && charCode<=855)
	{
		return true;
	}
	if(charCode>=913 && charCode<=969)
	{
		return true;
	}
	if(charCode>=1040 && charCode<=1103)
	{
		return true;
	}
	if(charCode==8211 || charCode==8212)
	{
		return true;
	}
	if(charCode>=8216 && charCode<=8218)
	{
		return true;
	}
	if(charCode>=8220 && charCode<=8222)
	{
		return true;
	}
	if(charCode>=8224 && charCode<=8226)
	{
		return true;
	}
	if(charCode==8230 || charCode==8240 || charCode==8364 || charCode==8482)
	{
		return true;
	}
	return false;
};

grabMyBooks.escapeTagsExtended = function(text)
{
	var result;
	var resultTab = [];
	if(text==null)
	{
		text="";
	}
	var testLength = text.length;
	var currentChar;
	var currentCharCode;
	for(var i_char=0; i_char<testLength; i_char++)
	{
		currentChar = text.charAt(i_char);
		currentCharCode = text.charCodeAt(i_char);
		if(grabMyBooks.isCharCodeToEscape(currentCharCode))
		{
			resultTab.push("&#"+currentCharCode+";");
			continue;
		}
		resultTab.push(currentChar);
	}
	result = resultTab.join("");
	return result;
};

grabMyBooks.truncate = function(text, maxLength, endText)
{
	if(text.length<=maxLength)
	{
		return text;
	}
	var result = text.substring(0, maxLength)+endText;
	return result;
};

grabMyBooks.UnEscapeInfo = function(name, unEscapedValue)
{
	this.name = name;
	this.unEscapedValue = unEscapedValue;
};
grabMyBooks.unEscapeInfos = null;
grabMyBooks.getUnEscapeInfos = function()
{
	if(grabMyBooks.unEscapeInfos==null)
	{
		var unEscapeInfos=[];
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("quot",34));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("nbsp",160));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("amp",38));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("gt",62));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("lt",60));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("euro",8364));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("pound",163));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("yen",165));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("aacute",225));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("agrave",224));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("acirc",226));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("aring",229));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("atilde",227));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("auml",228));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("aelig",230));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("ccedil",231));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("eacute",233));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("egrave",232));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("ecirc",234));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("euml",235));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("iacute",237));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("igrave",236));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("icirc",238));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("iuml",239));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("ntilde",241));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("oacute",243));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("ograve",242));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("ocirc",244));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("oslash",248));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("otilde",245));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("ouml",246));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("szlig",223));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("uacute",250));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("ugrave",249));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("ucirc",251));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("uuml",252));
		unEscapeInfos.push(new grabMyBooks.UnEscapeInfo("yuml",255));
		grabMyBooks.unEscapeInfos=unEscapeInfos;
	}
	return grabMyBooks.unEscapeInfos;
};
grabMyBooks.unEscapeTagsExtended = function(text)
{
	var resultHolder = new Object();
	resultHolder.result = text;

	var regExp = new RegExp("\\&\\#(\\d+)\\;", "g");
	var regexResult;
	var charCodes = [];
	var currentCharCode;
	var currentCharCodeObject;
	while( (regexResult = regExp.exec(text))!=null )
	{
		currentCharCode = parseInt(regexResult[1], 10);
		if(!grabMyBooks.isCharCodeToEscape(currentCharCode))
		{
			continue;
		}
		if(grabMyBooks.tabGet(charCodes, currentCharCode)!=null)
		{
			continue;
		}
		currentCharCodeObject = new Object();
		currentCharCodeObject.code = currentCharCode;
		currentCharCodeObject.identify =
			function(code)
			{
				return (this.code == code);
			};
		charCodes.push(currentCharCodeObject);
	}
	var currentReplaceBy;
	var replaceCodeFunction =
		function(resultHolder)
		{
			return function(charCodeObject, index, count)
			{
				var regExp = new RegExp("\\&\\#"+charCodeObject.code+"\\;", "g");
				resultHolder.result = resultHolder.result.replace(regExp, String.fromCharCode(charCodeObject.code));
			};
		}(resultHolder);
	grabMyBooks.tabDo(charCodes, replaceCodeFunction);

	var otherToUnescapeInfos = grabMyBooks.getUnEscapeInfos();
	var replaceOtherToUnescapeFunction =
		function(resultHolder)
		{
			return function(unEscapeInfo, index, count)
			{
				var regExp = new RegExp("\\&"+unEscapeInfo.name+"\\;", "g");
				resultHolder.result = resultHolder.result.replace(regExp, String.fromCharCode(unEscapeInfo.unEscapedValue));
			};
		}(resultHolder);
	grabMyBooks.tabDo(otherToUnescapeInfos, replaceOtherToUnescapeFunction);

	return resultHolder.result;
};

grabMyBooks.GetTextFromNodeContext = function(node, url)
{
	this.node = node;
	this.url = url;
	this.loadingBookInfo = null;
	this.inParagraph = false;
	this.inPre = false;
	this.inCode = false;
	this.inBold = false;
	this.inItalic = false;
	this.inStrike = false;
	this.inUnderline = false;
	this.inSub = false;
	this.inSup = false;
	this.inSmall = false;
	this.inLink = false;
	this.currentHrefImgSrc = null;
	this.singletonHolder = null;
	this.base = null;
	this.imgLinkFound = false;
	this.tableSeen = false;
	this.spanInfos = [];
	this.resultTab = [];
	this.write = function(text)
	{
		this.resultTab.push(text);
	};
	this.writeAt = function(text, index)
	{
		this.resultTab[index] = text;
	};
	this.getResult = function()
	{
		return this.resultTab.join("");
	};
};

grabMyBooks.getTextPrefixForNode = function(nodeName)
{
	if(nodeName=="P" || nodeName=="DL" || nodeName=="UL" || nodeName=="OL" || nodeName=="DIR" || nodeName=="MENU" || nodeName=="TABLE" || nodeName=="PRE" || /^H\d$/.test(nodeName))
	{
		return "\n\n";
	}
	return null;
};

grabMyBooks.getTextSuffixForNode = function(nodeName, node)
{
	if(nodeName=="P" || nodeName=="DL" || nodeName=="UL" || nodeName=="OL" || nodeName=="DIR" || nodeName=="MENU" || nodeName=="TABLE" || nodeName=="PRE" || /^H\d$/.test(nodeName))
	{
		return "\n\n";
	}
	else if(nodeName=="TR" || nodeName=="DD" || nodeName=="LI")
	{
		return "\n";
	}
	else if(nodeName=="SPAN")
	{
		return null;
	}
	else
	{
		var extendedSuffix = grabMyBooks.getTextSuffixForNodeExtended(nodeName, node);
		if(extendedSuffix != null)
		{
			return extendedSuffix;
		}
	}
	return " ";
};

grabMyBooks.getTextSuffixForNodeExtended = function(nodeName, node)
{
	if(nodeName!="DIV")
	{
		return null;
	}
	if(grabMyBooks.isEmptyObject(node.className))
	{
		return null;
	}
	if(grabMyBooks.isEmpty(node.className))
	{
		return null;
	}
	if(node.className.trim().toLowerCase().indexOf("line")==-1)
	{
		return null;
	}
	var childNodeCount = node.childNodes.length;
	var currentChild;
	for(var i_child=0; i_child<3 && i_child<childNodeCount; i_child++)
	{
		currentChild = node.childNodes[i_child];
		if(grabMyBooks.isEmptyObject(currentChild.localName))
		{
			continue;
		}
		if(grabMyBooks.isEmpty(currentChild.localName))
		{
			continue;
		}
		if(currentChild.localName.toUpperCase()=="CODE")
		{
			return "\n";
		}
	}
	return null;
};

grabMyBooks.getTextFromNode = function(getTextFromNodeContext)
{
	if(getTextFromNodeContext.singletonHolder == null)
	{
		getTextFromNodeContext.singletonHolder = new Object();
		getTextFromNodeContext.singletonHolder.usedHrefImgSrcs = [];
	}

	var node = getTextFromNodeContext.node;
	var url = getTextFromNodeContext.url;
	var nodeLocalName = "";
	if(node.localName!=null)
	{
		nodeLocalName = node.localName.toUpperCase();
	}

	if(!grabMyBooks.inValidVisibleNode(node))
	{
		return;
	}

	if(nodeLocalName=="BR")
	{
		getTextFromNodeContext.write("\n");
		return;
	}

	var inTable = (grabMyBooks.options.grabTables && nodeLocalName=="TABLE");

	if(inTable)
	{
		var tdCountHolder = new Object();
		tdCountHolder.count = 0;
		var countTdFunction =
			function(tdCountHolder)
			{
				return function(tdNode, index, count)
				{
					tdCountHolder.count += 1;
				};
			}(tdCountHolder);
		grabMyBooks.xml.xPathQueryFunction("./tr/td | ./tbody/tr/td", node.ownerDocument, node, countTdFunction);
		if(tdCountHolder.count < 2)
		{
			inTable = false;
		}
	}

	var isTr = (grabMyBooks.options.grabTables && nodeLocalName=="TR");
	var isTd = (grabMyBooks.options.grabTables && (nodeLocalName=="TD" || nodeLocalName=="TH"));

	var span=null;
	var isColSpan = true;
	if(isTd && node.getAttribute!=undefined)
	{
		var colSpanValue = node.getAttribute("colspan");
		var rowSpanValue = node.getAttribute("rowspan");
		if(!grabMyBooks.isEmpty(colSpanValue))
		{
			span = colSpanValue.trim();
		}
		else if(!grabMyBooks.isEmpty(rowSpanValue))
		{
			span = rowSpanValue.trim();
			isColSpan = false;
		}
	}

	var isLink = (nodeLocalName=="A" && node.getAttribute!=undefined);
	var linkValue = null;
	var inLink = false;
	var alreadyInLink = getTextFromNodeContext.inLink;
	if(isLink && !alreadyInLink)
	{
		linkValue = node.getAttribute("href");
		if(linkValue != null)
		{
			linkValue = linkValue.trim();
		}
		inLink = true;
	}

	if(grabMyBooks.options.grabImages && grabMyBooks.options.grabTargetImages && isLink)
	{
		var nodeHref = linkValue;
		if(grabMyBooks.img.isImgFileNameAccepted(nodeHref, true))
		{
			getTextFromNodeContext.currentHrefImgSrc = nodeHref;
			getTextFromNodeContext.imgLinkFound = true;
		}
	}

	var isNodeInputImage = ((nodeLocalName=="INPUT") && (node.getAttribute("type")=="image") && (!grabMyBooks.isEmpty(node.getAttribute("src"))));
	var isNodeDirectImage = (nodeLocalName=="IMG");
	var isNodeImage = (isNodeDirectImage || isNodeInputImage);

	if(grabMyBooks.options.grabImages && isNodeImage && grabMyBooks.img.isImgNodeAccepted(node))
	{
		var nodeImgSrc = grabMyBooks.img.findSrcValueInImgNode(node);

		var imgSrc = null;
		if(!grabMyBooks.isEmpty(getTextFromNodeContext.currentHrefImgSrc) && !grabMyBooks.isStringInTab(getTextFromNodeContext.currentHrefImgSrc, getTextFromNodeContext.singletonHolder.usedHrefImgSrcs))
		{
			imgSrc = getTextFromNodeContext.currentHrefImgSrc;
			var fullImgSrc = grabMyBooks.appendUrlPrefixIfMissing(imgSrc, url, getTextFromNodeContext.base);
			var fullNodeImgSrc = grabMyBooks.appendUrlPrefixIfMissing(nodeImgSrc, url, getTextFromNodeContext.base);
			var backupImg = new grabMyBooks.img.BackupImg(fullImgSrc, fullNodeImgSrc);
			grabMyBooks.img.backupImgs.push(backupImg);
			getTextFromNodeContext.singletonHolder.usedHrefImgSrcs.push(getTextFromNodeContext.currentHrefImgSrc);
		}
		else
		{
			imgSrc = nodeImgSrc;
		}

		if(!grabMyBooks.isEmpty(imgSrc) && imgSrc.indexOf("data:")!=0 && imgSrc.indexOf("DATA:")!=0)
		{
			imgSrc = imgSrc.replace(/\n{1,}/g,"");
			imgSrc = imgSrc.replace(/\{/g,"%7B").replace(/\}/g,"%7D");
			var imgResultUrl;
			if(getTextFromNodeContext.loadingBookInfo==null)
			{
				imgResultUrl = grabMyBooks.appendUrlPrefixIfMissing(imgSrc, url, getTextFromNodeContext.base);
			}
			else
			{
				var imgName = grabMyBooks.img.getImgNameFromPath(imgSrc);
				imgResultUrl = grabMyBooks.img.generateImgUrlForBookLoad(imgName, getTextFromNodeContext.loadingBookInfo.bookId);
			}
			getTextFromNodeContext.write("$IMG{"+imgResultUrl+"}");
			return;
		}
	}


	if(node.nodeType==3)
	{
		var keepLineBreaks = (getTextFromNodeContext.inPre || getTextFromNodeContext.inCode);
		var nodeValue = node.nodeValue;
		if(nodeValue.length>0 && !/^\s*$/.test(nodeValue))
		{
			if(!keepLineBreaks && nodeValue.charAt(0)=='\n')
			{
				nodeValue = nodeValue.substr(1);
			}
			if(!keepLineBreaks && nodeValue.charAt(nodeValue.length-1)=='\n')
			{
				nodeValue = nodeValue.substr(0, nodeValue.length-1) + " ";
			}
			if(!keepLineBreaks)
			{
				nodeValue = nodeValue.replace(/\n{1,}/g," ");
			}
			getTextFromNodeContext.write(nodeValue);
			return;
		}
			else if((getTextFromNodeContext.inPre || getTextFromNodeContext.inCode) && nodeValue.length>0 && /^\s*$/.test(nodeValue))
			{	//whitespace only text node in pre/code: indentation, tabs and spaces between tags must be kept as they are.
				getTextFromNodeContext.write(nodeValue);
				return;
			}
	}

	var nodePrefix = grabMyBooks.getTextPrefixForNode(nodeLocalName);
	if(nodePrefix != null)
	{
		getTextFromNodeContext.write(nodePrefix);
	}

	var alreadyInHeadingH1Node = getTextFromNodeContext.inHeadingH1;
	var isNodeHeadingH1 = null;
	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH1Node)
	{
		isNodeHeadingH1 = grabMyBooks.style.isNodeHeadingH1(nodeLocalName);
		if(isNodeHeadingH1)
		{
			getTextFromNodeContext.write("$h1{");
		}
	}

	var alreadyInHeadingH2Node = getTextFromNodeContext.inHeadingH2;
	var isNodeHeadingH2 = null;
	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH2Node)
	{
		isNodeHeadingH2 = grabMyBooks.style.isNodeHeadingH2(nodeLocalName);
		if(isNodeHeadingH2)
		{
			getTextFromNodeContext.write("$h2{");
		}
	}

	var alreadyInHeadingH3Node = getTextFromNodeContext.inHeadingH3;
	var isNodeHeadingH3 = null;
	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH3Node)
	{
		isNodeHeadingH3 = grabMyBooks.style.isNodeHeadingH3(nodeLocalName);
		if(isNodeHeadingH3)
		{
			getTextFromNodeContext.write("$h3{");
		}
	}

	var alreadyInHeadingH4Node = getTextFromNodeContext.inHeadingH4;
	var isNodeHeadingH4 = null;
	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH4Node)
	{
		isNodeHeadingH4 = grabMyBooks.style.isNodeHeadingH4(nodeLocalName);
		if(isNodeHeadingH4)
		{
			getTextFromNodeContext.write("$h4{");
		}
	}

	var alreadyInHeadingH5Node = getTextFromNodeContext.inHeadingH5;
	var isNodeHeadingH5 = null;
	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH5Node)
	{
		isNodeHeadingH5 = grabMyBooks.style.isNodeHeadingH5(nodeLocalName);
		if(isNodeHeadingH5)
		{
			getTextFromNodeContext.write("$h5{");
		}
	}

	var alreadyInHeadingH6Node = getTextFromNodeContext.inHeadingH6;
	var isNodeHeadingH6 = null;
	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH6Node)
	{
		isNodeHeadingH6 = grabMyBooks.style.isNodeHeadingH6(nodeLocalName);
		if(isNodeHeadingH6)
		{
			getTextFromNodeContext.write("$h6{");
		}
	}

	var alreadyInULNode = getTextFromNodeContext.inUL;
	var isNodeUL = null;
	if(grabMyBooks.options.grabStyle && !alreadyInULNode)
	{
		isNodeUL = grabMyBooks.style.isNodeUl(nodeLocalName);
		if(isNodeUL)
		{
			getTextFromNodeContext.write("$ul{");
		}
	}

	var alreadyInOLNode = getTextFromNodeContext.inOL;
	var isNodeOL = null;
	if(grabMyBooks.options.grabStyle && !alreadyInOLNode)
	{
		isNodeOL = grabMyBooks.style.isNodeOl(nodeLocalName);
		if(isNodeOL)
		{
			getTextFromNodeContext.write("$ol{");
		}
	}

	var alreadyInLINode = getTextFromNodeContext.inLI;
	var isNodeLI = null;
	if(grabMyBooks.options.grabStyle && !alreadyInLINode)
	{
		isNodeLI = grabMyBooks.style.isNodeLi(nodeLocalName);
		if(isNodeLI)
		{
			getTextFromNodeContext.write("$li{");
		}
	}

	var alreadyInCodeNode = getTextFromNodeContext.inCode;
	var isNodeCode = null;
	if(grabMyBooks.options.grabStyle && !alreadyInCodeNode)
	{
		isNodeCode = grabMyBooks.style.isNodeCode(nodeLocalName);
		if(isNodeCode)
		{
			getTextFromNodeContext.write("$c{");
		}
	}

    var alreadyInPreNode = getTextFromNodeContext.inPre;
	var isNodePre = null;
	if(grabMyBooks.options.grabStyle && !alreadyInPreNode)
	{
		isNodePre = grabMyBooks.style.isNodePre(nodeLocalName);
		if(isNodePre)
		{
			getTextFromNodeContext.write("$pre{");
		}
	}

	var alreadyInBoldNode = getTextFromNodeContext.inBold;
	var isNodeBold = null;
	if(grabMyBooks.options.grabStyle && !alreadyInBoldNode)
	{
		isNodeBold = grabMyBooks.style.isNodeBold(nodeLocalName);
		if(isNodeBold)
		{
			getTextFromNodeContext.write("$b{");
		}
	}

	var alreadyInItalicNode = getTextFromNodeContext.inItalic;
	var isNodeItalic = null;
	if(grabMyBooks.options.grabStyle && !alreadyInItalicNode)
	{
		isNodeItalic = grabMyBooks.style.isNodeItalic(nodeLocalName);
		if(isNodeItalic)
		{
			getTextFromNodeContext.write("$i{");
		}
	}

	var alreadyInBquoteNode = getTextFromNodeContext.inBquote;
	var isNodeBquote = null;
	if(grabMyBooks.options.grabStyle && !alreadyInBquoteNode)
	{
		isNodeBquote = grabMyBooks.style.isNodeBquote(nodeLocalName);
		if(isNodeBquote)
		{
			getTextFromNodeContext.write("$blockquote{");
		}
	}

	var alreadyInCiteNode = getTextFromNodeContext.inCite;
	var isNodeCite = null;
	if(grabMyBooks.options.grabStyle && !alreadyInCiteNode)
	{
		isNodeCite = grabMyBooks.style.isNodeCite(nodeLocalName);
		if(isNodeCite)
		{
			getTextFromNodeContext.write("$cite{");
		}
	}

	var alreadyInStrikeNode = getTextFromNodeContext.inStrike;
	var isNodeStrike = null;
	if(grabMyBooks.options.grabStyle && !alreadyInStrikeNode)
	{
		isNodeStrike = grabMyBooks.style.isNodeStrike(nodeLocalName);
		isNodeStrike = isNodeStrike || grabMyBooks.style.getNodeStyle(node).indexOf("line-through")!=-1;
		if(isNodeStrike)
		{
			getTextFromNodeContext.write("$k{");
		}
	}

	var alreadyInUnderlineNode = getTextFromNodeContext.inUnderline;
	var isNodeUnderline = null;
	if(grabMyBooks.options.grabStyle && !alreadyInUnderlineNode)
	{
		isNodeUnderline = grabMyBooks.style.isNodeUnderline(nodeLocalName);
		isNodeUnderline = isNodeUnderline || grabMyBooks.style.getNodeStyle(node).indexOf("underline")!=-1
		if(isNodeUnderline)
		{
			getTextFromNodeContext.write("$u{");
		}
	}

	var alreadyInSubNode = getTextFromNodeContext.inSub;
	var isNodeSub = null;
	if(grabMyBooks.options.grabStyle && !alreadyInSubNode)
	{
		isNodeSub = grabMyBooks.style.isNodeSub(nodeLocalName);
		if(isNodeSub)
		{
			getTextFromNodeContext.write("$q{");
		}
	}

	var alreadyInSupNode = getTextFromNodeContext.inSup;
	var isNodeSup = null;
	if(grabMyBooks.options.grabStyle && !alreadyInSupNode)
	{
		isNodeSup = grabMyBooks.style.isNodeSup(nodeLocalName);
		if(isNodeSup)
		{
			getTextFromNodeContext.write("$d{");
		}
	}

	var alreadyInSmallNode = getTextFromNodeContext.inSmall;
	var isNodeSmall = null;
	if(grabMyBooks.options.grabStyle && !alreadyInSmallNode)
	{
		isNodeSmall = grabMyBooks.style.isNodeSmall(nodeLocalName);
		if(isNodeSmall)
		{
			getTextFromNodeContext.write("$s{");
		}
	}



	//case of we want to add stuff before the children result later.
	getTextFromNodeContext.write("");
	var resultTabReservedIndex = getTextFromNodeContext.resultTab.length-1;

	var childCount = node.childNodes.length;
	var index;
	var currentChildNode;
	var currentGetTextFromNodeContext;
	for (index=0;index<childCount;index++)
	{
		currentChildNode = node.childNodes[index];
		if(!grabMyBooks.isNodeValid(currentChildNode))
		{
			continue;
		}
		currentGetTextFromNodeContext = new grabMyBooks.GetTextFromNodeContext(currentChildNode, url);
		currentGetTextFromNodeContext.loadingBookInfo = getTextFromNodeContext.loadingBookInfo;
		currentGetTextFromNodeContext.currentHrefImgSrc = getTextFromNodeContext.currentHrefImgSrc;
		currentGetTextFromNodeContext.singletonHolder = getTextFromNodeContext.singletonHolder;
		currentGetTextFromNodeContext.inParagraph = (getTextFromNodeContext.inParagraph || (nodeLocalName=="P"));
		currentGetTextFromNodeContext.inPre = (getTextFromNodeContext.inPre || nodeLocalName=="PRE" || alreadyInPreNode || isNodePre);
		currentGetTextFromNodeContext.inCode = (getTextFromNodeContext.inCode || nodeLocalName=="CODE" || alreadyInCodeNode || isNodeCode);

		currentGetTextFromNodeContext.inBold = alreadyInBoldNode || isNodeBold;
		currentGetTextFromNodeContext.inItalic = alreadyInItalicNode || isNodeItalic;
		currentGetTextFromNodeContext.inStrike = alreadyInStrikeNode || isNodeStrike;
		currentGetTextFromNodeContext.inUnderline = alreadyInUnderlineNode || isNodeUnderline;
		currentGetTextFromNodeContext.inSub = alreadyInSubNode || isNodeSub;
		currentGetTextFromNodeContext.inSup = alreadyInSupNode || isNodeSup;
		currentGetTextFromNodeContext.inSmall = alreadyInSmallNode || isNodeSmall;
		currentGetTextFromNodeContext.inBquote = alreadyInBquoteNode || isNodeBquote;
		currentGetTextFromNodeContext.inCite = alreadyInCiteNode || isNodeCite;
		currentGetTextFromNodeContext.inHeadingH1 = alreadyInHeadingH1Node || isNodeHeadingH1;
		currentGetTextFromNodeContext.inHeadingH2 = alreadyInHeadingH2Node || isNodeHeadingH2;
		currentGetTextFromNodeContext.inHeadingH3 = alreadyInHeadingH3Node || isNodeHeadingH3;
		currentGetTextFromNodeContext.inHeadingH4 = alreadyInHeadingH4Node || isNodeHeadingH4;
		currentGetTextFromNodeContext.inHeadingH5 = alreadyInHeadingH5Node || isNodeHeadingH5;
		currentGetTextFromNodeContext.inHeadingH6 = alreadyInHeadingH6Node || isNodeHeadingH6;
		currentGetTextFromNodeContext.inUL = alreadyInULNode || isNodeUL;
		currentGetTextFromNodeContext.inLI = alreadyInLINode || isNodeLI;
		currentGetTextFromNodeContext.inOL = alreadyInOLNode || isNodeOL;	
		currentGetTextFromNodeContext.inLink = alreadyInLink || inLink;

		currentGetTextFromNodeContext.base = getTextFromNodeContext.base;

		currentGetTextFromNodeContext.resultTab = getTextFromNodeContext.resultTab;

		grabMyBooks.getTextFromNode(currentGetTextFromNodeContext);

		if(currentGetTextFromNodeContext.imgLinkFound)
		{
			getTextFromNodeContext.imgLinkFound = true;
		}

		if(currentGetTextFromNodeContext.tableSeen)
		{
			getTextFromNodeContext.tableSeen = true;
		}
		else
		{
			grabMyBooks.tabCopy2(getTextFromNodeContext.spanInfos, currentGetTextFromNodeContext.spanInfos);
		}
	}

	if(getTextFromNodeContext.tableSeen)
	{
		var removeSpanFunction =
			function(getTextFromNodeContext)
			{
				return function(spanInfo, index, count)
				{
					 getTextFromNodeContext.resultTab[spanInfo.index] = "$td{";
				};
			}(getTextFromNodeContext);
		grabMyBooks.tabDo(getTextFromNodeContext.spanInfos, removeSpanFunction);
		getTextFromNodeContext.spanInfos = [];
	}

	var addLink = (grabMyBooks.options.grabLinks && !grabMyBooks.isEmpty(linkValue) &&!alreadyInLink && !getTextFromNodeContext.imgLinkFound && linkValue.toLowerCase().indexOf("javascript:")==-1);
	if(addLink)
	{
		linkValue = grabMyBooks.appendUrlPrefixIfMissing(linkValue, url, getTextFromNodeContext.base);
		if(linkValue.indexOf("%")==-1)
		{
			linkValue = encodeURI(linkValue);
		}
		getTextFromNodeContext.writeAt("$lnk{"+linkValue+" ", resultTabReservedIndex);
	}
	else if(inTable && !getTextFromNodeContext.tableSeen)
	{
		getTextFromNodeContext.writeAt("$tb{", resultTabReservedIndex);
	}
	else if(isTr && !getTextFromNodeContext.tableSeen)
	{
		getTextFromNodeContext.writeAt("$tr{", resultTabReservedIndex);
	}
	else if(isTd && !getTextFromNodeContext.tableSeen)
	{
		var tdText = "$td{";
		if(span != null)
		{
			tdText+=(isColSpan?"c":"r")+"span"+span;
			var spanInfo = new Object();
			spanInfo.index = resultTabReservedIndex;
			getTextFromNodeContext.spanInfos.push(spanInfo);
		}
		getTextFromNodeContext.writeAt(tdText, resultTabReservedIndex);
	}

	if(addLink)
	{
		getTextFromNodeContext.write("}lnk$");
	}
	else if(inTable && !getTextFromNodeContext.tableSeen)
	{
		getTextFromNodeContext.write("}tb$");
		getTextFromNodeContext.tableSeen = true;
		getTextFromNodeContext.spanInfos = [];
	}
	else if(isTr && !getTextFromNodeContext.tableSeen)
	{
		getTextFromNodeContext.write("}tr$");
	}
	else if(isTd && !getTextFromNodeContext.tableSeen)
	{
		getTextFromNodeContext.write("}td$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInBquoteNode && isNodeBquote)
	{
		getTextFromNodeContext.write("}blockquote$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInCiteNode && isNodeCite)
	{
		getTextFromNodeContext.write("}cite$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInItalicNode && isNodeItalic)
	{
		getTextFromNodeContext.write("}i$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInULNode && isNodeUL)
	{
		getTextFromNodeContext.write("}ul$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInOLNode && isNodeOL)
	{
		getTextFromNodeContext.write("}ol$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInLINode && isNodeLI)
	{
		getTextFromNodeContext.write("}li$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH1Node && isNodeHeadingH1)
	{
		getTextFromNodeContext.write("}h1$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH2Node && isNodeHeadingH2)
	{
		getTextFromNodeContext.write("}h2$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH3Node && isNodeHeadingH3)
	{
		getTextFromNodeContext.write("}h3$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH4Node && isNodeHeadingH4)
	{
		getTextFromNodeContext.write("}h4$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH5Node && isNodeHeadingH5)
	{
		getTextFromNodeContext.write("}h5$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInHeadingH6Node && isNodeHeadingH6)
	{
		getTextFromNodeContext.write("}h6$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInCodeNode && isNodeCode)
	{
		getTextFromNodeContext.write("}c$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInPreNode && isNodePre)
	{
		getTextFromNodeContext.write("}pre$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInBoldNode && isNodeBold)
	{
		getTextFromNodeContext.write("}b$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInStrikeNode && isNodeStrike)
	{
		getTextFromNodeContext.write("}k$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInUnderlineNode && isNodeUnderline)
	{
		getTextFromNodeContext.write("}u$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInSubNode && isNodeSub)
	{
		getTextFromNodeContext.write("}q$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInSupNode && isNodeSup)
	{
		getTextFromNodeContext.write("}d$");
	}

	if(grabMyBooks.options.grabStyle && !alreadyInSmallNode && isNodeSmall)
	{
		getTextFromNodeContext.write("}s$");
	}

	var nodeSuffix = grabMyBooks.getTextSuffixForNode(nodeLocalName, node);
	if(nodeSuffix == " " && nodeLocalName != "DIV" && (getTextFromNodeContext.inPre || getTextFromNodeContext.inCode))
	{	//inside pre/code the spaces of the page are kept as they are, no extra space after a tag (b, a, i...).
		nodeSuffix = null;
	}
	if(nodeSuffix != null)
	{
		getTextFromNodeContext.write(nodeSuffix);
	}
};

grabMyBooks.addEmptyArticle = function()
{
	try
	{
		var toAddArticleInfo = new grabMyBooks.ArticleInfo("", null, grabMyBooks.textFormat.formatText("edit me..."));
		grabMyBooks.articles.push(toAddArticleInfo);
		grabMyBooks.fillBook();
		grabMyBooks.showArticle(grabMyBooks.articles.length-1);
		//grabMyBooks.editMode();
		grabMyBooks.autoSave.markModified();
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.up = function()
{
	try
	{
		if(grabMyBooks.articles.length==0 || grabMyBooks.isEditMode || grabMyBooks.articleDisplayed<=0)
		{
				return;
		}
		var tempArticleInfo = grabMyBooks.articles[grabMyBooks.articleDisplayed-1];
		grabMyBooks.articles[grabMyBooks.articleDisplayed-1]=grabMyBooks.articles[grabMyBooks.articleDisplayed];
		grabMyBooks.articles[grabMyBooks.articleDisplayed]=tempArticleInfo;
		grabMyBooks.fillSelect();
		grabMyBooks.showArticle(grabMyBooks.articleDisplayed-1);
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }

};

grabMyBooks.down = function()
{
	try
	{
		if(grabMyBooks.articles.length==0 || grabMyBooks.isEditMode || grabMyBooks.articleDisplayed>=(grabMyBooks.articles.length-1))
		{
				return;
		}
		var tempArticleInfo = grabMyBooks.articles[grabMyBooks.articleDisplayed+1];
		grabMyBooks.articles[grabMyBooks.articleDisplayed+1]=grabMyBooks.articles[grabMyBooks.articleDisplayed];
		grabMyBooks.articles[grabMyBooks.articleDisplayed]=tempArticleInfo;
		grabMyBooks.fillSelect();
		grabMyBooks.showArticle(grabMyBooks.articleDisplayed+1);
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }

};

grabMyBooks.load = function(loadBookContext)
{
	try
	{

		var loadFunction =
			function(loadBookContext)
			{
				return function(loadFile)
				{
					var zipReader = grabMyBooks.ext.createZipReader();

					zipReader.open(loadFile);


					var getZipEntryAsStringFunction =
						function(zipReader)
						{
							return function(zipEntryPath)
							{
								var result = grabMyBooks.ext.getZipEntryAsString(zipReader, zipEntryPath);
								return result;
							};
						}(zipReader);

					var getZipEntryAsXmlFunction =
						function(getZipEntryAsStringFunction)
						{
							return function(zipEntryPath)
							{
								var zipEntryContent = getZipEntryAsStringFunction(zipEntryPath);
								var xmlParser = new DOMParser();
								var dom = xmlParser.parseFromString(zipEntryContent, "text/xml");
								return dom;
							};
						}(getZipEntryAsStringFunction);


					var getZipEntryAsHtmlNodeFunction =
						function(getZipEntryAsStringFunction)
						{
							return function(zipEntryPath)
							{
								var zipEntryContent = getZipEntryAsStringFunction(zipEntryPath);
								zipEntryContent = zipEntryContent.replace(/\<\!\[CDATA\[(.*?)\]\]\>/gi, "$1");
								var html = grabMyBooks.getTextAsHtmlNode(zipEntryContent);
								return html;
							};
						}(getZipEntryAsStringFunction);

					var getZipEntryNodesAtPathFunction =
						function(getZipEntryAsXmlFunction)
						{
							return function(zipEntryPath, pathString)
							{
								var dom = getZipEntryAsXmlFunction(zipEntryPath);
								//var xmlString = new XMLSerializer().serializeToString(dom);
								//grabMyBooks.ext.alert(xmlString);

								var getNodesAtPath = function(nodeTab, pathTab, index)
								{
									var result = [];
									if(index >= pathTab.length)
									{
										return result;
									}

									var currentNode;
									var tagNameAtThisIndex = pathTab[index];
									var last = (index == (pathTab.length-1) );
									for(var i_node=0; i_node<nodeTab.length; i_node++)
									{
										currentNode = nodeTab[i_node];
										if(currentNode.tagName!=undefined && currentNode.tagName==tagNameAtThisIndex)
										{
											if(last)
											{
												result.push(currentNode);
											}
											else
											{
												var subNodesResult = getNodesAtPath(currentNode.childNodes, pathTab, index+1);
												for(var i_subNodesResult=0; i_subNodesResult<subNodesResult.length; i_subNodesResult++)
												{
													result.push(subNodesResult[i_subNodesResult]);
												}
											}
										}
									}
									return result;
								};

								var rootNodeTab = [];

								if(dom.childNodes.length<1)
								{
									return;
								}

								for(var i_domChildNode=0; i_domChildNode<dom.childNodes.length; i_domChildNode++)
								{
									var currentTagName = dom.childNodes[i_domChildNode].tagName;
									if(currentTagName!=undefined && pathString.indexOf(currentTagName)==0)
									{
										rootNodeTab.push(dom.childNodes[i_domChildNode]);
										break;
									}
								}

								var result = getNodesAtPath(rootNodeTab, pathString.split("/"), 0);
								return result;
							};
						}(getZipEntryAsXmlFunction);

					var wrongEpubTypeErrorFunction =
						function()
						{
							grabMyBooks.bookPopin.showMessage("You can only load ePub files made with GrabMyBooks.");
						};
					var containerNodeTab = getZipEntryNodesAtPathFunction("META-INF/container.xml", "container/rootfiles/rootfile");
					if(containerNodeTab.length<1)
					{
						wrongEpubTypeErrorFunction();
						return;
					}
					var opfPath = containerNodeTab[0].getAttribute("full-path");

					var opfNodeTab = getZipEntryNodesAtPathFunction(opfPath, "package/metadata/dc:identifier");
					if(opfNodeTab.length<1)
					{
						wrongEpubTypeErrorFunction();
						return;
					}
					var identifier = opfNodeTab[0].textContent.trim().toLowerCase();
					if(identifier.indexOf("http://www.grabmybooks.com")!=0)
					{
						wrongEpubTypeErrorFunction();
						return;
					}

					if(!loadBookContext.append)
					{
						grabMyBooks.removeAllArticles();
					}

					var bookMetadata = new Object();
					bookMetadata.title = null;
					bookMetadata.description = null;
					bookMetadata.language = null;
					bookMetadata.author = null;

					var titleNodeTab = getZipEntryNodesAtPathFunction(opfPath, "package/metadata/dc:title");
					if(titleNodeTab.length>0)
					{
						bookMetadata.title = titleNodeTab[0].textContent.trim();
					}
					var descriptionNodeTab = getZipEntryNodesAtPathFunction(opfPath, "package/metadata/dc:description");
					if(descriptionNodeTab.length>0)
					{
						bookMetadata.description = descriptionNodeTab[0].textContent.trim();
					}
					var authorNodeTab = getZipEntryNodesAtPathFunction(opfPath, "package/metadata/dc:creator");
					if(authorNodeTab.length>0)
					{
						bookMetadata.author = authorNodeTab[0].textContent.trim();
					}
					var languageNodeTab = getZipEntryNodesAtPathFunction(opfPath, "package/metadata/dc:language");
					if(languageNodeTab.length>0)
					{
						bookMetadata.language = languageNodeTab[0].textContent.trim();
					}

					var bookId = null;
					var newIdentifierStart = grabMyBooks.grabMyBooksUrl+"/";
					if(identifier.indexOf(newIdentifierStart)==0)
					{
						bookId = identifier.substr(newIdentifierStart.length);
					}
					else
					{
						bookId = opfNodeTab[0].getAttribute("id");
					}
					if(grabMyBooks.isEmpty(bookId))
					{
						var dateTime = new Date().getTime();
						bookId = "grabMyBooks_"+dateTime;
					}

					var metaNodeTab = getZipEntryNodesAtPathFunction(opfPath, "package/metadata/meta");
					var coverImgUrl = null;
					var coverImgName = null;
					var imgType = "png";
					var currentMetaNode;
					var currentMetaName;
					for(var i_metaNode=0; i_metaNode<metaNodeTab.length; i_metaNode++)
					{
						currentMetaNode = metaNodeTab[i_metaNode];
						currentMetaName = currentMetaNode.getAttribute("name");
						if(currentMetaName=="cover")
						{
							coverImgName = currentMetaNode.getAttribute("content");
						}
						else if(currentMetaName=="imgType")
						{
							imgType = currentMetaNode.getAttribute("content");
						}
					}
					if(coverImgName != null)
					{
						coverImgUrl = grabMyBooks.img.generateImgUrlForBookLoad(coverImgName+"."+imgType, bookId);
					}

					var itemNodeTab = getZipEntryNodesAtPathFunction(opfPath, "package/manifest/item");
					var currentItemNode;
					var currentItemType;
					var currentItemHref;
					var currentImgName;
					var currentImgNewName;
					var currentImgEntryPath;
					var currentImgInternalUrl;
					var currentTmpDestinationImgFile;
					for(var i_itemNode=0; i_itemNode<itemNodeTab.length; i_itemNode++)
					{
						currentItemNode = itemNodeTab[i_itemNode];
						currentItemType = currentItemNode.getAttribute("media-type");
						if((currentItemType != "image/png") && (currentItemType != "image/jpeg"))
						{
							continue;
						}
						currentItemHref = currentItemNode.getAttribute("href");
						currentImgName = grabMyBooks.img.getImgNameFromPath(currentItemHref);
						currentImgInternalUrl = grabMyBooks.img.generateImgUrlForBookLoad(currentImgName, bookId);
						if(grabMyBooks.img.isImgAlreadySaved(currentImgInternalUrl))
						{
							continue;
						}
						currentImgNewName = grabMyBooks.img.getNewNameForImage();
						grabMyBooks.img.loadBookImgSubstitutionInfoList.addImgSubstitutionInfo(bookId, currentImgName, currentImgNewName);
						currentImgEntryPath = "OEBPS/"+currentItemHref;
						currentTmpDestinationImgFile = grabMyBooks.ext.createFile();
						currentTmpDestinationImgFile.initWithPath(grabMyBooks.ext.path(grabMyBooks.img.getImgTmpDir()));
						currentTmpDestinationImgFile.append(currentImgNewName);
						if(currentTmpDestinationImgFile.exists())
						{
							continue;
						}
						zipReader.extract(currentImgEntryPath, currentTmpDestinationImgFile);
					}

					var navPointTab = getZipEntryNodesAtPathFunction("OEBPS/toc.ncx", "ncx/navMap/navPoint");
					var navPointContentTab = getZipEntryNodesAtPathFunction("OEBPS/toc.ncx", "ncx/navMap/navPoint/content");

					if(navPointContentTab.length<1)
					{
						return;
					}

					if(loadBookContext.overrideMeta)
					{
						grabMyBooks.metadata.setDefaultValues();
						if(bookMetadata.title != null)
						{
							grabMyBooks.metadata.title = bookMetadata.title;
						}
						if(bookMetadata.author != null)
						{
							grabMyBooks.metadata.author = bookMetadata.author;
						}
						if(bookMetadata.language != null)
						{
							grabMyBooks.metadata.lang = bookMetadata.language;
						}
						grabMyBooks.metadata.description = bookMetadata.description;
					}

					var currentNavPointNode;
					var currentArticleFileName;
					var currentArticleNode;
					var articleFileNameTab = [];
					var articleLinks = [];
					var currentArticleText;
					var currentArticleInfo;
					for(var i_navPoint=0; i_navPoint<navPointTab.length; i_navPoint++)
					{
						currentNavPointNode = navPointTab[i_navPoint];
						currentArticleFileName = navPointContentTab[i_navPoint].getAttribute("src");
						if(currentArticleFileName.indexOf("cover")==0)
						{
							continue;
						}
						articleFileNameTab.push(currentArticleFileName);
						articleLinks.push(grabMyBooks.ext.path(loadFile)+"/OEBPS/"+currentArticleFileName);
					}

					var multiAddToBookContext = new grabMyBooks.AddToBookContext(articleLinks);

					var optimizeNodeFunction =
						function(node)
						{
							var result = new Object();
							result.node = null;
							result.title1 = null;
							result.title2 = null;
							var currentChildNode;
							for(var i_childNode=0; i_childNode<node.childNodes.length; i_childNode++)
							{
								currentChildNode = node.childNodes[i_childNode];
								if(result.title1==null && currentChildNode.tagName!=undefined && currentChildNode.tagName=="H2")
								{
									result.title1 = currentChildNode.textContent;
								}
								if(result.title2==null && currentChildNode.tagName!=undefined && currentChildNode.tagName=="H3")
								{
									result.title2 = currentChildNode.textContent;
								}
								if(currentChildNode.tagName==undefined || !(currentChildNode.tagName=="P" || currentChildNode.tagName=="DIV" || currentChildNode.tagName=="SPAN" || currentChildNode.tagName=="IMG" || currentChildNode.tagName=="TABLE"))
								{
									node.removeChild(currentChildNode);
									i_childNode-=1;
								}
							}
							result.node = node;
							return result;
						};

					var currentArticleNodeBodyNode;
					var currentOptimizationResult;
					var currentGetTextFromNodeContext;
					for(var i_articleFileName=0; i_articleFileName<articleFileNameTab.length; i_articleFileName++)
					{
						currentArticleFileName = articleFileNameTab[i_articleFileName];
						currentArticleNode = getZipEntryAsHtmlNodeFunction("OEBPS/"+currentArticleFileName);
						currentOptimizationResult = optimizeNodeFunction(currentArticleNode);
						currentArticleNodeBodyNode = currentOptimizationResult.node;
						if(currentArticleNodeBodyNode == null)
						{
							continue;
						}
						currentGetTextFromNodeContext = new grabMyBooks.GetTextFromNodeContext(currentArticleNodeBodyNode, articleLinks[i_articleFileName]);
						currentGetTextFromNodeContext.loadingBookInfo = new Object();
						currentGetTextFromNodeContext.loadingBookInfo.bookId = bookId;
						grabMyBooks.getTextFromNode(currentGetTextFromNodeContext);
						currentArticleText = currentGetTextFromNodeContext.getResult();
						currentArticleText = grabMyBooks.textFormat.formatText(currentArticleText);

						currentArticleInfo = new grabMyBooks.ArticleInfo(articleLinks[i_articleFileName], currentOptimizationResult.title1, currentArticleText);
						currentArticleInfo.title2 = currentOptimizationResult.title2;
						multiAddToBookContext.addArticleInfo(currentArticleInfo);
					}

					if(loadBookContext.overrideCover && coverImgUrl!=null)
					{
						var coverSavedImgInfo = grabMyBooks.img.getSavedImgInfo(coverImgUrl);
						if(coverSavedImgInfo == null)
						{
							coverSavedImgInfo = grabMyBooks.img.handleImg(coverImgUrl, true);
						}
						grabMyBooks.img.savedCoverSavedImgInfo = coverSavedImgInfo;
					}
					zipReader.close();
				};
			}(loadBookContext);

		var loadFile = null;
		if(loadBookContext.overridenToLoadFile == null)
		{
			grabMyBooks.getLoadFile(loadFunction);
			return;
		}
		else
		{
			loadFile = loadBookContext.overridenToLoadFile;
			loadFunction(loadFile);
		}

		if(loadFile == null)
		{
			return;
		}

	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.save = function()
{
	try
	{
		if(!grabMyBooks.isEditMode)
		{
				return;
		}
		var editContent = grabMyBooks.textAreaNode.value;
		if(grabMyBooks.isEmpty(editContent))
		{
			return;
		}
		editContent = grabMyBooks.textFormat.formatText(editContent);
		grabMyBooks.img.handleImgs(editContent);
		grabMyBooks.articles[grabMyBooks.articleDisplayed].content=editContent;
		grabMyBooks.articles[grabMyBooks.articleDisplayed].title = grabMyBooks.titleEditNode.value;
		grabMyBooks.articles[grabMyBooks.articleDisplayed].title2 = grabMyBooks.title2EditNode.value;
		grabMyBooks.viewMode();
		grabMyBooks.fillSelect();
		grabMyBooks.showArticle(grabMyBooks.articleDisplayed);
		grabMyBooks.autoSave.markModified();
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }

};

grabMyBooks.viewMode = function()
{
	try
	{
		if(!grabMyBooks.isEditMode)
		{
				return;
		}
		grabMyBooks.contentNode.removeChild(grabMyBooks.editSpan);
		grabMyBooks.contentNode.appendChild(grabMyBooks.articleNode);
		grabMyBooks.updateIconsForReadFunction();
		grabMyBooks.isEditMode=false;
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }

};

grabMyBooks.editMode = function()
{
	try
	{
		if(grabMyBooks.isEditMode)
		{
			return;
		}
		if(grabMyBooks.articles.length==0)
		{
			return;
		}
		grabMyBooks.contentNode.removeChild(grabMyBooks.articleNode);
		grabMyBooks.contentNode.appendChild(grabMyBooks.editSpan);
		grabMyBooks.titleEditNode.value=grabMyBooks.articles[grabMyBooks.articleDisplayed].title;
		grabMyBooks.title2EditNode.value=grabMyBooks.articles[grabMyBooks.articleDisplayed].title2;
		grabMyBooks.textAreaNode.value=grabMyBooks.articles[grabMyBooks.articleDisplayed].content;
		//grabMyBooks.textAreaNode.focus();
		grabMyBooks.updateIconsForEditFunction();
		grabMyBooks.isEditMode=true;
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};


grabMyBooks.removeAllArticles = function()
{
	try
	{
		grabMyBooks.img.savedCoverSavedImgInfo = null;
		grabMyBooks.img.coverSavedImgInfo = null;
		grabMyBooks.img.deleteImgTmpDir();
		grabMyBooks.img.savedImgInfos = [];
		grabMyBooks.metadata.setDefaultValues();
		grabMyBooks.img.loadBookImgSubstitutionInfoList.imgSubstitutionInfos = [];
		grabMyBooks.img.backupImgs = [];

		grabMyBooks.onDeleteAll();

		if(grabMyBooks.articles.length==0)
		{
			return;
		}

		grabMyBooks.articles = [];
		grabMyBooks.fillBook();
		grabMyBooks.autoSave.markModified();
		grabMyBooks.reader.readInfos.resetAndSave();
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.removeArticle = function(articleNumber)
{
	try
	{
		if(grabMyBooks.articles.length==0 || articleNumber<0)
		{
			return;
		}
		grabMyBooks.articles.splice(articleNumber, 1);
		grabMyBooks.fillBook();
		grabMyBooks.autoSave.markModified();
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.removeLastArticle = function()
{
	grabMyBooks.removeArticle(grabMyBooks.articles.length-1);
};


grabMyBooks.ext.decodeHtml = function(text)
{
	var result = text;
	var htmlParseResult = grabMyBooks.ext.HTMLParser(text);
	if(htmlParseResult.body.childNodes.length > 0)
	{
		var nodeValue = htmlParseResult.body.childNodes[0].nodeValue;
		if(nodeValue != null)
		{
			result = nodeValue;
		}
	}
	return result;
};

grabMyBooks.replaceVariablesInText = function(text, index, escapeHtml)
{
	if(grabMyBooks.isEmpty(text))
	{
		return text;
	}
	var result = text;
	if(escapeHtml)
	{
		result = grabMyBooks.ext.decodeHtml(result);
	}
	result = result.replace(/\$num/g,""+(index+1));
	return result;
};

grabMyBooks.getArticleTextContent = function(articleNumber)
{
	if(grabMyBooks.articles.length==0 || articleNumber<0 || articleNumber>=grabMyBooks.articles.length || grabMyBooks.isEditMode)
	{
		return null;
	}
	var title = grabMyBooks.replaceVariablesInText(grabMyBooks.articles[articleNumber].title, articleNumber, false);
	var articleContent = [];
	if(!grabMyBooks.isEmpty(title))
	{
		var titleToDisplay = grabMyBooks.escapeTagsExtended(title);
		articleContent.push("<h2>");
		articleContent.push(titleToDisplay);
		articleContent.push("</h2>");
	}
	if(!grabMyBooks.isEmpty(grabMyBooks.articles[articleNumber].title2))
	{
		var title2ToDisplay = grabMyBooks.replaceVariablesInText(grabMyBooks.articles[articleNumber].title2, articleNumber, false);
		title2ToDisplay = grabMyBooks.escapeTagsExtended(title2ToDisplay);
		articleContent.push("<h3>");
		articleContent.push(title2ToDisplay);
		articleContent.push("</h3>");
	}
	articleContent.push(grabMyBooks.articles[articleNumber].getHtmlContent());
	var articleJoinedContent = articleContent.join("\n");
	return articleJoinedContent;
};

grabMyBooks.showArticle = function(articleNumber)
{
	try
	{
		if(grabMyBooks.articles.length==0 || articleNumber<0 || articleNumber>=grabMyBooks.articles.length || grabMyBooks.isEditMode)
		{
			return;
		}
		grabMyBooks.articleDisplayed = articleNumber;
		var title = grabMyBooks.replaceVariablesInText(grabMyBooks.articles[articleNumber].title, articleNumber, false);
		var articleHtmlContent = grabMyBooks.getArticleTextContent(articleNumber);
		var currentArticleNode = grabMyBooks.bookTabBrowser.contentDocument.getElementById("currentArticle");
		grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, currentArticleNode, articleHtmlContent);
		grabMyBooks.scrollToTop(currentArticleNode, grabMyBooks.getExecWithTimerTimer());
		grabMyBooks.img.replaceImgsByCanvas(grabMyBooks.bookTabBrowser.contentDocument, currentArticleNode, null);
		grabMyBooks.bookTabBrowser.contentDocument.getElementById("select").selectedIndex = articleNumber;
		grabMyBooks.onHtmlArticleDisplayed(currentArticleNode);
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.fillSelect = function()
{
	var optionContent = [];
	for(var i_article=0;i_article<grabMyBooks.articles.length;i_article++)
	{
		optionContent.push("<option value=\""+(i_article+1)+"\">"+(i_article+1)+"-"+grabMyBooks.replaceVariablesInText(grabMyBooks.articles[i_article].getTitleOrDefaultTitle(20), i_article)+"</option>");
	}
	grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, grabMyBooks.bookTabBrowser.contentDocument.getElementById("select"), optionContent.join("\n"));
};

grabMyBooks.ext.getCssForBookPage = function()
{
	var resultTab = [];
	resultTab.push(
	    grabMyBooks.popin.css(),
		"			#metaDataFormTable {width:90%;text-align:left;}",
		"			#metaDataFormTable td {vertical-align:top;font-size:0.9em;}",
		"			#metaError {line-height:120%;color:red;margin-bottom:10px;}",
		"			#metaTitle {margin-bottom:10px;}",
		"			#loadActionEmptySubOptions{margin-left:30px;}",
		"			#loadActionAppend, #loadActionEmpty {margin-top:10px; margin-bottom:10px;}",
		"			#loadBookForm{margin-left:30px;margin-top:10px;}",
		"			body {overflow:none;width:100%;height:100%;background-image:url(chrome://grabMyBooks/content/icons/menu/bg.png);}",
		"			h2 {font-family:\"Times New Roman\", Times, serif;font-size:1.6em;}",
		"			h3 {font-family:\"Times New Roman\", Times, serif;font-size:1.3em;}",
		"			.editArea {font-family:\"Times New Roman\", Times, serif;width:70%;height:95%;margin-left:auto;margin-right:auto;margin-top:1px;}",
		"			.content {text-align:center;font-size:0.84em;line-height:1.375;margin:0 0 1em;}",
		"			div#navigationBar {font-size:0.95em;margin-left:auto;margin-right:auto;padding:2px;font-weight:600;}",
		"			div#navigationBar span#previous, div#navigationBar span#next {padding:1px;margin:4px;cursor:pointer;vertical-align:middle;}",
		"			div#navigationBar span#previous:hover, div#navigationBar span#next:hover {border-style:solid;border-width:1px;margin:3px;}",
		"			div#navigationBar img {cursor:pointer;vertical-align:middle;}",
		"			div#navigationBar select {max-width:200px;padding:1px;margin:4px;cursor:pointer;vertical-align:middle;}",
		"			div#currentArticle {border-radius:15px;background-color:white;text-align:left;width:70%;height:90%;overflow:auto;margin-top:10px;margin-left:auto;margin-right:auto;padding-left:10px;padding-right:10px;padding-top:2px;padding-bottom:2px;border-style:solid;border-width:1px;border-color:black;font-family:\"Times New Roman\", Times, serif;}",
		"			div#editSpan {text-align:center;width:100%;height:90%;margin-top:10px;padding:2px;}",
		"			input#titleEdit {margin-left:2px;margin-right:10px;width:30%;}",
		"			input#title2Edit {margin-left:2px;width:30%;}",
		"			div#editTitleSpan {width:70%;padding-left:15%;text-align:left;}",
		"			#moreMenu img{display:block;margin-bottom:3px;}",
		grabMyBooks.menu.css(),
		"			div#grabBookContainer{display:inline;position:relative;}",
		"			div#grabBookSuggest{display:none;position:absolute;z-index:5;top:28px;left:70px;width:140px;height:40px;background-color:white;border-style:solid;border-width:1px;border-color:black;border-radius:0px 10px 10px 10px;text-align:left;padding:5px;font-weight:normal;}",
		"			div#grabBookSuggestPointerBorder{display:none;position:absolute;z-index:4;top:21px;left:70px;width:0px;height:0px;border-top:0;border-left:0;border-right:7px solid transparent;border-bottom:7px solid black;}",
		"			div#grabBookSuggestPointer{display:none;position:absolute;z-index:6;top:22px;left:71px;width:0px;height:0px;border-top:0;border-left:0;border-right:5px solid transparent;border-bottom:7px solid white;}",
		"			div#grabBookSuggestMouseZone{display:none;z-index:1;position:absolute;top:-20px;left:-10px;width:270px;height:140px;}",
		"			#grabBookSuggestClose {display:none;position:absolute;cursor:pointer;z-index:7;top:30px;left:210px;font-family:Helvetica,Arial,sans-serif;font-size:0.9em;}",
		"			div#grabBookSuggestSaveAs{display:none;position:absolute;z-index:5;top:-9px;left:135px;width:65px;height:15px;background-color:white;border-style:solid;border-width:1px;border-color:black;border-radius:10px 10px 10px 0px;text-align:left;padding:5px;font-weight:normal;}",
		"			div#grabBookSuggestSaveAsPointerBorder{display:none;position:absolute;z-index:4;top:11px;left:128px;width:0px;height:0px;border-bottom:0;border-left:0;border-top:7px solid transparent;border-right:7px solid black;}",
		"			div#grabBookSuggestSaveAsPointer{display:none;position:absolute;z-index:6;top:12px;left:129px;width:0px;height:0px;border-bottom:0;border-left:0;border-top:5px solid transparent;border-right:7px solid white;}",
		"			#grabBookSuggestSaveAsClose {display:none;position:absolute;cursor:pointer;z-index:7;top:-8px;left:200px;font-family:Helvetica,Arial,sans-serif;font-size:0.9em;}",
		"			#grab{position:relative;z-index:2;}",
		"			#coverTable{display:block;margin-top:10px;margin-left:auto;margin-right:auto;width:90%;}",
		"			#coverImg, .bookImg {width:150px;min-width:150px;height:200px;text-align:center;vertical-align:middle;color:gray;border-style:solid;border-color:gray;border-width:1px;}",
		"			.bookImg {display:table-cell;margin-left:5px;margin-right:5px;cursor:pointer;}",
		"			#coverTableContainer{width:100%;text-align:center;}",
		"			#coverTable td{padding-left:30px;vertical-align:middle;}",
		"			#coverFromCache, #coverFromFile, #noCover{cursor:pointer;}",
		"			#cacheCoversContainer {display:none;width:100%;height:228px;border-spacing:5px;margin-top:5px;border-style:solid;border-color:black;border-width:1px;overflow:auto;text-align:left;vertical-align:middle;}",
		"			#titleSuggest, #coverSuggest, #suggestSaveAsLink {cursor:pointer;z-index:7;font-weight:bold;text-decoration:underline;}",
		"			#titleSuggest:hover, #coverSuggest:hover, #suggestSaveAsLink:hover, #removeAllSuggest:hover {color:blue;}",
		"			#removeAllSuggest {cursor:pointer;font-weight:bold;text-decoration:underline;vertical-align:middle;}",
		"			#autoDescButton {display:block;margin-top:5px;}",
		"			.smallButton {border:solid 1px black;background:white;border-radius:5px;font-size:smaller;}",
		"			.smallButton:hover {cursor:pointer;}",
		"			#currentArticle table td{vertical-align:top;}",
		"			#currentArticle table .rowSingleImg td {text-align:center;}",
		"			#currentArticle table tr .rowSingleImg canvas{max-width:100%;max-height:100%;}",
		"			#currentArticle table tr .row canvas{max-width:100px;max-height:100px;}",
		"			#reader{display:none;position:fixed;top:0px;left:0px;width:100vw;height:100vh;z-index:5;background:white;}",
		"			#readerBack{display:none;position:fixed;top:0px;bottom:0px;left:0px;right:0px;}",
		"			#readerContent{position:fixed;top:0px;left:0px;overflow:hidden;width:100vw;height:90vh;-moz-column-width:100vw;-moz-column-gap:0vw;margin:0px;padding-left:5vw;padding-top:5vh;padding-bottom:5vh;}",
		"			#readerContent p{padding-right:8vw;}",
		"			#readerClose{position:absolute;cursor:pointer;top:20px;right:20px;}",
		"			#readerActions{position:absolute;bottom:20px;left:0px;width:100%;text-align:center;}",
		"			#readerActions>div{display:inline;}",
		"			.readerPageNumSeparator{}",
		"			#readerPagePrevious, #readerPageNext, #readerArticlePrevious, #readerArticleNext {cursor:pointer;}",
		"			#readerContent canvas {max-height:50%;}",
		"			.menuButton {cursor:pointer;}"
		);
	return resultTab.join("\n");
};

grabMyBooks.reader = new Object();

grabMyBooks.reader.ReadContext = function()
{
	this.containerNode = null;
	this.textNode = null;
	this.currentArticleIndex = null;
	this.currentArticlePageIndex = 0;
	this.currentArticlePageCount = null;
	this.articleCount = null;

	this.getHtmlFunction = null;
	this.onPagePreviousFunction = null;
	this.onPageNextFunction = null;
	this.onArticlePreviousFunction = null;
	this.onArticleNextFunction = null;
	this.onResizeFunction = null;
	this.onResizeAdaptImagesFunctions = [];

	this.toDoOnCloseFunctions = [];
	this.close = function()
	{
		grabMyBooks.tabDoExec(this.toDoOnCloseFunctions);
	};
};

grabMyBooks.ext.prepareReadContext = function(readContext)
{
};

grabMyBooks.reader.readInfos = new Object();
grabMyBooks.reader.readInfos.reset = function()
{
	grabMyBooks.reader.readInfos.update(0, 0);
};

grabMyBooks.reader.readInfos.update = function(articleIndex, pageIndex)
{
	grabMyBooks.reader.readInfos.currentReadArticleIndex=articleIndex;
	grabMyBooks.reader.readInfos.currentReadArticlePageIndex=pageIndex;
};

grabMyBooks.reader.readInfos.reset();

grabMyBooks.reader.readInfos.updateAndSave = function(articleIndex, pageIndex)
{
	grabMyBooks.reader.readInfos.update(articleIndex, pageIndex);
	grabMyBooks.reader.readInfos.save();
};

grabMyBooks.reader.readInfos.resetAndSave = function()
{
	grabMyBooks.reader.readInfos.reset();
	grabMyBooks.reader.readInfos.save();
};

grabMyBooks.reader.readInfos.save = function()
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	var readSaveObject = new Object();
	readSaveObject.currentReadArticleIndex = grabMyBooks.reader.readInfos.currentReadArticleIndex;
	readSaveObject.currentReadArticlePageIndex = grabMyBooks.reader.readInfos.currentReadArticlePageIndex;
	var readSaveJsonString = JSON.stringify(readSaveObject);
	grabMyBooks.ext.writeFile(saveDir, "readInfo", readSaveJsonString);
};

grabMyBooks.reader.readInfos.load = function()
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	var readInfoJsonString = grabMyBooks.ext.readFile(saveDir, "readInfo");
	if(grabMyBooks.isEmpty(readInfoJsonString))
	{
		return;
	}
	var readSaveObject = JSON.parse(readInfoJsonString);
	grabMyBooks.reader.readInfos.currentReadArticleIndex = readSaveObject.currentReadArticleIndex;
	grabMyBooks.reader.readInfos.currentReadArticlePageIndex = readSaveObject.currentReadArticlePageIndex;
};

grabMyBooks.reader.read = function(readContext)
{


	readContext.loadArticle =
		function()
		{
			var articleHtmlContent = this.getHtmlFunction(this.currentArticleIndex);
			if(articleHtmlContent == null)
			{
				return;
			}
			this.onResizeAdaptImagesFunctions = [];
			grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, this.textNode, articleHtmlContent);
			grabMyBooks.onHtmlArticleDisplayed(this.textNode);
			grabMyBooks.img.replaceImgsByCanvas(grabMyBooks.bookTabBrowser.contentDocument, this.textNode,
					function(readContext)
					{
						return function(canvas)
						{
							var adaptCanvasFunction =
								function(readContext, canvas)
								{
									return function()
									{
										var maxHeight = (readContext.textNode.offsetHeight*80/100-20-readContext.readerActionsNode.offsetHeight);
										if(maxHeight<10)
										{
											maxHeight = 10;
										}
										canvas.style.maxHeight = maxHeight+"px";
									};
								}(readContext, canvas);
							adaptCanvasFunction();
							readContext.onResizeAdaptImagesFunctions.push(adaptCanvasFunction);
						};
					}(this)
					);
			this.endNode = grabMyBooks.bookTabBrowser.contentDocument.createElement("span");
			this.endNode.id = "readEndNode";
			this.textNode.appendChild(readContext.endNode);

			this.resetViewSize();

			this.updateReaderView();
		};

	readContext.computeColumnCountHorizontal =
		function()
		{
			var columnWidth = this.containerNode.offsetWidth;
			var endNodeLeft = this.endNode.offsetLeft;
			var columnCountHorizontal = Math.ceil(endNodeLeft/columnWidth);
			if(columnCountHorizontal == 0)
			{
				columnCountHorizontal = 1;
			}
			return columnCountHorizontal;
		};

	readContext.computeColumnCountVertical =
			function()
			{
				var columnHeight = this.textNode.offsetHeight;
				var endNodeTop = this.endNode.offsetTop;
				var columnCountVertical = Math.ceil(endNodeTop/columnHeight);
				if(columnCountVertical == 0)
				{
					columnCountVertical = 1;
				}
				return columnCountVertical;
			};


	readContext.computeColumnCount =
		function()
		{

			var columnCountHorizontal = this.computeColumnCountHorizontal();
			var columnCountVertical = this.computeColumnCountVertical();
			var columnCount = columnCountHorizontal + columnCountVertical - 1;
			this.currentArticlePageCount = columnCount;
			return columnCount;
		};

	readContext.updateReaderView =
		function()
		{

			var columnCount =  this.computeColumnCount();


			if(this.currentArticlePageIndex == "last" || this.currentArticlePageIndex >= this.currentArticlePageCount)
			{
				this.currentArticlePageIndex = this.currentArticlePageCount - 1;
				this.saveReadInfos();
			}

			this.textNode.style.width = (columnCount*100)+"vw";
			this.textNode.style.left = (this.currentArticlePageIndex * (-100))+"vw";

			this.postUpdatedReaderView();
		};

	readContext.postUpdatedReaderView =
		function()
		{
			var checkFunction =
				function(readContext)
				{
					return function()
					{
						var columnCountVertical = readContext.computeColumnCountVertical();
						if(columnCountVertical > 1)
						{
							readContext.updateReaderView();
						}
						else
						{
							var columnCount =  readContext.computeColumnCount();
							grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, readContext.pagesTotalNode, ""+columnCount);
							grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, readContext.readerCurrentPageNode, ""+(readContext.currentArticlePageIndex+1));
							grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, readContext.readerArticlesTotalNode, ""+(readContext.articleCount));
							grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, readContext.readerCurrentArticleNode, ""+(readContext.currentArticleIndex+1));
						}
					};
				}(this);
			grabMyBooks.execWithTimer(checkFunction, 50);
		};

	readContext.resetViewSize =
		function()
		{
			this.textNode.style.width = 100+"vw";
		};

	readContext.onResizeFunction =
		function()
		{
			var updateReaderViewFunction =
				function(readContext)
				{
					return function()
					{
						readContext.updateReaderView();
					};
				}(this);
			this.resetViewSize();
			var onResizeAdaptImagesFunctionCount = this.onResizeAdaptImagesFunctions.length;
			var currentOnResizeAdaptImagesFunction;
			for(var i_imgResize=0; i_imgResize<onResizeAdaptImagesFunctionCount; i_imgResize++)
			{
				currentOnResizeAdaptImagesFunction = this.onResizeAdaptImagesFunctions[i_imgResize];
				currentOnResizeAdaptImagesFunction();
			}
			grabMyBooks.execWithTimer(updateReaderViewFunction, 50);
		};

	readContext.saveReadInfos = function()
	{
		grabMyBooks.reader.readInfos.updateAndSave(this.currentArticleIndex, this.currentArticlePageIndex);
	};

	readContext.onPageNextFunction =
		function()
		{
			if(this.currentArticlePageIndex >= this.currentArticlePageCount-1)
			{
				if(this.currentArticleIndex >= this.articleCount-1)
				{
					return;
				}
				this.currentArticleIndex +=1;
				this.currentArticlePageIndex = 0;
				this.saveReadInfos();
				this.loadArticle();
				return;
			}
			this.currentArticlePageIndex+=1;
			this.saveReadInfos();
			this.updateReaderView();
		};
	readContext.onPagePreviousFunction =
		function()
		{
			if(this.currentArticlePageIndex == 0)
			{
				if(this.currentArticleIndex ==0)
				{
					return;
				}
				this.currentArticleIndex -=1;
				this.currentArticlePageIndex = "last";
				this.saveReadInfos()
				this.loadArticle();
				return;
			}
			this.currentArticlePageIndex-=1;
			this.saveReadInfos()
			this.updateReaderView();
		};
	readContext.onArticleNextFunction =
		function()
		{
			if(this.currentArticleIndex >= this.articleCount-1)
			{
				return
			}
			this.currentArticleIndex+=1;
			this.currentArticlePageIndex=0;
			this.loadArticle();
			this.updateReaderView();
		};
	readContext.onArticlePreviousFunction =
		function()
		{
			if(this.currentArticleIndex==0)
			{
				return
			}
			this.currentArticleIndex-=1;
			this.currentArticlePageIndex=0;
			this.loadArticle();
			this.updateReaderView();
		};


	grabMyBooks.ext.prepareReadContext(readContext);

	if(grabMyBooks.reader.readInfos.currentReadArticleIndex!=0 || grabMyBooks.reader.readInfos.currentReadArticlePageIndex!=0)
	{
		readContext.currentArticleIndex = grabMyBooks.reader.readInfos.currentReadArticleIndex;
		readContext.currentArticlePageIndex = grabMyBooks.reader.readInfos.currentReadArticlePageIndex;
	}

	readContext.loadArticle();
};

grabMyBooks.ext.getBookMenuMoreContent = function()
{
	var result = [];
	result.push(
			"<span id=\"moreMenu\">",
			grabMyBooks.menu.button("read", "Read the book", "READ"),
			grabMyBooks.menu.button("up", "Move this article up in the list", "UP"),
			grabMyBooks.menu.button("down", "Move this article down in the list", "DOWN"),
			grabMyBooks.menu.button("metadata", "Edit book metadata", "METADATA"),
			grabMyBooks.menu.button("cover", "Edit book cover", "COVER"),
			grabMyBooks.menu.button("load", "Load book", "LOAD"),
			grabMyBooks.menu.button("deleteAll", "Delete all the articles", "DELETE ALL"),
			"</span>"
			);
	return result.join("\n");
};

grabMyBooks.ext.moreMenuBubbleHeight = 170;
grabMyBooks.ext.moreMenuBubbleWidth = 115;

grabMyBooks.fillBook = function()
{
	try
	{
		if(grabMyBooks.bookTabBrowser == null)
		{
			return;
		}
		var i_article;
		var content=[];
		content.push(
		"<html>",
		"	<head>",
		"		<style type=\"text/css\">",
		grabMyBooks.ext.getCssForBookPage(),
		"		</style>",
		"	</head>",
		"	<body>",
		"		<div id=\"popinBack\"></div>",
		"		<div id=\"popin\"><div id=\"popinContent\"></div></div>",
		"		<div id=\"reader\">",
		"		</div>",
		"		<div id=\"readerBack\"></div>",
		"		<div id=\"content\" class=\"content\">",
		"			<div id=\"navigationBar\">",
		"				<span id=\"previous\" title=\"Show previous article\">&lt;</span>",
		"				<select id=\"select\">",
		"				</select>",
		"				<span id=\"next\" title=\"Show next article\">&gt;</span>",
		                grabMyBooks.menu.button("save", "Save", "SAVE"),
		                grabMyBooks.menu.button("cancel", "Cancel", "CANCEL"),
						grabMyBooks.menu.button("edit", "Edit this article", "EDIT"),
						grabMyBooks.menu.button("add", "Add a new article", "ADD"),
						grabMyBooks.menu.button("delete", "Delete this article", "DELETE"),
						grabMyBooks.menu.button("more", "More actions", "MORE"),
		"				<div id=\"grabBookContainer\">",
		"					<div id=\"grabBookSuggestMouseZone\"></div>",
							grabMyBooks.menu.button("grab", "Save book", "GRAB MY BOOK"),
		"					<div id=\"grabBookSuggestPointer\"></div>",
		"					<div id=\"grabBookSuggestPointerBorder\"></div>",
		"					<div id=\"grabBookSuggest\"></div>",
		"					<div id=\"grabBookSuggestClose\" title=\"Close\">X</div>",
		"					<div id=\"grabBookSuggestSaveAs\"><span id=\"suggestSaveAsLink\">Save as...</span></div>",
		"					<div id=\"grabBookSuggestSaveAsPointer\"></div>",
		"					<div id=\"grabBookSuggestSaveAsPointerBorder\"></div>",
		"					<div id=\"grabBookSuggestSaveAsClose\" title=\"Close\">X</div>",
		"				</div>",
						grabMyBooks.menu.button("help", "Help, doc, more info", "?"),
		"			</div>",
		"			<div id=\"currentArticle\">",
		"			</div>",
		"			<div id=\"editSpan\">",
		"				<div id=\"editTitleSpan\">",
		"					<b>Title 1</b>:<input id=\"titleEdit\" type=\"text\">",
		"					<b>Title 2:</b><input id=\"title2Edit\" type=\"text\">",
		"				</div>",
		"				<textarea id=\"editArea\" class=\"editArea\">",
		"				</textarea>",
		"			</div>",
		"		</div>",
		"	</body>",
		"</html>"
		);

		grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, grabMyBooks.bookTabBrowser.contentDocument.body, content.join("\n"));

		grabMyBooks.bookPopin = new grabMyBooks.popin.Popin(grabMyBooks.bookTabBrowser);

		grabMyBooks.fillSelect();
		grabMyBooks.showArticle(0);

		var previousDiv = grabMyBooks.bookTabBrowser.contentDocument.getElementById("previous");
		previousDiv.addEventListener("click",function(e){grabMyBooks.showArticle(grabMyBooks.articleDisplayed-1);},false);

		var nextDiv = grabMyBooks.bookTabBrowser.contentDocument.getElementById("next");
		nextDiv.addEventListener("click",function(e){grabMyBooks.showArticle(grabMyBooks.articleDisplayed+1);},false);

		var select = grabMyBooks.bookTabBrowser.contentDocument.getElementById("select");
		select.addEventListener("change",function(e)
											{
												if(!grabMyBooks.isEditMode)
												{
													grabMyBooks.showArticle(select.selectedIndex);
												}
												else
												{
													select.selectedIndex=grabMyBooks.articleDisplayed;
												}
											},false);

		var edit = grabMyBooks.bookTabBrowser.contentDocument.getElementById("edit");
		edit.addEventListener("click",function(e){grabMyBooks.editMode();},false);

		var save = grabMyBooks.bookTabBrowser.contentDocument.getElementById("save");
		save.addEventListener("click",function(e){grabMyBooks.save();},false);

		var cancel = grabMyBooks.bookTabBrowser.contentDocument.getElementById("cancel");
		cancel.addEventListener("click",function(e){grabMyBooks.viewMode();},false);

		var moreDiv = grabMyBooks.bookTabBrowser.contentDocument.getElementById("more");
		var moreBubbleContext = new grabMyBooks.popin.BubbleContext(grabMyBooks.bookTabBrowser.contentDocument, moreDiv);
		var moreBubbleHtmlContent = grabMyBooks.ext.getBookMenuMoreContent();
		moreBubbleContext.content = moreBubbleHtmlContent;
		moreBubbleContext.width = grabMyBooks.ext.moreMenuBubbleWidth;
		moreBubbleContext.height = grabMyBooks.ext.moreMenuBubbleHeight;
		moreBubbleContext.targetNodePositionXShift = 20;
		moreBubbleContext.mouseZoneWidth = 50;
		moreBubbleContext.mouseZoneLeftMove = -10;
		moreBubbleContext.type = "bottomCenter";
		var moreBubble = new grabMyBooks.popin.Bubble(moreBubbleContext);

		var showOrHideMoreActionsMenu = function(moreBubble)
		{
			return function(show)
			{
				if(show)
				{
					moreBubble.show();
				}
				else
				{
					moreBubble.hide();
				}
			};
		}(moreBubble);


		var reader = grabMyBooks.bookTabBrowser.contentDocument.getElementById("reader");
		var readerBack = grabMyBooks.bookTabBrowser.contentDocument.getElementById("readerBack");


		var readerOutsideEventsAttachFunction =
			function(reader, doc)
			{
				return function(readContext)
				{

					var readerKeysFunction =
						function(readContext)
						{
							return function(e)
							{
								if(e.keyCode == 27)
								{
									readContext.close();
								}
								else if(e.keyCode == 37)
								{
									readContext.onPagePreviousFunction();
								}
								else if(e.keyCode == 39)
								{
									readContext.onPageNextFunction();
								}
								else if(e.keyCode == 38)
								{
									readContext.onArticlePreviousFunction();
								}
								else if(e.keyCode == 40)
								{
									readContext.onArticleNextFunction();
								}
							};
						}(readContext);

					doc.addEventListener("keydown", readerKeysFunction, false);

					var removeKeysListenerFunction =
						function(readerKeysFunction, doc)
						{
							return function()
							{
								doc.removeEventListener("keydown", readerKeysFunction, false);
							};
						}(readerKeysFunction, doc);

					readContext.toDoOnCloseFunctions.push(removeKeysListenerFunction);


					var readerResizeFunction =
						function(readContext)
						{
							return function(e)
							{
								readContext.onResizeFunction();
							};
						}(readContext);

					window.addEventListener("resize", readerResizeFunction, false);

					var removeResizeListenerFunction =
						function(readerResizeFunction, doc)
						{
							return function(e)
							{
								doc.body.removeEventListener("resize", readerResizeFunction, false);
							};
						}(readerResizeFunction, doc);

					readContext.toDoOnCloseFunctions.push(removeResizeListenerFunction);

				};
			}(reader, grabMyBooks.bookTabBrowser.contentDocument);


		var createReadContextFunction =
			function(reader, readerBack, readerOutsideEventsAttachFunction, doc)
			{
				return function()
				{
					var readContext = new grabMyBooks.reader.ReadContext();

					readContext.currentArticleIndex = grabMyBooks.articleDisplayed;
					readContext.articleCount = grabMyBooks.articles.length;

					var readerContent = [];
					readerContent.push(
							"			<div id=\"readerContent\">",
							"			</div>",
							"			<div id=\"readerClose\" title=\"Close\">X</div>",
							"			<div id=\"readerActions\">",
							"				Page <div id=\"readerPagePrevious\">&lt;</div>",
							"				<div id=\"readerCurrentPage\"></div>",
							"				<div class=\"readerPageNumSeparator\">/</div>",
							"				<div id=\"readerPagesTotal\"></div>",
							"				<div id=\"readerPageNext\">&gt;</div>",
							"				of article <div id=\"readerArticlePrevious\">&lt;</div>",
							"				<div id=\"readerCurrentArticle\"></div>",
							"				<div class=\"readerArticleNumSeparator\">/</div>",
							"				<div id=\"readerArticlesTotal\"></div>",
							"				<div id=\"readerArticleNext\">&gt;</div>",
							"			</div>"
					);

					grabMyBooks.setNodeContentFromString(doc, reader, readerContent.join("\n"));

					var readerContent = doc.getElementById("readerContent");
					var readerClose = doc.getElementById("readerClose");
					var readerPagesTotal = doc.getElementById("readerPagesTotal");
					var readerPagePrevious = doc.getElementById("readerPagePrevious");
					var readerPageNext = doc.getElementById("readerPageNext");
					var readerCurrentPage = doc.getElementById("readerCurrentPage");

					var readerArticlesTotal = doc.getElementById("readerArticlesTotal");
					var readerArticlePrevious = doc.getElementById("readerArticlePrevious");
					var readerArticleNext = doc.getElementById("readerArticleNext");
					var readerCurrentArticle = doc.getElementById("readerCurrentArticle");

					var readerActions = doc.getElementById("readerActions");

					readContext.textNode = readerContent;
					readContext.containerNode = reader;
					readContext.pagesTotalNode = readerPagesTotal;
					readContext.readerCurrentPageNode = readerCurrentPage;

					readContext.readerArticlesTotalNode = readerArticlesTotal;
					readContext.readerCurrentArticleNode = readerCurrentArticle;

					readContext.readerActionsNode = readerActions;

					readContext.getHtmlFunction =
						function(articleIndex)
						{
							var result = grabMyBooks.getArticleTextContent(articleIndex);
							return result;
						};

					var hideReaderFunction =
						function(reader, readerBack)
						{
							return function()
							{
								reader.style.display = "none";
								readerBack.style.display = "none";
							};
						}(reader, readerBack);
					readContext.toDoOnCloseFunctions.push(hideReaderFunction);


					readerClose.addEventListener("click",
							function(readContext)
							{
								return function(e)
								{
									readContext.close();
								};
							}(readContext)
							, false);
					readerPagePrevious.addEventListener("click",
							function(readContext)
							{
								return function(e)
								{
									readContext.onPagePreviousFunction();
								};
							}(readContext)
							, false);
					readerPageNext.addEventListener("click",
							function(readContext)
							{
								return function(e)
								{
									readContext.onPageNextFunction();
								};
							}(readContext)
							, false);
					readerArticlePrevious.addEventListener("click",
							function(readContext)
							{
								return function(e)
								{
									readContext.onArticlePreviousFunction();
								};
							}(readContext)
							, false);
					readerArticleNext.addEventListener("click",
							function(readContext)
							{
								return function(e)
								{
									readContext.onArticleNextFunction();
								};
							}(readContext)
							, false);

					readerOutsideEventsAttachFunction(readContext);

					return readContext;

				};
			}(reader, readerBack, readerOutsideEventsAttachFunction, grabMyBooks.bookTabBrowser.contentDocument);



		var read = grabMyBooks.bookTabBrowser.contentDocument.getElementById("read");

		var readFunction =
			function(reader, readerBack, createReadContextFunction, showOrHideMoreActionsMenu)
			{
				return function(e)
				{
					if(grabMyBooks.articles.length == 0)
					{
						return;
					}
					showOrHideMoreActionsMenu(false);
					reader.style.display = "block";
					readerBack.style.display = "block";

					var readContext = createReadContextFunction();
					grabMyBooks.reader.read(readContext);
				};
			}(reader, readerBack, createReadContextFunction, showOrHideMoreActionsMenu);
		read.addEventListener("click",readFunction,false);



		var up = grabMyBooks.bookTabBrowser.contentDocument.getElementById("up");
		up.addEventListener("click",function(e){grabMyBooks.up();},false);

		var down = grabMyBooks.bookTabBrowser.contentDocument.getElementById("down");
		down.addEventListener("click",function(e){grabMyBooks.down();},false);

		var add = grabMyBooks.bookTabBrowser.contentDocument.getElementById("add");
		add.addEventListener("click",function(e){grabMyBooks.addEmptyArticle();},false);

		var metadata = grabMyBooks.bookTabBrowser.contentDocument.getElementById("metadata");
		metadata.addEventListener("click",function(e){grabMyBooks.bookPopin.showEditMetadata();},false);

		var cover = grabMyBooks.bookTabBrowser.contentDocument.getElementById("cover");
		cover.addEventListener("click",function(e){grabMyBooks.bookPopin.showEditCover();},false);

		var load = grabMyBooks.bookTabBrowser.contentDocument.getElementById("load");


		var removeDiv = grabMyBooks.bookTabBrowser.contentDocument.getElementById("delete");
		removeDiv.addEventListener("click",function(e){grabMyBooks.removeArticle(grabMyBooks.articleDisplayed);},false);

		var removeAllBubbleContext = new grabMyBooks.popin.BubbleContext(grabMyBooks.bookTabBrowser.contentDocument, removeDiv);
		removeAllBubbleContext.content = "<span id=\"removeAllSuggest\" title=\"Delete all the articles\">Delete all?</span>";
		removeAllBubbleContext.width = 100;
		removeAllBubbleContext.height = 20;
		removeAllBubbleContext.targetNodePositionXShift = 20;
		removeAllBubbleContext.mouseZoneWidth = 50;
		removeAllBubbleContext.mouseZoneLeftMove = -10;
		removeAllBubbleContext.shouldDisplayBubbleFunction =
			function()
			{
				var result = (grabMyBooks.articles.length>1);
				return result;
			};
		var removeAllBubble = new grabMyBooks.popin.Bubble(removeAllBubbleContext);
		var removeAllSuggestButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("removeAllSuggest");
		var removeAllClickFunction =
			function(removeAllBubble, showOrHideMoreActionsMenu)
			{
				return function(e)
				{
					grabMyBooks.removeAllArticles();
					removeAllBubble.hide();
					showOrHideMoreActionsMenu(false);
				};
			}(removeAllBubble, showOrHideMoreActionsMenu);
		removeAllSuggestButton.addEventListener("click", removeAllClickFunction, false);

		var removeAllDiv = grabMyBooks.bookTabBrowser.contentDocument.getElementById("deleteAll");
		removeAllDiv.addEventListener("click", removeAllClickFunction, false);

		var grabBookContainer = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookContainer");



		var grabBookSuggest = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggest");
		var grabBookSuggestPointer = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggestPointer");
		var grabBookSuggestPointerBorder = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggestPointerBorder");
		var grabBookSuggestMouseZone = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggestMouseZone");
		var grabBookSuggestClose = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggestClose");

		var grabBookSuggestSaveAs = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggestSaveAs");
		var grabBookSuggestSaveAsPointer = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggestSaveAsPointer");
		var grabBookSuggestSaveAsPointerBorder = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggestSaveAsPointerBorder");
		var grabBookSuggestSaveAsClose = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grabBookSuggestSaveAsClose");


		var grabDiv = grabMyBooks.bookTabBrowser.contentDocument.getElementById("grab");

		grabBookSuggest.isDisplayed = false;
		grabBookSuggestSaveAs.isDisplayed = false;

		var showOrHideGrabBookSuggestMouseZoneFunction =
			function(grabBookSuggest, grabBookSuggestSaveAs, grabBookSuggestMouseZone)
			{
				return function()
				{
					if(grabBookSuggest.isDisplayed || grabBookSuggestSaveAs.isDisplayed)
					{
						grabBookSuggestMouseZone.style.display = "block";
					}
					else
					{
						grabBookSuggestMouseZone.style.display = "none";
					}
				};
			}(grabBookSuggest, grabBookSuggestSaveAs, grabBookSuggestMouseZone);

		var showOrHideGrabBookSuggestFunction =
			function(grabBookSuggest, grabBookSuggestPointer, grabBookSuggestPointerBorder, grabBookSuggestClose, showOrHideGrabBookSuggestMouseZoneFunction)
			{
				return function(show)
				{
					grabBookSuggest.isDisplayed = show;
					var showDisplayValue = show?"block":"none";
					grabBookSuggest.style.display = showDisplayValue;
					grabBookSuggestPointer.style.display = showDisplayValue;
					grabBookSuggestPointerBorder.style.display = showDisplayValue;
					grabBookSuggestClose.style.display = showDisplayValue;
					showOrHideGrabBookSuggestMouseZoneFunction();
				};
			}(grabBookSuggest, grabBookSuggestPointer, grabBookSuggestPointerBorder, grabBookSuggestClose, showOrHideGrabBookSuggestMouseZoneFunction);

		var showOrHideGrabBookSuggestSaveAsFunction =
			function(grabBookSuggestSaveAs, grabBookSuggestSaveAsPointer, grabBookSuggestSaveAsPointerBorder, grabBookSuggestSaveAsClose, showOrHideGrabBookSuggestMouseZoneFunction)
			{
				return function(show)
				{
					grabBookSuggestSaveAs.isDisplayed = show;
					var showDisplayValue = show?"block":"none";
					grabBookSuggestSaveAs.style.display = showDisplayValue;
					grabBookSuggestSaveAsPointer.style.display = showDisplayValue;
					grabBookSuggestSaveAsPointerBorder.style.display = showDisplayValue;
					grabBookSuggestSaveAsClose.style.display = showDisplayValue;
					showOrHideGrabBookSuggestMouseZoneFunction();
				};
			}(grabBookSuggestSaveAs, grabBookSuggestSaveAsPointer, grabBookSuggestSaveAsPointerBorder, grabBookSuggestSaveAsClose, showOrHideGrabBookSuggestMouseZoneFunction);

		var showGrabBookSuggestFunction =
			function(showOrHideGrabBookSuggestFunction, showOrHideGrabBookSuggestSaveAsFunction, grabBookSuggest)
			{
				return function(e)
				{
					if(!grabMyBooks.options.saveSuggest)
					{
						return;
					}
					if(grabBookSuggest.isDisplayed)
					{
						return;
					}
					if(grabMyBooks.articles.length==0)
					{
						return;
					}

					var isCoverSet = (grabMyBooks.img.savedCoverSavedImgInfo!=null);
					var isTitleSet = !grabMyBooks.metadata.isTitleDefault(grabMyBooks.metadata);

					if(isCoverSet && isTitleSet)
					{
						return;
					}

					var suggestText = "Would you like to set ";
					if(!isTitleSet)
					{
						suggestText+="a <span id=\"titleSuggest\">title</span> ";
						if(!isCoverSet)
						{
							suggestText+="or ";
						}
					}
					if(!isCoverSet)
					{
						suggestText+="a <span id=\"coverSuggest\">cover</span> ";
					}
					suggestText+="?";

					var bookDoc = grabMyBooks.bookTabBrowser.contentDocument;
					grabMyBooks.setNodeContentFromString(bookDoc, grabBookSuggest, suggestText);

					if(!isTitleSet)
					{
						var titleSuggest = bookDoc.getElementById("titleSuggest");
						var suggestTitleClickFunction =
							function(showOrHideGrabBookSuggestFunction, showOrHideGrabBookSuggestSaveAsFunction)
							{
								return function(e)
								{
									showOrHideGrabBookSuggestFunction(false);
									showOrHideGrabBookSuggestSaveAsFunction(false);
									grabMyBooks.bookPopin.showEditMetadata();
								};
							}(showOrHideGrabBookSuggestFunction, showOrHideGrabBookSuggestSaveAsFunction);
						titleSuggest.addEventListener("click",suggestTitleClickFunction,false);
					}
					if(!isCoverSet)
					{
						var coverSuggest = bookDoc.getElementById("coverSuggest");
						var suggestCoverClickFunction =
							function(showOrHideGrabBookSuggestFunction, showOrHideGrabBookSuggestSaveAsFunction)
							{
								return function(e)
								{
									showOrHideGrabBookSuggestFunction(false);
									showOrHideGrabBookSuggestSaveAsFunction(false);
									grabMyBooks.bookPopin.showEditCover();
								};
							}(showOrHideGrabBookSuggestFunction, showOrHideGrabBookSuggestSaveAsFunction);
						coverSuggest.addEventListener("click",suggestCoverClickFunction,false);
					}

					showOrHideGrabBookSuggestFunction(true);
				}
			}(showOrHideGrabBookSuggestFunction, showOrHideGrabBookSuggestSaveAsFunction, grabBookSuggest);


		var showGrabBookSuggestSaveAsFunction =
			function(showOrHideGrabBookSuggestSaveAsFunction, grabBookSuggestSaveAs)
			{
				return function(e)
				{
					if(!grabMyBooks.options.saveSuggest)
					{
						return;
					}
					if(grabBookSuggestSaveAs.isDisplayed)
					{
						return;
					}
					if(grabMyBooks.isEmpty(grabMyBooks.options.grabToDir))
					{
						return;
					}
					if(grabMyBooks.articles.length==0)
					{
						return;
					}
					showOrHideGrabBookSuggestSaveAsFunction(true);
				}
			}(showOrHideGrabBookSuggestSaveAsFunction, grabBookSuggestSaveAs);

		var hideGrabBookSuggestFunction =
			function(showOrHideGrabBookSuggestFunction)
			{
				return function(e)
				{
					showOrHideGrabBookSuggestFunction(false);
				}
			}(showOrHideGrabBookSuggestFunction);

		var hideGrabBookSuggestSaveAsFunction =
			function(showOrHideGrabBookSuggestSaveAsFunction)
			{
				return function(e)
				{
					showOrHideGrabBookSuggestSaveAsFunction(false);
				}
			}(showOrHideGrabBookSuggestSaveAsFunction);

		grabDiv.addEventListener("mouseover", showGrabBookSuggestFunction, false);
		grabDiv.addEventListener("mouseover", showGrabBookSuggestSaveAsFunction, false);
		grabBookSuggestMouseZone.addEventListener("mouseout", hideGrabBookSuggestFunction, false);
		grabBookSuggestMouseZone.addEventListener("mouseout", hideGrabBookSuggestSaveAsFunction, false);
		grabBookSuggest.addEventListener("mouseover", showGrabBookSuggestFunction, false);
		grabBookSuggestSaveAs.addEventListener("mouseover", showGrabBookSuggestSaveAsFunction, false);
		grabBookSuggestPointer.addEventListener("mouseover", showGrabBookSuggestFunction, false);
		grabBookSuggestPointerBorder.addEventListener("mouseover", showGrabBookSuggestFunction, false);
		grabBookSuggestSaveAsPointer.addEventListener("mouseover", showGrabBookSuggestSaveAsFunction, false);
		grabBookSuggestSaveAsPointerBorder.addEventListener("mouseover", showGrabBookSuggestSaveAsFunction, false);
		grabBookSuggestClose.addEventListener("click", hideGrabBookSuggestFunction, false);
		grabBookSuggestSaveAsClose.addEventListener("click", hideGrabBookSuggestSaveAsFunction, false);

		var writeBookFunction =
			function(hideGrabBookSuggestFunction, hideGrabBookSuggestSaveAsFunction)
			{
				return function(e)
				{
					hideGrabBookSuggestFunction();
					hideGrabBookSuggestSaveAsFunction();
					var writeBookContext = new grabMyBooks.WriteBookContext(grabMyBooks.articles, true, grabMyBooks.img.savedCoverSavedImgInfo, grabMyBooks.metadata);
					grabMyBooks.writeBook(writeBookContext);
				};
			}(hideGrabBookSuggestFunction, hideGrabBookSuggestSaveAsFunction);
		grabDiv.addEventListener("click",writeBookFunction,false);

		var suggestSaveAsLink = grabMyBooks.bookTabBrowser.contentDocument.getElementById("suggestSaveAsLink");
		var writeBookSaveAsFunction =
			function(hideGrabBookSuggestFunction, hideGrabBookSuggestSaveAsFunction)
			{
				return function(e)
				{
					hideGrabBookSuggestFunction();
					hideGrabBookSuggestSaveAsFunction();
					var writeBookContext = new grabMyBooks.WriteBookContext(grabMyBooks.articles, true, grabMyBooks.img.savedCoverSavedImgInfo, grabMyBooks.metadata);
					writeBookContext.grabToDirCheckDone = true;
					grabMyBooks.writeBook(writeBookContext);
				};
			}(hideGrabBookSuggestFunction, hideGrabBookSuggestSaveAsFunction);
		suggestSaveAsLink.addEventListener("click",writeBookSaveAsFunction,false);


		var help = grabMyBooks.bookTabBrowser.contentDocument.getElementById("help");
		help.addEventListener("click",
			function(e)
			{
				grabMyBooks.openWebSite();
			}
			,false);


		var loadFunction =
			function(showOrHideMoreActionsMenuFunction)
			{
				return function(e)
				{
					showOrHideMoreActionsMenuFunction(false);
					var loadBookWithContextFunction =
						function(loadBookContext)
						{
							grabMyBooks.load(loadBookContext);
						};
					if(grabMyBooks.articles.length==0)
					{
						loadBookWithContextFunction(grabMyBooks.emptyBookLoadBookContext);
					}
					else
					{
						grabMyBooks.bookPopin.askBeforeLoadingBookWhenNotEmpty(loadBookWithContextFunction);
					}
				};
			}(showOrHideMoreActionsMenu);
		load.addEventListener("click",loadFunction,false);

		grabMyBooks.articleNode = grabMyBooks.bookTabBrowser.contentDocument.getElementById("currentArticle");

		//grabMyBooks.articleNode.addEventListener("mouseover",function(e){if(grabMyBooks.articles.length>0){grabMyBooks.articleNode.style.backgroundColor="white";}},false);
		//grabMyBooks.articleNode.addEventListener("mouseout",function(e){grabMyBooks.articleNode.style.backgroundColor="";},false);

		grabMyBooks.textAreaNode = grabMyBooks.bookTabBrowser.contentDocument.getElementById("editArea");
		grabMyBooks.contentNode = grabMyBooks.bookTabBrowser.contentDocument.getElementById("content");

		grabMyBooks.titleEditNode = grabMyBooks.bookTabBrowser.contentDocument.getElementById("titleEdit");
		grabMyBooks.title2EditNode = grabMyBooks.bookTabBrowser.contentDocument.getElementById("title2Edit");

		grabMyBooks.editSpan = grabMyBooks.bookTabBrowser.contentDocument.getElementById("editSpan");

		grabMyBooks.contentNode.removeChild(grabMyBooks.editSpan);

		var navigationBarDiv = grabMyBooks.bookTabBrowser.contentDocument.getElementById("navigationBar");


		var removeAllNodesFromNavigationBarFunction =
			function()
			{
				var i;
				while(navigationBarDiv.hasChildNodes())
				{
					navigationBarDiv.removeChild(navigationBarDiv.childNodes[0]);
				}
			};

		grabMyBooks.updateIconsForReadFunction =
			function()
			{
				removeAllNodesFromNavigationBarFunction();
				navigationBarDiv.appendChild(previousDiv);
				navigationBarDiv.appendChild(select);
				navigationBarDiv.appendChild(nextDiv);
				//navigationBarDiv.appendChild(up);
				//navigationBarDiv.appendChild(down);
				navigationBarDiv.appendChild(edit);
				navigationBarDiv.appendChild(add);
				navigationBarDiv.appendChild(removeAllBubble.getContainerNode());
				navigationBarDiv.appendChild(moreBubble.getContainerNode());
				navigationBarDiv.appendChild(grabBookContainer);
				//navigationBarDiv.appendChild(grabDiv);
				//navigationBarDiv.appendChild(removeAllDiv);
				navigationBarDiv.appendChild(help);
			};

		grabMyBooks.updateIconsForEditFunction =
			function()
			{
				removeAllNodesFromNavigationBarFunction();
				navigationBarDiv.appendChild(select);
				navigationBarDiv.appendChild(save);
				navigationBarDiv.appendChild(cancel);
			};

		grabMyBooks.updateIconsForReadFunction();
		grabMyBooks.isEditMode = false;

		grabMyBooks.bookPopin.askBeforeLoadingBookWhenNotEmpty =
			function(toDoOnOkFunction)
			{
				var popinContent = [];
				popinContent.push(
					"<b>You are about to load a new book but your current book is not empty.<br>",
					"What do you want to do?</b><br>",
					"<form id=\"loadBookForm\">",
					"	<input id=\"loadActionAppend\" type=\"radio\" checked=\"true\" name=\"loadAction\">Append new book content to current book<br>",
					"		<div id=\"loadActionEmptySubOptions\">",
					"			<input id=\"overrideMeta\" type=\"checkbox\">Get new book metadata<br>",
					"			<input id=\"overrideCover\" type=\"checkbox\">Get new book cover",
					"		</div>",
					"	<input id=\"loadActionEmpty\" type=\"radio\" name=\"loadAction\">Empty current book and load new book<br>",
					"</form>",
					grabMyBooks.menu.button("popinButtonCancel", "Cancel", "CANCEL", "popinButton"),
					grabMyBooks.menu.button("popinButtonOk", "Ok", "OK", "popinButton")
				);


				var popinJoinedContent = popinContent.join("\n");
				grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, grabMyBooks.bookPopin.content, popinJoinedContent);

				var cancelButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("popinButtonCancel");
				var okButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("popinButtonOk");

				var inputLoadActionAppend = grabMyBooks.bookTabBrowser.contentDocument.getElementById("loadActionAppend");
				var inputLoadActionEmpty = grabMyBooks.bookTabBrowser.contentDocument.getElementById("loadActionEmpty");
				var inputOverrideMeta = grabMyBooks.bookTabBrowser.contentDocument.getElementById("overrideMeta");
				var inputOverrideCover = grabMyBooks.bookTabBrowser.contentDocument.getElementById("overrideCover");

				var updateInputsFunction =
					function(inputLoadActionAppend, inputOverrideMeta, inputOverrideCover)
					{
						return function(e)
						{
							var inputsDisabled = true;
							if(inputLoadActionAppend.checked)
							{
								inputsDisabled = false;
							}
							inputOverrideMeta.disabled = inputsDisabled;
							inputOverrideCover.disabled = inputsDisabled;
						};
					}(inputLoadActionAppend, inputOverrideMeta, inputOverrideCover);

				inputLoadActionAppend.addEventListener("click",updateInputsFunction,false);
				inputLoadActionEmpty.addEventListener("click",updateInputsFunction,false);

				var getLoadBookContextFunction =
					function(inputLoadActionAppend, inputOverrideMeta, inputOverrideCover)
					{
						return function()
						{
							var append = inputLoadActionAppend.checked;
							var overrideMeta = (inputOverrideMeta.disabled || inputOverrideMeta.checked);
							var overrideCover = (inputOverrideCover.disabled || inputOverrideCover.checked);

							var result = new grabMyBooks.LoadBookContext(append, overrideMeta, overrideCover);
							return result;
						};
					}(inputLoadActionAppend, inputOverrideMeta, inputOverrideCover);

				var okFunction =
					function(getLoadBookContextFunction, toDoOnOkFunction)
					{
						return function(e)
						{
							grabMyBooks.bookPopin.hide();
							var loadContext = getLoadBookContextFunction();
							toDoOnOkFunction(loadContext);
						};
					}(getLoadBookContextFunction, toDoOnOkFunction);

				cancelButton.addEventListener("click",function(e){grabMyBooks.bookPopin.hide();},false);

				okButton.addEventListener("click",okFunction,false);

				grabMyBooks.bookPopin.setSize(400, 250);
				grabMyBooks.bookPopin.show();
			};

		grabMyBooks.bookPopin.showEditMetadata = function(showOrHideMoreActionsMenuFunction)
		{
			return function()
			{
				var popinContent = [];
				popinContent.push(
					grabMyBooks.menu.text("metaTitle", "BOOK METADATA"),
					"<div id=\"metaError\"></div>",
					"<table id=\"metaDataFormTable\">",
					"	<tr>",
					"		<td>",
					"			Title",
					"		</td>",
					"		<td>",
					"			<input id=\"bookTitle\" type=\"text\">",
					"		</td>",
					"	</tr>",
					"	<tr>",
					"		<td>",
					"			Description",
					"			<button id=\"autoDescButton\" class=\"smallButton\">Generate description</button>",
					"		</td>",
					"		<td>",
					"			<textarea id=\"bookDescription\"></textarea>",
					"		</td>",
					"	</tr>",
					"	<tr>",
					"		<td>",
					"			Author",
					"		</td>",
					"		<td>",
					"			<input id=\"bookAuthor\" type=\"text\">",
					"		</td>",
					"	</tr>",
					"	<tr>",
					"		<td>",
					"			Language",
					"		</td>",
					"		<td>",
					"			<input id=\"bookLang\" type=\"text\">",
					"		</td>",
					"	</tr>",
					"</table>"
				);
				popinContent.push(grabMyBooks.menu.button("popinButtonSave", "Save", "SAVE", "popinButton"));
				popinContent.push(grabMyBooks.menu.button("popinButtonCancel", "Cancel", "CANCEL", "popinButton"));

				var popinJoinedContent = popinContent.join("\n");
				grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, grabMyBooks.bookPopin.content, popinJoinedContent);

				var metaTitle = grabMyBooks.bookTabBrowser.contentDocument.getElementById("metaTitle");

				var saveButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("popinButtonSave");
				var cancelButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("popinButtonCancel");

				cancelButton.addEventListener("click",function(e){grabMyBooks.bookPopin.hide();},false);

				var titleInput = grabMyBooks.bookTabBrowser.contentDocument.getElementById("bookTitle");
				titleInput.value = grabMyBooks.metadata.title;

				var descriptionInput = grabMyBooks.bookTabBrowser.contentDocument.getElementById("bookDescription");
				descriptionInput.value = grabMyBooks.metadata.description;

				var autoDescButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("autoDescButton");
				var autoDescClickFunction =
					function(descriptionInput)
					{
						return function(e)
						{
							var generatedDescription = grabMyBooks.metadata.generateDescription();
							descriptionInput.value = generatedDescription;
						};
					}(descriptionInput);
				autoDescButton.addEventListener("click",autoDescClickFunction,false);

				var authorInput = grabMyBooks.bookTabBrowser.contentDocument.getElementById("bookAuthor");
				authorInput.value = grabMyBooks.metadata.author;

				var langInput = grabMyBooks.bookTabBrowser.contentDocument.getElementById("bookLang");
				langInput.value = grabMyBooks.metadata.lang;

				var metaErrorDiv = grabMyBooks.bookTabBrowser.contentDocument.getElementById("metaError");

				var validateMetadataFunction =
					function(metaErrorDiv)
					{
						return function(title, description, author, lang)
						{
							var metaErrorContent = [];
							if(grabMyBooks.isEmpty(title))
							{
								metaErrorContent.push("Title can't be empty.");
							}
							if(grabMyBooks.isEmpty(author))
							{
								metaErrorContent.push("Author can't be empty.");
							}
							if(grabMyBooks.isEmpty(lang))
							{
								metaErrorContent.push("Language can't be empty.");
							}

							if(metaErrorContent.length==0)
							{
								return true;
							}
							var metaErrorJoinedContent = metaErrorContent.join("<br>");
							grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, metaErrorDiv, metaErrorJoinedContent);
							return false;
						};
					}(metaErrorDiv);

				var saveFunction = function(titleInput, descriptionInput, authorInput, langInput, validateMetadataFunction)
				{
					return function(e)
					{
						var titleValue = titleInput.value;
						var descriptionValue = descriptionInput.value;
						var authorValue = authorInput.value;
						var langValue = langInput.value;

						if(!validateMetadataFunction(titleValue, descriptionValue, authorValue, langValue))
						{
							return;
						}

						grabMyBooks.metadata.title = titleValue;
						grabMyBooks.metadata.author = authorValue;
						grabMyBooks.metadata.lang = langValue;
						if(grabMyBooks.isEmpty(descriptionValue))
						{
							grabMyBooks.metadata.description = null;
						}
						else
						{
							grabMyBooks.metadata.description = descriptionValue;
						}
						grabMyBooks.autoSave.markModified();
						grabMyBooks.bookPopin.hide();
					};
				}(titleInput, descriptionInput, authorInput, langInput, validateMetadataFunction);

				saveButton.addEventListener("click",saveFunction,false);

				showOrHideMoreActionsMenuFunction(false);
				grabMyBooks.bookPopin.setSize(grabMyBooks.bookPopin.defaultWidth, 230);
				grabMyBooks.bookPopin.show();
			};
		}(showOrHideMoreActionsMenu);


		grabMyBooks.bookPopin.showEditCover = function(showOrHideMoreActionsMenu)
		{
			return function()
			{
				var editCoverContent = [];
				editCoverContent.push(
					grabMyBooks.menu.text("coverLabel", "COVER"),
					"<div id=\"coverTableContainer\">",
					"	<table id=\"coverTable\">",
					"		<tr>",
					"			<th id=\"coverImg\" rowspan=\"3\">",
					"				no cover",
					"			</th>",
					"			<td>",
				                    grabMyBooks.menu.button("coverFromCache", "From cache", "SELECT FROM BOOK"),
					"			</td>",
					"		</tr>",
					"		<tr>",
					"			<td>",
					                grabMyBooks.menu.button("coverFromFile", "Select a locale file", "SELECT FILE"),
					"			</td>",
					"		</tr>",
					"		<tr>",
					"			<td>",
					                grabMyBooks.menu.button("noCover", "No cover", "NO COVER"),
					"			</td>",
					"		</tr>",
					"	</table>",
					"	<div id=\"cacheCoversContainer\">",
					"	</div>",
					"</div>",
					grabMyBooks.menu.button("popinButtonSave", "Save", "SAVE", "popinButton"),
					grabMyBooks.menu.button("popinButtonCancel", "Cancel", "CANCEL", "popinButton"),
					grabMyBooks.menu.button("popinButtonOk", "Ok", "OK", "popinButton"),
					grabMyBooks.menu.button("popinButtonCancel2", "Cancel", "CANCEL", "popinButton")
				);
				var editCoverJoinedContent = editCoverContent.join("\n");
				grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, grabMyBooks.bookPopin.content, editCoverJoinedContent);

				var coverLabel = grabMyBooks.bookTabBrowser.contentDocument.getElementById("coverLabel");
				var saveButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("popinButtonSave");
				var cancelButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("popinButtonCancel");
				var okButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("popinButtonOk");
				var cancelButton2 = grabMyBooks.bookTabBrowser.contentDocument.getElementById("popinButtonCancel2");
				var imgFromCacheButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("coverFromCache");
				var imgFromFileButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("coverFromFile");
				var coverContainer = grabMyBooks.bookTabBrowser.contentDocument.getElementById("coverImg");
				var noCoverButton = grabMyBooks.bookTabBrowser.contentDocument.getElementById("noCover");
				var coverTable = grabMyBooks.bookTabBrowser.contentDocument.getElementById("coverTable");

				okButton.style.display = "none";
				cancelButton2.style.display = "none";

				var buttonGroup = new Object();
				buttonGroup.save = saveButton;
				buttonGroup.ok = okButton;
				buttonGroup.cancel = cancelButton;
				buttonGroup.cancel2 = cancelButton2;

				var showCoverFunction =
					function(coverContainer)
					{
						return function(savedImgInfo)
						{
							while(coverContainer.childNodes.length>0)
							{
								coverContainer.removeChild(coverContainer.childNodes[0]);
							}
							if(savedImgInfo == null)
							{
								grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, coverContainer, "no cover");
								grabMyBooks.img.coverSavedImgInfo = null;
								return;
							}
							grabMyBooks.img.coverSavedImgInfo = savedImgInfo;
							var coverObject = grabMyBooks.ext.getCoverHtmlObject(coverContainer, savedImgInfo);
							coverObject.style.height="195px";
							coverObject.style.maxWidth="145px";
						};
					}(coverContainer);

				showCoverFunction(grabMyBooks.img.savedCoverSavedImgInfo);

				var noCoverFunction = function(showCoverFunction)
				{
					return function(e)
					{
						showCoverFunction(null);
					};
				}(showCoverFunction);
				noCoverButton.addEventListener("click",noCoverFunction,false);


				var saveCoverFunction =
					function(e)
					{
						grabMyBooks.img.savedCoverSavedImgInfo = grabMyBooks.img.coverSavedImgInfo;
						grabMyBooks.autoSave.markModified();
						grabMyBooks.bookPopin.hide();
					};

				saveButton.addEventListener("click",saveCoverFunction,false);
				cancelButton.addEventListener("click",function(e){grabMyBooks.bookPopin.hide();},false);

				var bookImgsContainer = grabMyBooks.bookTabBrowser.contentDocument.getElementById("cacheCoversContainer");

				var showCoverMenuFunction =
					function(bookImgsContainer, coverTable, buttonGroup)
					{
						return function()
						{
							coverTable.style.display="block";
							bookImgsContainer.style.display="none";
							buttonGroup.save.style.display = "inline";
							buttonGroup.cancel.style.display = "inline";
							buttonGroup.ok.style.display = "none";
							buttonGroup.cancel2.style.display = "none";
						};
					}(bookImgsContainer, coverTable, buttonGroup);

				var showBookImgsFunction =
					function(bookImgsContainer, coverTable, buttonGroup)
					{
						return function()
						{
							coverTable.style.display="none";
							bookImgsContainer.style.display="block";
							buttonGroup.save.style.display = "none";
							buttonGroup.cancel.style.display = "none";
							buttonGroup.ok.style.display = "inline";
							buttonGroup.cancel2.style.display = "inline";
						};
					}(bookImgsContainer, coverTable, buttonGroup);




				var showSelectCoverFromBookInfo = new Object();
				showSelectCoverFromBookInfo.canvasLoadedInDiv = null;
				showSelectCoverFromBookInfo.bookImgDivs = null;
				showSelectCoverFromBookInfo.savedImgInfoTab = null;
				showSelectCoverFromBookInfo.selectedBookImgSavedInfo = null;
				showSelectCoverFromBookInfo.isSavedImgInfoSelected =
					function(savedImgInfo)
					{
						var result = savedImgInfo.equals(this.selectedBookImgSavedInfo);
						return result;
					};


				var hideBookImgsFunction =
					function(showCoverMenuFunction)
					{
						return function(e)
						{
							showCoverMenuFunction();
						};
					}(showCoverMenuFunction);

				var validateBookImgSelection =
					function(showSelectCoverFromBookInfo, hideBookImgsFunction)
					{
						return function(e)
						{
							if(showSelectCoverFromBookInfo.selectedBookImgSavedInfo != null && !showSelectCoverFromBookInfo.selectedBookImgSavedInfo.equals(grabMyBooks.img.coverSavedImgInfo))
							{
								grabMyBooks.img.coverSavedImgInfo = showSelectCoverFromBookInfo.selectedBookImgSavedInfo;
								showCoverFunction(grabMyBooks.img.coverSavedImgInfo);
							}
							else if(showSelectCoverFromBookInfo.selectedBookImgSavedInfo == null && grabMyBooks.img.coverSavedImgInfo != null)
							{
								grabMyBooks.img.coverSavedImgInfo = null;
								showCoverFunction(grabMyBooks.img.coverSavedImgInfo);
							}
							hideBookImgsFunction();
						};
					}(showSelectCoverFromBookInfo, hideBookImgsFunction);

				okButton.addEventListener("click",validateBookImgSelection,false);
				cancelButton2.addEventListener("click",hideBookImgsFunction,false);


				var highLightSelectedCoverFromBookImgFunction =
					function(showSelectCoverFromBookInfo)
					{
						return function()
						{
							var currentSavedImgInfo;
							var currentBookImgDiv;
							var imgDivCount = showSelectCoverFromBookInfo.savedImgInfoTab.length;
							for(var i_bookImgDiv=0; i_bookImgDiv<imgDivCount; i_bookImgDiv++)
							{
								currentSavedImgInfo = showSelectCoverFromBookInfo.savedImgInfoTab[i_bookImgDiv];
								currentBookImgDiv = showSelectCoverFromBookInfo.bookImgDivs[i_bookImgDiv];
								if(showSelectCoverFromBookInfo.isSavedImgInfoSelected(currentSavedImgInfo))
								{
									currentBookImgDiv.style.borderColor="blue";
									currentBookImgDiv.style.borderWidth="3";
								}
								else
								{
									currentBookImgDiv.style.borderColor="gray";
									currentBookImgDiv.style.borderWidth="1";
								}
							}
						};
					}(showSelectCoverFromBookInfo);



				var showVisibleImgsForSelectCoverFromBookFunction =
					function(showSelectCoverFromBookInfo, highLightSelectedCoverFromBookImgFunction)
					{
						return function()
						{
							var imgDivCount = showSelectCoverFromBookInfo.bookImgDivs.length;
							var currentBookImgDiv;
							var currentCanvasLoaded;
							var currentSavedImgInfo;
							var currentBookImgClickFunction;
							for(var i_bookImgDiv=0; i_bookImgDiv<imgDivCount; i_bookImgDiv++)
							{
								currentBookImgDiv = showSelectCoverFromBookInfo.bookImgDivs[i_bookImgDiv];
								currentCanvasLoaded = showSelectCoverFromBookInfo.canvasLoadedInDiv[i_bookImgDiv];
								if(currentCanvasLoaded)
								{
									continue;
								}
								currentSavedImgInfo = showSelectCoverFromBookInfo.savedImgInfoTab[i_bookImgDiv];
								grabMyBooks.ext.getCoverHtmlObject(currentBookImgDiv, currentSavedImgInfo);

								currentBookImgClickFunction = function(showSelectCoverFromBookInfo, highLightSelectedCoverFromBookImgFunction, savedImgInfo)
								{
									return function(e)
									{
										if(showSelectCoverFromBookInfo.isSavedImgInfoSelected(savedImgInfo))
										{
											showSelectCoverFromBookInfo.selectedBookImgSavedInfo = null;
										}
										else
										{
											showSelectCoverFromBookInfo.selectedBookImgSavedInfo = savedImgInfo;
										}
										highLightSelectedCoverFromBookImgFunction();
									};
								}(showSelectCoverFromBookInfo, highLightSelectedCoverFromBookImgFunction, currentSavedImgInfo);
								currentBookImgDiv.addEventListener("click",currentBookImgClickFunction,false);
							}
							showSelectCoverFromBookInfo.selectedBookImgSavedInfo = grabMyBooks.img.coverSavedImgInfo;
							highLightSelectedCoverFromBookImgFunction();
						};
					}(showSelectCoverFromBookInfo, highLightSelectedCoverFromBookImgFunction);

				var showSelectCoverFromBookFunction =
					function(bookImgsContainer, showCoverFunction, showBookImgsFunction, showSelectCoverFromBookInfo, showVisibleImgsForSelectCoverFromBookFunction)
					{
						return function(e)
						{
							var applyImgToContentForWriteResult = grabMyBooks.img.applyImgToContentForWrite(false, false, grabMyBooks.articles, grabMyBooks.img.savedCoverSavedImgInfo);
							showSelectCoverFromBookInfo.savedImgInfoTab = applyImgToContentForWriteResult.savedImgInfoToCopyTab;
							showSelectCoverFromBookInfo.canvasLoadedInDiv = [];
							showSelectCoverFromBookInfo.bookImgDivs = [];

							if(applyImgToContentForWriteResult.savedImgInfoToCopyTab.length==0)
							{
								return;
							}
							var content = [];
							for(var i_bookImg=0; i_bookImg<applyImgToContentForWriteResult.savedImgInfoToCopyTab.length; i_bookImg++)
							{
								content.push(
									"<div class=\"bookImg\">",
									"</div>"
								);
								showSelectCoverFromBookInfo.canvasLoadedInDiv[i_bookImg] = false;
							}
							var joinedContent = content.join("\n");
							grabMyBooks.setNodeContentFromString(grabMyBooks.bookTabBrowser.contentDocument, bookImgsContainer, joinedContent);

							var bookImgXPathResult = grabMyBooks.bookTabBrowser.contentDocument.evaluate( "div[@class='bookImg']" ,bookImgsContainer, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
							var bookImgCount = bookImgXPathResult.snapshotLength;
							var currentBookImgDiv;
							for(var i_bookImgDiv=0; i_bookImgDiv<bookImgCount; i_bookImgDiv++)
							{
								currentBookImgDiv = bookImgXPathResult.snapshotItem(i_bookImgDiv);
								showSelectCoverFromBookInfo.bookImgDivs[i_bookImgDiv] = currentBookImgDiv;
							}
							showBookImgsFunction();
							showVisibleImgsForSelectCoverFromBookFunction();
						};
					}(bookImgsContainer, showCoverFunction, showBookImgsFunction, showSelectCoverFromBookInfo, showVisibleImgsForSelectCoverFromBookFunction);

				imgFromCacheButton.addEventListener("click",showSelectCoverFromBookFunction,false);

				var selectCoverFunction =
					function(showCoverFunction)
					{
						return function(e)
						{
							var toDoWithFileFunction =
								function(showCoverFunction)
								{
									return function(imgFile)
									{
										var imgFileName = grabMyBooks.ext.leafName(imgFile).toLowerCase();
										var imgUri = grabMyBooks.ext.getFilePickerFilePath(grabMyBooks.img.imgPicker, imgFile);
										imgUri = grabMyBooks.ext.onSelectedCoverImgPath(imgUri);
										if(!grabMyBooks.img.isImgFileNameAccepted(imgFileName, true))
										{
											return;
										}
										grabMyBooks.img.removeSavedImgInfo(imgUri);
										var savedImgInfo = grabMyBooks.img.handleImg(imgUri, true);
										showCoverFunction(savedImgInfo);
									};
								}(showCoverFunction);
							var imgFilePicker = grabMyBooks.img.getImgPicker();
							grabMyBooks.ext.showFilePicker(imgFilePicker, toDoWithFileFunction);
						};
					}(showCoverFunction);

				imgFromFileButton.addEventListener("click",selectCoverFunction,false);

				showOrHideMoreActionsMenu(false);
				grabMyBooks.bookPopin.setSize(500, 300);
				grabMyBooks.bookPopin.show();
			}
		}(showOrHideMoreActionsMenu);


		grabMyBooks.ext.onFillBook();
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.showAndEditLastArticleBook = function()
{
	grabMyBooks.showBook(
			function()
			{
				grabMyBooks.showArticle(grabMyBooks.articles.length-1);
				grabMyBooks.editMode();
			}
		);
};

grabMyBooks.showAndEditArticleBook = function(articleIndex)
{
	grabMyBooks.showBook(
			function()
			{
				grabMyBooks.showArticle(articleIndex);
				grabMyBooks.editMode();
			}
		);
};

grabMyBooks.showBook = function(onBookLoad)
{
	try
	{
		if(grabMyBooks.bookTabBrowser == null)
		{
			grabMyBooks.bookTab = gBrowser.addTab();
			grabMyBooks.bookTabBrowser = gBrowser.getBrowserForTab(grabMyBooks.bookTab);

			var onShowBookLoadFunction =
				function(onBookLoad)
				{
					return function(e)
					{
						 grabMyBooks.fillBook();
						  grabMyBooks.showArticle(0);
						  grabMyBooks.ext.setTabLabel(grabMyBooks.bookTab, "GrabMyBooks - My Book");
						  gBrowser.setIcon(grabMyBooks.bookTab,"chrome://grabMyBooks/content/icons/bookReader.png");

						  if(onBookLoad != undefined)
						  {
						  	onBookLoad();
						  }
					};
				}(onBookLoad);

			grabMyBooks.bookTabBrowser.addEventListener("load", onShowBookLoadFunction, true);
		}
		else
		{
			//grabMyBooks.fillBook();
			if(onBookLoad != undefined)
		    {
		  	    onBookLoad();
		    }
		}
		grabMyBooks.ext.setSelectedTab(grabMyBooks.bookTab);
	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.onFirefoxLoad = function(event)
{
	try
	{
		document.getElementById("contentAreaContextMenu")
	          .addEventListener("popupshowing", function (e){ grabMyBooks.showFirefoxContextMenu(e); }, false);


		gBrowser.tabContainer.addEventListener("TabClose",
											function(event)
											{
												if(event.target.linkedBrowser == grabMyBooks.bookTabBrowser)
												{
													grabMyBooks.bookTabBrowser = null;
													grabMyBooks.bookTab = null;
												}
												else if(event.target.linkedBrowser == grabMyBooks.optionState.tabBrowser)
												{
													grabMyBooks.optionState.tabBrowser = null;
													grabMyBooks.optionState.tab = null;
												}
												else if(event.target.linkedBrowser == grabMyBooks.feeds.tabBrowser)
												{
													grabMyBooks.feeds.tabBrowser = null;
													grabMyBooks.feeds.tab = null;
												}
												else if(event.target.linkedBrowser == grabMyBooks.newsPapers.tabBrowser)
												{
													grabMyBooks.newsPapers.stopAllLoadings();
													grabMyBooks.newsPapers.tabBrowser = null;
													grabMyBooks.newsPapers.tab = null;
												}
											},
											false);

	}
	catch(e)
    {
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.isValidLinkNode = function(node)
{
	if (node == null || node.localName.toUpperCase() != "A" || !node.hasAttribute('href'))
	{
		return false;
	}
    var hrefValue = node.getAttribute('href');
    if(grabMyBooks.isEmpty(hrefValue))
    {
    	return false;
    }
    hrefValue = hrefValue.trim().toLowerCase();
    if(hrefValue.indexOf("javascript:")==0)
    {
    	return false;
    }
    if(hrefValue.indexOf("#")==0)
    {
    	return false;
    }
	return true;
};

grabMyBooks.isSomethingSelected = function()
{
	var selection = content.getSelection();
	var result = (selection!=null && !grabMyBooks.isEmpty(selection.toString()));
	return result;
};

grabMyBooks.areThereAtLeastTwoLinksSelected = function()
{
	var tabBrowser = gBrowser.getBrowserForTab(gBrowser.selectedTab);
	var doc = tabBrowser.contentDocument;

	if(!grabMyBooks.isSomethingSelected())
	{
		return false;
	}
	var selectionNode = grabMyBooks.getSelectionAsNode(doc);
	var selectionNodeDoc = grabMyBooks.getDefaultDocument();

	var linkCount = grabMyBooks.xml.xPathQueryCount("//a", selectionNodeDoc, selectionNode);
	var result = (linkCount>1);
	return result;
};

grabMyBooks.isAGrabMyBooksPageOnSelectedTab = function()
{
	var result = ((grabMyBooks.bookTab!=null && gBrowser.selectedTab == grabMyBooks.bookTab) || (grabMyBooks.optionState.tab!=null && gBrowser.selectedTab == grabMyBooks.optionState.tab) || (grabMyBooks.feeds.tab!=null && gBrowser.selectedTab == grabMyBooks.feeds.tab) || (grabMyBooks.newsPapers.tab!=null && gBrowser.selectedTab == grabMyBooks.newsPapers.tab));
	return result;
};

grabMyBooks.showFirefoxContextMenu = function(event)
{
	try
	{
  	var toShow = false;
  	var node = null;
  	node = grabMyBooks.getHrefNodeInNodeOrAncestors(gContextMenu.target);

    if(node != null)
    {
    	toShow = grabMyBooks.isValidLinkNode(node);
    	grabMyBooks.articleLink = node.href;
  	}
  	else
  	{
  		grabMyBooks.articleLink = null;
  	}
  	var aGrabMyBooksPageIsOnSelectedTab = grabMyBooks.isAGrabMyBooksPageOnSelectedTab();

  	document.getElementById("grabMyBooksGrabMyBook").hidden = (grabMyBooks.options.contextMenuItemGrouped || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGrabPage").hidden = (grabMyBooks.options.contextMenuItemGrouped || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGrabLink").hidden = (grabMyBooks.options.contextMenuItemGrouped || !toShow || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGrabSelection").hidden = (grabMyBooks.options.contextMenuItemGrouped || !grabMyBooks.isSomethingSelected() || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGrabSelectedLinks").hidden = (grabMyBooks.options.contextMenuItemGrouped || !grabMyBooks.isSomethingSelected() || aGrabMyBooksPageIsOnSelectedTab || !grabMyBooks.areThereAtLeastTwoLinksSelected());


  	document.getElementById("grabMyBooksGroupedMenu").hidden = (!grabMyBooks.options.contextMenuItemGrouped || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGroupedGrabMyBook").hidden = (!grabMyBooks.options.contextMenuItemGrouped || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGroupedGrabPage").hidden = (!grabMyBooks.options.contextMenuItemGrouped || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGroupedGrabLink").hidden = (!grabMyBooks.options.contextMenuItemGrouped || !toShow || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGroupedGrabSelection").hidden = (!grabMyBooks.options.contextMenuItemGrouped || !grabMyBooks.isSomethingSelected() || aGrabMyBooksPageIsOnSelectedTab);
  	document.getElementById("grabMyBooksGroupedGrabSelectedLinks").hidden = (!grabMyBooks.options.contextMenuItemGrouped || !grabMyBooks.isSomethingSelected() || aGrabMyBooksPageIsOnSelectedTab || !grabMyBooks.areThereAtLeastTwoLinksSelected());

  	}
  	catch(e)
     {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
     }
};

grabMyBooks.optionState = function()
{
	this.tab = null;
	this.tabBrowser = null;
};

grabMyBooks.highLightSelectedRule = function()
{
	grabMyBooks.deHighLightSelectedRule();
	var ruleIndex = grabMyBooks.currentFormDetectionRule;
	if(ruleIndex == null)
	{
		return;
	}
	grabMyBooks.ruleList.childNodes[ruleIndex].className+=" divBold";
};

grabMyBooks.deHighLightSelectedRule = function()
{
	var ruleIndex = grabMyBooks.currentFormDetectionRule;
	if(ruleIndex == null)
	{
		return;
	}
	grabMyBooks.ruleList.childNodes[ruleIndex].className="ruleButton";
};

grabMyBooks.showAndEditRule = function(i_rules)
{
	grabMyBooks.deHighLightSelectedRule();
	grabMyBooks.currentFormDetectionRule = i_rules;
	grabMyBooks.showRuleDetectionForm();
	grabMyBooks.fillDetectionForm(i_rules);
	grabMyBooks.siteDetectionRuleDelete.style.visibility="visible";
	grabMyBooks.siteDetectionRuleUp.style.visibility="visible";
	grabMyBooks.siteDetectionRuleDown.style.visibility="visible";
};

grabMyBooks.fillRules = function()
{
	var ruleHtmlContent = [];
	var currentRuleElement;
	//var currentDeleteRuleElement;
	//var currentDeleteOnclickFunction;
	var currentRuleOnclickFunction;
	while(grabMyBooks.ruleList.hasChildNodes())
	{
		grabMyBooks.ruleList.removeChild(grabMyBooks.ruleList.childNodes[0]);
	}
	for(var i_rules=0; i_rules<grabMyBooks.siteDetectionRules.length; i_rules++)
	{
		currentRuleElement = grabMyBooks.optionState.tabBrowser.contentDocument.createElement("div");
		currentRuleElement.appendChild(grabMyBooks.optionState.tabBrowser.contentDocument.createTextNode(grabMyBooks.siteDetectionRules[i_rules].name));
		currentRuleElement.setAttribute("class","ruleButton");
		//currentDeleteRuleElement = grabMyBooks.optionState.tabBrowser.contentDocument.createElement("div");
		//currentDeleteRuleElement.appendChild(grabMyBooks.optionState.tabBrowser.contentDocument.createTextNode("X"));
		//currentDeleteRuleElement.setAttribute("class","deleteRuleButton");

		grabMyBooks.ruleList.appendChild(currentRuleElement);
		//grabMyBooks.ruleList.appendChild(currentDeleteRuleElement);



		/*currentDeleteOnclickFunction =
			function(i_rules)
			{
				return function(e)
				{
					grabMyBooks.deleteRule(i_rules);
				}
			}(i_rules);*/

		currentRuleOnclickFunction =
			function(i_rules)
			{
				return function(e)
				{
					grabMyBooks.showAndEditRule(i_rules);
				}
			}(i_rules);

		//currentDeleteRuleElement.addEventListener("click",currentDeleteOnclickFunction,false);
		currentRuleElement.addEventListener("click",currentRuleOnclickFunction,false);

	}
};

grabMyBooks.moveRuleUp = function()
{
	var ruleIndex = grabMyBooks.currentFormDetectionRule;
	if(ruleIndex == null || ruleIndex==0)
	{
		return;
	}
	var tempRule = grabMyBooks.siteDetectionRules[ruleIndex-1];
	grabMyBooks.siteDetectionRules[ruleIndex-1] = grabMyBooks.siteDetectionRules[ruleIndex];
	grabMyBooks.siteDetectionRules[ruleIndex] = tempRule;
	grabMyBooks.fillRules();
	grabMyBooks.currentFormDetectionRule -= 1;
	grabMyBooks.highLightSelectedRule();
	grabMyBooks.saveDetectionRules();
};

grabMyBooks.moveRuleDown = function()
{
	var ruleIndex = grabMyBooks.currentFormDetectionRule;
	if(ruleIndex == null || ruleIndex==grabMyBooks.siteDetectionRules.length-1)
	{
		return;
	}
	var tempRule = grabMyBooks.siteDetectionRules[ruleIndex+1];
	grabMyBooks.siteDetectionRules[ruleIndex+1] = grabMyBooks.siteDetectionRules[ruleIndex];
	grabMyBooks.siteDetectionRules[ruleIndex] = tempRule;
	grabMyBooks.fillRules();
	grabMyBooks.currentFormDetectionRule += 1;
	grabMyBooks.highLightSelectedRule();
	grabMyBooks.saveDetectionRules();
};

grabMyBooks.deleteRule = function(ruleIndex)
{
	grabMyBooks.hideRuleDetectionForm();
	if(grabMyBooks.siteDetectionRules.length==0 || ruleIndex<0)
	{
		return;
	}
	grabMyBooks.currentFormDetectionRule = null;
	grabMyBooks.siteDetectionRules.splice(ruleIndex, 1);
	grabMyBooks.fillRules();
	grabMyBooks.saveDetectionRules();
};

grabMyBooks.siteDetectionRules = [];
grabMyBooks.siteDetectionRule = function(name,urlRegExp,xpath)
{
	this.name = name;
	this.urlRegExp = urlRegExp;
	this.xpath = xpath;
	this.linkInsteadOfPageUrlXpath = null;
	this.nextPageUrlXpath = null;

	this.isUrlDetected = function(url)
	{
		var reg = new RegExp(this.urlRegExp, "gi");
		//grabMyBooks.ext.alert('regexp: '+reg.test(url)+", "+this.urlRegExp+", "+url);
		return reg.test(url);
	}

	this.identify = function(url)
	{
		return this.isUrlDetected(url);
	}
};

grabMyBooks.showOptions = function(onOptionsLoad)
{
	if(grabMyBooks.optionState.tabBrowser == null)
	{
		grabMyBooks.optionState.tab = gBrowser.addTab();
		grabMyBooks.optionState.tabBrowser = gBrowser.getBrowserForTab(grabMyBooks.optionState.tab);
		var onOptionsLoadFunction =
			function(onOptionsLoad)
			{
				return function(e)
				{
					grabMyBooks.optionState.tab.label="GrabMyBooks - Options";
					gBrowser.setIcon(grabMyBooks.optionState.tab,"chrome://grabMyBooks/content/icons/bookTools.png");
					grabMyBooks.fillOptions();
					if(!grabMyBooks.isEmptyObject(onOptionsLoad))
					{
						onOptionsLoad();
					}
				};
			}(onOptionsLoad);
		grabMyBooks.optionState.tabBrowser.addEventListener("load", onOptionsLoadFunction, true);
	}
	else
	{
		if(!grabMyBooks.isEmptyObject(onOptionsLoad))
		{
			onOptionsLoad();
		}
	}
	grabMyBooks.ext.setSelectedTab(grabMyBooks.optionState.tab);
};

grabMyBooks.testRegexp = function(regexpString)
{
	try
	{
		new RegExp(regexpString, "gi");
	}
	catch(e)
 	{
 		return false;
 	}
 	return true;
};

grabMyBooks.testXpath = function(xPathString)
{
	try
	{
		var document = grabMyBooks.optionState.tabBrowser.contentDocument;
		document.evaluate( xPathString ,document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	}
	catch(e)
 	{
 		return false;
 	}
 	return true;
};

grabMyBooks.validateEditedSiteDetectionRule = function()
{
	grabMyBooks.setNodeContentFromString(grabMyBooks.optionState.tabBrowser.contentDocument, grabMyBooks.addRuleError, "");

	var siteDetectionRuleForm = grabMyBooks.addRuleForm;
	var errorContent = "";
	if(grabMyBooks.isEmpty(siteDetectionRuleForm.siteDetectionRuleName.value))
	{
		errorContent+="<div>Name of rule can't be empty.</div>";
	}
	if(grabMyBooks.isEmpty(siteDetectionRuleForm.regexp.value))
	{
		errorContent+="<div>The url detection regular expression is not correctly filled.</div>";
	}
	else if(!grabMyBooks.testRegexp(siteDetectionRuleForm.regexp.value))
	{
     	errorContent+="<div>The url regular expression is not correct.</div>";
	}
	if(!grabMyBooks.isEmpty(siteDetectionRuleForm.customXPath.value) && !grabMyBooks.testXpath(siteDetectionRuleForm.customXPath.value))
	{
		errorContent+="<div>The grab node xPath expression is not correct.</div>";
	}
	if(!grabMyBooks.isEmpty(siteDetectionRuleForm.linkInsteadOfPageUrlXpath.value) && !grabMyBooks.testXpath(siteDetectionRuleForm.linkInsteadOfPageUrlXpath.value))
	{
		errorContent+="<div>The link instead of page xPath expression is not correct.</div>";
	}
	if(!grabMyBooks.isEmpty(siteDetectionRuleForm.nextPageUrlXpath.value) && !grabMyBooks.testXpath(siteDetectionRuleForm.nextPageUrlXpath.value))
	{
		errorContent+="<div>The next page xPath expression is not correct.</div>";
	}
	grabMyBooks.setNodeContentFromString(grabMyBooks.optionState.tabBrowser.contentDocument, grabMyBooks.addRuleError, errorContent);

	return grabMyBooks.isEmpty(errorContent);
};

grabMyBooks.getSelectedRadioValue = function(radioTab)
{
	var i_radio;
	for(i_radio=0;i_radio<radioTab.length;i_radio++)
	{
		if(radioTab[i_radio].checked)
		{
			return radioTab[i_radio].value;
		}
	}
	return null;
};

grabMyBooks.currentFormDetectionRule = null;

grabMyBooks.addEditedSiteDetectionRule = function()
{
	try
	{
		if(!grabMyBooks.validateEditedSiteDetectionRule())
		{
			return false;
		}
		var siteDetectionRuleForm = grabMyBooks.addRuleForm;

		if(grabMyBooks.currentFormDetectionRule == null)
		{
			var newRule = new grabMyBooks.siteDetectionRule(siteDetectionRuleForm.siteDetectionRuleName.value, siteDetectionRuleForm.regexp.value, siteDetectionRuleForm.customXPath.value);
			newRule.linkInsteadOfPageUrlXpath = siteDetectionRuleForm.linkInsteadOfPageUrlXpath.value;
			newRule.nextPageUrlXpath = siteDetectionRuleForm.nextPageUrlXpath.value;
			grabMyBooks.siteDetectionRules.push(newRule);
		}
		else
		{
			var editedRule = new grabMyBooks.siteDetectionRule(siteDetectionRuleForm.siteDetectionRuleName.value, siteDetectionRuleForm.regexp.value, siteDetectionRuleForm.customXPath.value);
			editedRule.linkInsteadOfPageUrlXpath = siteDetectionRuleForm.linkInsteadOfPageUrlXpath.value;
			editedRule.nextPageUrlXpath = siteDetectionRuleForm.nextPageUrlXpath.value;
			grabMyBooks.siteDetectionRules[grabMyBooks.currentFormDetectionRule] = editedRule;
			grabMyBooks.currentFormDetectionRule = null;
		}
		grabMyBooks.fillRules();
		grabMyBooks.saveDetectionRules();
		return true;
	}
	catch(e)
    {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
        return false;
    }
};

grabMyBooks.fillDetectionForm = function(detectionRuleIndex)
{
	grabMyBooks.fillDetectionForm(detectionRuleIndex, null, null, null, null, null);
};

grabMyBooks.fillDetectionForm = function(detectionRuleIndex, ruleName, ruleRegExp, ruleXPath, linkInsteadOfPageUrlXpath, nextPageUrlXpath)
{
	var siteDetectionRuleForm = grabMyBooks.addRuleForm;
	if(detectionRuleIndex != null)
	{
		siteDetectionRuleForm.siteDetectionRuleName.value = grabMyBooks.siteDetectionRules[detectionRuleIndex].name;
		siteDetectionRuleForm.regexp.value = grabMyBooks.siteDetectionRules[detectionRuleIndex].urlRegExp;
		siteDetectionRuleForm.customXPath.value = grabMyBooks.siteDetectionRules[detectionRuleIndex].xpath;
		siteDetectionRuleForm.linkInsteadOfPageUrlXpath.value = grabMyBooks.siteDetectionRules[detectionRuleIndex].linkInsteadOfPageUrlXpath;
		siteDetectionRuleForm.nextPageUrlXpath.value = grabMyBooks.siteDetectionRules[detectionRuleIndex].nextPageUrlXpath;
	}

	if(!grabMyBooks.isEmpty(ruleName))
	{
		siteDetectionRuleForm.siteDetectionRuleName.value = ruleName;
	}
	if(!grabMyBooks.isEmpty(ruleRegExp))
	{
		siteDetectionRuleForm.regexp.value = ruleRegExp;
	}
	if(!grabMyBooks.isEmpty(ruleXPath))
	{
		siteDetectionRuleForm.customXPath.value = ruleXPath;
	}
	if(!grabMyBooks.isEmpty(linkInsteadOfPageUrlXpath))
	{
		siteDetectionRuleForm.linkInsteadOfPageUrlXpath.value = linkInsteadOfPageUrlXpath;
	}
	if(!grabMyBooks.isEmpty(nextPageUrlXpath))
	{
		siteDetectionRuleForm.nextPageUrlXpath.value = nextPageUrlXpath;
	}
};

grabMyBooks.showRuleDetectionForm = function()
{
	try
	{
		grabMyBooks.hideRuleDetectionForm();
		grabMyBooks.addRuleForm.reset();
		grabMyBooks.setNodeContentFromString(grabMyBooks.optionState.tabBrowser.contentDocument, grabMyBooks.addRuleError, "");
		grabMyBooks.siteDetectionRuleDiv.style.display="block";
		grabMyBooks.highLightSelectedRule();
	}
	catch(ex)
	{
		grabMyBooks.ext.alert(ex+'::'+ex.lineNumber);
	}
};

grabMyBooks.hideRuleDetectionForm = function()
{
	try
	{
		grabMyBooks.siteDetectionRuleDiv.style.display="none";
		grabMyBooks.deHighLightSelectedRule();
	}
	catch(ex)
	{
		grabMyBooks.ext.alert(ex+'::'+ex.lineNumber);
	}
};

grabMyBooks.ext.getCssForOptionsPage = function()
{
	var resultTab = [];
	resultTab.push(
	    grabMyBooks.popin.css(),
		"			body {font-family:Helvetica,Arial,sans-serif;font-size:0.9em;background-image:url(chrome://grabMyBooks/content/icons/menu/bg.png);}",
		"			#content {border-radius:15px;background-color:white;text-align:left;width:70%;height:90%;overflow:auto;margin-top:10px;margin-left:auto;margin-right:auto;padding:5px;border-style:solid;border-width:1px;border-color:black;}",
		"			#changingContent{padding-top:15px;}",
		"			#addRule{cursor:pointer;}",
		"			#ruleListContent {margin-left:15px;width:35%;float:left;}",
		"			#siteDetectionRuleForm {margin-top:15px;}",
		"			#siteDetectionRule {width:60%;float:left;display:none;}",
		"			#siteDetectionRule input[type=\"text\"] {width:80%;border-style:solid;border-color:black;border-width:1px;}",
		"			#siteDetectionRuleDelete {padding-left:80px;}",
		"			#ruleButtons img {cursor:pointer;margin-top:10px;}",
		"			#ruleList {height:80%;overflow:auto;margin-left:25px;margin-right:20px;margin-top:15px;}",
		"			#ruleList div:hover {font-weight:bold;}",
		"			.divBold {font-weight:bold;}",
		"			.ruleButton {cursor:pointer;}",
		"			.deleteRuleButton {float:left;cursor:pointer;}",
		"			#addRuleError {color:red;margin-top:15px;}",
		"			#optionBar {text-align:center;}",
		"			#optionBar img {cursor:pointer;}",
		"			#basicContent {margin-left:15px;}",
		"			#basicContent input {vertical-align:middle;}",
		"			#contextMenuTable {border-width:0px;font-family:Helvetica,Arial,sans-serif;font-size:0.9em;}",
		"			#contextMenuTable td+td {padding-left:10%;}",
		"			#marginSelectors div {margin:10px;font-size:0.9em;}",
		"			#marginSelectors select {margin-left:10px;}",
		"			#converterInput, #grabToDirInput, #mailCommandPathInput, #saveEpubCopyToDirInput {width:60%;}",
		"			#defaultLanguageInput {width:20%;}",
		"			#defaultAuthorInput, #mailCommandPathInput, #mailServerInput, #mailToInput, #mailFromInput, #mailCommandExtraInput {width:30%;}",
		"			hr {margin-top:25px;margin-bottom:25px;color:gray;opacity:0.3;}"
		);
	return resultTab.join("\n");
};


grabMyBooks.fillOptions = function()
{
	try
	{
		if(grabMyBooks.optionState.tabBrowser == null)
		{
			return;
		}

		var getMarginSelectOptionsTextFunction =
			function()
			{
				var result = [];
				var currentMarginValue;
				for(var i_margin=0; i_margin<3; i_margin++)
				{
					for(var j_margin=0; j_margin<=9; j_margin++)
					{
						currentMarginValue = ""+i_margin+"."+j_margin+"em";
						result.push("<option value=\""+currentMarginValue+"\">"+currentMarginValue+"</option>");
					}
				}
				currentMarginValue = ""+i_margin+"."+"0em";
				result.push("<option value=\""+currentMarginValue+"\">"+currentMarginValue+"</option>");
				return result.join("");
			};
		var marginSelectOptionsText = getMarginSelectOptionsTextFunction();


		var getExtensionSelectOptionsTextFunction =
			function()
			{
				var result = [];
				var currentSupportedExtension;
				for(var i_supportedExtension=0; i_supportedExtension<grabMyBooks.supportedExtensions.length; i_supportedExtension++)
				{
					currentSupportedExtension = grabMyBooks.supportedExtensions[i_supportedExtension];
					result.push("<option value=\""+currentSupportedExtension+"\">"+currentSupportedExtension+"</option>");
				}
				return result.join("");
			};
		var extensionSelectOptionsText = getExtensionSelectOptionsTextFunction();

		var getToConvertExtensionInlineTextFunction =
			function()
			{
				var result = [];
				var currentConvertExtension;
				for(var i_convertExtension=0; i_convertExtension<grabMyBooks.conversionNeededExtensions.length; i_convertExtension++)
				{
					currentConvertExtension = grabMyBooks.conversionNeededExtensions[i_convertExtension];
					if(i_convertExtension>0 && i_convertExtension<grabMyBooks.conversionNeededExtensions.length-1)
					{
						result.push(", ");
					}
					else if(i_convertExtension>0 && i_convertExtension == grabMyBooks.conversionNeededExtensions.length-1)
					{
						result.push(" or ");
					}
					result.push("'");
					result.push(currentConvertExtension);
					result.push("'");
				}
				return result.join("");
			};

		var content=[];
		content.push(
		"<html>",
		"	<head>",
		"		<style type=\"text/css\">",
		grabMyBooks.ext.getCssForOptionsPage(),
		grabMyBooks.menu.css(),
		"		</style>",
		"	</head>",
		"	<body>",
		"		<div id=\"popinBack\"></div>",
		"		<div id=\"popin\"><div id=\"popinContent\"></div></div>",
		"		<div id=\"optionBar\">",
		            grabMyBooks.menu.button("basicsLabel", "Basics", "BASICS"),
		            grabMyBooks.menu.button("detectionRulesLabel", "Detection rules", "DETECTION RULES"),
		            grabMyBooks.menu.button("help", "Help", "?"),
		"		</div>",
		"		<div id=\"content\">",
		"			<div id=\"changingContent\">",
		"				<div id=\"basicContent\">",
		"					Grab images <input id=\"grabImagesInput\" type=\"checkbox\" style=\"margin-right:30px;\">",
		"					Grab target images <input id=\"grabTargetImagesInput\" type=\"checkbox\" style=\"margin-right:30px;\">",
		"					Grab style <input id=\"grabStyleInput\" type=\"checkbox\" style=\"margin-right:30px;\">",
		"					Grab links <input id=\"grabLinksInput\" type=\"checkbox\" style=\"margin-right:30px;\">",
		"					Grab tables <input id=\"grabTablesInput\" type=\"checkbox\" style=\"margin-right:30px;\">",
		"					Grab hidden <input id=\"grabHiddenInput\" type=\"checkbox\" style=\"margin-right:30px;\">",
		"					<hr>",
		"					<span class=\"onlyFirefox\">",
		"					Direct book grab <input id=\"directBookGrabInput\" type=\"checkbox\" style=\"margin-right:50px;\">",
		"					Save suggestions <input id=\"saveSuggestInput\" type=\"checkbox\">",
		"					<hr>",
		"					Default ebook save format <select id=\"extensionSelect\">"+extensionSelectOptionsText+"</select><br><br>",
		"					Calibre ebook-converter path <input id=\"converterInput\" type=\"text\"><br>",
		"					Needed to save a book into "+getToConvertExtensionInlineTextFunction()+" format.<br>",
		"					Including the executable, example: &quot;C:\\Program Files\\Calibre2\\ebook-convert.exe&quot; for windows.<br><br>",
		"					If format is not epub, also save the epub version of book into this directory <input id=\"saveEpubCopyToDirInput\" type=\"text\"><br>",
		"					Useful to be able to load the book to edit it later. Leave empty if not needed.",
		"					<hr>",
		"					</span>",
		"					Grab books automatically into this directory <input id=\"grabToDirInput\" type=\"text\"><br>",
		"					If empty, destination is asked each time.",
		"					<hr>",
		"					<span class=\"onlyFirefox\">",
		"					Send book via email <input id=\"mailEnabledCheckBox\" type=\"checkbox\"><br><br>",
		"					Calibre calibre-smtp path <input id=\"mailCommandPathInput\" type=\"text\"><br>",
		"					Including the executable, example: &quot;C:\\Program Files\\Calibre2\\calibre-smtp.exe&quot; for windows. <br><br>",
		"					Smtp server <input id=\"mailServerInput\" type=\"text\"><br>",
		"					Smtp server Security protocol <select id=\"mailSecuritySelect\"><option value=\"SSL\">SSL</option><option value=\"TLS\">TLS</option><option value=\"NONE\">NONE</option></select><br>",
		"					Destination email address <input id=\"mailToInput\" type=\"text\"><br>",
		"					Source email address <input id=\"mailFromInput\" type=\"text\"><br><br>",
		"					Command extra parameters <input id=\"mailCommandExtraInput\" type=\"text\">",
		"					<hr>",
		"					</span>",
		"					Title 1 default value ",
		"					<select id=\"title1Default\">",
		"						<option selected>Page title</option>",
		"						<option>Article num</option>",
		"						<option>Page url</option>",
		"						<option>Nothing</option>",
		"					</select><br><br>",
		"					Title 2 default value ",
		"					<select id=\"title2Default\">",
		"						<option>Page title</option>",
		"						<option>Article num</option>",
		"						<option>Page url</option>",
		"						<option selected>Nothing</option>",
		"					</select>",
		"					<hr>",
		"					Default author <input id=\"defaultAuthorInput\" type=\"text\"><br>",
		"					Default language <input id=\"defaultLanguageInput\" type=\"text\">",
		"					<hr>",
		"					Image quality:",
		"					<select id=\"imageQualitySelect\">",
		"						<option value=\""+grabMyBooks.ext.getNormalImageQuality()+"\">normal</option>",
		"						<option value=\"0.7\">good</option>",
		"						<option value=\"1\">max</option>",
		"					</select>",
		"					<hr>",
		"					<span class=\"onlyFirefox\">",
		"					Context menu icons display mode:<br>",
		"					<table id=\"contextMenuTable\">",
		"						<tr>",
		"							<td><input id=\"contextGrouped\" type=\"radio\" name=\"contextMenuItemsType\" value=\"grouped\">In sub menu</td>",
		"							<td><input id=\"contextFlat\" type=\"radio\" name=\"contextMenuItemsType\" value=\"flat\">Flat</td>",
		"						</tr>",
		"						<tr>",
		"							<td><img src=\"chrome://grabMyBooks/content/images/options/contextMenuItemsGrouped.png\" alt=\"Grouped context menu items\"></td>",
		"							<td><img src=\"chrome://grabMyBooks/content/images/options/contextMenuItemsFlat.png\" alt=\"Flat context menu items\"></td>",
		"						</tr>",
		"					</table>",
		"					<hr>",
		"					</span>",
		"					<table id=\"marginConfigTable\">",
		"						<tr>",
		"							<td><img src=\"chrome://grabMyBooks/content/images/options/marginConfig.png\" alt=\"Margin config\"></td>",
		"							<td id=\"marginSelectors\">",
		"								<div><span style=\"background:#ff6000\">page margin top and bottom</span><select id=\"marginPageTopBottomSelect\">"+marginSelectOptionsText+"</select></div>",
		"								<div><span style=\"background:#6074e8\">page margin left and right</span><select id=\"marginPageLeftRightSelect\">"+marginSelectOptionsText+"</select></div>",
		"								<div><span style=\"background:#6de860\">paragraph margin top and bottom</span><select id=\"marginParagraphTopBottomSelect\">"+marginSelectOptionsText+"</select></div>",
		"								<div><span style=\"background:#ffff00\">paragraph indent</span><select id=\"marginParagraphIndentSelect\">"+marginSelectOptionsText+"</select></div>",
		"								<div><span>Text alignment</span><select id=\"textAlignSelect\"><option value=\"left\">Left</option><option value=\"right\">Right</option><option value=\"justify\">Justify</option><option value=\"center\">Center</option></select></div>",
		"							</td>",
		"						</tr>",
		"					</table>",
		"					<hr>",
		"					<br><button type=\"button\" id=\"restoreDefault\">Restore default</button><br><br>",
		"				</div>",
		"				<div id=\"ruleListContent\">",
		"					<div id=\"ruleListButtons\">",
		                        grabMyBooks.menu.button("addRule", "Add rule", "ADD RULE"),
		"					</div>",
		"					<div id=\"ruleList\">",
		"					</div>",
		"				</div>",
		"				<div id=\"siteDetectionRule\">",
		                    grabMyBooks.menu.text("ruleEdition", "RULE EDITION"),
		"					<div id=\"addRuleError\"></div>",
		"					<form id=\"siteDetectionRuleForm\">",
		"					Name<br>",
		"					<input name=\"siteDetectionRuleName\" type=\"text\"><br><br>",
		"					This rule will be applied for web sites with url matching regular expression:<br>",
		"					<input name=\"regexp\" type=\"text\"><br><br>",
		"					This rule says to grab node(s) matching xPath:<br>",
		"					<input name=\"customXPath\" type=\"text\"><br><br>",
		"					Don't grab the page itself but a link on the page of which href is located at xPath:<br>",
		"					<input name=\"linkInsteadOfPageUrlXpath\" type=\"text\"><br><br>",
		"					Next page href is located at xPath:<br>",
		"					<input name=\"nextPageUrlXpath\" type=\"text\"><br><br>",
		"					<div id=\"ruleButtons\">",
		                        grabMyBooks.menu.button("siteDetectionRuleOk", "Ok", "OK"),
		                        grabMyBooks.menu.button("siteDetectionRuleCancel", "Cancel", "CANCEL"),
		                        grabMyBooks.menu.button("siteDetectionRuleUp", "Up", "UP"),
		                        grabMyBooks.menu.button("siteDetectionRuleDown", "Down", "DOWN"),
		                        grabMyBooks.menu.button("siteDetectionRuleDelete", "Delete", "DELETE"),
		"					</form>",
		"				</div>",
		"				<div style=\"clear:both;\"></div>",
		"			</div>",
		"		</div>",
		"	</body>",
		"</html>"
		);

		grabMyBooks.setNodeContentFromString(grabMyBooks.optionState.tabBrowser.contentDocument, grabMyBooks.optionState.tabBrowser.contentDocument.body, content.join("\n"));

		grabMyBooks.optionState.popin = new grabMyBooks.popin.Popin(grabMyBooks.optionState.tabBrowser);

		grabMyBooks.ruleList = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("ruleList");
		grabMyBooks.ruleListContent = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("ruleListContent");
		grabMyBooks.siteDetectionRuleDiv = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("siteDetectionRule");
		grabMyBooks.changingContent = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("changingContent");
		grabMyBooks.addRule = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("addRule");
		grabMyBooks.siteDetectionRuleOk = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("siteDetectionRuleOk");
		grabMyBooks.siteDetectionRuleCancel = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("siteDetectionRuleCancel");
		grabMyBooks.siteDetectionRuleDelete = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("siteDetectionRuleDelete");
		grabMyBooks.siteDetectionRuleUp = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("siteDetectionRuleUp");
		grabMyBooks.siteDetectionRuleDown = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("siteDetectionRuleDown");
		grabMyBooks.addRuleForm = grabMyBooks.ext.getWrappedJSObject(grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("siteDetectionRuleForm"));
		grabMyBooks.addRuleError = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("addRuleError");
		grabMyBooks.basicsLabel = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("basicsLabel");
		grabMyBooks.detectionRulesLabel = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("detectionRulesLabel");
		grabMyBooks.ruleHelp = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("help");

		grabMyBooks.basicsContent = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("basicContent");

		grabMyBooks.grabImgInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("grabImagesInput");
		grabMyBooks.grabTargetImgInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("grabTargetImagesInput");
		grabMyBooks.grabStyleInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("grabStyleInput");
		grabMyBooks.grabLinksInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("grabLinksInput");
		grabMyBooks.grabTablesInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("grabTablesInput");
		grabMyBooks.grabHiddenInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("grabHiddenInput");
		grabMyBooks.directBookGrabInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("directBookGrabInput");
		grabMyBooks.saveSuggestInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("saveSuggestInput");

		var grabImgsClickFunction =
			function(e)
			{
				grabMyBooks.options.grabImages = grabMyBooks.grabImgInput.checked;
				if(!grabMyBooks.options.grabImages)
				{
					grabMyBooks.options.grabTargetImages = false;
					grabMyBooks.grabTargetImgInput.checked = false;
				}
				grabMyBooks.saveOptions();
			};

		grabMyBooks.grabImgInput.addEventListener("click", grabImgsClickFunction, false);

		var grabTargetImgsClickFunction =
			function(e)
			{
				grabMyBooks.options.grabTargetImages = grabMyBooks.grabTargetImgInput.checked;
				if(grabMyBooks.options.grabTargetImages)
				{
					grabMyBooks.grabImgInput.checked = true;
					grabMyBooks.options.grabImages = true;
				}
				grabMyBooks.saveOptions();
			};

		grabMyBooks.grabTargetImgInput.addEventListener("click", grabTargetImgsClickFunction, false);

		var grabStyleClickFunction =
			function(e)
			{
				grabMyBooks.options.grabStyle = grabMyBooks.grabStyleInput.checked;
				grabMyBooks.saveOptions();
			};
		grabMyBooks.grabStyleInput.addEventListener("click", grabStyleClickFunction, false);

		var grabLinksClickFunction =
			function(e)
			{
				grabMyBooks.options.grabLinks = grabMyBooks.grabLinksInput.checked;
				grabMyBooks.saveOptions();
			};
		grabMyBooks.grabLinksInput.addEventListener("click", grabLinksClickFunction, false);

		var grabTablesClickFunction =
			function(e)
			{
				grabMyBooks.options.grabTables = grabMyBooks.grabTablesInput.checked;
				grabMyBooks.saveOptions();
			};
		grabMyBooks.grabTablesInput.addEventListener("click", grabTablesClickFunction, false);


		var grabHiddenClickFunction =
			function(e)
			{
				grabMyBooks.options.grabHidden = grabMyBooks.grabHiddenInput.checked;
				grabMyBooks.saveOptions();
			};

		grabMyBooks.grabHiddenInput.addEventListener("click", grabHiddenClickFunction, false);


		var directBookGrabClickFunction =
			function(e)
			{
				grabMyBooks.options.directBookGrab = grabMyBooks.directBookGrabInput.checked;
				grabMyBooks.saveOptions();
			};

		grabMyBooks.directBookGrabInput.addEventListener("click", directBookGrabClickFunction, false);

		var saveSuggestClickFunction =
			function(e)
			{
				grabMyBooks.options.saveSuggest = grabMyBooks.saveSuggestInput.checked;
				grabMyBooks.saveOptions();
			};

		grabMyBooks.saveSuggestInput.addEventListener("click", saveSuggestClickFunction, false);


		grabMyBooks.title1DefaultSelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("title1Default");
		grabMyBooks.title2DefaultSelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("title2Default");
		grabMyBooks.contextGrouped = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("contextGrouped");
		grabMyBooks.contextFlat = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("contextFlat");



		grabMyBooks.marginPageTopBottomSelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("marginPageTopBottomSelect");
		grabMyBooks.marginPageLeftRightSelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("marginPageLeftRightSelect");
		grabMyBooks.marginParagraphTopBottomSelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("marginParagraphTopBottomSelect");
		grabMyBooks.marginParagraphIndentSelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("marginParagraphIndentSelect");
		grabMyBooks.textAlignSelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("textAlignSelect");

		grabMyBooks.marginPageTopBottomSelect.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.marginPageTopBottom = grabMyBooks.marginPageTopBottomSelect.value;
				grabMyBooks.saveOptions();
			}
			, false);
		grabMyBooks.marginPageLeftRightSelect.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.marginPageLeftRight = grabMyBooks.marginPageLeftRightSelect.value;
				grabMyBooks.saveOptions();
			}
			, false);
		grabMyBooks.marginParagraphTopBottomSelect.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.marginParagraphTopBottom = grabMyBooks.marginParagraphTopBottomSelect.value;
				grabMyBooks.saveOptions();
			}
			, false);
		grabMyBooks.marginParagraphIndentSelect.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.marginParagraphIndent = grabMyBooks.marginParagraphIndentSelect.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.textAlignSelect.addEventListener("change",
				function(e)
				{
					grabMyBooks.options.textAlign = grabMyBooks.textAlignSelect.value;
					grabMyBooks.saveOptions();
				}
				, false);

		grabMyBooks.extensionSelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("extensionSelect");
		grabMyBooks.extensionSelect.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.defaultExtension = grabMyBooks.extensionSelect.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.converterInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("converterInput");
		grabMyBooks.converterInput.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.outputConverterPath = grabMyBooks.converterInput.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.saveEpubCopyToDirInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("saveEpubCopyToDirInput");
		grabMyBooks.saveEpubCopyToDirInput.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.epubCopyToDir = grabMyBooks.saveEpubCopyToDirInput.value;
				grabMyBooks.saveOptions();
			}
			, false);


		grabMyBooks.grabToDirInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("grabToDirInput");
		grabMyBooks.grabToDirInput.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.grabToDir = grabMyBooks.grabToDirInput.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.defaultLanguageInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("defaultLanguageInput");
		grabMyBooks.defaultLanguageInput.addEventListener("change",
			function(e)
			{
				var defaultLanguageLength = grabMyBooks.defaultLanguageInput.value.length;
				if(defaultLanguageLength<2 || defaultLanguageLength > 5)
				{
					grabMyBooks.defaultLanguageInput.value = "en";
				}
				grabMyBooks.options.defaultLanguage = grabMyBooks.defaultLanguageInput.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.defaultAuthorInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("defaultAuthorInput");
		grabMyBooks.defaultAuthorInput.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.defaultAuthor = grabMyBooks.defaultAuthorInput.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.imageQualitySelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("imageQualitySelect");
		grabMyBooks.imageQualitySelect.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.imgQuality = grabMyBooks.imageQualitySelect.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.mailEnabledCheckBox = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("mailEnabledCheckBox");
		var mailEnabledCheckBoxClickFunction =
			function(e)
			{
				grabMyBooks.options.mailEnabled = grabMyBooks.mailEnabledCheckBox.checked;
				grabMyBooks.saveOptions();
			};

		grabMyBooks.mailEnabledCheckBox.addEventListener("click", mailEnabledCheckBoxClickFunction, false);

		grabMyBooks.mailServerInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("mailServerInput");
		grabMyBooks.mailServerInput.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.mailServer = grabMyBooks.mailServerInput.value;
				grabMyBooks.saveOptions();
			}
			, false);
		grabMyBooks.mailSecuritySelect = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("mailSecuritySelect");
		grabMyBooks.mailSecuritySelect.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.mailSecurity = grabMyBooks.mailSecuritySelect.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.mailCommandPathInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("mailCommandPathInput");
		grabMyBooks.mailCommandPathInput.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.mailCommandPath = grabMyBooks.mailCommandPathInput.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.mailCommandExtraInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("mailCommandExtraInput");
		grabMyBooks.mailCommandExtraInput.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.mailCommandExtra = grabMyBooks.mailCommandExtraInput.value;
				grabMyBooks.saveOptions();
			}
			, false);

		grabMyBooks.mailToInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("mailToInput");
		grabMyBooks.mailToInput.addEventListener("change",
			function(e)
			{
				grabMyBooks.options.mailTo = grabMyBooks.mailToInput.value;
				grabMyBooks.saveOptions();
			}
			, false);
		grabMyBooks.mailFromInput = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("mailFromInput");
		grabMyBooks.mailFromInput.addEventListener("change",
			function(e)
			{
				var mailFromInputValue = grabMyBooks.mailFromInput.value.trim();
				if(grabMyBooks.isEmpty(mailFromInputValue))
				{
					grabMyBooks.mailFromInput.value = grabMyBooks.bookMailFrom;
					mailFromInputValue = grabMyBooks.bookMailFrom;
				}
				grabMyBooks.options.mailFrom = mailFromInputValue;
				grabMyBooks.saveOptions();
			}
			, false);

		var synchOptionsInputs =
			function()
			{
				grabMyBooks.grabImgInput.checked = grabMyBooks.options.grabImages;
				grabMyBooks.grabTargetImgInput.checked = grabMyBooks.options.grabTargetImages;
				grabMyBooks.grabStyleInput.checked = grabMyBooks.options.grabStyle;
				grabMyBooks.grabLinksInput.checked = grabMyBooks.options.grabLinks;
				grabMyBooks.grabTablesInput.checked = grabMyBooks.options.grabTables;
				grabMyBooks.grabHiddenInput.checked = grabMyBooks.options.grabHidden;
				grabMyBooks.directBookGrabInput.checked = grabMyBooks.options.directBookGrab;
				grabMyBooks.title1DefaultSelect.selectedIndex = grabMyBooks.options.getTitleValueIndex(grabMyBooks.options.title1Default);
				grabMyBooks.title2DefaultSelect.selectedIndex = grabMyBooks.options.getTitleValueIndex(grabMyBooks.options.title2Default);
				grabMyBooks.contextGrouped.checked = grabMyBooks.options.contextMenuItemGrouped;
				grabMyBooks.contextFlat.checked = !grabMyBooks.contextGrouped.checked;
				grabMyBooks.marginPageTopBottomSelect.value=grabMyBooks.options.marginPageTopBottom;
				grabMyBooks.marginPageLeftRightSelect.value=grabMyBooks.options.marginPageLeftRight;
				grabMyBooks.marginParagraphTopBottomSelect.value=grabMyBooks.options.marginParagraphTopBottom;
				grabMyBooks.marginParagraphIndentSelect.value=grabMyBooks.options.marginParagraphIndent;
				grabMyBooks.textAlignSelect.value=grabMyBooks.options.textAlign;
				grabMyBooks.extensionSelect.value=grabMyBooks.options.defaultExtension;
				grabMyBooks.converterInput.value=grabMyBooks.options.outputConverterPath;
				grabMyBooks.saveEpubCopyToDirInput.value=grabMyBooks.options.epubCopyToDir;
				grabMyBooks.grabToDirInput.value=grabMyBooks.options.grabToDir;
				grabMyBooks.saveSuggestInput.checked=grabMyBooks.options.saveSuggest;
				grabMyBooks.defaultLanguageInput.value=grabMyBooks.options.defaultLanguage;
				grabMyBooks.defaultAuthorInput.value=grabMyBooks.options.defaultAuthor;
				grabMyBooks.imageQualitySelect.value = grabMyBooks.options.imgQuality;
				grabMyBooks.mailEnabledCheckBox.checked = grabMyBooks.options.mailEnabled;
				grabMyBooks.mailServerInput.value = grabMyBooks.options.mailServer;
				grabMyBooks.mailSecuritySelect.value = grabMyBooks.options.mailSecurity;
				grabMyBooks.mailCommandPathInput.value = grabMyBooks.options.mailCommandPath;
				grabMyBooks.mailCommandExtraInput.value = grabMyBooks.options.mailCommandExtra;
				grabMyBooks.mailToInput.value = grabMyBooks.options.mailTo;
				grabMyBooks.mailFromInput.value = grabMyBooks.options.mailFrom;
			};
		synchOptionsInputs();

		var title1DefaultChangeFunction =
			function(e)
			{
				var selectedIndex = grabMyBooks.title1DefaultSelect.selectedIndex;
				grabMyBooks.options.title1Default = grabMyBooks.options.titleValues[selectedIndex];
				grabMyBooks.saveOptions();
			};
		grabMyBooks.title1DefaultSelect.addEventListener("change", title1DefaultChangeFunction, false);

		var title2DefaultChangeFunction =
			function(e)
			{
				var selectedIndex = grabMyBooks.title2DefaultSelect.selectedIndex;
				grabMyBooks.options.title2Default = grabMyBooks.options.titleValues[selectedIndex];
				grabMyBooks.saveOptions();
			};
		grabMyBooks.title2DefaultSelect.addEventListener("change", title2DefaultChangeFunction, false);

		var contextDisplayClickFunction =
			function(e)
			{
				grabMyBooks.options.contextMenuItemGrouped = grabMyBooks.contextGrouped.checked;
				grabMyBooks.saveOptions();
			};
		grabMyBooks.contextGrouped.addEventListener("click", contextDisplayClickFunction, false);
		grabMyBooks.contextFlat.addEventListener("click", contextDisplayClickFunction, false);


		grabMyBooks.restoreDefaultButton = grabMyBooks.optionState.tabBrowser.contentDocument.getElementById("restoreDefault");
		var restoreDefaultClickFunction =
		function(synchOptionsInputsFunction)
		{
			return function(e)
			{
				grabMyBooks.options.setDefaultValues();
				grabMyBooks.saveOptions();
				synchOptionsInputsFunction();
			};
		}(synchOptionsInputs);
		grabMyBooks.restoreDefaultButton.addEventListener("click", restoreDefaultClickFunction, false);



		var removeAllContentFunction =
			function()
			{
				grabMyBooks.basicsContent.style.display="none";
				grabMyBooks.ruleListContent.style.display="none";
				grabMyBooks.siteDetectionRuleDiv.style.display="none";
			};

		var showBasicsFunction = function(removeAllContentFunction)
		{
			return function()
			{
				removeAllContentFunction();
				grabMyBooks.basicsContent.style.display="block";
			};
		}(removeAllContentFunction);
		grabMyBooks.optionState.showBasicsFunction = showBasicsFunction;

		var showRulesFunction = function(removeAllContentFunction)
		{
			return function()
			{
				removeAllContentFunction();
				grabMyBooks.ruleListContent.style.display="block";
			};
		}(removeAllContentFunction);
		grabMyBooks.optionState.showRulesFunction = showRulesFunction;

		showBasicsFunction();

		grabMyBooks.fillRules();

		var showBasicsEventFunction =
			function(showBasicsFunction)
			{
				return function(e)
				{
					showBasicsFunction();
				};
			}(showBasicsFunction);
		var showRulesEventFunction =
			function(showRulesFunction)
			{
				return function(e)
				{
					showRulesFunction();
				};
			}(showRulesFunction);

		grabMyBooks.basicsLabel.addEventListener("click", showBasicsEventFunction, false);
		grabMyBooks.detectionRulesLabel.addEventListener("click", showRulesEventFunction, false);

		grabMyBooks.optionState.addRuleFunction =
			function()
			{
				grabMyBooks.deHighLightSelectedRule();
				grabMyBooks.currentFormDetectionRule = null;
				grabMyBooks.siteDetectionRuleDelete.style.visibility="hidden";
				grabMyBooks.siteDetectionRuleUp.style.visibility="hidden";
				grabMyBooks.siteDetectionRuleDown.style.visibility="hidden";
				grabMyBooks.showRuleDetectionForm();
			};


		grabMyBooks.addRule.addEventListener("click",
			function(e)
			{
				grabMyBooks.optionState.addRuleFunction();
			},
			false
		);
		grabMyBooks.siteDetectionRuleOk.addEventListener("click",
			function(e)
			{
				try
				{
					if(grabMyBooks.addEditedSiteDetectionRule())
					{
						grabMyBooks.hideRuleDetectionForm();
					}
				}
				catch(ex)
				{
					grabMyBooks.ext.alert(ex+'::'+ex.lineNumber);
				}
			},
			false
		);
		grabMyBooks.siteDetectionRuleCancel.addEventListener("click",
			function(e)
			{
				grabMyBooks.hideRuleDetectionForm();
			},
			false
		);
		grabMyBooks.siteDetectionRuleDelete.addEventListener("click",
			function(e)
			{
				grabMyBooks.deleteRule(grabMyBooks.currentFormDetectionRule);
			},
			false
		);
		grabMyBooks.siteDetectionRuleUp.addEventListener("click",
			function(e)
			{
				grabMyBooks.moveRuleUp();
			},
			false
		);
		grabMyBooks.siteDetectionRuleDown.addEventListener("click",
			function(e)
			{
				grabMyBooks.moveRuleDown();
			},
			false
		);

		grabMyBooks.ruleHelp.addEventListener("click",
			function(e)
			{
				grabMyBooks.openWebSite();
			}
			,false);

		grabMyBooks.ext.extraFillOptions();
	}
	catch(e)
    {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.wrapNodeDependingOnAncestors = function(parentNode, doc)
{
	var result = null;
	var currentNode = parentNode;
	var currentName;
	var preDone = false;
	var codeDone = false;
	while(currentNode!=null)
	{
		if(grabMyBooks.isEmptyObject(currentNode.localName) || grabMyBooks.isEmpty(currentNode.localName))
		{
			currentNode = currentNode.parentNode;
			continue;
		}
		currentName = currentNode.localName.toUpperCase();
		if(currentName=="BODY")
		{
			break;
		}
		if(!preDone && currentName=="PRE")
		{
			var wrapNode = doc.createElement("pre");
			if(result != null)
			{
				wrapNode.appendChild(result);
			}
			result = wrapNode;
			preDone = true;
			currentNode = currentNode.parentNode;
			continue;
		}
		if(!codeDone && currentName=="CODE")
		{
			var wrapNode = doc.createElement("code");
			if(result != null)
			{
				wrapNode.appendChild(result);
			}
			result = wrapNode;
			codeDone = true;
			currentNode = currentNode.parentNode;
			continue;
		}
		if(preDone && wrapNode)
		{
			break;
		}
		currentNode = currentNode.parentNode;
	};
	return result;
};

grabMyBooks.containsNode = function(parentNode, childNode)
{
	if(!parentNode.hasChildNodes())
	{
		return false;
	}
	var childNodes = parentNode.childNodes;
	var i_childNode;
	for(i_childNode=0;i_childNode<childNodes.length;i_childNode++)
	{
		if(childNodes[i_childNode]==childNode)
		{
			return true;
		}
	}
	return false;
};


grabMyBooks.initDir = function(dirBaseFile, dirName)
{
	var dirFile = grabMyBooks.ext.createFile();
	dirFile.initWithPath(grabMyBooks.ext.path(dirBaseFile));
	dirFile.append(dirName);

	if(dirFile.exists())
	{
		return dirFile;
	}
	var result = grabMyBooks.createDir(grabMyBooks.ext.path(dirBaseFile), dirName);
	return result;
};

grabMyBooks.ext.initSaveDir = function()
{
	var result = grabMyBooks.initDir(grabMyBooks.homeDir, grabMyBooks.saveDir);
	return result;
};

grabMyBooks.saveDetectionRules = function()
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	var content = [];
	var i_siteDetectionRule;
	content.push("<grabMyBooks>");
	for(i_siteDetectionRule=0;i_siteDetectionRule<grabMyBooks.siteDetectionRules.length;i_siteDetectionRule++)
	{
		content.push(
			"	<detectionRule>",
			"		<ruleName>",
			"			<![CDATA["+grabMyBooks.siteDetectionRules[i_siteDetectionRule].name+"]]>",
			"		</ruleName>",
			"		<urlRegexp>",
			"			<![CDATA["+grabMyBooks.siteDetectionRules[i_siteDetectionRule].urlRegExp+"]]>",
			"		</urlRegexp>",
			"		<contentXPath>",
			"			<![CDATA["+grabMyBooks.getToSaveText(grabMyBooks.siteDetectionRules[i_siteDetectionRule].xpath)+"]]>",
			"		</contentXPath>",
			"		<linkInsteadOfPageUrlXpath>",
			"			<![CDATA["+grabMyBooks.getToSaveText(grabMyBooks.siteDetectionRules[i_siteDetectionRule].linkInsteadOfPageUrlXpath)+"]]>",
			"		</linkInsteadOfPageUrlXpath>",
			"		<nextPageUrlXpath>",
			"			<![CDATA["+grabMyBooks.getToSaveText(grabMyBooks.siteDetectionRules[i_siteDetectionRule].nextPageUrlXpath)+"]]>",
			"		</nextPageUrlXpath>",
			"	</detectionRule>"
		);
	}
	content.push("</grabMyBooks>");
	grabMyBooks.ext.writeFile(saveDir, grabMyBooks.detectionRuleFileName, content.join("\n"));
};

grabMyBooks.getToSaveText = function(text)
{
	if(grabMyBooks.isEmpty(text))
	{
		return "";
	}
	return text;
};

grabMyBooks.saveOptions = function()
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	var content = [];
	content.push("<grabMyBooks>");
	content.push("	<grabImages>");
	content.push("		"+(grabMyBooks.options.grabImages?"true":"false"));
	content.push("	</grabImages>");
	content.push("	<grabTargetImages>");
	content.push("		"+(grabMyBooks.options.grabTargetImages?"true":"false"));
	content.push("	</grabTargetImages>");
	content.push("	<grabStyle>");
	content.push("		"+(grabMyBooks.options.grabStyle?"true":"false"));
	content.push("	</grabStyle>");
	content.push("	<grabLinks>");
	content.push("		"+(grabMyBooks.options.grabLinks?"true":"false"));
	content.push("	</grabLinks>");
	content.push("	<grabTables>");
	content.push("		"+(grabMyBooks.options.grabTables?"true":"false"));
	content.push("	</grabTables>");
	content.push("	<grabHidden>");
	content.push("		"+(grabMyBooks.options.grabHidden?"true":"false"));
	content.push("	</grabHidden>");
	content.push("	<saveSuggest>");
	content.push("		"+(grabMyBooks.options.saveSuggest?"true":"false"));
	content.push("	</saveSuggest>");
	content.push("	<title1Default>");
	content.push("		"+grabMyBooks.options.title1Default);
	content.push("	</title1Default>");
	content.push("	<title2Default>");
	content.push("		"+grabMyBooks.options.title2Default);
	content.push("	</title2Default>");
	content.push("	<firstRun>");
	content.push("		"+(grabMyBooks.options.firstRun?"true":"false"));
	content.push("	</firstRun>");
	content.push("	<contextMenuItemGrouped>");
	content.push("		"+(grabMyBooks.options.contextMenuItemGrouped?"true":"false"));
	content.push("	</contextMenuItemGrouped>");
	content.push("	<directBookGrab>");
	content.push("		"+(grabMyBooks.options.directBookGrab?"true":"false"));
	content.push("	</directBookGrab>");
	content.push("	<marginPageTopBottom>");
	content.push("		"+grabMyBooks.options.marginPageTopBottom);
	content.push("	</marginPageTopBottom>");
	content.push("	<marginPageLeftRight>");
	content.push("		"+grabMyBooks.options.marginPageLeftRight);
	content.push("	</marginPageLeftRight>");
	content.push("	<marginParagraphTopBottom>");
	content.push("		"+grabMyBooks.options.marginParagraphTopBottom);
	content.push("	</marginParagraphTopBottom>");
	content.push("	<marginParagraphIndent>");
	content.push("		"+grabMyBooks.options.marginParagraphIndent);
	content.push("	</marginParagraphIndent>");
	content.push("	<textAlign>");
	content.push("		"+grabMyBooks.options.textAlign);
	content.push("	</textAlign>");
	content.push("	<defaultExtension>");
	content.push("		"+grabMyBooks.options.defaultExtension);
	content.push("	</defaultExtension>");
	content.push("	<outputConverterPath>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.outputConverterPath));
	content.push("	</outputConverterPath>");
	content.push("	<grabToDir>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.grabToDir));
	content.push("	</grabToDir>");
	content.push("	<epubCopyToDir>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.epubCopyToDir));
	content.push("	</epubCopyToDir>");
	content.push("	<defaultAuthor>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.defaultAuthor));
	content.push("	</defaultAuthor>");
	content.push("	<defaultLanguage>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.defaultLanguage));
	content.push("	</defaultLanguage>");
	content.push("	<imgQuality>");
	content.push("		"+grabMyBooks.options.imgQuality);
	content.push("	</imgQuality>");
	content.push("	<mailEnabled>");
	content.push("		"+(grabMyBooks.options.mailEnabled?"true":"false"));
	content.push("	</mailEnabled>");
	content.push("	<mailServer>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.mailServer));
	content.push("	</mailServer>");
	content.push("	<mailSecurity>");
	content.push("		"+grabMyBooks.options.mailSecurity);
	content.push("	</mailSecurity>");
	content.push("	<mailCommandPath>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.mailCommandPath));
	content.push("	</mailCommandPath>");
	content.push("	<mailCommandExtra>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.mailCommandExtra));
	content.push("	</mailCommandExtra>");
	content.push("	<mailTo>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.mailTo));
	content.push("	</mailTo>");
	content.push("	<mailFrom>");
	content.push("		"+grabMyBooks.getToSaveText(grabMyBooks.options.mailFrom));
	content.push("	</mailFrom>");
	content.push("</grabMyBooks>");
	grabMyBooks.ext.writeFile(saveDir, grabMyBooks.optionsFileName, content.join("\n"));
};

grabMyBooks.tabUpOrDown = function(tab, testObj, direction)
{
	var elementCount = tab.length;
	var currentElement;
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		if(currentElement.identify(testObj))
		{
			if(direction <= 0 && i_element==0)
			{
				return false;
			}
			if(direction > 0 && i_element>=(elementCount-1))
			{
				return false;
			}
			var newIndex;
			if(direction <= 0)
			{
				newIndex = i_element-1;
			}
			else
			{
				newIndex = i_element+1;
			}
			tab[i_element] = tab[newIndex];
			tab[newIndex] = currentElement;
			return true;
		}
	}
	return false;
};
grabMyBooks.tabUp = function(tab, testObj)
{
	var result = grabMyBooks.tabUpOrDown(tab, testObj, -1);
	return result;
};
grabMyBooks.tabDown = function(tab, testObj)
{
	var result = grabMyBooks.tabUpOrDown(tab, testObj, 1);
	return result;
};

grabMyBooks.tabIndex = function(tab, testObj)
{
	var elementCount = tab.length;
	var currentElement;
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		if(currentElement.identify(testObj))
		{
			return i_element;
		}
	}
	return -1;
};
grabMyBooks.tabIndex2 = function(tab, testFunction)
{
	var elementCount = tab.length;
	var currentElement;
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		if(testFunction(currentElement))
		{
			return i_element;
		}
	}
	return null;
};

grabMyBooks.tabGetRemove = function(tab, testObj, remove)
{
	var elementCount = tab.length;
	var currentElement;
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		if(currentElement.identify(testObj))
		{
			if(remove)
			{
				tab.splice(i_element, 1);
			}
			return currentElement;
		}
	}
	return null;
};

grabMyBooks.tabGet = function(tab, testObj)
{
	return grabMyBooks.tabGetRemove(tab, testObj, false);
};
grabMyBooks.tabRemove = function(tab, testObj)
{
	return grabMyBooks.tabGetRemove(tab, testObj, true);
};
grabMyBooks.tabRemoveByValue = function(tab, value)
{
	var index = tab.indexOf(value);
	if(index == -1)
	{
		return;
	}
	tab.splice(index, 1);
};
grabMyBooks.tabRemoveAll = function(tab, removeTestFunction)
{
	var elementCount = tab.length;
	var currentElement;
	var removedTab = [];
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		if(removeTestFunction(currentElement))
		{
			tab.splice(i_element, 1);
			i_element-=1;
			elementCount-=1;
			removedTab.push(currentElement);
		}
	}
	return removedTab;
};

grabMyBooks.tabReplace = function(tab, testObj, object)
{
	grabMyBooks.tabRemove(tab, testObj);
	tab.push(object);
};

grabMyBooks.tabFilter = function(tab, filterFunction)
{
	var result = [];
	var elementCount = tab.length;
	var currentElement;
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		if(filterFunction(currentElement))
		{
			result.push(currentElement);
		}
	}
	return result;
};

grabMyBooks.tabContains = function(tab, containsFunction)
{
	var elementCount = tab.length;
	var currentElement;
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		if(containsFunction(currentElement))
		{
			return true;
		}
	}
	return false;
};

grabMyBooks.tabCount = function(tab, shouldBeCountedFunction)
{
	var counter = new Object();
	counter.value = 0;
	var countFunction =
		function(counter, shouldBeCountedFunction)
		{
			return function(element, index, count)
			{
				if(shouldBeCountedFunction(element))
				{
					counter.value += 1;
				}
			};
		}(counter, shouldBeCountedFunction);
	grabMyBooks.tabDo(tab, countFunction);
	return counter.value;
};

grabMyBooks.tabCopy = function(tab)
{
	var alwaysTrueFilterFunction =
		function(element)
		{
			return true;
		};
	return grabMyBooks.tabFilter(tab, alwaysTrueFilterFunction);
};

grabMyBooks.tabCopy2 = function(tabDest, tab)
{
	var copyFunction =
		function(tabDest)
		{
			return function(element, index, count)
			{
				tabDest.push(element);
			};
		}(tabDest);
	grabMyBooks.tabDo(tab, copyFunction);
};

grabMyBooks.tabTransform = function(tab, transformFunction)
{
	var result = [];
	var elementCount = tab.length;
	var currentElement;
	var currentTransformedElement;
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		currentTransformedElement = transformFunction(currentElement);
		result.push(currentTransformedElement);
	}
	return result;
};



grabMyBooks.tabDo = function(tab, doFunction)
{
	var elementCount = tab.length;
	var currentElement;
	for(var i_element=0; i_element<elementCount; i_element++)
	{
		currentElement = tab[i_element];
		doFunction(currentElement, i_element, elementCount);
	}
};

grabMyBooks.tabDoExecFunction = function(functionItem, index, count)
{
	functionItem();
};

grabMyBooks.tabDoExec = function(tab)
{
	grabMyBooks.tabDo(tab, grabMyBooks.tabDoExecFunction);
};

grabMyBooks.getDocumentTitle = function(doc)
{
	var xPathResult = doc.evaluate("//title", doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	if(xPathResult.snapshotLength == 0)
	{
		return null;
	}
	return xPathResult.snapshotItem(0).textContent.trim();
};
grabMyBooks.getDocumentBase = function(doc)
{
	var baseNode = grabMyBooks.xml.xPathQueryNode("//base", doc, doc);
	if(baseNode == null)
	{
		return null;
	}
	var base = baseNode.href;
	if(grabMyBooks.isEmpty(base))
	{
		return null;
	}
	return base.trim();
};

grabMyBooks.loadDetectionRules = function()
{
	try
	{
		var saveDir = grabMyBooks.ext.initSaveDir();
		var detectionRules = grabMyBooks.ext.readFile(saveDir, grabMyBooks.detectionRuleFileName);
		if(grabMyBooks.isEmpty(detectionRules))
		{
			return;
		}
		var xmlParser = new DOMParser();
		var dom = xmlParser.parseFromString(detectionRules, "text/xml");

		var xPathResult = dom.evaluate("grabMyBooks/detectionRule" ,dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		var currentDetectionRuleName;
		var currentDetectionRuleUrlRegExp;
		var currentDetectionRuleXPath;
		var currentLinkInsteadOfPageUrlXpath;
		var currentNextPageUrlXpath;
		var currentDetectionRule;
		var currentXPathNode;
		for (var i_xPathNode = 0; i_xPathNode < xPathResult.snapshotLength; i_xPathNode++)
		{
			currentXPathNode = xPathResult.snapshotItem(i_xPathNode);
			currentDetectionRuleName = grabMyBooks.xml.getXPathProperty(dom, currentXPathNode, "ruleName");
			if(grabMyBooks.isEmpty(currentDetectionRuleName))
			{
				continue;
			}
			currentDetectionRuleUrlRegExp = grabMyBooks.xml.getXPathProperty(dom, currentXPathNode, "urlRegexp");
			if(grabMyBooks.isEmpty(currentDetectionRuleUrlRegExp))
			{
				continue;
			}
			if(!grabMyBooks.testRegexp(currentDetectionRuleUrlRegExp))
			{
				continue;
			}
			currentDetectionRuleXPath = grabMyBooks.xml.getXPathProperty(dom, currentXPathNode, "contentXPath");

			currentLinkInsteadOfPageUrlXpath = grabMyBooks.xml.getXPathProperty(dom, currentXPathNode, "linkInsteadOfPageUrlXpath");
			currentNextPageUrlXpath = grabMyBooks.xml.getXPathProperty(dom, currentXPathNode, "nextPageUrlXpath");

			currentDetectionRule = new grabMyBooks.siteDetectionRule(currentDetectionRuleName, currentDetectionRuleUrlRegExp, currentDetectionRuleXPath);
			currentDetectionRule.linkInsteadOfPageUrlXpath = currentLinkInsteadOfPageUrlXpath;
			currentDetectionRule.nextPageUrlXpath = currentNextPageUrlXpath;

			grabMyBooks.siteDetectionRules.push(currentDetectionRule);
		}
	}
	catch(e)
    {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.loadOptions = function()
{
	try
	{
		var saveDir = grabMyBooks.ext.initSaveDir();
		var options = grabMyBooks.ext.readFile(saveDir, grabMyBooks.optionsFileName);
		if(grabMyBooks.isEmpty(options))
		{
			return;
		}
		var xmlParser = new DOMParser();
		var dom = xmlParser.parseFromString(options, "text/xml");

		var xPathResult = dom.evaluate("grabMyBooks" ,dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		if(xPathResult.snapshotLength==0)
		{
			return;
		}
		var optionsNode = xPathResult.snapshotItem(0);
		var grabImgValue = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "grabImages");
		if("false"==grabImgValue)
		{
			grabMyBooks.options.grabImages = false;
		}
		var grabImgTargetValue = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "grabTargetImages");
		if("false"==grabImgTargetValue)
		{
			grabMyBooks.options.grabTargetImages = false;
		}
		var grabStyleValue = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "grabStyle");
		if("false"==grabStyleValue)
		{
			grabMyBooks.options.grabStyle = false;
		}
		var grabLinksValue = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "grabLinks");
		if("false"==grabLinksValue)
		{
			grabMyBooks.options.grabLinks = false;
		}
		var grabTablesValue = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "grabTables");
		if("false"==grabTablesValue)
		{
			grabMyBooks.options.grabTables = false;
		}
		var grabHiddenValue = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "grabHidden");
		if("true"==grabHiddenValue)
		{
			grabMyBooks.options.grabHidden = true;
		}
		var title1Default = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "title1Default");
		if(!grabMyBooks.isEmpty(title1Default))
		{
			grabMyBooks.options.title1Default = title1Default;
		}

		var title2Default = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "title2Default");
		if(!grabMyBooks.isEmpty(title2Default))
		{
			grabMyBooks.options.title2Default = title2Default;
		}
		var firstRun = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "firstRun");
		if(!grabMyBooks.isEmpty(firstRun) && firstRun=="false")
		{
			grabMyBooks.options.firstRun = false;
		}
		var contextMenuItemGrouped = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "contextMenuItemGrouped");
		if(grabMyBooks.isEmpty(contextMenuItemGrouped) || contextMenuItemGrouped=="false")
		{
			grabMyBooks.options.contextMenuItemGrouped = false;
		}
		var directBookGrab = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "directBookGrab");
		if("false"==directBookGrab)
		{
			grabMyBooks.options.directBookGrab = false;
		}
		var marginPageTopBottom = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "marginPageTopBottom");
		if(!grabMyBooks.isEmpty(marginPageTopBottom))
		{
			grabMyBooks.options.marginPageTopBottom = marginPageTopBottom;
		}
		var marginPageLeftRight = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "marginPageLeftRight");
		if(!grabMyBooks.isEmpty(marginPageLeftRight))
		{
			grabMyBooks.options.marginPageLeftRight = marginPageLeftRight;
		}
		var marginParagraphTopBottom = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "marginParagraphTopBottom");
		if(!grabMyBooks.isEmpty(marginParagraphTopBottom))
		{
			grabMyBooks.options.marginParagraphTopBottom = marginParagraphTopBottom;
		}
		var marginParagraphIndent = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "marginParagraphIndent");
		if(!grabMyBooks.isEmpty(marginParagraphIndent))
		{
			grabMyBooks.options.marginParagraphIndent = marginParagraphIndent;
		}
		var textAlign = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "textAlign");
		if(!grabMyBooks.isEmpty(textAlign))
		{
			grabMyBooks.options.textAlign = textAlign;
		}
		var defaultExtension = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "defaultExtension");
		if(!grabMyBooks.isEmpty(defaultExtension))
		{
			grabMyBooks.options.defaultExtension = defaultExtension;
		}
		var outputConverterPath = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "outputConverterPath");
		if(!grabMyBooks.isEmpty(outputConverterPath) && outputConverterPath!="null")
		{
			grabMyBooks.options.outputConverterPath = outputConverterPath;
		}
		var grabToDir = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "grabToDir");
		if(!grabMyBooks.isEmpty(grabToDir) && grabToDir!="null")
		{
			grabMyBooks.options.grabToDir = grabToDir;
		}
		var epubCopyToDir = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "epubCopyToDir");
		if(!grabMyBooks.isEmpty(epubCopyToDir) && epubCopyToDir!="null")
		{
			grabMyBooks.options.epubCopyToDir = epubCopyToDir;
		}
		var saveSuggestValue = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "saveSuggest");
		if("false"==saveSuggestValue)
		{
			grabMyBooks.options.saveSuggest = false;
		}
		var defaultAuthor = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "defaultAuthor");
		if(!grabMyBooks.isEmpty(defaultAuthor) && defaultAuthor!="null")
		{
			grabMyBooks.options.defaultAuthor = defaultAuthor;
		}
		var defaultLanguage = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "defaultLanguage");
		if(!grabMyBooks.isEmpty(defaultLanguage) && defaultLanguage!="null")
		{
			grabMyBooks.options.defaultLanguage = defaultLanguage;
		}
		var imgQuality = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "imgQuality");
		if(!grabMyBooks.isEmpty(imgQuality))
		{
			grabMyBooks.options.imgQuality = imgQuality;
		}
		var mailEnabled = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "mailEnabled");
		if("true"==mailEnabled)
		{
			grabMyBooks.options.mailEnabled = true;
		}
		var mailServer = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "mailServer");
		if(!grabMyBooks.isEmpty(mailServer) && mailServer!="null")
		{
			grabMyBooks.options.mailServer = mailServer;
		}
		var mailSecurity = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "mailSecurity");
		if(!grabMyBooks.isEmpty(mailSecurity))
		{
			grabMyBooks.options.mailSecurity = mailSecurity;
		}
		var mailCommandPath = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "mailCommandPath");
		if(!grabMyBooks.isEmpty(mailCommandPath) && mailCommandPath!="null")
		{
			grabMyBooks.options.mailCommandPath = mailCommandPath;
		}
		var mailCommandExtra = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "mailCommandExtra");
		if(!grabMyBooks.isEmpty(mailCommandExtra) && mailCommandExtra!="null")
		{
			grabMyBooks.options.mailCommandExtra = mailCommandExtra;
		}
		var mailTo = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "mailTo");
		if(!grabMyBooks.isEmpty(mailTo) && mailTo!="null")
		{
			grabMyBooks.options.mailTo = mailTo;
		}
		var mailFrom = grabMyBooks.xml.getXPathProperty(dom, optionsNode, "mailFrom");
		if(!grabMyBooks.isEmpty(mailFrom) && mailFrom!="null")
		{
			grabMyBooks.options.mailFrom = mailFrom;
		}
	}
	catch(e)
    {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.openWebSite = function()
{
	grabMyBooks.ext.openWebSiteUrl(grabMyBooks.grabMyBooksUrl);
};

grabMyBooks.ext.openWebSiteUrl = function(url)
{
	var webSiteTab = gBrowser.addTab(url);
	grabMyBooks.ext.setSelectedTab(webSiteTab);
};

grabMyBooks.feeds = new Object();
grabMyBooks.feeds.tabBrowser = null;
grabMyBooks.feeds.tab = null;

grabMyBooks.feeds.feedsFileName = "feeds.xml";

grabMyBooks.showFeeds = function()
{
	if(grabMyBooks.feeds.tabBrowser == null)
	{
		grabMyBooks.feeds.tab = gBrowser.addTab();
		grabMyBooks.feeds.tabBrowser = gBrowser.getBrowserForTab(grabMyBooks.feeds.tab);
		grabMyBooks.feeds.tabBrowser.addEventListener("load",
									function ()
									{
										  grabMyBooks.feeds.tab.label="GrabMyBooks - Feeds";
										  gBrowser.setIcon(grabMyBooks.feeds.tab,"chrome://grabMyBooks/content/icons/bookRss.png");
										  grabMyBooks.fillFeeds();
										  grabMyBooks.feeds.loadFeeds(false);
									},
									 true);
	}
	grabMyBooks.ext.setSelectedTab(grabMyBooks.feeds.tab);
};

grabMyBooks.fillFeeds = function()
{
	try
	{
		if(grabMyBooks.feeds.tabBrowser == null)
		{
			return;
		}
		var content=[];
		content.push(
		"<html>",
		"	<head>",
		"		<style type=\"text/css\">",
		"			body {font-family:Helvetica,Arial,sans-serif;font-size:0.9em;overflow:none;width:100%;height:100%;background-image:url(chrome://grabMyBooks/content/icons/menu/bg.png);}",
		"			#content {text-align:left;width:90%;height:90%;overflow:none;margin-top:10px;margin-left:auto;margin-right:auto;padding:2px;}",
		"			#menuBar {text-align:center;}",
		"			#menuBar img{cursor:pointer;vertical-align:middle;}",
		"			#menuBar #addFeedInput{position:relative;left:3px;top:-2px;vertical-align:middle;width:300px;height:20px;border-style:solid;border-color:black;border-width:1px;margin-right:5px;}",
		"			#feedList{padding:10px;background-color:white;border-radius:15px;overflow-y:auto;width:40%;height:90%;float:left;margin:5px;border-style:solid;border-color:black;border-width:1px;}",
		"			#feedDetail{padding:10px;background-color:white;border-radius:15px;position:relative;overflow:auto;width:50%;height:90%;float:left;margin:5px;border-style:solid;border-color:black;border-width:1px;}",
		grabMyBooks.popin.css(),
		"			.feedEntries{margin-left:10px;display:none;}",
		"			.feedEntries td{vertical-align:top;}",
		"			.feedEntry {font-size:0.9em;cursor:pointer;font-weight:bold;}",
		"			.feedEntryGoto{font-size:0.8em;cursor:pointer;}",
		"			.showOrHideFeedEntriesButton {cursor:pointer;}",
		"			.showOrHideFeedEntriesImg {width:15px;heigth:15px;}",
		"			.showOrHideFeedEntriesImgOpen {width:17px;heigth:17px;}",
		"			.feedTitle {cursor:pointer;font-weight:bold;}",
		"			.feedItemAction, .feedItemActionDelete, .feedItemActionRefresh {font-size:0.8em;cursor:pointer;margin-left:2px;}",
		"			.feedItemActions {}",
		"			.feedItemLoading {font-size:0.8em;}",
		"			.closeFeedDetail {margin:10px;cursor:pointer;position:absolute;top:0px;right:2px;}",
		"			.feedEntryDate {margin:10px;position:absolute;left:2px;top:0px;}",
		"			.popinButton {cursor:pointer;margin-left:2px;margin-right:2px;}",
		"			#notCompletedUrls {height:130px;overflow:auto;font-size:0.8em;}",
		grabMyBooks.menu.css(),
		"		</style>",
		"	</head>",
		"	<body>",
		"		<div id=\"popinBack\"></div>",
		"		<div id=\"popin\"><div id=\"popinContent\"></div></div>",
		"		<div id=\"menuBar\">",
		            grabMyBooks.menu.button("addFeed", "Add feed", "ADD FEED"),
		"			<input id=\"addFeedInput\" placeholder=\"Enter feed url\">",
		            grabMyBooks.menu.button("addFeedsToBook", "Add selection to book", "ADD SELECTION TO BOOK"),
		            grabMyBooks.menu.button("deSelectAll", "Empty selection", "EMPTY SELECTION"),
		"		</div>",
		"		<div id=\"content\">",
		"			<div id=\"feedList\">",
		"			</div>",
		"			<div id=\"feedDetail\">",
		"			</div>",
		"		</div>",
		"	</body>",
		"</html>"
		);


		grabMyBooks.setNodeContentFromString(grabMyBooks.feeds.tabBrowser.contentDocument, grabMyBooks.feeds.tabBrowser.contentDocument.body, content.join("\n"));

		grabMyBooks.feeds.popin = new grabMyBooks.popin.Popin(grabMyBooks.feeds.tabBrowser);


		grabMyBooks.feeds.htmlFeedList = grabMyBooks.feeds.tabBrowser.contentDocument.getElementById("feedList");
		grabMyBooks.feeds.htmlFeedDetail = grabMyBooks.feeds.tabBrowser.contentDocument.getElementById("feedDetail");


		var addFeedImg = grabMyBooks.feeds.tabBrowser.contentDocument.getElementById("addFeed");

		var addFeedInput = grabMyBooks.feeds.tabBrowser.contentDocument.getElementById("addFeedInput");

		addFeedImg.addEventListener("click",
			function(e)
			{
				//grabMyBooks.feeds.popin.show();
				var feedUrl = addFeedInput.value;
				grabMyBooks.feeds.addFeed(feedUrl, new grabMyBooks.feeds.AddFeedContext(true, false, true));
				addFeedInput.value="";
			},
			false
		);

		var addFeedsToBookImg = grabMyBooks.feeds.tabBrowser.contentDocument.getElementById("addFeedsToBook");
		addFeedsToBookImg.addEventListener("click",
			function(e)
			{
				grabMyBooks.feeds.addSelectedFeedEntriesToBook();
			},
			false
		);

		var deSelectAllImg = grabMyBooks.feeds.tabBrowser.contentDocument.getElementById("deSelectAll");
		deSelectAllImg.addEventListener("click",
			function(e)
			{
				grabMyBooks.feeds.deSelectAllAfterAddToBook();
			},
			false
		);

		grabMyBooks.feeds.refreshFeedList();

	}
	catch(e)
    {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.feeds.feedItems = [];
grabMyBooks.feeds.FeedItem = function(feed, url)
{
	this.feed = feed;
	this.url = url;
	this.title = feed.title.text;
	this.expanded = false;
	this.dummy = false;
	this.equals =function(otherFeed)
	{
		var equalResult = this.url.toUpperCase()==otherFeed.url.toUpperCase();
		return equalResult;
	};
	this.identify = function(url)
	{
		var equalResult = this.url.toUpperCase()==url.toUpperCase();
		return equalResult;
	};
	this.selectedFeedEntries = [];
	this.containsSelectedFeedEntry = function(selectedFeedEntry)
	{
		var selectedEntryCount = this.selectedFeedEntries.length;
		for(var i_selectedFeedEntry=0; i_selectedFeedEntry<selectedEntryCount; i_selectedFeedEntry++)
		{
			if(selectedFeedEntry.equals(this.selectedFeedEntries[i_selectedFeedEntry]))
			{
				return true;
			}
		}
		return false;
	};
	this.addSelectedFeedEntry = function(selectedFeedEntry)
	{
		if(this.containsSelectedFeedEntry(selectedFeedEntry))
		{
			return;
		}
		this.selectedFeedEntries.push(selectedFeedEntry);
	};
	this.removeSelectedFeedEntry = function(selectedFeedEntry)
	{
		var selectedEntryCount = this.selectedFeedEntries.length;
		for(var i_selectedFeedEntry=0; i_selectedFeedEntry<selectedEntryCount; i_selectedFeedEntry++)
		{
			if(selectedFeedEntry.equals(this.selectedFeedEntries[i_selectedFeedEntry]))
			{
				this.selectedFeedEntries.splice(i_selectedFeedEntry, 1);
				return;
			}
		}
	};
	this.removeAllSelectedEntries = function()
	{
		this.selectedFeedEntries = [];
	};
	this.isDummy = function()
	{
		return this.dummy;
	};
	this.setDummy = function()
	{
		this.dummy = true;
		this.feed = new Object();
		this.feed.items = [];
	};
};

grabMyBooks.feeds.SelectedFeedEntry = function(feedEntryUrl, index)
{
	this.feedEntryUrl = feedEntryUrl;
	this.index = index;
	this.equals = function(otherSelectedFeedEntry)
	{
		var equalsResult = (this.feedEntryUrl == otherSelectedFeedEntry.feedEntryUrl);
		return equalsResult;
	};
};

grabMyBooks.feeds.AddFeedContext = function(saveFeedsAfter, replace, showMessage)
{
	this.saveFeedsAfter = saveFeedsAfter;
	this.replace = replace;
	this.showMessage = showMessage;

	this.endOfAdding = function(feedItem)
	{
		if(this.saveFeedsAfter)
		{
			grabMyBooks.feeds.saveFeeds();
		}
		grabMyBooks.feeds.refreshFeedList();
		if(this.showMessage)
		{
			var feedAddedMessage = [];
			feedAddedMessage.push("Feed added to the list with name:");
			feedAddedMessage.push("<b>");
			feedAddedMessage.push(feedItem.title);
			feedAddedMessage.push("</b>");
			var feedAddedMessageJoined = feedAddedMessage.join("\n");
			grabMyBooks.feeds.popin.showMessage(feedAddedMessageJoined);
		}
	};
};

grabMyBooks.feeds.refreshFeedList = function()
{
	try
	{
		if(grabMyBooks.feeds.tabBrowser == null)
		{
			return;
		}

		var result = [];
		var i_feed = 0;
		var i_feed_entry;
		var currentNsFeed;
		var currentTitle;
		var currentFeedEntryArray;
		var currentFeedEntryCount;
		var currentNsFeedEntry;
		var currentEntryUrl;
		var currentEntryTitle;
		var currentFeedItem;
		for(i_feed=0; i_feed<grabMyBooks.feeds.feedItems.length;i_feed++)
		{
			currentFeedItem = grabMyBooks.feeds.feedItems[i_feed];
			currentNsFeed = currentFeedItem.feed;
			currentTitle = currentFeedItem.title;
			currentFeedEntryArray = currentNsFeed.items;
			currentFeedEntryCount = currentFeedEntryArray.length;


			result.push("<span class='showOrHideFeedEntriesButton'><img class='showOrHideFeedEntriesImg' src=\"chrome://grabMyBooks/content/icons/feeds/rss.png\"></span>");
			result.push("<span class='feedItemLoading'>Loading...</span>");
			result.push("<span class=\"feedTitle\" title=\""+currentFeedItem.url+"\" onMouseOver=\"this.style.color='#da9400';\" onMouseOut=\"this.style.color='';\">");
			result.push(currentTitle);
			result.push("</span>");
			result.push("<span class=\"feedItemActions\"><span class=\"feedItemActionRefresh\" title=\"Refresh this feed\" onMouseOver=\"this.style.color='#da9400';\" onMouseOut=\"this.style.color='';\">refresh</span><span class=\"feedItemActionDelete\" title=\"Delete this feed\" onMouseOver=\"this.style.color='#da9400';\" onMouseOut=\"this.style.color='';\">delete</span></span>");
			result.push("<br>");

			i_feed_entry = 0;
			result.push("<table class=\"feedEntries\">");
			for(i_feed_entry=0; i_feed_entry<currentFeedEntryCount;i_feed_entry++)
			{

				currentNsFeedEntry = currentFeedEntryArray.queryElementAt(i_feed_entry, Components.interfaces.nsIFeedEntry);
				if(!currentNsFeedEntry)
				{
					continue;
				}
				if(grabMyBooks.isEmptyObject(currentNsFeedEntry.title))
				{
					currentEntryTitle = "???";
				}
				else
				{
					currentEntryTitle = currentNsFeedEntry.title.text;
				}
				if(currentNsFeedEntry.link == null)
				{
					currentNsFeedEntry.link = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(currentFeedItem.url, null, null);
				}
				currentEntryUrl = currentNsFeedEntry.link.resolve("");

				result.push("<tr>");
				result.push("<td>");
				result.push("<input type=\"checkbox\" ");
				if(currentFeedItem.containsSelectedFeedEntry(new grabMyBooks.feeds.SelectedFeedEntry(currentEntryUrl, i_feed_entry)))
				{
					result.push("checked");
				}
				result.push(">");
				result.push("</td>");
				result.push("<td><span class=\"feedEntry\" title=\""+currentEntryUrl+"\" onMouseOver=\"this.style.color='#da9400';\" onMouseOut=\"this.style.color='';\">");
				result.push(currentEntryTitle);
				result.push("</span><span title=\"Visit "+currentEntryUrl+"\" class=\"feedEntryGoto\" onMouseOver=\"this.style.color='#da9400';\" onMouseOut=\"this.style.color='';\">visit</span></td>");
				result.push("</tr>");
			}
			result.push("</table>");
		}
		grabMyBooks.setNodeContentFromString(grabMyBooks.feeds.tabBrowser.contentDocument, grabMyBooks.feeds.htmlFeedList, result.join("\n"));

		var feedItemCount = grabMyBooks.feeds.feedItems.length;
		var feedEntrieShowOrHideButtonXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='showOrHideFeedEntriesButton']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		var feedEntrieShowOrHideImgXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//img[@class='showOrHideFeedEntriesImg']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		var feedEntriesXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//table[@class='feedEntries']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		var feedTitleButtonXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='feedTitle']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		var feedDeleteButtonXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='feedItemActionDelete']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		var feedRefreshButtonXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='feedItemActionRefresh']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		var feedLoadingXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='feedItemLoading']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );


		var currentShowOrHideButtonNode;
		var currentShowOrHideButtonImg;
		var currentFeedEntriesNode;
		var currentFeedTitleButton;
		var currentFeedDeleteButton;
		var currentFeedRefreshButton;
		var currentFeedLoading;

		for(i_feed=0;i_feed<feedItemCount;i_feed++)
		{
			currentShowOrHideButtonNode = feedEntrieShowOrHideButtonXPathResult.snapshotItem(i_feed);
			currentShowOrHideButtonImg = feedEntrieShowOrHideImgXPathResult.snapshotItem(i_feed);
			currentFeedEntriesNode = feedEntriesXPathResult.snapshotItem(i_feed);
			currentFeedTitleButton = feedTitleButtonXPathResult.snapshotItem(i_feed);
			currentFeedDeleteButton = feedDeleteButtonXPathResult.snapshotItem(i_feed);
			currentFeedRefreshButton = feedRefreshButtonXPathResult.snapshotItem(i_feed);
			currentFeedLoading = feedLoadingXPathResult.snapshotItem(i_feed);

			if(currentFeedEntryCount>0 && grabMyBooks.feeds.feedItems[i_feed].expanded)
			{
				currentFeedEntriesNode.style.display="block";
			}

			var deleteFeedOnClickFunction =
				function(index)
				{
					return function(e)
					{
						var deleteFeedActionFunction = function(e)
						{
							grabMyBooks.feeds.deleteFeed(index);
							grabMyBooks.feeds.refreshFeedList();
						};
						var feedTitle = grabMyBooks.feeds.feedItems[index].title;
						grabMyBooks.feeds.popin.askForAction("Delete feed '<b>"+feedTitle+"</b>' ?", deleteFeedActionFunction, null);
					};
				}(i_feed);
			currentFeedDeleteButton.addEventListener("click",deleteFeedOnClickFunction,false);


			if(grabMyBooks.feeds.feedItems[i_feed].isDummy())
			{
				currentShowOrHideButtonNode.style.display="none";
				currentFeedRefreshButton.style.display="none";
				continue;
			}
			else
			{
				currentFeedLoading.style.display="none";
			}

			var refreshFeedOnClickFunction =
				function(index)
				{
					return function(e)
					{
						grabMyBooks.feeds.refreshFeed(index);
					};
				}(i_feed);
			currentFeedRefreshButton.addEventListener("click",refreshFeedOnClickFunction,false);


			var showOrHideFeedEntriesOnclickFunction =
				function(feedEntriesNode, index, showOrHideButtonImg)
				{
					return function(e)
					{
						var entriesVisible = feedEntriesNode.style.display;
						if(grabMyBooks.isEmpty(entriesVisible) || entriesVisible=="none")
						{
							feedEntriesNode.style.display="block";
							grabMyBooks.feeds.feedItems[index].expanded=true;
							showOrHideButtonImg.className="showOrHideFeedEntriesImgOpen";
							showOrHideButtonImg.src="chrome://grabMyBooks/content/icons/feeds/rss2.png";
						}
						else
						{
							feedEntriesNode.style.display="none";
							grabMyBooks.feeds.feedItems[index].expanded=false;
							showOrHideButtonImg.className="showOrHideFeedEntriesImg";
							showOrHideButtonImg.src="chrome://grabMyBooks/content/icons/feeds/rss.png";
						}
					};
				}(currentFeedEntriesNode, i_feed, currentShowOrHideButtonImg);
			currentShowOrHideButtonNode.addEventListener("click",showOrHideFeedEntriesOnclickFunction,false);
			currentFeedTitleButton.addEventListener("click",showOrHideFeedEntriesOnclickFunction,false);

			if(grabMyBooks.feeds.feedItems[i_feed].expanded)
			{
				currentShowOrHideButtonImg.className="showOrHideFeedEntriesImgOpen";
				currentShowOrHideButtonImg.src="chrome://grabMyBooks/content/icons/feeds/rss2.png";
			}

			/*
			 * Event on each feed selection checkbox.
			 */
			var feedEntrieXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//input[@type='checkbox']" ,currentFeedEntriesNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
			var currentFeedEntrySelectionCheckbox;
			var currentFeedentryUrl;
			for (var i_xPathNode = 0; i_xPathNode < feedEntrieXPathResult.snapshotLength; i_xPathNode++)
			{
				currentFeedEntrySelectionCheckbox = feedEntrieXPathResult.snapshotItem(i_xPathNode);
				currentFeedentryUrl = grabMyBooks.feeds.feedItems[i_feed].feed.items.queryElementAt(i_xPathNode, Components.interfaces.nsIFeedEntry).link.resolve("");
				var feedEntryCheckBoxOnClickFunction =
					function(feedEntryCheckBox, feed, feedEntryUrl, index)
					{
						return function(e)
						{
							var feedEntryCheckBoxChecked = feedEntryCheckBox.checked;
							var selectedFeedEntry = new grabMyBooks.feeds.SelectedFeedEntry(feedEntryUrl, index);
							if(feedEntryCheckBoxChecked)
							{
								feed.addSelectedFeedEntry(selectedFeedEntry);
							}
							else
							{
								feed.removeSelectedFeedEntry(selectedFeedEntry);
							}
						};
					}(currentFeedEntrySelectionCheckbox, grabMyBooks.feeds.feedItems[i_feed], currentFeedentryUrl, i_xPathNode);
				currentFeedEntrySelectionCheckbox.addEventListener("click",feedEntryCheckBoxOnClickFunction,false);
			}
			/*
			 * Event on each feed item title to display the content.
			 */
			feedEntrieXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='feedEntry']" ,currentFeedEntriesNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
			var feedEntryGotoButtonXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='feedEntryGoto']" ,currentFeedEntriesNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

			var currentFeedEntryTitle;
			var currentFeedEntryGotoButton;
			var currentFeedentryUrl;
			for (var i_xPathNode = 0; i_xPathNode < feedEntrieXPathResult.snapshotLength; i_xPathNode++)
			{
				currentFeedentryUrl = grabMyBooks.feeds.feedItems[i_feed].feed.items.queryElementAt(i_xPathNode, Components.interfaces.nsIFeedEntry).link.resolve("");
				currentFeedEntryTitle = feedEntrieXPathResult.snapshotItem(i_xPathNode);
				currentFeedEntryGotoButton = feedEntryGotoButtonXPathResult.snapshotItem(i_xPathNode);
				var feedEntryTitleEventFunction =
					function(feedIndex, feedEntryIndex)
					{
						return function(e)
						{
							grabMyBooks.feeds.showFeedEntry(feedIndex, feedEntryIndex);
						};
					}(i_feed, i_xPathNode);
				currentFeedEntryTitle.addEventListener("click",feedEntryTitleEventFunction,false);
				currentFeedEntryTitle.addEventListener("mouseover",feedEntryTitleEventFunction,false);

				var feedEntryGotoFunction =
				function(feedEntryUrl)
				{
					return function(e)
					{
						var webSiteTab = gBrowser.addTab(feedEntryUrl);
						grabMyBooks.ext.setSelectedTab(webSiteTab);
					};
				}(currentFeedentryUrl);
				currentFeedEntryGotoButton.addEventListener("click",feedEntryGotoFunction,false);
			}
		}
		grabMyBooks.feeds.updateFeedEntriesWithHistory();
	}
	catch(e)
    {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.feeds.saveFeeds = function()
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	var content = [];

	content.push("<grabMyBooks>");
	var currentFeedItem;
	for(var i_feed=0; i_feed<grabMyBooks.feeds.feedItems.length;i_feed++)
	{
		currentFeedItem = grabMyBooks.feeds.feedItems[i_feed];
		content.push(
			"	<feed>",
			"		<feedName>",
			"			<![CDATA["+currentFeedItem.title+"]]>",
			"		</feedName>",
			"		<feedUrl>",
			"			<![CDATA["+currentFeedItem.url+"]]>",
			"		</feedUrl>",
			"	</feed>"
		);
	}
	content.push("</grabMyBooks>");
	grabMyBooks.ext.writeFile(saveDir, grabMyBooks.feeds.feedsFileName, content.join("\n"));
};

grabMyBooks.feeds.loaded = false;
grabMyBooks.feeds.loadFeeds = function(forceLoading)
{
	try
	{
		if(grabMyBooks.feeds.loaded && !forceLoading)
		{
			return;
		}
		grabMyBooks.feeds.feedItems = [];
		grabMyBooks.feeds.loaded = true;
		var saveDir = grabMyBooks.ext.initSaveDir();
		var feeds = grabMyBooks.ext.readFile(saveDir, grabMyBooks.feeds.feedsFileName);
		if(grabMyBooks.isEmpty(feeds))
		{
			return;
		}
		var xmlParser = new DOMParser();
		var dom = xmlParser.parseFromString(feeds, "text/xml");

		var xPathResult = dom.evaluate("grabMyBooks/feed" ,dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		var currentFeedUrl;
		var currentFeedName;
		var currentXPathNode;
		var urlTab = [];
		for (var i_xPathNode = 0; i_xPathNode < xPathResult.snapshotLength; i_xPathNode++)
		{
			currentXPathNode = xPathResult.snapshotItem(i_xPathNode);
			currentFeedUrl = grabMyBooks.xml.getXPathProperty(dom, currentXPathNode, "feedUrl");
			if(grabMyBooks.isEmpty(currentFeedUrl))
			{
				continue;
			}
			currentFeedName = grabMyBooks.xml.getXPathProperty(dom, currentXPathNode, "feedName");
			if(grabMyBooks.isEmpty(currentFeedName))
			{
				continue;
			}
			grabMyBooks.feeds.addDummyFeed(currentFeedName, currentFeedUrl, new grabMyBooks.feeds.AddFeedContext(false, false, false));
			urlTab.push(currentFeedUrl);
		}
		grabMyBooks.feeds.refreshFeedList();
		for(var i_urlToAdd=0; i_urlToAdd<urlTab.length; i_urlToAdd++)
		{
			grabMyBooks.feeds.addFeed(urlTab[i_urlToAdd], new grabMyBooks.feeds.AddFeedContext(false, true, false));
		}
	}
	catch(e)
    {
        grabMyBooks.ext.alert(e+'::'+e.lineNumber);
    }
};

grabMyBooks.feeds.feedHistory = new Object();
grabMyBooks.feeds.feedHistory.addedUrls = [];
grabMyBooks.feeds.feedHistory.containsUrl = function(url)
{
	for(var i_addedUrl=0; i_addedUrl<this.addedUrls.length; i_addedUrl++)
	{
		if(this.addedUrls[i_addedUrl] == url)
		{
			return true;
		}
	}
	return false;
};
grabMyBooks.feeds.feedHistory.addAddedUrl = function(url)
{
	if(!this.containsUrl(url))
	{
		this.addedUrls.push(url);
	}
};

grabMyBooks.feeds.deSelectAllAfterAddToBook = function()
{
	var currentFeed;
	for(var i_feed=0; i_feed<grabMyBooks.feeds.feedItems.length;i_feed++)
	{
		currentFeed = grabMyBooks.feeds.feedItems[i_feed];
		currentFeed.removeAllSelectedEntries();
	}

	var feedEntriesTabXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//table[@class='feedEntries']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	var feedEntriesTabCount = feedEntriesTabXPathResult.snapshotLength;
	var currentFeedEntriesTab;
	var currentFeedEntryCheckBoxXPathResult;
	var currentFeedEntryCheckBoxCount;
	var currentFeedEntryCheckBox;
	for(var i_feedEntriesTab=0;i_feedEntriesTab<feedEntriesTabCount;i_feedEntriesTab++)
	{
		currentFeedEntriesTab = feedEntriesTabXPathResult.snapshotItem(i_feedEntriesTab);
		currentFeedEntryCheckBoxXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//input[@type='checkbox']" ,currentFeedEntriesTab, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		currentFeedEntryCheckBoxCount = currentFeedEntryCheckBoxXPathResult.snapshotLength;
		for(var i_feedEntryCheckBox=0;i_feedEntryCheckBox<currentFeedEntryCheckBoxCount;i_feedEntryCheckBox++)
		{
			currentFeedEntryCheckBox = currentFeedEntryCheckBoxXPathResult.snapshotItem(i_feedEntryCheckBox);
			currentFeedEntryCheckBox.checked = false;
		}
	}
};

grabMyBooks.feeds.addSelectedFeedEntriesToBook = function()
{
	var currentFeed;
	var currentSelectedFeedEntryCount;
	var currentToAddUrl;
	var linksToAdd = [];
	for(var i_feed=0; i_feed<grabMyBooks.feeds.feedItems.length;i_feed++)
	{
		currentFeed = grabMyBooks.feeds.feedItems[i_feed];
		currentFeed.selectedFeedEntries.sort(
			function(selectedFeedEntry1, selectedFeedEntry2)
			{
				return selectedFeedEntry1.index - selectedFeedEntry2.index;
			}
		);
		currentSelectedFeedEntryCount = currentFeed.selectedFeedEntries.length;
		for(var i_feed_entry=0; i_feed_entry<currentSelectedFeedEntryCount;i_feed_entry++)
		{
			currentToAddUrl = currentFeed.selectedFeedEntries[i_feed_entry].feedEntryUrl;
			linksToAdd.push(currentToAddUrl);
		}
	}

	var prepareAddToBookContextForFeedsFunction =
		function(addToBookContext)
		{
			addToBookContext.endFunction2 =
				function()
				{
					grabMyBooks.feeds.deSelectAllAfterAddToBook();
					grabMyBooks.feeds.updateFeedEntriesWithHistory();
				};
		};

	grabMyBooks.addLinks(linksToAdd, prepareAddToBookContextForFeedsFunction, grabMyBooks.feeds.popin.showAddToBookProgress);
};

grabMyBooks.feeds.addFeedItem = function(feedItem, addFeedContext)
{
	var i_feed = 0;
	var currentEqualResult;
	/*
	 * Don't add feed if already in list.
	 */
	for(i_feed=0; i_feed<grabMyBooks.feeds.feedItems.length;i_feed++)
	{
		currentEqualResult = grabMyBooks.feeds.feedItems[i_feed].equals(feedItem);
		if(currentEqualResult)
		{
			if(addFeedContext.replace)
			{
				grabMyBooks.feeds.feedItems[i_feed] = feedItem;
				return;
			}
			else
			{
				return;
			}
		}
	}
	if(!addFeedContext.replace)
	{
		grabMyBooks.feeds.feedItems.push(feedItem);
		grabMyBooks.feeds.sortFeedItems();
	}
};

grabMyBooks.feeds.createDummyFeed = function(feedName, feedUrl)
{
	var dummyFeed = new Object();
	dummyFeed.title = new Object();
	dummyFeed.title.text = feedName;
	var dummyFeedItem = new grabMyBooks.feeds.FeedItem(dummyFeed, feedUrl);
	dummyFeedItem.setDummy();
	return dummyFeedItem;
};

grabMyBooks.feeds.addDummyFeed = function(feedName, feedUrl, addFeedContext)
{
	var dummyFeedItem = grabMyBooks.feeds.createDummyFeed(feedName, feedUrl);
	grabMyBooks.feeds.addFeedItem(dummyFeedItem, addFeedContext);
};

grabMyBooks.feeds.refreshFeed = function(index)
{
	var feed = grabMyBooks.feeds.feedItems[index];
	grabMyBooks.feeds.addDummyFeed(feed.title, feed.url, new grabMyBooks.feeds.AddFeedContext(false, true, false));
	grabMyBooks.feeds.refreshFeedList();
	grabMyBooks.feeds.addFeed(feed.url, new grabMyBooks.feeds.AddFeedContext(false, true, false));
};

grabMyBooks.feeds.addFeedBase = function(feedUrl, onSuccessFunction, onErrorFunction)
{
	if(grabMyBooks.isEmpty(feedUrl))
	{
		return;
	}
	var req = new XMLHttpRequest();
		req.open('GET', feedUrl, true);
		req.onreadystatechange =
			function(feedUrl, onSuccessFunction, onErrorFunction)
			{
				return function (aEvt)
				{
					if (req.readyState == 4)
					{
						if(req.status == 200)
						{
							var responseText = req.responseText;
							grabMyBooks.feeds.handleFeedSource(feedUrl, responseText, onSuccessFunction, onErrorFunction);
						}
						else
						{
							onErrorFunction("Error getting feeds for ("+feedUrl+"), request status: "+req.status);
						}
					}
				};
			}(feedUrl, onSuccessFunction, onErrorFunction);
		req.send(null);
};

grabMyBooks.feeds.addFeed = function(feedUrl, addFeedContext)
{
	var onSuccessFunction =
		function(addFeedContext)
		{
			return function(feedItem)
			{
				grabMyBooks.feeds.addFeedItem(feedItem, addFeedContext);
				addFeedContext.endOfAdding(feedItem);
			};
		}(addFeedContext);

	var onErrorFunction =
		function(addFeedContext)
		{
			return function(errorMessage)
			{
				if(addFeedContext.showMessage)
				{
					grabMyBooks.feeds.popin.showMessage("Couldn't find a feed from url provided");
				}
			};
		}(addFeedContext);

	grabMyBooks.feeds.addFeedBase(feedUrl, onSuccessFunction, onErrorFunction);
};

grabMyBooks.feeds.handleFeedSource = function(feedUrl, feedSource, onSuccessFunction, onErrorFunction)
{
	try
	{
		var ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
		var feedProcessor = Components.classes["@mozilla.org/feed-processor;1"].createInstance(Components.interfaces.nsIFeedProcessor);


		var feedUri = ioService.newURI(feedUrl, null, null);

		var addFeedListener = new Object();
		addFeedListener.handleResult =
			function(feedUrl, onSuccessFunction, onErrorFunction)
			{
				return function(feedResult)
				{
					try
					{
						var feed = feedResult.doc;
						feed.QueryInterface(Components.interfaces.nsIFeed);
						var feedItemToAdd = new grabMyBooks.feeds.FeedItem(feed, feedUrl);
						onSuccessFunction(feedItemToAdd);
					}
					catch(e)
				    {
				       onErrorFunction(e+"::"+e.lineNumber);
				    }
				}
			}(feedUrl, onSuccessFunction, onErrorFunction);

		feedProcessor.listener = addFeedListener;
		feedProcessor.parseFromString(feedSource, feedUri);

	}
	catch(e)
    {
    	onErrorFunction(e+"::"+e.lineNumber);
    }
};

grabMyBooks.feeds.showFeedEntry = function(feedIndex, feedEntryIndex)
{
	if(feedIndex >= grabMyBooks.feeds.feedItems.length || feedIndex < 0)
	{
		return;
	}

	var feedItem = grabMyBooks.feeds.feedItems[feedIndex];
	var feedEntries = feedItem.feed.items;
	var linkPrefixToRemove = "chrome://browser/content";
	if(feedEntryIndex >= feedEntries.length || feedEntryIndex < 0)
	{
		return;
	}
	var feedEntry = feedEntries.queryElementAt(feedEntryIndex, Components.interfaces.nsIFeedEntry);
	var feedEntryUrl = feedEntry.link.resolve("");
	var feedEntryContent = [];

	feedEntryContent.push("<span class=\"closeFeedDetail\"><b>X</b></span><br>");

	var feedEntryUpdateDate = feedEntry.updated;

	if(!grabMyBooks.isEmpty(feedEntryUpdateDate))
	{
		feedEntryContent.push("<span class=\"feedEntryDate\">");
		feedEntryContent.push(feedEntryUpdateDate);
		feedEntryContent.push("</span><br>");
	}

	if (feedEntry.summary != null)
	{
		feedEntryContent.push(feedEntry.summary.text);
	}
	else if(feedEntry.content != null)
	{
		feedEntryContent.push(feedEntry.content.text);
	}
	else
	{
		feedEntryContent.push("No content");
	}
	grabMyBooks.setNodeContentFromString(grabMyBooks.feeds.tabBrowser.contentDocument, grabMyBooks.feeds.htmlFeedDetail, feedEntryContent.join("\n"));

	var feedEntrieContentHrefXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//a[@href]" ,grabMyBooks.feeds.htmlFeedDetail, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	var currentFeedEntryContentHref;
	var currentHref;
	for (var i_xPathNode = 0; i_xPathNode < feedEntrieContentHrefXPathResult.snapshotLength; i_xPathNode++)
	{
		currentFeedEntryContentHref = feedEntrieContentHrefXPathResult.snapshotItem(i_xPathNode);
		currentHref = currentFeedEntryContentHref.href;
		currentFeedEntryContentHref.target = "_blank";
		if(currentHref.indexOf(linkPrefixToRemove)==0)
		{
			currentFeedEntryContentHref.href = feedEntryUrl;
		}
	}

	var feedEntrieCloseButtonXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='closeFeedDetail']" ,grabMyBooks.feeds.htmlFeedDetail, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	var currentFeedEntryCloseButton;
	for (var i_xPathNode = 0; i_xPathNode < feedEntrieCloseButtonXPathResult.snapshotLength; i_xPathNode++)
	{
		currentFeedEntryCloseButton = feedEntrieCloseButtonXPathResult.snapshotItem(i_xPathNode);
		currentFeedEntryCloseButton.addEventListener("click",function(e){grabMyBooks.setNodeContentFromString(grabMyBooks.feeds.tabBrowser.contentDocument, grabMyBooks.feeds.htmlFeedDetail, "");},false);
	}
};

grabMyBooks.feeds.sortFeedItemsFunction = function(feedItem1, feedItem2)
{
	var feedItemTitle1 = feedItem1.title.toLowerCase();
	var feedItemTitle2 = feedItem2.title.toLowerCase();
	var result = feedItemTitle1.localeCompare(feedItemTitle2);
	return result;
};

grabMyBooks.feeds.sortFeedItems = function()
{
	grabMyBooks.feeds.feedItems.sort(grabMyBooks.feeds.sortFeedItemsFunction);
};

grabMyBooks.feeds.deleteFeed = function(feedIndex)
{
	var feedItemCount = grabMyBooks.feeds.feedItems.length;
	if(feedItemCount == 0 || feedIndex < 0 || feedIndex >= feedItemCount)
	{
		return;
	}
	grabMyBooks.feeds.feedItems.splice(feedIndex, 1);
	grabMyBooks.feeds.saveFeeds();
};

grabMyBooks.feeds.updateFeedEntriesWithHistory = function()
{
	var feedEntriesTabXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//table[@class='feedEntries']" ,grabMyBooks.feeds.htmlFeedList, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	var feedEntriesTabCount = feedEntriesTabXPathResult.snapshotLength;
	var currentFeedEntriesTab;
	var currentFeedEntryTextXPathResult;
	var currentFeedEntryTextCount;
	var currentFeedEntryText;
	var currentUrl;
	for(var i_feedEntriesTab=0;i_feedEntriesTab<feedEntriesTabCount;i_feedEntriesTab++)
	{
		currentFeedEntriesTab = feedEntriesTabXPathResult.snapshotItem(i_feedEntriesTab);
		currentFeedEntryTextXPathResult = grabMyBooks.feeds.tabBrowser.contentDocument.evaluate( ".//span[@class='feedEntry']" ,currentFeedEntriesTab, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
		currentFeedEntryTextCount = currentFeedEntryTextXPathResult.snapshotLength;

		for(var i_feedEntryText=0;i_feedEntryText<currentFeedEntryTextCount;i_feedEntryText++)
		{
			currentFeedEntryText = currentFeedEntryTextXPathResult.snapshotItem(i_feedEntryText);
			currentUrl = grabMyBooks.feeds.feedItems[i_feedEntriesTab].feed.items.queryElementAt(i_feedEntryText, Components.interfaces.nsIFeedEntry).link.resolve("");
			if(grabMyBooks.feeds.feedHistory.containsUrl(currentUrl))
			{
				currentFeedEntryText.style.fontWeight="normal";
			}
		}
	}
};

grabMyBooks.setNodeContentFromString = function(documentNode, node, text)
{
	var range = documentNode.createRange();
	range.selectNodeContents(node);
	range.deleteContents();
	var fragment = range.createContextualFragment(text);
	range.insertNode(fragment);
};

grabMyBooks.popin = new Object();
grabMyBooks.popin.Popin = function(tabBrowser)
{
	this.tabBrowser = tabBrowser;
	this.doc = this.tabBrowser.contentDocument;
	this.blocked = false;
	this.back = this.doc.getElementById("popinBack");
	this.popinDiv = this.doc.getElementById("popin");
	this.content = this.doc.getElementById("popinContent");
	this.defaultWidth = 400;
	this.defaultHeight = 200;
	this.currentWidth = this.defaultWidth;
	this.currentHeight = this.defaultHeight;

	this.setSize = function(width, height)
	{
		//ONLY_FIREFOX
		this.popinDiv.style.width = width+"px";
		this.popinDiv.style.height = height+"px";
		this.currentWidth = width;
        this.currentHeight = height;
		//ONLY_FIREFOX
	};

	this.centerPopinContent =
		function()
		{
			this.popinDiv.style.left=((this.doc.body.offsetWidth/2)-(this.currentWidth/2))+"px";
			this.popinDiv.style.top=((this.doc.body.offsetHeight/2)-(this.currentHeight/2))+"px";
		};

	this.show =
		function()
		{
			if(this.isVisible())
			{
				return;
			}
			this.back.style.display="block";
			this.popinDiv.style.display="block";
			this.doc.body.style.overflow="hidden";
			//ONLY_FIREFOX
			this.centerPopinContent();
			//ONLY_FIREFOX
		};

	this.showBlocking =
		function()
		{
			if(this.isVisible())
			{
				return;
			}
			this.blocked = true;
			this.show();
		};

	this.hide =
		function()
		{
			if(!this.isVisible())
			{
				return;
			}
			this.back.style.display="none";
			this.popinDiv.style.display="none";
			this.doc.body.style.overflow="auto";
			this.blocked = false;
			this.setSize(this.defaultWidth, this.defaultHeight);
			grabMyBooks.setNodeContentFromString(this.tabBrowser.contentDocument, this.content, "");
		};

	this.isVisible =
		function()
		{
			return this.back.style.display!="none";
		};

	var backClickFunction =
		function(popin)
		{
			return function(e)
			{
				if(popin.blocked)
				{
					return;
				}
				popin.hide();
			};
		}(this);

	this.back.addEventListener("click", backClickFunction, false);

	//ONLY_FIREFOX
	var resizeFunction =
		function(popin)
		{
			return function(e)
			{
				popin.centerPopinContent();
			};
		}(this);

	this.tabBrowser.addEventListener("resize", resizeFunction, false);
	//ONLY_FIREFOX
	this.hide();


	this.showMessage = function(messageText)
	{
		this.showMessage(messageText, null);
	};

	this.showMessage = function(messageText, okFunction)
	{
		var popinContent = [];
		popinContent.push(messageText);
		popinContent.push(grabMyBooks.menu.button("popinButtonOkSolo", "Ok", "OK", "popinButton"));
		var popinJoinedContent = popinContent.join("\n");
		grabMyBooks.setNodeContentFromString(this.tabBrowser.contentDocument, this.content, popinJoinedContent);
		var okButton = this.tabBrowser.contentDocument.getElementById("popinButtonOkSolo");
		var okButtonFunction =
			function(popin, okFunction)
			{
				return function(e)
				{
					if(okFunction != null)
					{
						okFunction();
					}
					popin.hide();
				};
			}(this, okFunction);
		okButton.addEventListener("click",okButtonFunction,false);

		this.show();
	};

	this.askNewOrEdit = function(messageText, newLabel, editLabel, elements, newFunction, editFunction, cancelFunction)
	{
		var popinContent = [];
		popinContent.push("<div style=\"font-weight:bold;margin-bottom:20px;\">");
		popinContent.push(messageText);
		popinContent.push("</div>");
		popinContent.push("<div style=\"margin-left:40px;\">");
		popinContent.push("<div style=\"margin-bottom:10px;\">");
		popinContent.push("<input id=\"newOrEdit_new\" type=\"radio\" name=\"newOrEdit\" value=\"new\" checked>");
		popinContent.push(newLabel);
		popinContent.push("</div>");
		popinContent.push("<div style=\"margin-bottom:10px;\">");
		popinContent.push("<input id=\"newOrEdit_edit\" type=\"radio\" name=\"newOrEdit\" value=\"edit\">");
		popinContent.push(editLabel);
		popinContent.push("</div>");
		popinContent.push("<select id=\"newOrEditSelect\" style=\"margin-left:30px;\" disabled=\"true\">");
		popinContent.push("<option value=\"\" selected></option>");
		var currentElement;
		for(var i_element=0; i_element<elements.length; i_element++)
		{
			currentElement = elements[i_element];
			popinContent.push("<option value=\""+currentElement.value+"\">"+currentElement.name+"</option>");
		}
		popinContent.push("</select>");
		popinContent.push("</div>");
		popinContent.push(grabMyBooks.menu.button("popinButtonOk", "Ok", "OK", "popinButton"));
		popinContent.push(grabMyBooks.menu.button("popinButtonCancel", "Cancel", "CANCEL", "popinButton"));
		var popinJoinedContent = popinContent.join("\n");
		grabMyBooks.setNodeContentFromString(this.tabBrowser.contentDocument, this.content, popinJoinedContent);

		var okButton = this.tabBrowser.contentDocument.getElementById("popinButtonOk");
		var cancelButton = this.tabBrowser.contentDocument.getElementById("popinButtonCancel");

		var newOrEditNewInput = this.tabBrowser.contentDocument.getElementById("newOrEdit_new");
		var newOrEditEditInput = this.tabBrowser.contentDocument.getElementById("newOrEdit_edit");
		var newOrEditSelect = this.tabBrowser.contentDocument.getElementById("newOrEditSelect");

		var newOrEditClickFunction =
			function(newOrEditNewInput, newOrEditSelect)
			{
				return function(e)
				{
					newOrEditSelect.disabled = newOrEditNewInput.checked;
				};
			}(newOrEditNewInput, newOrEditSelect);

		newOrEditNewInput.addEventListener("click",newOrEditClickFunction,false);
		newOrEditEditInput.addEventListener("click",newOrEditClickFunction,false);

		var okButtonFunction =
			function(newFunction, editFunction, newOrEditNewInput, newOrEditSelect, popin)
			{
				return function(e)
				{
					if(newOrEditNewInput.checked)
					{
						newFunction();
						popin.hide();
						return;
					}
					var selectedIndex = newOrEditSelect.selectedIndex;
					if(selectedIndex==0)
					{
						return;
					}
					var selectedValue = newOrEditSelect.options[selectedIndex].value;
					editFunction(selectedValue);
					popin.hide();
				};
			}(newFunction, editFunction, newOrEditNewInput, newOrEditSelect, this);

		okButton.addEventListener("click",okButtonFunction,false);

		var cancelButtonFunction =
			function(cancelFunction, popin)
			{
				return function(e)
				{
					if(cancelFunction != null)
					{
						cancelFunction();
					}
					popin.hide();
				};
			}(cancelFunction, this);

		cancelButton.addEventListener("click",cancelButtonFunction,false);

		this.show();
	};

	this.askForAction = function(messageText, actionFunction, cancelFunction)
	{
		var popinContent = [];
		popinContent.push("<div>");
		popinContent.push(messageText);
		popinContent.push("</div>");
		popinContent.push(grabMyBooks.menu.button("popinButtonOk", "Ok", "OK", "popinButton"));
		popinContent.push(grabMyBooks.menu.button("popinButtonCancel", "Cancel", "CANCEL", "popinButton"));
		var popinJoinedContent = popinContent.join("\n");
		grabMyBooks.setNodeContentFromString(this.tabBrowser.contentDocument, this.content, popinJoinedContent);

		var okButton = this.tabBrowser.contentDocument.getElementById("popinButtonOk");
		var cancelButton = this.tabBrowser.contentDocument.getElementById("popinButtonCancel");

		var okButtonFunction =
			function(actionFunctionParam, popin)
			{
				return function(e)
				{
					actionFunctionParam();
					popin.hide();
				};
			}(actionFunction, this);

		var cancelButtonFunction =
			function(cancelFunction, popin)
			{
				return function(e)
				{
					if(cancelFunction != null)
					{
						cancelFunction();
					}
					popin.hide();
				};
			}(cancelFunction, this);

		okButton.addEventListener("click",okButtonFunction,false);
		cancelButton.addEventListener("click",cancelButtonFunction,false);

		this.show();
	};

	this.askForInput = function(messageText, initialValue, inputFunction, cancelFunction, validateFunction)
	{
		var popinContent = [];
		popinContent.push("<div id=\"popinErrorMessage\" style=\"color:red;\">");
		popinContent.push("</div>");
		popinContent.push("<div>");
		popinContent.push(messageText);
		popinContent.push("</div>");
		popinContent.push("<div>");
		popinContent.push("<input id=\"popinInput\" style=\"width:80%;margin-top:20px;margin-left:30px;\" type=\"text\">");
		popinContent.push("</div>");
		popinContent.push(grabMyBooks.menu.button("popinButtonOk", "Ok", "OK", "popinButton"));
		popinContent.push(grabMyBooks.menu.button("popinButtonCancel", "Cancel", "CANCEL", "popinButton"));
		var popinJoinedContent = popinContent.join("\n");
		grabMyBooks.setNodeContentFromString(this.tabBrowser.contentDocument, this.content, popinJoinedContent);

		var okButton = this.tabBrowser.contentDocument.getElementById("popinButtonOk");
		var cancelButton = this.tabBrowser.contentDocument.getElementById("popinButtonCancel");
		var input = this.tabBrowser.contentDocument.getElementById("popinInput");
		var popinErrorMessage = this.tabBrowser.contentDocument.getElementById("popinErrorMessage");

		if(initialValue != null)
		{
			input.value = initialValue;
		}
		input.focus();
		var okButtonFunction =
			function(inputFunctionParam, popin, input, popinErrorMessage)
			{
				return function(e)
				{
					var inputValue = input.value.trim();
					if(grabMyBooks.isEmpty(inputValue))
					{
						popin.hide();
						return;
					}
					if(validateFunction != null)
					{
						var validationErrorMessages = validateFunction(inputValue);
						if(validationErrorMessages.length>0)
						{
							grabMyBooks.setNodeContentFromString(popin.doc, popinErrorMessage, validationErrorMessages.join("<br>"));
							return;
						}
					}
					inputFunctionParam(inputValue);
					popin.hide();
				};
			}(inputFunction, this, input, popinErrorMessage);

		var cancelButtonFunction =
			function(cancelFunction, popin)
			{
				return function(e)
				{
					if(cancelFunction != null)
					{
						cancelFunction();
					}
					popin.hide();
				};
			}(cancelFunction, this);

		okButton.addEventListener("click",okButtonFunction,false);
		cancelButton.addEventListener("click",cancelButtonFunction,false);

		this.show();
	};

	this.askForColor = function(okFunction, cancelFunction, initialColor)
	{
		var colorHolder = new Object();

		var popinContent = [];
		popinContent.push("<div id=\"popinErrorMessage\" style=\"color:red;\">");
		popinContent.push("</div>");
		popinContent.push("<div>");
		popinContent.push("Please select a color");
		popinContent.push("</div>");
		popinContent.push("<table id=\"colorsTable\" style=\"vertical-align:middle;margin-top:20px;\">");
		popinContent.push("<tr>");
		popinContent.push("<td rowspan=\"2\" id=\"popinSelectedColor\" style=\"width:80px;text-align:center;vertical-align:middle;\">Selected color</td>");
		var colorFunction =
			function(popinContent)
			{
				return function(color, index, count)
				{
					popinContent.push("<td class=\"popinColor\" style=\"cursor:pointer;background:"+color+";width:50px;height:50px;\"></td>");
					if((index+1)%5==0)
					{
						popinContent.push("</tr><tr>");
					}
				};
			}(popinContent);
		grabMyBooks.tabDo(grabMyBooks.color.colorRangeTab, colorFunction);
		popinContent.push("<td id=\"popinRandomColor\" style=\"cursor:pointer;background:rgb(230,230,230);width:50px;height:50px;text-align:center;\">?</td>");
		popinContent.push("</tr>");
		popinContent.push("</table>");
		popinContent.push(grabMyBooks.menu.button("popinButtonOk", "Ok", "OK", "popinButton"))
		popinContent.push(grabMyBooks.menu.button("popinButtonCancel", "Cancel", "CANCEL", "popinButton"));
		var popinJoinedContent = popinContent.join("\n");
		grabMyBooks.setNodeContentFromString(this.tabBrowser.contentDocument, this.content, popinJoinedContent);

		var okButton = this.tabBrowser.contentDocument.getElementById("popinButtonOk");
		var cancelButton = this.tabBrowser.contentDocument.getElementById("popinButtonCancel");
		var popinErrorMessage = this.tabBrowser.contentDocument.getElementById("popinErrorMessage");
		var popinSelectedColorNode = this.tabBrowser.contentDocument.getElementById("popinSelectedColor");
		var colorsTable =  this.tabBrowser.contentDocument.getElementById("colorsTable");
		var randomColorNode = this.tabBrowser.contentDocument.getElementById("popinRandomColor");

		var selectColorFunction =
			function(popinSelectedColorNode, colorHolder)
			{
				return function(color)
				{
					colorHolder.selectedColor = color;
					popinSelectedColorNode.style.background = color;
				};
			}(popinSelectedColorNode, colorHolder);


		var addColorClickListener =
			function(selectColorFunction)
			{
				return function(node, index, count)
				{
					var colorClickFunction =
						function(selectColorFunction, index)
						{
							return function(e)
							{
								var color = grabMyBooks.color.colorRangeTab[index];
								selectColorFunction(color);
							};
						}(selectColorFunction, index);
					node.addEventListener("click", colorClickFunction, false);
				};
			}(selectColorFunction);
		grabMyBooks.xml.xPathQueryFunction(".//*[@class='popinColor']", this.tabBrowser.contentDocument, colorsTable, addColorClickListener);

		var randomColorClickFunction =
			function(selectColorFunction)
			{
				return function(e)
				{
					var randomColor = grabMyBooks.color.generateColor();
					selectColorFunction(randomColor);
				};
			}(selectColorFunction);

		randomColorNode.addEventListener("click", randomColorClickFunction, false);

		selectColorFunction(initialColor);

		var okButtonFunction =
			function(popin, colorHolder, popinErrorMessage, okFunction)
			{
				return function(e)
				{
					okFunction(colorHolder.selectedColor);
					popin.hide();
				};
			}(this, colorHolder, popinErrorMessage, okFunction);

		var cancelButtonFunction =
			function(cancelFunction, popin)
			{
				return function(e)
				{
					if(cancelFunction != null)
					{
						cancelFunction();
					}
					popin.hide();
				};
			}(cancelFunction, this);

		okButton.addEventListener("click",okButtonFunction,false);
		cancelButton.addEventListener("click",cancelButtonFunction,false);

		this.show();
	};

	this.showLoadingProcess = function(loadingProcessContext)
	{
		var progressBarWidth = 390;

		var popinContent = [];
		popinContent.push(
			"Processing...",
			"<div id=\"popinProgressBarBack\" style=\"width:"+progressBarWidth+"px;height:30px;text-align:center;border-style:solid;border-color:black;border-width:1px;padding:1px;position:relative;margin-top:5px;\">",
			"	<div id=\"popinProgressBar\" style=\"width:0px;height:30px;background-color:blue;position:absolute;top:1px;left:1px;opacity:0.5;\">",
			"	</div>",
			"	<div id=\"progress\" style=\"position:absolute;width:100px;left:50%;top:50%;margin-left:-50px;margin-top:-10px;\">",
			"		"+loadingProcessContext.percentDone,
			"	</div>",
			"</div>",
			"<div id=\"notCompletedTasks\" style=\"height:100px;overflow:auto;font-size:0.8em;margin-top:5px;margin-bottom:5px;\"></div>",
			grabMyBooks.menu.button("popinButtonCancel", "Cancel", "CANCEL", "popinButton"),
			"<span id=\"cancelPending\" title=\"Cancel pending tasks\"><img src=\"chrome://grabMyBooks/content/icons/common/cancelRoundRed.png\">Cancel all pending tasks</span>"
			);

		var popinJoinedContent = popinContent.join("\n");
		grabMyBooks.setNodeContentFromString(this.tabBrowser.contentDocument, this.content, popinJoinedContent);

		var progressBar = this.tabBrowser.contentDocument.getElementById("popinProgressBar");


		var cancelButton = this.tabBrowser.contentDocument.getElementById("popinButtonCancel");

		var cancelButtonFunction =
			function(loadingProcessContext, popin)
			{
				return function(e)
				{
					popin.hide();
					loadingProcessContext.performCancel();
					loadingProcessContext.longWaitingTimer.cancel();
				};
			}(loadingProcessContext, this);

		cancelButton.addEventListener("click",cancelButtonFunction,false);

		var cancelPendingNode = this.tabBrowser.contentDocument.getElementById("cancelPending");
		var cancelPendingFunction =
			function(loadingProcessContext)
			{
				return function(e)
				{
					loadingProcessContext.performTaskCancelAllRemaining();
				};
			}(loadingProcessContext);
		cancelPendingNode.addEventListener("click",cancelPendingFunction,false);


		var notCompletedTasksNode = this.tabBrowser.contentDocument.getElementById("notCompletedTasks");

		var updateNotCompletedTasksNodeFunction =
			function(notCompletedTasksNode, cancelPendingNode, loadingProcessContext, doc, popin)
			{
				return function()
				{
					if(loadingProcessContext.taskInfos.length==0)
					{
						grabMyBooks.setNodeContentFromString(doc, notCompletedTasksNode, "");
						return;
					}

					cancelPendingNode.style.display = "none";

					var content = [];
					content.push("Waiting for:<br>");
					var currentTaskInfo;
					content.push("<ul>");
					for(var i_taskInfo=0; i_taskInfo<loadingProcessContext.taskInfos.length; i_taskInfo++)
					{
						currentTaskInfo = loadingProcessContext.taskInfos[i_taskInfo];
						content.push("<li>");
						content.push(currentTaskInfo.name);
						content.push("<img title=\"Cancel item\" src=\"chrome://grabMyBooks/content/icons/common/cancelRoundRed.png\" style=\"display:none;cursor:pointer;vertical-align:middle;margin:2px;\" alt=\"Cancel\" class=\"taskInfoCancel\">");
						content.push("</li>");
					}
					content.push("</ul>");
					var joinedContent = content.join("\n");
					grabMyBooks.setNodeContentFromString(doc, notCompletedTasksNode, joinedContent);

					var taskInfoCancelXPathResult = doc.evaluate( ".//img[@class='taskInfoCancel']" ,notCompletedTasksNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
					var currentTaskInfoCancelNode;
					var currentTaskInfoOnCancelFunction;
					var taskInfoCancelNodes = [];
					for(var i_taskInfo=0; i_taskInfo<loadingProcessContext.taskInfos.length; i_taskInfo++)
					{
						currentTaskInfo = loadingProcessContext.taskInfos[i_taskInfo];
						currentTaskInfoCancelNode = taskInfoCancelXPathResult.snapshotItem(i_taskInfo);
						taskInfoCancelNodes.push(currentTaskInfoCancelNode);
						currentTaskInfoOnCancelFunction =
							function(taskInfo, loadingProcessContext, popin)
							{
								return function(e)
								{
									loadingProcessContext.nextLongWaitingTime = 1;
									loadingProcessContext.performTaskCancel(taskInfo.name);
									if(loadingProcessContext.taskInfos.length==0)
									{
										popin.hide();
									}
								};
							}(currentTaskInfo, loadingProcessContext, popin);
						currentTaskInfoCancelNode.addEventListener("click", currentTaskInfoOnCancelFunction, false);
					}
					if(taskInfoCancelNodes.length>0)
					{
						var timerEvent = new Object();
						timerEvent.notify =
							function(taskInfoCancelNodes, cancelPendingNode)
							{
								return function(timer)
								{
									var currentTaskInfoCancelNode;
									for(var i_taskInfoCancelNode=0; i_taskInfoCancelNode<taskInfoCancelNodes.length; i_taskInfoCancelNode++)
									{
										currentTaskInfoCancelNode = taskInfoCancelNodes[i_taskInfoCancelNode];
										currentTaskInfoCancelNode.style.display = "inline";
									}
									cancelPendingNode.style.display = "inline";
								};
							}(taskInfoCancelNodes, cancelPendingNode);
						grabMyBooks.ext.initTimerWithCallback_OneShot(loadingProcessContext.longWaitingTimer, timerEvent, loadingProcessContext.nextLongWaitingTime);
						loadingProcessContext.nextLongWaitingTime = loadingProcessContext.longWaitingTime;
					}
				};
			}(notCompletedTasksNode, cancelPendingNode, loadingProcessContext, this.tabBrowser.contentDocument, this);

		updateNotCompletedTasksNodeFunction();

		var progressNode = this.tabBrowser.contentDocument.getElementById("progress");

		var onTaskDoneOrCanceledFunction =
			function(loadingProcessContext, progressNode, doc, progressBar, progressBarWidth, updateNotCompletedTasksNodeFunction)
			{
				return function(taskInfo)
				{
					loadingProcessContext.longWaitingTimer.cancel();
					var percentDone = loadingProcessContext.percentDone;
					progressBar.style.width=parseInt(progressBarWidth*percentDone/100)+"px";
					grabMyBooks.setNodeContentFromString(doc, progressNode, ""+parseInt(percentDone));
					updateNotCompletedTasksNodeFunction();
				};
			}(loadingProcessContext, progressNode, this.tabBrowser.contentDocument, progressBar, progressBarWidth, updateNotCompletedTasksNodeFunction);


		loadingProcessContext.onTaskDone = onTaskDoneOrCanceledFunction;
		loadingProcessContext.onTaskCanceledTab.push(onTaskDoneOrCanceledFunction);

		loadingProcessContext.onAllTasksDone =
			function(popin)
			{
				return function()
				{
					popin.hide();
				};
			}(this);

		this.showBlocking();
	};

	this.showAddToBookProgress =
		function(popin)
		{
			return function(addToBookContext)
			{
				var taskInfos = [];

				var currentBookUrl;
				var currentUrlTaskInfo;
				for(var i_bookUrl=0; i_bookUrl<addToBookContext.articleLinks.length; i_bookUrl++)
				{
					currentBookUrl = addToBookContext.articleLinks[i_bookUrl];
					currentUrlTaskInfo = new grabMyBooks.popin.TaskInfo(currentBookUrl, "Loading url...");
					taskInfos.push(currentUrlTaskInfo);
				}

				var loadingProcessContext = new grabMyBooks.popin.LoadingProcessContext(taskInfos);
				loadingProcessContext.onCancel =
					function(addToBookContext)
					{
						return function()
						{
							addToBookContext.cancel();
						};
					}(addToBookContext);

				loadingProcessContext.onTaskCanceledTab.push(
					function(addToBookContext)
					{
						return function(taskInfo)
						{
							addToBookContext.onUrlCanceled(taskInfo.name);
						};
					}(addToBookContext));

				addToBookContext.endFunction =
					function(loadingProcessContext)
					{
						return function()
						{
							loadingProcessContext.performAllTasksDone();
						};
					}(loadingProcessContext);

				addToBookContext.urlRedirectionFunction =
					function(loadingProcessContext)
					{
						return function(oldUrl, newUrl)
						{
							var currentTaskInfo;
							for(var i_taskInfo=0; i_taskInfo<loadingProcessContext.taskInfos.length; i_taskInfo++)
							{
								currentTaskInfo = loadingProcessContext.taskInfos[i_taskInfo];
								if(currentTaskInfo.name==oldUrl)
								{
									currentTaskInfo.name=newUrl;
								}
							}
						};
					}(loadingProcessContext);

				addToBookContext.onUrlAddedFunction =
					function(loadingProcessContext)
					{
						return function(url, afterUrl)
						{
							var newUrlTaskInfo = new grabMyBooks.popin.TaskInfo(url, "Loading url...");
							loadingProcessContext.taskInfos.push(newUrlTaskInfo);
							var afterTaskInfo = grabMyBooks.tabGet(loadingProcessContext.taskInfos, afterUrl);
							var newPercent = afterTaskInfo.percentPart/2;
							afterTaskInfo.percentPart = newPercent;
							newUrlTaskInfo.percentPart = newPercent;
						};
					}(loadingProcessContext);

				addToBookContext.articleInfoAddedFunction =
					function(loadingProcessContext)
					{
						return function(articleInfo)
						{
							loadingProcessContext.performTaskDone(articleInfo.url);
						};
					}(loadingProcessContext);

				addToBookContext.endDelay = 500;

				popin.showLoadingProcess(loadingProcessContext);
			};
		}(this);

	this.showBookWidget = function(linkBook)
	{
		var widgetContext = new grabMyBooks.linkBook.WidgetContext();
		var widgetHtml = linkBook.getAsHtmlWidget(widgetContext);

		var contentTab = [];
		contentTab.push(
			"<table style=\"width:100%;\">",
			"	<tr>",
			"		<td colspan=\"2\" style=\"text-align:center;padding-bottom:20px;\">Share this book with the following html code</td>",
			"	</tr>",
			"	<tr>",
			"		<td style=\"text-align:center;\">",
			widgetHtml,
			"		</td>",
			"		<td style=\"text-align:center;\">",
			"			<textarea style=\"width:300px;height:200px;\">",
			widgetHtml,
			"			</textarea>",
			"		</td>",
			"	</tr>",
			"</table>"
		);

		var result = contentTab.join("\n");

		this.setSize(600, 300);
		this.showMessage(result);
	};

	this.setSize(this.defaultWidth, this.defaultHeight);
};


grabMyBooks.popin.css = function()
{
    var contentTab = [];

    contentTab.push(
        "			#popinBack{display:none;z-index:10;position:fixed;top:0px;left:0px;bottom:0px;right:0px;background-color:black;opacity:0.5}",
        "			#popin{display:none;border-radius:15px;padding:20px;z-index:15;position:absolute;top:0px;left:0px;background-color:white;border-style:solid;border-color:black;border-width:1px;}",
        "			#popin #popinContent{position:relative;height:100%;font-family:Helvetica,Arial,sans-serif;font-size:0.9em;}",
        "			#popin #popinContent #popinButtonOk{left:160px}",
        "			#popin #popinContent #popinButtonSave{right:100px}",
        "			#popin #popinContent #popinButtonOkSolo{right:0px}",
        "			#popin #popinContent #popinButtonCancel{right:0px}",
        "			#popin #popinContent #popinButtonCancel2{right:160px}",
        "			#popin #popinContent .popinButton{position:absolute;bottom:0px;}",
        "			#popin #popinContent #cancelPending {display:none;position:absolute;bottom:0px;left:0px;font-size:0.8em;cursor:pointer;}",
        "			#popin #popinContent #cancelPending img {vertical-align:middle;margin-right:5px;}",
        "			.popinButton {cursor:pointer;margin-left:2px;margin-right:2px;}",
        "			#popin #popinContent input[type=\"text\"] {width:100%;border-style:solid;border-color:black;border-width:1px;}",
        "			#popin #popinContent textarea {width:100%;height:60px;border-style:solid;border-color:black;border-width:1px;}"
    );

    var result = contentTab.join("\n");
    return result;
};


grabMyBooks.popin.LoadingProcessContext = function(taskInfos)
{
	this.taskInfos = taskInfos;
	this.canceledTaskInfos = [];
	this.onCancel = null;
	this.onTaskDone = null;
	this.onTaskCanceledTab = [];
	this.onAllTasksDone = null;
	this.percentDone = 0;
	this.atLeastOneTaskDone = false;
	this.longWaitingTime = 5000;
	this.nextLongWaitingTime = this.longWaitingTime;
	this.longWaitingTimer = grabMyBooks.ext.createTimer();

	this.computeTasksPercents = function()
	{
		var percentLeft = 100 - this.percentDone;
		var taskCount = this.taskInfos.length;
		var toSetPercentValue = percentLeft/taskCount;
		var currentTaskInfo;
		for(var i_taskInfos=0; i_taskInfos<taskCount; i_taskInfos++)
		{
			currentTaskInfo = this.taskInfos[i_taskInfos];
			currentTaskInfo.percentPart = toSetPercentValue;
		}
	};

	this.computeTasksPercents();

	this.performCancel = function()
	{
		if(this.onCancel != null)
		{
			this.onCancel();
		}
	};

	this.performTaskDone = function(taskName)
	{
		var currentTaskInfo;
		for(var i_taskInfos=0; i_taskInfos<this.taskInfos.length; i_taskInfos++)
		{
			currentTaskInfo = this.taskInfos[i_taskInfos];
			if(currentTaskInfo.name==taskName)
			{
				this.taskInfos.splice(i_taskInfos, 1);
				this.percentDone+=currentTaskInfo.percentPart;
				this.atLeastOneTaskDone = true;
				if(this.onTaskDone != null)
				{
					this.onTaskDone(currentTaskInfo);
				}
				break;
			}
		}
	};

	this.performTaskCancelAllRemaining = function()
	{
		var taskInfosCount = this.taskInfos.length;
		var currentTaskInfo;
		for(var i_task=0; i_task<taskInfosCount; i_task++)
		{
			currentTaskInfo = this.taskInfos[0];
			this.performTaskCancel(currentTaskInfo.name);
		}
	};

	this.performTaskCancel = function(taskName)
	{
		var currentTaskInfo;
		var taskInfosCount = this.taskInfos.length;
		for(var i_taskInfos=0; i_taskInfos<taskInfosCount; i_taskInfos++)
		{
			currentTaskInfo = this.taskInfos[i_taskInfos];
			if(currentTaskInfo.name==taskName)
			{
				this.canceledTaskInfos.push(currentTaskInfo);
				this.taskInfos.splice(i_taskInfos, 1);
				this.percentDone+=currentTaskInfo.percentPart;
				var currentOnTaskCanceledListener;
				for(i_onTaskCanceledListener=0; i_onTaskCanceledListener<this.onTaskCanceledTab.length; i_onTaskCanceledListener++)
				{
					currentOnTaskCanceledListener = this.onTaskCanceledTab[i_onTaskCanceledListener];
					currentOnTaskCanceledListener(currentTaskInfo);
				}
				if(taskInfosCount == 1 && !this.atLeastOneTaskDone)
				{
					this.performCancel();
				}
				break;
			}
		}
	};

	this.hasTaskBeenCanceled = function(taskName)
	{
		var canceledTaskInfosCount = this.canceledTaskInfos.length;
		var currentCanceledTaskInfo;
		for(var i_canceledTaskInfos=0; i_canceledTaskInfos<canceledTaskInfosCount; i_canceledTaskInfos++)
		{
			currentCanceledTaskInfo = this.canceledTaskInfos[i_canceledTaskInfos];
			if(taskName==currentCanceledTaskInfo.name)
			{
				return true;
			}
		}
		return false;
	};

	this.performAllTasksDone = function()
	{
		this.taskInfos = [];
		this.percentDone = 100;
		if(this.onAllTasksDone != null)
		{
			this.onAllTasksDone();
		}
	};
};

grabMyBooks.popin.TaskInfo = function(name, displayName)
{
	this.name = name;
	this.displayName = displayName;
	this.percentPart;

	this.identify = function(name)
	{
		return (this.name==name);
	};
};

grabMyBooks.popin.bubbleIdcounter = 0;
grabMyBooks.popin.BubbleContext = function(doc, targetNode)
{
	this.doc = doc;
	this.targetNode = targetNode;
	this.targetNodePositionXShift = 0;
	this.targetNodePositionYShift = 0;
	this.content = null;
	this.shouldDisplayBubbleFunction = null;
	this.width=140;
	this.height=40;
	this.mouseZoneWidth = null;
	this.mouseZoneLeftMove = null;
	this.type = "bottomRight";
};
grabMyBooks.popin.Bubble = function(bubbleContext)
{
	this.id = grabMyBooks.popin.bubbleIdcounter++;
	this.bubbleContext = bubbleContext;
	this.doc = bubbleContext.doc;

	this.top=-500;
	this.left=-500;
	this.width=bubbleContext.width;
	this.height=bubbleContext.height;

	var bubbleMouseZone = this.doc.createElement("div");
	var bubblePointer = this.doc.createElement("div");
	var bubblePointerBorder = this.doc.createElement("div");
	var bubbleContent= this.doc.createElement("div");
	var bubbleClose = this.doc.createElement("div");


	var bubbleAndTargetContainer = this.doc.createElement("div");
	bubbleAndTargetContainer.style.display="inline";
	bubbleAndTargetContainer.style.position="relative";
	bubbleContext.targetNode.style.zIndex=2;
	bubbleContext.targetNode.style.position="relative";
	bubbleContext.targetNode.parentNode.replaceChild(bubbleAndTargetContainer, bubbleContext.targetNode);
	bubbleAndTargetContainer.appendChild(bubbleContext.targetNode);
	this.getContainerNode =
		function(bubbleAndTargetContainer)
		{
			return function()
			{
				return bubbleAndTargetContainer;
			};
		}(bubbleAndTargetContainer);


	bubbleClose.style.display="none";
	bubbleClose.style.position="absolute";
	bubbleClose.style.cursor="pointer";
	bubbleClose.style.zIndex="7";
	bubbleClose.style.fontFamily="Helvetica,Arial,sans-serif";
	bubbleClose.style.fontSize="12px";
	bubbleClose.style.fontWeight="bold";

	bubbleMouseZone.style.display="none";
	bubbleMouseZone.style.position="absolute";
	bubbleMouseZone.style.zIndex="1";
	//bubbleMouseZone.style.border="solid 2px blue";

	bubblePointer.style.display="none";
	bubblePointer.style.position="absolute";
	bubblePointer.style.zIndex="6";
	bubblePointer.style.width="0px";
	bubblePointer.style.height="0px";
	bubblePointer.style.borderTop="0px";
	bubblePointer.style.borderLeft="0px";
	bubblePointer.style.borderRight="5px solid transparent";
	bubblePointer.style.borderBottom="7px solid white";

	bubblePointerBorder.style.display="none";
	bubblePointerBorder.style.position="absolute";
	bubblePointerBorder.style.zIndex="4";
	bubblePointerBorder.style.width="0px";
	bubblePointerBorder.style.height="0px";
	bubblePointerBorder.style.borderTop="0px";
	bubblePointerBorder.style.borderLeft="0px";
	bubblePointerBorder.style.borderRight="7px solid transparent";
	bubblePointerBorder.style.borderBottom="7px solid black";

	bubbleContent.style.display="none";
	bubbleContent.style.position="absolute";
	bubbleContent.style.zIndex="5";
	bubbleContent.style.background="white";
	bubbleContent.style.border="solid 1px black";
	bubbleContent.style.borderRadius="0px 10px 10px 10px";

	if(bubbleContext.type=="bottomCenter")
	{
		bubbleContent.style.borderRadius="10px 10px 10px 10px";
		bubblePointer.style.borderLeft="2px solid transparent";
		bubblePointer.style.borderRight="2px solid transparent";
		bubblePointerBorder.style.borderLeft="3px solid transparent";
		bubblePointerBorder.style.borderRight="3px solid transparent";
	}
	else if(bubbleContext.type=="bottomLeft")
	{
		bubbleContent.style.borderRadius="10px 0px 10px 10px";
		bubblePointer.style.borderRight="0px";
		bubblePointer.style.borderLeft="5px solid transparent";
		bubblePointerBorder.style.borderRight="0px";
		bubblePointerBorder.style.borderLeft="7px solid transparent";
	}


	bubbleContent.style.textAlign="left";
	bubbleContent.style.padding="5px";
	bubbleContent.style.fontWeight="normal";

	bubbleAndTargetContainer.appendChild(bubbleMouseZone);
	bubbleAndTargetContainer.appendChild(bubblePointer);
	bubbleAndTargetContainer.appendChild(bubblePointerBorder);
	bubbleAndTargetContainer.appendChild(bubbleContent);
	bubbleAndTargetContainer.appendChild(bubbleClose);

	grabMyBooks.setNodeContentFromString(this.doc, bubbleClose, "X");

	var closeBubbleFunction =
		function(bubble)
		{
			return function(e)
			{
				bubble.hide();
			};
		}(this);
	var mouseOutCloseBubbleFunction =
		function(bubble, bubbleContent, bubblePointerBorder, bubblePointer, bubbleMouseZone, bubbleClose)
		{
			return function(e)
			{
				if(!grabMyBooks.isEmptyObject(e.relatedTarget))
				{
					if(grabMyBooks.isNodeChildOf(e.relatedTarget, bubbleContent))
					{
						return;
					}
					if(e.relatedTarget == bubblePointerBorder)
					{
						return;
					}
					if(e.relatedTarget == bubblePointer)
					{
						return;
					}
					if(e.relatedTarget == bubbleMouseZone)
					{
						return;
					}
					if(e.relatedTarget == bubbleClose)
					{
						return;
					}
				}
				bubble.hide();
			};
		}(this, bubbleContent, bubblePointerBorder, bubblePointer, bubbleMouseZone, bubbleClose);

	var mouseOutTargetCloseBubbleFunction =
		function(bubble, bubbleMouseZone, bubbleContent)
		{
			return function(e)
			{
				var x = e.pageX;
				var y = e.pageY;
				var mouseOnMouseZone = grabMyBooks.isPositionOnNode(x, y, bubbleMouseZone);
				var mouseOnContent = grabMyBooks.isPositionOnNode(x, y, bubbleContent);
				if(!mouseOnMouseZone && !mouseOnContent)
				{
					bubble.hide();
				}
			};
		}(this, bubbleMouseZone, bubbleContent);

	bubbleClose.addEventListener("click", closeBubbleFunction, false);
	bubbleMouseZone.addEventListener("mouseout", mouseOutCloseBubbleFunction, false);
	bubbleContent.addEventListener("mouseout", mouseOutCloseBubbleFunction, false);

	var showBubbleFunction =
		function(bubble)
		{
			return function(e)
			{
				if(bubble.bubbleContext.shouldDisplayBubbleFunction!=null && !bubble.bubbleContext.shouldDisplayBubbleFunction())
				{
					return;
				}
				bubble.show();
			};
		}(this);

	bubbleContext.targetNode.addEventListener("mouseover", showBubbleFunction, false);
	bubbleContext.targetNode.addEventListener("mouseout", mouseOutTargetCloseBubbleFunction, false);

	this.setContent =
		function(doc, bubbleContent)
		{
			return function(content)
			{
				grabMyBooks.setNodeContentFromString(doc, bubbleContent, content);
			};
		}(this.doc, bubbleContent);

	if(!grabMyBooks.isEmpty(bubbleContext.content))
	{
		this.setContent(bubbleContext.content);
	}

	this.position =
		function(bubble, bubbleMouseZone, bubblePointer, bubblePointerBorder, bubbleContent, bubbleClose)
		{
			return function(x, y, width, height)
			{
				var mouseZonePadding = 10;

				var bubblePointerBorderX = width/2 + bubble.bubbleContext.targetNodePositionXShift;
				var bubblePointerBorderY = height + bubble.bubbleContext.targetNodePositionYShift;;

				bubblePointerBorder.style.top = bubblePointerBorderY+"px";
				bubblePointerBorder.style.left = bubblePointerBorderX+"px";
				bubblePointer.style.top = (bubblePointerBorderY+1)+"px";
				bubblePointer.style.left = (bubblePointerBorderX+1)+"px";
				bubbleContent.style.top = (bubblePointerBorderY+7)+"px";
				bubbleContent.style.left = bubblePointerBorderX+"px";
				bubbleContent.style.width = bubble.width+"px";
				bubbleContent.style.height = bubble.height+"px";
				bubbleClose.style.top = (bubblePointerBorderY+9)+"px";
				bubbleClose.style.left = (bubblePointerBorderX+bubble.width)+"px";
				bubbleMouseZone.style.top = (-mouseZonePadding)+"px";
				bubbleMouseZone.style.left = (-mouseZonePadding+(bubble.bubbleContext.mouseZoneLeftMove!=null?bubble.bubbleContext.mouseZoneLeftMove:0))+"px";
				bubbleMouseZone.style.width = (width+2*mouseZonePadding)+"px";
				bubbleMouseZone.style.height = (height+bubble.height+3*mouseZonePadding)+"px";

				if(bubble.bubbleContext.mouseZoneWidth != null)
				{
					bubbleMouseZone.style.left = (width/2-bubble.bubbleContext.mouseZoneWidth/2+(bubble.bubbleContext.mouseZoneLeftMove!=null?bubble.bubbleContext.mouseZoneLeftMove:0))+"px";
					bubbleMouseZone.style.width = (bubble.bubbleContext.mouseZoneWidth+2*mouseZonePadding)+"px";
				}

				if(bubble.bubbleContext.type=="bottomCenter")
				{
					bubbleContent.style.left = (bubblePointerBorderX-bubble.width/2)+"px";
					bubbleClose.style.left = (bubblePointerBorderX+bubble.width/2)+"px";
				}
				else if(bubble.bubbleContext.type=="bottomLeft")
				{
					bubblePointer.style.left = "";
					bubblePointerBorder.style.left = "";
					bubblePointer.style.right = (bubblePointerBorderX+1)+"px";
					bubblePointerBorder.style.right = bubblePointerBorderX+"px";
					bubbleContent.style.left = "";
					bubbleClose.style.left = "";
					bubbleContent.style.right = bubblePointerBorderX+"px";
					bubbleClose.style.right = (bubblePointerBorderX+3)+"px";
				}
			};
		}(this, bubbleMouseZone, bubblePointer, bubblePointerBorder, bubbleContent, bubbleClose);

	this.positionOnTarget =
		function(bubble)
		{
			return function()
			{
				var targetNodeGetElementAbsolutePositionResult =
					grabMyBooks.getElementAbsolutePosition(bubble.bubbleContext.targetNode);

				bubble.position(targetNodeGetElementAbsolutePositionResult.x, targetNodeGetElementAbsolutePositionResult.y, targetNodeGetElementAbsolutePositionResult.width, targetNodeGetElementAbsolutePositionResult.height);
			};
		}(this);

	this.show =
		function(bubble, bubbleMouseZone, bubblePointer, bubblePointerBorder, bubbleContent, bubbleClose)
		{
			return function()
			{
				bubble.positionOnTarget();
				bubbleMouseZone.style.display = "inline";
				bubblePointer.style.display = "inline";
				bubblePointerBorder.style.display = "inline";
				bubbleContent.style.display = "inline";
				bubbleClose.style.display = "inline";
				bubbleMouseZone.style.display = "inline";
			};
		}(this, bubbleMouseZone, bubblePointer, bubblePointerBorder, bubbleContent, bubbleClose);

	this.hide =
		function(bubble, bubbleMouseZone, bubblePointer, bubblePointerBorder, bubbleContent, bubbleClose)
		{
			return function()
			{
				bubble.position(-500, -500, 100, 100);
				bubbleMouseZone.style.display = "none";
				bubblePointer.style.display = "none";
				bubblePointerBorder.style.display = "none";
				bubbleContent.style.display = "none";
				bubbleClose.style.display = "none";
				bubbleMouseZone.style.display = "none";
			};
		}(this, bubbleMouseZone, bubblePointer, bubblePointerBorder, bubbleContent, bubbleClose);
};



grabMyBooks.metadata = new Object();
grabMyBooks.metadata.defaultTitle = "GrabMyBooks articles";
grabMyBooks.metadata.setDefaultValues = function()
{
	grabMyBooks.metadata.title = grabMyBooks.metadata.defaultTitle;
	grabMyBooks.metadata.lang = grabMyBooks.options.defaultLanguage;
	grabMyBooks.metadata.author = grabMyBooks.options.defaultAuthor;
	grabMyBooks.metadata.description = null;
};
grabMyBooks.metadata.isTitleDefault = function(metadata)
{
	return metadata.title == grabMyBooks.metadata.defaultTitle;
};

grabMyBooks.metadata.generateDescription = function()
{
	var resultTab = [];

	var getArticleDescriptionFunction =
		function(resultTab)
		{
			return function(article, index, count)
			{
				var title = article.getTitleOrDefaultTitle();
				if(grabMyBooks.isEmpty(title))
				{
					return;
				}
				title = grabMyBooks.replaceVariablesInText(title, index, true);
				if(grabMyBooks.isEmpty(title))
				{
					return;
				}
				resultTab.push(title);
			};
		}(resultTab);
	grabMyBooks.tabDo(grabMyBooks.articles, getArticleDescriptionFunction);
	return resultTab.join("\n");
};

grabMyBooks.img = new Object();
grabMyBooks.img.tmpDirName = "grabMyBooksImgTmpDir";
grabMyBooks.img.tmpDir = null;
grabMyBooks.img.regExpPattern = "\\$IMG\\{([^\\{\\}]*?)\\}";
grabMyBooks.img.nameCounter = 0;
grabMyBooks.img.savedCoverSavedImgInfo = null;
grabMyBooks.img.coverSavedImgInfo = null;
grabMyBooks.img.savedImgInfos = [];
grabMyBooks.img.maxImgSideSize = 900;
grabMyBooks.img.loadBookImgUrlregExpPattern = "grabMyBookLoad\\:\\/\\/(.*?_.*?)_(.*)";
grabMyBooks.img.backupImgs = [];

grabMyBooks.img.BackupImg = function(initialImgSrc, backupImgSrc)
{
	this.initialImgSrc = initialImgSrc;
	this.backupImgSrc = backupImgSrc;
};

grabMyBooks.img.findBackupForImg = function(imgSrc)
{
	var currentBackupImg;
	for(var i_backupImg=0; i_backupImg<grabMyBooks.img.backupImgs.length; i_backupImg++)
	{
		currentBackupImg = grabMyBooks.img.backupImgs[i_backupImg];
		if(imgSrc == currentBackupImg.initialImgSrc)
		{
			grabMyBooks.img.backupImgs.splice(i_backupImg, 1);
			return currentBackupImg.backupImgSrc;
		}
	}
	return null;
};

grabMyBooks.img.resizeIfToBig = function(width, height)
{
	var result = new Object();
	result.width = width;
	result.height = height;
	if(width<=grabMyBooks.img.maxImgSideSize && height<=grabMyBooks.img.maxImgSideSize)
	{
		return result;
	}
	var toBigValue = (width>height)?width:height;
	var scaleRatio = grabMyBooks.img.maxImgSideSize / toBigValue;
	result.width = result.width * scaleRatio;
	result.height = result.height * scaleRatio;
	return result;
};

grabMyBooks.img.SavedImgInfo = function(imgUrl, imgLocalName)
{
	this.imgUrl = imgUrl;
	this.imgLocalName = imgLocalName;
	this.imgObject = null;
	this.imgLocalFile = null;

	this.functionToExecAfterLoadedTab = [];


	this.equals = function(otherSavedImgInfo)
	{
		if(this.imgUrl == null || otherSavedImgInfo == null || otherSavedImgInfo.imgUrl == null)
		{
			return false;
		}
		var result = (this.imgUrl == otherSavedImgInfo.imgUrl);
		return result;
	};

	this.identify = function(otherSavedImgInfo)
	{
		var result = this.equals(otherSavedImgInfo);
		return result;
	}

	this.executeWhenLoaded = function(funcToExec)
	{
		if(this.isImgLoaded())
		{
			funcToExec();
		}
		else
		{
			this.functionToExecAfterLoadedTab.push(funcToExec);
		}
	};

	this.markAsLoaded = function()
	{
		var currentFuncToExec;
		while(this.functionToExecAfterLoadedTab.length>0)
		{
			currentFuncToExec = this.functionToExecAfterLoadedTab.pop();
			currentFuncToExec();
		}
	};

	this.getAsCanvas = function(doc, adjustSizeOnLoad)
	{
	    var result = this.getAsCanvasAsynch(doc, adjustSizeOnLoad, null);
	    return result;
	};

	this.getAsCanvasAsynch = function(doc, adjustSizeOnLoad, onCanvasReadyFunction)
	{
	    var canvasInfo = new Object();
		var canvasElement = doc.createElement("canvas");
		var canvasContext = canvasElement.getContext('2d');

		canvasElement.width = "114";
		canvasElement.height = "22";

		var checkCanvasSizeFunction =
			function(savedImgInfo, canvasElement, adjustSizeOnLoad)
			{
				return function()
				{
				    if(!adjustSizeOnLoad)
				    {
				        return;
				    }

					if(canvasElement.parentNode == null)
					{
						return;
					}
					var canvasParent = canvasElement.parentNode;
					var inTd = grabMyBooks.hasNodeParent(canvasParent, "TD");
					var inSingleImgRow = grabMyBooks.hasNodeParentClass(canvasParent, "rowSingleImg");
					var reduceImg = (inTd && !inSingleImgRow);
					if(savedImgInfo.isSmall() || reduceImg)
					{
						canvasParent.style.width="";
						canvasParent.style.display="inline";
						if(reduceImg)
						{
							canvasElement.style.maxWidth = "100px";
							canvasElement.style.maxHeight = "100px";
						}
					}
					else
					{
						canvasParent.style.width="100%";
						canvasParent.style.display="block";
					}
				};
			}(this, canvasElement, adjustSizeOnLoad);


		var drawImgFunction = function(savedImgInfo, canvasElement, canvasContext, checkCanvasSizeFunction, doc, onCanvasReadyFunction, canvasInfo)
		{
			return function()
			{
				var sizeControlResult = grabMyBooks.img.resizeIfToBig(savedImgInfo.imgObject.width, savedImgInfo.imgObject.height);
				canvasElement.width = sizeControlResult.width;
				canvasElement.height = sizeControlResult.height;
				canvasContext.fillStyle = "white";
      			canvasContext.fillRect(0, 0, sizeControlResult.width, sizeControlResult.height);

      			var toDrawImage = doc.createElement("img");
      			toDrawImage.onload =
      			    function(canvasContext, sizeControlResult, toDrawImage, checkCanvasSizeFunction, onCanvasReadyFunction, canvasInfo)
      			    {
      			        return function()
      			        {
                            canvasContext.drawImage(toDrawImage, 0, 0, sizeControlResult.width, sizeControlResult.height);
                            checkCanvasSizeFunction();
                            if(onCanvasReadyFunction != null)
                            {
                                onCanvasReadyFunction(canvasInfo);
                            }
      			        };
      			    }(canvasContext, sizeControlResult, toDrawImage, checkCanvasSizeFunction, onCanvasReadyFunction, canvasInfo);
      			var imgDataUrl = grabMyBooks.img.getDataUrl(savedImgInfo.imgObject);
                toDrawImage.src = imgDataUrl;
			};
		}(this, canvasElement, canvasContext, checkCanvasSizeFunction, doc, onCanvasReadyFunction, canvasInfo);

		var waitImage = doc.createElement("img");
		waitImage.onload =
		    function(drawImgFunction, savedImgInfo, canvasContext, waitImage)
		    {
		        return function()
		        {
		            canvasContext.drawImage(waitImage, 0, 0, 114, 22);
                    savedImgInfo.executeWhenLoaded(drawImgFunction);
		        };
		    }(drawImgFunction, this, canvasContext, waitImage);
        waitImage.src="chrome://grabMyBooks/content/images/wait.png";


		canvasInfo.canvas = canvasElement;
		canvasInfo.checkCanvasSizeFunction = checkCanvasSizeFunction;
		return canvasInfo;
	};

	this.isImgLoaded = function()
	{
		return this.imgObject != null;
	};

	this.getImgNameWithoutExtension = function()
	{
		if(this.imgLocalName == null)
		{
			return null;
		}
		var result = this.imgLocalName.substr(0, this.imgLocalName.indexOf("."));
		return result;
	};

	this.expandCanvas = function(canvas)
	{
		var fitImgFunction =
			function(savedImgInfo, canvas)
			{
				return function()
				{
					if(savedImgInfo.imgObject.height>savedImgInfo.imgObject.width)
					{
						canvas.style.height="100%";
					}
					else
					{
						canvas.style.width="100%";
					}
				};
			}(this, canvas);
		this.executeWhenLoaded(fitImgFunction);
	};

	this.isSmall = function()
	{
		if(!this.isImgLoaded())
		{
			return false;
		}
		var width = this.imgObject.width;
		var height = this.imgObject.height;
		if( (width*height)<(150*150) )
		{
			return true;
		}
		return false;
	};
};

grabMyBooks.img.getSavedImgInfo = function(imgUrl)
{
	if(grabMyBooks.isEmpty(imgUrl))
	{
		return null;
	}
	var savedImgInfoCount = grabMyBooks.img.savedImgInfos.length;
	var currentSavedImgInfo;
	for(var i_img=0; i_img<savedImgInfoCount; i_img++)
	{
		currentSavedImgInfo = grabMyBooks.img.savedImgInfos[i_img];
		if(currentSavedImgInfo.imgUrl.toLowerCase() == imgUrl.toLowerCase())
		{
			return currentSavedImgInfo;
		}
	}
	return null;
};

grabMyBooks.img.removeSavedImgInfo = function(imgUrl)
{
	var savedImgInfoCount = grabMyBooks.img.savedImgInfos.length;
	var currentSavedImgInfo;
	for(var i_img=0; i_img<savedImgInfoCount; i_img++)
	{
		currentSavedImgInfo = grabMyBooks.img.savedImgInfos[i_img];
		if(currentSavedImgInfo.imgUrl == imgUrl)
		{
			grabMyBooks.img.savedImgInfos.splice(i_img, 1);

			grabMyBooks.ext.removeImgFromCache(imgUrl);
			return;
		}
	}
};


grabMyBooks.img.isImgAlreadySaved = function(imgUrl)
{
	var savedImgInfo = grabMyBooks.img.getSavedImgInfo(imgUrl);
	return (savedImgInfo != null);
};

grabMyBooks.img.getNewNameForImage = function()
{
	var result = "img"+grabMyBooks.img.getIdForImage()+"."+grabMyBooks.options.imgType;
	return result;
};

grabMyBooks.img.getIdForImage = function()
{
	var result = grabMyBooks.img.nameCounter;
	grabMyBooks.img.nameCounter +=1;
	return result;
};

grabMyBooks.img.deleteImgTmpDir = function()
{
	grabMyBooks.img.tmpDir = null;
	grabMyBooks.img.getImgTmpDir();
};

grabMyBooks.img.getImgTmpDir = function()
{
	if(grabMyBooks.img.tmpDir != null)
	{
		return grabMyBooks.img.tmpDir;
	}

	grabMyBooks.img.tmpDir = grabMyBooks.ext.createDirImgTmp();
	return grabMyBooks.img.tmpDir;
};

grabMyBooks.img.forEachInDir = function(toDoFunction)
{
	var imgDir = grabMyBooks.img.getImgTmpDir();
	var imgFileIterator = imgDir.directoryEntries;
	var currentImgFile;
	var currentImgFileName;
	while(imgFileIterator.hasMoreElements())
	{
		currentImgFile = imgFileIterator.getNext().QueryInterface(Components.interfaces.nsILocalFile);
		currentImgFileName = grabMyBooks.ext.leafName(currentImgFile);
		toDoFunction(currentImgFile, currentImgFileName);
	}
};

grabMyBooks.img.handleImgs = function(text, markCurrentBookModifiedOnImgLoad)
{
	var imgRegex = new RegExp(grabMyBooks.img.regExpPattern, "g");
	var regexResult;
	var currentImgUrl;
	while( (regexResult = imgRegex.exec(text))!=null )
	{
		currentImgUrl = regexResult[1];
		grabMyBooks.img.handleImg(currentImgUrl, markCurrentBookModifiedOnImgLoad);
	}
};

grabMyBooks.img.WikipediaLocationHandler = function(pageDisplayingImgUrl)
{
	this.pageDisplayingImgUrl = pageDisplayingImgUrl;
	this.imgObject = null;
	this.imgName = null;
	this.onSuccessFunction = null;
	this.onErrorFunction = null;
	this.handleSpecificLocation =
		function()
		{
			var onDomEndFunction =
				function(imgName, imgObject, onSuccessFunction, onErrorFunction, pageDisplayingImgUrl)
				{
					return function(domInfo)
					{
						var imgNode = grabMyBooks.xml.xPathQueryNode("//div[contains(@class,'fullImageLink')]//img", domInfo.document, domInfo.body);
						if(imgNode == null)
						{
							imgNode = grabMyBooks.xml.xPathQueryNode("//img[contains(@src,'"+imgName+"')]", domInfo.document, domInfo.body);
						}
						if(imgNode == null)
						{
							onErrorFunction();
							return;
						}
						var imgSrc = imgNode.getAttribute("src");
						if(grabMyBooks.isEmpty(imgSrc))
						{
							onErrorFunction();
							return;
						}
						imgObject.onload = onSuccessFunction;
						imgObject.onerror = onErrorFunction;
						imgSrc = grabMyBooks.appendUrlPrefixIfMissing(imgSrc, pageDisplayingImgUrl, null);

						grabMyBooks.ext.setImgSrc(imgObject, imgSrc);
					};
				}(this.imgName, this.imgObject, this.onSuccessFunction, this.onErrorFunction);
			grabMyBooks.getUrlAsDom(this.pageDisplayingImgUrl, onDomEndFunction, this.pageDisplayingImgUrl);
		};
};
grabMyBooks.img.getImgSpecificLocationHandler = function(imgSrc)
{
	var wikipediaIndex = imgSrc.indexOf("wikipedia.org");
	var wikimediaIndex = imgSrc.indexOf("wikimedia.org");
	var wikiFileRegexpResult = /wiki\/(.+?)\:(.+)$/.exec(imgSrc);
	if( (wikipediaIndex == -1 && wikimediaIndex == -1) || wikiFileRegexpResult == null)
	{
		return null;
	}
	var wikiImgName = wikiFileRegexpResult[2];
	if(grabMyBooks.isEmpty(wikiImgName))
	{
		return null;
	}
	var result = new grabMyBooks.img.WikipediaLocationHandler(imgSrc);
	result.imgName = wikiImgName;
	return result;
};

grabMyBooks.img.handleImg = function(imgUrl, markCurrentBookModifiedOnImgLoad)
{
	var alreadySavedImgInfo = grabMyBooks.img.getSavedImgInfo(imgUrl);
	if(alreadySavedImgInfo != null)
	{
		return alreadySavedImgInfo;
	}

	var imgName;
	var imgSrc;

	var bookLoadImgUrlRegex = new RegExp(grabMyBooks.img.loadBookImgUrlregExpPattern);
	var bookLoadImgUrlRegexResult = bookLoadImgUrlRegex.exec(imgUrl);
	if(bookLoadImgUrlRegexResult!=null)
	{
		var bookId = bookLoadImgUrlRegexResult[1];
		imgName = bookLoadImgUrlRegexResult[2];
		imgName = grabMyBooks.img.loadBookImgSubstitutionInfoList.getImgSubstitutionInfo(bookId, imgName).imgNewName;
		imgSrc = grabMyBooks.ext.getImgSrcFromName(imgName);
	}
	else
	{
		imgName = grabMyBooks.img.getNewNameForImage();
		imgSrc = imgUrl;
	}


	var savedImgInfo = new grabMyBooks.img.SavedImgInfo(imgUrl, imgName);
	grabMyBooks.img.savedImgInfos.push(savedImgInfo);

	var imgObject = new Image();
	var imgLoadFunction =
		function(imgObject, savedImgInfo, markCurrentBookModifiedOnImgLoad)
		{
			return function()
			{
				savedImgInfo.imgObject = imgObject;
				grabMyBooks.img.saveImg(savedImgInfo);
				if(markCurrentBookModifiedOnImgLoad)
				{
					grabMyBooks.autoSave.markModified();
				}
			};
		}(imgObject, savedImgInfo, markCurrentBookModifiedOnImgLoad);
	imgObject.onload = imgLoadFunction;

	var backupImgHolder = new Object();
	backupImgHolder.specificLocationTried = false;
	backupImgHolder.backupImgSrc = grabMyBooks.img.findBackupForImg(imgSrc);
	backupImgHolder.backupImgUsed = false;
	backupImgHolder.tryBackupImgFunction =
		function(backupImgHolder, imgObject, imgLoadFunction)
		{
			return function()
			{
				if(!grabMyBooks.options.grabTargetImages || backupImgHolder.backupImgSrc == null || backupImgHolder.backupImgUsed)
				{
					return;
				}
				backupImgHolder.backupImgUsed = true;
				imgObject.onload = imgLoadFunction;
				imgObject.onerror =
					function(imgObject, imgLoadFunction, imgObect, backupImgHolder)
					{
						return function()
						{
							grabMyBooks.img.handleImgLoadError(backupImgHolder.backupImgSrc, imgObject, imgLoadFunction, backupImgHolder, 0);
						};
					}(imgObject, imgLoadFunction, imgObject, backupImgHolder);
				grabMyBooks.ext.setImgSrc(imgObject, backupImgHolder.backupImgSrc);
			};
		}(backupImgHolder, imgObject, imgLoadFunction);


	var onErrorFunction =
		function(imgSrc, imgObject, imgLoadFunction, imgObect, backupImgHolder)
		{
			return function()
			{
				grabMyBooks.img.handleImgLoadError(imgSrc, imgObject, imgLoadFunction, backupImgHolder, 0);
			};
		}(imgSrc, imgObject, imgLoadFunction, imgObject, backupImgHolder);

	imgObject.onerror = onErrorFunction;

	grabMyBooks.ext.setImgSrc(imgObject, imgSrc);
	return savedImgInfo;
};

grabMyBooks.img.handleImgLoadError = function(imgSrc, imgObject, successFunction, backupImgHolder, tryCount)
{
	if(!backupImgHolder.specificLocationTried)
	{
		backupImgHolder.specificLocationTried = true;
		var imgSpecificLocationHandler = grabMyBooks.img.getImgSpecificLocationHandler(imgSrc);
		if(imgSpecificLocationHandler != null)
		{
			imgSpecificLocationHandler.imgObject = imgObject;
			imgSpecificLocationHandler.onSuccessFunction = successFunction;
			imgSpecificLocationHandler.onErrorFunction =
				function(imgSrc, imgObject, successFunction, backupImgHolder, tryCount)
				{
					return function()
					{
						grabMyBooks.img.handleImgLoadError(imgSrc, imgObject, successFunction, backupImgHolder, tryCount);
					};
				}(imgSrc, imgObject, successFunction, backupImgHolder, tryCount);
			imgSpecificLocationHandler.handleSpecificLocation();
			return;
		}
	}

	if(tryCount==10)
	{
		backupImgHolder.tryBackupImgFunction();
		return;
	}
	var startIndex = imgSrc.lastIndexOf("//");
	if(startIndex==-1 || (startIndex==imgSrc.length-2))
	{
		backupImgHolder.tryBackupImgFunction();
		return;
	}
	var firstSeparatorIndex = imgSrc.indexOf("/", startIndex+2);
	if(firstSeparatorIndex==-1)
	{
		backupImgHolder.tryBackupImgFunction();
		return;
	}

	var separatorPositionTab = [];
	var currentSeparatorPosition = imgSrc.indexOf("/", firstSeparatorIndex+2);
	while(currentSeparatorPosition!=-1 && (currentSeparatorPosition<imgSrc.length-1))
	{
		separatorPositionTab.push(currentSeparatorPosition);
		currentSeparatorPosition = imgSrc.indexOf("/", currentSeparatorPosition+2);
	}
	if(tryCount>=separatorPositionTab.length)
	{
		backupImgHolder.tryBackupImgFunction();
		return;
	}
	var separatorPositionToUse = separatorPositionTab[separatorPositionTab.length - tryCount - 1];
	var srcToTry = imgSrc.substring(0,firstSeparatorIndex+1)+imgSrc.substring(separatorPositionToUse+1);

	var onErrorFunction =
		function(imgSrc, imgObject, successFunction, backupImgHolder, tryCount)
		{
			return function()
			{
				grabMyBooks.img.handleImgLoadError(imgSrc, imgObject, successFunction, backupImgHolder, tryCount+1);
			};
		}(imgSrc, imgObject, successFunction, backupImgHolder, tryCount);

	imgObject.onload = successFunction;
	imgObject.onerror = onErrorFunction;
	grabMyBooks.ext.setImgSrc(imgObject, srcToTry);
}

grabMyBooks.img.waitingImage = new Image();
grabMyBooks.img.waitingImage.src="chrome://grabMyBooks/content/images/wait.png";

grabMyBooks.img.getImgFile = function(imageName)
{
	var result = grabMyBooks.ext.createFile();
	result.initWithPath(grabMyBooks.ext.path(grabMyBooks.img.getImgTmpDir()));
	result.append(imageName);
	return result;
};

grabMyBooks.img.saveImg = function(savedImgInfo)
{
		var nsWebBrowserPersist = grabMyBooks.ext.getWebBrowserPersist();
		var destinationFile = grabMyBooks.img.getImgFile(savedImgInfo.imgLocalName);
		var ioService = grabMyBooks.ext.getIoService();

		var doc = grabMyBooks.getDefaultDocument();

        var saveEndFunction =
            function(savedImgInfo, destinationFile)
            {
                return function()
                {
                    savedImgInfo.imgLocalFile = destinationFile;
                    savedImgInfo.markAsLoaded();
                };
            }(savedImgInfo, destinationFile);

		var onCanvasReadyFunction =
		    function(ioService, destinationFile, nsWebBrowserPersist, saveEndFunction)
		    {
		        return function(canvasInfo)
		        {
                    var canvasElement = canvasInfo.canvas;
                    var canvasUri = ioService.newURI(canvasElement.toDataURL("image/"+grabMyBooks.options.imgType, parseFloat(grabMyBooks.options.imgQuality)), "UTF8", null);
                    var destinationUri = ioService.newFileURI(destinationFile);
                    grabMyBooks.ext.listenToWebBrowserPersist(nsWebBrowserPersist, saveEndFunction);
                    var privacyContext = grabMyBooks.ext.getPrivacyContext();
                    nsWebBrowserPersist.saveURI(canvasUri, null, null, 0, null, null, destinationUri, privacyContext);
		        };
		    }(ioService, destinationFile, nsWebBrowserPersist, saveEndFunction);

        savedImgInfo.getAsCanvasAsynch(doc, false, onCanvasReadyFunction)
};

grabMyBooks.img.getDataUrl = function(imgObject)
{
    var doc = grabMyBooks.getDefaultDocument();
    var canvas = doc.createElement("canvas");
    canvas.width = imgObject.width;
    canvas.height = imgObject.height;

    var canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(imgObject, 0, 0);

    var result = canvas.toDataURL("image/png");
    return result;
};

grabMyBooks.img.replaceImgTagsInText = function(text)
{
	return grabMyBooks.img.replaceImgTagsInTextWithOrWithoutSurrounding(text, true);
};

grabMyBooks.img.replaceImgTagsInTextWithOrWithoutSurrounding = function(text, surroundWith)
{
	var startSurround = "";
	var endSurround = "";
	if(surroundWith)
	{
		startSurround = "<span style=\"display:block;text-align:center;\">";
		endSurround = "</span>";
	}
	var result = text;
	var savedImgInfoCount = grabMyBooks.img.savedImgInfos.length;
	var currentSavedImgInfo;
	var currentEscapedImgUrl;
	for(var i_img=0; i_img<savedImgInfoCount; i_img++)
	{
		currentSavedImgInfo = grabMyBooks.img.savedImgInfos[i_img];
		currentEscapedImgUrl = grabMyBooks.img.escapeImgUrl(currentSavedImgInfo.imgUrl);
		currentEscapedImgUrl = grabMyBooks.escapeTagsExtended(currentEscapedImgUrl);
		result = result.replace(new RegExp("\\$IMG\\{"+currentEscapedImgUrl+"\\}","g"), startSurround+"<img style=\"max-width:80%;\" alt=\""+currentSavedImgInfo.imgUrl+"\">"+endSurround);
	}
	return result;
};

grabMyBooks.img.escapeImgUrl = function(imgUrl)
{
	var result = imgUrl.replace(new RegExp("([\\\\\\+\\?\\^\\.\\$\\*\\(\\)\\&\\-\\,])","g"),"\\$1");
	return result;
};

grabMyBooks.img.getImgNameFromPath = function(imgPath)
{
	var result = imgPath;
	if(result.indexOf("/")!=-1)
	{
		var lastIndexOfSeparator = result.lastIndexOf("/");
		result = result.substring(lastIndexOfSeparator+1);
	}
	return result;
};

grabMyBooks.img.generateImgNameForBookLoad = function(imgName, bookId)
{
	var result = bookId+"_"+imgName;
	return result;
};

grabMyBooks.img.generateImgUrlForBookLoad = function(imgSrc, bookId)
{
	var result = grabMyBooks.img.getImgNameFromPath(imgSrc);
	result = "grabMyBookLoad://"+grabMyBooks.img.generateImgNameForBookLoad(result, bookId);
	return result;
};

grabMyBooks.appendUrlPrefixIfMissing = function(src, url, base)
{
	src = src.trim();
	if(src.indexOf("chrome://")==0)
	{
		src = src.substr(7);
	}
	if(src.indexOf("#")==0)
	{
		return url + src;
	}
	var srcLowerCase = src.toLowerCase();
	var isFullUrl = ((srcLowerCase.indexOf("http")==0) || (srcLowerCase.indexOf("file")==0) || grabMyBooks.ext.isImgSrcFullUrl(srcLowerCase));
	if(isFullUrl)
	{
		return src;
	}
	if(src.indexOf("//")==0)
	{
		return "http:"+src;
	}
	var lastSepIndex = url.lastIndexOf("/");
	var urlPrefix = url.substring(0, lastSepIndex+1);

	if(src.indexOf("/")==0)
	{
		var urlStartResult = /(.+?\:\/{2,}.+?\/{1,1}).*/.exec(url);
		if(urlStartResult != null)
		{
			urlPrefix = urlStartResult[1];
		}
		src = src.substring(1);
	}
	else if(!grabMyBooks.isEmpty(base))
	{
		if(base.charAt(base.length-1)!= "/")
		{
			base += "/";
		}
		urlPrefix = base;
	}
	var result = urlPrefix + src;
	return result;
};

grabMyBooks.img.findSrcValueInImgNode = function(imgNode)
{
	var nodeImgSrc = imgNode.getAttribute("src");
	if(!grabMyBooks.isEmpty(nodeImgSrc))
	{
		return nodeImgSrc;
	}
	var currentAttribute;
	var currentAttributeValue;
	var currentAttributeAccepted;
	for (var i_node_att = 0; i_node_att<imgNode.attributes.length; i_node_att++)
	{
		currentAttribute = imgNode.attributes[i_node_att];
	  	if (!currentAttribute.specified)
	  	{
	  		continue;
	  	}
	  	currentAttributeValue = currentAttribute.value;
	    currentAttributeAccepted =
	    	grabMyBooks.img.isImgFileNameAccepted(currentAttributeValue, true);
	    if(currentAttributeAccepted)
	    {
	    	return currentAttributeValue;
	    }
	}
	return null;
};

grabMyBooks.img.allowedImgExtensions = ["jpg", "jpeg", "gif", "png", "svg"];
grabMyBooks.img.isImgFileNameAccepted = function(imgFileName, validateExtension)
{
	if(grabMyBooks.isEmpty(imgFileName))
	{
		return false;
	}
	if(!validateExtension)
	{
		return true;
	}
	var currentImgExt;
	for(var i_imgExt=0; i_imgExt<grabMyBooks.img.allowedImgExtensions.length; i_imgExt++)
	{
		currentImgExt = grabMyBooks.img.allowedImgExtensions[i_imgExt];
		if(imgFileName.toLowerCase().indexOf("."+currentImgExt) != -1)
		{
			return true;
		}
	}
	return false;
};
grabMyBooks.img.isImgNodeAccepted = function(imgNode)
{
	var imgSrc = grabMyBooks.img.findSrcValueInImgNode(imgNode);
	return grabMyBooks.img.isImgFileNameAccepted(imgSrc, false);
};

grabMyBooks.img.ApplyImgToContentForWriteResult = function()
{
	this.savedImgInfoToCopyTab = [];
	this.updatedArticlesWithImgContent = [];
	this.discartedImgInfoTab = [];
};

grabMyBooks.img.getUsedImgs = function(includeTempCover)
{
	var articles = grabMyBooks.articles;
	var imgRegex = new RegExp(grabMyBooks.img.regExpPattern, "g");
	var regexResult;
	var currentArticleInfo;
	var currentArticle;
	var currentImgUrl;

	var usedImgTab = [];


	for(var i_article=0;i_article<articles.length;i_article++)
	{
		currentArticleInfo = articles[i_article];
		currentArticle = currentArticleInfo.content;
		while( (regexResult = imgRegex.exec(currentArticle))!=null )
		{
			currentImgUrl = regexResult[1];
			if(usedImgTab.indexOf(currentImgUrl)==-1)
			{
				usedImgTab.push(currentImgUrl);
			}
		}
	}

	var checkSavedImgInfoFunction =
		function(usedImgTab)
		{
			return function(savedImgInfo)
			{
				if(savedImgInfo == null)
				{
					return;
				}
				var coverImgUrl = savedImgInfo.imgUrl;
				if(usedImgTab.indexOf(coverImgUrl)!=-1)
				{
					return;
				}
				usedImgTab.push(coverImgUrl);
			};
		}(usedImgTab);

	checkSavedImgInfoFunction(grabMyBooks.img.savedCoverSavedImgInfo);

	if(includeTempCover)
	{
		checkSavedImgInfoFunction(grabMyBooks.img.coverSavedImgInfo);
	}

	return usedImgTab;
};

grabMyBooks.img.checkUsedImgs = function()
{
	var usedImgTab = grabMyBooks.img.getUsedImgs(true);

	var notUsedSavedImgInfoTab = [];

	var checkSavedImgInfoFunction =
		function(usedImgTab, notUsedSavedImgInfoTab)
		{
			return function(savedImgInfo, index, count)
			{
				if(usedImgTab.indexOf(savedImgInfo.imgUrl)!=-1)
				{
					return;
				}
				notUsedSavedImgInfoTab.push(savedImgInfo);
			};
		}(usedImgTab, notUsedSavedImgInfoTab);
	grabMyBooks.tabDo(grabMyBooks.img.savedImgInfos, checkSavedImgInfoFunction);
	grabMyBooks.img.imgsNotUsedAnyMore(notUsedSavedImgInfoTab);
};

grabMyBooks.img.imgsNotUsedAnyMore = function(savedImgInfoTab)
{
	var deleteImgFunction =
		function(savedImgInfo, index, count)
		{
			grabMyBooks.tabRemove(grabMyBooks.img.savedImgInfos, savedImgInfo);
			grabMyBooks.ext.deleteImg(savedImgInfo.imgLocalName);
		};
	grabMyBooks.tabDo(savedImgInfoTab, deleteImgFunction);
};

grabMyBooks.ext.deleteImg = function(imgLocalName)
{
	var imgFile = grabMyBooks.img.getImgFile(imgLocalName);
	if(imgFile.exists())
	{
		imgFile.remove(false);
	}
};

grabMyBooks.img.applyImgToContentForWrite = function(updateArticles, includeCover, articles, coverSavedImgInfo)
{
	var imgToDiscardTab = [];

	var result = new grabMyBooks.img.ApplyImgToContentForWriteResult();

	var isImgAlreadyToCopy = function(url)
	{
		var currentSavedImgInfo;
		for(var i_imgInfo=0; i_imgInfo<result.savedImgInfoToCopyTab.length; i_imgInfo++)
		{
			currentSavedImgInfo = result.savedImgInfoToCopyTab[i_imgInfo];
			if(currentSavedImgInfo.imgUrl==url)
			{
				return true;
			}
		}
		return false;
	};

	var isImgToDiscard = function(url)
	{
		var currentImgToDiscardUrl;
		for(var i_imgToD=0; i_imgToD<imgToDiscardTab.length; i_imgToD++)
		{
			currentImgToDiscardUrl = imgToDiscardTab[i_imgToD];
			if(currentImgToDiscardUrl==url)
			{
				return true;
			}
		}
		return false;
	};

	var imgRegex = new RegExp(grabMyBooks.img.regExpPattern, "g");
	var regexResult;
	var currentArticleInfo;
	var currentArticle;
	var currentImgUrl;
	var currentSavedImgInfo;
	var currentSavedImgInfoToCopy;
	var currentEscapedImgUrl;
	var currentImgContainerClass;
	var currentModifiedArticle;
	for(var i_article=0;i_article<articles.length;i_article++)
	{
		currentArticleInfo = articles[i_article];
		currentArticle = currentArticleInfo.content;
		currentModifiedArticle = currentArticle;
		currentModifiedArticle = grabMyBooks.textFormat.formatTextForHtml_1(currentModifiedArticle);
		currentModifiedArticle = grabMyBooks.textFormat.formatTextForHtml_2(currentModifiedArticle);
		while( (regexResult = imgRegex.exec(currentArticle))!=null )
		{
			currentImgUrl = regexResult[1];
			if(isImgToDiscard(currentImgUrl) || isImgAlreadyToCopy(currentImgUrl))
			{
				continue;
			}
			currentSavedImgInfo = grabMyBooks.img.getSavedImgInfo(currentImgUrl);
			if(currentSavedImgInfo.imgLocalFile == null)
			{
				imgToDiscardTab.push(currentImgUrl);
				result.discartedImgInfoTab.push(currentSavedImgInfo);
				continue;
			}
			result.savedImgInfoToCopyTab.push(currentSavedImgInfo);
		}

		for(var i_imgCop=0; updateArticles && i_imgCop<result.savedImgInfoToCopyTab.length; i_imgCop++)
		{
			currentSavedImgInfoToCopy = result.savedImgInfoToCopyTab[i_imgCop];
			currentImgContainerClass = currentSavedImgInfoToCopy.isSmall()?"imgSmall":"imgBig";
			currentEscapedImgUrl = grabMyBooks.escapeTagsExtended(currentSavedImgInfoToCopy.imgUrl);
			currentEscapedImgUrl = grabMyBooks.img.escapeImgUrl(currentEscapedImgUrl);
			currentModifiedArticle = currentModifiedArticle.replace(new RegExp("\\$IMG\\{"+currentEscapedImgUrl+"\\}","g"), "<span class=\""+currentImgContainerClass+"\"><img src=\"img/"+currentSavedImgInfoToCopy.imgLocalName+"\" alt=\""+currentSavedImgInfoToCopy.imgLocalName+"\"/></span>");
		}

		var currentImgToDiscardUrl;
		for(var i_imgToD=0; updateArticles && i_imgToD<imgToDiscardTab.length; i_imgToD++)
		{
			currentImgToDiscardUrl = grabMyBooks.escapeTagsExtended(imgToDiscardTab[i_imgToD]);
			currentEscapedImgUrl = grabMyBooks.img.escapeImgUrl(currentImgToDiscardUrl);
			currentModifiedArticle = currentModifiedArticle.replace(new RegExp("\\$IMG\\{"+currentEscapedImgUrl+"\\}","g"), "");
		}

		result.updatedArticlesWithImgContent.push(currentArticleInfo.cloneWithNewGetHtmlContentToWriteBookFunction(currentModifiedArticle));
	}

	if(includeCover && coverSavedImgInfo!=null && (coverSavedImgInfo.imgLocalFile!=null) && !isImgToDiscard(coverSavedImgInfo) && !isImgAlreadyToCopy(coverSavedImgInfo.imgUrl))
	{
		result.savedImgInfoToCopyTab.push(coverSavedImgInfo);
	}

	return result;
};

grabMyBooks.img.isThereAtLeastOneImgInBook = function(writeBookContext)
{
	if(writeBookContext.coverSavedImgInfo != null)
	{
		return true;
	}
	var imgRegex = new RegExp(grabMyBooks.img.regExpPattern, "g");
	var currentArticleInfo;
	for(var i_article=0;i_article<writeBookContext.articles.length;i_article++)
	{
		currentArticleInfo = writeBookContext.articles[i_article];
		if(imgRegex.test(currentArticleInfo.content))
		{
			return true;
		}
	}
	return false;
};

grabMyBooks.img.replaceImgsByCanvas = function(doc, node, prepareCanvasFunction)
{
	var xPathResult = doc.evaluate("//img" ,node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var currentImg;
	var currentImgSrc;
	var currentSavedImgInfo;
	var currentCanvasInfo;
	var currentCanvas;
	for (var i_xPathNode = 0; i_xPathNode < xPathResult.snapshotLength; i_xPathNode++)
	{
		currentImg = xPathResult.snapshotItem(i_xPathNode);
		currentImgSrc = currentImg.getAttribute("alt");
		currentSavedImgInfo = grabMyBooks.img.getSavedImgInfo(currentImgSrc);
		if(currentSavedImgInfo==null)
		{
			continue;
		}
		currentCanvasInfo = currentSavedImgInfo.getAsCanvas(doc, true);
		currentCanvas = currentCanvasInfo.canvas;

		currentImg.parentNode.style.width="100%";
		currentCanvas.style.maxWidth="90%";
		currentImg.parentNode.style.textAlign="center";
		currentImg.parentNode.replaceChild(currentCanvas, currentImg);
		currentCanvas.style.marginBottom="5px";
		if(prepareCanvasFunction != null)
		{
			prepareCanvasFunction(currentCanvas);
		}
		currentCanvasInfo.checkCanvasSizeFunction();
	}
};

grabMyBooks.img.imgPicker = null;
grabMyBooks.img.getImgPicker = function()
{
	if(grabMyBooks.img.imgPicker == null)
	{
		grabMyBooks.img.imgPicker = grabMyBooks.ext.createFilePicker();
		grabMyBooks.img.imgPicker.appendFilter("Images","*.png; *.jpg; *.jpeg; *.gif");
		grabMyBooks.ext.initFilePickerForLoad(grabMyBooks.img.imgPicker, "Choose cover");
	}
	return grabMyBooks.img.imgPicker;
};

grabMyBooks.img.ImgSubstitutionInfo = function(bookId, imgOldName, imgNewName)
{
	this.bookId = bookId;
	this.imgOldName = imgOldName;
	this.imgNewName = imgNewName;
};

grabMyBooks.img.ImgSubstitutionInfoList = function()
{
	this.imgSubstitutionInfos = [];

	this.getImgSubstitutionInfo = function(bookId, imgOldName)
	{
		var currentImgSubstitutionInfo;
		for(var i_imgSubstitutionInfo=0; i_imgSubstitutionInfo<this.imgSubstitutionInfos.length; i_imgSubstitutionInfo++)
		{
			currentImgSubstitutionInfo = this.imgSubstitutionInfos[i_imgSubstitutionInfo];
			if(currentImgSubstitutionInfo.bookId==bookId && currentImgSubstitutionInfo.imgOldName==imgOldName)
			{
				return currentImgSubstitutionInfo;
			}
		}
		return null;
	};

	this.addImgSubstitutionInfo = function(bookId, imgOldName, imgNewName)
	{
		var foundImgSubstitutionInfo = this.getImgSubstitutionInfo(bookId, imgOldName);
		if(foundImgSubstitutionInfo!=null)
		{
			return;
		}
		this.imgSubstitutionInfos.push(new grabMyBooks.img.ImgSubstitutionInfo(bookId, imgOldName, imgNewName));
	};
};

grabMyBooks.img.loadBookImgSubstitutionInfoList = new grabMyBooks.img.ImgSubstitutionInfoList();

grabMyBooks.options = new Object();
grabMyBooks.options.firstRun = true;
grabMyBooks.options.titleValues = ["title","article","url","none"];
grabMyBooks.options.getTitleValueIndex = function(titleValue)
{
	for(var i_titleValue=0; i_titleValue<grabMyBooks.options.titleValues.length; i_titleValue++)
	{
		if(grabMyBooks.options.titleValues[i_titleValue] == titleValue)
		{
			return i_titleValue;
		}
	}
};
grabMyBooks.options.setDefaultValues = function()
{
	grabMyBooks.options.grabImages = true;
	grabMyBooks.options.grabTargetImages = true;
	grabMyBooks.options.title1Default = grabMyBooks.options.titleValues[0];
	grabMyBooks.options.title2Default = grabMyBooks.options.titleValues[3];
	grabMyBooks.options.contextMenuItemGrouped = true;
	grabMyBooks.options.directBookGrab = true;
	grabMyBooks.options.marginPageTopBottom = "0.8em";
	grabMyBooks.options.marginPageLeftRight = "0.4em";
	grabMyBooks.options.marginParagraphTopBottom = "0.3em";
	grabMyBooks.options.marginParagraphIndent = "1.0em";
	grabMyBooks.options.textAlign = "justify";
	grabMyBooks.options.defaultExtension = "epub";
	grabMyBooks.options.outputConverterPath = "C:\\Program Files\\Calibre2\\ebook-convert.exe";
	grabMyBooks.options.grabStyle = true;
	grabMyBooks.options.grabToDir = null;
	grabMyBooks.options.epubCopyToDir = null;
	grabMyBooks.options.saveSuggest = true;
	grabMyBooks.options.grabLinks = true;
	grabMyBooks.options.grabTables = true;
	grabMyBooks.options.grabHidden = false;
	grabMyBooks.options.defaultLanguage = "en";
	grabMyBooks.options.defaultAuthor = grabMyBooks.grabMyBooksUrl;
	grabMyBooks.options.imgType = "jpeg";
	grabMyBooks.options.imgQuality = grabMyBooks.ext.getNormalImageQuality();
	grabMyBooks.options.mailEnabled = false;
	grabMyBooks.options.mailServer = null;
	grabMyBooks.options.mailSecurity = "SSL";
	grabMyBooks.options.mailCommandPath = "C:\\Program Files\\Calibre2\\calibre-smtp.exe";
	grabMyBooks.options.mailCommandExtra = null;
	grabMyBooks.options.mailTo = null;
	grabMyBooks.options.mailFrom = grabMyBooks.bookMailFrom;


};
grabMyBooks.options.setDefaultValues();

grabMyBooks.firstRun = function()
{
	grabMyBooks.options.firstRun = false;
	//ONLY_FIREFOX
	var bar = document.getElementById("nav-bar");
	var barSetString = bar.currentSet;
	if(barSetString.indexOf(grabMyBooks.toolBarButtonId)!=-1)
	{
		return;
	}
	if(!grabMyBooks.isEmpty(barSetString))
	{
		barSetString+=",";
	}
	barSetString+=grabMyBooks.toolBarButtonId;

	bar.setAttribute("currentset", barSetString);
    bar.currentSet = barSetString;
    document.persist(bar.id, "currentset");
    //ONLY_FIREFOX
};

grabMyBooks.getTextAsHtmlNode = function(text)
{
	var htmlDoc = grabMyBooks.getDefaultDocument();
	var html = htmlDoc.createElement("html");
	grabMyBooks.setNodeContentFromString(htmlDoc, html, text);
	return html;
};
grabMyBooks.getImgAsHtmlNode = function(imgUrl)
{
	var htmlDoc = grabMyBooks.getDefaultDocument();
	var html = htmlDoc.createElement("html");
	var imgNode = htmlDoc.createElement("img");
	imgNode.setAttribute("src", imgUrl);
	html.appendChild(imgNode);
	return html;
};

grabMyBooks.isVariableDefinedAndNotEmpty = function(v)
{
	if(v=="undefined")
	{
		return false;
	}
	if(v==null)
	{
		return false;
	}
	return (""+v).length>0;
};

grabMyBooks.bookDownload = new Object();
grabMyBooks.bookDownload.bookLinkIdPrefix = "grabMyBooks.book.";
grabMyBooks.bookDownload.bookTestLinkIdPrefix = "grabMyBooks.test.book.";
grabMyBooks.bookDownload.bookDefinitionPrefix = "grabMyBooks.bookDefinition.";
grabMyBooks.bookDownload.bookLinkPrefix = "grabMyBooks.bookLink.";
grabMyBooks.bookDownload.bookLinkRulePrefix = "grabMyBooks.bookLinkRule.";
grabMyBooks.bookDownload.bookLinkGlobalRulePrefix = "grabMyBooks.bookLinkGlobalRule.";
grabMyBooks.bookDownload.bookCoverPrefix = "grabMyBooks.bookCover.";
grabMyBooks.bookDownload.bookTitlePrefix = "grabMyBooks.bookTitle.";
grabMyBooks.bookDownload.bookDescriptionPrefix = "grabMyBooks.bookDescription.";
grabMyBooks.bookDownload.bookLanguagePrefix = "grabMyBooks.bookLanguage.";

grabMyBooks.bookDownload.getBookToDownloadId = function(node)
{
	if(node==null)
	{
		return null;
	}
	var localName = node.localName.toLowerCase();
	if(localName!="a")
	{
		return null;
	}
	var linkId = node.id;
	if(!grabMyBooks.isVariableDefinedAndNotEmpty(linkId))
	{
		return null;
	}
	var bookLinkIdPrefixIndex = linkId.indexOf(grabMyBooks.bookDownload.bookLinkIdPrefix);
	var bookTestLinkIdPrefixIndex = linkId.indexOf(grabMyBooks.bookDownload.bookTestLinkIdPrefix);

	if(bookLinkIdPrefixIndex!=0 && bookTestLinkIdPrefixIndex!=0)
	{
		return null;
	}

	var bookLinkPrefixToUse;
	var preventDirectGrab = false;
	if(bookLinkIdPrefixIndex==0)
	{
		bookLinkPrefixToUse = grabMyBooks.bookDownload.bookLinkIdPrefix;
	}
	else
	{
		bookLinkPrefixToUse = grabMyBooks.bookDownload.bookTestLinkIdPrefix;
		preventDirectGrab = true;
	}

	if(linkId.length<=bookLinkPrefixToUse.length)
	{
		return null;
	}

	var result = new Object();
	result.preventDirectGrab = preventDirectGrab;
	result.bookId = linkId.substr(bookLinkPrefixToUse.length);

	return result;
};

grabMyBooks.bookDownload.getBookToDownloadIdInNodeOrAncestors = function(node)
{
	if(node==null)
	{
		return null;
	}

	var doc = node.ownerDocument;
	var currentNode = node;
	var currentGetBookIdResult;

	var i_node = 0;
	while(currentNode!=null && currentNode!=doc && i_node<4)
	{
		currentGetBookIdResult = grabMyBooks.bookDownload.getBookToDownloadId(currentNode);
		if(currentGetBookIdResult!=null)
		{
			return currentGetBookIdResult;
		}
		currentNode = currentNode.parentNode;
		i_node+=1;
	}
	return null;
};

grabMyBooks.bookDownload.handleIfClickOnBook = function(e)
{
	if(!e.cancelable)
	{
		return;
	}
	if(e.button!=0)
	{
		return;
	}

	var selectedTab = gBrowser.selectedTab;

	var directGrab = grabMyBooks.options.directBookGrab;

	var target = e.target;
	if(!grabMyBooks.isVariableDefinedAndNotEmpty(target) || !grabMyBooks.isVariableDefinedAndNotEmpty(target.localName))
	{
		return;
	}
	var getBookIdResult = grabMyBooks.bookDownload.getBookToDownloadIdInNodeOrAncestors(target);
	if(getBookIdResult == null)
	{
		return;
	}
	var bookId = getBookIdResult.bookId;
	if(directGrab && getBookIdResult.preventDirectGrab)
	{
		directGrab = false;
	}
	var doc = target.ownerDocument;
	var bookDefinitionNode = doc.getElementById(grabMyBooks.bookDownload.bookDefinitionPrefix+bookId);

	var restoreViewFunction =
		function(selectedTab)
		{
			return function()
			{
				if(selectedTab == null)
				{
					return;
				}
				grabMyBooks.ext.setSelectedTab(selectedTab);
			};
		}(selectedTab);

	var sendEventToSourceTabFunction =
		function(selectedTab, bookId)
		{
			return function()
			{
				if(selectedTab == null)
				{
					return;
				}
				var selectedTabBrowser = gBrowser.getBrowserForTab(selectedTab);
				if(selectedTabBrowser == null)
				{
					return;
				}
				var doc = selectedTabBrowser.contentDocument;
				var eventToSend = doc.createEvent("Event");
				eventToSend.initEvent("bookGrabbed:"+bookId, true, true);
				eventToSend.bookId = bookId;
				doc.dispatchEvent(eventToSend);
			};
		}(selectedTab, bookId);

	if(bookDefinitionNode==null || typeof(bookDefinitionNode)=="undefined")
	{
		return;
	}
	var bookLinksXPathResult = doc.evaluate("//a[starts-with(@id,'"+grabMyBooks.bookDownload.bookLinkPrefix+bookId+"')]" ,bookDefinitionNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var bookLinkCount = bookLinksXPathResult.snapshotLength;
	if(bookLinkCount==0)
	{
		return;
	}

	var getDecodedValueFromNodeFunction =
		function(node)
		{
			try
			{
				var result = node.getAttribute("value");
				result = grabMyBooks.escapeForDecodeUri(result);
				result = result.replace(/\+/g, ' ');
				result = decodeURIComponent(result);
				return result;
			}
			catch(e)
			{
				grabMyBooks.ext.alert(e+"::"+e.lineNumber);
			}
		};
	var globalRule = null;
	var globalRuleNode = doc.getElementById(grabMyBooks.bookDownload.bookLinkGlobalRulePrefix+bookId);
	if(globalRuleNode != null)
	{
		globalRule = getDecodedValueFromNodeFunction(globalRuleNode);
	}

	var bookCoverUrl = null;
	var bookCoverUrlNode = doc.getElementById(grabMyBooks.bookDownload.bookCoverPrefix+bookId);
	if(bookCoverUrlNode != null)
	{
		bookCoverUrl = bookCoverUrlNode.getAttribute("value");
	}

	var bookTitle = null;
	var bookTitleNode = doc.getElementById(grabMyBooks.bookDownload.bookTitlePrefix+bookId);
	if(bookTitleNode != null)
	{
		bookTitle = getDecodedValueFromNodeFunction(bookTitleNode);
	}

	var bookDescription = null;
	var bookDescriptionNode = doc.getElementById(grabMyBooks.bookDownload.bookDescriptionPrefix+bookId);
	if(bookDescriptionNode != null)
	{
		bookDescription = getDecodedValueFromNodeFunction(bookDescriptionNode);
	}

	var bookLanguage = null;
	var bookLanguageNode = doc.getElementById(grabMyBooks.bookDownload.bookLanguagePrefix+bookId);
	if(bookLanguageNode != null)
	{
		bookLanguage = getDecodedValueFromNodeFunction(bookLanguageNode);
	}

	var currentBookLinkNode;
	var currentBookLinkUrl;
	var currentBookLinkId;
	var currentBookLinkRuleNode;
	var urlTab = [];
	var urlXPathInfoTab = [];
	for(var i_bookLink=0; i_bookLink<bookLinkCount; i_bookLink++)
	{
		currentBookLinkNode = bookLinksXPathResult.snapshotItem(i_bookLink);
		currentBookLinkUrl = currentBookLinkNode.getAttribute("href");
		currentBookLinkId = currentBookLinkNode.getAttribute("id").substr((grabMyBooks.bookDownload.bookLinkPrefix+bookId).length+1);
		currentBookLinkRuleNode = doc.getElementById(grabMyBooks.bookDownload.bookLinkRulePrefix+bookId+"."+currentBookLinkId);
		if(currentBookLinkRuleNode!=null)
		{
			var currentBookLinkRule = getDecodedValueFromNodeFunction(currentBookLinkRuleNode);
			urlXPathInfoTab.push(new grabMyBooks.UrlXPathInfo(currentBookLinkUrl, currentBookLinkRule));
		}
		if(!grabMyBooks.isVariableDefinedAndNotEmpty(currentBookLinkUrl))
		{
			continue;
		}
		urlTab.push(currentBookLinkUrl);
	}
	if(urlTab.length==0)
	{
		return;
	}
	e.preventDefault();

	var loadBookContextHolder = new Object();
	loadBookContextHolder.loadBookContext = null;

	var prepareAddToBookContextFunction =
		function(urlXPathInfoTab, globalRule, loadBookContextHolder, bookCoverUrl, bookTitle, bookDescription, bookLanguage, sendEventToSourceTabFunction, restoreViewFunction, directGrab)
		{
			return function(addToBookContext)
			{
				addToBookContext.directGrab = directGrab;
				addToBookContext.urlXPathInfos = urlXPathInfoTab;
				addToBookContext.globalXPath = globalRule;
				if(loadBookContextHolder.loadBookContext.overrideCover)
				{
					addToBookContext.coverUrl = grabMyBooks.ifEmpty(bookCoverUrl, null);
				}
				if(loadBookContextHolder.loadBookContext.overrideMeta)
				{
					addToBookContext.title = bookTitle;
					addToBookContext.description = bookDescription;
					addToBookContext.language = bookLanguage;
				}

				var addToBookContextEndFunction2 = null;


				addToBookContextEndFunction2 =
					function(sendEventToSourceTabFunction, restoreViewFunction)
					{
						return function()
						{
							sendEventToSourceTabFunction();
							restoreViewFunction();
						};
					}(sendEventToSourceTabFunction, restoreViewFunction);


				addToBookContext.endFunction2 = addToBookContextEndFunction2;
			};
		}(urlXPathInfoTab, globalRule, loadBookContextHolder, bookCoverUrl, bookTitle, bookDescription, bookLanguage, sendEventToSourceTabFunction, restoreViewFunction, directGrab);


	var addLinksFunction =
		function(urlTab, prepareAddToBookContextFunction, loadBookContextHolder, directGrab)
		{
			return function(loadBookContext)
			{
				loadBookContextHolder.loadBookContext = loadBookContext;
				if(!loadBookContext.append && !directGrab)
				{
					grabMyBooks.removeAllArticles();
				}

				grabMyBooks.addLinks(urlTab, prepareAddToBookContextFunction, grabMyBooks.bookPopin.showAddToBookProgress);
			};
		}(urlTab, prepareAddToBookContextFunction, loadBookContextHolder, directGrab);

	var askIfBookNotEmptyFunction =
		function(toDoFunction, directGrab)
		{
			return function()
			{
				if(directGrab || grabMyBooks.articles.length==0)
				{
					toDoFunction(grabMyBooks.emptyBookLoadBookContext);
					return;
				}
				grabMyBooks.bookPopin.askBeforeLoadingBookWhenNotEmpty(toDoFunction);
			};
		}(addLinksFunction, directGrab);



	grabMyBooks.showBook(askIfBookNotEmptyFunction);
};

grabMyBooks.execWithTimer = function(toDoFunction, timeToWait)
{
	var timer = grabMyBooks.getExecWithTimerTimer();
	var timerEvent = new Object();
	timerEvent.notify =
		function(toDoFunction)
		{
			return function(timer)
			{
				toDoFunction();
			};
		}(toDoFunction);
	grabMyBooks.ext.initTimerWithCallback_OneShot(timer, timerEvent, timeToWait);
};
grabMyBooks.execWithTimerTimer=null;
grabMyBooks.getExecWithTimerTimer = function()
{
	if(grabMyBooks.execWithTimerTimer==null)
	{
		grabMyBooks.execWithTimerTimer = grabMyBooks.ext.createTimer();
	}
	return grabMyBooks.execWithTimerTimer;
};

grabMyBooks.execWithAnyTimer = function(timer, toDoFunction, timeToWait)
{
	var timerEvent = new Object();
	timerEvent.notify =
		function(toDoFunction)
		{
			return function(timer)
			{
				toDoFunction();
			};
		}(toDoFunction);
	grabMyBooks.ext.initTimerWithCallback_OneShot(timer, timerEvent, timeToWait);
};

grabMyBooks.execWithLoadingMessage = function(toDoFunction, loadingMessage, timerContainerObject, timerProperty)
{
	var messageContentTab = [];
  	messageContentTab.push(
  		"<div style=\"width:100%;text-align:center;\">",
  		"	"+loadingMessage+"...<br>",
  		"	<img style=\"margin-top:20px;\" src=\"chrome://grabMyBooks/content/images/waitSmall.png\">",
  		"</div>"
  	);

  	var messageContent = messageContentTab.join("");
  	grabMyBooks.SmallInfo.showSmallInfoPanel(messageContent, null);
  	timerContainerObject[timerProperty] = grabMyBooks.ext.createTimer();
  	grabMyBooks.execWithAnyTimer(timerContainerObject[timerProperty], toDoFunction, 1000);
};

grabMyBooks.getHrefNodeInNodeOrAncestors = function(node)
{
	if(node==null)
	{
		return null;
	}

	var doc = node.ownerDocument;
	var currentNode = node;
	var currentHref = null;

	var i_node = 0;
	while(currentNode!=null && currentNode!=doc && i_node<4)
	{
		currentHref = currentNode.getAttribute("href");
		if(currentHref!=null)
		{
			return currentNode;
		}
		currentNode = currentNode.parentNode;
		i_node+=1;
	}
	return null;
};

grabMyBooks.isStringInTab = function(text, tab)
{
	var currentString;
	for(var i_string=0; i_string<tab.length; i_string++)
	{
		currentString = tab[i_string];
		if(currentString == text)
		{
			return true;
		}
	}
	return false;
};

grabMyBooks.style = new Object();
//grabMyBooks.style.headingNodeNames = ["H1","H2","H3","H4","H5","H6"];
//grabMyBooks.style.isNodeHeading = function(nodeName)
//{
//	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.headingNodeNames);
//	return result;
//};

grabMyBooks.style.headingH1NodeNames = ["H1"];
grabMyBooks.style.isNodeHeadingH1 = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.headingH1NodeNames);
	return result;
};

grabMyBooks.style.headingH2NodeNames = ["H2"];
grabMyBooks.style.isNodeHeadingH2 = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.headingH2NodeNames);
	return result;
};

grabMyBooks.style.headingH3NodeNames = ["H3"];
grabMyBooks.style.isNodeHeadingH3 = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.headingH3NodeNames);
	return result;
};

grabMyBooks.style.headingH4NodeNames = ["H4"];
grabMyBooks.style.isNodeHeadingH4 = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.headingH4NodeNames);
	return result;
};

grabMyBooks.style.headingH5NodeNames = ["H5"];
grabMyBooks.style.isNodeHeadingH5 = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.headingH5NodeNames);
	return result;
};

grabMyBooks.style.headingH6NodeNames = ["H6"];
grabMyBooks.style.isNodeHeadingH6 = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.headingH6NodeNames);
	return result;
};

grabMyBooks.style.boldNodeNames = ["B","STRONG","BIG"];
grabMyBooks.style.isNodeBold = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.boldNodeNames);
	return result;
};
grabMyBooks.style.italicNodeNames = ["I","EM"];
grabMyBooks.style.isNodeItalic = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.italicNodeNames);
	return result;
};

grabMyBooks.style.strikeNodeNames = ["STRIKE"];
grabMyBooks.style.isNodeStrike = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.strikeNodeNames);
	return result;
};
grabMyBooks.style.underlineNodeNames = ["U"];
grabMyBooks.style.isNodeUnderline = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.underlineNodeNames);
	return result;
};
grabMyBooks.style.subNodeNames = ["SUB"];
grabMyBooks.style.isNodeSub = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.subNodeNames);
	return result;
};
grabMyBooks.style.supNodeNames = ["SUP"];
grabMyBooks.style.isNodeSup = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.supNodeNames);
	return result;
};
grabMyBooks.style.smallNodeNames = ["SMALL"];
grabMyBooks.style.isNodeSmall = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.smallNodeNames);
	return result;
};
grabMyBooks.style.codeNodeNames = ["CODE"];
grabMyBooks.style.isNodeCode = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.codeNodeNames);
	return result;
};
grabMyBooks.style.preNodeNames = ["PRE"];
grabMyBooks.style.isNodePre = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.preNodeNames);
	return result;
};

grabMyBooks.style.ulNodeNames = ["UL"];
grabMyBooks.style.isNodeUl = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.ulNodeNames);
	return result;
};

grabMyBooks.style.olNodeNames = ["OL"];
grabMyBooks.style.isNodeOl = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.olNodeNames);
	return result;
};

grabMyBooks.style.liNodeNames = ["LI"];
grabMyBooks.style.isNodeLi = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.liNodeNames);
	return result;
};

grabMyBooks.style.BquoteNodeNames = ["Blockquote"];
grabMyBooks.style.isNodeBquote = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.BquoteNodeNames);
	return result;
};

grabMyBooks.style.CiteNodeNames = ["Cite"];
grabMyBooks.style.isNodeCite = function(nodeName)
{
	var result = grabMyBooks.isStringInTab(nodeName, grabMyBooks.style.CiteNodeNames);
	return result;
};

grabMyBooks.style.getNodeStyle = function(node)
{
	if(node.getAttribute==undefined)
	{
		return "";
	}
	var styleValue = node.getAttribute("style");
	if(!grabMyBooks.isEmpty(styleValue))
	{
		return styleValue.toLowerCase();
	}
	return "";
};


grabMyBooks.autoSave = new Object();
grabMyBooks.autoSave.savedBookFileName = "savedBookInfo";

grabMyBooks.autoSave.markModified = function()
{
	grabMyBooks.img.checkUsedImgs();
	grabMyBooks.autoSave.bookModified();
};

grabMyBooks.ext.getLoadedBookContent = function()
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	var result = grabMyBooks.ext.readFile(saveDir, grabMyBooks.autoSave.savedBookFileName);
	return result;
};

grabMyBooks.autoSave.imgsStoredButNotUsedYet = [];
grabMyBooks.ext.loadBookContent = function()
{
	var markStoredImgFunction =
		function(imgFile, imgName)
		{
			grabMyBooks.autoSave.imgsStoredButNotUsedYet.push(imgName);
		};
	grabMyBooks.img.forEachInDir(markStoredImgFunction);
};

grabMyBooks.ext.deleteBookContent = function()
{
	var savedBookFile = grabMyBooks.ext.createFile();
	savedBookFile.initWithPath(grabMyBooks.ext.path(grabMyBooks.homeDir));
	savedBookFile.append(grabMyBooks.autoSave.savedBookFileName);
	if(savedBookFile.exists())
	{
		savedBookFile.remove(false);
	}
	var deleteStoredImgFunction =
		function(imgFile, imgName)
		{
			imgFile.remove(false);
		};
	grabMyBooks.img.forEachInDir(deleteStoredImgFunction);
};

grabMyBooks.ext.imgSeenAsUsedOnLoad = function(imgFile)
{
	var imgName = grabMyBooks.ext.leafName(imgFile);
	grabMyBooks.tabRemoveByValue(grabMyBooks.autoSave.imgsStoredButNotUsedYet, imgName);
};

grabMyBooks.ext.checkUnusedStoredImgs = function()
{
	var removeUnusedStoredImgFunction =
		function(imgName)
		{
			var imgFile = grabMyBooks.img.getImgFile(imgName);
			if(imgFile.exists())
			{
				imgFile.remove(false);
			}
			return true;
		};
	grabMyBooks.tabRemoveAll(grabMyBooks.autoSave.imgsStoredButNotUsedYet, removeUnusedStoredImgFunction);
};

grabMyBooks.autoSave.recoverBook = function()
{
	grabMyBooks.ext.loadBookContent();
	var loadedBookContent = grabMyBooks.ext.getLoadedBookContent();
	if(grabMyBooks.isEmpty(loadedBookContent))
	{
		return;
	}
	var saveInfo = JSON.parse(loadedBookContent);

	var restoreSavedImgInfoFunction =
		function(imgInfo)
		{
			var toAddSavedImgInfo = new grabMyBooks.img.SavedImgInfo(imgInfo.imgUrl, imgInfo.imgLocalName);
			var alreadyLoadedSavedImgInfo = grabMyBooks.tabGet(grabMyBooks.img.savedImgInfos, toAddSavedImgInfo);
			if(alreadyLoadedSavedImgInfo != null)
			{
				return alreadyLoadedSavedImgInfo;
			}
			grabMyBooks.img.savedImgInfos.push(toAddSavedImgInfo);
			toAddSavedImgInfo.imgLocalFile = grabMyBooks.img.getImgFile(imgInfo.imgLocalName);
			grabMyBooks.ext.imgSeenAsUsedOnLoad(toAddSavedImgInfo.imgLocalFile);
			var imgSrc = grabMyBooks.ext.getImgSrcFromNameForBookLoad(imgInfo.imgLocalName);
			var imgObject = new Image();
			var imgOnLoadFunction =
				new function(toAddSavedImgInfo, imgObject)
				{
					return function()
					{
						toAddSavedImgInfo.imgObject = imgObject;
						toAddSavedImgInfo.markAsLoaded();
					};
				}(toAddSavedImgInfo, imgObject);
			imgObject.onload=imgOnLoadFunction;
			imgObject.src=imgSrc;
			return toAddSavedImgInfo;
		};

	var restoreTabSavedImgInfoFunction =
		function(restoreSavedImgInfoFunction)
		{
			return function(imgInfo, index, count)
			{
				restoreSavedImgInfoFunction(imgInfo);
			};
		}(restoreSavedImgInfoFunction);
	grabMyBooks.tabDo(saveInfo.savedImgInfos, restoreTabSavedImgInfoFunction);
	if(saveInfo.savedImgInfos.length>0)
	{
		grabMyBooks.img.nameCounter = saveInfo.imgNameCounter;
	}
	var restoreSavedArticleFunction =
		function()
		{
			return function(articleInfo, index, count)
			{
				var toAddArticleInfo = new grabMyBooks.ArticleInfo(articleInfo.url, articleInfo.title, articleInfo.content);
				toAddArticleInfo.title2 = articleInfo.title2;
				toAddArticleInfo.url = articleInfo.url;
				grabMyBooks.articles.push(toAddArticleInfo);
			};
		}();
	grabMyBooks.tabDo(saveInfo.savedArticleInfos, restoreSavedArticleFunction);

	if(!grabMyBooks.isEmpty(saveInfo.metadata.title))
	{
		grabMyBooks.metadata.title = saveInfo.metadata.title;
	}
	if(!grabMyBooks.isEmpty(saveInfo.metadata.lang))
	{
		grabMyBooks.metadata.lang = saveInfo.metadata.lang;
	}
	if(!grabMyBooks.isEmpty(saveInfo.metadata.author))
	{
		grabMyBooks.metadata.author = saveInfo.metadata.author;
	}
	if(!grabMyBooks.isEmpty(saveInfo.metadata.description))
	{
		grabMyBooks.metadata.description = saveInfo.metadata.description;
	}

	if(saveInfo.cover != null)
	{
		grabMyBooks.img.savedCoverSavedImgInfo = restoreSavedImgInfoFunction(saveInfo.cover);
	};
	grabMyBooks.ext.checkUnusedStoredImgs();
};

grabMyBooks.ext.autoSaveBookPrepareSaveInfo = function(saveInfo)
{
};
grabMyBooks.ext.autoSaveBookPerformSave = function(saveInfoJSon)
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	grabMyBooks.ext.writeFile(saveDir, grabMyBooks.autoSave.savedBookFileName, saveInfoJSon);
};

grabMyBooks.autoSave.bookModified = function()
{
	var saveInfo = new Object();
	grabMyBooks.ext.autoSaveBookPrepareSaveInfo(saveInfo);
	saveInfo.imgNameCounter = grabMyBooks.img.nameCounter;
	saveInfo.savedImgInfos = [];
	saveInfo.savedArticleInfos = [];

	var getSavedImgInfoToSaveObject =
		function(savedImgInfo)
		{
			var toAddSavedImgInfo = new Object();
			toAddSavedImgInfo.imgUrl = savedImgInfo.imgUrl;
			toAddSavedImgInfo.imgLocalName = savedImgInfo.imgLocalName;
			return toAddSavedImgInfo;
		};

	var usedSavedImgInfoUrls = grabMyBooks.img.getUsedImgs(false);
	var addSavedImgInfoFunction =
		function(saveInfo, getSavedImgInfoToSaveObject, usedSavedImgInfoUrls)
		{
			return function(savedImgInfo, index, count)
			{
				var toAddSavedImgInfo = getSavedImgInfoToSaveObject(savedImgInfo);
				if(usedSavedImgInfoUrls.indexOf(toAddSavedImgInfo.imgUrl)==-1)
				{
					return;
				}
				saveInfo.savedImgInfos.push(toAddSavedImgInfo);
			};
		}(saveInfo, getSavedImgInfoToSaveObject, usedSavedImgInfoUrls);
	grabMyBooks.tabDo(grabMyBooks.img.savedImgInfos, addSavedImgInfoFunction);

	var addSavedArticleInfoFunction =
		function(saveInfo)
		{
			return function(articleInfo, index, count)
			{
				var toAddSavedArticleInfo = new Object();
				saveInfo.savedArticleInfos.push(toAddSavedArticleInfo);
				toAddSavedArticleInfo.content = articleInfo.content;
				toAddSavedArticleInfo.title = articleInfo.title;
				toAddSavedArticleInfo.title2 = articleInfo.title2;
				toAddSavedArticleInfo.url = articleInfo.url;
			};
		}(saveInfo);
	grabMyBooks.tabDo(grabMyBooks.articles, addSavedArticleInfoFunction);

	saveInfo.metadata = new Object();
	saveInfo.metadata.title = grabMyBooks.metadata.title;
	saveInfo.metadata.lang = grabMyBooks.metadata.lang;
	saveInfo.metadata.author = grabMyBooks.metadata.author;
	saveInfo.metadata.description = grabMyBooks.metadata.description;

	saveInfo.cover = null;
	if(grabMyBooks.img.savedCoverSavedImgInfo != null)
	{
		saveInfo.cover = getSavedImgInfoToSaveObject(grabMyBooks.img.savedCoverSavedImgInfo);
	}

	var saveInfoJSon = JSON.stringify(saveInfo);
	grabMyBooks.ext.autoSaveBookPerformSave(saveInfoJSon);
};


grabMyBooks.zone = new Object();
grabMyBooks.zone.zonePageLinkClass = "grabMyBooks_zone_rule";
grabMyBooks.zone.getZonePageClass = function(node)
{
	if(node==null)
	{
		return null;
	}
	var localName = node.localName.toLowerCase();
	if(localName!="a")
	{
		return null;
	}
	var linkClass = node.className;
	if(!grabMyBooks.isVariableDefinedAndNotEmpty(linkClass))
	{
		return null;
	}
	linkClass = linkClass.trim();

	var zonePageLinkClassPrefixIndex = linkClass.indexOf(grabMyBooks.zone.zonePageLinkClass);

	if(zonePageLinkClassPrefixIndex!=0)
	{
		return null;
	}

	var linkClassTab = linkClass.split(" ");
	if(linkClassTab.length<3)
	{
		return null;
	}

	var urlInputId = linkClassTab[1];
	var ruleInputId = linkClassTab[2];

	var result = new Object();
	result.urlInputId = urlInputId;
	result.ruleInputId = ruleInputId;

	return result;
};

grabMyBooks.zone.getZonePageClassInNodeOrAncestors = function(node)
{
	if(node==null)
	{
		return null;
	}

	var doc = node.ownerDocument;
	var currentNode = node;
	var currentGetZonePageIdResult;

	var i_node = 0;
	while(currentNode!=null && currentNode!=doc && i_node<4)
	{
		currentGetZonePageClassResult = grabMyBooks.zone.getZonePageClass(currentNode);
		if(currentGetZonePageClassResult!=null)
		{
			return currentGetZonePageClassResult;
		}
		currentNode = currentNode.parentNode;
		i_node+=1;
	}
	return null;
};

grabMyBooks.zone.handleIfClickOnEditPageZone = function(e)
{
	if(!e.cancelable)
	{
		return;
	}
	if(e.button!=0)
	{
		return;
	}

	var selectedTab = gBrowser.selectedTab;

	var target = e.target;
	if(!grabMyBooks.isVariableDefinedAndNotEmpty(target) || !grabMyBooks.isVariableDefinedAndNotEmpty(target.localName))
	{
		return;
	}

	var getZonePageClassResult = grabMyBooks.zone.getZonePageClassInNodeOrAncestors(target);
	if(getZonePageClassResult == null)
	{
		return;
	}

	var doc = target.ownerDocument;
	var pageToZoneUrlNode = doc.getElementById(getZonePageClassResult.urlInputId);
	if(pageToZoneUrlNode==null || typeof(pageToZoneUrlNode)=="undefined")
	{
		return;
	}

	e.preventDefault();

	var pageToZoneUrl = pageToZoneUrlNode.value;
	if(!grabMyBooks.isVariableDefinedAndNotEmpty(pageToZoneUrl))
	{
		return;
	}

	var pageZoneGrabContext = new grabMyBooks.zone.PageZoneGrabContext(pageToZoneUrl);

	var pageToZoneResultNodeId = getZonePageClassResult.ruleInputId;
	var pageToZoneResultNode = doc.getElementById(pageToZoneResultNodeId);
	if(!grabMyBooks.isEmptyObject(pageToZoneResultNode))
	{
		pageZoneGrabContext.toDoWithXPathFunction =
			function(selectedTab, pageToZoneResultNodeId)
			{
				return function(toDoWithXPathContext)
				{
					grabMyBooks.ext.setSelectedTab(selectedTab);
					var tabBrowser = gBrowser.getBrowserForTab(selectedTab);
					var tabDocument = tabBrowser.contentDocument;
					var resultInput = tabDocument.getElementById(pageToZoneResultNodeId);
					resultInput.value=toDoWithXPathContext.xPath;
					var eventToSend = doc.createEvent("Event");
					eventToSend.initEvent("change", true, true);
					resultInput.dispatchEvent(eventToSend);
				};
			}(selectedTab, pageToZoneResultNodeId);
	}


	grabMyBooks.zone.openPageForZoneGrab(pageZoneGrabContext);
};


grabMyBooks.zone.PageZoneGrabContext = function(url)
{
	this.url = url;
	this.toDoWithXPathFunction = null;
};
grabMyBooks.zone.openPageForZoneGrab = function(pageZoneGrabContext)
{
	var pageForZoneGrabTab = gBrowser.addTab(pageZoneGrabContext.url);
	var activationHolder = new Object();
	activationHolder.activated = false;
	var pageForZoneGrabTabBrowser = gBrowser.getBrowserForTab(pageForZoneGrabTab);
	var activateZoneGrabFunction =
		function(pageForZoneGrabTab, activationHolder, pageZoneGrabContext)
		{
			return function(e)
			{
				if(activationHolder.activated)
				{
					return;
				}
				activationHolder.activated = true;
				grabMyBooks.zone.activateZoneGrab(pageForZoneGrabTab, pageZoneGrabContext.toDoWithXPathFunction);
			};
		}(pageForZoneGrabTab, activationHolder, pageZoneGrabContext);
	pageForZoneGrabTabBrowser.addEventListener("load", activateZoneGrabFunction, true);
	grabMyBooks.ext.setSelectedTab(pageForZoneGrabTab);


};

grabMyBooks.zone.NodeInfo = function(nodePath)
{
	this.nodePath = nodePath;
	this.savedCursor = null;
};

grabMyBooks.zone.SelectedNodeConfigInfo = function(nodePath)
{
	this.nodePath = nodePath;
	this.adjustable = true;
	this.size = null;
	this.selectedStartIndex = null;
	this.selectedEndIndex = null;
	this.savedOpacities = [];
	this.identify = function(nodePath)
	{
		return (this.nodePath==nodePath);
	};
	this.startSooner = function()
	{
		if(this.selectedStartIndex>0)
		{
			this.selectedStartIndex -= 1;
		};
	};
	this.startLater = function()
	{
		if(this.selectedStartIndex<this.selectedEndIndex)
		{
			this.selectedStartIndex += 1;
		};
	};
	this.endSooner = function()
	{
		if(this.selectedEndIndex>this.selectedStartIndex)
		{
			this.selectedEndIndex -= 1;
		};
	};
	this.endLater = function()
	{
		if(this.selectedEndIndex<this.size-1)
		{
			this.selectedEndIndex += 1;
		};
	};
	this.restore = function()
	{
		if(!this.adjustable)
		{
			return;
		}
		this.selectedStartIndex = 0;
		this.selectedEndIndex = this.size - 1;
	};
	this.isAdjusted = function()
	{
		return this.selectedStartIndex>0 || this.selectedEndIndex<(this.size-1);
	};
};

grabMyBooks.zone.launchRuleEditor = function()
{
	var selectedTab = gBrowser.selectedTab;
	if(grabMyBooks.isEmptyObject(selectedTab))
	{
		return;
	}
	grabMyBooks.zone.activateZoneGrab(selectedTab, null);
};

grabMyBooks.zone.ToDoWithXPathContext = function(xPath, url)
{
	this.xPath = xPath;
	this.url = url;
};

grabMyBooks.zone.saveXPathAsRule = function(toDoWithXPathContext)
{
	var toDoOnOptionsLoad =
		function(toDoWithXPathContext)
		{
			return function()
			{
				grabMyBooks.optionState.showRulesFunction();
				var urlHost = grabMyBooks.ext.getUrlHost(toDoWithXPathContext.url);
				if(grabMyBooks.isEmpty(urlHost))
				{
					urlHost = "No name";
				}
				var urlHostLowerCase = urlHost.toLowerCase();
				if(urlHostLowerCase.indexOf("www.")==0)
				{
					urlHost = urlHost.substr(4);
				}
				var dotLastIndex = urlHost.lastIndexOf(".");
				if(urlHost.length>=6 && (dotLastIndex == urlHost.length-3 || dotLastIndex == urlHost.length-4))
				{
					urlHost = urlHost.substring(0, dotLastIndex);
				}
				var newRuleFunction =
					function(toDoWithXPathContext, urlHost)
					{
						return function()
						{
							grabMyBooks.optionState.addRuleFunction();
							grabMyBooks.fillDetectionForm(null, urlHost, urlHost, toDoWithXPathContext.xPath, null, null);
						};
					}(toDoWithXPathContext, urlHost);

				if(grabMyBooks.siteDetectionRules.length==0)
				{
					newRuleFunction();
					return;
				}

				var newOrEditRuleMessage = "Would you like to add a new rule or edit an existing one?";
				var ruleElements = [];
				var currentRuleElement;
				var currentRule;
				for(var i_rule=0; i_rule<grabMyBooks.siteDetectionRules.length; i_rule++)
				{
					currentRule = grabMyBooks.siteDetectionRules[i_rule];
					currentRuleElement = new Object();
					currentRuleElement.name=currentRule.name;
					currentRuleElement.value=i_rule;
					ruleElements.push(currentRuleElement);
				}

				var editRuleFunction =
					function(selectedRuleIndex)
					{
						grabMyBooks.showAndEditRule(selectedRuleIndex);
						grabMyBooks.fillDetectionForm(null, null, null, toDoWithXPathContext.xPath, null, null);
					};

                var afterLoadedHtmlOptionsToDoFunction =
                    function(newOrEditRuleMessage, ruleElements, newRuleFunction, editRuleFunction)
                    {
                        return function()
                        {
                            grabMyBooks.optionState.popin.askNewOrEdit(newOrEditRuleMessage, "New rule", "Edit existing rule", ruleElements, newRuleFunction, editRuleFunction, null);
                        };
                    }(newOrEditRuleMessage, ruleElements, newRuleFunction, editRuleFunction);

                grabMyBooks.execWithTimer(afterLoadedHtmlOptionsToDoFunction,50);
			};
		}(toDoWithXPathContext);
	grabMyBooks.showOptions(toDoOnOptionsLoad);
};

grabMyBooks.zone.activateZoneGrab = function(tab, toDoWithXPathFunction)
{
	var tabBrowser = gBrowser.getBrowserForTab(tab);
	var tabDocument = tabBrowser.contentDocument;

	var cantActivateZoneGrabFunction =
		function(text)
		{
			grabMyBooks.SmallInfo.showSmallInfoPanel(text, null);
		};

	if(grabMyBooks.isEmptyObject(tabDocument))
	{
		cantActivateZoneGrabFunction("A page needs to be opened.");
		return;
	}
	if(grabMyBooks.isAGrabMyBooksPageOnSelectedTab())
	{
		return;
	}
	var tabUrl = tabDocument.location.href;
	if(tabUrl.toLowerCase().indexOf("http")!=0)
	{
		cantActivateZoneGrabFunction("Page's url must start with 'http'.");
		return;
	}
	var testIfZoneGrabAlreadyOnNode = tabDocument.getElementById("grabMyBooks_zonePanel");
	if(!grabMyBooks.isEmptyObject(testIfZoneGrabAlreadyOnNode))
	{
		cantActivateZoneGrabFunction("Rule editor already activated on this page.");
		return;
	}

	if(toDoWithXPathFunction==null)
	{
		toDoWithXPathFunction = grabMyBooks.zone.saveXPathAsRule;
	}

	var grabZoneContext = new Object();
	grabZoneContext.doc = tabDocument;
	grabZoneContext.url = tabUrl;
	grabZoneContext.toDoWithXPathFunction = toDoWithXPathFunction;
	grabZoneContext.nodeInfoCache = [];
	grabZoneContext.getNodeInfoInCache = function(path)
	{
		var currentNodeInfo;
		for(var i_nodeInfo=0; i_nodeInfo<grabZoneContext.nodeInfoCache.length; i_nodeInfo++)
		{
			currentNodeInfo = this.nodeInfoCache[i_nodeInfo];
			if(currentNodeInfo.nodePath==path)
			{
				return currentNodeInfo;
			}
		}
		return null;
	};
	grabZoneContext.restoreLook = function(path)
	{
		this.removeSelectionZoneRectangle(path);
		var nodeInfo = this.getNodeInfoInCache(path);
		if(nodeInfo==null)
		{
			return;
		}
		var node = this.findNode(path);
		if(node==null)
		{
			return;
		}
		node.style.cursor = nodeInfo.savedCursor;
	};
	grabZoneContext.removeHref = function(node)
	{
		if(!grabMyBooks.isEmpty(node.href))
		{
			node.href="javascript:void(0);";
		}
		if(!grabMyBooks.isEmpty(node.target))
		{
			node.target="";
		}
		var parentNode = node.parentNode;
		if(parentNode != null)
		{
			this.removeHref(parentNode);
		}
	};
	grabZoneContext.detectedNodeInfo = null;
	grabZoneContext.tryAndDetect = function(node)
	{
		var path = this.findPathForNode(node);
		if(path==null)
		{
			var findPathInParentNodesResult = this.findPathInParentNodes(node);
			if(findPathInParentNodesResult==null)
			{
				return;
			}
			path = grabMyBooks.ext.path(findPathInParentNodesResult);
			node = findPathInParentNodesResult.node;
		}
		var selectedNodeInfo = this.getSelectedNodeInfo(path);
		if(selectedNodeInfo != null)
		{
			return;
		}
		var nodeInfo = this.addNodeInfoInCacheIfNeeded(path, node);
		if(grabZoneContext.detectedNodeInfo != null)
		{
			if(grabZoneContext.detectedNodeInfo == path)
			{
				return;
			}
			this.restoreLook(grabZoneContext.detectedNodeInfo.nodePath);
		}
		this.setDetectionNode(node);
		node.style.cursor = "pointer";
		grabZoneContext.showPath(path);
		grabZoneContext.detectedNodeInfo = nodeInfo;
	};

	grabZoneContext.selectedNodeInfos = [];
	grabZoneContext.getSelectedNodeInfo = function(path)
	{
		var currentNodeInfo;
		for(var i_nodeInfo=0; i_nodeInfo<this.selectedNodeInfos.length; i_nodeInfo++)
		{
			currentNodeInfo = this.selectedNodeInfos[i_nodeInfo];
			if(currentNodeInfo.nodePath==path)
			{
				return currentNodeInfo;
			}
		}
		return null;
	};
	grabZoneContext.unSelect = function(path)
	{
		var currentNodeInfo;
		for(var i_nodeInfo=0; i_nodeInfo<this.selectedNodeInfos.length; i_nodeInfo++)
		{
			currentNodeInfo = this.selectedNodeInfos[i_nodeInfo];
			if(currentNodeInfo.nodePath==path)
			{
				var selectedNodeConfigInfo = this.getSelectedNodeConfigInfo(currentNodeInfo.nodePath);
				selectedNodeConfigInfo.restore();
				this.updateConfiguredSelectedNodeLook(selectedNodeConfigInfo.nodePath);
				this.selectedNodeInfos.splice(i_nodeInfo, 1);
				this.updateSelectionDisplay();
				this.removeWrapSpans(currentNodeInfo.nodePath);
				return;
			}
		}
	};
	grabZoneContext.removeWrapSpans = function(path)
	{
		var node = this.findNode(path);
		var xPathResult = this.doc.evaluate("./node()", node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var resultLength = 	xPathResult.snapshotLength;
		var currentChildNode;
		for(var i_childNode=0; i_childNode<resultLength; i_childNode++)
		{
			currentChildNode = xPathResult.snapshotItem(i_childNode);
			if(!grabMyBooks.isEmpty(currentChildNode.className) && currentChildNode.className.indexOf("grabMyBooks_zonePanel_wrapSpan")!=-1)
			{
				node.replaceChild(currentChildNode.childNodes[0], currentChildNode);
			}
		}
	};
	grabZoneContext.tryAndSelect = function(node)
	{
		if(node==null)
		{
			return;
		}

		var childOfDetectedNode = false;
		var detectedNode = null;
		var childOfSelectedNode = false;
		var childOfSelectedNodeInfo = null;

		if(this.detectedNodeInfo != null)
		{
			detectedNode = this.findNode(this.detectedNodeInfo.nodePath);
			childOfDetectedNode = grabMyBooks.isNodeChildOf(node, detectedNode);
		}

		var currentNodeInfo;
		var currentSelectedNode;
		for(var i_nodeInfo=0; i_nodeInfo<this.selectedNodeInfos.length; i_nodeInfo++)
		{
			currentNodeInfo = this.selectedNodeInfos[i_nodeInfo];
			currentSelectedNode = this.findNode(currentNodeInfo.nodePath);

			if(grabMyBooks.isNodeChildOf(node, currentSelectedNode))
			{
				childOfSelectedNode = true;
				childOfSelectedNodeInfo = currentNodeInfo;
				break;
			}
		}

		if(childOfDetectedNode)
		{
			this.selectedNodeInfos.push(this.detectedNodeInfo);
			this.addSelectionZoneRectangle(this.detectedNodeInfo.nodePath);
			detectedNode.style.cursor = "pointer";
			this.cleanSelectedNodeInfosForNewSelectedNodeInfo(this.detectedNodeInfo);
			this.detectedNodeInfo = null;
			this.unSetDetectionNode();
			this.updateSelectionDisplay();
		}
		else if(childOfSelectedNode)
		{
			this.unSelect(childOfSelectedNodeInfo.nodePath);
			this.restoreLook(childOfSelectedNodeInfo.nodePath);
		}
	};
	grabZoneContext.cleanSelectedNodeInfosForNewSelectedNodeInfo = function(newSelectedNodeInfo)
	{
		var newSelectedNode = this.findNode(newSelectedNodeInfo.nodePath);
		var currentSelectedNode;
		for(var i_nodeInfo=0; i_nodeInfo<this.selectedNodeInfos.length; i_nodeInfo++)
		{
			currentNodeInfo = this.selectedNodeInfos[i_nodeInfo];
			currentSelectedNode = this.findNode(currentNodeInfo.nodePath);
			if(currentSelectedNode == newSelectedNode)
			{
				continue;
			}
			if(grabMyBooks.isNodeChildOf(newSelectedNode, currentSelectedNode) || grabMyBooks.isNodeChildOf(currentSelectedNode, newSelectedNode))
			{
				this.unSelect(currentNodeInfo.nodePath);
				this.restoreLook(currentNodeInfo.nodePath);
				i_nodeInfo-=1;
			}
		}
	};
	grabZoneContext.getActualChildNodePosition = function(selectedNodeConfigInfo, index)
	{
		var node = this.findNode(selectedNodeConfigInfo.nodePath);
		var stylableChildNodes = grabMyBooks.zone.domGetStylableChildNodes(this.doc, node);
		var targetChildNode = stylableChildNodes[index];
		var xPathResult = this.doc.evaluate(selectedNodeConfigInfo.nodePath+"/node()", this.doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		var resultLength = 	xPathResult.snapshotLength;

		var currentChildNode;
		var childNodeCounter = 0;
		for(var i_childNode=0; i_childNode<resultLength; i_childNode++)
		{
			currentChildNode = xPathResult.snapshotItem(i_childNode);
			if(grabMyBooks.zone.skipNode(currentChildNode))
			{
				continue;
			}
			if(currentChildNode==targetChildNode)
			{
				return childNodeCounter;
			}
			childNodeCounter++;
		}
		return null;
	};
	grabZoneContext.getSelectedNodeConfigInfoFullXPath = function(selectedNodeConfigInfo)
	{
		var result = selectedNodeConfigInfo.nodePath;
		if(!selectedNodeConfigInfo.isAdjusted())
		{
			return result;
		}
		result+="/node()[";
		var subRules = [];
		var sameIndex = (selectedNodeConfigInfo.selectedStartIndex==selectedNodeConfigInfo.selectedEndIndex);
		if(sameIndex)
		{
			var startIndex = this.getActualChildNodePosition(selectedNodeConfigInfo, selectedNodeConfigInfo.selectedStartIndex);
			subRules.push("position()="+(startIndex+1));
		}
		if(!sameIndex && selectedNodeConfigInfo.selectedStartIndex>0)
		{
			var startIndex = this.getActualChildNodePosition(selectedNodeConfigInfo, selectedNodeConfigInfo.selectedStartIndex);
			subRules.push("position()>="+(startIndex+1));
		}
		if(!sameIndex && selectedNodeConfigInfo.selectedEndIndex<(selectedNodeConfigInfo.size-1))
		{
			var endIndex = this.getActualChildNodePosition(selectedNodeConfigInfo, selectedNodeConfigInfo.selectedEndIndex);
			subRules.push("position()<="+(endIndex+1));
		}
		result+=subRules.join(" and ");
		result+="]";
		return result;
	};
	grabZoneContext.getSelectedFullXPath = function()
	{
		var resultTab = [];
		var currentNodeInfo;
		var currentSelectedNodeConfigInfo;
		for(var i_nodeInfo=0; i_nodeInfo<this.selectedNodeInfos.length; i_nodeInfo++)
		{
			currentNodeInfo = this.selectedNodeInfos[i_nodeInfo];
			currentSelectedNodeConfigInfo = this.getSelectedNodeConfigInfo(currentNodeInfo.nodePath);
			resultTab.push(this.getSelectedNodeConfigInfoFullXPath(currentSelectedNodeConfigInfo));
		}
		return resultTab.join(" | ");
	};

	grabZoneContext.selectedNodeConfigInfos = [];
	grabZoneContext.getSelectedNodeConfigInfo = function(nodePath)
	{
		var selectedNodeConfigInfo = grabMyBooks.tabGet(this.selectedNodeConfigInfos, nodePath);
		if(selectedNodeConfigInfo != null)
		{
			return selectedNodeConfigInfo;
		}
		var node = this.findNode(nodePath);
		if(node == null)
		{
			return null;
		}

		var stylableChildNodes = grabMyBooks.zone.domGetStylableChildNodes(this.doc, node);

		selectedNodeConfigInfo = new grabMyBooks.zone.SelectedNodeConfigInfo(nodePath);
		if(stylableChildNodes.length<2)
		{
			selectedNodeConfigInfo.adjustable = false;
		}
		else
		{
			selectedNodeConfigInfo.size=stylableChildNodes.length;
			selectedNodeConfigInfo.selectedStartIndex = 0;
			selectedNodeConfigInfo.selectedEndIndex = selectedNodeConfigInfo.size - 1;
			var currentNode;
			for(var i_childNode=0; i_childNode<stylableChildNodes.length; i_childNode++)
			{
				currentNode = stylableChildNodes[i_childNode];
				selectedNodeConfigInfo.savedOpacities.push(currentNode.style.opacity);
			}
		}
		grabZoneContext.selectedNodeConfigInfos.push(selectedNodeConfigInfo);
		return selectedNodeConfigInfo;
	};
	grabZoneContext.updateConfiguredSelectedNodeLook = function(nodePath)
	{
		var node = this.findNode(nodePath);
		var stylableChildNodes = grabMyBooks.zone.domGetStylableChildNodes(this.doc, node);
		var selectedNodeConfigInfo = this.getSelectedNodeConfigInfo(nodePath);
		if(!selectedNodeConfigInfo.adjustable)
		{
			return;
		}

		var selectionZoneRectangle = grabMyBooks.tabGet(this.selectionZoneRectangles, nodePath);

		if(selectedNodeConfigInfo.selectedStartIndex>0)
		{
			var startNode = stylableChildNodes[selectedNodeConfigInfo.selectedStartIndex];
			var startNodeGetElementAbsolutePositionResult =
				grabMyBooks.getElementAbsolutePosition(startNode);
			selectionZoneRectangle.positionStartMarker(startNodeGetElementAbsolutePositionResult.x + 5, startNodeGetElementAbsolutePositionResult.y - 15);
		}
		else
		{
			selectionZoneRectangle.positionStartMarker(null, null);
		}

		if(selectedNodeConfigInfo.selectedEndIndex<selectedNodeConfigInfo.size-1)
		{
			var endNode = stylableChildNodes[selectedNodeConfigInfo.selectedEndIndex];
			var endNodeGetElementAbsolutePositionResult =
				grabMyBooks.getElementAbsolutePosition(endNode);
			selectionZoneRectangle.positionEndMarker(endNodeGetElementAbsolutePositionResult.x+endNodeGetElementAbsolutePositionResult.width -35, endNodeGetElementAbsolutePositionResult.y+endNodeGetElementAbsolutePositionResult.height - 10);
		}
		else
		{
			selectionZoneRectangle.positionEndMarker(null, null);
		}

		for(var i_start=0; i_start<selectedNodeConfigInfo.selectedStartIndex; i_start++)
		{
			if(!grabMyBooks.isEmptyObject(stylableChildNodes[i_start].style))
			{
				stylableChildNodes[i_start].style.opacity="0.2";
			}
		}
		for(var i_selected=selectedNodeConfigInfo.selectedStartIndex; i_selected<=selectedNodeConfigInfo.selectedEndIndex; i_selected++)
		{
			if(!grabMyBooks.isEmptyObject(stylableChildNodes[i_selected].style))
			{
				stylableChildNodes[i_selected].style.opacity=selectedNodeConfigInfo.savedOpacities[i_selected];
			}
		}
		for(var i_end=selectedNodeConfigInfo.selectedEndIndex+1; i_end<selectedNodeConfigInfo.size; i_end++)
		{
			if(!grabMyBooks.isEmptyObject(stylableChildNodes[i_end].style))
			{
				stylableChildNodes[i_end].style.opacity="0.2";
			}
		}
	};


	grabZoneContext.addNodeInfoInCacheIfNeeded = function(path, node)
	{
		var nodeInfo = this.getNodeInfoInCache(path);
		if(nodeInfo == null)
		{
			nodeInfo = new grabMyBooks.zone.NodeInfo(path);
			nodeInfo.savedCursor = node.style.cursor;
			this.nodeInfoCache.push(nodeInfo);
		}
		return nodeInfo;
	};
	grabZoneContext.findNode = function(path)
	{
		var xPathResult = this.doc.evaluate(path ,this.doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(xPathResult.snapshotLength<=0)
		{
			return null;
		}
		var result = xPathResult.snapshotItem(0);
		return result;
	};
	grabZoneContext.onlyOneNodeAtPath = function(path)
	{
		var xPathResult = this.doc.evaluate(path ,this.doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if(xPathResult.snapshotLength==1)
		{
			return true;
		}
		return false;
	};

	grabZoneContext.findPathForVeryNode = function(node)
	{
		var nodeId = node.id;
		if(!grabMyBooks.isEmpty(nodeId))
		{
			var idWithNumberRegexp = /^([^\d]{3,})\d+$/;
			var idWithNumberRegexpResult = idWithNumberRegexp.exec(nodeId);
			if(idWithNumberRegexpResult != null)
			{
				var idWithWithoutNumber = idWithNumberRegexpResult[1];
				var idWithWithoutNumberXPath = "//*[starts-with(@id,'"+idWithWithoutNumber+"')]";
				if(grabZoneContext.onlyOneNodeAtPath(idWithWithoutNumberXPath))
				{
					return idWithWithoutNumberXPath;
				}
			}
			return "//*[@id='"+nodeId+"']";
		}
		var nodeClassName = node.className;
		if(!grabMyBooks.isEmpty(nodeClassName))
		{
			var severalClassesTab = nodeClassName.trim().replace(/\s+/g, " ").split(" ");
			if(severalClassesTab.length > 0)
			{
				var severalClassesResultHolder = new Object();
				severalClassesResultHolder.result = null;
				var severalClassesTabFunction =
					function(severalClassesResultHolder, grabZoneContext)
					{
						return function(currentClass, index, count)
						{
							if(!grabMyBooks.isEmpty(severalClassesResultHolder.result))
							{
								return;
							}
							var classXPath = "//*[contains(@class,'"+currentClass+"')]";
							if(grabZoneContext.onlyOneNodeAtPath(classXPath))
							{
								severalClassesResultHolder.result = classXPath;
							}
						};
					}(severalClassesResultHolder, this);
				grabMyBooks.tabDo(severalClassesTab, severalClassesTabFunction);
				if(!grabMyBooks.isEmpty(severalClassesResultHolder.result))
				{
					return severalClassesResultHolder.result;
				}
			}
			var classXPath = "//*[contains(@class,'"+nodeClassName.trim()+"')]";
			if(this.onlyOneNodeAtPath(classXPath))
			{
				return classXPath;
			}
			classXPath = "//*[@class='"+nodeClassName+"']";
			if(this.onlyOneNodeAtPath(classXPath))
			{
				return classXPath;
			}
		}
		var bodyNode = this.doc.body;
		if(!grabMyBooks.isEmptyObject(bodyNode) && (bodyNode == node))
		{
			return "//body";
		}
		return null;
	};

	grabZoneContext.findPathForNodeRec = function(node, childNode, suffixPath)
	{
		if(suffixPath==null)
		{
			suffixPath = "";
		}

		var newSuffixPath = suffixPath;
		if(childNode != null)
		{
			var childNodeLocalName = childNode.localName;
			if(grabMyBooks.isEmpty(childNodeLocalName))
			{
				return null;
			}
			childNodeLocalName = childNodeLocalName.toLowerCase();
			var childCounter = 1;
			var currentChildNode;
			var currentLocalName;
			var childNodeFound = false;
			for(var i_child=0; i_child<node.childNodes.length; i_child++)
			{
				currentChildNode = node.childNodes[i_child];
				currentLocalName = currentChildNode.localName;
				if(grabMyBooks.isEmpty(currentLocalName))
				{
					continue;
				}
				currentLocalName = currentLocalName.toLowerCase();
				if(currentLocalName==childNodeLocalName)
				{
					if(currentChildNode==childNode)
					{
						childNodeFound = true;
						break;
					}
					else
					{
						childCounter+=1;
					}
				}
			}
			if(!childNodeFound)
			{
				return null;
			}
			newSuffixPath = "/"+childNodeLocalName+"["+childCounter+"]"+newSuffixPath;
		}



		var veryNodeFoundPath = this.findPathForVeryNode(node);
		if(!grabMyBooks.isEmpty(veryNodeFoundPath))
		{
			return veryNodeFoundPath+newSuffixPath;
		}

		var parentNode = node.parentNode;
		if(grabMyBooks.isEmptyObject(parentNode))
		{
			return null;
		}

		var result = this.findPathForNodeRec(parentNode, node, newSuffixPath);
		return result;
	};

	grabZoneContext.findPathForNode = function(node)
	{
		var result = this.findPathForNodeRec(node, null, null);
		return result;
	};
	grabZoneContext.findPathInParentNodes = function(node)
	{
		var result = null;
		var currentParentNode = node.parentNode;
		var currentPath;
		while(currentParentNode!=null)
		{
			currentPath = this.findPathForNode(currentParentNode);
			if(!grabMyBooks.isEmpty(currentPath))
			{
				result = new Object();
				result.path = currentPath;
				result.node = currentParentNode;
				return result;
			}
			currentParentNode = currentParentNode.parentNode;
		}
		return result;
	};


	var zonePanelNode = tabDocument.createElement("div");
	zonePanelNode.id = "grabMyBooks_zonePanel";
	zonePanelNode.style.right = "40px";


	grabZoneContext.zoneRectangleCounter = 1;
	grabZoneContext.createZoneRectangle = function(name, additionalClassName)
	{
		var zoneRectangle = new Object();
		zoneRectangle.id = this.zoneRectangleCounter++;
		zoneRectangle.name = name;
		var zoneRectangleTopSide = this.doc.createElement("div");
		var zoneRectangleRightSide = this.doc.createElement("div");
		var zoneRectangleBottomSide = this.doc.createElement("div");
		var zoneRectangleLeftSide = this.doc.createElement("div");

		var zoneRectangleStartMarker = this.doc.createElement("img");
		var zoneRectangleEndMarker = this.doc.createElement("img");
		zoneRectangleStartMarker.src="chrome://grabMyBooks/content/icons/zone/markerStart.png";
		zoneRectangleEndMarker.src="chrome://grabMyBooks/content/icons/zone/markerEnd.png";

		zoneRectangleTopSide.id="grabMyBooks_zoneRect_Top_"+zoneRectangle.id;
		zoneRectangleRightSide.id="grabMyBooks_zoneRect_Right_"+zoneRectangle.id;
		zoneRectangleBottomSide.id="grabMyBooks_zoneRect_Bottom_"+zoneRectangle.id;
		zoneRectangleLeftSide.id="grabMyBooks_zoneRect_Left_"+zoneRectangle.id;

		zoneRectangleStartMarker.id = "grabMyBooks_zoneRect_marker_start_"+zoneRectangle.id;
		zoneRectangleEndMarker.id = "grabMyBooks_zoneRect_marker_end_"+zoneRectangle.id;


		zoneRectangleTopSide.className = "grabMyBooks_zoneRect_Top grabMyBooks_zoneRect_Side "+(additionalClassName!=null?additionalClassName:"");
		zoneRectangleRightSide.className = "grabMyBooks_zoneRect_Right grabMyBooks_zoneRect_Side "+(additionalClassName!=null?additionalClassName:"");
		zoneRectangleBottomSide.className = "grabMyBooks_zoneRect_Bottom grabMyBooks_zoneRect_Side "+(additionalClassName!=null?additionalClassName:"");
		zoneRectangleLeftSide.className = "grabMyBooks_zoneRect_Left grabMyBooks_zoneRect_Side "+(additionalClassName!=null?additionalClassName:"");
		zoneRectangleStartMarker.className = "grabMyBooks_zoneRect_marker";
		zoneRectangleEndMarker.className = "grabMyBooks_zoneRect_marker";

		this.doc.body.appendChild(zoneRectangleTopSide);
		this.doc.body.appendChild(zoneRectangleRightSide);
		this.doc.body.appendChild(zoneRectangleBottomSide);
		this.doc.body.appendChild(zoneRectangleLeftSide);
		this.doc.body.appendChild(zoneRectangleStartMarker);
		this.doc.body.appendChild(zoneRectangleEndMarker);

		zoneRectangle.position =
			function(grabZoneContext)
			{
				return function(x, y, width, height)
				{
					var zoneRectangleTopSide = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_Top_"+this.id);
					var zoneRectangleRightSide = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_Right_"+this.id);
					var zoneRectangleBottomSide = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_Bottom_"+this.id);
					var zoneRectangleLeftSide = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_Left_"+this.id);

					zoneRectangleTopSide.style.top = y+"px";
					zoneRectangleTopSide.style.left = x+"px";
					zoneRectangleTopSide.style.width = width+"px";

					zoneRectangleRightSide.style.top = y+"px";
					zoneRectangleRightSide.style.left = (x+width)+"px";
					zoneRectangleRightSide.style.height = height+"px";

					zoneRectangleBottomSide.style.top = (y+height)+"px";
					zoneRectangleBottomSide.style.left = x+"px";
					zoneRectangleBottomSide.style.width = width+"px";

					zoneRectangleLeftSide.style.top = y+"px";
					zoneRectangleLeftSide.style.left = x+"px";
					zoneRectangleLeftSide.style.height = height+"px";
				};
			}(grabZoneContext);

		zoneRectangle.positionMarker =
			function(grabZoneContext)
			{
				return function(x, y, markerType)
				{
					var zoneRectangleMarker = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_marker_"+markerType+"_"+this.id);

					if(x!=null && y!=null)
					{
						zoneRectangleMarker.style.top = y+"px";
						zoneRectangleMarker.style.left = x+"px";
					}
					else
					{
						zoneRectangleMarker.style.top = "-100px";
						zoneRectangleMarker.style.left = "-100px";
					}
				};
			}(grabZoneContext);

		zoneRectangle.positionStartMarker =
			function(x, y)
			{
				this.positionMarker(x, y, "start");
			};
		zoneRectangle.positionEndMarker =
			function(x, y)
			{
				this.positionMarker(x, y, "end");
			};

		zoneRectangle.remove =
			function(grabZoneContext)
			{
				return function()
				{
					var zoneRectangleTopSide = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_Top_"+this.id);
					var zoneRectangleRightSide = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_Right_"+this.id);
					var zoneRectangleBottomSide = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_Bottom_"+this.id);
					var zoneRectangleLeftSide = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_Left_"+this.id);
					var zoneRectangleStartMarker = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_marker_start_"+this.id);
					var zoneRectangleEndMarker = grabZoneContext.doc.getElementById("grabMyBooks_zoneRect_marker_end_"+this.id);

					grabZoneContext.doc.body.removeChild(zoneRectangleTopSide);
					grabZoneContext.doc.body.removeChild(zoneRectangleRightSide);
					grabZoneContext.doc.body.removeChild(zoneRectangleBottomSide);
					grabZoneContext.doc.body.removeChild(zoneRectangleLeftSide);
					grabZoneContext.doc.body.removeChild(zoneRectangleStartMarker);
					grabZoneContext.doc.body.removeChild(zoneRectangleEndMarker);

				};
			}(grabZoneContext);

		zoneRectangle.identify = function(name)
		{
			return (this.name==name);
		};

		return zoneRectangle;
	};

	grabZoneContext.detectionZoneRectangle = grabZoneContext.createZoneRectangle("detectionNode", "grabMyBooks_zoneRect_detection");
	grabZoneContext.defaultDetectionZoneRectangle = grabZoneContext.createZoneRectangle("defaultDetectionNode", "grabMyBooks_zoneRect_defaultDetection");
	grabZoneContext.selectionZoneRectangles = [];
	grabZoneContext.addSelectionZoneRectangle = function(nodePath)
	{
		var selectionZoneRectangle = grabMyBooks.tabGet(this.selectionZoneRectangles, nodePath);
		if(selectionZoneRectangle != null)
		{
			return;
		}
		selectionZoneRectangle = this.createZoneRectangle(nodePath, "grabMyBooks_zoneRect_selection");
		this.selectionZoneRectangles.push(selectionZoneRectangle);

		var targetNode = this.findNode(nodePath);
		var getElementAbsolutePositionResult =
			grabMyBooks.getElementAbsolutePosition(targetNode);
		selectionZoneRectangle.position(getElementAbsolutePositionResult.x, getElementAbsolutePositionResult.y, getElementAbsolutePositionResult.width, getElementAbsolutePositionResult.height);
	};
	grabZoneContext.removeSelectionZoneRectangle = function(nodePath)
	{
		var selectionZoneRectangle = grabMyBooks.tabRemove(this.selectionZoneRectangles, nodePath);
		if(selectionZoneRectangle == null)
		{
			return;
		}
		selectionZoneRectangle.remove();
	};

	grabZoneContext.setDetectionNode = function(node)
	{
		var getElementAbsolutePositionResult =
			grabMyBooks.getElementAbsolutePosition(node);
		this.detectionZoneRectangle.position(getElementAbsolutePositionResult.x, getElementAbsolutePositionResult.y, getElementAbsolutePositionResult.width, getElementAbsolutePositionResult.height);
	};

	grabZoneContext.unSetDetectionNode = function(node)
	{
		this.detectionZoneRectangle.position(-50,-50,10,10);
	};


	var zonePanelNodeContentTab = [];
	zonePanelNodeContentTab.push(
		"<style type=\"text/css\">",
		grabMyBooks.menu.css(),
		"#grabMyBooks_zonePanel {color:black;text-align:left;font-family:Helvetica,Arial,sans-serif;font-size:12px;position:fixed;z-index:1000;width:300px;}",
		"#grabMyBooks_zonePanel img{border:none;}",
		"#grabMyBooks_zonePanelContainer {background-image:url(chrome://grabMyBooks/content/icons/menu/bg.png);position:absolute;top:0px;left:0px;z-index:1000;border-radius:5px 5px 5px 5px;border:solid 1px black;padding:5px 10px;width:278px;min-height:200px;}",
		"#grabMyBooks_zonePanelMoveLeft, #grabMyBooks_zonePanelMoveRight, #grabMyBooks_zonePanelMoveBottomLeft, #grabMyBooks_zonePanelMoveBottomRight {z-index:999;position:absolute;top:4px;border-radius:5px 5px 5px 5px;}",
		"#grabMyBooks_zonePanelMoveLeft, #grabMyBooks_zonePanelMoveBottomLeft {left:-25px;}",
		"#grabMyBooks_zonePanelMoveRight, #grabMyBooks_zonePanelMoveBottomRight {right:-25px;}",
		"#grabMyBooks_zonePanelMoveLeft:hover, #grabMyBooks_zonePanelMoveBottomLeft:hover {left:-35px;}",
		"#grabMyBooks_zonePanelMoveRight:hover, #grabMyBooks_zonePanelMoveBottomRight:hover {right:-35px;}",
		"#grabMyBooks_zonePanelSelection {max-height:350px;overflow-y:auto;}",
		".grabMyBooksSelectedZone {color:red;font-weight:bold;background:white;border:solid 1px black;border-radius:5px 5px 5px 5px;margin-bottom:5px;margin-right:2px;padding:5px;padding-right:15px;position:relative;min-height:24px;}",
		".grabMyBooksSelectedZone_unSelect {color:black;cursor:pointer;position:absolute;top:3px;right:6px;}",
		".grabMyBooksSelectedZone_getParent {cursor:pointer;position:absolute;bottom:3px;right:4px;max-height:12px;}",
		"#grabMyBooks_zonePanelTest, #grabMyBooks_zonePanelAction {position:absolute;bottom:10px;cursor:pointer;}",
		"#grabMyBooks_zonePanelTest {left:10px;}",
		"#grabMyBooks_zonePanelAction {right:10px;}",
		"#grabMyBooks_zonePanelPath{line-height:95%;color:#07C;font-weight:bold;min-height:25px;overflow:hidden;}",
		"#grabMyBooks_zonePanelFullXPath {font-weight:bold;margin-bottom:50px;max-height:60px;overflow-y:auto;}",
		".grabMyBooks_zonePanelTitle {font-weight:bold;margin-bottom:3px;display:block;text-decoration:underline;}",
		".grabMyBooksSelectedZone_controls {display:inline-block;vertical-align:top;margin-left:10px;margin-top:10px;margin-bottom:10px;position:relative;width:40px;height:50px;background;white;border:solid 2px red;}",
		".grabMyBooksSelectedZone_startAdd {position:absolute;top:-10px;left:-5px}",
		".grabMyBooksSelectedZone_startRemove {position:absolute;top:-5px;left:6px;}",
		".grabMyBooksSelectedZone_endAdd {position:absolute;bottom:-10px;right:-5px;}",
		".grabMyBooksSelectedZone_endRemove {position:absolute;bottom:-5px;right:6px;}",
		".grabMyBooksSelectedZone_restore {position:absolute;top:-6px;right:-8px;}",
		".grabMyBooksSelectedZone_controlImg img {cursor:pointer;max-width:15px;}",
		".grabMyBooksSelectedZone_controlImg:hover {-moz-transform: scale(1.8);}",
		"#grabMyBooks_zonePanelBigTitle {color:#75a348;text-align:center;margin-bottom:10px;font-weight:bold;font-size:16px;}",
		"#grabMyBooks_zonePanelQuit {position:absolute;top:5px;right:10px;font-weight:bold;cursor:pointer;}",
		".grabMyBooks_zoneRect_Side {position:absolute;}",
		".grabMyBooks_zoneRect_Top {top:-50px;left:-50px;height:0px;width:0px;}",
		".grabMyBooks_zoneRect_Right {top:-50px;left:-50px;height:0px;width:0px;}",
		".grabMyBooks_zoneRect_Bottom {top:-50px;left:-50px;height:0px;width:0px;}",
		".grabMyBooks_zoneRect_Left {top:-50px;left:-50px;height:0px;width:0px;}",
		".grabMyBooks_zoneRect_detection {border:solid 2px #07C;z-index:996;}",
		".grabMyBooks_zoneRect_defaultDetection {border:solid 2px gray;z-index:994;}",
		".grabMyBooks_zoneRect_selection {border:solid 2px red;z-index:995;}",
		".grabMyBooks_zoneRect_marker {position:absolute;z-index:995;top:-100px;left:-100px;}",
		"#grabMyBooks_zonePanelShowDefault {font-weight:bold;}",
		"#grabMyBooks_zonePanelShowDefaultCheckBox {margin-right:5px;}",
		"#grabMyBooks_zonePanelShowDefaultRect, #grabMyBooks_zonePanelMouseOverRect, #grabMyBooks_zonePanelSelectionRect {display:inline-block;vertical-align:middle;margin-left:5px;width:10px;height:10px;}",
		"#grabMyBooks_zonePanelShowDefaultRect {border:solid 2px gray;}",
		"#grabMyBooks_zonePanelShowDefaultSelect {visibility:hidden;font-size:10px;margin-left:10px;}",
		"#grabMyBooks_zonePanelShowDefaultCheckBox:checked + #grabMyBooks_zonePanelShowDefaultRect + #grabMyBooks_zonePanelShowDefaultSelect {visibility:visible;}",
		"#grabMyBooks_zonePanelMouseOverRect {border:solid 2px #07C;}",
		"#grabMyBooks_zonePanelSelectionRect {border:solid 2px red;}",
		"</style>",
		"Panel",
		"<br>",
		"<div id=\"grabMyBooks_zonePanelContainer\">",
		"	<div id=\"grabMyBooks_zonePanelBigTitle\">Rule editor</div>",
		"	<span class=\"grabMyBooks_zonePanelTitle\">Mouse over<div id=\"grabMyBooks_zonePanelMouseOverRect\"></div></span>",
		"	<div id=\"grabMyBooks_zonePanelPath\" style=\"margin-bottom:3px;\"></div>",
		"	<div id=\"grabMyBooks_zonePanelShowDefault\"><input id=\"grabMyBooks_zonePanelShowDefaultCheckBox\" type=\"checkbox\">Show default selection<div id=\"grabMyBooks_zonePanelShowDefaultRect\"></div><input id=\"grabMyBooks_zonePanelShowDefaultSelect\" type=\"button\" value=\"Select\"></div>",
		"	<span class=\"grabMyBooks_zonePanelTitle\">Selection<div id=\"grabMyBooks_zonePanelSelectionRect\"></div></span>",
		"	<div id=\"grabMyBooks_zonePanelSelection\" style=\"margin-bottom:10px;\"></div>",
		"	<span class=\"grabMyBooks_zonePanelTitle\">Result rule</span>",
		"	<div id=\"grabMyBooks_zonePanelFullXPath\"></div>",
            grabMyBooks.menu.button("grabMyBooks_zonePanelTest", "Add to book", "ADD TO BOOK"),
            grabMyBooks.menu.button("grabMyBooks_zonePanelAction", "Save rule", "SAVE RULE"),
		"	<div id=\"grabMyBooks_zonePanelQuit\" title=\"Quit zone selection\">X</div>",
		"</div>",
		"<div id=\"grabMyBooks_zonePanelMoveLeft\" style=\"cursor:pointer;\"><img src=\"chrome://grabMyBooks/content/icons/zone/left.png\" title=\"Move panel to top left\"></div>",
		"<div id=\"grabMyBooks_zonePanelMoveRight\" style=\"cursor:pointer;\"><img src=\"chrome://grabMyBooks/content/icons/zone/right.png\" title=\"Move panel to top right\"></div>",
		"<div id=\"grabMyBooks_zonePanelMoveBottomLeft\" style=\"cursor:pointer;\"><img src=\"chrome://grabMyBooks/content/icons/zone/left.png\" title=\"Move panel to bottom left\"></div>",
		"<div id=\"grabMyBooks_zonePanelMoveBottomRight\" style=\"cursor:pointer;\"><img src=\"chrome://grabMyBooks/content/icons/zone/right.png\" title=\"Move panel to bottom right\"></div>"
		);
	var zonePanelNodeContent = zonePanelNodeContentTab.join("\n");

	grabMyBooks.setNodeContentFromString(tabDocument, zonePanelNode, zonePanelNodeContent);

	tabDocument.body.appendChild(zonePanelNode);


	var zonePanelPathNode = tabDocument.getElementById("grabMyBooks_zonePanelPath");

	grabZoneContext.showPath =
		function(zonePanelPathNode, grabZoneContext)
		{
			return function(path)
			{
				grabMyBooks.setNodeContentFromString(grabZoneContext.doc, zonePanelPathNode, grabMyBooks.escapeTagsExtended(path));
			};
		}(zonePanelPathNode, grabZoneContext);

	var zonePanelSelectionNode = tabDocument.getElementById("grabMyBooks_zonePanelSelection");
	grabZoneContext.updateSelectionDisplay =
		function(zonePanelSelectionNode, grabZoneContext)
		{
			return function()
			{
				var resultTab = [];
				var currentNodeInfo;
				var currentEscapedNodePath;
				var currentNode;
				var currentStylableChildNodes;
				for(var i_nodeInfo=0; i_nodeInfo<this.selectedNodeInfos.length; i_nodeInfo++)
				{
					currentNodeInfo = this.selectedNodeInfos[i_nodeInfo];
					currentNode = this.findNode(currentNodeInfo.nodePath);
					currentStylableChildNodes = grabMyBooks.zone.domGetStylableChildNodes(this.doc, currentNode);
					currentEscapedNodePath = grabMyBooks.escapeTagsExtended(currentNodeInfo.nodePath);
					resultTab.push("<div class=\"grabMyBooksSelectedZone\">");
					resultTab.push("<div class=\"grabMyBooksSelectedZone_unSelect\" title=\"Unselect\">X</div>");
					resultTab.push("<img class=\"grabMyBooksSelectedZone_getParent\" title=\"Select parent\" src=\"chrome://grabMyBooks/content/icons/zone/rightUp.png\">");

					resultTab.push(currentEscapedNodePath);

					if(currentStylableChildNodes.length>1)
					{
						resultTab.push("<br>");
						resultTab.push(currentStylableChildNodes.length+" elements");
						resultTab.push("<br>");
						resultTab.push("<div class=\"grabMyBooksSelectedZone_controls\"><span class=\"grabMyBooksSelectedZone_startAdd grabMyBooksSelectedZone_controlImg\"><img src=\"chrome://grabMyBooks/content/icons/zone/up.png\" title=\"Start sooner\"></span><span class=\"grabMyBooksSelectedZone_startRemove grabMyBooksSelectedZone_controlImg\"><img src=\"chrome://grabMyBooks/content/icons/zone/down.png\" title=\"Start later\"></span><span class=\"grabMyBooksSelectedZone_endRemove grabMyBooksSelectedZone_controlImg\"><img src=\"chrome://grabMyBooks/content/icons/zone/up.png\" title=\"Stop sooner\"></span><span class=\"grabMyBooksSelectedZone_endAdd grabMyBooksSelectedZone_controlImg\"><img src=\"chrome://grabMyBooks/content/icons/zone/down.png\" title=\"Stop later\"></span><span class=\"grabMyBooksSelectedZone_restore grabMyBooksSelectedZone_controlImg\"><img src=\"chrome://grabMyBooks/content/icons/zone/upDown.png\" title=\"Restore bounds\"></span></div>");
					}

					resultTab.push("</div>");
				}
				var result = resultTab.join("\n");
				grabMyBooks.setNodeContentFromString(grabZoneContext.doc, zonePanelSelectionNode, result);

				var initSubSelectionButtons = function(grabZoneContext)
				{
					return function(selectedZoneNode, index, size)
					{
						var nodePath = grabZoneContext.selectedNodeInfos[index].nodePath;
						var selectedNodeConfigInfo = grabZoneContext.getSelectedNodeConfigInfo(nodePath);

						var unSelectNode = grabMyBooks.xml.xPathQueryNode(".//*[@class='grabMyBooksSelectedZone_unSelect']", grabZoneContext.doc, selectedZoneNode);
						var unSelectFunction = function(grabZoneContext, nodePath)
						{
							return function(e)
							{
								grabZoneContext.unSelect(nodePath);
								grabZoneContext.restoreLook(nodePath);
							};
						}(grabZoneContext, nodePath);
						unSelectNode.addEventListener("click", unSelectFunction, false);

						var selectParentNode = grabMyBooks.xml.xPathQueryNode(".//*[@class='grabMyBooksSelectedZone_getParent']", grabZoneContext.doc, selectedZoneNode);
						var selectParentFunction = function(grabZoneContext, nodePath)
						{
							return function(e)
							{
								var node = grabZoneContext.findNode(nodePath);
								var nodeLocalName = node.localName;
								if(!grabMyBooks.isEmpty(nodeLocalName) && nodeLocalName.toLowerCase()=="body")
								{
									return;
								}
								if(grabMyBooks.isEmptyObject(node.parentNode))
								{
									return;
								}
								if(grabZoneContext.skipNode(node.parentNode))
								{
									return;
								}
								var parentPath = grabZoneContext.findPathForNode(node.parentNode);
								if(grabMyBooks.isEmpty(parentPath))
								{
									return;
								}
								grabZoneContext.tryAndDetect(node.parentNode);
								grabZoneContext.tryAndSelect(node.parentNode);
							};
						}(grabZoneContext, nodePath);
						selectParentNode.addEventListener("click", selectParentFunction, false);

						if(!selectedNodeConfigInfo.adjustable)
						{
							return;
						}

						var controlsNode = grabMyBooks.xml.xPathQueryNode(".//*[@class='grabMyBooksSelectedZone_controls']", grabZoneContext.doc, selectedZoneNode);

						var startLaterNode = grabMyBooks.xml.xPathQueryNode(".//*[contains(@class,'grabMyBooksSelectedZone_startRemove')]", grabZoneContext.doc, controlsNode);
						var startLaterFunction =
							function(grabZoneContext, selectedNodeConfigInfo)
							{
								return function(e)
								{
									selectedNodeConfigInfo.startLater();
									grabZoneContext.updateConfiguredSelectedNodeLook(selectedNodeConfigInfo.nodePath);
									grabZoneContext.updateFullXPath();
								};
							}(grabZoneContext, selectedNodeConfigInfo);
						startLaterNode.addEventListener("click", startLaterFunction, false);

						var startSoonerNode = grabMyBooks.xml.xPathQueryNode(".//*[contains(@class,'grabMyBooksSelectedZone_startAdd')]", grabZoneContext.doc, controlsNode);
						var startSoonerFunction =
							function(grabZoneContext, selectedNodeConfigInfo)
							{
								return function(e)
								{
									selectedNodeConfigInfo.startSooner();
									grabZoneContext.updateConfiguredSelectedNodeLook(selectedNodeConfigInfo.nodePath);
									grabZoneContext.updateFullXPath();
								};
							}(grabZoneContext, selectedNodeConfigInfo);
						startSoonerNode.addEventListener("click", startSoonerFunction, false);

						var endSoonerNode = grabMyBooks.xml.xPathQueryNode(".//*[contains(@class,'grabMyBooksSelectedZone_endRemove')]", grabZoneContext.doc, controlsNode);
						var endSoonerFunction =
							function(grabZoneContext, selectedNodeConfigInfo)
							{
								return function(e)
								{
									selectedNodeConfigInfo.endSooner();
									grabZoneContext.updateConfiguredSelectedNodeLook(selectedNodeConfigInfo.nodePath);
									grabZoneContext.updateFullXPath();
								};
							}(grabZoneContext, selectedNodeConfigInfo);
						endSoonerNode.addEventListener("click", endSoonerFunction, false);

						var endLaterNode = grabMyBooks.xml.xPathQueryNode(".//*[contains(@class,'grabMyBooksSelectedZone_endAdd')]", grabZoneContext.doc, controlsNode);
						var endLaterFunction =
							function(grabZoneContext, selectedNodeConfigInfo)
							{
								return function(e)
								{
									selectedNodeConfigInfo.endLater();
									grabZoneContext.updateConfiguredSelectedNodeLook(selectedNodeConfigInfo.nodePath);
									grabZoneContext.updateFullXPath();
								};
							}(grabZoneContext, selectedNodeConfigInfo);
						endLaterNode.addEventListener("click", endLaterFunction, false);

						var restoreNode = grabMyBooks.xml.xPathQueryNode(".//*[contains(@class,'grabMyBooksSelectedZone_restore')]", grabZoneContext.doc, controlsNode);
						var restoreFunction =
							function(grabZoneContext, selectedNodeConfigInfo)
							{
								return function(e)
								{
									selectedNodeConfigInfo.restore();
									grabZoneContext.updateConfiguredSelectedNodeLook(selectedNodeConfigInfo.nodePath);
									grabZoneContext.updateFullXPath();
								};
							}(grabZoneContext, selectedNodeConfigInfo);
						restoreNode.addEventListener("click", restoreFunction, false);

					};
				}(grabZoneContext);

				grabMyBooks.xml.xPathQueryFunction(".//*[@class='grabMyBooksSelectedZone']", grabZoneContext.doc, zonePanelSelectionNode, initSubSelectionButtons);

				grabZoneContext.updateFullXPath();
			};
		}(zonePanelSelectionNode, grabZoneContext);

	var zonePanelFullXPathNode = tabDocument.getElementById("grabMyBooks_zonePanelFullXPath");
	grabZoneContext.updateFullXPath = function(grabZoneContext, zonePanelFullXPathNode)
	{
		return function()
		{
			var fullXPath = grabZoneContext.getSelectedFullXPath();
			fullXPath = grabMyBooks.escapeTagsExtended(fullXPath);
			grabMyBooks.setNodeContentFromString(grabZoneContext.doc, zonePanelFullXPathNode, fullXPath);
			this.adjustBottomArrowsPositionFunction();
		};
	}(grabZoneContext, zonePanelFullXPathNode);

	var zonePanelTestNode = tabDocument.getElementById("grabMyBooks_zonePanelTest");
	var testSelectionFunction = function(grabZoneContext)
	{
		return function(e)
		{
			var fullXPath = grabZoneContext.getSelectedFullXPath();
			var url = grabZoneContext.url;

			var addToBookContext = new grabMyBooks.AddToBookContext([url]);
			if(!grabMyBooks.isEmpty(fullXPath))
			{
				var urlXPathInfo = new grabMyBooks.UrlXPathInfo(url, fullXPath);
				addToBookContext.urlXPathInfos.push(urlXPathInfo);
			}
			grabMyBooks.addLink(url, addToBookContext);
		};
	}(grabZoneContext);
	zonePanelTestNode.addEventListener("click", testSelectionFunction, false);

	var zonePanelActionNode = tabDocument.getElementById("grabMyBooks_zonePanelAction");
	var validateSelectionFunction = function(grabZoneContext)
	{
		return function(e)
		{
			if(grabZoneContext.toDoWithXPathFunction==null)
			{
				return;
			}
			var fullXPath = grabZoneContext.getSelectedFullXPath();
			if(grabMyBooks.isEmpty(fullXPath))
			{
				return;
			}
			var toDoWithXPathContext = new grabMyBooks.zone.ToDoWithXPathContext(fullXPath, grabZoneContext.url);
			grabZoneContext.toDoWithXPathFunction(toDoWithXPathContext);
		};
	}(grabZoneContext);
	zonePanelActionNode.addEventListener("click", validateSelectionFunction, false);

	var zonePanelMoveLeftNode = tabDocument.getElementById("grabMyBooks_zonePanelMoveLeft");
	var zonePanelMoveRightNode = tabDocument.getElementById("grabMyBooks_zonePanelMoveRight");
	var zonePanelMoveBottomLeftNode = tabDocument.getElementById("grabMyBooks_zonePanelMoveBottomLeft");
	var zonePanelMoveBottomRightNode = tabDocument.getElementById("grabMyBooks_zonePanelMoveBottomRight");

	var zonePanelContainer = tabDocument.getElementById("grabMyBooks_zonePanelContainer");

	var adjustZonePanelNodeBottomPositionFunction =
		function(zonePanelContainer, zonePanelNode)
		{
			return function()
			{
				if(!grabMyBooks.isEmpty(zonePanelNode.style.top))
				{
					return;
				}
				var getElementAbsolutePositionResult =
					grabMyBooks.getElementAbsolutePosition(zonePanelContainer);
				zonePanelNode.style.bottom = (2+getElementAbsolutePositionResult.height)+"px";
			};
		}(zonePanelContainer, zonePanelNode);

	grabZoneContext.adjustBottomArrowsPositionFunction =
		function(zonePanelContainer, zonePanelMoveBottomLeftNode, zonePanelMoveBottomRightNode, adjustZonePanelNodeBottomPositionFunction)
		{
			return function()
			{
				var getElementAbsolutePositionResult =
					grabMyBooks.getElementAbsolutePosition(zonePanelContainer);
				zonePanelMoveBottomLeftNode.style.top = (getElementAbsolutePositionResult.height-42-4)+"px";
				zonePanelMoveBottomRightNode.style.top = (getElementAbsolutePositionResult.height-42-4)+"px";
				adjustZonePanelNodeBottomPositionFunction();
			};
		}(zonePanelContainer, zonePanelMoveBottomLeftNode, zonePanelMoveBottomRightNode, adjustZonePanelNodeBottomPositionFunction);

	var moveZoneLeftFunction =
		function(zonePanelNode)
		{
			return function(e)
			{
				zonePanelNode.style.left = "40px";
				zonePanelNode.style.right = "";
				zonePanelNode.style.top = "2px";
				zonePanelNode.style.bottom = "";
			};
		}(zonePanelNode);
	var moveZoneRightFunction =
		function(zonePanelNode)
		{
			return function(e)
			{
				zonePanelNode.style.right = "40px";
				zonePanelNode.style.left = "";
				zonePanelNode.style.top = "2px";
				zonePanelNode.style.bottom = "";
			};
		}(zonePanelNode);

	var moveZoneBottomLeftFunction =
		function(zonePanelNode, adjustZonePanelNodeBottomPositionFunction)
		{
			return function(e)
			{
				zonePanelNode.style.left = "40px";
				zonePanelNode.style.right = "";
				zonePanelNode.style.top = "";
				adjustZonePanelNodeBottomPositionFunction();
			};
		}(zonePanelNode, adjustZonePanelNodeBottomPositionFunction);
	var moveZoneBottomRightFunction =
		function(zonePanelNode, adjustZonePanelNodeBottomPositionFunction)
		{
			return function(e)
			{
				var getElementAbsolutePositionResult =
					grabMyBooks.getElementAbsolutePosition(zonePanelContainer);
				zonePanelNode.style.right = "40px";
				zonePanelNode.style.left = "";
				zonePanelNode.style.top = "";
				adjustZonePanelNodeBottomPositionFunction();
			};
		}(zonePanelNode, adjustZonePanelNodeBottomPositionFunction);

	zonePanelMoveLeftNode.addEventListener("click", moveZoneLeftFunction, false);
	zonePanelMoveRightNode.addEventListener("click", moveZoneRightFunction, false);
	zonePanelMoveBottomLeftNode.addEventListener("click", moveZoneBottomLeftFunction, false);
	zonePanelMoveBottomRightNode.addEventListener("click", moveZoneBottomRightFunction, false);

	moveZoneRightFunction(null);

	var zonePanelQuitNode = tabDocument.getElementById("grabMyBooks_zonePanelQuit");
	var zonePanelQuitFunction =
		function(tabBrowser)
		{
			return function(e)
			{
				tabBrowser.reload();
			};
		}(tabBrowser);
	zonePanelQuitNode.addEventListener("click", zonePanelQuitFunction, false);


	var initDefaultDetectedNodeFunction =
		function(grabZoneContext)
		{
			return function()
			{
				var url = grabZoneContext.url;
				var findDefaultDetectedNodeResult = grabMyBooks.findArticleNode(grabZoneContext.doc, url);
				var defaultDetectedNode = findDefaultDetectedNodeResult.node;

				grabZoneContext.showOrHideDefaultDetectedNodeFunction =
				function(grabZoneContext, defaultDetectedNode)
				{
					return function(show)
					{
						if(show)
						{
							if(grabMyBooks.isEmptyObject(defaultDetectedNode))
							{
								return;
							}
							if(!grabMyBooks.isEmptyObject(defaultDetectedNode.scrollIntoView))
							{
								defaultDetectedNode.scrollIntoView(true);
							}
							var getElementAbsolutePositionResult =
							grabMyBooks.getElementAbsolutePosition(defaultDetectedNode);
							grabZoneContext.defaultDetectionZoneRectangle.position(getElementAbsolutePositionResult.x, getElementAbsolutePositionResult.y, getElementAbsolutePositionResult.width, getElementAbsolutePositionResult.height);
						}
						else
						{
							grabZoneContext.defaultDetectionZoneRectangle.position(-50,-50,10,10);
						}
					};
				}(grabZoneContext, defaultDetectedNode);

				grabZoneContext.showOrHideDefaultDetectedNodeFunction(false);
			};
		}(grabZoneContext);
	initDefaultDetectedNodeFunction();

	var zonePanelShowDefaultCheckBoxNode = tabDocument.getElementById("grabMyBooks_zonePanelShowDefaultCheckBox");
	var zonePanelShowDefaultCheckBoxClickFunction =
		function(grabZoneContext, zonePanelShowDefaultCheckBoxNode)
		{
			return function(e)
			{
				var zonePanelShowDefaultCheckBoxChecked = zonePanelShowDefaultCheckBoxNode.checked;
				grabZoneContext.showOrHideDefaultDetectedNodeFunction(zonePanelShowDefaultCheckBoxChecked);
			};
		}(grabZoneContext, zonePanelShowDefaultCheckBoxNode);
	zonePanelShowDefaultCheckBoxNode.addEventListener("click", zonePanelShowDefaultCheckBoxClickFunction, false);

	var zonePanelShowDefaultSelect = tabDocument.getElementById("grabMyBooks_zonePanelShowDefaultSelect");
	var zonePanelShowDefaultSelectClickFunction =
		function(grabZoneContext)
		{
			return function(e)
			{
				var url = grabZoneContext.url;
				var findDefaultDetectedNodeResult = grabMyBooks.findArticleNode(grabZoneContext.doc, url);
				var defaultDetectedNode = findDefaultDetectedNodeResult.node;
				if(grabMyBooks.isEmptyObject(defaultDetectedNode))
				{
					return;
				}
				if(!grabMyBooks.isEmptyObject(defaultDetectedNode.scrollIntoView))
				{
					defaultDetectedNode.scrollIntoView(true);
				}
				grabZoneContext.tryAndDetect(defaultDetectedNode);
				grabZoneContext.tryAndSelect(defaultDetectedNode);
			};
		}(grabZoneContext);
	zonePanelShowDefaultSelect.addEventListener("click", zonePanelShowDefaultSelectClickFunction, false);


	grabZoneContext.skipNodeForZonePanel = function(node)
	{
		var zonePanelNode = this.doc.getElementById("grabMyBooks_zonePanel");
		var childOfZonePanelNode = grabMyBooks.isNodeChildOf(node, zonePanelNode);
		return childOfZonePanelNode;
	};
	grabZoneContext.skipNodeForDetection = function(node)
	{
		if(!grabMyBooks.isEmpty(node.className))
		{
			var result = (node.className.indexOf("grabMyBooks_zoneRect_Side")!=-1);
			result = (result || (node.className.indexOf("grabMyBooks_zoneRect_marker")!=-1));
			result = (result || (node.className.indexOf("grabMyBooks_zonePanel_wrapSpan")!=-1));
			return result;
		}
		return false;
	};
	grabZoneContext.skipNode = function(node)
	{
		return this.skipNodeForZonePanel(node) || this.skipNodeForDetection(node);
	};

	var mouseOverFunction =
		function(grabZoneContext)
		{
			return function(e)
			{
				e.stopPropagation();
				var target = e.target;
				if(grabZoneContext.skipNodeForZonePanel(target))
				{
					grabZoneContext.detectedNodeInfo = null;
					grabZoneContext.unSetDetectionNode();
					return;
				};
				if(grabZoneContext.skipNodeForDetection(target))
				{
					return;
				};
				grabZoneContext.removeHref(target);
				grabZoneContext.tryAndDetect(target);
			};
		}(grabZoneContext);

	var mouseOutFunction =
		function(grabZoneContext)
		{
			return function(e)
			{
				e.stopPropagation();
				var target = e.target;
				if(grabZoneContext.skipNode(target))
				{
					return;
				};
				if(grabZoneContext.detectedNodeInfo!=null)
				{
					var detectedNode = grabZoneContext.findNode(grabZoneContext.detectedNodeInfo.nodePath);
					if(detectedNode==target)
					{
						var relatedTarget = e.relatedTarget;
						if(relatedTarget!=null && grabMyBooks.isNodeChildOf(relatedTarget, detectedNode))
						{
							return;
						}
						grabZoneContext.restoreLook(grabZoneContext.detectedNodeInfo.nodePath);
						grabZoneContext.detectedNodeInfo = null;
						grabZoneContext.unSetDetectionNode();
						grabZoneContext.showPath("");
					}
				}
			};
		}(grabZoneContext);

	var mouseClickFunction =
		function(grabZoneContext)
		{
			return function(e)
			{
				e.stopPropagation();
				var target = e.target;
				if(grabZoneContext.skipNode(target))
				{
					return;
				};
				grabZoneContext.tryAndSelect(target);
			};
		}(grabZoneContext);

	tabDocument.body.addEventListener("mouseover", mouseOverFunction, false);
	tabDocument.body.addEventListener("mouseout", mouseOutFunction, false);
	tabDocument.body.addEventListener("click", mouseClickFunction, false);

	grabZoneContext.adjustBottomArrowsPositionFunction();
};

grabMyBooks.zone.skipNode = function(node)
{
	if(grabMyBooks.isEmptyObject(node))
	{
		return true;
	}
	var nodeId = node.id;
	if(!grabMyBooks.isEmpty(nodeId) && "grabMyBooks_zonePanel"==nodeId)
	{
		return true;
	}
	var nodeClass = node.className;
	if(!grabMyBooks.isEmpty(nodeClass) && nodeClass.indexOf("grabMyBooks_zoneRect_Side")!=-1)
	{
		return true;
	}
	if(!grabMyBooks.isEmpty(nodeClass) && nodeClass.indexOf("grabMyBooks_zoneRect_marker")!=-1)
	{
		return true;
	}
	return false;
};

grabMyBooks.zone.domGetStylableChildNodes = function(doc, node)
{
	var xPathResult = null;
	try
	{
		xPathResult = doc.evaluate("./node()", node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	}
	catch(e)
	{
		return [];
	}
	var resultLength = 	xPathResult.snapshotLength;
	var childNodes = [];
	var currentChildNode;
	for(var i_childNode=0; i_childNode<resultLength; i_childNode++)
	{
		currentChildNode = xPathResult.snapshotItem(i_childNode);
		
		if(currentChildNode.nodeType==3)
		{
			var nodeValue = currentChildNode.nodeValue;
			if(grabMyBooks.isEmpty(nodeValue) || grabMyBooks.isEmpty(nodeValue.trim()))
			{
				continue;
			}
			var wrappingSpan = doc.createElement("span");
			wrappingSpan.className = "grabMyBooks_zonePanel_wrapSpan";
			wrappingSpan.style.display="inline";
			node.replaceChild(wrappingSpan, currentChildNode);
			wrappingSpan.appendChild(currentChildNode);
			currentChildNode = wrappingSpan;
		}
		
		if(grabMyBooks.isEmptyObject(currentChildNode.style))
		{
			continue;
		}
		
		if(!grabMyBooks.isNodeValid(currentChildNode))
		{
			continue;
		}
		if(!grabMyBooks.isEmpty(currentChildNode.style.display) && currentChildNode.style.display.toLowerCase().trim()=="none")
		{
			continue;
		}
		if(!grabMyBooks.isEmpty(currentChildNode.style.visibility) && currentChildNode.style.visibility.toLowerCase().trim()=="hidden")
		{
			continue;
		}
		if(!grabMyBooks.isEmpty(currentChildNode.localName) && currentChildNode.localName.toLowerCase().trim()=="br")
		{
			continue;
		}
		if(!grabMyBooks.isEmpty(currentChildNode.type) && currentChildNode.type.toLowerCase().trim()=="hidden")
		{
			continue;
		}
		childNodes.push(currentChildNode);
	}
	return childNodes;
};

grabMyBooks.newsPapers = new Object();
grabMyBooks.newsPapers.tab = null;
grabMyBooks.newsPapers.tabBrowser = null;
grabMyBooks.newsPapers.show = function(onTabLoad) 
{
	try
	{
		if(grabMyBooks.newsPapers.tabBrowser == null)
		{
			grabMyBooks.newsPapers.tab = gBrowser.addTab();
			grabMyBooks.newsPapers.tabBrowser = gBrowser.getBrowserForTab(grabMyBooks.newsPapers.tab);
			
			var onTabLoadFunction =
				function(onTabLoad)
				{
					return function(e)
					{
						grabMyBooks.newsPapers.fillNewsPapers();
						grabMyBooks.newsPapers.tab.label="GrabMyBooks - NewsPapers";
						gBrowser.setIcon(grabMyBooks.newsPapers.tab,"chrome://grabMyBooks/content/icons/bookNewsPaper.png");
						  
						if(!grabMyBooks.isEmptyObject(onTabLoad))
						{
							onTabLoad();
						}
					};
				}(onTabLoad);
			
			grabMyBooks.newsPapers.tabBrowser.addEventListener("load", onTabLoadFunction, true);
		}
		else
		{
			if(!grabMyBooks.isEmptyObject(onTabLoad))
			{
				onTabLoad();
			}
		}
		grabMyBooks.ext.setSelectedTab(grabMyBooks.newsPapers.tab);
	}
	catch(e) 
    {  
    	grabMyBooks.ext.alert(e+'::'+e.lineNumber);  
    }
};

grabMyBooks.newsPapers.counter = 0;
grabMyBooks.newsPapers.newsPapers = [];
grabMyBooks.newsPapers.loaded = false;
grabMyBooks.newsPapers.ordered = false;
grabMyBooks.newsPapers.FeedEntryInfo = function(parentFeedUrl, url, name, description, date)
{
	this.url = url;
	this.parentFeedUrl = parentFeedUrl;
	this.name = name;
	this.description = description;
	this.date = date;
	this.isNew = true;
	this.identify = function(url)
	{
		return (this.url == url);
	};
};

grabMyBooks.newsPapers.FeedEntryInfoFilter = function(name, displayLabel, filterFunction)
{
	this.name = name;
	
	this.displayLabel = grabMyBooks.escapeTagsExtended(grabMyBooks.truncate(displayLabel, 20, "..."));
	
	this.filterFunction = filterFunction;
	
	this.identify = function(name)
	{
		return (this.name == name);
	};
};

grabMyBooks.newsPapers.NewsPaperIssue = function(linkBook)
{
	this.issueNumber = null;
	this.linkBook = linkBook;
	this.date =  grabMyBooks.newsPapers.getAsAtomDate(null);
	this.identify = function(id)
	{
		var result = (this.issueNumber == id);
		return result;
	};
};

grabMyBooks.newsPapers.NewsPaper = function()
{
	this.id = null;
	this.name = null;
	this.feeds = [];
	this.orderBy = "date";
	this.feedEntryInfos = [];
	this.loadingCount = 0;
	this.stopLoadingFunction = null;
	this.issueCounter = 0;
	this.issues = [];
	this.errorMessages = [];
	this.isLoading = function()
	{
		return (this.loadingCount>0);
	};
	
	this.identify = function(id)
	{
		return (this.id == id);
	};
	
	this.getNextNewsPaperIssueId = function()
	{
		var result = this.issueCounter++;
		grabMyBooks.newsPapers.saveNewsPaper(this);
		return result;
	};
	
	this.setFeeds = function(feeds)
	{
		var feedsAdded = false;
		
		var getRemovedFeedsFilterFunction =
			function(newFeeds)
			{
				return function(feed)
				{
					var result = (grabMyBooks.tabGet(newFeeds, feed.url) == null);
					return result;
				};
			}(feeds);
		var removedFeeds = grabMyBooks.tabFilter(this.feeds, getRemovedFeedsFilterFunction);
		
		var getAddedFeedsFilterFunction =
			function(oldFeeds)
			{
				return function(feed)
				{
					var result = (grabMyBooks.tabGet(oldFeeds, feed.url) == null);
					return result;
				};
			}(this.feeds);
		var addedFeeds = grabMyBooks.tabFilter(feeds, getAddedFeedsFilterFunction);
		
		
		if(addedFeeds.length > 0)
		{
			feedsAdded = true;
		}
		
		var handleRemovedFeedFunction =
			function(newsPaper)
			{
				return function(removedFeed, index, count)
				{
					var removeFeedEntryInfosTestFunction =
						function(removedFeed)
						{
							return function(feedEntryInfo)
							{
								return (feedEntryInfo.parentFeedUrl == removedFeed.url);
							};
						}(removedFeed);
					grabMyBooks.tabRemoveAll(newsPaper.feedEntryInfos, removeFeedEntryInfosTestFunction);
					var removeFeedEntriesSql = "DELETE FROM ENTRIES WHERE F_URL=:feedUrl";
					var removeFeedEntriesSqlToDoContext = new grabMyBooks.sql.SqlToDoContext(removeFeedEntriesSql);
					removeFeedEntriesSqlToDoContext.prepareFunction =
						function(feedUrl)
						{
							return function(statement)
							{
								statement.params.feedUrl = feedUrl;
							};
						}(removedFeed.url);
					newsPaper.getSqlQueue().sqlDo(removeFeedEntriesSqlToDoContext);
				};
			}(this);
		grabMyBooks.tabDo(removedFeeds, handleRemovedFeedFunction);
		
		this.feeds = feeds;
		
		return feedsAdded;
	};
	
	this.refreshFeedEntries = function(onUpdateFunction, onEndFunction, useCacheIfPossible, cacheRequestCounter)
	{
		//Google reader stoped.
		useCacheIfPossible = false;
	
		this.loadingCount = this.feeds.length;
		this.errorMessages = [];
	
		if(cacheRequestCounter==null)
		{
			cacheRequestCounter = grabMyBooks.newsPapers.cacheRequestCounterSmall;
		}
		
		var oneRefreshDoneFunction =
			function(newsPaper, onUpdateFunction, onEndFunction, useCacheIfPossible)
			{
				return function()
				{
					newsPaper.loadingCount-=1;
					if((newsPaper.loadingCount == 0) && useCacheIfPossible && !grabMyBooks.isEmptyObject(newsPaper.toBeSaved) && newsPaper.toBeSaved)
					{
						grabMyBooks.newsPapers.saveNewsPaper(newsPaper);
						newsPaper.toBeSaved = false;
					}
					if((newsPaper.loadingCount == 0) && newsPaper.errorMessages.length>0)
					{
						var notifyErrorsSmallInfoStateFunction =
							function(smallInfoState)
							{
								smallInfoState.iconType = "WARN";
							};
						grabMyBooks.SmallInfo.showSmallInfoPanel(newsPaper.errorMessages.join("<br>"), notifyErrorsSmallInfoStateFunction);
						newsPaper.errorMessages = [];
					}
					if(onEndFunction!=null && newsPaper.loadingCount == 0)
					{
						if(useCacheIfPossible)
						{
							newsPaper.refreshFeedEntries(onUpdateFunction, onEndFunction, false, null);
							return;
						}
						newsPaper.stopLoadingFunction = null;
						onEndFunction();
					}
				};
			}(this, onUpdateFunction, onEndFunction, useCacheIfPossible);
		
		var endManager = new Object();
		endManager.endHolders = [];
		endManager.newsPaper = this;
		endManager.getEndHolderForFeed =
			function(useCacheIfPossible)
			{
				return function(feedUrl)
				{
					var endHolder = grabMyBooks.tabGet(this.endHolders, feedUrl);
					if(endHolder==null)
					{
						var newsPaperFeedItem =
							grabMyBooks.tabGet(this.newsPaper.feeds, feedUrl);
						endHolder = new Object();
						endHolder.url = feedUrl;
						endHolder.title = newsPaperFeedItem.title;
						endHolder.lastCacheSuccessDate = newsPaperFeedItem.lastCacheSuccessDate;
						endHolder.lastDeleteDate = newsPaperFeedItem.lastDeleteDate;
						endHolder.lastCacheDate = null;
						endHolder.dateSeen = function(feedEntryDate)
						{
							var stopRefresh = false;
							if(this.lastCacheDate == null || (this.lastCacheDate.localeCompare(feedEntryDate)<0))
							{
								this.lastCacheDate = feedEntryDate;
							}
							
							if(this.usingCache && !grabMyBooks.isEmpty(this.lastCacheSuccessDate) && !grabMyBooks.isEmpty(feedEntryDate) && (feedEntryDate.localeCompare(this.lastCacheSuccessDate)<0))
							{
								stopRefresh = true;
							}
							
							return stopRefresh;
						};
						endHolder.isEntryDateValid = function(feedEntryDate)
						{
							if(!grabMyBooks.isEmpty(this.lastCacheSuccessDate) && !grabMyBooks.isEmpty(feedEntryDate) && (feedEntryDate.localeCompare(this.lastCacheSuccessDate)<0))
							{
								return false;
							}
							if(!grabMyBooks.isEmpty(this.lastDeleteDate) && !grabMyBooks.isEmpty(feedEntryDate) && (feedEntryDate.localeCompare(this.lastDeleteDate)<0))
							{
								return false;
							}
							return true;
						}
						endHolder.identify = function(url)
						{
							return (this.url == url);
						};
						endHolder.end = false;
						
						endHolder.notifyCacheError = function()
						{
							endHolder.cacheError = true;
							this.doNotUseCacheFunction();
						};
						endHolder.onFeedPartRefreshedFunction = null;
						endHolder.usingCache = useCacheIfPossible;
						endHolder.cacheError = false;
						endHolder.naturalEnd = false;
						this.endHolders.push(endHolder);
					}
					return endHolder;
				};
			}(useCacheIfPossible);
		endManager.stopAll =
			function()
			{
				var stopEndHolderFunction =
					function(endHolder, index, count)
					{
						endHolder.end = true;
					};
				grabMyBooks.tabDo(this.endHolders, stopEndHolderFunction);
			};
		
		this.stopLoadingFunction =
			function(endManager)
			{
				return function()
				{
					endManager.stopAll();
				};
			}(endManager);
		
		var handleRefreshedFeedFunction =
			function(newsPaper, oneRefreshDoneFunction, endManager, onEndFunction, onUpdateFunction, useCacheIfPossible)
			{
				return function(feedItem)
				{
					var feedItemUrl = grabMyBooks.newsPapers.removeCacheUrlIfNeeded(feedItem.url);
					
					var endHolder = endManager.getEndHolderForFeed(feedItemUrl);
					
					var feedEntries = feedItem.feed.items;
					var feedEntryCount = feedItem.feed.items.length;
					var currentNsFeedEntry;
					var currentEntryTitle;
					var currentEntryUrl;
					var currentToAddFeedEntryInfos;
					var currentPublishedDate;
					var currentFeedContent;
					var paramTab = [];
					var currentParams;
					for(var i_feed_entry=0; i_feed_entry<feedEntryCount;i_feed_entry++)
					{
						currentNsFeedEntry = feedEntries.queryElementAt(i_feed_entry, Components.interfaces.nsIFeedEntry);
						if(!currentNsFeedEntry)
						{
							continue;
						}
						if(grabMyBooks.isEmptyObject(currentNsFeedEntry.title))
						{
							continue;
						}
						currentEntryTitle = currentNsFeedEntry.title.text;
						currentEntryTitle = grabMyBooks.newsPapers.removeHrefFromTitle(currentEntryTitle);
						currentEntryTitle = grabMyBooks.unEscapeTagsExtended(currentEntryTitle);
						if(grabMyBooks.isEmpty(currentEntryTitle))
						{
							currentEntryTitle = "???";
						}
						
						if(currentNsFeedEntry.link == null)
						{
							currentNsFeedEntry.link = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(feedItemUrl, null, null);
						}
						currentPublishedDate = currentNsFeedEntry.published;
						currentFeedContent = null;
						if (currentNsFeedEntry.summary != null) 
						{
							currentFeedContent = currentNsFeedEntry.summary.text;
						}
						else if(currentNsFeedEntry.content != null)
						{
							currentFeedContent = currentNsFeedEntry.content.text;
						}
						
						var nowDate = grabMyBooks.newsPapers.getAsAtomDate(null);
						try
						{
							currentPublishedDate = grabMyBooks.newsPapers.validateAtomDate(currentPublishedDate);
						}
						catch(e)
						{
							currentPublishedDate = nowDate;
						};
						
						var oldDate = endHolder.dateSeen(currentPublishedDate);
						var smallCacheCounter = (cacheRequestCounter == grabMyBooks.newsPapers.cacheRequestCounterSmall);
						if(smallCacheCounter && oldDate)
						{
							endHolder.end = true;
							endHolder.naturalEnd = true;
							break;
						}
						var bigCacheCounter = (cacheRequestCounter == grabMyBooks.newsPapers.cacheRequestCounterBig);
						if(!bigCacheCounter && !endHolder.isEntryDateValid(currentPublishedDate))
						{
							continue;
						}
						currentEntryUrl = currentNsFeedEntry.link.resolve("");
						if(grabMyBooks.tabGet(newsPaper.feedEntryInfos, currentEntryUrl)!=null)
						{
							continue;
						}
						
						currentToAddFeedEntryInfos = new grabMyBooks.newsPapers.FeedEntryInfo(feedItemUrl, currentEntryUrl, currentEntryTitle, currentFeedContent, currentPublishedDate);
						newsPaper.feedEntryInfos.push(currentToAddFeedEntryInfos);
						
						currentParams = new Object();
						paramTab.push(currentParams);
						currentParams.feedUrl = feedItemUrl;
						currentParams.entryUrl = currentEntryUrl;
						currentParams.name = currentEntryTitle;
						currentParams.date = currentPublishedDate;
						
					}
					
					var testEndfunction =
						function(newsPaper, endHolder, oneRefreshDoneFunction, onUpdateFunction)
						{
							return function()
							{
								if(endHolder.end)
								{
									if(endHolder.usingCache && !endHolder.cacheError && endHolder.naturalEnd && !grabMyBooks.isEmpty(endHolder.lastCacheDate))
									{
										var newsPaperFeedItem = grabMyBooks.tabGet(newsPaper.feeds, endHolder.url);
										if(newsPaperFeedItem.lastCacheSuccessDate == null || newsPaperFeedItem.lastCacheSuccessDate.localeCompare(endHolder.lastCacheDate)<0)
										{
											newsPaperFeedItem.lastCacheSuccessDate = endHolder.lastCacheDate;
											newsPaper.toBeSaved = true;
										}
									}
									oneRefreshDoneFunction();
								}
								else if(onUpdateFunction != null)
								{
									onUpdateFunction();
									if(endHolder.onFeedPartRefreshedFunction != null)
									{
										endHolder.onFeedPartRefreshedFunction();
									}
								}
							};
						}(newsPaper, endHolder, oneRefreshDoneFunction, onUpdateFunction);
					
					
					
					if(paramTab.length==0)
					{
						testEndfunction();
						return;
					}
					var entriesSqlToDoContext = new grabMyBooks.sql.SqlToDoContext("INSERT INTO ENTRIES(F_URL,E_URL,E_NAME,E_CONTENT,E_DATE) VALUES (:f_url,:e_url,:e_name,'',:e_date)");
						
					var entriesPrepareFunction =
						function(paramTab)
						{
							return function(statement)
							{
								var paramsArray = statement.newBindingParamsArray();
								var paramLineFunction =
									function(paramsArray)
									{
										return function(params, index, count)
										{
											var bindingParams = paramsArray.newBindingParams();
											bindingParams.bindByName("f_url", params.feedUrl);
											bindingParams.bindByName("e_url", params.entryUrl);
											bindingParams.bindByName("e_name", params.name);
											bindingParams.bindByName("e_date", params.date);
											paramsArray.addParams(bindingParams);
										};
									}(paramsArray);
								grabMyBooks.tabDo(paramTab, paramLineFunction);
								statement.bindParameters(paramsArray); 
							};
						}(paramTab);
					var entriesOnEndFunction =
						function(testEndfunction)
						{
							return function()
							{
								testEndfunction();
							};
						}(testEndfunction);
					entriesSqlToDoContext.prepareFunction = entriesPrepareFunction;
					entriesSqlToDoContext.onEndFunction = entriesOnEndFunction;
					newsPaper.getSqlQueue().sqlDo(entriesSqlToDoContext);
				};
			}(this, oneRefreshDoneFunction, endManager, onEndFunction, onUpdateFunction, useCacheIfPossible);
		var feedRefreshFunction =
			function(newsPaper, handleRefreshedFeedFunction, oneRefreshDoneFunction, endManager, useCacheIfPossible, cacheRequestCounter)
			{
				return function(feedItem, index, count)
				{
					var feedUrl = feedItem.url;
					
					var endHolder = endManager.getEndHolderForFeed(feedUrl);
					
					var useCacheHolder = new Object();
					useCacheHolder.feedUrl = feedUrl;
					useCacheHolder.counter = cacheRequestCounter;
					useCacheHolder.oneRefreshDoneFunction = oneRefreshDoneFunction;
					useCacheHolder.handleRefreshedFeedFunction = handleRefreshedFeedFunction;
					var getCacheEntriesTextEndFunction =
						function(newsPaper, useCacheHolder, endHolder)
						{
							return function(result)
							{
								useCacheHolder.counter-=1;
								if(result==null)
								{
									endHolder.notifyCacheError();
									newsPaper.errorMessages.push("Could not use cache for feed '"+endHolder.title+"'");
									return;
								}
								var onSuccessFunction =
										function(useCacheHolder, result)
										{
											return function(feedItem)
											{
												var onFeedPartRefreshedFunction = null;
												if(result.continuation != null && useCacheHolder.counter>0)
												{
													onFeedPartRefreshedFunction =
														function(useCacheHolder, result)
														{
															return function()
															{
																grabMyBooks.newsPapers.getCacheEntriesText(useCacheHolder.feedUrl, result.continuation,  useCacheHolder.getCacheEntriesTextEndFunction);
															}
														}(useCacheHolder, result);
												}
												else
												{
													endHolder.end = true;
													endHolder.naturalEnd = true;
												}
												endHolder.onFeedPartRefreshedFunction = onFeedPartRefreshedFunction;
												useCacheHolder.handleRefreshedFeedFunction(feedItem);
											};
										}(useCacheHolder, result);
										
								var onErrorFunction =
									function(newsPaper)
									{
										return function(errorMessage)
										{
											newsPaper.errorMessages.push("Error handling cache feeds: "+errorMessage);
										};
									}(newsPaper);
								grabMyBooks.feeds.handleFeedSource(useCacheHolder.feedUrl, result.content, onSuccessFunction, onErrorFunction);
							};
						}(newsPaper, useCacheHolder, endHolder);
					useCacheHolder.getCacheEntriesTextEndFunction = getCacheEntriesTextEndFunction;
					var useCacheFunction =
						function(useCacheHolder, endHolder)
						{
							return function()
							{
								endHolder.usingCache = true;
								grabMyBooks.newsPapers.getCacheEntriesText(useCacheHolder.feedUrl, null, useCacheHolder.getCacheEntriesTextEndFunction);
							};
						}(useCacheHolder, endHolder);
					
					
					var feedRefreshErrorFunctionHolder = new Object();
					feedRefreshErrorFunctionHolder.url = feedUrl;
					var feedRefreshErrorFunction =
					function(newsPaper, oneRefreshDoneFunction, handleRefreshedFeedFunction, feedRefreshErrorFunctionHolder)
					{
						return function(errorMessage)
						{
							var url = feedRefreshErrorFunctionHolder.url;
							newsPaper.errorMessages.push("Couldn't refresh feed with url: "+url);
							oneRefreshDoneFunction();
						};
					}(newsPaper, oneRefreshDoneFunction, handleRefreshedFeedFunction, feedRefreshErrorFunctionHolder);
					feedRefreshErrorFunctionHolder.feedRefreshErrorFunction = feedRefreshErrorFunction;
					var doNotUseCacheFunction =
						function(endHolder, feedUrl, handleRefreshedFeedFunction, feedRefreshErrorFunction)
						{
							return function()
							{
								endHolder.end = true;
								endHolder.usingCache = false;
								grabMyBooks.feeds.addFeedBase(feedUrl, handleRefreshedFeedFunction, feedRefreshErrorFunction);
							};
						}(endHolder, feedUrl, handleRefreshedFeedFunction, feedRefreshErrorFunction);
					endHolder.doNotUseCacheFunction = doNotUseCacheFunction;
					
					
					if(feedItem.useCache && useCacheIfPossible)
					{
						useCacheFunction();
					}
					else
					{
						doNotUseCacheFunction();
					};
				}
			}(this, handleRefreshedFeedFunction, oneRefreshDoneFunction, endManager, useCacheIfPossible, cacheRequestCounter);
		grabMyBooks.tabDo(this.feeds, feedRefreshFunction);
	};
	this.sqlQueue = null;
	this.getSqlQueue = function()
	{
		if(this.sqlQueue != null)
		{
			return this.sqlQueue;
		}
		this.sqlQueue = grabMyBooks.newsPapers.getNewsPaperSqlQueue(this);
		return this.sqlQueue;
	};
};

grabMyBooks.newsPapers.getCacheEntriesText = function(url, continuation, onEndFunction)
{
	url = grabMyBooks.newsPapers.addCacheUrl(url);
	if(continuation != null)
	{
		url = url+"&c="+continuation;
	}
	var getLinkContentViaHttpChannelContext = new grabMyBooks.GetLinkContentViaHttpChannelContext(url);
	var getLinkContentViaHttpChannelContextOnEndFunction =
		function(getLinkContentViaHttpChannelContext, onEndFunction)
		{
			return function()
			{
				var getIndexOf =
					function(getLinkContentViaHttpChannelContext)
					{
						return function(text)
						{
							var result = getLinkContentViaHttpChannelContext.data.indexOf(text);
							return result;
						};
					}(getLinkContentViaHttpChannelContext);
				var sub =
					function(getLinkContentViaHttpChannelContext)
					{
						return function(start, end)
						{
							var result = getLinkContentViaHttpChannelContext.data.substring(start, end);
							return result;
						};
					}(getLinkContentViaHttpChannelContext);
				if(getIndexOf("<?xml version=\"1.0\"?><feed")!=0)
				{
					onEndFunction(null);
					return;
				}
				var continuationStart = "<gr:continuation>";
				var continuationEnd = "</gr:continuation>";
				var continuationStartIndex = getIndexOf(continuationStart);
				var continuationEndIndex = getIndexOf(continuationEnd);
				var continuationValue = null;
				if(continuationStartIndex!=-1 && continuationEndIndex != -1)
				{
					continuationValue = sub(continuationStartIndex+continuationStart.length, continuationEndIndex);
				}
				var result = new Object();
				result.content = getLinkContentViaHttpChannelContext.data;
				result.continuation = continuationValue;
				onEndFunction(result);
			};
		}(getLinkContentViaHttpChannelContext, onEndFunction);
	getLinkContentViaHttpChannelContext.onEndFunction = getLinkContentViaHttpChannelContextOnEndFunction;
	grabMyBooks.ext.getLinkContentViaHttpChannel(getLinkContentViaHttpChannelContext);
};

grabMyBooks.newsPapers.fillNewsPapers = function()
{
	var content=[];
		content.push(
		"<html>",
		"	<head>",
		"		<style type=\"text/css\">",
		grabMyBooks.popin.css(),
		"			body {overflow:none;width:100%;height:100%;font-family:Helvetica,Arial,sans-serif;font-size:0.9em;background-image:url(chrome://grabMyBooks/content/icons/menu/bg.png);}",
		"			#content {border-radius:15px;background-color:white;text-align:left;width:80%;height:90%;overflow:auto;margin-top:10px;margin-left:auto;margin-right:auto;padding:5px;border-style:solid;border-width:1px;border-color:black;}",
		"			.errorMessage {color:red;}",
		"			#left {float:left;width:30%;}",
		"			#right {float:left;width:65%;height:100%;}",
		"			#newsPaperForm {margin-top:10px;width:100%;display:none;}",
		"			#entryList {border-spacing:2px 0px;position:relative;margin-top:2px;width:100%;overflow:auto;height:70%;display:none;border-top:solid 1px gray;border-bottom:solid 1px gray;}",
		"			#entryListTop {width:100%;display:none;}",
		"			#entryListBottom {margin-top:2px;width:100%;height:20%;display:none;white-space:nowrap;overflow:auto;}",
		"			#entryListTopButtons {text-align:left;}",
		"			#filters {display:inline-block;vertical-align:top;font-size:smaller;}",
		"			#filterSearch {display:block;border:solid 1px black;font-size:11px;}",
		"			.filterClose {display:inline-block;cursor:pointer;border:solid 1px black;border-radius:5px;width:10px;text-align:center;}",
		"			#filterImg {vertical-align:top;}",
		"			.filter {margin-top:1px;}",
		"			#filterGroup {white-space:nowrap;}",
		"			#newsPaperFormErrorMessage {margin-bottom:10px;}",
		"			#newsPaperForm input,  #newsPaperForm select{border:solid 1px black;}",
		"			#newsPaperForm > input {margin-bottom:10px;width:80%;}",
		"			#newsPaperNameInput {display:block;}",
		"			#addFeedControls {margin-top:5px;margin-bottom:10px;}",
		"			#addFeedControls > * {vertical-align:bottom;}",
		"			#addFeedButton {cursor:pointer;margin-left:10px;}",
		"			#newFeedControl, #selectFeedControl {display:inline-block;}",
		"			#feedOr {margin-left:10px;margin-right:10px;}",
		"			#feedList {height:200px;width:80%;border:solid 1px black;border-radius:10px;overflow:auto;}",
		"			#newFeedControl {width:40%;}",
		"			#selectFeedControl {width:25%;}",
		"			#newFeedInput {width:100%;}",
		"			#feedSelect {width:100%;}",
		"			#entriesOrderBySelect {margin-bottom:10px;}",
		"			.bookButton{cursor:pointer;}",
		"			#newsPaperFormValidationButtons {margin-top:30px;}",
		"			.newsPaperFeed {margin-left:10px;margin-top:3px;margin-bottom:3px;}",
		"			.newsPaperFeed img {vertical-align:middle;}",
		"			.removeFeed, .feedUp, .feedDown {cursor:pointer;font-size:smaller;}",
		"			.removeFeed {margin-left:15px;}",
		"			.feedUp {margin-left:10px;}",
		"			.feedIcon {width:17px;heigth:17px;vertical-align:bottom;}",
		"			.feedColorPicker {font-size:smaller;margin-left:10px;cursor:pointer;}",
		"			.feedColorSquare {display:inline-block;border:solid 1px black;border-radius:5px;width:10px;height:10px;vertical-align:middle;margin-left:3px;}",
		"			.feedColorSquare:hover {border-color:blue;}",
		"			.feedTitle, .feedIcon {cursor:pointer;}",
		"			.feedInfosTable td {vertical-align:top;}",
		"			#addNewsPaper {display:block;margin-left:10px;}",
		"			.newsPaper {margin-left:10px;margin-top:5px;}",
		"			.newsPaperName {cursor:pointer;}",
		"			.newsPaperImg {vertical-align:middle;border:solid 1px gray;}",
		"			.newsPaperStop {display:none;}",
		"			.newsPaperEdit {margin-left:10px;}",
		"			.newsPaperEdit, .newsPaperRefresh, .newsPaperRefreshLong, .newsPaperStop, .newsPaperDelete, .newsPaperUp, .newsPaperDown, .clearDateCache, .clearDateDelete {cursor:pointer;font-size:smaller;vertical-align:middle;}",
		"			.newsPaperDelete {margin-left:5px;}",
		"			.newsPaperEntryActions {display:inline-block;position:relative;}",
		"			.newsPaperEntryActionsPlus {cursor:pointer;}",
		"			.newsPaperEntryActionsPlusContent {display:none;position:absolute;left:0px;width:130px;z-index:2;padding-top:10px;padding-bottom:10px;top:-10px;background:white;border:solid 1px black;border-radius:10px;}",
		"			.newsPaperEntryActionsPlus:hover + .newsPaperEntryActionsPlusContent {display:inline;}",
		"			.newsPaperEntryActionsPlusContent:hover {display:inline;}",
		"			.feedEntryMoreActions {display:inline-block;position:relative;}",
		"			.feedEntryMoreActionsPlus {cursor:pointer;font-size:14px;position:relative;top:-4px;}",
		"			.feedEntryMoreActionsContent {display:none;position:absolute;right:0px;width:165px;z-index:2;padding-top:10px;padding-bottom:10px;top:-13px;background:white;border:solid 1px black;border-radius:10px;}",
		"			.feedEntryMoreActionsPlus:hover + .feedEntryMoreActionsContent {display:inline;}",
		"			.feedEntryMoreActionsContent:hover {display:inline;}",
		"			.feedEntryMoreActionsContent img {margin-left:3px; cursor:pointer;}",
		"			.clearDates {display:inline-block;position:relative;}",
		"			.clearDatesContent {display:none;position:absolute;width:80px;left:0px;top:-11px;padding-top:10px;padding-bottom:10px;z-index:2;border:solid 1px black;border-radius:10px;background:white;}",
		"			.clearDatesContent:hover {display:inline;}",
		"			.clearDatesPlus {cursor:pointer;margin-left:10px;}",
		"			.clearDatesPlus:hover + .clearDatesContent {display:inline;}",
		"			.clearDateCache {margin-left:20px;}",
		"			#entriesOrderBlock, #cacheBlock  {display:inline-block;margin-top:30px;}",
		"			#cacheBlock {margin-left:50px;}",
		"			#cacheCheckbox {vertical-align:bottom;}",
		"			.dayDate {text-align:center;}",
		"			.dayDateDay {cursor:pointer;display:inline-block;width:25px;height:25px;background-image:url('chrome://grabMyBooks/content/icons/newsPapers/calendar.png');background-position:center;vertical-align:text-bottom;margin-right:2px;}",
		"			.dayDateMonth, .dayDateYear {cursor:pointer;}",
		"			.dayDateDay:hover, .dayDateMonth:hover, .dayDateYear:hover {color:blue;}",
		"			.dayDateDayContent {margin-top:8px;text-align:center;font-size:14px;}",
		"			.feedEntry {}",
		"			.feedEntryFeedColorSquareContainer {}",
		"			.feedEntryFeedColorSquare {white-space:nowrap;overflow:hidden;font-size:0.6em;width:60px;text-align:center;}",
		"			.feedEntry .feedCheckBox {cursor:pointer;}",
		"			.feedEntry td{vertical-align:top;padding-bottom:8px;}",
		"			.feedEntryAContainer {width:100%;}",
		"			.feedEntry a {text-decoration:none;color:black;}",
		"			.feedEntry a:hover {color:blue;}",
		"			.feedEntry a:visited {color:gray;}",
		"			.feedEntry a:visited:hover {color:blue;}",
		"			.feedEntryTime {cursor:pointer;font-size:0.6em;margin-left:3px;}",
		"			.feedEntryNew {cursor:pointer;margin-left:3px;}",
		"			.feedEntryNotNew {cursor:pointer;margin-left:3px;}",
		"			.feedEntryActions {white-space:nowrap;}",
		"			.feedEntryAddToBook, .feedEntryEditRule {cursor:pointer;}",
		"			.feedEntry:hover .feedEntryAddToBook, .feedEntry:hover .feedEntryEditRule {display:inline;}",
		"			#newsPaperTopAddSelectionToBookButton, #addToIssueButton {margin-right:10px;}",
		"			#newsPaperMoreImg {cursor:pointer;margin-left:15px;}",
		"			#newsPaperMoreContent img {cursor:pointer;display:block;}",
		"			.feedCheckBox {vertical-align:middle;}",
		"			.issue {margin:2px;display:inline-block;position:relative;width:122px;height:98px;background-size:122px 98px;background-repeat:no-repeat;background-image:url('chrome://grabMyBooks/content/icons/newsPapers/newsPaperBig.png');background-position:center;cursor:pointer;}",
		"			.selectedIssue {margin:0px;border:solid 2px blue;border-radius:5px;}",
		"			.issueTitle {white-space:normal;text-align:center;position:absolute;left:7px;top:2px;width:106px;height:28px;font-size:12px;overflow:hidden;}",
		"			.issueTitleContent:hover {color:blue;}",
		"			.issue .issueAction {font-size:14px;position:absolute;display:none;background:white;padding:1px;border:solid 1px black;}",
		"			.issue:hover .issueAction {display:block;}",
		"			.issue .issueDelete {top:2px;right:-5px;border-radius:10px;min-width:15px;text-align:center;}",
		"			.issue .issueViewContent {top:58px;left:0px;}",
		"			.issue .issueTest {top:58px;left:86px;}",
		"			.issue .issueGrab {top:80px;left:0px;}",
		"			.issue .issueShare {top:80px;left:40px;}",
		"			.issue .issueUp {top:36px;right:22px;}",
		"			.issue .issueDown {top:36px;right:0px;}",
		"			.issueCount {position:absolute;top:80px;right:-5px;background:white;padding:1px;border:solid 1px black;border-radius:10px;min-width:15px;text-align:center;}",
		"			.issue .issueAction:hover {color:blue;border-color:blue;}",
		"			.issueArticleAction {cursor:pointer;font-size:smaller;}",
		"			.issueArticleDelete {margin-left:10px;}",
		"			.issueEntry {}",
		"			.issueEntry + .issueEntry {margin-top:4px;}",
		"			.issueEntry a {text-decoration:none;color:black;}",
		"			.issueEntry a:hover {color:gray;}",
		"			.issueEntry img {vertical-align:middle;}",
		"			#issueArticlesTab {width:100%;vertical-align:top;}",
		"			#issueArticlesTab td {padding-bottom:8px;}",
		"			.issueArticleOrigin {width:60px;text-align:center;white-space:nowrap;font-size:0.6em;overflow:hidden;}",
		"			.issueArticleLink {width:100%;}",
		"			.issueArticleDate {text-align:left;font-size:0.6em;}",
		"			.issueContentTitle {font-size:150%;text-align:center;margin-bottom:10px;}",
		"			#issueActions{width:100%;text-align:center;}",
		"           #popin #popinContent #popinButtonOk.issueViewPopinOk{left:360px;}",
		"			#issueOrderByDateDesc, #issueOrderByDateAsc, #issueOrderByFeedDesc, #issueOrderByFeedAsc, #issueAddToBook, #issueShare {cursor:pointer;margin-left:15px;margin-right:15px;margin-bottom:10px;}",
		"			#entriesPages {position:absolute;right:3px;top:1px;background:white;}",
		"			#entriesPagePrevious, #entriesPageNext {cursor:pointer;}",
		"			#entriesPageNum {cursor:pointer;}",
		"			#entriesPageNum:hover {color:blue;}",
		"			#shareForm {display:hidden;}",
		            grabMyBooks.menu.css(),
		"		</style>",
		"	</head>",
		"	<body>",
		"		<div id=\"popinBack\"></div>",
		"		<div id=\"popin\"><div id=\"popinContent\"></div></div>",
		"		<div id=\"content\">",
		"			<div id=\"left\">",
		                grabMyBooks.menu.button("addNewsPaper", "Add newsPaper", "ADD NEWSPAPER"),
		"				<div id=\"newsPaperList\"></div>",
		"			</div>",
		"			<div id=\"right\">",
		"				<div id=\"entryListTop\"></div>",
		"				<table id=\"entryList\"></table>",
		"				<div id=\"entryListBottom\"></div>",
		"				<div id=\"newsPaperForm\">",
		"					<div id=\"newsPaperFormErrorMessage\" class=\"errorMessage\"></div>",
		"					Name",
		"					<input id=\"newsPaperNameInput\" type=\"text\">",
		"					<br>",
		"					Feed List",
		"					<div id=\"feedList\">",
		"					</div>",
		"					<div id=\"addFeedControls\">",
		"						<div id=\"newFeedControl\">",
		"							New feed",
		"							<input id=\"newFeedInput\" type=\"text\">",
		"						</div>",
		"						<span id=\"feedOr\">or</span>",
		"						<div id=\"selectFeedControl\">",
		"							Select feed",
		"							<select id=\"feedSelect\"></select>",
		"						</div>",
		                        grabMyBooks.menu.button("addFeedButton", "Add the feed to the feed list", "ADD"),
		"					</div>",
		"					<div id=\"entriesOrderBlock\">",
		"						Order entries by",
		"						<select id=\"entriesOrderBySelect\"><option value=\"date\">date</option><option value=\"feed\">feed</option></select>",
		"					</div>",
		"					<div id=\"cacheBlock\" style=\"display:none;\">",
		"						<input id=\"cacheCheckbox\" type=\"checkbox\">",
		"						Use google reader cache",
		"					</div>",
		"					<div id=\"newsPaperFormValidationButtons\">",
		                         grabMyBooks.menu.button("newsPaperFormOk", "Ok", "OK"),
		                         grabMyBooks.menu.button("newsPaperFormCancel", "Cancel", "CANCEL"),
		"					</div>",
		"				</div>",
		"			</div>",
		"		</div>",
		"	</body>",
		"</html>"
		);
		
		var doc = grabMyBooks.newsPapers.tabBrowser.contentDocument;
		grabMyBooks.setNodeContentFromString(doc, doc.body, content.join("\n"));
		
		grabMyBooks.newsPapers.popin = new grabMyBooks.popin.Popin(grabMyBooks.newsPapers.tabBrowser);
		grabMyBooks.newsPapers.popin.showIssue = function(showFeedEntriesContext, newsPaperIssue)
		{
			var newsPaper = showFeedEntriesContext.newsPaper;
			var fillIssuesFunction = showFeedEntriesContext.fillIssues;
			var popinContent = [];
			popinContent.push("<div id=\"popinErrorMessage\" style=\"color:red;\">");
			popinContent.push("</div>");
			popinContent.push("<div class=\"issueContentTitle\">");
			popinContent.push(grabMyBooks.escapeTagsExtended(newsPaperIssue.linkBook.title));
			popinContent.push("</div>");
			popinContent.push("<div id=\"issueActions\">");
			popinContent.push("<img id=\"issueOrderByDateAsc\" title=\"Order by date, oldest to newest\" src=\"chrome://grabMyBooks/content/icons/newsPapers/orderDateAsc.png\"><img id=\"issueOrderByDateDesc\" title=\"Order by date, newest to oldest\" src=\"chrome://grabMyBooks/content/icons/newsPapers/orderDateDesc.png\"><img id=\"issueOrderByFeedAsc\" title=\"Group by feed, order by date, oldest to newest\" src=\"chrome://grabMyBooks/content/icons/newsPapers/orderFeedAsc.png\"><img id=\"issueOrderByFeedDesc\" title=\"Group by feed, order by date, newest to oldest\" src=\"chrome://grabMyBooks/content/icons/newsPapers/orderFeedDesc.png\"><img id=\"issueAddToBook\"  title=\"Add whole issue to book\" src=\"chrome://grabMyBooks/content/icons/newsPapers/addToBook.png\">");
			popinContent.push("</div>");
			popinContent.push("<div id=\"issueArticles\" style=\"height:400px;overflow-y:auto;\">");
			popinContent.push("<table id=\"issueArticlesTab\">");
			popinContent.push("</table>");
			popinContent.push("</div>");
			popinContent.push(grabMyBooks.menu.button("popinButtonOk", "Ok", "OK", "popinButton issueViewPopinOk"));
			var popinJoinedContent = popinContent.join("\n");
			grabMyBooks.setNodeContentFromString(this.tabBrowser.contentDocument, this.content, popinJoinedContent);
			
			var showIssueContext = new Object();
			
			var showIssueFunction =
				function(showFeedEntriesContext, newsPaperIssue)
				{
					return function()
					{
						grabMyBooks.newsPapers.popin.showIssue(showFeedEntriesContext, newsPaperIssue);
					};
				}(showFeedEntriesContext, newsPaperIssue);
			
			var issueAddToBookNode = this.tabBrowser.contentDocument.getElementById("issueAddToBook");
			var addIssueToBookFunction =
				function(newsPaperIssue, showFeedEntriesContext, showIssueFunction)
				{
					return function(e)
					{
						var issueArticles = [];
						addIssueArticleUrlFunction =
							function(issueArticles)
							{
								return function(linkBookArticle, index, count)
								{
									issueArticles.push(linkBookArticle.url);
								};
							}(issueArticles);
						grabMyBooks.tabDo(newsPaperIssue.linkBook.linkBookArticles, addIssueArticleUrlFunction);
						
						var addToBookEndFunction = showIssueFunction;
						
						var prepareAddToBookContextForNewsPaperFeedsFunction =
							function(addToBookEndFunction)
							{
								return function(addToBookContext)
								{
									addToBookContext.endFunction2 = addToBookEndFunction;
								};
							}(addToBookEndFunction);
						grabMyBooks.newsPapers.popin.hide();
						grabMyBooks.addLinks(issueArticles, prepareAddToBookContextForNewsPaperFeedsFunction, grabMyBooks.newsPapers.popin.showAddToBookProgress);
					};
				}(newsPaperIssue, showFeedEntriesContext, showIssueFunction);
			issueAddToBookNode.addEventListener("click", addIssueToBookFunction, false);
			

			var issueOrderByDateDescNode = this.tabBrowser.contentDocument.getElementById("issueOrderByDateDesc");
			var issueOrderByDateAscNode = this.tabBrowser.contentDocument.getElementById("issueOrderByDateAsc");
			var issueOrderByFeedDescNode = this.tabBrowser.contentDocument.getElementById("issueOrderByFeedDesc");
			var issueOrderByFeedAscNode = this.tabBrowser.contentDocument.getElementById("issueOrderByFeedAsc");
			
			var addOrderByListenerFunction =
				function(newsPaper, newsPaperIssue, showIssueContext)
				{
					return function(node, desc, forceBy)
					{
						var issueArticleSortFunction =
							grabMyBooks.newsPapers.getNewsPaperSortFunction(newsPaper, desc, forceBy)
						var clickFunction =
							function(newsPaperIssue, issueArticleSortFunction, showIssueContext)
							{
								return function(e)
								{
									newsPaperIssue.linkBook.linkBookArticles.sort(issueArticleSortFunction);
									grabMyBooks.newsPapers.saveNewsPaperIssueArticlesOrder(newsPaper, newsPaperIssue, showIssueContext.fillIssueArticlesFunction);
								};
							}(newsPaperIssue, issueArticleSortFunction, showIssueContext);
						node.addEventListener("click", clickFunction, false);
					};
				}(newsPaper, newsPaperIssue, showIssueContext);
			addOrderByListenerFunction(issueOrderByDateDescNode, true, "date");
			addOrderByListenerFunction(issueOrderByDateAscNode, false, "date");
			addOrderByListenerFunction(issueOrderByFeedDescNode, true, "feed");
			addOrderByListenerFunction(issueOrderByFeedAscNode, false, "feed");
			
			var issueArticlesNode = this.tabBrowser.contentDocument.getElementById("issueArticlesTab");
			
			showIssueContext.fillIssueArticlesFunction =
				function(issueArticlesNode, newsPaper, newsPaperIssue, popin, showIssueContext, showFeedEntriesContext)
				{
					return function()
					{
						var issueArticlesContent = [];
						var fillIssueArticleFunction =
							function(issueArticlesContent, showFeedEntriesContext)
							{
								return function(issueLinkBookArticle, index, count)
								{
									issueArticlesContent.push(
										"<tr class=\"issueEntry\">",
										"	<td>"
									);
									
									var feedItem = showFeedEntriesContext.getFeedForEntry(issueLinkBookArticle.origin);
									if(feedItem != null)
									{
										var feedName = grabMyBooks.escapeTagsExtended(feedItem.title);
										var shortFeedName = grabMyBooks.truncate(feedName, 10, "");
										issueArticlesContent.push("<div class=\"issueArticleOrigin\" style=\"background:"+feedItem.color+";\">"+shortFeedName+"</div>");
									}
									
									issueArticlesContent.push(	
										"	</td>",
										"	<td>",
										"		<img src=\"chrome://grabMyBooks/content/icons/newsPapers/page.png\">",
										"	</td>",
										"	<td class=\"issueArticleLink\">",
										"		<a href=\""+issueLinkBookArticle.url+"\" title=\""+issueLinkBookArticle.url+"\" target=\"_blank\">"+issueLinkBookArticle.title+"</a>",
										"	</td>",
										"	<td class=\"issueArticleDate\">",
										"		"+issueLinkBookArticle.date.substring(0,10)+" "+issueLinkBookArticle.date.substring(11,19),
										"	</td>",
										"	<td>",
										"		<img title=\"Move up\" class=\"issueArticleUp issueArticleAction\" src=\"chrome://grabMyBooks/content/icons/newsPapers/up.png\">",
										"	</td>",
										"	<td>",
										"		<img title=\"Move down\" class=\"issueArticleDown issueArticleAction\" src=\"chrome://grabMyBooks/content/icons/newsPapers/down.png\">",
										"	</td>",
										"	<td>",
										"		<img title=\"Add to book\" class=\"issueArticleAddToBook issueArticleAction\" src=\"chrome://grabMyBooks/content/icons/newsPapers/addToBook.png\">",
										"	</td>",
										"	<td>",
										"		<img title=\"Edit rule\" class=\"issueArticleEditRule issueArticleAction\" src=\"chrome://grabMyBooks/content/icons/newsPapers/zone.png\">",
										"	</td>",
										"	<td>",
										"		<img title=\"Delete\" class=\"issueArticleDelete issueArticleAction\" src=\"chrome://grabMyBooks/content/icons/newsPapers/delete.png\">",
										"	</td>",
										"</tr>"
									);
								};
							}(issueArticlesContent, showFeedEntriesContext);
						grabMyBooks.tabDo(newsPaperIssue.linkBook.linkBookArticles, fillIssueArticleFunction);
						grabMyBooks.setNodeContentFromString(popin.tabBrowser.contentDocument, issueArticlesNode, issueArticlesContent.join("\n"));
						
						var addDeleteIssueArticleListenerFunction =
							function(newsPaper, newsPaperIssue, showIssueContext, showFeedEntriesContext)
							{
								return function(node, index, count)
								{
									var linkBookArticle =
										newsPaperIssue.linkBook.linkBookArticles[index];
									var deleteIssueArticleFunction =
										function(newsPaper, newsPaperIssue, linkBookArticle, showIssueContext, showFeedEntriesContext)
										{
											return function()
											{
												if(newsPaperIssue.linkBook.linkBookArticles.length<=1)
												{
													grabMyBooks.newsPapers.deleteNewsPaperIssue(newsPaper, newsPaperIssue, showIssueContext.closePopinAndRefresh);
													return;
												}
												var deleteNewsPaperIssueArticleEndFunction =
													function(showIssueContext, showFeedEntriesContext)
													{
														return function()
														{
															showIssueContext.fillIssueArticlesFunction();
															showFeedEntriesContext.fillIssues();
														};
													}(showIssueContext, showFeedEntriesContext);
												grabMyBooks.newsPapers.deleteNewsPaperIssueArticle(newsPaper, newsPaperIssue, linkBookArticle.url, deleteNewsPaperIssueArticleEndFunction);
											};
										}(newsPaper, newsPaperIssue, linkBookArticle, showIssueContext, showFeedEntriesContext);
									grabMyBooks.attachNonEventFunction("click", node, deleteIssueArticleFunction);
								};
							}(newsPaper, newsPaperIssue, showIssueContext, showFeedEntriesContext);
						grabMyBooks.xml.xPathQueryFunction(".//*[contains(@class,'issueArticleDelete')]", popin.tabBrowser.contentDocument, issueArticlesNode, addDeleteIssueArticleListenerFunction);
						
						var addAddToBookIssueArticleListenerFunction =
							function(newsPaper, newsPaperIssue, showIssueContext)
							{
								return function(node, index, count)
								{
									var linkBookArticle =
										newsPaperIssue.linkBook.linkBookArticles[index];
									var addToBookIssueArticleFunction =
										function(newsPaper, newsPaperIssue, linkBookArticle, showIssueContext)
										{
											return function()
											{
												var addToBookEndFunction =
													function(showFeedEntriesContext, newsPaperIssue)
													{
														return function()
														{
															grabMyBooks.newsPapers.popin.showIssue(showFeedEntriesContext, newsPaperIssue);
														};
													}(showFeedEntriesContext, newsPaperIssue);
												
												var prepareAddToBookContextForNewsPaperFeedsFunction =
													function(addToBookEndFunction)
													{
														return function(addToBookContext)
														{
															addToBookContext.endFunction2 = addToBookEndFunction;
														};
													}(addToBookEndFunction);
												grabMyBooks.newsPapers.popin.hide();
												grabMyBooks.addLinks([linkBookArticle.url], prepareAddToBookContextForNewsPaperFeedsFunction, grabMyBooks.newsPapers.popin.showAddToBookProgress);
											};
										}(newsPaper, newsPaperIssue, linkBookArticle, showIssueContext);
									grabMyBooks.attachNonEventFunction("click", node, addToBookIssueArticleFunction);
								};
							}(newsPaper, newsPaperIssue, showIssueContext);
						grabMyBooks.xml.xPathQueryFunction(".//*[contains(@class,'issueArticleAddToBook')]", popin.tabBrowser.contentDocument, issueArticlesNode, addAddToBookIssueArticleListenerFunction);
						
						var addEditRuleForIssueArticleListenerFunction =
							function(newsPaper, newsPaperIssue, showIssueContext)
							{
								return function(node, index, count)
								{
									var linkBookArticle =
										newsPaperIssue.linkBook.linkBookArticles[index];
									var editRuleForIssueArticleFunction =
										function(linkBookArticle)
										{
											return function()
											{
												var pageZoneGrabContext =
													new grabMyBooks.zone.PageZoneGrabContext(linkBookArticle.url);
												grabMyBooks.zone.openPageForZoneGrab(pageZoneGrabContext);
											};
										}(linkBookArticle);
									grabMyBooks.attachNonEventFunction("click", node, editRuleForIssueArticleFunction);
								};
							}(newsPaper, newsPaperIssue, showIssueContext);
						grabMyBooks.xml.xPathQueryFunction(".//*[contains(@class,'issueArticleEditRule')]", popin.tabBrowser.contentDocument, issueArticlesNode, addEditRuleForIssueArticleListenerFunction);
						
						
						var addUpIssueArticleListenerFunction =
							function(newsPaper, newsPaperIssue, showIssueContext)
							{
								return function(node, index, count)
								{
									var linkBookArticle =
										newsPaperIssue.linkBook.linkBookArticles[index];
									var upIssueArticleFunction =
										function(newsPaper, newsPaperIssue, linkBookArticle, showIssueContext)
										{
											return function()
											{
												if(grabMyBooks.tabUp(newsPaperIssue.linkBook.linkBookArticles, linkBookArticle.url))
												{
													grabMyBooks.newsPapers.saveNewsPaperIssueArticlesOrder(newsPaper, newsPaperIssue, showIssueContext.fillIssueArticlesFunction);
												}
											};
										}(newsPaper, newsPaperIssue, linkBookArticle, showIssueContext);
									grabMyBooks.attachNonEventFunction("click", node, upIssueArticleFunction);
								};
							}(newsPaper, newsPaperIssue, showIssueContext);
						grabMyBooks.xml.xPathQueryFunction(".//*[contains(@class,'issueArticleUp')]", popin.tabBrowser.contentDocument, issueArticlesNode, addUpIssueArticleListenerFunction);
						
						var addDownIssueArticleListenerFunction =
							function(newsPaper, newsPaperIssue, showIssueContext)
							{
								return function(node, index, count)
								{
									var linkBookArticle =
										newsPaperIssue.linkBook.linkBookArticles[index];
									var downIssueArticleFunction =
										function(newsPaper, newsPaperIssue, linkBookArticle, showIssueContext)
										{
											return function()
											{
												if(grabMyBooks.tabDown(newsPaperIssue.linkBook.linkBookArticles, linkBookArticle.url))
												{
													grabMyBooks.newsPapers.saveNewsPaperIssueArticlesOrder(newsPaper, newsPaperIssue, showIssueContext.fillIssueArticlesFunction);
												}
											};
										}(newsPaper, newsPaperIssue, linkBookArticle, showIssueContext);
									grabMyBooks.attachNonEventFunction("click", node, downIssueArticleFunction);
								};
							}(newsPaper, newsPaperIssue, showIssueContext);
						grabMyBooks.xml.xPathQueryFunction(".//*[contains(@class,'issueArticleDown')]", popin.tabBrowser.contentDocument, issueArticlesNode, addDownIssueArticleListenerFunction);
						
					};
				}(issueArticlesNode, newsPaper, newsPaperIssue, this, showIssueContext, showFeedEntriesContext);
			showIssueContext.fillIssueArticlesFunction();
			
			showIssueContext.closePopinAndRefresh =
				function(popin, fillIssuesFunction)
				{
					return function()
					{
						popin.hide();
						fillIssuesFunction();
					};
				}(this, fillIssuesFunction);
			
			this.setSize(800, 500);
			
			var okButton = this.tabBrowser.contentDocument.getElementById("popinButtonOk");
			var popinErrorMessage = this.tabBrowser.contentDocument.getElementById("popinErrorMessage");
			
			
			var okButtonFunction =
				function(popin)
				{
					return function(e)
					{
						popin.hide();
					};
				}(this);
			
			okButton.addEventListener("click",okButtonFunction,false);
			
			this.show();
		};
		
		
		
		var clearDisplayManager = new Object();
		clearDisplayManager.toBeCleared = [];
		clearDisplayManager.onClearListeners = [];
		clearDisplayManager.clear =
			function()
			{
				var clearFunction =
					function(node, index, count)
					{
						node.style.display = "none";
					};
				grabMyBooks.tabDo(this.toBeCleared, clearFunction);
				
				var clearListenerFunction =
					function(clearListener, index, count)
					{
						clearListener.onClear();
					};
				grabMyBooks.tabDo(clearDisplayManager.onClearListeners, clearListenerFunction);
			};
		
		var newsPaperHolder = new Object();
		newsPaperHolder.newsPaperToEdit = null;
		newsPaperHolder.feeds = [];
		newsPaperHolder.selectableFeeds = [];
		newsPaperHolder.clearDisplayManager = clearDisplayManager;
		
		
		var addNewsPaperButton = doc.getElementById("addNewsPaper");
		
		var addFeedButton = doc.getElementById("addFeedButton");
		
		var newsPaperNameInput = doc.getElementById("newsPaperNameInput");
		
		var newsPaperFormOkButton = doc.getElementById("newsPaperFormOk");
		var newsPaperFormCancelButton = doc.getElementById("newsPaperFormCancel");
		
		var newsPaperForm = doc.getElementById("newsPaperForm");
		
		clearDisplayManager.toBeCleared.push(newsPaperForm);
		
		var newsPaperFormErrorMessage = doc.getElementById("newsPaperFormErrorMessage");
		
		var showNewsPaperFormErrorMessage = 
			function(newsPaperFormErrorMessage, doc)
			{
				return function(errorTab)
				{
					var errorText = errorTab.join("<br>");
					grabMyBooks.setNodeContentFromString(doc, newsPaperFormErrorMessage, errorText);
				};
			}(newsPaperFormErrorMessage, doc);
		
		
		var newFeedInput = doc.getElementById("newFeedInput");
		var feedSelect = doc.getElementById("feedSelect");
		
		var entriesOrderBySelect = doc.getElementById("entriesOrderBySelect");
		
		var cacheCheckbox = doc.getElementById("cacheCheckbox");
		
		var feedList = doc.getElementById("feedList");
		
		var entryList = doc.getElementById("entryList");
		var entryListTop = doc.getElementById("entryListTop");
		var entryListBottom = doc.getElementById("entryListBottom");
		clearDisplayManager.toBeCleared.push(entryList);
		clearDisplayManager.toBeCleared.push(entryListTop);
		clearDisplayManager.toBeCleared.push(entryListBottom);
		
		var entryListOnScrollFunction =
			function(entryList, doc)
			{
				return function(e)
				{
					var pageNode = doc.getElementById("entriesPages");
					if(pageNode != null)
					{
						pageNode.style.top = (1+entryList.scrollTop)+"px";
					}
				};
			}(entryList, doc);
		entryList.addEventListener("scroll", entryListOnScrollFunction, false);
		
		var getRegistredFeedsFunction =
			function()
			{
				grabMyBooks.feeds.loadFeeds(false);
				var result = grabMyBooks.feeds.feedItems;	
				return result;
			};
		
		var showFeedEntriesContext = new Object();
		showFeedEntriesContext.entryList = entryList;
		showFeedEntriesContext.entryListTop = entryListTop;
		showFeedEntriesContext.entryListBottom = entryListBottom;
		showFeedEntriesContext.feedEntryInfosToUse = null;
		showFeedEntriesContext.initialFeedEntryInfosToUse = null;
		showFeedEntriesContext.maxEntriesPerPage = 200;
		showFeedEntriesContext.pageIndex = 0;
		showFeedEntriesContext.pageCount = null;
		showFeedEntriesContext.selectedFeedEntryInfos = [];
		showFeedEntriesContext.selectedNewsPaperIssue = null;
		showFeedEntriesContext.filters = [];
		showFeedEntriesContext.newsPaperHolder = newsPaperHolder;
		showFeedEntriesContext.selectIssue = function(newsPaperIssue)
		{
			if(this.selectedNewsPaperIssue == newsPaperIssue)
			{
				this.selectedNewsPaperIssue = null;
				return;
			}
			this.selectedNewsPaperIssue = newsPaperIssue;
		};
		showFeedEntriesContext.onClear = function()
		{
			this.feedEntryInfosToUse = null;
			this.initialFeedEntryInfosToUse = null;
			this.selectedFeedEntryInfos = [];
			this.selectedNewsPaperIssue = null;
			this.filters = [];
			this.pageIndex = 0;
			this.pageCount = null;
		};
		showFeedEntriesContext.timer = grabMyBooks.ext.createTimer();
		showFeedEntriesContext.entryListUp = function()
		{	
			grabMyBooks.scrollToTop(this.entryList, this.timer);
		};
		showFeedEntriesContext.applyFilters = function()
		{
			var resultHolder = new Object();
			resultHolder.result = this.initialFeedEntryInfosToUse;
			var filterFeedEntriesFunction =
				function(resultHolder)
				{
					return function(feedEntryInfoFilter, index, count)
					{
						resultHolder.result =
							grabMyBooks.tabFilter(resultHolder.result, feedEntryInfoFilter.filterFunction);
					};
				}(resultHolder);
			grabMyBooks.tabDo(this.filters, filterFeedEntriesFunction);
			return resultHolder.result;					
		};
		showFeedEntriesContext.changePage = function(pageIndex)
		{
			if(pageIndex<0)
			{
				return;
			}
			if(this.pageCount==null)
			{
				return;
			}
			if(pageIndex>=this.pageCount)
			{
				return;
			}
			this.pageIndex = pageIndex;
			showFeedEntriesContext.fillFeedEntriesFunction();
			showFeedEntriesContext.entryListUp();
		};
		showFeedEntriesContext.getLastNotNewPositionInfo = function()
		{
			var isNotNewFunction =
				function(feedEntryInfo)
				{
					return !feedEntryInfo.isNew;
				};
			var feedEntryInfosToSearch = this.applyFilters();
			var lastNotNewIndex = grabMyBooks.tabIndex2(feedEntryInfosToSearch, isNotNewFunction);
			if(lastNotNewIndex == null)
			{
				return null;
			}
			var lastNotNewPageIndex = parseInt(lastNotNewIndex/this.maxEntriesPerPage, 10);
			var lastNotNewIndexOnPage = lastNotNewIndex - (this.maxEntriesPerPage * lastNotNewPageIndex);
			var result = new Object();
			result.pageIndex = lastNotNewPageIndex;
			result.indexOnPage = lastNotNewIndexOnPage;
			return result;
		};
		showFeedEntriesContext.doc = doc;
		showFeedEntriesContext.getFeedForEntry =
			function(feedUrl)
			{
				var feed = grabMyBooks.tabGet(this.newsPaper.feeds, feedUrl);
				return feed;
			};
		showFeedEntriesContext.lastMarkedDate = null;
		showFeedEntriesContext.months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septembre", "October", "November", "December"];
		showFeedEntriesContext.days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		showFeedEntriesContext.getDateInfo = function(day, month, year)
		{
			var dayInt = parseInt(day, 10);
			var monthInt = parseInt(month, 10);
			var yearInt = parseInt(year, 10);
			var date = new Date();
			date.setFullYear(yearInt);
			date.setMonth(monthInt-1);
			date.setDate(dayInt);
			date.setHours(0,0,0,0);
			var dayNum = date.getDay();
			var result = new Object();
			result.day = showFeedEntriesContext.days[dayNum];
			result.dayInt = dayInt;
			result.month = showFeedEntriesContext.months[monthInt-1];
			if(dayInt==1)
			{
				result.th = "st";
			}
			else if(dayInt==2)
			{
				result.th = "nd";
			}
			else
			{
				result.th = "th";
			}
			return result;
		};
		showFeedEntriesContext.clearDisplayManager = clearDisplayManager;
		
		clearDisplayManager.onClearListeners.push(showFeedEntriesContext);
		
		showFeedEntriesContext.fillIssues =
			function(showFeedEntriesContext)
			{
				return function()
				{
					var contentTab = [];
					
					var fillIssueFunction =
						function(contentTab, showFeedEntriesContext)
						{
							return function(newsPaperIssue, index, count)
							{
								var issueClassName = "issue";
								if(newsPaperIssue == showFeedEntriesContext.selectedNewsPaperIssue)
								{
									issueClassName += " selectedIssue";
								}
								contentTab.push(
									"<div class=\""+issueClassName+"\" title=\""+grabMyBooks.escapeTagsExtended(newsPaperIssue.linkBook.title)+" - Click to select\">",
									"	<div class=\"issueTitle\"><span class=\"issueTitleContent\">"+grabMyBooks.escapeTagsExtended(newsPaperIssue.linkBook.title)+"</span></div>",
									"	<img class=\"issueAction issueDelete\" title=\"Delete issue\" src=\"chrome://grabMyBooks/content/icons/newsPapers/deleteGray.png\">",
									"	<div class=\"issueAction issueViewContent\" title=\"View the article list of this issue\">View content</div>",
									"	<div class=\"issueAction issueTest\" title=\"Add this issue to the current book\">Add</div>",
									"	<div class=\"issueAction issueGrab\" title=\"Grab this issue as a book\">Grab</div>",
									"	<img class=\"issueAction issueUp\" title=\"Move left\" src=\"chrome://grabMyBooks/content/icons/newsPapers/left.png\">",
									"	<img class=\"issueAction issueDown\" title=\"Move right\" src=\"chrome://grabMyBooks/content/icons/newsPapers/right.png\">",
									"	<div class=\"issueCount\">"+newsPaperIssue.linkBook.linkBookArticles.length+"</div>",
									"</div>"
								);
							};
						}(contentTab, showFeedEntriesContext);
					grabMyBooks.tabDo(showFeedEntriesContext.newsPaper.issues, fillIssueFunction);
					var content = contentTab.join("\n");
					grabMyBooks.setNodeContentFromString(showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, content);
					
					var addIssuesClickListenerFunction =
						function(showFeedEntriesContext)
						{
							return function(issueNode, index, count)
							{
								var issueClickFunction =
									function(showFeedEntriesContext, index)
									{
										return function()
										{
											var issueToSelect = showFeedEntriesContext.newsPaper.issues[index];
											showFeedEntriesContext.selectIssue(issueToSelect);
											showFeedEntriesContext.fillIssues();
										};
									}(showFeedEntriesContext, index);
								grabMyBooks.attachNonEventFunction("click", issueNode, issueClickFunction);
							};
						}(showFeedEntriesContext);
					grabMyBooks.xml.xPathQueryFunction("./*[contains(@class,'issue')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, addIssuesClickListenerFunction);
					
					var addIssuesChangeTitleListenerFunction =
						function(showFeedEntriesContext)
						{
							return function(issueNode, index, count)
							{
								var issueChangeTitleFunction =
									function(showFeedEntriesContext, index)
									{
										return function(e)
										{
											e.stopPropagation();
											var issueToChange = showFeedEntriesContext.newsPaper.issues[index];
											
											var changeTitleEndFunction =
												function(showFeedEntriesContext)
												{
													return function()
													{
														showFeedEntriesContext.fillIssues();
													};
												}(showFeedEntriesContext);
												
											var changeTitleFunction =
												function(showFeedEntriesContext, issueToChange, changeTitleEndFunction)
												{
													return function(newTitle)
													{
														issueToChange.linkBook.title = newTitle;
														var issueId = issueToChange.issueNumber;
														var changeTitleSql = 
															"UPDATE BOOK SET B_TITLE=:bookTitle WHERE B_ID=:bookId";
														var changeTitleSqlToDoContext =
															new grabMyBooks.sql.SqlToDoContext(changeTitleSql);
														var prepareFunction =
															function(issueId, newTitle)
															{
																return function(statement)
																{
																	statement.params.bookId = issueId;
																	statement.params.bookTitle = newTitle;
																};
															}(issueId, newTitle);
														changeTitleSqlToDoContext.prepareFunction = prepareFunction;
														changeTitleSqlToDoContext.onEndFunction = changeTitleEndFunction;
														showFeedEntriesContext.newsPaper.getSqlQueue().sqlDo(changeTitleSqlToDoContext);
													};
												}(showFeedEntriesContext, issueToChange, changeTitleEndFunction);
											
											grabMyBooks.newsPapers.popin.askForInput("Enter the name of the new issue:", issueToChange.linkBook.title, changeTitleFunction, null, showFeedEntriesContext.getIssueNameValidationFunction);
										};
									}(showFeedEntriesContext, index);
								issueNode.addEventListener("click", issueChangeTitleFunction, false);
							};
						}(showFeedEntriesContext);
					grabMyBooks.xml.xPathQueryFunction("./*[contains(@class,'issue')]//*[contains(@class,'issueTitleContent')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, addIssuesChangeTitleListenerFunction);
					
					
					var addIssuesDeleteListenerFunction =
						function(showFeedEntriesContext)
						{
							return function(issueNode, index, count)
							{
								var issueDeleteFunction =
									function(showFeedEntriesContext, index)
									{
										return function(e)
										{
											e.stopPropagation();
											var issueToDelete = showFeedEntriesContext.newsPaper.issues[index];
											
											if(showFeedEntriesContext.selectedNewsPaperIssue == issueToDelete)
											{
												showFeedEntriesContext.selectedNewsPaperIssue = null;
											}
											
											var deleteEndFunction =
												function(showFeedEntriesContext)
												{
													return function()
													{
														showFeedEntriesContext.fillIssues();
													};
												}(showFeedEntriesContext);
												
											var deleteFunction =
												function(showFeedEntriesContext, issueToDelete, deleteEndFunction)
												{
													return function()
													{
														grabMyBooks.newsPapers.deleteNewsPaperIssue(showFeedEntriesContext.newsPaper, issueToDelete, deleteEndFunction);
													};
												}(showFeedEntriesContext, issueToDelete, deleteEndFunction);
											
											grabMyBooks.newsPapers.popin.askForAction("Are you sure to want to delete the issue named '"+grabMyBooks.escapeTagsExtended(issueToDelete.linkBook.title)+"' ?", deleteFunction, null);
										};
									}(showFeedEntriesContext, index);
								issueNode.addEventListener("click", issueDeleteFunction, false);
							};
						}(showFeedEntriesContext);
					grabMyBooks.xml.xPathQueryFunction("./*[contains(@class,'issue')]/*[contains(@class,'issueDelete')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, addIssuesDeleteListenerFunction);
					
					var addIssuesTestListenerFunction =
						function(showFeedEntriesContext)
						{
							return function(issueNode, index, count)
							{
								var issueTestFunction =
									function(showFeedEntriesContext, index)
									{
										return function(e)
										{
											e.stopPropagation();
											var issueToTest = showFeedEntriesContext.newsPaper.issues[index];
											var issueUrlTab = issueToTest.linkBook.getArticleUrlTab();
											grabMyBooks.addLinks(issueUrlTab, null, grabMyBooks.newsPapers.popin.showAddToBookProgress);
										};
									}(showFeedEntriesContext, index);
								issueNode.addEventListener("click", issueTestFunction, false);
							};
						}(showFeedEntriesContext);
					grabMyBooks.xml.xPathQueryFunction("./*[contains(@class,'issue')]/*[contains(@class,'issueTest')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, addIssuesTestListenerFunction);
					
					
					var addIssuesGrabListenerFunction =
						function(showFeedEntriesContext)
						{
							return function(issueNode, index, count)
							{
								var issueGrabFunction =
									function(showFeedEntriesContext, index)
									{
										return function(e)
										{
											e.stopPropagation();
											var issueToGrab = showFeedEntriesContext.newsPaper.issues[index];
											var issueUrlTab = issueToGrab.linkBook.getArticleUrlTab();
											var prepareAddToBookContextForIssueFunction =
												function(issueToGrab)
												{
													return function(addToBookContext)
													{
														addToBookContext.directGrab = grabMyBooks.options.directBookGrab;
														addToBookContext.title = issueToGrab.linkBook.title;
														addToBookContext.description = issueToGrab.linkBook.description;
														addToBookContext.language = issueToGrab.linkBook.lang;
														addToBookContext.globalXPath = issueToGrab.linkBook.globalRule;
														addToBookContext.coverUrl = grabMyBooks.ifEmpty(issueToGrab.linkBook.cover, null);
														addToBookContext.popinToUse = grabMyBooks.newsPapers.popin;
													};
												}(issueToGrab);
											grabMyBooks.addLinks(issueUrlTab, prepareAddToBookContextForIssueFunction, grabMyBooks.newsPapers.popin.showAddToBookProgress);
										};
									}(showFeedEntriesContext, index);
								issueNode.addEventListener("click", issueGrabFunction, false);
							};
						}(showFeedEntriesContext);
					grabMyBooks.xml.xPathQueryFunction("./*[contains(@class,'issue')]/*[contains(@class,'issueGrab')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, addIssuesGrabListenerFunction);
					
					var addIssuesShowContentListenerFunction =
						function(showFeedEntriesContext)
						{
							return function(issueNode, index, count)
							{
								var issueShowFunction =
									function(showFeedEntriesContext, index)
									{
										return function(e)
										{
											e.stopPropagation();
											var issueToShow = showFeedEntriesContext.newsPaper.issues[index];
											grabMyBooks.newsPapers.popin.showIssue(showFeedEntriesContext, issueToShow);
										};
									}(showFeedEntriesContext, index);
								issueNode.addEventListener("click", issueShowFunction, false);
							};
						}(showFeedEntriesContext);
					grabMyBooks.xml.xPathQueryFunction("./*[contains(@class,'issue')]/*[contains(@class,'issueViewContent')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, addIssuesShowContentListenerFunction);

					var addIssuesUpListenerFunction =
						function(showFeedEntriesContext)
						{
							return function(issueNode, index, count)
							{
								var issueUpFunction =
									function(showFeedEntriesContext, index)
									{
										return function(e)
										{
											e.stopPropagation();
											var issueToUp = showFeedEntriesContext.newsPaper.issues[index];
											if(grabMyBooks.tabUp(showFeedEntriesContext.newsPaper.issues, issueToUp.issueNumber))
											{
												grabMyBooks.newsPapers.saveNewsPaperIssuesOrder(showFeedEntriesContext.newsPaper, showFeedEntriesContext.fillIssues);
											}
										};
									}(showFeedEntriesContext, index);
								issueNode.addEventListener("click", issueUpFunction, false);
							};
						}(showFeedEntriesContext);
					grabMyBooks.xml.xPathQueryFunction("./*[contains(@class,'issue')]/*[contains(@class,'issueUp')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, addIssuesUpListenerFunction);
					
					var addIssuesDownListenerFunction =
						function(showFeedEntriesContext)
						{
							return function(issueNode, index, count)
							{
								var issueDownFunction =
									function(showFeedEntriesContext, index)
									{
										return function(e)
										{
											e.stopPropagation();
											var issueToUp = showFeedEntriesContext.newsPaper.issues[index];
											if(grabMyBooks.tabDown(showFeedEntriesContext.newsPaper.issues, issueToUp.issueNumber))
											{
												grabMyBooks.newsPapers.saveNewsPaperIssuesOrder(showFeedEntriesContext.newsPaper, showFeedEntriesContext.fillIssues);
											}
										};
									}(showFeedEntriesContext, index);
								issueNode.addEventListener("click", issueDownFunction, false);
							};
						}(showFeedEntriesContext);
					grabMyBooks.xml.xPathQueryFunction("./*[contains(@class,'issue')]/*[contains(@class,'issueDown')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryListBottom, addIssuesDownListenerFunction);
				};
			}(showFeedEntriesContext);
		
		var showFeedEntriesFunction =
			function(showFeedEntriesContext)
			{
				return function(newsPaper)
				{
					showFeedEntriesContext.newsPaper = newsPaper;
					
					showFeedEntriesContext.clearDisplayManager.clear();
					
					
					var entryListTopContentTab = [];
					entryListTopContentTab.push(
						"<div id=\"entryListTopButtons\">",
						grabMyBooks.menu.button("addToIssueButton", "Add to issue", "ADD SELECTION TO ISSUE"),
						grabMyBooks.menu.button("newsPaperTopAddSelectionToBookButton", "Add selection to book", "ADD SELECTION TO BOOK"),
						"	<span id=\"filterGroup\">",
						"		<img id=\"filterImg\" src=\"chrome://grabMyBooks/content/icons/newsPapers/search.png\">",
						"		<div id=\"filters\">",
						"		</div>",
						"	</span>",
						grabMyBooks.menu.button("newsPaperMoreImg", "More", "+"),
						"	</div>",
						"</div>"
					);
					
					
					var entryListTopContent = entryListTopContentTab.join("");
					grabMyBooks.setNodeContentFromString(showFeedEntriesContext.doc, showFeedEntriesContext.entryListTop, entryListTopContent);
					
					var moreButton = showFeedEntriesContext.doc.getElementById("newsPaperMoreImg");
					
					var moreBubbleContext = new grabMyBooks.popin.BubbleContext(showFeedEntriesContext.doc, moreButton);
					var moreBubbleContentTab = [];
					moreBubbleContentTab.push(
						"	<span id=\"newsPaperMoreContent\">",
						        grabMyBooks.menu.button("newsPaperLastNotNew", "Go to last not new entry", "LAST NOT NEW"),
						        grabMyBooks.menu.button("newsPaperEmptySelection", "Empty selection", "EMPTY SELECTION"),
						        grabMyBooks.menu.button("newsPaperClean", "Delete entries with a later date", "DELETE AFTER"),
						"	</span>"
					);
					var moreBubbleContent = moreBubbleContentTab.join("\n");
					moreBubbleContext.content = moreBubbleContent;
					moreBubbleContext.width = 165;
					moreBubbleContext.height = 80;
					moreBubbleContext.mouseZoneWidth = 90;
					moreBubbleContext.mouseZoneLeftMove = 0;
					moreBubbleContext.type = "bottomLeft";
					showFeedEntriesContext.moreBubble = new grabMyBooks.popin.Bubble(moreBubbleContext);
					
					var filtersNode = showFeedEntriesContext.doc.getElementById("filters");
					showFeedEntriesContext.fillFiltersFunction =
						function(showFeedEntriesContext, filtersNode)
						{
							return function()
							{
								var filtersContentTab = [];
								
								var showSearchField = (grabMyBooks.tabGet(showFeedEntriesContext.filters, "search")==null);
								
								if(showSearchField)
								{
									filtersContentTab.push(
										"<input id=\"filterSearch\" type=\"text\">"
									);
								}
								
								var filterFeedEntriesFunction =
								function(filtersContentTab)
								{
									return function(feedEntryInfoFilter, index, count)
									{
										filtersContentTab.push(
											"<div class=\"filter\">",
											"	"+feedEntryInfoFilter.displayLabel,
											"<div class=\"filterClose\" title=\"Remove filter\">",
											"	x",
											"</div>",
											"</div>"
										);
									};
								}(filtersContentTab);
								grabMyBooks.tabDo(showFeedEntriesContext.filters, filterFeedEntriesFunction);
								grabMyBooks.setNodeContentFromString(showFeedEntriesContext.doc, filtersNode, filtersContentTab.join("\n"));
								
								if(showSearchField)
								{
									var filterSearchInput = showFeedEntriesContext.doc.getElementById("filterSearch");
									var filterSearchEventFunction =
										function(showFeedEntriesContext, filterSearchInput)
										{
											return function(e)
											{
												e.stopPropagation();
												if(e.keyCode!=13)
												{
													return;
												}
												var searchValue = filterSearchInput.value.trim();
												if(grabMyBooks.isEmpty(searchValue))
												{
													return;
												}
												var filterFunction =
													function(searchValue)
													{
														return function(feedEntryInfo)
														{
															var result = (feedEntryInfo.name.toLowerCase().indexOf(searchValue)!=-1);
															return result;
														};
													}(searchValue.toLowerCase());
												var feedEntryInfoFilter =
													new grabMyBooks.newsPapers.FeedEntryInfoFilter("search", "Search: "+searchValue, filterFunction);
												grabMyBooks.tabReplace(showFeedEntriesContext.filters, feedEntryInfoFilter.name, feedEntryInfoFilter);
												showFeedEntriesContext.selectedFeedEntryInfos = [];
												showFeedEntriesContext.pageIndex = 0;
												showFeedEntriesContext.fillFeedEntriesFunction();
												showFeedEntriesContext.fillFiltersFunction();
												showFeedEntriesContext.entryListUp();
											};
										}(showFeedEntriesContext, filterSearchInput);
									filterSearchInput.addEventListener("keyup", filterSearchEventFunction, false);
								}
								
								var addFilterCloseListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(filterCloseNode, index, count)
										{
											var filter = showFeedEntriesContext.filters[index];
											var clickFunction =
												function(filter, showFeedEntriesContext)
												{
													return function(e)
													{
														grabMyBooks.tabRemove(showFeedEntriesContext.filters, filter.name);
														showFeedEntriesContext.selectedFeedEntryInfos = [];
														showFeedEntriesContext.pageIndex = 0;
														showFeedEntriesContext.fillFeedEntriesFunction();
														showFeedEntriesContext.fillFiltersFunction();
														showFeedEntriesContext.entryListUp();
													};
												}(filter, showFeedEntriesContext);
											filterCloseNode.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='filterClose']", showFeedEntriesContext.doc, filtersNode, addFilterCloseListenersFunction);
								
							};
						}(showFeedEntriesContext, filtersNode);
					showFeedEntriesContext.fillFiltersFunction();
					
					var lastNotNewButton = showFeedEntriesContext.doc.getElementById("newsPaperLastNotNew");
					var emptySelectionButton = showFeedEntriesContext.doc.getElementById("newsPaperEmptySelection");
					var deleteEntriesButton = showFeedEntriesContext.doc.getElementById("newsPaperClean");

					var lastNotNewFunction =
						function(showFeedEntriesContext)
						{
							return function(e)
							{
								showFeedEntriesContext.moreBubble.hide();
								var lastNotNewPositionInfo =
									showFeedEntriesContext.getLastNotNewPositionInfo();
								if(lastNotNewPositionInfo == null)
								{
									return;
								}
								if(lastNotNewPositionInfo.pageIndex != showFeedEntriesContext.pageIndex)
								{
									showFeedEntriesContext.changePage(lastNotNewPositionInfo.pageIndex);
								}
								var lastNotNewNode = grabMyBooks.xml.xPathQueryNode(".//*[@class='feedEntry' and position()="+(lastNotNewPositionInfo.indexOnPage+1)+"]", showFeedEntriesContext.doc, showFeedEntriesContext.entryList);
								grabMyBooks.scrollToNode(showFeedEntriesContext.entryList, lastNotNewNode, showFeedEntriesContext.timer);
							};
						}(showFeedEntriesContext);
					lastNotNewButton.addEventListener("click", lastNotNewFunction, false);
					
					
					var emptySelectionFunction =
						function(showFeedEntriesContext)
						{
							return function(e)
							{
								showFeedEntriesContext.moreBubble.hide();
								showFeedEntriesContext.emptyFeedCheckBoxesFunction();
							};
						}(showFeedEntriesContext);
					emptySelectionButton.addEventListener("click", emptySelectionFunction, false);
					
					var deleteAfterFunction =
						function(showFeedEntriesContext)
						{
							return function(e)
							{
								showFeedEntriesContext.moreBubble.hide();
								var selectedFeedEntryInfoCount = showFeedEntriesContext.selectedFeedEntryInfos.length;
								if(selectedFeedEntryInfoCount!=1)
								{
									grabMyBooks.newsPapers.popin.showMessage("Please select exactly one entrie.<br><br>All entries with a later date will be deleted");
									return;
								}
								var feedEntryInfo = showFeedEntriesContext.selectedFeedEntryInfos[0];
								var feedFilter = grabMyBooks.tabGet(showFeedEntriesContext.filters, "feed");
								var targetFeeds = null;
								if(feedFilter!=null)
								{
									targetFeeds = [];
									var targetFeed = grabMyBooks.tabGet(showFeedEntriesContext.newsPaper.feeds, feedFilter.feedUrl);
									targetFeeds.push(targetFeed);
								}
								else
								{
									targetFeeds = showFeedEntriesContext.newsPaper.feeds;
								}
								var setFeedsDeleteDateFunction =
									function(showFeedEntriesContext, feedEntryInfo, targetFeeds)
									{
										return function()
										{
											var setFeedDeleteDateFunction =
												function(feedEntryInfo)
												{
													return function(targetFeed, index, count)
													{
														targetFeed.lastDeleteDate = feedEntryInfo.date;
													};
												}(feedEntryInfo);
											grabMyBooks.tabDo(targetFeeds, setFeedDeleteDateFunction);
											grabMyBooks.newsPapers.saveNewsPaper(showFeedEntriesContext.newsPaper);
										};
									}(showFeedEntriesContext, feedEntryInfo, targetFeeds);
								
								var feedEntryShouldBeRemovedFunction =
									function(showFeedEntriesContext, targetFeeds, limitDate)
									{
										return function(toTestFeedEntryInfo)
										{
											if(limitDate.localeCompare(toTestFeedEntryInfo.date)<=0)
											{
												return false;
											}
											if(grabMyBooks.tabGet(targetFeeds, toTestFeedEntryInfo.parentFeedUrl)==null)
											{
												return false;
											}
											return true;
										};
									}(showFeedEntriesContext, targetFeeds, feedEntryInfo.date);
								
								
								var toBeRemovedFeedEntryInfoCount = grabMyBooks.tabCount(showFeedEntriesContext.newsPaper.feedEntryInfos, feedEntryShouldBeRemovedFunction);
								
								if(toBeRemovedFeedEntryInfoCount==0)
								{
									return;
								}
								
								var deleteEntriesMessage = "Delete "+toBeRemovedFeedEntryInfoCount+" entries?";
								
								var deleteEntriesFunction =
									function(showFeedEntriesContext, feedEntryShouldBeRemovedFunction, setFeedsDeleteDateFunction)
									{
										return function()
										{
											var toBeRemovedFeedEntryInfos =
												grabMyBooks.tabRemoveAll(showFeedEntriesContext.newsPaper.feedEntryInfos, feedEntryShouldBeRemovedFunction);
										
											var onEndFunction =
												function(showFeedEntriesContext, setFeedsDeleteDateFunction, toBeRemovedFeedEntryInfos)
												{
													return function()
													{
														setFeedsDeleteDateFunction();
														showFeedEntriesContext.emptyFeedCheckBoxesFunction();
														showFeedEntriesContext.fillFeedEntriesFunction();
														showFeedEntriesContext.newsPaperHolder.refreshNewsPaperListFunction();
														grabMyBooks.SmallInfo.showSmallInfoPanel(toBeRemovedFeedEntryInfos.length+" entries deleted", null);
													};
												}(showFeedEntriesContext, setFeedsDeleteDateFunction, toBeRemovedFeedEntryInfos);
											
											
											var deleteEntriesSql = 
												"DELETE FROM ENTRIES WHERE F_URL=:fUrl AND E_URL=:eUrl";
											var deleteEntriesToDoContext =
												new grabMyBooks.sql.SqlToDoContext(deleteEntriesSql);
											
											deleteEntriesToDoContext.prepareFunction =
												function(toBeRemovedFeedEntryInfos)
												{
													return function(statement)
													{
														var paramsArray = statement.newBindingParamsArray();
														var paramLineFunction =
															function(paramsArray)
															{
																return function(feedEntryInfo, index, count)
																{
																	var bindingParams = paramsArray.newBindingParams();
																	bindingParams.bindByName("fUrl", feedEntryInfo.parentFeedUrl);
																	bindingParams.bindByName("eUrl", feedEntryInfo.url);
																	paramsArray.addParams(bindingParams);
																};
															}(paramsArray);
														grabMyBooks.tabDo(toBeRemovedFeedEntryInfos, paramLineFunction);
														statement.bindParameters(paramsArray);
													};
												}(toBeRemovedFeedEntryInfos);
											deleteEntriesToDoContext.onEndFunction = onEndFunction;
											showFeedEntriesContext.newsPaper.getSqlQueue().sqlDo(deleteEntriesToDoContext);
										};
									}(showFeedEntriesContext, feedEntryShouldBeRemovedFunction, setFeedsDeleteDateFunction);
								grabMyBooks.newsPapers.popin.askForAction(deleteEntriesMessage, deleteEntriesFunction, null);
							};
						}(showFeedEntriesContext);
					deleteEntriesButton.addEventListener("click", deleteAfterFunction, false);
					
					
					var newsPaperTopAddSelectionToBookButton =
						showFeedEntriesContext.doc.getElementById("newsPaperTopAddSelectionToBookButton");

					var addToIssueButton = showFeedEntriesContext.doc.getElementById("addToIssueButton");
					
					var emptyEachFeedCheckBoxesFunction =
						function(showFeedEntriesContext)
						{
							return function(feedCheckBox, index, count)
							{
								feedCheckBox.checked = false;
							};
						}(showFeedEntriesContext);
					showFeedEntriesContext.emptyFeedCheckBoxesFunction =
						function(showFeedEntriesContext, emptyEachFeedCheckBoxesFunction)
						{
							return function()
							{
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedCheckBox']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, emptyEachFeedCheckBoxesFunction)
								showFeedEntriesContext.selectedFeedEntryInfos = [];
							};
						}(showFeedEntriesContext, emptyEachFeedCheckBoxesFunction);
					
					var addSelectionToBookClickFunction =
						function(showFeedEntriesContext)
						{
							return function(e)
							{
								if(showFeedEntriesContext.selectedFeedEntryInfos.length==0)
								{
									return;
								}
								
								var toAddUrlTab = [];
								var addSelectedUrlFunction =
									function(toAddUrlTab)
									{
										return function(feedEntryInfo, index, count)
										{
											toAddUrlTab.push(feedEntryInfo.url);
										};
									}(toAddUrlTab);
								var sortEntriesFunction =
									grabMyBooks.newsPapers.getNewsPaperSortFunction(showFeedEntriesContext.newsPaper, false, null);
								showFeedEntriesContext.selectedFeedEntryInfos.sort(sortEntriesFunction);
								grabMyBooks.tabDo(showFeedEntriesContext.selectedFeedEntryInfos, addSelectedUrlFunction);
								
								var setEntriesNotNewEndFunction =
									function(showFeedEntriesContext)
									{
										return function()
										{
											showFeedEntriesContext.fillFeedEntriesFunction();
											showFeedEntriesContext.emptyFeedCheckBoxesFunction();
										};
									}(showFeedEntriesContext);
								
								var addToBookEndFunction =
									function(showFeedEntriesContext, selectedFeedEntryInfos, setEntriesNotNewEndFunction)
									{
										return function()
										{
											grabMyBooks.newsPapers.setFeedEntryInfosNew(showFeedEntriesContext.newsPaper, selectedFeedEntryInfos, false, setEntriesNotNewEndFunction);
										};
									}(showFeedEntriesContext, showFeedEntriesContext.selectedFeedEntryInfos, setEntriesNotNewEndFunction);
								
								var prepareAddToBookContextForNewsPaperFeedsFunction =
									function(addToBookEndFunction)
									{
										return function(addToBookContext)
										{
											addToBookContext.endFunction2 = addToBookEndFunction;
										};
									}(addToBookEndFunction);
								grabMyBooks.addLinks(toAddUrlTab, prepareAddToBookContextForNewsPaperFeedsFunction, grabMyBooks.newsPapers.popin.showAddToBookProgress);
							};
						}(showFeedEntriesContext);
					newsPaperTopAddSelectionToBookButton.addEventListener("click", addSelectionToBookClickFunction, false);
					
					if(newsPaper.feedEntryInfos.length==0)
					{
						var noEntriesContent = "<div id=\"noEntries\">No entries</div>";
						grabMyBooks.setNodeContentFromString(showFeedEntriesContext.doc, showFeedEntriesContext.entryList, noEntriesContent);
						return;
					}
					
					showFeedEntriesContext.getIssueNameValidationFunction =
						function(showFeedEntriesContext)
						{
							return function(newIssueName)
							{
								var result = [];
								var containsNewsPaperIssueFunction =
									function(newIssueName)
									{
										return function(newsPaperIssue)
										{
											var result = (newIssueName==newsPaperIssue.linkBook.title);
											return result;
										};
									}(newIssueName, showFeedEntriesContext);
								var nameAlreadyExists = grabMyBooks.tabContains(showFeedEntriesContext.newsPaper.issues, containsNewsPaperIssueFunction);
								if(nameAlreadyExists)
								{
									result.push("Name already used");
								}
								return result;
							};
						}(showFeedEntriesContext);
					
					
					var addToIssueButtonClickFunction =
						function(showFeedEntriesContext)
						{
							return function(e)
							{
								if(showFeedEntriesContext.selectedFeedEntryInfos.length==0)
								{
									return;
								}
								var nowDateString = grabMyBooks.newsPapers.getAsAtomDate(null);
								var issueName = showFeedEntriesContext.newsPaper.name+" "+nowDateString.substring(0,10);
								
								var addEntriesToLinkBookFunction =
									function(showFeedEntriesContext)
									{
										return function(newsPaperIssue)
										{
											var addedLinkBookArticles = [];
											var addFeedEntryToLinkBookFunction =
											function(issueLinkBook, addedLinkBookArticles)
											{
												return function(feedEntryInfo, index, count)
												{
													var linkBookArticle =
														new grabMyBooks.linkBook.LinkBookArticle(feedEntryInfo.name, feedEntryInfo.url, null, feedEntryInfo.date, feedEntryInfo.parentFeedUrl);
													var added = issueLinkBook.addArticle(linkBookArticle);
													if(added)
													{
														addedLinkBookArticles.push(linkBookArticle);
													}
												};
											}(newsPaperIssue.linkBook, addedLinkBookArticles);
											var sortEntriesFunction =
												grabMyBooks.newsPapers.getNewsPaperSortFunction(showFeedEntriesContext.newsPaper, false, null);
											showFeedEntriesContext.selectedFeedEntryInfos.sort(sortEntriesFunction);
											grabMyBooks.tabDo(showFeedEntriesContext.selectedFeedEntryInfos, addFeedEntryToLinkBookFunction);
											
											
											var addLinkBookArticlesSql =
												"INSERT INTO ARTICLE(A_PARENT_BOOK_ID, A_TITLE, A_URL, A_RULE, A_ORDER, A_DATE, A_ORIGIN) VALUES(:p_book_id,:a_title,:a_url,:a_rule,:a_order,:a_date,:a_origin)";
											var addLinkBookArticlesSqlToDoContext =
												new grabMyBooks.sql.SqlToDoContext(addLinkBookArticlesSql);
											addLinkBookArticlesSqlToDoContext.prepareFunction =
												function(addedLinkBookArticles, newsPaperIssue)
												{
													return function(statement)
													{
														var paramsArray = statement.newBindingParamsArray();
														var paramLineFunction =
															function(newsPaperIssue, paramsArray)
															{
																return function(linkBookArticle, index, count)
																{
																	var bindingParams = paramsArray.newBindingParams();
																	bindingParams.bindByName("p_book_id", newsPaperIssue.issueNumber);
																	bindingParams.bindByName("a_title", linkBookArticle.title);
																	bindingParams.bindByName("a_url", linkBookArticle.url);
																	bindingParams.bindByName("a_rule", linkBookArticle.rule);
																	bindingParams.bindByName("a_order", null);
																	bindingParams.bindByName("a_date", linkBookArticle.date);
																	bindingParams.bindByName("a_origin", linkBookArticle.origin);
																	paramsArray.addParams(bindingParams);
																};
															}(newsPaperIssue, paramsArray);
														grabMyBooks.tabDo(addedLinkBookArticles, paramLineFunction);
														statement.bindParameters(paramsArray);
													};
												}(addedLinkBookArticles, newsPaperIssue);
												
											var showMessageEndFunction =
												function(addedLinkBookArticles, newsPaperIssue)
												{
													return function()
													{
														grabMyBooks.SmallInfo.showSmallInfoPanel(addedLinkBookArticles.length+" links added to issue '"+newsPaperIssue.linkBook.title+"'", null);
													};
												}(addedLinkBookArticles, newsPaperIssue);
											
											var setEntriesNotNewFunction =
												function(showFeedEntriesContext, selectedFeedEntryInfos, showMessageEndFunction)
												{
													return function()
													{
														var endFunction =
															function(showFeedEntriesContext, showMessageEndFunction)
															{
																return function()
																{
																	showFeedEntriesContext.fillFeedEntriesFunction();
																	showMessageEndFunction();
																};
															}(showFeedEntriesContext, showMessageEndFunction);
														grabMyBooks.newsPapers.setFeedEntryInfosNew(showFeedEntriesContext.newsPaper, selectedFeedEntryInfos, false, endFunction);
													};
												}(showFeedEntriesContext, showFeedEntriesContext.selectedFeedEntryInfos, showMessageEndFunction);
												
											addLinkBookArticlesSqlToDoContext.onEndFunction =
												function(newsPaper, newsPaperIssue, setEntriesNotNewFunction)
												{
													return function()
													{
														grabMyBooks.newsPapers.saveNewsPaperIssueArticlesOrder(newsPaper, newsPaperIssue, setEntriesNotNewFunction);
													};
												}(showFeedEntriesContext.newsPaper, newsPaperIssue, setEntriesNotNewFunction);
											if(addedLinkBookArticles.length>0)
											{
												showFeedEntriesContext.newsPaper.getSqlQueue().sqlDo(addLinkBookArticlesSqlToDoContext);
											}
											showFeedEntriesContext.emptyFeedCheckBoxesFunction();
											showFeedEntriesContext.fillIssues();
										};
									}(showFeedEntriesContext);
								
								if(showFeedEntriesContext.selectedNewsPaperIssue != null)
								{
									addEntriesToLinkBookFunction(showFeedEntriesContext.selectedNewsPaperIssue);
									return;
								}
								
								var createNewIssueFunction =
									function(addEntriesToLinkBookFunction, showFeedEntriesContext)
									{
										return function(issueName)
										{
											var issueLinkBook =
												new grabMyBooks.linkBook.LinkBook(issueName, null);
											var newsPaperIssue = new grabMyBooks.newsPapers.NewsPaperIssue(issueLinkBook);
											newsPaperIssue.issueNumber = showFeedEntriesContext.newsPaper.getNextNewsPaperIssueId();
											showFeedEntriesContext.newsPaper.issues.push(newsPaperIssue);
											var createIssueSql = "INSERT INTO BOOK(B_ID, B_TITLE, B_DESC, B_LANG, B_RULE, B_COVER, B_DATE) VALUES(:b_id,:b_title,:b_desc,:b_lang,:b_rule,:b_cover,:b_date)";
											var createIssueSqlToDoContext =
												new grabMyBooks.sql.SqlToDoContext(createIssueSql);
											createIssueSqlToDoContext.prepareFunction =
												function(newsPaperIssue)
												{
													return function(statement)
													{
														statement.params.b_id = newsPaperIssue.issueNumber;
														statement.params.b_title = newsPaperIssue.linkBook.title;
														statement.params.b_desc = newsPaperIssue.linkBook.description;
														statement.params.b_lang = newsPaperIssue.linkBook.lang;
														statement.params.b_rule = newsPaperIssue.linkBook.globalRule;
														statement.params.b_cover = newsPaperIssue.linkBook.cover;
														statement.params.b_date = newsPaperIssue.date;
													};
												}(newsPaperIssue);
											createIssueSqlToDoContext.onEndFunction =
												function(newsPaper, newsPaperIssue, addEntriesToLinkBookFunction, showFeedEntriesContext)
												{
													return function()
													{
														showFeedEntriesContext.selectIssue(newsPaperIssue);
														var saveNewsPaperIssuesOrderEndFunction =
															function()
															{
																return function()
																{
																	addEntriesToLinkBookFunction(newsPaperIssue);
																};
															}();
														grabMyBooks.newsPapers.saveNewsPaperIssuesOrder(newsPaper, saveNewsPaperIssuesOrderEndFunction);
													};
												}(showFeedEntriesContext.newsPaper, newsPaperIssue, addEntriesToLinkBookFunction, showFeedEntriesContext);
											showFeedEntriesContext.newsPaper.getSqlQueue().sqlDo(createIssueSqlToDoContext);
											
										};
									}(addEntriesToLinkBookFunction, showFeedEntriesContext);
								
								grabMyBooks.newsPapers.popin.askForInput("Enter the name of the new issue:", issueName, createNewIssueFunction, null, showFeedEntriesContext.getIssueNameValidationFunction);
							};
						}(showFeedEntriesContext);
					addToIssueButton.addEventListener("click", addToIssueButtonClickFunction, false);
					
					
					showFeedEntriesContext.feedEntryInfosToUse = newsPaper.feedEntryInfos;
					
					var sortEntriesFunction =
						grabMyBooks.newsPapers.getNewsPaperSortFunction(newsPaper, true, null);
					
					
					showFeedEntriesContext.feedEntryInfosToUse.sort(sortEntriesFunction);
					
					showFeedEntriesContext.initialFeedEntryInfosToUse = showFeedEntriesContext.feedEntryInfosToUse;
					showFeedEntriesContext.fillFeedEntriesFunction =
						function(showFeedEntriesContext)
						{
							return function()
							{
								showFeedEntriesContext.lastMarkedDate=null;
								showFeedEntriesContext.feedEntryInfosToUse = showFeedEntriesContext.applyFilters();
								
								showFeedEntriesContext.pageCount = parseInt(showFeedEntriesContext.feedEntryInfosToUse.length/showFeedEntriesContext.maxEntriesPerPage);
								if(showFeedEntriesContext.feedEntryInfosToUse.length%showFeedEntriesContext.maxEntriesPerPage>0)
								{
									showFeedEntriesContext.pageCount+=1;
								}
								
								if(showFeedEntriesContext.pageIndex>(showFeedEntriesContext.pageCount-1))
								{
									showFeedEntriesContext.pageIndex = 0;
								}
								
								var entryListContentTab = [];
								
								if(showFeedEntriesContext.pageCount>1)
								{
									entryListContentTab.push(
										"<div id=\"entriesPages\">",
										"	<img id=\"entriesPagePrevious\" title=\"Previous page\" src=\"chrome://grabMyBooks/content/icons/newsPapers/left.png\">",
										"	<span id=\"entriesPageNum\" title=\"Change page number\">"+(showFeedEntriesContext.pageIndex+1)+"</span>",
										"	/",
										"	<span id=\"entriesPageTotal\">"+showFeedEntriesContext.pageCount+"</span>",
										"	<img id=\"entriesPageNext\" title=\"Next page\" src=\"chrome://grabMyBooks/content/icons/newsPapers/right.png\">",
										"</div>"
									);
								}
								
								if(showFeedEntriesContext.pageCount>1)
								{
									var startIndex = (showFeedEntriesContext.pageIndex * showFeedEntriesContext.maxEntriesPerPage);
									var endIndex = startIndex+showFeedEntriesContext.maxEntriesPerPage;
									if(endIndex>showFeedEntriesContext.feedEntryInfosToUse.length)
									{
										endIndex=showFeedEntriesContext.feedEntryInfosToUse.length;
									}
									showFeedEntriesContext.feedEntryInfosToUse = showFeedEntriesContext.feedEntryInfosToUse.slice(startIndex, endIndex);
								}
								
								var fillFeedEntryFunction =
									function(showFeedEntriesContext, entryListContentTab)
									{
										return function(feedEntryInfo, index, count)
										{
											var feed = showFeedEntriesContext.getFeedForEntry(feedEntryInfo.parentFeedUrl);
											var feedName = grabMyBooks.escapeTagsExtended(feed.title);
											if(grabMyBooks.isEmpty(feedName))
											{
												feedName = "???";
											}
											var shortFeedName = grabMyBooks.truncate(feedName, 10, "");
											var feedColor = feed.color;
											
											var dayDate = feedEntryInfo.date.substring(0, 10);
											var dayDateMonth = feedEntryInfo.date.substring(0, 7);
											var displayDayDate = (showFeedEntriesContext.lastMarkedDate==null || showFeedEntriesContext.lastMarkedDate!=dayDate);
											
											if(displayDayDate)
											{
												var year = dayDate.substring(0, 4);
												var month = dayDate.substring(5, 7);
												var day = dayDate.substring(8, 10);
												
												var dateInfo = showFeedEntriesContext.getDateInfo(day, month, year);
												
												showFeedEntriesContext.lastMarkedDate = dayDate;
												entryListContentTab.push(
												"<tr><td class=\"dayDate\" colspan=\"6\">",
												"	"+dateInfo.day+" <b><span class=\"dayDateMonth "+dayDateMonth+"\">"+dateInfo.month+"</span></b> <div class=\"dayDateDay\" id=\""+dayDate+"\"><div class=\"dayDateDayContent\">"+dateInfo.dayInt+"</div></div><sup>"+dateInfo.th+"</sup> <span class=\"dayDateYear "+year+"\">"+year+"</span>",
												"</td></tr>"
												);
											}
											
											var dateTime = feedEntryInfo.date.substring(11, 16);
											
											var checked = (grabMyBooks.tabGet(showFeedEntriesContext.selectedFeedEntryInfos, feedEntryInfo.url)!=null)?"checked":"";
											
											entryListContentTab.push(
												"<tr class=\"feedEntry\">",
												"<td class=\"feedEntryFeedColorSquareContainer\"><div class=\"feedEntryFeedColorSquare\" title=\""+feedName+"\" style=\"cursor:pointer;background:"+feedColor+"\">"+shortFeedName+"</div></td>",
												"<td>",
												"	<input type=\"checkbox\" class=\"feedCheckBox\" "+checked+">",
												"</td>",
												"<td>",
												"	<img class=\"feedEntryNew\" src=\"chrome://grabMyBooks/content/icons/newsPapers/notNew.png\" title=\"Mark new\" "+(feedEntryInfo.isNew?"style=\"display:none;\"":"")+">",
												"	<img class=\"feedEntryNotNew\" src=\"chrome://grabMyBooks/content/icons/newsPapers/new.png\" title=\"Mark not new\" "+(feedEntryInfo.isNew?"":"style=\"display:none;\"")+">",
												"</td>",
												"<td class=\"feedEntryAContainer\"><a href=\""+feedEntryInfo.url+"\" title=\""+grabMyBooks.escapeTagsExtended(feedEntryInfo.url)+", "+feedEntryInfo.date+"\" target=\"_blank\">"+grabMyBooks.escapeTagsExtended(feedEntryInfo.name)+"</a></td>",
												"<td class=\"feedEntryTime\">"+dateTime+"</td>",
												"<td class=\"feedEntryActions\">",
												"	<img title=\"Add to book\" src=\"chrome://grabMyBooks/content/icons/newsPapers/addToBook.png\" class=\"feedEntryAddToBook\"></span>",
												"	<div class=\"feedEntryMoreActions\">",
												"		<span class=\"feedEntryMoreActionsPlus\">+</span>",
												"		<span class=\"feedEntryMoreActionsContent\">",
												"			<img title=\"Select new ones to here\" src=\"chrome://grabMyBooks/content/icons/newsPapers/selectNewOnes.png\" class=\"feedEntrySelectNewOnes\">",
												"			<img title=\"Select all to here\" src=\"chrome://grabMyBooks/content/icons/newsPapers/selectAll.png\" class=\"feedEntrySelectAll\">",
												"			<img title=\"Select new ones within same day\" src=\"chrome://grabMyBooks/content/icons/newsPapers/selectNewOnesDay.png\" class=\"feedEntrySelectNewOnesDay\">",
												"			<img title=\"Select all within same day\" src=\"chrome://grabMyBooks/content/icons/newsPapers/selectAllDay.png\" class=\"feedEntrySelectAllDay\">",
												"			<img title=\"Edit rule\" src=\"chrome://grabMyBooks/content/icons/newsPapers/zone.png\" class=\"feedEntryEditRule\">",
												"		</span>",
												"	</div>",
												"</td>",
												"</tr>"
											);
										};
									}(showFeedEntriesContext, entryListContentTab);
								grabMyBooks.tabDo(showFeedEntriesContext.feedEntryInfosToUse, fillFeedEntryFunction);
								
								var entryListContent = entryListContentTab.join("\n");
								grabMyBooks.setNodeContentFromString(showFeedEntriesContext.doc, showFeedEntriesContext.entryList, entryListContent);
								
								if(showFeedEntriesContext.pageCount>1)
								{
									var entriesPagePreviousNode = showFeedEntriesContext.doc.getElementById("entriesPagePrevious");
									var entriesPageNextNode = showFeedEntriesContext.doc.getElementById("entriesPageNext");
									var entriesPageNumNode = showFeedEntriesContext.doc.getElementById("entriesPageNum");
									
									var addChangePageListenerFunction =
										function(showFeedEntriesContext)
										{
											return function(node, pageIndex)
											{
												var clickFunction =
													function(showFeedEntriesContext, pageIndex)
													{
														return function(e)
														{
															showFeedEntriesContext.changePage(pageIndex);
														};
													}(showFeedEntriesContext, pageIndex);
												node.addEventListener("click", clickFunction, false);
											};
										}(showFeedEntriesContext);
									if(showFeedEntriesContext.pageIndex>0)
									{
										addChangePageListenerFunction(entriesPagePreviousNode, showFeedEntriesContext.pageIndex-1);
									}
									if(showFeedEntriesContext.pageIndex<showFeedEntriesContext.pageCount-1)
									{
										addChangePageListenerFunction(entriesPageNextNode, showFeedEntriesContext.pageIndex+1);
									}
									
									var setPageNumberEventFunction =
										function(showFeedEntriesContext)
										{
											return function(e)
											{
												var setPageNumberFunction =
													function(pageNumberString)
													{
														var pageIndexToSet = grabMyBooks.ifNumber(pageNumberString, 1)-1;
														showFeedEntriesContext.changePage(pageIndexToSet);
													};
												grabMyBooks.newsPapers.popin.askForInput("Enter the page number:", ""+(showFeedEntriesContext.pageIndex+1), setPageNumberFunction, null, null);
											};
										}(showFeedEntriesContext);
									entriesPageNumNode.addEventListener("click", setPageNumberEventFunction, false);
								}
								
								var addFeedSelectionListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(feedCheckBox, index, count)
										{
											var feedEntryInfo = showFeedEntriesContext.feedEntryInfosToUse[index];
											var feedCheckBoxClickFunction =
												function(feedCheckBox, feedEntryInfo, showFeedEntriesContext)
												{
													return function(e)
													{
														if(!feedCheckBox.checked)
														{
															grabMyBooks.tabRemove(showFeedEntriesContext.selectedFeedEntryInfos, feedEntryInfo.url);
														}
														else
														{
															if(grabMyBooks.tabGet(showFeedEntriesContext.selectedFeedEntryInfos, feedEntryInfo.url)!=null)
															{
																return;
															}
															showFeedEntriesContext.selectedFeedEntryInfos.push(feedEntryInfo);
														}
														
													};
												}(feedCheckBox, feedEntryInfo, showFeedEntriesContext);
											feedCheckBox.addEventListener("click", feedCheckBoxClickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedCheckBox']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addFeedSelectionListenersFunction);
								
								var addSelectFeedEntriesFunction =
									function(showFeedEntriesContext)
									{
										return function(nodeClassName, onlyNewOnes, sameDay)
										{
											var addSelectFeedEntriesForNodeFunction =
												function(showFeedEntriesContext, onlyNewOnes, sameDay)
												{
													return function(node, index, count)
													{
														var clickedFeedEntryInfo = showFeedEntriesContext.feedEntryInfosToUse[index];
														var day = null;
														if(sameDay)
														{
															day = clickedFeedEntryInfo.date.substring(8, 10);
														}
														
														var nodeClickFunction =
															function(showFeedEntriesContext, onlyNewOnes, sameDay, day, clickedFeedEntryInfo)
															{
																return function(e)
																{
																	var feedEntryInfoToUse = showFeedEntriesContext.applyFilters();
																	var stopHolder = new Object();
																	stopHolder.stop = false;
																	var selectFeedEntriesTabFunction =
																		function(showFeedEntriesContext, onlyNewOnes, sameDay, day, clickedFeedEntryInfo, stopHolder)
																		{
																			return function(feedEntryInfo, index, count)
																			{
																				if(stopHolder.stop)
																				{
																					return;
																				}
																				var feedEntryInfoDay = feedEntryInfo.date.substring(8, 10);
																				if(sameDay && feedEntryInfoDay.localeCompare(day)>0)
																				{
																					return;
																				}
																				else if(sameDay && feedEntryInfoDay.localeCompare(day)<0)
																				{
																					return;
																				}
																				
																				
																				if(onlyNewOnes && !feedEntryInfo.isNew)
																				{
																					return;
																				}
																				if(grabMyBooks.tabGet(showFeedEntriesContext.selectedFeedEntryInfos, feedEntryInfo.url)!=null)
																				{
																					return;
																				}
																				
																				showFeedEntriesContext.selectedFeedEntryInfos.push(feedEntryInfo);
																				
																				if(!sameDay && clickedFeedEntryInfo==feedEntryInfo)
																				{
																					stopHolder.stop = true;
																				}
																			};
																		}(showFeedEntriesContext, onlyNewOnes, sameDay, day, clickedFeedEntryInfo, stopHolder);
																	grabMyBooks.tabDo(feedEntryInfoToUse, selectFeedEntriesTabFunction);
																	
																	showFeedEntriesContext.fillFeedEntriesFunction();
																};
															}(showFeedEntriesContext, onlyNewOnes, sameDay, day, clickedFeedEntryInfo);
														node.addEventListener("click", nodeClickFunction, false);
													}
												}(showFeedEntriesContext, onlyNewOnes, sameDay);
											grabMyBooks.xml.xPathQueryFunction(".//*[@class='"+nodeClassName+"']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addSelectFeedEntriesForNodeFunction);
										};
									}(showFeedEntriesContext);
								addSelectFeedEntriesFunction("feedEntrySelectNewOnesDay", true, true);
								addSelectFeedEntriesFunction("feedEntrySelectNewOnes", true, false);
								addSelectFeedEntriesFunction("feedEntrySelectAllDay", false, true);
								addSelectFeedEntriesFunction("feedEntrySelectAll", false, false);
								
								var addFeedFilterListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(node, index, count)
										{
											var feedEntryInfo = showFeedEntriesContext.feedEntryInfosToUse[index];
											var feedUrl = feedEntryInfo.parentFeedUrl;
											var feedItem = grabMyBooks.tabGet(showFeedEntriesContext.newsPaper.feeds, feedUrl);
											var feedName = feedItem.title;
											var clickFunction =
												function(feedName, feedUrl, showFeedEntriesContext)
												{
													return function(e)
													{
														var filterFunction =
															function(feedUrl)
															{
																return function(feedEntryInfo)
																{
																	var result = (feedEntryInfo.parentFeedUrl==feedUrl);
																	return result;
																};
															}(feedUrl);
														var feedEntryInfoFilter =
															new grabMyBooks.newsPapers.FeedEntryInfoFilter("feed", "Feed: "+feedName, filterFunction);
														feedEntryInfoFilter.feedUrl = feedUrl;
														grabMyBooks.tabReplace(showFeedEntriesContext.filters, feedEntryInfoFilter.name, feedEntryInfoFilter);
														showFeedEntriesContext.selectedFeedEntryInfos = [];
														showFeedEntriesContext.pageIndex = 0;
														showFeedEntriesContext.fillFeedEntriesFunction();
														showFeedEntriesContext.fillFiltersFunction();
														showFeedEntriesContext.entryListUp();
													};
												}(feedName, feedUrl, showFeedEntriesContext);
											node.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedEntryFeedColorSquare']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addFeedFilterListenersFunction);
								
								var addAddToBookListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(node, index, count)
										{
											var feedEntryInfo = showFeedEntriesContext.feedEntryInfosToUse[index];
											var clickFunction =
												function(feedEntryInfo, showFeedEntriesContext)
												{
													return function(e)
													{
														var setEntriesNotNewEndFunction =
															function(showFeedEntriesContext)
															{
																return function()
																{
																	showFeedEntriesContext.fillFeedEntriesFunction();
																};
															}(showFeedEntriesContext);
														
														var addToBookEndFunction =
															function(showFeedEntriesContext, feedEntryInfo, setEntriesNotNewEndFunction)
															{
																return function()
																{
																	grabMyBooks.newsPapers.setFeedEntryInfosNew(showFeedEntriesContext.newsPaper, [feedEntryInfo], false, setEntriesNotNewEndFunction);
																};
															}(showFeedEntriesContext, feedEntryInfo, setEntriesNotNewEndFunction);
														
														var prepareAddToBookContextForNewsPaperFeedsFunction =
															function(addToBookEndFunction)
															{
																return function(addToBookContext)
																{
																	addToBookContext.endFunction2 = addToBookEndFunction;
																};
															}(addToBookEndFunction);
														grabMyBooks.addLinks([feedEntryInfo.url], prepareAddToBookContextForNewsPaperFeedsFunction, grabMyBooks.newsPapers.popin.showAddToBookProgress);
													};
												}(feedEntryInfo, showFeedEntriesContext);
											node.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedEntryAddToBook']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addAddToBookListenersFunction);
								
								var addEditRuleListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(node, index, count)
										{
											var feedEntryInfo = showFeedEntriesContext.feedEntryInfosToUse[index];
											var clickFunction =
												function(feedEntryInfo, showFeedEntriesContext)
												{
													return function(e)
													{
														var pageZoneGrabContext =
															new grabMyBooks.zone.PageZoneGrabContext(feedEntryInfo.url);
														grabMyBooks.zone.openPageForZoneGrab(pageZoneGrabContext);
													};
												}(feedEntryInfo, showFeedEntriesContext);
											node.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedEntryEditRule']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addEditRuleListenersFunction);
								
								
								
								var addDayDateListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(node, index, count)
										{
											var dayDate = node.id;
											var clickFunction =
												function(dayDate, showFeedEntriesContext)
												{
													return function(e)
													{
														var filterFunction =
															function(dayDate)
															{
																return function(feedEntryInfo)
																{
																	var result = (feedEntryInfo.date.indexOf(dayDate)==0);
																	return result;
																};
															}(dayDate);
														var feedEntryInfoFilter =
															new grabMyBooks.newsPapers.FeedEntryInfoFilter("date", "Date: "+dayDate, filterFunction);
														grabMyBooks.tabReplace(showFeedEntriesContext.filters, feedEntryInfoFilter.name, feedEntryInfoFilter);
														showFeedEntriesContext.selectedFeedEntryInfos = [];
														showFeedEntriesContext.pageIndex = 0;
														showFeedEntriesContext.fillFeedEntriesFunction();
														showFeedEntriesContext.fillFiltersFunction();
														showFeedEntriesContext.entryListUp();
													};
												}(dayDate, showFeedEntriesContext);
											node.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='dayDateDay']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addDayDateListenersFunction);
								
								var addMonthDateListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(node, index, count)
										{
											var monthDate = node.className.split(" ")[1];
											var clickFunction =
												function(monthDate, showFeedEntriesContext)
												{
													return function(e)
													{
														var filterFunction =
															function(monthDate)
															{
																return function(feedEntryInfo)
																{
																	var result = (feedEntryInfo.date.indexOf(monthDate)==0);
																	return result;
																};
															}(monthDate);
														var feedEntryInfoFilter =
															new grabMyBooks.newsPapers.FeedEntryInfoFilter("date", "Date: "+monthDate, filterFunction);
														grabMyBooks.tabReplace(showFeedEntriesContext.filters, feedEntryInfoFilter.name, feedEntryInfoFilter);
														showFeedEntriesContext.selectedFeedEntryInfos = [];
														showFeedEntriesContext.pageIndex = 0;
														showFeedEntriesContext.fillFeedEntriesFunction();
														showFeedEntriesContext.fillFiltersFunction();
														showFeedEntriesContext.entryListUp();
													};
												}(monthDate, showFeedEntriesContext);
											node.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[contains(@class,'dayDateMonth')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addMonthDateListenersFunction);
								
								var addYearDateListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(node, index, count)
										{
											var yearDate = node.className.split(" ")[1];
											var clickFunction =
												function(yearDate, showFeedEntriesContext)
												{
													return function(e)
													{
														var filterFunction =
															function(yearDate)
															{
																return function(feedEntryInfo)
																{
																	var result = (feedEntryInfo.date.indexOf(yearDate)==0);
																	return result;
																};
															}(yearDate);
														var feedEntryInfoFilter =
															new grabMyBooks.newsPapers.FeedEntryInfoFilter("date", "Date: "+yearDate, filterFunction);
														grabMyBooks.tabReplace(showFeedEntriesContext.filters, feedEntryInfoFilter.name, feedEntryInfoFilter);
														showFeedEntriesContext.selectedFeedEntryInfos = [];
														showFeedEntriesContext.pageIndex = 0;
														showFeedEntriesContext.fillFeedEntriesFunction();
														showFeedEntriesContext.fillFiltersFunction();
														showFeedEntriesContext.entryListUp();
													};
												}(yearDate, showFeedEntriesContext);
											node.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[contains(@class,'dayDateYear')]", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addYearDateListenersFunction);
								
								var addMarkNewListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(node, index, count)
										{
											var feedEntryInfo = showFeedEntriesContext.feedEntryInfosToUse[index];			
											var clickFunction =
												function(feedEntryInfo, showFeedEntriesContext)
												{
													return function(e)
													{
														grabMyBooks.newsPapers.setFeedEntryInfosNew(showFeedEntriesContext.newsPaper, [feedEntryInfo], true, showFeedEntriesContext.fillFeedEntriesFunction);
													};
												}(feedEntryInfo, showFeedEntriesContext);
											node.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedEntryNew']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addMarkNewListenersFunction);
								
								var addMarkNotNewListenersFunction =
									function(showFeedEntriesContext)
									{
										return function(node, index, count)
										{
											var feedEntryInfo = showFeedEntriesContext.feedEntryInfosToUse[index];			
											var clickFunction =
												function(feedEntryInfo, showFeedEntriesContext)
												{
													return function(e)
													{
														grabMyBooks.newsPapers.setFeedEntryInfosNew(showFeedEntriesContext.newsPaper, [feedEntryInfo], false, showFeedEntriesContext.fillFeedEntriesFunction);
													};
												}(feedEntryInfo, showFeedEntriesContext);
											node.addEventListener("click", clickFunction, false);
										};
									}(showFeedEntriesContext);
								grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedEntryNotNew']", showFeedEntriesContext.doc, showFeedEntriesContext.entryList, addMarkNotNewListenersFunction);
								
							};
						}(showFeedEntriesContext);
					showFeedEntriesContext.fillFeedEntriesFunction();
					showFeedEntriesContext.entryListUp();
					
					
					showFeedEntriesContext.fillIssues();
					
					showFeedEntriesContext.entryList.style.display = "block";
					showFeedEntriesContext.entryListTop.style.display = "block";
					showFeedEntriesContext.entryListBottom.style.display = "block";
				};
			}(showFeedEntriesContext);
		
		var newsPaperList = doc.getElementById("newsPaperList");
		var refreshNewsPaperListFunction =
			function(newsPaperList, doc, newsPaperHolder, showFeedEntriesFunction)
			{
				return function()
				{
					var contentTab = [];
					
					var addNewsPaperToListFunction =
						function(contentTab)
						{
							return function(newsPaper, index, count)
							{
								contentTab.push(
								"<div class=\"newsPaper\">"
								);
								
								contentTab.push(
								"<span class=\"newsPaperName\">",
								"<img class=\"newsPaperImg\" src=\"chrome://grabMyBooks/content/icons/newsPapers/newsPaper"+(newsPaper.isLoading()?"_load":"")+".png\">",
								newsPaper.name,
								"</span>",
								"<span class=\"newsPaperEntryCounter\">",
								"("+newsPaper.feedEntryInfos.length+")",
								"</span>",
								"<img title=\"Refresh\" class=\"newsPaperRefresh\" src=\"chrome://grabMyBooks/content/icons/newsPapers/refresh.png\">",
								"<img title=\"Stop\" class=\"newsPaperStop\" src=\"chrome://grabMyBooks/content/icons/newsPapers/stop.png\">",
								"<div class=\"newsPaperEntryActions\">",
								"	<span class=\"newsPaperEntryActionsPlus\">+</span>",
								"	<span class=\"newsPaperEntryActionsPlusContent\">",
								"		<img title=\"Edit\" class=\"newsPaperEdit\" src=\"chrome://grabMyBooks/content/icons/newsPapers/edit.png\">",
								"		<img title=\"Move up\" class=\"newsPaperUp\" src=\"chrome://grabMyBooks/content/icons/newsPapers/up.png\">",
								"		<img title=\"Move down\" class=\"newsPaperDown\" src=\"chrome://grabMyBooks/content/icons/newsPapers/down.png\">",
								"		<img title=\"Large refresh\" style=\"visibility:hidden;\" class=\"newsPaperRefreshLong\" src=\"chrome://grabMyBooks/content/icons/newsPapers/refreshLong.png\">",
								"		<img title=\"Delete\" class=\"newsPaperDelete\" src=\"chrome://grabMyBooks/content/icons/newsPapers/delete.png\">",
								"		<div class=\"clearDates\">",
								"			<span class=\"clearDatesPlus\">+</span>",
								"			<span class=\"clearDatesContent\">",
								"				<img style=\"visibility:hidden;\" class=\"clearDateCache\" title=\"Clear last success cache date\" src=\"chrome://grabMyBooks/content/icons/newsPapers/cleanCacheDate.png\">",
								"				<img class=\"clearDateDelete\" title=\"Clear last delete date\" src=\"chrome://grabMyBooks/content/icons/newsPapers/cleanDeleteDate.png\">",
								"			</span>",
								"		</div>",
								"	</span>",
								"</div>",
								"</div>"
								);
							};
						}(contentTab);
					grabMyBooks.tabDo(grabMyBooks.newsPapers.newsPapers, addNewsPaperToListFunction);
					
					var content = contentTab.join("\n");
					grabMyBooks.setNodeContentFromString(doc, newsPaperList, content);
					
					var addNewsPaperEditClickListenerFunction =
						function(newsPaperHolder)
						{
							return function(node, index, count)
							{
								var showNewsPaperFunction =
									function(index, newsPaperHolder)
									{
										return function()
										{
											var newsPaperToShow = grabMyBooks.newsPapers.newsPapers[index];
											if(newsPaperToShow.isLoading())
											{
												return;
											}
											newsPaperHolder.showNewsPaperFormFunction(newsPaperToShow);
										};
									}(index, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", node, showNewsPaperFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='newsPaperEdit']", doc, newsPaperList, addNewsPaperEditClickListenerFunction);
					
					var addNewsPaperRefreshClickListenerFunction =
						function(newsPaperHolder, showFeedEntriesFunction)
						{
							return function(node, index, count)
							{
								var refreshNewsPaperFunction =
									function(index, newsPaperHolder)
									{
										return function()
										{
											newsPaperHolder.clearDisplayManager.clear();
											var newsPaperToRefresh = grabMyBooks.newsPapers.newsPapers[index];
											var onRefreshEndFunction =
												function(newsPaperHolder)
												{
													return function()
													{
														newsPaperHolder.refreshNewsPaperListFunction();
													};
												}(newsPaperHolder);
											newsPaperToRefresh.refreshFeedEntries(newsPaperHolder.refreshNewsPaperListFunction, onRefreshEndFunction, true, null);
											newsPaperHolder.refreshNewsPaperListFunction();
										};
									}(index, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", node, refreshNewsPaperFunction);
							};
						}(newsPaperHolder, showFeedEntriesFunction);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='newsPaperRefresh']", doc, newsPaperList, addNewsPaperRefreshClickListenerFunction);
					
					var addNewsPaperRefreshLongClickListenerFunction =
						function(newsPaperHolder, showFeedEntriesFunction)
						{
							return function(node, index, count)
							{
								var refreshLongNewsPaperFunction =
									function(index, newsPaperHolder)
									{
										return function()
										{
											newsPaperHolder.clearDisplayManager.clear();
											var newsPaperToRefresh = grabMyBooks.newsPapers.newsPapers[index];
											var onRefreshEndFunction =
												function(newsPaperHolder)
												{
													return function()
													{
														newsPaperHolder.refreshNewsPaperListFunction();
													};
												}(newsPaperHolder);
											newsPaperToRefresh.refreshFeedEntries(newsPaperHolder.refreshNewsPaperListFunction, onRefreshEndFunction, true, grabMyBooks.newsPapers.cacheRequestCounterBig);
											newsPaperHolder.refreshNewsPaperListFunction();
										};
									}(index, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", node, refreshLongNewsPaperFunction);
							};
						}(newsPaperHolder, showFeedEntriesFunction);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='newsPaperRefreshLong']", doc, newsPaperList, addNewsPaperRefreshLongClickListenerFunction);
					
					
					var addNewsPaperStopClickListenerFunction =
						function(newsPaperHolder)
						{
							return function(node, index, count)
							{
								var newsPaperToStop = grabMyBooks.newsPapers.newsPapers[index];
								if(newsPaperToStop.isLoading() && newsPaperToStop.stopLoadingFunction != null)
								{
									node.style.display = "inline";
									var stopFunction =
										function(newsPaperHolder, newsPaperToStop)
										{
											return function()
											{
												if(newsPaperToStop.isLoading() && newsPaperToStop.stopLoadingFunction != null)
												{
													newsPaperToStop.stopLoadingFunction();
													newsPaperToStop.stopLoadingFunction = null;
												}
											};
										}(newsPaperHolder, newsPaperToStop);
									grabMyBooks.attachNonEventFunction("click", node, stopFunction);
								}
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='newsPaperStop']", doc, newsPaperList, addNewsPaperStopClickListenerFunction);
					
					
					var showEntriesClickListenerFunction =
						function(showFeedEntriesFunction)
						{
							return function(node, index, count)
							{
								var showNewsPaperEntriesFunction =
									function(index, showFeedEntriesFunction)
									{
										return function()
										{
											var newsPaperToShow = grabMyBooks.newsPapers.newsPapers[index];
											if(newsPaperToShow.isLoading())
											{
												return;
											}
											showFeedEntriesFunction(newsPaperToShow);
										};
									}(index, showFeedEntriesFunction);
								grabMyBooks.attachNonEventFunction("click", node, showNewsPaperEntriesFunction);
							};
						}(showFeedEntriesFunction);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='newsPaperName']", doc, newsPaperList, showEntriesClickListenerFunction);
					
					var deleteNewsPaperClickListenerFunction =
						function(newsPaperHolder)
						{
							return function(node, index, count)
							{
								var deleteNewsPaperFunction =
									function(index, newsPaperHolder)
									{
										return function()
										{
											var newsPaperToDelete = grabMyBooks.newsPapers.newsPapers[index];
											if(newsPaperToDelete.isLoading())
											{
												return;
											}
											var deleteFunction =
												function(newsPaperToDelete, newsPaperHolder)
												{
													return function()
													{
														newsPaperHolder.clearDisplayManager.clear();
														grabMyBooks.newsPapers.deleteNewsPaper(newsPaperToDelete, newsPaperHolder.refreshNewsPaperListFunction);
													};
												}(newsPaperToDelete, newsPaperHolder);
											grabMyBooks.newsPapers.popin.askForAction("Are you sure to want to delete the newspaper named '"+grabMyBooks.escapeTagsExtended(newsPaperToDelete.name)+"' ?", deleteFunction, null);
											
										};
									}(index, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", node, deleteNewsPaperFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='newsPaperDelete']", doc, newsPaperList, deleteNewsPaperClickListenerFunction);
					
					var upNewsPaperClickListenerFunction =
						function(newsPaperHolder)
						{
							return function(node, index, count)
							{
								var upNewsPaperFunction =
									function(index, newsPaperHolder)
									{
										return function()
										{
											var newsPaperToUp = grabMyBooks.newsPapers.newsPapers[index];
											if(grabMyBooks.tabUp(grabMyBooks.newsPapers.newsPapers, newsPaperToUp.id))
											{
												grabMyBooks.newsPapers.saveNewsPaperPosition(newsPaperToUp);
												grabMyBooks.newsPapers.saveNewsPaperPosition(grabMyBooks.newsPapers.newsPapers[index]);
												newsPaperHolder.refreshNewsPaperListFunction();
											}
										};
									}(index, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", node, upNewsPaperFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='newsPaperUp']", doc, newsPaperList, upNewsPaperClickListenerFunction);
					
					var downNewsPaperClickListenerFunction =
						function(newsPaperHolder)
						{
							return function(node, index, count)
							{
								var downNewsPaperFunction =
									function(index, newsPaperHolder)
									{
										return function()
										{
											var newsPaperToDown = grabMyBooks.newsPapers.newsPapers[index];
											if(grabMyBooks.tabDown(grabMyBooks.newsPapers.newsPapers, newsPaperToDown.id))
											{
												grabMyBooks.newsPapers.saveNewsPaperPosition(newsPaperToDown);
												grabMyBooks.newsPapers.saveNewsPaperPosition(grabMyBooks.newsPapers.newsPapers[index]);
												newsPaperHolder.refreshNewsPaperListFunction();
											}
										};
									}(index, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", node, downNewsPaperFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='newsPaperDown']", doc, newsPaperList, downNewsPaperClickListenerFunction);
					
					
					var addNewsPaperClearDateCacheClickListenerFunction =
						function(newsPaperHolder)
						{
							return function(node, index, count)
							{
								var clearDateCacheNewsPaperFunction =
									function(index, newsPaperHolder)
									{
										return function()
										{
											var newsPaper = grabMyBooks.newsPapers.newsPapers[index];
											if(newsPaper.isLoading())
											{
												return;
											}
											var clearFunction =
												function(newsPaper)
												{
													return function(feedItem, index, count)
													{
														feedItem.lastCacheSuccessDate = null;
													};
												}(newsPaper);
											grabMyBooks.tabDo(newsPaper.feeds, clearFunction);
											grabMyBooks.newsPapers.saveNewsPaper(newsPaper);
											grabMyBooks.newsPapers.popin.showMessage("Last success cache date cleared");
										};
									}(index, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", node, clearDateCacheNewsPaperFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='clearDateCache']", doc, newsPaperList, addNewsPaperClearDateCacheClickListenerFunction);
					
					var addNewsPaperClearDateDeleteClickListenerFunction =
						function(newsPaperHolder)
						{
							return function(node, index, count)
							{
								var clearDateDeleteNewsPaperFunction =
									function(index, newsPaperHolder)
									{
										return function()
										{
											var newsPaper = grabMyBooks.newsPapers.newsPapers[index];
											if(newsPaper.isLoading())
											{
												return;
											}
											var clearFunction =
												function(newsPaper)
												{
													return function(feedItem, index, count)
													{
														feedItem.lastDeleteDate = null;
													};
												}(newsPaper);
											grabMyBooks.tabDo(newsPaper.feeds, clearFunction);
											grabMyBooks.newsPapers.saveNewsPaper(newsPaper);
											grabMyBooks.newsPapers.popin.showMessage("Last delete date cleared");
										};
									}(index, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", node, clearDateDeleteNewsPaperFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='clearDateDelete']", doc, newsPaperList, addNewsPaperClearDateDeleteClickListenerFunction);
					
				};
			}(newsPaperList, doc, newsPaperHolder, showFeedEntriesFunction);
		newsPaperHolder.refreshNewsPaperListFunction = refreshNewsPaperListFunction;
		
		var fillFeedsFunction =
			function(feedList, newsPaperHolder, doc)
			{
				return function()
				{
					var contentTab = [];
					var displayFeedFunction =
						function(contentTab)
						{
							return function(feed)
							{
								contentTab.push(
									"<div class=\"newsPaperFeed\">",
									"	<img class=\"feedIcon\" title=\"Feed infos\" alt=\"feedIcon\" src=\"chrome://grabMyBooks/content/icons/feeds/rss.png\">",
									"	<span class=\"feedTitle\" title=\""+feed.url+"\">"+feed.title+"</span>",
									"	<span class=\"feedColorPicker\" title=\"change color\">color<div class=\"feedColorSquare\" style=\"background:"+feed.color+";\"></div></span>",
									"	<img class=\"feedUp\" title=\"Move up\" src=\"chrome://grabMyBooks/content/icons/newsPapers/up.png\">",
									"	<img class=\"feedDown\" title=\"Move down\" src=\"chrome://grabMyBooks/content/icons/newsPapers/down.png\">",
									"	<img class=\"removeFeed\" title=\"remove feed from newspaper\" src=\"chrome://grabMyBooks/content/icons/newsPapers/delete.png\">",
									"</div>"
								);
							};
						}(contentTab);
					grabMyBooks.tabDo(newsPaperHolder.feeds, displayFeedFunction);
					var content = contentTab.join("\n");
					grabMyBooks.setNodeContentFromString(doc, feedList, content);
					
					var addDeleteFeedListener =
						function(newsPaperHolder)
						{
							return function(deleteNode, index, size)
							{
								var deleteFeedFunction =
									function(newsPaperHolder, index)
									{
										return function()
										{
											grabMyBooks.tabRemove(newsPaperHolder.feeds, newsPaperHolder.feeds[index].url);
											newsPaperHolder.fillFeedsFunction();
										};
									}(newsPaperHolder, index);
								grabMyBooks.attachNonEventFunction("click", deleteNode, deleteFeedFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='removeFeed']", doc, feedList, addDeleteFeedListener);
					
					var addChangeFeedNameListener =
						function(newsPaperHolder)
						{
							return function(feedTitle, index, size)
							{
								var changeFeedTitleFunction =
									function(newsPaperHolder, index)
									{
										return function()
										{
											var feedItemToUpdate = newsPaperHolder.feeds[index];
											var onNewNameFunction =
												function(newsPaperHolder, feedItemToUpdate)
												{
													return function(newName)
													{
														feedItemToUpdate.title = newName;
														newsPaperHolder.fillFeedsFunction();
													};
												}(newsPaperHolder, feedItemToUpdate);
											grabMyBooks.newsPapers.popin.askForInput("Enter a new name:", feedItemToUpdate.title, onNewNameFunction, null, null);
										};
									}(newsPaperHolder, index);
								grabMyBooks.attachNonEventFunction("click", feedTitle, changeFeedTitleFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedTitle']", doc, feedList, addChangeFeedNameListener);
					
					var addFeedIconListener =
						function(newsPaperHolder)
						{
							return function(feedTitle, index, size)
							{
								var showFeedInfoFunction =
									function(newsPaperHolder, index)
									{
										return function()
										{
											var feedItemToShow = newsPaperHolder.feeds[index];
											var message = "<table class=\"feedInfosTable\"><tr><td>Title </td><td>"+grabMyBooks.escapeTagsExtended(feedItemToShow.title)+"</td></tr><tr><td>Url </td><td>"+feedItemToShow.url+"</td></tr></table>";
											grabMyBooks.newsPapers.popin.showMessage(message);
										};
									}(newsPaperHolder, index);
								grabMyBooks.attachNonEventFunction("click", feedTitle, showFeedInfoFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedIcon']", doc, feedList, addFeedIconListener);
					
					var addChangeFeedColorFunction =
						function(doc, newsPaperHolder)
						{
							return function(colorNode, index, size)
							{
								var changeColorFunction =
									function(colorNode, index, doc, newsPaperHolder)
									{
										return function()
										{
											var toDoWithColorFunction =
												function(newsPaperHolder, doc, colorNode, index)
												{
													return function(selectedColor)
													{
														newsPaperHolder.feeds[index].color = selectedColor;
														var colorSquare = grabMyBooks.xml.xPathQueryNode(".//*[@class='feedColorSquare']", doc, colorNode);
														colorSquare.style.background = selectedColor;
													};
												}(newsPaperHolder, doc, colorNode, index);
											grabMyBooks.newsPapers.popin.askForColor(toDoWithColorFunction, null, newsPaperHolder.feeds[index].color)
										};
									}(colorNode, index, doc, newsPaperHolder);
								grabMyBooks.attachNonEventFunction("click", colorNode, changeColorFunction);
							};
						}(doc, newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedColorPicker']", doc, feedList, addChangeFeedColorFunction);
					
					
					var addUpFeedListener =
						function(newsPaperHolder)
						{
							return function(node, index, size)
							{
								var upFeedFunction =
									function(newsPaperHolder, index)
									{
										return function()
										{
											var feedUrl = newsPaperHolder.feeds[index].url;
											if(grabMyBooks.tabUp(newsPaperHolder.feeds, feedUrl))
											{
												newsPaperHolder.fillFeedsFunction();
											}
										};
									}(newsPaperHolder, index);
								grabMyBooks.attachNonEventFunction("click", node, upFeedFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedUp']", doc, feedList, addUpFeedListener);
					
					var addDownFeedListener =
						function(newsPaperHolder)
						{
							return function(node, index, size)
							{
								var downFeedFunction =
									function(newsPaperHolder, index)
									{
										return function()
										{
											var feedUrl = newsPaperHolder.feeds[index].url;
											if(grabMyBooks.tabDown(newsPaperHolder.feeds, feedUrl))
											{
												newsPaperHolder.fillFeedsFunction();
											}
										};
									}(newsPaperHolder, index);
								grabMyBooks.attachNonEventFunction("click", node, downFeedFunction);
							};
						}(newsPaperHolder);
					grabMyBooks.xml.xPathQueryFunction(".//*[@class='feedDown']", doc, feedList, addDownFeedListener);
				};
			}(feedList, newsPaperHolder, doc);
		newsPaperHolder.fillFeedsFunction = fillFeedsFunction;
		
		var fillFeedSelectFunction =
			function(getRegistredFeedsFunction, feedSelect, doc, newsPaperHolder)
			{
				return function()
				{
					grabMyBooks.setNodeContentFromString(doc, feedSelect, "<option value=\"\"></option>");
					var registredFeeds = getRegistredFeedsFunction();
					newsPaperHolder.selectableFeeds = registredFeeds;
					var addFeedToSelectFunction =
						function(feedSelect, doc)
						{
							return function(feedItem, index, count)
							{
								var optionNode = doc.createElement("option");
								var escapedOptionLabel = grabMyBooks.escapeTagsExtended(feedItem.title);
								grabMyBooks.setNodeContentFromString(doc, optionNode, escapedOptionLabel);
								feedSelect.appendChild(optionNode);
							};
						}(feedSelect, doc);
					grabMyBooks.tabDo(registredFeeds, addFeedToSelectFunction);
				};
			}(getRegistredFeedsFunction, feedSelect, doc, newsPaperHolder);
		
		var clearNewsPaperFormFunction =
			function(newsPaperHolder, newsPaperNameInput, fillFeedsFunction, newFeedInput, entriesOrderBySelect, cacheCheckbox, newsPaperFormErrorMessage)
			{
				return function()
				{
					newsPaperNameInput.value="";
					newsPaperHolder.feeds = [];
					fillFeedsFunction();
					newFeedInput.value = "";
					cacheCheckbox.checked = true;
					entriesOrderBySelect.selectedIndex = 0;
					grabMyBooks.setNodeContentFromString(doc, newsPaperFormErrorMessage, "");
				};
			}(newsPaperHolder, newsPaperNameInput, fillFeedsFunction, newFeedInput, entriesOrderBySelect, cacheCheckbox, newsPaperFormErrorMessage);
		
		var initNewsPaperFormFunction =
			function(newsPaperHolder, fillFeedsFunction, newsPaperNameInput, entriesOrderBySelect, cacheCheckbox)
			{
				return function(newsPaperToEdit)
				{
					newsPaperNameInput.value = newsPaperToEdit.name;
					newsPaperHolder.feeds = grabMyBooks.tabCopy(newsPaperToEdit.feeds);
					fillFeedsFunction();
					if(newsPaperToEdit.orderBy=="feed")
					{
						entriesOrderBySelect.selectedIndex = 1;
					}
					if(newsPaperToEdit.feeds.length>0 && !newsPaperToEdit.feeds[0].useCache)
					{
						cacheCheckbox.checked = false;
					}
				};
			}(newsPaperHolder, fillFeedsFunction, newsPaperNameInput, entriesOrderBySelect, cacheCheckbox);
		
		var showNewsPaperFormFunction =
			function(newsPaperForm, fillFeedSelectFunction, newsPaperHolder, clearNewsPaperFormFunction, initNewsPaperFormFunction)
			{
				return function(newsPaperToEdit)
				{
					newsPaperHolder.clearDisplayManager.clear();
					clearNewsPaperFormFunction();
					newsPaperForm.style.display = "block";
					fillFeedSelectFunction();
					newsPaperHolder.newsPaperToEdit = newsPaperToEdit;
					
					if(newsPaperToEdit.id != null)
					{
						initNewsPaperFormFunction(newsPaperToEdit);
					}
				};
			}(newsPaperForm, fillFeedSelectFunction, newsPaperHolder, clearNewsPaperFormFunction, initNewsPaperFormFunction);
		newsPaperHolder.showNewsPaperFormFunction = showNewsPaperFormFunction;
		
		var showNewsPaperFormForAddFunction =
			function(showNewsPaperFormFunction)
			{
				return function()
				{
					showNewsPaperFormFunction(new grabMyBooks.newsPapers.NewsPaper());
				};
			}(showNewsPaperFormFunction);
		
		grabMyBooks.attachNonEventFunction("click", addNewsPaperButton, showNewsPaperFormForAddFunction);
		
		
		var newFeedInputChangeFunction =
			function(newFeedInput, feedSelect)
			{
				return function()
				{
					if(!grabMyBooks.isEmpty(newFeedInput.value))
					{
						feedSelect.selectedIndex=0;
					}
				};
			}(newFeedInput, feedSelect);
		var selectFeedChangeFunction =
			function(newFeedInput, feedSelect)
			{
				return function()
				{
					if(feedSelect.selectedIndex>0)
					{
						newFeedInput.value="";
					}
				};
			}(newFeedInput, feedSelect);
		grabMyBooks.attachNonEventFunction("change", newFeedInput, newFeedInputChangeFunction);
		grabMyBooks.attachNonEventFunction("change", feedSelect, selectFeedChangeFunction);
		
		var checkNewsPaperFormFunction =
			function(newsPaperHolder, showNewsPaperFormErrorMessage, newsPaperNameInput)
			{
				return function()
				{
					var errorTab = [];
					if(grabMyBooks.isEmpty(newsPaperNameInput.value))
					{
						errorTab.push("Name must be filled.");
					}
					if(newsPaperHolder.feeds.length==0)
					{
						errorTab.push("There must be at list one feed in the feed list.");
					}
					if(errorTab.length>0)
					{
						showNewsPaperFormErrorMessage(errorTab);
						return false;
					}
					return true;
				};
			}(newsPaperHolder, showNewsPaperFormErrorMessage, newsPaperNameInput);
			
		var validateNewsPaperFormFunction =
			function(newsPaperHolder, newsPaperForm, checkNewsPaperFormFunction, newsPaperNameInput, entriesOrderBySelect, cacheCheckbox, refreshNewsPaperListFunction)
			{
				return function()
				{
					if(newsPaperHolder.newsPaperToEdit.isLoading())
					{
						return;
					}
					if(!checkNewsPaperFormFunction())
					{
						return;
					}
					newsPaperHolder.newsPaperToEdit.name = newsPaperNameInput.value.trim();
					newsPaperHolder.newsPaperToEdit.orderBy = entriesOrderBySelect.options[entriesOrderBySelect.selectedIndex].value;
					var feedsAdded = newsPaperHolder.newsPaperToEdit.setFeeds(newsPaperHolder.feeds);
					
					var useCache = cacheCheckbox.checked;
					var setUseCacheFunction =
						function(useCache)
						{
							return function(feed, index, count)
							{
								feed.useCache = useCache;
							};
						}(useCache);
					grabMyBooks.tabDo(newsPaperHolder.newsPaperToEdit.feeds, setUseCacheFunction);
					
					if(newsPaperHolder.newsPaperToEdit.id == null)
					{
						grabMyBooks.newsPapers.newsPapers.push(newsPaperHolder.newsPaperToEdit);
					}
					grabMyBooks.newsPapers.saveNewsPaper(newsPaperHolder.newsPaperToEdit);
					newsPaperForm.style.display = "none";
					if(feedsAdded)
					{
						newsPaperHolder.newsPaperToEdit.refreshFeedEntries(refreshNewsPaperListFunction, refreshNewsPaperListFunction, true, null);
					}
					refreshNewsPaperListFunction();
				};
			}(newsPaperHolder, newsPaperForm, checkNewsPaperFormFunction, newsPaperNameInput, entriesOrderBySelect, cacheCheckbox, refreshNewsPaperListFunction);
		grabMyBooks.attachNonEventFunction("click", newsPaperFormOkButton, validateNewsPaperFormFunction);
		
		var cancelNewsPaperFormFunction =
			function(newsPaperForm)
			{
				return function()
				{
					newsPaperForm.style.display = "none";
				};
			}(newsPaperForm);
		grabMyBooks.attachNonEventFunction("click", newsPaperFormCancelButton, cancelNewsPaperFormFunction);
		
		var getFeedToAddUrlFunction =
			function(newFeedInput, feedSelect, newsPaperHolder)
			{
				return function()
				{
					if(feedSelect.selectedIndex>0)
					{
						var selectedFeedItem = newsPaperHolder.selectableFeeds[feedSelect.selectedIndex-1];
						return selectedFeedItem.url;
					}
					return newFeedInput.value.trim();
				};
			}(newFeedInput, feedSelect, newsPaperHolder);
		
		var addFeedFunction =
			function(getFeedToAddUrlFunction, fillFeedsFunction, newsPaperHolder)
			{
				return function()
				{
					var feedToAddUrl = getFeedToAddUrlFunction();
					if(grabMyBooks.isEmpty(feedToAddUrl))
					{
						return;
					}
					if(grabMyBooks.tabGet(newsPaperHolder.feeds, feedToAddUrl)!=null)
					{
						grabMyBooks.newsPapers.popin.showMessage("Feed already in the newsPaper");
						return;
					};
					var addFeedSuccessFunction =
						function(newFeedInput, feedSelect, newsPaperHolder, fillFeedsFunction)
						{
							return function(addedFeedItem)
							{
								if(grabMyBooks.isEmpty(addedFeedItem.title))
								{
									addedFeedItem.title = "???";
								}
								
								var validateColorFunction =
									function(newsPaperHolder)
									{
										return function(color)
										{
											var containsColorFunction =
												function(color)
												{
													return function(feedItem)
													{
														return (feedItem.color==color);
													};
												}(color);
											return !grabMyBooks.tabContains(newsPaperHolder.feeds, containsColorFunction);
										};
									}(newsPaperHolder);
								
								var feedColor = grabMyBooks.color.generateValidColor(validateColorFunction);
								addedFeedItem.color = feedColor;
								newsPaperHolder.feeds.push(addedFeedItem);
								feedSelect.selectedIndex=0;
								newFeedInput.value="";
								try{
								fillFeedsFunction();
								}catch(e){grabMyBooks.ext.alert(e+"::"+e.lineNumber);}
							};
						}(newFeedInput, feedSelect, newsPaperHolder, fillFeedsFunction);
					var addFeedErrorFunction =
						function(errorMessage)
						{
							grabMyBooks.newsPapers.popin.showMessage("Couldn't find a feed from url provided");
						};
					grabMyBooks.feeds.addFeedBase(feedToAddUrl, addFeedSuccessFunction, addFeedErrorFunction);
				};
			}(getFeedToAddUrlFunction, fillFeedsFunction, newsPaperHolder);
		grabMyBooks.attachNonEventFunction("click", addFeedButton, addFeedFunction);
		
		var loadNewsPapersOnEndFunction =
			function(refreshNewsPaperListFunction)
			{
				return function()
				{
					grabMyBooks.newsPapers.orderNewsPapers();
					refreshNewsPaperListFunction();
				};
			}(refreshNewsPaperListFunction);
		
		grabMyBooks.newsPapers.loadNewsPapers(loadNewsPapersOnEndFunction);
		
		refreshNewsPaperListFunction();
};
grabMyBooks.newsPapers.newsPapersDirName = "newsPapers";
grabMyBooks.newsPapers.newsPapersGlobalConfigFileName = "newsPapers.xml";
grabMyBooks.newsPapers.newsPapersConfigFileName = "newsPaper.xml";
grabMyBooks.newsPapers.newsPapersPositionConfigFileName = "newsPaper_pos.xml";
grabMyBooks.newsPapers.getNewsPapersDir = function()
{
	var saveDir = grabMyBooks.ext.initSaveDir();
	var result = grabMyBooks.ext.getOrCreateDir(grabMyBooks.ext.path(saveDir), grabMyBooks.newsPapers.newsPapersDirName);
	return result;
};
grabMyBooks.newsPapers.getNewsPaperDir = function(newsPaper)
{
	if(newsPaper.id == null)
	{
		return null;
	}
	var newsPapersDir = grabMyBooks.newsPapers.getNewsPapersDir();
	var dirName = grabMyBooks.newsPapers.getNewsPaperDirName(newsPaper);
	var newsPaperDir = grabMyBooks.ext.getOrCreateDir(grabMyBooks.ext.path(newsPapersDir), dirName);
	return newsPaperDir;
};
grabMyBooks.newsPapers.getNewsPaperSqlFile = function(newsPaper)
{
	var newsPaperSqlFile = grabMyBooks.newsPapers.getNewsPaperDir(newsPaper);
	newsPaperSqlFile.append("db");
	return newsPaperSqlFile;
};
grabMyBooks.newsPapers.getNewsPaperSqlQueue = function(newsPaper)
{
	var newsPaperSqlFile = grabMyBooks.newsPapers.getNewsPaperSqlFile(newsPaper);
	var initDb = !newsPaperSqlFile.exists();
	var newsPaperSqlConnection = grabMyBooks.sql.getConnection(newsPaperSqlFile);
	var result = new grabMyBooks.sql.Queue(newsPaperSqlConnection);
	
	if(!initDb)
	{
		return result;
	}
	var initSql = "CREATE TABLE ENTRIES(F_URL TEXT, E_URL TEXT, E_NAME TEXT, E_CONTENT TEXT, E_DATE TEXT, E_NEW INTEGER DEFAULT 1, E_STATE INTEGER DEFAULT 0)";
	var idx1Sql = "CREATE INDEX IDX_E_URL ON ENTRIES(E_URL)";
	var idx2Sql = "CREATE INDEX IDX_F_URL ON ENTRIES(F_URL)";
	var idx2Sql = "CREATE INDEX IDX_E_DATE ON ENTRIES(E_DATE)";
	var issuesSql1 = "CREATE TABLE BOOK(B_ID INTEGER PRIMARY KEY, B_TITLE TEXT, B_DESC TEXT, B_LANG TEXT, B_RULE TEXT, B_COVER TEXT, B_DATE TEXT, B_ORDER INTEGER)";
	var issuesSql2 = "CREATE TABLE ARTICLE(A_PARENT_BOOK_ID INTEGER, A_TITLE TEXT, A_URL TEXT, A_RULE TEXT, A_ORDER INTEGER, A_DATE TEXT, A_ORIGIN TEXT)";
	
	result.sqlDoTab([initSql, idx1Sql, idx2Sql, issuesSql1, issuesSql2]);
	
	return result;
};
grabMyBooks.newsPapers.saveGlobalConfig = function()
{
	var newsPapersSaveDir = grabMyBooks.newsPapers.getNewsPapersDir();
	var contentTab = [];
	contentTab.push(
		"<newsPapers>",
		"	<counter>",
		"		"+grabMyBooks.newsPapers.counter,
		"	</counter>",
		"</newsPapers>"
	);
	var content = contentTab.join("\n");
	grabMyBooks.ext.writeFile(newsPapersSaveDir, grabMyBooks.newsPapers.newsPapersGlobalConfigFileName, content);
};

grabMyBooks.newsPapers.getEntriesFileName = function(id)
{
	var fileName = grabMyBooks.addZerosIfNeeded(id, 8);
	fileName = "e"+fileName+".xml";
	return fileName;
};

grabMyBooks.newsPapers.orderNewsPapers = function()
{
	if(grabMyBooks.newsPapers.ordered)
	{
		return;
	}
	var sortNewsPapersFunction =
		function(newsPaper1, newsPaper2)
		{
			var order1 = grabMyBooks.newsPapers.getNewsPaperPosition(newsPaper1);
			var order2 = grabMyBooks.newsPapers.getNewsPaperPosition(newsPaper2);
			return order1 - order2;
		};
	grabMyBooks.newsPapers.newsPapers.sort(sortNewsPapersFunction);
	grabMyBooks.newsPapers.ordered = true;
};

grabMyBooks.newsPapers.getNewsPaperPosition = function(newsPaper)
{
	var newsPaperDir = grabMyBooks.newsPapers.getNewsPaperDir(newsPaper);
	var newsPaperPositionConfigFileDom = grabMyBooks.xml.getXmlDocFromFile(newsPaperDir, grabMyBooks.newsPapers.newsPapersPositionConfigFileName);
	if(newsPaperPositionConfigFileDom == null)
	{
		return -1;
	}
	var newsPaperNode = grabMyBooks.xml.xPathQueryNode("./newsPaper", newsPaperPositionConfigFileDom, null);
	var newsPaperPosition = grabMyBooks.xml.getXPathPropertyInt(newsPaperPositionConfigFileDom, newsPaperNode, "position");
	return newsPaperPosition;
};

grabMyBooks.newsPapers.getNewsPaperSortFunction = function(newsPaper, desc, forceBy)
{
	var sortEntriesFunction;
	if( (forceBy==null && newsPaper.orderBy=="date") || forceBy == "date")
	{
		sortEntriesFunction =
			function(feedEntryInfo1, feedEntryInfo2)
			{
				var result;
				if(desc)
				{
					result = feedEntryInfo2.date.localeCompare(feedEntryInfo1.date);
				}
				else
				{
					result = feedEntryInfo1.date.localeCompare(feedEntryInfo2.date);
				}
				return result;
			};
	}
	else
	{
		sortEntriesFunction =
			function(newsPaper)
			{
				return function(feedEntryInfo1, feedEntryInfo2)
				{
					var dayDate1 = feedEntryInfo1.date.substring(0, 10);
					var dayDate2 = feedEntryInfo2.date.substring(0, 10);
					if( (forceBy==null) && (dayDate1 != dayDate2) )
					{
						if(desc)
						{
							return dayDate2.localeCompare(dayDate1);
						}
						else
						{
							return dayDate1.localeCompare(dayDate2);
						}
					}
					var feedEntryInfo1ParentUrl = grabMyBooks.isEmptyObject(feedEntryInfo1.parentFeedUrl)?feedEntryInfo1.origin:feedEntryInfo1.parentFeedUrl;
					var feedEntryInfo2ParentUrl = grabMyBooks.isEmptyObject(feedEntryInfo2.parentFeedUrl)?feedEntryInfo2.origin:feedEntryInfo2.parentFeedUrl;
					var feedPosition1 = grabMyBooks.tabIndex(newsPaper.feeds, feedEntryInfo1ParentUrl);
					var feedPosition2 = grabMyBooks.tabIndex(newsPaper.feeds, feedEntryInfo2ParentUrl);
					if(feedPosition1 == -1)
					{
						feedPosition1 = 100000 + feedEntryInfo1.title.length;
					}
					if(feedPosition2 == -1)
					{
						feedPosition1 = 100000 + feedEntryInfo2.title.length;
					}
					if(feedPosition1 == feedPosition2)
					{
						if(desc)
						{
							return feedEntryInfo2.date.localeCompare(feedEntryInfo1.date);
						}
						else
						{
							return feedEntryInfo1.date.localeCompare(feedEntryInfo2.date);
						}
					}
					var result = (feedPosition1 - feedPosition2);
					return result;
				};
			}(newsPaper);
	}
	return sortEntriesFunction;
};

grabMyBooks.newsPapers.loadNewsPapers = function(onEndFunction)
{
	if(grabMyBooks.newsPapers.loaded)
	{
		return;
	}
	
	var newsPapersDir = grabMyBooks.newsPapers.getNewsPapersDir();
	
	var newsPapersGlobalConfigFileDom = grabMyBooks.xml.getXmlDocFromFile(newsPapersDir, grabMyBooks.newsPapers.newsPapersGlobalConfigFileName);
	if(newsPapersGlobalConfigFileDom == null)
	{
		grabMyBooks.newsPapers.loaded = true;
		return;
	}
	var newsPapersNode = grabMyBooks.xml.xPathQueryNode("./newsPapers", newsPapersGlobalConfigFileDom, null);
	var newsPapersCounter = grabMyBooks.xml.getXPathPropertyInt(newsPapersGlobalConfigFileDom, newsPapersNode, "counter");
	grabMyBooks.newsPapers.counter = newsPapersCounter;
	
	var loadNewsPaperFunction =
		function(newsPaperId, newsPaperDir, onEndFunction)
		{
			var newsPaperFileDom = grabMyBooks.xml.getXmlDocFromFile(newsPaperDir, grabMyBooks.newsPapers.newsPapersConfigFileName);
			var newsPaperNode = grabMyBooks.xml.xPathQueryNode("./newsPaper", newsPaperFileDom, null);
			var newsPaperName = grabMyBooks.xml.getXPathPropertyUnescaped(newsPaperFileDom, newsPaperNode, "name");
			var newsPaperIssueCounter = grabMyBooks.xml.getXPathPropertyInt(newsPaperFileDom, newsPaperNode, "issueCounter");
			var newsPaperOrderBy = grabMyBooks.xml.getXPathProperty(newsPaperFileDom, newsPaperNode, "orderBy");
			var newsPaper = new grabMyBooks.newsPapers.NewsPaper();
			newsPaper.id = newsPaperId;
			newsPaper.name = newsPaperName;
			newsPaper.issueCounter = newsPaperIssueCounter;
			newsPaper.orderBy = newsPaperOrderBy;
			grabMyBooks.newsPapers.newsPapers.push(newsPaper);
			
			var loadFeedsFunction =
				function(newsPaperFileDom, newsPaper)
				{
					return function(feedNode, index, count)
					{
						var name = grabMyBooks.xml.getXPathPropertyUnescaped(newsPaperFileDom, feedNode, "name");
						var url = grabMyBooks.xml.getXPathProperty(newsPaperFileDom, feedNode, "url");
						var color = grabMyBooks.xml.getXPathProperty(newsPaperFileDom, feedNode, "color");
						var useCache = grabMyBooks.xml.getXPathPropertyBoolean(newsPaperFileDom, feedNode, "useCache");
						var lastCacheSuccessDate = grabMyBooks.xml.getXPathProperty(newsPaperFileDom, feedNode, "lastCacheSuccessDate");
						var lastDeleteDate = grabMyBooks.xml.getXPathProperty(newsPaperFileDom, feedNode, "lastDeleteDate");
						var feedItem = grabMyBooks.feeds.createDummyFeed(name, url);
						feedItem.color = color;
						feedItem.useCache = useCache;
						feedItem.lastCacheSuccessDate = null;
						if(!grabMyBooks.isEmpty(lastCacheSuccessDate))
						{
							feedItem.lastCacheSuccessDate = lastCacheSuccessDate;
						}
						feedItem.lastDeleteDate = null;
						if(!grabMyBooks.isEmpty(lastDeleteDate))
						{
							feedItem.lastDeleteDate = lastDeleteDate;
						}
						newsPaper.feeds.push(feedItem);
					};
				}(newsPaperFileDom, newsPaper);
			grabMyBooks.xml.xPathQueryFunction("./feeds/feed", newsPaperFileDom, newsPaperNode, loadFeedsFunction);
			
			var loadEntriesSql = "SELECT F_URL, E_URL, E_NAME, E_CONTENT, E_DATE, E_NEW FROM ENTRIES";
			var newsPaperSqlQueue = newsPaper.getSqlQueue();
			var loadEntriesSqlToDoContext = new grabMyBooks.sql.SqlToDoContext(loadEntriesSql);
			loadEntriesSqlToDoContext.handleRowFunction =
				function(newsPaper)
				{
					return function(row)
					{
							var feedUrl = row.getResultByIndex(0);
							var entryUrl = row.getResultByIndex(1);
							var entryName = row.getResultByIndex(2);
							var entryDescription = row.getResultByIndex(3);
							var entryDate = row.getResultByIndex(4);
							var entryNew = row.getResultByIndex(5);
							var feedEntryInfo = new grabMyBooks.newsPapers.FeedEntryInfo(feedUrl, entryUrl, entryName, entryDescription, entryDate);
							feedEntryInfo.isNew = (entryNew==1);
							newsPaper.feedEntryInfos.push(feedEntryInfo);
					};
				}(newsPaper);
			loadEntriesSqlToDoContext.onEndFunction = onEndFunction;
			newsPaperSqlQueue.sqlDo(loadEntriesSqlToDoContext);
		
			var getIssuesSql =
				"SELECT B_ID, B_TITLE, B_DESC, B_LANG, B_RULE, B_COVER, B_DATE FROM BOOK ORDER BY B_ORDER";
			var getIssuesSqlToDoContext = new grabMyBooks.sql.SqlToDoContext(getIssuesSql);
			getIssuesSqlToDoContext.handleRowFunction =
				function(newsPaper)
				{
					return function(row)
					{
							var issueId = row.getResultByIndex(0);
							var issueTitle = row.getResultByIndex(1);
							var issueDesc = row.getResultByIndex(2);
							var issueLang = row.getResultByIndex(3);
							var issueRule = row.getResultByIndex(4);
							var issueCover = row.getResultByIndex(5);
							var issueDate = row.getResultByIndex(6);
							
							var issueLinkBook = new grabMyBooks.linkBook.LinkBook(issueTitle, issueDesc);
							issueLinkBook.lang = issueLang;
							issueLinkBook.globalRule = issueRule;
							issueLinkBook.cover = issueCover;
							var newsPaperIssue = new grabMyBooks.newsPapers.NewsPaperIssue(issueLinkBook);
							newsPaperIssue.issueNumber = issueId;
							newsPaperIssue.date = issueDate;
							newsPaper.issues.push(newsPaperIssue);
							
							var loadIssueArticlesSql =
								"SELECT A_TITLE, A_URL, A_RULE, A_DATE, A_ORIGIN FROM ARTICLE WHERE A_PARENT_BOOK_ID=:a_parent_book_id ORDER BY A_ORDER";
							var loadIssueArticlesSqlToDoContext =
								new grabMyBooks.sql.SqlToDoContext(loadIssueArticlesSql);
							loadIssueArticlesSqlToDoContext.prepareFunction =
								function(newsPaperIssue)
								{
									return function(statement)
									{
										statement.params.a_parent_book_id = newsPaperIssue.issueNumber;
									};
								}(newsPaperIssue);
							loadIssueArticlesSqlToDoContext.handleRowFunction =
								function(newsPaperIssue)
								{
									return function(row)
									{
										var title = row.getResultByIndex(0);
										var url = row.getResultByIndex(1);
										var rule = row.getResultByIndex(2);
										var date = row.getResultByIndex(3);
										var origin = row.getResultByIndex(4);
										
										var linkBookArticle =
											new grabMyBooks.linkBook.LinkBookArticle(title, url, rule, date, origin);
										newsPaperIssue.linkBook.addArticle(linkBookArticle);
									};
								}(newsPaperIssue);
							newsPaper.getSqlQueue().sqlDo(loadIssueArticlesSqlToDoContext);
					};
				}(newsPaper);
			getIssuesSqlToDoContext.onEndFunction = onEndFunction;
			newsPaperSqlQueue.sqlDo(getIssuesSqlToDoContext);
		};
	
	var dirFilesIterator = newsPapersDir.directoryEntries;
	var currentFile;
	var currentNewsPaperFile;
	var currentFileName;
	var currentNewsPaperId;
	while(dirFilesIterator.hasMoreElements())
	{
		currentFile = dirFilesIterator.getNext().QueryInterface(Components.interfaces.nsILocalFile);
		if(!currentFile.isDirectory())
		{
			continue;
		}
		currentFileName = grabMyBooks.ext.leafName(currentFile);
		if(currentFileName.length != 8)
		{
			continue;
		}
		try
		{
			currentNewsPaperId = parseInt(currentFileName, 10);
		}
		catch(e)
		{
			grabMyBooks.ext.alert(e);
			continue;
		}
		currentNewsPaperFile = grabMyBooks.ext.createFile();
		currentNewsPaperFile.initWithPath(grabMyBooks.ext.path(currentFile));
		currentNewsPaperFile.append(grabMyBooks.newsPapers.newsPapersConfigFileName);
		if(!currentNewsPaperFile.exists())
		{
			continue;
		}
		if(!currentNewsPaperFile.isFile())
		{
			continue;
		}
		loadNewsPaperFunction(currentNewsPaperId, currentFile, onEndFunction);
	};
	grabMyBooks.newsPapers.loaded = true;
	
};

grabMyBooks.newsPapers.deleteNewsPaper = function(newsPaper, onEndFunction)
{
	var onCloseFunction =
		function(newsPaper, onEndFunction)
		{
			return function()
			{
				grabMyBooks.tabRemove(grabMyBooks.newsPapers.newsPapers, newsPaper.id);
				var newsPaperDir = grabMyBooks.newsPapers.getNewsPaperDir(newsPaper);
				newsPaperDir.remove(true);
				if(onEndFunction != null)
				{
					onEndFunction();
				}
			};
		}(newsPaper, onEndFunction);
	newsPaper.getSqlQueue().close(onCloseFunction);
};

grabMyBooks.newsPapers.deleteNewsPaperIssue = function(newsPaper, newsPaperIssue, onEndFunction)
{
	grabMyBooks.tabRemove(newsPaper.issues, newsPaperIssue.issueNumber);
	
	var deleteIssueArticlesSql = "DELETE FROM ARTICLE WHERE A_PARENT_BOOK_ID=:bookId";
	var deleteIssueSql = "DELETE FROM BOOK WHERE B_ID=:bookId";
	
	var deleteIssueArticlesSqlToDoContext =
		new grabMyBooks.sql.SqlToDoContext(deleteIssueArticlesSql);
	var deleteIssueSqlToDoContext =
		new grabMyBooks.sql.SqlToDoContext(deleteIssueSql);
	var prepareFunction =
		function(newsPaperIssue)
		{
			return function(statement)
			{
				statement.params.bookId = newsPaperIssue.issueNumber;
			};
		}(newsPaperIssue);
	deleteIssueArticlesSqlToDoContext.prepareFunction = prepareFunction;
	deleteIssueSqlToDoContext.prepareFunction = prepareFunction;
	deleteIssueSqlToDoContext.onEndFunction = onEndFunction;
	newsPaper.getSqlQueue().sqlDo(deleteIssueArticlesSqlToDoContext);
	newsPaper.getSqlQueue().sqlDo(deleteIssueSqlToDoContext);
};

grabMyBooks.newsPapers.deleteNewsPaperIssueArticle = function(newsPaper, newsPaperIssue, articleUrl, onEndFunction)
{
	grabMyBooks.tabRemove(newsPaperIssue.linkBook.linkBookArticles, articleUrl);
	var deleteNewsPaperIssueArticleSql = 
		"DELETE FROM ARTICLE WHERE A_PARENT_BOOK_ID=:bookId AND A_URL=:articleUrl";
	var deleteNewsPaperIssueArticleSqlToDoContext =
		new grabMyBooks.sql.SqlToDoContext(deleteNewsPaperIssueArticleSql);
	var prepareFunction =
		function(newsPaperIssue, articleUrl)
		{
			return function(statement)
			{
				statement.params.bookId = newsPaperIssue.issueNumber;
				statement.params.articleUrl = articleUrl;
			};
		}(newsPaperIssue, articleUrl);
	deleteNewsPaperIssueArticleSqlToDoContext.prepareFunction = prepareFunction;
	deleteNewsPaperIssueArticleSqlToDoContext.onEndFunction = onEndFunction;
	newsPaper.getSqlQueue().sqlDo(deleteNewsPaperIssueArticleSqlToDoContext);
};

grabMyBooks.newsPapers.saveNewsPaperIssueArticlesOrder = function(newsPaper, newsPaperIssue, onEndFunction)
{
	var newsPaperIssueArticleOrderSql = 
		"UPDATE ARTICLE SET A_ORDER=:order WHERE A_PARENT_BOOK_ID=:bookId AND A_URL=:articleUrl";
	var newsPaperIssueArticlesOrderSqlToDoContext =
		new grabMyBooks.sql.SqlToDoContext(newsPaperIssueArticleOrderSql);
	
	newsPaperIssueArticlesOrderSqlToDoContext.prepareFunction =
		function(newsPaperIssue)
		{
			return function(statement)
			{
				var paramsArray = statement.newBindingParamsArray();
				var paramLineFunction =
					function(newsPaperIssue, paramsArray)
					{
						return function(linkBookArticle, index, count)
						{
							var bindingParams = paramsArray.newBindingParams();
							bindingParams.bindByName("bookId", newsPaperIssue.issueNumber);
							bindingParams.bindByName("articleUrl", linkBookArticle.url);
							bindingParams.bindByName("order", index);
							paramsArray.addParams(bindingParams);
						};
					}(newsPaperIssue, paramsArray);
				grabMyBooks.tabDo(newsPaperIssue.linkBook.linkBookArticles, paramLineFunction);
				statement.bindParameters(paramsArray);
			};
		}(newsPaperIssue);
	newsPaperIssueArticlesOrderSqlToDoContext.onEndFunction = onEndFunction;
	newsPaper.getSqlQueue().sqlDo(newsPaperIssueArticlesOrderSqlToDoContext);
};

grabMyBooks.newsPapers.saveNewsPaperIssuesOrder = function(newsPaper, onEndFunction)
{
	var newsPaperIssueOrderSql = 
		"UPDATE BOOK SET B_ORDER=:order WHERE B_ID=:bookId";
	var newsPaperIssuesOrderSqlToDoContext =
		new grabMyBooks.sql.SqlToDoContext(newsPaperIssueOrderSql);
	
	newsPaperIssuesOrderSqlToDoContext.prepareFunction =
		function(newsPaper)
		{
			return function(statement)
			{
				var paramsArray = statement.newBindingParamsArray();
				var paramLineFunction =
					function(paramsArray)
					{
						return function(newsPaperIssue, index, count)
						{
							var bindingParams = paramsArray.newBindingParams();
							bindingParams.bindByName("bookId", newsPaperIssue.issueNumber);
							bindingParams.bindByName("order", index);
							paramsArray.addParams(bindingParams);
						};
					}(paramsArray);
				grabMyBooks.tabDo(newsPaper.issues, paramLineFunction);
				statement.bindParameters(paramsArray);
			};
		}(newsPaper);
	newsPaperIssuesOrderSqlToDoContext.onEndFunction = onEndFunction;
	newsPaper.getSqlQueue().sqlDo(newsPaperIssuesOrderSqlToDoContext);
};

grabMyBooks.newsPapers.setFeedEntryInfosNew = function(newsPaper, feedEntryInfoTab, isNew, onEndFunction)
{
	var setNewsPaperEntriesNewSql = 
		"UPDATE ENTRIES SET E_NEW=:eNew WHERE E_URL=:eUrl";
	var setNewsPaperEntriesNewSqlToDoContext =
		new grabMyBooks.sql.SqlToDoContext(setNewsPaperEntriesNewSql);
	
	setNewsPaperEntriesNewSqlToDoContext.prepareFunction =
		function(feedEntryInfoTab, isNew)
		{
			return function(statement)
			{
				var paramsArray = statement.newBindingParamsArray();
				var paramLineFunction =
					function(paramsArray, isNew)
					{
						return function(feedEntryInfo, index, count)
						{
							var bindingParams = paramsArray.newBindingParams();
							feedEntryInfo.isNew = isNew;
							bindingParams.bindByName("eNew", feedEntryInfo.isNew?1:0);
							bindingParams.bindByName("eUrl", feedEntryInfo.url);
							paramsArray.addParams(bindingParams);
						};
					}(paramsArray, isNew);
				grabMyBooks.tabDo(feedEntryInfoTab, paramLineFunction);
				statement.bindParameters(paramsArray);
			};
		}(feedEntryInfoTab, isNew);
	setNewsPaperEntriesNewSqlToDoContext.onEndFunction = onEndFunction;
	newsPaper.getSqlQueue().sqlDo(setNewsPaperEntriesNewSqlToDoContext);
};

grabMyBooks.newsPapers.saveNewsPaperPosition = function(newsPaper)
{
	var newsPaperDir = grabMyBooks.newsPapers.getNewsPaperDir(newsPaper);
	
	var newsPaperPosition = grabMyBooks.tabIndex(grabMyBooks.newsPapers.newsPapers, newsPaper.id);
	
	var contentTab = [];
	contentTab.push(
		"<newsPaper>",
		"	<position>",
		"		"+newsPaperPosition,
		"	</position>",
		"</newsPaper>"
	);
	var content = contentTab.join("\n");
	grabMyBooks.ext.writeFile(newsPaperDir, grabMyBooks.newsPapers.newsPapersPositionConfigFileName, content);
	
};

grabMyBooks.newsPapers.saveNewsPaper = function(newsPaper)
{
	if(newsPaper.id == null)
	{
		var newsPaperId = grabMyBooks.newsPapers.counter++;
		newsPaper.id = newsPaperId;
		grabMyBooks.newsPapers.saveGlobalConfig();
	}
	
	var newsPaperDir = grabMyBooks.newsPapers.getNewsPaperDir(newsPaper);
	
	var contentTab = [];
	contentTab.push(
		"<newsPaper>",
		"	<name>",
		"		<![CDATA["+grabMyBooks.escapeTagsExtended(newsPaper.name)+"]]>",
		"	</name>",
		"	<orderBy>",
		"		"+newsPaper.orderBy,
		"	</orderBy>",
		"	<issueCounter>",
		"		"+newsPaper.issueCounter,
		"	</issueCounter>",
		"	<feeds>"
	);
	var getFeedXmlfunction =
		function(contentTab)
		{
			return function(feed, index, count)
			{
				contentTab.push(
					"		<feed>",
					"			<name>",
					"				<![CDATA["+grabMyBooks.escapeTagsExtended(feed.title)+"]]>",
					"			</name>",
					"			<url>",
					"				<![CDATA["+feed.url+"]]>",
					"			</url>",
					"			<color>",
					"				"+feed.color,
					"			</color>",
					"			<useCache>",
					"				"+(feed.useCache?"true":"false"),
					"			</useCache>",
					"			<lastCacheSuccessDate>",
					"			"+grabMyBooks.ifEmpty(feed.lastCacheSuccessDate, ""),
					"			</lastCacheSuccessDate>",
					"			<lastDeleteDate>",
					"			"+grabMyBooks.ifEmpty(feed.lastDeleteDate, ""),
					"			</lastDeleteDate>",
					"		</feed>"
				);
			};
		}(contentTab);
	grabMyBooks.tabDo(newsPaper.feeds, getFeedXmlfunction);
	contentTab.push(
		"	</feeds>",
		"</newsPaper>"
	);
	var content = contentTab.join("\n");
	grabMyBooks.ext.writeFile(newsPaperDir, grabMyBooks.newsPapers.newsPapersConfigFileName, content);
	
	grabMyBooks.newsPapers.saveNewsPaperPosition(newsPaper);
};
grabMyBooks.newsPapers.getNewsPaperDirName = function(newsPaper)
{
	var idString = grabMyBooks.addZerosIfNeeded(newsPaper.id, 8);
	return idString;
};

grabMyBooks.newsPapers.stopAllLoadings = function()
{
	var stopNewsPaperLoadingFunction =
		function(newsPaper, index, count)
		{
			if(newsPaper.isLoading() && newsPaper.stopLoadingFunction!=null)
			{
				newsPaper.stopLoadingFunction();
			}
		};
	grabMyBooks.tabDo(grabMyBooks.newsPapers.newsPapers, stopNewsPaperLoadingFunction);
};

grabMyBooks.newsPapers.shareIssue = function(newsPaperIssue)
{
	var linkBook = newsPaperIssue.linkBook.clone();
	
	var taskInfos = [];
	var addTaskInfoFunction =
		function(taskInfos)
		{
			return function(linkBookArticle, index, count)
			{
				var taskInfo = new grabMyBooks.popin.TaskInfo(linkBookArticle.url, "");
				taskInfos.push(taskInfo);
			};
		}(taskInfos);
	grabMyBooks.tabDo(linkBook.linkBookArticles, addTaskInfoFunction);
	
	var loadingProcessContext = new grabMyBooks.popin.LoadingProcessContext(taskInfos);
	var endFunction =
		function(linkBook)
		{
			return function()
			{
				linkBook.fillRules();
				linkBook.lang = grabMyBooks.options.defaultLanguage;
				grabMyBooks.newsPapers.popin.showBookWidget(linkBook);
			};
		}(linkBook);
	
	grabMyBooks.newsPapers.popin.hide();
	grabMyBooks.newsPapers.popin.showLoadingProcess(loadingProcessContext);
	
	var checkRedirectFunction =
		function(loadingProcessContext, linkBook, endFunction)
		{
			return function(linkBookArticle, index, count)
			{
				var url = linkBookArticle.url;
				var getLinkContentViaHttpChannelContext = new grabMyBooks.GetLinkContentViaHttpChannelContext(url);
				getLinkContentViaHttpChannelContext.onEndFunction =
					function(url, loadingProcessContext, endFunction)
					{
						return function()
						{
							loadingProcessContext.performTaskDone(url);
							if(loadingProcessContext.taskInfos.length>0)
							{
								return;
							}
							grabMyBooks.newsPapers.popin.hide();
							endFunction();
						};
					}(url, loadingProcessContext, endFunction);
				getLinkContentViaHttpChannelContext.onUrlChangeFunction =
					function(url, linkBook)
					{
						return function()
						{
							var newUrl = this.redirectUrl;
							if(newUrl.toLowerCase().trim().indexOf("http")!=0)
							{
								return;
							}
							var linkBookArticle = grabMyBooks.tabGet(linkBook.linkBookArticles, url);
							linkBookArticle.url = newUrl;
						};
					}(url, linkBook);
				grabMyBooks.ext.getLinkContentViaHttpChannel(getLinkContentViaHttpChannelContext);
			};
		}(loadingProcessContext, linkBook, endFunction);
	grabMyBooks.tabDo(linkBook.linkBookArticles, checkRedirectFunction);
};

grabMyBooks.newsPapers.cachePrefix = "http://www.google.com/reader/atom/feed/";
grabMyBooks.newsPapers.cacheRequestSize = 25;
grabMyBooks.newsPapers.cacheRequestCounterSmall = 12;
grabMyBooks.newsPapers.cacheRequestCounterBig = 80;
grabMyBooks.newsPapers.cacheSuffix = "?n="+grabMyBooks.newsPapers.cacheRequestSize;
grabMyBooks.newsPapers.isCacheUrl = function(url)
{
	var result = ((url.indexOf(grabMyBooks.newsPapers.cachePrefix)==0) && (url.indexOf(grabMyBooks.newsPapers.cacheSuffix)==(url.length-grabMyBooks.newsPapers.cacheSuffix.length)));
	return result;
};
grabMyBooks.newsPapers.addCacheUrl = function(url)
{
	var result = grabMyBooks.newsPapers.cachePrefix+url+grabMyBooks.newsPapers.cacheSuffix;
	return result;
};
grabMyBooks.newsPapers.removeHrefFromTitle = function(text)
{
	if(grabMyBooks.isEmpty(text))
	{
		return text;
	}
	if(text.indexOf("<a")!=0)
	{
		return text;
	}
	var endOfAIndex = text.indexOf(">", 2);
	if(endOfAIndex==-1)
	{
		return text;
	}
	var endOfClosingAIndex = text.indexOf("<", endOfAIndex+2);
	if(endOfClosingAIndex==-1)
	{
		return text;
	}
	var result = text.substring(endOfAIndex+1, endOfClosingAIndex);
	return result;
};
grabMyBooks.newsPapers.removeCacheUrlIfNeeded = function(url)
{
	if(grabMyBooks.newsPapers.isCacheUrl(url))
	{
		url = url.substring(grabMyBooks.newsPapers.cachePrefix.length, url.indexOf(grabMyBooks.newsPapers.cacheSuffix));
	}
	return url;
};
grabMyBooks.newsPapers.getAsAtomDate = function(dateParam)
{
	var resultTab = [];
	if(dateParam == null)
	{
		dateParam = new Date();
	}
	resultTab.push(
		dateParam.getFullYear(),
		"-",
		grabMyBooks.addZerosIfNeeded((dateParam.getMonth()+1), 2),
		"-",
		grabMyBooks.addZerosIfNeeded(dateParam.getDate(), 2),
		"T",
		grabMyBooks.addZerosIfNeeded(dateParam.getHours(), 2),
		":",
		grabMyBooks.addZerosIfNeeded(dateParam.getMinutes(), 2),
		":",
		grabMyBooks.addZerosIfNeeded(dateParam.getSeconds(), 2),
		"Z"
	);
	var result = resultTab.join("");
	return result;
};
grabMyBooks.newsPapers.validateAtomDate = function(atomDate)
{
	
	if(grabMyBooks.isEmpty(atomDate))
	{
		return grabMyBooks.newsPapers.getAsAtomDate(null);
	}
	try
	{
		var dateObject = new Date(atomDate);
		return grabMyBooks.newsPapers.getAsAtomDate(dateObject);
	}
	catch(e)
	{
		
	}
	if(atomDate.length < 19)
	{
		return grabMyBooks.newsPapers.getAsAtomDate(null);
	}
	if(atomDate.indexOf("T")!=10 && atomDate.indexOf("t")!=10)
	{
		return grabMyBooks.newsPapers.getAsAtomDate(null);
	}
	return atomDate;
	
};

grabMyBooks.linkBook = new Object();
grabMyBooks.linkBook.LinkBookArticle = function(title, url, rule, date, origin)
{
	this.title = title;
	this.url = url;
	this.rule = rule;
	this.date = date;
	this.origin = origin;
	
	this.identify = function(url)
	{
		return (this.url == url);
	};
	
	this.clone = function()
	{
		var result = new grabMyBooks.linkBook.LinkBookArticle(this.title, this.url, this.rule, this.date, this.origin);
		return result;
	};
};
grabMyBooks.linkBook.LinkBook = function(title, description)
{
	this.title = title;
	this.description = description;
	this.lang = "en";
	this.cover = null;
	this.globalRule = null;
	this.linkBookArticles = [];
	
	this.fillRules = function()
	{
		var fillArticleRuleFunction =
			function(linkBookArticle, index, count)
			{
				var siteDetectionRule =
					grabMyBooks.tabGet(grabMyBooks.siteDetectionRules, linkBookArticle.url);
				if(siteDetectionRule == null)
				{
					return;
				}
				linkBookArticle.rule = siteDetectionRule.xpath;
			};
		grabMyBooks.tabDo(this.linkBookArticles, fillArticleRuleFunction);
	};
	
	this.clone = function()
	{
		var result = new grabMyBooks.linkBook.LinkBook(this.title, this.description);
		result.lang = this.lang;
		result.cover = this.cover;
		result.globalRule = this.globalRule;
		var cloneArticleFunction =
			function(result)
			{
				return function(linkBookArticle, index, count)
				{
					result.linkBookArticles.push(linkBookArticle.clone());
				};
			}(result);
		grabMyBooks.tabDo(this.linkBookArticles, cloneArticleFunction);
		return result;
	};
	
	this.addArticle = function(linkBookArticle)
	{
		var alreadyPresentArticle = (grabMyBooks.tabGet(this.linkBookArticles, linkBookArticle.url)!=null);
		if(alreadyPresentArticle)
		{
			return false;
		}
		this.linkBookArticles.push(linkBookArticle);
		return true;
	};
	
	this.getArticleUrlTab = function()
	{
		var resultTab = [];
		var addUrlToTabFunction =
			function(resultTab)
			{
				return function(linkBookArticle, index, count)
				{
					resultTab.push(linkBookArticle.url);
				};
			}(resultTab);
		grabMyBooks.tabDo(this.linkBookArticles, addUrlToTabFunction);
		return resultTab;
	};
	
	this.isEmpty = function()
	{
		var result = (this.linkBookArticles.length == 0);
		return result;
	}
	
	this.getAsHtmlWidget = function(widgetContext)
	{
		if(this.isEmpty())
		{
			return "";
		}
		
		widgetContext.linkLabel = this.title;
		widgetContext.cssClass = "grabMyBooksWidget";
		widgetContext.inlineStyle = "display:table-cell;text-align:center;";
		
		var inlineStyleText = "";
		if(widgetContext.inlineStyle != null)
		{
			inlineStyleText = "style=\""+widgetContext.inlineStyle+"\"";
		}
		
		var resultTab = [];
		var inLink = "";
		if(widgetContext.showCover)
		{
			var cover = this.cover;
			if(grabMyBooks.isEmpty(cover))
			{
				cover = grabMyBooks.widgetDefaultCover;
			}
			inLink = "<img style=\"width:"+(widgetContext.coverSize*4/5)+"em;height:"+widgetContext.coverSize+"em;\" src=\""+cover+"\"><br>";
		}
		resultTab.push("<a id=\""+widgetContext.getLinkId()+"\" href=\""+widgetContext.addOnNotInstalledUrl+"\" target=\"_blank\" class=\""+widgetContext.cssClass+"\" "+inlineStyleText+">");
		resultTab.push(inLink);
		resultTab.push(widgetContext.linkLabel);
		resultTab.push("</a>");
		resultTab.push("<div id=\"grabMyBooks.bookDefinition."+widgetContext.id+"\" style=\"display:none\">");
		if(!grabMyBooks.isEmpty(this.title))
		{
			resultTab.push("<input type=\"hidden\" id=\"grabMyBooks.bookTitle."+widgetContext.id+"\" value=\""+encodeURIComponent(this.title)+"\">");
		}
		if(!grabMyBooks.isEmpty(this.description))
		{
			resultTab.push("<input type=\"hidden\" id=\"grabMyBooks.bookDescription."+widgetContext.id+"\" value=\""+encodeURIComponent(this.description)+"\">");
		}
		if(!grabMyBooks.isEmpty(this.lang))
		{
			resultTab.push("<input type=\"hidden\" id=\"grabMyBooks.bookLanguage."+widgetContext.id+"\" value=\""+this.lang+"\">");
		}
		if(!grabMyBooks.isEmpty(this.cover))
		{
			resultTab.push("<input type=\"hidden\" id=\"grabMyBooks.bookCover."+widgetContext.id+"\" value=\""+this.cover+"\">");
		}
		var articleCount = this.linkBookArticles.length;
		var currentArticle;
		for(var i_article=0; i_article<articleCount; i_article++)
		{
			currentArticle = this.linkBookArticles[i_article];
			resultTab.push("<a id=\"grabMyBooks.bookLink."+widgetContext.id+"."+(i_article+1)+"\" href=\""+currentArticle.url+"\"></a>");
			if(currentArticle.rule != null)
			{
				resultTab.push("<input type=\"hidden\" id=\"grabMyBooks.bookLinkRule."+widgetContext.id+"."+(i_article+1)+"\" value=\""+encodeURIComponent(currentArticle.rule)+"\">");
			}
		}
		if(this.globalRule != null)
		{
			resultTab.push("<input type=\"hidden\" id=\"grabMyBooks.bookLinkGlobalRule."+widgetContext.id+"\" value=\""+encodeURIComponent(this.globalRule)+"\">");
		}
		resultTab.push("</div>");
		var result = resultTab.join("\n");
		return result;
	};
};

grabMyBooks.linkBook.WidgetContext = function()
{
	this.id = new Date().getTime()+(Math.floor(Math.random()*1000));
	this.forceAdd = false;
	this.linkLabel = "Grab as book";
	this.addOnNotInstalledUrl = grabMyBooks.grabMyBooksUrl;
	this.cssClass="grabMyBooks_grab";
	this.inlineStyle = null;
	this.justFirefox = true;
	this.showCover = true;
	this.coverSize = 6;
	
	this.getLinkId = function()
	{
		var forceAddText = this.forceAdd?".test":"";
		var result = "grabMyBooks"+forceAddText+".book."+this.id;
		return result;
	};
};

grabMyBooks.linkBook.getCurrentBookAsLinkBook = function()
{
	if(grabMyBooks.articles.length==0)
	{
		return null;
	}
	var result = new grabMyBooks.linkBook.LinkBook(grabMyBooks.metadata.title, grabMyBooks.metadata.description);
	result.lang = grabMyBooks.metadata.lang;
	
	var coverSavedImgInfo = grabMyBooks.img.savedCoverSavedImgInfo;
	if(coverSavedImgInfo != null && !grabMyBooks.isEmpty(coverSavedImgInfo.imgUrl) && coverSavedImgInfo.imgUrl.toLowerCase().indexOf("http")==0)
	{
		result.cover = coverSavedImgInfo.imgUrl;
	}
	
	var addArticleToLinkBookFunction =
		function(linkBook)
		{
			return function(articleInfo, index, count)
			{
				var url = articleInfo.url;
				if(grabMyBooks.isEmpty(url))
				{
					return;
				}
				if(url.toLowerCase().indexOf("http")!=0)
				{
					return;
				}
				var linkBookArticle =
					new grabMyBooks.linkBook.LinkBookArticle(null, url, null, null, null);
				linkBook.addArticle(linkBookArticle);
			};
		}(result);
	grabMyBooks.tabDo(grabMyBooks.articles, addArticleToLinkBookFunction);
	if(result.isEmpty())
	{
		return null;
	}
	result.fillRules();
	return result;
};




grabMyBooks.color = new Object();

grabMyBooks.color.generateColorComponent = function()
{
	var result = Math.floor((Math.random()*128));
	result+=128;
	if(result>=255)
	{
		result=255;
	}
	return result;
};

grabMyBooks.color.colorRangeTab = ["rgb(250,250,130)","rgb(250,200,128)","rgb(230,128,128)","rgb(230,128,200)","rgb(200,230,128)","rgb(160,220,170)","rgb(140,128,230)","rgb(128,200,220)","rgb(200,200,200)"];

grabMyBooks.color.generateColor = function()
{
	var r = grabMyBooks.color.generateColorComponent();
	var g = grabMyBooks.color.generateColorComponent();
	var b = grabMyBooks.color.generateColorComponent();
	var result = "rgb("+r+","+g+","+b+")";
	return result;
};

grabMyBooks.color.generateValidColor = function(validateColorFunction)
{
	var validColors = grabMyBooks.tabFilter(grabMyBooks.color.colorRangeTab, validateColorFunction);
	var validColorCount = validColors.length;
	if(validColorCount>0)
	{
		var randomIndex = Math.floor(Math.random()*(validColorCount-1));
		return validColors[randomIndex];
	}
	var randomColor = grabMyBooks.color.generateColor();
	while(!validateColorFunction(randomColor))
	{
		randomColor = grabMyBooks.color.generateColor();
	}
	return randomColor;
};

grabMyBooks.xml = new Object();

grabMyBooks.xml.getXPathProperty = function(doc, node, propertyName)
{
	var xPathResult = doc.evaluate("./"+propertyName, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	if(xPathResult.snapshotLength == 0)
	{
		return null;
	}
	return xPathResult.snapshotItem(0).textContent.trim(); 
};

grabMyBooks.xml.getXPathPropertyUnescaped = function(doc, node, propertyName)
{
	var result = grabMyBooks.xml.getXPathProperty(doc, node, propertyName);
	result = grabMyBooks.unEscapeTagsExtended(result);
	return result;
};

grabMyBooks.xml.getXPathPropertyInt = function(doc, node, propertyName)
{
	var textResult = grabMyBooks.xml.getXPathProperty(doc, node, propertyName);
	if(textResult == null)
	{
		return null;
	}
	var result = parseInt(textResult, 10);
	return result;
};
grabMyBooks.xml.getXPathPropertyBoolean = function(doc, node, propertyName)
{
	var textResult = grabMyBooks.xml.getXPathProperty(doc, node, propertyName);
	if(textResult == null)
	{
		return null;
	}
	var result = (textResult.toLowerCase() == "true");
	return result;
};

grabMyBooks.xml.xPathQueryFunction = function(xPath, doc, node, toDoFunction)
{
	if(node == null)
	{
		node = doc;
	}
	var xPathResult = doc.evaluate(xPath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var resultLength = 	xPathResult.snapshotLength;
	var currentResultNode;
	for(var i_resultNode=0; i_resultNode<resultLength; i_resultNode++)
	{
		currentResultNode = xPathResult.snapshotItem(i_resultNode);
		toDoFunction(currentResultNode, i_resultNode, resultLength);
	}
};
grabMyBooks.xml.xPathQueryNode = function(xPath, doc, node)
{
	if(node == null)
	{
		node = doc;
	}
	var xPathResult = doc.evaluate(xPath, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	var resultLength = 	xPathResult.snapshotLength;
	if(resultLength>0)
	{
		return xPathResult.snapshotItem(0);
	}
	return null;
};

grabMyBooks.xml.xPathQueryCount = function(xPath, doc, node)
{
	if(node == null)
	{
		node = doc;
	}
	var countQuery = "count("+xPath+")";
	var xPathResult = doc.evaluate(countQuery, node, null, XPathResult.ANY_TYPE, null);
	return xPathResult.numberValue;
};

grabMyBooks.xml.getXmlDocFromFile = function(dir, fileName)
{
	var content = grabMyBooks.ext.readFile(dir, fileName);
	if(grabMyBooks.isEmpty(content))
	{
		return null;
	}
	var xmlParser = new DOMParser();
	var dom = xmlParser.parseFromString(content, "text/xml");
	return dom;
};

grabMyBooks.sql = new Object();
grabMyBooks.sql.initialized = false;
grabMyBooks.sql.init = function()
{
	if(grabMyBooks.sql.initialized)
	{
		return;
	}
	Components.utils.import("resource://gre/modules/Services.jsm");
	Components.utils.import("resource://gre/modules/FileUtils.jsm");
	grabMyBooks.sql.initialized = true;
};
grabMyBooks.sql.getConnection = function(file)
{
	grabMyBooks.sql.init();
	var result = Services.storage.openDatabase(file);
	return result;
};
grabMyBooks.sql.SqlToDoContext = function(sql)
{
	this.sql = sql;
	this.prepareFunction = null;
	this.onErrorFunction = null;
	this.onEndFunction = null;
	this.handleRowFunction = null;
};
grabMyBooks.sql.Queue = function(sqlConnection)
{
	this.sqlConnection = sqlConnection;
	this.waitingTab = [];
	this.processing = [];
	
	this.sqlDoWaitingsIfPossible = function()
	{
		if(this.processing.length!=0)
		{
			return;
		}
		this.process();
	};
	
	this.sqlDo = function(sqlToDoContext)
	{
		this.waitingTab.push(sqlToDoContext);
		this.sqlDoWaitingsIfPossible();
	};
	
	this.sqlDoTab = function(sqlTab)
	{
		var sqlDoFunction =
			function(queue)
			{
				return function(sql, index, count)
				{
					var sqlToDoContext = new grabMyBooks.sql.SqlToDoContext(sql);
					queue.sqlDo(sqlToDoContext);
				};
			}(this);
		grabMyBooks.tabDo(sqlTab, sqlDoFunction);
	};
	
	this.process = function()
	{
		if(this.waitingTab.length==0)
		{
			return;
		}
		this.processing = this.waitingTab;
		this.waitingTab = [];
		this.processRec();
	};
	this.processRec = function()
	{
		if(this.processing.length==0)
		{
			this.sqlDoWaitingsIfPossible();
			return;
		}
		var sqlToDoContext = this.processing[this.processing.length-1];
		var statement = this.sqlConnection.createStatement(sqlToDoContext.sql);
		if(sqlToDoContext.prepareFunction != null)
		{
			sqlToDoContext.prepareFunction(statement);
		}
		var asynchContext = new Object();
		asynchContext.handleError =
			function(sqlToDoContext)
			{
				return function(error)
				{
					try
					{
						if(sqlToDoContext.onErrorFunction != null)
						{
							sqlToDoContext.onErrorFunction(error);
						}
						grabMyBooks.ext.alert("SQL error:"+error.message);
					}
					catch(e)
					{
						grabMyBooks.ext.alert(e+'::'+e.lineNumber);
					}
				};
			}(sqlToDoContext);
		asynchContext.handleCompletion =
			function(queue, sqlToDoContext)
			{
				return function(reason)
				{
					try
					{
						queue.processing.pop();
						queue.processRec();
						
						if(sqlToDoContext.onEndFunction != null)
						{
							try
							{
								sqlToDoContext.onEndFunction();
							}
							catch(e)
							{
								grabMyBooks.ext.alert(e+'::'+e.lineNumber);
							}
						}
					}
					catch(e)
					{
						grabMyBooks.ext.alert(e+'::'+e.lineNumber);
					}
				};
			}(this, sqlToDoContext);
		asynchContext.handleResult =
			function(sqlToDoContext)
			{
				return function(resultSet)
				{
					if(sqlToDoContext.handleRowFunction == null)
					{
						return;
					}
					for(var row=resultSet.getNextRow(); row; row=resultSet.getNextRow())
					{
						try
						{
							sqlToDoContext.handleRowFunction(row);
						}
						catch(e)
						{
							grabMyBooks.ext.alert(e+'::'+e.lineNumber);
						}
					}
				};
			}(sqlToDoContext);
		statement.executeAsync(asynchContext);
	};
	this.close = function(onCloseFunction)
	{
		var onCompleteCallback = new Object();
		onCompleteCallback.complete = onCloseFunction;
		
		this.sqlConnection.asyncClose(onCompleteCallback);
	};
};

grabMyBooks.pdf = new Object();
grabMyBooks.pdf.loadFilePicker = null;
grabMyBooks.pdf.getLoadFilePicker = function()
{
	if(grabMyBooks.pdf.loadFilePicker == null)
	{
		grabMyBooks.pdf.loadFilePicker = grabMyBooks.ext.createFilePicker();
		grabMyBooks.pdf.loadFilePicker.appendFilter("pdf","*.pdf");
		grabMyBooks.ext.initFilePickerForLoad(grabMyBooks.pdf.loadFilePicker, "Load");
	}
	return grabMyBooks.pdf.loadFilePicker;
};
grabMyBooks.pdf.importMessageTimerContainer = new Object();
grabMyBooks.pdf.onImportPdfClick = function(e)
{	
	var pdfFileLoader = grabMyBooks.pdf.getLoadFilePicker();
	
	var pdfImportOnFileChoosenFunction =
		function(pdfFile)
		{
			var toDoWithChoosenPdfFile =
				function(pdfFile)
				{
					return function()
					{
						grabMyBooks.ext.pdfImport(pdfFile);
					};
				}(pdfFile);
			grabMyBooks.execWithLoadingMessage(toDoWithChoosenPdfFile, "Processing pdf...", grabMyBooks.pdf.importMessageTimerContainer, "timer");
		};
	
	grabMyBooks.ext.showFilePicker(pdfFileLoader, pdfImportOnFileChoosenFunction);
};
grabMyBooks.ext.pdfImport = function(pdfFile)
{
};
grabMyBooks.pdf.counter = 0;
grabMyBooks.pdf.getPdfTmpDir = function()
{
	var result = grabMyBooks.ext.getOrCreateDir(grabMyBooks.ext.path(grabMyBooks.tempDir), "pdf");
	return result;
};
grabMyBooks.pdf.getNewPdfTmpDir = function()
{
	var pdfTmpDir = grabMyBooks.pdf.getPdfTmpDir();
	var dirName = grabMyBooks.addZerosIfNeeded(grabMyBooks.pdf.counter++, 3);
	var result = grabMyBooks.ext.getOrCreateDir(grabMyBooks.ext.path(pdfTmpDir), dirName);
	return result;
};
grabMyBooks.pdf.handlePdfResult = function(pdfResult)
{
	var pdfHtmlUrls = grabMyBooks.ext.pdfGetHttpUrls(pdfResult.htmlCount, pdfResult.pdfDirName);
	
	var prepareAddToBookContextFunction =
		function(pdfResult)
		{
			return function(addToBookContext)
			{
				addToBookContext.grabWholePage = true;
				addToBookContext.endFunction2 =
					function(pdfResult)
					{
						return function()
						{
							var toDeletePdfTmpDir = grabMyBooks.pdf.getPdfTmpDir();
							toDeletePdfTmpDir.append(pdfResult.pdfDirName);
							toDeletePdfTmpDir.remove(true);
							grabMyBooks.SmallInfo.hidePanelFunction();
						};
					}(pdfResult);
			};
		}(pdfResult);
	grabMyBooks.addLinks(pdfHtmlUrls, prepareAddToBookContextFunction, grabMyBooks.bookPopin.showAddToBookProgress);
	
};

grabMyBooks.ext.pdfGetHttpUrls = function(count, pdfDirName)
{	//Dummy
	var result = [];
	return result;
};

grabMyBooks.ext.alert = function(message)
{
	Services.prompt.alert(null, 'GrabMyBooks alert', message);
};


grabMyBooks.menu = new Object();
grabMyBooks.menu.button = function(id, title, label, className)
{
    var inlineClass = "menuTextWrapper";
    if(!grabMyBooks.isEmpty(className))
    {
        inlineClass += " "+className;
    }

	var result = "<div id=\""+id+"\" title=\""+grabMyBooks.escapeTagsExtended(title)+"\" class=\""+inlineClass+"\">"+grabMyBooks.menu.text(null, label)+"</div>";
	return result;
	
};

grabMyBooks.menu.text = function(id, label)
{
    var result = "<div "+((id==null)?"":("id=\""+id+"\""))+"class=\"menuText\">"+grabMyBooks.escapeTagsExtended(label)+"</div>";
    return result;
};

grabMyBooks.menu.css = function()
{
	var resultTab = [];
	resultTab.push(
			"			.menuTextWrapper{display:inline-block;font-weight:normal;vertical-align:middle;}",
			"			#navigationBar #moreMenu .menuTextWrapper{display:block;margin:5px 0 5px 0;}",
			"			#navigationBar .menuTextWrapper{margin-left:15px;margin-right:15px;}",
			"			.menuText{font-family:'verdana','Arial','sans-serif';font-size:13px;white-space:nowrap;transform:scaleY(1.6);transform-origin:0 50%;display:inline-block;padding-top:2px;}",
			"			.menuTextWrapper{height:18px;margin:5px 0 5px 0;padding: 0 0 0 25px;overflow:hidden;}",
			"			.menuTextWrapper:hover{background:url('chrome://grabMyBooks/content/icons/menu/B.png') LEFT 0px NO-REPEAT;cursor:pointer;}",
			"            #popinContent > .menuTextWrapper {position:absolute;}"
	);
	return resultTab.join("\n");
};






//ONLY_FIREFOX
window.addEventListener("load", grabMyBooks.onFirefoxLoad, false);
window.addEventListener("load", grabMyBooks.onLoad, false);
//ONLY_FIREFOX

document.addEventListener("click", grabMyBooks.bookDownload.handleIfClickOnBook, false);
document.addEventListener("click", grabMyBooks.zone.handleIfClickOnEditPageZone, false);