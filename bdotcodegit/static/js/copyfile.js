// copyfile.js

document.addEventListener('DOMContentLoaded', () => {
  const fileUpload = document.getElementById('fileUpload');
  const resetBtn = document.getElementById('resetBtn');
  const briefingText = document.getElementById('briefingText');
  const copyText = document.getElementById('copyText');
  const useGeneratedCopyBtn = document.getElementById('useGeneratedCopyBtn');
  const generateDesignBtn = document.getElementById('generateDesignBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  let briefingContent = '';       // Le briefing original (à récupérer du stockage local ou API)
  let generatedCopyContent = '';  // La copie générée (à récupérer du stockage local ou API)
  let currentCopyContent = '';    // La copie choisie par l'utilisateur (upload ou générée)
  let designGenerated = false;

  // Exemple : charger briefing et copie générée depuis localStorage (adapter selon ton backend)
  function loadInitialData() {
    briefingContent = localStorage.getItem('briefingText') || '';
    generatedCopyContent = localStorage.getItem('generatedCopyText') || '';

    briefingText.value = briefingContent;
    copyText.value = generatedCopyContent;
    currentCopyContent = generatedCopyContent;

    // On active bouton "Utiliser la copie générée" uniquement si on a une copie
    useGeneratedCopyBtn.disabled = generatedCopyContent === '';
    generateDesignBtn.disabled = true; // Pour l'instant on ne peut pas générer sans validation
    downloadBtn.disabled = true; // Pas de téléchargement possible ici
  }

  loadInitialData();

  // Gérer upload fichier (docx ou txt)
  fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Lire le fichier selon son type
    if (file.name.endsWith('.txt')) {
      const text = await file.text();
      setCopyText(text);
    } else if (file.name.endsWith('.docx')) {
      // Pour docx, utiliser une librairie comme docxjs (ou adapter)
      // Ici, exemple basique : on met un message d’attente/lecture
      copyText.value = 'Lecture du fichier DOCX en cours...';
      // Simuler la lecture avec un timeout (remplacer par vraie extraction)
      setTimeout(() => {
        // Simuler texte extrait
        const extractedText = '[Texte extrait du DOCX à remplacer]';
        setCopyText(extractedText);
      }, 1000);
    } else {
      alert('Format non supporté. Veuillez uploader un fichier .docx ou .txt');
      fileUpload.value = '';
    }
  });

  function setCopyText(text) {
    copyText.value = text;
    currentCopyContent = text;
    useGeneratedCopyBtn.disabled = false;
    generateDesignBtn.disabled = true; // on attend la validation avant génération
    downloadBtn.disabled = true;
  }

  // Bouton réinitialiser
  resetBtn.addEventListener('click', () => {
    fileUpload.value = '';
    briefingText.value = briefingContent;
    copyText.value = generatedCopyContent;
    currentCopyContent = generatedCopyContent;
    designGenerated = false;

    useGeneratedCopyBtn.disabled = generatedCopyContent === '';
    generateDesignBtn.disabled = true;
    downloadBtn.disabled = true;
  });

  // Utiliser la copie générée (valider cette copie pour génération)
  useGeneratedCopyBtn.addEventListener('click', () => {
    copyText.value = generatedCopyContent;
    currentCopyContent = generatedCopyContent;
    generateDesignBtn.disabled = false; // on peut générer le design maintenant
    downloadBtn.disabled = true;
    designGenerated = false;
  });

  // Quand on valide un upload, on peut aussi activer génération
  fileUpload.addEventListener('change', () => {
    generateDesignBtn.disabled = false;
    downloadBtn.disabled = true;
    designGenerated = false;
  });

  // Générer design → aller à designfile.html avec les données
  generateDesignBtn.addEventListener('click', () => {
    if (!currentCopyContent) {
      alert('Veuillez uploader ou sélectionner une copie avant de générer le design.');
      return;
    }

    // Sauvegarder dans localStorage pour designfile.html
    localStorage.setItem('briefingText', briefingContent);
    localStorage.setItem('designCopyText', currentCopyContent);

    // Rediriger vers designfile.html
    window.location.href = 'designfile.html';
  });

  // Le téléchargement est géré sur designfile.html, donc ici on désactive ce bouton
  downloadBtn.disabled = true;
});
