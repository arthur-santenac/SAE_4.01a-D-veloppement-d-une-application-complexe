import {
    createTerminal,
    deleteTerminal,
    getTerminal,
    getTerminaux,
    updateTerminal
} from "../services/terminalProvider.js";
import { getAeroports } from "../services/aeroportProvider.js";

let terminalActuel = null;
let aeroports = [];

export async function recupererTerminaux() {
    try{
        aeroports = await getAeroports();
        const donnees = await getTerminaux();
        afficherListeTerminaux(donnees);
        afficherPageVide();
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherListeTerminaux(terminaux) {
    const divGauche = document.getElementById('liste-gauche');
    divGauche.innerHTML = `
        <h2>Terminaux</h2>
        <button id="btn-creer-terminal">+ Créer un terminal</button>
        <div id="liste-terminaux"></div>
    `;
    document.getElementById('btn-creer-terminal').addEventListener('click', creerNouveauTerminal);
    const listeDiv = document.getElementById('liste-terminaux');
    terminaux.forEach(terminal => {
        const elementTerminal = document.createElement('div');
        elementTerminal.className = 'item-liste';
        elementTerminal.textContent = `Terminal ${terminal.numTerminal}`;
        elementTerminal.addEventListener('click', () => afficherDetailsTerminal(terminal.idAeroport, terminal.numTerminal));
        listeDiv.appendChild(elementTerminal);
    });
}

function afficherPageVide() {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = '<p>Sélectionnez un terminal ou créez-en un nouveau</p>';
}

async function afficherDetailsTerminal(idAeroport, numTerminal) {
    try{
        const terminal = await getTerminal(idAeroport, numTerminal);
        terminalActuel = { idAeroport, numTerminal };
        afficherFormulaireTerminal(terminal);
    }
    catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherFormulaireTerminal(terminal) {
    const divDroite = document.getElementById('details-droite');
    const optionsAeroports = aeroports.map(aeroport => {
        const aeroportId = aeroport.uri.split('/').pop();
        const selected = terminal && terminal.idAeroport == aeroportId ? 'selected' : '';
        return `<option value="${aeroportId}" ${selected}>${aeroport.nomAeroport}</option>`;
    }).join('');
    divDroite.innerHTML = `
        <h2>${terminal ? 'Détails du terminal' : 'Créer un terminal'}</h2>
        <div class="form-group">
            <label>Aéroport</label>
            <select id="idAeroport">
                <option value="">-- Sélectionner un aéroport --</option>
                ${optionsAeroports}
            </select>
        </div>
        <div class="form-group">
            <label>Numéro du terminal</label>
            <input type="text" id="numTerminal" value="${terminal ? terminal.numTerminal : ''}" />
        </div>
        <div class="button-group">
            <button class="btn-save" id="btn-sauvegarder">${terminal ? 'Modifier' : 'Créer'}</button>
            ${terminal ? '<button class="btn-delete" id="btn-supprimer">Supprimer</button>' : ''}
        </div>
    `;

    document.getElementById('btn-sauvegarder').addEventListener('click', sauvegarderTerminal);
    if (terminal) {
        document.getElementById('btn-supprimer').addEventListener('click', supprimerTerminal);
    }
}

async function creerNouveauTerminal() {
    terminalActuel = null;
    afficherFormulaireTerminal(null);
}

async function sauvegarderTerminal() {
    const idAeroport = document.getElementById('idAeroport').value;
    const numTerminal = document.getElementById('numTerminal').value;
    if (!idAeroport || !numTerminal) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    try{
        if (terminalActuel) {
            await updateTerminal(terminalActuel.idAeroport, terminalActuel.numTerminal, {
                idAeroport: parseInt(idAeroport),
                numTerminal: numTerminal
            });
        }
        else {
            await createTerminal({
                idAeroport: parseInt(idAeroport),
                numTerminal: numTerminal
            });
        }
        recupererTerminaux();
    }
    catch(error) {
        if (error.status) {
            const message = terminalActuel
                ? 'Modification impossible pour ce terminal'
                : 'Creation impossible : ce terminal existe deja.';
            alert(message);
            return;
        }
        console.error('Erreur:', error);
    }
}

async function supprimerTerminal() {
    if (!terminalActuel) return;
    try {
        await deleteTerminal(terminalActuel.idAeroport, terminalActuel.numTerminal);
        terminalActuel = null;
        recupererTerminaux();
    } catch(error) {
        if (error.status) {
            alert('Suppression impossible: ce terminal est lie a des enregistrements (cle etrangere).');
            return;
        }
        console.error('Erreur:', error);
    }
}
