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
		emoVizEnabled: true
	},
	2: {
		recType: 'topN',
		emoTogglesEnabled: true,
		emoVizEnabled: false
	},
	3: {
		recType: 'topN',
		emoTogglesEnabled: false,
		emoVizEnabled: true
	},
	4: {
		recType: 'topN',
		emoTogglesEnabled: false,
		emoVizEnabled: false
	},
	5: {
		recType: 'diverseN',
		emoTogglesEnabled: true,
		emoVizEnabled: true
	},
	6: {
		recType: 'diverseN',
		emoTogglesEnabled: true,
		emoVizEnabled: false
	},
	7: {
		recType: 'diverseN',
		emoTogglesEnabled: false,
		emoVizEnabled: true
	},
	8: {
		recType: 'diverseN',
		emoTogglesEnabled: false,
		emoVizEnabled: false
	}
}