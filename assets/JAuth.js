/**
 * Simple User Manager
 *
 * A backend to manage users. This is more like a frame work. The UI aspect is
 * handled by javascript.
 *
 * @package		SimpleUserManager
 * @version		0.1
 * @author		Juan "JayCreations" Hernandez
 * @license		MIT
 * @copyright		2010 Juan J. Hernandez
 * @link		https://github.com/JayCreations/SimpleUserManager
 */

function JAuth(oOptions)
{
	this.opt = typeof oOptions == 'undefined' ? {} : oOptions;
	this.iCurrentUserId = -1;
	this.oStudents = [];/*[
		{
			username: 'jhernandez',
			password: 'Pass1234',
			first_name: 'Juan',
			last_name: 'Hernandez',
			course: 'CST 2309',
			role: 'admin'
		},
		{
			username: 'jayh',
			password: 'Test1111',
			first_name: 'Jay',
			last_name: 'Hernandez',
			course: 'CST 2309',
			role: 'mod'
		},
		{
			username: 'test',
			password: '1234',
			first_name: 'Juan',
			last_name: 'Test',
			course: 'CST 2309',
			role: 'user'
		}
	];*/

	this.oRoles = {
		admin: 'Administrator',
		mod: 'Moderator',
		user: 'Regular User'
	};

	this.oUser = {};
}

/**
 * User management.
 */
JAuth.prototype.setUser = function(oUserInfo)
{
	this.oUser = oUserInfo;
}

JAuth.prototype.setUsers = function(oUsersInfo)
{
	this.oStudents = oUsersInfo;
}

JAuth.prototype.getUser = function(sUsername)
{
	var user = -1;

	// Get the logged in user.
	user = this.ajaxSend(this.opt.sManagerAction + 'getuser', {username: sUsername}, function(userResponse)
	{
		var oUserInfo = eval('(' + userResponse + ')');

		if (oUserInfo != false)
		{
			// Set the user info.
			this.setUser(oUserInfo);
			this.iCurrentUserId = oUserInfo
		}

		// Set the user.
		user = oUserInfo;
	});
//console.log(user);
	/*for (var i = 0; i < this.oStudents.length; i++)
	{
		if (this.oStudents[i].username.toLowerCase() == sUsername.toLowerCase())
		{
			// Assign the user.
			user = this.oStudents[i];

			// Track the current user id just incase.
			this.iCurrentUserId = i;

			break;
		}
	}

	return user;*/
}

JAuth.prototype.getUserIdByUsername = function(sUsername)
{
	for (var i = 0; i < this.oStudents.length; i++)
		if (this.oStudents[i].username.toLowerCase() == sUsername.toLowerCase())
			return i;

	return false;
}

JAuth.prototype.getUserById = function(iId)
{
	return this.oStudents[iId];
}

JAuth.prototype.getUsers = function()
{
	return this.oStudents;
}

JAuth.prototype.getRoles = function()
{
	return this.oRoles;
}

JAuth.prototype.validateUser = function(oParams)
{
	// We need the username and password first.
	if (oParams.username == '' || oParams.password == '')
		return false;

	// Lets log in.
	var loggedIn = false;
	var login;
	this.ajaxSend(this.opt.sManagerAction + 'login', this.serialize(oParams), function(loginResponse)
	{
		login = loginResponse;
	});

	// Get/Find the user with that username.
	this.sleep(100, function()
	{
		loggedIn = login;
		console.log(loggedIn ? 'true' : 'false');
	});

	return loggedIn;
}

JAuth.prototype.checkPassword = function(sPassword)
{
	// Lets check the length.
	if (sPassword.length < 8 || sPassword.length > 20)
		return false;

	// Is it alpha numeric?
	if (!sPassword.match(/[0-9]/) || !sPassword.match(/[a-z]/) || !sPassword.match(/[A-Z]/))
		return false;

	return true;
}

JAuth.prototype.addUser = function(oParams)
{
	return this.oStudents.push(oParams);
}

JAuth.prototype.deleteUser = function(iId)
{
	return this.oStudents.splice(iId, 1);
}

JAuth.prototype.updateUser = function(iId, oParams)
{
	if (typeof this.oStudents[iId] != 'undefined')
	{
		this.oStudents[iId].password = oParams.password;
		this.oStudents[iId].first_name = oParams.first_name;
		this.oStudents[iId].last_name = oParams.last_name;
		this.oStudents[iId].course = oParams.course;
		this.oStudents[iId].group = oParams.group;

		return true;
	}
	else
		return false;
}

JAuth.prototype.logOut = function()
{
	this.iCurrentUserId = -1;
	this.ajaxGet(this.opt.sManagerAction + 'logout', function() { });
}

/**
 * Tools.
 */

JAuth.prototype.clearForm = function(aFields)
{
	for (var i = 0; i < aFields.length; i++)
	{
		if (document.getElementById(aFields[i]) != null)
			document.getElementById(aFields[i]).value = '';
	}
}

JAuth.prototype.bindOnClickEvent = function(sField, event)
{
	if (typeof sField == 'string')
		attach = document.getElementById(sField);
	else
		attach = sField;

	// W3C, FF
	if (attach.addEventListener)
		attach.addEventListener('click', event, false);
	else
		attach.attachEvent('onclick', event);
}

JAuth.prototype.keyPress = function(sElements, event)
{
	var elementIds = sElements.split(',');
	var element;

	for (var i = 0; i < elementIds.length; i++)
	{
		element = document.getElementById(elementIds[i]);

		if (element.addEventListener)
			element.addEventListener('keyup', event, false);
		else
			element.attachEvent('keydown', event);
	}
}

JAuth.prototype.setInner = function(sId, sHtml)
{
	if (document.getElementById(sId) != null)
		document.getElementById(sId).innerHTML = sHtml;
}

JAuth.prototype.insertBefore = function(sId, sHtml)
{
	var el = document.getElementById(sId);

	if (el != null)
		el.parentNode.insertBefore(sHtml, el);
}

JAuth.prototype.insertAfter = function(sId, sHtml)
{
	var el = document.getElementById(sId);

	if (el != null)
	{
		if (el.parentNode.nextSibling)
			el.parentNode.insertBefore(sHtml, el.parentNode.nextSibling)
		else
			el.parentNode.appendChild(sHtml);
	}
}

JAuth.prototype.addClass = function(sId, sClass)
{
	var el = document.getElementById(sId);

	// Does it exist?
	if (el != null && el.className.indexOf(sClass) == -1)
	{
		el.className = el.className == '' ? sClass : el.className + ' ' + sClass;
	}
}

JAuth.prototype.removeClass = function(sId, sClass)
{
	var el = document.getElementById(sId);

	if (el != null)
	{
		var match = el.className.match(' ' + sClass) ? ' ' + sClass : (el.className.match(sClass + ' ') ? sClass + ' ' : sClass);
		el.className.replace(match, '');
	}
}

JAuth.prototype.show = function(sId)
{
	if (document.getElementById(sId) != null)
		document.getElementById(sId).style.display = '';
}

JAuth.prototype.hide = function(sId)
{
	if (document.getElementById(sId) != null)
		document.getElementById(sId).style.display = 'none';
}

JAuth.prototype.remove = function(sId)
{
	if (this.getElement(sId) != null)
		this.getElement(sId).parentNode.removeChild(this.getElement(sId));
}

JAuth.prototype.sleep = function(iLength, event)
{
	setTimeout(event, iLength);
}

JAuth.prototype.pause = function(iLength)
{
	var oTimeStart = new Date();
	var exitTime = oTimeStart.getTime() + iLength;

	while (true)
	{
		oNow = new Date();
		if (oNow.getTime() > exitTime)
			return;
	}
}

JAuth.prototype.loadScript = function(sSrc)
{
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', sSrc);

	if (typeof script != 'undefined')
		document.getElementsByTagName('head')[0].appendChild(script);
}

JAuth.prototype.getElement = function(sId)
{
	return document.getElementById(sId);
}

/**
 * Ajax related.
 */
// IE we !love you.
if (typeof XMLHttpRequest == 'undefined')
{
	window.XMLHttpRequest = function()
	{
		return new ActiveXObject(navigator.userAgent.indexOf('MSIE 5') >= 0 ? 'Microsoft.XMLHTTP' : 'Msxml2.XMLHTTP');
	}
}

JAuth.prototype.ajaxGet = function(sUrl, funcCallback)
{
	if (!window.XMLHttpRequest)
		return false;

	var oDoc = new XMLHttpRequest();

	// Go.
	oDoc.onreadystatechange = function()
	{
		// Are we ready?
		if (oDoc.readyState != 4)
			return;

		if (oDoc.responseText != null && oDoc.status == 200)
		{
			// Call the method
			funcCallback.call(this, oDoc.responseText);
		}
	}

	oDoc.open('GET', sUrl, true);
	oDoc.send(null);

	return oDoc;
}

JAuth.prototype.ajaxSend = function(sUrl, sContent, funcCallback)
{
	if (!window.XMLHttpRequest)
		return false;

	var sendDoc = new XMLHttpRequest();

	// Go.
	sendDoc.onreadystatechange = function()
	{
		if (sendDoc.readyState != 4)
			return;

		if (sendDoc.responseText != null && sendDoc.status == 200)
		{
			// Call the method
			funcCallback.call(this, sendDoc.responseText);
		}
	}
	sendDoc.open('POST', sUrl, true);
	if (typeof(sendDoc.setRequestHeader) != 'undefined')
		sendDoc.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	sendDoc.send(sContent);

	return true;
}

/**
 * Serialize method taken from Pro JavaScript Techniques by John Resig.
 */
JAuth.prototype.serialize = function(a)
{
	var s = [];

	if (a.constructor == Array)
		for (var i = 0; i < a.length; i++)
			s.push(a[i].name + '=' + encodeURIComponent(a[i].value));
	else
		for (var j in a)
			s.push(j + '=' + encodeURIComponent(a[j]));

	return s.join('&');
}