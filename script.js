// Site-wide name variable
const siteName = "TheWrkShop";

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

// ✅ Only ONE DOMContentLoaded block
document.addEventListener("DOMContentLoaded", function () {
  // 🎯 1. Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // 📬 2. ConvertKit subscription form
  const form = document.getElementById("emailForm");
  const successMessage = document.getElementById("successMessage");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const formId = "8460334"; // Replace with your ConvertKit form ID
      const apiKey = "qwXtdRjQfoLppDUjjcd_8Q"; // Replace with your ConvertKit API Key

      try {
        const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: apiKey,
            email: email,
          }),
        });

        if (response.ok) {
          successMessage.style.display = "block";
          form.reset();
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (err) {
        console.error(err);
        alert("There was a problem subscribing.");
      }
    });
  }
});

async function loadDaily() {
  const elRef = document.querySelector('.today .ref');
  const elTeaser = document.querySelector('.today .teaser');
  if (!elRef || !elTeaser) return;
  try {
    const res = await fetch('/data/daily.json');
    const d = await res.json();
    elRef.textContent = d.verse_ref;
    elTeaser.textContent = d.gem_body.slice(0, 120) + '…';
  } catch(e){ /* fail quietly */ }
}
document.addEventListener('DOMContentLoaded', loadDaily);

// Load header.html into #site-header
async function loadHeader(){
  const res = await fetch("pages/details/header.html");
  const html = await res.text();
  document.getElementById("site-header").innerHTML = html;

  // after inject, re-init nav toggle
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav-links');
  if(btn && nav){
    btn.addEventListener('click', () => nav.classList.toggle('open'));
  }
  // fill sitename again
  document.querySelectorAll('.sitename').forEach(el => el.textContent = 'TheWrkShop');
}
loadHeader();
