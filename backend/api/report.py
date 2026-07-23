from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database.database import get_db
from models.agent_output import AgentOutput

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

router = APIRouter(
    prefix="/report",
    tags=["Report"]
)

@router.get("/{project_id}")
def generate_report(
    project_id: int,
    db: Session = Depends(get_db)
):

    outputs = db.query(AgentOutput).filter(
    AgentOutput.project_id == project_id
).all()

    filename = f"project_{project_id}.pdf"

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            f"Project Report #{project_id}",
            styles["Title"]
        )
    )

    content.append(Spacer(1, 20))

    for output in outputs:

        content.append(
            Paragraph(
                output.agent_name,
                styles["Heading2"]
            )
        )

        content.append(
            Paragraph(
                output.output,
                styles["BodyText"]
            )
        )

        content.append(Spacer(1, 15))

    doc.build(content)

    return FileResponse(
        filename,
        filename=filename,
        media_type="application/pdf"
    )