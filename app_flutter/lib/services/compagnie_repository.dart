import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/compagnie.dart';
import 'api_client.dart';

class CompagnieRepository {
  Future<List<Compagnie>> getCompagnies() async {
    final response = await http.get(Uri.parse('${apiUrl}compagnies'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      final List<Compagnie> compagnies = [];
      
      for (var json in jsonList) {
        compagnies.add(Compagnie.fromJson(json));
      }
      
      return compagnies;
    } else {
      throw Exception('Erreur lors du chargement des compagnies');
    }
  }
}
