import 'package:flutter/material';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flex_color_scheme/flex_color_scheme.dart';

void main() {
  runApp(
    const ProviderScope(
      child: NodeTaskMobileApp(),
    ),
  );
}

class NodeTaskMobileApp extends StatelessWidget {
  const NodeTaskMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'nodetask Mobile',
      debugShowCheckedModeBanner: false,
      theme: FlexThemeData.light(
        scheme: FlexScheme.amber,
        useMaterial3: true,
      ),
      darkTheme: FlexThemeData.dark(
        scheme: FlexScheme.amber,
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      home: const Scaffold(
        body: Center(
          child: Text(
            '[nodetask Mobile - Riverpod & Serverpod SDK Synchronized]',
            style: TextStyle(fontFamily: 'monospace'),
          ),
        ),
      ),
    );
  }
}
