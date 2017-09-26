EventFish = function(element){
  Object.defineProperty(this, 'rootElement', {
    value: element,
    writable: false
  })

  this.watchList = {}
  this.watchHandlerList = {}
}

EventFish.prototype.warn = function(subject){
  console.warn('EventFish: ' + subject);
}

EventFish.prototype.watchHandler = function(eventObject){
  this.watchList[eventObject.type].forEach(function scanWatchList(watchItem){
    this.rootElement.querySelectorAll(watchItem.selector).forEach(function matchWatchItem(possibleItem){
      if (possibleItem == eventObject.target){
        watchItem.handler(eventObject)
      }
    }.bind(this))
  }.bind(this))
}

EventFish.prototype.addWatchList = function(eventType, selector, handler){
  if (!this.watchList[eventType]){
    this.watchList[eventType] = []
    this.watchHandlerList[eventType] = function(e){this.watchHandler(e)}.bind(this)
    this.rootElement.addEventListener(eventType, this.watchHandlerList[eventType])
  }
  this.watchList[eventType].forEach(function checkWatchItem(item){
    if (item.selector == selector){
      this.warn('duplicate selector of the same event detected')
    }
  })
  this.watchList[eventType].push({
    selector: selector,
    handler: handler
  })
}
