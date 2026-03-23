import {
    createVol,
    deleteVol,
    getVol,
    getVols,
    updateVol
} from "../services/volProvider.js";
import { getCompagnies } from "../services/compagnieProvider.js";
import { getAeroports } from "../services/aeroportProvider.js";
import { getTerminaux } from "../services/terminalProvider.js";

let volActuel = null;
let compagnies = [];
let aeroports = [];
let terminaux = [];

export async function recupererVols() {
    try{
        compagnies = await getCompagnies();
        aeroports = await getAeroports();
        terminaux = await getTerminaux();
        const donnees = await getVols();
        
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
        const volId = vol.idVol ?? (vol.uri ? parseInt(vol.uri.split('/').pop(), 10) : null);
        const elementVol = document.createElement('div');
        elementVol.className = 'item-liste';
        elementVol.textContent = `Vol ${vol.numVol}`;
        elementVol.addEventListener('click', () => afficherDetailsVol(volId));
        listeDiv.appendChild(elementVol);
    });
}

function afficherPageVide() {
    const divDroite = document.getElementById('details-droite');
    divDroite.innerHTML = '<p>Sélectionnez un vol ou créez-en un nouveau</p>';
}

async function afficherDetailsVol(idVol) {
    try {
        if (!idVol) {
            alert('Impossible de charger ce vol: identifiant manquant. Rechargez la liste des vols.');
            return;
        }
        const vol = await getVol(idVol);
        volActuel = vol;
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
    const extraireDateEtHeure = (dateStr) => {
        if (!dateStr) return { date: '', heure: '' };

        const normalisee = String(dateStr).replace(' ', 'T');
        const matchIso = normalisee.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
        if (matchIso) {
            return { date: matchIso[1], heure: matchIso[2] };
        }

        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) {
            return { date: '', heure: '' };
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return {
            date: `${year}-${month}-${day}`,
            heure: `${hours}:${minutes}`
        };
    };

    const dep = extraireDateEtHeure(vol?.dateHeureDep);
    const arr = extraireDateEtHeure(vol?.dateHeureArr);
    divDroite.innerHTML = `
        <h2>${vol ? 'Modifier le vol' : 'Créer un vol'}</h2>
        <div class="form-group">
            <label>Compagnie</label>
            <select id="idCompagnie">
                <option value="">-- Sélectionner une compagnie --</option>
                ${optionsCompagnies}
            </select>
        </div>
        <div class="form-group">
            <label>Numéro de vol</label>
            <input type="text" id="numVol" value="${vol ? vol.numVol : ''}" />
        </div>
        <div class="form-row form-row-datetime">
            <div class="form-group">
                <label>Date de départ</label>
                <input type="date" id="dateDep" value="${dep.date}" />
            </div>
            <div class="form-group">
                <label>Heure de départ</label>
                <input type="time" id="heureDep" value="${dep.heure}" step="60" />
            </div>
        </div>
        <div class="form-row form-row-datetime">
            <div class="form-group">
                <label>Date d'arrivée</label>
                <input type="date" id="dateArr" value="${arr.date}" />
            </div>
            <div class="form-group">
                <label>Heure d'arrivée</label>
                <input type="time" id="heureArr" value="${arr.heure}" step="60" />
            </div>
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
    if (vol) {
        selectAeroportDep.value = vol.idAeroportDep;
        selectAeroportArr.value = vol.idAeroportArr;
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
    const construireDateTimePourApi = (datePart, heurePart) => {
        if (!datePart || !heurePart) return '';
        return `${datePart}T${heurePart}:00`;
    };

    const idCompagnie = document.getElementById('idCompagnie').value;
    const numVol = document.getElementById('numVol').value;
    const dateDep = document.getElementById('dateDep').value;
    const heureDep = document.getElementById('heureDep').value;
    const dateArr = document.getElementById('dateArr').value;
    const heureArr = document.getElementById('heureArr').value;
    const dateHeureDep = construireDateTimePourApi(dateDep, heureDep);
    const dateHeureArr = construireDateTimePourApi(dateArr, heureArr);
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
            dateHeureDep: dateHeureDep,
            dateHeureArr: dateHeureArr,
            idAeroportDep: parseInt(idAeroportDep),
            numTerminalDep: numTerminalDep,
            idAeroportArr: parseInt(idAeroportArr),
            numTerminalArr: numTerminalArr
        };
        if (volActuel){
            await updateVol(volActuel.idVol, body);
        }
        else{
            await createVol(body);
        }
        recupererVols();
    } catch(error) {
        if (error.status) {
            const message = volActuel
                ? 'Modification impossible pour ce vol'
                : 'Creation impossible : ce vol existe deja.';
            alert(message);
            return;
        }
        console.error('Erreur:', error);
    }
}

async function supprimerVol() {
    if (!volActuel) return;
    try {
        await deleteVol(volActuel.idVol);
        volActuel = null;
        recupererVols();
    } catch(error) {
        if (error.status) {
            alert('Suppression impossible pour ce vol.');
            return;
        }
        console.error('Erreur:', error);
    }
}

function annulerVol() {
    volActuel = null;
    afficherPageVide();
}