import { PolygonMesh } from "../../../../types/Drawing";

function floodFill(
  vertex_id: number,
  edges: PolygonMesh["edges"],
  visited: { [id: number]: boolean }
) {
  visited[vertex_id] = true;

  const adjacent_edges = edges.filter(
    (edge) => edge.startID === vertex_id || edge.endID === vertex_id
  );

  // initialize a component
  const members = [vertex_id];

  // go through all adjacent edges and traverse them
  for (let edge of adjacent_edges) {
    const next_vertex_id =
      edge.startID === vertex_id ? edge.endID : edge.startID;

    //dont add the same vertex twice
    if (visited[next_vertex_id]) {
      continue;
    }

    // traverse all edges and combine them
    const new_memvers = floodFill(next_vertex_id, edges, visited);
    members.push(...new_memvers);
  }

  return members;
}

function findEdgeOfGraph(
  vertex_id: number,
  edges: PolygonMesh["edges"],
  visited: { [id: number]: boolean }
): number {
  visited[vertex_id] = true;

  const adjacent_edges = edges.filter(
    (edge) => edge.startID === vertex_id || edge.endID === vertex_id
  );

  // found an edge
  if (adjacent_edges.length === 1) {
    return vertex_id;
  }

  // go through all adjacent edges and traverse them
  for (let edge of adjacent_edges) {
    const next_vertex_id =
      edge.startID === vertex_id ? edge.endID : edge.startID;

    // dont go back
    if (visited[next_vertex_id]) {
      continue;
    }

    // recursively traverse
    const edge_id = findEdgeOfGraph(next_vertex_id, edges, visited);
    if (edge_id) {
      return edge_id;
    }
  }

  // loop detected, so just start somewhere
  return vertex_id;
}

export function calculateConnectedComponents(drawing: PolygonMesh) {
  let connectedComponents: { [id: number]: number[] } = {};
  const visited: { [id: number]: boolean } = {};

  let group_number = 0;
  for (let vertex of drawing.vertices) {
    if (visited[vertex.id]) {
      continue;
    }
    const edge_id = findEdgeOfGraph(vertex.id, drawing.edges, {});
    const connected_components = floodFill(edge_id, drawing.edges, visited);
    connectedComponents[group_number] = connected_components;
    group_number++;
  }

  return connectedComponents;
}
