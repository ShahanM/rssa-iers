export const tourOptions = {
	defaultStepOptions: {
		cancelIcon: {
			enabled: true
		}
	},
	useModalOverlay: true
};

const tourButtons = [
	{
		classes: 'shepherd-button-secondary',
		text: 'Skip',
		type: 'cancel'
	},
	{
		classes: 'shepherd-button-primary',
		text: 'Back',
		type: 'back'
	},
	{
		classes: 'shepherd-button-primary',
		text: 'Next',
		type: 'next'
	}
];

const finalStepButtons = [
	{
		classes: 'shepherd-button-primary',
		text: 'Back',
		type: 'back'
	},
	{
		classes: 'shepherd-button-primary',
		text: 'Done',
		type: 'next'
	}
];

export const ratingSteps = [
	{
		id: 'intro',
		attachTo: { element: '.jumbotron', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 500);
			});
		},
		buttons: tourButtons,
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Indicating your preferences',
		text: ['In this step you will explore and rate movies to get recommendations.']
	},
	{
		id: 'gallery',
		attachTo: { element: '.gallery', on: 'right' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 210);
					resolve();
				}, 500);
			});
		},
		buttons: tourButtons,
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Finding movies to rate',
		text: ['The gallery show the movies you can rate.']
	},
	{
		id: 'galleryFooter',
		attachTo: { element: '.galleryFooter', on: 'left' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 500);
					resolve();
				}, 500);
			});
		},
		buttons: tourButtons,
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Navigating the gallery',
		text: ['You can navigate the gallery by clicking on the arrows.']
	},
	{
		id: 'minimumNumberOfRatings',
		attachTo: { element: '.rankHolder', on: 'left' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 600);
					resolve();
				}, 500);
			});
		},
		buttons: tourButtons,
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Minimum number of ratings',
		text: ["Please rate at least 10 movies, to get your recommendations."]
	},
	{
		id: 'Next Step',
		attachTo: { element: '.nextButton', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					// window.scrollTo(0, 600);
					resolve();
				}, 500);
			});
		},
		buttons: finalStepButtons,
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Next Step',
		text: ["Finally, click on the button to get your recommendations."]
	}
];

export const emoPrefSteps = [
	{
		id: 'intro',
		attachTo: { element: '.jumbotron', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 500);
			});
		},
		buttons: tourButtons,
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Interacting with the Recommender System',
		text: ['In this step you will interact with the emotion recommender system to find a movie that you would watch.'],
		when: {
			show: () => {
				console.log('show step');
			},
			hide: () => {
				console.log('hide step');
			}
		}
	}
];