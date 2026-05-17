import LigneBus from './LigneBus';
import './ListeLignes.css';

function ListeLignes({ lignes }) {
  return (
    <div className="liste-lignes">
      <h2 className="liste-titre">Lignes Dakar Dem Dikk</h2>
      <p className="liste-description">
        {lignes.length} lignes disponibles
      </p>
      {
        lignes.map(ligne =>{
          const {id,numero,depart,arrivee} = ligne;
            return <LigneBus
              key = {id}
              numero = {numero}
              depart = {depart}
              arrivee={arrivee}
          />
        })
      }
    </div>
  );
}

export default ListeLignes;

