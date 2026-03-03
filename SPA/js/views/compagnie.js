import { API_URL } from "../config.js";

const API_URL_aeroport = API_URL + "aeroport/";

export async function recupererCompagnies() {
    try{
        const reponse = await fetch(API_URL_aeroport);
        const donnees = await reponse.json();
        afficherAeroports(donnees.aeroports);
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