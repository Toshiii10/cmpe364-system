from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class Record(Base):
    __tablename__ = "records"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    requester_name: Mapped[str] = mapped_column(String(100), nullable=False, default="Anonymous")
    concern: Mapped[str] = mapped_column(String(50), nullable=False, default="General")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="open")