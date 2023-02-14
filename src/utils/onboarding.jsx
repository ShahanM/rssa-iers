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

const dynamicTourButtons = (tour) => {
	return [
		{
			classes: 'shepherd-button-secondary',
			text: 'Skip',
			type: 'cancel',
			action: tour.cancel
		},
		{
			classes: 'shepherd-button-primary',
			text: 'Back',
			type: 'back',
			action: tour.back
		},
		{
			classes: 'shepherd-button-primary',
			text: 'Next',
			type: 'next',
			action: tour.next
		}
	];
}

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
				}, 200);
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
				}, 200);
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
				}, 200);
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
				}, 200);
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
				}, 200);
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

export const emoPrefSteps = (tour) => [
	{
		id: 'intro',
		attachTo: { element: '.jumbotron', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 0);
					resolve();
				}, 200);
			});
		},
		buttons: dynamicTourButtons(tour),
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Interacting with the Recommender System',
		text: ['In this step you will interact with the emotion recommender system to find a movie that you would watch.']
	},
	{
		id: 'recommendations',
		attachTo: { element: '.recommendationsListContainer', on: 'right' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					resolve();
				}, 200);
			})
		},
		buttons: dynamicTourButtons(tour),
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true
		},
		title: 'Inspecting recommendations',
		text: ['This list contains all the recommendations, you can hover over each movie item to see the detailed preview on the right panel.']
	},
	{
		id: 'moviepreview',
		attachTo: { element: '.moviePreviewPanel', on: 'left'},
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					resolve();
				}, 200);
			})
		},
		buttons: dynamicTourButtons(tour),
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true
		},
		title: 'Inspecting recommendations',
		text: ['This panel contains the movie details such as the movie poster and synopsis.']
	}
];


export const emoToggleSteps = (tour) => [
	{
		id: 'emoInput',
		attachTo: { element: '.emoToggleInputs', on: 'left' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 150);
					resolve();
				}, 200);
			});
		},
		buttons: dynamicTourButtons(tour),
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Toggling Emotion Preference',
		text: 'You can toggle the emotion preference for each emotion using the corresponding toggle buttons.' +
			'High means you prefer your recommendations to contain movies with that emotion.' +
			'Low means you prefer your recommendations to contain movies with that emotion but prioritized less than high.' +
			'Ignore means you do not care about the emotion in your recommendations.',
		when: {
			show: () => {
				console.log('show step');
			},
			hide: () => {
				console.log('hide step');
			}
		}

	},
	{
		id: 'emoReset',
		attachTo: { element: '.emoToggleResetBtn', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					// window.scrollTo(0, 150);
					resolve();
				}, 200);
			});
		},
		buttons: dynamicTourButtons(tour),
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Resetting Emotion Preference',
		text: 'You can reset the emotion preference to the default values by clicking on the reset button.'
	},
	{
		id: 'emoFinalize',
		attachTo: { element: '.emoToggleFinalizeBtn', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					// window.scrollTo(0, 150);
					resolve();
				}, 200);
			});
		},
		buttons: dynamicTourButtons(tour),
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Finalizing Emotion Preference',
		text: 'Once you are happy with the recommendations, you can finalize the emotion preference by clicking on thefinalize button.'
	}
]

export const emoPrefDone = (tour) => [
	{
		id: 'emoDone',
		attachTo: { element: '.nextButton', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					// window.scrollTo(0, 150);
					resolve();
				}, 200);
			});
		},
		buttons: [...dynamicTourButtons(tour),
			{
				classes: 'shepherd-button-primary',
				text: 'Done',
				type: 'complete',
				action: tour.complete
			}
		],
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Finalizing Emotion Preference',
		text: 'Once you are happy with the recommendations, you can finalize the emotion preference by clicking on thefinalize button.'
	}
]
