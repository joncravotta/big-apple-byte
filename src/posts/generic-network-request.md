---
layout: post
title:  "Generic network reponse"
date:   "2017-08-02"
categories: Swift
---

### Using generics for network responses

Sometimes I would find myself repeating similar code for network responses. For example:


```swift
enum UserResponse {
    case success(User)
    case error(NSError)
}

enum ProductResponse {
    case success(Product)
    case error(NSError)
}
```


These are practically the same, the only thing different is the model being returned by a successful request.  This calls for a generic!


```swift
enum NetworkResponse<T> {
    case success(T)
    case error(NSError)
}
```

This generic enum will refer to whatever type is passed into it. Lets see it in action:

```swift
struct User {
    let name: String
}

func userRequest(completion:(NetworkResponse<User>)->()) {
    let userFromServer = User(name: "Jon")
    return completion(.success(userFromServer))
}

userRequest { (response) in
    switch response {
    case .success(let user):
        print(user.name)
        // prints Jon
    case .error(let err):
        print(err.code)
    }
}
```


And just like that we have a generic network response that we can use with any type of model.  This little trick we clean up a bunch of unnecessary code.  Lets see how it looks with a product request:


```swift
struct Product {
    let id: Int
}

func productRequest(completion:(NetworkResponse<Product>)->()) {
    let productFromServer = Product(id: 12345678910)
    return completion(.success(productFromServer))
}

productRequest { (response) in
    switch response {
    case .success(let product):
        print(product.id)
        // prints 12345678910
    case .error(let err):
        print(err.code)
    }
}
```


And thats it! A great simple use case for generics.
