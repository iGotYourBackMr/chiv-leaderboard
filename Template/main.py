from fastapi import FastAPI, Request, Query, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict
import asyncio
import json

app = FastAPI()

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://*.vercel.app",   # Vercel preview deployments
        "https://chivalry2-leaderboard.vercel.app"  # Your production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except:
                continue

manager = ConnectionManager()

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

templates = Jinja2Templates(directory="templates")

def get_rank_tier(elo: int) -> str:
    if elo >= 2000:
        return "Grandmaster"
    elif elo >= 1800:
        return "Diamond"
    elif elo >= 1600:
        return "Gold"
    else:
        return "Bronze"

def enhance_player_data(player: dict) -> dict:
    elo = int(player['elo'])
    faction = 'mason' if int(player['rank']) % 2 == 0 else 'agatha'
    
    return {
        **player,
        'name': player['player'],
        'rankTier': get_rank_tier(elo),
        'faction': faction,
        'winStreak': min(10, 100 - int(player['losses'])),
        'previousRank': int(player['rank']),
        'mainClass': 'Knight',
    }

players = {
    "1": [
        {
                'rank': 1,
                'player': 'Player 1',
                'region': 'eu',
                'elo': '1990',
                'wins': '100',
                'losses': '0',
                'clan': 'ven'
        },
        {
                'rank': 2,
                'player': 'Player 2',
                'region': 'eu',
                'elo': '1980',
                'wins': '100',
                'losses': '1',
                'clan': 'ven'
        },
        {
                'rank': 3,
                'player': 'Player 3',
                'region': 'eu',
                'elo': '1970',
                'wins': '100',
                'losses': '2',
                'clan': 'ven'
        },
        {
                'rank': 4,
                'player': 'Player 4',
                'region': 'eu',
                'elo': '1960',
                'wins': '100',
                'losses': '3',
                'clan': 'ven'
        },
        {
                'rank': 5,
                'player': 'Player 5',
                'region': 'eu',
                'elo': '1950',
                'wins': '100',
                'losses': '4',
                'clan': 'ven'
        },
        {
                'rank': 6,
                'player': 'Player 6',
                'region': 'eu',
                'elo': '1940',
                'wins': '100',
                'losses': '5',
                'clan': 'ven'
        },
        {
                'rank': 7,
                'player': 'Player 7',
                'region': 'eu',
                'elo': '1930',
                'wins': '100',
                'losses': '6',
                'clan': 'ven'
        },
        {
                'rank': 8,
                'player': 'Player 8',
                'region': 'eu',
                'elo': '1920',
                'wins': '100',
                'losses': '7',
                'clan': 'ven'
        },
        {
                'rank': 9,
                'player': 'Player 9',
                'region': 'eu',
                'elo': '1910',
                'wins': '100',
                'losses': '8',
                'clan': 'ven'
        },
        {
                'rank': 10,
                'player': 'Player 10',
                'region': 'eu',
                'elo': '1900',
                'wins': '100',
                'losses': '9',
                'clan': 'ven'
        },
    ],
    "2": [
        {
                'rank': 11,
                'player': 'Player 11',
                'region': 'eu',
                'elo': '1890',
                'wins': '100',
                'losses': '10',
                'clan': 'ven'
        },
        {
                'rank': 12,
                'player': 'Player 12',
                'region': 'eu',
                'elo': '1880',
                'wins': '100',
                'losses': '11',
                'clan': 'ven'
        },
        {
                'rank': 13,
                'player': 'Player 13',
                'region': 'eu',
                'elo': '1870',
                'wins': '100',
                'losses': '12',
                'clan': 'ven'
        },
        {
                'rank': 14,
                'player': 'Player 14',
                'region': 'eu',
                'elo': '1860',
                'wins': '100',
                'losses': '13',
                'clan': 'ven'
        },
        {
                'rank': 15,
                'player': 'Player 15',
                'region': 'eu',
                'elo': '1850',
                'wins': '100',
                'losses': '14',
                'clan': 'ven'
        },
        {
                'rank': 16,
                'player': 'Player 16',
                'region': 'eu',
                'elo': '1840',
                'wins': '100',
                'losses': '15',
                'clan': 'ven'
        },
        {
                'rank': 17,
                'player': 'Player 17',
                'region': 'eu',
                'elo': '1830',
                'wins': '100',
                'losses': '16',
                'clan': 'ven'
        },
        {
                'rank': 18,
                'player': 'Player 18',
                'region': 'eu',
                'elo': '1820',
                'wins': '100',
                'losses': '17',
                'clan': 'ven'
        },
        {
                'rank': 19,
                'player': 'Player 19',
                'region': 'eu',
                'elo': '1810',
                'wins': '100',
                'losses': '18',
                'clan': 'ven'
        },
        {
                'rank': 20,
                'player': 'Player 20',
                'region': 'eu',
                'elo': '1800',
                'wins': '100',
                'losses': '19',
                'clan': 'ven'
        }
    ],
    "3": [
        {
                'rank': 21,
                'player': 'Player 21',
                'region': 'eu',
                'elo': '1790',
                'wins': '100',
                'losses': '20',
                'clan': 'ven'
        },
        {
                'rank': 22,
                'player': 'Player 22',
                'region': 'eu',
                'elo': '1780',
                'wins': '100',
                'losses': '21',
                'clan': 'ven'
        },
        {
                'rank': 23,
                'player': 'Player 23',
                'region': 'eu',
                'elo': '1770',
                'wins': '100',
                'losses': '22',
                'clan': 'ven'
        },
        {
                'rank': 24,
                'player': 'Player 24',
                'region': 'eu',
                'elo': '1760',
                'wins': '100',
                'losses': '23',
                'clan': 'ven'
        },
        {
                'rank': 25,
                'player': 'Player 25',
                'region': 'eu',
                'elo': '1750',
                'wins': '100',
                'losses': '24',
                'clan': 'ven'
        },
        {
                'rank': 26,
                'player': 'Player 26',
                'region': 'eu',
                'elo': '1740',
                'wins': '100',
                'losses': '25',
                'clan': 'ven'
        },
    ],
}


@app.get("/api/leaderboard")
async def read_leaderboard_paginated(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50)
):
    # Flatten all players into a single list
    all_players = []
    for page_players in players.values():
        all_players.extend(page_players)
    
    # Sort players by rank to ensure correct order
    all_players.sort(key=lambda x: int(x['rank']))
    
    # Calculate total count
    total_count = len(all_players)
    
    # Calculate start and end indices for pagination
    start_idx = (page - 1) * page_size
    end_idx = min(start_idx + page_size, total_count)
    
    # Get paginated players and enhance their data
    paginated_players = [enhance_player_data(player) for player in all_players[start_idx:end_idx]]
    
    # Prepare response data
    response_data = {
        "players": paginated_players,
        "pagination": {
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size
        }
    }

    # Broadcast the update to all connected clients
    await manager.broadcast(response_data)
    
    # Return JSON response
    return JSONResponse(content=response_data)


@app.get("/leaderboard/{page}")
async def read_leaderboard(request: Request, page: str):
    page_players = players.get(page, [])
    enhanced_players = [enhance_player_data(player) for player in page_players]
    
    # Return JSON response for API requests
    if "application/json" in request.headers.get("accept", ""):
        return JSONResponse(content={"players": enhanced_players})
    # Return HTML response for browser requests
    return templates.TemplateResponse(
        request=request, name="leaderboard.html", context={"players": enhanced_players}
    )
