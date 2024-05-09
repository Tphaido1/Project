<?php
class Home{
    public static function index(){
        require_once "../model/book.php";
        $model = new ModelBook();
        $result = $model->get_du_lieu(); // mang 2 chieu thuc hien cau truy van select * from book
        require_once "../view/home/index.php";
    }
}