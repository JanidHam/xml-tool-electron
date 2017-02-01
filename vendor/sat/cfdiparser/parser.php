<?php 

//error_reporting(E_ALL);

class cfdiparse {

   private $xml;
   private $ns;
   public $cfdi;

   public function procesarXML( $file ) {
      $this->xml = simplexml_load_file( $file );
      $this->ns = $this->xml->getNamespaces(true);
      $this->xml->registerXPathNamespace('c', $this->ns['cfdi']);
      $this->xml->registerXPathNamespace('t', $this->ns['tfd']);
      $this->cfdiToArray();
   }

   private function cfdiToArray() {
      foreach ($this->xml->xpath('//cfdi:Comprobante') as $cfdi){
         $this->cfdi['version']           =  (string) $cfdi['version'];
         $this->cfdi['fecha']             =  (string) $cfdi['fecha'];
         $this->cfdi['sello']             =  (string) $cfdi['sello'];
         $this->cfdi['total']             =  (string) $cfdi['total'];
         $this->cfdi['subTotal']          =  (string) $cfdi['subTotal'];
         $this->cfdi['certificado']       =  (string) $cfdi['certificado'];
         $this->cfdi['formaDePago']       =  (string) $cfdi['formaDePago'];
         $this->cfdi['noCertificado']     =  (string) $cfdi['noCertificado'];
         $this->cfdi['tipoDeComprobante'] =  (string) $cfdi['tipoDeComprobante'];
      }
      
      foreach ($this->xml->xpath('//cfdi:Comprobante//cfdi:Emisor') as $emisor ){
         $this->cfdi['emisor']['rfc']     = (string) $emisor['rfc'];
         $this->cfdi['emisor']['nombre']  = (string) $emisor['nombre'];
      }

      foreach ($this->xml->xpath('//cfdi:Comprobante//cfdi:Emisor//cfdi:DomicilioFiscal') as $emisor_dom){
         $this->cfdi['emisor']['dom']['pais'] = (string) $emisor_dom['pais'];
         $this->cfdi['emisor']['dom']['calle'] = (string) $emisor_dom['calle'];
         $this->cfdi['emisor']['dom']['estado'] = (string) $emisor_dom['estado'];
         $this->cfdi['emisor']['dom']['colonia'] = (string) $emisor_dom['colonia'];
         $this->cfdi['emisor']['dom']['municipio'] = (string) $emisor_dom['municipio'];
         $this->cfdi['emisor']['dom']['noExterior'] = (string) $emisor_dom['noExterior'];
         $this->cfdi['emisor']['dom']['noInterior'] = (string) $emisor_dom['noInterior'];
         $this->cfdi['emisor']['dom']['codigoPostal'] = (string) $emisor_dom['codigoPostal'];
      }

      foreach ($this->xml->xpath('//cfdi:Comprobante//cfdi:Receptor') as $receptor){ 
         $this->cfdi['receptor']['rfc'] = (string) $receptor['rfc'];
         $this->cfdi['receptor']['nombre'] = (string) $receptor['nombre'];
      }

      foreach ($this->xml->xpath('//cfdi:Comprobante//cfdi:Receptor//cfdi:Domicilio') as $receptor_dom){
         $this->cfdi['receptor']['dom']['pais'] = (string)  $receptor_dom['pais'];
         $this->cfdi['receptor']['dom']['calle'] = (string)  $receptor_dom['calle'];
         $this->cfdi['receptor']['dom']['estado'] = (string)  $receptor_dom['estado'];
         $this->cfdi['receptor']['dom']['colonia'] = (string)  $receptor_dom['colonia'];
         $this->cfdi['receptor']['dom']['municipio'] = (string)  $receptor_dom['municipio'];
         $this->cfdi['receptor']['dom']['noExterior'] = (string)  $receptor_dom['noExterior'];
         $this->cfdi['receptor']['dom']['noInterior'] = (string)  $receptor_dom['noInterior'];
         $this->cfdi['receptor']['dom']['codigoPostal'] = (string)  $receptor_dom['codigoPostal'];
      }

      $i = 0;
      foreach ($this->xml->xpath('//cfdi:Comprobante//cfdi:Conceptos//cfdi:Concepto') as $concepto){
         $this->cfdi['concepto'][$i]['unidad']    = (string) $concepto['unidad'];
         $this->cfdi['concepto'][$i]['importe']   = (string) $concepto['importe'];
         $this->cfdi['concepto'][$i]['cantidad']  = (string) $concepto['cantidad'];
         $this->cfdi['concepto'][$i]['descripcion'] = (string) $concepto['descripcion'];
         $this->cfdi['concepto'][$i]['valorUnitario'] = (string) $concepto['valorUnitario'];
         $i++;
      }

      $i = 0;
      foreach ($this->xml->xpath('//cfdi:Comprobante//cfdi:Impuestos//cfdi:Traslados//cfdi:Traslado') as $traslado){
         $this->cfdi['impuesto']['traslado'][$i]['tasa'] = (string) $traslado['tasa'];
         $this->cfdi['impuesto']['traslado'][$i]['importe'] = (string) $traslado['importe'];
         $this->cfdi['impuesto']['traslado'][$i]['impuesto'] = (string) $traslado['impuesto'];
         $i++;
      }

      $i = 0;
      foreach ($this->xml->xpath('//cfdi:Comprobante//cfdi:Impuestos//cfdi:Retenciones//cfdi:Retencion') as $retencion){
         $this->cfdi['impuesto']['retencion'][$i]['tasa'] = (string) $retencion['importe'];
         $this->cfdi['impuesto']['retencion'][$i]['impuesto'] = (string) $retencion['impuesto'];
         $i++;
      }

      foreach ($this->xml->xpath('//t:TimbreFiscalDigital') as $tfd) {
         $this->cfdi['tfd']['selloCFD'] = (string) $tfd['selloCFD'];
         $this->cfdi['tfd']['FechaTimbrado'] = (string) $tfd['FechaTimbrado'];
         $this->cfdi['tfd']['UUID'] = (string) $tfd['UUID'];
         $this->cfdi['tfd']['noCertificadoSAT'] = (string) $tfd['noCertificadoSAT'];
         $this->cfdi['tfd']['version'] = (string) $tfd['version'];
         $this->cfdi['tfd']['selloSAT'] = (string) $tfd['selloSAT'];
      }
   }


   public function getListXMLS( $path ) {
		$it = new RecursiveDirectoryIterator( $path );
		$allowed=array("xml", "XML");
		$lista = [];

		foreach(new RecursiveIteratorIterator($it) as $file) {
		    if(in_array(substr($file, strrpos($file, '.') + 1),$allowed)) {
		        //echo $file . "<br/> \n";
		        $lista[] = (string) $file;
		    }
		}

		return $lista;
   }

}





 ?>