import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/vols_view_model.dart';
import '../models/vol.dart';

class EcranAllVols extends StatelessWidget {
  const EcranAllVols({super.key});

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

  Widget _buildContenuVols(BuildContext context, VolsViewModel viewModel) {
    if (viewModel.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (viewModel.errorMessage.isNotEmpty) {
      return Center(child: Text('Erreur: ${viewModel.errorMessage}'));
    }

    if (viewModel.filteredVols.isEmpty) {
      return const Center(child: Text('Aucun vol trouvé.'));
    }

    return RefreshIndicator(
      onRefresh: viewModel.fetchData,
      child: ListView.builder(
        itemCount: viewModel.filteredVols.length,
        itemBuilder: (context, index) {
          final vol = viewModel.filteredVols[index];
          final isFav = viewModel.isMonVol(vol.idVol);
          final aDep = viewModel.getAeroportName(vol.idAeroportDep);
          final aArr = viewModel.getAeroportName(vol.idAeroportArr);

          return Card(
            elevation: 4,
            margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
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
              title: Text('Vol ${vol.numVol}', style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('$aDep → $aArr\n${viewModel.getCompagnieName(vol.idCompagnie)}'),
              trailing: IconButton(
                icon: Icon(
                  isFav ? Icons.favorite : Icons.favorite_border,
                  color: isFav ? Colors.red : Colors.grey,
                ),
                onPressed: () => viewModel.toggleMonVol(vol.idVol),
              ),
              onTap: () => _showVolDetails(context, vol, viewModel),
              isThreeLine: true,
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<VolsViewModel>(
      builder: (context, viewModel, child) {
        return Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        labelText: 'Rechercher un vol, aéroport...',
                        prefixIcon: const Icon(Icons.search),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(15.0)),
                        filled: true,
                      ),
                      onChanged: (value) => viewModel.applyFilter(value),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: BoxDecoration(
                      color: viewModel.selectedDate != null ? Theme.of(context).colorScheme.primaryContainer : Colors.transparent,
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: Colors.grey.shade400),
                    ),
                    child: IconButton(
                      icon: Icon(
                        Icons.calendar_month,
                        color: viewModel.selectedDate != null ? Theme.of(context).colorScheme.primary : Colors.grey,
                      ),
                      onPressed: () async {
                        if (viewModel.selectedDate != null) {
                          viewModel.setDateFilter(null);
                        } else {
                          DateTime? pickedDate = await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime(2020),
                            lastDate: DateTime(2030),
                          );
                          if (pickedDate != null) {
                            viewModel.setDateFilter(pickedDate);
                          }
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),
            if (viewModel.selectedDate != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Row(
                  children: [
                    Text(
                      'Date filtrée : ${viewModel.selectedDate!.day.toString().padLeft(2,'0')}/${viewModel.selectedDate!.month.toString().padLeft(2,'0')}/${viewModel.selectedDate!.year}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            Expanded(
              child: _buildContenuVols(context, viewModel),
            ),
          ],
        );
      },
    );
  }
}
