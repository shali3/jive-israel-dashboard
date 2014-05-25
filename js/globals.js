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