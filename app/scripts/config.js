'use strict';

require.config( {
    shim : {
        underscore : {
            exports : '_'
        },
        backbone : {
            deps : [
                'underscore',
                'jquery'
            ],
            exports : 'Backbone'
        },
        eventdragdrop : {
            deps : [
                'jquery'
            ],
            exports : 'EventDragDrop'
        }
    },
    paths : {
        jquery : '../bower_components/jquery/jquery',
        backbone : '../bower_components/backbone/backbone',
        underscore : '../bower_components/underscore/underscore',
        eventdragdrop : 'vendor/jquery.event.drag.drop',
        text : '../bower_components/requirejs-text/text'
    }
} );