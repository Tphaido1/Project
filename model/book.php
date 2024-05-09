<?php
class ModelBook extends MasterModel{
    public function get_du_lieu(){
        return parent::get_all_from("book");
    }
}
?>