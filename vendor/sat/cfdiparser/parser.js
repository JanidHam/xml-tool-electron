const jsdom = require("jsdom");

export default class CfdiParse {

  constructor() {
    this.xml
    this.ns
    this.cfdi
  }

  procesarXML(file) {
    this.xml = jsdom.env(file, (err, window) => {
      console.log('done');
    })

    this.cfdiToArray()
    
  }

  cfdiToArray() {
    for (let cfdi of this.xml.xpath('//cfdi:Comprobante')) {
      this.cfdi['version'] = cfdi['version']
    }
  }

  getListXMLS(path) {
    console.log(path)
  }

}