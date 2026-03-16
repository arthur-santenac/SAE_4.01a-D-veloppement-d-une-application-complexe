import { API_URL } from './config.js';
import { recupererAeroports } from './views/aeroport.js';
import { recupererCompagnies } from './views/compagnie.js';
import { recupererPays } from './views/pays.js';
import { recupererTerminaux } from './views/terminal.js';
import { recupererVilles } from './views/ville.js';
import { recupererVols } from './views/vol.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('aeroport').onclick = recupererAeroports;
    document.getElementById('compagnie').onclick = recupererCompagnies;
    document.getElementById('pays').onclick = recupererPays;
    document.getElementById('terminal').onclick = recupererTerminaux;
    document.getElementById('ville').onclick = recupererVilles;
    document.getElementById('vol').onclick = recupererVols;
});

API_URL
