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
    $('form').on('submit',(e) => {
        e.preventDefault();
        console.log ('submit');

    let animateMain = $('main');
    let animateResults = $('.results');

    animateMain.addClass('magictime vanishOut');
    animateMain.one('animationend',  () => {
        animateMain.addClass('vanishIntro');
        animateResults.addClass('magictime vanishIn');
        animateResults.addClass('visibilityOn');
    });
            // console.log('submit');
    let characters = $('.characters').val();
        characters = characters.split(',')
            .map(name => name.trim())
            .map(app.searchPerson);

            console.log(characters);

        $.when(...characters)
            .then((...characterData) =>{
                if (typeof characterData[1]  ==='string'){
                    characterData = [characterData]
                }
                console.log(characterData);
                characterData = characterData.map(app.getData);
                console.log(characterData);
                app.showInfo(characterData);
            })

        $.when(...characters)
            .then((...storyData) => {
                if (typeof storyData[1] === 'string') {
                    storyData = [storyData]
                }
                console.log(storyData);
                storyData = storyData.map(app.getStoriesData)
                console.log(storyData);
                app.getStories(storyData);
                console.log(storyData);
                
            })
    let stories = characters.map(app.getStories);
    console.log(stories);
    })
};

app.showInfo = (characterData) => {
    $('#display').empty();
    console.log(characterData);
    const template = `
    <input type="reset" value="Reset" onClick="window.location.reload()">
    <div class ="credit">
    <div class = "description">
    <h2> ${characterData[0].name}</h2>
    <p>${characterData[0].description}</p>
    </div>
    <div class = "photo"> 
    <img src="${characterData[0].thumbnail.path}/portrait_uncanny.jpg">
    </div>
    </div>
    `;
    $('#display').append(template);
    console.log(template);
};
        
   
app.getStories = (storyData) => {
    console.log(storyData);
    return $.ajax({
        url: `${app.baseUrl}/${storyData}/comics`,
        method: 'GET',
        dataType: 'json',
        data: {
            ts: '12345',
            apikey: app.publicKey,
            hash: app.hash     
        }  
    });  
}    
app.searchPerson = (name) => {
    // console.log('hi');
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
app.init = () => {
    app.events();   
}

$(app.init);
