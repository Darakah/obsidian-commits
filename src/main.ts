import { Plugin, TAbstractFile } from 'obsidian';
import { CommitProcessor } from './block';
import { updateProjects, initializeFilesCheckpoint, getFileStats, getTFilebyPath, updateFilesCheckpoint, SETTINGS, CommitsSettings } from './utils';
import { CommitsSettingTab } from './settings';

export default class CommitsPlugin extends Plugin {
	settings: CommitsSettings;
	containerEl: HTMLElement;

	async onload() {
		// Load message
		await this.loadSettings();
		console.log('Loaded Commits Plugin');

		// Register commits type block renderer
		this.registerMarkdownCodeBlockProcessor('commits-type', async (source, el) => {
			const proc = new CommitProcessor();
			await proc.run(source, el, this.settings, 'type');
		});

		// Register commits weekly block renderer
		this.registerMarkdownCodeBlockProcessor('commits-weekly', async (source, el) => {
			const proc = new CommitProcessor();
			await proc.run(source, el, this.settings, 'weekly');
		});

		// Register commits daily block renderer
		this.registerMarkdownCodeBlockProcessor('commits-daily', async (source, el) => {
			const proc = new CommitProcessor();
			await proc.run(source, el, this.settings, 'daily');
		});

		// Register commits recents block renderer
		this.registerMarkdownCodeBlockProcessor('commits-recents', async (source, el) => {
			const proc = new CommitProcessor();
			await proc.run(source, el, this.settings, 'recents');
		});

		this.commitsDelete = this.commitsDelete.bind(this);
		this.commitsRename = this.commitsRename.bind(this);
		this.commitsCreate = this.commitsCreate.bind(this);
		this.initialize = this.initialize.bind(this);
		this.registerEvent(this.app.workspace.on("layout-ready", this.initialize));
		this.registerEvent(this.app.vault.on("delete", this.commitsDelete));
		this.registerEvent(this.app.vault.on("rename", this.commitsRename));
		this.registerEvent(this.app.vault.on('create', this.commitsCreate));

		// Update all tracked projects
		setInterval(() => {
			updateFilesCheckpoint(this.app.vault.getMarkdownFiles(), this.app.metadataCache, this.settings);
			this.saveSettings();
		}, 300000);

		this.addSettingTab(new CommitsSettingTab(this.app, this));
	}

	onunload() {
		console.log('unloading Commits Plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async commitsCreate(file: TAbstractFile) {
		let Tfile = getTFilebyPath(this.app.vault.getMarkdownFiles(), file.path);

		if (this.settings.initialized && Tfile && !this.settings.filesCheckpoint[file.path]) {
			// Add file to files Checkpoint
			let fileStats = getFileStats(Tfile, this.app.metadataCache);
			this.settings.filesCheckpoint[file.path] = { size: fileStats[0], tags: fileStats[1], links: fileStats[2] };
			// Register a creation commit
			updateProjects(file.path, this.settings, 'Create', 'Created', file.name);
		}
	}

	async initialize() {
		if (!this.settings.initialized) {
			initializeFilesCheckpoint(this.app.vault.getMarkdownFiles(), this.app.metadataCache, this.settings);
			this.settings.initialized = true;
			await this.saveData(this.settings);
		}
	}

	async commitsDelete(file: TAbstractFile) {
		if (this.settings.filesCheckpoint[file.path]) {
			// Remove file from files Checkpoint
			delete this.settings.filesCheckpoint[file.path];
			// Register a refractoring commit
			updateProjects(file.path, this.settings, 'Refactor', 'Deleted', file.name);
			await this.saveData(this.settings);
		}
	}

	async commitsRename(file: TAbstractFile, oldPath: string) {

		if (this.settings.filesCheckpoint[oldPath]) {

			// If rename event is on newly created file ignore it
			let regex = new RegExp('.*Untitled.*');
			this.settings.filesCheckpoint[file.path] = this.settings.filesCheckpoint[oldPath];
			delete this.settings.filesCheckpoint[oldPath];
			// Register a refractoring commit
			if (oldPath.match(regex)) {
				return;
			}

			updateProjects(file.path, this.settings, 'Refactor', 'Renamed', file.name);
			await this.saveData(this.settings);
		}
	}
}