<?php
require_once "../controller/{$controller}.php";
switch ($controller){
    case "Home":
        $controller = new Home();
        break;
    case "Admin":
        $controller = new Admin();
        break;
}
$controller->{$action}();
?>