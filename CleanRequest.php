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
 * @link		https://github.com/JayCreations/SimpleUserManage
 */

// No direct access.
if (!defined('SUM'))
	die('Direct access not allowed.');

class CleanRequest
{
	/**
	 * The constructor will clean _POST, _GET, _REQUEST and _FILES variables
	 *
	 * @access public
	 * @return void
	 */
	public function __construct()
	{
		// This is old and deprecated.  Get rid of it.
		unset($GLOBALS['HTTP_POST_VARS'], $GLOBALS['HTTP_POST_VARS']);
		unset($GLOBALS['HTTP_POST_FILES'], $GLOBALS['HTTP_POST_FILES']);

		// Clean get and post.
		$_GET = $this->htmlspecialchars__recursive($_GET);

		// Is this stupid sht off?  PHP 6 will get rid of this >:D
		if (get_magic_quotes_gpc() == 0)
		{
			// $_POST $_COOKIE and $_SERVER
			$_POST = $this->addslashes__recursive($_POST);
			$_COOKIE = $this->addslashes__recursive($_COOKIE);
			$_SERVER = $this->addslashes__recursive($_SERVER);

			// $_FILES
			foreach ($_FILES as $key => $value)
				$_FILES[$key]['name'] = $this->addslashes__recursive($_FILES[$key]['name']);
		}

		// No COOKIE for you.
		$_REQUEST = $_POST + $_GET;
	}

	/**
	 * Adds slashes recursively to arrays.
	 *
	 * @access public
	 * @params arr array of values.
	 * @return string|array
	 */
	public function addslashes__recursive($arr)
	{
		if (!is_array($arr))
			return addslashes($arr);

		return array_map(array(&$this, 'addslashes__recursive'), $arr);
	}

	/**
	 * Strips slashes recursively to arrays.
	 *
	 * @access public
	 * @params arr array of values.
	 * @return string|array
	 */
	public function stripslashes__recursive($arr)
	{
		if (!is_array($arr))
			return stripslashes($arr);

		return array_map(array(&$this, 'stripslashes__recursive'), $arr);
	}

	/**
	 * htmlspecialchars recursively to arrays.
	 *
	 * @access public
	 * @params var array of values.
	 * @return string|array
	 */
	public function htmlspecialchars__recursive($arr)
	{
		if (!is_array($arr))
			return htmlspecialchars(urldecode($arr)	, ENT_QUOTES);

		return array_map(array(&$this, 'htmlspecialchars__recursive'), $arr);
	}

	/**
	 * htmlspecialchars recursively to arrays.
	 *
	 * @access public
	 * @params var array of values.
	 * @return string|array
	 */
	public function unhtmlspecialchars__recursive($arr)
	{
		if (!is_array($arr))
			return htmlspecialchars_decode(urldecode($arr), ENT_QUOTES);

		return array_map(array(&$this, 'unhtmlspecialchars__recursive'), $arr);
	}
}

?>