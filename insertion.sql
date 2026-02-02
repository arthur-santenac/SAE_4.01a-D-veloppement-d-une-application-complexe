INSERT INTO COMPAGNIE (idCompagnie, nomCompagnie) VALUES ('AF', 'Air France');

INSERT INTO PAYS (codePays, nomPays) VALUES ('FR', 'France');
INSERT INTO PAYS (codePays, nomPays) VALUES ('BR', 'Brésil');

INSERT INTO VILLE (nomVille, codePays) VALUES ('Paris', 'FR');
INSERT INTO VILLE (nomVille, codePays) VALUES ('Rio de Janeiro', 'BR');

INSERT INTO AEROPORT (nomAeroport, idVille) 
VALUES ('Charles de Gaulle', 1);

INSERT INTO AEROPORT (nomAeroport, idVille) 
VALUES ('Antonio Carlos Jobim', 2);

INSERT INTO TERMINAL (idAeroport, numTerminal) VALUES (1, '2E');
INSERT INTO TERMINAL (idAeroport, numTerminal) VALUES (2, '1');

INSERT INTO VOL (idCompagnie, numVol, dateHeureDep, idAeroportDep, numTerminalDep, 
                 dateHeureArr, idAeroportArr, numTerminalArr)
VALUES ('AF', '0442', 
        TO_DATE('10/07/2023 23:30:00', 'DD/MM/YYYY HH24:MI:SS'), 
        1, '2E',
        TO_DATE('11/07/2023 05:30:00', 'DD/MM/YYYY HH24:MI:SS'),
        2, '1');

COMMIT;
