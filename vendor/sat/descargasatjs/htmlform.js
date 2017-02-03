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

    let values = Object.assign(inputValues, selectValues)
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

    var inputValues = {}// = select(doc, `//${this.xpathForm}/${element}`)
    let obj = {}
    for (let input of select(doc, `//${this.xpathForm}/${element}`)) {
      input = cheerio.load(input.toString())
      let name = input(element).attr('name')
      let value = input(element).attr('value')
      obj[name] = value
      Object.assign(inputValues, obj)
      //inputValues.push({ name: name, value: value })
      // inputValues[input(element).attr('name')] = input(element).attr('value')
    }

    return inputValues
  }
}

module.exports = HTMLForm;