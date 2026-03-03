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
    aero1 = Aeroport(nomAeroport='Charles de Gaulle', idVille=ville1.idVille)
    aero2 = Aeroport(nomAeroport='Antonio Carlos Jobim', idVille=ville2.idVille)
    aero3 = Aeroport(nomAeroport='John F. Kennedy', idVille=ville3.idVille)
    aero4 = Aeroport(nomAeroport='Berlin Brandenburg', idVille=ville4.idVille)
    aero5 = Aeroport(nomAeroport='Leonardo da Vinci', idVille=ville5.idVille)
    
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
    vol1 = Vol(
        idCompagnie=comp1.idCompagnie, numVol='0442',
        dateHeureDep=datetime(2023, 7, 10, 23, 30, 0),
        dateHeureArr=datetime(2023, 7, 11, 5, 30, 0),
        idAeroportDep=aero1.idAeroport, numTerminalDep='2E',
        idAeroportArr=aero2.idAeroport, numTerminalArr='1'
    )
    
    vol2 = Vol(
        idCompagnie=comp2.idCompagnie, numVol='1234',
        dateHeureDep=datetime(2023, 7, 10, 20, 0, 0),
        dateHeureArr=datetime(2023, 7, 11, 4, 0, 0),
        idAeroportDep=aero1.idAeroport, numTerminalDep='2E',
        idAeroportArr=aero3.idAeroport, numTerminalArr='A'
    )
    
    vol3 = Vol(
        idCompagnie=comp3.idCompagnie, numVol='5678',
        dateHeureDep=datetime(2023, 7, 10, 22, 0, 0),
        dateHeureArr=datetime(2023, 7, 11, 6, 0, 0),
        idAeroportDep=aero1.idAeroport, numTerminalDep='2E',
        idAeroportArr=aero4.idAeroport, numTerminalArr='B'
    )
    
    vol4 = Vol(
        idCompagnie=comp4.idCompagnie, numVol='9101',
        dateHeureDep=datetime(2023, 7, 10, 21, 0, 0),
        dateHeureArr=datetime(2023, 7, 11, 5, 30, 0),
        idAeroportDep=aero1.idAeroport, numTerminalDep='2E',
        idAeroportArr=aero3.idAeroport, numTerminalArr='A'
    )
    
    db.session.add_all([vol1, vol2, vol3, vol4])
    db.session.commit()