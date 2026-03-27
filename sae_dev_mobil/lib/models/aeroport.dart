class Aeroport {
  final int id;
  final String nom;
  final int idVille;
  final String uri;

  Aeroport({
    required this.id,
    required this.nom,
    required this.idVille,
    required this.uri,
  });

  factory Aeroport.fromJson(Map<String, dynamic> json) {
    return Aeroport(
      id: json['idAeroport'] ?? 0,
      nom: json['nomAeroporte'] ?? '',
      idVille : json['idVille'] ?? '',
      uri: json['uri'] ?? '',
    );
  }
}