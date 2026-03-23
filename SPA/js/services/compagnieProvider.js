import { API_URL } from "../config.js";

const API_URL_COMPAGNIES = `${API_URL}compagnies`;

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

export async function getCompagnies() {
    const reponse = await fetch(API_URL_COMPAGNIES);
    return handleResponse(reponse);
}

export async function getCompagnie(idCompagnie) {
    const reponse = await fetch(`${API_URL_COMPAGNIES}/${idCompagnie}`);
    return handleResponse(reponse);
}

export async function createCompagnie(payload) {
    const reponse = await fetch(API_URL_COMPAGNIES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function updateCompagnie(idCompagnie, payload) {
    const reponse = await fetch(`${API_URL_COMPAGNIES}/${idCompagnie}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return handleResponse(reponse);
}

export async function deleteCompagnie(idCompagnie) {
    const reponse = await fetch(`${API_URL_COMPAGNIES}/${idCompagnie}`, {
        method: "DELETE"
    });
    return handleResponse(reponse);
}
