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

abstract class NodeEmbedding
    implements _i1.TableRow<int?>, _i1.ProtocolSerialization {
  NodeEmbedding._({
    this.id,
    required this.nodeId,
    required this.chunkContent,
    required this.embedding,
    this.createdAt,
  });

  factory NodeEmbedding({
    int? id,
    required _i1.UuidValue nodeId,
    required String chunkContent,
    required String embedding,
    DateTime? createdAt,
  }) = _NodeEmbeddingImpl;

  factory NodeEmbedding.fromJson(Map<String, dynamic> jsonSerialization) {
    return NodeEmbedding(
      id: jsonSerialization['id'] as int?,
      nodeId: _i1.UuidValueJsonExtension.fromJson(jsonSerialization['nodeId']),
      chunkContent: jsonSerialization['chunkContent'] as String,
      embedding: jsonSerialization['embedding'] as String,
      createdAt: jsonSerialization['createdAt'] == null
          ? null
          : _i1.DateTimeJsonExtension.fromJson(jsonSerialization['createdAt']),
    );
  }

  static final t = NodeEmbeddingTable();

  static const db = NodeEmbeddingRepository._();

  @override
  int? id;

  _i1.UuidValue nodeId;

  String chunkContent;

  String embedding;

  DateTime? createdAt;

  @override
  _i1.Table<int?> get table => t;

  /// Returns a shallow copy of this [NodeEmbedding]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  NodeEmbedding copyWith({
    int? id,
    _i1.UuidValue? nodeId,
    String? chunkContent,
    String? embedding,
    DateTime? createdAt,
  });
  @override
  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'nodeId': nodeId.toJson(),
      'chunkContent': chunkContent,
      'embedding': embedding,
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  @override
  Map<String, dynamic> toJsonForProtocol() {
    return {
      if (id != null) 'id': id,
      'nodeId': nodeId.toJson(),
      'chunkContent': chunkContent,
      'embedding': embedding,
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  static NodeEmbeddingInclude include() {
    return NodeEmbeddingInclude._();
  }

  static NodeEmbeddingIncludeList includeList({
    _i1.WhereExpressionBuilder<NodeEmbeddingTable>? where,
    int? limit,
    int? offset,
    _i1.OrderByBuilder<NodeEmbeddingTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<NodeEmbeddingTable>? orderByList,
    NodeEmbeddingInclude? include,
  }) {
    return NodeEmbeddingIncludeList._(
      where: where,
      limit: limit,
      offset: offset,
      orderBy: orderBy?.call(NodeEmbedding.t),
      orderDescending: orderDescending,
      orderByList: orderByList?.call(NodeEmbedding.t),
      include: include,
    );
  }

  @override
  String toString() {
    return _i1.SerializationManager.encode(this);
  }
}

class _Undefined {}

class _NodeEmbeddingImpl extends NodeEmbedding {
  _NodeEmbeddingImpl({
    int? id,
    required _i1.UuidValue nodeId,
    required String chunkContent,
    required String embedding,
    DateTime? createdAt,
  }) : super._(
          id: id,
          nodeId: nodeId,
          chunkContent: chunkContent,
          embedding: embedding,
          createdAt: createdAt,
        );

  /// Returns a shallow copy of this [NodeEmbedding]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  @override
  NodeEmbedding copyWith({
    Object? id = _Undefined,
    _i1.UuidValue? nodeId,
    String? chunkContent,
    String? embedding,
    Object? createdAt = _Undefined,
  }) {
    return NodeEmbedding(
      id: id is int? ? id : this.id,
      nodeId: nodeId ?? this.nodeId,
      chunkContent: chunkContent ?? this.chunkContent,
      embedding: embedding ?? this.embedding,
      createdAt: createdAt is DateTime? ? createdAt : this.createdAt,
    );
  }
}

class NodeEmbeddingTable extends _i1.Table<int?> {
  NodeEmbeddingTable({super.tableRelation})
      : super(tableName: 'node_embeddings') {
    nodeId = _i1.ColumnUuid(
      'nodeId',
      this,
    );
    chunkContent = _i1.ColumnString(
      'chunkContent',
      this,
    );
    embedding = _i1.ColumnString(
      'embedding',
      this,
    );
    createdAt = _i1.ColumnDateTime(
      'createdAt',
      this,
    );
  }

  late final _i1.ColumnUuid nodeId;

  late final _i1.ColumnString chunkContent;

  late final _i1.ColumnString embedding;

  late final _i1.ColumnDateTime createdAt;

  @override
  List<_i1.Column> get columns => [
        id,
        nodeId,
        chunkContent,
        embedding,
        createdAt,
      ];
}

class NodeEmbeddingInclude extends _i1.IncludeObject {
  NodeEmbeddingInclude._();

  @override
  Map<String, _i1.Include?> get includes => {};

  @override
  _i1.Table<int?> get table => NodeEmbedding.t;
}

class NodeEmbeddingIncludeList extends _i1.IncludeList {
  NodeEmbeddingIncludeList._({
    _i1.WhereExpressionBuilder<NodeEmbeddingTable>? where,
    super.limit,
    super.offset,
    super.orderBy,
    super.orderDescending,
    super.orderByList,
    super.include,
  }) {
    super.where = where?.call(NodeEmbedding.t);
  }

  @override
  Map<String, _i1.Include?> get includes => include?.includes ?? {};

  @override
  _i1.Table<int?> get table => NodeEmbedding.t;
}

class NodeEmbeddingRepository {
  const NodeEmbeddingRepository._();

  /// Returns a list of [NodeEmbedding]s matching the given query parameters.
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
  Future<List<NodeEmbedding>> find(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<NodeEmbeddingTable>? where,
    int? limit,
    int? offset,
    _i1.OrderByBuilder<NodeEmbeddingTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<NodeEmbeddingTable>? orderByList,
    _i1.Transaction? transaction,
  }) async {
    return session.db.find<NodeEmbedding>(
      where: where?.call(NodeEmbedding.t),
      orderBy: orderBy?.call(NodeEmbedding.t),
      orderByList: orderByList?.call(NodeEmbedding.t),
      orderDescending: orderDescending,
      limit: limit,
      offset: offset,
      transaction: transaction,
    );
  }

  /// Returns the first matching [NodeEmbedding] matching the given query parameters.
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
  Future<NodeEmbedding?> findFirstRow(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<NodeEmbeddingTable>? where,
    int? offset,
    _i1.OrderByBuilder<NodeEmbeddingTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<NodeEmbeddingTable>? orderByList,
    _i1.Transaction? transaction,
  }) async {
    return session.db.findFirstRow<NodeEmbedding>(
      where: where?.call(NodeEmbedding.t),
      orderBy: orderBy?.call(NodeEmbedding.t),
      orderByList: orderByList?.call(NodeEmbedding.t),
      orderDescending: orderDescending,
      offset: offset,
      transaction: transaction,
    );
  }

  /// Finds a single [NodeEmbedding] by its [id] or null if no such row exists.
  Future<NodeEmbedding?> findById(
    _i1.Session session,
    int id, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.findById<NodeEmbedding>(
      id,
      transaction: transaction,
    );
  }

  /// Inserts all [NodeEmbedding]s in the list and returns the inserted rows.
  ///
  /// The returned [NodeEmbedding]s will have their `id` fields set.
  ///
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// insert, none of the rows will be inserted.
  Future<List<NodeEmbedding>> insert(
    _i1.Session session,
    List<NodeEmbedding> rows, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.insert<NodeEmbedding>(
      rows,
      transaction: transaction,
    );
  }

  /// Inserts a single [NodeEmbedding] and returns the inserted row.
  ///
  /// The returned [NodeEmbedding] will have its `id` field set.
  Future<NodeEmbedding> insertRow(
    _i1.Session session,
    NodeEmbedding row, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.insertRow<NodeEmbedding>(
      row,
      transaction: transaction,
    );
  }

  /// Updates all [NodeEmbedding]s in the list and returns the updated rows. If
  /// [columns] is provided, only those columns will be updated. Defaults to
  /// all columns.
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// update, none of the rows will be updated.
  Future<List<NodeEmbedding>> update(
    _i1.Session session,
    List<NodeEmbedding> rows, {
    _i1.ColumnSelections<NodeEmbeddingTable>? columns,
    _i1.Transaction? transaction,
  }) async {
    return session.db.update<NodeEmbedding>(
      rows,
      columns: columns?.call(NodeEmbedding.t),
      transaction: transaction,
    );
  }

  /// Updates a single [NodeEmbedding]. The row needs to have its id set.
  /// Optionally, a list of [columns] can be provided to only update those
  /// columns. Defaults to all columns.
  Future<NodeEmbedding> updateRow(
    _i1.Session session,
    NodeEmbedding row, {
    _i1.ColumnSelections<NodeEmbeddingTable>? columns,
    _i1.Transaction? transaction,
  }) async {
    return session.db.updateRow<NodeEmbedding>(
      row,
      columns: columns?.call(NodeEmbedding.t),
      transaction: transaction,
    );
  }

  /// Deletes all [NodeEmbedding]s in the list and returns the deleted rows.
  /// This is an atomic operation, meaning that if one of the rows fail to
  /// be deleted, none of the rows will be deleted.
  Future<List<NodeEmbedding>> delete(
    _i1.Session session,
    List<NodeEmbedding> rows, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.delete<NodeEmbedding>(
      rows,
      transaction: transaction,
    );
  }

  /// Deletes a single [NodeEmbedding].
  Future<NodeEmbedding> deleteRow(
    _i1.Session session,
    NodeEmbedding row, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.deleteRow<NodeEmbedding>(
      row,
      transaction: transaction,
    );
  }

  /// Deletes all rows matching the [where] expression.
  Future<List<NodeEmbedding>> deleteWhere(
    _i1.Session session, {
    required _i1.WhereExpressionBuilder<NodeEmbeddingTable> where,
    _i1.Transaction? transaction,
  }) async {
    return session.db.deleteWhere<NodeEmbedding>(
      where: where(NodeEmbedding.t),
      transaction: transaction,
    );
  }

  /// Counts the number of rows matching the [where] expression. If omitted,
  /// will return the count of all rows in the table.
  Future<int> count(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<NodeEmbeddingTable>? where,
    int? limit,
    _i1.Transaction? transaction,
  }) async {
    return session.db.count<NodeEmbedding>(
      where: where?.call(NodeEmbedding.t),
      limit: limit,
      transaction: transaction,
    );
  }
}
