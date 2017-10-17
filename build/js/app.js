notifyIsActive = false
function notify(opts) {
  if (notifyIsActive) return
  notifyIsActive = true
  var title = opts.title || '',
      msg = opts.message || '',
      style = opts.style != '' ? `toast-${opts.style}` : '',
      full = opts.fullWidth || false,
      dur = opts.duration || 3000
  $('#toast').find('.title').text(title).end()
             .find('.text').text(msg).end()
             .addClass(`${style}${full ? ' full-width' : ''}`).fadeIn()
  setTimeout(function() {
    $('#toast').fadeOut(500, function() {
      $('#toast').removeClass(`${style} full-width`)
      notifyIsActive = false
    })
  }, dur)
}

function serverReachable(url) {
  // IE vs. standard XHR creation
  var x = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" ),
      s;
  x.open(
    // requesting the headers is faster, and just enough
    "HEAD",
    url,
    // make a synchronous request
    false
  );
  try {
    x.send();
    s = x.status;
    // Make sure the server is reachable
    return ( s >= 200 && s < 300 || s === 304 );
  // catch network & other problems
  } catch (e) {
    return false;
  }
}

function fixLocalDNS(iframe) {
  let l = document.createElement("a")
  l.href = iframe.src

  /* ask the server for the dns resolution */
  $.getJSON(
    window.location.origin + "/dns?hostname=" + l.hostname,
    function (data) {
      if (data.err) {
        console.err(data.err)
      }
      else {
      /* set the url to instead use the IP address */
        let src = l.protocol+ "//" + data.address
        if (l.port) {
          src += ":" + l.port
        }
        if (l.path) {
          src += "/" + l.path
        }
        if (l.search) {
          src += l.search
        }
        /* set the new url in the iFrame */
        iframe.src = src
      }
    })
}

let i, frames;
frames = document.getElementsByTagName("iframe");
/* go through all iFrames in the page and check DNS */
for (i = 0; i < frames.length; ++i)
{
  let href = frames[i].src

  let l = document.createElement("a");
  l.href = href;
  
  if (!serverReachable(l.href)) {
    fixLocalDNS(frames[i], l.hostname)
  }
}