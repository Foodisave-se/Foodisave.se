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
        "From": "no.reply@foodisave.se",
        "To": email,
        "Subject": "Återställ ditt lösenord",
        "HtmlBody": f"""
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!-- Dessa meta-taggar signalerar att mejlet ska ses som "dark mode" -->
            <meta name="color-scheme" content="dark" />
            <meta name="supported-color-schemes" content="dark" />
            <title>Återställ ditt lösenord</title>
        </head>
        <!-- bgcolor och style med !important för att övertyga vissa klienter -->
        <body bgcolor="#000000"
              style="margin: 0; padding: 0; background-color: #000000 !important; font-family: Arial, sans-serif; color: #ffffff !important;">
            
            <!-- Huvudbehållare -->
            <table role="presentation"
                   border="0"
                   cellpadding="0"
                   cellspacing="0"
                   width="100%"
                   bgcolor="#000000"
                   style="background-color: #000000 !important; color: #ffffff !important;">
                <tr>
                    <td align="center"
                        bgcolor="#000000"
                        style="padding: 20px; background-color: #000000 !important;">
                        
                        <!-- Stor text istället för logga -->
                        <div style="font-size: 40px; font-weight: bold; color: #ffffff !important;">
                            Foodisave
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center"
                        bgcolor="#000000"
                        style="padding: 20px; background-color: #000000 !important;">
                        
                        <!-- Innehållsbehållare -->
                        <table border="0"
                               cellpadding="0"
                               cellspacing="0"
                               style="width: 100%; max-width: 600px;
                                      background-color: #1a1a1a !important;
                                      border-radius: 8px;">
                            <tr>
                                <td style="padding: 30px;
                                           font-size: 16px;
                                           line-height: 1.5;
                                           color: #ffffff !important;">
                                    <h2 style="margin-top: 0; margin-bottom: 16px; color: #ffffff !important;">
                                        Hej,
                                    </h2>
                                    <p style="margin-top: 0; margin-bottom: 16px; color: #ffffff !important;">
                                        Du har bett att få ditt lösenord återställt.<br />
                                        Om det inte var du som bad om detta, kan du ignorera detta mejl.<br />
                                        Om det var du som bad om återställning av lösenord, vänligen klicka på knappen nedan.
                                    </p>
                                    <div style="text-align: center; margin: 24px 0;">
                                        <a href="{reset_url}"
                                           style="background-color: #007aff !important;
                                                  color: #ffffff !important;
                                                  text-decoration: none;
                                                  padding: 12px 24px;
                                                  border-radius: 4px;
                                                  font-weight: bold;
                                                  display: inline-block;">
                                            Återställ lösenord
                                        </a>
                                    </div>
                                    <p style="margin-bottom: 0; color: #ffffff !important;">
                                        Hälsningar,<br />
                                        Foodisave
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
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
        "From": "no.reply@foodisave.se",  # Din avsändaradress
        "To": email,
        "Subject": "Välkommen till Foodisave – Aktivera ditt konto",
        "HtmlBody": f"""
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <!-- Hjälper vissa klienter att förstå att mejlet är anpassat för mörkt läge -->
            <meta name="color-scheme" content="dark" />
            <meta name="supported-color-schemes" content="dark" />
            <title>Aktivera ditt konto</title>
        </head>
        <!-- bgcolor och inline-style med !important för att tvinga svart bakgrund -->
        <body bgcolor="#000000"
              style="margin: 0; padding: 0; background-color: #000000 !important; font-family: Arial, sans-serif; color: #ffffff !important;">
            
            <!-- Huvudbehållare -->
            <table role="presentation"
                   border="0"
                   cellpadding="0"
                   cellspacing="0"
                   width="100%"
                   bgcolor="#000000"
                   style="background-color: #000000 !important; color: #ffffff !important;">
                <tr>
                    <td align="center"
                        bgcolor="#000000"
                        style="padding: 20px; background-color: #000000 !important;">
                        
                        <!-- Stor text istället för logga -->
                        <div style="font-size: 40px; font-weight: bold; color: #ffffff !important;">
                            Foodisave
                        </div>
                    </td>
                </tr>
                <tr>
                    <td align="center"
                        bgcolor="#000000"
                        style="padding: 20px; background-color: #000000 !important;">
                        
                        <!-- Innehållsbehållare -->
                        <table border="0"
                               cellpadding="0"
                               cellspacing="0"
                               style="width: 100%; max-width: 600px;
                                      background-color: #1a1a1a !important;
                                      border-radius: 8px;">
                            <tr>
                                <td style="padding: 30px;
                                           font-size: 16px;
                                           line-height: 1.5;
                                           color: #ffffff !important;">
                                    <h2 style="margin-top: 0; margin-bottom: 16px; color: #ffffff !important;">
                                        Välkommen!
                                    </h2>
                                    <p style="margin-top: 0; margin-bottom: 16px; color: #ffffff !important;">
                                        Tack för att du har registrerat dig hos Foodisave.<br />
                                        För att aktivera ditt konto, klicka på knappen nedan.
                                    </p>
                                    <div style="text-align: center; margin: 24px 0;">
                                        <a href="{activation_url}"
                                           style="background-color: #007aff !important;
                                                  color: #ffffff !important;
                                                  text-decoration: none;
                                                  padding: 12px 24px;
                                                  border-radius: 4px;
                                                  font-weight: bold;
                                                  display: inline-block;">
                                            Aktivera ditt konto
                                        </a>
                                    </div>
                                    <p style="margin-bottom: 0; color: #ffffff !important;">
                                        Om du inte har registrerat dig hos Foodisave kan du ignorera detta mejl.
                                    </p>
                                    <p style="margin-bottom: 0; color: #ffffff !important;">
                                        Hälsningar,<br />
                                        Foodisave
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
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
