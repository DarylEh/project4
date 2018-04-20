//the user will be able to enter characters
//will we get data from api
//display some stuff

const app = {};
app.baseUrl = 'http://gateway.marvel.com/v1/public/characters';
app.publicKey = 'eea7b047875ac73ea9c0e0bbdcf9b88e';
app.hash = '541d33f09ab47d8a76e91be1dc4d83bd';

app.getData = data => data[0].data.results[0];
app.getStoriesData = data => data[0].data.results[0].id;


app.events = () => {
    $('form').on('submit', (e) => {
        e.preventDefault();

        //animation starts here
        let animateMain = $('main');
        let animateResults = $('.results');
        animateMain.addClass('magictime vanishOut');
        animateMain.one('animationend', () => {
            animateMain.addClass('vanishIntro');
            animateResults.addClass('magictime vanishIn');
            animateResults.addClass('visibilityOn');
        });

        //formatting the name of what was inputted 
        let characters = $('.characters').val();
        characters = characters.split(',')
            .map(name => name.trim())
            .map(app.searchPerson);
        //matching data with api
        $.when(...characters)
            .then((...characterData) => {
                if (typeof characterData[1] === 'string') {
                    characterData = [characterData]
                }
                characterData = characterData.map(app.getData);
                app.showInfo(characterData);
            })
    })
};

//displaying data using template literals because it's always good to try something new.
app.showInfo = (characterData) => {
    if (characterData[0] === undefined) {
        $('#display').empty();
        console.log(characterData);
        const template = `
                <div class = "credit-null">
                    <h1>Unfortunately, data does not exists in our database.</h1>
                    <div class="sorry-container">
                        <div style="width:100%;height:0;padding-bottom:66%;position:relative;"><iframe src="https://giphy.com/embed/13d2jHlSlxklVe" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/gifs/reaction-explosion-government-13d2jHlSlxklVe">via GIPHY</a></p>
                    </div>
                    <input class="reset-btn" type="reset" value="Reset" onClick="window.location.reload()">
                </div>
                `;
        $('#display').append(template);
        console.log(template);

    } else {
        $('#display').empty();
        const template = `
                <div class ="credit">
                    <div class = "description">
                        <h2> ${characterData[0].name}</h2>
                        <p>${characterData[0].description}</p>
                    </div>
                    <div class = "photo"> 
                        <img src="${characterData[0].thumbnail.path}/portrait_uncanny.jpg">
                    </div>
                </div>
                <input class="reset-btn" type="reset" value="Reset" onClick="window.location.reload()">
                `;
        $('#display').append(template);
    }
};

//api request
app.searchPerson = (name) => {
    return $.ajax({
        url: `${app.baseUrl}?`,
        method: 'GET',
        dataType: 'json',
        data: {
            name: name,
            ts: '12345',
            apikey: app.publicKey,
            hash: app.hash
        },
    });
}
//time to run events
app.init = () => {
    app.events();
}
//initialize the app
$(app.init);
