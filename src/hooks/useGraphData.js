import { useMemo } from 'react';
import { COLORS, GRAPH_CONFIG } from '../constants/colors';

export const useGraphData = (data) => {
  return useMemo(() => ({
    nodes: data.map(item => ({
      id: item.id,
      name: item.title,
      type: item.type,
      difficulty: item.difficulty || 'Mittel',
      description: item.description || item.source,
      steps: item.steps || [],
      val: GRAPH_CONFIG.NODE_SIZE
    })),
    links: data.flatMap(item => 
      (item.relatedTutorials || item.relatedmodules || []).map(relatedId => ({
        source: item.id,
        target: relatedId,
        color: COLORS.LINK,
        distance: GRAPH_CONFIG.LINK_DISTANCE
      }))
    )
  }), [data]);
}; 