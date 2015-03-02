/*------------------------------------------------------------------------*/
// jsSubmitFunc - namespace for ajax request
var jsSubmitFunc = jsSubmitFunc || {};
var checkAuthenticationAction = "/Authenticate/isAuthenticated";
var checkAuthenticationMethod = "GET";

jsSubmitFunc.$ = function (id) {
    return document.getElementById(id);
}

jsSubmitFunc.getXmlHttp = function () {
    var xmlDoc = null;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlDoc = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlDoc = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlDoc;
};


jsSubmitFunc.submitForm = function (form, onLoad) {
    var xmlHttp = jsSubmitFunc.getXmlHttp();
    xmlHttp.onload = onLoad;
    xmlHttp.open(form.method, form.action, true);
    xmlHttp.send(new FormData(form));
};

jsSubmitFunc.submit = function (action, method, onLoad_response) {
    var xmlHttp = jsSubmitFunc.getXmlHttp();
    xmlHttp.onload = function () {
        onLoad_response(xmlHttp.response);
    }
    xmlHttp.open(method, action, true);
    xmlHttp.send();
};

jsSubmitFunc.CustomAuth_Login = function (form, onLoad) {
    jsSubmitFunc.submitForm(form, onLoad);
};

jsSubmitFunc.CustomAuth_Logout = function (form, onLoad) {
    jsSubmitFunc.submitForm(form, onLoad);
};

jsSubmitFunc.CustomCheckAuthentication = function (onLoad_isAuthenticated) {
    jsSubmitFunc.submit(checkAuthenticationAction, checkAuthenticationMethod, function (response) {
        onLoad_isAuthenticated(response == "true");
    });
};
// end jsSubmitFunc
/*------------------------------------------------------------------------*/


/*------------------------------------------------------------------------*/
var main_pageJS = main_pageJS || {};
main_pageJS.SetContent = function (isAuthenticated) {
    if (isAuthenticated) {
        jsSubmitFunc.$("action-right-log").style.display = 'none';
        jsSubmitFunc.$("action-right").style.display = 'block';
        jsSubmitFunc.$("action-left").style.display = 'block';
    }
    else {
        jsSubmitFunc.$("action-right-log").style.display = 'block';
        jsSubmitFunc.$("action-right").style.display = 'none';
        jsSubmitFunc.$("action-left").style.display = 'none';
    }
};
main_pageJS.loginAction = function () {
    jsSubmitFunc.CustomAuth_Login(jsSubmitFunc.$("login_form"), main_pageJS.checkAuthentication);
    return false;
};
main_pageJS.logoutAction = function () {
    jsSubmitFunc.CustomAuth_Logout(document.getElementById("action-right"), main_pageJS.checkAuthentication);
    return false;
};
main_pageJS.checkAuthentication = function () {
    jsSubmitFunc.CustomCheckAuthentication(main_pageJS.SetContent);
};

//http://javascript.ru/ui/tree+++
main_pageJS.jsonTree = (function () {
    function onLoadTree(response) {
        var parse = JSON.parse(response);
        var jsonTreeHtml = main_pageJS.jsonTreeObj.build(parse);
        var div = document.createElement('div');
        div.innerHTML = jsonTreeHtml;
        replace("jsonTree", div);
    };

    function onLoadText(response) {
        var parse = JSON.parse(response);
        document.getElementById("jsonText").innerHTML = JSON.stringify(parse, undefined, 2);
    };

    function replace(id, node) {
        try {
            var result = jsSubmitFunc.$(id);
            clear(result);
            result.appendChild(node);
            result.hidden = false;
        } catch (e) {
            alert(e);
        }

    };
    function clear(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };

    return {
        loadJSONtree: function() {
            jsSubmitFunc.submit("loadData", "GET", onLoadTree);
        },

        loadJSONtext: function() {
            jsSubmitFunc.submit("loadData", "GET", onLoadText);
        }
    }
})();

main_pageJS.jsonTreeObj = (function () {
    function parse(json, prop) {
        var result = "";
        var value = json[prop];
        switch (typeof (value)) {
            case "object":
                result +=
                    "<li class='Node IsRoot ExpandClosed'>\
                    <div class='Expand'></div>\
                    <div class='Content'>" + prop + "</div>\
                    <ul class='Container'>"
                    + parseJson(json[prop]) +
                    "</ul>\
                </li>";
                break;
            default:
                result +=
                    "<li class='Node ExpandLeaf IsLast'>\
                    <div class='Expand></div>\
                    <div class='Content'>" + "'" + prop + "' " + ": " + "'" + value + "'" + "</div>\
                </li>";
        }
        return result;
    };
    function parseJson(json) {
        var result = "";
        for (prop in json) {
            result += parse(json, prop);
        }
        return result;
    };

    function hasClass(elem, className) {
        return new RegExp("(^|\\s)" + className + "(\\s|$)").test(elem.className)
    };

    return {
        onToggle: function (event) {
            event = event || window.event;
            var clickedElem = event.target || event.srcElement;
            if (!hasClass(clickedElem, 'Expand')) {
                return;
            }
            var node = clickedElem.parentNode;
            if (hasClass(node, 'ExpandLeaf')) {
                return;
            }
            var newClass = hasClass(node, 'ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen';
            var re = /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/;
            node.className = node.className.replace(re, '$1' + newClass + '$3');
        },
        build: function (json) {
            var result =
                "<div onclick='main_pageJS.jsonTreeObj.onToggle(arguments[0])' style='height:250px; overflow-y: scroll; overflow-x:hidden;'>\
                        <ul class='Container'>";
            result += parseJson(json);
            result += "</ul>\
                </div> </div> </div>";
            return result;
        }
    }
})();

main_pageJS.startLogOut = function () {
    jsSubmitFunc.$("login_out").submit();
}

main_pageJS.startLoadData = function () {
    main_pageJS.jsonTree.loadJSONtree();
    main_pageJS.jsonTree.loadJSONtext();
}