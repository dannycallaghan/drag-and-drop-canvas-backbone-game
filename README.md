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
3.	Alternatively, run 'grunt --force' (excuse the mixed tabs and spaces warnings!) in the root of the project to create a new build and open the very latest dist/index.html.

*Note that, due to the security restrictions of canvas.toDataURL, the download functionality will not work from the file system (viewing the app as file://...), and will need to be placed in a local HTTP server. It'll fail gracefully, and everything else will work, but just to be aware.

Interpreting the brief
----------------------

Due to the complexity of creating images for a 'real' Police like PhotoFit, and the mention of 'cartoon' in the brief, I've creating something resembling more of a PhotoFit *game*. I hope this is OK. It also meant that my 3 year old daughter did some testing, and usually you have to pay for QA people :)

Chosen Technologies
------------

I used Yeoman/Bower/Grunt to create/scaffold the app, just because I find this the easiest way to begin a project, and it takes care of such things as minification, which I would want to implement anyway.

I've used Require.JS to load the JavaScript, as I believe - for most things - AMD loading is best.

I've used Backbone mainly to look after the views. I find it the easiest way of injecting and administering chunks of HTML (views).

I've used jQuery because I'm very familiar with it, and I'm doing a fair bit of DOM work. I'm using Underscore.js alongside this as it's brilliant and it's a dependency of Backbone anyway.

I've used ThreeDubMedia's jquery.event ([http://threedubmedia.com/code/event/drag](http://threedubmedia.com/code/event/drag "ThreeDubMedia")) patch for the dragging and dropping. Adds a little more functionality to what's available out of the box with jQuery. This just came up after a Google, never used it before.

I've used HTML5's Canvas API to create the image at the end. There is a dusting of HTML5 tags and attributes used in the markup.

For the UI, I included Bootstrap (nee Twitter Bootstrap) as I'm a big fan, and it makes rapid prototyping much easier (and nicer to look at). I also came across ([http://designmodo.github.io/Flat-UI/](Flat UI "Flat UI")) last week and - as I'm a sucker for trends, in this case flat design - I used that too (it sits on top of Bootstrap, almost as a theme).

Responsive
----------

As requested, the app is responsive. Perhaps not beautifully, due to time constraints and lack of a designer :) , but it is responsive.

Browsers
-------------------

As there was no mention of browsers in the brief, I've built this to work with the latest versions.
