$(document).ready(function() {
    const body = d3.select('body');
    const nightDaySwitch = d3.select('#night-day-switch');
    const nightDayCheckbox = d3.select('#night-day-checkbox');

    nightDaySwitch.on('click', function() {
        if (nightDayCheckbox.property('checked')) {
            body.classed('night', false);
        } else {
            body.classed('night', true);
        }
    });

    // Set copyright year
    d3.select('#copyright-year')
        .text(new Date().getFullYear());
});