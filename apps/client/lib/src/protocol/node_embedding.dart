/* AUTOMATICALLY GENERATED CODE DO NOT MODIFY */
/*   To generate run: "serverpod generate"    */

// ignore_for_file: implementation_imports
// ignore_for_file: library_private_types_in_public_api
// ignore_for_file: non_constant_identifier_names
// ignore_for_file: public_member_api_docs
// ignore_for_file: type_literal_in_constant_pattern
// ignore_for_file: use_super_parameters

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:serverpod_client/serverpod_client.dart' as _i1;

abstract class NodeEmbedding implements _i1.SerializableModel {
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

  /// The database id, set if the object has been inserted into the
  /// database or if it has been fetched from the database. Otherwise,
  /// the id will be null.
  int? id;

  _i1.UuidValue nodeId;

  String chunkContent;

  String embedding;

  DateTime? createdAt;

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
