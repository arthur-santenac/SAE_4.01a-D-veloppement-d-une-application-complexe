import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/vol.dart';
import 'api_client.dart';

class VolRepository {
  Future<List<Vol>> getVols() async {
    final response = await http.get(Uri.parse('${apiUrl}vols'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      final List<Vol> vols = [];
      
      for (var json in jsonList) {
        vols.add(Vol.fromJson(json));
      }
      
      return vols;
    } else {
      throw Exception('Erreur lors du chargement des vols');
    }
  }
}
