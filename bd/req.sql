select distinct nomVille from VOL v1
join AEROPORT a1 on v1.idAeroportDep = a1.idAeroport
join VILLE vi1 on a1.idVille = vi1.idVille
where vi1.nomVille = 'Paris';

with requeteB (idAeroportArr, dateHeureArr, niveau) as (
    select v.idAeroportArr, v.dateHeureArr, 1 from VOL v
    join AEROPORT a on v.idAeroportDep = a.idAeroport
    join VILLE vi on a.idVille = vi.idVille
    where vi.nomVille = 'Paris'
    union all
    select v.idAeroportArr, v.dateHeureArr, r.niveau + 1 from VOL v
    join requeteB r on v.idAeroportDep = r.idAeroportArr
    where v.dateHeureDep > r.dateHeureArr
    and r.niveau < 2
)

select distinct vi.nomVille from requeteB r
join AEROPORT a on r.idAeroportArr = a.idAeroport
join VILLE vi on a.idVille = vi.idVille
where r.niveau = 2;
