from django.db import models

class User(models.Model):
    class Meta:
        db_table = "users"

    id = models.BigAutoField(primary_key = True)
    user_id = models.CharField(max_length = 30, null = False, blank = False, unique = True)
    face_detect_data = models.TextField(null = False, blank = False)

class TypeDetect(models.Model):
    class Meta:
        db_table = "type_detects"

    id = models.BigAutoField(primary_key = True)
    type_name = models.CharField(max_length = 200, null = False, blank = False)
    created_at = models.DateTimeField(auto_now_add = True, null = False, blank = False)
    updated_at = models.DateTimeField(auto_now = True, null = False, blank = False)

class HistoryDetect(models.Model):
    class Meta:
        db_table = "history_detects"

    id = models.BigAutoField(primary_key = True)
    user = models.ForeignKey(User, on_delete = models.SET_NULL, null = True, blank = True, default = None)
    type_detect_id = models.ForeignKey(TypeDetect, on_delete = models.CASCADE, null = False, blank = False)
    image_detect_id = models.CharField(max_length = 100, null = False, blank = False, unique = True)
    success = models.BooleanField(null = False, blank = False, default = False)
    created_at = models.DateTimeField(auto_now_add = True, null = False, blank = False)