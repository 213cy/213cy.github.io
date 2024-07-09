function aaa(x) {
  this.x = x;
  this.sub = null;
}

function bbb(x,sup) {
  this.sup = sup;
  this.y = x;
}

function strings() {
  var result = new Array(10000);
  for (var i = 0, l = result.length; i < l; ++i)
    result[i] = new aaa(i.toString());
  return new aaa(result);
}

function init() {
  aaaaaa= new aaa('AAAAAAA');
  bbbbbb = new bbb('BBBBBBB',aaaaaa)
  aaaaaa.sub = bbbbbb;
}
