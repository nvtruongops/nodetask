import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

class CourseEndpoint extends Endpoint {
  Future<List<Course>> getCourses(Session session) async {
    return await Course.db.find(session);
  }

  Future<Course> createCourse(Session session, Course course) async {
    return await Course.db.insertRow(session, course);
  }

  Future<List<CourseNode>> getCourseTree(Session session, UuidValue courseId) async {
    // Read hierarchy nodes using course_parent_pos_idx
    return await CourseNode.db.find(
      session,
      where: (t) => t.courseId.equals(courseId),
      orderBy: (t) => t.position,
    );
  }
}
