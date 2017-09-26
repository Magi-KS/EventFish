# EventFish
Cast your net on a root element and catch all event matching selectors on your watch list.

```javascript
var net = new EventFish(document.body)

net.addWatchList('click', 'div.capture', function(e){
  console.log('this div got clicked')
})

net.addWatchList('click', 'a.capture', function(e){
  e.preventDefault()
  console.log('this a got clicked and prevented default')
})
```
