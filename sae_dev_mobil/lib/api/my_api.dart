import 'dart:convert';
import '../models/aeroport.dart';
import '../models/compagnie.dart';
import '../models/pays.dart';
import '../models/terminal.dart';
import '../models/ville.dart';
import '../models/vol.dart';
import 'package:http/http.dart' as http;

String url_api = "http://127.0.0.1:5000/api/";

class MyAPI {
  Future<List<Compagnie>> getCompagnies() async {
    final response = await http.get(Uri.parse(url_api + 'compagnies'));

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

  Future<List<Aeroport>> getAeroports() async {
    final response = await http.get(Uri.parse(url_api + 'aeroports'));

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

  Future<List<Pays>> getPays() async {
    final response = await http.get(Uri.parse(url_api + 'pays'));

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

  Future<List<Terminal>> getTerminaux() async {
    final response = await http.get(Uri.parse(url_api + 'terminaux'));

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

  Future<List<Ville>> getVilles() async {
    final response = await http.get(Uri.parse(url_api + 'villes'));

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

  Future<List<Vol>> getVols() async {
    final response = await http.get(Uri.parse(url_api + 'vols'));

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