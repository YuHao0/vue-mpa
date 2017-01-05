define(function (require) {

    var Spinner = require('spinner');

    var spinner = new Spinner();
    return function (url, params, callback, errorCallback) {
        var xmlhttp = null;
        params = params ? params : {};

        var filterEmoji = function (text) {
            var ranges = [
                '\ud83c[\udf00-\udfff]',
                '\ud83d[\udc00-\ude4f]',
                '\ud83d[\ude80-\udeff]',
                '[\u0000-\u0007]','\u000b','[\u000e-\u001f]'
            ],reg = new RegExp(ranges.join('|'), 'g');
            return {
                text:text.replace(reg, ''),
                hasEmoji:reg.test(text)
            };
        };

        if (url.indexOf('templatepush') > -1 || url.indexOf('msgpush') > -1) {
            var postdata = url.indexOf('msgpush') > -1 ? params.postdata : params.data;
            typeof postdata == 'string' && (postdata = filterEmoji(postdata).text);
            params[url.indexOf('msgpush') > -1 ? 'postdata' : 'data'] = postdata;
        }

        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (xmlhttp != null) {
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    spinner.stop();
                    if (xmlhttp.status == 200) {
                        if (typeof(callback) != 'undefined') {
                            callback(JSON.parse(xmlhttp.responseText));
                        }
                    } else {
                        if (typeof(errorCallback) != 'undefined') {
                            errorCallback(xmlhttp.responseText);
                        }
                    }
                }
            };
            params.automask != 'false' && spinner.start();
            var method = params.method || 'GET',paramsArr = [];
            delete params.method;
            delete params.automask;
            if(method == 'GET'){
                for(var key in params){
                    if(params.hasOwnProperty(key))
                        paramsArr.push(key + '=' +params[key]);
                }
                if(paramsArr.length) url = url + '?' + paramsArr.join('&');
            }
            xmlhttp.open(method, url, true);
            xmlhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
            xmlhttp.send(JSON.stringify(params));
        } else {
            console.log("Your browser does not support XMLHTTP.");
        }
    }
});