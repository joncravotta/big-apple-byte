---
layout: post
title:  "Bindable Views"
date:   "2017-10-12"
categories: Swift
---
### Supporting views with different data types in ios
Writing dry code is an important principle in software development, but sometimes writing dry ui code can be difficult.  In this post I’m gonna go over how we can write flexible ui components that can have longevity in your project.

It’s very common for a long running project to swap out external apis.  Maybe a company is moving over to a newer api with a different schema.  Migrating overnight is unrealistic so that means your app may be living with two different data types for the same thing.

Living in these conditions can create some ugly code, but there some quick easy patterns to follow to avoid this.

Let’s say you have a `LegacyProduct` model existing in your app already along with a corresponding `LegacyProductView`.   

Then five years pass by and its time to migrate to a new api.  We now introduce a `NewProduct` model.   At first glance it might make sense to create a `NewProductView`.  But lets take a step back and see how we can write some dry code to  create a  `ProductView` to accompany two different data types.

```swift
class ProductView: UIView {

    var productNameText: String = "" {
        didSet {
            productNameLabel.text = productNameText
        }
    }

    var priceText: String = "" {
        didSet {
            priceLabel.text = priceText
        }
    }

    var productImage: UIImage? = nil {
        didSet {
            guard let image = productImage else { return }
            imageView.image = image
        }
    }

    private let productNameLabel = UILabel()
    private let priceLabel = UILabel()
    private let imageView = UIImageView()

    init() {
        super.init(frame: .zero)
        setUpView()
    }

    private func setUpView() {
        // ...
    }
}
```

We start off by creating our view with all the necessary properties already instantiated.  Using computed properties here is important, notice how everything is a default type like String + UIImage.  By having no custom types our ui stays flexible.  By utilizing `didSet` we can update our views ui when new data is passed.

Next this leaves us to create binders to bind data to our view, this is how our view can be a sponge when it comes to different models.

```swift
extension ProductView {
    func bind(with newProduct: NewProduct) {
        self.productNameText = newProduct.info.name
        self.priceLabel = newProduct.info.price
        self.productImage = newProduct.info.image
    }

    func bind(with legacyProduct: LegacyProduct) {
        self.productNameText = legacyProduct.name
        self.priceLabel = legacyProduct.price
        self.productImage = legacyProduct.image
    }
}
```

After creating our binders we can see this leaves our ui code unchanged and flexible for the future.  

Setting this ui up would look something along the lines of this:

```swift
let productView = ProductView()
productView.bind(with: newProductModel)
```

And thats it!  I try to follow patterns like this as often as possible and find that it makes a huge different when new features come down the line.  It can really cut down the time of refactoring.  You’ll be thanking yourself in the future.
