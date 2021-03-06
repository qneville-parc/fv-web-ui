/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import _ from 'underscore';
import StringHelpers from 'common/StringHelpers';

import request from 'request';

import Nuxeo from 'nuxeo';

import BaseOperations from 'operations/BaseOperations';
import IntlService from "views/services/intl";

const TIMEOUT = 60000;

export default class DirectoryOperations extends BaseOperations {

    /**
     * Gets one or more documents based on a path or id.
     * Allows for additional complex queries to be executed.
     */
    static getDocumentsViaAPI(path = "", headers) {

        let requestBody;

        return new Promise(
            function (resolve, reject) {

                let options = {
                    url: path,
                    headers: headers
                };
                
                request(options, function (error, response, body) {
 
                    if (error || response.statusCode != 200) {
                        if (error.hasOwnProperty('response')) {
                            error.response.json().then(
                                (jsonError) => {
                                    reject(StringHelpers.extractErrorMessage(jsonError));
                                }
                            );
                        } else {
                            let errorMessage = "Attempting to retrieve " + path;
                            
                            if (error) {
                                errorMessage += " has resulted in ";
                            } else {
                                errorMessage += " - ";
                            }

                            return reject(errorMessage + (error || IntlService.instance.translate({
                                key: 'operations.could_not_access_server',
                                default: 'Could not access server',
                                case: 'first'
                            })));
                        }
                    } else {
                        resolve(JSON.parse(body));
                    }

                    reject('An unknown error has occured.');
                });

                setTimeout(function () {
                    reject('Server timeout while attempting to get documents.');
                }, TIMEOUT);
            });
    }

    /**
     * Gets one or more documents based on a path or id.
     * Allows for additional complex queries to be executed.
     */
    static getDocuments(path = "", type = "Document", queryAppend = " ORDER BY dc:title", headers = null, params = null) {

        let defaultParams = {};
        let defaultHeaders = {};

        params = Object.assign(defaultParams, params);
        headers = Object.assign(defaultHeaders, headers);

        let properties = this.properties;

        // Replace Percent Sign
        queryAppend = queryAppend.replace(/%/g, "%25");

        let requestBody;

        // Switch between direct REST access and controlled mode
        if (path.indexOf('/api') === 0) {
            // NOTE: Do not escape single quotes in this mode
            requestBody = path.replace('/api/v1', '');
        } else {

            let where = 'ecm:path STARTSWITH \'' + StringHelpers.clean(path) + '\'';

            if (StringHelpers.isUUID(path)) {
                where = 'ecm:parentId = \'' + path + '\'';
            }

            requestBody = '/query?query=SELECT * FROM ' + type + ' WHERE ' + where + ' AND ecm:currentLifeCycleState <> \'deleted\'' + queryAppend;
        }

        return new Promise(
            function (resolve, reject) {
                properties.client.request(
                    requestBody,
                    params
                )
                    .get(headers)
                    .then((docs) => {
                        resolve(docs);
                    }).catch((error) => {

                    if (error.hasOwnProperty('response')) {
                        error.response.json().then(
                            (jsonError) => {
                                reject(StringHelpers.extractErrorMessage(jsonError));
                            }
                        );
                    } else {
                        return reject(error || IntlService.instance.translate({
                            key: 'operations.could_not_access_server',
                            default: 'Could not access server',
                            case: 'first'
                        }));
                    }
                });

                setTimeout(function () {
                    reject('Server timeout while attempting to get documents.');
                }, TIMEOUT);
            });
    }

    static getDocumentsViaPageProvider(page_provider = "", type = "Document", queryAppend = "", headers = null, params = null) {

        let defaultParams = {};
        let defaultHeaders = {};

        params = Object.assign(defaultParams, params);
        headers = Object.assign(defaultHeaders, headers);

        let properties = this.properties;

        return new Promise(
            function (resolve, reject) {
                properties.client.request(
                    '/query/' + page_provider + '?' + queryAppend,
                    params
                )
                    .get({headers: headers})
                    .then((docs) => {
                        resolve(docs);
                    }).catch((error) => {
                    reject(IntlService.instance.translate({
                        key: 'operations.could_not_access_server',
                        default: 'Could not access server',
                        case: 'first'
                    }));
                });
            });
    }


    static getDirectory(name = "", headers = {}, params = {}) {

        let properties = this.properties;

        return new Promise(
            function (resolve, reject) {
                properties.client
                    .directory(name)
                    .fetchAll()
                    .then((directory) => {
                        resolve(directory);
                    }).catch((error) => {
                    reject(IntlService.instance.translate({
                        key: 'operations.could_not_retrieve_directory',
                        default: 'Could not retrieve directory',
                        case: 'first'
                    }));
                });
            });
    }

    /**
     * Get all documents of a certain type based on a path
     * These documents are expected to contain other entries
     * E.g. FVFamily, FVLanguage, FVDialect
     */
    getDocumentsByPath(path = "", headers = null, params = null) {
        // Expose fields to promise
        let client = this.client;
        let selectDefault = this.selectDefault;
        let domain = this.properties.domain;

        path = StringHelpers.clean(path);

        // Initialize and empty document list from type
        let documentList = new this.directoryTypePlural(null);

        return new Promise(
            // The resolver function is called with the ability to resolve or
            // reject the promise
            function (resolve, reject) {

                let defaultParams = {
                    query:
                    "SELECT * FROM " + documentList.model.prototype.entityTypeName + " WHERE (ecm:path STARTSWITH '/" + domain + path + "' AND " + selectDefault + ") ORDER BY dc:title"
                };

                let defaultHeaders = {};

                params = Object.assign(defaultParams, params);
                headers = Object.assign(defaultHeaders, headers);

                client.operation('Document.Query')
                    .params(params)
                    .execute(headers).then((response) => {

                    if (response.entries && response.entries.length > 0) {

                        documentList.add(response.entries);
                        documentList.totalResultSize = response.totalSize;

                        resolve(documentList);
                    } else {
                        reject(IntlService.instance.translate({
                            key: 'operations.no_found',
                            default: 'No ' + documentList.model.prototype.entityTypeName + ' found',
                            params: [documentList.model.prototype.entityTypeName],
                            case: 'first',
                            append: '!'
                        }));
                    }
                }).catch((error) => {
                    throw error
                });
            });
    }

    // Unused methods below (needs refactoring or removing soon)
    getSubjects(client) {
        return new Promise(
            function (resolve, reject) {

                client.request('directory/subtopic')
                    .get(function (error, data) {
                        if (error) {
                            // something went wrong
                            throw error;
                        }

                        if (data.entries.length > 0) {
                            //entry.properties.label
                            var subtopics = _.object(_.map(data.entries, function (entry) {
                                return [entry.properties.id, entry.properties.id];
                            }));
                            resolve(subtopics);
                        } else {
                            reject(IntlService.instance.translate({
                                key: 'operations.workspace_not_found',
                                default: 'Workspace not found',
                                case: 'first'
                            }));
                        }

                    });
            });
    }

    getPartsOfSpeech(client) {
        return new Promise(
            function (resolve, reject) {

                client.request('directory/parts_speech')
                    .get(function (error, data) {
                        if (error) {
                            // something went wrong
                            throw error;
                        }

                        if (data.entries.length > 0) {
                            //entry.properties.label
                            var parts_speech = _.object(_.map(data.entries, function (entry) {
                                return [entry.properties.id, entry.properties.id];
                            }));
                            resolve(parts_speech);
                        } else {
                            reject(IntlService.instance.translate({
                                key: 'operations.workspace_not_found',
                                default: 'Workspace not found',
                                case: 'first'
                            }));
                        }

                    });

            });
    }

    /*getWordsByLangauge (client, language) {
      return new Promise(
          // The resolver function is called with the ability to resolve or
          // reject the promise
          function(resolve, reject) {

            language = StringHelpers.clean(StringHelpers);

            client.operation('Document.Query')
              .params({
                query: "SELECT * FROM Document WHERE (dc:title = '" + language + "' AND ecm:primaryType = 'Workspace' AND ecm:currentLifeCycleState <> 'deleted'))"
              })
            .execute(function(error, response) {
              if (error) {
                throw error;
              }
              // Create a Workspace Document based on returned data

              if (response.entries.length > 0) {
                var workspaceID = response.entries[0].uid;

                client.operation('Document.Query')
                  .params({
                    query: "SELECT * FROM Document WHERE (ecm:parentId = '" + workspaceID + "' AND ecm:primaryType = 'Word' AND ecm:currentLifeCycleState <> 'deleted')"
                  })
                .execute(function(error, response) {

                      // Handle error
                  if (error) {
                    throw error;
                  }

                  var nuxeoListDocs = new Words(response.entries);
                  resolve(nuxeoListDocs.toJSON());

                });
              } else {
                reject('Workspace not found');
              }

            });
      });
    }*/
}