# Setup Guide

This guide will help you set up both the frontend and backend components of the Chivalry 2 Leaderboard.

## Prerequisites

- Node.js 16+ installed
- Python 3.8+ installed
- Git installed
- A code editor (VS Code recommended)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd Template
```

2. Create a Python virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

The backend should now be running at `http://localhost:8000`

### Backend Configuration

1. Check the following files for customization:
- `main.py`: Contains the API endpoints and data handling
- `requirements.txt`: Python dependencies

2. Test the API:
```bash
curl http://localhost:8000/api/leaderboard
```

## Frontend Setup

1. Navigate to the frontend directory (root directory)

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend should now be running at `http://localhost:3000`

### Frontend Configuration

1. Key files to check:
- `components/chivalry-leaderboard.tsx`: Main component
- `app/globals.css`: Global styles
- `app/page.tsx`: Page component with data fetching

2. Test the frontend:
- Open browser to `http://localhost:3000`
- Check browser console for any errors
- Verify API connection

## Testing Both Systems

1. Ensure both servers are running:
- Backend on port 8000
- Frontend on port 3000

2. Test features:
- Pagination
- Search functionality
- Region filtering
- Mobile responsiveness
- Player details dialog (mobile)

## Common Issues

1. CORS Errors:
- Check CORS configuration in `main.py`
- Verify API URL in `.env.local`

2. Module not found:
- Run `npm install` again
- Check `package.json` for missing dependencies

3. Python dependencies:
- Activate virtual environment
- Run `pip install -r requirements.txt`

## Development Tips

1. Hot Reload:
- Backend: Uses `--reload` flag with uvicorn
- Frontend: Automatic with Next.js

2. API Testing:
- Use browser dev tools
- Check Network tab for requests
- Verify JSON response format

3. Style Changes:
- Use browser dev tools
- Check Tailwind classes
- Modify `globals.css` for global styles

## Production Preparation

1. Backend:
```bash
# Run without reload flag
uvicorn main:app --host 0.0.0.0 --port 8000
```

2. Frontend:
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Need Help?

1. Check the logs:
- Frontend: Browser console
- Backend: Terminal output

2. Documentation:
- FastAPI: https://fastapi.tiangolo.com/
- Next.js: https://nextjs.org/docs
- TailwindCSS: https://tailwindcss.com/docs

3. File Issues:
- Use GitHub issues
- Provide error messages
- Include steps to reproduce 