var min_tag_id;
var after_instagram_refresh;
var instagramTickCount = 0;
var instagramUpdateSec = 30;

function createInstargramElement(item) {
    var timeago = $.timeago(new Date(item.created_time * 1000));
    var imgSrc = item.images.standard_resolution.url;
    var text = item.caption.text;
    var user = item.user.username;
    var avatar = item.user.profile_picture;

    var template = $('#instagram-template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    return Mustache.render(template, {imgSrc: imgSrc, timeago: timeago, username: user, avatar: avatar, caption: text });
}

function initInstagramAnimation() {
    $(".dial").knob({
        max: instagramUpdateSec,
        width: 20,
        height: 20,
        readOnly: true
    }).show();

    $('.fadein .fade-item').first().show();

    setInterval(function () {
        if (showingJive) {
            var nextItem = $('.fadein .fade-item:visible').fadeOut().next('.fade-item');
            if (nextItem.length == 0 || after_instagram_refresh) {
                after_instagram_refresh = false;
                nextItem = $('.fadein :first-child');
            }
            nextItem.fadeIn();
        }
    }, milliPerInstagram);
}

function addInstagramItems(items) {
    var elements = [];
    $.each(items, function (i, item) {
        var element = createInstargramElement(item);
        elements.push(element);
    });
    $('#instagram-panel').prepend(elements)
}
function fetchInstagram() {
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        url: 'https://api.instagram.com/v1/tags/jiveisrael/media/recent?access_token=1670815861.1fb234f.b9690c21d125435a8f722856f8043ea2&count=10',
        success: function (responseData) {
            min_tag_id = responseData.pagination.min_tag_id;
            addInstagramItems(responseData.data);
            initInstagramAnimation();
            refreshInstagramTick();
        }});
}

function refreshInstagramTick() {
    instagramTickCount = (instagramTickCount + 1) % (instagramUpdateSec + 1);
    $('.dial').val(instagramTickCount).trigger('change');
    if (instagramTickCount < instagramUpdateSec) {
        setTimeout(refreshInstagramTick, 1000);
    }
    else if (min_tag_id) {
        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            url: 'https://api.instagram.com/v1/tags/jiveisrael/media/recent?access_token=1670815861.1fb234f.b9690c21d125435a8f722856f8043ea2&min_tag_id=' + min_tag_id,
            success: function (responseData) {
                if (responseData.data.length > 0) {
                    min_tag_id = responseData.pagination.min_tag_id;
                    addInstagramItems(responseData.data);
                    after_instagram_refresh = true;
                }
            },
            error: function () {
                console.log('GET from instagram failed.');
            },
            complete: function () {
                setTimeout(refreshInstagramTick, 1000);
            }});
    }
}

$(function () {
    fetchInstagram();
});