---
layout: post
title:  "Model controller protocol"
date:   '2017-10-08'
categories: Swift
---

## Reusable delegation between model controllers and views

Using the __[delegation](http://cognitivedesign.com/papers/understanding-delegation-in-ios.html)__ pattern in ios is extremely common, it's __[recommended by apple](https://developer.apple.com/library/content/documentation/General/Conceptual/DevPedia-CocoaCore/Delegation.html)__. It is a way to let two pieces of code talk to eachother, perfect for MVC.  For example your model controller can let your view controller know it has updated its data, a very common practice in any app.

Apples explanation:
> Delegation is a simple and powerful pattern in which one object in a program acts on behalf of, or in coordination with, another object.

Something I see developers do is create a delegation pattern for every mc + vc, but thats not very __[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)__, most cases you need to do the same three things:

Let your views know when data is:
- Updating
- Finshed updating
- Failed updating

So I will show you how you can write some reusable code that can be used on any mvc pattern.

## DRY delegation pattern

We will start of by creating a `ModelController` class and a `ModelControllerProtocol`:

```swift
class ModelController<T> {
    var data:T?
    weak var delegate: ModelControllerProtocol?
}

protocol ModelControllerProtocol:class {
    func isUpdating<T>(with data: T)
    func didUpdate<T>(with data: T)
    func didFailToUpdate(with error: Error)
}
```

Our `ModelController` class has two properties, `data` which holds a optional of a generic type and the delegate.

`ModelControllerProtocol` needs to be a class bound type due to us having a weak reference on our `ModelController` class.  The protocol itself has three functions for the three cases that we need(Updating, Updated, Failed).  All of them utilize generic types.

Next lets set up a Model controller, for this example im going to create a games model controller to simulate building an app.

```swift
struct Game {
    var awayTeam: String
    var homeTeam: String
}

enum NetworkResponse<T> {
    case success(T)
    case error(Error)
}

class GamesModelController: ModelController<[Game]> {
    override init() {
        super.init()
        self.data = []
    }

    func games() {
        delegate?.isUpdating(with: self.data)

        fakeNetworkRequest { [weak self] (response) in
            guard let `self` = self else { return }

            switch response {
            case .success(let games):
                self.delegate?.didUpdate(with: games)
            case .error(let error):
                self.delegate?.didFailToUpdate(with: error)
            }
        }
    }

    private func fakeNetworkRequest(completion: @escaping (NetworkResponse<[Game]>)->()) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 4) {
            let game1 = Game(awayTeam: "Giants", homeTeam: "Jets")
            let game2 = Game(awayTeam: "Raiders", homeTeam: "Chiefs")
            completion(.success([game1, game2]))
        }
    }
}
```

Lets break this code down:

- You can see me using a network response enum, read my post about that __[here](https://joncravotta.github.io/blog/swift/2017/08/02/generic-network-response.html)__.
- We then start off by subclassing `ModelController` and passing in our generic data type which is an array of `Game`.
- We override the init and set our data to an empty array.
- Next we create a `games()` method that makes a network request to get games, before it makes the request we tell the delegate that we are updating.  Based on the response we let the delegate know if it is successful or if there was an error.

Thats it for our model controller set up! Now lets hook this up with a view controller:

```swift
class GamesViewController: ModelControllerProtocol {

    let mc: GamesModelController

    init(mc: GamesModelController) {
        self.mc = mc

        mc.delegate = self
    }

    private func refreshGames() {
        mc.games()
    }
}
```

- We initialize the vc with the mc we created and set the delegate to self.  I also created a refresh games method, for now we can pretend this will be called by a buttons action for refresh.

We get errors telling us we need to confrorm to the `ModelControllerProtocol`, so lets fix that.

```swift
// MARK: ModelControllerProtocol
extension GamesViewController {
    func isUpdating<T>(with data: T) {
        // show loading hud
    }

    func didUpdate<T>(with data: T) {
        // reload ui
    }

    func didFailToUpdate(with error: Error) {
        // show error hud
    }
}

```

We're all set, I put comments as an example of something we may want to do when these delegates are called but the options are limitless. Now when the `refreshGames()` method is called our vc will be notified by our mc about its current state and we can update the ui accordingly.

This is simple reusable pattern that be used all through your project.
