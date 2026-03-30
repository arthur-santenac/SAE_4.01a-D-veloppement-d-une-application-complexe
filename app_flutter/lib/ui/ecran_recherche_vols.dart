import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../viewmodels/vols_view_model.dart';
import '../models/aeroport.dart';

class EcranRechercheVols extends StatelessWidget {
  const EcranRechercheVols({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<VolsViewModel>(
      builder: (context, viewModel, child) {
        if (viewModel.aeroports.isEmpty) {
          return const Center(child: Text("Chargement de la carte..."));
        }

        final mesVolsListe = viewModel.allVols
            .where((v) => viewModel.isMonVol(v.idVol))
            .toList();

        List<Polyline> polylines = [];
        for (var vol in mesVolsListe) {
          final aeroDep = viewModel.getAeroport(vol.idAeroportDep);
          final aeroArr = viewModel.getAeroport(vol.idAeroportArr);
          if (aeroDep != null && aeroArr != null &&
              aeroDep.latitude != null && aeroDep.longitude != null &&
              aeroArr.latitude != null && aeroArr.longitude != null) {
             polylines.add(
               Polyline(
                 points: [
                   LatLng(aeroDep.latitude!, aeroDep.longitude!),
                   LatLng(aeroArr.latitude!, aeroArr.longitude!),
                 ],
                 color: Theme.of(context).colorScheme.primary,
                 strokeWidth: 4.0,
               ),
             );
          }
        }

        final aeroportsAvecCoords = viewModel.aeroports.where(
          (a) => a.latitude != null && a.longitude != null
        ).toList();

        return FlutterMap(
          options: MapOptions(
            initialCenter: const LatLng(48.8566, 2.3522),
            initialZoom: 4.0,
          ),
          children: [
            TileLayer(
              urlTemplate: viewModel.isDarkMode 
                 ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                 : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.example.app',
            ),
            if (polylines.isNotEmpty)
              PolylineLayer(
                polylines: polylines,
              ),
            MarkerLayer(
              markers: aeroportsAvecCoords.map((aeroport) {
                return Marker(
                  point: LatLng(aeroport.latitude!, aeroport.longitude!),
                  width: 80,
                  height: 80,
                  child: GestureDetector(
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (_) => AlertDialog(
                          title: Text(viewModel.getAeroportFullName(aeroport.id)),
                          content: Text('ID: ${aeroport.id}\nLat: ${aeroport.latitude}\nLng: ${aeroport.longitude}'),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Fermer'),
                            ),
                          ],
                        ),
                      );
                    },
                    child: const Icon(
                      Icons.location_on,
                      color: Colors.red,
                      size: 40,
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        );
      },
    );
  }
}
