<?php

use GuzzleHttp\Client;

include_once('htmlform.php');
include_once('descargarxml.php');
include_once('parserformatsat.php');
include_once('header.php');
include_once('utilerias.php');

class PortalCfdi {
    var $rfc;
    var $contrasena;
    var $sesion;
    var $directorioAGuardar;
    var $header;
    var $hostCfdiau;
    var $hostPortalCfdi;
    var $urlCfdiau;
    var $urlPortalCfdi;
    var $urlCfdiCont;
    var $error;
    var $listaDocumentos;
    var $listaArchsDocumentos;

    function __construct($rfc, $contrasena) {
        $client = new Client();
        $header = new satHeader();

        $client->setDefaultOption('verify', false);

        $this->rfc = $rfc;
        $this->contrasena = $contrasena;
        $this->sesion = $client;
        $this->directorioAGuardar = '';
        $this->header = $header;
        $this->hostCfdiau = 'cfdiau.sat.gob.mx';
        $this->hostPortalCfdi = 'portalcfdi.facturaelectronica.sat.gob.mx';
        $this->urlCfdiau = 'https://' . $this->hostCfdiau . '/';
        $this->urlPortalCfdi = 'https://' . $this->hostPortalCfdi . '/';
        $this->urlCfdiCont = 'https://cfdicontribuyentes.accesscontrol.windows.net/';
        $this->error = '';
        $this->listaDocumentos = [];
        $this->listaArchsDocumentos = [];
    }

    function entrarAlaPaginaInicio(){
        $url = $this->urlCfdiau . '/nidp/app/login?id=SATUPCFDiCon&sid=0&option=credential&sid=0';
        $this->sesion->post($url, ['cookies' => true, 'future' => true, 'verify' => FALSE] )->getBody()->getContents();
    }

    function enviarFormularioConCIEC(){
        $url = $this->urlCfdiau . 'nidp/app/login?sid=0&sid=0';
        
        $encabezados = $this->header->obtener(
            $this->hostCfdiau, 
            $this->urlCfdiau . '/nidp/app/login?id=SATUPCFDiCon&sid=0&option=credential&sid=0'
        );
        
        $valoresPost = [
            'option'        =>'credential',
            'Ecom_User_ID'  =>$this->rfc,
            'Ecom_Password' =>$this->contrasena,
            'submit'        =>'Enviar'
        ];
        
        $this->sesion->post($url,
            ['body' => $valoresPost, 'headers' => $encabezados, 'cookies' => true, 'future' => true, 'verify' => FALSE]
        );
    }
    
    function leerFormulario($html){
        $htmlFormulario = new HTMLForm($html, 'form'); ##OK
        $inputValores   = $htmlFormulario->getFormValues();
        return $inputValores;
    }
    
    function leerFormularioDeRespuesta(){
        $url = $this->urlPortalCfdi;
        $respuesta = $this->sesion->get( $url , ['cookies' => true, 'future' => true, 'verify' => FALSE] );
        $htmlRespuesta = $respuesta->getBody()->getContents();
        
        return $this->leerFormulario($htmlRespuesta);
    }
    
    function leerFormularioDeAccessControl($valoresPost){
        $url = $this->urlCfdiCont . 'v2/wsfederation';
        
        $respuesta = $this->sesion->post($url, 
            ['body'=>$valoresPost, 'cookies' => true, 'future' => true, 'verify' => FALSE]
        );
        
        $htmlRespuesta = $respuesta->getBody()->getContents();
        return $this->leerFormulario($htmlRespuesta);
    }
    
    function entrarAPantallaInicioSistema($valoresPost){
        $url = $this->urlPortalCfdi;
        $respuesta = $this->sesion->post($url, ['body'=>$valoresPost, 'cookies' => true, 'future' => true, 'verify' => FALSE]);
        $htmlRespuesta = $respuesta->getBody()->getContents();
        
        return $htmlRespuesta;
    }
    
    function obtenerValoresPostDelTipoDeBusqueda($htmlFuente) {
        $inputValores = $this->leerFormulario( $htmlFuente );
        $inputValores['ctl00$MainContent$TipoBusqueda'] = 'RdoTipoBusquedaReceptor';
        $inputValores['__ASYNCPOST'] = 'true';
        $inputValores['__EVENTTARGET'] = '';
        $inputValores['__EVENTARGUMENT'] = '';
        $inputValores['ctl00$ScriptManager1'] = 'ctl00$MainContent$UpnlBusqueda|ctl00$MainContent$BtnBusqueda';
        return $inputValores;
    }
    
    function seleccionarTipo($htmlFuente) {
        $url = $this->urlPortalCfdi . 'Consulta.aspx';
        $post = $this->obtenerValoresPostDelTipoDeBusqueda($htmlFuente);
        $encabezados = $this->header->obtener(
            $this->hostCfdiau, $this->urlPortalCfdi
        );
        
        $respuesta = $this->sesion->post($url, 
            ['body' => $post, 'headers' => $encabezados, 'cookies' => true, 'future' => true, 'verify' => FALSE]
        );
        
        return $respuesta->getBody()->getContents();
    }
    
    function logueoDeUsuarioConCIEC() {
        $this->entrarAlaPaginaInicio();
        $this->enviarFormularioConCIEC();
        $valoresPost = $this->leerFormularioDeRespuesta();
        $valoresPostAccessControl = $this->leerFormularioDeAccessControl($valoresPost);
        
        $html = $this->entrarAPantallaInicioSistema($valoresPostAccessControl);
        $this->seleccionarTipo($html);
    }
    
    function obtenerValoresPostBusquedaFechas($htmlFuente, $inputValores, $filtros) {
        $parser                 = new ParserFormatSAT( $htmlFuente );
        $valoresCambioEstado    = $parser->obtenerValoresFormulario();
        
        $util                   = new Utilerias();
        $temporal               = $util->mergeListas($inputValores, $filtros->obtenerPOST() );

        return $util->mergeListas($temporal, $valoresCambioEstado);
    }
    
    function obtieneMensajeError(){
        return $this->error;
    }
    
    function obtieneListaDocumentosDescargados(){
        return $this->listaDocumentos;
    }
    
    function obtieneListaArchsDocumentosDescargados(){
        return $this->listaArchsDocumentos;
    }      
    
    function consultar( $directorioAGuardar, $filtros ) {
        try {
            $this->logueoDeUsuarioConCIEC();
            
            if( $filtros->folioFiscal != '' ){
                $htmlRespuesta = $this->consultaReceptorFolio($filtros);
                $nombre = $filtros->folioFiscal;
            } else {
                $htmlRespuesta = $this->consultaReceptorFecha($filtros);
                $nombre = '';
            }
            
            syslog(LOG_WARNING, "Empieza DescargarXML() desde portalcdfi->consultar");

            # descargamos xml
            $xml = new DescargarXML($this->sesion, $htmlRespuesta, $directorioAGuardar);
            $xml->obtenerEnlacesYDescargar( $nombre );
            $this->listaDocumentos = $xml->obtenerListaDeDocumentosDescargados();
            $this->listaArchsDocumentos = $xml->obtenerListaArchsDeDocumentosDescargados();
            return true;
        } catch (Exception $e) {
            $this->error = $e->getMessage();
            return false;
        }
    }    
    
    ####################################################################################################
    

    function entrarConsultaReceptor($filtros) {
        $url = $this->urlPortalCfdi . 'ConsultaReceptor.aspx';
        $respuesta = $this->sesion->get( $url, ['cookies' => true, 'future' => true, 'verify' => FALSE] );
        
        $htmlRespuesta = $respuesta->getBody()->getContents();
        $inputValores  = $this->leerFormulario($htmlRespuesta);
        
        $util = new Utilerias();
        $post = $util->mergeListas($inputValores, $filtros->obtenerPOSTFormularioFechas());
        
        # encabezados AJAX
        $encabezados = $this->header->obtenerAJAX(
            $this->hostPortalCfdi, 
            $this->urlPortalCfdi . 'ConsultaReceptor.aspx'
        );
        
        $respuesta = $this->sesion->post($url, 
            ['body' => $post, 'headers' => $encabezados, 'cookies' => true, 'future' => true, 'verify' => FALSE]
        );
        
        $arr_respuesta = ['htmlRespuesta'=>$respuesta->getBody()->getContents() , 'inputValores'=>$inputValores];
        return $arr_respuesta;
    }
    
    function consultaReceptorFecha($filtros){
        $url = $this->urlPortalCfdi . 'ConsultaReceptor.aspx';
        $htmlRespuestaArr = $this->entrarConsultaReceptor($filtros);

        $htmlRespuesta = $htmlRespuestaArr['htmlRespuesta'];
        $inputValores  = $htmlRespuestaArr['inputValores'];
        
        $valoresPost = $this->obtenerValoresPostBusquedaFechas(
            $htmlRespuesta, 
            $inputValores, 
            $filtros
        );
        
        $encabezados = $this->header->obtenerAJAX(
            $this->hostPortalCfdi, 
            $this->urlPortalCfdi . 'ConsultaReceptor.aspx'
        );
        
        $respuesta = $this->sesion->post($url, 
            ['body' => $valoresPost, 'headers' => $encabezados, 'cookies' => true, 'future' => true, 'verify' => FALSE]
        );
        
        return $respuesta->getBody()->getContents();
    }
    
    function consultaReceptorFolio($filtros){
        $url = $this->urlPortalCfdi . 'ConsultaReceptor.aspx';
        $respuesta = $this->sesion->get($url, ['cookies' => true, 'future' => true, 'verify' => FALSE]);
        
        $htmlRespuesta = $respuesta->getBody()->getContents();
        $inputValores = $this->leerFormulario($htmlRespuesta);
        $util = new Utilerias();
        $valoresPost = $util->mergeListas($inputValores, $filtros->obtenerPOST());
        
        $encabezados = $this->header->obtenerAJAX(
            $this->hostPortalCfdi, 
            $this->urlPortalCfdi . 'ConsultaReceptor.aspx'
        );
        $respuesta = $this->sesion->post($url, 
            ['body' => $valoresPost, 'headers' => $encabezados, 'cookies' => true, 'future' => true, 'verify' => FALSE]
        );
        return $respuesta->getBody()->getContents();
    }    
    
    
}

