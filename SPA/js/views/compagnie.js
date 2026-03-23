import {
    createCompagnie,
    deleteCompagnie,
    getCompagnie,
    getCompagnies,
    updateCompagnie
} from "../services/compagnieProvider.js";

let compagnieActuelleId = null;

export async function recupererCompagnies() {
    try{
        const donnees = await getCompagnies();
        
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
        const compagnie = await getCompagnie(compagnieId);
        
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
            await updateCompagnie(compagnieActuelleId, {
                nomCompagnie: nomCompagnie
            });
        } 
        else{
            await createCompagnie({
                nomCompagnie: nomCompagnie
            });
        }
        recupererCompagnies();
    }
    catch(error) {
        if (error.status) {
            const action = compagnieActuelleId ? 'Modification' : 'Création';
            alert(`${action} impossible : ce nom de compagnie est déjà pris.`);
            return;
        }
        console.error('Erreur:', error);
    }
}

async function supprimerCompagnie() {
    if (!compagnieActuelleId) return;
    try{
        await deleteCompagnie(compagnieActuelleId);
        compagnieActuelleId = null;
        recupererCompagnies();
    }
    catch(error) {
        if (error.status) {
            alert('Suppression impossible: cette compagnie est liee a des enregistrements (cle etrangere).');
            return;
        }
        console.error('Erreur:', error);
    }
}