"""
Django settings for tom project.

Generated by 'django-admin startproject' using Django 4.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
from datetime import timedelta
from pathlib import Path

import dotenv
from django.core.management.utils import get_random_secret_key

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

STAGE = os.getenv("DJANGO_STAGE", "local")
if STAGE == "local":
    dotenv.load_dotenv(BASE_DIR / ".env.local")
else:
    dotenv.load_dotenv(BASE_DIR / ".env.prod")

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CSRF_TRUSTED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CORS_ALLOW_CREDENTIALS = True

AUTH_COOKIE = "access"
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24
AUTH_COOKIE_SECURE = os.getenv("AUTH_COOKIE_SECURE", "True") == "True"
AUTH_COOKIE_HTTPONLY = True
AUTH_COOKIE_PATH = "/"
AUTH_COOKIE_SAMESITE = os.getenv("AUTH_COOKIE_SAMESITE", "strict")

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'djoser',
    'corsheaders',
    'targets',
    'observations',
    'social_django',
    'helpers',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
]

SITE_ID = 1

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'tom.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend', 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tom.wsgi.application'

if os.getenv("ENGINE") == "django.db.backends.postgresql":
    DATABASES = {
        "default": {
            "ENGINE": os.getenv("ENGINE"),
            "NAME": os.getenv("DATABASE"),
            "USER": os.getenv("USER"),
            "PASSWORD": os.getenv("PASSWORD"),
            "HOST": os.getenv("DBHOST"),
            "PORT": os.getenv("PORT"),
        }
    }
elif os.getenv("ENGINE") == "django.db.backends.sqlite3":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Point the default user model to our custom user model
AUTH_USER_MODEL = "helpers.Users"


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

DATETIME_FORMAT = "%Y-%m-%d%H:%M:%S"
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILED_DRIS = [os.path.join(BASE_DIR, 'frontend', 'build', 'static')]

MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)


# DRF settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "helpers.authentication.TomJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        'rest_framework.permissions.IsAuthenticated',
    ]
}


# JWT settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": True,
    "SIGNING_KEY": os.getenv("SIGNING_KEY", None),
    "VERIFYING_KEY": os.getenv("VERIFYING_KEY", None),
    "ALGORITHM": os.getenv("ALGORITHM", "HS256")
}

REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_HTTPONLY": True,
}

DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,
    'PASSWORD_CHANGE_EMAIL_CONFIRMATION': False,
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'TOKEN_MODEL': None,
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': os.getenv('REDIRECT').split(','),
}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv("GOOGLE_OAUTH2_KEY", None)
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv("GOOGLE_OAUTH2_SECRET", None)
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ["https://www.googleapis.com/auth/userinfo.email",
                                   "https://www.googleapis.com/auth/userinfo.profile", "openid"]
SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ["first_name", "last_name"]
