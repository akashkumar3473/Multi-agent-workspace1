from dependencies.auth_dependency import get_current_user
from utils.jwt_handler import create_access_token
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database.database import get_db

from models.user import User

from schemas.user_schema import (
    UserRegister,
    UserLogin
)

from utils.auth import (
    hash_password,
    verify_password
)

router = APIRouter()


@router.post("/register")
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(
            user.password
        )
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User registered successfully"
    }


@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    try:
        print("Step 1")

        existing_user = db.query(User).filter(
            User.email == user.email
        ).first()

        print("Step 2")

        if not existing_user:
            raise HTTPException(
                status_code=401,
                detail="Invalid Email"
            )

        print("Step 3")

        if not verify_password(
            user.password,
            existing_user.password
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid Password"
            )

        print("Step 4")

        token = create_access_token(
            {
                "user_id": existing_user.id,
                "email": existing_user.email
            }
        )

        print("Step 5")

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    except Exception as e:
        print("LOGIN ERROR:", repr(e))
        raise

    
@router.get("/me")
def get_profile(
    current_user=Depends(get_current_user)
):
    return {
        "user": current_user
    }