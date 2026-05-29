import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';

// Corriger le bug d'affichage des icônes Leaflet avec Webpack/React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});
// Calculer la distance entre 2 points GPS (km)
function calculerDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function BoutonCentrer({ position }) {
    const map = useMap(); // POur Récupèrer l'instance de la carte Leaflet

    const gererClic = () => {
        if (position) {

            map.setView(position, 15);
        } else {
            alert("La géolocalisation n'est pas encore disponible ou a été refusée.");
        }
    };

    return (
        <button
            onClick={gererClic}
            type="button"
            style={{
                position: 'absolute',
                top: '80px',
                left: '10px',
                zIndex: 1000,
                padding: '8px 12px',
                backgroundColor: '#ffffff',
                border: '2px solid rgba(0,0,0,0.2)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
                fontSize: '12px'
            }}
        >
            Centrer sur ma position
        </button>
    );
}

function Carte() {
    const [arrets, setArrets] = useState([]);
    const [positionUtilisateur, setPositionUtilisateur] = useState(null);
    const [lesTroisProches, setLesTroisProches] = useState([]);
    const iconeRouge = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const DAKAR = [14.6928, -17.4467];

    // Charger les arrêts depuis Flask
    useEffect(() => {
        fetch("http://localhost:5000/arrets")
            .then((r) => r.json())
            .then((data) => setArrets(data))
            .catch((err) =>
                console.error("Erreur arrêts :", err)
            );
    }, []);

    // Géolocalisation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPositionUtilisateur([
                        pos.coords.latitude,
                        pos.coords.longitude,
                    ]);
                },
                () => console.log("Géolocalisation refusée")
            );
        }
    }, []);

    // Trouver les 3 arrêts les plus proches
    useEffect(() => {
        if (positionUtilisateur && arrets.length > 0) {

            // 1. On calcule la distance pour TOUS les arrêts
            const arretsAvecDistance = arrets.map((a) => {
                const d = calculerDistance(
                    positionUtilisateur[0],
                    positionUtilisateur[1],
                    a.lat,
                    a.lon
                );
                return { ...a, distance: d }; // On renvoie l'arrêt enrichi de sa distance
            });

            // 2. On trie du plus proche au plus loin, et on prend les 3 premiers
            const triesEtCoupes = arretsAvecDistance
                .sort((itemA, itemB) => itemA.distance - itemB.distance) // Tri croissant
                .slice(0, 3); // Garde uniquement les index 0, 1 et 2

            setLesTroisProches(triesEtCoupes);
        }
    }, [positionUtilisateur, arrets]);

    return (
        <div className="carte-container">
            <h2 className="carte-titre">Carte des arrêts</h2>

            {lesTroisProches.length > 0 && (
                <div className="arrets-proches-container" style={{
                    backgroundColor: '#e8f5e9',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    borderLeft: '5px solid #0a6e31'
                }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#0a6e31', fontSize: '1.1rem' }}>
                        📍 Les 3 arrêts les plus proches :
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#2c3e50' }}>
                        {lesTroisProches.map((a, index) => (
                            <li key={a.id} style={{ marginBottom: '4px', fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                <span>{a.nom}</span> à <strong>{a.distance.toFixed(1)} km</strong> (Lignes : {a.lignes.join(", ")})
                                {index === 0 && <span style={{ color: '#0a6e31' }}> — Le plus proche !</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <MapContainer center={DAKAR} zoom={13} className="carte">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                />
                // Insertion du bouton de recentrage dans MapContainer
                <BoutonCentrer position={positionUtilisateur} />

                {arrets.map((a) => {

                    // Le plus proche est tout simplement le premier élément (index 0) de notre tableau des 3 
                    const estLePlusProche = lesTroisProches.length > 0 && a.id === lesTroisProches[0].id;

                    return (
                        <Marker
                            key={a.id}
                            position={[a.lat, a.lon]}
                            icon={estLePlusProche ? iconeRouge : new L.Icon.Default()} // C'est ici que la magie opère !
                        >
                            <Popup>
                                <strong>{a.nom}</strong>
                                {estLePlusProche && <span style={{ color: "#FF0000" }}> (Le plus proche arret  !)</span>}
                                <br />
                                Lignes : {a.lignes.join(", ")}
                            </Popup>
                        </Marker>
                    );
                })}

                {positionUtilisateur && (
                    <Marker position={positionUtilisateur}>
                        <Popup>Vous etes ici</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}

export default Carte;