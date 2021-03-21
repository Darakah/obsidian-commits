import { CommitsSettings, barChart, radarChart, unique } from './utils';

export class CommitProcessor {

	async run(source: string, el: HTMLElement, settings: CommitsSettings, type: string) {

		// read block arguments
		let args = {
			project: "/",
			topCommits: settings.topCommits,
			borderColor: settings.borderColor,
			gridColor: settings.gridColor,
			fillColor: settings.fillColor,
			divWidth: settings.divWidth,
			divHeight: settings.divHeight,
			divAlign: settings.divAlign,

		};

		source.split('\n').map(e => {
			if (e) {
				let param = e.trim().split('=');
				args[param[0]] = param[1]?.trim();
			}
		});

		let container = el.createDiv({
			cls: "commits-container",
			attr: { 'style': `width:${args.divWidth}%; height: ${args.divHeight}px; float: ${args.divAlign};` }
		});

		if (type === 'type') {

			let commitTypeData = settings.commitTypes[args.project];
			if (!commitTypeData) {
				container.setText(`${args.project} is not a tracked project!`);
				return;
			}

			let totalCommits = commitTypeData['Create'] + commitTypeData['Expand'] +
				commitTypeData['Refactor'] + commitTypeData['Link'];
			let linkPerc = Math.round(commitTypeData['Link'] / totalCommits * 100);
			let expandPerc = Math.round(commitTypeData['Expand'] / totalCommits * 100);
			let refactorPerc = Math.round(commitTypeData['Refactor'] / totalCommits * 100);
			let createPerc = Math.ceil(commitTypeData['Create'] / totalCommits * 100);

			let labels = ['Create', 'Expand', 'Refactor', 'Link' ];
			let data = [createPerc, expandPerc, refactorPerc, linkPerc];

			radarChart(labels, data, args.fillColor, args.borderColor, args.gridColor, container.createEl('canvas').getContext('2d'));
		}

		if (type === "weekly") {

			let commitWeeklyData = settings.weeklyCommits[args.project];

			if (!commitWeeklyData) {
				container.setText(`${args.project} is not a tracked project!`);
				return;
			}

			let labels = [];
			let values = [];
			Object.entries(commitWeeklyData).forEach(([key, value]) => {
				labels.push(key);
				values.push(value);
			});

			barChart(labels, values, args.fillColor, args.borderColor, args.gridColor, container.createEl('canvas').getContext('2d'));
		}

		if (type === "daily") {

			let commitDailyData = settings.dailyCommits[args.project];

			if (!commitDailyData) {
				container.setText(`${args.project} is not a tracked project!`);
				return;
			}

			let labels = [];
			let values = [];
			Object.entries(commitDailyData).forEach(([key, value]) => {
				labels.push(key);
				values.push(value);
			});

			barChart(labels, values, args.fillColor, args.borderColor, args.gridColor, container.createEl('canvas').getContext('2d'));
		}

		if (type === "recents") {

			let commitRecentsData = settings.recentCommits[args.project];

			if (!commitRecentsData) {
				container.setText(`${args.project} is not a tracked project!`);
				return;
			}

			container.createEl('b', { text: `Created `, attr: { 'style': `color: ${args.borderColor}` } });
			container.createSpan().innerHTML = `${commitRecentsData["Created"]?.filter(unique).length} new note(s)`;
			container.createEl('br');

			let types = ['Deleted', 'Renamed', 'Expanded', 'Refactored', 'Tagged', 'Linked', 'Removed Tags from', 'Removed Links from'];
			for (let type = 0; type < types.length; type++) {
				container.createEl('b', { text: `${types[type]} `, attr: { 'style': `color: ${args.borderColor}` } });
				container.createSpan().innerHTML = `${commitRecentsData[`${types[type]}`]?.filter(unique).length} note(s): 
			${commitRecentsData[`${types[type]}`]?.filter(unique).slice(0, args.topCommits)}`;
				container.createEl('br');
			}
		}
	}
}