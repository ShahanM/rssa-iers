import Button from 'react-bootstrap/Button';


const galleryNextBtn = require("../res/gallery_next_button.png");

export const tourOptions = {
	defaultStepOptions: {
		cancelIcon: {
			enabled: true
		},
		classes: 'shepherd-theme-arrows shadow-md bg-purple-dark',
		scrollTo: { behavior: 'smooth', block: 'center' },
		overlay: {
			// Customize the color of the overlay
			color: 'rgba(255, 0, 0, 0.5)',
			// Customize the padding around the highlighted element
			padding: 10,
		}
	}
	// useModalOverlay: false
};

const backButton = {
	classes: 'shepherd-button-secondary',
	text: 'Back',
	type: 'back'
}

const nextButton = {
	classes: 'shepherd-button-primary',
	text: 'Next',
	type: 'next'
}

const doneButton = {
	classes: 'shepherd-button-primary',
	text: 'Done',
	type: 'next'
}

const tourButtons = [backButton, nextButton];

const dynamicBackButton = (tour) => {
	return {
		classes: 'shepherd-button-secondary',
		text: 'Back',
		type: 'back',
		action: tour.back
	}
}

const dynamicNextButton = (tour) => {
	return {
		classes: 'shepherd-button-primary',
		text: 'Next',
		type: 'next',
		action: tour.next
	}
}

const dynamicDoneButton = (tour) => {
	return {
		classes: 'shepherd-button-primary',
		text: 'Done',
		type: 'next',
		action: tour.complete
	}
}

const dynamicTourButtons = (tour) => {
	return [dynamicBackButton(tour), dynamicNextButton(tour)];
}

const finalStepButtons = [backButton, doneButton];

const dynamicFinalStepButtons = (tour) => {
	return [dynamicBackButton(tour), dynamicDoneButton(tour)]
}

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
		buttons: [nextButton],
		// classes: 'shepherd-theme-custom custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Indicating your preferences',
		text: ['In this step you will rate movies. Please read these instructions carefully before you start.']
	},
	{
		id: 'gallery',
		attachTo: { element: '.galleryOverlay', on: 'right' },
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
		title: 'Rating movies',
		text: ['The gallery shows the movies you can rate. Please only rate movies that you are familiar with.']
	},
	{
		id: 'galleryFooterOverlay',
		attachTo: { element: '.galleryFooterOverlay', on: 'left' },
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
		text: [`Ran out of movies you are familiar with? You can request more 
			movies by clicking on 
			<Button style="background-color: #f9b05c;font-weight: 400;
			color: #4a4b4b;border-radius: 3px;border: none;width: 45px;">
			>
			</Button> button.<br> 
			Also, as you request more movies, you can always use the 
			<Button style="background-color: #f9b05c;font-weight: 400;
			color: #4a4b4b;border-radius: 3px;border: none;width: 45px;">
			<
			</Button> 
			button to go back.`]
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
		buttons: [dynamicNextButton(tour)],
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Interacting with the Recommender System',
		text: ['In this step you will interact with the recommender system.']
	}
];

export const emoPrefSelectStep = (tour) => [
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
		buttons: [dynamicNextButton(tour)],
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Selecting a movie',
		text: ['In this step you will find and select a movie you will watch.']
	}
]

export const recommendationInspectionSteps = (tour) => [
	{
		id: 'recommendations',
		attachTo: { element: '.movieListPanelOverlay', on: 'right' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				// document.querySelector('.movieListPanelOverlay').style.display = 'block';
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
	}
];

export const movieSelectStep = (tour, movieid) => [
	{
		id: 'movieSelect',
		attachTo: { element: '#selectButtonOverlay_' + movieid, on: 'right' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				// document.querySelector('.moviePreviewPanelOverlay').style.display = 'block';
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
		title: 'Choosing a movie',
		text: ['Once you have found a movie that you would watch, click on the select button to choose it.']
	}
];


export const moviePreviewStep = (tour) => [
	{
		id: 'moviepreview',
		attachTo: { element: '.moviePreviewPanelOverlay', on: 'left' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				// document.querySelector('.moviePreviewPanelOverlay').style.display = 'block';
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
		attachTo: { element: '.emoToggleInputsOverlay', on: 'left' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				// document.querySelector('.emoToggleInputsOverlay').style.display = 'block';
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
		text: 'You can toggle the emotion preference for each emotion using the corresponding toggle buttons.<br><br>' +
			'<ol><li>High means you prefer your recommendations to contain movies with that emotion.</li>' +
			'<li>Low means you prefer your recommendations to contain movies with that emotion but prioritized less than high.</li>' +
			'<li>Ignore means you do not care about the emotion in your recommendations.</li></ol>',
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
	}
]

export const emoPrefDone = (tour) => [
	{
		id: 'emoDone',
		attachTo: { element: '.nextButton', on: 'bottom' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 300);
					resolve();
				}, 200);
			});
		},
		buttons: dynamicFinalStepButtons(tour),
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Completing the step',
		text: 'Onced you have chosen a movie, you can complete the step by clicking on the next button.'
	}
]

export const emoFinalizeStep = (tour) => [
	{
		id: 'emoFinalize',
		attachTo: { element: '.toggleFinalizeButton', on: 'left' },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					window.scrollTo(0, 300);
					resolve();
				}, 200);
			});
		},
		buttons: dynamicFinalStepButtons(tour),
		classes: 'custom-class-name-1 custom-class-name-2',
		highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: {
			enabled: true,
		},
		title: 'Finalizing Emotion Preference',
		text: 'Once you are happy with the recommendations, you can finalize the emotion preference by clicking on the finalize button.'
	}

]

export const emoVizSteps = (tour) => [
	{
		id: 'emoViz',
		attachTo: { element: '.emoVizOverlay', on: 'left' },
		beforeShowPromise: function (resolve) {
			return new Promise(function (resolve) {
				// document.querySelector('.emoVizOverlay').style.display = 'block';
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
		title: 'Inspecting Recommendations',
		text: 'These bars show the emotional valence of the movie content. '
	}
]
