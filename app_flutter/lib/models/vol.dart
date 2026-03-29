class Vol {
  final int idVol;
  final int idCompagnie;
  final String numVol;
  final DateTime dateHeureDep;
  final DateTime dateHeureArr;
  final int idAeroportDep;
  final String numTerminalDep;
  final int idAeroportArr;
  final String numTerminalArr;
  final String uri;

  Vol({
    required this.idVol,
    required this.idCompagnie,
    required this.numVol,
    required this.dateHeureDep,
    required this.dateHeureArr,
    required this.idAeroportDep,
    required this.numTerminalDep,
    required this.idAeroportArr,
    required this.numTerminalArr,
    required this.uri,
  });

  factory Vol.fromJson(Map<String, dynamic> json) {
    return Vol(
      idVol: json['idVol'] ?? 0,
      idCompagnie: json['idCompagnie'] ?? 0,
      numVol: json['numVol'] ?? '',
      dateHeureDep: DateTime.parse(json['dateHeureDep']),
      dateHeureArr: DateTime.parse(json['dateHeureArr']),
      idAeroportDep: json['idAeroportDep'] ?? 0,
      numTerminalDep: json['numTerminalDep'] ?? '',
      idAeroportArr: json['idAeroportArr'] ?? 0,
      numTerminalArr: json['numTerminalArr'] ?? '',
      uri: json['uri'] ?? '',
    );
  }
}