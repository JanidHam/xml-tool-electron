<?php

class ParserFormatSAT {
    
    var $fuente;
    var $valores;
    var $items;
    var $validos;
    var $ordenados;
    
    function __construct($fuente) {
        $this->fuente   = $fuente;
        $this->valores  = [];
        $this->items    = [];
        $this->validos  = ['EVENTTARGET', '__EVENTARGUMENT', '__LASTFOCUS', '__VIEWSTATE'];
    }
    
    function procesar(){
        $this->valores = explode('|', $this->fuente);
    }
    
    function ordenaValores(){
        
        $name = '';
        $this->ordenados = [];
        
        foreach( range(0, count($this->valores) -1) as $index  ):
            
            $item = $this->valores[$index]; #item actual
            
            # buscamos si el item es valido
            if( in_array($item, $this->validos) ) {
                $name = $item; # guardamos el nombre del item
                
                $index+=1; # sumamos uno al index, para guardar a continuacion el valor
                $item = $this->valores[$index]; #guardamos el valor correspondiente en el item
                
                $this->items[$name] = $item; # guardamos en un nuevo array el item con su key y value
                $name = '';
            }
            
        endforeach;
    }
    
    function obtenerValoresFormulario(){
        $this->procesar();
        $this->ordenaValores();
        return $this->items;
    }
    
}