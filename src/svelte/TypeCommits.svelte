<script>
    import "anychart/dist/js/anychart-core.min";
    import "anychart/dist/js/anychart-radar.min";

    export let container;
    export let width = 400;
    export let height = 400;
    export let data;
    export let fillColor = "#E55934";
    export let gridColor = "grey";

    let chart = anychart.radar();

    chart.background().fill("transparent");
    chart.width(width);
    chart.height(height);
    chart.padding(0, 10, 0, 0);

    chart.area(data).markers(true).fill(fillColor, 0.5).stroke(fillColor);

    chart.yGrid().palette(["gray 0.05", "gray 0.1"]);
    chart.yGrid().stroke({
        color: "transparent",
        "z-index": -1,
    });

    chart.yAxis().labels(null);
    chart.yAxis().ticks(null);
    chart.xAxis().ticks(null);

    chart.xAxis().stroke({
        color: "transparent",
        thickness: 4,
    });

    chart.yGrid(null);
    chart.xGrid().stroke({
        color: gridColor,
        thickness: 2,
    });

    chart.yAxis().stroke({
        color: gridColor,
        thickness: 2,
    });

    let xLabels = chart.xAxis().labels();
    xLabels.fontWeight(900);
    xLabels.useHtml(true);
    xLabels.wordWrap("break-word");

    // create a logarithmic scale
    let Scale = anychart.scales.linear();

    // set the minimum and maximum values of the scale
    Scale.minimum(0);
    //Scale.maximum(100);

    // set the logarithmic scale as the y-scale
    chart.yScale(Scale);

    chart.container(container);
    chart.draw();
</script>
