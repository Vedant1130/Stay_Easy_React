from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('search/', views.searchListings.as_view(), name='search_listings'),
    path('filter/', views.filter.as_view(), name='filter_listings'),
    path('categories/',views.CategoryList.as_view(), name='category-list'),
    path('logout/', views.logout, name='logout'),
    path('register/', views.register, name='register'),
    path('home/', views.index, name='listing-index'),   
    path('show/<int:id>/', views.show_listing, name='show_listing'),
    path('update/<int:id>/', views.update_listing, name='update-listing'),
    path('delete/<int:id>/', views.delete_listing, name='delete-listing'),
    path('create-listing/', views.create_listing, name='create_listing'),
    path('authenticated/', views.is_authenticated)
]