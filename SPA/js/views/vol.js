import { API_URL } from "../config.js";

const API_URL_vol = API_URL + "vols";
const API_URL_compagnie = API_URL + "compagnies";
const API_URL_aeroport = API_URL + "aeroports";
const API_URL_terminal = API_URL + "terminaux";

let volActuel = null;
let compagnies = [];
let aeroports = [];
let terminaux = [];

export async function recupererVols() {
    try {
        // Récupérer les compagnies, aéroports et terminaux pour le formulaire
        const reponseCompagnies = await fetch(API_URL_compagnie);
        const donneesCompagnies = await reponseCompagnies.json();
        compagnies = donneesCompagnies;
        
        const reponseAeroports = await fetch(API_URL_aeroport);
        const donneesAeroports = await reponseAeroports.json();
        aeroports = donneesAeroports;
        
        const reponseTerminaux = await fetch(API_URL_terminal);
        const donneesTerminaux = await reponseTerminaux.json();
        terminaux = donneesTerminaux;
        
        const reponse = await fetch(API_URL_vol);
        const donnees = await reponse.json();
        
        afficherListeVols(donnees);
        afficherPageVide();
    } catch(error) {
        console.error('Erreur:', error);
    }
}

function afficherListeVols(vols) {
    const divGauche = document.getElementById('liste-gauche');
    divGauche.innerHTML = `
        <h2>Vols</h2>
        <button id="btn-creer-vol">+ Créer un vol</button>
        <div id="liste-vols"></div>
    `;

    document.getElementById('btn-creer-vol').addEventListener('click', creerNouveauVol);
    
    const listeDiv = document.getElementById('liste-vols');
    vols.forEach(vol => {
        const elementVol = document.createElement('div');
        elementVol.className = 'item-liste';
        const dateDep = new Date(vol.dateHeureDep).toLocaleString();
        elementVol.textContent = `Vol ${vol.numVol} - ${dateDep}`;
        elementVol.addEventListener('click', () => afficherDetailsVol(vol.idCompagnie, vol.numVol, vol.dateHeureDep));
        listeDiv.appendChild(elementVol);
    });
}

function afficherPageVide() {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = '<p>Sélectionnez un vol ou créez-en un nouveau</p>';
}

async function afficherDetailsVol(idCompagnie, numVol, dateHeureDep) {
    try {
        console.log('Date reçue depuis la liste:', dateHeureDep);
        
        // Créer un objet Date et le formater correctement
        let dateISO;
        if (dateHeureDep.includes('+') || dateHeureDep.endsWith('Z')) {
            // La date a déjà un fuseau horaire
            dateISO = new Date(dateHeureDep).toISOString().replace('.000Z', '+00:00').replace('Z', '+00:00');
        } else {
            // Ajouter explicitement le fuseau horaire UTC
            dateISO = dateHeureDep + '+00:00';
        }
        
        console.log('Date formatée pour l\'API:', dateISO);
        
        const dateEncodee = encodeURIComponent(dateISO);
        console.log('URL complète:', `${API_URL_vol}/${idCompagnie}/${encodeURIComponent(numVol)}/${dateEncodee}`);
        
        const reponse = await fetch(`${API_URL_vol}/${idCompagnie}/${encodeURIComponent(numVol)}/${dateEncodee}`);
        
        if (!reponse.ok) {
            console.error('Erreur HTTP:', reponse.status, reponse.statusText);
            throw new Error(`Erreur ${reponse.status}`);
        }
        
        const vol = await reponse.json();
        
        volActuel = { idCompagnie, numVol, dateHeureDep: dateISO };
        
        afficherFormulaireVol(vol);
    } catch(error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement du vol. Vérifiez la console pour plus de détails.');
    }
}

function afficherFormulaireVol(vol) {
    const divDroite = document.getElementById('details-droite');
    
    const optionsCompagnies = compagnies.map(compagnie => {
        const compagnieId = compagnie.uri.split('/').pop();
        const selected = vol && vol.idCompagnie == compagnieId ? 'selected' : '';
        return `<option value="${compagnieId}" ${selected}>${compagnie.nomCompagnie}</option>`;
    }).join('');
    
    const optionsAeroports = aeroports.map(aeroport => {
        const aeroportId = aeroport.uri.split('/').pop();
        return `<option value="${aeroportId}">${aeroport.nomAeroport}</option>`;
    }).join('');
    
    // Formater les dates pour l'input datetime-local
    const formatDateTimeLocal = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    divDroite.innerHTML = `
        <h2>${vol ? 'Modifier le vol' : 'Créer un vol'}</h2>
        <div class="form-group">
            <label>Compagnie</label>
            <select id="idCompagnie" ${vol ? 'disabled' : ''}>
                <option value="">-- Sélectionner une compagnie --</option>
                ${optionsCompagnies}
            </select>
        </div>
        <div class="form-group">
            <label>Numéro de vol</label>
            <input type="text" id="numVol" value="${vol ? vol.numVol : ''}" ${vol ? 'disabled' : ''} />
        </div>
        <div class="form-group">
            <label>Date et heure de départ</label>
            <input type="datetime-local" id="dateHeureDep" value="${formatDateTimeLocal(vol?.dateHeureDep)}" ${vol ? 'disabled' : ''} />
        </div>
        <div class="form-group">
            <label>Date et heure d'arrivée</label>
            <input type="datetime-local" id="dateHeureArr" value="${formatDateTimeLocal(vol?.dateHeureArr)}" />
        </div>
        <div class="form-group">
            <label>Aéroport de départ</label>
            <select id="idAeroportDep">
                <option value="">-- Sélectionner un aéroport --</option>
                ${optionsAeroports}
            </select>
        </div>
        <div class="form-group">
            <label>Terminal de départ</label>
            <select id="numTerminalDep">
                <option value="">-- Sélectionner d'abord un aéroport --</option>
            </select>
        </div>
        <div class="form-group">
            <label>Aéroport d'arrivée</label>
            <select id="idAeroportArr">
                <option value="">-- Sélectionner un aéroport --</option>
                ${optionsAeroports}
            </select>
        </div>
        <div class="form-group">
            <label>Terminal d'arrivée</label>
            <select id="numTerminalArr">
                <option value="">-- Sélectionner d'abord un aéroport --</option>
            </select>
        </div>
        <div class="button-group">
            <button class="btn-save" id="btn-sauvegarder">${vol ? 'Modifier' : 'Créer'}</button>
            ${vol ? '<button class="btn-delete" id="btn-supprimer">Supprimer</button>' : ''}
            <button class="btn-cancel" id="btn-annuler">Annuler</button>
        </div>
    `;
    
    // Fonction pour mettre à jour les terminaux selon l'aéroport
    const mettreAJourTerminaux = (idAeroport, selectTerminal, terminalSelectionne = null) => {
        const terminauxFiltres = terminaux.filter(t => t.idAeroport == idAeroport);
        selectTerminal.innerHTML = '<option value="">-- Sélectionner un terminal --</option>';
        terminauxFiltres.forEach(terminal => {
            const option = document.createElement('option');
            option.value = terminal.numTerminal;
            option.textContent = `Terminal ${terminal.numTerminal}`;
            if (terminalSelectionne && terminal.numTerminal === terminalSelectionne) {
                option.selected = true;
            }
            selectTerminal.appendChild(option);
        });
    };
    
    // Ajouter les event listeners pour les changements d'aéroport
    const selectAeroportDep = document.getElementById('idAeroportDep');
    const selectTerminalDep = document.getElementById('numTerminalDep');
    const selectAeroportArr = document.getElementById('idAeroportArr');
    const selectTerminalArr = document.getElementById('numTerminalArr');
    
    selectAeroportDep.addEventListener('change', (e) => {
        mettreAJourTerminaux(e.target.value, selectTerminalDep);
    });
    
    selectAeroportArr.addEventListener('change', (e) => {
        mettreAJourTerminaux(e.target.value, selectTerminalArr);
    });
    
    // Pré-remplir les sélections pour la modification
    if (vol) {
        selectAeroportDep.value = vol.idAeroportDep;
        selectAeroportArr.value = vol.idAeroportArr;
        
        // Charger les terminaux après avoir sélectionné les aéroports
        setTimeout(() => {
            mettreAJourTerminaux(vol.idAeroportDep, selectTerminalDep, vol.numTerminalDep);
            mettreAJourTerminaux(vol.idAeroportArr, selectTerminalArr, vol.numTerminalArr);
        }, 0);
    }
    
    document.getElementById('btn-sauvegarder').addEventListener('click', sauvegarderVol);
    if (vol) {
        document.getElementById('btn-supprimer').addEventListener('click', supprimerVol);
    }
    document.getElementById('btn-annuler').addEventListener('click', annulerVol);
}

async function creerNouveauVol() {
    volActuel = null;
    afficherFormulaireVol(null);
}

async function sauvegarderVol() {
    const idCompagnie = document.getElementById('idCompagnie').value;
    const numVol = document.getElementById('numVol').value;
    const dateHeureDep = document.getElementById('dateHeureDep').value;
    const dateHeureArr = document.getElementById('dateHeureArr').value;
    const idAeroportDep = document.getElementById('idAeroportDep').value;
    const numTerminalDep = document.getElementById('numTerminalDep').value;
    const idAeroportArr = document.getElementById('idAeroportArr').value;
    const numTerminalArr = document.getElementById('numTerminalArr').value;
    
    if (!idCompagnie || !numVol || !dateHeureDep || !dateHeureArr || !idAeroportDep || !numTerminalDep || !idAeroportArr || !numTerminalArr) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    try {
        const body = {
            idCompagnie: parseInt(idCompagnie),
            numVol: numVol,
            dateHeureDep: new Date(dateHeureDep).toISOString(),
            dateHeureArr: new Date(dateHeureArr).toISOString(),
            idAeroportDep: parseInt(idAeroportDep),
            numTerminalDep: numTerminalDep,
            idAeroportArr: parseInt(idAeroportArr),
            numTerminalArr: numTerminalArr
        };
        
        if (volActuel) {
            // Modifier un vol existant
            await fetch(`${API_URL_vol}/${volActuel.idCompagnie}/${encodeURIComponent(volActuel.numVol)}/${encodeURIComponent(volActuel.dateHeureDep)}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
        } else {
            // Créer un nouveau vol
            await fetch(API_URL_vol, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
        }
        recupererVols();
    } catch(error) {
        console.error('Erreur:', error);
    }
}

async function supprimerVol() {
    if (!volActuel) return;
    
    try {
        await fetch(`${API_URL_vol}/${volActuel.idCompagnie}/${encodeURIComponent(volActuel.numVol)}/${encodeURIComponent(volActuel.dateHeureDep)}`, {
            method: 'DELETE'
        });
        volActuel = null;
        recupererVols();
    } catch(error) {
        console.error('Erreur:', error);
    }
}

function annulerVol() {
    volActuel = null;
    afficherPageVide();
}