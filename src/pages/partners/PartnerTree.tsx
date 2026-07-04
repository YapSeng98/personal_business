import { useMemo, useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ReactFlow, Background, Controls, MiniMap, type Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ArrowLeft, GitBranch } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getPartners, deletePartner, updatePartner } from '../../services/servicenow'
import type { Partner } from '../../types'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import PartnerForm from './PartnerForm'
import PartnerDetail from './PartnerDetail'
import PartnerNode from './PartnerNode'
import { buildPartnerGraph, applyDagreLayout } from '../../lib/graphLayout'

const nodeTypes = { partnerNode: PartnerNode }

export default function PartnerTree() {
  const { credentials } = useAuth()
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editPartner, setEditPartner] = useState<Partner | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: () => getPartners(credentials!),
    enabled: !!credentials,
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Partner> }) => updatePartner(credentials!, id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partners'] }); setModalOpen(false); setEditPartner(null) },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deletePartner(credentials!, id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partners'] }); setSelectedId(null) },
  })

  const { nodes, edges } = useMemo(() => {
    const { nodes: rawNodes, edges } = buildPartnerGraph(partners)
    const nodes = applyDagreLayout(rawNodes, edges)
    return { nodes, edges }
  }, [partners])

  const selectedPartner = selectedId ? partners.find(p => p.sys_id === selectedId) ?? null : null
  const selectedIdx = selectedPartner ? partners.findIndex(p => p.sys_id === selectedId) : -1

  const handlePrev = useCallback(() => {
    if (selectedIdx > 0) setSelectedId(partners[selectedIdx - 1].sys_id)
  }, [selectedIdx, partners])

  const handleNext = useCallback(() => {
    if (selectedIdx < partners.length - 1) setSelectedId(partners[selectedIdx + 1].sys_id)
  }, [selectedIdx, partners])

  useEffect(() => {
    document.body.style.overflow = selectedPartner ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedPartner])

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => setSelectedId(node.id), [])

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/partners" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Back to Partners
        </Link>
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-brand-600" /> Relationship Tree
        </h2>
        <span className="text-sm text-slate-400 ml-auto">
          Solid = sponsor link · Dashed = partner's partner
        </span>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : partners.length === 0 ? (
        <div className="card">
          <EmptyState icon={GitBranch} title="No partners yet" description="Add partners first to see the relationship tree." />
        </div>
      ) : (
        <div className="card p-0 overflow-hidden flex-1 min-h-[560px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={20} />
            <Controls />
            <MiniMap pannable zoomable className="!bg-slate-50" />
          </ReactFlow>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditPartner(null) }} title="Edit Partner" size="lg">
        <PartnerForm
          initial={editPartner ?? undefined}
          partners={partners}
          onSubmit={data => editPartner && updateMut.mutate({ id: editPartner.sys_id, data })}
          onCancel={() => { setModalOpen(false); setEditPartner(null) }}
          loading={updateMut.isPending}
        />
      </Modal>

      {selectedPartner && (
        <PartnerDetail
          partner={selectedPartner}
          onClose={() => setSelectedId(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < partners.length - 1}
          index={selectedIdx}
          total={partners.length}
          onEdit={() => { setEditPartner(selectedPartner); setModalOpen(true); setSelectedId(null) }}
          onDelete={() => { if (confirm('Delete this partner?')) deleteMut.mutate(selectedPartner.sys_id) }}
        />
      )}
    </div>
  )
}
