'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//the user will be able to enter characters
//will we get data from api
//display some stuff

var app = {};
app.baseUrl = 'http://gateway.marvel.com/v1/public/characters';
app.publicKey = 'eea7b047875ac73ea9c0e0bbdcf9b88e';
app.hash = '541d33f09ab47d8a76e91be1dc4d83bd';

app.getData = function (data) {
    return data[0].data.results[0];
};
app.getStoriesData = function (data) {
    return data[0].data.results[0].id;
};

app.events = function () {
    $('form').on('submit', function (e) {
        var _$;

        e.preventDefault();

        //animation starts here
        var animateMain = $('main');
        var animateResults = $('.results');
        animateMain.addClass('magictime vanishOut');
        animateMain.one('animationend', function () {
            animateMain.addClass('vanishIntro');
            animateResults.addClass('magictime vanishIn');
            animateResults.addClass('visibilityOn');
        });

        //formatting the name of what was inputted 
        var characters = $('.characters').val();
        characters = characters.split(',').map(function (name) {
            return name.trim();
        }).map(app.searchPerson);
        //matching data with api
        (_$ = $).when.apply(_$, _toConsumableArray(characters)).then(function () {
            for (var _len = arguments.length, characterData = Array(_len), _key = 0; _key < _len; _key++) {
                characterData[_key] = arguments[_key];
            }

            if (typeof characterData[1] === 'string') {
                characterData = [characterData];
            }
            characterData = characterData.map(app.getData);
            app.showInfo(characterData);
        });
    });
};

//displaying data using template literals because it's always good to try something new.
app.showInfo = function (characterData) {
    if (characterData[0] === undefined) {
        $('#display').empty();
        console.log(characterData);
        var template = '\n                <div class = "credit-null">\n                    <h1>Unfortunately, data does not exists in our database.</h1>\n                    <div class="sorry-container">\n                        <div style="width:100%;height:0;padding-bottom:66%;position:relative;"><iframe src="https://giphy.com/embed/13d2jHlSlxklVe" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/reaction-explosion-government-13d2jHlSlxklVe">via GIPHY</a></p>\n                    </div>\n                    <input class="reset-btn" type="reset" value="Reset" onClick="window.location.reload()">\n                </div>\n                ';
        $('#display').append(template);
        console.log(template);
    } else {
        $('#display').empty();
        var _template = '\n                <div class ="credit">\n                    <div class = "description">\n                        <h2> ' + characterData[0].name + '</h2>\n                        <p>' + characterData[0].description + '</p>\n                    </div>\n                    <div class = "photo"> \n                        <img src="' + characterData[0].thumbnail.path + '/portrait_uncanny.jpg">\n                    </div>\n                </div>\n                <input class="reset-btn" type="reset" value="Reset" onClick="window.location.reload()">\n                ';
        $('#display').append(_template);
    }
};

//api request
app.searchPerson = function (name) {
    return $.ajax({
        url: app.baseUrl + '?',
        method: 'GET',
        dataType: 'json',
        data: {
            name: name,
            ts: '12345',
            apikey: app.publicKey,
            hash: app.hash
        }
    });
};
//time to run events
app.init = function () {
    app.events();
};
//initialize the app
$(app.init);