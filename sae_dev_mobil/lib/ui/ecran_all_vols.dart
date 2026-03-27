import 'package:flutter/material.dart';
import '../api/my_api.dart';
import '../models/vol.dart';

class EcranAllVols extends StatefulWidget {
  const EcranAllVols({super.key});

  @override
  State<EcranAllVols> createState() => _EcranAllVolsState();
}

class _EcranAllVolsState extends State<EcranAllVols> {
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
    await _futureVols;
  }

  String _formatDateTime(DateTime dateTime) {
    final jour = dateTime.day.toString().padLeft(2, '0');
    final mois = dateTime.month.toString().padLeft(2, '0');
    final annee = dateTime.year.toString();
    final heure = dateTime.hour.toString().padLeft(2, '0');
    final minute = dateTime.minute.toString().padLeft(2, '0');
    return '$jour/$mois/$annee à $heure:$minute';
  }

  Widget _buildListTileVol(Vol vol) {
    return Card(
      color: Colors.white70,
      elevation: 7,
      margin: const EdgeInsets.all(10),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.lightBlue,
          child: Text(vol.idCompagnie.toString()),
        ),
        title: Text('Vol ${vol.numVol}'),
        subtitle: Text('${vol.idAeroportDep} → ${vol.idAeroportArr}'),
        trailing: const Icon(Icons.airplanemode_on),
        onTap: () {
          _showVolDetails(context, vol);
        },
      ),
    );
  }

  void _showVolDetails(BuildContext context, Vol vol) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Vol ${vol.numVol}',
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Text('Départ : ${_formatDateTime(vol.dateHeureDep)}'),
              Text('Arrivée : ${_formatDateTime(vol.dateHeureArr)}'),
              const SizedBox(height: 12),
              Text('De : ${vol.idAeroportDep} (Terminal ${vol.numTerminalDep})'),
              Text('Vers : ${vol.idAeroportArr} (Terminal ${vol.numTerminalArr})'),
              const SizedBox(height: 12),
              Text('Compagnie : ${vol.idCompagnie}'),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Vol>>(
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
                  const Text('Impossible de charger les vols.'),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: _rafraichir,
                    child: const Text('Réessayer'),
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
                Center(child: Text('Aucun vol à afficher.')),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: _rafraichir,
          child: ListView.builder(
            itemCount: vols.length,
            itemBuilder: (context, index) => _buildListTileVol(vols[index]),
          ),
        );
      },
    );
  }
}
