SELECT v.numVol,p.fonction,COUNT(*) AS nb_personnes 
FROM VOL v, TABLE(v.personnel) p
GROUP BY v.numVol, p.fonction
ORDER BY v.numVol, p.fonction;

SELECT p.nomP AS pilote, COUNT(DISTINCT v.numVol) AS nb_vols 
FROM VOL v, TABLE(v.personnel) p
WHERE LOWER(p.fonction) = 'pilote'
GROUP BY p.nomP
ORDER BY p.nomP;

SELECT v.numVol, q.QualiteType, (q.poidsActuel * q.poids) AS impact 
FROM VOL v, TABLE(v.qualite) q
ORDER BY v.numVol, q.QualiteType;

SELECT q.QualiteType, AVG(q.poidsActuel * q.poids) AS impact_moyen 
FROM VOL v, TABLE(v.qualite) q
GROUP BY q.QualiteType
ORDER BY q.QualiteType;