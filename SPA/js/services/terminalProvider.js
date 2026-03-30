import { API_URL } from "../config.js";

const API_URL_TERMINAUX = `${API_URL}terminaux`;

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

export async function getTerminaux() {
    const reponse = await fetch(API_URL_TERMINAUX);
    return handleResponse(reponse);
}

export async function getTerminal(idAeroport, numTerminal) {
    const reponse = await fetch(`${API_URL_TERMINAUX}/${idAeroport}/${encodeURIComponent(numTerminal)}`);
    return handleResponse(reponse);
}

export async function createTerminal(payload) {
    const reponse = await fetch(API_URL_TERMINAUX, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function updateTerminal(idAeroport, numTerminal, payload) {
    const reponse = await fetch(`${API_URL_TERMINAUX}/${idAeroport}/${encodeURIComponent(numTerminal)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function deleteTerminal(idAeroport, numTerminal) {
    const reponse = await fetch(`${API_URL_TERMINAUX}/${idAeroport}/${encodeURIComponent(numTerminal)}`, {
        method: "DELETE"
    });
    return handleResponse(reponse);
}
