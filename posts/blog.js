init()

function $ (a) { return document.getElementById(a) }
function ajax (method, url, ta) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) xhr.open(method, url, true);
  else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url)
  } else throw new Error('CORS not supported');
  xhr.onload = function() {
    if (ta) write( $("body").value = localStorage.body === "" ? xhr.responseText : localStorage.body );
    else write( xhr.responseText )
  };
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send();
  return xhr
}
function write (raw) {
  //  **bold**  //italic//  ``monospaced``  [[link url]]  [[link url|link text]]
  //  >quote (\>no quote)  ␣␣↵line break  ↵↵paragraph  #(#..)header#  #timestamp header||#
  function escape (text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML
  }
  var r = escape(raw), newline = r.indexOf("\r\n") !== -1 ? "\r\n" : r.indexOf("\n") !== -1 ? "\n" : "";
  r = r
    .replace(new RegExp(" + " + newline, "g"), "<br />" + newline)
    .replace(/(#{1,5})(((?!\|\|).)*)?(\|\|[^#]*)?#/g, function ($0, $1, $2, _, $3, i) {
      var ix = i + $1.length + ($2 = $2 || "").length + 2;
      if ($3 === "||") {
        $("body").value = $("body").value.slice(0, ix) + new Date(Date.now()).toISOString() + $("body").value.slice(ix + $3.length - 2, Infinity);
        $("body").setSelectionRange(ix, ix);
      }
      var l = $1.length + 1;
      if (l === 2) {
        var slug = encodeURI( $2.replace(/\s+/g, "-").replace(/\*\*(.*)\*\*/g, "$1").replace(/``(.*)``/g, "$1")
          .replace(/^/," ").replace(/([^:])\/\/(((?!\/\/)[\s\S])*)\/\//gm, "$2").replace(/^ /,"")
          .replace(/\[\[([^\]|]*)\]\]/g, "$1").replace(/\[\[([^|]*)\|([^\]]*)\]\]/g, "$2")
          .replace(/[^\w\-.~!$&'()*+,;=:@]/g, "").toLowerCase() );
        return "<header><a class='hashlink' id='" + slug + "' href='#" + slug + "'></a><h2 class='title'>" + $2 +
          "</h2><time class='timestamp'>" + (($3 && $3.slice(2, Infinity)) || new Date(Date.now()).toISOString()) + "</time></header>"
      } else return "<h" + l + ">" + $2 + "</h" + l + ">"
    })
    .replace(/``([^`]*)``/g, "<code>$1</code>") //incorrect. redo as textNode
    .replace(/\*\*([^*]*)\*\*/g, "<strong>$1</strong>")
    .replace(/^/," ").replace(/([^:])\/\/(((?!\/\/)[\s\S])*)\/\//gm, "$1<em>$2</em>").replace(/^ /,"")
    .replace(/\[\[([^\]|]*)\]\]/g, function ($0, $1) { return "<a href='" + $1.replace(/'/g, "&apos;") + "'>" + $1 + "</a>" })
    .replace(/\[\[([^|]*)\|([^\]]*)\]\]/g, function ($0, $1, $2) { return "<a href='" + $1.replace(/'/g, "&apos;") + "'>" + $2 + "</a>" });
  for (var p = (newline === "" ? [r] : r.split(newline + newline)), i = 0; i < p.length; i++) {
    p[i] = p[i]
      .replace(/^&gt;(.*)/g, "<blockquote>$1</blockquote>").replace(/^\\&gt;/g, "&gt;")
      .replace(/^( +)/g, function (match) { return match.replace(/\s/g,"&nbsp;") });
    p[i] = p[i].replace(/([\s\S]+)/g, "<p>$1</p>")
  }
  document.getElementById("blog").innerHTML = p.join(newline);
  var
    hashes = document.querySelectorAll("#render a.hashlink"),
    titles = document.querySelectorAll("#render .title"),
    i = hashes.length;
  while (i--) hashes[i].style.height = titles[i].clientHeight + "px"
}