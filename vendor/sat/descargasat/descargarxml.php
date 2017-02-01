<?php

class DescargarXML {
    
    var $sesion;
    var $htmlSource;
    var $direccionDescarga;
    var $listaXML;
    var $listaArchsXML;
    
    function __construct( $sesion, $htmlSource, $direccionDescarga ) {
        $this->sesion = $sesion;
        $this->htmlSource = $htmlSource;
        $this->direccionDescarga = $direccionDescarga;
        $this->listaXML = [];
        $this->listaArchsXML = [];
    }
    
    function obtenerEnlacesYDescargar($nombreDefault="") {
        syslog(LOG_WARNING, "EMPIEZA obtenerEnlacesYDescargar()" );
        $i = 1;
        
        $old = libxml_use_internal_errors(true); # set internal errors
        $dom = new DOMDocument;

        syslog(LOG_WARNING, $this->htmlSource );
        //debug($this->htmlSource);
        //echo $this->htmlSource;

        
        $myHTML = mb_convert_encoding($this->htmlSource, 'HTML-ENTITIES', 'ISO-8859-1');

        $dom->loadHTML( $myHTML );
        libxml_use_internal_errors($old); # restore old
        
        $sxe = simplexml_import_dom( $dom );
        
        $document = $sxe;
        
        $xpath = $document->xpath('//img[@name="BtnDescarga"]');
        
        foreach( $xpath as $img ):
        
            $urlXML = $img->attributes()->{'onclick'};
            $arrsat = array("return AccionCfdi('", "','Recuperacion');");
            $arrnew = array("https://portalcfdi.facturaelectronica.sat.gob.mx/", "");
            $urlXML = str_replace($arrsat, $arrnew, $urlXML);

            if( $nombreDefault != '' ){
                $nombre = $nombreDefault . '.xml';
            } else {
                $nombre = $i . ".xml";
            }
            
            $this->descargarXML($urlXML, $nombre);
            $i+=1;
            array_push($this->listaXML, $this->direccionDescarga.$nombre);
            array_push($this->listaArchsXML, $nombre);
            
        endforeach;   
    }
    
    function obtenerListaDeDocumentosDescargados() {
        return $this->listaXML;
    }
    
    function obtenerListaArchsDeDocumentosDescargados() {
        return $this->listaArchsXML;
    }
    
    function descargarXML($urlXML, $name) {
        //echo $urlXML;
        //echo $name;

        $path_descarga = $this->direccionDescarga . $name;

        $resource = fopen($path_descarga, 'w');

        syslog(LOG_WARNING, "Empieza descargarXML()");

        $response = $this->sesion->get( $urlXML , 
            ['save_to'=> $resource, 'cookies' => true, 'future' => true ]
        );

        syslog(LOG_WARNING, "END responde para descargar XML.");
        
        $bloquear = $response->getStatusCode();
        
        if (file_exists($path_descarga)==true){
            //chmod($path_descarga, 0777);
        }
    }
}










