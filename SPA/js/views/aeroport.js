import {
    createAeroport,
    deleteAeroport,
    getAeroport,
    getAeroports,
    updateAeroport
} from "../services/aeroportProvider.js";
import { getVilles } from "../services/villeProvider.js";

let aeroportActuelId = null;
let villes = [];

export async function recupererAeroports() {
    try{
        villes = await getVilles();
        const donnees = await getAeroports();
        afficherListeAeroports(donnees);
        afficherPageVide();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherListeAeroports(aeroports) {
    const divGauche = document.getElementById('liste-gauche');
    divGauche.innerHTML = `
        <h2>Aéroports</h2>
        <button id="btn-creer-aeroport">+ Créer un aéroport</button>
        <div id="liste-aeroports"></div>
    `;
    document.getElementById('btn-creer-aeroport').addEventListener('click', creerNouvelAeroport);
    const listeDiv = document.getElementById('liste-aeroports');
    aeroports.forEach(aeroport => {
        const aeroportId = aeroport.uri.split('/').pop();
        const elementAeroport = document.createElement('div');
        elementAeroport.className = 'item-liste';
        elementAeroport.textContent = aeroport.nomAeroport;
        elementAeroport.addEventListener('click', () => afficherDetailsAeroport(parseInt(aeroportId)));
        listeDiv.appendChild(elementAeroport);
    });
}

function afficherPageVide() {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = '<p>Sélectionnez un aéroport ou créez-en un nouveau</p>';
}

async function afficherDetailsAeroport(aeroportId) {
    try{
        const aeroport = await getAeroport(aeroportId);
        aeroportActuelId = aeroportId;
        afficherFormulaireAeroport(aeroport);
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherFormulaireAeroport(aeroport) {
    const divDroite = document.getElementById('details-droite');
    const optionsVilles = villes.map(ville => {
        const villeId = ville.uri.split('/').pop();
        const selected = aeroport && aeroport.idVille == villeId ? 'selected' : '';
        return `<option value="${villeId}" ${selected}>${ville.nomVille}</option>`;
    }).join('');
    divDroite.innerHTML = `
        <h2>${aeroport ? 'Modifier l\'aéroport' : 'Créer un aéroport'}</h2>
        <div class="form-group">
            <label>Nom de l'aéroport</label>
            <input type="text" id="nomAeroport" value="${aeroport ? aeroport.nomAeroport : ''}" />
        </div>
        <div class="form-group">
            <label>Ville</label>
            <select id="idVille">
                <option value="">-- Sélectionner une ville --</option>
                ${optionsVilles}
            </select>
        </div>
        <div class="button-group">
            <button class="btn-save" id="btn-sauvegarder">${aeroport ? 'Modifier' : 'Créer'}</button>
            ${aeroport ? '<button class="btn-delete" id="btn-supprimer">Supprimer</button>' : ''}
        </div>
    `;
    document.getElementById('btn-sauvegarder').addEventListener('click', sauvegarderAeroport);
    if (aeroport) {
        document.getElementById('btn-supprimer').addEventListener('click', supprimerAeroport);
    }
}

async function creerNouvelAeroport() {
    aeroportActuelId = null;
    afficherFormulaireAeroport(null);
}

async function sauvegarderAeroport() {
    const nomAeroport = document.getElementById('nomAeroport').value;
    const idVille = document.getElementById('idVille').value;
    if (!nomAeroport || !idVille) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    try {
        if (aeroportActuelId) {
            await updateAeroport(aeroportActuelId, {
                nomAeroport: nomAeroport,
                idVille: parseInt(idVille)
            });
        }
        else {
            await createAeroport({
                nomAeroport: nomAeroport,
                idVille: parseInt(idVille)
            });
        }
        recupererAeroports();
    }
    catch(error) {
        if (error.status) {
            const action = aeroportActuelId ? 'Modification' : 'Création';
            alert(`${action} impossible : ce nom de aéroport est déjà pris.`);
            return;
        }
        console.error('Erreur:', error);
    }
}

async function supprimerAeroport() {
    if (!aeroportActuelId) return;
    try{
        await deleteAeroport(aeroportActuelId);
        aeroportActuelId = null;
        recupererAeroports();
    }
    catch(error) {
        if (error.status) {
            alert('Suppression impossible: cet aeroport est lie a des enregistrements (cle etrangere).');
            return;
        }
        console.error('Erreur:', error);
    }
}