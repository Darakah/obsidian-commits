import type { CommitsSettings } from './types';
import TypeCommits from './svelte/TypeCommits.svelte'
import BarplotCommits from './svelte/BarplotCommits.svelte'
import RecentCommits from './svelte/RecentCommits.svelte'

export class CommitTypesProcessor {

	async run(source: string, el: HTMLElement, settings: CommitsSettings, args: string[]) {

		source = source.trim()
		let project = args[0] ? `${args[0]}` : "/"
		let widthPar = parseInt(args[1]) ? parseInt(args[1]) : 400
		let heightPar = parseInt(args[2]) ? parseInt(args[2]) : settings.height
		let fillColor = args[3] ? args[3] : settings.plotFill
		let gridColor = args[4] ? args[4] : settings.plotGrid
		let align = args[5] ? args[5] : settings.divAlign
		let widthDiv = parseInt(args[6]) ? parseInt(args[6]) : settings.width

		let container = el.createDiv({
			cls: "commits-container",
			attr: { 'style': `width:${widthDiv}%; height: ${heightPar}px; float: ${align};` }
		})

		if (!settings.commitTypes[project]) {
			container.setText(`${project} is not a tracked project!`)
			return;
		}

		let totalCommits = settings.commitTypes[project]['Create'] + settings.commitTypes[project]['Expand'] +
			settings.commitTypes[project]['Refactor'] + settings.commitTypes[project]['Link']
		let linkPerc = Math.round(settings.commitTypes[project]['Link'] / totalCommits * 100)
		let expandPerc = Math.round(settings.commitTypes[project]['Expand'] / totalCommits * 100)
		let refactorPerc = Math.round(settings.commitTypes[project]['Refactor'] / totalCommits * 100)
		let createPerc = Math.ceil(settings.commitTypes[project]['Create'] / totalCommits * 100)

		let data = [
			{ x: `<span style='color:${fillColor}'> Create <p style='color:${gridColor}; font-weight:300;'> <br> </br> ${createPerc ? createPerc : 0}% </p></span>`, value: createPerc },
			{ x: `<span style='color:${fillColor}'> Expand <p style='color:${gridColor}; font-weight:300;'> <br> </br> ${expandPerc ? expandPerc : 0}% </p></span>`, value: expandPerc },
			{ x: `<span style='color:${fillColor}'> Refactor <p style='color:${gridColor}; font-weight:300;'> <br> </br> ${refactorPerc ? refactorPerc : 0}% </p></span>`, value: refactorPerc },
			{ x: `<span style='color:${fillColor}'> Link <p style='color:${gridColor}; font-weight:300;'> <br> </br> ${linkPerc ? linkPerc : 0}% </p></span>`, value: linkPerc }
		]

		new TypeCommits({
			props: {
				container: container,
				data: data,
				width: widthPar,
				height: heightPar,
				fillColor: fillColor,
				gridColor: gridColor
			},

			target: container
		})
	}
}

export class CommitWeeklyProcessor {

	async run(source: string, el: HTMLElement, settings: CommitsSettings, args: string[]) {

		source = source.trim()
		let project = args[0] ? `${args[0]}` : "/"
		let widthPar = parseInt(args[1]) ? parseInt(args[1]) : 400
		let heightPar = parseInt(args[2]) ? parseInt(args[2]) : settings.height
		let fillColor = args[3] ? args[3] : settings.plotFill
		let gridColor = args[4] ? args[4] : settings.plotGrid
		let align = args[5] ? args[5] : settings.divAlign
		let widthDiv = parseInt(args[6]) ? parseInt(args[6]) : settings.width

		let container = el.createDiv({
			cls: "commits-container",
			attr: { 'style': `width:${widthDiv}%; height: ${heightPar}px; float: ${align};` }
		})

		if (!settings.weeklyCommits[project]) {
			container.setText(`${project} is not a tracked project!`)
			return;
		}

		let data = [];
		Object.entries(settings.weeklyCommits[project]).forEach(([key, value]) => {
			data.push({ x: key, value: value })
		})

		new BarplotCommits({
			props: {
				container: container,
				data: data,
				width: widthPar,
				height: heightPar,
				fillColor: fillColor,
				gridColor: gridColor
			},

			target: container
		})
	}
}

export class CommitDailyProcessor {

	async run(source: string, el: HTMLElement, settings: CommitsSettings, args: string[]) {

		source = source.trim()
		let project = args[0] ? `${args[0]}` : "/"
		let widthPar = parseInt(args[1]) ? parseInt(args[1]) : 400
		let heightPar = parseInt(args[2]) ? parseInt(args[2]) : settings.height
		let fillColor = args[3] ? args[3] : settings.plotFill
		let gridColor = args[4] ? args[4] : settings.plotGrid
		let align = args[5] ? args[5] : settings.divAlign
		let widthDiv = parseInt(args[6]) ? parseInt(args[6]) : settings.width

		let container = el.createDiv({
			cls: "commits-container",
			attr: { 'style': `width:${widthDiv}%; height: ${heightPar}px; float: ${align};` }
		})

		if (!settings.dailyCommits[project]) {
			container.setText(`${project} is not a tracked project!`)
			return;
		}

		let data = [];
		Object.entries(settings.dailyCommits[project]).forEach(([key, value]) => {
			data.push({ x: key, value: value })
		})

		new BarplotCommits({
			props: {
				container: container,
				data: data,
				width: widthPar,
				height: heightPar,
				fillColor: fillColor,
				gridColor: gridColor
			},

			target: container
		})
	}
}

export class CommitRecentsProcessor {

	async run(source: string, el: HTMLElement, settings: CommitsSettings, args: string[]) {

		source = source.trim()
		let project = args[0].trim() ? args[0].trim() : "/"
		let heightPar = parseInt(args[1]) ? parseInt(args[1]) : settings.height
		let fillColor = args[2] ? args[2] : settings.plotFill
		let top = args[3] ? args[3] : 3
		let align = args[4] ? args[4] : settings.divAlign
		let widthDiv = parseInt(args[5]) ? parseInt(args[5]) : settings.width

		let container = el.createDiv({
			cls: "commits-container",
			attr: { 'style': `width:${widthDiv}%; height: ${heightPar}px; float: ${align};` }
		})

		if (!settings.recentCommits[project]) {
			container.setText(`${project} is not a tracked project!`)
			return;
		}

		new RecentCommits({
			props: {
				container: container,
				data: settings.recentCommits[project],
				fillColor: fillColor,
				top: top
			},

			target: container
		})
	}
}