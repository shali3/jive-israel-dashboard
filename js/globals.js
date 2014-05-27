/**
 * Created by hadargeva on 5/12/14.
 */
var debug = window.location.href.indexOf("#debug") != -1;
var showingJive = true;
var milliPerAnnouncement = 20000;
var milliPerInstagram = 5000;
var milliBetweenAnnouncementsFetch = 120000;
var milliForFireapp = 20000;
var milliForJiveIsrael = 60000;
var server = "http://10.72.110.2:1337";
var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

if (debug) {
    milliPerAnnouncement = milliPerAnnouncement / 10;
    milliPerInstagram = milliPerInstagram / 10;
    milliBetweenAnnouncementsFetch = milliBetweenAnnouncementsFetch / 10;
    milliForFireapp = milliForFireapp / 10;
    milliForJiveIsrael = milliForJiveIsrael / 10;
}

setTimeout(toggleViews, milliForJiveIsrael);

function toggleViews() {
    if (showingJive) {
        showingJive = false;
        $('#inner-body').fadeOut();
        $('#firebaseapp').fadeIn();
        setTimeout(toggleViews, milliForFireapp);
    }
    else {
        showingJive = true;
        $('#firebaseapp').fadeOut();
        $('#inner-body').fadeIn();
        setTimeout(toggleViews, milliForJiveIsrael);
    }
}

function get2Digit(number) {
    return ("0" + number).slice(-2);
}

$(function () {
    var clockTemplate = $('#clock-template').html();
    Mustache.parse(clockTemplate);   // optional, speeds up future uses

    setInterval(function () {
        var now = new Date();
        var data = {
            day: now.getDate(),
            month: monthNames[now.getMonth()],
            h: get2Digit(now.getHours()),
            m: get2Digit(now.getMinutes()),
            s: get2Digit(now.getSeconds())
        };
        var rendered = Mustache.render(clockTemplate, data);
        $('#clock').html(rendered);
    }, 1000);
})
