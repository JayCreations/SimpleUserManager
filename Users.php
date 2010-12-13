<?php
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

// No direct access.
if (!defined('SUM'))
	die('Direct access not allowed.');

class Users
{
	protected $db;
	protected $lastError = '';

	/**
	 * Construct.
	 *
	 * @access public
	 * @return void
	 */
	public function __construct()
	{
		// Make a db connection.
		$this->db = new Database();
	}

	/**
	 * Logs the user in.
	 *
	 * @access public
	 * @param string $username
	 * @param string @password
	 * @return boolean
	 */
	public function logIn($username, $password)
	{
		// No username or password? Bounce!
		if (empty($username) || empty($password))
			return false;

		// Lower case it.
		$username = strtolower($username);

		// Let's look up the user wih that username.
		$user = $this->getUserByUsername($username);

		// Start fresh.
		if (!isset($_SESSION['login_attempts']))
			$_SESSION['login_attempts'] = 0;

		// Was the user found?
		if ($user !== false)
		{
			// We support plaintext and sha1 passwords.
			// Does the password match?
			if ($password == $user['passwd'] || (strlen($user['passwd']) == 40 && sha1($username . $password) == $user['passwd']))
			{
				// We are in folks.
				unset($_SESSION['login_attempts']);

				// Store these.
				$_SESSION['is_logged'] = true;
				$_SESSION['user_info'] = array(
					'id_user' => $user['id_user'],
					'username' => $user['username'],
					'role' => $user['role'],
				);

				return true;
			}
			else
			{
				// Store how many failed attempts.
				$_SESSION['login_attempts']++;
				// Store the error.
				$this->lastError = 'The username and password do not match.';
				return false;
			}
		}
		else
		{
			// Store how many failed attempts.
			$_SESSION['login_attempts']++;
			// Store the error.
			$this->lastError = 'The user that you are looking for does not exists.';
			// FALSE!!!
			return false;
		}
	}

	/**
	 * Logs a user out.
	 *
	 * @access public
	 * @return boolean
	 */
	public function logOut()
	{
		// Are we logged in to begin with?
		if (isset($_SESSION['is_logged']))
		{
			unset($_SESSION['is_logged'], $_SESSION['user_info']);
		}

		// Always return true. Might be replaced with a redirect.
		return true;
	}

	/**
	 * Checks to see if a password is alpha-numeric
	 *
	 * @access private
	 * @param string password
	 * @return boolean
	 */
	private function _validatePassword($password)
	{
		// Lets check the length.
		if (strlen($password) < 8 || strlen($password) > 20)
			return false;

		// Is it alpha numeric?
		if (!preg_match('~^\w*(?=\w*\d)(?=\w*[a-z])(?=\w*[A-Z])\w*$~', $password))
			return false;

		return true;
	}

	/**
	 * Login function to check if the user is logged in.
	 *
	 * @access public
	 * @return boolean $is_logged
	 */
	public function isLoggedIn()
	{
		return isset($_SESSION['is_logged']) ? true : false;
	}

	/**
	 * Returns the role of the current logged in user.
	 *
	 * @access public
	 * @return string $role
	 */
	public function role()
	{
		return isset($_SESSION['user_info']['role']) ? $_SESSION['user_info']['role'] : false;
	}

	/**
	 * Adds a user.
	 *
	 * @access public
	 * @param array $user_data
	 * @return int $id_user
	 */
	public function addUser(array $user_data)
	{

	}

	/**
	 * Updates a user.
	 *
	 * @access public
	 * @param int $id_user
	 * @param array $user_data
	 * @return int $id_user
	 */
	public function updateUser($id_user, array $user_data)
	{

	}

	/**
	 * Deletes a user.
	 *
	 * @access public
	 * @param int $id_user
	 * @return boolean $deleted
	 */
	public function deleteUser($id_user)
	{

	}

	/**
	 * Gets all the users.
	 *
	 * @access public
	 * @param string $select = 'simple'
	 * @param array $where = array()
	 * @return array $users
	 */
	public function getUsers($select = 'simple', $where = array())
	{
		$where_str = '';
		foreach ($where as $key => $value)
		{
			if (!empty($where_str))
				$where_str .= ' AND ';

			// This is an instance that the term is not a simple comparison.
			// (role = 'mod' OR role = 'reg')
			if ($value === 0)
			{
				$where_str .= $key;
			}
			else
				$where_str .= $this->db->escape($key) . "'" . $this->db->escape($value) . "'";
		}

		// What are we selecting?
		if ($select == 'simple')
			$select_str = 'first_name, last_name, role, dob, course';
		else
			$select_str = '*';

		$this->db->query('SELECT ' . $select_str . ' FROM sum_users' . (empty($where_str) ? '' : ' WHERE ' . $where_str));

		// results.
		$users = array();
		while ($row = $this->db->assoc())
			$users[(int) $row['id_user']] = array(
				'id_user' => (int) $row['id_user'],
				'username' => $row['username'],
				'passwd' => $row['passwd'],
				'first_name' => $row['first_name'],
				'last_name' => $row['last_name'],
				'role' => $row['role'],
				'dob' => $row['dob'],
				'course' => $row['course'],
			);
		$this->db->free_result();

		return $users;
	}

	/**
	 * Gets one user.
	 *
	 * @access public
	 * @param int $id_user
	 * @return $user
	 */
	public function getUserById($id_user)
	{
		// If no user given return.
		if (!is_numeric($id_user) || empty($id_user))
			return false;

		$this->db->query('
			SELECT *
			FROM sum_users
			WHERE id_user = ' . $id_user);
		$result = $this->db->assoc();
		$this->db->free_result();

		$user = array(
			'id_user' => (int) $result['id_user'],
			'username' => $result['username'],
			'passwd' => $result['passwd'],
			'first_name' => $result['first_name'],
			'last_name' => $result['last_name'],
			'role' => $result['role'],
			'dob' => $result['dob'],
			'course' => $result['course'],
		);

		return $user;
	}

	/**
	 * Gets one user.
	 *
	 * @access public
	 * @param int $id_user
	 * @return $user
	 */
	public function getUserByUsername($username)
	{
		// If no user given return.
		if (empty($username))
			return false;

		// Escape it.
		$username = $this->db->escape(strtolower($username));

		$this->db->query("
			SELECT *
			FROM sum_users
			WHERE username = '$username'");
		$result = $this->db->assoc();
		$this->db->free_result();

		$user = array(
			'id_user' => (int) $result['id_user'],
			'username' => $result['username'],
			'passwd' => $result['passwd'],
			'first_name' => $result['first_name'],
			'last_name' => $result['last_name'],
			'role' => $result['role'],
			'dob' => $result['dob'],
			'course' => $result['course'],
		);

		return $user;
	}

	/**
	 * Gets the id_user by username.
	 *
	 * @access public
	 * @param string $username
	 * @return int $id_user
	 */
	public function getUserIdByUsername($username)
	{
		// Not a string? Peace.
		if (!is_string($username) || trim($username) == '')
			return false;

		$id_user = $this->db->escape($username);
		$this->db->query("
			SELECT id_user
			FROM sum_users
			WHERE username = '$username'");
		list ($id_user) = $this->db->row();
		$this->db->free_result();

		return $id_user;
	}

	/**
	 * Get last error.
	 *
	 * @access public
	 * @return string
	 */
	public function getLastError()
	{
		return $this->lastError;
	}
}

?>