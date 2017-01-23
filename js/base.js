function scrollTween(offset) {
  return function() {
    var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
    return function(t) {scrollTo(0, i(t))};
  };
};

$(document).ready(function() {
  d3.select(window).on("scroll", function() {
    if (window.scrollY <= 50) {
      d3.select(".navbar").classed("top-nav-collapse", false);
    } else {
      d3.select(".navbar").classed("top-nav-collapse", true);
    }
  });

  d3.selectAll("a.page-scroll").on("click", function() {
    var link = d3.select(this);
    var target = d3.select(link.attr("href"));
    var offset = target.property("offsetTop");
    d3.event.preventDefault();
    d3.transition().duration(500).tween("scroll", scrollTween(offset));
  });
});
