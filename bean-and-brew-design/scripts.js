// HOME PAGE OFFER SLIDES
var slideIndex = 1;
var maxIndex = 4;

function previousSlide() {
    if (slideIndex == 1) {
        showSlides(slideIndex = maxIndex);
    }
    else {
        showSlides(slideIndex = slideIndex - 1);
    }
}

function nextSlide() {
    if (slideIndex == maxIndex) {
        showSlides(slideIndex = 1);
    }
    else {
        showSlides(slideIndex = slideIndex + 1);
    }
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("offer-slide");
    var dots = document.getElementsByClassName("offer-dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length} ;
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("offer-current");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].classList.add("offer-current");
}

// MENU
var currentMenu = "hot-drinks";

function showMenu(menu) {
    var i;
    var menus = document.getElementsByClassName("menu");
    if (document.getElementById(menu + "-menu")) {currentMenu = menu} ;
    for (i = 0; i < menus.length; i++) {
        menus[i].style.display = "none";  
        document.getElementById(menus[i].id.slice(0, -5)).classList.remove("active");
    }
    document.getElementById(currentMenu + "-menu").style.display = "block";
    document.getElementById(currentMenu).classList.add("active")
}

// SIGN IN/UP
var hidden = true;

function togglePassword(value = null) {
    hidden = value || !hidden;
    if (hidden == true) {
        document.getElementById("password").type = "password"
        document.getElementById("toggle-password").getElementsByTagName("img")[0].src = "/bean-and-brew-design/images/icons/not_visible.svg"
    }
    else
    {
        document.getElementById("password").type = "text"
        document.getElementById("toggle-password").getElementsByTagName("img")[0].src = "/bean-and-brew-design/images/icons/visible.svg"
    }
}

var confirmHidden = true;

function toggleConfirmPassword(value = null) {
    confirmHidden = value || !confirmHidden;
    if (confirmHidden == true) {
        document.getElementById("confirm-password").type = "password"
        document.getElementById("toggle-confirm-password").getElementsByTagName("img")[0].src = "/bean-and-brew-design/images/icons/not_visible.svg"
    }
    else
    {
        document.getElementById("confirm-password").type = "text"
        document.getElementById("toggle-confirm-password").getElementsByTagName("img")[0].src = "/bean-and-brew-design/images/icons/visible.svg"
    }
}
