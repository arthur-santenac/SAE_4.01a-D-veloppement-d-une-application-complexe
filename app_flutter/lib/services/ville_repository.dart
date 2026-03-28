import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/ville.dart';
import 'api_client.dart';

class VilleRepository {
  Future<List<Ville>> getVilles() async {
    final response = await http.get(Uri.parse('${apiUrl}villes'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      final List<Ville> villes = [];
      
      for (var json in jsonList) {
        villes.add(Ville.fromJson(json));
      }
      
      return villes;
    } else {
      throw Exception('Erreur lors du chargement des villes');
    }
  }
}
