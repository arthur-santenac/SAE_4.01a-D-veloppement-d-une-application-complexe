import {
    createVille,
    deleteVille,
    getVille,
    getVilles,
    updateVille
} from "../services/villeProvider.js";
import { getPaysList } from "../services/paysProvider.js";

let villeActuelleId = null;
let pays = [];

export async function recupererVilles() {
    try{
        pays = await getPaysList();
        const donnees = await getVilles();
        
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
        const ville = await getVille(villeId);
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
            await updateVille(villeActuelleId, {
                nomVille: nomVille,
                codePays: parseInt(codePays)
            });
        }
        else {
            await createVille({
                nomVille: nomVille,
                codePays: parseInt(codePays)
            });
        }
        recupererVilles();
    }
    catch(error) {
        if (error.status) {
            const action = villeActuelleId ? 'Modification' : 'Création';
            alert(`${action} impossible : ce nom de ville est déjà pris.`);
            return;
        }
        console.error('Erreur:', error);
    }
}

async function supprimerVille() {
    if (!villeActuelleId) return;
    try{
        await deleteVille(villeActuelleId);
        villeActuelleId = null;
        recupererVilles();
    }
    catch(error) {
        if (error.status) {
            alert('Suppression impossible: cette ville est liee a des enregistrements (cle etrangere).');
            return;
        }
        console.error('Erreur:', error);
    }
}