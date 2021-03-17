import type { CommitsSettings } from './types'

export const SETTINGS: CommitsSettings = {
	initialized: false,
	trackedProjects: ['/'],
	filesCheckpoint: {},
	commitTypes: {
		'/': {}
	},
	dailyCommits: {
		'/': {}
	},
	weeklyCommits: {
		'/': {}
	},
	recentCommits: {
		'/': {}
	},
	ignoreList: [],
	topCommits: 2,
	commitThreshold: 2000,
	commitPerc: 15,
	width: 400,
	height: 400,
	widthDiv: 50,
	plotFill: '#3399cc',
	plotGrid: 'grey',
	divAlign: 'left'
}

export const commitDay = {
	'0': 'Sun',
	'1': 'Mon',
	'2': 'Tue',
	'3': 'Wed',
	'4': 'Thu',
	'5': 'Fri',
	'6': 'Sun'
}