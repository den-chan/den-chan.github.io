function init () {
  function em (id) { return window.getComputedStyle($(id)).fontSize.slice(0, -2) }
  function addEvents (obj) {
    for (var id in obj) for (var e in obj[id]) {
      var el = id ? $(id) : window, a = e.split(" "), b = a.length;
      while (b--) el.addEventListener(a[b], obj[id][e].bind(el), false)
    }
  }
  function resize () { 
    $("form").style.height = $("render").style.height = this.innerHeight + "px";
    $("body").style.minHeight = this.innerHeight - .6 * em("body") - 3 + "px";
  }
  function generate () {
    var offset = $("render").scrollTop ? $("render").scrollHeight - $("render").scrollTop : Infinity;
    $("blog").innerHTML = "";
    write(localStorage.body = $("body").value);
    $("render").scrollTop = $("render").scrollHeight - offset;
    var offset = $("form").scrollTop ? $("form").scrollHeight - $("form").scrollTop : Infinity;
    $("body").style.height = "auto";
    $("body").style.minHeight = "";
    $("body").style.height = $("body").scrollHeight - .6 * em("body") + 2 + "px";
    $("form").scrollTop = $("form").scrollHeight - offset
    resize()
  }
  addEvents({ body: { change: generate, "cut paste drop keydown": function () { window.setTimeout(generate, 0) } }, "": { resize: resize } });
  $("body").value = localStorage.body;
  generate();
  ajax('GET', "https://den-chan.herokuapp.com/one.txt", true)
}