# 1 : Modélisation de la base de donnée en modèle graphe.

    (:Compagnie) : id, nom
    (:Pays) : code, nom
    (:Ville) : id, nom
    (:Aeroport) : id, nom
    (:Terminal) : idAeroport, numTerminal
    (:Vol) : numVol, dateHeureDep, dateHeureArr

    (:Ville)-[:SITUE_DANS]->(:Pays)
    (:Aeroport)-[:DESSERT]->(:Ville)
    (:Terminal)-[:APPARTIENT_A]->(:Aeroport)
    (:Vol)-[:OPERE_PAR]->(:Compagnie)
    (:Vol)-[:PART_DE]->(:Terminal)
    (:Vol)-[:ARRIVE_A]->(:Terminal)

# 2 : Code pour implémenter la base de donnée en Neo4J

    CREATE (cAF:Compagnie {id: 'AF', nom: 'Air France'})
    CREATE (cBA:Compagnie {id: 'BA', nom: 'British Airways'})
    CREATE (cLH:Compagnie {id: 'LH', nom: 'Lufthansa'})
    CREATE (cDL:Compagnie {id: 'DL', nom: 'Delta Airlines'})

    CREATE (pFR:Pays {code: 'FR', nom: 'France'})
    CREATE (pBR:Pays {code: 'BR', nom: 'Brésil'})
    CREATE (pUS:Pays {code: 'US', nom: 'États-Unis'})
    CREATE (pDE:Pays {code: 'DE', nom: 'Allemagne'})
    CREATE (pIT:Pays {code: 'IT', nom: 'Italie'})

    CREATE (vPar:Ville {id: '1', nom: 'Paris'})-[:SITUE_DANS]->(pFR)
    CREATE (vRio:Ville {id: '2', nom: 'Rio de Janeiro'})-[:SITUE_DANS]->(pBR)
    CREATE (vNYC:Ville {id: '3', nom: 'New York'})-[:SITUE_DANS]->(pUS)
    CREATE (vBer:Ville {id: '4', nom: 'Berlin'})-[:SITUE_DANS]->(pDE)
    CREATE (vRom:Ville {id: '5', nom: 'Rome'})-[:SITUE_DANS]->(pIT)

    CREATE (aCDG:Aeroport {id: '1', nom: 'Charles de Gaulle'})-[:DESSERT]->(vPar)
    CREATE (aGIG:Aeroport {id: '2', nom: 'Antonio Carlos Jobim'})-[:DESSERT]->(vRio)
    CREATE (aJFK:Aeroport {id: '3', nom: 'John F. Kennedy'})-[:DESSERT]->(vNYC)
    CREATE (aBER:Aeroport {id: '4', nom: 'Berlin Brandenburg'})-[:DESSERT]->(vBer)
    CREATE (aFCO:Aeroport {id: '5', nom: 'Leonardo da Vinci'})-[:DESSERT]->(vRom)

    CREATE (tCDG_2E:Terminal {idAeroport: '1', numTerminal: '2E'})-[:APPARTIENT_A]->(aCDG)
    CREATE (tGIG_1:Terminal {idAeroport: '2', numTerminal: '1'})-[:APPARTIENT_A]->(aGIG)
    CREATE (tJFK_A:Terminal {idAeroport: '3', numTerminal: 'A'})-[:APPARTIENT_A]->(aJFK)
    CREATE (tBER_B:Terminal {idAeroport: '4', numTerminal: 'B'})-[:APPARTIENT_A]->(aBER)
    CREATE (tFCO_C:Terminal {idAeroport: '5', numTerminal: 'C'})-[:APPARTIENT_A]->(aFCO)

    CREATE (vAF0442:Vol {numVol: '0442', dateHeureDep: '2023-07-10T23:30:00', dateHeureArr: '2023-07-11T05:30:00'})
    CREATE (vAF0442)-[:OPERE_PAR]->(cAF), (vAF0442)-[:PART_DE]->(tCDG_2E), (vAF0442)-[:ARRIVE_A]->(tGIG_1)

    CREATE (vBA1234:Vol {numVol: '1234', dateHeureDep: '2023-07-10T20:00:00', dateHeureArr: '2023-07-11T04:00:00'})
    CREATE (vBA1234)-[:OPERE_PAR]->(cBA), (vBA1234)-[:PART_DE]->(tCDG_2E), (vBA1234)-[:ARRIVE_A]->(tJFK_A)

    CREATE (vLH5678:Vol {numVol: '5678', dateHeureDep: '2023-07-10T22:00:00', dateHeureArr: '2023-07-11T06:00:00'})
    CREATE (vLH5678)-[:OPERE_PAR]->(cLH), (vLH5678)-[:PART_DE]->(tCDG_2E), (vLH5678)-[:ARRIVE_A]->(tBER_B)

    CREATE (vDL9101:Vol {numVol: '9101', dateHeureDep: '2023-07-10T21:00:00', dateHeureArr: '2023-07-11T05:30:00'})
    CREATE (vDL9101)-[:OPERE_PAR]->(cDL), (vDL9101)-[:PART_DE]->(tCDG_2E), (vDL9101)-[:ARRIVE_A]->(tJFK_A)

    CREATE (vDL9999:Vol {numVol: '9999', dateHeureDep: '2023-07-11T10:00:00', dateHeureArr: '2023-07-11T23:00:00'})
    CREATE (vDL9999)-[:OPERE_PAR]->(cDL), (vDL9999)-[:PART_DE]->(tJFK_A), (vDL9999)-[:ARRIVE_A]->(tFCO_C)

    CREATE (vLH1111:Vol {numVol: '1111', dateHeureDep: '2023-07-11T09:00:00', dateHeureArr: '2023-07-11T11:00:00'})
    CREATE (vLH1111)-[:OPERE_PAR]->(cLH), (vLH1111)-[:PART_DE]->(tBER_B), (vLH1111)-[:ARRIVE_A]->(tFCO_C)

    CREATE (vAF8888:Vol {numVol: '8888', dateHeureDep: '2023-07-11T15:00:00', dateHeureArr: '2023-07-11T22:00:00'})
    CREATE (vAF8888)-[:OPERE_PAR]->(cAF), (vAF8888)-[:PART_DE]->(tFCO_C), (vAF8888)-[:ARRIVE_A]->(tGIG_1)

    CREATE (vDL1001:Vol {numVol: '1001', dateHeureDep: '2023-07-11T10:00:00', dateHeureArr: '2023-07-11T23:00:00'})
    CREATE (vDL1001)-[:OPERE_PAR]->(cDL), (vDL1001)-[:PART_DE]->(tJFK_A), (vDL1001)-[:ARRIVE_A]->(tFCO_C)

    CREATE (vAF2002:Vol {numVol: '2002', dateHeureDep: '2023-07-12T09:00:00', dateHeureArr: '2023-07-12T18:00:00'})
    CREATE (vAF2002)-[:OPERE_PAR]->(cAF), (vAF2002)-[:PART_DE]->(tFCO_C), (vAF2002)-[:ARRIVE_A]->(tGIG_1)

Requête pour récupérer tout les noeuds et les relations :

    MATCH (n)-[r]->(m)
    RETURN n, r, m

![image de la bd](/bd-graphe/images/modele_graphe.png)

# 3 : Requête Cypher

    MATCH p = shortestPath((vDepart:Ville)-[:DESSERT|APPARTIENT_A|PART_DE|ARRIVE_A*]-(vArrivee:Ville))
    WHERE vDepart <> vArrivee
    RETURN vDepart.nom AS VilleDepart, 
        vArrivee.nom AS VilleArrivee, 
        length(p) AS Distance
    ORDER BY VilleDepart
    
![image de la réponse de la requête](/bd-graphe/images/CaptureRequete.png)

| Indice | VilleDepart | VilleArrivee | Distance |
| :---:|:---:|:---:|:---:| 
| 1 | Berlin | Paris | 6 |
| 2 | Berlin | Rio de Janeiro | 8 |
| 3 | Berlin | New York | 8 |
| 4 | Berlin | Rome | 6 |
| 5 | New York | Paris | 6 |
| 6 | New York | Rio de Janeiro | 8 |
| 7 | New York | Berlin | 8 |
| 8 | New York | Rome | 6 |
| 9 | Paris | Rio de Janeiro | 6 |
| 10 | Paris | New York | 6 |
| 11 | Paris | Berlin | 6 |
| 12 | Paris | Rome | 8 |
| 13 | Rio de Janeiro | Paris | 6 |
| 14 | Rio de Janeiro | New York | 8 |
| 15 | Rio de Janeiro | Berlin | 8 |
| 16 | Rio de Janeiro | Rome | 6 |
| 17 | Rome | Paris | 8 |
| 18 | Rome | Rio de Janeiro | 6 |
| 19 | Rome | New York | 6 |
| 20 | Rome | Berlin | 6 |