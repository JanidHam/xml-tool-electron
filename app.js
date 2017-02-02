const remote = require('electron').remote
const main = remote.require('./main')
const path = require('path')

const ServicioCfdi = require('./vendor/sat/descargasatjs/serviciocfdi')


let servicioCfdi = new ServicioCfdi('CSA121031G52', 'CS100756')

let descarga = servicioCfdi.descargarPorAnnioMesYDia(__dirname, '2016', '12')