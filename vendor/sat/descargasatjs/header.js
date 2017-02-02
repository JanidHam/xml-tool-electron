class SatHeader {
  
  obtener(host, referer) {
    let encabezado = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'Host': host,
      'Referer': referer,
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS;rv:11.0) like Gecko',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    return encabezado;
  }
  
  obtenerAJAX(host, referer) {
    let encabezado = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Host': host,
      'Referer': referer,
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS;rv:11.0) like Gecko',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-MicrosoftAjax': 'Delta=true',
      'x-requested-with': 'XMLHttpRequest',
      'Pragma': 'no-cache'
    }
    return encabezado;
  }
}

module.exports = SatHeader;