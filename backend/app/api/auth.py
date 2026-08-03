from fastapi import APIRouter, HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate):
    existing_user = await User.find_one(User.email == user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role_preference=user_in.role_preference,
        city=user_in.city,
        skills=user_in.skills
    )
    await user.insert()

    access_token = create_access_token(data={"sub": str(user.id)})
    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        role_preference=user.role_preference,
        city=user.city,
        skills=user.skills,
        created_at=user.created_at
    )
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await User.find_one(User.email == credentials.email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    user_response = UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        role_preference=user.role_preference,
        city=user.city,
        skills=user.skills,
        created_at=user.created_at
    )
    return Token(access_token=access_token, token_type="bearer", user=user_response)
