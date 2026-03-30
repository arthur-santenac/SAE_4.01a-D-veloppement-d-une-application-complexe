from .extensions import db
from .models import Compagnie, Pays, Ville, Aeroport, Terminal, Vol
from .myapp import app
from datetime import datetime

@app.cli.command()
def syncdb():
    db.drop_all()
    db.create_all()
    
    # Insertion des compagnies
    comp1 = Compagnie(nomCompagnie='Air France')
    comp2 = Compagnie(nomCompagnie='British Airways')
    comp3 = Compagnie(nomCompagnie='Lufthansa')
    comp4 = Compagnie(nomCompagnie='Delta Airlines')
    
    # Insertion des pays
    pays1 = Pays(nomPays='France')
    pays2 = Pays(nomPays='Brésil')
    pays3 = Pays(nomPays='États-Unis')
    pays4 = Pays(nomPays='Allemagne')
    pays5 = Pays(nomPays='Italie')
    
    db.session.add_all([comp1, comp2, comp3, comp4])
    db.session.add_all([pays1, pays2, pays3, pays4, pays5])
    db.session.commit()
    
    # Insertion des villes
    ville1 = Ville(nomVille='Paris', codePays=pays1.codePays)
    ville2 = Ville(nomVille='Rio de Janeiro', codePays=pays2.codePays)
    ville3 = Ville(nomVille='New York', codePays=pays3.codePays)
    ville4 = Ville(nomVille='Berlin', codePays=pays4.codePays)
    ville5 = Ville(nomVille='Rome', codePays=pays5.codePays)
    
    db.session.add_all([ville1, ville2, ville3, ville4, ville5])
    db.session.commit()
    
    # Insertion des aéroports
    aero1 = Aeroport(nomAeroport='Charles de Gaulle', idVille=ville1.idVille, latitude=49.0097, longitude=2.5479)
    aero2 = Aeroport(nomAeroport='Antonio Carlos Jobim', idVille=ville2.idVille, latitude=-22.8089, longitude=-43.2436)
    aero3 = Aeroport(nomAeroport='John F. Kennedy', idVille=ville3.idVille, latitude=40.6413, longitude=-73.7781)
    aero4 = Aeroport(nomAeroport='Berlin Brandenburg', idVille=ville4.idVille, latitude=52.3667, longitude=13.5033)
    aero5 = Aeroport(nomAeroport='Leonardo da Vinci', idVille=ville5.idVille, latitude=41.8003, longitude=12.2389)
    
    db.session.add_all([aero1, aero2, aero3, aero4, aero5])
    db.session.commit()
    
    # Insertion des terminaux
    term1 = Terminal(idAeroport=aero1.idAeroport, numTerminal='2E')
    term2 = Terminal(idAeroport=aero2.idAeroport, numTerminal='1')
    term3 = Terminal(idAeroport=aero3.idAeroport, numTerminal='A')
    term4 = Terminal(idAeroport=aero4.idAeroport, numTerminal='B')
    term5 = Terminal(idAeroport=aero5.idAeroport, numTerminal='C')
    
    db.session.add_all([term1, term2, term3, term4, term5])
    db.session.commit()
    
    # Insertion des vols
    vols = [
        Vol(
            idCompagnie=comp1.idCompagnie, numVol='AF001',
            dateHeureDep=datetime(2026, 3, 29, 8, 30, 0),
            dateHeureArr=datetime(2026, 3, 29, 11, 30, 0),
            idAeroportDep=aero1.idAeroport, numTerminalDep='2E',
            idAeroportArr=aero5.idAeroport, numTerminalArr='C'
        ),
        Vol(
            idCompagnie=comp2.idCompagnie, numVol='BA123',
            dateHeureDep=datetime(2026, 3, 30, 10, 0, 0),
            dateHeureArr=datetime(2026, 3, 30, 14, 0, 0),
            idAeroportDep=aero3.idAeroport, numTerminalDep='A',
            idAeroportArr=aero1.idAeroport, numTerminalArr='2E'
        ),
        Vol(
            idCompagnie=comp3.idCompagnie, numVol='LH456',
            dateHeureDep=datetime(2026, 4, 1, 14, 15, 0),
            dateHeureArr=datetime(2026, 4, 1, 16, 45, 0),
            idAeroportDep=aero4.idAeroport, numTerminalDep='B',
            idAeroportArr=aero5.idAeroport, numTerminalArr='C'
        ),
        Vol(
            idCompagnie=comp4.idCompagnie, numVol='DL789',
            dateHeureDep=datetime(2026, 4, 3, 16, 45, 0),
            dateHeureArr=datetime(2026, 4, 4, 6, 30, 0),
            idAeroportDep=aero1.idAeroport, numTerminalDep='2E',
            idAeroportArr=aero3.idAeroport, numTerminalArr='A'
        ),
        Vol(
            idCompagnie=comp1.idCompagnie, numVol='AF002',
            dateHeureDep=datetime(2026, 4, 5, 22, 0, 0),
            dateHeureArr=datetime(2026, 4, 6, 8, 0, 0),
            idAeroportDep=aero2.idAeroport, numTerminalDep='1',
            idAeroportArr=aero1.idAeroport, numTerminalArr='2E'
        ),
        Vol(
            idCompagnie=comp2.idCompagnie, numVol='BA124',
            dateHeureDep=datetime(2026, 4, 7, 9, 0, 0),
            dateHeureArr=datetime(2026, 4, 7, 11, 30, 0),
            idAeroportDep=aero1.idAeroport, numTerminalDep='2E',
            idAeroportArr=aero4.idAeroport, numTerminalArr='B'
        ),
        Vol(
            idCompagnie=comp3.idCompagnie, numVol='LH457',
            dateHeureDep=datetime(2026, 4, 9, 13, 10, 0),
            dateHeureArr=datetime(2026, 4, 9, 23, 50, 0),
            idAeroportDep=aero4.idAeroport, numTerminalDep='B',
            idAeroportArr=aero2.idAeroport, numTerminalArr='1'
        ),
        Vol(
            idCompagnie=comp4.idCompagnie, numVol='DL790',
            dateHeureDep=datetime(2026, 4, 11, 7, 0, 0),
            dateHeureArr=datetime(2026, 4, 11, 15, 0, 0),
            idAeroportDep=aero3.idAeroport, numTerminalDep='A',
            idAeroportArr=aero4.idAeroport, numTerminalArr='B'
        ),
        Vol(
            idCompagnie=comp1.idCompagnie, numVol='AF003',
            dateHeureDep=datetime(2026, 4, 13, 18, 30, 0),
            dateHeureArr=datetime(2026, 4, 14, 5, 45, 0),
            idAeroportDep=aero1.idAeroport, numTerminalDep='2E',
            idAeroportArr=aero2.idAeroport, numTerminalArr='1'
        ),
        Vol(
            idCompagnie=comp1.idCompagnie, numVol='AF004',
            dateHeureDep=datetime(2026, 4, 15, 10, 0, 0),
            dateHeureArr=datetime(2026, 4, 15, 12, 10, 0),
            idAeroportDep=aero5.idAeroport, numTerminalDep='C',
            idAeroportArr=aero1.idAeroport, numTerminalArr='2E'
        )
    ]
    
    db.session.add_all(vols)
    db.session.commit()