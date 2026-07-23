from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.active_connections = {}

    async def connect(self, project_id: int, websocket: WebSocket):
        await websocket.accept()

        if project_id not in self.active_connections:
            self.active_connections[project_id] = []

        self.active_connections[project_id].append(websocket)

    def disconnect(self, project_id: int, websocket: WebSocket):

        if project_id in self.active_connections:
            self.active_connections[project_id].remove(websocket)

            if len(self.active_connections[project_id]) == 0:
                del self.active_connections[project_id]

    async def send(self, project_id: int, message: dict):

        if project_id not in self.active_connections:
            return

        for connection in self.active_connections[project_id]:
            await connection.send_json(message)


manager = ConnectionManager()