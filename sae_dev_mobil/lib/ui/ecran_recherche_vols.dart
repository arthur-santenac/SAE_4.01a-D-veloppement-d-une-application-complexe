import 'package:flutter/material.dart';
import '../api/my_api.dart';
import '../models/vol.dart';

class EcranRechercheVols extends StatefulWidget {
  const EcranRechercheVols({super.key});

  @override
  State<EcranRechercheVols> createState() => _EcranRechercheVolsState();
}

class _EcranRechercheVolsState extends State<EcranRechercheVols> {
  late Future<List<Vol>> _futureVols;
  String _searchQuery = '';
  TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _futureVols = MyAPI().getVols();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  String _formatDateTime(DateTime dateTime) {
    final jour = dateTime.day.toString().padLeft(2, '0');
    final mois = dateTime.month.toString().padLeft(2, '0');
    final annee = dateTime.year.toString();
    final heure = dateTime.hour.toString().padLeft(2, '0');
    final minute = dateTime.minute.toString().padLeft(2, '0');
    return '$jour/$mois/$annee à $heure:$minute';
  }

  List<Vol> _filterVols(List<Vol> vols) {
    if (_searchQuery.isEmpty) return vols;
    return vols
        .where((vol) =>
            vol.numVol.contains(_searchQuery) ||
            vol.idAeroportDep.toString().contains(_searchQuery) ||
            vol.idAeroportArr.toString().contains(_searchQuery) ||
            vol.idCompagnie.toString().contains(_searchQuery))
        .toList();
  }

  Widget _buildCarteVol(Vol vol) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Vol ${vol.numVol.isEmpty ? '-' : vol.numVol}',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Text('Départ : ${_formatDateTime(vol.dateHeureDep)}'),
            Text('Arrivée : ${_formatDateTime(vol.dateHeureArr)}'),
            const SizedBox(height: 8),
            Text('Aéroport départ: ${vol.idAeroportDep} - Terminal ${vol.numTerminalDep}'),
            Text('Aéroport arrivée: ${vol.idAeroportArr} - Terminal ${vol.numTerminalArr}'),
            const SizedBox(height: 8),
            Text('Compagnie ID : ${vol.idCompagnie}'),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(12),
          child: TextField(
            controller: _controller,
            onChanged: (query) {
              setState(() {
                _searchQuery = query;
              });
            },
            decoration: InputDecoration(
              hintText: 'Rechercher un vol...',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: _searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _controller.clear();
                        setState(() {
                          _searchQuery = '';
                        });
                      },
                    )
                  : null,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        ),
        Expanded(
          child: FutureBuilder<List<Vol>>(
            future: _futureVols,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              if (snapshot.hasError) {
                return Center(
                  child: Text('Erreur: ${snapshot.error}'),
                );
              }

              final allVols = snapshot.data ?? [];
              final filteredVols = _filterVols(allVols);

              if (filteredVols.isEmpty) {
                return Center(
                  child: Text(
                    _searchQuery.isEmpty
                        ? 'Aucun vol à afficher.'
                        : 'Aucun vol trouvé pour "$_searchQuery".',
                  ),
                );
              }

              return ListView.builder(
                itemCount: filteredVols.length,
                itemBuilder: (context, index) => _buildCarteVol(filteredVols[index]),
              );
            },
          ),
        ),
      ],
    );
  }
}
