import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/vol_repository.dart';
import '../services/aeroport_repository.dart';
import '../services/compagnie_repository.dart';
import '../services/ville_repository.dart';
import '../services/pays_repository.dart';
import '../models/vol.dart';
import '../models/aeroport.dart';
import '../models/compagnie.dart';
import '../models/ville.dart';
import '../models/pays.dart';

class VolsViewModel extends ChangeNotifier {
  List<Vol> allVols = [];
  List<Vol> filteredVols = [];
  
  List<Aeroport> aeroports = [];
  List<Compagnie> compagnies = [];
  List<Ville> villes = [];
  List<Pays> paysList = [];
  
  List<int> mesVolsIds = []; 
  
  bool isLoading = false;
  String errorMessage = '';

  String filterQuery = '';
  DateTime? selectedDate;

  bool isDarkMode = false;

  VolsViewModel() {
    _loadSettings();
    _loadMesVols();
    fetchData();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    isDarkMode = prefs.getBool('isDarkMode') ?? false;
    notifyListeners();
  }

  Future<void> toggleDarkMode(bool value) async {
    isDarkMode = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isDarkMode', value);
    notifyListeners();
  }

  Future<void> fetchData() async {
    isLoading = true;
    errorMessage = '';
    notifyListeners();
    try {
      await Future.wait([
        fetchAeroports(),
        fetchCompagnies(),
        fetchVilles(),
        fetchPays(),
      ]);
      allVols = await VolRepository().getVols();
      applyFilter(filterQuery);
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAeroports() async {
    aeroports = await AeroportRepository().getAeroports();
  }

  Future<void> fetchCompagnies() async {
    compagnies = await CompagnieRepository().getCompagnies();
  }

  Future<void> fetchVilles() async {
    villes = await VilleRepository().getVilles();
  }

  Future<void> fetchPays() async {
    paysList = await PaysRepository().getPays();
  }

  String getAeroportName(int id) {
    try {
      return aeroports.firstWhere((a) => a.id == id).nom;
    } catch (e) {
      return 'Aéroport $id';
    }
  }
  
  String getAeroportFullName(int id) {
    try {
      final aero = aeroports.firstWhere((a) => a.id == id);
      final ville = villes.firstWhere((v) => v.id == aero.idVille);
      final pays = paysList.firstWhere((p) => p.code == ville.codePays);
      return '${ville.nom}, ${pays.nom} - ${aero.nom}';
    } catch (e) {
      return getAeroportName(id);
    }
  }

  Aeroport? getAeroport(int id) {
    try {
      return aeroports.firstWhere((a) => a.id == id);
    } catch (e) {
      return null;
    }
  }

  String getCompagnieName(int id) {
    try {
      return compagnies.firstWhere((c) => c.id == id).nom;
    } catch (e) {
      return 'Compagnie $id';
    }
  }

  Future<void> _loadMesVols() async {
    final prefs = await SharedPreferences.getInstance();
    final idsString = prefs.getStringList('mes_vols') ?? [];
    mesVolsIds = idsString.map((e) => int.parse(e)).toList();
    notifyListeners();
  }

  Future<void> toggleMonVol(int volId) async {
    final prefs = await SharedPreferences.getInstance();
    if (mesVolsIds.contains(volId)) {
      mesVolsIds.remove(volId);
    } else {
      mesVolsIds.add(volId);
    }
    final idsString = mesVolsIds.map((e) => e.toString()).toList();
    await prefs.setStringList('mes_vols', idsString);
    notifyListeners();
  }

  bool isMonVol(int volId) {
    return mesVolsIds.contains(volId);
  }

  void setDateFilter(DateTime? date) {
    selectedDate = date;
    applyFilter(filterQuery);
  }

  void applyFilter(String query) {
    filterQuery = query;
    filteredVols = allVols.where((vol) {
      bool matchTexte = true;
      if (query.isNotEmpty) {
        final aDepName = getAeroportName(vol.idAeroportDep).toLowerCase();
        final aArrName = getAeroportName(vol.idAeroportArr).toLowerCase();
        final compName = getCompagnieName(vol.idCompagnie).toLowerCase();
        final q = query.toLowerCase();

        matchTexte = vol.numVol.toLowerCase().contains(q) || 
               aDepName.contains(q) ||
               aArrName.contains(q) ||
               compName.contains(q);
      }

      bool matchDate = true;
      if (selectedDate != null) {
        matchDate = vol.dateHeureDep.year == selectedDate!.year &&
                    vol.dateHeureDep.month == selectedDate!.month &&
                    vol.dateHeureDep.day == selectedDate!.day;
      }

      return matchTexte && matchDate;
    }).toList();
    
    notifyListeners();
  }
}
