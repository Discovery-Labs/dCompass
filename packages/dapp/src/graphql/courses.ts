import { gql } from "@apollo/client";

export const CREATE_COURSE_MUTATION = gql`
  mutation CreateCourse($course: CreateCourseInput!) {
    createCourse(input: $course) {
      id
      title
      description
      gitbook
      projects {
        id
        name
      }
    }
  }
`;

export const GET_ALL_COURSES_QUERY = gql`
  query GetAllCourses {
    getAllCourses {
      id
      title
      courseType
      difficulty
      description
      gitbook
      projects {
        id
        name
      }
      quests {
        id
        name
      }
    }
  }
`;

export const GET_COURSE_BY_ID_QUERY = gql`
  query GetCourseById($courseId: String!) {
    getCourseById(courseId: $courseId) {
      id
      title
      description
      courseType
      difficulty
      gitbook
      projects {
        id
        name
      }
      quests {
        id
        name
      }
    }
  }
`;
