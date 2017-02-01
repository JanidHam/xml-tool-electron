export default class FiltrosRecibidos {
  constructor() {
    this.annio = "2015"
    this.mes = "1"
    this.dia = "0"
    this.folioFiscal = ""
  }

  formateaDia() {
    if (this.dia < 10) {
        this.dia = '0' + this.dia
    }

    return this.dia
  }

  obtenFiltroCentral() {
    if (this.folioFiscal != '') {
      return 'RdoFolioFiscal'
    } else {
      return 'RdoFechas'
    }
  }

  obtenerPOST() {
    let post=[];
    
    post['__ASYNCPOST'] = 'true';
    post['__EVENTARGUMENT'] = '';
    post['__EVENTTARGET'] = '';
    post['__LASTFOCUS'] = '';
    post['ctl00$MainContent$BtnBusqueda'] = 'Buscar CFDI';
    post['ctl00$MainContent$CldFecha$DdlAnio'] = this.annio;
    post['ctl00$MainContent$CldFecha$DdlDia'] = this.formateaDia();
    post['ctl00$MainContent$CldFecha$DdlHora'] = '0';
    post['ctl00$MainContent$CldFecha$DdlHoraFin'] = '23';
    post['ctl00$MainContent$CldFecha$DdlMes'] = this.mes;
    post['ctl00$MainContent$CldFecha$DdlMinuto'] = '0';
    post['ctl00$MainContent$CldFecha$DdlMinutoFin'] = '59';
    post['ctl00$MainContent$CldFecha$DdlSegundo'] = '0';
    post['ctl00$MainContent$CldFecha$DdlSegundoFin'] = '59';
    post['ctl00$MainContent$DdlEstadoComprobante'] = '-1';
    post['ctl00$MainContent$FiltroCentral'] = this.obtenFiltroCentral();
    post['ctl00$MainContent$TxtRfcReceptor'] = '';
    post['ctl00$MainContent$TxtUUID'] = this.folioFiscal;
    post['ctl00$MainContent$ddlComplementos'] = '-1';
    post['ctl00$MainContent$hfInicialBool'] = 'false';
    post['ctl00$ScriptManager1'] = 'ctl00$MainContent$UpnlBusqueda|ctl00$MainContent$BtnBusqueda';
    return post;
  }

  obtenerPOSTFormularioFechas() {
    let post=[];
    
    post['__ASYNCPOST'] = 'true';
    post['__EVENTARGUMENT'] = '';
    post['__EVENTTARGET']='ctl00$MainContent$RdoFechas';
    post['__LASTFOCUS'] = '';
    post['ctl00$MainContent$CldFecha$DdlAnio'] = new Date().getFullYear();
    post['ctl00$MainContent$CldFecha$DdlDia'] = '0';
    post['ctl00$MainContent$CldFecha$DdlHora'] = '0';
    post['ctl00$MainContent$CldFecha$DdlHoraFin'] = '23';
    post['ctl00$MainContent$CldFecha$DdlMes'] = '1';
    post['ctl00$MainContent$CldFecha$DdlMinuto'] = '0';
    post['ctl00$MainContent$CldFecha$DdlMinutoFin'] = '59';
    post['ctl00$MainContent$CldFecha$DdlSegundo'] = '0';
    post['ctl00$MainContent$CldFecha$DdlSegundoFin'] = '59';
    post['ctl00$MainContent$DdlEstadoComprobante'] = '-1';
    post['ctl00$MainContent$FiltroCentral'] = 'RdoFechas';
    post['ctl00$MainContent$TxtRfcReceptor'] = '';
    post['ctl00$MainContent$TxtUUID'] = '';
    post['ctl00$MainContent$ddlComplementos'] = '-1';
    post['ctl00$MainContent$hfInicialBool'] ='true';
    post['ctl00$ScriptManager1'] = 'ctl00$MainContent$UpnlBusqueda|ctl00$MainContent$RdoFechas';
    return post;
  }

}