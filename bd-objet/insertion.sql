insert into VOL values(
        1,
        'CDG',
        to_date('2024-07-01 10:00', 'YYYY-MM-DD HH24:MI'),
        'JFK',
        to_date('2024-07-01 13:00', 'YYYY-MM-DD HH24:MI'),
        personnelList(Personnel('Michel','eboueur'),
                     Personnel('Arthur','Chomage')),
        qualiteList(Qualite('beau',2,5),
                    Qualite('securite',7,5),
                    Qualite('technique',5,4))
);
/

insert into VOL values(
        2,
        'JFK',
        to_date('2024-07-01 15:00', 'YYYY-MM-DD HH24:MI'),
        'LAX',
        to_date('2024-07-01 18:00', 'YYYY-MM-DD HH24:MI'),
        personnelList(Personnel('Jean','pilote'),
                     Personnel('Marie','hotesse')),
        qualiteList(Qualite('confort',3,4),
                    Qualite('ponctualite',6,7))
);
/

insert into VOL values(
        3,
        'CDG',
        to_date('2024-07-02 09:00', 'YYYY-MM-DD HH24:MI'),
        'LAX',
        to_date('2024-07-02 12:00', 'YYYY-MM-DD HH24:MI'),
        personnelList(Personnel('Pierre','copilote'),
                     Personnel('Sophie','steward'),
                     Personnel('Luc','mecanicien')),
        qualiteList(Qualite('service',4,5),
                    Qualite('proprete',5,6),
                    Qualite('wifi',2,3))
);
/

COMMIT;
/