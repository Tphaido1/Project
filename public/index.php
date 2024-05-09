<?php
require_once "../config/db.php"; // ket noi csdl
//$db = new connect();
require_once "../model/master.php";

if(isset($_GET["controller"], $_GET["action"])){
    $controller = $_GET["controller"];
    $action = $_GET["action"];
}
else{
    $controller = "Home";
    $action = "index";
}

if($controller == "Admin"){
    require_once "../view/admin/layout.php";
}
else{
    require_once "../view/layout.php";
}
