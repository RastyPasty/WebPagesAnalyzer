/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "bc5d28e856aa005822a3"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(198)(__webpack_require__.s = 198);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var core = __webpack_require__(13);
var hide = __webpack_require__(16);
var redefine = __webpack_require__(23);
var ctx = __webpack_require__(14);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(72)('wks');
var uid = __webpack_require__(43);
var Symbol = __webpack_require__(2).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(15);

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(29);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var Vue // late bind
var version
var map = (window.__VUE_HOT_MAP__ = Object.create(null))
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }
  
  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cahced together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }
      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)
      instance.$forceUpdate()
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.16
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vue = factory());
}(this, (function () { 'use strict';

/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it... e.g.
 * PhantomJS 1.x. Technically we don't need this anymore since native bind is
 * now more performant in most browsers, but removing it would be breaking for
 * code that was able to run in PhantomJS 1.x, so this must be kept for
 * backwards compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
})

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  if (!getter && arguments.length === 2) {
    val = obj[key];
  }
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ("development" !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ("development" !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!/^[a-zA-Z][\w-]*$/.test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'can only contain alphanumeric characters and the hyphen, ' +
      'and must start with a letter.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                "timeout (" + (res.timeout) + "ms)"
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ("development" !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if ("development" !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      if ("development" !== 'production' && slotNodes._rendered) {
        warn(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
      }
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    hooks[key] = componentVNodeHooks[key];
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ("development" !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    // reset _rendered flag on slots for duplicate slot check
    {
      for (var key in vm.$slots) {
        // $flow-disable-line
        vm.$slots[key]._rendered = false;
      }
    }

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
}

var builtInComponents = {
  KeepAlive: KeepAlive
}

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.5.16';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
}

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
}

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
]

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
}

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
}

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
  el.plain = false;
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
  el.plain = false;
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (name === 'click') {
    if (modifiers.right) {
      name = 'contextmenu';
      delete modifiers.right;
    } else if (modifiers.middle) {
      name = 'mouseup';
    }
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = {
    value: value.trim()
  };
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
      "? " + baseValueExpression + ".trim()" +
      ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;



function parseModel (val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim();
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (value$1 && !typeBinding) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally'
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
}

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
}

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {}

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
]

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
}

var platformDirectives = {
  model: directive,
  show: show
}

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
}

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
}

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
}

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        "development" !== 'production' &&
        "development" !== 'test' &&
        isChrome
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if ("development" !== 'production' &&
      "development" !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});



function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
}

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
}

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
}

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being pased as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;



function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function closeElement (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      closeElement(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var res;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    comment: function comment (text) {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else {
      warn$2(
        ("Invalid v-for expression: " + exp)
      );
    }
  }
}



function parseFor (exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) { return }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '');
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$2(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if ("development" !== 'production' && el.attrsMap['v-for']) {
        warn$2(
          "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
          "(v-for takes higher priority). Use a wrapper <template> for the " +
          "scoped slot to make it clearer.",
          true
        );
      }
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget);
      }
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var res = parseText(value, delimiters);
        if (res) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true');
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (!map['v-model']) {
      return
    }

    var typeBinding;
    if (map[':type'] || map['v-bind:type']) {
      typeBinding = getBindingAttr(el, 'type');
    }
    if (!map.type && !typeBinding && map['v-bind']) {
      typeBinding = "(" + (map['v-bind']) + ").type";
    }

    if (typeBinding) {
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

var model$2 = {
  preTransformNode: preTransformNode
}

var modules$1 = [
  klass$1,
  style$1,
  model$2
]

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
}

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// KeyboardEvent.key aliases
var keyNames = {
  esc: 'Escape',
  tab: 'Tab',
  enter: 'Enter',
  space: ' ',
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  'delete': ['Backspace', 'Delete']
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    /* istanbul ignore if */
    return ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? ("return " + (handler.value) + "($event)")
      : isFunctionExpression
        ? ("return (" + (handler.value) + ")($event)")
        : handler.value;
    /* istanbul ignore if */
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var keyCode = keyCodes[key];
  var keyName = keyNames[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(keyCode)) + "," +
    "$event.key," +
    "" + (JSON.stringify(keyName)) +
    ")"
  )
}

/*  */

function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
}

/*  */

var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    /* istanbul ignore if */
    {
      res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
    }
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (
  ident,
  type,
  text,
  errors
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
    }
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions;

return Vue;

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(196), __webpack_require__(197).setImmediate))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(17);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(14);
var IObject = __webpack_require__(27);
var toObject = __webpack_require__(9);
var toLength = __webpack_require__(4);
var asc = __webpack_require__(129);
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(37);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = vendor_d287bd279a366553fe87;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(11);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(22);
var createDesc = __webpack_require__(40);
module.exports = __webpack_require__(20) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(1)('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(16)(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(15)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(7);
var IE8_DOM_DEFINE = __webpack_require__(131);
var toPrimitive = __webpack_require__(145);
var dP = Object.defineProperty;

exports.f = __webpack_require__(20) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var hide = __webpack_require__(16);
var has = __webpack_require__(26);
var SRC = __webpack_require__(43)('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__(13).inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(27);
var defined = __webpack_require__(37);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(33)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 26 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(12);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(29);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(188)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 32 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(12);
var TAG = __webpack_require__(1)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(17);
var document = __webpack_require__(2).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(2).document;
module.exports = document && document.documentElement;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(22).f;
var has = __webpack_require__(26);
var TAG = __webpack_require__(1)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(72)('keys');
var uid = __webpack_require__(43);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "html, body {\n    height: 100%;\n}\n\n#app {\n    height: 100%;\n}\n\n.main-nav li .glyphicon {\n    margin-right: 10px;\n}\n\n/* Highlighting rules for nav menu items */\n.main-nav li a.active,\n.main-nav li a.active:hover,\n.main-nav li a.active:focus {\n    background-color: #4189C7;\n    color: white;\n}\n\n/* Keep the nav menu independent of scrolling and on top of other items */\n.main-nav {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    z-index: 1;\n}\n\n@media (max-width: 767px) {\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\n    body {\n        padding-top: 50px;\n    }\n}\n\n@media (min-width: 768px) {\n    /* On small screens, convert the nav menu to a vertical sidebar */\n    .main-nav {\n        height: 100%;\n        width: calc(25% - 20px);\n    }\n    .main-nav .navbar {\n        border-radius: 0px;\n        border-width: 0px;\n        height: 100%;\n    }\n    .main-nav .navbar-header {\n        float: none;\n    }\n    .main-nav .navbar-collapse {\n        border-top: 1px solid #444;\n        padding: 0px;\n    }\n    .main-nav .navbar ul {\n        float: none;\n    }\n    .main-nav .navbar li {\n        float: none;\n        font-size: 15px;\n        margin: 6px;\n    }\n    .main-nav .navbar li a {\n        padding: 10px 16px;\n        border-radius: 4px;\n    }\n    .main-nav .navbar a {\n        /* If a menu item's text is too long, truncate it */\n        width: 100%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n}\n", ""]);

// exports


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "/*!\n* Vuetify v1.0.17\n* Forged by John Leider\n* Released under the MIT License.\n*/     \n@-webkit-keyframes a{59%{margin-left:0}60%,80%{margin-left:2px}70%,90%{margin-left:-2px}}@keyframes a{59%{margin-left:0}60%,80%{margin-left:2px}70%,90%{margin-left:-2px}}.black{background-color:#000!important;border-color:#000!important}.black--text{color:#000!important}.black--text input,.black--text textarea{caret-color:#000!important}.black--after:after{background:#000!important}.white{background-color:#fff!important;border-color:#fff!important}.white--text{color:#fff!important}.white--text input,.white--text textarea{caret-color:#fff!important}.white--after:after{background:#fff!important}.transparent{background-color:transparent!important;border-color:transparent!important}.transparent--text{color:transparent!important}.transparent--text input,.transparent--text textarea{caret-color:transparent!important}.transparent--after:after{background:transparent!important}.red{background-color:#f44336!important;border-color:#f44336!important}.red--text{color:#f44336!important}.red--text input,.red--text textarea{caret-color:#f44336!important}.red--after:after{background:#f44336!important}.red.lighten-5{border-color:#ffebee!important}.red.lighten-5,.red.lighten-5--after:after{background-color:#ffebee!important}.red--text.text--lighten-5{color:#ffebee!important}.red--text.text--lighten-5 input,.red--text.text--lighten-5 textarea{caret-color:#ffebee!important}.red.lighten-4{border-color:#ffcdd2!important}.red.lighten-4,.red.lighten-4--after:after{background-color:#ffcdd2!important}.red--text.text--lighten-4{color:#ffcdd2!important}.red--text.text--lighten-4 input,.red--text.text--lighten-4 textarea{caret-color:#ffcdd2!important}.red.lighten-3{border-color:#ef9a9a!important}.red.lighten-3,.red.lighten-3--after:after{background-color:#ef9a9a!important}.red--text.text--lighten-3{color:#ef9a9a!important}.red--text.text--lighten-3 input,.red--text.text--lighten-3 textarea{caret-color:#ef9a9a!important}.red.lighten-2{border-color:#e57373!important}.red.lighten-2,.red.lighten-2--after:after{background-color:#e57373!important}.red--text.text--lighten-2{color:#e57373!important}.red--text.text--lighten-2 input,.red--text.text--lighten-2 textarea{caret-color:#e57373!important}.red.lighten-1{border-color:#ef5350!important}.red.lighten-1,.red.lighten-1--after:after{background-color:#ef5350!important}.red--text.text--lighten-1{color:#ef5350!important}.red--text.text--lighten-1 input,.red--text.text--lighten-1 textarea{caret-color:#ef5350!important}.red.darken-1{border-color:#e53935!important}.red.darken-1,.red.darken-1--after:after{background-color:#e53935!important}.red--text.text--darken-1{color:#e53935!important}.red--text.text--darken-1 input,.red--text.text--darken-1 textarea{caret-color:#e53935!important}.red.darken-2{border-color:#d32f2f!important}.red.darken-2,.red.darken-2--after:after{background-color:#d32f2f!important}.red--text.text--darken-2{color:#d32f2f!important}.red--text.text--darken-2 input,.red--text.text--darken-2 textarea{caret-color:#d32f2f!important}.red.darken-3{border-color:#c62828!important}.red.darken-3,.red.darken-3--after:after{background-color:#c62828!important}.red--text.text--darken-3{color:#c62828!important}.red--text.text--darken-3 input,.red--text.text--darken-3 textarea{caret-color:#c62828!important}.red.darken-4{border-color:#b71c1c!important}.red.darken-4,.red.darken-4--after:after{background-color:#b71c1c!important}.red--text.text--darken-4{color:#b71c1c!important}.red--text.text--darken-4 input,.red--text.text--darken-4 textarea{caret-color:#b71c1c!important}.red.accent-1{border-color:#ff8a80!important}.red.accent-1,.red.accent-1--after:after{background-color:#ff8a80!important}.red--text.text--accent-1{color:#ff8a80!important}.red--text.text--accent-1 input,.red--text.text--accent-1 textarea{caret-color:#ff8a80!important}.red.accent-2{border-color:#ff5252!important}.red.accent-2,.red.accent-2--after:after{background-color:#ff5252!important}.red--text.text--accent-2{color:#ff5252!important}.red--text.text--accent-2 input,.red--text.text--accent-2 textarea{caret-color:#ff5252!important}.red.accent-3{border-color:#ff1744!important}.red.accent-3,.red.accent-3--after:after{background-color:#ff1744!important}.red--text.text--accent-3{color:#ff1744!important}.red--text.text--accent-3 input,.red--text.text--accent-3 textarea{caret-color:#ff1744!important}.red.accent-4{border-color:#d50000!important}.red.accent-4,.red.accent-4--after:after{background-color:#d50000!important}.red--text.text--accent-4{color:#d50000!important}.red--text.text--accent-4 input,.red--text.text--accent-4 textarea{caret-color:#d50000!important}.pink{background-color:#e91e63!important;border-color:#e91e63!important}.pink--text{color:#e91e63!important}.pink--text input,.pink--text textarea{caret-color:#e91e63!important}.pink--after:after{background:#e91e63!important}.pink.lighten-5{border-color:#fce4ec!important}.pink.lighten-5,.pink.lighten-5--after:after{background-color:#fce4ec!important}.pink--text.text--lighten-5{color:#fce4ec!important}.pink--text.text--lighten-5 input,.pink--text.text--lighten-5 textarea{caret-color:#fce4ec!important}.pink.lighten-4{border-color:#f8bbd0!important}.pink.lighten-4,.pink.lighten-4--after:after{background-color:#f8bbd0!important}.pink--text.text--lighten-4{color:#f8bbd0!important}.pink--text.text--lighten-4 input,.pink--text.text--lighten-4 textarea{caret-color:#f8bbd0!important}.pink.lighten-3{border-color:#f48fb1!important}.pink.lighten-3,.pink.lighten-3--after:after{background-color:#f48fb1!important}.pink--text.text--lighten-3{color:#f48fb1!important}.pink--text.text--lighten-3 input,.pink--text.text--lighten-3 textarea{caret-color:#f48fb1!important}.pink.lighten-2{border-color:#f06292!important}.pink.lighten-2,.pink.lighten-2--after:after{background-color:#f06292!important}.pink--text.text--lighten-2{color:#f06292!important}.pink--text.text--lighten-2 input,.pink--text.text--lighten-2 textarea{caret-color:#f06292!important}.pink.lighten-1{border-color:#ec407a!important}.pink.lighten-1,.pink.lighten-1--after:after{background-color:#ec407a!important}.pink--text.text--lighten-1{color:#ec407a!important}.pink--text.text--lighten-1 input,.pink--text.text--lighten-1 textarea{caret-color:#ec407a!important}.pink.darken-1{border-color:#d81b60!important}.pink.darken-1,.pink.darken-1--after:after{background-color:#d81b60!important}.pink--text.text--darken-1{color:#d81b60!important}.pink--text.text--darken-1 input,.pink--text.text--darken-1 textarea{caret-color:#d81b60!important}.pink.darken-2{border-color:#c2185b!important}.pink.darken-2,.pink.darken-2--after:after{background-color:#c2185b!important}.pink--text.text--darken-2{color:#c2185b!important}.pink--text.text--darken-2 input,.pink--text.text--darken-2 textarea{caret-color:#c2185b!important}.pink.darken-3{border-color:#ad1457!important}.pink.darken-3,.pink.darken-3--after:after{background-color:#ad1457!important}.pink--text.text--darken-3{color:#ad1457!important}.pink--text.text--darken-3 input,.pink--text.text--darken-3 textarea{caret-color:#ad1457!important}.pink.darken-4{border-color:#880e4f!important}.pink.darken-4,.pink.darken-4--after:after{background-color:#880e4f!important}.pink--text.text--darken-4{color:#880e4f!important}.pink--text.text--darken-4 input,.pink--text.text--darken-4 textarea{caret-color:#880e4f!important}.pink.accent-1{border-color:#ff80ab!important}.pink.accent-1,.pink.accent-1--after:after{background-color:#ff80ab!important}.pink--text.text--accent-1{color:#ff80ab!important}.pink--text.text--accent-1 input,.pink--text.text--accent-1 textarea{caret-color:#ff80ab!important}.pink.accent-2{border-color:#ff4081!important}.pink.accent-2,.pink.accent-2--after:after{background-color:#ff4081!important}.pink--text.text--accent-2{color:#ff4081!important}.pink--text.text--accent-2 input,.pink--text.text--accent-2 textarea{caret-color:#ff4081!important}.pink.accent-3{border-color:#f50057!important}.pink.accent-3,.pink.accent-3--after:after{background-color:#f50057!important}.pink--text.text--accent-3{color:#f50057!important}.pink--text.text--accent-3 input,.pink--text.text--accent-3 textarea{caret-color:#f50057!important}.pink.accent-4{border-color:#c51162!important}.pink.accent-4,.pink.accent-4--after:after{background-color:#c51162!important}.pink--text.text--accent-4{color:#c51162!important}.pink--text.text--accent-4 input,.pink--text.text--accent-4 textarea{caret-color:#c51162!important}.purple{background-color:#9c27b0!important;border-color:#9c27b0!important}.purple--text{color:#9c27b0!important}.purple--text input,.purple--text textarea{caret-color:#9c27b0!important}.purple--after:after{background:#9c27b0!important}.purple.lighten-5{border-color:#f3e5f5!important}.purple.lighten-5,.purple.lighten-5--after:after{background-color:#f3e5f5!important}.purple--text.text--lighten-5{color:#f3e5f5!important}.purple--text.text--lighten-5 input,.purple--text.text--lighten-5 textarea{caret-color:#f3e5f5!important}.purple.lighten-4{border-color:#e1bee7!important}.purple.lighten-4,.purple.lighten-4--after:after{background-color:#e1bee7!important}.purple--text.text--lighten-4{color:#e1bee7!important}.purple--text.text--lighten-4 input,.purple--text.text--lighten-4 textarea{caret-color:#e1bee7!important}.purple.lighten-3{border-color:#ce93d8!important}.purple.lighten-3,.purple.lighten-3--after:after{background-color:#ce93d8!important}.purple--text.text--lighten-3{color:#ce93d8!important}.purple--text.text--lighten-3 input,.purple--text.text--lighten-3 textarea{caret-color:#ce93d8!important}.purple.lighten-2{border-color:#ba68c8!important}.purple.lighten-2,.purple.lighten-2--after:after{background-color:#ba68c8!important}.purple--text.text--lighten-2{color:#ba68c8!important}.purple--text.text--lighten-2 input,.purple--text.text--lighten-2 textarea{caret-color:#ba68c8!important}.purple.lighten-1{border-color:#ab47bc!important}.purple.lighten-1,.purple.lighten-1--after:after{background-color:#ab47bc!important}.purple--text.text--lighten-1{color:#ab47bc!important}.purple--text.text--lighten-1 input,.purple--text.text--lighten-1 textarea{caret-color:#ab47bc!important}.purple.darken-1{border-color:#8e24aa!important}.purple.darken-1,.purple.darken-1--after:after{background-color:#8e24aa!important}.purple--text.text--darken-1{color:#8e24aa!important}.purple--text.text--darken-1 input,.purple--text.text--darken-1 textarea{caret-color:#8e24aa!important}.purple.darken-2{border-color:#7b1fa2!important}.purple.darken-2,.purple.darken-2--after:after{background-color:#7b1fa2!important}.purple--text.text--darken-2{color:#7b1fa2!important}.purple--text.text--darken-2 input,.purple--text.text--darken-2 textarea{caret-color:#7b1fa2!important}.purple.darken-3{border-color:#6a1b9a!important}.purple.darken-3,.purple.darken-3--after:after{background-color:#6a1b9a!important}.purple--text.text--darken-3{color:#6a1b9a!important}.purple--text.text--darken-3 input,.purple--text.text--darken-3 textarea{caret-color:#6a1b9a!important}.purple.darken-4{border-color:#4a148c!important}.purple.darken-4,.purple.darken-4--after:after{background-color:#4a148c!important}.purple--text.text--darken-4{color:#4a148c!important}.purple--text.text--darken-4 input,.purple--text.text--darken-4 textarea{caret-color:#4a148c!important}.purple.accent-1{border-color:#ea80fc!important}.purple.accent-1,.purple.accent-1--after:after{background-color:#ea80fc!important}.purple--text.text--accent-1{color:#ea80fc!important}.purple--text.text--accent-1 input,.purple--text.text--accent-1 textarea{caret-color:#ea80fc!important}.purple.accent-2{border-color:#e040fb!important}.purple.accent-2,.purple.accent-2--after:after{background-color:#e040fb!important}.purple--text.text--accent-2{color:#e040fb!important}.purple--text.text--accent-2 input,.purple--text.text--accent-2 textarea{caret-color:#e040fb!important}.purple.accent-3{border-color:#d500f9!important}.purple.accent-3,.purple.accent-3--after:after{background-color:#d500f9!important}.purple--text.text--accent-3{color:#d500f9!important}.purple--text.text--accent-3 input,.purple--text.text--accent-3 textarea{caret-color:#d500f9!important}.purple.accent-4{border-color:#a0f!important}.purple.accent-4,.purple.accent-4--after:after{background-color:#a0f!important}.purple--text.text--accent-4{color:#a0f!important}.purple--text.text--accent-4 input,.purple--text.text--accent-4 textarea{caret-color:#a0f!important}.deep-purple{background-color:#673ab7!important;border-color:#673ab7!important}.deep-purple--text{color:#673ab7!important}.deep-purple--text input,.deep-purple--text textarea{caret-color:#673ab7!important}.deep-purple--after:after{background:#673ab7!important}.deep-purple.lighten-5{border-color:#ede7f6!important}.deep-purple.lighten-5,.deep-purple.lighten-5--after:after{background-color:#ede7f6!important}.deep-purple--text.text--lighten-5{color:#ede7f6!important}.deep-purple--text.text--lighten-5 input,.deep-purple--text.text--lighten-5 textarea{caret-color:#ede7f6!important}.deep-purple.lighten-4{border-color:#d1c4e9!important}.deep-purple.lighten-4,.deep-purple.lighten-4--after:after{background-color:#d1c4e9!important}.deep-purple--text.text--lighten-4{color:#d1c4e9!important}.deep-purple--text.text--lighten-4 input,.deep-purple--text.text--lighten-4 textarea{caret-color:#d1c4e9!important}.deep-purple.lighten-3{border-color:#b39ddb!important}.deep-purple.lighten-3,.deep-purple.lighten-3--after:after{background-color:#b39ddb!important}.deep-purple--text.text--lighten-3{color:#b39ddb!important}.deep-purple--text.text--lighten-3 input,.deep-purple--text.text--lighten-3 textarea{caret-color:#b39ddb!important}.deep-purple.lighten-2{border-color:#9575cd!important}.deep-purple.lighten-2,.deep-purple.lighten-2--after:after{background-color:#9575cd!important}.deep-purple--text.text--lighten-2{color:#9575cd!important}.deep-purple--text.text--lighten-2 input,.deep-purple--text.text--lighten-2 textarea{caret-color:#9575cd!important}.deep-purple.lighten-1{border-color:#7e57c2!important}.deep-purple.lighten-1,.deep-purple.lighten-1--after:after{background-color:#7e57c2!important}.deep-purple--text.text--lighten-1{color:#7e57c2!important}.deep-purple--text.text--lighten-1 input,.deep-purple--text.text--lighten-1 textarea{caret-color:#7e57c2!important}.deep-purple.darken-1{border-color:#5e35b1!important}.deep-purple.darken-1,.deep-purple.darken-1--after:after{background-color:#5e35b1!important}.deep-purple--text.text--darken-1{color:#5e35b1!important}.deep-purple--text.text--darken-1 input,.deep-purple--text.text--darken-1 textarea{caret-color:#5e35b1!important}.deep-purple.darken-2{border-color:#512da8!important}.deep-purple.darken-2,.deep-purple.darken-2--after:after{background-color:#512da8!important}.deep-purple--text.text--darken-2{color:#512da8!important}.deep-purple--text.text--darken-2 input,.deep-purple--text.text--darken-2 textarea{caret-color:#512da8!important}.deep-purple.darken-3{border-color:#4527a0!important}.deep-purple.darken-3,.deep-purple.darken-3--after:after{background-color:#4527a0!important}.deep-purple--text.text--darken-3{color:#4527a0!important}.deep-purple--text.text--darken-3 input,.deep-purple--text.text--darken-3 textarea{caret-color:#4527a0!important}.deep-purple.darken-4{border-color:#311b92!important}.deep-purple.darken-4,.deep-purple.darken-4--after:after{background-color:#311b92!important}.deep-purple--text.text--darken-4{color:#311b92!important}.deep-purple--text.text--darken-4 input,.deep-purple--text.text--darken-4 textarea{caret-color:#311b92!important}.deep-purple.accent-1{border-color:#b388ff!important}.deep-purple.accent-1,.deep-purple.accent-1--after:after{background-color:#b388ff!important}.deep-purple--text.text--accent-1{color:#b388ff!important}.deep-purple--text.text--accent-1 input,.deep-purple--text.text--accent-1 textarea{caret-color:#b388ff!important}.deep-purple.accent-2{border-color:#7c4dff!important}.deep-purple.accent-2,.deep-purple.accent-2--after:after{background-color:#7c4dff!important}.deep-purple--text.text--accent-2{color:#7c4dff!important}.deep-purple--text.text--accent-2 input,.deep-purple--text.text--accent-2 textarea{caret-color:#7c4dff!important}.deep-purple.accent-3{border-color:#651fff!important}.deep-purple.accent-3,.deep-purple.accent-3--after:after{background-color:#651fff!important}.deep-purple--text.text--accent-3{color:#651fff!important}.deep-purple--text.text--accent-3 input,.deep-purple--text.text--accent-3 textarea{caret-color:#651fff!important}.deep-purple.accent-4{border-color:#6200ea!important}.deep-purple.accent-4,.deep-purple.accent-4--after:after{background-color:#6200ea!important}.deep-purple--text.text--accent-4{color:#6200ea!important}.deep-purple--text.text--accent-4 input,.deep-purple--text.text--accent-4 textarea{caret-color:#6200ea!important}.indigo{background-color:#3f51b5!important;border-color:#3f51b5!important}.indigo--text{color:#3f51b5!important}.indigo--text input,.indigo--text textarea{caret-color:#3f51b5!important}.indigo--after:after{background:#3f51b5!important}.indigo.lighten-5{border-color:#e8eaf6!important}.indigo.lighten-5,.indigo.lighten-5--after:after{background-color:#e8eaf6!important}.indigo--text.text--lighten-5{color:#e8eaf6!important}.indigo--text.text--lighten-5 input,.indigo--text.text--lighten-5 textarea{caret-color:#e8eaf6!important}.indigo.lighten-4{border-color:#c5cae9!important}.indigo.lighten-4,.indigo.lighten-4--after:after{background-color:#c5cae9!important}.indigo--text.text--lighten-4{color:#c5cae9!important}.indigo--text.text--lighten-4 input,.indigo--text.text--lighten-4 textarea{caret-color:#c5cae9!important}.indigo.lighten-3{border-color:#9fa8da!important}.indigo.lighten-3,.indigo.lighten-3--after:after{background-color:#9fa8da!important}.indigo--text.text--lighten-3{color:#9fa8da!important}.indigo--text.text--lighten-3 input,.indigo--text.text--lighten-3 textarea{caret-color:#9fa8da!important}.indigo.lighten-2{border-color:#7986cb!important}.indigo.lighten-2,.indigo.lighten-2--after:after{background-color:#7986cb!important}.indigo--text.text--lighten-2{color:#7986cb!important}.indigo--text.text--lighten-2 input,.indigo--text.text--lighten-2 textarea{caret-color:#7986cb!important}.indigo.lighten-1{border-color:#5c6bc0!important}.indigo.lighten-1,.indigo.lighten-1--after:after{background-color:#5c6bc0!important}.indigo--text.text--lighten-1{color:#5c6bc0!important}.indigo--text.text--lighten-1 input,.indigo--text.text--lighten-1 textarea{caret-color:#5c6bc0!important}.indigo.darken-1{border-color:#3949ab!important}.indigo.darken-1,.indigo.darken-1--after:after{background-color:#3949ab!important}.indigo--text.text--darken-1{color:#3949ab!important}.indigo--text.text--darken-1 input,.indigo--text.text--darken-1 textarea{caret-color:#3949ab!important}.indigo.darken-2{border-color:#303f9f!important}.indigo.darken-2,.indigo.darken-2--after:after{background-color:#303f9f!important}.indigo--text.text--darken-2{color:#303f9f!important}.indigo--text.text--darken-2 input,.indigo--text.text--darken-2 textarea{caret-color:#303f9f!important}.indigo.darken-3{border-color:#283593!important}.indigo.darken-3,.indigo.darken-3--after:after{background-color:#283593!important}.indigo--text.text--darken-3{color:#283593!important}.indigo--text.text--darken-3 input,.indigo--text.text--darken-3 textarea{caret-color:#283593!important}.indigo.darken-4{border-color:#1a237e!important}.indigo.darken-4,.indigo.darken-4--after:after{background-color:#1a237e!important}.indigo--text.text--darken-4{color:#1a237e!important}.indigo--text.text--darken-4 input,.indigo--text.text--darken-4 textarea{caret-color:#1a237e!important}.indigo.accent-1{border-color:#8c9eff!important}.indigo.accent-1,.indigo.accent-1--after:after{background-color:#8c9eff!important}.indigo--text.text--accent-1{color:#8c9eff!important}.indigo--text.text--accent-1 input,.indigo--text.text--accent-1 textarea{caret-color:#8c9eff!important}.indigo.accent-2{border-color:#536dfe!important}.indigo.accent-2,.indigo.accent-2--after:after{background-color:#536dfe!important}.indigo--text.text--accent-2{color:#536dfe!important}.indigo--text.text--accent-2 input,.indigo--text.text--accent-2 textarea{caret-color:#536dfe!important}.indigo.accent-3{border-color:#3d5afe!important}.indigo.accent-3,.indigo.accent-3--after:after{background-color:#3d5afe!important}.indigo--text.text--accent-3{color:#3d5afe!important}.indigo--text.text--accent-3 input,.indigo--text.text--accent-3 textarea{caret-color:#3d5afe!important}.indigo.accent-4{border-color:#304ffe!important}.indigo.accent-4,.indigo.accent-4--after:after{background-color:#304ffe!important}.indigo--text.text--accent-4{color:#304ffe!important}.indigo--text.text--accent-4 input,.indigo--text.text--accent-4 textarea{caret-color:#304ffe!important}.blue{background-color:#2196f3!important;border-color:#2196f3!important}.blue--text{color:#2196f3!important}.blue--text input,.blue--text textarea{caret-color:#2196f3!important}.blue--after:after{background:#2196f3!important}.blue.lighten-5{border-color:#e3f2fd!important}.blue.lighten-5,.blue.lighten-5--after:after{background-color:#e3f2fd!important}.blue--text.text--lighten-5{color:#e3f2fd!important}.blue--text.text--lighten-5 input,.blue--text.text--lighten-5 textarea{caret-color:#e3f2fd!important}.blue.lighten-4{border-color:#bbdefb!important}.blue.lighten-4,.blue.lighten-4--after:after{background-color:#bbdefb!important}.blue--text.text--lighten-4{color:#bbdefb!important}.blue--text.text--lighten-4 input,.blue--text.text--lighten-4 textarea{caret-color:#bbdefb!important}.blue.lighten-3{border-color:#90caf9!important}.blue.lighten-3,.blue.lighten-3--after:after{background-color:#90caf9!important}.blue--text.text--lighten-3{color:#90caf9!important}.blue--text.text--lighten-3 input,.blue--text.text--lighten-3 textarea{caret-color:#90caf9!important}.blue.lighten-2{border-color:#64b5f6!important}.blue.lighten-2,.blue.lighten-2--after:after{background-color:#64b5f6!important}.blue--text.text--lighten-2{color:#64b5f6!important}.blue--text.text--lighten-2 input,.blue--text.text--lighten-2 textarea{caret-color:#64b5f6!important}.blue.lighten-1{border-color:#42a5f5!important}.blue.lighten-1,.blue.lighten-1--after:after{background-color:#42a5f5!important}.blue--text.text--lighten-1{color:#42a5f5!important}.blue--text.text--lighten-1 input,.blue--text.text--lighten-1 textarea{caret-color:#42a5f5!important}.blue.darken-1{border-color:#1e88e5!important}.blue.darken-1,.blue.darken-1--after:after{background-color:#1e88e5!important}.blue--text.text--darken-1{color:#1e88e5!important}.blue--text.text--darken-1 input,.blue--text.text--darken-1 textarea{caret-color:#1e88e5!important}.blue.darken-2{border-color:#1976d2!important}.blue.darken-2,.blue.darken-2--after:after{background-color:#1976d2!important}.blue--text.text--darken-2{color:#1976d2!important}.blue--text.text--darken-2 input,.blue--text.text--darken-2 textarea{caret-color:#1976d2!important}.blue.darken-3{border-color:#1565c0!important}.blue.darken-3,.blue.darken-3--after:after{background-color:#1565c0!important}.blue--text.text--darken-3{color:#1565c0!important}.blue--text.text--darken-3 input,.blue--text.text--darken-3 textarea{caret-color:#1565c0!important}.blue.darken-4{border-color:#0d47a1!important}.blue.darken-4,.blue.darken-4--after:after{background-color:#0d47a1!important}.blue--text.text--darken-4{color:#0d47a1!important}.blue--text.text--darken-4 input,.blue--text.text--darken-4 textarea{caret-color:#0d47a1!important}.blue.accent-1{border-color:#82b1ff!important}.blue.accent-1,.blue.accent-1--after:after{background-color:#82b1ff!important}.blue--text.text--accent-1{color:#82b1ff!important}.blue--text.text--accent-1 input,.blue--text.text--accent-1 textarea{caret-color:#82b1ff!important}.blue.accent-2{border-color:#448aff!important}.blue.accent-2,.blue.accent-2--after:after{background-color:#448aff!important}.blue--text.text--accent-2{color:#448aff!important}.blue--text.text--accent-2 input,.blue--text.text--accent-2 textarea{caret-color:#448aff!important}.blue.accent-3{border-color:#2979ff!important}.blue.accent-3,.blue.accent-3--after:after{background-color:#2979ff!important}.blue--text.text--accent-3{color:#2979ff!important}.blue--text.text--accent-3 input,.blue--text.text--accent-3 textarea{caret-color:#2979ff!important}.blue.accent-4{border-color:#2962ff!important}.blue.accent-4,.blue.accent-4--after:after{background-color:#2962ff!important}.blue--text.text--accent-4{color:#2962ff!important}.blue--text.text--accent-4 input,.blue--text.text--accent-4 textarea{caret-color:#2962ff!important}.light-blue{background-color:#03a9f4!important;border-color:#03a9f4!important}.light-blue--text{color:#03a9f4!important}.light-blue--text input,.light-blue--text textarea{caret-color:#03a9f4!important}.light-blue--after:after{background:#03a9f4!important}.light-blue.lighten-5{border-color:#e1f5fe!important}.light-blue.lighten-5,.light-blue.lighten-5--after:after{background-color:#e1f5fe!important}.light-blue--text.text--lighten-5{color:#e1f5fe!important}.light-blue--text.text--lighten-5 input,.light-blue--text.text--lighten-5 textarea{caret-color:#e1f5fe!important}.light-blue.lighten-4{border-color:#b3e5fc!important}.light-blue.lighten-4,.light-blue.lighten-4--after:after{background-color:#b3e5fc!important}.light-blue--text.text--lighten-4{color:#b3e5fc!important}.light-blue--text.text--lighten-4 input,.light-blue--text.text--lighten-4 textarea{caret-color:#b3e5fc!important}.light-blue.lighten-3{border-color:#81d4fa!important}.light-blue.lighten-3,.light-blue.lighten-3--after:after{background-color:#81d4fa!important}.light-blue--text.text--lighten-3{color:#81d4fa!important}.light-blue--text.text--lighten-3 input,.light-blue--text.text--lighten-3 textarea{caret-color:#81d4fa!important}.light-blue.lighten-2{border-color:#4fc3f7!important}.light-blue.lighten-2,.light-blue.lighten-2--after:after{background-color:#4fc3f7!important}.light-blue--text.text--lighten-2{color:#4fc3f7!important}.light-blue--text.text--lighten-2 input,.light-blue--text.text--lighten-2 textarea{caret-color:#4fc3f7!important}.light-blue.lighten-1{border-color:#29b6f6!important}.light-blue.lighten-1,.light-blue.lighten-1--after:after{background-color:#29b6f6!important}.light-blue--text.text--lighten-1{color:#29b6f6!important}.light-blue--text.text--lighten-1 input,.light-blue--text.text--lighten-1 textarea{caret-color:#29b6f6!important}.light-blue.darken-1{border-color:#039be5!important}.light-blue.darken-1,.light-blue.darken-1--after:after{background-color:#039be5!important}.light-blue--text.text--darken-1{color:#039be5!important}.light-blue--text.text--darken-1 input,.light-blue--text.text--darken-1 textarea{caret-color:#039be5!important}.light-blue.darken-2{border-color:#0288d1!important}.light-blue.darken-2,.light-blue.darken-2--after:after{background-color:#0288d1!important}.light-blue--text.text--darken-2{color:#0288d1!important}.light-blue--text.text--darken-2 input,.light-blue--text.text--darken-2 textarea{caret-color:#0288d1!important}.light-blue.darken-3{border-color:#0277bd!important}.light-blue.darken-3,.light-blue.darken-3--after:after{background-color:#0277bd!important}.light-blue--text.text--darken-3{color:#0277bd!important}.light-blue--text.text--darken-3 input,.light-blue--text.text--darken-3 textarea{caret-color:#0277bd!important}.light-blue.darken-4{border-color:#01579b!important}.light-blue.darken-4,.light-blue.darken-4--after:after{background-color:#01579b!important}.light-blue--text.text--darken-4{color:#01579b!important}.light-blue--text.text--darken-4 input,.light-blue--text.text--darken-4 textarea{caret-color:#01579b!important}.light-blue.accent-1{border-color:#80d8ff!important}.light-blue.accent-1,.light-blue.accent-1--after:after{background-color:#80d8ff!important}.light-blue--text.text--accent-1{color:#80d8ff!important}.light-blue--text.text--accent-1 input,.light-blue--text.text--accent-1 textarea{caret-color:#80d8ff!important}.light-blue.accent-2{border-color:#40c4ff!important}.light-blue.accent-2,.light-blue.accent-2--after:after{background-color:#40c4ff!important}.light-blue--text.text--accent-2{color:#40c4ff!important}.light-blue--text.text--accent-2 input,.light-blue--text.text--accent-2 textarea{caret-color:#40c4ff!important}.light-blue.accent-3{border-color:#00b0ff!important}.light-blue.accent-3,.light-blue.accent-3--after:after{background-color:#00b0ff!important}.light-blue--text.text--accent-3{color:#00b0ff!important}.light-blue--text.text--accent-3 input,.light-blue--text.text--accent-3 textarea{caret-color:#00b0ff!important}.light-blue.accent-4{border-color:#0091ea!important}.light-blue.accent-4,.light-blue.accent-4--after:after{background-color:#0091ea!important}.light-blue--text.text--accent-4{color:#0091ea!important}.light-blue--text.text--accent-4 input,.light-blue--text.text--accent-4 textarea{caret-color:#0091ea!important}.cyan{background-color:#00bcd4!important;border-color:#00bcd4!important}.cyan--text{color:#00bcd4!important}.cyan--text input,.cyan--text textarea{caret-color:#00bcd4!important}.cyan--after:after{background:#00bcd4!important}.cyan.lighten-5{border-color:#e0f7fa!important}.cyan.lighten-5,.cyan.lighten-5--after:after{background-color:#e0f7fa!important}.cyan--text.text--lighten-5{color:#e0f7fa!important}.cyan--text.text--lighten-5 input,.cyan--text.text--lighten-5 textarea{caret-color:#e0f7fa!important}.cyan.lighten-4{border-color:#b2ebf2!important}.cyan.lighten-4,.cyan.lighten-4--after:after{background-color:#b2ebf2!important}.cyan--text.text--lighten-4{color:#b2ebf2!important}.cyan--text.text--lighten-4 input,.cyan--text.text--lighten-4 textarea{caret-color:#b2ebf2!important}.cyan.lighten-3{border-color:#80deea!important}.cyan.lighten-3,.cyan.lighten-3--after:after{background-color:#80deea!important}.cyan--text.text--lighten-3{color:#80deea!important}.cyan--text.text--lighten-3 input,.cyan--text.text--lighten-3 textarea{caret-color:#80deea!important}.cyan.lighten-2{border-color:#4dd0e1!important}.cyan.lighten-2,.cyan.lighten-2--after:after{background-color:#4dd0e1!important}.cyan--text.text--lighten-2{color:#4dd0e1!important}.cyan--text.text--lighten-2 input,.cyan--text.text--lighten-2 textarea{caret-color:#4dd0e1!important}.cyan.lighten-1{border-color:#26c6da!important}.cyan.lighten-1,.cyan.lighten-1--after:after{background-color:#26c6da!important}.cyan--text.text--lighten-1{color:#26c6da!important}.cyan--text.text--lighten-1 input,.cyan--text.text--lighten-1 textarea{caret-color:#26c6da!important}.cyan.darken-1{border-color:#00acc1!important}.cyan.darken-1,.cyan.darken-1--after:after{background-color:#00acc1!important}.cyan--text.text--darken-1{color:#00acc1!important}.cyan--text.text--darken-1 input,.cyan--text.text--darken-1 textarea{caret-color:#00acc1!important}.cyan.darken-2{border-color:#0097a7!important}.cyan.darken-2,.cyan.darken-2--after:after{background-color:#0097a7!important}.cyan--text.text--darken-2{color:#0097a7!important}.cyan--text.text--darken-2 input,.cyan--text.text--darken-2 textarea{caret-color:#0097a7!important}.cyan.darken-3{border-color:#00838f!important}.cyan.darken-3,.cyan.darken-3--after:after{background-color:#00838f!important}.cyan--text.text--darken-3{color:#00838f!important}.cyan--text.text--darken-3 input,.cyan--text.text--darken-3 textarea{caret-color:#00838f!important}.cyan.darken-4{border-color:#006064!important}.cyan.darken-4,.cyan.darken-4--after:after{background-color:#006064!important}.cyan--text.text--darken-4{color:#006064!important}.cyan--text.text--darken-4 input,.cyan--text.text--darken-4 textarea{caret-color:#006064!important}.cyan.accent-1{border-color:#84ffff!important}.cyan.accent-1,.cyan.accent-1--after:after{background-color:#84ffff!important}.cyan--text.text--accent-1{color:#84ffff!important}.cyan--text.text--accent-1 input,.cyan--text.text--accent-1 textarea{caret-color:#84ffff!important}.cyan.accent-2{border-color:#18ffff!important}.cyan.accent-2,.cyan.accent-2--after:after{background-color:#18ffff!important}.cyan--text.text--accent-2{color:#18ffff!important}.cyan--text.text--accent-2 input,.cyan--text.text--accent-2 textarea{caret-color:#18ffff!important}.cyan.accent-3{border-color:#00e5ff!important}.cyan.accent-3,.cyan.accent-3--after:after{background-color:#00e5ff!important}.cyan--text.text--accent-3{color:#00e5ff!important}.cyan--text.text--accent-3 input,.cyan--text.text--accent-3 textarea{caret-color:#00e5ff!important}.cyan.accent-4{border-color:#00b8d4!important}.cyan.accent-4,.cyan.accent-4--after:after{background-color:#00b8d4!important}.cyan--text.text--accent-4{color:#00b8d4!important}.cyan--text.text--accent-4 input,.cyan--text.text--accent-4 textarea{caret-color:#00b8d4!important}.teal{background-color:#009688!important;border-color:#009688!important}.teal--text{color:#009688!important}.teal--text input,.teal--text textarea{caret-color:#009688!important}.teal--after:after{background:#009688!important}.teal.lighten-5{border-color:#e0f2f1!important}.teal.lighten-5,.teal.lighten-5--after:after{background-color:#e0f2f1!important}.teal--text.text--lighten-5{color:#e0f2f1!important}.teal--text.text--lighten-5 input,.teal--text.text--lighten-5 textarea{caret-color:#e0f2f1!important}.teal.lighten-4{border-color:#b2dfdb!important}.teal.lighten-4,.teal.lighten-4--after:after{background-color:#b2dfdb!important}.teal--text.text--lighten-4{color:#b2dfdb!important}.teal--text.text--lighten-4 input,.teal--text.text--lighten-4 textarea{caret-color:#b2dfdb!important}.teal.lighten-3{border-color:#80cbc4!important}.teal.lighten-3,.teal.lighten-3--after:after{background-color:#80cbc4!important}.teal--text.text--lighten-3{color:#80cbc4!important}.teal--text.text--lighten-3 input,.teal--text.text--lighten-3 textarea{caret-color:#80cbc4!important}.teal.lighten-2{border-color:#4db6ac!important}.teal.lighten-2,.teal.lighten-2--after:after{background-color:#4db6ac!important}.teal--text.text--lighten-2{color:#4db6ac!important}.teal--text.text--lighten-2 input,.teal--text.text--lighten-2 textarea{caret-color:#4db6ac!important}.teal.lighten-1{border-color:#26a69a!important}.teal.lighten-1,.teal.lighten-1--after:after{background-color:#26a69a!important}.teal--text.text--lighten-1{color:#26a69a!important}.teal--text.text--lighten-1 input,.teal--text.text--lighten-1 textarea{caret-color:#26a69a!important}.teal.darken-1{border-color:#00897b!important}.teal.darken-1,.teal.darken-1--after:after{background-color:#00897b!important}.teal--text.text--darken-1{color:#00897b!important}.teal--text.text--darken-1 input,.teal--text.text--darken-1 textarea{caret-color:#00897b!important}.teal.darken-2{border-color:#00796b!important}.teal.darken-2,.teal.darken-2--after:after{background-color:#00796b!important}.teal--text.text--darken-2{color:#00796b!important}.teal--text.text--darken-2 input,.teal--text.text--darken-2 textarea{caret-color:#00796b!important}.teal.darken-3{border-color:#00695c!important}.teal.darken-3,.teal.darken-3--after:after{background-color:#00695c!important}.teal--text.text--darken-3{color:#00695c!important}.teal--text.text--darken-3 input,.teal--text.text--darken-3 textarea{caret-color:#00695c!important}.teal.darken-4{border-color:#004d40!important}.teal.darken-4,.teal.darken-4--after:after{background-color:#004d40!important}.teal--text.text--darken-4{color:#004d40!important}.teal--text.text--darken-4 input,.teal--text.text--darken-4 textarea{caret-color:#004d40!important}.teal.accent-1{border-color:#a7ffeb!important}.teal.accent-1,.teal.accent-1--after:after{background-color:#a7ffeb!important}.teal--text.text--accent-1{color:#a7ffeb!important}.teal--text.text--accent-1 input,.teal--text.text--accent-1 textarea{caret-color:#a7ffeb!important}.teal.accent-2{border-color:#64ffda!important}.teal.accent-2,.teal.accent-2--after:after{background-color:#64ffda!important}.teal--text.text--accent-2{color:#64ffda!important}.teal--text.text--accent-2 input,.teal--text.text--accent-2 textarea{caret-color:#64ffda!important}.teal.accent-3{border-color:#1de9b6!important}.teal.accent-3,.teal.accent-3--after:after{background-color:#1de9b6!important}.teal--text.text--accent-3{color:#1de9b6!important}.teal--text.text--accent-3 input,.teal--text.text--accent-3 textarea{caret-color:#1de9b6!important}.teal.accent-4{border-color:#00bfa5!important}.teal.accent-4,.teal.accent-4--after:after{background-color:#00bfa5!important}.teal--text.text--accent-4{color:#00bfa5!important}.teal--text.text--accent-4 input,.teal--text.text--accent-4 textarea{caret-color:#00bfa5!important}.green{background-color:#4caf50!important;border-color:#4caf50!important}.green--text{color:#4caf50!important}.green--text input,.green--text textarea{caret-color:#4caf50!important}.green--after:after{background:#4caf50!important}.green.lighten-5{border-color:#e8f5e9!important}.green.lighten-5,.green.lighten-5--after:after{background-color:#e8f5e9!important}.green--text.text--lighten-5{color:#e8f5e9!important}.green--text.text--lighten-5 input,.green--text.text--lighten-5 textarea{caret-color:#e8f5e9!important}.green.lighten-4{border-color:#c8e6c9!important}.green.lighten-4,.green.lighten-4--after:after{background-color:#c8e6c9!important}.green--text.text--lighten-4{color:#c8e6c9!important}.green--text.text--lighten-4 input,.green--text.text--lighten-4 textarea{caret-color:#c8e6c9!important}.green.lighten-3{border-color:#a5d6a7!important}.green.lighten-3,.green.lighten-3--after:after{background-color:#a5d6a7!important}.green--text.text--lighten-3{color:#a5d6a7!important}.green--text.text--lighten-3 input,.green--text.text--lighten-3 textarea{caret-color:#a5d6a7!important}.green.lighten-2{border-color:#81c784!important}.green.lighten-2,.green.lighten-2--after:after{background-color:#81c784!important}.green--text.text--lighten-2{color:#81c784!important}.green--text.text--lighten-2 input,.green--text.text--lighten-2 textarea{caret-color:#81c784!important}.green.lighten-1{border-color:#66bb6a!important}.green.lighten-1,.green.lighten-1--after:after{background-color:#66bb6a!important}.green--text.text--lighten-1{color:#66bb6a!important}.green--text.text--lighten-1 input,.green--text.text--lighten-1 textarea{caret-color:#66bb6a!important}.green.darken-1{border-color:#43a047!important}.green.darken-1,.green.darken-1--after:after{background-color:#43a047!important}.green--text.text--darken-1{color:#43a047!important}.green--text.text--darken-1 input,.green--text.text--darken-1 textarea{caret-color:#43a047!important}.green.darken-2{border-color:#388e3c!important}.green.darken-2,.green.darken-2--after:after{background-color:#388e3c!important}.green--text.text--darken-2{color:#388e3c!important}.green--text.text--darken-2 input,.green--text.text--darken-2 textarea{caret-color:#388e3c!important}.green.darken-3{border-color:#2e7d32!important}.green.darken-3,.green.darken-3--after:after{background-color:#2e7d32!important}.green--text.text--darken-3{color:#2e7d32!important}.green--text.text--darken-3 input,.green--text.text--darken-3 textarea{caret-color:#2e7d32!important}.green.darken-4{border-color:#1b5e20!important}.green.darken-4,.green.darken-4--after:after{background-color:#1b5e20!important}.green--text.text--darken-4{color:#1b5e20!important}.green--text.text--darken-4 input,.green--text.text--darken-4 textarea{caret-color:#1b5e20!important}.green.accent-1{border-color:#b9f6ca!important}.green.accent-1,.green.accent-1--after:after{background-color:#b9f6ca!important}.green--text.text--accent-1{color:#b9f6ca!important}.green--text.text--accent-1 input,.green--text.text--accent-1 textarea{caret-color:#b9f6ca!important}.green.accent-2{border-color:#69f0ae!important}.green.accent-2,.green.accent-2--after:after{background-color:#69f0ae!important}.green--text.text--accent-2{color:#69f0ae!important}.green--text.text--accent-2 input,.green--text.text--accent-2 textarea{caret-color:#69f0ae!important}.green.accent-3{border-color:#00e676!important}.green.accent-3,.green.accent-3--after:after{background-color:#00e676!important}.green--text.text--accent-3{color:#00e676!important}.green--text.text--accent-3 input,.green--text.text--accent-3 textarea{caret-color:#00e676!important}.green.accent-4{border-color:#00c853!important}.green.accent-4,.green.accent-4--after:after{background-color:#00c853!important}.green--text.text--accent-4{color:#00c853!important}.green--text.text--accent-4 input,.green--text.text--accent-4 textarea{caret-color:#00c853!important}.light-green{background-color:#8bc34a!important;border-color:#8bc34a!important}.light-green--text{color:#8bc34a!important}.light-green--text input,.light-green--text textarea{caret-color:#8bc34a!important}.light-green--after:after{background:#8bc34a!important}.light-green.lighten-5{border-color:#f1f8e9!important}.light-green.lighten-5,.light-green.lighten-5--after:after{background-color:#f1f8e9!important}.light-green--text.text--lighten-5{color:#f1f8e9!important}.light-green--text.text--lighten-5 input,.light-green--text.text--lighten-5 textarea{caret-color:#f1f8e9!important}.light-green.lighten-4{border-color:#dcedc8!important}.light-green.lighten-4,.light-green.lighten-4--after:after{background-color:#dcedc8!important}.light-green--text.text--lighten-4{color:#dcedc8!important}.light-green--text.text--lighten-4 input,.light-green--text.text--lighten-4 textarea{caret-color:#dcedc8!important}.light-green.lighten-3{border-color:#c5e1a5!important}.light-green.lighten-3,.light-green.lighten-3--after:after{background-color:#c5e1a5!important}.light-green--text.text--lighten-3{color:#c5e1a5!important}.light-green--text.text--lighten-3 input,.light-green--text.text--lighten-3 textarea{caret-color:#c5e1a5!important}.light-green.lighten-2{border-color:#aed581!important}.light-green.lighten-2,.light-green.lighten-2--after:after{background-color:#aed581!important}.light-green--text.text--lighten-2{color:#aed581!important}.light-green--text.text--lighten-2 input,.light-green--text.text--lighten-2 textarea{caret-color:#aed581!important}.light-green.lighten-1{border-color:#9ccc65!important}.light-green.lighten-1,.light-green.lighten-1--after:after{background-color:#9ccc65!important}.light-green--text.text--lighten-1{color:#9ccc65!important}.light-green--text.text--lighten-1 input,.light-green--text.text--lighten-1 textarea{caret-color:#9ccc65!important}.light-green.darken-1{border-color:#7cb342!important}.light-green.darken-1,.light-green.darken-1--after:after{background-color:#7cb342!important}.light-green--text.text--darken-1{color:#7cb342!important}.light-green--text.text--darken-1 input,.light-green--text.text--darken-1 textarea{caret-color:#7cb342!important}.light-green.darken-2{border-color:#689f38!important}.light-green.darken-2,.light-green.darken-2--after:after{background-color:#689f38!important}.light-green--text.text--darken-2{color:#689f38!important}.light-green--text.text--darken-2 input,.light-green--text.text--darken-2 textarea{caret-color:#689f38!important}.light-green.darken-3{border-color:#558b2f!important}.light-green.darken-3,.light-green.darken-3--after:after{background-color:#558b2f!important}.light-green--text.text--darken-3{color:#558b2f!important}.light-green--text.text--darken-3 input,.light-green--text.text--darken-3 textarea{caret-color:#558b2f!important}.light-green.darken-4{border-color:#33691e!important}.light-green.darken-4,.light-green.darken-4--after:after{background-color:#33691e!important}.light-green--text.text--darken-4{color:#33691e!important}.light-green--text.text--darken-4 input,.light-green--text.text--darken-4 textarea{caret-color:#33691e!important}.light-green.accent-1{border-color:#ccff90!important}.light-green.accent-1,.light-green.accent-1--after:after{background-color:#ccff90!important}.light-green--text.text--accent-1{color:#ccff90!important}.light-green--text.text--accent-1 input,.light-green--text.text--accent-1 textarea{caret-color:#ccff90!important}.light-green.accent-2{border-color:#b2ff59!important}.light-green.accent-2,.light-green.accent-2--after:after{background-color:#b2ff59!important}.light-green--text.text--accent-2{color:#b2ff59!important}.light-green--text.text--accent-2 input,.light-green--text.text--accent-2 textarea{caret-color:#b2ff59!important}.light-green.accent-3{border-color:#76ff03!important}.light-green.accent-3,.light-green.accent-3--after:after{background-color:#76ff03!important}.light-green--text.text--accent-3{color:#76ff03!important}.light-green--text.text--accent-3 input,.light-green--text.text--accent-3 textarea{caret-color:#76ff03!important}.light-green.accent-4{border-color:#64dd17!important}.light-green.accent-4,.light-green.accent-4--after:after{background-color:#64dd17!important}.light-green--text.text--accent-4{color:#64dd17!important}.light-green--text.text--accent-4 input,.light-green--text.text--accent-4 textarea{caret-color:#64dd17!important}.lime{background-color:#cddc39!important;border-color:#cddc39!important}.lime--text{color:#cddc39!important}.lime--text input,.lime--text textarea{caret-color:#cddc39!important}.lime--after:after{background:#cddc39!important}.lime.lighten-5{border-color:#f9fbe7!important}.lime.lighten-5,.lime.lighten-5--after:after{background-color:#f9fbe7!important}.lime--text.text--lighten-5{color:#f9fbe7!important}.lime--text.text--lighten-5 input,.lime--text.text--lighten-5 textarea{caret-color:#f9fbe7!important}.lime.lighten-4{border-color:#f0f4c3!important}.lime.lighten-4,.lime.lighten-4--after:after{background-color:#f0f4c3!important}.lime--text.text--lighten-4{color:#f0f4c3!important}.lime--text.text--lighten-4 input,.lime--text.text--lighten-4 textarea{caret-color:#f0f4c3!important}.lime.lighten-3{border-color:#e6ee9c!important}.lime.lighten-3,.lime.lighten-3--after:after{background-color:#e6ee9c!important}.lime--text.text--lighten-3{color:#e6ee9c!important}.lime--text.text--lighten-3 input,.lime--text.text--lighten-3 textarea{caret-color:#e6ee9c!important}.lime.lighten-2{border-color:#dce775!important}.lime.lighten-2,.lime.lighten-2--after:after{background-color:#dce775!important}.lime--text.text--lighten-2{color:#dce775!important}.lime--text.text--lighten-2 input,.lime--text.text--lighten-2 textarea{caret-color:#dce775!important}.lime.lighten-1{border-color:#d4e157!important}.lime.lighten-1,.lime.lighten-1--after:after{background-color:#d4e157!important}.lime--text.text--lighten-1{color:#d4e157!important}.lime--text.text--lighten-1 input,.lime--text.text--lighten-1 textarea{caret-color:#d4e157!important}.lime.darken-1{border-color:#c0ca33!important}.lime.darken-1,.lime.darken-1--after:after{background-color:#c0ca33!important}.lime--text.text--darken-1{color:#c0ca33!important}.lime--text.text--darken-1 input,.lime--text.text--darken-1 textarea{caret-color:#c0ca33!important}.lime.darken-2{border-color:#afb42b!important}.lime.darken-2,.lime.darken-2--after:after{background-color:#afb42b!important}.lime--text.text--darken-2{color:#afb42b!important}.lime--text.text--darken-2 input,.lime--text.text--darken-2 textarea{caret-color:#afb42b!important}.lime.darken-3{border-color:#9e9d24!important}.lime.darken-3,.lime.darken-3--after:after{background-color:#9e9d24!important}.lime--text.text--darken-3{color:#9e9d24!important}.lime--text.text--darken-3 input,.lime--text.text--darken-3 textarea{caret-color:#9e9d24!important}.lime.darken-4{border-color:#827717!important}.lime.darken-4,.lime.darken-4--after:after{background-color:#827717!important}.lime--text.text--darken-4{color:#827717!important}.lime--text.text--darken-4 input,.lime--text.text--darken-4 textarea{caret-color:#827717!important}.lime.accent-1{border-color:#f4ff81!important}.lime.accent-1,.lime.accent-1--after:after{background-color:#f4ff81!important}.lime--text.text--accent-1{color:#f4ff81!important}.lime--text.text--accent-1 input,.lime--text.text--accent-1 textarea{caret-color:#f4ff81!important}.lime.accent-2{border-color:#eeff41!important}.lime.accent-2,.lime.accent-2--after:after{background-color:#eeff41!important}.lime--text.text--accent-2{color:#eeff41!important}.lime--text.text--accent-2 input,.lime--text.text--accent-2 textarea{caret-color:#eeff41!important}.lime.accent-3{border-color:#c6ff00!important}.lime.accent-3,.lime.accent-3--after:after{background-color:#c6ff00!important}.lime--text.text--accent-3{color:#c6ff00!important}.lime--text.text--accent-3 input,.lime--text.text--accent-3 textarea{caret-color:#c6ff00!important}.lime.accent-4{border-color:#aeea00!important}.lime.accent-4,.lime.accent-4--after:after{background-color:#aeea00!important}.lime--text.text--accent-4{color:#aeea00!important}.lime--text.text--accent-4 input,.lime--text.text--accent-4 textarea{caret-color:#aeea00!important}.yellow{background-color:#ffeb3b!important;border-color:#ffeb3b!important}.yellow--text{color:#ffeb3b!important}.yellow--text input,.yellow--text textarea{caret-color:#ffeb3b!important}.yellow--after:after{background:#ffeb3b!important}.yellow.lighten-5{border-color:#fffde7!important}.yellow.lighten-5,.yellow.lighten-5--after:after{background-color:#fffde7!important}.yellow--text.text--lighten-5{color:#fffde7!important}.yellow--text.text--lighten-5 input,.yellow--text.text--lighten-5 textarea{caret-color:#fffde7!important}.yellow.lighten-4{border-color:#fff9c4!important}.yellow.lighten-4,.yellow.lighten-4--after:after{background-color:#fff9c4!important}.yellow--text.text--lighten-4{color:#fff9c4!important}.yellow--text.text--lighten-4 input,.yellow--text.text--lighten-4 textarea{caret-color:#fff9c4!important}.yellow.lighten-3{border-color:#fff59d!important}.yellow.lighten-3,.yellow.lighten-3--after:after{background-color:#fff59d!important}.yellow--text.text--lighten-3{color:#fff59d!important}.yellow--text.text--lighten-3 input,.yellow--text.text--lighten-3 textarea{caret-color:#fff59d!important}.yellow.lighten-2{border-color:#fff176!important}.yellow.lighten-2,.yellow.lighten-2--after:after{background-color:#fff176!important}.yellow--text.text--lighten-2{color:#fff176!important}.yellow--text.text--lighten-2 input,.yellow--text.text--lighten-2 textarea{caret-color:#fff176!important}.yellow.lighten-1{border-color:#ffee58!important}.yellow.lighten-1,.yellow.lighten-1--after:after{background-color:#ffee58!important}.yellow--text.text--lighten-1{color:#ffee58!important}.yellow--text.text--lighten-1 input,.yellow--text.text--lighten-1 textarea{caret-color:#ffee58!important}.yellow.darken-1{border-color:#fdd835!important}.yellow.darken-1,.yellow.darken-1--after:after{background-color:#fdd835!important}.yellow--text.text--darken-1{color:#fdd835!important}.yellow--text.text--darken-1 input,.yellow--text.text--darken-1 textarea{caret-color:#fdd835!important}.yellow.darken-2{border-color:#fbc02d!important}.yellow.darken-2,.yellow.darken-2--after:after{background-color:#fbc02d!important}.yellow--text.text--darken-2{color:#fbc02d!important}.yellow--text.text--darken-2 input,.yellow--text.text--darken-2 textarea{caret-color:#fbc02d!important}.yellow.darken-3{border-color:#f9a825!important}.yellow.darken-3,.yellow.darken-3--after:after{background-color:#f9a825!important}.yellow--text.text--darken-3{color:#f9a825!important}.yellow--text.text--darken-3 input,.yellow--text.text--darken-3 textarea{caret-color:#f9a825!important}.yellow.darken-4{border-color:#f57f17!important}.yellow.darken-4,.yellow.darken-4--after:after{background-color:#f57f17!important}.yellow--text.text--darken-4{color:#f57f17!important}.yellow--text.text--darken-4 input,.yellow--text.text--darken-4 textarea{caret-color:#f57f17!important}.yellow.accent-1{border-color:#ffff8d!important}.yellow.accent-1,.yellow.accent-1--after:after{background-color:#ffff8d!important}.yellow--text.text--accent-1{color:#ffff8d!important}.yellow--text.text--accent-1 input,.yellow--text.text--accent-1 textarea{caret-color:#ffff8d!important}.yellow.accent-2{border-color:#ff0!important}.yellow.accent-2,.yellow.accent-2--after:after{background-color:#ff0!important}.yellow--text.text--accent-2{color:#ff0!important}.yellow--text.text--accent-2 input,.yellow--text.text--accent-2 textarea{caret-color:#ff0!important}.yellow.accent-3{border-color:#ffea00!important}.yellow.accent-3,.yellow.accent-3--after:after{background-color:#ffea00!important}.yellow--text.text--accent-3{color:#ffea00!important}.yellow--text.text--accent-3 input,.yellow--text.text--accent-3 textarea{caret-color:#ffea00!important}.yellow.accent-4{border-color:#ffd600!important}.yellow.accent-4,.yellow.accent-4--after:after{background-color:#ffd600!important}.yellow--text.text--accent-4{color:#ffd600!important}.yellow--text.text--accent-4 input,.yellow--text.text--accent-4 textarea{caret-color:#ffd600!important}.amber{background-color:#ffc107!important;border-color:#ffc107!important}.amber--text{color:#ffc107!important}.amber--text input,.amber--text textarea{caret-color:#ffc107!important}.amber--after:after{background:#ffc107!important}.amber.lighten-5{border-color:#fff8e1!important}.amber.lighten-5,.amber.lighten-5--after:after{background-color:#fff8e1!important}.amber--text.text--lighten-5{color:#fff8e1!important}.amber--text.text--lighten-5 input,.amber--text.text--lighten-5 textarea{caret-color:#fff8e1!important}.amber.lighten-4{border-color:#ffecb3!important}.amber.lighten-4,.amber.lighten-4--after:after{background-color:#ffecb3!important}.amber--text.text--lighten-4{color:#ffecb3!important}.amber--text.text--lighten-4 input,.amber--text.text--lighten-4 textarea{caret-color:#ffecb3!important}.amber.lighten-3{border-color:#ffe082!important}.amber.lighten-3,.amber.lighten-3--after:after{background-color:#ffe082!important}.amber--text.text--lighten-3{color:#ffe082!important}.amber--text.text--lighten-3 input,.amber--text.text--lighten-3 textarea{caret-color:#ffe082!important}.amber.lighten-2{border-color:#ffd54f!important}.amber.lighten-2,.amber.lighten-2--after:after{background-color:#ffd54f!important}.amber--text.text--lighten-2{color:#ffd54f!important}.amber--text.text--lighten-2 input,.amber--text.text--lighten-2 textarea{caret-color:#ffd54f!important}.amber.lighten-1{border-color:#ffca28!important}.amber.lighten-1,.amber.lighten-1--after:after{background-color:#ffca28!important}.amber--text.text--lighten-1{color:#ffca28!important}.amber--text.text--lighten-1 input,.amber--text.text--lighten-1 textarea{caret-color:#ffca28!important}.amber.darken-1{border-color:#ffb300!important}.amber.darken-1,.amber.darken-1--after:after{background-color:#ffb300!important}.amber--text.text--darken-1{color:#ffb300!important}.amber--text.text--darken-1 input,.amber--text.text--darken-1 textarea{caret-color:#ffb300!important}.amber.darken-2{border-color:#ffa000!important}.amber.darken-2,.amber.darken-2--after:after{background-color:#ffa000!important}.amber--text.text--darken-2{color:#ffa000!important}.amber--text.text--darken-2 input,.amber--text.text--darken-2 textarea{caret-color:#ffa000!important}.amber.darken-3{border-color:#ff8f00!important}.amber.darken-3,.amber.darken-3--after:after{background-color:#ff8f00!important}.amber--text.text--darken-3{color:#ff8f00!important}.amber--text.text--darken-3 input,.amber--text.text--darken-3 textarea{caret-color:#ff8f00!important}.amber.darken-4{border-color:#ff6f00!important}.amber.darken-4,.amber.darken-4--after:after{background-color:#ff6f00!important}.amber--text.text--darken-4{color:#ff6f00!important}.amber--text.text--darken-4 input,.amber--text.text--darken-4 textarea{caret-color:#ff6f00!important}.amber.accent-1{border-color:#ffe57f!important}.amber.accent-1,.amber.accent-1--after:after{background-color:#ffe57f!important}.amber--text.text--accent-1{color:#ffe57f!important}.amber--text.text--accent-1 input,.amber--text.text--accent-1 textarea{caret-color:#ffe57f!important}.amber.accent-2{border-color:#ffd740!important}.amber.accent-2,.amber.accent-2--after:after{background-color:#ffd740!important}.amber--text.text--accent-2{color:#ffd740!important}.amber--text.text--accent-2 input,.amber--text.text--accent-2 textarea{caret-color:#ffd740!important}.amber.accent-3{border-color:#ffc400!important}.amber.accent-3,.amber.accent-3--after:after{background-color:#ffc400!important}.amber--text.text--accent-3{color:#ffc400!important}.amber--text.text--accent-3 input,.amber--text.text--accent-3 textarea{caret-color:#ffc400!important}.amber.accent-4{border-color:#ffab00!important}.amber.accent-4,.amber.accent-4--after:after{background-color:#ffab00!important}.amber--text.text--accent-4{color:#ffab00!important}.amber--text.text--accent-4 input,.amber--text.text--accent-4 textarea{caret-color:#ffab00!important}.orange{background-color:#ff9800!important;border-color:#ff9800!important}.orange--text{color:#ff9800!important}.orange--text input,.orange--text textarea{caret-color:#ff9800!important}.orange--after:after{background:#ff9800!important}.orange.lighten-5{border-color:#fff3e0!important}.orange.lighten-5,.orange.lighten-5--after:after{background-color:#fff3e0!important}.orange--text.text--lighten-5{color:#fff3e0!important}.orange--text.text--lighten-5 input,.orange--text.text--lighten-5 textarea{caret-color:#fff3e0!important}.orange.lighten-4{border-color:#ffe0b2!important}.orange.lighten-4,.orange.lighten-4--after:after{background-color:#ffe0b2!important}.orange--text.text--lighten-4{color:#ffe0b2!important}.orange--text.text--lighten-4 input,.orange--text.text--lighten-4 textarea{caret-color:#ffe0b2!important}.orange.lighten-3{border-color:#ffcc80!important}.orange.lighten-3,.orange.lighten-3--after:after{background-color:#ffcc80!important}.orange--text.text--lighten-3{color:#ffcc80!important}.orange--text.text--lighten-3 input,.orange--text.text--lighten-3 textarea{caret-color:#ffcc80!important}.orange.lighten-2{border-color:#ffb74d!important}.orange.lighten-2,.orange.lighten-2--after:after{background-color:#ffb74d!important}.orange--text.text--lighten-2{color:#ffb74d!important}.orange--text.text--lighten-2 input,.orange--text.text--lighten-2 textarea{caret-color:#ffb74d!important}.orange.lighten-1{border-color:#ffa726!important}.orange.lighten-1,.orange.lighten-1--after:after{background-color:#ffa726!important}.orange--text.text--lighten-1{color:#ffa726!important}.orange--text.text--lighten-1 input,.orange--text.text--lighten-1 textarea{caret-color:#ffa726!important}.orange.darken-1{border-color:#fb8c00!important}.orange.darken-1,.orange.darken-1--after:after{background-color:#fb8c00!important}.orange--text.text--darken-1{color:#fb8c00!important}.orange--text.text--darken-1 input,.orange--text.text--darken-1 textarea{caret-color:#fb8c00!important}.orange.darken-2{border-color:#f57c00!important}.orange.darken-2,.orange.darken-2--after:after{background-color:#f57c00!important}.orange--text.text--darken-2{color:#f57c00!important}.orange--text.text--darken-2 input,.orange--text.text--darken-2 textarea{caret-color:#f57c00!important}.orange.darken-3{border-color:#ef6c00!important}.orange.darken-3,.orange.darken-3--after:after{background-color:#ef6c00!important}.orange--text.text--darken-3{color:#ef6c00!important}.orange--text.text--darken-3 input,.orange--text.text--darken-3 textarea{caret-color:#ef6c00!important}.orange.darken-4{border-color:#e65100!important}.orange.darken-4,.orange.darken-4--after:after{background-color:#e65100!important}.orange--text.text--darken-4{color:#e65100!important}.orange--text.text--darken-4 input,.orange--text.text--darken-4 textarea{caret-color:#e65100!important}.orange.accent-1{border-color:#ffd180!important}.orange.accent-1,.orange.accent-1--after:after{background-color:#ffd180!important}.orange--text.text--accent-1{color:#ffd180!important}.orange--text.text--accent-1 input,.orange--text.text--accent-1 textarea{caret-color:#ffd180!important}.orange.accent-2{border-color:#ffab40!important}.orange.accent-2,.orange.accent-2--after:after{background-color:#ffab40!important}.orange--text.text--accent-2{color:#ffab40!important}.orange--text.text--accent-2 input,.orange--text.text--accent-2 textarea{caret-color:#ffab40!important}.orange.accent-3{border-color:#ff9100!important}.orange.accent-3,.orange.accent-3--after:after{background-color:#ff9100!important}.orange--text.text--accent-3{color:#ff9100!important}.orange--text.text--accent-3 input,.orange--text.text--accent-3 textarea{caret-color:#ff9100!important}.orange.accent-4{border-color:#ff6d00!important}.orange.accent-4,.orange.accent-4--after:after{background-color:#ff6d00!important}.orange--text.text--accent-4{color:#ff6d00!important}.orange--text.text--accent-4 input,.orange--text.text--accent-4 textarea{caret-color:#ff6d00!important}.deep-orange{background-color:#ff5722!important;border-color:#ff5722!important}.deep-orange--text{color:#ff5722!important}.deep-orange--text input,.deep-orange--text textarea{caret-color:#ff5722!important}.deep-orange--after:after{background:#ff5722!important}.deep-orange.lighten-5{border-color:#fbe9e7!important}.deep-orange.lighten-5,.deep-orange.lighten-5--after:after{background-color:#fbe9e7!important}.deep-orange--text.text--lighten-5{color:#fbe9e7!important}.deep-orange--text.text--lighten-5 input,.deep-orange--text.text--lighten-5 textarea{caret-color:#fbe9e7!important}.deep-orange.lighten-4{border-color:#ffccbc!important}.deep-orange.lighten-4,.deep-orange.lighten-4--after:after{background-color:#ffccbc!important}.deep-orange--text.text--lighten-4{color:#ffccbc!important}.deep-orange--text.text--lighten-4 input,.deep-orange--text.text--lighten-4 textarea{caret-color:#ffccbc!important}.deep-orange.lighten-3{border-color:#ffab91!important}.deep-orange.lighten-3,.deep-orange.lighten-3--after:after{background-color:#ffab91!important}.deep-orange--text.text--lighten-3{color:#ffab91!important}.deep-orange--text.text--lighten-3 input,.deep-orange--text.text--lighten-3 textarea{caret-color:#ffab91!important}.deep-orange.lighten-2{border-color:#ff8a65!important}.deep-orange.lighten-2,.deep-orange.lighten-2--after:after{background-color:#ff8a65!important}.deep-orange--text.text--lighten-2{color:#ff8a65!important}.deep-orange--text.text--lighten-2 input,.deep-orange--text.text--lighten-2 textarea{caret-color:#ff8a65!important}.deep-orange.lighten-1{border-color:#ff7043!important}.deep-orange.lighten-1,.deep-orange.lighten-1--after:after{background-color:#ff7043!important}.deep-orange--text.text--lighten-1{color:#ff7043!important}.deep-orange--text.text--lighten-1 input,.deep-orange--text.text--lighten-1 textarea{caret-color:#ff7043!important}.deep-orange.darken-1{border-color:#f4511e!important}.deep-orange.darken-1,.deep-orange.darken-1--after:after{background-color:#f4511e!important}.deep-orange--text.text--darken-1{color:#f4511e!important}.deep-orange--text.text--darken-1 input,.deep-orange--text.text--darken-1 textarea{caret-color:#f4511e!important}.deep-orange.darken-2{border-color:#e64a19!important}.deep-orange.darken-2,.deep-orange.darken-2--after:after{background-color:#e64a19!important}.deep-orange--text.text--darken-2{color:#e64a19!important}.deep-orange--text.text--darken-2 input,.deep-orange--text.text--darken-2 textarea{caret-color:#e64a19!important}.deep-orange.darken-3{border-color:#d84315!important}.deep-orange.darken-3,.deep-orange.darken-3--after:after{background-color:#d84315!important}.deep-orange--text.text--darken-3{color:#d84315!important}.deep-orange--text.text--darken-3 input,.deep-orange--text.text--darken-3 textarea{caret-color:#d84315!important}.deep-orange.darken-4{border-color:#bf360c!important}.deep-orange.darken-4,.deep-orange.darken-4--after:after{background-color:#bf360c!important}.deep-orange--text.text--darken-4{color:#bf360c!important}.deep-orange--text.text--darken-4 input,.deep-orange--text.text--darken-4 textarea{caret-color:#bf360c!important}.deep-orange.accent-1{border-color:#ff9e80!important}.deep-orange.accent-1,.deep-orange.accent-1--after:after{background-color:#ff9e80!important}.deep-orange--text.text--accent-1{color:#ff9e80!important}.deep-orange--text.text--accent-1 input,.deep-orange--text.text--accent-1 textarea{caret-color:#ff9e80!important}.deep-orange.accent-2{border-color:#ff6e40!important}.deep-orange.accent-2,.deep-orange.accent-2--after:after{background-color:#ff6e40!important}.deep-orange--text.text--accent-2{color:#ff6e40!important}.deep-orange--text.text--accent-2 input,.deep-orange--text.text--accent-2 textarea{caret-color:#ff6e40!important}.deep-orange.accent-3{border-color:#ff3d00!important}.deep-orange.accent-3,.deep-orange.accent-3--after:after{background-color:#ff3d00!important}.deep-orange--text.text--accent-3{color:#ff3d00!important}.deep-orange--text.text--accent-3 input,.deep-orange--text.text--accent-3 textarea{caret-color:#ff3d00!important}.deep-orange.accent-4{border-color:#dd2c00!important}.deep-orange.accent-4,.deep-orange.accent-4--after:after{background-color:#dd2c00!important}.deep-orange--text.text--accent-4{color:#dd2c00!important}.deep-orange--text.text--accent-4 input,.deep-orange--text.text--accent-4 textarea{caret-color:#dd2c00!important}.brown{background-color:#795548!important;border-color:#795548!important}.brown--text{color:#795548!important}.brown--text input,.brown--text textarea{caret-color:#795548!important}.brown--after:after{background:#795548!important}.brown.lighten-5{border-color:#efebe9!important}.brown.lighten-5,.brown.lighten-5--after:after{background-color:#efebe9!important}.brown--text.text--lighten-5{color:#efebe9!important}.brown--text.text--lighten-5 input,.brown--text.text--lighten-5 textarea{caret-color:#efebe9!important}.brown.lighten-4{border-color:#d7ccc8!important}.brown.lighten-4,.brown.lighten-4--after:after{background-color:#d7ccc8!important}.brown--text.text--lighten-4{color:#d7ccc8!important}.brown--text.text--lighten-4 input,.brown--text.text--lighten-4 textarea{caret-color:#d7ccc8!important}.brown.lighten-3{border-color:#bcaaa4!important}.brown.lighten-3,.brown.lighten-3--after:after{background-color:#bcaaa4!important}.brown--text.text--lighten-3{color:#bcaaa4!important}.brown--text.text--lighten-3 input,.brown--text.text--lighten-3 textarea{caret-color:#bcaaa4!important}.brown.lighten-2{border-color:#a1887f!important}.brown.lighten-2,.brown.lighten-2--after:after{background-color:#a1887f!important}.brown--text.text--lighten-2{color:#a1887f!important}.brown--text.text--lighten-2 input,.brown--text.text--lighten-2 textarea{caret-color:#a1887f!important}.brown.lighten-1{border-color:#8d6e63!important}.brown.lighten-1,.brown.lighten-1--after:after{background-color:#8d6e63!important}.brown--text.text--lighten-1{color:#8d6e63!important}.brown--text.text--lighten-1 input,.brown--text.text--lighten-1 textarea{caret-color:#8d6e63!important}.brown.darken-1{border-color:#6d4c41!important}.brown.darken-1,.brown.darken-1--after:after{background-color:#6d4c41!important}.brown--text.text--darken-1{color:#6d4c41!important}.brown--text.text--darken-1 input,.brown--text.text--darken-1 textarea{caret-color:#6d4c41!important}.brown.darken-2{border-color:#5d4037!important}.brown.darken-2,.brown.darken-2--after:after{background-color:#5d4037!important}.brown--text.text--darken-2{color:#5d4037!important}.brown--text.text--darken-2 input,.brown--text.text--darken-2 textarea{caret-color:#5d4037!important}.brown.darken-3{border-color:#4e342e!important}.brown.darken-3,.brown.darken-3--after:after{background-color:#4e342e!important}.brown--text.text--darken-3{color:#4e342e!important}.brown--text.text--darken-3 input,.brown--text.text--darken-3 textarea{caret-color:#4e342e!important}.brown.darken-4{border-color:#3e2723!important}.brown.darken-4,.brown.darken-4--after:after{background-color:#3e2723!important}.brown--text.text--darken-4{color:#3e2723!important}.brown--text.text--darken-4 input,.brown--text.text--darken-4 textarea{caret-color:#3e2723!important}.blue-grey{background-color:#607d8b!important;border-color:#607d8b!important}.blue-grey--text{color:#607d8b!important}.blue-grey--text input,.blue-grey--text textarea{caret-color:#607d8b!important}.blue-grey--after:after{background:#607d8b!important}.blue-grey.lighten-5{border-color:#eceff1!important}.blue-grey.lighten-5,.blue-grey.lighten-5--after:after{background-color:#eceff1!important}.blue-grey--text.text--lighten-5{color:#eceff1!important}.blue-grey--text.text--lighten-5 input,.blue-grey--text.text--lighten-5 textarea{caret-color:#eceff1!important}.blue-grey.lighten-4{border-color:#cfd8dc!important}.blue-grey.lighten-4,.blue-grey.lighten-4--after:after{background-color:#cfd8dc!important}.blue-grey--text.text--lighten-4{color:#cfd8dc!important}.blue-grey--text.text--lighten-4 input,.blue-grey--text.text--lighten-4 textarea{caret-color:#cfd8dc!important}.blue-grey.lighten-3{border-color:#b0bec5!important}.blue-grey.lighten-3,.blue-grey.lighten-3--after:after{background-color:#b0bec5!important}.blue-grey--text.text--lighten-3{color:#b0bec5!important}.blue-grey--text.text--lighten-3 input,.blue-grey--text.text--lighten-3 textarea{caret-color:#b0bec5!important}.blue-grey.lighten-2{border-color:#90a4ae!important}.blue-grey.lighten-2,.blue-grey.lighten-2--after:after{background-color:#90a4ae!important}.blue-grey--text.text--lighten-2{color:#90a4ae!important}.blue-grey--text.text--lighten-2 input,.blue-grey--text.text--lighten-2 textarea{caret-color:#90a4ae!important}.blue-grey.lighten-1{border-color:#78909c!important}.blue-grey.lighten-1,.blue-grey.lighten-1--after:after{background-color:#78909c!important}.blue-grey--text.text--lighten-1{color:#78909c!important}.blue-grey--text.text--lighten-1 input,.blue-grey--text.text--lighten-1 textarea{caret-color:#78909c!important}.blue-grey.darken-1{border-color:#546e7a!important}.blue-grey.darken-1,.blue-grey.darken-1--after:after{background-color:#546e7a!important}.blue-grey--text.text--darken-1{color:#546e7a!important}.blue-grey--text.text--darken-1 input,.blue-grey--text.text--darken-1 textarea{caret-color:#546e7a!important}.blue-grey.darken-2{border-color:#455a64!important}.blue-grey.darken-2,.blue-grey.darken-2--after:after{background-color:#455a64!important}.blue-grey--text.text--darken-2{color:#455a64!important}.blue-grey--text.text--darken-2 input,.blue-grey--text.text--darken-2 textarea{caret-color:#455a64!important}.blue-grey.darken-3{border-color:#37474f!important}.blue-grey.darken-3,.blue-grey.darken-3--after:after{background-color:#37474f!important}.blue-grey--text.text--darken-3{color:#37474f!important}.blue-grey--text.text--darken-3 input,.blue-grey--text.text--darken-3 textarea{caret-color:#37474f!important}.blue-grey.darken-4{border-color:#263238!important}.blue-grey.darken-4,.blue-grey.darken-4--after:after{background-color:#263238!important}.blue-grey--text.text--darken-4{color:#263238!important}.blue-grey--text.text--darken-4 input,.blue-grey--text.text--darken-4 textarea{caret-color:#263238!important}.grey{background-color:#9e9e9e!important;border-color:#9e9e9e!important}.grey--text{color:#9e9e9e!important}.grey--text input,.grey--text textarea{caret-color:#9e9e9e!important}.grey--after:after{background:#9e9e9e!important}.grey.lighten-5{border-color:#fafafa!important}.grey.lighten-5,.grey.lighten-5--after:after{background-color:#fafafa!important}.grey--text.text--lighten-5{color:#fafafa!important}.grey--text.text--lighten-5 input,.grey--text.text--lighten-5 textarea{caret-color:#fafafa!important}.grey.lighten-4{border-color:#f5f5f5!important}.grey.lighten-4,.grey.lighten-4--after:after{background-color:#f5f5f5!important}.grey--text.text--lighten-4{color:#f5f5f5!important}.grey--text.text--lighten-4 input,.grey--text.text--lighten-4 textarea{caret-color:#f5f5f5!important}.grey.lighten-3{border-color:#eee!important}.grey.lighten-3,.grey.lighten-3--after:after{background-color:#eee!important}.grey--text.text--lighten-3{color:#eee!important}.grey--text.text--lighten-3 input,.grey--text.text--lighten-3 textarea{caret-color:#eee!important}.grey.lighten-2{border-color:#e0e0e0!important}.grey.lighten-2,.grey.lighten-2--after:after{background-color:#e0e0e0!important}.grey--text.text--lighten-2{color:#e0e0e0!important}.grey--text.text--lighten-2 input,.grey--text.text--lighten-2 textarea{caret-color:#e0e0e0!important}.grey.lighten-1{border-color:#bdbdbd!important}.grey.lighten-1,.grey.lighten-1--after:after{background-color:#bdbdbd!important}.grey--text.text--lighten-1{color:#bdbdbd!important}.grey--text.text--lighten-1 input,.grey--text.text--lighten-1 textarea{caret-color:#bdbdbd!important}.grey.darken-1{border-color:#757575!important}.grey.darken-1,.grey.darken-1--after:after{background-color:#757575!important}.grey--text.text--darken-1{color:#757575!important}.grey--text.text--darken-1 input,.grey--text.text--darken-1 textarea{caret-color:#757575!important}.grey.darken-2{border-color:#616161!important}.grey.darken-2,.grey.darken-2--after:after{background-color:#616161!important}.grey--text.text--darken-2{color:#616161!important}.grey--text.text--darken-2 input,.grey--text.text--darken-2 textarea{caret-color:#616161!important}.grey.darken-3{border-color:#424242!important}.grey.darken-3,.grey.darken-3--after:after{background-color:#424242!important}.grey--text.text--darken-3{color:#424242!important}.grey--text.text--darken-3 input,.grey--text.text--darken-3 textarea{caret-color:#424242!important}.grey.darken-4{border-color:#212121!important}.grey.darken-4,.grey.darken-4--after:after{background-color:#212121!important}.grey--text.text--darken-4{color:#212121!important}.grey--text.text--darken-4 input,.grey--text.text--darken-4 textarea{caret-color:#212121!important}.shades.black{border-color:#000!important}.shades.black,.shades.black--after:after{background-color:#000!important}.shades--text.text--black{color:#000!important}.shades--text.text--black input,.shades--text.text--black textarea{caret-color:#000!important}.shades.white{border-color:#fff!important}.shades.white,.shades.white--after:after{background-color:#fff!important}.shades--text.text--white{color:#fff!important}.shades--text.text--white input,.shades--text.text--white textarea{caret-color:#fff!important}.shades.transparent{border-color:transparent!important}.shades.transparent,.shades.transparent--after:after{background-color:transparent!important}.shades--text.text--transparent{color:transparent!important}.shades--text.text--transparent input,.shades--text.text--transparent textarea{caret-color:transparent!important}.elevation-0{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)!important}.elevation-1{box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)!important}.elevation-2{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)!important}.elevation-3{box-shadow:0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12)!important}.elevation-4{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)!important}.elevation-5{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12)!important}.elevation-6{box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)!important}.elevation-7{box-shadow:0 4px 5px -2px rgba(0,0,0,.2),0 7px 10px 1px rgba(0,0,0,.14),0 2px 16px 1px rgba(0,0,0,.12)!important}.elevation-8{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)!important}.elevation-9{box-shadow:0 5px 6px -3px rgba(0,0,0,.2),0 9px 12px 1px rgba(0,0,0,.14),0 3px 16px 2px rgba(0,0,0,.12)!important}.elevation-10{box-shadow:0 6px 6px -3px rgba(0,0,0,.2),0 10px 14px 1px rgba(0,0,0,.14),0 4px 18px 3px rgba(0,0,0,.12)!important}.elevation-11{box-shadow:0 6px 7px -4px rgba(0,0,0,.2),0 11px 15px 1px rgba(0,0,0,.14),0 4px 20px 3px rgba(0,0,0,.12)!important}.elevation-12{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)!important}.elevation-13{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 13px 19px 2px rgba(0,0,0,.14),0 5px 24px 4px rgba(0,0,0,.12)!important}.elevation-14{box-shadow:0 7px 9px -4px rgba(0,0,0,.2),0 14px 21px 2px rgba(0,0,0,.14),0 5px 26px 4px rgba(0,0,0,.12)!important}.elevation-15{box-shadow:0 8px 9px -5px rgba(0,0,0,.2),0 15px 22px 2px rgba(0,0,0,.14),0 6px 28px 5px rgba(0,0,0,.12)!important}.elevation-16{box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)!important}.elevation-17{box-shadow:0 8px 11px -5px rgba(0,0,0,.2),0 17px 26px 2px rgba(0,0,0,.14),0 6px 32px 5px rgba(0,0,0,.12)!important}.elevation-18{box-shadow:0 9px 11px -5px rgba(0,0,0,.2),0 18px 28px 2px rgba(0,0,0,.14),0 7px 34px 6px rgba(0,0,0,.12)!important}.elevation-19{box-shadow:0 9px 12px -6px rgba(0,0,0,.2),0 19px 29px 2px rgba(0,0,0,.14),0 7px 36px 6px rgba(0,0,0,.12)!important}.elevation-20{box-shadow:0 10px 13px -6px rgba(0,0,0,.2),0 20px 31px 3px rgba(0,0,0,.14),0 8px 38px 7px rgba(0,0,0,.12)!important}.elevation-21{box-shadow:0 10px 13px -6px rgba(0,0,0,.2),0 21px 33px 3px rgba(0,0,0,.14),0 8px 40px 7px rgba(0,0,0,.12)!important}.elevation-22{box-shadow:0 10px 14px -6px rgba(0,0,0,.2),0 22px 35px 3px rgba(0,0,0,.14),0 8px 42px 7px rgba(0,0,0,.12)!important}.elevation-23{box-shadow:0 11px 14px -7px rgba(0,0,0,.2),0 23px 36px 3px rgba(0,0,0,.14),0 9px 44px 8px rgba(0,0,0,.12)!important}.elevation-24{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12)!important}html{box-sizing:border-box;overflow-y:scroll;-webkit-text-size-adjust:100%}*,:after,:before{box-sizing:inherit}:after,:before{text-decoration:inherit;vertical-align:inherit}*{background-repeat:no-repeat;padding:0;margin:0}audio:not([controls]){display:none;height:0}hr{overflow:visible}article,aside,details,figcaption,figure,footer,header,main,menu,nav,section,summary{display:block}summary{display:list-item}small{font-size:80%}[hidden],template{display:none}abbr[title]{border-bottom:1px dotted;text-decoration:none}a{background-color:transparent;-webkit-text-decoration-skip:objects}a:active,a:hover{outline-width:0}code,kbd,pre,samp{font-family:monospace,monospace}b,strong{font-weight:bolder}dfn{font-style:italic}mark{background-color:#ff0;color:#000}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}input{border-radius:0}[role=button],[type=button],[type=reset],[type=submit],button{cursor:pointer}[disabled]{cursor:default}[type=number]{width:auto}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}textarea{overflow:auto;resize:vertical}button,input,optgroup,select,textarea{font:inherit}optgroup{font-weight:700}button{overflow:visible}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:0;padding:0}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button:-moz-focusring{outline:0;border:0}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}button,select{text-transform:none}button,input,select,textarea{background-color:transparent;border-style:none;color:inherit}select{-moz-appearance:none;-webkit-appearance:none}select::-ms-expand{display:none}select::-ms-value{color:currentColor}legend{border:0;color:inherit;display:table;max-width:100%;white-space:normal}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}img{border-style:none}progress{vertical-align:baseline}svg:not(:root){overflow:hidden}audio,canvas,progress,video{display:inline-block}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled]{cursor:default}::-moz-selection{background-color:#b3d4fc;color:#000;text-shadow:none}::selection{background-color:#b3d4fc;color:#000;text-shadow:none}.bottom-sheet-transition-enter,.bottom-sheet-transition-leave-to{-webkit-transform:translateY(100%);transform:translateY(100%)}.carousel-transition-enter{-webkit-transform:translate(100%);transform:translate(100%)}.carousel-transition-leave,.carousel-transition-leave-to{position:absolute;top:0}.carousel-reverse-transition-enter,.carousel-transition-leave,.carousel-transition-leave-to{-webkit-transform:translate(-100%);transform:translate(-100%)}.carousel-reverse-transition-leave,.carousel-reverse-transition-leave-to{position:absolute;top:0;-webkit-transform:translate(100%);transform:translate(100%)}.dialog-transition-enter,.dialog-transition-leave-to{-webkit-transform:scale(.5);transform:scale(.5);opacity:0}.dialog-transition-enter-to,.dialog-transition-leave{opacity:1}.dialog-bottom-transition-enter,.dialog-bottom-transition-leave-to{-webkit-transform:translateY(100%);transform:translateY(100%)}.picker-reverse-transition-enter-active,.picker-reverse-transition-leave-active,.picker-transition-enter-active,.picker-transition-leave-active{transition:.3s cubic-bezier(0,0,.2,1)}.picker-reverse-transition-enter,.picker-reverse-transition-leave-to,.picker-transition-enter,.picker-transition-leave-to{opacity:0}.picker-reverse-transition-enter-to,.picker-transition-enter-to{transtion:translate(0,0)}.picker-reverse-transition-leave,.picker-reverse-transition-leave-active,.picker-reverse-transition-leave-to,.picker-transition-leave,.picker-transition-leave-active,.picker-transition-leave-to{position:absolute!important}.picker-transition-enter{-webkit-transform:translateY(100%);transform:translateY(100%)}.picker-reverse-transition-enter,.picker-transition-leave-to{-webkit-transform:translateY(-100%);transform:translateY(-100%)}.picker-reverse-transition-leave-to{-webkit-transform:translateY(100%);transform:translateY(100%)}.picker-title-transition-enter-to,.picker-title-transition-leave{-webkit-transform:translate(0);transform:translate(0)}.picker-title-transition-enter{-webkit-transform:translate(-100%);transform:translate(-100%)}.picker-title-transition-leave-to{opacity:0;-webkit-transform:translate(100%);transform:translate(100%)}.picker-title-transition-leave,.picker-title-transition-leave-active,.picker-title-transition-leave-to{position:absolute!important}.tab-transition-enter{-webkit-transform:translate(100%);transform:translate(100%)}.tab-transition-enter-to{-webkit-transform:translate(0);transform:translate(0)}.tab-transition-leave,.tab-transition-leave-active{position:absolute;top:0}.tab-transition-leave-to{position:absolute}.tab-reverse-transition-enter,.tab-transition-leave-to{-webkit-transform:translate(-100%);transform:translate(-100%)}.tab-reverse-transition-leave,.tab-reverse-transition-leave-to{top:0;position:absolute;-webkit-transform:translate(100%);transform:translate(100%)}.scale-transition-enter-active,.scale-transition-leave-active{transition:.2s cubic-bezier(.4,0,.6,1)}.scale-transition-enter,.scale-transition-leave,.scale-transition-leave-to{opacity:0;-webkit-transform:scale(0);transform:scale(0)}.slide-y-transition-enter-active,.slide-y-transition-leave-active{transition:.3s cubic-bezier(.25,.8,.5,1)}.slide-y-transition-enter,.slide-y-transition-leave-to{opacity:0;-webkit-transform:translateY(-15px);transform:translateY(-15px)}.slide-y-reverse-transition-enter-active,.slide-y-reverse-transition-leave-active{transition:.3s cubic-bezier(.25,.8,.5,1)}.slide-y-reverse-transition-enter,.slide-y-reverse-transition-leave-to{opacity:0;-webkit-transform:translateY(15px);transform:translateY(15px)}.slide-x-transition-enter-active,.slide-x-transition-leave-active{transition:.3s cubic-bezier(.25,.8,.5,1)}.slide-x-transition-enter,.slide-x-transition-leave-to{opacity:0;-webkit-transform:translateX(-15px);transform:translateX(-15px)}.slide-x-reverse-transition-enter-active,.slide-x-reverse-transition-leave-active{transition:.3s cubic-bezier(.25,.8,.5,1)}.slide-x-reverse-transition-enter,.slide-x-reverse-transition-leave-to{opacity:0;-webkit-transform:translateX(15px);transform:translateX(15px)}.fade-transition-enter-active,.fade-transition-leave-active{transition:.3s cubic-bezier(.25,.8,.5,1)}.fade-transition-enter,.fade-transition-leave-to{opacity:0}.fab-transition-enter-active,.fab-transition-leave-active{transition:.3s cubic-bezier(.25,.8,.5,1)}.fab-transition-enter,.fab-transition-leave-to{-webkit-transform:scale(0) rotate(-45deg);transform:scale(0) rotate(-45deg)}.blockquote{padding:16px 0 16px 24px;font-size:18px;font-weight:300}code,kbd{display:inline-block;border-radius:3px;white-space:pre-wrap;font-size:85%;font-weight:900}code:after,code:before,kbd:after,kbd:before{content:\"\\A0\";letter-spacing:-1px}code{background-color:#f5f5f5;color:#bd4147;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}kbd{background:#424242;color:#fff}html{font-size:14px;overflow-x:hidden;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:rgba(0,0,0,0)}.application{font-family:Roboto,sans-serif;line-height:1.5}::-ms-clear,::-ms-reveal{display:none}.browser-list{padding-left:24px}.browser-list--unstyled{list-style-type:none}.display-4{font-size:112px!important;font-weight:300;line-height:1!important;letter-spacing:-.04em!important}.display-3{font-size:56px!important;font-weight:400;line-height:1.35!important;letter-spacing:-.02em!important}.display-2{font-size:45px!important;line-height:48px!important}.display-1,.display-2{font-weight:400;letter-spacing:normal!important}.display-1{font-size:34px!important;line-height:40px!important}.headline{font-size:24px!important;font-weight:400;line-height:32px!important;letter-spacing:normal!important}.title{font-size:20px!important;font-weight:500;line-height:1!important;letter-spacing:.02em!important}.subheading{font-size:16px!important;font-weight:400}.body-2{font-weight:500}.body-1,.body-2{font-size:14px!important}.body-1,.caption{font-weight:400}.caption{font-size:12px!important}p{margin-bottom:16px}.overflow-hidden{overflow:hidden}.overflow-x-hidden{overflow-x:hidden}.overflow-y-hidden{overflow-y:hidden}.right{float:right!important}.left{float:left!important}.mx-auto{margin-left:auto!important;margin-right:auto!important}.mt-0{margin-top:0!important}.mr-0{margin-right:0!important}.mb-0{margin-bottom:0!important}.ml-0,.mx-0{margin-left:0!important}.mx-0{margin-right:0!important}.my-0{margin-top:0!important;margin-bottom:0!important}.ma-0{margin:0!important}.pt-0{padding-top:0!important}.pr-0{padding-right:0!important}.pb-0{padding-bottom:0!important}.pl-0,.px-0{padding-left:0!important}.px-0{padding-right:0!important}.py-0{padding-top:0!important;padding-bottom:0!important}.pa-0{padding:0!important}.mt-1{margin-top:4px!important}.mr-1{margin-right:4px!important}.mb-1{margin-bottom:4px!important}.ml-1,.mx-1{margin-left:4px!important}.mx-1{margin-right:4px!important}.my-1{margin-top:4px!important;margin-bottom:4px!important}.ma-1{margin:4px!important}.pt-1{padding-top:4px!important}.pr-1{padding-right:4px!important}.pb-1{padding-bottom:4px!important}.pl-1,.px-1{padding-left:4px!important}.px-1{padding-right:4px!important}.py-1{padding-top:4px!important;padding-bottom:4px!important}.pa-1{padding:4px!important}.mt-2{margin-top:8px!important}.mr-2{margin-right:8px!important}.mb-2{margin-bottom:8px!important}.ml-2,.mx-2{margin-left:8px!important}.mx-2{margin-right:8px!important}.my-2{margin-top:8px!important;margin-bottom:8px!important}.ma-2{margin:8px!important}.pt-2{padding-top:8px!important}.pr-2{padding-right:8px!important}.pb-2{padding-bottom:8px!important}.pl-2,.px-2{padding-left:8px!important}.px-2{padding-right:8px!important}.py-2{padding-top:8px!important;padding-bottom:8px!important}.pa-2{padding:8px!important}.mt-3{margin-top:16px!important}.mr-3{margin-right:16px!important}.mb-3{margin-bottom:16px!important}.ml-3,.mx-3{margin-left:16px!important}.mx-3{margin-right:16px!important}.my-3{margin-top:16px!important;margin-bottom:16px!important}.ma-3{margin:16px!important}.pt-3{padding-top:16px!important}.pr-3{padding-right:16px!important}.pb-3{padding-bottom:16px!important}.pl-3,.px-3{padding-left:16px!important}.px-3{padding-right:16px!important}.py-3{padding-top:16px!important;padding-bottom:16px!important}.pa-3{padding:16px!important}.mt-4{margin-top:24px!important}.mr-4{margin-right:24px!important}.mb-4{margin-bottom:24px!important}.ml-4,.mx-4{margin-left:24px!important}.mx-4{margin-right:24px!important}.my-4{margin-top:24px!important;margin-bottom:24px!important}.ma-4{margin:24px!important}.pt-4{padding-top:24px!important}.pr-4{padding-right:24px!important}.pb-4{padding-bottom:24px!important}.pl-4,.px-4{padding-left:24px!important}.px-4{padding-right:24px!important}.py-4{padding-top:24px!important;padding-bottom:24px!important}.pa-4{padding:24px!important}.mt-5{margin-top:48px!important}.mr-5{margin-right:48px!important}.mb-5{margin-bottom:48px!important}.ml-5,.mx-5{margin-left:48px!important}.mx-5{margin-right:48px!important}.my-5{margin-top:48px!important;margin-bottom:48px!important}.ma-5{margin:48px!important}.pt-5{padding-top:48px!important}.pr-5{padding-right:48px!important}.pb-5{padding-bottom:48px!important}.pl-5,.px-5{padding-left:48px!important}.px-5{padding-right:48px!important}.py-5{padding-top:48px!important;padding-bottom:48px!important}.pa-5{padding:48px!important}@media screen{[hidden~=screen]{display:inherit}[hidden~=screen]:not(:active):not(:focus):not(:target){position:absolute!important;clip:rect(0 0 0 0)!important}}@media only screen and (max-width:599px){.hidden-xs-only{display:none!important}}@media only screen and (min-width:600px) and (max-width:959px){.hidden-sm-only{display:none!important}}@media only screen and (max-width:959px){.hidden-sm-and-down{display:none!important}}@media only screen and (min-width:600px){.hidden-sm-and-up{display:none!important}}@media only screen and (min-width:960px) and (max-width:1263px){.hidden-md-only{display:none!important}}@media only screen and (max-width:1263px){.hidden-md-and-down{display:none!important}}@media only screen and (min-width:960px){.hidden-md-and-up{display:none!important}}@media only screen and (min-width:1264px) and (max-width:1903px){.hidden-lg-only{display:none!important}}@media only screen and (max-width:1903px){.hidden-lg-and-down{display:none!important}}@media only screen and (min-width:1264px){.hidden-lg-and-up{display:none!important}}@media only screen and (min-width:1904px){.hidden-xl-only{display:none!important}}@media (min-width:0){.text-xs-left{text-align:left!important}.text-xs-center{text-align:center!important}.text-xs-right{text-align:right!important}.text-xs-justify{text-align:justify!important}}@media (min-width:600px){.text-sm-left{text-align:left!important}.text-sm-center{text-align:center!important}.text-sm-right{text-align:right!important}.text-sm-justify{text-align:justify!important}}@media (min-width:960px){.text-md-left{text-align:left!important}.text-md-center{text-align:center!important}.text-md-right{text-align:right!important}.text-md-justify{text-align:justify!important}}@media (min-width:1264px){.text-lg-left{text-align:left!important}.text-lg-center{text-align:center!important}.text-lg-right{text-align:right!important}.text-lg-justify{text-align:justify!important}}@media (min-width:1904px){.text-xl-left{text-align:left!important}.text-xl-center{text-align:center!important}.text-xl-right{text-align:right!important}.text-xl-justify{text-align:justify!important}}.application,.application--wrap{display:-webkit-box;display:-ms-flexbox;display:flex}.application--wrap{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;min-height:100vh;max-width:100%;position:relative}.application.theme--light{background:#fafafa;color:rgba(0,0,0,.87)}.application.theme--light a{cursor:pointer}.application.theme--light .text--primary{color:rgba(0,0,0,.87)!important}.application.theme--light .text--secondary{color:rgba(0,0,0,.54)!important}.application.theme--light .text--disabled{color:rgba(0,0,0,.38)!important}.application.theme--dark{background:#303030;color:#fff}.application.theme--dark a{cursor:pointer}.application.theme--dark .text--primary{color:#fff!important}.application.theme--dark .text--secondary{color:hsla(0,0%,100%,.7)!important}.application.theme--dark .text--disabled{color:hsla(0,0%,100%,.5)!important}@media print{@-moz-document url-prefix(){.application,.application--wrap{display:block}}}.alert{border-radius:0;border-width:4px 0 0;border-style:solid;color:#fff;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:14px;margin:4px auto;padding:16px;position:relative;transition:.3s cubic-bezier(.25,.8,.5,1)}.alert .alert__icon.icon,.alert__dismissible .icon{-ms-flex-item-align:center;align-self:center;color:rgba(0,0,0,.3);font-size:24px}.alert--outline .icon{color:inherit!important}.alert__icon{margin-right:16px}.alert__dismissible{-ms-flex-item-align:start;align-self:flex-start;color:inherit;margin-left:16px;margin-right:0;text-decoration:none;transition:.3s cubic-bezier(.25,.8,.5,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.alert__dismissible:hover{opacity:.8}.alert--no-icon .alert__icon{display:none}.alert>div{-ms-flex-item-align:center;align-self:center;-webkit-box-flex:1;-ms-flex:1 1;flex:1 1}.alert.alert{border-color:rgba(0,0,0,.12)!important}.alert.alert--outline{border:1px solid currentColor!important}@media screen and (max-width:600px){.alert__icon{display:none}}.application .theme--light.icon,.theme--light .icon{color:rgba(0,0,0,.54)}.application .theme--light.icon.icon--disabled:not(.input-group__append-icon),.theme--light .icon.icon--disabled:not(.input-group__append-icon){color:rgba(0,0,0,.38)!important}.application .theme--dark.icon,.theme--dark .icon{color:#fff}.application .theme--dark.icon.icon--disabled:not(.input-group__append-icon),.theme--dark .icon.icon--disabled:not(.input-group__append-icon){color:hsla(0,0%,100%,.5)!important}.icon{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-font-feature-settings:\"liga\";font-feature-settings:\"liga\";font-size:24px;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;line-height:1;transition:.3s cubic-bezier(.25,.8,.5,1);vertical-align:middle}.icon.icon--large{font-size:2.5rem}.icon.icon--medium{font-size:2rem}.icon.icon--x-large{font-size:3rem}.icon.icon--disabled{pointer-events:none}.avatar{-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;position:relative;text-align:center;vertical-align:middle}.avatar,.avatar .icon,.avatar img{border-radius:50%;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.avatar .icon,.avatar img{height:inherit;width:inherit}.avatar--tile,.avatar--tile .icon,.avatar--tile img{border-radius:0}.badge{display:inline-block;position:relative}.badge__badge{color:#fff;display:-webkit-box;display:-ms-flexbox;display:flex;position:absolute;top:-11px;right:-22px;border-radius:50%;height:22px;width:22px;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;transition:.3s cubic-bezier(.25,.8,.5,1)}.badge__badge,.badge__badge .icon{font-size:14px}.badge--overlap .badge__badge{top:-8px;right:-8px}.badge--overlap.badge--left .badge__badge{left:-8px;right:auto}.badge--overlap.badge--bottom .badge__badge{bottom:-8px;top:auto}.badge--left .badge__badge{left:-22px}.badge--bottom .badge__badge{bottom:-11px;top:auto}.application .theme--light.bottom-nav,.theme--light .bottom-nav{background-color:#fff}.application .theme--dark.bottom-nav,.theme--dark .bottom-nav{background-color:#424242}.bottom-nav{bottom:0;box-shadow:0 3px 14px 2px rgba(0,0,0,.12);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-transform:translateY(60px);transform:translateY(60px);transition:all .4s cubic-bezier(.25,.8,.5,1);width:100%;z-index:4}.bottom-nav--absolute{position:absolute}.bottom-nav--active{-webkit-transform:translate(0);transform:translate(0)}.bottom-nav--fixed{position:fixed}.bottom-nav .btn{background:transparent!important;border-radius:0;box-shadow:none!important;font-weight:400;height:100%;margin:0;max-width:168px;min-width:80px;padding:6px 0 10px;text-transform:none;opacity:.5;width:100%}.bottom-nav .btn .btn__content{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;font-size:12px;white-space:nowrap;will-change:font-size}.bottom-nav .btn .btn__content i.icon{color:inherit;margin-bottom:4px;transition:all .4s cubic-bezier(.25,.8,.5,1)}.bottom-nav .btn .btn__content span{line-height:1}.bottom-nav .btn--active{opacity:1}.bottom-nav .btn--active .btn__content{font-size:14px}.bottom-nav .btn--active .btn__content:before{opacity:0}.bottom-nav .btn--active .btn__content .icon{-webkit-transform:none;transform:none}.bottom-nav .btn:not(.btn--active){-webkit-filter:grayscale(100%);filter:grayscale(100%)}.bottom-nav--shift .btn__content{font-size:14px}.bottom-nav--shift .btn{transition:all .3s;min-width:56px;max-width:96px}.bottom-nav--shift .btn--active{min-width:96px;max-width:168px}.bottom-nav--shift .btn:not(.btn--active) .btn__content .icon{-webkit-transform:scale(1) translateY(10px);transform:scale(1) translateY(10px)}.bottom-nav--shift .btn:not(.btn--active) .btn__content span{color:transparent}.bottom-sheet.dialog{-ms-flex-item-align:end;align-self:flex-end;border-radius:0;-webkit-box-flex:1;-ms-flex:1 0 100%;flex:1 0 100%;margin:0;min-width:100%;overflow:visible;transition:.4s cubic-bezier(.25,.8,.5,1)}.bottom-sheet.dialog.bottom-sheet--inset{max-width:70%;min-width:0}@media only screen and (max-width:599px){.bottom-sheet.dialog.bottom-sheet--inset{max-width:none}}.dialog{box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);border-radius:2px;margin:24px;overflow-y:auto;pointer-events:auto;z-index:inherit}.dialog,.dialog__content{transition:.3s ease-in-out;width:100%}.dialog__content{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;height:100%;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;left:0;pointer-events:none;position:fixed;top:0;z-index:6;outline:none}.dialog:not(.dialog--fullscreen){max-height:90%}.dialog__container{display:inline-block;vertical-align:middle}.dialog--fullscreen{margin:0;height:100%;position:fixed;overflow-y:auto;top:0;left:0}.dialog--fullscreen>.card{min-height:100%;min-width:100%;margin:0!important;padding:0!important}.dialog--scrollable,.dialog--scrollable>.card{display:-webkit-box;display:-ms-flexbox;display:flex}.dialog--scrollable>.card{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.dialog--scrollable>.card>.card__actions,.dialog--scrollable>.card>.card__title{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto}.dialog--scrollable>.card>.card__text{overflow-y:auto;-webkit-backface-visibility:hidden;backface-visibility:hidden}.overlay{position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;transition:.5s cubic-bezier(.25,.8,.5,1);z-index:5}.overlay--absolute,.overlay:before{position:absolute}.overlay:before{background-color:#212121;bottom:0;content:\"\";height:100%;left:0;opacity:0;right:0;top:0;transition:inherit;transition-delay:.15s;width:100%}.overlay--active{pointer-events:auto;-ms-touch-action:none;touch-action:none}.overlay--active:before{opacity:.46}.application .theme--light.breadcrumbs li.breadcrumbs__divider,.application .theme--light.breadcrumbs li .breadcrumbs__item--disabled,.application .theme--light.breadcrumbs li:last-child .breadcrumbs__item,.theme--light .breadcrumbs li.breadcrumbs__divider,.theme--light .breadcrumbs li .breadcrumbs__item--disabled,.theme--light .breadcrumbs li:last-child .breadcrumbs__item{color:rgba(0,0,0,.38)}.application .theme--dark.breadcrumbs li.breadcrumbs__divider,.application .theme--dark.breadcrumbs li .breadcrumbs__item--disabled,.application .theme--dark.breadcrumbs li:last-child .breadcrumbs__item,.theme--dark .breadcrumbs li.breadcrumbs__divider,.theme--dark .breadcrumbs li .breadcrumbs__item--disabled,.theme--dark .breadcrumbs li:last-child .breadcrumbs__item{color:hsla(0,0%,100%,.5)}.breadcrumbs{-ms-flex-align:center;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;list-style-type:none;margin:0;padding:18px 12px}.breadcrumbs,.breadcrumbs li{-webkit-box-align:center;align-items:center}.breadcrumbs li{-ms-flex-align:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;font-size:14px}.breadcrumbs li .icon{font-size:16px}.breadcrumbs li:last-child a{cursor:default;pointer-events:none}.breadcrumbs li:nth-child(2n){padding:0 12px}.breadcrumbs--large li,.breadcrumbs--large li .icon{font-size:16px}.breadcrumbs__item{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;text-decoration:none;transition:.3s cubic-bezier(.25,.8,.5,1)}.breadcrumbs__item--disabled{pointer-events:none}.ripple__container{border-radius:inherit;width:100%;height:100%;z-index:0;contain:strict}.ripple__animation,.ripple__container{color:inherit;position:absolute;left:0;top:0;overflow:hidden;pointer-events:none}.ripple__animation{border-radius:50%;background:currentColor;opacity:0;transition:.4s cubic-bezier(0,0,.2,1);will-change:transform,opacity}.ripple__animation--enter{transition:none}.ripple__animation--visible{opacity:.15}.application .theme--light.btn,.theme--light .btn{color:rgba(0,0,0,.87)}.application .theme--light.btn.btn--disabled,.application .theme--light.btn.btn--disabled .icon,.theme--light .btn.btn--disabled,.theme--light .btn.btn--disabled .icon{color:rgba(0,0,0,.26)!important}.application .theme--light.btn.btn--disabled:not(.btn--icon):not(.btn--flat),.theme--light .btn.btn--disabled:not(.btn--icon):not(.btn--flat){background-color:rgba(0,0,0,.12)!important}.application .theme--light.btn:not(.btn--icon):not(.btn--flat),.theme--light .btn:not(.btn--icon):not(.btn--flat){background-color:#f5f5f5}.application .theme--dark.btn,.theme--dark .btn{color:#fff}.application .theme--dark.btn.btn--disabled,.application .theme--dark.btn.btn--disabled .icon,.theme--dark .btn.btn--disabled,.theme--dark .btn.btn--disabled .icon{color:hsla(0,0%,100%,.3)!important}.application .theme--dark.btn.btn--disabled:not(.btn--icon):not(.btn--flat),.theme--dark .btn.btn--disabled:not(.btn--icon):not(.btn--flat){background-color:hsla(0,0%,100%,.12)!important}.application .theme--dark.btn:not(.btn--icon):not(.btn--flat),.theme--dark .btn:not(.btn--icon):not(.btn--flat){background-color:#212121}.btn{-webkit-box-align:center;-ms-flex-align:center;align-items:center;border-radius:2px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;height:36px;-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;font-size:14px;font-weight:500;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin:6px 8px;min-width:88px;outline:0;text-transform:uppercase;text-decoration:none;transition:.3s cubic-bezier(.25,.8,.5,1),color 1ms;position:relative;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.btn__content:before{border-radius:inherit;color:inherit;content:\"\";position:absolute;left:0;top:0;height:100%;opacity:.12;transition:.3s cubic-bezier(.25,.8,.5,1);width:100%}.btn--small{font-size:13px;height:28px}.btn--small .btn__content{padding:0 8px}.btn--large{font-size:15px;height:44px}.btn--large .btn__content{padding:0 32px}.btn--active .btn__content:before,.btn:focus .btn__content:before,.btn:hover .btn__content:before{background-color:currentColor}.btn__content{-webkit-box-align:center;-ms-flex-align:center;align-items:center;border-radius:inherit;color:inherit;display:-webkit-box;display:-ms-flexbox;display:flex;height:inherit;-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin:0 auto;padding:0 16px;transition:.3s cubic-bezier(.25,.8,.5,1);white-space:nowrap;width:inherit}.btn .btn__content .icon{color:inherit}.btn--flat{background-color:transparent!important;box-shadow:none!important}.btn:not(.btn--depressed){will-change:box-shadow;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.btn:not(.btn--depressed):active{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.btn:not(.btn--depressed):active .btn__content,.btn:not(.btn--depressed):focus .btn__content{position:relative;top:0;left:0}.btn--icon{background:transparent;box-shadow:none!important;border-radius:50%;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;min-width:0;width:36px}.btn--icon.btn--small{width:28px}.btn--icon.btn--large{width:44px}.btn--floating,.btn--icon .btn__content:before{border-radius:50%}.btn--floating{min-width:0;height:56px;width:56px;padding:0}.btn--floating.btn--absolute,.btn--floating.btn--fixed{z-index:4}.btn--floating:not(.btn--depressed){box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)}.btn--floating:not(.btn--depressed):active{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.btn--floating .btn__content{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;margin:0;padding:0}.btn--floating:after{border-radius:50%}.btn--floating .btn__content :not(:only-child){transition:.3s cubic-bezier(.25,.8,.5,1)}.btn--floating .btn__content :not(:only-child):first-child{opacity:1}.btn--floating .btn__content :not(:only-child):last-child{opacity:0;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.btn--floating .btn__content :not(:only-child):first-child,.btn--floating .btn__content :not(:only-child):last-child{-webkit-backface-visibility:hidden;position:absolute;left:0;top:0}.btn--floating.btn--active .btn__content :not(:only-child):first-child{opacity:0;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.btn--floating.btn--active .btn__content :not(:only-child):last-child{opacity:1;-webkit-transform:rotate(0);transform:rotate(0)}.btn--floating .icon{height:inherit;width:inherit}.btn--floating.btn--small{height:40px;width:40px}.btn--floating.btn--small .icon{font-size:18px}.btn--floating.btn--large{height:72px;width:72px}.btn--floating.btn--large .icon{font-size:30px}.btn--reverse .btn__content{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.btn--reverse.btn--column .btn__content{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.btn--absolute,.btn--fixed{margin:0}.btn.btn--absolute{position:absolute}.btn.btn--fixed{position:fixed}.btn--top:not(.btn--absolute){top:16px}.btn--top.btn--absolute{top:-28px}.btn--top.btn--absolute.btn--small{top:-20px}.btn--top.btn--absolute.btn--large{top:-36px}.btn--bottom:not(.btn--absolute){bottom:16px}.btn--bottom.btn--absolute{bottom:-28px}.btn--bottom.btn--absolute.btn--small{bottom:-20px}.btn--bottom.btn--absolute.btn--large{bottom:-36px}.btn--left{left:16px}.btn--right{right:16px}.btn.btn--disabled{box-shadow:none!important;pointer-events:none}.btn--icon .btn__content{padding:0}.btn--loader{pointer-events:none}.btn--loader .btn__content{opacity:0}.btn__loading{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;height:100%;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;left:0;position:absolute;top:0;width:100%}.btn__loading .icon--left{margin-right:1rem;line-height:inherit}.btn__loading .icon--right{margin-left:1rem;line-height:inherit}.btn.btn--outline{border:1px solid currentColor;background:transparent!important;box-shadow:none}.btn.btn--outline:hover{box-shadow:none}.btn--block{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1;flex:1;margin:6px 0;width:100%}.btn--round,.btn--round:after{border-radius:28px}.btn .icon--right{margin-left:16px}.btn .icon--left{margin-right:16px}.btn.accent,.btn.error,.btn.info,.btn.primary,.btn.secondary,.btn.success,.btn.warning{color:#fff}.progress-circular{position:relative;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex}.progress-circular svg{width:100%;height:100%;margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;z-index:0}.progress-circular--indeterminate svg{-webkit-animation:c 1.4s linear infinite;animation:c 1.4s linear infinite;-webkit-transform-origin:center center;transform-origin:center center;transition:all .2s ease-in-out}.progress-circular--indeterminate .progress-circular__overlay{-webkit-animation:b 1.4s ease-in-out infinite;animation:b 1.4s ease-in-out infinite;stroke-linecap:round;stroke-dasharray:80,200;stroke-dashoffset:0px}.progress-circular__underlay{stroke:rgba(0,0,0,.1);z-index:1}.progress-circular__overlay{stroke:currentColor;z-index:2;transition:all .6s ease-in-out}.progress-circular__info{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}@-webkit-keyframes b{0%{stroke-dasharray:1,200;stroke-dashoffset:0px}50%{stroke-dasharray:100,200;stroke-dashoffset:-15px}to{stroke-dasharray:100,200;stroke-dashoffset:-125px}}@keyframes b{0%{stroke-dasharray:1,200;stroke-dashoffset:0px}50%{stroke-dasharray:100,200;stroke-dashoffset:-15px}to{stroke-dasharray:100,200;stroke-dashoffset:-125px}}@-webkit-keyframes c{to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes c{to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.application .theme--light.btn-toggle,.theme--light .btn-toggle{background:#fff}.application .theme--light.btn-toggle .btn,.theme--light .btn-toggle .btn{color:rgba(0,0,0,.87)}.application .theme--light.btn-toggle .btn.btn--active:not(:last-child):not([data-only-child]),.theme--light .btn-toggle .btn.btn--active:not(:last-child):not([data-only-child]){border-right-color:rgba(0,0,0,.26)}.application .theme--dark.btn-toggle,.theme--dark .btn-toggle{background:#424242}.application .theme--dark.btn-toggle .btn,.theme--dark .btn-toggle .btn{color:#fff}.application .theme--dark.btn-toggle .btn.btn--active:not(:last-child):not([data-only-child]),.theme--dark .btn-toggle .btn.btn--active:not(:last-child):not([data-only-child]){border-right-color:hsla(0,0%,100%,.3)}.btn-toggle{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;border-radius:2px;transition:.3s cubic-bezier(.25,.8,.5,1);will-change:background,box-shadow}.btn-toggle .btn{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;min-width:auto;width:auto;padding:0 8px;margin:0;opacity:.4;border-radius:0}.btn-toggle .btn:not(:last-child){border-right:1px solid transparent}.btn-toggle .btn:after{display:none}.btn-toggle .btn.btn--active{opacity:1}.btn-toggle .btn__content{padding:0}.btn-toggle .btn span+.icon{font-size:medium;margin-left:10px}.btn-toggle .btn:first-child{border-radius:2px 0 0 2px}.btn-toggle .btn:last-child{border-radius:0 2px 2px 0}.btn-toggle--selected{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.application .theme--light.card,.theme--light .card{background-color:#fff;color:rgba(0,0,0,.87)}.application .theme--dark.card,.theme--dark .card{background-color:#424242;color:#fff}.card{display:block;border-radius:2px;min-width:0;position:relative;text-decoration:none;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}.card>:first-child:not(.btn){border-top-left-radius:inherit;border-top-right-radius:inherit}.card>:last-child:not(.btn){border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.card--raised{box-shadow:0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12)}.card--tile{border-radius:0}.card--flat{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)}.card--hover{cursor:pointer;transition:all .4s cubic-bezier(.25,.8,.25,1);transition-property:box-shadow}.card--hover:hover{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.card__title{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;padding:16px}.card__title--primary{padding-top:24px}.card__text{padding:16px;width:100%}.card__media{display:-webkit-box;display:-ms-flexbox;display:flex;overflow:hidden;position:relative}.card__media img{width:100%}.card__media__background{border-radius:inherit;position:absolute;left:0;top:0;width:100%;height:100%}.card__media__content{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;position:relative}.card__actions,.card__media__content{display:-webkit-box;display:-ms-flexbox;display:flex}.card__actions{-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:8px 4px}.card__actions .btn,.card__actions>*{margin:0 4px}.carousel{height:500px;width:100%;position:relative;overflow:hidden;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.carousel__left,.carousel__right{position:absolute;top:50%;z-index:1;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.carousel__left .btn,.carousel__right .btn{color:#fff;margin:0!important;height:auto;width:auto}.carousel__left .btn i,.carousel__right .btn i{font-size:48px}.carousel__left .btn:hover,.carousel__right .btn:hover{background:none}.carousel__left{left:5px}.carousel__right{right:5px}.carousel__controls{background:rgba(0,0,0,.5);-webkit-box-align:center;-ms-flex-align:center;align-items:center;bottom:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;left:0;position:absolute;height:50px;list-style-type:none;width:100%;z-index:1}.carousel__controls__item{color:#fff;margin:0 8px!important}.carousel__controls__item i{opacity:.5;transition:.3s cubic-bezier(.25,.8,.5,1)}.carousel__controls__item--active i{opacity:1;vertical-align:middle}.carousel__controls__item:hover{background:none}.carousel__controls__item:hover i{opacity:.8}.application .theme--light.jumbotron__content,.theme--light .jumbotron__content{color:rgba(0,0,0,.87)}.application .theme--dark.jumbotron__content,.theme--dark .jumbotron__content{color:#fff}.jumbotron{display:block;top:0;transition:.3s cubic-bezier(.25,.8,.5,1);width:100%}.jumbotron__wrapper{height:100%;overflow:hidden;position:relative;transition:inherit;width:100%}.jumbotron__background{position:absolute;top:0;left:0;right:0;bottom:0;contain:strict;transition:inherit}.jumbotron__image{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);min-width:100%;will-change:transform;transition:inherit}.jumbotron__content{height:100%;position:relative;transition:inherit}.application .theme--light.input-group input,.application .theme--light.input-group textarea,.theme--light .input-group input,.theme--light .input-group textarea{color:rgba(0,0,0,.87)}.application .theme--light.input-group input:disabled,.application .theme--light.input-group textarea:disabled,.theme--light .input-group input:disabled,.theme--light .input-group textarea:disabled{color:rgba(0,0,0,.38)}.application .theme--light.input-group:not(.input-group--error) .input-group__messages,.theme--light .input-group:not(.input-group--error) .input-group__messages{color:rgba(0,0,0,.54)}.application .theme--light.input-group.input-group--textarea:not(.input-group--full-width) .input-group__input,.theme--light .input-group.input-group--textarea:not(.input-group--full-width) .input-group__input{border:2px solid rgba(0,0,0,.54)}.application .theme--light.input-group.input-group--solo,.theme--light .input-group.input-group--solo{background:#fff}.application .theme--light.input-group.input-group--solo-inverted,.theme--light .input-group.input-group--solo-inverted{background:rgba(0,0,0,.16)}.application .theme--light.input-group.input-group--solo-inverted.input-group--focused,.theme--light .input-group.input-group--solo-inverted.input-group--focused{background:#424242}.application .theme--light.input-group.input-group--solo-inverted.input-group--focused .input-group__append-icon,.application .theme--light.input-group.input-group--solo-inverted.input-group--focused .input-group__prepend-icon,.application .theme--light.input-group.input-group--solo-inverted.input-group--focused input,.application .theme--light.input-group.input-group--solo-inverted.input-group--focused label,.theme--light .input-group.input-group--solo-inverted.input-group--focused .input-group__append-icon,.theme--light .input-group.input-group--solo-inverted.input-group--focused .input-group__prepend-icon,.theme--light .input-group.input-group--solo-inverted.input-group--focused input,.theme--light .input-group.input-group--solo-inverted.input-group--focused label{color:#fff}.application .theme--light.input-group.input-group--dirty .input-group__selections__comma:not(.input-group__selections__comma--active),.theme--light .input-group.input-group--dirty .input-group__selections__comma:not(.input-group__selections__comma--active){color:rgba(0,0,0,.87)}.application .theme--light.input-group:not(.input-group--error) label,.theme--light .input-group:not(.input-group--error) label{color:rgba(0,0,0,.54)}.application .theme--light.input-group:not(.input-group--error).input-group--disabled .input-group__selections__comma,.application .theme--light.input-group:not(.input-group--error).input-group--disabled label,.theme--light .input-group:not(.input-group--error).input-group--disabled .input-group__selections__comma,.theme--light .input-group:not(.input-group--error).input-group--disabled label{color:rgba(0,0,0,.38)}.application .theme--light.input-group:not(.input-group--error) .input-group__details:before,.theme--light .input-group:not(.input-group--error) .input-group__details:before{background-color:rgba(0,0,0,.42)}.application .theme--light.input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled) .input-group__input .input-group__append-icon:not(:hover),.application .theme--light.input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled) .input-group__input .input-group__prepend-icon:not(:hover),.theme--light .input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled) .input-group__input .input-group__append-icon:not(:hover),.theme--light .input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled) .input-group__input .input-group__prepend-icon:not(:hover){color:rgba(0,0,0,.54)}.application .theme--light.input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled):not(.input-group--disabled):not(.input-group--overflow):not(.input-group--segmented):not(.input-group--editable):hover .input-group__details:before,.theme--light .input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled):not(.input-group--disabled):not(.input-group--overflow):not(.input-group--segmented):not(.input-group--editable):hover .input-group__details:before{background-color:rgba(0,0,0,.87)}.application .theme--light.input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled):not(.input-group--disabled):not(.input-group--overflow):not(.input-group--segmented):not(.input-group--editable):hover.input-group--textarea:not(.input-group--full-width) .input-group__input,.theme--light .input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled):not(.input-group--disabled):not(.input-group--overflow):not(.input-group--segmented):not(.input-group--editable):hover.input-group--textarea:not(.input-group--full-width) .input-group__input{border-color:rgba(0,0,0,.87)}.application .theme--light.input-group.input-group--editable .input-group__details:before,.application .theme--light.input-group.input-group--editable .input-group__input:before,.application .theme--light.input-group.input-group--overflow .input-group__details:before,.application .theme--light.input-group.input-group--overflow .input-group__input:before,.application .theme--light.input-group.input-group--segmented .input-group__details:before,.application .theme--light.input-group.input-group--segmented .input-group__input:before,.theme--light .input-group.input-group--editable .input-group__details:before,.theme--light .input-group.input-group--editable .input-group__input:before,.theme--light .input-group.input-group--overflow .input-group__details:before,.theme--light .input-group.input-group--overflow .input-group__input:before,.theme--light .input-group.input-group--segmented .input-group__details:before,.theme--light .input-group.input-group--segmented .input-group__input:before{background-color:rgba(0,0,0,.12)}.application .theme--light.input-group.input-group--disabled .input-group__input .input-group__append-icon,.application .theme--light.input-group.input-group--disabled .input-group__input .input-group__prepend-icon,.theme--light .input-group.input-group--disabled .input-group__input .input-group__append-icon,.theme--light .input-group.input-group--disabled .input-group__input .input-group__prepend-icon{color:rgba(0,0,0,.38)}.application .theme--light.input-group.input-group--disabled .input-group__details:before,.theme--light .input-group.input-group--disabled .input-group__details:before{background-color:transparent;background-image:linear-gradient(90deg,rgba(0,0,0,.38) 0,rgba(0,0,0,.38) 33%,transparent 0)}.application .theme--light.input-group .input-group--text-field__prefix,.application .theme--light.input-group .input-group--text-field__suffix,.theme--light .input-group .input-group--text-field__prefix,.theme--light .input-group .input-group--text-field__suffix{color:rgba(0,0,0,.54)}.application .theme--light.input-group .input-group--text-field.input-group--disabled__prefix,.application .theme--light.input-group .input-group--text-field.input-group--disabled__suffix,.theme--light .input-group .input-group--text-field.input-group--disabled__prefix,.theme--light .input-group .input-group--text-field.input-group--disabled__suffix{color:rgba(0,0,0,.38)}.application .theme--dark.input-group input,.application .theme--dark.input-group textarea,.theme--dark .input-group input,.theme--dark .input-group textarea{color:#fff}.application .theme--dark.input-group input:disabled,.application .theme--dark.input-group textarea:disabled,.theme--dark .input-group input:disabled,.theme--dark .input-group textarea:disabled{color:hsla(0,0%,100%,.5)}.application .theme--dark.input-group:not(.input-group--error) .input-group__messages,.theme--dark .input-group:not(.input-group--error) .input-group__messages{color:hsla(0,0%,100%,.7)}.application .theme--dark.input-group.input-group--textarea:not(.input-group--full-width) .input-group__input,.theme--dark .input-group.input-group--textarea:not(.input-group--full-width) .input-group__input{border:2px solid hsla(0,0%,100%,.7)}.application .theme--dark.input-group.input-group--solo,.theme--dark .input-group.input-group--solo{background:#424242}.application .theme--dark.input-group.input-group--solo-inverted,.theme--dark .input-group.input-group--solo-inverted{background:hsla(0,0%,100%,.16)}.application .theme--dark.input-group.input-group--solo-inverted.input-group--focused,.theme--dark .input-group.input-group--solo-inverted.input-group--focused{background:#fff}.application .theme--dark.input-group.input-group--solo-inverted.input-group--focused .input-group__append-icon,.application .theme--dark.input-group.input-group--solo-inverted.input-group--focused .input-group__prepend-icon,.application .theme--dark.input-group.input-group--solo-inverted.input-group--focused input,.application .theme--dark.input-group.input-group--solo-inverted.input-group--focused label,.theme--dark .input-group.input-group--solo-inverted.input-group--focused .input-group__append-icon,.theme--dark .input-group.input-group--solo-inverted.input-group--focused .input-group__prepend-icon,.theme--dark .input-group.input-group--solo-inverted.input-group--focused input,.theme--dark .input-group.input-group--solo-inverted.input-group--focused label{color:rgba(0,0,0,.87)}.application .theme--dark.input-group.input-group--dirty .input-group__selections__comma:not(.input-group__selections__comma--active),.theme--dark .input-group.input-group--dirty .input-group__selections__comma:not(.input-group__selections__comma--active){color:#fff}.application .theme--dark.input-group:not(.input-group--error) label,.theme--dark .input-group:not(.input-group--error) label{color:hsla(0,0%,100%,.7)}.application .theme--dark.input-group:not(.input-group--error).input-group--disabled .input-group__selections__comma,.application .theme--dark.input-group:not(.input-group--error).input-group--disabled label,.theme--dark .input-group:not(.input-group--error).input-group--disabled .input-group__selections__comma,.theme--dark .input-group:not(.input-group--error).input-group--disabled label{color:hsla(0,0%,100%,.5)}.application .theme--dark.input-group:not(.input-group--error) .input-group__details:before,.theme--dark .input-group:not(.input-group--error) .input-group__details:before{background-color:hsla(0,0%,100%,.7)}.application .theme--dark.input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled) .input-group__input .input-group__append-icon:not(:hover),.application .theme--dark.input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled) .input-group__input .input-group__prepend-icon:not(:hover),.theme--dark .input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled) .input-group__input .input-group__append-icon:not(:hover),.theme--dark .input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled) .input-group__input .input-group__prepend-icon:not(:hover){color:hsla(0,0%,100%,.7)}.application .theme--dark.input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled):not(.input-group--disabled):not(.input-group--overflow):not(.input-group--segmented):not(.input-group--editable):hover .input-group__details:before,.theme--dark .input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled):not(.input-group--disabled):not(.input-group--overflow):not(.input-group--segmented):not(.input-group--editable):hover .input-group__details:before{background-color:#fff}.application .theme--dark.input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled):not(.input-group--disabled):not(.input-group--overflow):not(.input-group--segmented):not(.input-group--editable):hover.input-group--textarea:not(.input-group--full-width) .input-group__input,.theme--dark .input-group:not(.input-group--error):not(.input-group--focused):not(.input-group--disabled):not(.input-group--disabled):not(.input-group--overflow):not(.input-group--segmented):not(.input-group--editable):hover.input-group--textarea:not(.input-group--full-width) .input-group__input{border-color:#fff}.application .theme--dark.input-group.input-group--editable .input-group__details:before,.application .theme--dark.input-group.input-group--editable .input-group__input:before,.application .theme--dark.input-group.input-group--overflow .input-group__details:before,.application .theme--dark.input-group.input-group--overflow .input-group__input:before,.application .theme--dark.input-group.input-group--segmented .input-group__details:before,.application .theme--dark.input-group.input-group--segmented .input-group__input:before,.theme--dark .input-group.input-group--editable .input-group__details:before,.theme--dark .input-group.input-group--editable .input-group__input:before,.theme--dark .input-group.input-group--overflow .input-group__details:before,.theme--dark .input-group.input-group--overflow .input-group__input:before,.theme--dark .input-group.input-group--segmented .input-group__details:before,.theme--dark .input-group.input-group--segmented .input-group__input:before{background-color:hsla(0,0%,100%,.12)}.application .theme--dark.input-group.input-group--disabled .input-group__input .input-group__append-icon,.application .theme--dark.input-group.input-group--disabled .input-group__input .input-group__prepend-icon,.theme--dark .input-group.input-group--disabled .input-group__input .input-group__append-icon,.theme--dark .input-group.input-group--disabled .input-group__input .input-group__prepend-icon{color:hsla(0,0%,100%,.5)}.application .theme--dark.input-group.input-group--disabled .input-group__details:before,.theme--dark .input-group.input-group--disabled .input-group__details:before{background-color:transparent;background-image:linear-gradient(90deg,hsla(0,0%,100%,.5) 0,hsla(0,0%,100%,.5) 33%,transparent 0)}.application .theme--dark.input-group .input-group--text-field__prefix,.application .theme--dark.input-group .input-group--text-field__suffix,.theme--dark .input-group .input-group--text-field__prefix,.theme--dark .input-group .input-group--text-field__suffix{color:hsla(0,0%,100%,.7)}.application .theme--dark.input-group .input-group--text-field.input-group--disabled__prefix,.application .theme--dark.input-group .input-group--text-field.input-group--disabled__suffix,.theme--dark .input-group .input-group--text-field.input-group--disabled__prefix,.theme--dark .input-group .input-group--text-field.input-group--disabled__suffix{color:hsla(0,0%,100%,.5)}.input-group{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1 1;flex:1 1;-ms-flex-wrap:wrap;flex-wrap:wrap;min-width:24px;padding:18px 0 0;position:relative;width:100%;outline:none;transition:box-shadow .3s cubic-bezier(.25,.8,.5,1)}.input-group input{width:100%}.input-group label{display:inline-block;font-size:16px;line-height:30px;height:30px;max-width:90%;min-width:0;overflow:hidden;pointer-events:none;text-align:left;text-overflow:ellipsis;-webkit-transform-origin:top left;transform-origin:top left;transition:.4s cubic-bezier(.25,.8,.25,1);white-space:nowrap;width:100%;z-index:0}.input-group__input{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1 0 100%;flex:1 0 100%;min-width:0;min-height:30px}.input-group__icon-cb{cursor:pointer}.input-group.input-group--error .input-group__append-icon,.input-group.input-group--error .input-group__prepend-icon,.input-group.input-group--focused .input-group__append-icon,.input-group.input-group--focused .input-group__prepend-icon{color:inherit}.input-group.input-group--append-icon label,.input-group.input-group--prepend-icon label,.input-group.input-group--selection-controls label{max-width:75%}.input-group.input-group--append-icon.input-group--prepend-icon label{max-width:65%}.input-group .input-group__append-icon{padding:0 6px}.input-group .input-group__append-icon,.input-group .input-group__prepend-icon{-ms-flex-item-align:center;align-self:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.input-group.input-group--single-line.input-group--dirty label,.input-group.input-group--solo.input-group--dirty label{display:none}.input-group.input-group--solo{min-height:46px;border-radius:2px;padding:0;transition:.3s cubic-bezier(.25,.8,.5,1);box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.input-group.input-group--solo label{top:8px;padding-left:16px;-webkit-transform:none!important;transform:none!important}.input-group.input-group--solo .input-group__input{-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:8px 16px}.input-group.input-group--solo .input-group__details{display:none}.input-group--disabled{pointer-events:none}.input-group--disabled .input-group__details:before{background-color:transparent;background-position:bottom;background-size:3px 1px;background-repeat:repeat-x}.input-group.input-group--text-field:not(.input-group--single-line):not(.input-group--error).input-group--focused label{color:inherit}.input-group.input-group--text-field:not(.input-group--single-line):not(.input-group--error).input-group--focused .input-group__input{border-color:inherit}.input-group.input-group--text-field.input-group--focused:not(.input-group--disabled) .input-group__details:after{-webkit-transform:scaleX(1);transform:scaleX(1)}.input-group--required label:after{content:\"*\"}.input-group.input-group--error label{-webkit-animation:a .6s cubic-bezier(.25,.8,.5,1);animation:a .6s cubic-bezier(.25,.8,.5,1)}.input-group.input-group--error .input-group__messages{color:inherit}.input-group.input-group--error .input-group__details:before{background-color:currentColor}.input-group .slide-y-transition-leave,.input-group .slide-y-transition-leave-to{position:absolute}.input-group__details{color:inherit;display:-webkit-box;display:-ms-flexbox;display:flex;padding-top:4px;-webkit-box-flex:1;-ms-flex:1 0 100%;flex:1 0 100%;font-size:12px;min-height:26px;overflow:hidden;position:relative;width:100%}.input-group__details:after,.input-group__details:before{content:\"\";position:absolute;left:0;transition:.3s cubic-bezier(.4,0,.2,1)}.input-group__details:after{background-color:currentColor;color:inherit;top:0;height:2px;-webkit-transform:scaleX(0);transform:scaleX(0);-webkit-transform-origin:center center 0;transform-origin:center center 0;width:100%;z-index:1}.input-group__details:before{top:0;height:1px;width:100%;z-index:0}.input-group--hide-details .input-group__details{min-height:2px;padding:0}.input-group--async-loading .input-group__details:after,.input-group--async-loading .input-group__details:before{display:none}.input-group .progress-linear{position:absolute;top:0;left:0;margin:0}.input-group__error,.input-group__hint{transition:.3s cubic-bezier(.25,.8,.25,1)}.input-group__error{color:inherit}.input-group--editable.input-group--active,.input-group--overflow.input-group--active,.input-group--segmented.input-group--active{background-color:#fff}.application .theme--light.input-group--selection-controls label,.theme--light .input-group--selection-controls label{color:rgba(0,0,0,.87)}.application .theme--light.input-group--selection-controls .icon--selection-control,.theme--light .input-group--selection-controls .icon--selection-control{color:rgba(0,0,0,.54)}.application .theme--light.input-group--selection-controls.input-group--active .icon--selection-control,.theme--light .input-group--selection-controls.input-group--active .icon--selection-control{color:inherit}.application .theme--light.input-group--selection-controls.input-group--disabled .input-group__input,.theme--light .input-group--selection-controls.input-group--disabled .input-group__input{color:rgba(0,0,0,.38)}.application .theme--light.input-group--selection-controls.input-group--disabled .input-group__input .icon--checkbox,.application .theme--light.input-group--selection-controls.input-group--disabled .input-group__input .icon--radio,.theme--light .input-group--selection-controls.input-group--disabled .input-group__input .icon--checkbox,.theme--light .input-group--selection-controls.input-group--disabled .input-group__input .icon--radio{color:inherit}.application .theme--dark.input-group--selection-controls label,.theme--dark .input-group--selection-controls label{color:#fff}.application .theme--dark.input-group--selection-controls .icon--selection-control,.theme--dark .input-group--selection-controls .icon--selection-control{color:hsla(0,0%,100%,.7)}.application .theme--dark.input-group--selection-controls.input-group--active .icon--selection-control,.theme--dark .input-group--selection-controls.input-group--active .icon--selection-control{color:inherit}.application .theme--dark.input-group--selection-controls.input-group--disabled .input-group__input,.theme--dark .input-group--selection-controls.input-group--disabled .input-group__input{color:hsla(0,0%,100%,.5)}.application .theme--dark.input-group--selection-controls.input-group--disabled .input-group__input .icon--checkbox,.application .theme--dark.input-group--selection-controls.input-group--disabled .input-group__input .icon--radio,.theme--dark .input-group--selection-controls.input-group--disabled .input-group__input .icon--checkbox,.theme--dark .input-group--selection-controls.input-group--disabled .input-group__input .icon--radio{color:inherit}.input-group--selection-controls.input-group--tab-focused .input-group--selection-controls__ripple:before,.input-group--tab-focused .input-group:focus .input-group--selection-controls__ripple:before{-webkit-transform:translate(-50%,-50%) scale(1);transform:translate(-50%,-50%) scale(1);opacity:.15}.input-group.input-group--selection-controls{display:-webkit-box;display:-ms-flexbox;display:flex;padding:0}.input-group.input-group--selection-controls .icon--selection-control{cursor:pointer;position:absolute;left:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:.3s cubic-bezier(.4,0,.6,1)}.input-group.input-group--selection-controls .input-group__details:after,.input-group.input-group--selection-controls .input-group__details:before{display:none}.input-group.input-group--selection-controls .input-group__input{color:inherit;width:100%;position:relative}.input-group.input-group--selection-controls .input-group__input .icon--selection-control{-ms-flex-item-align:center;align-self:center;height:30px;margin:auto}.input-group.input-group--selection-controls.input-group--error .input-group__input .icon--selection-control,.input-group.input-group--selection-controls.input-group--error label{color:inherit}.input-group.input-group--selection-controls label{cursor:pointer;position:absolute;left:32px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1}.input-group.input-group--selection-controls:not(.input-group--disabled) label{pointer-events:all}.input-group--selection-controls__ripple{border-radius:50%;height:48px;width:48px;cursor:pointer;position:absolute;-webkit-transform:translate(-12px,-50%);transform:translate(-12px,-50%);-webkit-transform-origin:center center;transform-origin:center center;top:50%;left:0}.input-group--selection-controls__ripple:before{content:\"\";position:absolute;width:36px;height:36px;background:currentColor;border-radius:50%;left:50%;top:50%;-webkit-transform:translate(-50%,-50%) scale(.3);transform:translate(-50%,-50%) scale(.3);opacity:0;transition:.4s cubic-bezier(0,0,.2,1);-webkit-transform-origin:center center;transform-origin:center center}.input-group--prepend-icon.input-group--selection-controls .icon--selection-control,.input-group--prepend-icon.input-group--selection-controls .input-group--selection-controls__ripple{left:38px}.input-group--prepend-icon.input-group--selection-controls label{left:76px}.input-group--append-icon.input-group--selection-controls .input-group__append-icon{position:absolute;left:32px}.input-group--append-icon.input-group--selection-controls.input-group--selection-controls label{left:76px}.input-group--append-icon.input-group--prepend-icon.input-group--selection-controls .input-group__append-icon{left:72px}.input-group--append-icon.input-group--prepend-icon.input-group--selection-controls.input-group--selection-controls label{left:112px}.input-group--prepend-icon.radio-group--row .icon--selection-control,.input-group--prepend-icon.radio-group--row .input-group--selection-controls__ripple{left:14px}.input-group--prepend-icon.radio-group--row label{left:52px}.progress-linear{background:transparent;margin:1rem 0;overflow:hidden;width:100%;position:relative}.progress-linear__bar{width:100%;position:relative;z-index:1}.progress-linear__bar,.progress-linear__bar__determinate{height:inherit;transition:.2s}.progress-linear__bar__indeterminate .long,.progress-linear__bar__indeterminate .short{height:inherit;position:absolute;left:0;top:0;bottom:0;will-change:left,right;width:auto;background-color:inherit}.progress-linear__bar__indeterminate--active .long{-webkit-animation:d;animation:d;-webkit-animation-duration:2.2s;animation-duration:2.2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.progress-linear__bar__indeterminate--active .short{-webkit-animation:e;animation:e;-webkit-animation-duration:2.2s;animation-duration:2.2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.progress-linear__background{position:absolute;top:0;left:0;bottom:0;transition:.3s ease-in}.progress-linear--query .progress-linear__bar__indeterminate--active .long{-webkit-animation:f;animation:f;-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.progress-linear--query .progress-linear__bar__indeterminate--active .short{-webkit-animation:g;animation:g;-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}@-webkit-keyframes d{0%{left:-90%;right:100%}60%{left:-90%;right:100%}to{left:100%;right:-35%}}@keyframes d{0%{left:-90%;right:100%}60%{left:-90%;right:100%}to{left:100%;right:-35%}}@-webkit-keyframes e{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@keyframes e{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@-webkit-keyframes f{0%{right:-90%;left:100%}60%{right:-90%;left:100%}to{right:100%;left:-35%}}@keyframes f{0%{right:-90%;left:100%}60%{right:-90%;left:100%}to{right:100%;left:-35%}}@-webkit-keyframes g{0%{right:-200%;left:100%}60%{right:107%;left:-8%}to{right:107%;left:-8%}}@keyframes g{0%{right:-200%;left:100%}60%{right:107%;left:-8%}to{right:107%;left:-8%}}.application .theme--light.chip,.theme--light .chip{background:#e0e0e0;color:rgba(0,0,0,.87)}.application .theme--dark.chip,.theme--dark .chip{background:#fff;color:rgba(0,0,0,.87)}.chip{border-radius:28px;border:1px solid transparent;font-size:13px;margin:4px;outline:none;position:relative;transition:.3s cubic-bezier(.25,.8,.5,1)}.chip,.chip .chip__content{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;vertical-align:middle}.chip .chip__content{border-radius:28px;cursor:default;height:32px;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;padding:0 12px;white-space:nowrap;z-index:1}.chip--removable .chip__content{padding:0 4px 0 12px}.chip .avatar{height:32px!important;margin-left:-12px;margin-right:8px;min-width:32px;width:32px!important}.chip .avatar img{height:100%;width:100%}.chip--active:not(.chip--disabled),.chip--selected:not(.chip--disabled),.chip:focus:not(.chip--disabled){border-color:rgba(0,0,0,.13);overflow:hidden;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.chip--active:not(.chip--disabled):after,.chip--selected:not(.chip--disabled):after,.chip:focus:not(.chip--disabled):after{background:currentColor;border-radius:inherit;content:\"\";height:100%;position:absolute;top:0;left:0;transition:inherit;width:100%;pointer-events:none;opacity:.13}.chip--label,.chip--label .chip__content{border-radius:2px}.chip.chip.chip--outline{background:transparent!important;border-color:currentColor;color:#9e9e9e}.chip--small{height:26px}.chip--small .avatar{height:26px;min-width:26px;width:26px}.chip--small .icon,.chip__close{font-size:20px}.chip__close{-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:inherit;cursor:pointer;display:-webkit-box;display:-ms-flexbox;display:flex;margin:0 2px 0 8px;text-decoration:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.chip__close>.icon{color:inherit!important;font-size:20px;opacity:.5}.chip__close>.icon:hover{opacity:1}.chip--select-multi{margin:4px 4px 4px 0}.chip .icon{color:inherit}.chip .icon--right{margin-left:12px;margin-right:-8px}.chip .icon--left{margin-left:-8px;margin-right:12px}.application .theme--light.data-iterator .data-iterator__actions,.theme--light .data-iterator .data-iterator__actions{color:rgba(0,0,0,.54)}.application .theme--light.data-iterator .data-iterator__actions__select .input-group--select .input-group__append-icon,.application .theme--light.data-iterator .data-iterator__actions__select .input-group--select .input-group__selections__comma,.theme--light .data-iterator .data-iterator__actions__select .input-group--select .input-group__append-icon,.theme--light .data-iterator .data-iterator__actions__select .input-group--select .input-group__selections__comma{color:rgba(0,0,0,.54)!important}.application .theme--dark.data-iterator .data-iterator__actions,.theme--dark .data-iterator .data-iterator__actions{color:hsla(0,0%,100%,.7)}.application .theme--dark.data-iterator .data-iterator__actions__select .input-group--select .input-group__append-icon,.application .theme--dark.data-iterator .data-iterator__actions__select .input-group--select .input-group__selections__comma,.theme--dark .data-iterator .data-iterator__actions__select .input-group--select .input-group__append-icon,.theme--dark .data-iterator .data-iterator__actions__select .input-group--select .input-group__selections__comma{color:hsla(0,0%,100%,.7)!important}.data-iterator__actions{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:12px;-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.data-iterator__actions .btn{color:inherit}.data-iterator__actions .btn:last-of-type{margin-left:14px}.data-iterator__actions__range-controls{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;min-height:48px}.data-iterator__actions__pagination{display:block;text-align:center;margin:0 32px 0 24px}.data-iterator__actions__select{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-right:14px}.data-iterator__actions__select .input-group--select{margin:13px 0 13px 34px;padding:0;position:static}.data-iterator__actions__select .input-group--select .input-group__selections__comma{font-size:12px}.application .theme--light.input-group--text-field.input-group--text-field-box .input-group__input,.theme--light .input-group--text-field.input-group--text-field-box .input-group__input{background:hsla(0,0%,100%,.6)}.application .theme--light.input-group--text-field input::-webkit-input-placeholder,.application .theme--light.input-group--text-field textarea::-webkit-input-placeholder,.theme--light .input-group--text-field input::-webkit-input-placeholder,.theme--light .input-group--text-field textarea::-webkit-input-placeholder{color:rgba(0,0,0,.38)}.application .theme--light.input-group--text-field input:-ms-input-placeholder,.application .theme--light.input-group--text-field input::-ms-input-placeholder,.application .theme--light.input-group--text-field textarea:-ms-input-placeholder,.application .theme--light.input-group--text-field textarea::-ms-input-placeholder,.theme--light .input-group--text-field input:-ms-input-placeholder,.theme--light .input-group--text-field input::-ms-input-placeholder,.theme--light .input-group--text-field textarea:-ms-input-placeholder,.theme--light .input-group--text-field textarea::-ms-input-placeholder{color:rgba(0,0,0,.38)}.application .theme--light.input-group--text-field input::placeholder,.application .theme--light.input-group--text-field textarea::placeholder,.theme--light .input-group--text-field input::placeholder,.theme--light .input-group--text-field textarea::placeholder{color:rgba(0,0,0,.38)}.application .theme--light.input-group--text-field:not(.input-group--error) .input-group__counter,.theme--light .input-group--text-field:not(.input-group--error) .input-group__counter{color:rgba(0,0,0,.54)}.application .theme--dark.input-group--text-field.input-group--text-field-box .input-group__input,.theme--dark .input-group--text-field.input-group--text-field-box .input-group__input{background:hsla(0,0%,100%,.1)}.application .theme--dark.input-group--text-field input::-webkit-input-placeholder,.application .theme--dark.input-group--text-field textarea::-webkit-input-placeholder,.theme--dark .input-group--text-field input::-webkit-input-placeholder,.theme--dark .input-group--text-field textarea::-webkit-input-placeholder{color:hsla(0,0%,100%,.5)}.application .theme--dark.input-group--text-field input:-ms-input-placeholder,.application .theme--dark.input-group--text-field input::-ms-input-placeholder,.application .theme--dark.input-group--text-field textarea:-ms-input-placeholder,.application .theme--dark.input-group--text-field textarea::-ms-input-placeholder,.theme--dark .input-group--text-field input:-ms-input-placeholder,.theme--dark .input-group--text-field input::-ms-input-placeholder,.theme--dark .input-group--text-field textarea:-ms-input-placeholder,.theme--dark .input-group--text-field textarea::-ms-input-placeholder{color:hsla(0,0%,100%,.5)}.application .theme--dark.input-group--text-field input::placeholder,.application .theme--dark.input-group--text-field textarea::placeholder,.theme--dark .input-group--text-field input::placeholder,.theme--dark .input-group--text-field textarea::placeholder{color:hsla(0,0%,100%,.5)}.application .theme--dark.input-group--text-field:not(.input-group--error) .input-group__counter,.theme--dark .input-group--text-field:not(.input-group--error) .input-group__counter{color:hsla(0,0%,100%,.7)}.input-group--text-field label{position:absolute;top:18px;left:0}.input-group--text-field input{padding-bottom:1px}.input-group--text-field input,.input-group--text-field textarea{font-size:16px}.input-group--text-field input::-webkit-input-placeholder,.input-group--text-field textarea::-webkit-input-placeholder{color:inherit;transition:.3s cubic-bezier(.25,.8,.5,1)}.input-group--text-field input:-ms-input-placeholder,.input-group--text-field input::-ms-input-placeholder,.input-group--text-field textarea:-ms-input-placeholder,.input-group--text-field textarea::-ms-input-placeholder{color:inherit;transition:.3s cubic-bezier(.25,.8,.5,1)}.input-group--text-field input::placeholder,.input-group--text-field textarea::placeholder{color:inherit;transition:.3s cubic-bezier(.25,.8,.5,1)}.input-group--text-field input{box-shadow:none;-webkit-box-flex:1;-ms-flex:1;flex:1;height:30px;margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.input-group--text-field input:focus{outline:none}.input-group--text-field input:disabled{pointer-events:none}.input-group--text-field textarea{-webkit-box-flex:1;-ms-flex:1 1;flex:1 1}.input-group--text-field textarea:focus{outline:none}.input-group--text-field.input-group--textarea label{top:13px}.input-group--text-field.input-group--textarea .input-group__input{border-radius:2px;transition:.4s cubic-bezier(.25,.8,.25,1)}.input-group--text-field.input-group--textarea textarea{font-size:16px;transition:.3s cubic-bezier(.25,.8,.5,1)}.input-group--text-field.input-group--textarea:not(.input-group--full-width) label{top:30px;left:15px}.input-group--text-field.input-group--textarea:not(.input-group--full-width) .input-group__input{padding:30px 0 0 13px}.input-group--text-field.input-group--textarea .input-group__details:after,.input-group--text-field.input-group--textarea .input-group__details:before{opacity:0}.input-group--text-field .input-group__counter{margin-left:auto;white-space:nowrap}.input-group--text-field .input-group__counter--error{color:inherit}.input-group--text-field.input-group--placeholder.input-group--dirty input::-webkit-input-placeholder,.input-group--text-field.input-group--placeholder.input-group--dirty textarea::-webkit-input-placeholder{opacity:0}.input-group--text-field.input-group--placeholder.input-group--dirty input:-ms-input-placeholder,.input-group--text-field.input-group--placeholder.input-group--dirty input::-ms-input-placeholder,.input-group--text-field.input-group--placeholder.input-group--dirty textarea:-ms-input-placeholder,.input-group--text-field.input-group--placeholder.input-group--dirty textarea::-ms-input-placeholder{opacity:0}.input-group--text-field.input-group--placeholder.input-group--dirty input::placeholder,.input-group--text-field.input-group--placeholder.input-group--dirty textarea::placeholder{opacity:0}.input-group--text-field.input-group--no-resize textarea{resize:none}.input-group--text-field.input-group--prepend-icon .input-group__prepend-icon{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;min-width:40px}.input-group--text-field.input-group--prepend-icon .input-group__details{margin-left:auto;max-width:calc(100% - 40px)}.input-group--text-field.input-group--prepend-icon label{left:40px}.input-group--text-field:not(.input-group--single-line).input-group--focused label,.input-group--text-field:not(.input-group--single-line).input-group--placeholder label{opacity:1}.input-group--text-field:not(.input-group--single-line).input-group--focused:not(.input-group--textarea) label,.input-group--text-field:not(.input-group--single-line).input-group--placeholder:not(.input-group--textarea) label{-webkit-transform:translateY(-18px) scale(.75);transform:translateY(-18px) scale(.75)}.input-group--text-field:not(.input-group--single-line).input-group--focused:not(.input-group--full-width).input-group--textarea label,.input-group--text-field:not(.input-group--single-line).input-group--placeholder:not(.input-group--full-width).input-group--textarea label{-webkit-transform:translateY(-8px) scale(.75);transform:translateY(-8px) scale(.75)}.input-group--text-field:not(.input-group--single-line).input-group--focused.input-group--text-field-box label,.input-group--text-field:not(.input-group--single-line).input-group--placeholder.input-group--text-field-box label{-webkit-transform:translateY(-10px) scale(.75);transform:translateY(-10px) scale(.75)}.input-group--text-field.input-group--dirty.input-group--select label,.input-group--text-field.input-group--dirty:not(.input-group--textarea) label{-webkit-transform:translateY(-18px) scale(.75);transform:translateY(-18px) scale(.75)}.input-group--text-field.input-group--dirty:not(.input-group--full-width).input-group--textarea label{-webkit-transform:translateY(-8px) scale(.75);transform:translateY(-8px) scale(.75)}.input-group--text-field.input-group--multi-line textarea{padding-top:4px}.input-group--text-field.input-group--full-width{padding:16px}.input-group--text-field.input-group--full-width label{margin-left:16px}.input-group--text-field.input-group--full-width .input-group__details:after,.input-group--text-field.input-group--full-width .input-group__details:before{display:none}.input-group--prefix:not(.input-group--focused):not(.input-group--dirty) label{left:16px}.input-group--prefix .input-group--text-field__prefix,.input-group--prefix .input-group--text-field__suffix,.input-group--suffix .input-group--text-field__prefix,.input-group--suffix .input-group--text-field__suffix{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;font-size:16px;margin-top:1px}.input-group--prefix .input-group--text-field__prefix,.input-group--suffix .input-group--text-field__prefix{margin-right:3px}.input-group--prefix .input-group--text-field__suffix,.input-group--suffix .input-group--text-field__suffix{margin-left:3px}.input-group--text-field-box input,.input-group--text-field-box textarea{cursor:pointer}.input-group--text-field-box label{left:16px}.input-group--text-field-box .input-group__input{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end;border-radius:4px 4px 0 0;cursor:pointer;min-height:56px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.input-group--text-field-box .input-group__details{padding:8px 16px 0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.input-group--text-field-box .input-group__details:after,.input-group--text-field-box .input-group__details:before{height:2px;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.input-group--text-field-box.input-group--multi-line textarea{padding-left:24px;padding-right:24px}.input-group--text-field-box:not(.input-group--textarea).input-group--multi-line .input-group__input{padding-top:26px}.input-group--text-field-box:not(.input-group--textarea).input-group--multi-line label{top:26px}.input-group--text-field-box:not(.input-group--textarea):not(.input-group--multi-line) .input-group__input{padding-left:16px;padding-right:16px}.input-group--text-field-box:not(.input-group--textarea):not(.input-group--multi-line) label{top:32px}.input-group--text-field-box:not(.input-group--textarea):not(.input-group--single-line).input-group--dirty label,.input-group--text-field-box:not(.input-group--textarea):not(.input-group--single-line).input-group--focused label{-webkit-transform:translateY(-10px) scale(.75);transform:translateY(-10px) scale(.75)}.input-group--text-field-box.input-group--prepend-icon .input-group__details:after,.input-group--text-field-box.input-group--prepend-icon .input-group__details:before{margin-left:56px;max-width:calc(100% - 56px)}.input-group--text-field-box.input-group--prepend-icon label{left:56px}.application .theme--light.input-group--select.input-group--editable.input-group--focused .input-group__input,.application .theme--light.input-group--select.input-group--editable .input-group__input:hover,.application .theme--light.input-group--select.input-group--overflow.input-group--focused .input-group__input,.application .theme--light.input-group--select.input-group--overflow .input-group__input:hover,.application .theme--light.input-group--select.input-group--segmented.input-group--focused .input-group__input,.application .theme--light.input-group--select.input-group--segmented .input-group__input:hover,.theme--light .input-group--select.input-group--editable.input-group--focused .input-group__input,.theme--light .input-group--select.input-group--editable .input-group__input:hover,.theme--light .input-group--select.input-group--overflow.input-group--focused .input-group__input,.theme--light .input-group--select.input-group--overflow .input-group__input:hover,.theme--light .input-group--select.input-group--segmented.input-group--focused .input-group__input,.theme--light .input-group--select.input-group--segmented .input-group__input:hover{background:#fff}.application .theme--dark.input-group--select.input-group--editable.input-group--focused .input-group__input,.application .theme--dark.input-group--select.input-group--editable .input-group__input:hover,.application .theme--dark.input-group--select.input-group--overflow.input-group--focused .input-group__input,.application .theme--dark.input-group--select.input-group--overflow .input-group__input:hover,.application .theme--dark.input-group--select.input-group--segmented.input-group--focused .input-group__input,.application .theme--dark.input-group--select.input-group--segmented .input-group__input:hover,.theme--dark .input-group--select.input-group--editable.input-group--focused .input-group__input,.theme--dark .input-group--select.input-group--editable .input-group__input:hover,.theme--dark .input-group--select.input-group--overflow.input-group--focused .input-group__input,.theme--dark .input-group--select.input-group--overflow .input-group__input:hover,.theme--dark .input-group--select.input-group--segmented.input-group--focused .input-group__input,.theme--dark .input-group--select.input-group--segmented .input-group__input:hover{background:#424242}.input-group--select .input-group--select__autocomplete{display:block;height:0}.input-group--select .input-group--select__autocomplete--index{background-color:transparent!important}.input-group--select .input-group__append-icon{transition:.3s cubic-bezier(0,0,.2,1)}.input-group--select .input-group__append-icon.input-group__icon-clearable{transition:none}.input-group--select.input-group--focused .input-group--select__autocomplete,.input-group--select:not(.input-group--dirty) .input-group--select__autocomplete{padding-bottom:1px;height:30px}.input-group--select.input-group--focused .input-group--select__autocomplete{display:inline-block;opacity:1}.input-group--select.input-group--focused.input-group--select--selecting-index .input-group--select__autocomplete{opacity:0}.input-group--select.input-group--focused.input-group--open .input-group__append-icon:not(.input-group__icon-clearable){-webkit-transform:rotate(-180deg);transform:rotate(-180deg)}.input-group--select .input-group__input{cursor:pointer}.input-group--select.input-group--disabled{cursor:default;pointer-events:none}.input-group--select .input-group__selections{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;position:relative;width:100%}.input-group--select .input-group__selections__comma{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;font-size:16px;padding:3px 4px 3px 0}.input-group--select .input-group__selections__comma--active{color:inherit}.input-group--select .menu{display:inline}.input-group--select .fade-transition-leave-active{position:absolute;left:0}.input-group--select.input-group--autocomplete.input-group--search-focused .input-group__selections__comma{display:none}.input-group--autocomplete .input-group__selections{cursor:text}.input-group.input-group--chips .input-group__input{padding-top:0;padding-bottom:0}.input-group.input-group--editable,.input-group.input-group--editable .input-group__append-icon,.input-group.input-group--overflow,.input-group.input-group--overflow .input-group__append-icon,.input-group.input-group--segmented,.input-group.input-group--segmented .input-group__append-icon{padding:0}.input-group.input-group--editable .input-group__selections,.input-group.input-group--editable input,.input-group.input-group--overflow .input-group__selections,.input-group.input-group--overflow input,.input-group.input-group--segmented .input-group__selections,.input-group.input-group--segmented input{height:48px}.input-group.input-group--editable .input-group__selections__comma,.input-group.input-group--editable input,.input-group.input-group--overflow .input-group__selections__comma,.input-group.input-group--overflow input,.input-group.input-group--segmented .input-group__selections__comma,.input-group.input-group--segmented input{top:0;left:0;padding-left:16px}.input-group.input-group--editable .input-group__selections,.input-group.input-group--overflow .input-group__selections,.input-group.input-group--segmented .input-group__selections{width:calc(100% - 55px)}.input-group.input-group--editable .input-group__selections .btn,.input-group.input-group--overflow .input-group__selections .btn,.input-group.input-group--segmented .input-group__selections .btn{border-radius:0;margin:0;height:48px;width:100%}.input-group.input-group--editable .input-group__selections .btn .btn__content,.input-group.input-group--overflow .input-group__selections .btn .btn__content,.input-group.input-group--segmented .input-group__selections .btn .btn__content{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:start}.input-group.input-group--editable .input-group__input,.input-group.input-group--overflow .input-group__input,.input-group.input-group--segmented .input-group__input{transition:.3s cubic-bezier(.25,.8,.5,1)}.input-group.input-group--editable.input-group--focused .input-group__input,.input-group.input-group--overflow.input-group--focused .input-group__input,.input-group.input-group--segmented.input-group--focused .input-group__input{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.input-group.input-group--editable label,.input-group.input-group--overflow label,.input-group.input-group--segmented label{left:16px!important;top:9px!important}.input-group.input-group--editable .input-group__details:after,.input-group.input-group--overflow .input-group__details:after,.input-group.input-group--segmented .input-group__details:after{display:none}.input-group.input-group--editable .input-group__input,.input-group.input-group--overflow .input-group__input,.input-group.input-group--segmented .input-group__input{padding:0}.input-group.input-group--editable .input-group__input:before,.input-group.input-group--overflow .input-group__input:before,.input-group.input-group--segmented .input-group__input:before{content:\"\";position:absolute;left:0;width:100%;height:1px;top:0;transition:.3s cubic-bezier(.25,.8,.5,1)}.input-group.input-group--editable .input-group__append-icon,.input-group.input-group--overflow .input-group__append-icon,.input-group.input-group--segmented .input-group__append-icon{width:55px}.input-group--editable .input-group__input:hover:after,.input-group--segmented .input-group__input:after,.input-group.input-group--focused.input-group--editable .input-group__input:after{background-color:rgba(0,0,0,.12);content:\"\";position:absolute;right:55px;height:48px;top:0;width:1px}.menu__content--select .input-group--selection-controls__ripple{display:none}.menu__content--autocomplete,.menu__content--autocomplete>.card{border-radius:0}.application .theme--light.divider,.theme--light .divider{background-color:rgba(0,0,0,.12)}.application .theme--dark.divider,.theme--dark .divider{background-color:hsla(0,0%,100%,.12)}.divider{border:none;display:block;height:1px;min-height:1px;-webkit-box-flex:1;-ms-flex:1;flex:1;width:100%}.divider--inset{margin-left:72px;width:calc(100% - 72px)}.menu{display:inline-block;position:relative;vertical-align:middle}.menu--disabled{cursor:default}.menu--disabled .menu__activator,.menu--disabled .menu__activator>*{cursor:default;pointer-events:none}.menu__activator{-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer;height:inherit;position:relative}.menu__activator input[readonly]{cursor:pointer}.menu__content{position:absolute;display:inline-block;border-radius:2px;max-width:80%;overflow-y:auto;overflow-x:hidden;contain:content;will-change:transform;box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.menu__content--active{pointer-events:none}.menu__content--dropdown{border-top-left-radius:0;border-top-right-radius:0;border-top:1px solid rgba(0,0,0,.12)}.menu__content>.card{contain:content;-webkit-backface-visibility:hidden;backface-visibility:hidden}.menu>.menu__content{max-width:none}.menu-transition-enter .list__tile{min-width:0;transition-delay:.4s;opacity:0;-webkit-transform:translateY(-15px);transform:translateY(-15px);pointer-events:none}.menu-transition-enter-to .list__tile{pointer-events:auto;opacity:1}.menu-transition-enter-to .list__tile--active{-webkit-transform:none!important;transform:none!important}.menu-transition-leave-to{-webkit-transform:translateY(-10px);transform:translateY(-10px)}.menu-transition-leave-active,.menu-transition-leave-to{pointer-events:none}.menu-transition-enter,.menu-transition-leave-to{opacity:0}.menu-transition-enter-to,.menu-transition-leave{opacity:1}.menu-transition-enter-active,.menu-transition-leave-active{transition:all .5s cubic-bezier(.25,.8,.5,1)}.menu-transition-enter.menu__content--auto .list__tile--active{opacity:1;-webkit-transform:none!important;transform:none!important;pointer-events:auto}.application .theme--light.subheader,.theme--light .subheader{color:rgba(0,0,0,.54)}.application .theme--dark.subheader,.theme--dark .subheader{color:hsla(0,0%,100%,.7)}.subheader{height:48px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:14px;font-weight:500;padding:0 16px}.subheader--inset{margin-left:56px}.application .theme--light.list,.theme--light .list{background:#fff;color:rgba(0,0,0,.87)}.application .theme--light.list .list__tile__sub-title,.theme--light .list .list__tile__sub-title{color:rgba(0,0,0,.54)}.application .theme--light.list .list__tile__mask,.theme--light .list .list__tile__mask{color:rgba(0,0,0,.38);background:#eee}.application .theme--light.list .list__group--active:after,.application .theme--light.list .list__group--active:before,.application .theme--light.list .list__group__header:hover,.application .theme--light.list .list__tile--highlighted,.application .theme--light.list .list__tile--link:hover,.theme--light .list .list__group--active:after,.theme--light .list .list__group--active:before,.theme--light .list .list__group__header:hover,.theme--light .list .list__tile--highlighted,.theme--light .list .list__tile--link:hover{background:rgba(0,0,0,.12)}.application .theme--light.list .list__group--disabled .list__group__header__prepend-icon .icon,.application .theme--light.list .list__group--disabled .list__tile,.theme--light .list .list__group--disabled .list__group__header__prepend-icon .icon,.theme--light .list .list__group--disabled .list__tile{color:rgba(0,0,0,.38)!important}.application .theme--dark.list,.theme--dark .list{background:#424242;color:#fff}.application .theme--dark.list .list__tile__sub-title,.theme--dark .list .list__tile__sub-title{color:hsla(0,0%,100%,.7)}.application .theme--dark.list .list__tile__mask,.theme--dark .list .list__tile__mask{color:hsla(0,0%,100%,.5);background:rgba(0,0,0,.7)}.application .theme--dark.list .list__group--active:after,.application .theme--dark.list .list__group--active:before,.application .theme--dark.list .list__group__header:hover,.application .theme--dark.list .list__tile--highlighted,.application .theme--dark.list .list__tile--link:hover,.theme--dark .list .list__group--active:after,.theme--dark .list .list__group--active:before,.theme--dark .list .list__group__header:hover,.theme--dark .list .list__tile--highlighted,.theme--dark .list .list__tile--link:hover{background:hsla(0,0%,100%,.12)}.application .theme--dark.list .list__group--disabled .list__group__header__prepend-icon .icon,.application .theme--dark.list .list__group--disabled .list__tile,.theme--dark .list .list__group--disabled .list__group__header__prepend-icon .icon,.theme--dark .list .list__group--disabled .list__tile{color:hsla(0,0%,100%,.5)!important}.list{list-style-type:none;padding:8px 0;transition:height .3s cubic-bezier(.4,0,.2,1)}.list .input-group{margin:0}.list__tile{-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:inherit;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:16px;font-weight:400;height:48px;margin:0;padding:0 16px;position:relative;text-decoration:none;transition:.3s cubic-bezier(.25,.8,.5,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.list__tile--link{cursor:pointer}.list__tile__action,.list__tile__content{height:100%}.list__tile__sub-title,.list__tile__title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:.3s cubic-bezier(.25,.8,.5,1);width:100%}.list__tile__title{height:24px;line-height:24px;position:relative;text-align:left}.list__tile__sub-title{font-size:14px}.list__tile__action,.list__tile__avatar{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;min-width:56px}.list__tile__action,.list__tile__action .input-group--selection-controls{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.list__tile__action .input-group--selection-controls{-webkit-box-flex:0;-ms-flex:0 1;flex:0 1;padding:0}.list__tile__action .input-group__details{display:none}.list__tile__action .btn{padding:0;margin:0}.list__tile__action .btn--icon{margin:-8px}.list__tile__action-text{color:#9e9e9e;font-size:12px}.list__tile__action--stack{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;padding-top:8px;padding-bottom:8px;white-space:nowrap;-ms-flex-direction:column;flex-direction:column}.list__tile__action--stack,.list__tile__content{-webkit-box-orient:vertical;-webkit-box-direction:normal}.list__tile__content{text-align:left;-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;overflow:hidden;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-ms-flex-direction:column;flex-direction:column}.list__tile__content~.list__tile__action:not(.list__tile__action--stack),.list__tile__content~.list__tile__avatar{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.list__tile--active .list__tile__action:first-of-type .icon{color:inherit}.list__tile--disabled{opacity:.4!important;pointer-events:none!important}.list__tile--avatar{height:56px}.list--dense{padding-top:4px;padding-bottom:4px}.list--dense .subheader{font-size:13px;height:40px}.list--dense .list__group .subheader{height:40px}.list--dense .list__tile{font-size:13px}.list--dense .list__tile--avatar{height:48px}.list--dense .list__tile:not(.list__tile--avatar){height:40px}.list--dense .list__tile .icon{font-size:22px}.list--dense .list__tile__sub-title{font-size:13px}.list--two-line .list__tile{height:72px}.list--two-line.list--dense .list__tile{height:60px}.list--three-line .list__tile{height:88px}.list--three-line .list__tile__avatar{margin-top:-18px}.list--three-line .list__tile__sub-title{white-space:normal;-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box}.list--three-line.list--dense .list__tile{height:76px}.list>.list__group:before{top:0}.list>.list__group:before .list__tile__avatar{margin-top:-14px}.list__group{padding:0;position:relative;transition:inherit}.list__group:after,.list__group:before{content:\"\";height:1px;position:absolute;transition:.3s cubic-bezier(.25,.8,.5,1);width:100%}.list__group--active~.list__group:before{display:none}.list__group__header{-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer;display:-webkit-box;display:-ms-flexbox;display:flex;list-style-type:none}.list__group__header>div:not(.list__group__header__prepend-icon):not(.list__group__header__append-icon){-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto}.list__group__header .list__group__header__append-icon,.list__group__header .list__group__header__prepend-icon{padding:0 16px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.list__group__header--sub-group{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex}.list__group__header--sub-group div .list__tile{padding-left:0}.list__group__header--sub-group .list__group__header__prepend-icon{padding:0 0 0 40px;margin-right:8px}.list__group__header .list__group__header__prepend-icon{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;min-width:56px}.list__group__header--active .list__group__header__append-icon .icon{-webkit-transform:rotate(-180deg);transform:rotate(-180deg)}.list__group__header--active .list__group__header__prepend-icon .icon{color:inherit}.list__group__header--active.list__group__header--sub-group .list__group__header__prepend-icon .icon{-webkit-transform:rotate(-180deg);transform:rotate(-180deg)}.list__group__items{position:relative;padding:0;transition:inherit}.list__group__items>div{display:block}.list__group__items--no-action .list__tile{padding-left:72px}.list__group--disabled{pointer-events:none}.list--subheader{padding-top:0}.application .theme--light.table,.theme--light .table{background-color:#fff;color:rgba(0,0,0,.87)}.application .theme--light.table thead tr:first-child,.theme--light .table thead tr:first-child{border-bottom:1px solid rgba(0,0,0,.12)}.application .theme--light.table thead th,.theme--light .table thead th{color:rgba(0,0,0,.54)}.application .theme--light.table tbody tr:not(:last-child),.theme--light .table tbody tr:not(:last-child){border-bottom:1px solid rgba(0,0,0,.12)}.application .theme--light.table tbody tr[active],.theme--light .table tbody tr[active]{background:#f5f5f5}.application .theme--light.table tbody tr:hover:not(.datatable__expand-row),.theme--light .table tbody tr:hover:not(.datatable__expand-row){background:#eee}.application .theme--light.table tfoot tr,.theme--light .table tfoot tr{border-top:1px solid rgba(0,0,0,.12)}.application .theme--dark.table,.theme--dark .table{background-color:#424242;color:#fff}.application .theme--dark.table thead tr:first-child,.theme--dark .table thead tr:first-child{border-bottom:1px solid hsla(0,0%,100%,.12)}.application .theme--dark.table thead th,.theme--dark .table thead th{color:hsla(0,0%,100%,.7)}.application .theme--dark.table tbody tr:not(:last-child),.theme--dark .table tbody tr:not(:last-child){border-bottom:1px solid hsla(0,0%,100%,.12)}.application .theme--dark.table tbody tr[active],.theme--dark .table tbody tr[active]{background:#505050}.application .theme--dark.table tbody tr:hover:not(.datatable__expand-row),.theme--dark .table tbody tr:hover:not(.datatable__expand-row){background:#616161}.application .theme--dark.table tfoot tr,.theme--dark .table tfoot tr{border-top:1px solid hsla(0,0%,100%,.12)}.table__overflow{width:100%;overflow-x:auto;overflow-y:hidden}table.table{border-radius:2px;border-collapse:collapse;border-spacing:0;width:100%;max-width:100%}table.table tbody td:first-child,table.table tbody td:not(:first-child),table.table tbody th:first-child,table.table tbody th:not(:first-child),table.table thead td:first-child,table.table thead td:not(:first-child),table.table thead th:first-child,table.table thead th:not(:first-child){padding:0 24px}table.table thead tr{height:56px}table.table thead th{font-weight:500;font-size:12px;transition:.3s cubic-bezier(.25,.8,.5,1);white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}table.table thead th.sortable{pointer-events:auto}table.table thead th>div{width:100%}table.table tbody tr{transition:background .3s cubic-bezier(.25,.8,.5,1);will-change:background}table.table tbody td,table.table tbody th{height:48px}table.table tbody td{font-weight:400;font-size:13px}table.table .input-group--selection-controls{padding:0}table.table .input-group--selection-controls .input-group__details{display:none}table.table .input-group--selection-controls.checkbox .icon{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}table.table .input-group--selection-controls.checkbox .input-group--selection-controls__ripple{left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}table.table tfoot tr{height:48px}table.table tfoot tr td{padding:0 24px}.application .theme--light.datatable thead th.column.sortable i,.theme--light .datatable thead th.column.sortable i{color:rgba(0,0,0,.38)}.application .theme--light.datatable thead th.column.sortable.active,.application .theme--light.datatable thead th.column.sortable.active i,.application .theme--light.datatable thead th.column.sortable:hover,.theme--light .datatable thead th.column.sortable.active,.theme--light .datatable thead th.column.sortable.active i,.theme--light .datatable thead th.column.sortable:hover{color:rgba(0,0,0,.87)}.application .theme--light.datatable .datatable__actions,.theme--light .datatable .datatable__actions{background-color:#fff;color:rgba(0,0,0,.54);border-top:1px solid rgba(0,0,0,.12)}.application .theme--light.datatable .datatable__actions__select .input-group--select .input-group__append-icon,.application .theme--light.datatable .datatable__actions__select .input-group--select .input-group__selections__comma,.theme--light .datatable .datatable__actions__select .input-group--select .input-group__append-icon,.theme--light .datatable .datatable__actions__select .input-group--select .input-group__selections__comma{color:rgba(0,0,0,.54)!important}.application .theme--dark.datatable thead th.column.sortable i,.theme--dark .datatable thead th.column.sortable i{color:hsla(0,0%,100%,.5)}.application .theme--dark.datatable thead th.column.sortable.active,.application .theme--dark.datatable thead th.column.sortable.active i,.application .theme--dark.datatable thead th.column.sortable:hover,.theme--dark .datatable thead th.column.sortable.active,.theme--dark .datatable thead th.column.sortable.active i,.theme--dark .datatable thead th.column.sortable:hover{color:#fff}.application .theme--dark.datatable .datatable__actions,.theme--dark .datatable .datatable__actions{background-color:#424242;color:hsla(0,0%,100%,.7);border-top:1px solid hsla(0,0%,100%,.12)}.application .theme--dark.datatable .datatable__actions__select .input-group--select .input-group__append-icon,.application .theme--dark.datatable .datatable__actions__select .input-group--select .input-group__selections__comma,.theme--dark .datatable .datatable__actions__select .input-group--select .input-group__append-icon,.theme--dark .datatable .datatable__actions__select .input-group--select .input-group__selections__comma{color:hsla(0,0%,100%,.7)!important}.datatable thead th.column.sortable{cursor:pointer}.datatable thead th.column.sortable i{font-size:16px;vertical-align:sub;display:inline-block;opacity:0;transition:.3s cubic-bezier(.25,.8,.5,1)}.datatable thead th.column.sortable:hover i{opacity:.6}.datatable thead th.column.sortable.active{-webkit-transform:none;transform:none}.datatable thead th.column.sortable.active i{opacity:1}.datatable thead th.column.sortable.active.desc i{-webkit-transform:rotate(-180deg);transform:rotate(-180deg)}.datatable__actions{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:12px;-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.datatable__actions .btn{color:inherit}.datatable__actions .btn:last-of-type{margin-left:14px}.datatable__actions__range-controls{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;min-height:48px}.datatable__actions__pagination{display:block;text-align:center;margin:0 32px 0 24px}.datatable__actions__select{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-right:14px}.datatable__actions__select .input-group--select{margin:13px 0 13px 34px;padding:0;position:static}.datatable__actions__select .input-group--select .input-group__selections__comma{font-size:12px}.datatable__progress,.datatable__progress td,.datatable__progress th,.datatable__progress tr{height:auto!important}.datatable__progress th{padding:0!important}.datatable__progress th .progress-linear{top:-2px;margin:0 0 -2px}.datatable__expand-row{border:none!important}.datatable__expand-col{padding:0!important;height:0!important}.datatable__expand-col--expanded{border-bottom:1px solid rgba(0,0,0,.12)}.datatable__expand-content{transition:height .3s cubic-bezier(.25,.8,.5,1)}.datatable__expand-content>.card{border-radius:0;box-shadow:none}.application .theme--light.small-dialog__actions,.application .theme--light.small-dialog__content,.theme--light .small-dialog__actions,.theme--light .small-dialog__content{background:#fff}.application .theme--light.small-dialog a,.theme--light .small-dialog a{color:rgba(0,0,0,.87)}.application .theme--dark.small-dialog__actions,.application .theme--dark.small-dialog__content,.theme--dark .small-dialog__actions,.theme--dark .small-dialog__content{background:#424242}.application .theme--dark.small-dialog a,.theme--dark .small-dialog a{color:#fff}.small-dialog{display:block;width:100%;height:100%}.small-dialog__content{padding:0 24px}.small-dialog__actions{text-align:right}.small-dialog a{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:100%;text-decoration:none}.small-dialog a>*{width:100%}.small-dialog .menu__activator{height:100%}.date-picker-title{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:wrap;flex-wrap:wrap;line-height:1}.date-picker-title__year{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;font-size:14px;font-weight:500;margin-bottom:8px}.date-picker-title__date{font-size:34px;text-align:left;font-weight:500;position:relative;overflow:hidden}.date-picker-title__date>div{position:relative}.application .theme--light.date-picker-header .date-picker-header__value:not(.date-picker-header__value--disabled) strong:not(:hover),.theme--light .date-picker-header .date-picker-header__value:not(.date-picker-header__value--disabled) strong:not(:hover){color:rgba(0,0,0,.87)!important}.application .theme--light.date-picker-header .date-picker-header__value--disabled strong,.theme--light .date-picker-header .date-picker-header__value--disabled strong{color:rgba(0,0,0,.38)}.application .theme--dark.date-picker-header .date-picker-header__value:not(.date-picker-header__value--disabled) strong:not(:hover),.theme--dark .date-picker-header .date-picker-header__value:not(.date-picker-header__value--disabled) strong:not(:hover){color:#fff!important}.application .theme--dark.date-picker-header .date-picker-header__value--disabled strong,.theme--dark .date-picker-header .date-picker-header__value--disabled strong{color:hsla(0,0%,100%,.5)}.date-picker-header{padding:4px 16px;-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;position:relative}.date-picker-header .btn{margin:0;z-index:auto}.date-picker-header .icon{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.date-picker-header__value{-webkit-box-flex:1;-ms-flex:1;flex:1;text-align:center;position:relative;overflow:hidden}.date-picker-header__value strong{cursor:pointer;transition:.3s cubic-bezier(.25,.8,.5,1);display:block;width:100%}.application .theme--light.date-picker-table th,.theme--light .date-picker-table th{color:rgba(0,0,0,.38)}.application .theme--light.date-picker-table .btn,.theme--light .date-picker-table .btn{color:rgba(0,0,0,.87)}.application .theme--dark.date-picker-table th,.theme--dark .date-picker-table th{color:hsla(0,0%,100%,.5)}.application .theme--dark.date-picker-table .btn,.theme--dark .date-picker-table .btn{color:#fff}.date-picker-table{position:relative;padding:0 12px;height:242px}.date-picker-table table{transition:.3s cubic-bezier(.25,.8,.5,1);top:0;table-layout:fixed;width:100%}.date-picker-table td,.date-picker-table th{text-align:center;position:relative}.date-picker-table th{font-size:12px}.date-picker-table--date .btn{height:32px;width:32px}.date-picker-table .btn{z-index:auto;margin:0;font-size:12px}.date-picker-table .btn.btn--active{color:#fff}.date-picker-table--month td{width:33.333333%;height:56px;vertical-align:middle;text-align:center}.date-picker-table--month td .btn{margin:0 auto;max-width:160px;min-width:40px;width:100%}.date-picker-table--date th{padding:8px 0;font-weight:600}.date-picker-table--date td{width:45px}.date-picker-table__event{border-radius:50%;bottom:2px;content:\"\";display:block;height:8px;left:50%;position:absolute;-webkit-transform:translateX(-4px);transform:translateX(-4px);width:8px}.date-picker-years{font-size:16px;font-weight:400;height:334px;list-style-type:none;overflow:auto;padding:0;text-align:center}.date-picker-years li{cursor:pointer;padding:8px 0;transition:none}.date-picker-years li.active{font-size:26px;font-weight:500;padding:10px 0}.date-picker-years li:hover{background:rgba(0,0,0,.12)}.picker--landscape .date-picker-years{height:286px}.application .theme--dark.picker,.theme--dark .picker{color:#fff}.application .theme--dark.picker .picker__body,.theme--dark .picker .picker__body{background:#424242}.application .theme--light.picker .picker__title,.theme--light .picker .picker__title{background:#e0e0e0}.application .theme--dark.picker .picker__title,.theme--dark .picker .picker__title{background:#616161}.picker{border-radius:2px;contain:layout style;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;vertical-align:top}.picker .card__row--actions{border:none;margin-top:-20px}.picker--full-width{display:-webkit-box;display:-ms-flexbox;display:flex}.picker__title{color:#fff;border-top-left-radius:2px;border-top-right-radius:2px;padding:16px}.picker__title__btn{transition:.3s cubic-bezier(.25,.8,.5,1)}.picker__title__btn.active{opacity:1}.picker__title__btn:not(.active){opacity:.6;cursor:pointer}.picker__title__btn:not(.active):hover{opacity:1}.picker__body{height:auto;overflow:hidden;position:relative;-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.picker__body>div{width:100%}.picker__body>div.fade-transition-leave-active{position:absolute}.picker--landscape .picker__title{border-top-right-radius:0;border-bottom-right-radius:0;width:170px;position:absolute;top:0;left:0;height:100%;z-index:1}.picker--landscape .picker__actions,.picker--landscape .picker__body{margin-left:170px}.application .theme--light.expansion-panel .expansion-panel__container,.theme--light .expansion-panel .expansion-panel__container{border-top:1px solid rgba(0,0,0,.12);background-color:#fff;color:rgba(0,0,0,.87)}.application .theme--light.expansion-panel .expansion-panel__container .expansion-panel__header .icon,.theme--light .expansion-panel .expansion-panel__container .expansion-panel__header .icon{color:rgba(0,0,0,.54)}.application .theme--light.expansion-panel--focusable .expansion-panel__container:focus,.theme--light .expansion-panel--focusable .expansion-panel__container:focus{background-color:#eee}.application .theme--dark.expansion-panel .expansion-panel__container,.theme--dark .expansion-panel .expansion-panel__container{border-top:1px solid hsla(0,0%,100%,.12);background-color:#424242;color:#fff}.application .theme--dark.expansion-panel .expansion-panel__container .expansion-panel__header .icon,.theme--dark .expansion-panel .expansion-panel__container .expansion-panel__header .icon{color:#fff}.application .theme--dark.expansion-panel--focusable .expansion-panel__container:focus,.theme--dark .expansion-panel--focusable .expansion-panel__container:focus{background-color:rgba(0,0,0,.7)}.expansion-panel{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;list-style-type:none;padding:0;text-align:left;width:100%;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)}.expansion-panel__container{-webkit-box-flex:1;-ms-flex:1 0 100%;flex:1 0 100%;max-width:100%;outline:none;transition:.3s cubic-bezier(.25,.8,.5,1)}.expansion-panel__container:first-child{border-top:none!important}.expansion-panel__container .header__icon{margin-left:auto}.expansion-panel__container .header__icon .icon{transition:none}.expansion-panel__container--active>.expansion-panel__header .header__icon .icon{-webkit-transform:rotate(-180deg);transform:rotate(-180deg)}.expansion-panel__header{display:-webkit-box;display:-ms-flexbox;display:flex;cursor:pointer;-webkit-box-align:center;-ms-flex-align:center;align-items:center;position:relative;padding:12px 24px}.expansion-panel__header>:not(.header__icon){-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.expansion-panel__body{transition:.3s cubic-bezier(.25,.8,.5,1)}.expansion-panel__body .card{border-radius:0}.expansion-panel--inset,.expansion-panel--popout,.expansion-panel__body .card{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)}.expansion-panel--inset .expansion-panel__container--active,.expansion-panel--popout .expansion-panel__container--active{margin:16px;box-shadow:0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12)}.expansion-panel--inset .expansion-panel__container,.expansion-panel--popout .expansion-panel__container{max-width:95%}.expansion-panel--popout .expansion-panel__container--active{max-width:100%}.expansion-panel--inset .expansion-panel__container--active{max-width:85%}.application .theme--light.footer,.theme--light .footer{background:#f5f5f5;color:rgba(0,0,0,.87)}.application .theme--dark.footer,.theme--dark .footer{background:#212121;color:#fff}.footer{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:0!important;-ms-flex:0 1 auto!important;flex:0 1 auto!important;min-height:36px;transition:.2s cubic-bezier(.4,0,.2,1)}.footer--absolute,.footer--fixed{bottom:0;left:0;width:100%;z-index:3}.footer--inset{z-index:2}.footer--absolute{position:absolute}.footer--fixed{position:fixed}.content{transition:none;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;max-width:100%;will-change:padding}.content[data-booted=true]{transition:.2s cubic-bezier(.4,0,.2,1)}.content--wrap{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;max-width:100%}@media print{@-moz-document url-prefix(){.content{display:block}}}.container{-webkit-box-flex:1;-ms-flex:1 1 100%;flex:1 1 100%;margin:auto;padding:16px;width:100%}.container.fluid{max-width:100%}.container.fill-height{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex}.container.fill-height .layout{height:100%;-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.container.grid-list-xs{padding:2px}.container.grid-list-xs .layout .flex{padding:1px}.container.grid-list-xs .layout:only-child{margin:-1px}.container.grid-list-xs .layout:not(:only-child){margin:auto -1px}.container.grid-list-xs :not(:only-child) .layout:first-child{margin-top:-1px}.container.grid-list-xs :not(:only-child) .layout:last-child{margin-bottom:-1px}.container.grid-list-sm{padding:4px}.container.grid-list-sm .layout .flex{padding:2px}.container.grid-list-sm .layout:only-child{margin:-2px}.container.grid-list-sm .layout:not(:only-child){margin:auto -2px}.container.grid-list-sm :not(:only-child) .layout:first-child{margin-top:-2px}.container.grid-list-sm :not(:only-child) .layout:last-child{margin-bottom:-2px}.container.grid-list-md{padding:8px}.container.grid-list-md .layout .flex{padding:4px}.container.grid-list-md .layout:only-child{margin:-4px}.container.grid-list-md .layout:not(:only-child){margin:auto -4px}.container.grid-list-md :not(:only-child) .layout:first-child{margin-top:-4px}.container.grid-list-md :not(:only-child) .layout:last-child{margin-bottom:-4px}.container.grid-list-lg{padding:16px}.container.grid-list-lg .layout .flex{padding:8px}.container.grid-list-lg .layout:only-child{margin:-8px}.container.grid-list-lg .layout:not(:only-child){margin:auto -8px}.container.grid-list-lg :not(:only-child) .layout:first-child{margin-top:-8px}.container.grid-list-lg :not(:only-child) .layout:last-child{margin-bottom:-8px}.container.grid-list-xl{padding:24px}.container.grid-list-xl .layout .flex{padding:12px}.container.grid-list-xl .layout:only-child{margin:-12px}.container.grid-list-xl .layout:not(:only-child){margin:auto -12px}.container.grid-list-xl :not(:only-child) .layout:first-child{margin-top:-12px}.container.grid-list-xl :not(:only-child) .layout:last-child{margin-bottom:-12px}.layout{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;-ms-flex-wrap:nowrap;flex-wrap:nowrap;min-width:0}.layout.row{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}.layout.row.reverse{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.layout.column{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.layout.column>.flex{max-width:100%}.layout.column.reverse{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.layout.wrap{-ms-flex-wrap:wrap;flex-wrap:wrap}.child-flex>*,.flex{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto}.align-start{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start}.align-end{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}.align-center{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.align-baseline{-webkit-box-align:baseline;-ms-flex-align:baseline;align-items:baseline}.align-content-start{-ms-flex-line-pack:start;align-content:flex-start}.align-content-end{-ms-flex-line-pack:end;align-content:flex-end}.align-content-center{-ms-flex-line-pack:center;align-content:center}.align-content-space-between{-ms-flex-line-pack:justify;align-content:space-between}.align-content-space-around{-ms-flex-line-pack:distribute;align-content:space-around}.justify-start{-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}.justify-end{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.justify-center{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.justify-space-around{-ms-flex-pack:distribute;justify-content:space-around}.justify-space-between{-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.grow,.spacer{-webkit-box-flex:1!important;-ms-flex-positive:1!important;flex-grow:1!important}.grow{-ms-flex-negative:0!important;flex-shrink:0!important}.shrink{-webkit-box-flex:0!important;-ms-flex-positive:0!important;flex-grow:0!important;-ms-flex-negative:1!important;flex-shrink:1!important}.scroll-y{overflow-y:auto}.fill-height{height:100%}.hide-overflow{overflow:hidden!important}.show-overflow{overflow:visible!important}.ellipsis,.no-wrap{white-space:nowrap}.ellipsis{overflow:hidden;text-overflow:ellipsis}.d-flex{display:-webkit-box!important;display:-ms-flexbox!important;display:flex!important}.d-inline-flex{display:-webkit-inline-box!important;display:-ms-inline-flexbox!important;display:inline-flex!important}.d-flex>*,.d-inline-flex>*{-webkit-box-flex:1!important;-ms-flex:1 1 auto!important;flex:1 1 auto!important}.d-block{display:block!important}.d-inline-block{display:inline-block!important}.d-inline{display:inline!important}@media only screen and (min-width:960px){.container{max-width:900px}}@media only screen and (min-width:1264px){.container{max-width:1185px}}@media only screen and (min-width:1904px){.container{max-width:1785px}}@media only screen and (max-width:599px){.container{padding:24px}}@media (min-width:0){.flex.xs1{-ms-flex-preferred-size:8.333333333333332%;flex-basis:8.333333333333332%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:8.333333333333332%}.flex.order-xs1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.flex.xs2{-ms-flex-preferred-size:16.666666666666664%;flex-basis:16.666666666666664%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:16.666666666666664%}.flex.order-xs2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.flex.xs3{-ms-flex-preferred-size:25%;flex-basis:25%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:25%}.flex.order-xs3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.flex.xs4{-ms-flex-preferred-size:33.33333333333333%;flex-basis:33.33333333333333%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:33.33333333333333%}.flex.order-xs4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.flex.xs5{-ms-flex-preferred-size:41.66666666666667%;flex-basis:41.66666666666667%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:41.66666666666667%}.flex.order-xs5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.flex.xs6{-ms-flex-preferred-size:50%;flex-basis:50%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:50%}.flex.order-xs6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.flex.xs7{-ms-flex-preferred-size:58.333333333333336%;flex-basis:58.333333333333336%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:58.333333333333336%}.flex.order-xs7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.flex.xs8{-ms-flex-preferred-size:66.66666666666666%;flex-basis:66.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:66.66666666666666%}.flex.order-xs8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.flex.xs9{-ms-flex-preferred-size:75%;flex-basis:75%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:75%}.flex.order-xs9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.flex.xs10{-ms-flex-preferred-size:83.33333333333334%;flex-basis:83.33333333333334%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:83.33333333333334%}.flex.order-xs10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.flex.xs11{-ms-flex-preferred-size:91.66666666666666%;flex-basis:91.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:91.66666666666666%}.flex.order-xs11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.flex.xs12{-ms-flex-preferred-size:100%;flex-basis:100%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:100%}.flex.order-xs12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.flex.offset-xs0{margin-left:0}.flex.offset-xs1{margin-left:8.333333333333332%}.flex.offset-xs2{margin-left:16.666666666666664%}.flex.offset-xs3{margin-left:25%}.flex.offset-xs4{margin-left:33.33333333333333%}.flex.offset-xs5{margin-left:41.66666666666667%}.flex.offset-xs6{margin-left:50%}.flex.offset-xs7{margin-left:58.333333333333336%}.flex.offset-xs8{margin-left:66.66666666666666%}.flex.offset-xs9{margin-left:75%}.flex.offset-xs10{margin-left:83.33333333333334%}.flex.offset-xs11{margin-left:91.66666666666666%}.flex.offset-xs12{margin-left:100%}}@media (min-width:600px){.flex.sm1{-ms-flex-preferred-size:8.333333333333332%;flex-basis:8.333333333333332%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:8.333333333333332%}.flex.order-sm1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.flex.sm2{-ms-flex-preferred-size:16.666666666666664%;flex-basis:16.666666666666664%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:16.666666666666664%}.flex.order-sm2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.flex.sm3{-ms-flex-preferred-size:25%;flex-basis:25%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:25%}.flex.order-sm3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.flex.sm4{-ms-flex-preferred-size:33.33333333333333%;flex-basis:33.33333333333333%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:33.33333333333333%}.flex.order-sm4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.flex.sm5{-ms-flex-preferred-size:41.66666666666667%;flex-basis:41.66666666666667%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:41.66666666666667%}.flex.order-sm5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.flex.sm6{-ms-flex-preferred-size:50%;flex-basis:50%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:50%}.flex.order-sm6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.flex.sm7{-ms-flex-preferred-size:58.333333333333336%;flex-basis:58.333333333333336%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:58.333333333333336%}.flex.order-sm7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.flex.sm8{-ms-flex-preferred-size:66.66666666666666%;flex-basis:66.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:66.66666666666666%}.flex.order-sm8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.flex.sm9{-ms-flex-preferred-size:75%;flex-basis:75%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:75%}.flex.order-sm9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.flex.sm10{-ms-flex-preferred-size:83.33333333333334%;flex-basis:83.33333333333334%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:83.33333333333334%}.flex.order-sm10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.flex.sm11{-ms-flex-preferred-size:91.66666666666666%;flex-basis:91.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:91.66666666666666%}.flex.order-sm11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.flex.sm12{-ms-flex-preferred-size:100%;flex-basis:100%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:100%}.flex.order-sm12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.flex.offset-sm0{margin-left:0}.flex.offset-sm1{margin-left:8.333333333333332%}.flex.offset-sm2{margin-left:16.666666666666664%}.flex.offset-sm3{margin-left:25%}.flex.offset-sm4{margin-left:33.33333333333333%}.flex.offset-sm5{margin-left:41.66666666666667%}.flex.offset-sm6{margin-left:50%}.flex.offset-sm7{margin-left:58.333333333333336%}.flex.offset-sm8{margin-left:66.66666666666666%}.flex.offset-sm9{margin-left:75%}.flex.offset-sm10{margin-left:83.33333333333334%}.flex.offset-sm11{margin-left:91.66666666666666%}.flex.offset-sm12{margin-left:100%}}@media (min-width:960px){.flex.md1{-ms-flex-preferred-size:8.333333333333332%;flex-basis:8.333333333333332%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:8.333333333333332%}.flex.order-md1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.flex.md2{-ms-flex-preferred-size:16.666666666666664%;flex-basis:16.666666666666664%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:16.666666666666664%}.flex.order-md2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.flex.md3{-ms-flex-preferred-size:25%;flex-basis:25%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:25%}.flex.order-md3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.flex.md4{-ms-flex-preferred-size:33.33333333333333%;flex-basis:33.33333333333333%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:33.33333333333333%}.flex.order-md4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.flex.md5{-ms-flex-preferred-size:41.66666666666667%;flex-basis:41.66666666666667%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:41.66666666666667%}.flex.order-md5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.flex.md6{-ms-flex-preferred-size:50%;flex-basis:50%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:50%}.flex.order-md6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.flex.md7{-ms-flex-preferred-size:58.333333333333336%;flex-basis:58.333333333333336%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:58.333333333333336%}.flex.order-md7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.flex.md8{-ms-flex-preferred-size:66.66666666666666%;flex-basis:66.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:66.66666666666666%}.flex.order-md8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.flex.md9{-ms-flex-preferred-size:75%;flex-basis:75%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:75%}.flex.order-md9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.flex.md10{-ms-flex-preferred-size:83.33333333333334%;flex-basis:83.33333333333334%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:83.33333333333334%}.flex.order-md10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.flex.md11{-ms-flex-preferred-size:91.66666666666666%;flex-basis:91.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:91.66666666666666%}.flex.order-md11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.flex.md12{-ms-flex-preferred-size:100%;flex-basis:100%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:100%}.flex.order-md12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.flex.offset-md0{margin-left:0}.flex.offset-md1{margin-left:8.333333333333332%}.flex.offset-md2{margin-left:16.666666666666664%}.flex.offset-md3{margin-left:25%}.flex.offset-md4{margin-left:33.33333333333333%}.flex.offset-md5{margin-left:41.66666666666667%}.flex.offset-md6{margin-left:50%}.flex.offset-md7{margin-left:58.333333333333336%}.flex.offset-md8{margin-left:66.66666666666666%}.flex.offset-md9{margin-left:75%}.flex.offset-md10{margin-left:83.33333333333334%}.flex.offset-md11{margin-left:91.66666666666666%}.flex.offset-md12{margin-left:100%}}@media (min-width:1264px){.flex.lg1{-ms-flex-preferred-size:8.333333333333332%;flex-basis:8.333333333333332%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:8.333333333333332%}.flex.order-lg1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.flex.lg2{-ms-flex-preferred-size:16.666666666666664%;flex-basis:16.666666666666664%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:16.666666666666664%}.flex.order-lg2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.flex.lg3{-ms-flex-preferred-size:25%;flex-basis:25%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:25%}.flex.order-lg3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.flex.lg4{-ms-flex-preferred-size:33.33333333333333%;flex-basis:33.33333333333333%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:33.33333333333333%}.flex.order-lg4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.flex.lg5{-ms-flex-preferred-size:41.66666666666667%;flex-basis:41.66666666666667%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:41.66666666666667%}.flex.order-lg5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.flex.lg6{-ms-flex-preferred-size:50%;flex-basis:50%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:50%}.flex.order-lg6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.flex.lg7{-ms-flex-preferred-size:58.333333333333336%;flex-basis:58.333333333333336%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:58.333333333333336%}.flex.order-lg7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.flex.lg8{-ms-flex-preferred-size:66.66666666666666%;flex-basis:66.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:66.66666666666666%}.flex.order-lg8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.flex.lg9{-ms-flex-preferred-size:75%;flex-basis:75%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:75%}.flex.order-lg9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.flex.lg10{-ms-flex-preferred-size:83.33333333333334%;flex-basis:83.33333333333334%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:83.33333333333334%}.flex.order-lg10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.flex.lg11{-ms-flex-preferred-size:91.66666666666666%;flex-basis:91.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:91.66666666666666%}.flex.order-lg11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.flex.lg12{-ms-flex-preferred-size:100%;flex-basis:100%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:100%}.flex.order-lg12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.flex.offset-lg0{margin-left:0}.flex.offset-lg1{margin-left:8.333333333333332%}.flex.offset-lg2{margin-left:16.666666666666664%}.flex.offset-lg3{margin-left:25%}.flex.offset-lg4{margin-left:33.33333333333333%}.flex.offset-lg5{margin-left:41.66666666666667%}.flex.offset-lg6{margin-left:50%}.flex.offset-lg7{margin-left:58.333333333333336%}.flex.offset-lg8{margin-left:66.66666666666666%}.flex.offset-lg9{margin-left:75%}.flex.offset-lg10{margin-left:83.33333333333334%}.flex.offset-lg11{margin-left:91.66666666666666%}.flex.offset-lg12{margin-left:100%}}@media (min-width:1904px){.flex.xl1{-ms-flex-preferred-size:8.333333333333332%;flex-basis:8.333333333333332%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:8.333333333333332%}.flex.order-xl1{-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.flex.xl2{-ms-flex-preferred-size:16.666666666666664%;flex-basis:16.666666666666664%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:16.666666666666664%}.flex.order-xl2{-webkit-box-ordinal-group:3;-ms-flex-order:2;order:2}.flex.xl3{-ms-flex-preferred-size:25%;flex-basis:25%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:25%}.flex.order-xl3{-webkit-box-ordinal-group:4;-ms-flex-order:3;order:3}.flex.xl4{-ms-flex-preferred-size:33.33333333333333%;flex-basis:33.33333333333333%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:33.33333333333333%}.flex.order-xl4{-webkit-box-ordinal-group:5;-ms-flex-order:4;order:4}.flex.xl5{-ms-flex-preferred-size:41.66666666666667%;flex-basis:41.66666666666667%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:41.66666666666667%}.flex.order-xl5{-webkit-box-ordinal-group:6;-ms-flex-order:5;order:5}.flex.xl6{-ms-flex-preferred-size:50%;flex-basis:50%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:50%}.flex.order-xl6{-webkit-box-ordinal-group:7;-ms-flex-order:6;order:6}.flex.xl7{-ms-flex-preferred-size:58.333333333333336%;flex-basis:58.333333333333336%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:58.333333333333336%}.flex.order-xl7{-webkit-box-ordinal-group:8;-ms-flex-order:7;order:7}.flex.xl8{-ms-flex-preferred-size:66.66666666666666%;flex-basis:66.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:66.66666666666666%}.flex.order-xl8{-webkit-box-ordinal-group:9;-ms-flex-order:8;order:8}.flex.xl9{-ms-flex-preferred-size:75%;flex-basis:75%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:75%}.flex.order-xl9{-webkit-box-ordinal-group:10;-ms-flex-order:9;order:9}.flex.xl10{-ms-flex-preferred-size:83.33333333333334%;flex-basis:83.33333333333334%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:83.33333333333334%}.flex.order-xl10{-webkit-box-ordinal-group:11;-ms-flex-order:10;order:10}.flex.xl11{-ms-flex-preferred-size:91.66666666666666%;flex-basis:91.66666666666666%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:91.66666666666666%}.flex.order-xl11{-webkit-box-ordinal-group:12;-ms-flex-order:11;order:11}.flex.xl12{-ms-flex-preferred-size:100%;flex-basis:100%;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;max-width:100%}.flex.order-xl12{-webkit-box-ordinal-group:13;-ms-flex-order:12;order:12}.flex.offset-xl0{margin-left:0}.flex.offset-xl1{margin-left:8.333333333333332%}.flex.offset-xl2{margin-left:16.666666666666664%}.flex.offset-xl3{margin-left:25%}.flex.offset-xl4{margin-left:33.33333333333333%}.flex.offset-xl5{margin-left:41.66666666666667%}.flex.offset-xl6{margin-left:50%}.flex.offset-xl7{margin-left:58.333333333333336%}.flex.offset-xl8{margin-left:66.66666666666666%}.flex.offset-xl9{margin-left:75%}.flex.offset-xl10{margin-left:83.33333333333334%}.flex.offset-xl11{margin-left:91.66666666666666%}.flex.offset-xl12{margin-left:100%}}.application .theme--light.navigation-drawer,.theme--light .navigation-drawer{background-color:#fff}.application .theme--light.navigation-drawer .divider,.application .theme--light.navigation-drawer:not(.navigation-drawer--floating) .navigation-drawer__border,.theme--light .navigation-drawer .divider,.theme--light .navigation-drawer:not(.navigation-drawer--floating) .navigation-drawer__border{background-color:rgba(0,0,0,.12)}.application .theme--dark.navigation-drawer,.theme--dark .navigation-drawer{background-color:#424242}.application .theme--dark.navigation-drawer .divider,.application .theme--dark.navigation-drawer:not(.navigation-drawer--floating) .navigation-drawer__border,.theme--dark .navigation-drawer .divider,.theme--dark .navigation-drawer:not(.navigation-drawer--floating) .navigation-drawer__border{background-color:hsla(0,0%,100%,.12)}.navigation-drawer{transition:none;display:block;left:0;max-width:100%;overflow-y:auto;overflow-x:hidden;padding:0 0 100px;pointer-events:auto;top:0;will-change:transform;z-index:3;-webkit-overflow-scrolling:touch}.navigation-drawer[data-booted=true]{transition:.2s cubic-bezier(.4,0,.2,1);transition-property:background,background-color,border,border-bottom,border-bottom-color,border-bottom-width,border-color,border-left,border-left-color,border-left-width,border-right,border-right-color,border-right-width,border-top,border-top-color,border-top-width,border-width,bottom,box-shadow,color,height,left,margin,margin-bottom,margin-left,margin-right,margin-top,max-width,min-height,min-width,opacity,padding,padding-bottom,padding-left,padding-right,padding-top,right,top,transform,transform-origin,width;transition-property:background,background-color,border,border-bottom,border-bottom-color,border-bottom-width,border-color,border-left,border-left-color,border-left-width,border-right,border-right-color,border-right-width,border-top,border-top-color,border-top-width,border-width,bottom,box-shadow,color,height,left,margin,margin-bottom,margin-left,margin-right,margin-top,max-width,min-height,min-width,opacity,padding,padding-bottom,padding-left,padding-right,padding-top,right,top,transform,transform-origin,width,-webkit-transform,-webkit-transform-origin}.navigation-drawer__border{position:absolute;right:0;top:0;height:100%;width:1px}.navigation-drawer.navigation-drawer--right:after{left:0;right:auto}.navigation-drawer--right{left:auto;right:0}.navigation-drawer--right>.navigation-drawer__border{right:auto;left:0}.navigation-drawer--absolute{position:absolute}.navigation-drawer--fixed{position:fixed}.navigation-drawer--floating:after{display:none}.navigation-drawer--mini-variant{overflow:hidden}.navigation-drawer--mini-variant .list__group__header__prepend-icon{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%}.navigation-drawer--mini-variant .list__tile__action,.navigation-drawer--mini-variant .list__tile__avatar{-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;min-width:48px}.navigation-drawer--mini-variant .list__tile:after,.navigation-drawer--mini-variant .list__tile__content{opacity:0}.navigation-drawer--mini-variant .divider,.navigation-drawer--mini-variant .list--group,.navigation-drawer--mini-variant .subheader{display:none!important}.navigation-drawer--is-mobile,.navigation-drawer--temporary{z-index:6}.navigation-drawer--is-mobile:not(.navigation-drawer--close),.navigation-drawer--temporary:not(.navigation-drawer--close){box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)}.navigation-drawer .list{background:inherit}.navigation-drawer>.list .list__tile{transition:none;font-weight:500}.navigation-drawer>.list .list__tile--active .list__tile__title{color:inherit}.navigation-drawer>.list .list--group .list__tile{font-weight:400}.navigation-drawer>.list .list--group__header--active:after{background:transparent}.navigation-drawer>.list:not(.list--dense) .list__tile{font-size:14px}.application .theme--light.pagination__item,.theme--light .pagination__item{background:#fff;color:#000}.application .theme--light.pagination__item--active,.theme--light .pagination__item--active{color:#fff}.application .theme--light.pagination__navigation,.theme--light .pagination__navigation{background:#fff}.application .theme--light.pagination__navigation .icon,.theme--light .pagination__navigation .icon{color:rgba(0,0,0,.54)}.application .theme--dark.pagination__item,.theme--dark .pagination__item{background:#424242;color:#fff}.application .theme--dark.pagination__item--active,.theme--dark .pagination__item--active{color:#fff}.application .theme--dark.pagination__navigation,.theme--dark .pagination__navigation{background:#424242}.application .theme--dark.pagination__navigation .icon,.theme--dark .pagination__navigation .icon{color:#fff}.pagination{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;list-style-type:none;margin:0;max-width:100%;padding:0}.pagination,.pagination>li{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.pagination>li{display:-webkit-box;display:-ms-flexbox;display:flex}.pagination--circle .pagination__item,.pagination--circle .pagination__more,.pagination--circle .pagination__navigation{border-radius:50%}.pagination--disabled{pointer-events:none;opacity:.6}.pagination__item{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);border-radius:4px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;font-size:14px;background:transparent;height:34px;width:34px;margin:.3rem;text-decoration:none;transition:.3s cubic-bezier(0,0,.2,1)}.pagination__item--active{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.pagination__navigation{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;text-decoration:none;height:2rem;border-radius:4px;width:2rem;margin:.3rem 10px}.pagination__navigation .icon{font-size:2rem;transition:.2s cubic-bezier(.4,0,.6,1);vertical-align:middle}.pagination__navigation--disabled{opacity:.6;pointer-events:none}.pagination__more{margin:.3rem;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;height:2rem;width:2rem}.parallax{position:relative;overflow:hidden;z-index:0}.parallax__image-container{position:absolute;top:0;left:0;right:0;bottom:0;z-index:1;contain:strict}.parallax__image{position:absolute;bottom:0;left:50%;min-width:100%;min-height:100%;display:none;-webkit-transform:translate(-50%);transform:translate(-50%);will-change:transform;transition:opacity .3s cubic-bezier(.25,.8,.5,1);z-index:1}.parallax__content{color:#fff;height:100%;z-index:2;position:relative;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;padding:0 1rem}.radio-group .input-group__details:after,.radio-group .input-group__details:before{display:none}.radio-group .input-group{padding:0}.radio-group--column .input-group__input{display:block}.radio-group--row .input-group__input{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}.radio-group.input-group--error .radio .icon--selection-control,.radio-group.input-group--error .radio label{color:inherit}.application .theme--light.input-group--slider label,.theme--light .input-group--slider label{color:rgba(0,0,0,.54)}.application .theme--light.input-group--slider .slider__track,.application .theme--light.input-group--slider .slider__track-fill,.theme--light .input-group--slider .slider__track,.theme--light .input-group--slider .slider__track-fill{background:rgba(0,0,0,.26)}.application .theme--light.input-group--slider .slider__tick,.application .theme--light.input-group--slider .slider__track__container:after,.theme--light .input-group--slider .slider__tick,.theme--light .input-group--slider .slider__track__container:after{border:1px solid rgba(0,0,0,.87)}.application .theme--light.input-group--slider:not(.input-group--dirty) .slider__thumb--label,.theme--light .input-group--slider:not(.input-group--dirty) .slider__thumb--label{background:rgba(0,0,0,.26)}.application .theme--light.input-group--slider:not(.input-group--dirty) .slider__thumb,.theme--light .input-group--slider:not(.input-group--dirty) .slider__thumb{border:3px solid rgba(0,0,0,.26)}.application .theme--light.input-group--slider:not(.input-group--dirty):focus .slider__thumb,.theme--light .input-group--slider:not(.input-group--dirty):focus .slider__thumb{border:3px solid rgba(0,0,0,.38)}.application .theme--light.input-group--slider.input-group--disabled .slider__thumb,.theme--light .input-group--slider.input-group--disabled .slider__thumb{background:none;border:3px solid rgba(0,0,0,.26)}.application .theme--light.input-group--slider.input-group--disabled.input-group--dirty .slider__thumb,.theme--light .input-group--slider.input-group--disabled.input-group--dirty .slider__thumb{background:rgba(0,0,0,.26);border:0 solid transparent}.application .theme--light.input-group--slider:focus .slider__track,.theme--light .input-group--slider:focus .slider__track{background:rgba(0,0,0,.38)}.application .theme--dark.input-group--slider label,.theme--dark .input-group--slider label{color:hsla(0,0%,100%,.7)}.application .theme--dark.input-group--slider .slider__track,.application .theme--dark.input-group--slider .slider__track-fill,.theme--dark .input-group--slider .slider__track,.theme--dark .input-group--slider .slider__track-fill{background:hsla(0,0%,100%,.2)}.application .theme--dark.input-group--slider .slider__tick,.application .theme--dark.input-group--slider .slider__track__container:after,.theme--dark .input-group--slider .slider__tick,.theme--dark .input-group--slider .slider__track__container:after{border:1px solid #fff}.application .theme--dark.input-group--slider:not(.input-group--dirty) .slider__thumb--label,.theme--dark .input-group--slider:not(.input-group--dirty) .slider__thumb--label{background:hsla(0,0%,100%,.2)}.application .theme--dark.input-group--slider:not(.input-group--dirty) .slider__thumb,.theme--dark .input-group--slider:not(.input-group--dirty) .slider__thumb{border:3px solid hsla(0,0%,100%,.2)}.application .theme--dark.input-group--slider:not(.input-group--dirty):focus .slider__thumb,.theme--dark .input-group--slider:not(.input-group--dirty):focus .slider__thumb{border:3px solid hsla(0,0%,100%,.3)}.application .theme--dark.input-group--slider.input-group--disabled .slider__thumb,.theme--dark .input-group--slider.input-group--disabled .slider__thumb{background:none;border:3px solid hsla(0,0%,100%,.2)}.application .theme--dark.input-group--slider.input-group--disabled.input-group--dirty .slider__thumb,.theme--dark .input-group--slider.input-group--disabled.input-group--dirty .slider__thumb{background:hsla(0,0%,100%,.2);border:0 solid transparent}.application .theme--dark.input-group--slider:focus .slider__track,.theme--dark .input-group--slider:focus .slider__track{background:hsla(0,0%,100%,.3)}.input-group.input-group--slider{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:wrap;flex-wrap:wrap;padding-right:16px}.input-group.input-group--slider .input-group__details:after,.input-group.input-group--slider .input-group__details:before{display:none}.input-group.input-group--slider .input-group__input{-webkit-box-flex:1;-ms-flex:1 1 100%;flex:1 1 100%}.input-group.input-group--slider label{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;width:auto;-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;font-size:18px;-webkit-transform:none;transform:none}.input-group.input-group--slider label+.input-group__input{margin-left:16px;-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto}.input-group.input-group--slider.input-group--active .slider__thumb{-webkit-transform:translateY(-50%) scale(1.2);transform:translateY(-50%) scale(1.2)}.input-group.input-group--slider.input-group--active .slider__track{transition:none}.input-group.input-group--slider.input-group--active .slider__thumb-container--label .slider__thumb,.input-group.input-group--slider.input-group--active .slider__thumb-container--label .slider__thumb:hover{-webkit-transform:translateY(-50%) scale(0);transform:translateY(-50%) scale(0)}.input-group.input-group--slider.input-group--active .slider__thumb-container,.input-group.input-group--slider.input-group--active .slider__track-fill{transition:none}.input-group.input-group--slider.input-group--active.input-group--ticks .slider__tick,.input-group.input-group--slider.input-group--active.input-group--ticks .slider__track__container:after{opacity:1}.input-group.input-group--slider.input-group--disabled{pointer-events:none}.input-group.input-group--slider.input-group--disabled .slider__thumb{-webkit-transform:translateY(-50%) scale(.5);transform:translateY(-50%) scale(.5);background:transparent}.input-group.input-group--slider.input-group--disabled.input-group--dirty{border-color:transparent}.input-group.input-group--slider.input-group--prepend-icon .slider{margin-left:40px}.input-group.input-group--slider.input-group--append-icon .slider{margin-right:40px}.slider{cursor:default;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;position:relative;height:30px;-webkit-box-flex:1;-ms-flex:1;flex:1;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.slider__track__container{position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);height:2px;width:100%;overflow:hidden}.slider__track__container:after{content:\"\";position:absolute;right:0;top:0;height:2px;transition:.3s cubic-bezier(.25,.8,.5,1);width:2px;opacity:0}.slider__thumb,.slider__tick,.slider__track{position:absolute;top:0}.slider__track{-webkit-transform-origin:right;transform-origin:right;overflow:hidden}.slider__track,.slider__track-fill{height:2px;left:0;transition:.3s cubic-bezier(.25,.8,.5,1);width:100%}.slider__track-fill{position:absolute;-webkit-transform-origin:left;transform-origin:left}.slider__ticks-container{position:absolute;left:0;height:2px;width:100%;top:50%;overflow:hidden}.slider__tick{transition:.3s cubic-bezier(.25,.8,.5,1);opacity:0}.slider__thumb-container{position:absolute}.slider__thumb,.slider__thumb-container{top:50%;transition:.3s cubic-bezier(.25,.8,.5,1)}.slider__thumb{width:16px;height:16px;left:-8px;border-radius:50%;background:transparent;-webkit-transform:translateY(-50%) scale(.8);transform:translateY(-50%) scale(.8);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.slider__thumb--label__container{position:absolute;left:0;top:0;transition:.3s ease-in-out}.slider__thumb--label{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:12px;color:#fff;width:28px;height:28px;border-radius:50% 50% 0;position:absolute;left:-14px;top:-40px;-webkit-transform:rotate(45deg);transform:rotate(45deg);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:.3s ease-in-out}.slider__thumb--label span{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.slider__track,.slider__track-fill{position:absolute}.snack{position:fixed;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#fff;pointer-events:none;z-index:1000;font-size:14px;left:0;right:0}.snack--absolute{position:absolute}.snack--top{top:0}.snack--bottom{bottom:0}.snack__wrapper{background-color:#323232;pointer-events:auto;box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)}.snack__content,.snack__wrapper{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:100%}.snack__content{height:48px;padding:14px 24px;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;overflow:hidden}.snack__content .btn{color:#fff;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;margin:0 0 0 24px;height:auto;min-width:auto;width:auto}.snack__content .btn__content{padding:8px;margin:-8px}.snack__content .btn__content:before{display:none}.snack--multi-line .snack__content{height:80px;padding:24px}.snack--vertical .snack__content{height:112px;padding:24px 24px 14px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.snack--vertical .snack__content .btn.btn{-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;margin-left:0;margin-top:24px}.snack--vertical .snack__content .btn__content{padding:0;-webkit-box-flex:0;-ms-flex:0 0 auto;flex:0 0 auto;margin:0}.snack--auto-height .snack__content{height:auto}.snack-transition-enter-active,.snack-transition-leave-active{transition:-webkit-transform .4s cubic-bezier(.25,.8,.5,1);transition:transform .4s cubic-bezier(.25,.8,.5,1);transition:transform .4s cubic-bezier(.25,.8,.5,1),-webkit-transform .4s cubic-bezier(.25,.8,.5,1)}.snack-transition-enter-active .snack__content,.snack-transition-leave-active .snack__content{transition:opacity .3s linear .1s}.snack-transition-enter .snack__content{opacity:0}.snack-transition-enter-to .snack__content,.snack-transition-leave .snack__content{opacity:1}.snack-transition-enter.snack.snack--top,.snack-transition-leave-to.snack.snack--top{-webkit-transform:translateY(calc(-100% - 8px));transform:translateY(calc(-100% - 8px))}.snack-transition-enter.snack.snack--bottom,.snack-transition-leave-to.snack.snack--bottom{-webkit-transform:translateY(100%);transform:translateY(100%)}@media only screen and (min-width:600px){.snack__wrapper{width:auto;max-width:568px;min-width:288px;margin:0 auto;border-radius:2px}.snack--left .snack__wrapper{margin-left:0}.snack--right .snack__wrapper{margin-right:0}.snack--left,.snack--right{margin:0 24px}.snack--left.snack--top,.snack--right.snack--top{-webkit-transform:translateY(24px);transform:translateY(24px)}.snack--left.snack--bottom,.snack--right.snack--bottom{-webkit-transform:translateY(-24px);transform:translateY(-24px)}.snack__content .btn:first-of-type{margin-left:48px}}.speed-dial{position:relative}.speed-dial--absolute{position:absolute}.speed-dial--fixed{position:fixed}.speed-dial--absolute,.speed-dial--fixed{z-index:4}.speed-dial--absolute>.btn--floating,.speed-dial--fixed>.btn--floating{margin:0}.speed-dial--top:not(.speed-dial--absolute){top:16px}.speed-dial--top.speed-dial--absolute{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.speed-dial--bottom:not(.speed-dial--absolute){bottom:16px}.speed-dial--bottom.speed-dial--absolute{bottom:50%;-webkit-transform:translateY(50%);transform:translateY(50%)}.speed-dial--left{left:16px}.speed-dial--right{right:16px}.speed-dial--direction-left .speed-dial__list,.speed-dial--direction-right .speed-dial__list{height:100%;top:0}.speed-dial--direction-bottom .speed-dial__list,.speed-dial--direction-top .speed-dial__list{left:0;width:100%}.speed-dial--direction-top .speed-dial__list{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;bottom:100%}.speed-dial--direction-right .speed-dial__list{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;left:100%}.speed-dial--direction-bottom .speed-dial__list{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;top:100%}.speed-dial--direction-left .speed-dial__list{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse;right:100%}.speed-dial__list{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;position:absolute}.speed-dial__list .btn:first-child{transition-delay:.05s}.speed-dial__list .btn:nth-child(2){transition-delay:.1s}.speed-dial__list .btn:nth-child(3){transition-delay:.15s}.speed-dial__list .btn:nth-child(4){transition-delay:.2s}.speed-dial__list .btn:nth-child(5){transition-delay:.25s}.speed-dial__list .btn:nth-child(6){transition-delay:.3s}.speed-dial__list .btn:nth-child(7){transition-delay:.35s}.application .theme--light.stepper,.theme--light .stepper{background:#fff}.application .theme--light.stepper .stepper__step:not(.stepper__step--active):not(.stepper__step--complete):not(.stepper__step--error) .stepper__step__step,.theme--light .stepper .stepper__step:not(.stepper__step--active):not(.stepper__step--complete):not(.stepper__step--error) .stepper__step__step{background:rgba(0,0,0,.38)}.application .theme--light.stepper .stepper__step__step,.application .theme--light.stepper .stepper__step__step .icon,.theme--light .stepper .stepper__step__step,.theme--light .stepper .stepper__step__step .icon{color:#fff}.application .theme--light.stepper .stepper__header .divider,.theme--light .stepper .stepper__header .divider{background:rgba(0,0,0,.12)}.application .theme--light.stepper .stepper__step--active .stepper__label,.theme--light .stepper .stepper__step--active .stepper__label{text-shadow:0 0 0 #000}.application .theme--light.stepper .stepper__step--editable:hover,.theme--light .stepper .stepper__step--editable:hover{background:rgba(0,0,0,.06)}.application .theme--light.stepper .stepper__step--editable:hover .stepper__label,.theme--light .stepper .stepper__step--editable:hover .stepper__label{text-shadow:0 0 0 #000}.application .theme--light.stepper .stepper__step--complete .stepper__label,.theme--light .stepper .stepper__step--complete .stepper__label{color:rgba(0,0,0,.87)}.application .theme--light.stepper .stepper__step--inactive.stepper__step--editable:not(.stepper__step--error):hover .stepper__step__step,.theme--light .stepper .stepper__step--inactive.stepper__step--editable:not(.stepper__step--error):hover .stepper__step__step{background:rgba(0,0,0,.54)}.application .theme--light.stepper .stepper__label,.theme--light .stepper .stepper__label{color:rgba(0,0,0,.38)}.application .theme--light.stepper--non-linear .stepper__step:not(.stepper__step--complete):not(.stepper__step--error) .stepper__label,.application .theme--light.stepper .stepper__label small,.theme--light .stepper--non-linear .stepper__step:not(.stepper__step--complete):not(.stepper__step--error) .stepper__label,.theme--light .stepper .stepper__label small{color:rgba(0,0,0,.54)}.application .theme--light.stepper--vertical .stepper__content:not(:last-child),.theme--light .stepper--vertical .stepper__content:not(:last-child){border-left:1px solid rgba(0,0,0,.12)}.application .theme--dark.stepper,.theme--dark .stepper{background:#303030}.application .theme--dark.stepper .stepper__step:not(.stepper__step--active):not(.stepper__step--complete):not(.stepper__step--error) .stepper__step__step,.theme--dark .stepper .stepper__step:not(.stepper__step--active):not(.stepper__step--complete):not(.stepper__step--error) .stepper__step__step{background:hsla(0,0%,100%,.5)}.application .theme--dark.stepper .stepper__step__step,.application .theme--dark.stepper .stepper__step__step .icon,.theme--dark .stepper .stepper__step__step,.theme--dark .stepper .stepper__step__step .icon{color:#fff}.application .theme--dark.stepper .stepper__header .divider,.theme--dark .stepper .stepper__header .divider{background:hsla(0,0%,100%,.12)}.application .theme--dark.stepper .stepper__step--active .stepper__label,.theme--dark .stepper .stepper__step--active .stepper__label{text-shadow:0 0 0 #fff}.application .theme--dark.stepper .stepper__step--editable:hover,.theme--dark .stepper .stepper__step--editable:hover{background:hsla(0,0%,100%,.06)}.application .theme--dark.stepper .stepper__step--editable:hover .stepper__label,.theme--dark .stepper .stepper__step--editable:hover .stepper__label{text-shadow:0 0 0 #fff}.application .theme--dark.stepper .stepper__step--complete .stepper__label,.theme--dark .stepper .stepper__step--complete .stepper__label{color:hsla(0,0%,100%,.87)}.application .theme--dark.stepper .stepper__step--inactive.stepper__step--editable:not(.stepper__step--error):hover .stepper__step__step,.theme--dark .stepper .stepper__step--inactive.stepper__step--editable:not(.stepper__step--error):hover .stepper__step__step{background:hsla(0,0%,100%,.75)}.application .theme--dark.stepper .stepper__label,.theme--dark .stepper .stepper__label{color:hsla(0,0%,100%,.5)}.application .theme--dark.stepper--non-linear .stepper__step:not(.stepper__step--complete):not(.stepper__step--error) .stepper__label,.application .theme--dark.stepper .stepper__label small,.theme--dark .stepper--non-linear .stepper__step:not(.stepper__step--complete):not(.stepper__step--error) .stepper__label,.theme--dark .stepper .stepper__label small{color:hsla(0,0%,100%,.7)}.application .theme--dark.stepper--vertical .stepper__content:not(:last-child),.theme--dark .stepper--vertical .stepper__content:not(:last-child){border-left:1px solid hsla(0,0%,100%,.12)}.stepper{overflow:hidden;position:relative}.stepper,.stepper__header{box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.stepper__header{height:72px;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.stepper__header .divider{-ms-flex-item-align:center;align-self:center;margin:0 -16px}.stepper__items{position:relative;overflow:hidden}.stepper__step__step{-webkit-box-align:center;-ms-flex-align:center;align-items:center;border-radius:50%;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;font-size:12px;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;height:24px;margin-right:8px;min-width:24px;width:24px;transition:.3s cubic-bezier(.25,.8,.25,1)}.stepper__step__step .icon{font-size:18px}.stepper__step{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;padding:24px;position:relative}.stepper__step--active .stepper__label{transition:.3s cubic-bezier(.4,0,.6,1)}.stepper__step--editable{cursor:pointer}.stepper__step.stepper__step--error .stepper__step__step{background:transparent;color:inherit}.stepper__step.stepper__step--error .stepper__step__step .icon{font-size:24px;color:inherit}.stepper__step.stepper__step--error .stepper__label{color:inherit;text-shadow:none;font-weight:500}.stepper__step.stepper__step--error .stepper__label small{color:inherit}.stepper__label{-webkit-box-align:start;-ms-flex-align:start;align-items:flex-start;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;text-align:left}.stepper__label small{font-size:12px;font-weight:300;text-shadow:none}.stepper__wrapper{overflow:hidden;transition:none}.stepper__content{top:0;padding:24px 24px 16px;-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;width:100%}.stepper__content>.btn{margin:24px 8px 8px 0}.stepper--is-booted .stepper__content,.stepper--is-booted .stepper__wrapper{transition:.3s cubic-bezier(.25,.8,.5,1)}.stepper--vertical{padding-bottom:36px}.stepper--vertical .stepper__content{margin:-8px -36px -16px 36px;padding:16px 60px 16px 23px;width:auto}.stepper--vertical .stepper__step{padding:24px 24px 16px}.stepper--vertical .stepper__step__step{margin-right:12px}.stepper--alt-labels .stepper__header{height:auto}.stepper--alt-labels .stepper__header .divider{margin:35px -67px 0;-ms-flex-item-align:start;align-self:flex-start}.stepper--alt-labels .stepper__step{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-ms-flex-preferred-size:175px;flex-basis:175px}.stepper--alt-labels .stepper__step small{-ms-flex-item-align:center;align-self:center}.stepper--alt-labels .stepper__step__step{margin-right:0;margin-bottom:11px}@media only screen and (max-width:959px){.stepper:not(.stepper--vertical) .stepper__label{display:none}.stepper:not(.stepper--vertical) .stepper__step__step{margin-right:0}}.application .theme--light.switch:not(.input-group--dirty) .input-group--selection-controls__container,.theme--light .switch:not(.input-group--dirty) .input-group--selection-controls__container{color:rgba(0,0,0,.38)!important}.application .theme--light.switch .input-group--selection-controls__ripple:after,.theme--light .switch .input-group--selection-controls__ripple:after{background-color:#fafafa}.application .theme--light.switch .input-group--selection-controls__ripple:not(.input-group--selection-controls__ripple--active),.theme--light .switch .input-group--selection-controls__ripple:not(.input-group--selection-controls__ripple--active){color:rgba(0,0,0,.38)}.application .theme--light.switch .input-group--selection-controls__ripple--active:after,.theme--light .switch .input-group--selection-controls__ripple--active:after{background-color:currentColor}.application .theme--light.switch .input-group--selection-controls__toggle,.theme--light .switch .input-group--selection-controls__toggle{color:rgba(0,0,0,.38)}.application .theme--light.switch .input-group--selection-controls__toggle--active,.theme--light .switch .input-group--selection-controls__toggle--active{color:inherit}.application .theme--light.switch.input-group--disabled .input-group--selection-controls__ripple:after,.theme--light .switch.input-group--disabled .input-group--selection-controls__ripple:after{background-color:#bdbdbd!important}.application .theme--light.switch.input-group--disabled .input-group--selection-controls__toggle,.theme--light .switch.input-group--disabled .input-group--selection-controls__toggle{color:rgba(0,0,0,.12)!important}.application .theme--dark.switch:not(.input-group--dirty) .input-group--selection-controls__container,.theme--dark .switch:not(.input-group--dirty) .input-group--selection-controls__container{color:hsla(0,0%,100%,.3)!important}.application .theme--dark.switch .input-group--selection-controls__ripple:after,.theme--dark .switch .input-group--selection-controls__ripple:after{background-color:#bdbdbd}.application .theme--dark.switch .input-group--selection-controls__ripple:not(.input-group--selection-controls__ripple--active),.theme--dark .switch .input-group--selection-controls__ripple:not(.input-group--selection-controls__ripple--active){color:hsla(0,0%,100%,.3)}.application .theme--dark.switch .input-group--selection-controls__ripple--active:after,.theme--dark .switch .input-group--selection-controls__ripple--active:after{background-color:currentColor}.application .theme--dark.switch .input-group--selection-controls__toggle,.theme--dark .switch .input-group--selection-controls__toggle{color:hsla(0,0%,100%,.3)}.application .theme--dark.switch .input-group--selection-controls__toggle--active,.theme--dark .switch .input-group--selection-controls__toggle--active{color:inherit}.application .theme--dark.switch.input-group--disabled .input-group--selection-controls__ripple:after,.theme--dark .switch.input-group--disabled .input-group--selection-controls__ripple:after{background-color:#424242!important}.application .theme--dark.switch.input-group--disabled .input-group--selection-controls__toggle,.theme--dark .switch.input-group--disabled .input-group--selection-controls__toggle{color:hsla(0,0%,100%,.1)!important}.input-group.input-group--selection-controls{z-index:0}.input-group.input-group--selection-controls.switch.input-group--append-icon label,.input-group.input-group--selection-controls.switch.input-group--prepend-icon label{left:62px}.input-group.input-group--selection-controls.switch.input-group--prepend-icon .input-group--selection-controls__container{margin-left:6px}.input-group.input-group--selection-controls.switch.input-group--append-icon .input-group__append-icon{left:40px}.input-group.input-group--selection-controls.switch .input-group--selection-controls__container{color:inherit;position:relative;width:36px}.input-group.input-group--selection-controls.switch .input-group--selection-controls__container[class*=\"--text\"] .input-group--selection-controls__ripple--active:after{background-color:currentColor}.input-group.input-group--selection-controls.switch .input-group--selection-controls__toggle{background-color:currentColor;color:inherit;position:absolute;height:14px;top:50%;left:0;width:34px;border-radius:8px;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.input-group.input-group--selection-controls.switch .input-group--selection-controls__toggle.input-group--selection-controls__toggle--active{opacity:.5}.input-group.input-group--selection-controls.switch .input-group--selection-controls__ripple{-webkit-transform:translate(-15px,-24px);transform:translate(-15px,-24px);transition:.3s cubic-bezier(.25,.8,.25,1);z-index:1;left:0}.input-group.input-group--selection-controls.switch .input-group--selection-controls__ripple:after{content:\"\";position:absolute;display:inline-block;cursor:pointer;width:20px;border-radius:50%;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);height:20px;box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.input-group.input-group--selection-controls.switch .input-group--selection-controls__ripple--active{-webkit-transform:translate(2px,-24px);transform:translate(2px,-24px)}.input-group.input-group--selection-controls.switch label{padding-left:14px}.application .theme--light.system-bar,.theme--light .system-bar{background-color:#e0e0e0;color:rgba(0,0,0,.54)}.application .theme--light.system-bar .icon,.theme--light .system-bar .icon{color:rgba(0,0,0,.54)}.application .theme--light.system-bar--lights-out,.theme--light .system-bar--lights-out{background-color:hsla(0,0%,100%,.7)!important}.application .theme--dark.system-bar,.theme--dark .system-bar{background-color:#000;color:hsla(0,0%,100%,.7)}.application .theme--dark.system-bar .icon,.theme--dark .system-bar .icon{color:hsla(0,0%,100%,.7)}.application .theme--dark.system-bar--lights-out,.theme--dark .system-bar--lights-out{background-color:rgba(0,0,0,.2)!important}.system-bar{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:14px;font-weight:500;padding:0 8px}.system-bar .icon{font-size:16px}.system-bar--absolute,.system-bar--fixed{left:0;top:0;width:100%;z-index:3}.system-bar--fixed{position:fixed}.system-bar--absolute{position:absolute}.system-bar--status .icon{margin-right:4px}.system-bar--window .icon{font-size:20px;margin-right:8px}.application .theme--light.tabs__bar,.theme--light .tabs__bar{background-color:#fff}.application .theme--light.tabs__bar .tabs__div,.theme--light .tabs__bar .tabs__div{color:rgba(0,0,0,.87)}.application .theme--light.tabs__bar .tabs__item--disabled,.theme--light .tabs__bar .tabs__item--disabled{color:rgba(0,0,0,.26)}.application .theme--dark.tabs__bar,.theme--dark .tabs__bar{background-color:#424242}.application .theme--dark.tabs__bar .tabs__div,.theme--dark .tabs__bar .tabs__div{color:#fff}.application .theme--dark.tabs__bar .tabs__item--disabled,.theme--dark .tabs__bar .tabs__item--disabled{color:hsla(0,0%,100%,.3)}.tabs,.tabs__bar{position:relative}.tabs__icon{-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;height:100%;position:absolute;top:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:32px}.tabs__icon--prev{left:4px}.tabs__icon--next{right:4px}.tabs__wrapper{overflow:hidden;contain:content;display:-webkit-box;display:-ms-flexbox;display:flex}.tabs__wrapper--show-arrows{margin-left:40px;margin-right:40px}.tabs__wrapper--show-arrows .tabs__container--align-with-title{padding-left:16px}.tabs__container{display:-webkit-box;display:-ms-flexbox;display:flex;height:48px;list-style-type:none;transition:-webkit-transform .6s cubic-bezier(.86,0,.07,1);transition:transform .6s cubic-bezier(.86,0,.07,1);transition:transform .6s cubic-bezier(.86,0,.07,1),-webkit-transform .6s cubic-bezier(.86,0,.07,1);white-space:nowrap;position:relative}.tabs__container,.tabs__container--grow .tabs__div,.tabs__container--overflow .tabs__div{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto}.tabs__container--grow .tabs__div{max-width:none}.tabs__container--icons-and-text{height:72px}.tabs__container--align-with-title{padding-left:56px}.tabs__container--centered .tabs__div,.tabs__container--fixed-tabs .tabs__div,.tabs__container--icons-and-text .tabs__div{min-width:72px}.tabs__container--centered .tabs__slider-wrapper+.tabs__div,.tabs__container--centered>.tabs__div:first-child,.tabs__container--fixed-tabs .tabs__slider-wrapper+.tabs__div,.tabs__container--fixed-tabs>.tabs__div:first-child,.tabs__container--right .tabs__slider-wrapper+.tabs__div,.tabs__container--right>.tabs__div:first-child{margin-left:auto}.tabs__container--centered>.tabs__div:last-child,.tabs__container--fixed-tabs>.tabs__div:last-child{margin-right:auto}.tabs__container--icons-and-text .tabs__item{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.tabs__container--icons-and-text .tabs__item .icon{margin-bottom:6px}.tabs__div{-ms-flex-align:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;font-size:14px;font-weight:500;line-height:normal;height:inherit;max-width:264px;text-align:center;text-transform:uppercase;vertical-align:middle}.tabs__div,.tabs__item{-webkit-box-align:center;align-items:center}.tabs__item{-ms-flex-align:center;color:inherit;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1 1;flex:1 1;-ms-flex-preferred-size:264px;flex-basis:264px;height:100%;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;max-width:inherit;padding:6px 12px;text-decoration:none;transition:.3s cubic-bezier(.25,.8,.5,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:normal}.tabs__item:not(.tabs__item--active){opacity:.7}.tabs__item--disabled{pointer-events:none}.tabs__slider{height:2px;width:100%}.tabs__slider-wrapper{bottom:0;margin:0!important;position:absolute;transition:.3s cubic-bezier(.25,.8,.5,1)}.tabs__items{overflow:hidden;position:relative}.tabs__content{width:100%;transition:-webkit-transform .4s cubic-bezier(.86,0,.07,1);transition:transform .4s cubic-bezier(.86,0,.07,1);transition:transform .4s cubic-bezier(.86,0,.07,1),-webkit-transform .4s cubic-bezier(.86,0,.07,1)}@media only screen and (max-width:599px){.tabs__wrapper--show-arrows .tabs__container--align-with-title{padding-left:24px}.tabs__container--align-with-title{padding-left:64px}.tabs__container--fixed-tabs .tabs__div{-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto}}@media only screen and (min-width:600px){.tabs__container--centered .tabs__div,.tabs__container--fixed-tabs .tabs__div,.tabs__container--icons-and-text .tabs__div{min-width:160px}}.time-picker-title{color:#fff;display:-webkit-box;display:-ms-flexbox;display:flex;line-height:1;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.time-picker-title__time{white-space:nowrap}.time-picker-title__time .picker__title__btn,.time-picker-title__time span{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;height:70px;font-size:70px;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.time-picker-title__ampm{-ms-flex-item-align:end;align-self:flex-end;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;font-size:16px;margin:8px 0 6px 8px;text-transform:uppercase}.time-picker-title__ampm div:only-child{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}.picker__title--landscape .time-picker-title{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;height:100%}.picker__title--landscape .time-picker-title__time{text-align:right}.picker__title--landscape .time-picker-title__time .picker__title__btn,.picker__title--landscape .time-picker-title__time span{height:55px;font-size:55px}.picker__title--landscape .time-picker-title__ampm{margin:16px 0 0;-ms-flex-item-align:initial;align-self:auto;text-align:center}.application .theme--light.time-picker-clock,.theme--light .time-picker-clock{background:#e0e0e0}.application .theme--light.time-picker-clock>span.disabled,.theme--light .time-picker-clock>span.disabled{color:rgba(0,0,0,.26)}.application .theme--light.time-picker-clock>span.disabled.active,.theme--light .time-picker-clock>span.disabled.active{color:hsla(0,0%,100%,.3)}.application .theme--light.time-picker-clock--indeterminate .time-picker-clock__hand,.theme--light .time-picker-clock--indeterminate .time-picker-clock__hand{background-color:#bdbdbd}.application .theme--light.time-picker-clock--indeterminate .time-picker-clock__hand:after,.theme--light .time-picker-clock--indeterminate .time-picker-clock__hand:after{color:#bdbdbd}.application .theme--light.time-picker-clock--indeterminate>span.active,.theme--light .time-picker-clock--indeterminate>span.active{background-color:#bdbdbd}.application .theme--dark.time-picker-clock,.theme--dark .time-picker-clock{background:#616161}.application .theme--dark.time-picker-clock>span.disabled,.application .theme--dark.time-picker-clock>span.disabled.active,.theme--dark .time-picker-clock>span.disabled,.theme--dark .time-picker-clock>span.disabled.active{color:hsla(0,0%,100%,.3)}.application .theme--dark.time-picker-clock--indeterminate .time-picker-clock__hand,.theme--dark .time-picker-clock--indeterminate .time-picker-clock__hand{background-color:#757575}.application .theme--dark.time-picker-clock--indeterminate .time-picker-clock__hand:after,.theme--dark .time-picker-clock--indeterminate .time-picker-clock__hand:after{color:#757575}.application .theme--dark.time-picker-clock--indeterminate>span.active,.theme--dark .time-picker-clock--indeterminate>span.active{background-color:#757575}.time-picker-clock{border-radius:100%;position:relative;transition:.3s cubic-bezier(.25,.8,.5,1);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.time-picker-clock__container{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;padding:10px}.time-picker-clock__hand{height:calc(50% - 28px);width:2px;bottom:50%;left:calc(50% - 1px);-webkit-transform-origin:center bottom;transform-origin:center bottom;position:absolute;will-change:transform;z-index:1}.time-picker-clock__hand:before{background:transparent;border-width:2px;width:10px;height:10px;top:-3%}.time-picker-clock__hand:after,.time-picker-clock__hand:before{border-style:solid;border-color:inherit;border-radius:100%;content:\"\";position:absolute;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.time-picker-clock__hand:after{height:8px;width:8px;top:100%;background-color:inherit}.time-picker-clock>span{-webkit-box-align:center;-ms-flex-align:center;align-items:center;border-radius:100%;cursor:default;display:-webkit-box;display:-ms-flexbox;display:flex;font-size:16px;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;left:calc(50% - 40px / 2);height:40px;position:absolute;text-align:center;top:calc(50% - 40px / 2);width:40px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.time-picker-clock>span>span{z-index:1}.time-picker-clock>span:after,.time-picker-clock>span:before{content:\"\";border-radius:100%;position:absolute;top:50%;left:50%;height:14px;width:14px;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);height:40px;width:40px}.time-picker-clock>span.active{color:#fff;cursor:default;z-index:2}.time-picker-clock>span.disabled{pointer-events:none}.application .theme--light.toolbar,.theme--light .toolbar{background-color:#f5f5f5;color:rgba(0,0,0,.87)}.application .theme--dark.toolbar,.theme--dark .toolbar{background-color:#212121;color:#fff}.toolbar{transition:none;box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);display:block;position:relative;width:100%;will-change:padding-left}.toolbar[data-booted=true]{transition:.2s cubic-bezier(.4,0,.2,1)}.toolbar .input-group--solo .input-group__details{display:none}.toolbar .input-group--single-line:not(.input-group--solo){padding:0}.toolbar .input-group--single-line:not(.input-group--solo) label{top:auto}.toolbar .tabs{width:100%}.toolbar__title{font-size:20px;font-weight:500;letter-spacing:.02em;margin-left:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.toolbar__content,.toolbar__extension{-webkit-box-align:center;-ms-flex-align:center;align-items:center;display:-webkit-box;display:-ms-flexbox;display:flex}.toolbar__content>.list,.toolbar__extension>.list{-webkit-box-flex:1;-ms-flex:1 1 auto;flex:1 1 auto;margin:0!important;max-height:100%}.toolbar__content>.btn:last-child,.toolbar__content>.menu:last-child,.toolbar__extension>.btn:last-child,.toolbar__extension>.menu:last-child{margin-right:8px}.toolbar__content>.btn:first-child,.toolbar__content>.menu:first-child,.toolbar__extension>.btn:first-child,.toolbar__extension>.menu:first-child{margin-left:8px}.toolbar__content>:not(.btn):not(.menu):first-child:not(:only-child),.toolbar__extension>:not(.btn):not(.menu):first-child:not(:only-child){margin-left:16px}.toolbar__content>:not(.btn):not(.menu):last-child:not(:only-child),.toolbar__extension>:not(.btn):not(.menu):last-child:not(:only-child){margin-right:16px}.toolbar__items{display:-webkit-box;display:-ms-flexbox;display:flex;height:inherit;max-width:100%;padding:0}.toolbar__items .btn{-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch}.toolbar__items .tooltip,.toolbar__items .tooltip>span{height:inherit}.toolbar__items .btn,.toolbar__items .menu,.toolbar__items .menu__activator{height:inherit;margin:0}.toolbar--card{border-radius:2px 2px 0 0;box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)}.toolbar--fixed{position:fixed;z-index:2}.toolbar--absolute,.toolbar--fixed{top:0;left:0}.toolbar--absolute{position:absolute;z-index:2}.toolbar--floating{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;margin:16px;width:auto}.toolbar--clipped{z-index:3}@media only screen and (max-width:599px){.toolbar .toolbar__content>.btn:last-child,.toolbar .toolbar__extension>.btn:last-child{margin-right:17px}.toolbar .toolbar__content>.btn:first-child,.toolbar .toolbar__extension>.btn:first-child{margin-left:17px}.toolbar .toolbar__content>:not(.btn):not(.menu):first-child:not(:only-child),.toolbar .toolbar__extension>:not(.btn):not(.menu):first-child:not(:only-child){margin-left:24px}.toolbar .toolbar__content>:not(.btn):not(.menu):last-child:not(:only-child),.toolbar .toolbar__extension>:not(.btn):not(.menu):last-child:not(:only-child){margin-right:24px}}.tooltip{position:relative}.tooltip__content{background:#616161;border-radius:2px;color:#fff;font-size:12px;display:inline-block;padding:5px 8px;position:absolute;text-transform:none;transition:.15s cubic-bezier(.25,.8,.5,1);width:auto;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.tooltip__content[class*=-active]{pointer-events:none}@media only screen and (max-width:959px){.tooltip .tooltip__content{padding:10px 16px}}", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "\n.slide-enter-active, .slide-leave-active {\ntransition: max-height .35s\n}\n.slide-enter, .slide-leave-to {\nmax-height: 0px;\n}\n.slide-enter-to, .slide-leave {\nmax-height: 20em;\n}\n", "", {"version":3,"sources":["C:/Users/Nedash/source/repos/WebPagesAnalyzer/WebPagesAnalyzer/ClientApp/components/nav-menu.vue?2f5927de"],"names":[],"mappings":";AA4CA;AACA,2BAAA;CACA;AACA;AACA,gBAAA;CACA;AAEA;AACA,iBAAA;CACA","file":"nav-menu.vue","sourcesContent":["<template>\n\n    <v-navigation-drawer permanent=\"\">\n        <v-toolbar flat=\"\">\n            <v-list>\n                <v-list-tile>\n                    <v-list-tile-title class=\"title\">\n                        Menu\n                    </v-list-tile-title>\n                </v-list-tile>\n            </v-list>\n        </v-toolbar>\n        <v-list dense=\"\" class=\"pt-0\">\n            <v-list-tile v-for=\"item in items\"\n                         :key=\"item.title\"\n                        @click=\"\"\n                        :to=\"item.path\">\n                <v-list-tile-action>\n                    <v-icon>{{ item.icon }}</v-icon>\n                </v-list-tile-action>\n                <v-list-tile-content>\n                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>\n                </v-list-tile-content>\n            </v-list-tile>\n        </v-list>\n    </v-navigation-drawer>\n</template>\n\n<script>\n    import { routes } from '../routes'\n    export default {\n    data () {\n    return {\n    items: [\n    { title: 'Add page', icon: 'add_to_queue', path: '/' },\n    { title: 'Report', icon: 'receipt', path: '/fetch-data' }\n    ],\n    right: null\n    }\n    }\n    }\n</script>\n\n<style>\n    .slide-enter-active, .slide-leave-active {\n    transition: max-height .35s\n    }\n    .slide-enter, .slide-leave-to {\n    max-height: 0px;\n    }\n\n    .slide-enter-to, .slide-leave {\n    max-height: 20em;\n    }\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "\n.elevation-1 td {\n    vertical-align: middle !important;\n}\n.elevation-1 th {\n    vertical-align: middle !important;\n}\n\n", "", {"version":3,"sources":["C:/Users/Nedash/source/repos/WebPagesAnalyzer/WebPagesAnalyzer/ClientApp/components/fetch-data.vue?85b24e1e"],"names":[],"mappings":";AA2CA;IACA,kCAAA;CACA;AAEA;IACA,kCAAA;CACA","file":"fetch-data.vue","sourcesContent":["<template>\r\n    <div>\r\n        <h1>Words Frequency Rating</h1>\r\n\r\n        <p v-if=\"!report\"><em>Loading...</em></p>\r\n        <v-data-table :headers=\"headers\"\r\n                      :items=\"report\"\r\n                      hide-actions\n                      disable-initial-sort\r\n                      class=\"elevation-1\">\r\n            <template slot=\"items\" slot-scope=\"word\">\r\n                <td>{{ word.item.text }}</td>\r\n                <td>{{ word.item.count }}</td>\r\n            </template>\r\n        </v-data-table>\r\n\r\n    </div>\r\n</template>\r\n<script>\r\n    import axios from 'axios';\r\n\r\n    export default {\r\n        data() {\r\n            return {\r\n                headers: [\r\n                    { text: 'Text', sortable: true, value: 'text' },\r\n                    { text: 'Frequency', value: 'count', align: 'center', sortable: true },\r\n                ],\r\n                report: [],\r\n            }\r\n        },\r\n        methods: {\r\n        },\r\n        mounted() {\r\n            axios.get('/api/report')\r\n                .then((response) => {\r\n                    this.report = response.data;\r\n                });\r\n        },\r\n    };\r\n</script>\n\n<style>\r\n    .elevation-1 td {\r\n        vertical-align: middle !important;\r\n    }\r\n\r\n    .elevation-1 th {\r\n        vertical-align: middle !important;\r\n    }\n\n</style>\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "\n.section-head {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    z-index: 10;\n    font-size: 1.7em;\n    font-weight: 600;\n    color: white;\n    background: #0D47A1;\n    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);\n}\n.section-head .toolbar {\nbox-shadow: none;\n}\n", "", {"version":3,"sources":["C:/Users/Nedash/source/repos/WebPagesAnalyzer/WebPagesAnalyzer/ClientApp/components/app-root.vue?603c4932"],"names":[],"mappings":";AA2CA;IACA,gBAAA;IACA,OAAA;IACA,QAAA;IACA,YAAA;IACA,YAAA;IACA,iBAAA;IACA,iBAAA;IACA,aAAA;IACA,oBAAA;IACA,qGAAA;CACA;AACA;AACA,iBAAA;CACA","file":"app-root.vue","sourcesContent":["<template>\n    <div id=\"app\" class=\"container-fluid\">\n        \n        <header class=\"section-head\">\n            <div class=\"container\">\n                <v-toolbar color=\"blue darken-4\">                    \n                        <h1>WebPages Analyzer</h1>                        \n                </v-toolbar>\n            </div>\n        </header>\n        <v-app light>\n        <section style=\"padding-top: 90px\">\n            <div class=\"col-sm-2\">\n                <nav-menu params=\"route: route\"></nav-menu>\n            </div>\n            <div class=\"col-sm-9\" style=\"padding-top: 40px;\">\n                <router-view></router-view>\n            </div>\n        </section>\n            </v-app>\n        </div>   \n\n</template>\n\n<script>\nimport Vue from 'vue'\nimport FetchData from './fetch-data'\nimport HomePage from './home-page'\nimport NavMenu from './nav-menu'\n    \nVue.component('fetch-data', FetchData);\nVue.component('home-page', HomePage);\nVue.component('nav-menu', NavMenu);\n\nexport default {\n    data() {\n        return {\n        }\n    }\n}\n</script>\n\n<style>\n    .section-head {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    z-index: 10;\n    font-size: 1.7em;\n    font-weight: 600;\n    color: white;\n    background: #0D47A1;\n    box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);    \n    }\n    .section-head .toolbar {\nbox-shadow: none;\n}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "\n.url-form {\n    margin-bottom: 50px;\n}\n", "", {"version":3,"sources":["C:/Users/Nedash/source/repos/WebPagesAnalyzer/WebPagesAnalyzer/ClientApp/components/home-page.vue?13ea3c6b"],"names":[],"mappings":";AA2EA;IACA,oBAAA;CACA","file":"home-page.vue","sourcesContent":["<template>\r\n    <div>\r\n        <template>\r\n            <v-form v-model=\"valid\" class=\"url-form\" ref=\"form\" lazy-validation=\"\" @submit.prevent=\"submit\">\r\n                <v-progress-linear :indeterminate=\"awaitingRequest\" v-if=\"awaitingRequest\"></v-progress-linear>\r\n                <v-text-field label=\"Url\"\r\n                              v-model=\"url\"\r\n                              :rules=\"urlRules\"\r\n                              :counter=\"1000\"\r\n                              required=\"\"></v-text-field>\r\n                <v-btn @click=\"submit\"\r\n                       :disabled=\"!valid || awaitingRequest\">\r\n                    submit\r\n                </v-btn>\r\n                <v-btn @click=\"clear\">clear</v-btn>\r\n            </v-form>\r\n\r\n\r\n            <v-alert type=\"success\" :value=\"showSuccess\">\r\n                Data saved successfully!\r\n            </v-alert>\r\n\r\n            <v-alert type=\"error\" :value=\"showError\">\r\n                An error occured during your request!\r\n            </v-alert>\r\n        </template>\r\n    </div>\r\n</template>\r\n<script>\r\n    import axios from 'axios';\r\n    axios.defaults.headers.common.Accept = 'application/json';\r\n\r\n    export default {\r\n        data: () => ({\r\n            valid: true,\r\n            awaitingRequest: false,\r\n            showSuccess: false,\r\n            showError: false,\r\n            url: '',\r\n            urlRules: [\r\n                v => !!v || 'Url is required',\r\n                v => v.length <= 1000 || 'Url must be less than 1000 characters',\r\n                v => /(([\\w]+:)?\\/\\/)?(([\\d\\w]|%[a-fA-f\\d]{2,2})+(:([\\d\\w]|%[a-fA-f\\d]{2,2})+)?@)?([\\d\\w][-\\d\\w]{0,253}[\\d\\w]\\.)+[\\w]{2,63}(:[\\d]+)?(\\/([-+_~.\\d\\w]|%[a-fA-f\\d]{2,2})*)*(\\?(&?([-+_~.\\d\\w]|%[a-fA-f\\d]{2,2})=?)*)?(#([-+_~.\\d\\w]|%[a-fA-f\\d]{2,2})*)?/.test(v) || 'URL must be valid'\r\n            ],\r\n        }),\r\n        methods: {\r\n            submit() {\r\n                if (this.$refs.form.validate()) {\r\n                    this.awaitingRequest = true;\r\n                    this.showSuccess = false;\r\n                    this.showError = false;\r\n                    var scope = this;\r\n                    axios.post('/api/user', {\r\n                        requestUrl: this.url\r\n                    })\r\n                        .then((response) => {\r\n                            console.log(response);\r\n                            this.awaitingRequest = false;\r\n                            if (response.data) {\r\n                                this.showSuccess = true;\r\n                            }\r\n                        })\r\n                        .catch(function (reason) {\r\n                            scope.awaitingRequest = false;\r\n                            scope.showError = true;\r\n                        });;\r\n                }\r\n            },\r\n            clear() {\r\n                this.$refs.form.reset()\r\n            }\r\n        }\r\n    }\r\n</script>\r\n<style>\r\n    .url-form {\r\n        margin-bottom: 50px;\r\n    }\r\n</style>\r\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(9);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.routes = undefined;

var _fetchData = __webpack_require__(79);

var _fetchData2 = _interopRequireDefault(_fetchData);

var _homePage = __webpack_require__(80);

var _homePage2 = _interopRequireDefault(_homePage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = exports.routes = [{ path: '/', component: _homePage2.default, display: 'Home', style: 'glyphicon glyphicon-home' }, { path: '/fetch-data', component: _fetchData2.default, display: 'Fetch data', style: 'glyphicon glyphicon-th-list' }];

/***/ }),
/* 52 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(34);
var core = __webpack_require__(32);
var ctx = __webpack_require__(105);
var hide = __webpack_require__(108);
var has = __webpack_require__(54);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 54 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(104);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(102);
var IE8_DOM_DEFINE = __webpack_require__(109);
var toPrimitive = __webpack_require__(121);
var dP = Object.defineProperty;

exports.f = __webpack_require__(25) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(55);
var defined = __webpack_require__(52);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(24);
var toLength = __webpack_require__(4);
var toAbsoluteIndex = __webpack_require__(28);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(11);
var toObject = __webpack_require__(9);
var IObject = __webpack_require__(27);
var toLength = __webpack_require__(4);

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(22);
var createDesc = __webpack_require__(40);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 62 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(21);
var ITERATOR = __webpack_require__(1)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(12);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(7);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(68);
var $export = __webpack_require__(0);
var redefine = __webpack_require__(23);
var hide = __webpack_require__(16);
var Iterators = __webpack_require__(21);
var $iterCreate = __webpack_require__(133);
var setToStringTag = __webpack_require__(41);
var getPrototypeOf = __webpack_require__(138);
var ITERATOR = __webpack_require__(1)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(1)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__(11);

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(139);
var enumBugKeys = __webpack_require__(62);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(2);
var dP = __webpack_require__(22);
var DESCRIPTORS = __webpack_require__(20);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(14);
var invoke = __webpack_require__(132);
var html = __webpack_require__(39);
var cel = __webpack_require__(38);
var global = __webpack_require__(2);
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(12)(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(36);
var ITERATOR = __webpack_require__(1)('iterator');
var Iterators = __webpack_require__(21);
module.exports = __webpack_require__(13).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(19);
var step = __webpack_require__(134);
var Iterators = __webpack_require__(21);
var toIObject = __webpack_require__(24);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(66)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(144)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(66)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 77 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 78 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(185)

var Component = __webpack_require__(30)(
  /* script */
  __webpack_require__(90),
  /* template */
  __webpack_require__(181),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Nedash\\source\\repos\\WebPagesAnalyzer\\WebPagesAnalyzer\\ClientApp\\components\\fetch-data.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] fetch-data.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(5)
  hotAPI.install(__webpack_require__(6), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ec2dd92", Component.options)
  } else {
    hotAPI.reload("data-v-2ec2dd92", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(187)

var Component = __webpack_require__(30)(
  /* script */
  __webpack_require__(91),
  /* template */
  __webpack_require__(183),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Nedash\\source\\repos\\WebPagesAnalyzer\\WebPagesAnalyzer\\ClientApp\\components\\home-page.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] home-page.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(5)
  hotAPI.install(__webpack_require__(6), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fdce56d0", Component.options)
  } else {
    hotAPI.reload("data-v-fdce56d0", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(176);

__webpack_require__(177);

__webpack_require__(98);

__webpack_require__(97);

var _app = __webpack_require__(86);

_app.app.$mount('#app');

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {}
};
if (true) {
  var querystring = __webpack_require__(174);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }

  if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(175);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(190)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles
    });
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && (options.overlayWarnings || type !== 'warnings')) {
        overlay.showProblems(type, obj[type]);
        return false;
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(191);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=__webpack_hmr&dynamicPublicPath=true", __webpack_require__(192)(module)))

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(10);

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.store = exports.router = exports.app = undefined;

var _extends2 = __webpack_require__(96);

var _extends3 = _interopRequireDefault(_extends2);

var _vue = __webpack_require__(6);

var _vue2 = _interopRequireDefault(_vue);

var _axios = __webpack_require__(50);

var _axios2 = _interopRequireDefault(_axios);

var _router = __webpack_require__(87);

var _router2 = _interopRequireDefault(_router);

var _store = __webpack_require__(88);

var _store2 = _interopRequireDefault(_store);

var _vuexRouterSync = __webpack_require__(189);

var _appRoot = __webpack_require__(178);

var _appRoot2 = _interopRequireDefault(_appRoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.prototype.$http = _axios2.default;

(0, _vuexRouterSync.sync)(_store2.default, _router2.default);

var app = new _vue2.default((0, _extends3.default)({
    store: _store2.default,
    router: _router2.default
}, _appRoot2.default));

exports.app = app;
exports.router = _router2.default;
exports.store = _store2.default;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(6);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(193);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _routes = __webpack_require__(51);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueRouter2.default);

var router = new _vueRouter2.default({
    mode: 'history',
    routes: _routes.routes
});

exports.default = router;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = __webpack_require__(95);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _vue = __webpack_require__(6);

var _vue2 = _interopRequireDefault(_vue);

var _vuex = __webpack_require__(195);

var _vuex2 = _interopRequireDefault(_vuex);

var _vuetify = __webpack_require__(194);

var _vuetify2 = _interopRequireDefault(_vuetify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vuex2.default);

_vue2.default.use(_vuetify2.default);

var MAIN_SET_COUNTER = 'MAIN_SET_COUNTER';

var state = {
    counter: 0
};

var mutations = (0, _defineProperty3.default)({}, MAIN_SET_COUNTER, function (state, obj) {
    state.counter = obj.counter;
});

var actions = {
    setCounter: function setCounter(_ref, obj) {
        var commit = _ref.commit;

        commit(MAIN_SET_COUNTER, obj);
    }
};

exports.default = new _vuex2.default.Store({
    state: state,
    mutations: mutations,
    actions: actions
});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = __webpack_require__(6);

var _vue2 = _interopRequireDefault(_vue);

var _fetchData = __webpack_require__(79);

var _fetchData2 = _interopRequireDefault(_fetchData);

var _homePage = __webpack_require__(80);

var _homePage2 = _interopRequireDefault(_homePage);

var _navMenu = __webpack_require__(179);

var _navMenu2 = _interopRequireDefault(_navMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.component('fetch-data', _fetchData2.default);
_vue2.default.component('home-page', _homePage2.default);
_vue2.default.component('nav-menu', _navMenu2.default);

exports.default = {
    data: function data() {
        return {};
    }
};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = __webpack_require__(50);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {
            headers: [{ text: 'Text', sortable: true, value: 'text' }, { text: 'Frequency', value: 'count', align: 'center', sortable: true }],
            report: []
        };
    },

    methods: {},
    mounted: function mounted() {
        var _this = this;

        _axios2.default.get('/api/report').then(function (response) {
            _this.report = response.data;
        });
    }
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = __webpack_require__(50);

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_axios2.default.defaults.headers.common.Accept = 'application/json';

exports.default = {
    data: function data() {
        return {
            valid: true,
            awaitingRequest: false,
            showSuccess: false,
            showError: false,
            url: '',
            urlRules: [function (v) {
                return !!v || 'Url is required';
            }, function (v) {
                return v.length <= 1000 || 'Url must be less than 1000 characters';
            }, function (v) {
                return (/(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/.test(v) || 'URL must be valid'
                );
            }]
        };
    },
    methods: {
        submit: function submit() {
            var _this = this;

            if (this.$refs.form.validate()) {
                this.awaitingRequest = true;
                this.showSuccess = false;
                this.showError = false;
                var scope = this;
                _axios2.default.post('/api/user', {
                    requestUrl: this.url
                }).then(function (response) {
                    console.log(response);
                    _this.awaitingRequest = false;
                    if (response.data) {
                        _this.showSuccess = true;
                    }
                }).catch(function (reason) {
                    scope.awaitingRequest = false;
                    scope.showError = true;
                });;
            }
        },
        clear: function clear() {
            this.$refs.form.reset();
        }
    }
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routes = __webpack_require__(51);

exports.default = {
  data: function data() {
    return {
      items: [{ title: 'Add page', icon: 'add_to_queue', path: '/' }, { title: 'Report', icon: 'receipt', path: '/fetch-data' }],
      right: null
    };
  }
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(99), __esModule: true };

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(100), __esModule: true };

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(94);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(93);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(76);
__webpack_require__(155);
__webpack_require__(153);
__webpack_require__(159);
__webpack_require__(156);
__webpack_require__(162);
__webpack_require__(164);
__webpack_require__(152);
__webpack_require__(158);
__webpack_require__(149);
__webpack_require__(163);
__webpack_require__(147);
__webpack_require__(161);
__webpack_require__(160);
__webpack_require__(154);
__webpack_require__(157);
__webpack_require__(146);
__webpack_require__(148);
__webpack_require__(151);
__webpack_require__(150);
__webpack_require__(165);
__webpack_require__(75);
module.exports = __webpack_require__(13).Array;


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(166);
__webpack_require__(76);
__webpack_require__(168);
__webpack_require__(167);
module.exports = __webpack_require__(13).Promise;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(123);
module.exports = __webpack_require__(32).Object.assign;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(124);
var $Object = __webpack_require__(32).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(35);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(58);
var toLength = __webpack_require__(119);
var toAbsoluteIndex = __webpack_require__(118);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 104 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(101);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(35);
var document = __webpack_require__(34).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 107 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(56);
var createDesc = __webpack_require__(115);
module.exports = __webpack_require__(25) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(25) && !__webpack_require__(33)(function () {
  return Object.defineProperty(__webpack_require__(106)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(113);
var gOPS = __webpack_require__(111);
var pIE = __webpack_require__(114);
var toObject = __webpack_require__(120);
var IObject = __webpack_require__(55);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(33)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 111 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(54);
var toIObject = __webpack_require__(58);
var arrayIndexOf = __webpack_require__(103)(false);
var IE_PROTO = __webpack_require__(116)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(112);
var enumBugKeys = __webpack_require__(107);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 114 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(117)('keys');
var uid = __webpack_require__(122);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(34);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(57);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(57);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(52);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(35);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 122 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(53);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(110) });


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(53);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(25), 'Object', { defineProperty: __webpack_require__(56).f });


/***/ }),
/* 125 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)

var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(28);
var toLength = __webpack_require__(4);

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)

var toObject = __webpack_require__(9);
var toAbsoluteIndex = __webpack_require__(28);
var toLength = __webpack_require__(4);
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(17);
var isArray = __webpack_require__(64);
var SPECIES = __webpack_require__(1)('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(128);

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__(14);
var call = __webpack_require__(65);
var isArrayIter = __webpack_require__(63);
var anObject = __webpack_require__(7);
var toLength = __webpack_require__(4);
var getIterFn = __webpack_require__(74);
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(20) && !__webpack_require__(15)(function () {
  return Object.defineProperty(__webpack_require__(38)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 132 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(136);
var descriptor = __webpack_require__(40);
var setToStringTag = __webpack_require__(41);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(16)(IteratorPrototype, __webpack_require__(1)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(2);
var macrotask = __webpack_require__(73).set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__(12)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(7);
var dPs = __webpack_require__(137);
var enumBugKeys = __webpack_require__(62);
var IE_PROTO = __webpack_require__(42)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(38)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(39).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(22);
var anObject = __webpack_require__(7);
var getKeys = __webpack_require__(70);

module.exports = __webpack_require__(20) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(26);
var toObject = __webpack_require__(9);
var IE_PROTO = __webpack_require__(42)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(26);
var toIObject = __webpack_require__(24);
var arrayIndexOf = __webpack_require__(59)(false);
var IE_PROTO = __webpack_require__(42)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 140 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(7);
var isObject = __webpack_require__(17);
var newPromiseCapability = __webpack_require__(69);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(23);
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(7);
var aFunction = __webpack_require__(11);
var SPECIES = __webpack_require__(1)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(29);
var defined = __webpack_require__(37);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(17);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { copyWithin: __webpack_require__(126) });

__webpack_require__(19)('copyWithin');


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $every = __webpack_require__(8)(4);

$export($export.P + $export.F * !__webpack_require__(3)([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = __webpack_require__(0);

$export($export.P, 'Array', { fill: __webpack_require__(127) });

__webpack_require__(19)('fill');


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $filter = __webpack_require__(8)(2);

$export($export.P + $export.F * !__webpack_require__(3)([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(8)(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(19)(KEY);


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(0);
var $find = __webpack_require__(8)(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(19)(KEY);


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $forEach = __webpack_require__(8)(0);
var STRICT = __webpack_require__(3)([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(14);
var $export = __webpack_require__(0);
var toObject = __webpack_require__(9);
var call = __webpack_require__(65);
var isArrayIter = __webpack_require__(63);
var toLength = __webpack_require__(4);
var createProperty = __webpack_require__(61);
var getIterFn = __webpack_require__(74);

$export($export.S + $export.F * !__webpack_require__(67)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $indexOf = __webpack_require__(59)(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(3)($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = __webpack_require__(0);

$export($export.S, 'Array', { isArray: __webpack_require__(64) });


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.13 Array.prototype.join(separator)
var $export = __webpack_require__(0);
var toIObject = __webpack_require__(24);
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (__webpack_require__(27) != Object || !__webpack_require__(3)(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var toIObject = __webpack_require__(24);
var toInteger = __webpack_require__(29);
var toLength = __webpack_require__(4);
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !__webpack_require__(3)($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $map = __webpack_require__(8)(1);

$export($export.P + $export.F * !__webpack_require__(3)([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var createProperty = __webpack_require__(61);

// WebKit Array.of isn't generic
$export($export.S + $export.F * __webpack_require__(15)(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(60);

$export($export.P + $export.F * !__webpack_require__(3)([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $reduce = __webpack_require__(60);

$export($export.P + $export.F * !__webpack_require__(3)([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var html = __webpack_require__(39);
var cof = __webpack_require__(12);
var toAbsoluteIndex = __webpack_require__(28);
var toLength = __webpack_require__(4);
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(15)(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var $some = __webpack_require__(8)(3);

$export($export.P + $export.F * !__webpack_require__(3)([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(0);
var aFunction = __webpack_require__(11);
var toObject = __webpack_require__(9);
var fails = __webpack_require__(15);
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(3)($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(71)('Array');


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(36);
var test = {};
test[__webpack_require__(1)('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(23)(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(68);
var global = __webpack_require__(2);
var ctx = __webpack_require__(14);
var classof = __webpack_require__(36);
var $export = __webpack_require__(0);
var isObject = __webpack_require__(17);
var aFunction = __webpack_require__(11);
var anInstance = __webpack_require__(125);
var forOf = __webpack_require__(130);
var speciesConstructor = __webpack_require__(143);
var task = __webpack_require__(73).set;
var microtask = __webpack_require__(135)();
var newPromiseCapabilityModule = __webpack_require__(69);
var perform = __webpack_require__(140);
var promiseResolve = __webpack_require__(141);
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__(1)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__(142)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(41)($Promise, PROMISE);
__webpack_require__(71)(PROMISE);
Wrapper = __webpack_require__(13)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(67)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__(75);
var getKeys = __webpack_require__(70);
var redefine = __webpack_require__(23);
var global = __webpack_require__(2);
var hide = __webpack_require__(16);
var Iterators = __webpack_require__(21);
var wks = __webpack_require__(1);
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(171),
  Html4Entities: __webpack_require__(170),
  Html5Entities: __webpack_require__(77),
  AllHtmlEntities: __webpack_require__(77)
};


/***/ }),
/* 170 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 171 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(172);
exports.encode = exports.stringify = __webpack_require__(173);


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(85)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(78)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(44, function() {
			var newContent = __webpack_require__(44);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(78)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(45, function() {
			var newContent = __webpack_require__(45);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(186)

var Component = __webpack_require__(30)(
  /* script */
  __webpack_require__(89),
  /* template */
  __webpack_require__(182),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Nedash\\source\\repos\\WebPagesAnalyzer\\WebPagesAnalyzer\\ClientApp\\components\\app-root.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] app-root.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(5)
  hotAPI.install(__webpack_require__(6), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5524f2fa", Component.options)
  } else {
    hotAPI.reload("data-v-5524f2fa", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(184)

var Component = __webpack_require__(30)(
  /* script */
  __webpack_require__(92),
  /* template */
  __webpack_require__(180),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "C:\\Users\\Nedash\\source\\repos\\WebPagesAnalyzer\\WebPagesAnalyzer\\ClientApp\\components\\nav-menu.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] nav-menu.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (true) {(function () {
  var hotAPI = __webpack_require__(5)
  hotAPI.install(__webpack_require__(6), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1fba27be", Component.options)
  } else {
    hotAPI.reload("data-v-1fba27be", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('v-navigation-drawer', {
    attrs: {
      "permanent": ""
    }
  }, [_c('v-toolbar', {
    attrs: {
      "flat": ""
    }
  }, [_c('v-list', [_c('v-list-tile', [_c('v-list-tile-title', {
    staticClass: "title"
  }, [_vm._v("\n                    Menu\n                ")])], 1)], 1)], 1), _vm._v(" "), _c('v-list', {
    staticClass: "pt-0",
    attrs: {
      "dense": ""
    }
  }, _vm._l((_vm.items), function(item) {
    return _c('v-list-tile', {
      key: item.title,
      attrs: {
        "to": item.path
      },
      on: {
        "click": function($event) {}
      }
    }, [_c('v-list-tile-action', [_c('v-icon', [_vm._v(_vm._s(item.icon))])], 1), _vm._v(" "), _c('v-list-tile-content', [_c('v-list-tile-title', [_vm._v(_vm._s(item.title))])], 1)], 1)
  }))], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(5).rerender("data-v-1fba27be", module.exports)
  }
}

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('h1', [_vm._v("Words Frequency Rating")]), _vm._v(" "), (!_vm.report) ? _c('p', [_c('em', [_vm._v("Loading...")])]) : _vm._e(), _vm._v(" "), _c('v-data-table', {
    staticClass: "elevation-1",
    attrs: {
      "headers": _vm.headers,
      "items": _vm.report,
      "hide-actions": "",
      "disable-initial-sort": ""
    },
    scopedSlots: _vm._u([{
      key: "items",
      fn: function(word) {
        return [_c('td', [_vm._v(_vm._s(word.item.text))]), _vm._v(" "), _c('td', [_vm._v(_vm._s(word.item.count))])]
      }
    }])
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(5).rerender("data-v-2ec2dd92", module.exports)
  }
}

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "container-fluid",
    attrs: {
      "id": "app"
    }
  }, [_c('header', {
    staticClass: "section-head"
  }, [_c('div', {
    staticClass: "container"
  }, [_c('v-toolbar', {
    attrs: {
      "color": "blue darken-4"
    }
  }, [_c('h1', [_vm._v("WebPages Analyzer")])])], 1)]), _vm._v(" "), _c('v-app', {
    attrs: {
      "light": ""
    }
  }, [_c('section', {
    staticStyle: {
      "padding-top": "90px"
    }
  }, [_c('div', {
    staticClass: "col-sm-2"
  }, [_c('nav-menu', {
    attrs: {
      "params": "route: route"
    }
  })], 1), _vm._v(" "), _c('div', {
    staticClass: "col-sm-9",
    staticStyle: {
      "padding-top": "40px"
    }
  }, [_c('router-view')], 1)])])], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(5).rerender("data-v-5524f2fa", module.exports)
  }
}

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [
    [_c('v-form', {
      ref: "form",
      staticClass: "url-form",
      attrs: {
        "lazy-validation": ""
      },
      on: {
        "submit": function($event) {
          $event.preventDefault();
          return _vm.submit($event)
        }
      },
      model: {
        value: (_vm.valid),
        callback: function($$v) {
          _vm.valid = $$v
        },
        expression: "valid"
      }
    }, [(_vm.awaitingRequest) ? _c('v-progress-linear', {
      attrs: {
        "indeterminate": _vm.awaitingRequest
      }
    }) : _vm._e(), _vm._v(" "), _c('v-text-field', {
      attrs: {
        "label": "Url",
        "rules": _vm.urlRules,
        "counter": 1000,
        "required": ""
      },
      model: {
        value: (_vm.url),
        callback: function($$v) {
          _vm.url = $$v
        },
        expression: "url"
      }
    }), _vm._v(" "), _c('v-btn', {
      attrs: {
        "disabled": !_vm.valid || _vm.awaitingRequest
      },
      on: {
        "click": _vm.submit
      }
    }, [_vm._v("\n                submit\n            ")]), _vm._v(" "), _c('v-btn', {
      on: {
        "click": _vm.clear
      }
    }, [_vm._v("clear")])], 1), _vm._v(" "), _c('v-alert', {
      attrs: {
        "type": "success",
        "value": _vm.showSuccess
      }
    }, [_vm._v("\n            Data saved successfully!\n        ")]), _vm._v(" "), _c('v-alert', {
      attrs: {
        "type": "error",
        "value": _vm.showError
      }
    }, [_vm._v("\n            An error occured during your request!\n        ")])]
  ], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (true) {
  module.hot.accept()
  if (module.hot.data) {
     __webpack_require__(5).rerender("data-v-fdce56d0", module.exports)
  }
}

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(31)("ae09530c", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(46, function() {
     var newContent = __webpack_require__(46);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(31)("621bd805", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(47, function() {
     var newContent = __webpack_require__(47);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(48);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(31)("1f59aca2", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(48, function() {
     var newContent = __webpack_require__(48);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(31)("d41e00ba", content, false);
// Hot Module Replacement
if(true) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept(49, function() {
     var newContent = __webpack_require__(49);
     if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 188 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 189 */
/***/ (function(module, exports) {

exports.sync = function (store, router, options) {
  var moduleName = (options || {}).moduleName || 'route'

  store.registerModule(moduleName, {
    namespaced: true,
    state: cloneRoute(router.currentRoute),
    mutations: {
      'ROUTE_CHANGED': function ROUTE_CHANGED (state, transition) {
        store.state[moduleName] = cloneRoute(transition.to, transition.from)
      }
    }
  })

  var isTimeTraveling = false
  var currentPath

  // sync router on store change
  var storeUnwatch = store.watch(
    function (state) { return state[moduleName]; },
    function (route) {
      var fullPath = route.fullPath;
      if (fullPath === currentPath) {
        return
      }
      if (currentPath != null) {
        isTimeTraveling = true
        router.push(route)
      }
      currentPath = fullPath
    },
    { sync: true }
  )

  // sync store on router navigation
  var afterEachUnHook = router.afterEach(function (to, from) {
    if (isTimeTraveling) {
      isTimeTraveling = false
      return
    }
    currentPath = to.fullPath
    store.commit(moduleName + '/ROUTE_CHANGED', { to: to, from: from })
  })

  return function unsync () {
    // On unsync, remove router hook
    if (afterEachUnHook != null) {
      afterEachUnHook()
    }

    // On unsync, remove store watch
    if (storeUnwatch != null) {
      storeUnwatch()
    }

    // On unsync, unregister Module with store
    store.unregisterModule(moduleName)
  }
}

function cloneRoute (to, from) {
  var clone = {
    name: to.name,
    path: to.path,
    hash: to.hash,
    query: to.query,
    params: to.params,
    fullPath: to.fullPath,
    meta: to.meta
  }
  if (from) {
    clone.from = cloneRoute(from)
  }
  return Object.freeze(clone)
}



/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};

var ansiHTML = __webpack_require__(84);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};

var Entities = __webpack_require__(169).AllHtmlEntities;
var entities = new Entities();

function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType (type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.overlayColors) {
    if (color in colors) {
      colors[color] = options.overlayColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear
  }
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 192 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(12);

/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(14);

/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(15);

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(2);

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(10))(34);

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(83);
__webpack_require__(82);
module.exports = __webpack_require__(81);


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map