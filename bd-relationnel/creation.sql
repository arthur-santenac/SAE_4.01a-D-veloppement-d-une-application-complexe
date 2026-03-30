CREATE TABLE COMPAGNIE (
  idCompagnie VARCHAR2(10),
  nomCompagnie VARCHAR2(50) NOT NULL,
  CONSTRAINT pk_compagnie PRIMARY KEY (idCompagnie)
);

CREATE TABLE PAYS (
  codePays VARCHAR2(2),
  nomPays VARCHAR2(50) NOT NULL,
  CONSTRAINT pk_pays PRIMARY KEY (codePays)
);

CREATE TABLE VILLE (
  idVille NUMBER GENERATED ALWAYS AS IDENTITY,
  nomVille VARCHAR2(50) NOT NULL,
  codePays VARCHAR2(2) NOT NULL,
  CONSTRAINT pk_ville PRIMARY KEY (idVille),
  CONSTRAINT fk_ville_pays FOREIGN KEY (codePays) REFERENCES PAYS(codePays)
);

CREATE TABLE AEROPORT (
  idAeroport NUMBER GENERATED ALWAYS AS IDENTITY,
  nomAeroport VARCHAR2(50) NOT NULL,
  idVille NUMBER NOT NULL,
  latitude NUMBER,
  longitude NUMBER,
  CONSTRAINT pk_aeroport PRIMARY KEY (idAeroport),
  CONSTRAINT uk_aeroport_nom UNIQUE (nomAeroport),
  CONSTRAINT fk_aeroport_ville FOREIGN KEY (idVille) REFERENCES VILLE(idVille)
);

CREATE TABLE TERMINAL (
  idAeroport NUMBER,
  numTerminal VARCHAR2(10),
  CONSTRAINT pk_terminal PRIMARY KEY (idAeroport, numTerminal),
  CONSTRAINT fk_terminal_aeroport FOREIGN KEY (idAeroport) REFERENCES AEROPORT(idAeroport)
);

CREATE TABLE VOL (
  idCompagnie VARCHAR2(10),
  numVol VARCHAR2(10),
  dateHeureDep DATE,
  dateHeureArr DATE NOT NULL,
  idAeroportDep NUMBER NOT NULL,
  numTerminalDep VARCHAR2(10) NOT NULL,
  idAeroportArr NUMBER NOT NULL,
  numTerminalArr VARCHAR2(10) NOT NULL,
  CONSTRAINT pk_vol PRIMARY KEY (idCompagnie, numVol, dateHeureDep),
  CONSTRAINT fk_vol_compagnie FOREIGN KEY (idCompagnie) REFERENCES COMPAGNIE(idCompagnie),
  CONSTRAINT fk_vol_aeroport_dep FOREIGN KEY (idAeroportDep) REFERENCES AEROPORT(idAeroport),
  CONSTRAINT fk_vol_terminal_dep FOREIGN KEY (idAeroportDep, numTerminalDep) REFERENCES TERMINAL(idAeroport, numTerminal),
  CONSTRAINT fk_vol_aeroport_arr FOREIGN KEY (idAeroportArr) REFERENCES AEROPORT(idAeroport),
  CONSTRAINT fk_vol_terminal_arr FOREIGN KEY (idAeroportArr, numTerminalArr) REFERENCES TERMINAL(idAeroport, numTerminal)
);