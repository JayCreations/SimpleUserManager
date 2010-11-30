function JAuth(oOptions)
{
	this.opt = typeof oOptions == 'undefined' ? {} : oOptions;
	this.iCurrentUserId = -1;
	this.oStudents = [
		{
			username: 'jhernandez',
			password: 'Pass1234',
			first_name: 'Juan',
			last_name: 'Hernandez',
			stu_class: 'CST 2309',
			group: 'admin'
		},
		{
			username: 'jayh',
			password: 'Test1111',
			first_name: 'Jay',
			last_name: 'Hernandez',
			stu_class: 'CST 2309',
			group: 'mod'
		},
		{
			username: 'test',
			password: '1234',
			first_name: 'Juan',
			last_name: 'Test',
			stu_class: 'CST 2309',
			group: 'user'
		}
	];
}

/**
 * User management.
 */
JAuth.prototype.getUser = function(sUsername)
{
	var user = -1;
	for (var i = 0; i < this.oStudents.length; i++)
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

	return user;
}

JAuth.prototype.getUserIdByUsername = function(sUsername)
{
	for (var i = 0; i < this.oStudents.length; i++)
		if (this.oStudents[i].username.toLowerCase() == sUsername.toLowerCase())
			return i;
}

JAuth.prototype.getUserById = function(iId)
{
	return this.oStudents[iId];
}

JAuth.prototype.getUsers = function()
{
	return this.oStudents;
}

JAuth.prototype.validateUser = function(oParams)
{
	// We need the username and password first.
	if (oParams.username == '' || oParams.password == '')
		return false;

	// Get/Find the user with that username.
	var user = this.getUser(oParams.username);

	// Did we find the user?
	if (user != -1 && user.password == oParams.password)
		return true;
	else
		return false;
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
		this.oStudents[iId].stu_class = oParams.stu_class;
		this.oStudents[iId].group = oParams.group;

		return true;
	}
	else
		return false;
}

JAuth.prototype.logOut = function()
{
	this.iCurrentUserId = -1;
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