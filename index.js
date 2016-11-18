var resize = function() {
	$('#home').css({ height: window.innerHeight, width: window.innerWidth});
};
$( document ).ready(function() {
	resize();
});
$(window).on("resize", resize);