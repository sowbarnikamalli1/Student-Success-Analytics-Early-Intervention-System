# alerts/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.alerts.models import Alert
from apps.goals.models import Goal
from apps.accounts.models import Student

# Signal to create an alert when a Goal is updated or created
@receiver(post_save, sender=Goal)
def create_goal_alert(sender, instance, created, **kwargs):
    """
    Automatically create an alert for a student when a new goal is set
    or an existing goal is updated.
    """
    if created:
        message = f"New goal '{instance.title}' has been created for you."
    else:
        message = f"Your goal '{instance.title}' has been updated."
    
    Alert.objects.create(
        student=instance.student,
        message=message,
        level='INFO'  # Example: INFO, WARNING, CRITICAL
    )

# Signal to create alerts for students marked at risk
@receiver(post_save, sender=Student)
def create_risk_alert(sender, instance, created, **kwargs):
    """
    Create an alert if a student's status changes to 'at risk'.
    """
    if not created and instance.status == 'AT_RISK':
        Alert.objects.create(
            student=instance,
            message="You have been identified as at-risk. Please take action.",
            level='WARNING'
        )
