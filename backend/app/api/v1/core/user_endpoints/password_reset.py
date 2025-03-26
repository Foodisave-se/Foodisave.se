from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.v1.core.schemas import (
    PasswordResetRequestSchema,
    PasswordResetConfirmSchema,
    ActivationConfirmSchema
)
from app.email import (
    get_user_by_email,
    generate_password_reset_token,
    send_password_reset_email,
    verify_password_reset_token,
    invalidate_password_reset_token,
    generate_activation_token,
    send_activation_email,
    verify_activation_token,
    invalidate_activation_token,
)
from app.db_setup import get_db
from app.security import hash_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/password-reset/request", status_code=status.HTTP_200_OK)
def request_password_reset(
    reset_request: PasswordResetRequestSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, reset_request.email)
    if not user:
        # Av säkerhetsskäl returnerar vi alltid samma meddelande
        return {"message": "Ett mail har skicakts med en länk för att återställa ditt lösenordet. Kontrollera att du angett rätt e-postadress, och att du har ett Foodisave konto om du inte mottagit något mail."}
    token = generate_password_reset_token(user_id=user.id, db=db)
    background_tasks.add_task(send_password_reset_email, reset_request.email, token)
    return {"message": "Ett mail har skicakts med en länk för att återställa ditt lösenordet. Kontrollera att du angett rätt e-postadress, och att du har ett Foodisave konto om du inte mottagit något mail."}

@router.post("/password-reset/confirm", status_code=status.HTTP_200_OK)
def confirm_password_reset(
    reset_confirm: PasswordResetConfirmSchema,
    db: Session = Depends(get_db)
):
    user = verify_password_reset_token(token=reset_confirm.token, db=db)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    if len(reset_confirm.new_password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters long")
    user.hashed_password = hash_password(reset_confirm.new_password)
    invalidate_password_reset_token(reset_confirm.token, db)
    db.commit()
    return {"message": "Vi har nu bytt ditt lösenord"}

@router.post("/activate/confirm", status_code=status.HTTP_200_OK)
def confirm_account_activation(
    activation_data: ActivationConfirmSchema,
    db: Session = Depends(get_db)
):
    user = verify_activation_token(token=activation_data.token, db=db)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired activation token")
    user.is_active = True
    invalidate_activation_token(activation_data.token, db)
    db.commit()
    return {"message": "Ditt konto har nu aktiverats"}
