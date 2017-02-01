const request = require('request');
import { SatHeader } from './header'
import { HTMLForm } from './htmlform'
import { ParserFormatSAT } from './parserformatsat'
import { Utilerias } from './utilerias'
import { DescargarXML } from './descargarxml'

export default class PortalCfdi {

  constructor(rfc,  contrasena) {
    let header = new SatHeader()

    this.rfc = rfc
    this.contrasena = contrasena
    this.sesion = request.defaults({jar: true})
    this.directorioAGuardar = ''
    this.header = header
    this.hostCfdiau = 'cfdiau.sat.gob.mx'
    this.hostPortalCfdi = 'portalcfdi.facturaelectronica.sat.gob.mx'
    this.urlCfdiau = 'https://' + this.hostCfdiau + '/'
    this.urlPortalCfdi = 'https://' + this-hostPortalCfdi + '/'
    this.urlCfdiCont = 'https://cfdicontribuyentes.accesscontrol.windows.net/'
    this.error = ''
    this.listaDocumentos = []
    this.listaArchsDocumentos = []
  }

  entrarAlaPaginaInicio() {
    let ulr = this.urlCfdiau + '/nidp/app/login?id=SATUPCFDiCon&sid=0&option=credential&sid=0'
    this.sesion.post(url, (err, httpResponse, body) => {
      console.log(body)
    })
  }

  enviarFormularioConCIEC() {
    let ulr = this.url + 'nidp/app/login?sid=0&sid=0'
    let encabezados = this.header.obtener(this.hostCfdiau, this.urlCfdiau + '/nidp/app/login?id=SATUPCFDiCon&sid=0&option=credential&sid=0')

    let valoresPost = [
      'option'        ='credential',
      'Ecom_User_ID'  =this.rfc,
      'Ecom_Password' =this.contrasena,
      'submit'        ='Enviar'
    ]

    this.sesion.post(url, { body: this.valoresPost, headers: encabezados, cookies: true, future: true, verify: false})
  }

  leerFormulario(html) {
    let htmlFormulario = new HTMLForm(html, 'form')
    let inputValores = htmlFormulario.getFormValues()
    
    console.log(inputValores)

    return inputValores
  }

  leerFormularioDeRespuesta() {
    let url = this.urlPortalCfdi
    let respuesta = this.sesion.get(url, { cookies: true, future: true, verify: false}, (err, httpResp, body) => {
      return this.leerFormulario(body)
    })
  }

  leerFormularioDeAccessControl(valoresPost) {
    let url = this.urlCfdiCont + 'v2/wsfederation'

    this.sesion.post(url, { body: valoresPost, cookies: true, future: true, verify: false}, (err, httpResp, body) => {
      return this.leerFormulario(body)
    })
  }

 entrarAPantallaInicioSistema(valoresPost) {
   let url = this.urlPortalCfdi

   this.sesion.post(url, { body: valoresPost, cookies: true, future: true, verify: false}, (err, httpResp, body) => {
      return body
    })
 }

  obtenerValoresPostDelTipoDeBusqueda(htmlFuente) {
    let inputValores = this.leerFormulario(htmlFuente)
    
    inputValores['ctl00$MainContent$TipoBusqueda'] = 'RdoTipoBusquedaReceptor';
    inputValores['__ASYNCPOST'] = 'true';
    inputValores['__EVENTTARGET'] = '';
    inputValores['__EVENTARGUMENT'] = '';
    inputValores['ctl00$ScriptManager1'] = 'ctl00$MainContent$UpnlBusqueda|ctl00$MainContent$BtnBusqueda';
    
    return inputValores;
  }

  seleccionarTipo(htmlFuente) {
    let url = this.urlPortalCfdi + 'Consulta.aspx'
    let post = this.obtenerValoresPostDelTipoDeBusqueda(htmlFuente)

    let encabezados = this.header.obtener(this.hostCfdiau, this.urlPortalCfdi)

    this.sesion.post(url, { body: valoresPost, cookies: true, future: true, verify: false}, (err, httpResp, body) => {
      return body
    })
  }

  logueoDeUsuarioConCIEC() {
    this.entrarAlaPaginaInicio()
    this.enviarFormularioConCIEC()
    let valoresPost = this.leerFormularioDeRespuesta()
    let valoresPostAccessControl = this.leerFormularioDeAccessControl(valoresPost)

    let html = this.entrarAPantallaInicioSistema(valoresPostAccessControl)

    this.seleccionarTipo(html)
  }

  obtenerValoresPostBusquedaFechas(htmlFuente, inputValores, filtros) {
    let parser = new ParserFormatSAT( htmlFuente)
    let valoresCambioEstado = parser.obtenerValoresFormulario()

    let util = new Utilerias()
    let temporal = util.mergeListas(inputValores, filtros)

    return util.mergeListas(temporal, valoresCambioEstado)
  }

  obtieneMensajeError() {
    return this.error
  }

  obtieneListaDocumentosDescargados() {
    this.listaDocumentos
  }  

  obtieneListaArchsDocumentosDescargados() {
    return this.listaArchsDocumentos
  }

  consultar(directorioAGuardar, filtros) {
    try {
      this.logueoDeUsuarioConCIEC()
      let htmlRespuesta
      let nombre
      if (filtros.folioFiscal != '') {
        htmlRespuesta = this.consultaReceptorFolio(filtros)
        nombre = filtros.folioFiscal
      } else {
        htmlRespuesta = this.consultaReceptorFecha(filtros)
        nombre = ''
      }

      let xml = new DescargarXML(this.sesion, htmlRespuesta, directorioAGuardar)
      xml.obtenerEnlacesYDescargar(nombre)
      this.listaDocumentos = xml.obtenerListaDeDocumentosDescargados()
      this.listaArchsDocumentos = xml.obtenerListaArchsDeDocumentosDescargados()
      return true      
    }
    catch (ex) {
      console.log(ex)
      this.error = ex
      return false
    }
  }

  entrarConsultaReceptor(filtros) {
    let url = this.urlPortalCfdi + 'ConsultaReceptor.aspx'
    
  }
}