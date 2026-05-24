from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        pipeline_data = json.loads(pipeline)
    except Exception:
        pipeline_data = {"nodes": [], "edges": []}
        
    nodes = pipeline_data.get('nodes', [])
    edges = pipeline_data.get('edges', [])
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if graph is a DAG using Kahn's algorithm
    adjacency_list = {node['id']: [] for node in nodes}
    in_degree = {node['id']: 0 for node in nodes}
    
    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in adjacency_list and target in adjacency_list:
            adjacency_list[source].append(target)
            in_degree[target] += 1
            
    queue = [node_id for node_id in in_degree if in_degree[node_id] == 0]
    visited_nodes = 0
    
    while queue:
        current = queue.pop(0)
        visited_nodes += 1
        for neighbor in adjacency_list[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
                
    is_dag = (visited_nodes == num_nodes)
    
    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
