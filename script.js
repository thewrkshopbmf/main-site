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

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("emailForm");
  const successMessage = document.getElementById("successMessage");

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
});

