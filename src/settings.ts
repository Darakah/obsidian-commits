import { App, PluginSettingTab, Setting } from 'obsidian';
import type SpotlightPlugin from './main';

export class SpotlightSettingTab extends PluginSettingTab {
    plugin: SpotlightPlugin;

    constructor(app: App, plugin: SpotlightPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        let ignoreFile = '';
        let unignoreFile = '';

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Spotlight Settings' });

        new Setting(containerEl)
            .setName('Default Width')
            .setDesc('Width in %. integer, placeholder shows current value.')
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
            .setName('Ignore file:')
            .setDesc('Add file to ignore list. Must be full vault path file name e.g. Folder 1/SubFolder/File_to_ignore.md')
            .addButton(text => text
                .setButtonText('Save')
                .onClick(() => {


                    if (ignoreFile === '/' || ignoreFile === '' || this.plugin.settings.ignoreList.contains(ignoreFile)) {
                        return;
                    }

                    this.plugin.settings.ignoreList.push(ignoreFile);
                    ignoreFile = '';
                    this.plugin.saveSettings();
                }))
            .addText(text => text
                .setPlaceholder(ignoreFile)
                .onChange(async (value) => {
                    ignoreFile = value.trim();
                }));

        new Setting(containerEl)
            .setName('Unignore file:')
            .setDesc('Remove file from ignore list. Must be full vault path file name e.g. Folder 1/SubFolder/File_to_ignore.md')
            .addButton(text => text
                .setButtonText('Save')
                .onClick(() => {

                    if (unignoreFile === '/' || !this.plugin.settings.ignoreList.contains(unignoreFile)) {
                        return;
                    }

                    this.plugin.settings.ignoreList.splice(this.plugin.settings.ignoreList.indexOf(unignoreFile), 1);
                    unignoreFile = '';
                    this.plugin.saveSettings();
                }))
            .addText(text => text
                .setPlaceholder(unignoreFile)
                .onChange(async (value) => {
                    unignoreFile = value.trim();
                }));

        new Setting(containerEl)
            .setName('Ignored List:')
            .setDesc(this.plugin.settings.ignoreList.join(" --------- "));
    }
}