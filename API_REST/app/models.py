from .extensions import db
from sqlalchemy.exc import IntegrityError

class Compagnie(db.Model):
    __tablename__ = "compagnie"
    idCompagnie = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nomCompagnie = db.Column(db.String(50), nullable=False, unique=True)
    vols = db.relationship("Vol", back_populates="compagnie")

class Pays(db.Model):
    __tablename__ = "pays"
    codePays = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nomPays = db.Column(db.String(50), nullable=False, unique=True)
    villes = db.relationship("Ville", back_populates="pays")

class Ville(db.Model):
    __tablename__ = "ville"
    idVille = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nomVille = db.Column(db.String(50), nullable=False, unique=True)
    codePays = db.Column(db.Integer, db.ForeignKey("pays.codePays"), nullable=False)
    pays = db.relationship("Pays", back_populates="villes")
    aeroports = db.relationship("Aeroport", back_populates="ville")

class Aeroport(db.Model):
    __tablename__ = "aeroport"
    idAeroport = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nomAeroport = db.Column(db.String(50), nullable=False, unique=True)
    idVille = db.Column(db.Integer, db.ForeignKey("ville.idVille"), nullable=False)
    ville = db.relationship("Ville", back_populates="aeroports")
    terminaux = db.relationship("Terminal", back_populates="aeroport")

class Terminal(db.Model):
    __tablename__ = "terminal"
    idAeroport = db.Column(db.Integer, db.ForeignKey("aeroport.idAeroport"), primary_key=True)
    numTerminal = db.Column(db.String(10), primary_key=True)
    aeroport = db.relationship("Aeroport", back_populates="terminaux")

class Vol(db.Model):
    __tablename__ = "vol"
    idVol = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idCompagnie = db.Column(db.Integer, db.ForeignKey("compagnie.idCompagnie"), nullable=False)
    numVol = db.Column(db.String(10), nullable=False)
    dateHeureDep = db.Column(db.DateTime, nullable=False)
    dateHeureArr = db.Column(db.DateTime, nullable=False)
    idAeroportDep = db.Column(db.Integer, db.ForeignKey("aeroport.idAeroport"), nullable=False)
    numTerminalDep = db.Column(db.String(10), nullable=False)
    idAeroportArr = db.Column(db.Integer, db.ForeignKey("aeroport.idAeroport"), nullable=False)
    numTerminalArr = db.Column(db.String(10), nullable=False)
    
    __table_args__ = (
        db.ForeignKeyConstraint(
            ["idAeroportDep", "numTerminalDep"],
            ["terminal.idAeroport", "terminal.numTerminal"]
        ),
        db.ForeignKeyConstraint(
            ["idAeroportArr", "numTerminalArr"],
            ["terminal.idAeroport", "terminal.numTerminal"]
        ),
        db.UniqueConstraint("idCompagnie", "numVol", "dateHeureDep", name="unique_vol"),
    )
    
    compagnie = db.relationship("Compagnie", back_populates="vols")
    aeroport_dep = db.relationship("Aeroport", foreign_keys=[idAeroportDep])
    aeroport_arr = db.relationship("Aeroport", foreign_keys=[idAeroportArr])



def get_all_compagnies():
    return Compagnie.query.all()

def get_compagnie(idCompagnie):
    return Compagnie.query.get(idCompagnie)

def create_compagnie(nomCompagnie):
    compagnie = Compagnie(nomCompagnie=nomCompagnie)
    db.session.add(compagnie)
    db.session.commit()
    return compagnie

def modify_compagnie(idCompagnie, nomCompagnie):
    compagnie = Compagnie.query.get(idCompagnie)
    if compagnie is None:
        return None
    compagnie.nomCompagnie = nomCompagnie
    db.session.commit()
    return compagnie

def delete_compagnie(idCompagnie):
    compagnie = Compagnie.query.get(idCompagnie)
    if compagnie:
        db.session.delete(compagnie)
        db.session.commit()



def get_all_pays():
    return Pays.query.all()

def get_pays(codePays):
    return Pays.query.get(codePays)

def create_pays(nomPays):
    pays = Pays(nomPays=nomPays)
    db.session.add(pays)
    db.session.commit()
    return pays

def modify_pays(codePays, nomPays):
    pays = Pays.query.get(codePays)
    if pays is None:
        return None
    pays.nomPays = nomPays
    db.session.commit()
    return pays

def delete_pays(codePays):
    pays = Pays.query.get(codePays)
    if pays:
        db.session.delete(pays)
        db.session.commit()



def get_all_villes():
    return Ville.query.all()

def get_ville(idVille):
    return Ville.query.get(idVille)

def get_villes_by_pays(codePays):
    return Ville.query.filter_by(codePays=codePays).all()

def create_ville(nomVille, codePays):
    ville = Ville(nomVille=nomVille, codePays=codePays)
    db.session.add(ville)
    db.session.commit()
    return ville

def modify_ville(idVille, nomVille, codePays):
    ville = Ville.query.get(idVille)
    if ville is None:
        return None
    ville.nomVille = nomVille
    ville.codePays = codePays
    db.session.commit()
    return ville

def delete_ville(idVille):
    ville = Ville.query.get(idVille)
    if ville:
        db.session.delete(ville)
        db.session.commit()



def get_all_aeroports():
    return Aeroport.query.all()

def get_aeroport(idAeroport):
    return Aeroport.query.get(idAeroport)

def get_aeroports_by_ville(idVille):
    return Aeroport.query.filter_by(idVille=idVille).all()

def create_aeroport(nomAeroport, idVille):
    aeroport = Aeroport(nomAeroport=nomAeroport, idVille=idVille)
    db.session.add(aeroport)
    db.session.commit()
    return aeroport

def modify_aeroport(idAeroport, nomAeroport, idVille):
    aeroport = Aeroport.query.get(idAeroport)
    if aeroport is None:
        return None
    aeroport.nomAeroport = nomAeroport
    aeroport.idVille = idVille
    db.session.commit()
    return aeroport

def delete_aeroport(idAeroport):
    aeroport = Aeroport.query.get(idAeroport)
    if aeroport:
        db.session.delete(aeroport)
        db.session.commit()



def get_all_terminals():
    return Terminal.query.all()

def get_terminal(idAeroport, numTerminal):
    return Terminal.query.get((idAeroport, numTerminal))

def get_terminals_by_aeroport(idAeroport):
    return Terminal.query.filter_by(idAeroport=idAeroport).all()

def create_terminal(idAeroport, numTerminal):
    terminal = Terminal(idAeroport=idAeroport, numTerminal=numTerminal)
    db.session.add(terminal)
    db.session.commit()
    return terminal

def modify_terminal(oldIdAeroport, oldNumTerminal, newIdAeroport, newNumTerminal):
    terminal = Terminal.query.get((oldIdAeroport, oldNumTerminal))
    if terminal is None:
        return None
    terminal.idAeroport = newIdAeroport
    terminal.numTerminal = newNumTerminal
    db.session.commit()
    return terminal

def delete_terminal(idAeroport, numTerminal):
    terminal = Terminal.query.get((idAeroport, numTerminal))
    if terminal:
        db.session.delete(terminal)
        db.session.commit()



def get_all_vols():
    return Vol.query.all()

def get_vol(idVol):
    return Vol.query.get(idVol)

def get_vols_by_compagnie(idCompagnie):
    return Vol.query.filter_by(idCompagnie=idCompagnie).all()

def get_vols_by_aeroport_dep(idAeroportDep):
    return Vol.query.filter_by(idAeroportDep=idAeroportDep).all()

def get_vols_by_aeroport_arr(idAeroportArr):
    return Vol.query.filter_by(idAeroportArr=idAeroportArr).all()

def create_vol(idCompagnie, numVol, dateHeureDep, dateHeureArr,idAeroportDep, numTerminalDep, idAeroportArr, numTerminalArr):
    vol = Vol(
        idCompagnie=idCompagnie,
        numVol=numVol,
        dateHeureDep=dateHeureDep,
        dateHeureArr=dateHeureArr,
        idAeroportDep=idAeroportDep,
        numTerminalDep=numTerminalDep,
        idAeroportArr=idAeroportArr,
        numTerminalArr=numTerminalArr
    )
    db.session.add(vol)
    db.session.commit()
    return vol

def modify_vol(idVol, idCompagnie, numVol, dateHeureDep, dateHeureArr,idAeroportDep, numTerminalDep, idAeroportArr, numTerminalArr):
    vol = Vol.query.get(idVol)
    if vol is None:
        return None
    vol.idCompagnie = idCompagnie
    vol.numVol = numVol
    vol.dateHeureDep = dateHeureDep
    vol.dateHeureArr = dateHeureArr
    vol.idAeroportDep = idAeroportDep
    vol.numTerminalDep = numTerminalDep
    vol.idAeroportArr = idAeroportArr
    vol.numTerminalArr = numTerminalArr
    db.session.commit()
    return vol

def delete_vol(idVol):
    vol = Vol.query.get(idVol)
    if vol:
        db.session.delete(vol)
        db.session.commit()