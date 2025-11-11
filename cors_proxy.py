#!/usr/bin/env python3
"""
CORS proxy server for Nigeria Pathwise Agent
Proxies requests from frontend to the agent backend
Configured for Render deployment
"""
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__)

# Configure CORS with specific origins for production
allowed_origins = [
    'https://pathwise-chi.vercel.app',  # Your production frontend
    'http://localhost:3000',  # Local development
    'http://localhost:5173',  # Vite dev server
    'http://localhost:8080',  # Alternative local port
]

CORS(app, 
     origins=allowed_origins,
     allow_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

# Get agent URL from environment variable (for Render) or use default
AGENT_BASE_URL = os.getenv('AGENT_BASE_URL', 'http://localhost:8000')

@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def proxy(path):
    """Proxy requests to your delivery agent"""
    
    if request.method == 'OPTIONS':
        # Handle preflight requests
        response = Response()
        origin = request.headers.get('Origin')
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
    
    url = f"{AGENT_BASE_URL}/{path}"
    
    try:
        # Forward the request to your agent
        if request.method == 'GET':
            resp = requests.get(url, params=request.args, timeout=180)
        else:
            resp = requests.post(url, 
                               json=request.get_json() if request.is_json else None,
                               data=request.get_data() if not request.is_json else None,
                               headers={'Content-Type': 'application/json'},
                               timeout=180)
        
        # Return the response
        response = Response(
            resp.content,
            status=resp.status_code,
            headers=dict(resp.headers)
        )
        
        # Add CORS headers
        origin = request.headers.get('Origin')
        if origin in allowed_origins:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
        
    except Exception as e:
        return jsonify({"error": f"Proxy error: {str(e)}"}), 500

@app.route('/test')
def test():
    """Test endpoint"""
    return jsonify({
        "status": "CORS proxy server is running", 
        "agent_url": AGENT_BASE_URL,
        "environment": "production" if "render.com" in AGENT_BASE_URL else "development"
    })

@app.route('/health')
def health():
    """Health check endpoint for Render"""
    try:
        # Try to ping the agent backend
        resp = requests.get(f"{AGENT_BASE_URL}/health", timeout=5)
        if resp.status_code == 200:
            return jsonify({"status": "healthy", "agent_status": "connected"}), 200
    except:
        pass
    
    return jsonify({"status": "healthy", "agent_status": "disconnected"}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    host = os.getenv('HOST', '0.0.0.0')
    
    print(f"🚀 CORS Proxy Server starting...")
    print(f"📡 Proxying requests from http://{host}:{port}/api/* to {AGENT_BASE_URL}/*")
    print(f"🔧 Test the proxy: http://{host}:{port}/test")
    print(f"❤️  Health check: http://{host}:{port}/health")
    
    app.run(host=host, port=port, debug=False)
