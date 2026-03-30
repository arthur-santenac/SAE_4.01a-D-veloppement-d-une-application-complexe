import { API_URL } from "../config.js";

const API_URL_AEROPORTS = `${API_URL}aeroports`;

async function handleResponse(reponse) {
    if (reponse.status === 204) {
        return null;
    }

    const texte = await reponse.text();
    const data = texte ? JSON.parse(texte) : null;

    if (!reponse.ok) {
        const erreur = new Error(`HTTP ${reponse.status}`);
        erreur.status = reponse.status;
        erreur.data = data;
        throw erreur;
    }

    return data;
}

export async function getAeroports() {
    const reponse = await fetch(API_URL_AEROPORTS);
    return handleResponse(reponse);
}

export async function getAeroport(idAeroport) {
    const reponse = await fetch(`${API_URL_AEROPORTS}/${idAeroport}`);
    return handleResponse(reponse);
}

export async function createAeroport(payload) {
    const reponse = await fetch(API_URL_AEROPORTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function updateAeroport(idAeroport, payload) {
    const reponse = await fetch(`${API_URL_AEROPORTS}/${idAeroport}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function deleteAeroport(idAeroport) {
    const reponse = await fetch(`${API_URL_AEROPORTS}/${idAeroport}`, {
        method: "DELETE"
    });
    return handleResponse(reponse);
}
