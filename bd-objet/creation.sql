create or replace type Personnel as object (
	nomP varchar2(30),
  fonction varchar2(30)
);
/

create type personnelList as table of Personnel;
/

create or replace type Qualite as object (
  QualiteType varchar2(20),
  poids number (1),
  poidsActuel number(2)
);
/


CREATE TYPE qualiteList AS VARRAY(10) OF Qualite;
/

create table VOL (
  numVol number(10) primary key,
  AeroDep varchar2(50),
  DateHeureDep date,
  AeroArr varchar2(50),
  DateHeureArr date,
  personnel personnelList,
  qualite qualiteList
)
NESTED TABLE personnel STORE AS personnel_tab;



