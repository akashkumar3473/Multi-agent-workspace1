from pydantic import BaseModel


from typing import Optional
from pydantic import BaseModel

class ChatMessageRequest(BaseModel):
    message: str
    project_id: Optional[int] = None