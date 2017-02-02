const PortalCfdi = require('./portalcfdi')
const FiltrosRecibidos = require('./filtrosrecibidos')
const FiltrosEmitidos = require('./filtrosemitidos')

class ServicioCfdi {
  constructor(rfc, contrasena) {
    this.rfc = rfc
    this.contrasena = contrasena
    this.resultado = false
    this.mensajeError = ''
    this.listaDocumentosDescargados = []
    this.listaArchsDocumentosDescargados = []
  }

  peticionPortalCfdi(directorioAGuardar, filtros) {
    let portalCfdi = new PortalCfdi(this.rfc, this.contrasena)
    this.resultado = portalCfdi.consultar(directorioAGuardar, filtros)
    if (!this.resultado) {
      this.mensajeError = portalCfdi.obtieneMensajeError()
    } else {
      this.listaDocumentosDescargados = portalCfdi.obtieneListaDocumentosDescargados()
      this.listaArchsDocumentosDescargados = portalCfdi.obtieneListaArchsDocumentosDescargados()
    }

    return this.resultado
  }

  /***************************
  /****   RECEPCION *********/
  descargarPorAnnioMesYDia(directorioAGuardar, annio, mes, dia) {
      let filtros = new FiltrosRecibidos();
      filtros.annio = annio;
      filtros.mes = mes;
      filtros.dia = dia;
      return this.peticionPortalCfdi(directorioAGuardar, filtros);
  }
}

module.exports = ServicioCfdi;