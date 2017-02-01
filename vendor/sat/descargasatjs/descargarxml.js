const jsdom = require("jsdom");
const encoding = require("encoding");

export default class DescargarXML {
    
    constructor(sesion, htmlSource, direccionDescarga) {
        this.sesion = sesion
        this.htmlSource = htmlSource
        this.direccionDescarga = direccionDescarga
        this.listaXML = []
        this.listaArchsXML = []
    }

    obtenerEnlacesYDescargar(nombreDefault = '') {
        console.info('EMPIEZA obtenerEnlacesYDescargar()')
        let i = 1

        let myHTML = encoding.convert(this.htmlSource, 'HTML-ENTITIES', 'ISO-8859-1')

        let dom = jsdom.jsdom(myHTML);

        console.log(dom)
    }

    obtenerListaDeDocumentosDescargados() {
        return this.listaXML
    }

    obtenerListaArchsDeDocumentosDescargados() {
        return this.listaArchsXML
    }

    descargarXML(urlXML, name) {
        let pathDescarga = this.direccionDescarga + name
        
        console.log(pathDescarga)
    }
}