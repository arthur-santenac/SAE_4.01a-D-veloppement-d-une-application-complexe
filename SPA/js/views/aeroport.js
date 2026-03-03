import { API_URL } from "../config.js";

const API_URL_aeroport = API_URL + "aeroports";

export async function recupererAeroports() {
    try{
        const reponse = await fetch(API_URL_aeroport);
        const donnees = await reponse.json();
        afficherAeroports(donnees);
    }
    catch(error){
        console.error('Erreur:', error);
    }
}

export function afficherAeroports(aeroports) {
    const Div = document.getElementById('app');
    Div.innerHTML = '';
    aeroports.forEach(aeroport => {
        const aeroportId = aeroport.uri.split('/').pop();
        aeroport.idAeroport = parseInt(aeroportId);
        const elementAeroport = document.createElement('div');
        elementAeroport.textContent = aeroport.nomAeroport;
        elementAeroport.onclick = () => editerAeroport(aeroport);
        Div.appendChild(elementAeroport);
    });
}

function editerTache(tache) {
    tacheActuelleId = tache.id;
    const divTacheActuelle = document.getElementById('currenttask');
    divTacheActuelle.innerHTML = `
        <h3>Tâche #${tache.id}</h3>
        <input type="text" id="task-title" value="${tache.title}" />
        <textarea id="task-description">${tache.description}</textarea>
        <input type="checkbox" id="task-done" ${tache.done ? 'checked' : ''} />
        <button id="save-task">Enregistrer</button>`;
    document.getElementById('save-task').onclick = () => modifierTache(tache.id);
}

async function creerTache() {
    try{
        const reponse = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: 'Nouvelle tâche',
                description: '',
                done: false
            })
        });
        const donnees = await reponse.json();
        const tacheCreee = donnees.task;
        tacheCreee.id = parseInt(tacheCreee.uri.split('/').pop());
        recupererTaches();
        editerTache(tacheCreee);
    }
    catch(error){
        console.error('Erreur:', error);
    }
}

async function modifierTache(tacheId) {
    try{
        await fetch(`${API_URL}/${tacheId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: document.getElementById('task-title').value,
                description: document.getElementById('task-description').value,
                done: document.getElementById('task-done').checked
            })
        });
        recupererTaches();
    }
    catch(error){
        console.error('Erreur:', error);
    }
}

async function supprimerTache() {
    if (!tacheActuelleId) return;
    try{
        await fetch(`${API_URL}/${tacheActuelleId}`, {method: 'DELETE'});
        document.getElementById('currenttask').innerHTML = '';
        tacheActuelleId = null;
        recupererTaches();
    }
    catch(error){
        console.error('Erreur:', error);
    }
}