import './LigneBus.css';

function LigneBus({ numero, depart, arrivee, arrets }) {
  return (
    <div className="ligne-bus-card">
      <div className="ligne-numero">
        Ligne {numero}
      </div>
      <div className="ligne-trajet">
        <strong>{depart}</strong> 
        <span className="fleche"> → </span> 
        <strong>{arrivee}</strong>
      </div>
      <div className="ligne-details">
        {arrets} arrêts
      </div>
    </div>
  );
}

export default LigneBus;