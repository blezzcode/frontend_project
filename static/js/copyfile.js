document.addEventListener('DOMContentLoaded', () => {
  const storedCopy = localStorage.getItem('copyContent'); // Copy enregistrée depuis index.html
  const fileChoiceSection = document.getElementById('fileChoiceSection');
  const storedCopyOptions = document.getElementById('storedCopyOptions');
  const useStoredCopyBtn = document.getElementById('useStoredCopyBtn');
  const copyFileInput = document.getElementById('copyFileInput');
  const contentDisplay = document.getElementById('contentDisplay');
  const copyContent = document.getElementById('copyContent');
  const designContent = document.getElementById('designContent');
  const comparisonSection = document.getElementById('comparisonSection');
  const generalComparison = document.getElementById('generalComparison');
  const semanticComparison = document.getElementById('semanticComparison');
  const factualComparison = document.getElementById('factualComparison');
  const saveWarning = document.getElementById('saveWarning');
  const generateDesignBtn = document.getElementById('generateDesignBtn');
  const saveDesignBtn = document.getElementById('saveDesignBtn');
  const downloadDesignBtn = document.getElementById('downloadDesignBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');

  let isModified = false;
  let designGenerated = false;

  // Afficher options si copy stockée
  if (storedCopy) {
    storedCopyOptions.style.display = 'block';
  }

  // Si on clique pour utiliser la copy stockée
  useStoredCopyBtn.addEventListener('click', () => {
    copyContent.value = storedCopy;
    showContentSection();
    resetStateAfterLoad();
  });

  // Si upload d'un nouveau fichier copy
  copyFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const arrayBuffer = reader.result;
      mammoth.extractRawText({arrayBuffer: arrayBuffer})
        .then(result => {
          copyContent.value = result.value;
          showContentSection();
          resetStateAfterLoad();
        })
        .catch(() => alert('Erreur lors de la lecture du fichier DOCX'));
    };
    reader.readAsArrayBuffer(file);
  });

  // Afficher la section texte + comparer
  function showContentSection() {
    contentDisplay.style.display = 'flex';
    comparisonSection.style.display = 'none';
    generateDesignBtn.disabled = false;
    saveDesignBtn.style.display = 'none';
    downloadDesignBtn.style.display = 'none';
    nextPageBtn.disabled = true;
    saveWarning.style.display = 'none';
  }

  // Réinitialiser l'état
  function resetStateAfterLoad() {
    isModified = false;
    designGenerated = false;
    designContent.value = '';
  }

  // Lorsqu'on modifie le contenu de la copy (textarea)
  copyContent.addEventListener('input', () => {
    if (!designGenerated) return;

    if (!isModified) {
      isModified = true;
      nextPageBtn.disabled = true;
      saveWarning.style.display = 'block';
      saveDesignBtn.style.display = 'inline-flex';
    }
  });

  // Générer design sur clic
  generateDesignBtn.addEventListener('click', () => {
    if (!copyContent.value.trim()) {
      alert('Le contenu copy est vide.');
      return;
    }

    // Ici ta logique réelle de génération design à remplacer ci-dessous :
    designContent.value = 'Design généré à partir du copy :\n\n' + copyContent.value;

    comparisonSection.style.display = 'block';
    updateComparisons();

    designGenerated = true;
    isModified = false;
    saveWarning.style.display = 'none';

    saveDesignBtn.style.display = 'inline-flex';
    downloadDesignBtn.style.display = 'inline-flex';
    nextPageBtn.disabled = false;
  });

  // Sauvegarder design
  saveDesignBtn.addEventListener('click', () => {
    localStorage.setItem('designContent', designContent.value);
    isModified = false;
    nextPageBtn.disabled = false;
    saveWarning.style.display = 'none';
    alert('Design enregistré');
  });

  // Télécharger design
  downloadDesignBtn.addEventListener('click', () => {
    const blob = new Blob([designContent.value], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Passer à la page suivante
  nextPageBtn.addEventListener('click', () => {
    if (isModified) {
      alert('Veuillez enregistrer vos modifications avant de continuer.');
      return;
    }
    window.location.href = 'designfile.html';
  });

  // Simuler mise à jour comparaison
  function updateComparisons() {
    generalComparison.textContent = '95 %';    // valeurs fictives
    semanticComparison.textContent = '90 %';
    factualComparison.textContent = '92 %';
  }
});
