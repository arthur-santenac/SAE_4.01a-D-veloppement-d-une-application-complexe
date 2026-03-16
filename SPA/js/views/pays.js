import { API_URL } from "../config.js";

const API_URL_pays = API_URL + "pays";
let paysActuelId = null;

export async function recupererPays() {
    try{
        const reponse = await fetch(API_URL_pays);
        const donnees = await reponse.json();
        
        afficherListePays(donnees);
        afficherPageVide();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherListePays(paysList) {
    const divGauche = document.getElementById('liste-gauche');
    divGauche.innerHTML = `
        <h2>Pays</h2>
        <button id="btn-creer-pays">+ Créer un pays</button>
        <div id="liste-pays"></div>
    `;
    document.getElementById('btn-creer-pays').addEventListener('click', creerNouveauPays);
    const listeDiv = document.getElementById('liste-pays');
    paysList.forEach(pays => {
        const paysId = pays.uri.split('/').pop();
        const elementPays = document.createElement('div');
        elementPays.className = 'item-liste';
        elementPays.textContent = pays.nomPays;
        elementPays.addEventListener('click', () => afficherDetailsPays(parseInt(paysId)));
        listeDiv.appendChild(elementPays);
    });
}

function afficherPageVide() {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = '<p>Sélectionnez un pays ou créez-en un nouveau</p>';
}

async function afficherDetailsPays(paysId) {
    try{
        const reponse = await fetch(`${API_URL_pays}/${paysId}`);
        const pays = await reponse.json();
        paysActuelId = paysId;
        afficherFormulairePays(pays);
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherFormulairePays(pays) {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = `
        <h2>${pays ? 'Modifier le pays' : 'Créer un pays'}</h2>
        <div class="form-group">
            <label>Nom du pays</label>
            <input type="text" id="nomPays" value="${pays ? pays.nomPays : ''}" />
        </div>
        <div class="button-group">
            <button class="btn-save" id="btn-sauvegarder">${pays ? 'Modifier' : 'Créer'}</button>
            ${pays ? '<button class="btn-delete" id="btn-supprimer">Supprimer</button>' : ''}
        </div>
    `;
    document.getElementById('btn-sauvegarder').addEventListener('click', sauvegarderPays);
    if (pays) {
        document.getElementById('btn-supprimer').addEventListener('click', supprimerPays);
    }
}

async function creerNouveauPays() {
    paysActuelId = null;
    afficherFormulairePays(null);
}

async function sauvegarderPays() {
    const nomPays = document.getElementById('nomPays').value;
    if (!nomPays) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    try{
        if (paysActuelId) {
            const reponse = await fetch(`${API_URL_pays}/${paysActuelId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nomPays: nomPays
                })
            });
            if (!reponse.ok) {
                alert('Modification impossible : ce nom de pays est déjà pris.');
                return;
            }
        }
        else{
            const reponse = await fetch(API_URL_pays, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nomPays: nomPays
                })
            });
            if (!reponse.ok) {
                alert('Création impossible : ce nom de pays est déjà pris.');
                return;
            }
        }
        recupererPays();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

async function supprimerPays() {
    if (!paysActuelId) return;
    try{
        const reponse = await fetch(`${API_URL_pays}/${paysActuelId}`, {
            method: 'DELETE'
        });
        if (!reponse.ok) {
            alert('Suppression impossible: ce pays est lie a des enregistrements (cle etrangere).');
            return;
        }
        paysActuelId = null;
        recupererPays();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}