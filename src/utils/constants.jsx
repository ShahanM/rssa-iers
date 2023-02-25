export const emotionsDict = {
	'Joy': '',
	'Trust': '',
	'Fear': '',
	'Surprise': '',
	'Sadness': '',
	'Disgust': '',
	'Anger': '',
	'Anticipation': ''
}

export const studyConditions = {
	1: {
		recType: 'topN',
		emoTogglesEnabled: true,
		emoVizEnabled: true,
		defaultEmoWeightLabel: 'Don\'t care',
	},
	2: {
		recType: 'topN',
		emoTogglesEnabled: true,
		emoVizEnabled: false,
		defaultEmoWeightLabel: 'Don\'t care',
	},
	3: {
		recType: 'topN',
		emoTogglesEnabled: false,
		emoVizEnabled: true,
		defaultEmoWeightLabel: 'Don\'t care',
	},
	4: {
		recType: 'topN',
		emoTogglesEnabled: false,
		emoVizEnabled: false,
		defaultEmoWeightLabel: 'Don\'t care',
	},
	5: {
		recType: 'diverseN',
		emoTogglesEnabled: true,
		emoVizEnabled: true,
		defaultEmoWeightLabel: 'Diversify'
	},
	6: {
		recType: 'diverseN',
		emoTogglesEnabled: true,
		emoVizEnabled: false,
		defaultEmoWeightLabel: 'Diversify'
	},
	7: {
		recType: 'diverseN',
		emoTogglesEnabled: false,
		emoVizEnabled: true,
		defaultEmoWeightLabel: 'Diversify'
	},
	8: {
		recType: 'diverseN',
		emoTogglesEnabled: false,
		emoVizEnabled: false,
		defaultEmoWeightLabel: 'Diversify'
	}
}