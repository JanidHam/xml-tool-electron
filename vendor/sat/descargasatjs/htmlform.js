const jsdom = require("jsdom");
const encoding = require("encoding");
const select = require('xpath.js')
const dom = require('xmldom').DOMParser
const cheerio = require('cheerio')

class HTMLForm {
  
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
    
    var xml = this.htmlSource
    var doc = new dom().parseFromString(xml, "text/xml") 

    var inputValues = []// = select(doc, `//${this.xpathForm}/${element}`)

    for (let input of select(doc, `//${this.xpathForm}/${element}`)) {
      input = cheerio.load(input.toString())
      inputValues[input(element).attr('name')] = input(element).attr('value')
    }

    return inputValues
  }
}

module.exports = HTMLForm;