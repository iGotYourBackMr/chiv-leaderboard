# Chivalry 2 Leaderboard

A modern, responsive leaderboard interface for Chivalry 2, built with Next.js and FastAPI.

## Features

- Real-time player rankings with ELO system
- Interactive particle network background
- Faction-based styling (Mason/Agatha)
- Mobile-responsive design with detailed player view
- Rank tiers with visual indicators
- Region filtering and search functionality
- Pagination with customizable items per page

## Tech Stack

### Frontend
- Next.js 13+ (App Router)
- TailwindCSS
- TypeScript
- WebSocket for real-time updates

### Backend
- Python 3.8+
- FastAPI
- WebSocket support
- Uvicorn for serving

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/chivalry2-leaderboard.git
cd chivalry2-leaderboard
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

4. Set up Python environment:
```bash
cd Template
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

5. Run the development servers:

Backend:
```bash
cd Template
uvicorn main:app --reload --port 8000
```

Frontend:
```bash
npm run dev
```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_WS_URL`: Your backend WebSocket URL
4. Deploy!

### Backend (Choose one)

#### Heroku
1. Create a new Heroku app
2. Add Python buildpack
3. Configure environment variables
4. Deploy using Heroku CLI or GitHub integration

#### DigitalOcean
1. Create a new App Platform app
2. Connect to your GitHub repository
3. Configure environment variables
4. Deploy

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://your-api-url
NEXT_PUBLIC_WS_URL=ws://your-websocket-url
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details