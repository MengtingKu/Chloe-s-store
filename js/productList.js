/* jQ */
$(document).ready(function () {
    $(window).scroll(function () {
        last = $("body").height() - $(window).height();
        if ($(window).scrollTop() >= last - 1000) { $('.gotop a').addClass('active').css('opacity', '1'); }
        else {
            $('.gotop a').removeClass('active').css('opacity', '0');
        }
    });
    $('.fa-heart').click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');

    });
});


/* JavaScript */
let url = `http://localhost:3000/`;
axios.get(url)
    .then(function (response) {
        console.log(response.data);
    }) 