var domify = require('domify')
  , tmpl = domify(require('./template'))[0]
  , View = require('view')
  , bus = require('bus')

module.exports = OpportunityRow;

function OpportunityRow(opportunity) {
  View.call(this, opportunity, tmpl.cloneNode(true))
  this.el.addEventListener('click', this.onclick.bind(this));
}

OpportunityRow.prototype.onclick = function(ev) {
  console.log("show", this.obj, ev)
}

OpportunityRow.prototype.href = function() {
  return '/opportunities/' + this.obj.slug;
}

OpportunityRow.prototype.tileImg = function() {
  return this.obj.image_urls.tile_image;
}
