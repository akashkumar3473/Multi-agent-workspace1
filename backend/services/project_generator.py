from pathlib import Path
from services.file_generator import generate_file

class ProjectGenerator:

    def __init__(self, project_name: str):
        self.project_name = project_name

        self.root = Path("generated_projects") / project_name

    def create_structure(self):

        folders = [

            self.root,

            self.root / "frontend",

            self.root / "backend",

            self.root / "backend" / "routes",

            self.root / "backend" / "services",

            self.root / "backend" / "database",

            self.root / "docs",

        ]
        

        for folder in folders:
            folder.mkdir(parents=True, exist_ok=True)

        return self.root
    
    def write_file(self, relative_path: str, content: str):

        file_path = self.root / relative_path

        file_path.parent.mkdir(parents=True, exist_ok=True)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)