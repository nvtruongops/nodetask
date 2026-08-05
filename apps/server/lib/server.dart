import 'package:serverpod/serverpod.dart';
import 'src/generated/protocol.dart';
import 'src/generated/endpoints.dart';

void run(List<String> args) async {
  // Initialize Serverpod server instance
  final pod = Serverpod(
    args,
    Protocol(),
    Endpoints(),
  );

  // Start Serverpod server
  await pod.start();
}
