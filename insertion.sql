INSERT INTO COMPAGNIE (idCompagnie, nomCompagnie) VALUES ('AF', 'Air France');
INSERT INTO COMPAGNIE (idCompagnie, nomCompagnie) VALUES ('BA', 'British Airways');
INSERT INTO COMPAGNIE (idCompagnie, nomCompagnie) VALUES ('LH', 'Lufthansa');
INSERT INTO COMPAGNIE (idCompagnie, nomCompagnie) VALUES ('DL', 'Delta Airlines');

INSERT INTO PAYS (codePays, nomPays) VALUES ('FR', 'France');
INSERT INTO PAYS (codePays, nomPays) VALUES ('BR', 'Brésil');
INSERT INTO PAYS (codePays, nomPays) VALUES ('US', 'États-Unis');
INSERT INTO PAYS (codePays, nomPays) VALUES ('DE', 'Allemagne');
INSERT INTO PAYS (codePays, nomPays) VALUES ('IT', 'Italie');

INSERT INTO VILLE (nomVille, codePays) VALUES ('Paris', 'FR');
INSERT INTO VILLE (nomVille, codePays) VALUES ('Rio de Janeiro', 'BR');
INSERT INTO VILLE (nomVille, codePays) VALUES ('New York', 'US');
INSERT INTO VILLE (nomVille, codePays) VALUES ('Berlin', 'DE');
INSERT INTO VILLE (nomVille, codePays) VALUES ('Rome', 'IT');

INSERT INTO AEROPORT (nomAeroport, idVille) VALUES ('Charles de Gaulle', 1);
INSERT INTO AEROPORT (nomAeroport, idVille) VALUES ('Antonio Carlos Jobim', 2);
INSERT INTO AEROPORT (nomAeroport, idVille) VALUES ('John F. Kennedy', 3);
INSERT INTO AEROPORT (nomAeroport, idVille) VALUES ('Berlin Brandenburg', 4);
INSERT INTO AEROPORT (nomAeroport, idVille) VALUES ('Leonardo da Vinci', 5);

INSERT INTO TERMINAL (idAeroport, numTerminal) VALUES (1, '2E');
INSERT INTO TERMINAL (idAeroport, numTerminal) VALUES (2, '1');
INSERT INTO TERMINAL (idAeroport, numTerminal) VALUES (3, 'A');
INSERT INTO TERMINAL (idAeroport, numTerminal) VALUES (4, 'B');
INSERT INTO TERMINAL (idAeroport, numTerminal) VALUES (5, 'C');

INSERT INTO VOL (idCompagnie, numVol, dateHeureDep, idAeroportDep, numTerminalDep, 
                 dateHeureArr, idAeroportArr, numTerminalArr)
VALUES ('AF', '0442', 
        TO_DATE('10/07/2023 23:30:00', 'DD/MM/YYYY HH24:MI:SS'), 
        1, '2E',
        TO_DATE('11/07/2023 05:30:00', 'DD/MM/YYYY HH24:MI:SS'),
        2, '1');

INSERT INTO VOL (idCompagnie, numVol, dateHeureDep, idAeroportDep, numTerminalDep, 
                 dateHeureArr, idAeroportArr, numTerminalArr)
VALUES ('BA', '1234', 
        TO_DATE('10/07/2023 20:00:00', 'DD/MM/YYYY HH24:MI:SS'), 
        1, '2E',
        TO_DATE('11/07/2023 04:00:00', 'DD/MM/YYYY HH24:MI:SS'),
        3, 'A');

INSERT INTO VOL (idCompagnie, numVol, dateHeureDep, idAeroportDep, numTerminalDep, 
                 dateHeureArr, idAeroportArr, numTerminalArr)
VALUES ('LH', '5678', 
        TO_DATE('10/07/2023 22:00:00', 'DD/MM/YYYY HH24:MI:SS'), 
        1, '2E',
        TO_DATE('11/07/2023 06:00:00', 'DD/MM/YYYY HH24:MI:SS'),
        4, 'B');

INSERT INTO VOL (idCompagnie, numVol, dateHeureDep, idAeroportDep, numTerminalDep, 
                 dateHeureArr, idAeroportArr, numTerminalArr)
VALUES ('DL', '9101', 
        TO_DATE('10/07/2023 21:00:00', 'DD/MM/YYYY HH24:MI:SS'), 
        1, '2E',
        TO_DATE('11/07/2023 05:30:00', 'DD/MM/YYYY HH24:MI:SS'),
        3, 'A');

COMMIT;
