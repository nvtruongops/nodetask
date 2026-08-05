/* AUTOMATICALLY GENERATED CODE DO NOT MODIFY */
/*   To generate run: "serverpod generate"    */

// ignore_for_file: implementation_imports
// ignore_for_file: library_private_types_in_public_api
// ignore_for_file: non_constant_identifier_names
// ignore_for_file: public_member_api_docs
// ignore_for_file: type_literal_in_constant_pattern
// ignore_for_file: use_super_parameters

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:serverpod/serverpod.dart' as _i1;

abstract class NodeTodo
    implements _i1.TableRow<int?>, _i1.ProtocolSerialization {
  NodeTodo._({
    this.id,
    required this.nodeId,
    required this.userId,
    required this.title,
    required this.isCompleted,
    this.priority,
    this.dueDate,
    this.createdAt,
  });

  factory NodeTodo({
    int? id,
    required _i1.UuidValue nodeId,
    required _i1.UuidValue userId,
    required String title,
    required bool isCompleted,
    String? priority,
    DateTime? dueDate,
    DateTime? createdAt,
  }) = _NodeTodoImpl;

  factory NodeTodo.fromJson(Map<String, dynamic> jsonSerialization) {
    return NodeTodo(
      id: jsonSerialization['id'] as int?,
      nodeId: _i1.UuidValueJsonExtension.fromJson(jsonSerialization['nodeId']),
      userId: _i1.UuidValueJsonExtension.fromJson(jsonSerialization['userId']),
      title: jsonSerialization['title'] as String,
      isCompleted: jsonSerialization['isCompleted'] as bool,
      priority: jsonSerialization['priority'] as String?,
      dueDate: jsonSerialization['dueDate'] == null
          ? null
          : _i1.DateTimeJsonExtension.fromJson(jsonSerialization['dueDate']),
      createdAt: jsonSerialization['createdAt'] == null
          ? null
          : _i1.DateTimeJsonExtension.fromJson(jsonSerialization['createdAt']),
    );
  }

  static final t = NodeTodoTable();

  static const db = NodeTodoRepository._();

  @override
  int? id;

  _i1.UuidValue nodeId;

  _i1.UuidValue userId;

  String title;

  bool isCompleted;

  String? priority;

  DateTime? dueDate;

  DateTime? createdAt;

  @override
  _i1.Table<int?> get table => t;

  /// Returns a shallow copy of this [NodeTodo]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  NodeTodo copyWith({
    int? id,
    _i1.UuidValue? nodeId,
    _i1.UuidValue? userId,
    String? title,
    bool? isCompleted,
    String? priority,
    DateTime? dueDate,
    DateTime? createdAt,
  });
  @override
  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'nodeId': nodeId.toJson(),
      'userId': userId.toJson(),
      'title': title,
      'isCompleted': isCompleted,
      if (priority != null) 'priority': priority,
      if (dueDate != null) 'dueDate': dueDate?.toJson(),
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  @override
  Map<String, dynamic> toJsonForProtocol() {
    return {
      if (id != null) 'id': id,
      'nodeId': nodeId.toJson(),
      'userId': userId.toJson(),
      'title': title,
      'isCompleted': isCompleted,
      if (priority != null) 'priority': priority,
      if (dueDate != null) 'dueDate': dueDate?.toJson(),
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  static NodeTodoInclude include() {
    return NodeTodoInclude._();
  }

  static NodeTodoIncludeList includeList({
    _i1.WhereExpressionBuilder<NodeTodoTable>? where,
    int? limit,
    int? offset,
    _i1.OrderByBuilder<NodeTodoTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<NodeTodoTable>? orderByList,
    NodeTodoInclude? include,
  }) {
    return NodeTodoIncludeList._(
      where: where,
      limit: limit,
      offset: offset,
      orderBy: orderBy?.call(NodeTodo.t),
      orderDescending: orderDescending,
      orderByList: orderByList?.call(NodeTodo.t),
      include: include,
    );
  }

  @override
  String toString() {
    return _i1.SerializationManager.encode(this);
  }
}

class _Undefined {}

class _NodeTodoImpl extends NodeTodo {
  _NodeTodoImpl({
    int? id,
    required _i1.UuidValue nodeId,
    required _i1.UuidValue userId,
    required String title,
    required bool isCompleted,
    String? priority,
    DateTime? dueDate,
    DateTime? createdAt,
  }) : super._(
          id: id,
          nodeId: nodeId,
          userId: userId,
          title: title,
          isCompleted: isCompleted,
          priority: priority,
          dueDate: dueDate,
          createdAt: createdAt,
        );

  /// Returns a shallow copy of this [NodeTodo]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  @override
  NodeTodo copyWith({
    Object? id = _Undefined,
    _i1.UuidValue? nodeId,
    _i1.UuidValue? userId,
    String? title,
    bool? isCompleted,
    Object? priority = _Undefined,
    Object? dueDate = _Undefined,
    Object? createdAt = _Undefined,
  }) {
    return NodeTodo(
      id: id is int? ? id : this.id,
      nodeId: nodeId ?? this.nodeId,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
      priority: priority is String? ? priority : this.priority,
      dueDate: dueDate is DateTime? ? dueDate : this.dueDate,
      createdAt: createdAt is DateTime? ? createdAt : this.createdAt,
    );
  }
}

class NodeTodoTable extends _i1.Table<int?> {
  NodeTodoTable({super.tableRelation}) : super(tableName: 'node_todos') {
    nodeId = _i1.ColumnUuid(
      'nodeId',
      this,
    );
    userId = _i1.ColumnUuid(
      'userId',
      this,
    );
    title = _i1.ColumnString(
      'title',
      this,
    );
    isCompleted = _i1.ColumnBool(
      'isCompleted',
      this,
    );
    priority = _i1.ColumnString(
      'priority',
      this,
    );
    dueDate = _i1.ColumnDateTime(
      'dueDate',
      this,
    );
    createdAt = _i1.ColumnDateTime(
      'createdAt',
      this,
    );
  }

  late final _i1.ColumnUuid nodeId;

  late final _i1.ColumnUuid userId;

  late final _i1.ColumnString title;

  late final _i1.ColumnBool isCompleted;

  late final _i1.ColumnString priority;

  late final _i1.ColumnDateTime dueDate;

  late final _i1.ColumnDateTime createdAt;

  @override
  List<_i1.Column> get columns => [
        id,
        nodeId,
        userId,
        title,
        isCompleted,
        priority,
        dueDate,
        createdAt,
      ];
}

class NodeTodoInclude extends _i1.IncludeObject {
  NodeTodoInclude._();

  @override
  Map<String, _i1.Include?> get includes => {};

  @override
  _i1.Table<int?> get table => NodeTodo.t;
}

class NodeTodoIncludeList extends _i1.IncludeList {
  NodeTodoIncludeList._({
    _i1.WhereExpressionBuilder<NodeTodoTable>? where,
    super.limit,
    super.offset,
    super.orderBy,
    super.orderDescending,
    super.orderByList,
    super.include,
  }) {
    super.where = where?.call(NodeTodo.t);
  }

  @override
  Map<String, _i1.Include?> get includes => include?.includes ?? {};

  @override
  _i1.Table<int?> get table => NodeTodo.t;
}

class NodeTodoRepository {
  const NodeTodoRepository._();

  /// Returns a list of [NodeTodo]s matching the given query parameters.
  ///
  /// Use [where] to specify which items to include in the return value.
  /// If none is specified, all items will be returned.
  ///
  /// To specify the order of the items use [orderBy] or [orderByList]
  /// when sorting by multiple columns.
  ///
  /// The maximum number of items can be set by [limit]. If no limit is set,
  /// all items matching the query will be returned.
  ///
  /// [offset] defines how many items to skip, after which [limit] (or all)
  /// items are read from the database.
  ///
  /// ```dart
  /// var persons = await Persons.db.find(
  ///   session,
  ///   where: (t) => t.lastName.equals('Jones'),
  ///   orderBy: (t) => t.firstName,
  ///   limit: 100,
  /// );
  /// ```
  Future<List<NodeTodo>> find(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<NodeTodoTable>? where,
    int? limit,
    int? offset,
    _i1.OrderByBuilder<NodeTodoTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<NodeTodoTable>? orderByList,
    _i1.Transaction? transaction,
  }) async {
    return session.db.find<NodeTodo>(
      where: where?.call(NodeTodo.t),
      orderBy: orderBy?.call(NodeTodo.t),
      orderByList: orderByList?.call(NodeTodo.t),
      orderDescending: orderDescending,
      limit: limit,
      offset: offset,
      transaction: transaction,
    );
  }

  /// Returns the first matching [NodeTodo] matching the given query parameters.
  ///
  /// Use [where] to specify which items to include in the return value.
  /// If none is specified, all items will be returned.
  ///
  /// To specify the order use [orderBy] or [orderByList]
  /// when sorting by multiple columns.
  ///
  /// [offset] defines how many items to skip, after which the next one will be picked.
  ///
  /// ```dart
  /// var youngestPerson = await Persons.db.findFirstRow(
  ///   session,
  ///   where: (t) => t.lastName.equals('Jones'),
  ///   orderBy: (t) => t.age,
  /// );
  /// ```
  Future<NodeTodo?> findFirstRow(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<NodeTodoTable>? where,
    int? offset,
    _i1.OrderByBuilder<NodeTodoTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<NodeTodoTable>? orderByList,
    _i1.Transaction? transaction,
  }) async {
    return session.db.findFirstRow<NodeTodo>(
      where: where?.call(NodeTodo.t),
      orderBy: orderBy?.call(NodeTodo.t),
      orderByList: orderByList?.call(NodeTodo.t),
      orderDescending: orderDescending,
      offset: offset,
      transaction: transaction,
    );
  }

  /// Finds a single [NodeTodo] by its [id] or null if no such row exists.
  Future<NodeTodo?> findById(
    _i1.Session session,
    int id, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.findById<NodeTodo>(
      id,
      transaction: transaction,
    );
  }

  /// Inserts all [NodeTodo]s in the list and returns the inserted rows.
  ///
  /// The returned [NodeTodo]s will have their `id` fields set.
  ///
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// insert, none of the rows will be inserted.
  Future<List<NodeTodo>> insert(
    _i1.Session session,
    List<NodeTodo> rows, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.insert<NodeTodo>(
      rows,
      transaction: transaction,
    );
  }

  /// Inserts a single [NodeTodo] and returns the inserted row.
  ///
  /// The returned [NodeTodo] will have its `id` field set.
  Future<NodeTodo> insertRow(
    _i1.Session session,
    NodeTodo row, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.insertRow<NodeTodo>(
      row,
      transaction: transaction,
    );
  }

  /// Updates all [NodeTodo]s in the list and returns the updated rows. If
  /// [columns] is provided, only those columns will be updated. Defaults to
  /// all columns.
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// update, none of the rows will be updated.
  Future<List<NodeTodo>> update(
    _i1.Session session,
    List<NodeTodo> rows, {
    _i1.ColumnSelections<NodeTodoTable>? columns,
    _i1.Transaction? transaction,
  }) async {
    return session.db.update<NodeTodo>(
      rows,
      columns: columns?.call(NodeTodo.t),
      transaction: transaction,
    );
  }

  /// Updates a single [NodeTodo]. The row needs to have its id set.
  /// Optionally, a list of [columns] can be provided to only update those
  /// columns. Defaults to all columns.
  Future<NodeTodo> updateRow(
    _i1.Session session,
    NodeTodo row, {
    _i1.ColumnSelections<NodeTodoTable>? columns,
    _i1.Transaction? transaction,
  }) async {
    return session.db.updateRow<NodeTodo>(
      row,
      columns: columns?.call(NodeTodo.t),
      transaction: transaction,
    );
  }

  /// Deletes all [NodeTodo]s in the list and returns the deleted rows.
  /// This is an atomic operation, meaning that if one of the rows fail to
  /// be deleted, none of the rows will be deleted.
  Future<List<NodeTodo>> delete(
    _i1.Session session,
    List<NodeTodo> rows, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.delete<NodeTodo>(
      rows,
      transaction: transaction,
    );
  }

  /// Deletes a single [NodeTodo].
  Future<NodeTodo> deleteRow(
    _i1.Session session,
    NodeTodo row, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.deleteRow<NodeTodo>(
      row,
      transaction: transaction,
    );
  }

  /// Deletes all rows matching the [where] expression.
  Future<List<NodeTodo>> deleteWhere(
    _i1.Session session, {
    required _i1.WhereExpressionBuilder<NodeTodoTable> where,
    _i1.Transaction? transaction,
  }) async {
    return session.db.deleteWhere<NodeTodo>(
      where: where(NodeTodo.t),
      transaction: transaction,
    );
  }

  /// Counts the number of rows matching the [where] expression. If omitted,
  /// will return the count of all rows in the table.
  Future<int> count(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<NodeTodoTable>? where,
    int? limit,
    _i1.Transaction? transaction,
  }) async {
    return session.db.count<NodeTodo>(
      where: where?.call(NodeTodo.t),
      limit: limit,
      transaction: transaction,
    );
  }
}
