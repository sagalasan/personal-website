var homeOffset;

function scrollTween(offset) {
  return function() {
    var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
    return function(t) {scrollTo(0, i(t))};
  };
};

$(document).ready(function() {

  var navbarItems = d3.selectAll(".nav a.page-scroll");
  var anchorItems = navbarItems.each(function(d) {
    console.log("hello");
  });

  d3.select(window).on("scroll", function() {
    // var homeOffset = d3.select("#home").property("clientHeight");
    var homeOffset = 50;
    if (window.scrollY <= homeOffset) {
      d3.select(".navbar").classed("top-nav-collapse", false);
    } else {
      d3.select(".navbar").classed("top-nav-collapse", true);
    }

    var fromTop = d3.select("body").property("scrollTop");
  });

  d3.selectAll("a.page-scroll").on("click", function() {
    var link = d3.select(this);
    var target = d3.select(link.attr("href"));
    var offset = target.property("offsetTop");
    d3.event.preventDefault();
    d3.transition().duration(500).tween("scroll", scrollTween(offset));
  });

  d3.select("#btn-down").on("mouseenter", function() {
    console.log("what");
    d3.select(this).classed("bounce", true);
  });
});

// particlesJS.load('particles-js', '/assets/particles.json');
