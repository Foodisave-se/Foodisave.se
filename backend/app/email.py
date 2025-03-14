import json
import secrets
from datetime import datetime, timedelta, timezone
import requests
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.api.v1.core.models import PasswordResetToken, ActivationToken, Users
from app.settings import settings

def get_user_by_email(session: Session, email: str) -> Users | None:
    return session.scalars(select(Users).where(Users.email == email)).first()

def generate_password_reset_token(user_id: int, db: Session) -> str:
    token = secrets.token_urlsafe(32)
    reset_token = PasswordResetToken(token=token, user_id=user_id)
    db.add(reset_token)
    db.commit()
    return token

def send_password_reset_email(email: str, token: str):
    reset_url = f"{settings.FRONTEND_BASE_URL}/reset-password?token={token}"
    message = {
        "From": "noreply@yourdomain.com",  # Uppdatera med din avsändaradress
        "To": email,
        "Subject": "Password Reset Request",
        "HtmlBody": f"""
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password.</p>
            <p>Please click the link below to reset your password:</p>
            <p><a href="{reset_url}">Reset Password</a></p>
            <p>This link will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
        """,
        "MessageStream": "outbound"
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": settings.POSTMARK_TOKEN,
    }
    try:
        response = requests.post("https://api.postmarkapp.com/email", headers=headers, data=json.dumps(message))
        response.raise_for_status()
        print(f"Password reset email sent to {email}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to send password reset email to {email}: {e}")

def verify_password_reset_token(token: str, db: Session) -> Users | None:
    expiry_time = datetime.now(timezone.utc) - timedelta(minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)
    db_token = db.scalars(
        select(PasswordResetToken).where(
            PasswordResetToken.token == token,
            PasswordResetToken.created >= expiry_time,
            PasswordResetToken.used == False
        )
    ).first()
    if not db_token:
        return None
    return db_token.user

def invalidate_password_reset_token(token: str, db: Session) -> bool:
    db_token = db.scalars(select(PasswordResetToken).where(PasswordResetToken.token == token)).first()
    if not db_token:
        return False
    db_token.used = True
    db.commit()
    return True

# Funktioner för kontoverifiering

def generate_activation_token(user_id: int, db: Session) -> str:
    token = secrets.token_urlsafe(32)
    activation_token = ActivationToken(token=token, user_id=user_id)
    db.add(activation_token)
    db.commit()
    return token

def send_activation_email(email: str, token: str):
    activation_url = f"{settings.FRONTEND_BASE_URL}/activate-account?token={token}"
    message = {
        "From": "noreply@yourdomain.com",  # Uppdatera med din avsändaradress
        "To": email,
        "Subject": "Account Activation",
        "HtmlBody": f"""
            <h2>Activate Your Account</h2>
            <p>Thank you for registering. Please click the link below to activate your account:</p>
            <p><a href="{activation_url}">Activate Account</a></p>
            <p>If you did not register, please ignore this email.</p>
        """,
        "MessageStream": "outbound"
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": settings.POSTMARK_TOKEN,
    }
    try:
        response = requests.post("https://api.postmarkapp.com/email", headers=headers, data=json.dumps(message))
        response.raise_for_status()
        print(f"Activation email sent to {email}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to send activation email to {email}: {e}")

def verify_activation_token(token: str, db: Session) -> Users | None:
    # Exempelvis låt aktiveringstoken ha en giltighet på 24 timmar
    expiry_time = datetime.now(timezone.utc) - timedelta(hours=24)
    db_token = db.scalars(
        select(ActivationToken).where(
            ActivationToken.token == token,
            ActivationToken.created >= expiry_time,
            ActivationToken.used == False
        )
    ).first()
    if not db_token:
        return None
    return db_token.user

def invalidate_activation_token(token: str, db: Session) -> bool:
    db_token = db.scalars(select(ActivationToken).where(ActivationToken.token == token)).first()
    if not db_token:
        return False
    db_token.used = True
    db.commit()
    return True
