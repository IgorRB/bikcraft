$(".rslides").responsiveSlides({
    auto: true,             // Boolean: Animate automatically, true or false
    speed: 500,            // Integer: Speed of the transition, in milliseconds
    timeout: 5000          // Integer: Time between slide transitions, in milliseconds
});

$(".rslides-portifolio").responsiveSlides({
    auto: true,             // Boolean: Animate automatically, true or false
    speed: 500,            // Integer: Speed of the transition, in milliseconds
    timeout: 5000,          // Integer: Time between slide transitions, in milliseconds
    pager: true           // Boolean: Show pager, true or false
});

Visibility.onVisible(function(){
    setTimeout(function() {
        $(".introducao h1").addClass("animated fadeInDown");
    }, 200);
    setTimeout(function() {
        $(".introducao .quote-externo").addClass("animated fadeIn");
    }, 600);
    setTimeout(function() {
        $(".introducao cite").addClass("animated fadeIn");
    }, 800);
    setTimeout(function() {
        $(".introducao .btn").addClass("animated fadeIn");
    }, 1000);
    setTimeout(function() {
        $(".animar").addClass("animated fadeIn");
    }, 1200);
    setTimeout(function() {
        $(".animar-interno").addClass("animated fadeIn");
    }, 800);
});