import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/terminal.dart';
import 'api_client.dart';

class TerminalRepository {
  Future<List<Terminal>> getTerminaux() async {
    final response = await http.get(Uri.parse('${apiUrl}terminaux'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      final List<Terminal> terminaux = [];
      
      for (var json in jsonList) {
        terminaux.add(Terminal.fromJson(json));
      }
      
      return terminaux;
    } else {
      throw Exception('Erreur lors du chargement des terminaux');
    }
  }
}
