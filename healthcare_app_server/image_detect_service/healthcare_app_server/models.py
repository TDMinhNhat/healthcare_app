from django.db import models

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
    user_id = models.CharField(max_length = 25, null = False, blank = False, unique = True)
    type_detect_id = models.ForeignKey(TypeDetect, on_delete = models.CASCADE, null = False, blank = False)
    image_detect_id = models.CharField(max_length = 100, null = False, blank = False, unique = True)
    success = models.BooleanField(null = False, blank = False, default = False)
    created_at = models.DateTimeField(auto_now_add = True, null = False, blank = False)

