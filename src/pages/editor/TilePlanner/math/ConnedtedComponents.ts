import { PolygonMesh } from "../../../../types/Drawing";

function floodFill(
  vertex_id: number,
  edges: PolygonMesh["edges"],
  visited: { [id: number]: boolean }
) {
  if (visited[vertex_id]) {
    return [];
  }
  visited[vertex_id] = true;

  const adjacent_edges = edges.filter(
    (edge) => edge.startID === vertex_id || edge.endID === vertex_id
  );

  const members = [vertex_id];

  for (let edge of adjacent_edges) {
    const next_vertex_id =
      edge.startID === vertex_id ? edge.endID : edge.startID;

    const new_memvers = floodFill(next_vertex_id, edges, visited);
    members.push(...new_memvers);
  }

  return members;
}

function traverseUntilEdge(
  vertex_id: number,
  edges: PolygonMesh["edges"],
  visited: { [id: number]: boolean }
): number {
  if (visited[vertex_id]) {
    return vertex_id;
  }
  visited[vertex_id] = true;

  const adjacent_edges = edges.filter(
    (edge) => edge.startID === vertex_id || edge.endID === vertex_id
  );

  if (adjacent_edges.length === 1) {
    return vertex_id;
  }

  for (let edge of adjacent_edges) {
    const next_vertex_id =
      edge.startID === vertex_id ? edge.endID : edge.startID;

    const edge_id = traverseUntilEdge(next_vertex_id, edges, visited);
    if (edge_id) {
      return edge_id;
    }
  }

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
    const edge_id = traverseUntilEdge(vertex.id, drawing.edges, {});
    const connected_components = floodFill(edge_id, drawing.edges, visited);
    connectedComponents[group_number] = connected_components;
    group_number++;
  }

  return connectedComponents;
}
