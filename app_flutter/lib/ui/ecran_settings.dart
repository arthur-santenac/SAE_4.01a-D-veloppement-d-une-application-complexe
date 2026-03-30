import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/vols_view_model.dart';

class EcranSettings extends StatelessWidget {
  const EcranSettings({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<VolsViewModel>(
      builder: (context, viewModel, child) {
        return SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Paramètres',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Apparence',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                Card(
                  child: ListTile(
                    leading: Icon(viewModel.isDarkMode ? Icons.dark_mode : Icons.light_mode),
                    title: const Text('Mode sombre'),
                    trailing: Switch(
                      value: viewModel.isDarkMode,
                      onChanged: (value) {
                        viewModel.toggleDarkMode(value);
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'À propos',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                const Card(
                  child: ListTile(
                    leading: Icon(Icons.info_outline),
                    title: Text('Version de l\'application'),
                    subtitle: Text('1.1.0 - Projet SAE'),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
