document.addEventListener('DOMContentLoaded', () => {
  const briefingFileInput = document.getElementById('briefingFileInput');
  const generateCopyBtn = document.getElementById('generateCopyBtn');
  const briefingContent = document.getElementById('briefingContent');
  const copyContent = document.getElementById('copyContent');
  const contentDisplay = document.getElementById('contentDisplay');
  const comparisonSection = document.getElementById('comparisonSection');
  const generalComparison = document.getElementById('generalComparison');
  const semanticComparison = document.getElementById('semanticComparison');
  const factualComparison = document.getElementById('factualComparison');
  const resetBtn = document.getElementById('resetBtn');
  const saveCopyBtn = document.getElementById('saveCopyBtn');
  const downloadCopyBtn = document.getElementById('downloadCopyBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');

  // Message pour inciter à enregistrer les modifs
  const saveWarning = document.createElement('p');
  saveWarning.textContent = "Veuillez enregistrer vos modifications avant de continuer.";
  saveWarning.style.color = "red";
  saveWarning.style.fontWeight = "700";
  saveWarning.style.marginTop = "0.5em";
  saveWarning.style.display = "none";
  saveCopyBtn.parentNode.insertBefore(saveWarning, nextPageBtn);

  let originalText = '';
  let copyGenerated = false;
  let isModified = false;

  briefingFileInput.addEventListener('change', handleFileUpload);
  generateCopyBtn.addEventListener('click', generateCopy);
  resetBtn.addEventListener('click', resetAll);
  saveCopyBtn.addEventListener('click', saveCopy);
  downloadCopyBtn.addEventListener('click', downloadCopy);
  nextPageBtn.addEventListener('click', goToCopyFile);
  copyContent.addEventListener('input', onCopyContentChange);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const arrayBuffer = reader.result;
      mammoth.extractRawText({arrayBuffer: arrayBuffer})
        .then(displayText)
        .catch(err => alert('Erreur lors de la lecture du fichier DOCX'));
    };
    reader.readAsArrayBuffer(file);

    generateCopyBtn.disabled = false;
  }

  function displayText(result) {
    originalText = result.value;
    briefingContent.value = originalText;
    copyContent.value = '';
    contentDisplay.style.display = 'flex';
    comparisonSection.style.display = 'none';
    saveCopyBtn.style.display = 'none';
    downloadCopyBtn.style.display = 'none';
    generateCopyBtn.disabled = false;
    nextPageBtn.disabled = true;
    copyGenerated = false;
    isModified = false;
    saveWarning.style.display = 'none';
  }

  function generateCopy() {
    // Ici, ta logique de génération (exemple simple copie directe)
    copyContent.value = originalText; 
    copyGenerated = true;
    saveCopyBtn.style.display = 'inline-flex';
    downloadCopyBtn.style.display = 'inline-flex';
    comparisonSection.style.display = 'block';

    updateComparisons();

    nextPageBtn.disabled = false;
    isModified = false;
    saveWarning.style.display = 'none';

    // Sauvegarder l'état initial de la copie dans le localStorage
    localStorage.setItem('copyContent', copyContent.value);
  }

  function updateComparisons() {
    // Simulation comparaison - à remplacer par ta fonction réelle
    generalComparison.textContent = '100 %';
    semanticComparison.textContent = '100 %';
    factualComparison.textContent = '100 %';
  }

  function resetAll() {
    briefingFileInput.value = '';
    briefingContent.value = '';
    copyContent.value = '';
    contentDisplay.style.display = 'none';
    comparisonSection.style.display = 'none';
    generateCopyBtn.disabled = true;
    saveCopyBtn.style.display = 'none';
    downloadCopyBtn.style.display = 'none';
    nextPageBtn.disabled = true;
    localStorage.removeItem('copyContent');
    copyGenerated = false;
    isModified = false;
    saveWarning.style.display = 'none';
  }

  function saveCopy() {
    localStorage.setItem('copyContent', copyContent.value);
    isModified = false;
    nextPageBtn.disabled = false;
    saveWarning.style.display = 'none';
    alert('Modifications enregistrées');
    updateComparisons();  // <-- Ajout : relancer la comparaison après sauvegarde
  }

  function downloadCopy() {
    const blob = new Blob([copyContent.value], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copy.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function goToCopyFile() {
    if (isModified) {
      alert('Veuillez enregistrer vos modifications avant de continuer.');
      return;
    }
    window.location.href = 'copyfile.html';
  }

  function onCopyContentChange() {
    if (!copyGenerated) return;

    if (!isModified) {
      isModified = true;
      nextPageBtn.disabled = true;
      saveWarning.style.display = 'block';
    }
  }
});
