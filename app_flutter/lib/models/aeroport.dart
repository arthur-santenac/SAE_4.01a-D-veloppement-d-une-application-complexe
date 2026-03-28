class Aeroport {
  final int id;
  final String nom;
  final int idVille;
  final double? latitude;
  final double? longitude;
  final String uri;

  Aeroport({
    required this.id,
    required this.nom,
    required this.idVille,
    this.latitude,
    this.longitude,
    required this.uri,
  });

  factory Aeroport.fromJson(Map<String, dynamic> json) {
    return Aeroport(
        id: json['idAeroport'] ?? 0,
        nom: json['nomAeroport'] ?? json['nomAeroporte'] ?? '',
        idVille : json['idVille'] ?? 0,
        latitude: json['latitude'] != null ? double.tryParse(json['latitude'].toString()) : null,
        longitude: json['longitude'] != null ? double.tryParse(json['longitude'].toString()) : null,
        uri: json['uri'] ?? '',
    );
  }
}
