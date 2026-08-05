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

abstract class CourseNode
    implements _i1.TableRow<int?>, _i1.ProtocolSerialization {
  CourseNode._({
    this.id,
    required this.courseId,
    this.parentId,
    this.path,
    required this.nodeType,
    required this.title,
    this.content,
    required this.position,
    required this.version,
    this.createdAt,
  });

  factory CourseNode({
    int? id,
    required _i1.UuidValue courseId,
    _i1.UuidValue? parentId,
    String? path,
    required String nodeType,
    required String title,
    String? content,
    required int position,
    required int version,
    DateTime? createdAt,
  }) = _CourseNodeImpl;

  factory CourseNode.fromJson(Map<String, dynamic> jsonSerialization) {
    return CourseNode(
      id: jsonSerialization['id'] as int?,
      courseId:
          _i1.UuidValueJsonExtension.fromJson(jsonSerialization['courseId']),
      parentId: jsonSerialization['parentId'] == null
          ? null
          : _i1.UuidValueJsonExtension.fromJson(jsonSerialization['parentId']),
      path: jsonSerialization['path'] as String?,
      nodeType: jsonSerialization['nodeType'] as String,
      title: jsonSerialization['title'] as String,
      content: jsonSerialization['content'] as String?,
      position: jsonSerialization['position'] as int,
      version: jsonSerialization['version'] as int,
      createdAt: jsonSerialization['createdAt'] == null
          ? null
          : _i1.DateTimeJsonExtension.fromJson(jsonSerialization['createdAt']),
    );
  }

  static final t = CourseNodeTable();

  static const db = CourseNodeRepository._();

  @override
  int? id;

  _i1.UuidValue courseId;

  _i1.UuidValue? parentId;

  String? path;

  String nodeType;

  String title;

  String? content;

  int position;

  int version;

  DateTime? createdAt;

  @override
  _i1.Table<int?> get table => t;

  /// Returns a shallow copy of this [CourseNode]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  CourseNode copyWith({
    int? id,
    _i1.UuidValue? courseId,
    _i1.UuidValue? parentId,
    String? path,
    String? nodeType,
    String? title,
    String? content,
    int? position,
    int? version,
    DateTime? createdAt,
  });
  @override
  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'courseId': courseId.toJson(),
      if (parentId != null) 'parentId': parentId?.toJson(),
      if (path != null) 'path': path,
      'nodeType': nodeType,
      'title': title,
      if (content != null) 'content': content,
      'position': position,
      'version': version,
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  @override
  Map<String, dynamic> toJsonForProtocol() {
    return {
      if (id != null) 'id': id,
      'courseId': courseId.toJson(),
      if (parentId != null) 'parentId': parentId?.toJson(),
      if (path != null) 'path': path,
      'nodeType': nodeType,
      'title': title,
      if (content != null) 'content': content,
      'position': position,
      'version': version,
      if (createdAt != null) 'createdAt': createdAt?.toJson(),
    };
  }

  static CourseNodeInclude include() {
    return CourseNodeInclude._();
  }

  static CourseNodeIncludeList includeList({
    _i1.WhereExpressionBuilder<CourseNodeTable>? where,
    int? limit,
    int? offset,
    _i1.OrderByBuilder<CourseNodeTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<CourseNodeTable>? orderByList,
    CourseNodeInclude? include,
  }) {
    return CourseNodeIncludeList._(
      where: where,
      limit: limit,
      offset: offset,
      orderBy: orderBy?.call(CourseNode.t),
      orderDescending: orderDescending,
      orderByList: orderByList?.call(CourseNode.t),
      include: include,
    );
  }

  @override
  String toString() {
    return _i1.SerializationManager.encode(this);
  }
}

class _Undefined {}

class _CourseNodeImpl extends CourseNode {
  _CourseNodeImpl({
    int? id,
    required _i1.UuidValue courseId,
    _i1.UuidValue? parentId,
    String? path,
    required String nodeType,
    required String title,
    String? content,
    required int position,
    required int version,
    DateTime? createdAt,
  }) : super._(
          id: id,
          courseId: courseId,
          parentId: parentId,
          path: path,
          nodeType: nodeType,
          title: title,
          content: content,
          position: position,
          version: version,
          createdAt: createdAt,
        );

  /// Returns a shallow copy of this [CourseNode]
  /// with some or all fields replaced by the given arguments.
  @_i1.useResult
  @override
  CourseNode copyWith({
    Object? id = _Undefined,
    _i1.UuidValue? courseId,
    Object? parentId = _Undefined,
    Object? path = _Undefined,
    String? nodeType,
    String? title,
    Object? content = _Undefined,
    int? position,
    int? version,
    Object? createdAt = _Undefined,
  }) {
    return CourseNode(
      id: id is int? ? id : this.id,
      courseId: courseId ?? this.courseId,
      parentId: parentId is _i1.UuidValue? ? parentId : this.parentId,
      path: path is String? ? path : this.path,
      nodeType: nodeType ?? this.nodeType,
      title: title ?? this.title,
      content: content is String? ? content : this.content,
      position: position ?? this.position,
      version: version ?? this.version,
      createdAt: createdAt is DateTime? ? createdAt : this.createdAt,
    );
  }
}

class CourseNodeTable extends _i1.Table<int?> {
  CourseNodeTable({super.tableRelation}) : super(tableName: 'course_nodes') {
    courseId = _i1.ColumnUuid(
      'courseId',
      this,
    );
    parentId = _i1.ColumnUuid(
      'parentId',
      this,
    );
    path = _i1.ColumnString(
      'path',
      this,
    );
    nodeType = _i1.ColumnString(
      'nodeType',
      this,
    );
    title = _i1.ColumnString(
      'title',
      this,
    );
    content = _i1.ColumnString(
      'content',
      this,
    );
    position = _i1.ColumnInt(
      'position',
      this,
    );
    version = _i1.ColumnInt(
      'version',
      this,
    );
    createdAt = _i1.ColumnDateTime(
      'createdAt',
      this,
    );
  }

  late final _i1.ColumnUuid courseId;

  late final _i1.ColumnUuid parentId;

  late final _i1.ColumnString path;

  late final _i1.ColumnString nodeType;

  late final _i1.ColumnString title;

  late final _i1.ColumnString content;

  late final _i1.ColumnInt position;

  late final _i1.ColumnInt version;

  late final _i1.ColumnDateTime createdAt;

  @override
  List<_i1.Column> get columns => [
        id,
        courseId,
        parentId,
        path,
        nodeType,
        title,
        content,
        position,
        version,
        createdAt,
      ];
}

class CourseNodeInclude extends _i1.IncludeObject {
  CourseNodeInclude._();

  @override
  Map<String, _i1.Include?> get includes => {};

  @override
  _i1.Table<int?> get table => CourseNode.t;
}

class CourseNodeIncludeList extends _i1.IncludeList {
  CourseNodeIncludeList._({
    _i1.WhereExpressionBuilder<CourseNodeTable>? where,
    super.limit,
    super.offset,
    super.orderBy,
    super.orderDescending,
    super.orderByList,
    super.include,
  }) {
    super.where = where?.call(CourseNode.t);
  }

  @override
  Map<String, _i1.Include?> get includes => include?.includes ?? {};

  @override
  _i1.Table<int?> get table => CourseNode.t;
}

class CourseNodeRepository {
  const CourseNodeRepository._();

  /// Returns a list of [CourseNode]s matching the given query parameters.
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
  Future<List<CourseNode>> find(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<CourseNodeTable>? where,
    int? limit,
    int? offset,
    _i1.OrderByBuilder<CourseNodeTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<CourseNodeTable>? orderByList,
    _i1.Transaction? transaction,
  }) async {
    return session.db.find<CourseNode>(
      where: where?.call(CourseNode.t),
      orderBy: orderBy?.call(CourseNode.t),
      orderByList: orderByList?.call(CourseNode.t),
      orderDescending: orderDescending,
      limit: limit,
      offset: offset,
      transaction: transaction,
    );
  }

  /// Returns the first matching [CourseNode] matching the given query parameters.
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
  Future<CourseNode?> findFirstRow(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<CourseNodeTable>? where,
    int? offset,
    _i1.OrderByBuilder<CourseNodeTable>? orderBy,
    bool orderDescending = false,
    _i1.OrderByListBuilder<CourseNodeTable>? orderByList,
    _i1.Transaction? transaction,
  }) async {
    return session.db.findFirstRow<CourseNode>(
      where: where?.call(CourseNode.t),
      orderBy: orderBy?.call(CourseNode.t),
      orderByList: orderByList?.call(CourseNode.t),
      orderDescending: orderDescending,
      offset: offset,
      transaction: transaction,
    );
  }

  /// Finds a single [CourseNode] by its [id] or null if no such row exists.
  Future<CourseNode?> findById(
    _i1.Session session,
    int id, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.findById<CourseNode>(
      id,
      transaction: transaction,
    );
  }

  /// Inserts all [CourseNode]s in the list and returns the inserted rows.
  ///
  /// The returned [CourseNode]s will have their `id` fields set.
  ///
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// insert, none of the rows will be inserted.
  Future<List<CourseNode>> insert(
    _i1.Session session,
    List<CourseNode> rows, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.insert<CourseNode>(
      rows,
      transaction: transaction,
    );
  }

  /// Inserts a single [CourseNode] and returns the inserted row.
  ///
  /// The returned [CourseNode] will have its `id` field set.
  Future<CourseNode> insertRow(
    _i1.Session session,
    CourseNode row, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.insertRow<CourseNode>(
      row,
      transaction: transaction,
    );
  }

  /// Updates all [CourseNode]s in the list and returns the updated rows. If
  /// [columns] is provided, only those columns will be updated. Defaults to
  /// all columns.
  /// This is an atomic operation, meaning that if one of the rows fails to
  /// update, none of the rows will be updated.
  Future<List<CourseNode>> update(
    _i1.Session session,
    List<CourseNode> rows, {
    _i1.ColumnSelections<CourseNodeTable>? columns,
    _i1.Transaction? transaction,
  }) async {
    return session.db.update<CourseNode>(
      rows,
      columns: columns?.call(CourseNode.t),
      transaction: transaction,
    );
  }

  /// Updates a single [CourseNode]. The row needs to have its id set.
  /// Optionally, a list of [columns] can be provided to only update those
  /// columns. Defaults to all columns.
  Future<CourseNode> updateRow(
    _i1.Session session,
    CourseNode row, {
    _i1.ColumnSelections<CourseNodeTable>? columns,
    _i1.Transaction? transaction,
  }) async {
    return session.db.updateRow<CourseNode>(
      row,
      columns: columns?.call(CourseNode.t),
      transaction: transaction,
    );
  }

  /// Deletes all [CourseNode]s in the list and returns the deleted rows.
  /// This is an atomic operation, meaning that if one of the rows fail to
  /// be deleted, none of the rows will be deleted.
  Future<List<CourseNode>> delete(
    _i1.Session session,
    List<CourseNode> rows, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.delete<CourseNode>(
      rows,
      transaction: transaction,
    );
  }

  /// Deletes a single [CourseNode].
  Future<CourseNode> deleteRow(
    _i1.Session session,
    CourseNode row, {
    _i1.Transaction? transaction,
  }) async {
    return session.db.deleteRow<CourseNode>(
      row,
      transaction: transaction,
    );
  }

  /// Deletes all rows matching the [where] expression.
  Future<List<CourseNode>> deleteWhere(
    _i1.Session session, {
    required _i1.WhereExpressionBuilder<CourseNodeTable> where,
    _i1.Transaction? transaction,
  }) async {
    return session.db.deleteWhere<CourseNode>(
      where: where(CourseNode.t),
      transaction: transaction,
    );
  }

  /// Counts the number of rows matching the [where] expression. If omitted,
  /// will return the count of all rows in the table.
  Future<int> count(
    _i1.Session session, {
    _i1.WhereExpressionBuilder<CourseNodeTable>? where,
    int? limit,
    _i1.Transaction? transaction,
  }) async {
    return session.db.count<CourseNode>(
      where: where?.call(CourseNode.t),
      limit: limit,
      transaction: transaction,
    );
  }
}
