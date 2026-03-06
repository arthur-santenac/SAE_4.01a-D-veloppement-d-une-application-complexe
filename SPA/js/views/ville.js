import { API_URL } from "../config.js";

const API_URL_ville = API_URL + "villes";
const API_URL_pays = API_URL + "pays";

let villeActuelleId = null;
let pays = [];

export async function recupererVilles() {
    try{
        const reponsePays = await fetch(API_URL_pays);
        const donneesPays = await reponsePays.json();
        pays = donneesPays;

        const reponse = await fetch(API_URL_ville);
        const donnees = await reponse.json();
        
        afficherListeVilles(donnees);
        afficherPageVide();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherListeVilles(villes) {
    const divGauche = document.getElementById('liste-gauche');
    divGauche.innerHTML = `
        <h2>Villes</h2>
        <button id="btn-creer-ville">+ Créer une ville</button>
        <div id="liste-villes"></div>
    `;
    document.getElementById('btn-creer-ville').addEventListener('click', creerNouvelleVille);
    const listeDiv = document.getElementById('liste-villes');
    villes.forEach(ville => {
        const villeId = ville.uri.split('/').pop();
        const elementVille = document.createElement('div');
        elementVille.className = 'item-liste';
        elementVille.textContent = ville.nomVille;
        elementVille.addEventListener('click', () => afficherDetailsVille(parseInt(villeId)));
        listeDiv.appendChild(elementVille);
    });
}

function afficherPageVide() {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = '<p>Sélectionnez une ville ou créez-en une nouvelle</p>';
}

async function afficherDetailsVille(villeId) {
    try{
        const reponse = await fetch(`${API_URL_ville}/${villeId}`);
        const ville = await reponse.json();
        villeActuelleId = villeId;
        afficherFormulaireVille(ville);
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherFormulaireVille(ville) {
    const divDroite = document.getElementById('details-droite');
    const optionsPays = pays.map(p => {
        const paysId = p.uri.split('/').pop();
        const selected = ville && ville.codePays == paysId ? 'selected' : '';
        return `<option value="${paysId}" ${selected}>${p.nomPays}</option>`;
    }).join('');
    divDroite.innerHTML = `
        <h2>${ville ? 'Modifier la ville' : 'Créer une ville'}</h2>
        <div class="form-group">
            <label>Nom de la ville</label>
            <input type="text" id="nomVille" value="${ville ? ville.nomVille : ''}" />
        </div>
        <div class="form-group">
            <label>Pays</label>
            <select id="codePays">
                <option value="">-- Sélectionner un pays --</option>
                ${optionsPays}
            </select>
        </div>
        <div class="button-group">
            <button class="btn-save" id="btn-sauvegarder">${ville ? 'Modifier' : 'Créer'}</button>
            ${ville ? '<button class="btn-delete" id="btn-supprimer">Supprimer</button>' : ''}
        </div>
    `;
    document.getElementById('btn-sauvegarder').addEventListener('click', sauvegarderVille);
    if (ville) {
        document.getElementById('btn-supprimer').addEventListener('click', supprimerVille);
    }
}

async function creerNouvelleVille() {
    villeActuelleId = null;
    afficherFormulaireVille(null);
}

async function sauvegarderVille() {
    const nomVille = document.getElementById('nomVille').value;
    const codePays = document.getElementById('codePays').value;
    if (!nomVille || !codePays) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    try{
        if (villeActuelleId) {
            const reponse = await fetch(`${API_URL_ville}/${villeActuelleId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nomVille: nomVille,
                    codePays: parseInt(codePays)
                })
            });
            if (!reponse.ok) {
                alert('Modification impossible : ce nom de ville est déjà pris.');
                return;
            }
        }
        else {
            const reponse = await fetch(API_URL_ville, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nomVille: nomVille,
                    codePays: parseInt(codePays)
                })
            });
            if (!reponse.ok) {
                alert('Création impossible : ce nom de ville est déjà pris.');
                return;
            }
        }
        recupererVilles();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

async function supprimerVille() {
    if (!villeActuelleId) return;
    try{
        const reponse = await fetch(`${API_URL_ville}/${villeActuelleId}`, {
            method: 'DELETE'
        });
        if (!reponse.ok) {
            alert('Suppression impossible: cette ville est liee a des enregistrements (cle etrangere).');
            return;
        }
        villeActuelleId = null;
        recupererVilles();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}