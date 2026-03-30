import {
    createPays,
    deletePays,
    getPays,
    getPaysList,
    updatePays
} from "../services/paysProvider.js";

let paysActuelId = null;

export async function recupererPays() {
    try{
        const donnees = await getPaysList();
        
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
        const pays = await getPays(paysId);
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
            await updatePays(paysActuelId, {
                nomPays: nomPays
            });
        }
        else{
            await createPays({
                nomPays: nomPays
            });
        }
        recupererPays();
    }
    catch(error) {
        if (error.status) {
            const action = paysActuelId ? 'Modification' : 'Création';
            alert(`${action} impossible : ce nom de pays est déjà pris.`);
            return;
        }
        console.error('Erreur:', error);
    }
}

async function supprimerPays() {
    if (!paysActuelId) return;
    try{
        await deletePays(paysActuelId);
        paysActuelId = null;
        recupererPays();
    }
    catch(error) {
        if (error.status) {
            alert('Suppression impossible: ce pays est lie a des enregistrements (cle etrangere).');
            return;
        }
        console.error('Erreur:', error);
    }
}