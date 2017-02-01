const jsdom = require("jsdom");
const encoding = require("encoding");

export default class HTMLForm {
  
  constructor(htmlSource, xpathForm) {
    this.xpathForm = xpathForm
    this.htmlSource = htmlSource
    this.contador = 0
  }

  getFormValues() {
    let inputValues = this.readInputValues()
    let selectValues = this.readSelectValues()

    let values = [].concat(inputValues, selectValues)
    return values
  }

  readInputValues() {
    return this.readAndGetValues('input')
  }

  readSelectValues() {
    return this.readAndGetValues('select')
  }

  readAndGetValues(element) {
    let dom = jsdom.jsdom(this.htmlSource)

    console.log(dom)

    return []
  }
}