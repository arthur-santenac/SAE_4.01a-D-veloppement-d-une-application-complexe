class Terminal {
  final int idAeroport;
  final String numTerminal;

  Terminal({
    required this.idAeroport,
    required this.numTerminal,
  });

  factory Terminal.fromJson(Map<String, dynamic> json) {
    return Terminal(
      idAeroport: json['idAeroport'] ?? 0,
      numTerminal: json['numTerminal'] ?? '',
    );
  }
}