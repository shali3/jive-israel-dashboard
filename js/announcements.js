
function fetchAnnouncements() {
    $.ajax({
        type: 'GET',
        url: "http://10.72.110.34:1337/Route?to=https://brewspace.jiveland.com/api/core/v3/places/814076/announcements?activeOnly=true",
        dataType: 'jsonp',
        crossDomain: true,
        success: function (obj) {

            //var obj = JSON.parse(data);
            var template = $('#announcement-template').html();
            Mustache.parse(template);   // optional, speeds up future uses

            for (var i = 0; i < obj.list.length; i++) {
                var data = {
                    title: obj.list[i].subject,
                    author: obj.list[i].author.displayName,
                    place: obj.list[i].parentPlace.name,
                    body: obj.list[i].content.text
                };

                if (obj.list[i].contentImages && obj.list[i].contentImages[0]) {
                    data.imgSrc = obj.list[i].contentImages[0].ref;
                }


                var rendered = Mustache.render(template, data);
                $('#announcements').append(rendered);
            }
            setInterval(function(){
            var width = $('#announcementsContainer').width();
                    $('#announcements').animate({"left" : "-"+width});
            }, 1000);

        },
        error: function (xhr, status, error) {
            alert("announcements error");
        }
    });
}

$(function () {
    fetchAnnouncements();
});