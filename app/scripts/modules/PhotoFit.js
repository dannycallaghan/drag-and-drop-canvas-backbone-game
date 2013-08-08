'use strict';

define( [

    'backbone',
    'underscore',

    'text!../templates/feature.jst',
    'text!../templates/choice.jst',
    'text!../templates/stage.jst',

    'eventdragdrop'

], function ( Backbone, _, feature, choice, stage ) {

	var PhotoFit = function ( options ) {
		var defaults = {
				imagePath : 'images/', // Image directory location
				revertSpeed : 350 // How fast do we return a choice to it's original position if dropped (milliseconds)
			},
			config = _.extend( defaults, options ),
			initialize = function () {
				// If there are no passed items, let's quit
				if ( !config.items || !config.items.length ) {
					return;
				}
				// Similarly, if there's no DOM element to hook onto
				if ( !config.el || $( config.el ).length === 0 ) {
					return;
				}
				// If we're still here, jump into backbone
				PhotoFit.masterView  = new PhotoFit.MasterView( { config : config } );
			};
		initialize();
	};

	// Backbone view for whole app. Contains most of the functionality
	PhotoFit.MasterView = Backbone.View.extend( {
		
		initialize : function ( options ) {
			var self = this;
			this.el = $( options.config.el );
			this.config = options.config;
			// Create collection for our passed features
			PhotoFit.featureCollection = new PhotoFit.FeatureCollection();
			PhotoFit.featureCollection.on( 'reset', this.parseItems, this );
			PhotoFit.featureCollection.reset( options.config.items );
			// Add a live event for removing the selected features from the photo
			this.el.find( '#picks' ).on( 'dblclick', function ( e ) { self.unpickStyle( e ); } );
			// Download button
			this.el.find( '#download-btn' ).on( 'click', function ( e ) { self.readyImageForDownload( e ); } );
		},	

		// Loop over our feature collection and create the 'nav' and the photo sections
		parseItems : function () {
			var self = this;
			if ( PhotoFit.featureCollection.length ) {
				this.el.find( 'nav' ).append( $( '<ul>' ) );
				PhotoFit.featureCollection.each( function ( item ) {
					// Pass the features to their own view and append the returned element
					PhotoFit.featureView = new PhotoFit.FeatureView( { model : item } );
					self.el.find( 'nav ul' ).append( PhotoFit.featureView.render().el );
					// Pass the photo sections to their own view and append the returned element
					PhotoFit.stageFeatureView = new PhotoFit.StageFeatureView( { model : item } );
					self.el.find( '#picks' ).append( PhotoFit.stageFeatureView.render().el );
				} );
			} else {
				return;
			}
			this.renderComplete();
		},

		// Changes the list of feature styles
		changeFeature : function ( model ) {
			var choices = parseInt( model.get( 'choices' ) ),
				div = this.el.find( '#choices' ),
				ul;
			// Change the list title
			this.el.find( 'section:nth-child( 2 )' ).children( 'h2' ).text( model.get( 'feature' ) );
			if ( div.children( 'ul' ).length === 0 ) {
				div.append( $( '<ul>' ) );
			}
			ul = div.children( 'ul' );
			ul.empty();
			// Loop over the choices in the selected model to build the list
			for ( var i  = 0; i < choices; i = i + 1 ) {
				// Pass each style to it's own model and render the returned element
				PhotoFit.choicesView = new PhotoFit.ChoicesView( { model : model, index : ( i + 1 ), config : this.config } );
				var choice = PhotoFit.choicesView.render().el;
				ul.append( choice );
				// Despite what the docs said, the drag events don't work 'live' so pass each one individually. Rubbish.
				this.applyDragEvents( choice, model.get( 'feature' ), i );
			}
			// Add a data hook to the list so we know what's in the list
			ul.data( 'list', model.get( 'feature' ) );
		},

		// Drag and drop events. New to this library, so apologies if it's a bit rubbish.
		applyDragEvents : function ( el, title, index ) {
			var self = this,
				picks = this.el.find( '#picks' );
			$( el ).children( 'div.style' )
      			.drag( function ( e, dd ) {
      				// Move the item
         			$( this ).css( {
            			top : dd.offsetY,
            			left : dd.offsetX
         			} );
  				} )
      			.drag( 'start', function( ev, dd ){
      				// Call our z-index function once we start dragging
      				self.changeIndex( $( this ) );
      				if ( !$( dd.available ).hasClass( 'unavailable') ) {
      					// Highligh the correct target in the photo
           	 			$( dd.available ).addClass( 'available' );
           	 		}
         		} )
	      		.drag( 'end', function ( ev, dd ) {
	      			// Return the style back to the list
         			$( this ).animate( {
            			top : dd.originalY,
            			left : dd.originalX
         			}, self.config.revertSpeed );
         			// If it's been dropped onto the target, call pickStyle
         			if ( $( dd.available ).hasClass( 'dropped' ) ) {
         				self.pickStyle( $( this ), $( dd.available ), title, index );
         			}
           	 		$( dd.available ).removeClass( 'available' );
      			}, 
      				{ relative : true, drop: '#' + title + '-drop' }
      			);
	      	// Only add the drop events once, as we don't redraw these (as we do with the list)
	      	if ( !picks.data( 'initialized' ) ) {
	      		// Add CSS classes depending on what's happening
		      	this.el.find( '#picks' ).find( 'div.style:not(.unavailable)' )
	      			.drop( 'start', function () {
	         			$( this ).addClass( 'active' );
	      			} )
	      			.drop( function ( ev, dd ) {
	         			$( this ).toggleClass( 'dropped' );
	      			} )
	      			.drop( 'end', function () {
	         			$( this ).removeClass( 'active available' );
	      		} );
	      		$.drop( { mode : 'middle' } );
      			picks.data( 'initialized', true );
      		}
		},

		// Picks a style
		pickStyle : function ( el, target, title, index  ) {
			// If this target already has an image in it, un pick it
			if ( target.children( 'img' ).length ) {
				this.unpickStyle( target.children() );
			}
			// Store our picked style for easy access
			this.config.picks = this.config.picks || {};
         	this.config.picks[ title ] = index + 1; 
         	// Clone the list image and added to the photo
         	el.children().clone( false ).appendTo( target.addClass( 'unavailable' ).removeClass( 'dropped' ) );
         	// Hide the element in the list
         	el.addClass( 'selected' );
         	// Do we have a full picture?
         	this.checkStatus();
		},

		// Unpicks a style
		unpickStyle : function ( e ) {
			// Set our element depening on whether it came from pickStyle, or from a doubleclick on the photo
			var el = e.target ? $( e.target ) : e,
				feature = el.parent().data( 'feature' ),
				choices = this.el.find( 'div#choices' );
			// Remove the image from the photo
			el.parent( 'div.style' ).removeClass( 'unavailable' ).empty();
			// Remove the selected item from the list
			if ( choices.children().data( 'feature' ) === feature ) {
				choices.find( 'div.selected' ).removeClass( 'selected' );
			} else {
				if ( this.config.picks[ feature ] ) {
					choices.find( 'li:nth-child(' + this.config.picks[ feature ] + ')' ).children( 'div.selected' ).removeClass( 'selected' );
				}
			}
			// Finally, delete the stored picked style
			if ( this.config.picks[ feature ] ) {
				delete this.config.picks[ feature ];
			}
			// Do we have a full picture?
         	this.checkStatus();
		},

		// Makes sure that the currently dragged item has the highest z-index
		changeIndex : function ( el ) {
			var ul = el.parents( 'ul' );
			if ( !ul.data( 'z-index' ) ) {
				ul.data( 'z-index', 2 );
			} else {
				ul.data( 'z-index', parseInt( ul.data( 'z-index' ) ) + 1 );
			}
			el.css( 'z-index', ul.data( 'z-index' ) );
		},

		// When the page first loads, select the first item in the list of features so the styles list isn't empty
		renderComplete : function () {
			PhotoFit.featureView.changeFeature( this, this.el.find( 'nav' ).find( 'li:first-child' ) );
		},

		// Checks to see if we have a full picture for downloading
		checkStatus : function () {
			var size = _.size( this.config.picks ),
				btn = this.el.find( '#download-btn' );
			btn[ size < 6 ? 'addClass' : 'removeClass' ]( 'disabled' );
		},

		// Prepares image for downloading
		readyImageForDownload : function ( e ) {
			e.preventDefault();
			var canvas = document.getElementById( 'photo' );
			if ( !this.config.createdImageConfig || !_.isEqual( this.config.createdImageConfig, this.config.picks ) ) {
				var self = this,
					context = canvas.getContext('2d');
					headings = [],
					loaded = 0,
					checkPhotoStatus = function () {
						if ( loaded === headings.length ) {
							self.getDownloadImage( canvas );
						}
						// Store the current image config so we don't re-create it uneccessarily
						self.config.createdImageConfig = self.config.picks;
					}
				// Found that the order of the images wasn't always correct, so creating an array (which, of course, is properly indexed)
				// of our passed headings, then using that to access the correct keys in the config.picks object
				_.each( this.config.items, function ( value, key, list ) {
					headings.push( value[ 'feature' ] );
				} );
	      		_.each( headings, function ( element, index, list ) {
	      			var img = new Image();
					img.src = 'images/' + element + self.config.picks[ element ] + '.png';
					img.onload = function () {
	  					context.drawImage( img, 0, index * 90, 376, 90 );
	  					loaded++;
	  					checkPhotoStatus();
	  				}
	      		} );
      		} else {
      			this.getDownloadImage( canvas, this.config.createdImageConfigData );
      		} 
		},

		// Creates the download image
		getDownloadImage : function ( photo, data ) {
			var canvasData;
			if ( !data ) {
				canvasData = photo.toDataURL( {
	  				mimeType: 'image/png'
				} );
			} else {
				canvasData = data;
			}
			this.config.createdImageConfigData = canvasData;
			// TODO - Download
			window.open( canvasData );
		}

	} );

	// Collection for the features
	PhotoFit.FeatureCollection = Backbone.Collection.extend();

	// View for each nav item
	PhotoFit.FeatureView = Backbone.View.extend( {
		tagName : 'li',
		template : _.template( feature ),
		events : {
			'click' :  'changeFeature'
		},

		// The change feature event, which is passed up the chain to the master view
		changeFeature : function ( src, item ) {
			var model, base, item;
			// if we only have one argument, it's a click on a nav item
			if ( arguments.length === 1 ) {
				model = this.model;
				base = PhotoFit.masterView;
				el = $( src.target ).parent();
			} else {
				// if we have more than one, it's the initial page load event, so grab the FIRST model
				model = PhotoFit.featureCollection.at( 0 );	
				base = src;
				el = item;
			}
			this.highlightFeature( el );
			base.changeFeature( model );
		}, 

		// Highlights the selected feature in the nav
		highlightFeature : function ( el ) {
			el.parent().find( 'span.btn-primary' ).removeClass( 'btn-primary' ).addClass( 'btn-inverse' );
			el.children().addClass( 'btn-primary' ).removeClass( 'btn-inverse' );
		},

		// Render and return the view
		render : function () {
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		}
	} );

	// View for the photo sections
	PhotoFit.StageFeatureView = Backbone.View.extend( {
		template : _.template( stage ),

		// Render and return the view
		render : function () {
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		}
	} );

	// View for the styles/choices
	PhotoFit.ChoicesView = Backbone.View.extend( {
		tagName : 'li',
		template : _.template( choice ),

		initialize : function ( options ) {
			// Set some further attributes, as per the config
			this.model.set( 'index', options.index );
			this.model.set( 'imgpath', options.config.imagePath );
			this.model.set( 'selected', false );
			// Look at the stored selected item to see if we're rendering it. If we are, we need to hide it.
			// This ensures when we re-render a list, the selected item is still shown (well, NOT shown actually)
			if ( options.config.picks && !_.isUndefined( options.config.picks[ this.model.get( 'feature' ) ] ) ) {
				if ( options.index === options.config.picks[ this.model.get( 'feature' ) ] ) {
					this.model.set( 'selected', true );
				}
			}
		},

		// Render and return the view
		render : function () {
			this.$el.html( this.template( this.model.toJSON() ) );
			return this;
		}
	} );
	return PhotoFit;
} );