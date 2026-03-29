import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/pays.dart';
import 'api_client.dart';

class PaysRepository {
  Future<List<Pays>> getPays() async {
    final response = await http.get(Uri.parse('${apiUrl}pays'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      final List<Pays> paysList = [];
      
      for (var json in jsonList) {
        paysList.add(Pays.fromJson(json));
      }
      
      return paysList;
    } else {
      throw Exception('Erreur lors du chargement des pays');
    }
  }
}
