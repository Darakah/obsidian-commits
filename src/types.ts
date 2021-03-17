export interface CommitsSettings {

	initialized: boolean,
	trackedProjects: string[],
	filesCheckpoint: fileCheckpoint,
	commitTypes: { [key: string]: commitsActivity },
	dailyCommits: { [key: string]: commitsActivity },
	weeklyCommits: { [key: string]: commitsActivity },
	recentCommits: { [key: string]: commitsHistory },
	ignoreList: string[],
	topCommits: number,
	commitThreshold: number,
	commitPerc: number,
	width: number,
	height: number,
	widthDiv: number,
	plotFill: string,
	plotGrid: string,
	divAlign: string
}

export interface commitsActivity { [key: string]: number }
export interface commitsHistory { [key: string]: string[] }

export interface fileCheckpoint {
	[key: string]: {
		size: number,
		links: number,
		tags: number
	}
}