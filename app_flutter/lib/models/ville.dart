class Ville {
  final int id;
  final String nom;
  final int codePays;
  final String uri;

  Ville({
    required this.id,
    required this.nom,
    required this.codePays,
    required this.uri,
  });

  factory Ville.fromJson(Map<String, dynamic> json) {
    return Ville(
      id: json['idVille'] ?? 0,
      nom: json['nomVille'] ?? '',
      codePays: json['codePays'] ?? 0,
      uri: json['uri'] ?? '',
    );
  }
}