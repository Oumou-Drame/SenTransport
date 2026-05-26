import "./Recherche.css";

function Recherche({ valeur, onChange,nombreRecherches }) {
  return (
    <div className="recherche">
        <p>Nombre de recherches effectuées : {nombreRecherches}</p>
      <input
        type="text"
        className="recherche-input"
        placeholder="Rechercher une ligne (départ, arrivée)..."
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default Recherche;