<?php

ini_set('display_errors', 1);

define ('SUM', 1);

require_once('settings.php');
require_once('Database.php');

$db = new Database($db_info);

echo '<pre>';
$db->query("
	SELECT *
	FROM md_languages");
print_r($db->assoc());
$db->free_result();


$db->query("
	SELECT *
	FROM md_languages");
print_r($db->row());
$db->free_result();

$db->query("
	SELECT *
	FROM md_languages");
print_r($db->row());
$db->free_result();

$db->query("
	SELECT *
	FROM md_languages");
print_r($db->row());
$db->free_result();

$db->query("
	SELECT *
	FROM md_languages");
print_r($db->row());
$db->free_result();

$db->query("
	SELECT *
	FROM md_languages");
print_r($db->row());
$db->free_result();
echo'</pre>';
?>