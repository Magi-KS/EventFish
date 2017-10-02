var EventFish = function(element, options = {}){
  Object.defineProperty(this, 'rootElement', {
    value: element,
    writable: false
  })

  this.passiveListen = options.passive || true
  this.watchList = {}
  this.watchHandlerList = {}
}

EventFish.prototype.warn = function(subject){
  console.warn('EventFish: ' + subject);
}

EventFish.prototype.watchHandler = function(eventObject){
  this.watchList[eventObject.type].forEach(function scanWatchList(watchItem){
    if (this.elementMatchesSelector(eventObject.target, watchItem.selector)){
      watchItem.handler(eventObject)
    }
  }.bind(this))
}

EventFish.prototype.addWatchList = function(eventType, selector, handler){
  if (!this.watchList[eventType]){
    this.watchList[eventType] = []
    this.watchHandlerList[eventType] = function(e){this.watchHandler(e)}.bind(this)
    this.rootElement.addEventListener(eventType, this.watchHandlerList[eventType], {passive: this.passiveListen})
  }
  this.watchList[eventType].forEach(function checkWatchItem(item){
    if (item.selector == selector){
      this.warn('duplicate selector of the same event detected')
    }
  }.bind(this))
  this.watchList[eventType].push({
    selector: selector,
    handler: handler
  })
}

// encapsulated polyfill for Element.matches
// adapted from MDN https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
EventFish.prototype.elementMatchesSelector = function(element, selector){
  if (!Element.prototype.matches){
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector
  }

  if(Element.prototype.matches){
    return element.matches(selector)
  }
  else{ //worst case fall back, unable to capture lements removed from DOM
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length
    while (--i >= 0 && matches.item(i) !== this) {}
    return i > -1
  }
}

module.exports = EventFish
