export default class FiltrosEmitidos {
  constructor() {
    this.annio = "2015"
    this.mes = "1"
    this.dia = "0"
    this.folioFiscal = ""
    this.fechaInicial
    this.fechaFinal
  }

  formateaDia() {
    if (this.dia < 10) {
        this.dia = '0' + this.dia
    }

    return this.dia
  }

  formateaMes() {
    if (this.mes < 10) {
        this.mes = '0' + this.mes
    }

    return this.mes
  }

  asignaFecha() {
    this.mes = parseInt(this.mes)
    this.annio = parseInt(this.annio)

    let dias_mes = this.daysInMonth(this.mes, this.annio)
    let mesFormat = this.formateaMes()

    // Primer dia del mes
    this.fechaInicial = `01/${mesFormat}/${this.annio}`

    // Ultimo dia del mes
    this.fechaFinal = `${dias_mes}/${mesFormat}/${this.annio}`

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
    post['ctl00$MainContent$BtnBusqueda'] = 'Buscar CFDI'; //OK

    // fecha inicial
    post['ctl00$MainContent$CldFechaInicial2$Calendario_text'] = this.fechaInicial; //OK
    post['ctl00$MainContent$CldFechaInicial2$DdlHora'] = '0'; //OK
    post['ctl00$MainContent$CldFechaInicial2$DdlMinuto'] = '0'; //OK
    post['ctl00$MainContent$CldFechaInicial2$DdlSegundo'] = '0'; //OK

    // fecha final
    post['ctl00$MainContent$CldFechaFinal2$Calendario_text'] = this.fechaFinal; //OK
    post['ctl00$MainContent$CldFechaFinal2$DdlHora'] = '23'; //OK
    post['ctl00$MainContent$CldFechaFinal2$DdlMinuto'] = '59'; //OK
    post['ctl00$MainContent$CldFechaFinal2$DdlSegundo'] = '59'; //OK
    post['ctl00$MainContent$DdlEstadoComprobante'] = '-1'; //OK
    post['ctl00$MainContent$FiltroCentral']        = this.obtenFiltroCentral(); //OK
    post['ctl00$MainContent$TxtRfcReceptor']       = ''; //OK
    post['ctl00$MainContent$TxtUUID']              = this.folioFiscal; //OK
    post['ctl00$MainContent$ddlComplementos']      = '-1'; //OK
    post['ctl00$MainContent$hfInicialBool']        = 'false'; //OK
    post['ctl00$ScriptManager1']                   = 'ctl00$MainContent$UpnlBusqueda|ctl00$MainContent$BtnBusqueda'; //OK
    post['ctl00$MainContent$hfAux']                = ''; //OK
    post['ctl00$MainContent$hfDatos']              = ''; //OK
    post['ctl00$MainContent$hfFinal']              = this.annio; //OK
    post['ctl00$MainContent$hfFlag']               = ''; //OK
    post['ctl00$MainContent$hfInicial']            = this.annio; //OK
    return post;
  }

  obtenerPOSTFormularioFechas() {
    let post=[];

    post['__ASYNCPOST'] = 'true';
    post['__EVENTARGUMENT'] = '';
    post['__EVENTTARGET']='ctl00$MainContent$RdoFechas';
    post['__LASTFOCUS'] = '';
    post['ctl00$MainContent$CldFechaFinal2$Calendario_text'] = this.fechaInicial; //OK
    post['ctl00$MainContent$CldFechaFinal2$DdlHora'] = '23'; //OK
    post['ctl00$MainContent$CldFechaFinal2$DdlMinuto'] = '59'; //OK
    post['ctl00$MainContent$CldFechaFinal2$DdlSegundo'] = '59'; //OK
    post['ctl00$MainContent$CldFechaInicial2$Calendario_text'] = this.fechaFinal; //OK
    post['ctl00$MainContent$CldFechaInicial2$DdlHora'] = '0'; //OK
    post['ctl00$MainContent$CldFechaInicial2$DdlMinuto'] = '0'; //OK
    post['ctl00$MainContent$CldFechaInicial2$DdlSegundo'] = '0'; //OK
    post['ctl00$MainContent$DdlEstadoComprobante'] = '-1'; //OK
    post['ctl00$MainContent$FiltroCentral']        = 'RdoFechas'; //OK
    post['ctl00$MainContent$TxtRfcReceptor']       = ''; //OK
    post['ctl00$MainContent$TxtUUID']              = ''; //OK
    post['ctl00$MainContent$ddlComplementos']      = '-1'; //OK
    post['ctl00$MainContent$hfInicialBool']        = 'true'; //OK
    post['ctl00$ScriptManager1']                   = 'ctl00$MainContent$UpnlBusqueda|ctl00$MainContent$RdoFechas'; //OK
    post['ctl00$MainContent$hfAux']                = ''; //OK
    post['ctl00$MainContent$hfDatos']              = ''; //OK
    post['ctl00$MainContent$hfFinal']              = this.annio; //OK
    post['ctl00$MainContent$hfFlag']               = ''; //OK
    post['ctl00$MainContent$hfInicial']            = this.annio; //OK
    return post;
  }


  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

}