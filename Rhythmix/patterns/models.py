# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class Pattern(models.Model):
    notes = models.CharField(max_length=50)

from django.contrib import admin

admin.site.register(Pattern)
