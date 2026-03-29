import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'ui/ecran_liste_vols.dart';
import 'ui/ecran_recherche_vols.dart';
import 'ui/ecran_all_vols.dart';
import 'ui/ecran_settings.dart';
import 'viewmodels/vols_view_model.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => VolsViewModel()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<VolsViewModel>(
      builder: (context, viewModel, child) {
        return MaterialApp(
          title: 'Gestion des vols',
          debugShowCheckedModeBanner: false,
          themeMode: viewModel.isDarkMode ? ThemeMode.dark : ThemeMode.light,
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(
              seedColor: Colors.deepPurple,
              primary: Colors.deepPurple,
              secondary: Colors.amber,
              brightness: Brightness.light,
            ),
            useMaterial3: true,
            appBarTheme: const AppBarTheme(
              backgroundColor: Colors.deepPurple,
              foregroundColor: Colors.white,
              elevation: 5,
            ),
            bottomNavigationBarTheme: const BottomNavigationBarThemeData(
              selectedItemColor: Colors.deepPurple,
              unselectedItemColor: Colors.grey,
            ),
          ),
          darkTheme: ThemeData(
            colorScheme: ColorScheme.fromSeed(
              seedColor: Colors.deepPurple,
              primary: Colors.deepPurple.shade200,
              secondary: Colors.amber,
              brightness: Brightness.dark,
            ),
            useMaterial3: true,
            appBarTheme: AppBarTheme(
              backgroundColor: Colors.deepPurple.shade900,
              foregroundColor: Colors.white,
              elevation: 5,
            ),
            bottomNavigationBarTheme: BottomNavigationBarThemeData(
              selectedItemColor: Colors.deepPurple.shade200,
              unselectedItemColor: Colors.grey,
            ),
          ),
          home: const MyHomePage(title: 'Gestion des vols'),
        );
      },
    );
  }
}

class MyHomePage extends StatefulWidget {
  final String title;
  const MyHomePage({super.key, required this.title});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _currentIndex = 0;

  final List<Widget> mesPages = [
    const EcranListeVols(),
    const EcranRechercheVols(),
    const EcranAllVols(),
    const EcranSettings(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: mesPages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Mes Vols'),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Carte'),
          BottomNavigationBarItem(icon: Icon(Icons.airplanemode_on), label: 'Tous les vols'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Paramètres'),
        ],
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
