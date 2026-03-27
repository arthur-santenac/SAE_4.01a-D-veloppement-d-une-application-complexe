import 'package:flutter/material.dart';

import '../api/my_api.dart';
import '../models/vol.dart';

class EcranVol extends StatefulWidget {
  const EcranVol({super.key});

  @override
  State<EcranVol> createState() => _EcranVolState();
}

class _EcranVolState extends State<EcranVol> {
  late Future<List<Vol>> _futureVols;

  @override
  void initState() {
    super.initState();
    _futureVols = MyAPI().getVols();
  }

  Future<void> _rafraichir() async {
    setState(() {
      _futureVols = MyAPI().getVols();
    });

    // Attend que la nouvelle requete se termine pour fermer proprement le refresh.
    await _futureVols;
  }

  String _formatDateTime(DateTime dateTime) {
    final jour = dateTime.day.toString().padLeft(2, '0');
    final mois = dateTime.month.toString().padLeft(2, '0');
    final annee = dateTime.year.toString();
    final heure = dateTime.hour.toString().padLeft(2, '0');
    final minute = dateTime.minute.toString().padLeft(2, '0');
    return '$jour/$mois/$annee a $heure:$minute';
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
              'Vol ${vol.numVol.isEmpty ? '-': vol.numVol}',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Text('Depart : ${_formatDateTime(vol.dateHeureDep)}'),
            Text('Arrivee : ${_formatDateTime(vol.dateHeureArr)}'),
            const SizedBox(height: 8),
            Text('Aeroport depart: ${vol.idAeroportDep} - Terminal ${vol.numTerminalDep}'),
            Text('Aeroport arrivee: ${vol.idAeroportArr} - Terminal ${vol.numTerminalArr}'),
            const SizedBox(height: 8),
            Text('Compagnie ID : ${vol.idCompagnie}'),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Liste des vols'),
      ),
      body: FutureBuilder<List<Vol>>(
        future: _futureVols,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text(
                      'Impossible de charger les vols.',
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${snapshot.error}',
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _rafraichir,
                      child: const Text('Reessayer'),
                    ),
                  ],
                ),
              ),
            );
          }

          final vols = snapshot.data ?? [];
          if (vols.isEmpty) {
            return RefreshIndicator(
              onRefresh: _rafraichir,
              child: ListView(
                children: const [
                  SizedBox(height: 120),
                  Center(child: Text('Aucun vol a afficher.')),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: _rafraichir,
            child: ListView.builder(
              itemCount: vols.length,
              itemBuilder: (context, index) => _buildCarteVol(vols[index]),
            ),
          );
        },
      ),
    );
  }
}

