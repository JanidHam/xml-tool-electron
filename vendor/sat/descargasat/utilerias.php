<?php


class Utilerias {
    
    function mergeListas( $listaA, $listaB ) {
        $resultante = array_merge($listaA, $listaB);
        return $resultante;
    }
    
    function doLog($text)
    {
        // open log file
        $filename = "debug_log.log";
        (file_exists($filename) ? unlink($filename) : "" );
        $fh = fopen($filename, "a") or die("Could not open log file.");
        fwrite($fh, $text) or die("Could not write debug_log file!");
        fclose($fh);
    }
    
    
}