import { recupererAeroports } from './views/aeroport.js';
import { recupererCompagnies } from './views/compagnie.js';
import { recupererPays } from './views/pays.js';
import { recupererTerminaux } from './views/terminal.js';
import { recupererVilles } from './views/ville.js';
import { recupererVols } from './views/vol.js';

const routes = {
    compagnie: recupererCompagnies,
    pays: recupererPays,
    ville: recupererVilles,
    aeroport: recupererAeroports,
    terminal: recupererTerminaux,
    vol: recupererVols
};

const routeParDefaut = 'compagnie';

function getRouteDepuisHash() {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return routes[hash] ? hash : routeParDefaut;
}

function appliquerEtatMenu(routeActive) {
    Object.keys(routes).forEach((route) => {
        const lien = document.getElementById(route);
        if (!lien) return;
        lien.classList.toggle('active', route === routeActive);
    });
}

function naviguerVers(route) {
    if (!routes[route]) return;
    const nouveauHash = `#/${route}`;
    if (window.location.hash === nouveauHash) {
        executerRouteCourante();
        return;
    }
    window.location.hash = `/${route}`;
}

async function executerRouteCourante() {
    const route = getRouteDepuisHash();
    appliquerEtatMenu(route);

    try {
        await routes[route]();
    } catch (error) {
        console.error('Erreur de navigation:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Object.keys(routes).forEach((route) => {
        const lien = document.getElementById(route);
        if (!lien) return;

        lien.setAttribute('href', `#/${route}`);
        lien.addEventListener('click', (event) => {
            event.preventDefault();
            naviguerVers(route);
        });
    });

    if (!window.location.hash) {
        naviguerVers(routeParDefaut);
        return;
    }

    executerRouteCourante();
});

window.addEventListener('hashchange', executerRouteCourante);
