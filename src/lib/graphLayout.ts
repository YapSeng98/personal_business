import dagre from '@dagrejs/dagre'
import { MarkerType, type Node, type Edge } from '@xyflow/react'
import type { Partner } from '../types'

const NODE_WIDTH = 220
const NODE_HEIGHT = 88

export function buildPartnerGraph(partners: Partner[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = partners.map(p => ({
    id: p.sys_id,
    type: 'partnerNode',
    data: { partner: p, unassigned: !p.u_sponsor },
    position: { x: 0, y: 0 },
  }))

  const edges: Edge[] = []

  partners.forEach(p => {
    if (p.u_sponsor) {
      edges.push({
        id: `sponsor-${p.u_sponsor}-${p.sys_id}`,
        source: p.u_sponsor,
        target: p.sys_id,
        type: 'smoothstep',
        style: { stroke: '#4f46e5', strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#4f46e5' },
      })
    }
  })

  const seenPairs = new Set<string>()
  partners.forEach(p => {
    if (p.u_partner_of) {
      const pairKey = [p.sys_id, p.u_partner_of].sort().join('::')
      if (seenPairs.has(pairKey)) return
      seenPairs.add(pairKey)
      edges.push({
        id: `partnerof-${pairKey}`,
        source: p.sys_id,
        target: p.u_partner_of,
        type: 'straight',
        style: { stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' },
      })
    }
  })

  return { nodes, edges }
}

export function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 90 })

  nodes.forEach(n => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }))
  edges.forEach(e => {
    if (e.id.startsWith('sponsor-')) g.setEdge(e.source, e.target)
  })

  dagre.layout(g)

  return nodes.map(n => {
    const pos = g.node(n.id)
    return pos
      ? { ...n, position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 } }
      : n
  })
}
