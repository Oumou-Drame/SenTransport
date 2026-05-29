import json
from flask import Flask, jsonify,request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les donnees depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

with open("arrets.json","r") as f:
    arrets = json.load(f)

@app.route("/arrets")
def get_arrets():
    return jsonify(arrets)


@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/listeArrets")
def get_listeArrets():
    tous_les_arrets = []
    for ligne in lignes:
        tous_les_arrets.extend(ligne["listeArrets"])
    arrets_uniques = list(set(tous_les_arrets))
    return jsonify({
        "arrets" : arrets_uniques})    


@app.route("/stats")
def get_stats():
    nombre_de_lignes = len(lignes)
    tous_les_arrets = 0
    arrets_max = 0
    numero_ligne = ""
    for ligne in lignes : 
        tous_les_arrets +=ligne["arrets"]
    for ligne in lignes :
        if arrets_max < ligne["arrets"] :
            arrets_max = ligne["arrets"]
            numero_ligne = ligne["numero"]
    return jsonify({
        "Nombre de lignes" : nombre_de_lignes,
        "Nombre d'arrets total" :tous_les_arrets,
        "Numero ligne ayant le plus grand nombre d'arrets" : numero_ligne,
        "Nombre d'arrets de la ligne ayant le plus grand nombre d'arrets" : arrets_max
    })
@app.route("/lignes/recherche")
def get_ligne_recherchee():
    ligne_recherchee = request.args.get("q","")
    lignesFiltrees = []
    for ligne in lignes :
        if ligne_recherchee in ligne["depart"] or ligne_recherchee in ligne["arrivee"] :
            lignesFiltrees.append(ligne)
    return jsonify({
        "ligne" : lignesFiltrees
    })        


@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

if __name__ == "__main__":
    app.run(debug=True, port=5000)