import type { TFile, MetadataCache } from 'obsidian';
import Chart from 'chart.js';

export interface CommitsSettings {

    initialized: boolean,
    trackedProjects: string[],
    filesCheckpoint: fileCheckpoint,
    commitTypes: { [key: string]: commitsActivity; },
    dailyCommits: { [key: string]: commitsActivity; },
    weeklyCommits: { [key: string]: commitsActivity; },
    recentCommits: { [key: string]: commitsHistory; },
    ignoreList: string[],
    divWidth: number,
    divHeight: number,
    divAlign: string,
    fillColor: string,
    gridColor: string,
    borderColor: string,
    topCommits: number,
    commitThreshold: number,
    commitPerc: number,
}

export interface commitsActivity { [key: string]: number; }

export interface commitsHistory { [key: string]: string[]; }

export interface fileCheckpoint {
    [key: string]: {
        size: number,
        links: number,
        tags: number;
    };
}

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

    divWidth: 50,
    divHeight: 400,
    divAlign: 'left',

    topCommits: 2,
    commitThreshold: 2000,
    commitPerc: 15,
    fillColor: 'rgba(51, 153, 204, 0.4)',
    borderColor: 'rgba(51, 153, 204, 1)',
    gridColor: 'grey'
};

export const commitDay = {
    '0': 'Sun',
    '1': 'Mon',
    '2': 'Tue',
    '3': 'Wed',
    '4': 'Thu',
    '5': 'Fri',
    '6': 'Sun'
};

/**
 * Sorted array based on index
 */
export const unique = (value, index, self) => {
    return self.indexOf(value) === index;
};

/**
 * Check if project path is valid (at least 1 md file contained)
 * @param projectPath - obsidian note file
 * @param vaultFiles - obsidian md file list
 */

export const isValidProject = (projectPath: string, vaultFiles: TFile[]): boolean => {
    let reg = new RegExp(`^${projectPath}\/.*\.md$`);
    for (let file in vaultFiles) {
        if (vaultFiles[file].path.match(reg)) {
            return true;
        }
    }
    return false;
};


/**
 * Return size, # of tags & # of links for specified file
 * @param file - obsidian note file
 * @param metadataCache - obsidian metadata cache handler
 */
export function getFileStats(file: TFile, metadataCache: MetadataCache): number[] {
    return [file.stat.size, getTagCount(file, metadataCache), getLinkCount(file, metadataCache)];
}

/**
 * Return size, # of tags & # of links for specified file
 * @param fileList - obsidian note file list
 * @param metadataCache - obsidian metadata cache handler
 * @param settings - commits plugin settings
 */
export function updateFilesCheckpoint(fileList: TFile[], metadataCache: MetadataCache, settings: CommitsSettings): void {
    for (let file = 0; file < fileList.length; file++) {
        let fileSize = fileList[file].stat.size;
        let fileCheckpoint = settings.filesCheckpoint[fileList[file].path].size;
        let sizeChange = fileSize - fileCheckpoint;
        let newTagCount = getTagCount(fileList[file], metadataCache);
        let newLinkCount = getLinkCount(fileList[file], metadataCache);
        let tagChange = newTagCount - settings.filesCheckpoint[fileList[file].path].tags;
        let linkChange = newLinkCount - settings.filesCheckpoint[fileList[file].path].links;

        if (fileSize > settings.commitThreshold && sizeChange > (settings.commitPerc / 100 * fileCheckpoint)) {
            updateProjects(fileList[file].path, settings, 'Expand', 'Expanded', fileList[file].name);
            settings.filesCheckpoint[fileList[file].path].size = fileList[file].stat.size;
        }

        if (fileSize > settings.commitThreshold && sizeChange < (-settings.commitPerc / 100 * fileCheckpoint)) {
            updateProjects(fileList[file].path, settings, 'Refactor', 'Refactored', fileList[file].name);
            settings.filesCheckpoint[fileList[file].path].size = fileList[file].stat.size;
        }

        if (tagChange > 0) {
            updateProjects(fileList[file].path, settings, 'Link', 'Tagged', fileList[file].name);
            settings.filesCheckpoint[fileList[file].path].tags = newTagCount;
        }

        if (tagChange < 0) {
            updateProjects(fileList[file].path, settings, 'Refactor', 'Removed Tags from', fileList[file].name);
            settings.filesCheckpoint[fileList[file].path].tags = newTagCount;
        }

        if (linkChange > 0) {
            updateProjects(fileList[file].path, settings, 'Link', 'Linked', fileList[file].name);
            settings.filesCheckpoint[fileList[file].path].links = newLinkCount;
        }

        if (linkChange < 0) {
            updateProjects(fileList[file].path, settings, 'Refactor', 'Removed Links from', fileList[file].name);
            settings.filesCheckpoint[fileList[file].path].links = newLinkCount;
        }
    }
}

/**
 * Return TFile for specified file path
 * @param markdownFiles - obsidian markdown TFile list
 * @param path - obsidian note path as string
 */
export function getTFilebyPath(markdownFiles: TFile[], path: string): TFile {
    for (let i = 0; i < markdownFiles.length; i++) {
        if (markdownFiles[i].path.match(path)) {
            return markdownFiles[i];
        }
    }
    return null;
}

/**
 * Return count of tags for specified file
 * @param file - obsidian note file
 * @param metadataCache - obsidian metadata cache handler
 */
export function getTagCount(file: TFile, metadataCache: MetadataCache): number {
    let fileCache = metadataCache.getFileCache(file);
    let tags = [];

    if (fileCache && fileCache.tags) {
        tags = fileCache.tags.map(i => i.tag.substring(1,));
    }

    if (fileCache && fileCache.frontmatter && fileCache.frontmatter.tags) {
        tags = fileCache.frontmatter.tags.concat(tags);
    }

    return tags.filter(unique).length;
}


/**
 * Return count of links for specified file
 * @param file - obsidian note file
 * @param metadataCache - obsidian metadata cache handler
 */
export function getLinkCount(file: TFile, metadataCache: MetadataCache): number {
    let fileCache = metadataCache.getFileCache(file);
    let links = [];

    if (fileCache && fileCache.links) {
        fileCache.links.forEach(e => {
            links.push(e.link);
        });
    }

    if (fileCache && fileCache.embeds) {
        fileCache.embeds.forEach(e => {
            links.push(e.link);
        });
    }

    return links.filter(unique).length;
}

/**
 * Initialize files checkpoint 
 * @param fileList - obsidian markdown file list
 * @param metadataCache - obsidian metadata cache handler
 * @param settings - commits settings 
 */

export function initializeFilesCheckpoint(fileList: TFile[], metadataCache: MetadataCache, settings: CommitsSettings): void {

    for (let file = 0; file < fileList.length; file++) {
        let fileStats = getFileStats(fileList[file], metadataCache);
        settings.filesCheckpoint[fileList[file].path] = { size: fileStats[0], tags: fileStats[1], links: fileStats[2] };
    }

    settings.commitTypes['/'] = {
        'Refactor': 0,
        'Create': 0,
        'Link': 0,
        'Expand': 0
    };
    settings.dailyCommits['/'] = {
        '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0,
        '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, '18': 0, '19': 0, '20': 0, '21': 0, '22': 0, '23': 0
    };
    settings.weeklyCommits['/'] = {
        'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
    };
    settings.recentCommits['/'] = {
        'Expanded': [],
        'Created': [],
        'Renamed': [],
        'Tagged': [],
        'Refactored': [],
        'Deleted': [],
        'Linked': [],
        'Removed Tags from': [],
        'Removed Links from': []
    };
}

/**
 * Add project to tracked list and intialize its stats 
 * @param path - relative vault path
 * @param settings - commits settings 
 */

export function trackProject(path: string, settings: CommitsSettings): void {
    settings.trackedProjects.push(path);
    settings.commitTypes[path] = {
        'Refactor': 0,
        'Create': 0,
        'Link': 0,
        'Expand': 0
    };
    settings.dailyCommits[path] = {
        '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0, '11': 0,
        '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, '18': 0, '19': 0, '20': 0, '21': 0, '22': 0, '23': 0
    };
    settings.weeklyCommits[path] = {
        'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
    };
    settings.recentCommits[path] = {
        'Expanded': [],
        'Created': [],
        'Renamed': [],
        'Tagged': [],
        'Refactored': [],
        'Deleted': [],
        'Linked': [],
        'Removed Tags from': [],
        'Removed Links from': []
    };
}

/**
 * Remove project from tracked list & remove its commit data
 * @param path - relative vault path
 * @param settings - commits settings 
 */

export function removeProject(path: string, settings: CommitsSettings): void {
    settings.trackedProjects.splice(settings.trackedProjects.indexOf(path), 1);
    delete settings.commitTypes[path];
    delete settings.dailyCommits[path];
    delete settings.weeklyCommits[path];
    delete settings.recentCommits[path];
}

export function updateProjects(filePath: string, settings: CommitsSettings, commitType: string, commitAction: string, fileTitle: string): void {
    let date = new Date();

    for (let project = 0; project < settings.trackedProjects.length; project++) {
        let reg = new RegExp(`^${settings.trackedProjects[project]}\/.*\.md$`);
        if (settings.trackedProjects[project] === '/') {
            reg = new RegExp(`^.*\.md$`);
        }

        if (filePath.match(reg)) {
            // Increment that commit type
            settings.commitTypes[settings.trackedProjects[project]][commitType] += 1;
            let commitHistory = settings.recentCommits[settings.trackedProjects[project]][commitAction];
            if (commitHistory.length > 50) {
                commitHistory.pop();
                commitHistory.unshift(`<a class="internal-link" href="${filePath}"> ${fileTitle.slice(0, fileTitle.length - 3)} </a>`);
            } else {
                commitHistory.push(`<a class="internal-link" href="${filePath}"> ${fileTitle.slice(0, fileTitle.length - 3)} </a>`);
            }
            settings.dailyCommits[settings.trackedProjects[project]][`${date.getHours()}`] += 1;
            settings.weeklyCommits[settings.trackedProjects[project]][commitDay[`${date.getDay()}`]] += 1;
        }
    }
}

/**
 * Plot Bar chart
 * @param labels - y-axis categories
 * @param data - data for each label
 * @param fillColor - fill color
 * @param borderColor - border color
 * @param gridColor - grid color
 * @param ctx - context to plot chart on
 */

export function barChart(labels: string[], data: number[], fillColor: string, borderColor: string, gridColor: string, ctx: CanvasRenderingContext2D): void {
    new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: fillColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        drawBorder: true,
                        drawOnChartArea: false,
                        drawTicks: false,
                        color: gridColor,
                        display: false
                    },

                    ticks: {
                        beginAtZero: true,
                        display: false
                    }
                }],

                yAxes: [{
                    gridLines: {
                        drawBorder: true,
                        drawOnChartArea: false,
                        drawTicks: false,
                        color: gridColor
                    },

                    ticks: {
                        beginAtZero: true,
                        padding: 10
                    }
                }]
            }
        }
    });
}

/**
 * Plot Radar chart
 * @param labels - y-axis categories
 * @param data - data for each label
 * @param fillColor - fill color
 * @param borderColor - border color
 * @param gridColor - grid color
 * @param ctx - context to plot chart on
 */

export function radarChart(labels: string[], data: number[], fillColor: string, borderColor: string, gridColor: string, ctx: CanvasRenderingContext2D): void {
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '%',
                data: data,
                backgroundColor: fillColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },

            tooltips: {
                callbacks: {
                    title: (tooltipItem, data) => data.labels[tooltipItem[0].index]
                }
            },

            scale: {
                gridLines: {
                    color: 'transparent'
                },

                angleLines: {
                    color: gridColor,
                    fontColor: 'red',
                    lineWidth: 1.5,

                },

                angleTicks: {
                    color: 'red'
                },

                ticks: {
                    display: false,
                    max: Math.max(data[0], data[1], data[2], data[3]) + 5,
                    maxTicksLimit: 1
                },

                pointLabels: {
                    fontColor: borderColor,
                    fontSize: 14,
                    fontFamily: 'Arial',
                    fontStyle: 900
                }
            }
        }
    });
}