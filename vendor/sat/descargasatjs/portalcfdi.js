const Promise = require('bluebird')
const co = require('co')
const request = require("request")
const sp = require('superagent');
const SatHeader = require('./header')
const HTMLForm = require('./htmlform')
const ParserFormatSAT = require('./parserformatsat')
const Utilerias = require('./utilerias')
const DescargarXML = require('./descargarxml')

class PortalCfdi {

  constructor(rfc,  contrasena) {
    let header = new SatHeader()

    this.rfc = rfc
    this.contrasena = contrasena
    this.sesion = request.defaults({jar: true})
    this.sp = sp.agent()
    this.directorioAGuardar = ''
    this.header = header
    this.hostCfdiau = 'cfdiau.sat.gob.mx'
    this.hostPortalCfdi = 'portalcfdi.facturaelectronica.sat.gob.mx'
    this.urlCfdiau = 'https://' + this.hostCfdiau + '/'
    this.urlPortalCfdi = 'https://' + this.hostPortalCfdi + '/'
    this.urlCfdiCont = 'https://cfdicontribuyentes.accesscontrol.windows.net/'
    this.error = ''
    this.listaDocumentos = []
    this.listaArchsDocumentos = []
  }

  entrarAlaPaginaInicio() {
    let url = this.urlCfdiau + '/nidp/app/login?id=SATUPCFDiCon&sid=0&option=credential&sid=0'
    let $this = this
    return co(function *(){
      try {
        // let htmlRespuesta = yield new Promise((resolve, reject) => {
        //   $this.sesion.post(url, (err, resp, body) => {
        //     if (err) reject(err)

        //     resolve(body)
        //   })
        // })
        let htmlRespuesta = yield new Promise( (resolve, reject) => {
          $this.sp.post(url).end((err, res) => {
            if (err) reject(err)

            resolve(res.text)
          })
        })
      } catch (err) {
        console.error(err.message); // "boom"
    }
    }).catch(this.onerror);
  }

  enviarFormularioConCIEC() {
    let $this = this
    let url = this.urlCfdiau + 'nidp/app/login?sid=0&sid=0'
    let encabezados = this.header.obtener(this.hostCfdiau, this.urlCfdiau + 
          '/nidp/app/login?id=SATUPCFDiCon&sid=0&option=credential&sid=0')

    let valoresPost = {
      'option'        : 'credential',
      'Ecom_User_ID'  : this.rfc,
      'Ecom_Password' : this.contrasena,
      'submit'        : 'Enviar'
    }

    return co(function *() {
      try {
        // let htmlRespuesta = yield new Promise((resolve, reject) => {
        //   $this.sesion({ 
        //     method: 'POST',
        //     uri: url, 
        //     body: JSON.stringify(valoresPost), 
        //     headers: encabezados
        //     },
        //     (err, resp, body) => {
        //       if (err) reject(err)

        //       resolve(body)
        //     })
        // })

        let htmlRespuesta = yield new Promise((resolve, reject) => {
          $this.sp
            .post(url)
            .set(encabezados)
            .send(valoresPost)
            .end((err, resp) => {
              if (err) reject(err)

              resolve(resp.text)
            })
        })
      } catch (err) {
        console.error(err.message); // "boom"
    }
    }).catch(this.onerror);
  }

  leerFormulario(html) {
    let htmlFormulario = new HTMLForm(html, 'form')
    let inputValores = htmlFormulario.getFormValues()

    return inputValores
  }

  leerFormularioDeRespuesta() {
    let url = this.urlPortalCfdi
    let $this = this
    return co(function *(){
      try {
        // let htmlRespuesta = yield new Promise((resolve, reject) => {
        //   $this.sesion.get(url, (err, resp, body) => {
        //     if (err) reject(err)
        //     console.log(resp)
        //     resolve(body)
        //   })
        // })

        let htmlRespuesta = yield new Promise((resolve, reject) => {
          $this.sp
            .get(url)
            .end((err, resp) => {
              if (err) reject(err)
              console.log(resp)
              resolve(resp.text)
            })
        })

        return $this.leerFormulario(htmlRespuesta)
      } catch (err) {
        console.error(err.message); // "boom"
      }
    }).catch(this.onerror);
  }

  leerFormularioDeAccessControl(valoresPost) {
    let url = this.urlCfdiCont + 'v2/wsfederation'
    let $this = this
    return co(function *(){
      try {
        // let respuesta = yield new Promise((resolve, reject) => {
        //   $this.sesion.post(url, { body: JSON.stringify(valoresPost) }, (err, resp, body) => {
        //     if (err) reject(err)

        //     resolve(body)
        //   })
        // })

        let respuesta = yield new Promise((resolve, reject) => {
          $this.sp
            .post(url)
            .send(valoresPost)
            .end((err, resp) => {
              if (err) reject(err)

              resolve(resp.text)
            })
        })


        return $this.leerFormulario(respuesta)
      } catch (err) {
        console.error(err.message); // "boom"
    }
    }).catch(this.onerror);    
  }

 entrarAPantallaInicioSistema(valoresPost) {
   let url = this.urlPortalCfdi
   let $this = this
   return co(function *(){
      try {
        // let respuesta = yield new Promise((resolve, reject) => {
        //   $this.sesion.post(url, { body: JSON.stringify(valoresPost) }, (err, resp, body) => {
        //     if (err) reject(err)

        //     resolve(body)
        //   })
        // })

        let respuesta = yield new Promise((resolve, reject) => {
          $this.sp
            .post(url)
            .send(valoresPost)
            .end((err, resp) => {
              if (err) reject(err)

              resolve(resp.text)
            })
        })

        return respuesta
      } catch (err) {
        console.error(err.message); // "boom"
    }
    }).catch(this.onerror);
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
    let $this = this
    let url = this.urlPortalCfdi + 'Consulta.aspx'

    return co(function *() {
      try {
        let post = $this.obtenerValoresPostDelTipoDeBusqueda(htmlFuente)
        let encabezados = $this.header.obtener($this.hostCfdiau, $this.urlPortalCfdi)
        // let respuesta = yield new Promise((resolve, reject) => {
        //   $this.sesion.post(url, { body: JSON.stringify(post), headers: encabezados }, (err, resp, body) => {
        //     if (err) reject(err)

        //     resolve(body)
        //   })
        // })

        let respuesta = yield new Promise((resolve, reject) => {
          $this.sp
            .post(url)
            .set(encabezados)
            .send(post)
            .end((err, resp) => {
              if (err) reject(err)

              resolve(resp.text)
            })
        })

        return respuesta
      } catch (err) {
        console.error(err.message); // "boom"
      }
    }).catch(onerror);
  }

  logueoDeUsuarioConCIEC() {
    let $this = this

    return co(function *(){
      try {
        yield $this.entrarAlaPaginaInicio()
        yield $this.enviarFormularioConCIEC()
        let valoresPost = yield $this.leerFormularioDeRespuesta()
        let valoresPostAccessControl = yield $this.leerFormularioDeAccessControl(valoresPost)
        let html = yield $this.entrarAPantallaInicioSistema(valoresPostAccessControl)
        $this.seleccionarTipo(html)
      } catch (err) {
        console.error(err.message); // "boom"
      }
    }).catch(onerror);
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
    let $this = this

    return co(function *(){
      try {
        yield $this.logueoDeUsuarioConCIEC()
        let htmlRespuesta
        let nombre
        if (filtros.folioFiscal != '') {
          htmlRespuesta = $this.consultaReceptorFolio(filtros)
          nombre = filtros.folioFiscal
        } else {
          htmlRespuesta = $this.consultaReceptorFecha(filtros)
          nombre = ''
        }

        let xml = new DescargarXML($this.sp, htmlRespuesta, directorioAGuardar)
        xml.obtenerEnlacesYDescargar(nombre)
        $this.listaDocumentos = xml.obtenerListaDeDocumentosDescargados()
        $this.listaArchsDocumentos = xml.obtenerListaArchsDeDocumentosDescargados()
        return true
      } catch (err) {
        console.error(err.message); // "boom"
      }
    }).catch(onerror);

    // try {
    //   this.logueoDeUsuarioConCIEC()
    //   // let htmlRespuesta
    //   // let nombre
    //   // if (filtros.folioFiscal != '') {
    //   //   htmlRespuesta = this.consultaReceptorFolio(filtros)
    //   //   nombre = filtros.folioFiscal
    //   // } else {
    //   //   htmlRespuesta = this.consultaReceptorFecha(filtros)
    //   //   nombre = ''
    //   // }

    //   // let xml = new DescargarXML(this.sesion, htmlRespuesta, directorioAGuardar)
    //   // xml.obtenerEnlacesYDescargar(nombre)
    //   // this.listaDocumentos = xml.obtenerListaDeDocumentosDescargados()
    //   // this.listaArchsDocumentos = xml.obtenerListaArchsDeDocumentosDescargados()
    //   return true      
    // }
    // catch (ex) {
    //   console.log(ex)
    //   this.error = ex
    //   return false
    // }
  }

  entrarConsultaReceptor(filtros) {
    let url = this.urlPortalCfdi + 'ConsultaReceptor.aspx'
    
  }

  onerror(err) {
    console.error(err.stack);
  }
}

module.exports = PortalCfdi;