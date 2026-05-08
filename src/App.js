import './App.css';
import Header from './Header';
import ListeLignes from './ListeLignes';
import Footer from './Footer';
import StatReseau from './StatReseau';

function App() {
  const lignes = [
    { id: 1, numero: "1", depart: "Parcelles Assainies", arrivee: "Plateau", arrets: 14, couleur:"green"},
    { id: 2, numero: "7", depart: "Guediawaye", arrivee: "Place Obe", arrets: 18,couleur:"gray"},
    { id: 3, numero: "15", depart: "Pikine", arrivee: "Medina", arrets: 12, couleur:"black" },
    { id: 4, numero: "23", depart: "Ouakam", arrivee: "Grand Dakar", arrets: 10,couleur:"blue" },
    { id: 5, numero: "8", depart: "Almadies", arrivee: "Colobane", arrets: 16,couleur:"yellow" },
    { id: 6, numero: "12", depart: "Yoff", arrivee: "Sandaga", arrets: 11,couleur:"lightblue" },
    { id: 7, numero: "4", depart: "Fann", arrivee: "Liberté 6", arrets: 8, couleur: "orange" },
    { id: 8, numero: "10", depart: "HLM", arrivee: "Dieuppeul", arrets: 22, couleur: "purple" },
    { id: 9, numero: "11", depart: "Sicap", arrivee: "Fann Hock", arrets: 13, couleur: "pink" },
    { id: 10, numero: "20", depart: "Grand Yoff", arrivee: "Bel-Air", arrets: 17, couleur: "brown" },
  ];

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        
      <StatReseau lignes={lignes} />

        <ListeLignes lignes={lignes} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
