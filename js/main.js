var birthdays;
var lastUpdatedMonth=-1;
var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function parseDate(input) {
    var parts = input.split('/');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[2], parts[1] - 1, parts[0]); // Note: months are 0-based
}
function fetchAnnouncements() {
    $.ajax({
        type: 'GET',
        url: "http://10.72.32.74:1337/Route?to=https://brewspace.jiveland.com/api/core/v3/places/814076/announcements?activeOnly=true",
        dataType: 'jsonp',
        crossDomain: true,
        success: function (obj) {

            //peopleBirthday();

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
function updateBirthdays() {
    var curMonth = new Date().getMonth();
    if(curMonth!= lastUpdatedMonth) {
        var filteredBirthdays = $.grep(birthdays, function (elem) {
            return elem.birthday.getMonth() == curMonth;
        });

        var template = $('#birthday-template').html();
        Mustache.parse(template);   // optional, speeds up future uses

        $.each(filteredBirthdays, function (i, item) {
            var data = {
                day: item.birthday.getDate(),
                month: monthNames[item.birthday.getMonth()],
                name: item.name
            }
            var rendered = Mustache.render(template, data);
            $('#birthdays').append(rendered);
        });
        lastUpdatedMonth = curMonth;
    }
    $('#announcements').height($(window).height() - $('#birthday-box').height()-114);
}
function fetchBirthdays() {
    $.getJSON('data/birthdays.json', function (data) {

        birthdays = data.map(function (item) {
            item.birthday = parseDate(item.birthday);
            return item;
        });
        birthdays.sort(function (a, b) {
            return b.birthday - a.birthday
        });

        updateBirthdays();
    });
}
$(function () {
    fetchInstagram();
    fetchAnnouncements();
    fetchBirthdays();
    $(window).resize(updateBirthdays);
});