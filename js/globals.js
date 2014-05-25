/**
 * Created by hadargeva on 5/12/14.
 */
var showingJive = true;
var milliPerAnnouncement = 10000;
var milliPerInstagram = 5000;
var milliBetweenAnnouncementsFetch = 120000;
var milliForFireapp = 20000;
var milliForJiveIsrael = 60000;
var server = "http://10.72.110.2:1337";

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