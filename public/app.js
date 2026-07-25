const API_URL = "/api";

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll logic for anchor links
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

function switchMode(mode) {
  document.getElementById('pasteSection').style.display = mode === 'paste' ? 'block' : 'none';
  document.getElementById('uploadSection').style.display = mode === 'upload' ? 'block' : 'none';
  
  document.getElementById('tabPaste').classList.toggle('active', mode === 'paste');
  document.getElementById('tabUpload').classList.toggle('active', mode === 'upload');
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('scriptInput').value = e.target.result;
      switchMode('paste');
    };
    reader.readAsText(file);
  }
}

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
