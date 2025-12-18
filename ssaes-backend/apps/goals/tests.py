from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Goal
from apps.accounts.models import Student

User = get_user_model()

class GoalAPITestCase(APITestCase):

    def setUp(self):
        # Create users
        self.admin_user = User.objects.create_user(username='admin', password='adminpass', role='ADMIN')
        self.faculty_user = User.objects.create_user(username='faculty', password='facultypass', role='FACULTY')
        self.student_user = User.objects.create_user(username='student', password='studentpass', role='STUDENT')
        
        # Create a student profile
        self.student_profile = Student.objects.create(user=self.student_user)
        
        # Create a goal for student
        self.goal = Goal.objects.create(title='Test Goal', description='Test Desc', student=self.student_profile)

        self.url = '/api/goals/'  # Adjust if your router URL is different

    def test_student_can_view_own_goal(self):
        self.client.login(username='student', password='studentpass')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_student_cannot_create_goal(self):
        self.client.login(username='student', password='studentpass')
        data = {'title': 'New Goal', 'description': 'Desc', 'student': self.student_profile.id}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_faculty_can_create_goal(self):
        self.client.login(username='faculty', password='facultypass')
        data = {'title': 'Faculty Goal', 'description': 'Desc', 'student': self.student_profile.id}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_can_update_goal(self):
        self.client.login(username='admin', password='adminpass')
        data = {'title': 'Updated Goal'}
        response = self.client.patch(f'{self.url}{self.goal.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.goal.refresh_from_db()
        self.assertEqual(self.goal.title, 'Updated Goal')

    def test_anonymous_cannot_access(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
