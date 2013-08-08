DM Tech Test
============

A repo for a technical test that I've just completed, for a client who will remain anonymous.

Viewing the (results of the) test
---------------------------------

Navigate to the following GitHub Page in your browser of choice:

[http://dannycallaghan.github.io/dmtechtest/](http://dannycallaghan.github.io/dmtechtest/ "DM Tech Test")

Viewing the (results of the) test locally
-----------------------------------------

1.  Clone the repo, or download and extract the zip.
2.  Navigate to dist/ and open index.html in your browser of choice*.

* Note that, due to the security restrictions of canvas.toDataURL, the download functionality will not work from the file system (viewing the app as file://...), and will need to be placed in a local HTTP server.

Interpreting the brief
----------------------

Due to the complexity of creating images for a 'real' Police like PhotoFit, and the mention of 'cartoon' in the brief, I've creating something resembling more of a PhotoFit *game*. I hope this is OK.

Chosen Technologies
------------

I used Yeoman/Bower/Grunt to create/scaffold the app, just because I find this the easiest way to begin a project, and it takes care of such things as minification, which I would want to implement anyway.

I've used Require.JS to load the JavaScript, as I believe - for most things - AMD loading is best.

I've used Backbone mainly to look after the views. I find it the easiest way of injecting and administering chunks of HTML (views).

I've used jQuery because I'm very familiar with it, and I'm doing a fair bit of DOM work. I'm using Underscore.js alongside this as it's brilliant and it a dependency of Backbone anyway.

I've used #################

I've used HTML5's Canvas API to create the image at the end.

Responsive
----------

As requested, the app is responsive. Perhaps not beautifully, due to time constraints and lack of a designer :) , but it is responsive.

Browsers
-------------------

As there was no mention of browsers in the brief, I've built this to work with the latest versions.

