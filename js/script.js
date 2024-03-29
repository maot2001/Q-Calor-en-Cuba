//import data from 'data/data_line.json' assert {type: 'json'}

// Open Menu
let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('open');
}

// Solution scroll
window.onscroll = () => {
    menu.classList.remove('bx-x');
    navlist.classList.remove('open');
}

// ScrollReveal
const sr = ScrollReveal({
    origin: 'top',
    distance: '85px',
    duration: 2500,
    reset: false
});

sr.reveal('.home-text, .home-img, .graph, .text, .contact', {delay:300});