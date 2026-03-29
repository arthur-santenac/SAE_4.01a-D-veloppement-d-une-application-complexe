class Compagnie {
  final int id;
  final String nom;
  final String uri;

  Compagnie({
    required this.id,
    required this.nom,
    required this.uri,
  });

  factory Compagnie.fromJson(Map<String, dynamic> json) {
    return Compagnie(
      id: json['idCompagnie'] ?? 0,
      nom: json['nomCompagnie'] ?? '',
      uri: json['uri'] ?? '',
    );
  }
}