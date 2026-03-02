-- Requêtes pour trouver les villes accessibles depuis Paris

-- (a) Villes accessibles par vols directs depuis Paris
SELECT DISTINCT v2.nomVille
FROM VOL v
JOIN TERMINAL t1 ON v.numTerminalDep = t1.numTerminal AND v.idAeroportDep = t1.idAeroport
JOIN AEROPORT a1 ON t1.idAeroport = a1.idAeroport
JOIN TERMINAL t2 ON v.idAeroportArr = t2.idAeroport
JOIN AEROPORT a2 ON t2.idAeroport = a2.idAeroport
JOIN VILLE v1 ON a1.idVille = v1.idVille
JOIN VILLE v2 ON a2.idVille = v2.idVille
WHERE v1.nomVille = 'Paris';

-- (b) Villes accessibles depuis Paris avec UNE correspondance
WITH Vols AS (
    SELECT v2.nomVille AS VilleArrivee, v.dateHeureDep, v.dateHeureArr
    FROM VOL v
    JOIN TERMINAL t1 ON v.numTerminalDep = t1.numTerminal AND v.idAeroportDep = t1.idAeroport
    JOIN AEROPORT a1 ON t1.idAeroport = a1.idAeroport
    JOIN VILLE v1 ON a1.idVille = v1.idVille
    JOIN TERMINAL t2 ON v.idAeroportArr = t2.idAeroport
    JOIN AEROPORT a2 ON t2.idAeroport = a2.idAeroport
    JOIN VILLE v2 ON a2.idVille = v2.idVille
    WHERE v1.nomVille = 'Paris'
),
Correspondances AS (
    SELECT v3.nomVille AS VilleArrivee
    FROM VOL v1
    JOIN TERMINAL t1 ON v1.numTerminalDep = t1.numTerminal AND v1.idAeroportDep = t1.idAeroport
    JOIN AEROPORT a1 ON t1.idAeroport = a1.idAeroport
    JOIN VOL v2 ON v1.idAeroportArr = v2.idAeroportDep
    JOIN TERMINAL t2 ON v2.numTerminalDep = t2.numTerminal AND v2.idAeroportDep = t2.idAeroport
    JOIN AEROPORT a2 ON t2.idAeroport = a2.idAeroport
    JOIN VILLE v3 ON a2.idVille = v3.idVille
    WHERE a1.nomAeroport = 'Charles de Gaulle' AND v1.dateHeureArr < v2.dateHeureDep
)
SELECT DISTINCT VilleArrivee FROM Correspondances;

-- (c) Villes accessibles depuis Paris avec DEUX correspondances
WITH Vols AS (
    SELECT v2.nomVille AS VilleArrivee, v.dateHeureDep, v.dateHeureArr
    FROM VOL v
    JOIN TERMINAL t1 ON v.numTerminalDep = t1.numTerminal AND v.idAeroportDep = t1.idAeroport
    JOIN AEROPORT a1 ON t1.idAeroport = a1.idAeroport
    JOIN VILLE v1 ON a1.idVille = v1.idVille
    JOIN TERMINAL t2 ON v.idAeroportArr = t2.idAeroport
    JOIN AEROPORT a2 ON t2.idAeroport = a2.idAeroport
    JOIN VILLE v2 ON a2.idVille = v2.idVille
    WHERE v1.nomVille = 'Paris'
),
Correspondances AS (
    SELECT v3.nomVille AS VilleArrivee
    FROM VOL v1
    JOIN TERMINAL t1 ON v1.numTerminalDep = t1.numTerminal AND v1.idAeroportDep = t1.idAeroport
    JOIN AEROPORT a1 ON t1.idAeroport = a1.idAeroport
    JOIN VOL v2 ON v1.idAeroportArr = v2.idAeroportDep
    JOIN TERMINAL t2 ON v2.numTerminalDep = t2.numTerminal AND v2.idAeroportDep = t2.idAeroport
    JOIN VOL v3 ON v2.idAeroportArr = v3.idAeroportDep
    JOIN TERMINAL t3 ON v3.numTerminalDep = t3.numTerminal AND v3.idAeroportDep = t3.idAeroport
    JOIN AEROPORT a2 ON t3.idAeroport = a2.idAeroport
    JOIN VILLE v4 ON a2.idVille = v4.idVille
    WHERE a1.nomAeroport = 'Charles de Gaulle' AND v1.dateHeureArr < v2.dateHeureDep AND v2.dateHeureArr < v3.dateHeureDep
)
SELECT DISTINCT VilleArrivee FROM Correspondances;

-- (d) Villes accessibles depuis Paris avec des vols directs ou un nombre quelconque de correspondances
WITH RECURSIVE Accessibles AS (
    -- Base case: Direct flights from Paris
    SELECT v2.nomVille AS VilleArrivee, v.dateHeureDep, v.dateHeureArr, 0 AS Niveau
    FROM VOL v
    JOIN TERMINAL t1 ON v.numTerminalDep = t1.numTerminal AND v.idAeroportDep = t1.idAeroport
    JOIN AEROPORT a1 ON t1.idAeroport = a1.idAeroport
    JOIN VILLE v1 ON a1.idVille = v1.idVille
    JOIN TERMINAL t2 ON v.idAeroportArr = t2.idAeroport
    JOIN AEROPORT a2 ON t2.idAeroport = a2.idAeroport
    JOIN VILLE v2 ON a2.idVille = v2.idVille
    WHERE v1.nomVille = 'Paris'
    
    UNION ALL
    
    -- Recursive case: Flights from previously reachable cities
    SELECT v3.nomVille AS VilleArrivee, v.dateHeureDep, v.dateHeureArr, Niveau + 1
    FROM Accessibles a
    JOIN VOL v ON a.VilleArrivee = v.idAeroportDep
    JOIN TERMINAL t1 ON v.numTerminalDep = t1.numTerminal AND v.idAeroportDep = t1.idAeroport
    JOIN AEROPORT a1 ON t1.idAeroport = a1.idAeroport
    JOIN TERMINAL t2 ON v.idAeroportArr = t2.idAeroport
    JOIN AEROPORT a2 ON t2.idAeroport = a2.idAeroport
    JOIN VILLE v3 ON a2.idVille = v3.idVille
    WHERE a.dateHeureArr < v.dateHeureDep
)
SELECT DISTINCT VilleArrivee FROM Accessibles;