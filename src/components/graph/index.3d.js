import { CSS2DRenderer, CSS2DObject } from './CSSRenderer.v0.162.0.js'

// Constants
const NODE_DISTANCE = -120
const NODE_SIZE = 5 // Ratio of node sphere volume (cubic px) per value unit.
const NODE_FOCUS_DISTANCE = 40
const NODE_FOCUS_TIME = 1500
const LINK_TEXT_COLOR = 'lightgray'
const LINK_PARTICLE_MULTIPLE = 0.001
const NODE_LABELER = node => node.id
const NODE_COLORS = (node => {
  return node.group === 0
    ? 'yellow'
    : node.group === 1
      ? 'green'
      : node.group === 2
        ? 'gray'
        : 'white'
})
const LINK_LABELER = link => link.description

const selectedNodes = new Set()

/**
 * My god, this tutorial code is abusively bad
 */
function startGraph () {
  const Graph = ForceGraph3D({
    extraRenderers: [new CSS2DRenderer()]
  })(document.getElementById('graph'))

  // Spread out nodes
  Graph.d3Force('charge').strength(NODE_DISTANCE)

  Graph
    // JSON property to use to determine node groupings
    .nodeAutoColorBy('group')

    // Set the node relative size
    .nodeRelSize(NODE_SIZE)
    
    // Set the CSS color to use for each node
    .nodeColor(NODE_COLORS)

    // Populate node labels with HTML
    .nodeThreeObject(node => {
      const nodeEl = document.createElement('div')
      nodeEl.textContent = NODE_LABELER(node)
      nodeEl.style.color = 'white'
      nodeEl.className = 'node-label'
      return new CSS2DObject(nodeEl)
    })
    .nodeThreeObjectExtend(true)

    // Populate links with HTML
    .linkThreeObjectExtend(true)
    .linkThreeObject(link => {
      // extend link with text sprite
      const nodeEl = document.createElement('div')
      nodeEl.textContent = LINK_LABELER(link)
      nodeEl.style.color = LINK_TEXT_COLOR
      nodeEl.className = 'link-label'
      return new CSS2DObject(nodeEl)
    })
    .linkPositionUpdate((sprite, { start, end }) => {
      const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
        [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
      })))

      // Position sprite
      Object.assign(sprite.position, middlePos)
    })

    // Focus on node upon click
    // Focus on node
    .onNodeClick((node, event) => {
      // Aim at node from outside it
      const distance = NODE_FOCUS_DISTANCE
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z)

      const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: distance } // special case if node is in (0,0,0)

      Graph.cameraPosition(
        newPos, // new position
        node, // lookAt ({ x, y, z })
        NODE_FOCUS_TIME  // ms transition duration
      );

      // TODO allow for select without zoom
      if (event.ctrlKey || event.shiftKey || event.altKey) { // multi-selection
        selectedNodes.has(node) ? selectedNodes.delete(node) : selectedNodes.add(node)
      } else { // single-selection
        const untoggle = selectedNodes.has(node) && selectedNodes.size === 1
        selectedNodes.clear()
        !untoggle && selectedNodes.add(node)
      }

      // Update color of selected nodes
      Graph.nodeColor(Graph.nodeColor()) 
    })

    // Multi-select
    .onNodeDrag((node, translate) => {
      if (selectedNodes.has(node)) {
        // moving a selected node
        [...selectedNodes]
          // don't touch node being dragged
          .filter(selNode => selNode !== node) 
          .forEach(node => ['x', 'y', 'z']
            // translate other nodes by same amount
            .forEach(coord => node[`f${coord}`] = node[coord] + translate[coord])
          ) 
      }
    })
    .onNodeDragEnd(node => {
      if (selectedNodes.has(node)) {
        // finished moving a selected node
        [...selectedNodes]
          // don't touch node being dragged
          .filter(selNode => selNode !== node) 
          .forEach(node => ['x', 'y', 'z']
            // unfix controlled nodes
            .forEach(coord => node[`f${coord}`] = undefined)
          ) 
      }
    })

  // Link particles
  .linkDirectionalParticles("value")
  .linkDirectionalParticleSpeed(d => d.value * LINK_PARTICLE_MULTIPLE)

  return Graph
}

/**
 *
 */
window.addEventListener('load', function() {
  const Graph = startGraph()
  const { nodes, links } = Graph.graphData()
  
  /**
   * 
   */
  function sendMessage(message) {
    window.parent.postMessage(JSON.stringify(message), '*')
  }

  /**
   *
   */
  window.addEventListener('message', function(event) {
    // Ensure the message is from the parent window
    console.log(event.data)
    if (event.source === window.parent) {
        const graphMessage = JSON.parse(event.data)
        const { nodes, links } = Graph.graphData()
        const newNodes = (graphMessage.nodes || [])
        const newLinks = (graphMessage.links || [])

        switch(graphMessage.action) {
          case 'populate':
            Graph.graphData({
              nodes: newNodes,
              links: newLinks
            })
            break

          case 'reset':
            Graph.graphData({
              nodes: [],
              links: []
            })
            break

          case 'add':
            const mergedNodes = [...nodes, ...newNodes]
            const mergedLinks = [...links, ...newLinks]
            Graph.graphData({
              nodes: mergedNodes,
              links: mergedLinks
            })
            break

          case 'select':

            break

          case 'complete':

            break
        }
        sendMessage({
          spaceId: graphMessage.spaceId,
          action: 'complete',
          id: graphMessage.id
        })
    }
  })  
})
