import 'package:flutter/material.dart';

class EcranSettings extends StatefulWidget {
  const EcranSettings({super.key});

  @override
  State<EcranSettings> createState() => _EcranSettingsState();
}

class _EcranSettingsState extends State<EcranSettings> {
  bool _notificationsEnabled = true;
  String _selectedLanguage = 'Français';

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          Padding(
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
                  'Notifications',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                Card(
                  child: ListTile(
                    title: const Text('Activer les notifications'),
                    trailing: Switch(
                      value: _notificationsEnabled,
                      onChanged: (value) {
                        setState(() {
                          _notificationsEnabled = value;
                        });
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'Langue',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                Card(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: DropdownButton<String>(
                      value: _selectedLanguage,
                      isExpanded: true,
                      onChanged: (String? newValue) {
                        if (newValue != null) {
                          setState(() {
                            _selectedLanguage = newValue;
                          });
                        }
                      },
                      items: <String>['Français', 'English', 'Español']
                          .map<DropdownMenuItem<String>>((String value) {
                        return DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        );
                      }).toList(),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'À propos',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                Card(
                  child: ListTile(
                    title: const Text('Version de l\'application'),
                    subtitle: const Text('1.0.0'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
