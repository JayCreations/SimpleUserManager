window.onload = function()
{
	var jLib = new JAuth();
	var currentUser = null;
	var editingUsername = '';

	// Hide the message field.
	jLib.hide('message');
	jLib.hide('editUserForm');
	jLib.hide('loading');
	// Disable the login.
	jLib.getElement('login').setAttribute('disabled', 'disabled');

	// Lets steal the clicking.
	jLib.bindOnClickEvent(document, function(e)
	{
		if (typeof e.target.hash == 'undefined')
			return true;

		var re = /^#edit-(\d+)$/ig;
		var hash = e.target.hash;
		if (re.test(hash))
		{
			var id_user = hash.substring(6);
			// Let send this to the editUserSetup
			editUserSetup(id_user);

			return false;
		}

		var re_delete = /^#delete-(\d+)$/ig;
		if (re_delete.test(hash))
		{
			var id_user = hash.substring(8);
			// Delete the user.
			jLib.deleteUser(id_user);
			displayUsers();

			return false;
		}

		return true;
	});

	// Set the event for onclick and clear the form values.
	jLib.bindOnClickEvent('clear', function()
	{
		jLib.clearForm(['username', 'password'])
	});

	// Set the clear for the reg form.
	jLib.bindOnClickEvent('clear_reg', function()
	{
		jLib.clearForm(['reg_username', 'reg_password', 'reg_first_name', 'reg_last_name', 'reg_class']);
	});

	// Lets log in.
	jLib.bindOnClickEvent('login', doLogin);

	// Register.
	jLib.bindOnClickEvent('register', doRegistration);

	// Update the account.
	jLib.bindOnClickEvent('update', doEditUser);

	jLib.keyPress('username,password', function(e)
	{
		if (e.keyCode == 13)
			doLogin();

		// Enable the login button.
		if (jLib.getElement('login').getAttribute('disabled') == 'disabled' && (jLib.getElement('username').value != '' && jLib.getElement('password').value != ''))
			jLib.getElement('login').removeAttribute('disabled');
		else if (jLib.getElement('login').getAttribute('disabled') == null && (jLib.getElement('username').value == '' && jLib.getElement('password').value == ''))
			jLib.getElement('login').setAttribute('disabled', 'disabled');

		return true;
	});

	function doLogin()
	{
		// We loading.
		jLib.show('loading');
		// Get the username and password.
		var username = document.getElementById('username').value;
		var password = document.getElementById('password').value;

		var validated = jLib.validateUser({username: username, password: password});

		// Did the user validate?
		if (validated == true)
		{
			// We don't need the username and password so just clear it.
			jLib.clearForm(['username', 'password'])
			// Remove any previous errors.
			jLib.setInner('message', 'You have logged in successfully.');
			jLib.addClass('message', 'success');
			jLib.show('message');

			// After a few seconds we hide and display other info.
			jLib.sleep(1000, function()
			{
				jLib.hide('message');
				jLib.hide('loginForm');
				jLib.hide('registerForm');
				jLib.hide('editUserForm');

				// Get the current user.
				currentUser = jLib.getUserById(jLib.iCurrentUserId);

				// Display the welcome box.
				displayWelcomeBox();

				// Display the users.
				displayUsers();

				// Hide it.
				jLib.hide('loading');
			});
		}
		else
		{
			jLib.setInner('message', 'There was a problem logging you in. Please check the username and password.')
			jLib.addClass('message', 'error');
			jLib.show('message');

			// Hide it.
			jLib.hide('loading');
		}
	}

	function doRegistration()
	{
		var reg_username = document.getElementById('reg_username').value;
		var reg_password = document.getElementById('reg_password').value;
		var reg_password_confirm = document.getElementById('reg_password_confirm').value;
		var reg_first_name = document.getElementById('reg_first_name').value;
		var reg_last_name = document.getElementById('reg_last_name').value;
		var reg_class = document.getElementById('reg_class').value;

		// We like subways here. We start fresh.
		jLib.setInner('message', '');
		jLib.removeClass('message', 'error');
		jLib.hide('message');

		// Check if the user exists.
		if (jLib.getUser(reg_username) != -1)
		{
			jLib.setInner('message', 'The username already exists.');
			jLib.addClass('message', 'error');
			jLib.show('message');

			return;
		}

		// Check the password.
		if (reg_password != reg_password_confirm || jLib.checkPassword(reg_password) == false)
		{
			jLib.setInner('message', 'The password you entered is invalid or does not match. Please enter an alpha-numeric password between the lenght of 8 to 20 characters.');
			jLib.addClass('message', 'error');
			jLib.show('message');

			return;
		}

		// First and last name needed.
		if (reg_first_name == '' || reg_last_name == '' || reg_class == '')
		{
			jLib.setInner('message', 'You must enter a first, last name and class.');
			jLib.addClass('message', 'error');
			jLib.show('message');

			return;
		}

		// If we got here then we can register the user.
		var registered = jLib.addUser({
			username: reg_username,
			password: reg_password,
			first_name: reg_first_name,
			last_name: reg_last_name,
			stu_class: reg_class
		});

		// Did it register?
		if (registered)
		{
			jLib.setInner('message', 'Your account has been registered successfully.');
			jLib.addClass('message', 'success');
			jLib.show('message');
		}
	}

	function doEditUser()
	{
		// Populate the fields.
		var acc_password = document.getElementById('acc_password').value;
		var acc_password_confirm = document.getElementById('acc_password_confirm').value;
		var acc_first_name = document.getElementById('acc_first_name').value;
		var acc_last_name = document.getElementById('acc_last_name').value;
		var acc_class = document.getElementById('acc_class').value;

		// Validate the password.
		if (acc_password != acc_password_confirm || jLib.checkPassword(acc_password) == false)
		{
			jLib.setInner('message', 'The password you entered is invalid or does not match. Please enter an alpha-numeric password between the lenght of 8 to 20 characters.');
			jLib.removeClass('message', 'success');
			jLib.addClass('message', 'error');
			jLib.show('message');

			return;
		}

		// First and last name needed.
		if (acc_first_name == '' || acc_last_name == '' || acc_class == '')
		{
			jLib.setInner('message', 'You must enter a first, last name and class.');
			jLib.removeClass('message', 'success');
			jLib.addClass('message', 'error');
			jLib.show('message');

			return;
		}

		// Lets get the user id to edit.
		if (editingUser == '')
			var iId = jLib.iCurrentUserId;
		// Get the id by username.
		else
			var iId = jLib.getUserIdByUsername(editingUsername);

		// Try to update it.
		var updated = jLib.updateUser(iId, {
			password: acc_password,
			first_name: acc_first_name,
			last_name: acc_last_name,
			stu_class: acc_class
		});

		if (updated == true)
		{
			// Display the welcome box.
			displayWelcomeBox();
			// Re-do the userlist.
			displayUsers();
			// Reset the editingUsername.
			editingUsername = '';

			// Hide and clear.
			jLib.hide('editUserForm');
			jLib.hide('message');
			jLib.clearForm(['acc_username', 'acc_password', 'acc_first_name', 'acc_last_name', 'acc_class']);
		}
	}

	function editUserSetup(id_user)
	{
		jLib.show('loading');

		// Are we editing another user or the current logged in one?
		if (typeof id_user != 'undefined' && typeof id_user == 'integer')
			editingUser = jLib.getUserById(id_user);
		else
			editingUser = currentUser;

		// Lets store the username;
		editingUsername = editingUser.username;

		// Just for fun pause it.
		jLib.sleep(500, function()
		{
			if (currentUser == null)
				return;

			jLib.getElement('acc_username').value = editingUser.username;
			jLib.getElement('acc_password').value = editingUser.password;
			jLib.getElement('acc_first_name').value = editingUser.first_name;
			jLib.getElement('acc_last_name').value = editingUser.last_name;
			jLib.getElement('acc_class').value = editingUser.stu_class;

			jLib.show('editUserForm');
			jLib.hide('loading');
		});
	}

	function logOut()
	{
		jLib.logOut();

		jLib.show('loginForm');
		jLib.show('registerForm');
		jLib.hide('editUserForm');
		jLib.remove('logged_in');
		jLib.remove('users_box');
	}

	function displayUsers()
	{
		// Do we have the element in there?
		if (jLib.getElement('users_box') == null)
		{
			// Create the div.
			var usersBox = document.createElement('div');
			usersBox.setAttribute('class', 'form');
			usersBox.setAttribute('id', 'users_box');
			usersBox.innerHTML = '<h3>Users</h3>';
			usersBox.innerHTML += '<div id="users_list"></div>';
			// Add it.
			jLib.insertAfter('editUserForm', usersBox);
		}

		// Start the table.
		var users_list = '<table class="students_table">' +
			'<tr class="table_header"> <th width="30%">First Name</th> <th width="30%">Last Name</th> <th>Class</th> <th>Action</th> </tr>';
		// Lets get the users.
		var users = jLib.getUsers();
		var even = false;
		for (var i = 0; i < users.length; i++)
		{
			if (typeof users[i] != 'undefined')
			{
				users_list += '<tr class="' + (even ? 'table_even' : 'table_odd') + '"> <td>' + users[i].first_name + '</td> <td>' + users[i].last_name + '</td> <td>' + users[i].stu_class + '</td> <td><a href="#edit-' + i + '">edit</a> <a href="#delete-' + i + '">delete</a></td> </tr>';
			}

			even = !even;
		}
		// Close it.
		users_list += '</table>';

		jLib.setInner('users_list', users_list);
	}

	function displayWelcomeBox()
	{
		// Does the box exists?
		if (jLib.getElement('logged_in') == null)
		{
			// Create the logged in box.
			var loggedInBox = document.createElement('div');
			loggedInBox.setAttribute('id', 'logged_in');
			// Add the element to the page.
			jLib.insertBefore('message', loggedInBox);
		}

		// We need to now insert something.
		jLib.setInner('logged_in', 'Welcome back <strong>' + currentUser.first_name + ' ' + currentUser.last_name + '</strong>. [<a href="#" class="cursor_text" id="edit_user">edit</a> <span class="cursor_text" id="logout">logout</span>]');

		// We need an event listener for the edit button.
		jLib.bindOnClickEvent('edit_user', editUserSetup);
		// Logging out?
		jLib.bindOnClickEvent('logout', logOut);
	}
}
