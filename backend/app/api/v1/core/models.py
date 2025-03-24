from datetime import datetime, timezone
from enum import Enum
from typing import List

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
    Numeric
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)


class Recipes(Base):
    __tablename__ = "recipes"
    name: Mapped[str] = mapped_column(String(100))
    ingredients: Mapped[str] = mapped_column(Text)
    cook_time: Mapped[str] = mapped_column(Text, nullable=True)
    calories: Mapped[float] = mapped_column(Numeric, nullable=True)
    protein: Mapped[float] = mapped_column(Numeric, nullable=True)
    carbohydrates: Mapped[float] = mapped_column(Numeric, nullable=True)
    fat: Mapped[float] = mapped_column(Numeric, nullable=True)
    images: Mapped[str] = mapped_column(Text, nullable=True)
    ratings_count: Mapped[float] = mapped_column(Numeric, nullable=True)
    rating: Mapped[float] = mapped_column(Numeric, nullable=True)
    recipe_url: Mapped[str] = mapped_column(Text, nullable=True)
    
    reviews: Mapped["Reviews"] = relationship(
        back_populates="recipes"
    )
    recipe_saved: Mapped[list["SavedRecipes"]] = relationship(
        "SavedRecipes",
        back_populates="recipes"
    )

    def __repr__(self):
        return f"<recipes={self.name}>"
    
class Token(Base):
    __tablename__ = "tokens"

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now() 
    )
    token: Mapped[str] = mapped_column(unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    user: Mapped["Users"] = relationship(back_populates="tokens")


class Users(Base):
    __tablename__ = "users"
    first_name: Mapped[str] = mapped_column(String(255))
    last_name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(150), unique=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    credits: Mapped[int] = mapped_column(Integer, default=100)
    hashed_password: Mapped[str] = mapped_column(String(150))
    last_credit_refill: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_login_credit: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_recipe_saved_credit: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now() 
    )
    level: Mapped[int]
    user_recipes: Mapped[list["UserRecipes"]] = relationship(
        back_populates="user"
    )
    tokens: Mapped[list["Token"]] = relationship(
        back_populates="user")

    images: Mapped["Images"] = relationship(
        back_populates="user"
    )
    comments: Mapped["Comments"] = relationship(
        back_populates="user"
    )
    reviews: Mapped["Reviews"] = relationship(
        back_populates="user"
    )
    messages_sender: Mapped[list["Messages"]] = relationship(
        "Messages",
        foreign_keys="Messages.sender_user_id",
        back_populates="user_sender"
    )
    messages_receiver: Mapped[list["Messages"]] = relationship(
        "Messages",
        foreign_keys="Messages.receiver_user_id",
        back_populates="user_receiver"
    )
    following: Mapped[list["UserFollows"]] = relationship(
        "UserFollows",
        foreign_keys="[UserFollows.follower_user_id]",
        back_populates="follower"
    )
    followers: Mapped[list["UserFollows"]] = relationship(
        "UserFollows",
        foreign_keys="[UserFollows.followee_user_id]",
        back_populates="followee"
    )
    user_saving_user_recipes: Mapped[list["SavedUserRecipes"]] = relationship(
        "SavedUserRecipes",
        back_populates="user"
    )
    user_saving_recipes: Mapped[list["SavedRecipes"]] = relationship(
        "SavedRecipes",
        back_populates="user"
    )
    saved_items: Mapped[list["SavedItems"]] = relationship(
        back_populates="user"
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    # Relationer till våra token-tabeller
    reset_tokens: Mapped[list["PasswordResetToken"]] = relationship("PasswordResetToken", back_populates="user")
    activation_tokens: Mapped[list["ActivationToken"]] = relationship("ActivationToken", back_populates="user")

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.full_name})>"


class UserRecipes(Base):
    __tablename__ = "user_recipes"
    name: Mapped[str] = mapped_column(String(100))
    descriptions: Mapped[str] = mapped_column(Text)
    ingredients: Mapped[str] = mapped_column(Text)
    instructions: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(Text, nullable=True)
    cook_time: Mapped[str] = mapped_column(Text, nullable=True)
    calories: Mapped[float] = mapped_column(Numeric, nullable=True)
    protein: Mapped[float] = mapped_column(Numeric, nullable=True)
    carbohydrates: Mapped[float] = mapped_column(Numeric, nullable=True)
    fat: Mapped[float] = mapped_column(Numeric, nullable=True)
    is_ai: Mapped[bool] = mapped_column(Boolean, default=False)
    servings: Mapped[int]
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()  # Uses database server time
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user: Mapped["Users"] = relationship(
        back_populates="user_recipes"
    )
    images: Mapped["Images"] = relationship(
        back_populates="user_recipes"
    )
    comments: Mapped["Comments"] = relationship(
        back_populates="user_recipes"
    )
    user_recipe_saved: Mapped[list["SavedUserRecipes"]] = relationship(
        "SavedUserRecipes",
        back_populates="user_recipes"
    )
    
    

    def __repr__(self):
        return f"<recipes={self.name}>"


class Images(Base):
    __tablename__ = "images"
    link: Mapped[str] = mapped_column(String(255))
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_recipes_id: Mapped[int] = mapped_column(
        ForeignKey("user_recipes.id", ondelete="SET NULL"), nullable=True)
    user: Mapped["Users"] = relationship(
        back_populates="images"
    )
    user_recipes: Mapped["UserRecipes"] = relationship(
        back_populates="images"
    )


class Comments(Base):
    __tablename__ = "comments"
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()  # Uses database server time
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_recipes_id: Mapped[int] = mapped_column(
        ForeignKey("user_recipes.id", ondelete="SET NULL"), nullable=True)
    user: Mapped["Users"] = relationship(
        back_populates="comments"
    )
    user_recipes: Mapped["UserRecipes"] = relationship(
        back_populates="comments"
    )


class Reviews(Base):
    __tablename__ = "reviews"
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    recipes_id: Mapped[int] = mapped_column(
        ForeignKey("recipes.id", ondelete="SET NULL"), nullable=True)
    user: Mapped["Users"] = relationship(
        back_populates="reviews"
    )
    recipes: Mapped["Recipes"] = relationship(
        back_populates="reviews"
    )


class Messages(Base):
    __tablename__ = "messages"
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()  # Uses database server time
    )
    sender_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    receiver_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user_sender: Mapped["Users"] = relationship(
        "Users", foreign_keys=[sender_user_id],
        back_populates="messages_sender"
    )
    user_receiver: Mapped["Users"] = relationship(
        "Users", foreign_keys=[receiver_user_id],
        back_populates="messages_receiver"
    )


class UserFollows(Base):
    __tablename__ = "user_follows"
    # Primärnyckel bestående av båda kolumnerna
    follower_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), primary_key=True, nullable=True)
    followee_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), primary_key=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationer: Den som följer
    follower: Mapped["Users"] = relationship(
        "Users",
        foreign_keys=[follower_user_id],
        back_populates="following"
    )
    # Relationer: Den som blir följd
    followee: Mapped["Users"] = relationship(
        "Users",
        foreign_keys=[followee_user_id],
        back_populates="followers"
    )

    def __repr__(self) -> str:
        return f"<UserFollows follower={self.follower_user_id} followee={self.followee_user_id}>"


class SavedUserRecipes(Base):
    __tablename__ = "saved_user_recipes"
    # Primärnyckel bestående av båda kolumnerna
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    user_recipe_id: Mapped[int] = mapped_column(
        ForeignKey("user_recipes.id", ondelete="CASCADE"), primary_key=True)
    saved_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    
    user: Mapped["Users"] = relationship(
        "Users",
        foreign_keys=[user_id],
        back_populates="user_saving_user_recipes"
    )
    
    user_recipes: Mapped["UserRecipes"] = relationship(
        "UserRecipes",
        foreign_keys=[user_recipe_id],
        back_populates="user_recipe_saved"
    )

    def __repr__(self) -> str:
        return f"<SavedUserRecipes user={self.user_id} recipe={self.user_recipe_id}>"
    
class SavedRecipes(Base):
    __tablename__ = "saved_recipes"
    # Primärnyckel bestående av båda kolumnerna
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    recipe_id: Mapped[int] = mapped_column(
        ForeignKey("recipes.id", ondelete="CASCADE"), primary_key=True)
    saved_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    
    user: Mapped["Users"] = relationship(
        "Users",
        foreign_keys=[user_id],
        back_populates="user_saving_recipes"
    )
    
    recipes: Mapped["Recipes"] = relationship(
        "Recipes",
        foreign_keys=[recipe_id],
        back_populates="recipe_saved"
    )

    def __repr__(self) -> str:
        return f"<SavedRecipes user={self.user_id} recipe={self.recipe_id}>"
    
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    created: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    token: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    user: Mapped["Users"] = relationship("Users", back_populates="reset_tokens")
    used: Mapped[bool] = mapped_column(Boolean, default=False)


class ActivationToken(Base):
    __tablename__ = "activation_tokens"
    created: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    token: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    user: Mapped["Users"] = relationship("Users", back_populates="activation_tokens")
    used: Mapped[bool] = mapped_column(Boolean, default=False)

class SavedItems(Base):
    __tablename__ = "saved_items"
    item: Mapped[str] = mapped_column(String(100))
    size: Mapped[str] = mapped_column(Text)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    user: Mapped["Users"] = relationship(
        back_populates="saved_items"
    )

    def __repr__(self):
        return f"<item={self.item}>"