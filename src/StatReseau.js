function StatReseau({ lignes }) {
  // 1. Nombre total de lignes
  const nombreLignes = lignes.length;

  // 2. Somme totale des arrêts 
  const totalArrets = lignes.reduce((somme, ligne) => somme + ligne.arrets, 0);

  // 3. Ligne ayant le plus d'arrêts
  const ligneMax = lignes.reduce((prev, current) => 
    (prev.arrets > current.arrets) ? prev : current
  );

  return (
    <div className="stat-reseau">
      <div><strong>Lignes :</strong> {nombreLignes}</div>
      <div><strong>Total Arrêts :</strong> {totalArrets}</div>
      <div><strong>Ligne la plus longue :</strong> Ligne {ligneMax.numero} ({ligneMax.arrets} arrêts)</div>
    </div>
  );
}

export default StatReseau;