<?php
class MasterModel{
    public function __construct(){

    }
    public function get_all_from($table){
        $db = new connect();
        $query = "SELECT * FROM {$table} LIMIT 6";
        $result = $db->getlist($query);
        return $result;
    }
}
?>
