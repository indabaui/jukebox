var domify = require('domify')
  , tmpl = domify(require('./template'))[0]
  , View = require('view')
  , bus = require('bus')

module.exports = OpportunityItem;

function OpportunityItem(opportunity) {
  View.call(this, opportunity, tmpl.cloneNode(true))
  this.el.addEventListener('click', this.onclick.bind(this));
}

OpportunityItem.prototype.onclick = function(ev) {
  console.log("show", this.obj, ev)
}

OpportunityItem.prototype.href = function() {
  return '/opportunities/' + this.obj.slug;
}

OpportunityItem.prototype.tileImg = function() {
  return this.obj.image_urls.tile_image;
}
