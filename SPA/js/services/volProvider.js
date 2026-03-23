import { API_URL } from "../config.js";

const API_URL_VOLS = `${API_URL}vols`;

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

export async function getVols() {
    const reponse = await fetch(API_URL_VOLS);
    return handleResponse(reponse);
}

export async function getVol(idVol) {
    const reponse = await fetch(`${API_URL_VOLS}/${idVol}`);
    return handleResponse(reponse);
}

export async function createVol(payload) {
    const reponse = await fetch(API_URL_VOLS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function updateVol(idVol, payload) {
    const reponse = await fetch(`${API_URL_VOLS}/${idVol}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function deleteVol(idVol) {
    const reponse = await fetch(`${API_URL_VOLS}/${idVol}`, {
        method: "DELETE"
    });
    return handleResponse(reponse);
}
