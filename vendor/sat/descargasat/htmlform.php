<?php

class HTMLForm {
    
    var $xpathForm;
    var $htmlSource;
    var $contador = 0;
    
    function __construct( $htmlSource , $xpathForm ) {
        $this->xpathForm  = $xpathForm;
        $this->htmlSource = $htmlSource;
    }
    
    function getFormValues() {
        $inputValues    = $this->readInputValues();     #OK
        $selectValues   = $this->readSelectValues();    #OK
                
        $values = array_merge($inputValues, $selectValues);
        return $values;
    }
    
    // lee los valores de los input
    function readInputValues(){
        return $this->readAndGetValues("input");
    }
    
    // lee los valores de los select
    function readSelectValues(){
        return $this->readAndGetValues("select");
    }
    
    function readAndGetValues( $element ) {
        $old = libxml_use_internal_errors(true);
        
        $dom = new DOMDocument;
        $dom->loadHTML( $this->htmlSource );

        libxml_use_internal_errors($old);
        
        $sxe = simplexml_import_dom($dom);
        
        $document = $sxe;
        $inputValues = [];
        
        $xpath = $document->xpath( "//".$this->xpathForm."/".$element);
        
        foreach ( $xpath as $input ):
            $name  = (string) $input->attributes()->{'name'};
            $value = (string) $input->attributes()->{'value'};
            $inputValues[$name] = $value;
        endforeach;

        return $inputValues;
    }
}