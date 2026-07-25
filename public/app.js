const API_URL = "/api";

async function processObfuscation() {
  const code = document.getElementById('scriptInput').value;
  const errorBanner = document.getElementById('errorBanner');
  const outputTextarea = document.getElementById('scriptOutput');
  
  errorBanner.style.display = 'none';
  outputTextarea.value = "Processing...";

  try {
    const response = await fetch(`${API_URL}/obfuscate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: "main.luau", code: code })
    });

    const data = await response.json();

    if (!data.success) {
      errorBanner.innerText = data.error;
      errorBanner.style.display = 'block';
      outputTextarea.value = '';
    } else {
      outputTextarea.value = data.obfuscated_code;
    }
  } catch (err) {
    errorBanner.innerText = "Error communicating with serverless function.";
    errorBanner.style.display = 'block';
    outputTextarea.value = '';
  }
}
