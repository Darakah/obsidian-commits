import type { TFile, MetadataCache, BlockCache } from 'obsidian';
import { getAllTags } from 'obsidian';
import type { SpotlightSettings } from './types';

/**
 * Return boolean if all tags present in obsidian note
 * @param file - obsidian note file
 * @param tagList - list of tags
 * @param metadataCache - vault metadata handler
 */
export function FilterMDFilesByTags(file: TFile, tagList: string[], metadataCache: MetadataCache): boolean {

    if (!tagList) {
        return true;
    }

    let tags = getAllTags(metadataCache.getFileCache(file)).map(e => e.slice(1, e.length));

    if (tags && tags.length > 0) {
        return tagList.every(function (val) { return tags.indexOf(val) >= 0; });
    }

    return false;
}

/**
 * Return random number between min and max
 * @param min - minimum possible number
 * @param max - maximum possible number
 */
function randomNumber(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return random note based on tags, block presence and path match
 * @param fileList - note md file list
 * @param tagList - list of tags
 * @param metadataCache - vault metadata handler
 * @param match - path regex match
 * @param currentPath - path of current note
 * @param block - whether to consider blocks or note
 */
export function chooseRandomNote(fileList: TFile[], tagList: string[], metadataCache: MetadataCache, match: string, currentPath: string, block: boolean, settings: SpotlightSettings): TFile {

    // Remove "" from tag list if present
    if (tagList.contains("")) {
        if (tagList.length === 1) {
            tagList = null;
        } else {
            tagList = tagList.splice(tagList.indexOf(""), 1);
        }
    }

    let regex;
    // Catch errors such as '.**' caused by bad regex expressions
    try {
        regex = new RegExp(match);
    } catch (error) {
        regex = ".*";
    }

    let fileFiltered = fileList.filter(file => file.path.match(regex) &&
        FilterMDFilesByTags(file, tagList, metadataCache) &&
        (!block || metadataCache.getFileCache(file).blocks) &&
        !settings.ignoreList.contains(file.path));

    let rand = randomNumber(0, fileFiltered.length - 1);

    if (fileFiltered.length === 0) {
        return null;
    }

    if (fileFiltered[rand].path == currentPath && fileFiltered.length == 1) {
        return null;
    }

    while (fileFiltered[rand].path == currentPath) {
        rand = randomNumber(0, fileFiltered.length - 1);
    }

    return fileFiltered[rand];
}

/**
 * Return random block from note
 * @param text - note full text
 * @param blocks - note metadata cache blocks
 */
export function randomBlock(text: string, blocks: Record<string, BlockCache>): string {
    let blockKeys = Object.keys(blocks);
    let rand = randomNumber(0, blockKeys.length - 1);
    let pos = blocks[blockKeys[rand]].position;

    return text.slice(pos.start.offset, pos.end.offset);
}