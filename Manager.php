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

// We need some errors.
ini_set('display_errors', 1);
// Report these.
error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_STRICT);
// Before we call something else lets define this so the files know where we are coming form.
define ('SUM', 1);
require_once(dirname(__FILE__) . '/CleanRequest.php');
require_once(dirname(__FILE__) . '/Database.php');

// Make sure we clean before anything.
new CleanRequest();
// Broooom!
new Manager();

class Manager
{
	// DB.
	protected $db = null;

	/**
	 * Constructor.
	 *
	 * @access public
	 * @return void
	 */
	public function __construct()
	{
		if ($this->db === null)
			$this->init();
	}

	/**
	 * Run it.
	 *
	 * @access public
	 * @return void
	 */
	public function init()
	{
		// Start sessions.
		ob_start('ob_gzhandler');
		session_start();
		session_id();

		// Start the database.
		$this->db = new Database();

		// Initialize the users.
		require_once('Users.php');
		$this->users = new Users();

		// Catch the actions.
		$this->_catchAction();

		// Get a user.
		$this->db->query('SELECT * FROM sum_users');

		//echo json_encode($this->users->getUsers());
		/*$this->pre_print($users->getUsers());
		$this->pre_print($users->getUsers(array("(role = 'mod' OR role = 'reg')" => 0)));
		$this->pre_print($users->getUserById(1));
		$this->pre_print(var_dump($users->logIn('jhernandez', '12312312')));
		$this->pre_print(var_dump($users->logIn('jhernandez', 'Pass1234')));
		$this->pre_print(var_dump($users->role()));*/
	}

	/**
	 * Catches the current request url and maps it to the right location.
	 *
	 * @access private
	 * @return void
	 */
	private function _catchAction()
	{
		if (isset($_REQUEST['action']))
		{
			$action = $_REQUEST['action'];

			// This is ugly but gets the job done.
			switch ($action)
			{
				// Is the user logged in?
				case 'isloggedin':
					// Return the value if the user is logged in.
					echo json_encode($this->users->isLoggedIn());
				break;

				case 'login':
					if (isset($_POST['username'], $_POST['password']))
					{
						$username = htmlspecialchars($_POST['username'], ENT_QUOTES);
						$password = htmlspecialchars($_POST['password'], ENT_QUOTES);
						$logged_in = $this->users->logIn($username, $password);

						echo $logged_in ? 'true' : 'false';
					}
					else
						echo 'false';
				break;

				case 'getuser':
					// Check if the user is logged in.
					if ($this->users->isLoggedIn())
					{
						if (isset($_REQUEST['username']))
						{
							echo json_encode($this->users->getUserIdByUsername($_REQUEST['username']));
						}
						else
						{
							if (isset($_REQUEST['id_user']))
								$id_user = (int) $_REQUEST['id_user'];
							else
								$id_user = $_SESSION['user_info']['id_user'];

							echo json_encode($this->users->getUserById($id_user));
						}
					}
				break;

				case 'getusers':
					// Check if the user is logged in.
					if ($this->users->isLoggedIn())
					{
						$select = $this->users->role() == 'user' ? 'simple' : 'admin';
						echo json_encode(array_values($this->users->getUsers($select)));
					}
				break;

				case 'logout':
					echo $this->users->logOut();
				break;
			}
		}
	}

	/**
	 * print_r formatted with a pre tag.
	 *
	 * @access public
	 * @param string $data
	 * @return void
	 */
	public function pre_print($data)
	{
		echo '<pre>';
		print_r($data);
		echo '</pre>';
	}

	/**
	 * Destructernator
	 *
	 */
	public function __destruct()
	{
		ob_flush();
	}
}

?>