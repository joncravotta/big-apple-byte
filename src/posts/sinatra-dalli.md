---
layout: post
title:  "Sinatra and Dalli"
date:   '2017-10-01'
categories: Ruby
---

### How to setup caching with Dalli and Sinatra
My go to tool for creating micro web api is __[Sinatra](https://www.google.com)__.  It’s a great, easy to use little framework that helps me build apis quick.  I find myself using it as a middle layer between other apis and my apps, so a common thing I need to do is set up a cache.   My go to library for caching is __[Dalli](https://github.com/petergoldstein/dalli)__.  According to its github:

> Dalli is a high performance pure Ruby client for accessing memcached servers. It works with memcached 1.4+ only as it uses the newer binary protocol. It should be considered a replacement for the memcache-client gem.  

So lets get started and see how it can I incorporate it into a sinatra project.

i.e. you have to __[install and run ](https://gist.github.com/tomysmile/ba6c0ba4488ea51e6423d492985a7953)__  memcache for Dalli to work.

I like creating an app controller that holds important functionality so other controllers can subclass.  I’ll start off by setting up the cache itself.

```ruby
class AppController < Sinatra::Base
  def initialize
    @cache = setup_memcache
    super
  end

  def setup_memcache
    options = { :namespace => "app_v1", :compress => true }
    Dalli::Client.new('localhost:11211', options)
  end
end
```


I create an options hash with a namespace and the option of compressing.  By setting compress to true Dalli will gzip-compress values larger than 1K.  I create the client and pass in the options.

After the setup we will now implement methods to get a cache and set a cache:

```ruby
def cached?(key)
  get_cache(key)
end

def set_cache(key, value, time)
  @cache.set(key, value, time)
end

private

def get_cache(key)
  @cache.get(key)
end
```

`cached?` will retrieve the cache via a key.  `set_cache` will set a cache with a key, value and time which is set in seconds.

We can then create a new controller that subclasses `AppController`

```ruby
class TestController < AppController
  TEST_CACHE_KEY = "test_key_01"
  def initialize
    super
  end

  get "/set_cache" do
    set_cache(TEST_CACHE_KEY, "Hello, i'm cached", 60)
  end

  get "/get_cache" do
    cache = cached?(TEST_CACHE_KEY)
    cache ? cache : "CACHE FAILED"
  end
end
```

We then could test this out by calling `http://YOUR_PATH/set_cache` to set our cache.  After the cache is set we can call `http://YOUR_PATH/get_cache`, you should see `"Hello, i'm cached"` returned!

## Deploy to production

Now that we set this up locally I’m going to show you how we can get this set up on a live server using __[heroku](https://www.heroku.com/)__

After signing up for heroku and getting your __[tool belt](https://devcenter.heroku.com/articles/heroku-cli)__ set up you will be ready to deploy your app. In your projects directory run `heroku create`.  This will create an app in heroku for you. Next assuming you have git set up, run `git push heroku master`.  This will deploy your app, heroku will print out the url so you can test your endpoints.

Now we are going to provision __[memcachier](https://www.memcachier.com/)__ to our app.  In the heroku dashboard find your app and click on it, you will be brought to an overview and there will be a `configure Add-ons` button.  Upon selection you can search for memcachier, you should see an option to provision. After provisioning click on the app, scroll down to settings and take note of the environment names that are given:
- MEMCACHIER_USERNAME
- MEMCACHIER_PASSWORD
- MEMCACHIER_SERVERS


That should be all the set up we need in heroku, now we just have to configure out app to properly handle the production cache.

In our `AppController` class we will check the application environment in the initializer, and setup the methods needed:

```ruby
def initialize
  if self.class.development?
    @cache = setup_memcache_dev
  else
    @cache = setup_memcache_prod
  end

  super
end

def setup_memcache_prod
    Dalli::Client.new((ENV["MEMCACHIER_SERVERS"] || "").split(","),
                    {:username => ENV["MEMCACHIER_USERNAME"],
                     :password => ENV["MEMCACHIER_PASSWORD"],
                     :failover => true,
                     :socket_timeout => 1.5,
                     :socket_failure_delay => 0.2
                    })
  end

def setup_memcache_dev
  options = { :namespace => "app_v1", :compress => true }
  Dalli::Client.new('localhost:11211', options)
end
```
`setup_memcache_dev` is exactly what we used before.  `setup_memcache_prod` on the other hand sets up the environment variables that we looked at before on the memcachier dashboard.

After adding, commiting and push up to heroku we can test our prod cache by hitting the `set_cache` endpoint and the `get_cache` endpoint.  You should see the same response that we had in dev, you can also go back to the memcachier dashboard and see stats like hit rates, connection, memory etc.  You can even flush the cache!

Thats it, now you have a working api with caching set up for all your apps to use.
