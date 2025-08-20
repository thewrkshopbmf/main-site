// Site-wide name variable
const siteName = "The WrkShop";

// Replace all .sitename spans with the site name
document.querySelectorAll(".sitename").forEach(el => {
    el.textContent = siteName;
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


