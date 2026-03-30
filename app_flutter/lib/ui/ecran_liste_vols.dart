import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/vols_view_model.dart';
import '../models/vol.dart';

class EcranListeVols extends StatelessWidget {
  const EcranListeVols({super.key});

  String _formatDateTime(DateTime dateTime) {
    final jour = dateTime.day.toString().padLeft(2, '0');
    final mois = dateTime.month.toString().padLeft(2, '0');
    final annee = dateTime.year.toString();
    final heure = dateTime.hour.toString().padLeft(2, '0');
    final minute = dateTime.minute.toString().padLeft(2, '0');
    return '$jour/$mois/$annee à $heure:$minute';
  }

  void _showVolDetails(BuildContext context, Vol vol, VolsViewModel viewModel) {
    Navigator.of(context).push(
      PageRouteBuilder(
        opaque: false,
        barrierDismissible: true,
        barrierColor: Colors.black54, 
        pageBuilder: (BuildContext context, _, __) {
          return Align(
            alignment: Alignment.bottomCenter,
            child: Material(
              color: Theme.of(context).scaffoldBackgroundColor,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(25)),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 25),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Hero(
                        tag: 'avatar_vol_${vol.idVol}',
                        child: Material(
                          color: Colors.transparent,
                          child: CircleAvatar(
                            radius: 35,
                            backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                            child: Icon(Icons.flight, size: 40, color: Theme.of(context).colorScheme.primary),
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Vol ${vol.numVol}',
                            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.primary),
                          ),
                          StatefulBuilder(
                            builder: (context, setState) {
                              bool isFav = viewModel.isMonVol(vol.idVol);
                              return IconButton(
                                icon: Icon(
                                  isFav ? Icons.favorite : Icons.favorite_border,
                                  color: Colors.red,
                                ),
                                onPressed: () {
                                  viewModel.toggleMonVol(vol.idVol);
                                  setState(() {});
                                },
                              );
                            }
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      ListTile(
                        leading: const Icon(Icons.flight_takeoff, color: Colors.blue),
                        title: Text('Départ : ${_formatDateTime(vol.dateHeureDep)}'),
                        subtitle: Text('${viewModel.getAeroportFullName(vol.idAeroportDep)}\nTerminal ${vol.numTerminalDep}'),
                      ),
                      ListTile(
                        leading: const Icon(Icons.flight_land, color: Colors.green),
                        title: Text('Arrivée : ${_formatDateTime(vol.dateHeureArr)}'),
                        subtitle: Text('${viewModel.getAeroportFullName(vol.idAeroportArr)}\nTerminal ${vol.numTerminalArr}'),
                      ),
                      const SizedBox(height: 10),
                      Text('Compagnie: ${viewModel.getCompagnieName(vol.idCompagnie)}', style: const TextStyle(fontStyle: FontStyle.italic)),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0.0, 1.0),
              end: Offset.zero,
            ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutCubic)),
            child: child,
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<VolsViewModel>(
      builder: (context, viewModel, child) {
        final mesVolsListe = viewModel.allVols
            .where((v) => viewModel.mesVolsIds.contains(v.idVol))
            .toList();

        if (viewModel.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (mesVolsListe.isEmpty) {
          return const Center(
            child: Text(
              "Vous n'avez pas encore de vols enregistrés.\nAjoutez-les depuis l'onglet 'Tous les vols'.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(8),
          itemCount: mesVolsListe.length,
          itemBuilder: (context, index) {
            final vol = mesVolsListe[index];
            final aDep = viewModel.getAeroportFullName(vol.idAeroportDep);
            final aArr = viewModel.getAeroportFullName(vol.idAeroportArr);

            return Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              child: ListTile(
                leading: Hero(
                  tag: 'avatar_vol_${vol.idVol}',
                  child: Material(
                    color: Colors.transparent,
                    child: CircleAvatar(
                      backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                      child: Icon(Icons.flight, color: Theme.of(context).colorScheme.primary),
                    ),
                  ),
                ),
                title: Text('${viewModel.getCompagnieName(vol.idCompagnie)} - Vol ${vol.numVol}', style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('De: $aDep\nÀ: $aArr\nDép: ${_formatDateTime(vol.dateHeureDep)}\nArr: ${_formatDateTime(vol.dateHeureArr)}'),
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: Colors.grey),
                  onPressed: () {
                    viewModel.toggleMonVol(vol.idVol);
                  },
                ),
                onTap: () => _showVolDetails(context, vol, viewModel),
                isThreeLine: true,
              ),
            );
          },
        );
      },
    );
  }
}
