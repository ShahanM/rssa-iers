export const tourOptions = {
	useModalOverlay: true,
	defaultStepOptions: {
		classes: 'shepherd-theme-arrows shadow-md bg-purple-dark',
		scrollTo: { behavior: 'smooth', block: 'center' }
	}
}

const backButton =
	{ classes: 'shepherd-button-secondary', text: 'Back', type: 'back' }
const nextButton =
	{ classes: 'shepherd-button-primary', text: 'Next', type: 'next' }
const doneButton =
	{ classes: 'shepherd-button-primary', text: 'Done', type: 'next' }
const tourButtons = [backButton, nextButton];
const finalStepButtons = [backButton, doneButton];

const dynamicBackButton = (tour) => {
	return {
		classes: 'shepherd-button-secondary',
		text: 'Back', type: 'back', action: tour.back
	}
}

const dynamicNextButton = (tour) => {
	return {
		classes: 'shepherd-button-primary',
		text: 'Next', type: 'next', action: tour.next
	}
}

const dynamicDoneButton = (tour) => {
	return {
		classes: 'shepherd-button-primary',
		text: 'Done', type: 'next',
		action: function (resolve) { tour.complete(); }
	}
}

const dynamicTourButtons = (tour) => {
	return [dynamicBackButton(tour), dynamicNextButton(tour)];
}
const dynamicFinalStepButtons = (tour) => {
	return [dynamicBackButton(tour), dynamicDoneButton(tour)]
}

const tourStepsSchema = (attachElement, attachOn, id, title, text, scrollToY, buttons) => {
	return {
		id: id,
		attachTo: { element: attachElement, on: attachOn },
		beforeShowPromise: function () {
			return new Promise(function (resolve) {
				setTimeout(function () {
					if (scrollToY !== null) {
						window.scrollTo(0, scrollToY);
					}
					resolve();
				}, 200);
			});
		},
		modalOverlayOpeningPadding: 5,
		modalOverlayOpeningRadius: { topLeft: 5, bottomLeft: 5, bottomRight: 5, topRight: 5 },
		canClickTarget: false, buttons: buttons, highlightClass: 'highlight',
		scrollTo: false,
		cancelIcon: { enabled: false, }, title: title, text: text
	}
}

export const ratingSteps = (tour) => [
	tourStepsSchema('.jumbotron', 'bottom', 'intro', 'Indicating your preferences',
		['In this step you will rate at least 10 moves you are familiar with.'],
		0, [dynamicNextButton(tour)]),
	tourStepsSchema('.gallery', 'right', 'gallery', 'Rating movies',
		[`The gallery shows the movies you can rate. Please 
		<strong><u>only</u></strong> 
		rate movies that you are 
		<strong><u>familiar</u></strong> 
		with. <br> (If you have not seen a movie or you aren't sure you’ve seen it, 
		please skip it and rate a different one.)`],
		210, dynamicTourButtons(tour)),
	tourStepsSchema('.galleryFooter', 'left', 'galleryFooter', 'Navigating the gallery',
		[`Ran out of movies you are familiar with? You can request more movies 
			by clicking on 
			<Button style="background-color:#f9b05c;font-weight:400;
			color: #4a4b4b;border-radius:3px;border:none;width:45px;">></Button>
			button.<br>
			Also, as you request more movies, you can always use the 
			<Button style="background-color:#f9b05c;font-weight:400;
			color:#4a4b4b; border-radius:3px;border:none;width:45px;"><</Button> 
			button to go back.`],
		500, dynamicTourButtons(tour)),
	tourStepsSchema('.rankHolder', 'left', 'minimumNumberOfRatings', 'Minimum number of ratings',
		['To get your recommendations you must rate at least 10 movies you are familiar with, but feel free to rate more!'],
		null, dynamicTourButtons(tour)),
	tourStepsSchema('.nextButton', 'bottom', 'nextstep', 'Next Step',
		['Finally, click on this button to get your recommendations.'],
		null, dynamicFinalStepButtons(tour))
]

export const emoPrefSteps = (tour) =>
	tourStepsSchema('.jumbotron', 'bottom', 'intro', 'Interacting with the recommender system',
		['Please carefully read the instructions.'],
		0, [dynamicNextButton(tour)]);

export const emoPrefSelectStep = (tour) =>
	tourStepsSchema('.jumbotron', 'bottom', 'intro', 'Selecting a movie',
		['In this step you will find and select one movie you would most like to watch. Please carefully read the instructions.'],
		0, [dynamicNextButton(tour)])


export const recommendationInspectionSteps = (tour) =>
	tourStepsSchema('.recommendationsListContainer', 'right', 'recommendations', 'Inspecting recommendations',
		['This list contains your recommendations. You can hover over each movie to see more details about it in the panel on the right.'],
		null, dynamicTourButtons(tour))

export const resommendationSelectionInspection = (tour) =>
	tourStepsSchema('.recommendationsListContainer', 'right', 'recommendations', 'Inspecting recommendations',
		['Now that we have your recommendations, please inspect them before making a selection.'],
		null, dynamicTourButtons(tour))

export const movieSelectStep = (tour, movieid) =>
	tourStepsSchema('#selectButton_' + movieid, 'right', 'movieSelect', 'Choosing a movie',
		['Once you have decided which move you would most like to watch, click on its “Select” button to choose it.'],
		null, dynamicTourButtons(tour))

export const moviePreviewStep = (tour) =>
	tourStepsSchema('.moviePreviewCard', 'left', 'moviePreview', 'Inspecting recommendations',
		['This panel contains the movie details such as the movie poster and synopsis.'],
		null, dynamicTourButtons(tour))

export const emoToggleSteps = (tour, isDiversify) => [
	tourStepsSchema('.emoToggleInputs', 'left', 'emoInput', 'Indicating your taste in movie emotions',
		[`You can control the emotions evoked by the recommended movies using these toggle buttons:<br><br>
		<ol><li>“Less” means you prefer movies with that evoke less of this emotion.</li>
		<li>“More” means you prefer movies that evoke more of this emotion.</li>`
			+ (isDiversify ?
				`<li>“Diversify” means that you prefer an even mix of movies that evoke less vs. more of this emotion</li></ol>`
				: `<li>“Ignore” means that you are indifferent about this emotion</li></ol>`) +
			`When you select a toggle, the recommendations will change accordingly.`],
		150, dynamicTourButtons(tour)),
	tourStepsSchema('.emoToggleResetBtn', 'bottom', 'emoReset', 'Resetting emotion preference',
		['You can reset your emotion preferences to the default values by clicking on this reset button.'],
		null, dynamicTourButtons(tour))
]

export const emoPrefDone = (tour) =>
	tourStepsSchema('.nextButton', 'bottom', 'emoDone', 'Completing the step',
		['Once you have made your decision you can continue by clicking on this button.'],
		300, dynamicFinalStepButtons(tour))

export const emoFinalizeStep = (tour) =>
	tourStepsSchema('.toggleFinalizeButton', 'left', 'emoFinalize', 'Finalizing emotion preference',
		['Please carefully inspect and adjust the recommendations until you are satisfied with them. Once you are happy with the recommendations, you can finalize the settings by clicking on this button.'],
		300, dynamicFinalStepButtons(tour))


export const emoVizSteps = (tour) =>
	tourStepsSchema('.emoStatbars', 'left', 'emoViz', 'Emotional signature',
		['This graph shows the extent to which we expect the following emotions to be evoked by the movie (based on movie review data).'],
		150, dynamicTourButtons(tour))

