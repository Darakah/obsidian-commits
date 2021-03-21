import type { App, Component, MarkdownPostProcessorContext } from 'obsidian';
import { MarkdownRenderer } from 'obsidian';
import { chooseRandomNote, randomBlock } from './utils';
import type { SpotlightSettings } from './types';

export class SpotlightProcessor {

	async run(Comp: Component, source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext, app: App, settings: SpotlightSettings, block: boolean) {

		let args = {
			tags: '',
			match: '.*',
			divWidth: settings.divWidth,
			divHeight: settings.divHeight,
			divAlign: 'left'
		};

		source.split('\n').map(e => {
			if (e) {
				let param = e.trim().split('=');
				args[param[0]] = param[1]?.trim();
			}
		});

		let currentNote = ctx.sourcePath;
		let randomNote = chooseRandomNote(app.vault.getMarkdownFiles(), args.tags.split(';'), app.metadataCache, args.match, currentNote, block, settings);

		let elCanvas = el.createDiv({ cls: 'spotlight-container', attr: { id: 'container' } });
		elCanvas.setAttribute('style', `width:${args.divWidth}%; height:${args.divHeight}px; float: ${args.divAlign};`);

		if (!randomNote) {
			elCanvas.setText('No note was found for the given search parameters!');
			return;
		}

		let text = await app.vault.cachedRead(randomNote);

		elCanvas.createEl('a', { cls: "internal-link", href: `${randomNote.path}` }).createEl('i', {
			cls: 'fa fa-external-link spotlight-link',
			attr: { 'aria-hidden': 'true', 'style': 'float: right; padding-top: 10px; color: var(--text-normal);' }
		});

		if (block) {
			let blocks = app.metadataCache.getFileCache(randomNote).blocks;
			MarkdownRenderer.renderMarkdown(randomBlock(text, blocks), elCanvas, currentNote, Comp);
			return;
		}

		MarkdownRenderer.renderMarkdown(text, elCanvas, currentNote, Comp);
	}
}