<?php
class connect{
    protected $db;
    public function __construct()
    {
        $this->db = new PDO("mysql:host=localhost;dbname=bookstore", "root", "",
            [PDO::MYSQL_ATTR_INIT_COMMAND
            => "SET NAMES utf8"]);
    }

    //Lấy dữ liệu database
    public function getlist($select){
        $result = $this->db->query($select);
        return $result;
    }
    //Tạo phương thức câu lệnh insert, update, delete
    public function exec($query){
        $result = $this->db->exec($query);
        return $result;
    }
    public function getInstance($select){
        $results = $this->db->query($select);
        $result = $results->fetch();
        return $result;
    }
}
?>