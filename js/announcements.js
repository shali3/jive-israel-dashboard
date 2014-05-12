var lastAnnouncementWidth;
var leftOffset;
var firstFetch =true;

function maxleftOffset(){
    return $('#announcementsContainer').width() * $('.announcement').length;
}

function fetchAnnouncements() {
    $.ajax({
        type: 'GET',
        url:  getAnnouncementsUrl,
        dataType: 'jsonp',
        crossDomain: true,
        success: function (obj) {

            $('#announcements').empty();
            //var obj = JSON.parse(data);
            var template = $('#announcement-template').html();
            Mustache.parse(template);   // optional, speeds up future uses

            for (var i = 0; i < obj.list.length; i++) {
                var data = {
                    title: obj.list[i].subject,
                    author: obj.list[i].author.displayName,
                    place: obj.list[i].parentPlace.name,
                    body: obj.list[i].content.text,
                    index : i+1,
                    "total-announcements-count": obj.list.length
            };

                if (obj.list[i].contentImages && obj.list[i].contentImages[0]) {
                    data.imgSrc = server +  obj.list[i].contentImages[0].ref;
                }


                var rendered = Mustache.render(template, data);
                $('#announcements').append(rendered);
            }

            if($('#announcementsContainer').width() != 0){
                lastAnnouncementWidth = $('#announcementsContainer').width();
                leftOffset = -$('#announcementsContainer').width();
            }else{
                leftOffset = lastAnnouncementWidth;
            }

            if(firstFetch){
                loopAnnouncements();
                firstFetch = false;
            }
        },
        error: function (xhr, status, error) {
            alert("announcements error");
        }
    });
}

$(function () {
    fetchAnnouncements();
    setInterval(fetchAnnouncements,milliBetweenAnnouncementsFetch);
});
function hideFirebaseapp(){
    $('#firebaseapp').fadeOut();
    $('#inner-body').fadeIn();
    stoped = false;
    loopAnnouncements();
}

function loopAnnouncements(){
    leftOffset+= $('#announcementsContainer').width();
    if(leftOffset >= maxleftOffset()){
        leftOffset = -$('#announcementsContainer').width();
        stoped = true;
        $('#inner-body').fadeOut();
        $('#firebaseapp').fadeIn();
        setTimeout(hideFirebaseapp, milliForFireapp);
    }
    else{
        $('#announcements').animate({"left" : "-"+leftOffset});
        setTimeout(loopAnnouncements, milliPerAnnouncement);
    }
}