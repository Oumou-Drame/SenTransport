import './LigneBus.css';

function LigneBus({ numero, depart, arrivee, arrets,couleur }) {
  return (
    <div className="ligne-bus">
      <div className="ligne-numero" style = {{backgroundColor : couleur}}>
         {numero}
      </div>
      <div className="ligne-info">
        <span className='ligne-trajet'>
          {depart} &rarr; {arrivee}
        </span>
      </div>
      <span className="ligne-arrets">
        {arrets} arrêts
      </span>
    </div>
  );
}

export default LigneBus;