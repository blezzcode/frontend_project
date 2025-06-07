document.addEventListener('DOMContentLoaded', () => {
  const leftCopy = document.getElementById('leftCopy');
  const rightDesign = document.getElementById('rightDesign');
  const saveDesignBtn = document.getElementById('saveDesignBtn');
  const downloadDesignBtn = document.getElementById('downloadDesignBtn');

  // Charger la copy sauvegardée dans la zone gauche (read-only)
  const savedCopy = localStorage.getItem('savedCopyText') || '';
  leftCopy.value = savedCopy;

  // Charger le design sauvegardé (si existant), sinon copie initiale dans droite
  const savedDesign = localStorage.getItem('savedDesignText');
  if (savedDesign) {
    rightDesign.value = savedDesign;
  } else {
    rightDesign.value = savedCopy; // initialiser design avec copy au départ
  }

  // Enregistrer la modification du design
  saveDesignBtn.addEventListener('click', () => {
    const content = rightDesign.value.trim();
    if (content) {
      localStorage.setItem('savedDesignText', content);
      alert('Design enregistré avec succès !');
    } else {
      alert('Le contenu du design est vide.');
    }
  });

  // Télécharger le contenu du design sous forme .txt (ou PDF à intégrer si besoin)
  downloadDesignBtn.addEventListener('click', () => {
    const content = rightDesign.value;
    if (!content) {
      alert('Le contenu est vide, rien à télécharger.');
      return;
    }
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.txt'; // changer extension si PDF généré
    a.click();
    URL.revokeObjectURL(url);
  });
});
