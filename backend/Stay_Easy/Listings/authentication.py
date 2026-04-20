from rest_framework_simplejwt.authentication import JWTAuthentication

class CookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')

        # ✅ Check Authorization header if cookies are missing
        if not access_token:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                access_token = auth_header.split(" ")[1]  # Extract token after "Bearer"
        
        if not access_token:
            return None  # No token found, return anonymous user

        validated_token = self.get_validated_token(access_token)

        try:
            user = self.get_user(validated_token)
        except:
            return None
        return (user, validated_token)