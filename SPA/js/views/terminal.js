import { API_URL } from "../config.js";

const API_URL_terminal = API_URL + "terminaux";
const API_URL_aeroport = API_URL + "aeroports";

let terminalActuel = null;
let aeroports = [];

export async function recupererTerminaux() {
    try {
        // Récupérer les aéroports pour le formulaire
        const reponseAeroports = await fetch(API_URL_aeroport);
        const donneesAeroports = await reponseAeroports.json();
        aeroports = donneesAeroports;
        
        const reponse = await fetch(API_URL_terminal);
        const donnees = await reponse.json();
        
        afficherListeTerminaux(donnees);
        afficherPageVide();
    } catch(error) {
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
        elementTerminal.textContent = `Terminal ${terminal.numTerminal} - Aéroport ${terminal.idAeroport}`;
        elementTerminal.addEventListener('click', () => afficherDetailsTerminal(terminal.idAeroport, terminal.numTerminal));
        listeDiv.appendChild(elementTerminal);
    });
}

function afficherPageVide() {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = '<p>Sélectionnez un terminal ou créez-en un nouveau</p>';
}

async function afficherDetailsTerminal(idAeroport, numTerminal) {
    try {
        const reponse = await fetch(`${API_URL_terminal}/${idAeroport}/${numTerminal}`);
        const terminal = await reponse.json();
        
        terminalActuel = { idAeroport, numTerminal };
        
        afficherFormulaireTerminal(terminal);
    } catch(error) {
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
            <select id="idAeroport" ${terminal ? 'disabled' : ''}>
                <option value="">-- Sélectionner un aéroport --</option>
                ${optionsAeroports}
            </select>
        </div>
        <div class="form-group">
            <label>Numéro du terminal</label>
            <input type="text" id="numTerminal" value="${terminal ? terminal.numTerminal : ''}" ${terminal ? 'disabled' : ''} />
        </div>
        <div class="button-group">
            ${!terminal ? '<button class="btn-save" id="btn-sauvegarder">Créer</button>' : ''}
            ${terminal ? '<button class="btn-delete" id="btn-supprimer">Supprimer</button>' : ''}
            <button class="btn-cancel" id="btn-annuler">Annuler</button>
        </div>
    `;
    
    if (!terminal) {
        document.getElementById('btn-sauvegarder').addEventListener('click', sauvegarderTerminal);
    }
    if (terminal) {
        document.getElementById('btn-supprimer').addEventListener('click', supprimerTerminal);
    }
    document.getElementById('btn-annuler').addEventListener('click', annulerTerminal);
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
    
    try {
        await fetch(API_URL_terminal, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                idAeroport: parseInt(idAeroport),
                numTerminal: numTerminal
            })
        });
        recupererTerminaux();
    } catch(error) {
        console.error('Erreur:', error);
    }
}

async function supprimerTerminal() {
    if (!terminalActuel) return;
    
    try {
        await fetch(`${API_URL_terminal}/${terminalActuel.idAeroport}/${terminalActuel.numTerminal}`, {
            method: 'DELETE'
        });
        terminalActuel = null;
        recupererTerminaux();
    } catch(error) {
        console.error('Erreur:', error);
    }
}

function annulerTerminal() {
    terminalActuel = null;
    afficherPageVide();
}