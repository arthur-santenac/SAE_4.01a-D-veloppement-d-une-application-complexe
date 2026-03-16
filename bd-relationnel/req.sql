set LINESIZE 500;

SELECT DISTINCT vi_arr.nomVille
FROM VOL v
JOIN AEROPORT a_dep ON v.idAeroportDep = a_dep.idAeroport
JOIN VILLE vi_dep ON a_dep.idVille = vi_dep.idVille
JOIN AEROPORT a_arr ON v.idAeroportArr = a_arr.idAeroport 
JOIN VILLE vi_arr ON a_arr.idVille = vi_arr.idVille
WHERE vi_dep.nomVille = 'Paris';


SELECT DISTINCT vi_arr2.nomVille
FROM VOL v1
JOIN AEROPORT a_dep1 ON v1.idAeroportDep = a_dep1.idAeroport
JOIN VILLE vi_dep1 ON a_dep1.idVille = vi_dep1.idVille
JOIN VOL v2 ON v1.idAeroportArr = v2.idAeroportDep
JOIN AEROPORT a_arr2 ON v2.idAeroportArr = a_arr2.idAeroport
JOIN VILLE vi_arr2 ON a_arr2.idVille = vi_arr2.idVille
WHERE vi_dep1.nomVille = 'Paris'
  AND v1.dateHeureArr <= v2.dateHeureDep;


SELECT DISTINCT vi_arr3.nomVille
FROM VOL v1
JOIN AEROPORT a_dep1 ON v1.idAeroportDep = a_dep1.idAeroport
JOIN VILLE vi_dep1 ON a_dep1.idVille = vi_dep1.idVille
JOIN VOL v2 ON v1.idAeroportArr = v2.idAeroportDep
JOIN VOL v3 ON v2.idAeroportArr = v3.idAeroportDep
JOIN AEROPORT a_arr3 ON v3.idAeroportArr = a_arr3.idAeroport
JOIN VILLE vi_arr3 ON a_arr3.idVille = vi_arr3.idVille
WHERE vi_dep1.nomVille = 'Paris'
  AND v1.dateHeureArr <= v2.dateHeureDep
  AND v2.dateHeureArr <= v3.dateHeureDep;

WITH VolsAccessibles (idAeroportArr, dateHeureArr) AS (
  SELECT v.idAeroportArr, v.dateHeureArr
  FROM VOL v
  JOIN AEROPORT a_dep ON v.idAeroportDep = a_dep.idAeroport
  JOIN VILLE vi_dep ON a_dep.idVille = vi_dep.idVille
  WHERE vi_dep.nomVille = 'Paris'
  UNION ALL
  SELECT v_suiv.idAeroportArr, v_suiv.dateHeureArr
  FROM VolsAccessibles va
  JOIN VOL v_suiv ON va.idAeroportArr = v_suiv.idAeroportDep
  WHERE va.dateHeureArr <= v_suiv.dateHeureDep
)
SELECT DISTINCT vi_arr.nomVille
FROM VolsAccessibles va
JOIN AEROPORT a_arr ON va.idAeroportArr = a_arr.idAeroport
JOIN VILLE vi_arr ON a_arr.idVille = vi_arr.idVille;