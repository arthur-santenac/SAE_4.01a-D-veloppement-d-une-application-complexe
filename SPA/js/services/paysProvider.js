import { API_URL } from "../config.js";

const API_URL_PAYS = `${API_URL}pays`;

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

export async function getPaysList() {
    const reponse = await fetch(API_URL_PAYS);
    return handleResponse(reponse);
}

export async function getPays(codePays) {
    const reponse = await fetch(`${API_URL_PAYS}/${codePays}`);
    return handleResponse(reponse);
}

export async function createPays(payload) {
    const reponse = await fetch(API_URL_PAYS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function updatePays(codePays, payload) {
    const reponse = await fetch(`${API_URL_PAYS}/${codePays}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function deletePays(codePays) {
    const reponse = await fetch(`${API_URL_PAYS}/${codePays}`, {
        method: "DELETE"
    });
    return handleResponse(reponse);
}
