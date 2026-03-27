<script>
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  btn.innerText = "Sending...";
  btn.disabled = true;

  try {
    const res = await fetch("/api/hire-emma", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      btn.innerText = "Send Request";
      btn.disabled = false;
      return;
    }

    form.reset();
    success.style.display = "block";
    btn.style.display = "none";

  } catch (err) {
    alert("Something went wrong");
    btn.innerText = "Send Request";
    btn.disabled = false;
  }
});
</script>
