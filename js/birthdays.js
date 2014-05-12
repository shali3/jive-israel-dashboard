var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

function parseDate(input) {
    var parts = input.split('/');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[2], parts[1] - 1, parts[0]); // Note: months are 0-based
}

function updateBirthdays(birthdays) {
    var curMonth = new Date().getMonth();
    var filteredBirthdays = $.grep(birthdays, function (elem) {
        return elem.birthday.getMonth() == curMonth;
    });

    $('#birthdays').empty();
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
    layoutBirthdays();
}


function layoutBirthdays() {
    $('#announcements').height($(window).height() - $('#birthday-box').height() - 83);
}

function fetchBirthdays() {
    $.getJSON('data/birthdays.json', function (data) {

        var birthdays = data.map(function (item) {
            item.birthday = parseDate(item.birthday);
            return item;
        });
        birthdays.sort(function (a, b) {
            return b.birthday.getDate() - a.birthday.getDate();
        });

        updateBirthdays(birthdays);
    });
}


$(function () {
    fetchBirthdays();
    $(window).resize(layoutBirthdays);
});