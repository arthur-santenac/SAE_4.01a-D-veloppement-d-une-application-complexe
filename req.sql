SELECT DISTINCT nomVille FROM VILLE WHERE idVille IN
(
    select idville from VOL
    JOIN AEROPORT ON VOL.idAeroportArr = AEROPORT.idAeroport
    WHERE idAeroportDep = 
    (
        SELECT idAeroport FROM AEROPORT
        JOIN VILLE ON AEROPORT.idVille = VILLE.idVille
        WHERE nomVille = 'Paris'
    )
);