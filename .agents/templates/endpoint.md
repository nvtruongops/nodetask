# Template Mẫu: Serverpod API Endpoint

```dart
import 'package:serverpod/serverpod.dart';

class ExampleEndpoint extends Endpoint {
  Future<ExampleData> getExample(Session session, int id) async {
    // 1. Auth check
    // 2. Business logic
    // 3. Exception handling
  }
}
```
