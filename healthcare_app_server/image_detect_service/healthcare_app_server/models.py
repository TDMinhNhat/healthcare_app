from django.db import models

class User(models.Model):
    class Meta:
        db_table = "users"

    id = models.BigAutoField(primary_key = True)
    user_id = models.CharField(max_length = 30, null = False, blank = False, unique = True)
    face_encode_value = models.TextField(null = False, blank = False, default = "")