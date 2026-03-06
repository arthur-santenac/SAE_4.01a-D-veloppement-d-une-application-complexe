import { API_URL } from "../config.js";

const API_URL_compagnie = API_URL + "compagnies";
let compagnieActuelleId = null;

export async function recupererCompagnies() {
    try{
        const reponse = await fetch(API_URL_compagnie);
        const donnees = await reponse.json();
        
        afficherListeCompagnies(donnees);
        afficherPageVide();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherListeCompagnies(compagnies) {
    const divGauche = document.getElementById('liste-gauche');
    divGauche.innerHTML = `
        <h2>Compagnies</h2>
        <button id="btn-creer-compagnie">+ Créer une compagnie</button>
        <div id="liste-compagnies"></div>
        `;
    document.getElementById('btn-creer-compagnie').addEventListener('click', creerNouvelleCompagnie);
    const listeDiv = document.getElementById('liste-compagnies');
    compagnies.forEach(compagnie => {
        const compagnieId = compagnie.uri.split('/').pop();
        const elementCompagnie = document.createElement('div');
        elementCompagnie.className = 'item-liste';
        elementCompagnie.textContent = compagnie.nomCompagnie;
        elementCompagnie.addEventListener('click', () => afficherDetailsCompagnie(parseInt(compagnieId)));
        listeDiv.appendChild(elementCompagnie);
    });
}

function afficherPageVide() {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = '<p>Sélectionnez une compagnie ou créez-en une nouvelle</p>';
}

async function afficherDetailsCompagnie(compagnieId) {
    try{
        const reponse = await fetch(`${API_URL_compagnie}/${compagnieId}`);
        const compagnie = await reponse.json();
        
        compagnieActuelleId = compagnieId;
        
        afficherFormulaireCompagnie(compagnie);
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherFormulaireCompagnie(compagnie) {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = `
        <h2>${compagnie ? 'Modifier la compagnie' : 'Créer une compagnie'}</h2>
        <div class="form-group">
            <label>Nom de la compagnie</label>
            <input type="text" id="nomCompagnie" value="${compagnie ? compagnie.nomCompagnie : ''}" />
        </div>
        <div class="button-group">
            <button class="btn-save" id="btn-sauvegarder">${compagnie ? 'Modifier' : 'Créer'}</button>
            ${compagnie ? '<button class="btn-delete" id="btn-supprimer">Supprimer</button>' : ''}
        </div>
    `;
    
    document.getElementById('btn-sauvegarder').addEventListener('click', sauvegarderCompagnie);
    if (compagnie) {
        document.getElementById('btn-supprimer').addEventListener('click', supprimerCompagnie);
    }
}

async function creerNouvelleCompagnie() {
    compagnieActuelleId = null;
    afficherFormulaireCompagnie(null);
}

async function sauvegarderCompagnie() {
    const nomCompagnie = document.getElementById('nomCompagnie').value;
    if (!nomCompagnie) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    try{
        if (compagnieActuelleId) {
            const reponse = await fetch(`${API_URL_compagnie}/${compagnieActuelleId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nomCompagnie: nomCompagnie
                })
            });
            if (!reponse.ok) {
                alert('Modification impossible : ce nom de compagnie est déjà pris.');
                return;
            }
        } 
        else{
            await fetch(API_URL_compagnie, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    nomCompagnie: nomCompagnie
                })
            });
            if (!reponse.ok) {
                alert('Création impossible : ce nom de compagnie est déjà pris.');
                return;
            }
        }
        recupererCompagnies();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

async function supprimerCompagnie() {
    if (!compagnieActuelleId) return;
    try{
        const reponse = await fetch(`${API_URL_compagnie}/${compagnieActuelleId}`, {
            method: 'DELETE'
        });
        if (!reponse.ok) {
            alert('Suppression impossible: cette compagnie est liee a des enregistrements (cle etrangere).');
            return;
        }
        compagnieActuelleId = null;
        recupererCompagnies();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}