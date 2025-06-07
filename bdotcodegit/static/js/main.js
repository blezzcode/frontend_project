document.addEventListener('DOMContentLoaded', () => {
  const briefingInput = document.getElementById('briefingFileInput');
  const generateCopyBtn = document.getElementById('generateCopyBtn');
  const briefingContent = document.getElementById('briefingContent');
  const copyContent = document.getElementById('copyContent');
  const contentDisplay = document.getElementById('contentDisplay');
  const comparisonSection = document.getElementById('comparisonSection');
  const generalComparison = document.getElementById('generalComparison');
  const semanticComparison = document.getElementById('semanticComparison');
  const factualComparison = document.getElementById('factualComparison');
  const saveCopyBtn = document.getElementById('saveCopyBtn');
  const downloadCopyBtn = document.getElementById('downloadCopyBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Activer le bouton Générer uniquement si un fichier est choisi
  briefingInput.addEventListener('change', () => {
    generateCopyBtn.disabled = briefingInput.files.length === 0;
  });

  // Bouton Réinitialiser
  resetBtn.addEventListener('click', () => {
    briefingInput.value = '';
    generateCopyBtn.disabled = true;
    briefingContent.value = '';
    copyContent.value = '';
    contentDisplay.style.display = 'none';
    comparisonSection.style.display = 'none';
    saveCopyBtn.style.display = 'none';
    downloadCopyBtn.style.display = 'none';
    nextPageBtn.disabled = true;
    nextPageBtn.classList.remove('btn-orange');
    nextPageBtn.classList.add('btn-grey');
    localStorage.removeItem('savedCopyText');
  });

  generateCopyBtn.addEventListener('click', () => {
    generateCopyBtn.textContent = 'Génération en cours...';
    generateCopyBtn.disabled = true;

    if (!briefingInput.files.length) {
      alert('Veuillez sélectionner un fichier briefing (.docx).');
      generateCopyBtn.textContent = 'Générer Copy';
      generateCopyBtn.disabled = false;
      return;
    }

    const file = briefingInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result;

      mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        .then(result => {
          displayResult(result);
          generateCopyBtn.textContent = 'Générer Copy';
          generateCopyBtn.disabled = false;
        })
        .catch(err => {
          alert('Erreur lors de la lecture du fichier .docx');
          console.error(err);
          generateCopyBtn.textContent = 'Générer Copy';
          generateCopyBtn.disabled = false;
        });
    };

    reader.readAsArrayBuffer(file);
  });

  function displayResult(result) {
    const rawText = stripHtml(result.value);

    // Afficher le contenu extrait dans les zones de texte
    briefingContent.value = rawText;

    const generatedCopy = generateCopyText(rawText);
    copyContent.value = generatedCopy;

    // Stocker pour la page suivante
    localStorage.setItem('savedCopyText', generatedCopy);

    // Affichage UI
    contentDisplay.style.display = 'flex';
    comparisonSection.style.display = 'block';

    calculateComparisons(rawText, generatedCopy);

    saveCopyBtn.style.display = 'inline-block';
    downloadCopyBtn.style.display = 'inline-block';

    nextPageBtn.disabled = false;
    nextPageBtn.classList.remove('btn-grey');
    nextPageBtn.classList.add('btn-orange');

    copyContent.addEventListener('input', () => {
      nextPageBtn.disabled = true;
      nextPageBtn.classList.remove('btn-orange');
      nextPageBtn.classList.add('btn-grey');
    });
  }

  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  function generateCopyText(text) {
    return text + "\n\n[Texte Copy généré automatiquement]";
  }

  function calculateComparisons(text1, text2) {
    const general = similarityRatio(text1, text2);
    const semantic = general - 0.03; // Simulation
    const factual = 0.0; // Simulation

    generalComparison.textContent = general.toFixed(2) + " %";
    semanticComparison.textContent = semantic.toFixed(2) + " %";
    factualComparison.textContent = factual.toFixed(2) + " %";
  }

  function similarityRatio(a, b) {
    const setA = new Set(a.split(''));
    const setB = new Set(b.split(''));
    let commonCount = 0;
    setA.forEach(char => {
      if (setB.has(char)) commonCount++;
    });
    const avgLen = (a.length + b.length) / 2 || 1;
    return (commonCount / avgLen) * 100;
  }

  saveCopyBtn.addEventListener('click', () => {
    const modifiedCopy = copyContent.value;
    localStorage.setItem('savedCopyText', modifiedCopy);
    alert("Modifications enregistrées !");
    nextPageBtn.disabled = false;
    nextPageBtn.classList.remove('btn-grey');
    nextPageBtn.classList.add('btn-orange');
  });

  downloadCopyBtn.addEventListener('click', () => {
    // Ici on désactive le téléchargement final comme discuté
    alert("Le téléchargement est disponible après génération du design.");
  });

  nextPageBtn.addEventListener('click', () => {
    if (!nextPageBtn.disabled) {
      window.location.href = 'copyfile.html';
    }
  });
});
