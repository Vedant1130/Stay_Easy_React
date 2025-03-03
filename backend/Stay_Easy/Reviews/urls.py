from django.urls import path
from . import views

urlpatterns =[
    path('create/<int:listing_id>/', views.create_review, name='create-review'),
    path('delete/<int:listing_id>/review/<int:review_id>/', views.delete_review, name='delete-review'),
]
