class Pays {
  final int code;
  final String nom;
  final String uri;

  Pays({
    required this.code,
    required this.nom,
    required this.uri,
  });

  factory Pays.fromJson(Map<String, dynamic> json) {
    return Pays(
      code: json['codePays'] ?? 0,
      nom: json['nomPays'] ?? '',
      uri: json['uri'] ?? '',
    );
  }
}