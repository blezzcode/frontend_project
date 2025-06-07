// comparefiles.js

const fileInput1 = document.getElementById("file1");
const fileInput2 = document.getElementById("file2");
const compareBtn = document.getElementById("compareBtn");
const resetBtn = document.getElementById("resetBtn");
const loadingDiv = document.getElementById("loading");

const content1 = document.getElementById("content1");
const content2 = document.getElementById("content2");

const goToCopyGenBtn = document.getElementById("goToCopyGenBtn");
const goToDesignGenBtn = document.getElementById("goToDesignGenBtn");

let fileData1 = null;
let fileData2 = null;

function reset() {
  fileInput1.value = "";
  fileInput2.value = "";
  content1.innerHTML = "";
  content2.innerHTML = "";
  compareBtn.disabled = true;
  resetBtn.disabled = true;
  goToCopyGenBtn.disabled = true;
  goToDesignGenBtn.disabled = true;
  loadingDiv.style.display = "none";
  fileData1 = null;
  fileData2 = null;
  document.querySelector(".compare-results").style.display = "none";
}

function enableCompareIfReady() {
  compareBtn.disabled = !(fileInput1.files.length > 0 && fileInput2.files.length > 0);
  resetBtn.disabled = false;
}

async function readFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "docx") {
    // mammoth extraction
    const arrayBuffer = await file.arrayBuffer();
    return mammoth.convertToHtml({ arrayBuffer }).then(result => {
      return result.value;
    });
  } else if (ext === "html" || ext === "htm") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = () => reject("Erreur lecture fichier HTML");
      reader.readAsText(file);
    });
  } else if (["png", "jpg", "jpeg"].includes(ext)) {
    // Return img tag with blob URL
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      resolve(`<img src="${url}" alt="Image ${file.name}" style="max-width:100%; height:auto;" />`);
    });
  } else if (ext === "txt") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        // Simple HTML escaping + line breaks
        let text = e.target.result
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");
        resolve(`<div style="white-space: normal; font-family: monospace;">${text}</div>`);
      };
      reader.onerror = () => reject("Erreur lecture fichier TXT");
      reader.readAsText(file);
    });
  } else {
    return Promise.resolve(`<p style="color:red;">Type de fichier non supporté : ${ext}</p>`);
  }
}

async function processFiles() {
  loadingDiv.style.display = "block";
  compareBtn.disabled = true;
  goToCopyGenBtn.disabled = true;
  goToDesignGenBtn.disabled = true;

  try {
    const f1 = fileInput1.files[0];
    const f2 = fileInput2.files[0];

    const [html1, html2] = await Promise.all([readFile(f1), readFile(f2)]);

    content1.innerHTML = html1;
    content2.innerHTML = html2;

    fileData1 = { name: f1.name, content: html1 };
    fileData2 = { name: f2.name, content: html2 };

    document.querySelector(".compare-results").style.display = "block";

    goToCopyGenBtn.disabled = false;
    goToDesignGenBtn.disabled = false;
  } catch (err) {
    alert("Erreur lors du traitement : " + err);
  } finally {
    loadingDiv.style.display = "none";
    compareBtn.disabled = false;
  }
}

fileInput1.addEventListener("change", enableCompareIfReady);
fileInput2.addEventListener("change", enableCompareIfReady);

compareBtn.addEventListener("click", () => {
  processFiles();
});

resetBtn.addEventListener("click", () => {
  reset();
});

// Navigation buttons (stockage localStorage avant redirection)

goToCopyGenBtn.addEventListener("click", () => {
  if (!fileData1 || !fileData2) return alert("Veuillez comparer d'abord les fichiers.");
  // On stocke les fichiers et redirige
  localStorage.setItem("compareFile1", JSON.stringify(fileData1));
  localStorage.setItem("compareFile2", JSON.stringify(fileData2));
  localStorage.setItem("fromCompare", "true");
  window.location.href = "copyfile.html";
});

goToDesignGenBtn.addEventListener("click", () => {
  if (!fileData1 || !fileData2) return alert("Veuillez comparer d'abord les fichiers.");
  localStorage.setItem("compareFile1", JSON.stringify(fileData1));
  localStorage.setItem("compareFile2", JSON.stringify(fileData2));
  localStorage.setItem("fromCompare", "true");
  window.location.href = "designfile.html";
});

// Initial setup
reset();
