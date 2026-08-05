import 'package:serverpod/serverpod.dart';

class AuthEndpoint extends Endpoint {
  Future<Map<String, dynamic>> login(Session session, String email, String password) async {
    // Auth logic stub
    return {
      'success': true,
      'token': 'session-token-demo',
    };
  }

  Future<Map<String, dynamic>> register(Session session, String email, String password) async {
    return {
      'success': true,
      'message': 'User registered successfully',
    };
  }
}
