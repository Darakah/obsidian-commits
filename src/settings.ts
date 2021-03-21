import { App, PluginSettingTab, Setting } from 'obsidian';
import { isValidProject, trackProject, removeProject } from './utils';
import type CommitsPlugin from './main';

export class CommitsSettingTab extends PluginSettingTab {
    plugin: CommitsPlugin;

    constructor(app: App, plugin: CommitsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;
        let trackProjectInput = '';
        let untrackProjectInput = '';

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Commits Settings' });

        new Setting(containerEl)
            .setName('Expansion / Deleteion %')
            .setDesc(`Specify the percentage change in a note\'s size to be considered as an 
        expansion or deleteion (size of note is in characters shown by obsidian). 
        integer, placeholder shows current value.`)
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.commitPerc}`)
                .onChange(async (value) => {
                    let numValue = parseInt(value);
                    if (isNaN(numValue)) {
                        return;
                    }

                    this.plugin.settings.commitPerc = Math.abs(numValue);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Minimum note size (# of characters)')
            .setDesc(`Specify the minimum # of characters that a note must reach to be monitored for expansion / deletion events.
            integer, placeholder shows current value.`)
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.commitThreshold}`)
                .onChange(async (value) => {
                    let numValue = parseInt(value);
                    if (isNaN(numValue)) {
                        return;
                    }

                    this.plugin.settings.commitThreshold = Math.abs(numValue);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default Width')
            .setDesc('Width div container in %. integer, placeholder shows current value.')
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.divWidth}`)
                .onChange(async (value) => {
                    let numValue = parseInt(value);
                    if (isNaN(numValue)) {
                        return;
                    }

                    this.plugin.settings.divWidth = Math.abs(numValue);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default Height')
            .setDesc('Height in pixels. integer, placeholder shows current value.')
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.divHeight}`)
                .onChange(async (value) => {
                    let numValue = parseInt(value);
                    if (isNaN(numValue)) {
                        return;
                    }

                    this.plugin.settings.divHeight = Math.abs(numValue);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default Top number of recent commits')
            .setDesc('Top number of recent commits per type to show. Placeholder shows current value.')
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.topCommits}`)
                .onChange(async (value) => {
                    let numValue = parseInt(value);
                    if (isNaN(numValue)) {
                        return;
                    }

                    this.plugin.settings.topCommits = Math.abs(numValue);
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default plot fill color')
            .setDesc('Placeholder shows current value.')
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.fillColor}`)
                .onChange(async (value) => {

                    this.plugin.settings.fillColor = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default plot border color')
            .setDesc('Placeholder shows current value.')
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.borderColor}`)
                .onChange(async (value) => {
                    this.plugin.settings.borderColor = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default plot grid color')
            .setDesc('Placeholder shows current value.')
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.gridColor}`)
                .onChange(async (value) => {
                    this.plugin.settings.gridColor = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default div alignment')
            .setDesc('Placeholder shows current value.')
            .addText(text => text
                .setPlaceholder(`${this.plugin.settings.divAlign}`)
                .onChange(async (value) => {
                    this.plugin.settings.divAlign = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Track project:')
            .setDesc('Track project commits. e.g. write `Project 1` to track the project located in `/Project 1`')
            .addButton(text => text
                .setButtonText('Save')
                .onClick(() => {


                    if (trackProjectInput === '/' || trackProjectInput === '' || this.plugin.settings.trackedProjects.contains(trackProjectInput) || !isValidProject(trackProjectInput, this.app.vault.getMarkdownFiles())) {
                        return;
                    }

                    trackProject(trackProjectInput, this.plugin.settings);
                    trackProjectInput = '';
                    this.plugin.saveSettings();
                }))
            .addText(text => text
                .setPlaceholder(trackProjectInput)
                .onChange(async (value) => {
                    trackProjectInput = value.trim();
                }));

        new Setting(containerEl)
            .setName('Untrack Project:')
            .setDesc('Remove project from the tracking list. e.g. `Project 1`')
            .addButton(text => text
                .setButtonText('Save')
                .onClick(() => {

                    if (untrackProjectInput === '/' || !this.plugin.settings.trackedProjects.contains(untrackProjectInput)) {
                        return;
                    }

                    removeProject(untrackProjectInput, this.plugin.settings);
                    untrackProjectInput = '';
                    this.plugin.saveSettings();
                }))
            .addText(text => text
                .setPlaceholder(untrackProjectInput)
                .onChange(async (value) => {
                    untrackProjectInput = value.trim();
                }));

        new Setting(containerEl)
            .setName('Tracked Projects:')
            .setDesc(this.plugin.settings.trackedProjects.join(" --------- "));
    }
}