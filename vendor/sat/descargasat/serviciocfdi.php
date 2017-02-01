<?php

include_once 'portalcfdi.php';
include_once 'portalcfdi_emision.php';
include_once 'filtrosrecibidos.php';
include_once 'filtrosemitidos.php';

class ServicioCfdi {
    
    var $rfc;
    var $contrasena;
    var $resultado;
    var $mensajeError;
    var $listaDocumentosDescargados;
    var $listaArchsDocumentosDescargados;
    
    function __construct($rfc, $contrasena){
        $this->rfc = $rfc;
        $this->contrasena = $contrasena;
        $this->resultado = false;
        $this->mensajeError = '';
        $this->listaDocumentosDescargados = [];
        $this->listaArchsDocumentosDescargados = [];
    }
    
    // Portal recepción
    function peticionPortalCfdi( $directorioAGuardar, $filtros ){
        $portalCfdi         = new PortalCfdi($this->rfc, $this->contrasena);
        $this->resultado    = $portalCfdi->consultar($directorioAGuardar, $filtros);
        syslog(LOG_WARNING, "RESULTADO peticionPortalCfdi");
        if (!$this->resultado) {
            $this->mensajeError = $portalCfdi->obtieneMensajeError();
        } else {
            $this->listaDocumentosDescargados = $portalCfdi->obtieneListaDocumentosDescargados();
            $this->listaArchsDocumentosDescargados = $portalCfdi->obtieneListaArchsDocumentosDescargados();
        }
        
        return $this->resultado;
    }

    // Portal emisión
    function peticionPortalCfdiEmision( $directorioAGuardar, $filtros ){
        $portalCfdi         = new PortalCfdiEmision($this->rfc, $this->contrasena);
        $this->resultado    = $portalCfdi->consultar($directorioAGuardar, $filtros);
        
        if (!$this->resultado){
            $this->mensajeError = $portalCfdi->obtieneMensajeError();
        } else {
            $this->listaDocumentosDescargados = $portalCfdi->obtieneListaDocumentosDescargados();
            $this->listaArchsDocumentosDescargados = $portalCfdi->obtieneListaArchsDocumentosDescargados();
        }
        
        return $this->resultado;
    }
    
    function obtieneListaDocumentosDescargados() {
        return $this->listaDocumentosDescargados;
    }
    
    function obtieneListaArchsDocumentosDescargados() {
        return $this->listaArchsDocumentosDescargados;
    }
    
    function obtieneMensajeError(){
        return $this->mensajeError;
    }

    /***************************
    /****   RECEPCION *********/
    function descargarPorAnnioMesYDia($directorioAGuardar, $annio, $mes, $dia) {
        $filtros = new FiltrosRecibidos();
        $filtros->annio = $annio;
        $filtros->mes = $mes;
        $filtros->dia = $dia;
        return $this->peticionPortalCfdi($directorioAGuardar, $filtros);
    }
    
    function descargarPorAnnioYMes($directorioAGuardar, $annio, $mes){
        $filtros = new FiltrosRecibidos();
        $filtros->annio = $annio;
        $filtros->mes = $mes;
        
        return $this->peticionPortalCfdi($directorioAGuardar, $filtros);
    }
    
    function descargarPorFolioFiscal($directorioAGuardar, $folioFiscal){
        $filtros = new FiltrosRecibidos();
        $filtros->folioFiscal = $folioFiscal;
        return $this->peticionPortalCfdi($directorioAGuardar, $filtros);
    }

    /***************************
    /****     EMISIÓN *********/
    function descargarEmitidasPorAnnioYMes($directorioAGuardar, $annio, $mes){
        $filtros        = new FiltrosEmitidos();
        $filtros->annio = $annio;
        $filtros->mes   = $mes;
        $filtros->asignaFechas();
        
        // var_dump( $filtros );

        return $this->peticionPortalCfdiEmision( $directorioAGuardar, $filtros );
    }

    function descargarEmitidasPorFolioFiscal($directorioAGuardar, $folioFiscal){
        $filtros        = new FiltrosEmitidos();
        $filtros->folioFiscal = $folioFiscal;
        return $this->peticionPortalCfdiEmision( $directorioAGuardar, $filtros );
    }
    
}



















