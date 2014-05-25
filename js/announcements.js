var currentAnnouncmentIndex;
var totalAnnouncementsCount;
var firstFetch = true;

function fetchAnnouncements() {
    $.ajax({
        type: 'GET',
        url: server + "/getannouncements",
        dataType: 'jsonp',
        crossDomain: true,
        success: function (obj) {

            $('#announcements').empty();
            var template = $('#announcement-template').html();
            Mustache.parse(template);   // optional, speeds up future uses

            totalAnnouncementsCount = obj.list.length;

            for (var i = 0; i < obj.list.length; i++) {
                var data = {
                    title: obj.list[i].subject,
                    author: obj.list[i].author.displayName,
                    place: obj.list[i].parentPlace.name,
                    body: obj.list[i].content.text
                };

                if (obj.list[i].contentImages && obj.list[i].contentImages[0]) {
                    data.imgSrc = server + obj.list[i].contentImages[0].ref;
                }


                var rendered = Mustache.render(template, data);
                $('#announcements').append(rendered);
            }

            currentAnnouncmentIndex = -1;
            if (firstFetch) {
                initAnimation();
                firstFetch = false;
            }
        },
        error: function (xhr, status, error) {
            console.log("announcements error");
        }
    });
}

function layoutAnnouncements(withAnimation) {
    var width = $('#announcementsContainer').width();
    var left = currentAnnouncmentIndex * (-width);

    if (withAnimation) {
        $('#announcements').animate({'left': left});
    }
    else {
        $('#announcements').css('left', left);
    }
}

function initAnimation() {
    setInterval(function () {
        if (showingJive) {
            currentAnnouncmentIndex = (currentAnnouncmentIndex + 1) % (totalAnnouncementsCount + 1);
            $('#announcements-counter').html((currentAnnouncmentIndex + 1) + '/' + totalAnnouncementsCount);
            layoutAnnouncements(currentAnnouncmentIndex > 0);
        }
    }, milliPerAnnouncement);
}

$(function () {
    fetchAnnouncements();
    setInterval(fetchAnnouncements, milliBetweenAnnouncementsFetch);
    $(window).resize(function () {
        layoutAnnouncements(false)
    });
});
