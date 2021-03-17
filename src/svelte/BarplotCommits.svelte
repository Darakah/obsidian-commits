<script>
    import "anychart/dist/js/anychart-base.min";

    export let container;
    export let width = 400;
    export let height = 400;
    export let data;
    export let fillColor = "#E55934";
    export let gridColor = "grey";

    let chart = anychart.bar();
    chart.background().fill("transparent");
    chart.width(width);
    chart.height(height);
    chart.xAxis().stroke(gridColor);
    chart.xAxis().ticks().stroke(gridColor);
    chart.yAxis().ticks().stroke(gridColor);
    chart.yAxis().stroke(gridColor);

    let series = chart.bar(data);
    series.normal().fill(fillColor, 0.5);
    series.normal().stroke(fillColor, 1, "10 5", "round");

    chart.container(container);
    chart.draw();
</script>
