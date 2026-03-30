import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/aeroport.dart';
import 'api_client.dart';

class AeroportRepository {
  Future<List<Aeroport>> getAeroports() async {
    final response = await http.get(Uri.parse('${apiUrl}aeroports'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      final List<Aeroport> aeroports = [];
      
      for (var json in jsonList) {
        aeroports.add(Aeroport.fromJson(json));
      }
      
      return aeroports;
    } else {
      throw Exception('Erreur lors du chargement des aéroports');
    }
  }
}
