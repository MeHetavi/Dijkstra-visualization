from django.shortcuts import render
from django.http import HttpResponse
import json
import heapq
import math

def getFullPaths(path):
    fullPath = {}
    for i in path:
        fullPath[i] = []
        prev = path[i]
        while prev:
            fullPath[i] += prev
            prev = path[prev]
    print(path)

        

def dijkstra(graph,start):
    priority_queue = []
    
    distance = {node: math.inf for node in graph}
    distance[start] = 0
    path = {node: None for node in graph}
    priority_queue = []
    
    heapq.heappush(priority_queue, (0, start))
    node = start

    while priority_queue != []:
        shortest_dist, node = heapq.heappop(priority_queue)
        for reachable in graph[node]:
            if (graph[node][reachable]+shortest_dist) < distance[reachable] :
                path[reachable] = node
                distance[reachable] = graph[node][reachable]+shortest_dist
                heapq.heappush(priority_queue, (distance[reachable], reachable))   
    path = getFullPaths(path)     
    return distance, path

def get_adjacency_list(graph):
    final_graph = {}
    for node in graph['nodes']:
        final_graph[node['data']['id']] = {
            edge['data']['target']: edge['data']['weight']
            for edge in graph['edges'] if edge['data']['source'] == node['data']['id'] 
        }

        final_graph[node['data']['id']] =  {
            **final_graph[node['data']['id']],
            **{
            edge['data']['source']: edge['data']['weight']
            for edge in graph['edges'] if edge['data']['target'] == node['data']['id']
            }
        }
    return final_graph

def graph_view(request):
    if request.method == "POST":
        graph = request.POST.get('graph')
        adjacency_list = get_adjacency_list(json.loads(graph))
        distance, path = dijkstra(adjacency_list,list(adjacency_list.keys())[0])
        return render(request, 'app/graph.html', {'graph_data': graph,'distance':distance,'path':path})

    graph = {
        "nodes": [
            {"data": {"id": "A", "label": "Node A"}},
            {"data": {"id": "B", "label": "Node B"}},
            {"data": {"id": "C", "label": "Node C"}},
        ],
        "edges": [
            {"data": {"source": "A", "target": "B", "weight": 5}},
            {"data": {"source": "B", "target": "C", "weight": 3}},
            {"data": {"source": "C", "target": "A", "weight": 7}}
        ],
    }

    return render(request, 'app/graph.html', {'graph_data': json.dumps(graph)})