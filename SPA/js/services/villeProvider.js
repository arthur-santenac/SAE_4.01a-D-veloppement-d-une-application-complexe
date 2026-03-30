import { API_URL } from "../config.js";

const API_URL_VILLES = `${API_URL}villes`;

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

export async function getVilles() {
    const reponse = await fetch(API_URL_VILLES);
    return handleResponse(reponse);
}

export async function getVille(idVille) {
    const reponse = await fetch(`${API_URL_VILLES}/${idVille}`);
    return handleResponse(reponse);
}

export async function createVille(payload) {
    const reponse = await fetch(API_URL_VILLES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function updateVille(idVille, payload) {
    const reponse = await fetch(`${API_URL_VILLES}/${idVille}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function deleteVille(idVille) {
    const reponse = await fetch(`${API_URL_VILLES}/${idVille}`, {
        method: "DELETE"
    });
    return handleResponse(reponse);
}
