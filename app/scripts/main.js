'use strict';

require( [

    'modules/PhotoFit'

], function ( PhotoFit ) {

	// Initialise a new photofit app
	new PhotoFit( {
		// The DOM element to attach our app
		el : '#photofit-app',
		// What features do we want to use?
		items : [ 
			{
				'feature' : 'hair',
				'choices' : '4'
			},
			{
				'feature' : 'eyes',
				'choices' : '4'
			},
			{
				'feature' : 'cheeks',
				'choices' : '4'
			},
			{
				'feature' : 'nose',
				'choices' : '4'
			},
			{
				'feature' : 'mouth',
				'choices' : '4'
			},
			{
				'feature' : 'chin',
				'choices' : '4'
			}
		]
	} );

} );