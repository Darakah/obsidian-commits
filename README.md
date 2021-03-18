# Obsidian Commits
![GitHub release)](https://img.shields.io/github/v/release/Darakah/obsidian-word-cloud)
![GitHub all releases](https://img.shields.io/github/downloads/Darakah/obsidian-word-cloud/total)

Track &amp; Review commits in obsidian vault or specified project. (Github like commit review)

## Example

<img src="https://raw.githubusercontent.com/Darakah/obsidian-commits/main/images/Example_1.png"/>

## Features
- Track an obsidian vault / project's growth 
- Growth is divided into 4 categories: 
  - Create: Creating new notes
  - Expand: Increase size of already existing notes (threshold of change can be changed in settings, default 15% increase in size)
  - Link: Tag / Link a note (new connection)
  - Refactor: Restructuring includes deleting files, decreasing size of a file by a certain amount (default 15%), renaming, untagging and unlinking

- A unit of work is reffered to as a commit and is classified in one of the 4 categories above
- Show commits over hour of day
- Show commits over day of the week
- Show recent commits
- Track specific project or vault
- Custumize width / height / alignment / fill color / grid color of the different render blocks

**IMPORTANT: file size change / tag & link change are updated every 5 min!!**

## Usage

- To display a specific block use its corresponding block id: `commits-recents`, `commits-type`, `commits-weekly`, `commits-daily`
- For each block, each line represents a certain argument (Arguments are identified by the row number i.e. if you want to use a later argument YOU MUST LEAVE AN EMPTY LINE FOR PREVIOUS UNSET ARGUMENTS OTHERWISE IT WON'T WORK!)
- For the blocks `commits-type`, `commits-weekly`, `commits-daily` and by order of lines the parameters are the following:
   * `Project Path`, by default only the whole vault is tracked and can be shown `/`. To track a new project use the settings tab of the plugin.
   * `Width in Pixels` of the image
   * `Height in Pixels` of the image 
   * `Fill color`
   * `Grid color`
   * `Div container alignment` i.e. `right` or `left`
   * `Div width in %` 

- For the block `commits-recents` parameters are:
   * `Project Path`, by default only the whole vault is tracked and can be shown `/`. To track a new project use the settings tab of the plugin.
   * `Height in Pixels` of the image 
   * `Fill color`
   * `Top number of recent commits to show for each category`
   * `Div container alignment` i.e. `right` or `left`
   * `Div width in %` 

<img src="https://raw.githubusercontent.com/Darakah/obsidian-commits/main/images/Example_2.png"/>

## Settings:
<img src="https://raw.githubusercontent.com/Darakah/obsidian-commits/main/images/Settings_1.png"/>
<img src="https://raw.githubusercontent.com/Darakah/obsidian-commits/main/images/Settings_2.png"/>

## Release Notes

### v0.1.2
- Initial release


## Support

[![Github Sponsorship](https://raw.githubusercontent.com/Darakah/Darakah/e0fe245eaef23cb4a5f19fe9a09a9df0c0cdc8e1/icons/github_sponsor_btn.svg)](https://github.com/sponsors/Darakah) [<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/darakah)
