export default class ParserFormatSAT {
  
  constructor(fuente) {
    this.fuente = fuente
    this.valores = []
    this.items = []
    this.ordenados = []
    this.validos = ['EVENTTARGET', '__EVENTARGUMENT', '__LASTFOCUS', '__VIEWSTATE']
  }

  procesar() {
    this.valores = this.fuente.split('|')
  }

  ordenaValores() {
    let name = ''
    this.ordenados = []

    for (let i = 0; this.valores.length; ++i) {
      let item = this.valores[i]

      if (this.validos.indexOf(item) > -1) {
        name = item;
        ++i
        item = this.valores[i]
        this.items[name] = item
        name = ''
      }
    }

  }

  obtenerValoresFormulario() {
    this.procesar()
    this.ordenaValores()
    return this.items
  }
}