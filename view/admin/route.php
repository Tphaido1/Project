<?php
require_once "../controller/{$controller}.php";
switch ($controller){
    case "Admin":
        $controller = new Admin();
        break;
}
$controller->{$action}();
?>