"use strict";

let request = require("request"),
    API_VERSION = 'v35.0';

let getUserId = (oauth) => (typeof(oauth) !== 'undefined') ? oauth.id.split('/').pop() : undefined;

/*
 * Core function to make REST calls to Salesforce
 */
let sfrequest = (oauth, path, options) => new Promise((resolve, reject) => {

    if (!oauth || (!oauth.access_token && !oauth.refresh_token)) {
        reject({code: 401});
        return;
    }

    options = options || {};

    options.method = options.method || 'GET';

    // dev friendly API: Add leading '/' if missing so url + path concat always works
    if (path.charAt(0) !== '/') {
        path = '/' + options.path;
    }

    options.url = oauth.instance_url + path;

    options.headers = options.headers || {};

    options.headers["Accept"]= "application/json";
    options.headers["Authorization"] = "Bearer " + oauth.access_token;

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            if (response.statusCode === 401) {
                // Could implement refresh token and retry logic here
                reject({code: 401});
            } else {
                reject(error);
            }
        } else {
            resolve(body);
        }
    });

});


/**
 * Convenience function to create a new record
 * @param objectName
 * @param data
 */
let create = (oauth, objectName, data) => sfrequest(oauth, '/services/data/' + API_VERSION + '/sobjects/' + objectName + '/',
    {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        json: true,
        body: data
    }
);

/**
 * Convenience function to invoke APEX REST endpoints
 */
let apexrest = (oauth, path, params) => {

    if (path.charAt(0) !== "/") {
        path = "/" + path;
    }

    if (path.substr(0, 18) !== "/services/apexrest") {
        path = "/services/apexrest" + path;
    }

    return sfrequest(oauth, path, params);
};

/**
 * Convenience function to retrieve user information
 */
let whoami = oauth => sfrequest(oauth, "/services/oauth2/userinfo");

exports.request = sfrequest;
exports.create = create;
exports.apexrest = apexrest;
