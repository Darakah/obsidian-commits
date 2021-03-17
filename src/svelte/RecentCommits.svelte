<script>
    import { unique } from "../utils";
    export let top = 2;
    export let data;
    export let fillColor = "#E55934";
</script>

<b style="color: {fillColor}"> Created </b>
{data["Created"]?.filter(unique).length} new note(s) <br />
<b style="color: {fillColor}"> Deleted </b>
{data["Deleted"]?.filter(unique).length} note(s): {@html data["Deleted"]
    ?.filter(unique)
    .slice(0, top)} <br />
<b style="color: {fillColor}"> Renamed </b>
{data["Renamed"]?.filter(unique).length} note(s): {@html data["Renamed"]
    ?.filter(unique)
    .slice(0, top)} <br />
<b style="color: {fillColor}"> Expanded </b>
{data["Expanded"]?.filter(unique).length} note(s): {@html data["Expanded"]
    ?.filter(unique)
    .slice(0, top)} <br />
<b style="color: {fillColor}"> Refactored </b>
{data["Refactored"]?.filter(unique).length} note(s): {@html data["Refactored"]
    ?.filter(unique)
    .slice(0, top)} <br />
<b style="color: {fillColor}"> Tagged </b>
{data["Tagged"]?.filter(unique).length} note(s): {@html data["Tagged"]
    ?.filter(unique)
    .slice(0, top)} <br />
<b style="color: {fillColor}"> Linked </b>
{data["Linked"]?.filter(unique).length} note(s): {@html data["Linked"]
    ?.filter(unique)
    .slice(0, top)} <br />
<b style="color: {fillColor}"> Removed Tags from </b>
{data["Removed Tags from"]?.filter(unique).length} note(s): {@html data["Removed Tags from"]
    ?.filter(unique)
    .slice(0, top)} <br />
<b style="color: {fillColor}"> Removed Links from </b>
{data["Removed Links from"]?.filter(unique).length} note(s): {@html data["Removed Links from"]
    ?.filter(unique)
    .slice(0, top)} <br />
