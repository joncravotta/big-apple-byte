---
title:  "Mapping until index"
date:   "2017-08-01"
categories: Swift
---
### Fun with maps

I came across this at work the other day and a co worker showed me an interesting solution.  I was trying to map up until a certain index but it didnt feel swifty enough.


Here was my first iteration for getting the first 4 ids from an array of products.

```swift
let ids:[String] = []

for i in 0..<4 {
    ids.append(products[i].ids)
}
```

As you can see this is not swifty at all,  the swiftier way is to use a map like this:

```swift
let ids:[String] = products[0..<4].map({$0.id})
```

You can limit the sizes of the array by accessing with `[0..<4]`.

That will contain the array to 4 indexes, and then we just map over those to get the ids.
